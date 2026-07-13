# Legacy TRON MRG (TRC20)

This folder holds the **original TRC20-compatible** `MRGToken.sol` for historical reference and migration proofs.

**Production MergeOS payouts and bounty credits use Solana** (`mergeos_mrg` Anchor program + SPL mint). Do not deploy this Solidity contract as the primary MRG economy.

## Token snapshot

| Field | Value |
| --- | --- |
| Name | MergeOS |
| Symbol | MRG |
| Standard | TRC20-compatible |
| Decimals | 18 |
| Source | `MRGToken.sol` |

## Migration

On Solana, link a legacy TRC20 (or EVM) address to a Solana wallet via:

```text
register_legacy_wallet(legacy_chain, legacy_address_hash, solana_wallet)
```

PDA seeds:

```text
["wallet-migration", "trc20"|"evm", <32-byte address hash>]
```

See root [README.md](../../README.md) and [docs/DEPLOY.md](../../docs/DEPLOY.md).
