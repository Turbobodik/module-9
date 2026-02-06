const hre = require("hardhat");
const { isAddress } = require("ethers");

async function main() {
  const contractAddress = (process.env.CHARACTERS_CONTRACT || "").trim();
  const student = (process.env.STUDENT || "").trim();

  if (!contractAddress || !student) {
    throw new Error("Missing env vars: CHARACTERS_CONTRACT, STUDENT");
  }
  if (!isAddress(contractAddress)) throw new Error(`Invalid CHARACTERS_CONTRACT: "${contractAddress}"`);
  if (!isAddress(student)) throw new Error(`Invalid STUDENT: "${student}"`);

  const contract = await hre.ethers.getContractAt("GameCharacterCollectionERC1155", contractAddress);

  console.log("Contract:", contractAddress);
  console.log("Student:", student);
  console.log("\nCharacter Balances:");

  for (let id = 1; id <= 10; id++) {
    const balance = await contract.balanceOf(student, id);
    if (balance > 0n) {
      const uri = await contract.uri(id);
      console.log(`  ID ${id}: ${balance.toString()} (URI: ${uri})`);
    }
  }
}

main().catch((err) => {
  console.error(err);
  process.exitCode = 1;
});
