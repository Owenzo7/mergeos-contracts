# Solana workspace (`mergeos_mrg`)

Anchor program for the **MergeOS MRG** token economy on Solana.

| Item | Value |
| --- | --- |
| Program crate | `programs/mergeos-mrg` |
| Module | `mergeos_mrg` |
| Localnet program id | `4gUBWum3fGKfm7BeGXryzXjPDBDLfhVJRcjN5MPnfDNW` |
| IDL | [`idl/mergeos_mrg.json`](idl/mergeos_mrg.json) |
| Proof manifest | [`mergeos_mrg.proof-manifest.v1.json`](mergeos_mrg.proof-manifest.v1.json) |
| Anchor | `0.30.1` |

## Instructions

| Instruction | Purpose |
| --- | --- |
| `initialize_treasury` | Store treasury authority, MRG mint, receiver token account, symbol |
| `mint_verified_mrg` | Mint MRG after a verified MergeOS ledger row (`ledger_reference`) |
| `open_escrow` | Lock MRG into project escrow PDA vault |
| `release_payout` | Release MRG from escrow to worker + write payout receipt |
| `register_legacy_wallet` | Link hashed TRC20/EVM wallet → Solana wallet |

## PDA seeds

```text
["treasury"]
["escrow", project_id_bytes]
["payout", payout_id_bytes]
["wallet-migration", legacy_chain, legacy_address_hash_bytes]
```

The wallet-migration third seed is **raw 32 bytes**, not UTF-8 hex.

## Local commands

```powershell
# From this directory (needs Solana CLI + Anchor)
anchor build
anchor test

# Static IDL / source guards (no Anchor required) — prefer repo root:
# npm test
node --test test/idl.test.js
```

## Backend env (after deploy)

| Variable | Meaning |
| --- | --- |
| `MRG_SOLANA_PROGRAM_ID` | Deployed `mergeos_mrg` program id |
| `CRYPTO_TOKEN_CONTRACT` | MRG SPL mint |
| `CRYPTO_RECEIVER` | Treasury token account |

Public IDL mirror: https://mergeos.shop/contracts/solana/mergeos_mrg.v1.idl.json

See also [docs/DEPLOY.md](../docs/DEPLOY.md) and the root [README.md](../README.md).
