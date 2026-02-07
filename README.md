# NFT Contracts: Soulbound Visit Card (ERC-721) + Game Characters (ERC-1155)

Solidity 0.8.20 contracts built on OpenZeppelin with IPFS metadata.

## Deliverables
- `contracts/SoulboundVisitCardERC721.sol`
- `contracts/GameCharacterCollectionERC1155.sol`
- `scripts/` (deploy, mint, demo, checks)
- `README.md` (deploy, mint, metadata, proof)

## Metadata (IPFS)
- ERC-721: `metadata/erc721/visit-card.json`
  - `image` + attributes like `studentName`, `studentID`, `course`, `year`.
- ERC-1155: `metadata/erc1155/1.json` … `10.json`
  - `image` + attributes like `class`, `element`, `speed`, `strength`, `rarity`.
- Token URIs
  - ERC-721: `ipfs://<cid>/visit-card.json`
  - ERC-1155: `ipfs://<cid>/<id>.json`

## Deploy (Optimism Sepolia)
```bash
npm install
npx hardhat compile
```

```bash
export OPTIMISM_SEPOLIA_URL="https://sepolia.optimism.io"
export PRIVATE_KEY="<deployer_private_key>"
export CHARACTER_CID="<ipfs_cid_for_erc1155_json>"
```

```bash
npx hardhat run scripts/deploy-visit-card.js --network optimismSepolia
CHARACTER_CID=<cid> npx hardhat run scripts/deploy-characters.js --network optimismSepolia
```

## Mint
Soulbound visit card (owner only):
```bash
VISIT_CARD_CONTRACT=<address> STUDENT=<address> TOKEN_URI=ipfs://<cid>/visit-card.json \
  npx hardhat run scripts/mint-visit-card.js --network optimismSepolia
```

Game characters (batch mint + batch transfer):
```bash
CHARACTERS_CONTRACT=<address> STUDENT=<address> IDS=1,2 AMOUNTS=1,1 \
  npx hardhat run scripts/mint-and-transfer-characters.js --network optimismSepolia
```

All-in-one demo:
```bash
STUDENT=<address> VISIT_CARD_CONTRACT=<address> CHARACTERS_CONTRACT=<address> TOKEN_URI=ipfs://<cid>/visit-card.json \
  npx hardhat run scripts/demo.js --network optimismSepolia
```

## Checks
```bash
VISIT_CARD_CONTRACT=<address> STUDENT=<address> \
  npx hardhat run scripts/check-visit-card.js --network optimismSepolia

CHARACTERS_CONTRACT=<address> STUDENT=<address> \
  npx hardhat run scripts/check-characters.js --network optimismSepolia
```

## Proof of Functionality (Optimism Sepolia)
Contracts:
- SoulboundVisitCardERC721: https://sepolia-optimism.etherscan.io/address/0xA615C227840Dfc762629143A1C0e9064C590De23
- GameCharacterCollectionERC1155: https://sepolia-optimism.etherscan.io/address/0xc5b338d6014607A9B5337BAA0f603fB0924af6E9

Student wallet:
- https://sepolia-optimism.etherscan.io/address/0xD8C5A3c26016E1f7E1633Ca60D98416cFf8D7ef6

Transactions:
- ERC-721 mint: https://sepolia-optimism.etherscan.io/tx/0xfc5b571ce1ac85ac5c5e0dd5a62a6214b2f68b172e187c6e102db331b4058e86
- ERC-1155 batch mint (10 IDs): https://sepolia-optimism.etherscan.io/tx/0xff08c5af4776d9b2c9cb5dd8466f8cea18b4bc4aa869e29ff1600490f4b7475e
- ERC-1155 batch transfer (IDs 1,2): https://sepolia-optimism.etherscan.io/tx/0x62e31385f4b475427c18508eabb789a4d4b8f4bb5f3789bcc649f4a20b2288dd
