const hre = require("hardhat");

const CHARACTER_CID = process.env.CHARACTER_CID;

if (!CHARACTER_CID) {
  throw new Error("Missing env var: CHARACTER_CID");
}

const CHARACTER_URIS = Array.from({ length: 10 }, (_, i) => `ipfs://${CHARACTER_CID}/${i + 1}.json`);

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

  const Contract = await hre.ethers.getContractFactory("GameCharacterCollectionERC1155");
  const contract = await Contract.deploy(CHARACTER_URIS);
  await contract.waitForDeployment();

  console.log("GameCharacterCollectionERC1155:", addressLink(explorer, await contract.getAddress()));
}

main().catch((err) => {
  console.error(err);
  process.exitCode = 1;
});


