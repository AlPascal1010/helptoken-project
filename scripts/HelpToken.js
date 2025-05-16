// helptoken.js
require("dotenv").config();
const { ethers } = require("ethers");
const readline = require("readline");

// === Setup ===
const ABI = [
  "function updateMetadata(string newImage, string newDescription) external",
  "function getMetadata() view returns (string image, string description)",
  "function balanceOf(address) view returns (uint256)",
  "function transfer(address recipient, uint256 amount) returns (bool)"
];

const provider = new ethers.providers.JsonRpcProvider(process.env.RPC_URL);
const signer = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
const contract = new ethers.Contract(process.env.CONTRACT_ADDRESS, ABI, signer);

// === CLI UI ===
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function prompt(q) {
  return new Promise((res) => rl.question(q, res));
}

async function getMetadata() {
  const [image, desc] = await contract.getMetadata();
  console.log("\n📦 Metadata:");
  console.log("🖼️ Image:", image);
  console.log("📝 Description:", desc);
}

async function updateMetadata() {
  const newImage = await prompt("Enter new image URL: ");
  const newDesc = await prompt("Enter new description: ");
  const tx = await contract.updateMetadata(newImage, newDesc);
  console.log("⏳ Updating metadata...");
  await tx.wait();
  console.log("✅ Metadata updated.");
}

async function checkBalance() {
  const address = await prompt("Enter address to check balance: ");
  const balance = await contract.balanceOf(address);
  console.log(`💰 Balance of ${address}: ${ethers.utils.formatEther(balance)} HELP`);
}

async function transferTokens() {
  const to = await prompt("Enter recipient address: ");
  const amount = await prompt("Enter amount to send: ");
  const tx = await contract.transfer(to, ethers.utils.parseEther(amount));
  console.log("⏳ Sending tokens...");
  await tx.wait();
  console.log(`✅ Sent ${amount} HELP to ${to}`);
}

async function main() {
  console.log("=== HelpToken Interaction ===");
  console.log("1. Get Metadata");
  console.log("2. Update Metadata");
  console.log("3. Check Balance");
  console.log("4. Transfer Tokens");
  console.log("0. Exit");

  const choice = await prompt("Choose an option: ");

  switch (choice.trim()) {
    case "1": await getMetadata(); break;
    case "2": await updateMetadata(); break;
    case "3": await checkBalance(); break;
    case "4": await transferTokens(); break;
    case "0": rl.close(); return;
    default: console.log("❌ Invalid choice");
  }

  rl.close();
}

main().catch((err) => {
  console.error("❌ Error:", err.message);
  rl.close();
});
