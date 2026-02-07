const hre = require("hardhat");

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
  const [deployer] = await hre.ethers.getSigners();
  console.log("Deployer:", addressLink(explorer, deployer.address));

  const Contract = await hre.ethers.getContractFactory("SoulboundVisitCardERC721");
  const contract = await Contract.deploy("Student Visit Card", "SVC");
  await contract.waitForDeployment();

  console.log("SoulboundVisitCardERC721:", addressLink(explorer, await contract.getAddress()));
}

main().catch((err) => {
  console.error(err);
  process.exitCode = 1;
});


