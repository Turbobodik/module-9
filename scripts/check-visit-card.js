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
  const contractAddress = (process.env.VISIT_CARD_CONTRACT || "").trim();
  const student = (process.env.STUDENT || "").trim();
  const txHash = (process.env.TX || "").trim();

  if (!contractAddress || !student) {
    throw new Error("Missing env vars: VISIT_CARD_CONTRACT, STUDENT");
  }
  if (!isAddress(contractAddress)) throw new Error(`Invalid VISIT_CARD_CONTRACT: "${contractAddress}"`);
  if (!isAddress(student)) throw new Error(`Invalid STUDENT: "${student}"`);

  const contract = await hre.ethers.getContractAt("SoulboundVisitCardERC721", contractAddress);

  const bal = await contract.balanceOf(student);
  const tokenId = await contract.tokenOfStudent(student);
  console.log("SoulboundVisitCardERC721:", addressLink(explorer, contractAddress));
  console.log("Student:", addressLink(explorer, student));
  console.log("balanceOf(student):", bal.toString());
  console.log("tokenOfStudent(student):", tokenId.toString());

  if (tokenId !== 0n) {
    const owner = await contract.ownerOf(tokenId);
    const uri = await contract.tokenURI(tokenId);
    console.log("ownerOf(tokenId):", owner);
    console.log("tokenURI(tokenId):", uri);
  }

  if (txHash) {
    if (!/^0x([A-Fa-f0-9]{64})$/.test(txHash)) throw new Error(`Invalid TX hash: "${txHash}"`);
    const receipt = await hre.ethers.provider.getTransactionReceipt(txHash);
    console.log("tx:", txLink(explorer, txHash));
    console.log("TX status:", receipt?.status);
    console.log("TX block:", receipt?.blockNumber);
    const transferTopic = hre.ethers.id("Transfer(address,address,uint256)");
    const transfers = (receipt?.logs || []).filter((l) => l.topics?.[0] === transferTopic);
    console.log("Transfer logs found:", transfers.length);
  }
}

main().catch((err) => {
  console.error(err);
  process.exitCode = 1;
});



