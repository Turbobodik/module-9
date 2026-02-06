const hre = require("hardhat");
const { isAddress } = require("ethers");

async function main() {
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
  console.log("Owner:", owner.address);
  console.log("Minting to student:", student);
  console.log("tokenURI:", tokenUri);

  const contract = await hre.ethers.getContractAt("SoulboundVisitCardERC721", contractAddress);
  const tx = await contract.mintVisitCard(student, tokenUri);
  console.log("mintVisitCard tx:", tx.hash);
  await tx.wait();

  const tokenId = await contract.tokenOfStudent(student);
  console.log("Student tokenId:", tokenId.toString());
}

main().catch((err) => {
  console.error(err);
  process.exitCode = 1;
});


