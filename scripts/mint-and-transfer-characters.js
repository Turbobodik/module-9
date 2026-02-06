const hre = require("hardhat");
const { isAddress, getAddress } = require("ethers");

async function main() {
  const contractAddressRaw = (process.env.CHARACTERS_CONTRACT || "").trim();
  const studentRaw = (process.env.STUDENT || "").trim();
  const idsCsv = process.env.IDS || "1,2";
  const amountsCsv = process.env.AMOUNTS || "1,1";

  if (!contractAddressRaw || !studentRaw) {
    throw new Error("Missing env vars: CHARACTERS_CONTRACT, STUDENT");
  }
  
  let contractAddress, student;
  try {
    if (!isAddress(contractAddressRaw)) {
      throw new Error("Invalid address format");
    }
    contractAddress = getAddress(contractAddressRaw);
  } catch (err) {
    throw new Error(
      `CHARACTERS_CONTRACT is not a valid address: "${contractAddressRaw}". Use: 0xe7f1725e7734ce288f8367e1bb143e90bb3f0512`
    );
  }
  try {
    if (!isAddress(studentRaw)) {
      throw new Error("Invalid address format");
    }
    student = getAddress(studentRaw);
  } catch (err) {
    throw new Error(
      `STUDENT is not a valid address: "${studentRaw}". Use a real 0x... address (no "0x..." placeholder).`
    );
  }

  const ids = idsCsv.split(",").map((x) => Number(x.trim()));
  const amounts = amountsCsv.split(",").map((x) => Number(x.trim()));
  if (ids.length !== amounts.length) {
    throw new Error("IDS and AMOUNTS must have the same length");
  }
  for (let i = 0; i < ids.length; i++) {
    if (!Number.isInteger(ids[i]) || ids[i] <= 0) {
      throw new Error(`Invalid IDS value at index ${i}: "${idsCsv}". Example: IDS=1,7`);
    }
    if (!Number.isInteger(amounts[i]) || amounts[i] <= 0) {
      throw new Error(`Invalid AMOUNTS value at index ${i}: "${amountsCsv}". Example: AMOUNTS=1,1`);
    }
  }

  const [owner] = await hre.ethers.getSigners();
  console.log("Owner:", owner.address);
  console.log("Student:", student);
  console.log("Transfer IDs:", ids);
  console.log("Transfer amounts:", amounts);

  const contract = await hre.ethers.getContractAt("GameCharacterCollectionERC1155", contractAddress);

  if (!(await contract.initialCollectionMinted())) {
    const mintTx = await contract.mintInitialCollection(owner.address);
    console.log("mintInitialCollection tx:", mintTx.hash);
    await mintTx.wait();
  }

  for (let i = 0; i < ids.length; i++) {
    const id = ids[i];
    const ownerBal = await contract.balanceOf(owner.address, id);
    console.log(`Pre-transfer balance ID ${id}: owner=${ownerBal.toString()}`);
    if (ownerBal < BigInt(amounts[i])) {
      throw new Error(
        `Owner has insufficient balance for ID ${id}: have ${ownerBal.toString()}, need ${amounts[i]}`
      );
    }
  }

  const transferTx = await contract.safeBatchTransferFrom(owner.address, student, ids, amounts, "0x");
  console.log("safeBatchTransferFrom tx:", transferTx.hash);
  await transferTx.wait();

  for (let i = 0; i < ids.length; i++) {
    const id = ids[i];
    const ownerBal = await contract.balanceOf(owner.address, id);
    const studentBal = await contract.balanceOf(student, id);
    console.log(`ID ${id}: owner=${ownerBal.toString()} student=${studentBal.toString()}`);
  }
}

main().catch((err) => {
  console.error(err);
  process.exitCode = 1;
});


