import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const here = dirname(fileURLToPath(import.meta.url));
const solanaRoot = join(here, "..");

const sourceIDL = JSON.parse(readFileSync(join(solanaRoot, "idl", "mergeos_mrg.json"), "utf8"));
const proofManifest = JSON.parse(
  readFileSync(join(solanaRoot, "mergeos_mrg.proof-manifest.v1.json"), "utf8"),
);
const programSource = readFileSync(
  join(solanaRoot, "programs", "mergeos-mrg", "src", "lib.rs"),
  "utf8",
);

function instruction(name) {
  const item = sourceIDL.instructions.find((row) => row.name === name);
  assert.ok(item, `missing instruction ${name}`);
  return item;
}

function argNames(item) {
  return item.args.map((arg) => arg.name);
}

function accountNames(item) {
  return item.accounts.map((account) => account.name);
}

test("publishes Solana MRG IDL with public URLs", () => {
  assert.equal(
    sourceIDL.metadata.public_idl_url,
    "https://mergeos.shop/contracts/solana/mergeos_mrg.v1.idl.json",
  );
  assert.equal(
    proofManifest.public_manifest_url,
    "https://mergeos.shop/contracts/solana/mergeos_mrg.proof-manifest.v1.json",
  );
  assert.equal(sourceIDL.address, proofManifest.program_id);
  assert.equal(sourceIDL.metadata.token_symbol, "MRG");
  assert.equal(sourceIDL.metadata.target_chain, "solana");
});

test("declares MRG treasury, escrow, payout, and wallet migration instructions", () => {
  assert.deepEqual(
    sourceIDL.instructions.map((item) => item.name),
    [
      "initializeTreasury",
      "mintVerifiedMrg",
      "openEscrow",
      "releasePayout",
      "registerLegacyWallet",
    ],
  );

  assert.deepEqual(argNames(instruction("mintVerifiedMrg")), ["ledgerReference", "amount"]);
  assert.deepEqual(argNames(instruction("openEscrow")), [
    "projectId",
    "ledgerReference",
    "amount",
  ]);
  assert.deepEqual(accountNames(instruction("openEscrow")), [
    "funder",
    "treasuryConfig",
    "tokenMint",
    "funderTokenAccount",
    "escrowVault",
    "escrowTokenAccount",
    "tokenProgram",
    "systemProgram",
  ]);
  assert.deepEqual(argNames(instruction("releasePayout")), [
    "payoutId",
    "ledgerReference",
    "amount",
  ]);
});

test("guards MRG mint, escrow PDA authority, and payout token accounts", () => {
  assert.deepEqual(sourceIDL.metadata.security_invariants, [
    "mint_verified_mrg requires receiver_token_account.mint == treasury_config.token_mint",
    "open_escrow requires token_mint == treasury_config.token_mint",
    "open_escrow requires funder_token_account.mint == token_mint and funder_token_account.owner == funder",
    "open_escrow requires escrow_token_account.mint == token_mint and escrow_token_account.owner == escrow_vault PDA",
    "release_payout requires escrow_token_account.mint == treasury_config.token_mint and escrow_token_account.owner == escrow_vault PDA",
    "release_payout requires worker_token_account.mint == treasury_config.token_mint",
  ]);

  for (const snippet of [
    "constraint = receiver_token_account.mint == token_mint.key() @ MergeOSError::TokenMintMismatch",
    "#[account(address = treasury_config.token_mint)]",
    "constraint = funder_token_account.mint == token_mint.key() @ MergeOSError::TokenMintMismatch",
    "constraint = funder_token_account.owner == funder.key() @ MergeOSError::TokenAuthorityMismatch",
    "constraint = escrow_token_account.mint == token_mint.key() @ MergeOSError::TokenMintMismatch",
    "constraint = escrow_token_account.owner == escrow_vault.key() @ MergeOSError::TokenAuthorityMismatch",
    "constraint = escrow_token_account.mint == treasury_config.token_mint @ MergeOSError::TokenMintMismatch",
    "constraint = worker_token_account.mint == treasury_config.token_mint @ MergeOSError::TokenMintMismatch",
    "Token account mint does not match the MRG mint",
    "Token account authority does not match the expected PDA or signer",
  ]) {
    assert.ok(programSource.includes(snippet), `program source missing token guard: ${snippet}`);
  }
});

test("keeps wallet migration PDA metadata aligned with protocol helpers", () => {
  assert.deepEqual(sourceIDL.metadata.wallet_migration_pda_seeds, [
    "wallet-migration",
    "legacy_chain",
    "legacy_address_hash_bytes",
  ]);
  assert.match(
    programSource,
    /b"wallet-migration"[\s\S]*legacy_chain\.seed\(\)\.as_bytes\(\)[\s\S]*legacy_address_hash\.as_ref\(\)/,
  );
  assert.match(programSource, /pub enum LegacyChain\s*\{[\s\S]*?Trc20,[\s\S]*?Evm,/);
});

test("proof manifest maps ledger types to Anchor methods", () => {
  const methods = proofManifest.instruction_map.map((row) => row.anchor_method);
  assert.ok(methods.includes("mint_verified_mrg"));
  assert.ok(methods.includes("open_escrow"));
  assert.ok(methods.includes("release_payout"));
  assert.ok(methods.includes("register_legacy_wallet"));
  assert.equal(proofManifest.token_symbol, "MRG");
  assert.equal(proofManifest.target_chain, "solana");
});
