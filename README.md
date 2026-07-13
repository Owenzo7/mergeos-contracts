# MergeOS Contracts

[![Solana](https://img.shields.io/badge/Solana-MRG-9945FF.svg)](https://solana.com/)
[![Anchor](https://img.shields.io/badge/Anchor-0.30.1-blue.svg)](solana/programs/mergeos-mrg/Cargo.toml)
[![Version](https://img.shields.io/badge/version-1.0.0-0E8A16.svg)](package.json)
[![CI](https://github.com/mergeos-bounties/mergeos-contracts/actions/workflows/ci.yml/badge.svg)](https://github.com/mergeos-bounties/mergeos-contracts/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)
[![MergeOS](https://img.shields.io/badge/MergeOS-bounties-5319E7.svg)](https://github.com/mergeos-bounties)

**Public smart-contract home for MergeOS MRG** — Solana/Anchor program for **verified mint**, **project escrow**, **worker payouts**, **treasury config**, and **legacy wallet migration**. Production payouts and bounty credits target **Solana**, not TRON/EVM.

**Product:** [mergeos-bounties/mergeos-contracts](https://github.com/mergeos-bounties/mergeos-contracts) · Platform: [mergeos.shop](https://mergeos.shop/)

---

## Table of contents

- [Highlights](#highlights)
- [Token & program](#token--program)
- [Quick start](#quick-start)
- [Instructions](#instructions)
- [PDA seeds](#pda-seeds)
- [Security invariants](#security-invariants)
- [Deploy](#deploy)
- [Repository layout](#repository-layout)
- [Legacy TRON (TRC20)](#legacy-tron-trc20)
- [Development](#development)
- [MergeOS bounties](#mergeos-bounties)
- [License](#license)

---

## Highlights

| Area | Detail |
| --- | --- |
| **Primary chain** | **Solana** (SPL Token + Anchor) |
| **Program** | `mergeos_mrg` — mint / escrow / payout / migration |
| **Ledger proofs** | Every money move carries a 32-byte `ledger_reference` |
| **IDL + proof manifest** | Checked into repo; mirrored on mergeos.shop |
| **Legacy** | TRC20 Solidity under `legacy/tron/` for migration only |
| **CI** | Node static tests (no Anchor toolchain required) |

---

## Token & program

| Field | Value |
| --- | --- |
| Name | MergeOS |
| Symbol | **MRG** |
| Network | **Solana** |
| Program id (localnet scaffold) | `4gUBWum3fGKfm7BeGXryzXjPDBDLfhVJRcjN5MPnfDNW` |
| IDL | [`solana/idl/mergeos_mrg.json`](solana/idl/mergeos_mrg.json) |
| Proof manifest | [`solana/mergeos_mrg.proof-manifest.v1.json`](solana/mergeos_mrg.proof-manifest.v1.json) |
| Deployed addresses | [`deployments/addresses.json`](deployments/addresses.json) |
| Public IDL | https://mergeos.shop/contracts/solana/mergeos_mrg.v1.idl.json |

> Production must deploy with its own program keypair and fill `deployments/addresses.json` + backend env. Until then, MergeOS keeps `program_ready=false` when `MRG_SOLANA_PROGRAM_ID` is unset.

---

## Quick start

```powershell
git clone https://github.com/mergeos-bounties/mergeos-contracts.git
cd mergeos-contracts
npm test
```

With full Solana tooling:

```powershell
cd solana
anchor build
anchor test
```

---

## Instructions

| Instruction | Purpose |
| --- | --- |
| `initialize_treasury` | Authority, MRG mint, treasury token account, symbol |
| `mint_verified_mrg` | Mint after verified MergeOS ledger funding row |
| `open_escrow` | Lock MRG into project escrow vault (`project_id` bytes32) |
| `release_payout` | Pay worker from escrow; write payout receipt |
| `register_legacy_wallet` | Map hashed TRC20/EVM address → Solana wallet |

### Ledger reference

Derive 32 bytes from MergeOS public ledger `entry_hash` / `public_hash` (or SDK `contractReferenceFromLedger`):

```js
// @mergeos/sdk (platform package)
import { contractReferenceFromLedger, legacyWalletAddressHash } from "@mergeos/sdk";

const reference = contractReferenceFromLedger(publicLedgerEntry, { format: "bytes" });
const legacyHash = legacyWalletAddressHash("trc20", legacyAddress, { format: "bytes" });
```

---

## PDA seeds

```text
["treasury"]
["escrow", project_id_bytes]           // 32 bytes
["payout", payout_id_bytes]            // 32 bytes
["wallet-migration", chain, hash]      // chain = "trc20"|"evm"; hash = raw 32 bytes
```

Do **not** pass a 64-character hex string as UTF-8 for the hash seed.

---

## Security invariants

- All token accounts must use `treasury_config.token_mint`.
- Escrow token account authority = escrow PDA; funder owns funder ATA.
- Mint / escrow / payout emit events with `ledger_reference: [u8; 32]`.
- Legacy wallets stored as hashes only.
- No private keys or deploy secrets in this repository.

Details: [SECURITY.md](SECURITY.md).

---

## Deploy

Step-by-step: **[docs/DEPLOY.md](docs/DEPLOY.md)**.

Backend / ops environment after deploy:

| Variable | Meaning |
| --- | --- |
| `MRG_SOLANA_PROGRAM_ID` | Deployed program id |
| `CRYPTO_TOKEN_CONTRACT` | MRG SPL mint |
| `CRYPTO_RECEIVER` | Treasury receiver token account |

---

## Repository layout

```text
mergeos-contracts/
  solana/                    # Primary: Anchor workspace
    programs/mergeos-mrg/    # Rust program source
    idl/mergeos_mrg.json
    mergeos_mrg.proof-manifest.v1.json
    Anchor.toml
    test/idl.test.js
  deployments/addresses.json # Network addresses (fill after deploy)
  docs/DEPLOY.md
  legacy/tron/MRGToken.sol   # Historical TRC20 only
  test/package.test.js
  package.json
  SECURITY.md
  LICENSE
```

---

## Legacy TRON (TRC20)

The original Solidity token lives at [`legacy/tron/MRGToken.sol`](legacy/tron/MRGToken.sol) (18 decimals, owner mint/burn). It is **not** the production MergeOS payout rail.

Migration path: hash the old address → `register_legacy_wallet` on Solana → see [legacy/tron/README.md](legacy/tron/README.md).

---

## Development

| Command | Purpose |
| --- | --- |
| `npm test` | Static IDL + program + layout tests (CI) |
| `npm run test:idl` | Solana IDL suite only |
| `cd solana && anchor build` | Build `.so` (needs Anchor) |
| `cd solana && anchor test` | Local validator integration |

---

## MergeOS bounties

Star → claim a bounty issue → PR to **master** → MRG **25–200**.  
See [mergeos](https://github.com/mergeos-bounties/mergeos) and [mergeos.shop](https://mergeos.shop/).

---

## License

[MIT](LICENSE) · MergeOS / ThanhTrucSolutions
