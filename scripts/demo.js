const hre = require("hardhat");
const { isAddress, getAddress } = require("ethers");

const DEFAULT_IDS = "1,2";
const DEFAULT_AMOUNTS = "1,1";

function parseAddress(value, envName) {
  const trimmed = (value || "").trim();
  if (!trimmed) return null;
  if (!isAddress(trimmed)) {
    throw new Error(`${envName} is not a valid address: "${trimmed}"`);
  }
  return getAddress(trimmed);
}

function parseCsvNumbers(value, envName) {
  const list = (value || "").split(",").map((x) => Number(x.trim()));
  if (!list.length || list.some((x) => !Number.isInteger(x) || x <= 0)) {
    throw new Error(`Invalid ${envName}: "${value}". Example: ${envName}=1,2`);
  }
  return list;
}

function getVisitCardTokenUri() {
  const tokenUri = (process.env.TOKEN_URI || process.env.VISIT_CARD_TOKEN_URI || "").trim();
  const cid = (process.env.VISIT_CARD_CID || "").trim();
  if (tokenUri) return tokenUri;
  if (cid) return `ipfs://${cid}/visit-card.json`;
  throw new Error("Missing TOKEN_URI (or VISIT_CARD_TOKEN_URI / VISIT_CARD_CID)");
}

function getCharacterUris() {
  const urisRaw = (process.env.CHARACTER_URIS || "").trim();
  const cid = (process.env.CHARACTER_CID || "").trim();

  if (urisRaw) {
    const list = urisRaw.split(",").map((x) => x.trim()).filter(Boolean);
    if (list.length !== 10) {
      throw new Error("CHARACTER_URIS must have exactly 10 comma-separated URIs.");
    }
    return list;
  }
  if (cid) {
    return Array.from({ length: 10 }, (_, i) => `ipfs://${cid}/${i + 1}.json`);
  }
  throw new Error("Missing CHARACTER_CID or CHARACTER_URIS (needed for deployment).");
}

async function deployVisitCard() {
  const Contract = await hre.ethers.getContractFactory("SoulboundVisitCardERC721");
  const contract = await Contract.deploy("Student Visit Card", "SVC");
  await contract.waitForDeployment();
  return contract;
}

async function deployCharacters() {
  const characterUris = getCharacterUris();
  const Contract = await hre.ethers.getContractFactory("GameCharacterCollectionERC1155");
  const contract = await Contract.deploy(characterUris);
  await contract.waitForDeployment();
  return contract;
}

async function main() {
  const student = parseAddress(process.env.STUDENT, "STUDENT");
  if (!student) {
    throw new Error("Missing env var: STUDENT");
  }

  const ids = parseCsvNumbers(process.env.IDS || DEFAULT_IDS, "IDS");
  const amounts = parseCsvNumbers(process.env.AMOUNTS || DEFAULT_AMOUNTS, "AMOUNTS");
  if (ids.length !== amounts.length) {
    throw new Error("IDS and AMOUNTS must have the same length");
  }

  const [owner] = await hre.ethers.getSigners();
  console.log("Owner:", owner.address);
  console.log("Student:", student);

  const visitCardAddress = parseAddress(process.env.VISIT_CARD_CONTRACT, "VISIT_CARD_CONTRACT");
  const charactersAddress = parseAddress(process.env.CHARACTERS_CONTRACT, "CHARACTERS_CONTRACT");

  let visitCard;
  if (visitCardAddress) {
    visitCard = await hre.ethers.getContractAt("SoulboundVisitCardERC721", visitCardAddress);
    console.log("Using existing SoulboundVisitCardERC721:", visitCardAddress);
  } else {
    visitCard = await deployVisitCard();
    console.log("Deployed SoulboundVisitCardERC721:", await visitCard.getAddress());
  }

  let characters;
  if (charactersAddress) {
    characters = await hre.ethers.getContractAt("GameCharacterCollectionERC1155", charactersAddress);
    console.log("Using existing GameCharacterCollectionERC1155:", charactersAddress);
  } else {
    characters = await deployCharacters();
    console.log("Deployed GameCharacterCollectionERC1155:", await characters.getAddress());
  }

  // Mint soulbound visit card (if not minted yet)
  const currentTokenId = await visitCard.tokenOfStudent(student);
  if (currentTokenId === 0n) {
    const tokenUri = getVisitCardTokenUri();
    const mintTx = await visitCard.mintVisitCard(student, tokenUri);
    console.log("mintVisitCard tx:", mintTx.hash);
    await mintTx.wait();
  } else {
    console.log("Visit card already minted. tokenId:", currentTokenId.toString());
  }

  // Mint initial character collection to owner (batch mint)
  if (!(await characters.initialCollectionMinted())) {
    const mintTx = await characters.mintInitialCollection(owner.address);
    console.log("mintInitialCollection tx:", mintTx.hash);
    await mintTx.wait();
  } else {
    console.log("Initial character collection already minted.");
  }

  // Batch transfer selected character IDs to student
  for (let i = 0; i < ids.length; i++) {
    const ownerBal = await characters.balanceOf(owner.address, ids[i]);
    if (ownerBal < BigInt(amounts[i])) {
      throw new Error(
        `Owner has insufficient balance for ID ${ids[i]}: have ${ownerBal.toString()}, need ${amounts[i]}`
      );
    }
  }
  const transferTx = await characters.safeBatchTransferFrom(owner.address, student, ids, amounts, "0x");
  console.log("safeBatchTransferFrom tx:", transferTx.hash);
  await transferTx.wait();

  // Summary checks
  const mintedTokenId = await visitCard.tokenOfStudent(student);
  const visitCardUri = mintedTokenId === 0n ? "" : await visitCard.tokenURI(mintedTokenId);
  console.log("Visit card tokenId:", mintedTokenId.toString());
  if (visitCardUri) console.log("Visit card tokenURI:", visitCardUri);

  console.log("Student character balances:");
  for (let id = 1; id <= 10; id++) {
    const bal = await characters.balanceOf(student, id);
    if (bal > 0n) {
      const uri = await characters.uri(id);
      console.log(`  ID ${id}: ${bal.toString()} (URI: ${uri})`);
    }
  }
}

main().catch((err) => {
  console.error(err);
  process.exitCode = 1;
});
