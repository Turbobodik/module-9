const hre = require("hardhat");

async function main() {
  const contractAddress = process.env.CHARACTERS_CONTRACT;
  const cid = process.env.CHARACTER_CID;

  if (!contractAddress || !cid) {
    throw new Error("Missing env vars: CHARACTERS_CONTRACT, CHARACTER_CID");
  }

  const [owner] = await hre.ethers.getSigners();
  console.log("Owner:", owner.address);
  console.log("Contract:", contractAddress);
  console.log("CID:", cid);

  const contract = await hre.ethers.getContractAt("GameCharacterCollectionERC1155", contractAddress);
 
  for (let id = 1; id <= 10; id++) {
    const newUri = `ipfs://${cid}/${id}.json`;
    const tx = await contract.setTokenURI(id, newUri);
    console.log(`setTokenURI(${id}) tx:`, tx.hash);
    await tx.wait();
  }

  console.log("Done updating URIs for IDs 1..10");
}

main().catch((err) => {
  console.error(err);
  process.exitCode = 1;
});


