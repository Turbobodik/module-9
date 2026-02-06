const hre = require("hardhat");

async function main() {
  const [deployer] = await hre.ethers.getSigners();
  console.log("Deployer:", deployer.address);

  const Contract = await hre.ethers.getContractFactory("SoulboundVisitCardERC721");
  const contract = await Contract.deploy("Student Visit Card", "SVC");
  await contract.waitForDeployment();

  console.log("SoulboundVisitCardERC721 deployed to:", await contract.getAddress());
}

main().catch((err) => {
  console.error(err);
  process.exitCode = 1;
});


