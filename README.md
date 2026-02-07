# NFT Contracts: Soulbound Visit Card (ERC-721) + Game Characters (ERC-1155)

## Deliverables
- `contracts/SoulboundVisitCardERC721.sol`
- `contracts/GameCharacterCollectionERC1155.sol`
- `scripts/` (demo)
- `README.md` (deploy)

## Deploy (Optimism Sepolia)
```bash
npm install
npx hardhat compile
```

All-in-one demo:
```bash
  npx hardhat run scripts/demo.js --network optimismSepolia
```

Here is output from my run
@Turbobodik ➜ /workspaces/module-9 (2b30f09) $ npm run demo

> module-9-nft-contracts@1.0.0 demo
> hardhat run scripts/demo.js --network optimismSepolia

Owner: https://sepolia-optimism.etherscan.io/address/0xC05e953eAc836853d0a7F84B670fAcC3F3caa603
Student: https://sepolia-optimism.etherscan.io/address/0xC05e953eAc836853d0a7F84B670fAcC3F3caa603
SoulboundVisitCardERC721: https://sepolia-optimism.etherscan.io/address/0x0CB08644b53f6b1ec849Cdeb3EBdDd1944d23F35
GameCharacterCollectionERC1155: https://sepolia-optimism.etherscan.io/address/0xED602D6834ec0e4209486fA8d9E462dC89468623
mintVisitCard: https://sepolia-optimism.etherscan.io/tx/0x36e42168b11fd8de0522e6742221eae94c2b9250bef1eeea53dd2d5b6734d8e1
mintInitialCollection: https://sepolia-optimism.etherscan.io/tx/0x85c74c7920e32e41e50bcb986e3274d9c69c596136999ffb480f4db5f21658fa
Transfer skipped: owner and student are the same address.
Visit card tokenId: 1

## Proof of Functionality (Optimism Sepolia)
Contracts:
- SoulboundVisitCardERC721: https://sepolia-optimism.etherscan.io/address/0xA615C227840Dfc762629143A1C0e9064C590De23
- GameCharacterCollectionERC1155: https://sepolia-optimism.etherscan.io/address/0xc5b338d6014607A9B5337BAA0f603fB0924af6E9

Transactions:
- ERC-721 mint: https://sepolia-optimism.etherscan.io/tx/0xfc5b571ce1ac85ac5c5e0dd5a62a6214b2f68b172e187c6e102db331b4058e86
- ERC-1155 batch mint (10 IDs): https://sepolia-optimism.etherscan.io/tx/0xff08c5af4776d9b2c9cb5dd8466f8cea18b4bc4aa869e29ff1600490f4b7475e
- ERC-1155 batch transfer (IDs 1,2): https://sepolia-optimism.etherscan.io/tx/0x62e31385f4b475427c18508eabb789a4d4b8f4bb5f3789bcc649f4a20b2288dd


