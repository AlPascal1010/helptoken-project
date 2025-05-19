require("dotenv").config();
const { ethers } = require("ethers");

// Load provider and signer
const provider = new ethers.JsonRpcProvider(`https://eth-sepolia.g.alchemy.com/v2/${process.env.ALCHEMY_API_KEY}`);
const signer = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
const helpTokenAddress = process.env.HELP_TOKEN_ADDRESS;

// Contract ABI based on your Solidity code
const helpTokenAbi = [
  "function name() view returns (string)",
  "function symbol() view returns (string)",
  "function decimals() view returns (uint8)",
  "function balanceOf(address) view returns (uint)",
  "function imageURL() view returns (string)",
  "function description() view returns (string)",
  "function updateImage(string)",
  "function updateDescription(string)",
  "function transfer(address,uint) returns (bool)",
  "function approve(address,uint) returns (bool)",
  "function allowance(address,address) view returns (uint)"
];

async function main() {
  const args = process.argv.slice(2);
  const contract = new ethers.Contract(helpTokenAddress, helpTokenAbi, signer);
  const me = await signer.getAddress();
  const decimals = await contract.decimals();

  if (args.includes("--info")) {
    const [name, symbol, balance, image, description] = await Promise.all([
      contract.name(),
      contract.symbol(),
      contract.balanceOf(me),
      contract.imageURL(),
      contract.description()
    ]);
    console.log(`Name: ${name}`);
    console.log(`Symbol: ${symbol}`);
    console.log(`Balance: ${ethers.formatUnits(balance, decimals)} HELP`);
    console.log(`Image URL: ${image}`);
    console.log(`Description: ${description}`);
  }

  if (args[0] === "--transfer") {
    const [_, to, amount] = args;
    const tx = await contract.transfer(to, ethers.parseUnits(amount, decimals));
    await tx.wait();
    console.log(`Transferred ${amount} HELP to ${to}`);
  }

  if (args[0] === "--approve") {
    const [_, spender, amount] = args;
    const tx = await contract.approve(spender, ethers.parseUnits(amount, decimals));
    await tx.wait();
    console.log(`Approved ${spender} to spend ${amount} HELP`);
  }

  if (args[0] === "--allowance") {
    const [_, owner, spender] = args;
    const allowance = await contract.allowance(owner, spender);
    console.log(`Allowance: ${ethers.formatUnits(allowance, decimals)} HELP`);
  }
}

main().catch(console.error);
