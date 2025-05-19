// #!/usr/bin/env node
import dotenv from "dotenv";
import inquirer from "inquirer";
import { ethers } from "ethers";

dotenv.config();

// ✅ Validate required environment variables
const requiredEnv = ["HELP_TOKEN_ADDRESS", "PRIVATE_KEY", "ALCHEMY_API_KEY"];
for (const key of requiredEnv) {
  if (!process.env[key]) {
    console.error(`❌ Missing environment variable: ${key}`);
    process.exit(1);
  }
}

const provider = new ethers.JsonRpcProvider(`https://eth-sepolia.g.alchemy.com/v2/${process.env.ALCHEMY_API_KEY}`, { timeout: 60000 });
const signer = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
const helpTokenAddress = process.env.HELP_TOKEN_ADDRESS;

const abi = [
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
  "function allowance(address,address) view returns (uint)",
  "function mint(address,uint)",
  "function burn(uint)",
  "function burnFrom(address,uint)"
];

const contract = new ethers.Contract(helpTokenAddress, abi, signer);

async function main() {
  const me = await signer.getAddress();
  const decimals = await contract.decimals();

  const { action } = await inquirer.prompt([
    {
      type: "list",
      name: "action",
      message: "📘 Select an action:",
      choices: [
        "View Info",
        "Transfer",
        "Approve",
        "Check Allowance",
        "Mint (owner only)",
        "Burn",
        "Burn From",
        "Update Image URL (owner only)",
        "Update Description (owner only)",
        "Exit"
      ]
    }
  ]);

  switch (action) {
    case "View Info": {
      const [name, symbol, balance, image, description] = await Promise.all([
        contract.name(),
        contract.symbol(),
        contract.balanceOf(me),
        contract.imageURL(),
        contract.description()
      ]);
      console.log(`\nName: ${name}`);
      console.log(`Symbol: ${symbol}`);
      console.log(`Balance: ${ethers.formatUnits(balance, decimals)} HELP`);
      console.log(`Image URL: ${image}`);
      console.log(`Description: ${description}`);
      break;
    }

    case "Transfer": {
      const { to, amount } = await inquirer.prompt([
        { name: "to", message: "Recipient address:" },
        { name: "amount", message: "Amount to transfer:" }
      ]);
      const tx = await contract.transfer(to, ethers.parseUnits(amount, decimals));
      await tx.wait();
      console.log(`✅ Transferred ${amount} HELP to ${to}`);
      break;
    }

    case "Approve": {
      const { spender, amount } = await inquirer.prompt([
        { name: "spender", message: "Spender address:" },
        { name: "amount", message: "Amount to approve:" }
      ]);
      const tx = await contract.approve(spender, ethers.parseUnits(amount, decimals));
      await tx.wait();
      console.log(`✅ Approved ${spender} for ${amount} HELP`);
      break;
    }

    case "Check Allowance": {
      const { owner, spender } = await inquirer.prompt([
        { name: "owner", message: "Owner address:" },
        { name: "spender", message: "Spender address:" }
      ]);
      const allowance = await contract.allowance(owner, spender);
      console.log(`Allowance: ${ethers.formatUnits(allowance, decimals)} HELP`);
      break;
    }

    case "Mint (owner only)": {
      const { to, amount } = await inquirer.prompt([
        { name: "to", message: "Address to mint to:" },
        { name: "amount", message: "Amount to mint:" }
      ]);
      const tx = await contract.mint(to, ethers.parseUnits(amount, decimals));
      await tx.wait();
      console.log(`✅ Minted ${amount} HELP to ${to}`);
      break;
    }

    case "Burn": {
      const { amount } = await inquirer.prompt([
        { name: "amount", message: "Amount to burn:" }
      ]);
      const tx = await contract.burn(ethers.parseUnits(amount, decimals));
      await tx.wait();
      console.log(`🔥 Burned ${amount} HELP`);
      break;
    }

    case "Burn From": {
      const { from, amount } = await inquirer.prompt([
        { name: "from", message: "Address to burn from:" },
        { name: "amount", message: "Amount to burn:" }
      ]);
      const tx = await contract.burnFrom(from, ethers.parseUnits(amount, decimals));
      await tx.wait();
      console.log(`🔥 Burned ${amount} HELP from ${from}`);
      break;
    }

    case "Update Image URL (owner only)": {
      const { newURL } = await inquirer.prompt([
        { name: "newURL", message: "New image URL:" }
      ]);
      const tx = await contract.updateImage(newURL);
      await tx.wait();
      console.log(`✅ Image URL updated.`);
      break;
    }

    case "Update Description (owner only)": {
      const { newDesc } = await inquirer.prompt([
        { name: "newDesc", message: "New description:" }
      ]);
      const tx = await contract.updateDescription(newDesc);
      await tx.wait();
      console.log(`✅ Description updated.`);
      break;
    }

    default:
      console.log("👋 Exiting...");
      return;
  }

  console.log("\n");
  main(); // repeat
}

main().catch(console.error);
