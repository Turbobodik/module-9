# NFT Contracts: Soulbound Visit Card (ERC-721) + Game Characters (ERC-1155)

Short reference implementation using OpenZeppelin, Solidity 0.8.20, and Hardhat.

## Contracts
- **SoulboundVisitCardERC721.sol**
  - ERC-721 + URI storage.
  - One token per student, **non-transferable** (transfers + approvals revert).
  - Only owner/admin can mint.
- **GameCharacterCollectionERC1155.sol**
  - ERC-1155 with **10 fixed IDs (1-10)**.
  - Unique URI per ID, normal transfers + approvals.
  - Owner-only batch minting.

## Metadata (IPFS)
- ERC-721 sample: `metadata/erc721/visit-card.json`
  - `image` + attributes like `studentName`, `studentID`, `course`, `year`.
- ERC-1155 samples: `metadata/erc1155/1.json` ... `10.json`
  - `image` + attributes like `class`, `element`, `speed`, `strength`, `rarity`.
- Upload JSON/images to IPFS.
  - ERC-721 token URI: `ipfs://<cid>/visit-card.json`
  - ERC-1155 base: `ipfs://<cid>/<id>.json`

## Quickstart (local Hardhat)
```bash
npm install
npx hardhat compile
npx hardhat node
```

### Deploy
```bash
npm run deploy:erc721:localhost
CHARACTER_CID=<cid> npm run deploy:erc1155:localhost
```

### Mint soulbound visit card (owner only)
```bash
VISIT_CARD_CONTRACT=<addr> STUDENT=<0x...> TOKEN_URI=ipfs://<cid>/visit-card.json \
  npm run mint:erc721:localhost
```

### Mint + batch transfer game characters
```bash
CHARACTERS_CONTRACT=<addr> STUDENT=<0x...> IDS=1,2 AMOUNTS=1,1 \
  npm run mint+transfer:erc1155:localhost
```
This script batch mints IDs 1-10 (1 each) to the owner, then batch transfers `IDS` to the student.

### Update ERC-1155 URIs (optional)
```bash
CHARACTERS_CONTRACT=<addr> CHARACTER_CID=<cid> \
  npm run set:erc1155:uris:opsepolia
```

## Checks (read-only)
```bash
VISIT_CARD_CONTRACT=<addr> STUDENT=<0x...> npm run check:erc721:opsepolia
CHARACTERS_CONTRACT=<addr> STUDENT=<0x...> npm run check:erc1155:opsepolia
```

## Proof (fill after deployment)
- ERC-721 mint tx: `<tx hash>`
- ERC-1155 mintInitialCollection tx: `<tx hash>`
- ERC-1155 batch transfer tx: `<tx hash>`
