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

async function main() {
  const explorer = explorerBase(hre.network.name);
  const contractAddress = (process.env.CHARACTERS_CONTRACT || "").trim();
  const student = (process.env.STUDENT || "").trim();

  if (!contractAddress || !student) {
    throw new Error("Missing env vars: CHARACTERS_CONTRACT, STUDENT");
  }
  if (!isAddress(contractAddress)) throw new Error(`Invalid CHARACTERS_CONTRACT: "${contractAddress}"`);
  if (!isAddress(student)) throw new Error(`Invalid STUDENT: "${student}"`);

  const contract = await hre.ethers.getContractAt("GameCharacterCollectionERC1155", contractAddress);

  console.log("GameCharacterCollectionERC1155:", addressLink(explorer, contractAddress));
  console.log("Student:", addressLink(explorer, student));
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
