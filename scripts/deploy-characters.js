const hre = require("hardhat");

const CHARACTER_CID = process.env.CHARACTER_CID || "REPLACE_WITH_CID";

const CHARACTER_URIS = Array.from({ length: 10 }, (_, i) => `ipfs://${CHARACTER_CID}/${i + 1}.json`);

async function main() {
  const [deployer] = await hre.ethers.getSigners();
  console.log("Deployer:", deployer.address);

  const Contract = await hre.ethers.getContractFactory("GameCharacterCollectionERC1155");
  const contract = await Contract.deploy(CHARACTER_URIS);
  await contract.waitForDeployment();

  console.log("GameCharacterCollectionERC1155 deployed to:", await contract.getAddress());
}

main().catch((err) => {
  console.error(err);
  process.exitCode = 1;
});


