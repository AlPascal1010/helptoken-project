require("dotenv").config();
const { ethers } = require("ethers");

const ABI = [
  "function getMetadata() view returns (string image, string description)"
];

async function main() {
  // Setup provider and signer
  const provider = new ethers.providers.JsonRpcProvider(process.env.RPC_URL);
  const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);

  console.log("🔌 Connected to Alchemy");
  console.log("👛 Wallet Address:", wallet.address);

  // Load contract
  const contract = new ethers.Contract(process.env.CONTRACT_ADDRESS, ABI, wallet);

  // Test read from contract
  const [image, description] = await contract.getMetadata();
  console.log("✅ Contract loaded successfully!");
  console.log("📦 Metadata:");
  console.log("🖼️ Image:", image);
  console.log("📝 Description:", description);
}

main().catch((err) => {
  console.error("❌ Connection or contract error:", err.message);
});
