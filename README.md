# MergeOS Contracts

Smart contract repository for the MergeOS token on TRON.

## Token Overview

| Field | Value |
| --- | --- |
| Token name | MergeOS |
| Symbol | MRG |
| Standard | TRC20-compatible |
| Network | TRON / TVM |
| Decimals | 18 |
| Contract | `contracts/MRGToken.sol` |
| Solidity | `^0.8.0` |
| License | MIT |

`MRGToken` is a self-contained TRC20-compatible token contract. It does not import external libraries, so it can be compiled directly in Tron-IDE, Remix, TronBox, or with `solc`.

## Features

- Standard TRC20 interface:
  - `totalSupply()`
  - `balanceOf(address)`
  - `transfer(address,uint256)`
  - `approve(address,uint256)`
  - `transferFrom(address,address,uint256)`
  - `allowance(address,address)`
- Standard events:
  - `Transfer(address,address,uint256)`
  - `Approval(address,address,uint256)`
- Owner-controlled minting.
- Holder burn and approved burn.
- Ownership transfer and ownership renounce.
- 18-decimal token precision.

## Contract Files

```text
contracts/
  MRGToken.sol
```

## Constructor

```solidity
constructor(uint256 initialSupply)
```

`initialSupply` is provided as whole MRG tokens. The constructor multiplies it by `10 ** decimals` and mints the full amount to the deployer.

Examples:

| Constructor value | Minted supply |
| --- | --- |
| `1000000` | 1,000,000 MRG |
| `1000000000` | 1,000,000,000 MRG |

## Amount Units

TRC20 transfer amounts use the smallest unit, like ERC20. Because MRG has 18 decimals:

```text
1 MRG = 1_000_000_000_000_000_000 base units
```

The constructor is the only function that accepts whole-token supply. Runtime functions such as `transfer`, `approve`, `mint`, `burn`, and `burnFrom` use base units.

Example: to mint 100 MRG after deployment, call:

```text
mint(account, 100000000000000000000)
```

## Compile

With local Solidity compiler:

```powershell
solc --bin --abi contracts/MRGToken.sol
```

The contract has been checked locally with:

```text
solc 0.8.25
```

For Tron-IDE:

1. Open Tron-IDE.
2. Create or import `contracts/MRGToken.sol`.
3. Select a Solidity `0.8.x` compiler compatible with TRON.
4. Compile the contract.
5. Keep the exact compiler and optimization settings for later verification.

## Deploy

Deploy contract `MRGToken` with one constructor argument:

```text
initialSupply: number of whole MRG tokens to mint to the deployer
```

Example for 1 billion MRG:

```text
initialSupply = 1000000000
```

After deployment:

1. Confirm `name()` returns `MergeOS`.
2. Confirm `symbol()` returns `MRG`.
3. Confirm `decimals()` returns `18`.
4. Confirm `owner()` returns the deployer address.
5. Confirm `balanceOf(deployer)` equals `initialSupply * 10 ** 18`.

## Owner Functions

### `mint(address account, uint256 amount)`

Mints `amount` base units to `account`. Only the owner can call this function.

### `transferOwnership(address newOwner)`

Transfers owner privileges to `newOwner`.

### `renounceOwnership()`

Removes the owner permanently by setting owner to the zero address. After this, owner-only minting is disabled forever.

## Burn Functions

### `burn(uint256 amount)`

Burns `amount` base units from the caller.

### `burnFrom(address account, uint256 amount)`

Burns `amount` base units from `account` using the caller's allowance.

## Security Notes

- The owner can mint more tokens until ownership is renounced or transferred to a governance or treasury address.
- Do not renounce ownership until the tokenomics and distribution plan are final.
- Use a secure deployer wallet and back up private keys before deployment.
- Test on Nile or Shasta testnet before deploying to TRON mainnet.
- Verify the deployed contract using the same compiler and optimization settings used for deployment.
- Never commit `.env`, private keys, seed phrases, or deployment secrets. This repository ignores `.env` and `.env.*`.

## Useful Links

- TRON Developer Hub: https://developers.tron.network/
- TRC20 protocol interface: https://developers.tron.network/docs/trc20-protocol-interface
- Tron-IDE: https://www.tronide.io/

## Repository Status

Current tracked contract:

```text
contracts/MRGToken.sol
```

No deployment address is included yet. Add the deployed TRON contract address here after mainnet or testnet deployment.
