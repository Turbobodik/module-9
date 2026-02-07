const hre = require("hardhat");
const { isAddress } = require("ethers");

function explorerBase(networkName) {
  if (networkName === "optimismSepolia") return "https://sepolia-optimism.etherscan.io";
  return "";
}

function link(base, type, value) {
  return base ? `${base}/${type}/${value}` : value;
}

function addressLink(base, address) {
  return link(base, "address", address);
}

function txLink(base, hash) {
  return link(base, "tx", hash);
}

async function main() {
  const explorer = explorerBase(hre.network.name);
  const contractAddress = process.env.VISIT_CARD_CONTRACT;
  const student = process.env.STUDENT;
  const tokenUri = process.env.TOKEN_URI;

  if (!contractAddress || !student || !tokenUri) {
    throw new Error("Missing env vars: VISIT_CARD_CONTRACT, STUDENT, TOKEN_URI");
  }
  if (!isAddress(contractAddress)) {
    throw new Error(
      `VISIT_CARD_CONTRACT is not a valid address: "${contractAddress}". Example: 0x5FbDB2315678afecb367f032d93F642f64180aa3`
    );
  }
  if (!isAddress(student)) {
    throw new Error(
      `STUDENT is not a valid address: "${student}". Use a real 0x... address (no "0x..." placeholder).`
    );
  }

  const [owner] = await hre.ethers.getSigners();
  console.log("Owner:", addressLink(explorer, owner.address));
  console.log("Student:", addressLink(explorer, student));
  console.log("SoulboundVisitCardERC721:", addressLink(explorer, contractAddress));

  const contract = await hre.ethers.getContractAt("SoulboundVisitCardERC721", contractAddress);
  const tx = await contract.mintVisitCard(student, tokenUri);
  console.log("mintVisitCard:", txLink(explorer, tx.hash));
  await tx.wait();

  const tokenId = await contract.tokenOfStudent(student);
  console.log("tokenId:", tokenId.toString());
}

main().catch((err) => {
  console.error(err);
  process.exitCode = 1;
});


