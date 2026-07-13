# Security Policy

## Scope

This repository contains the **MergeOS MRG Solana Anchor program** and a **legacy TRON TRC20** reference token. Security issues in on-chain money movement are high priority.

## Report a vulnerability

Do **not** open a public GitHub issue for exploitable bugs.

Email maintainers via the MergeOS org, or open a private security advisory on:

https://github.com/mergeos-bounties/mergeos-contracts/security/advisories/new

Include:

1. Affected program id / network (localnet, devnet, mainnet)
2. Instruction and accounts involved
3. PoC steps or transaction signatures (no mainnet exploitation)
4. Impact (theft, freeze, mint inflation, wrong PDA, etc.)

## Security invariants (Solana)

- All MRG movement is constrained to `treasury_config.token_mint`.
- `mint_verified_mrg`, `open_escrow`, and `release_payout` require a 32-byte `ledger_reference` for MergeOS ledger reconciliation.
- Escrow and payout records are PDA-backed.
- Legacy TRC20/EVM addresses are stored as **hashes**, not raw strings.
- Never commit deploy keypairs, seed phrases, or `.env` secrets.

## Supported versions

| Component | Status |
| --- | --- |
| `solana/programs/mergeos-mrg` | Active |
| `legacy/tron/MRGToken.sol` | Legacy reference only — not used for MergeOS production payouts |
