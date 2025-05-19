// scripts/interactHelpToken.js
require("dotenv").config();
const { ethers } = require("ethers");

const provider = new ethers.JsonRpcProvider(`https://eth-sepolia.g.alchemy.com/v2/${process.env.ALCHEMY_API_KEY}`);
const signer = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
const helpTokenAddress = process.env.HELP_TOKEN_ADDRESS;

const helpTokenAbi = [
  "function name() view returns (string)",
  "function symbol() view returns (string)",
  "function decimals() view returns (uint8)",
  "function balanceOf(address) view returns (uint)",
  "function imageURL() view returns (string)",
  "function description() view returns (string)",
  "function updateImage(string)",
  "function updateDescription(string)",
  "function transfer(address to, uint amount) returns (bool)",
  "function approve(address spender, uint amount) returns (bool)",
  "function allowance(address owner, address spender) view returns (uint)"
];

async function main() {
  const helpToken = new ethers.Contract(helpTokenAddress, helpTokenAbi, signer);
  const myAddress = await signer.getAddress();

  const name = await helpToken.name();
  const symbol = await helpToken.symbol();
  const decimals = await helpToken.decimals();
  const balance = await helpToken.balanceOf(myAddress);
  const image = await helpToken.imageURL();
  const desc = await helpToken.description();

  console.log(`Token: ${name} (${symbol})`);
  console.log(`Balance: ${ethers.formatUnits(balance, decimals)} HELP`);
  console.log(`Image: ${image}`);
  console.log(`Description: ${desc}`);

  // === Transfer example ===
  const recipient = "0xRecipientAddressHere";
  const transferAmount = ethers.parseUnits("10", decimals);
  // await helpToken.transfer(recipient, transferAmount);
  // console.log(`Transferred 10 HELP to ${recipient}`);

  // === Approve example ===
  const spender = "0xSpenderAddressHere";
  const approveAmount = ethers.parseUnits("50", decimals);
  // await helpToken.approve(spender, approveAmount);
  // console.log(`Approved ${spender} to spend 50 HELP`);

  // === Check allowance example ===
  const allowance = await helpToken.allowance(myAddress, spender);
  console.log(`Allowance for ${spender}: ${ethers.formatUnits(allowance, decimals)} HELP`);
}

main().catch(console.error);
