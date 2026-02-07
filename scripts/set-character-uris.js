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

function txLink(base, hash) {
  return link(base, "tx", hash);
}

async function main() {
  const explorer = explorerBase(hre.network.name);
  const contractAddress = process.env.CHARACTERS_CONTRACT;
  const cid = process.env.CHARACTER_CID;

  if (!contractAddress || !cid) {
    throw new Error("Missing env vars: CHARACTERS_CONTRACT, CHARACTER_CID");
  }

  const [owner] = await hre.ethers.getSigners();
  console.log("Owner:", addressLink(explorer, owner.address));
  console.log("GameCharacterCollectionERC1155:", addressLink(explorer, contractAddress));

  const contract = await hre.ethers.getContractAt("GameCharacterCollectionERC1155", contractAddress);

  for (let id = 1; id <= 10; id++) {
    const newUri = `ipfs://${cid}/${id}.json`;
    const tx = await contract.setTokenURI(id, newUri);
    console.log(`setTokenURI(${id}):`, txLink(explorer, tx.hash));
    await tx.wait();
  }
}

main().catch((err) => {
  console.error(err);
  process.exitCode = 1;
});


