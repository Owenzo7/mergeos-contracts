# Deploy MergeOS MRG on Solana

## Prerequisites

- [Solana CLI](https://docs.solana.com/cli/install-solana-cli-tools)
- [Anchor](https://www.anchor-lang.com/docs/installation) **0.30.x** (matches `anchor-lang = "0.30.1"`)
- Funded wallet for target cluster (`solana config set --url devnet`)

## 1. Build

```powershell
cd solana
anchor build
```

Program id in source:

```text
4gUBWum3fGKfm7BeGXryzXjPDBDLfhVJRcjN5MPnfDNW
```

For production, generate a new program keypair and update:

- `declare_id!(...)` in `programs/mergeos-mrg/src/lib.rs`
- `[programs.*]` in `Anchor.toml`
- `solana/idl/mergeos_mrg.json` → `address`
- `deployments/addresses.json`

## 2. Deploy program

```powershell
anchor deploy --provider.cluster devnet
```

Record the program id → set backend `MRG_SOLANA_PROGRAM_ID`.

## 3. Create SPL mint (MRG)

Use the standard Token Program (or Token-2022 if you standardize on it later):

```powershell
spl-token create-token --decimals 9
spl-token create-account <MINT>
spl-token mint <MINT> <INITIAL_SUPPLY_UI>
```

- **Decimals:** prefer **9** for Solana (not 18).  
- Set mint authority to the **treasury PDA** after `initialize_treasury` if you want only program-controlled minting (advanced).

Update:

- `CRYPTO_TOKEN_CONTRACT` = mint address  
- `CRYPTO_RECEIVER` = treasury token account  

## 4. Initialize treasury

Call `initialize_treasury` with:

| Account | Role |
| --- | --- |
| `authority` | Deployer / ops signer |
| `token_mint` | MRG mint |
| `treasury_token_account` | Treasury ATA |
| `treasury_config` | PDA `["treasury"]` |

Arg: `token_symbol = "MRG"`.

## 5. Ops flow

| Step | Instruction | Ledger types (examples) |
| --- | --- | --- |
| Credit bounty / funding | `mint_verified_mrg` | `token_mint`, `payment_verified` |
| Project reserve | `open_escrow` | `project_reserve`, `task_reserve` |
| Pay worker | `release_payout` | `task_payment` |
| Migrate TRC20/EVM wallet | `register_legacy_wallet` | `wallet_migration` |

Every money-moving instruction takes a **32-byte** `ledger_reference` derived from MergeOS ledger `entry_hash` / `public_hash` (see proof manifest).

## 6. Verify

```powershell
# From repo root — no Anchor required
npm test

# With full toolchain
cd solana
anchor test
```

## 7. Public artifacts

Keep these in sync with https://mergeos.shop :

| Artifact | Path |
| --- | --- |
| IDL | `solana/idl/mergeos_mrg.json` |
| Proof manifest | `solana/mergeos_mrg.proof-manifest.v1.json` |
| Deployed addresses | `deployments/addresses.json` |
