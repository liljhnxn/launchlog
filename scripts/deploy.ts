import hre from "hardhat";
const { ethers } = hre;
import * as fs from "fs";
import * as path from "path";

async function main() {
  console.log("-----------------------------------------");
  console.log("Connecting to network...");

  const [deployer] = await ethers.getSigners();
  if (!deployer) {
    throw new Error("No deployer signer found. Please check PRIVATE_KEY in .env or .env.local.");
  }

  const balance = await ethers.provider.getBalance(deployer.address);
  console.log(`Deployer address: ${deployer.address}`);
  console.log(`Deployer balance: ${ethers.formatEther(balance)} BOHR`);

  console.log("Deploying LaunchLog smart contract...");
  const LaunchLogFactory = await ethers.getContractFactory("LaunchLog");
  const launchLog = await LaunchLogFactory.deploy();

  console.log("Waiting for deployment transaction confirmation...");
  await launchLog.waitForDeployment();
  const contractAddress = await launchLog.getAddress();

  console.log("-----------------------------------------");
  console.log(`✅ LaunchLog deployed successfully!`);
  console.log(`Contract Address: ${contractAddress}`);
  console.log(`View on BohrScan: https://scan.bohr.life/address/${contractAddress}`);
  console.log("-----------------------------------------");

  // Output config file for frontend
  const deploymentData = {
    address: contractAddress,
    network: "botchain",
    chainId: 968,
    deployedAt: new Date().toISOString(),
  };

  const basePath = process.cwd();
  const deployedPath = path.join(basePath, "src/config/contractAddress.json");
  const dirPath = path.dirname(deployedPath);
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }

  fs.writeFileSync(deployedPath, JSON.stringify(deploymentData, null, 2));
  console.log(`Saved deployment info to ${deployedPath}`);

  // Update .env and .env.local
  const updateEnvFile = (filePath: string) => {
    if (fs.existsSync(filePath)) {
      let content = fs.readFileSync(filePath, "utf-8");
      if (content.includes("NEXT_PUBLIC_CONTRACT_ADDRESS=")) {
        content = content.replace(
          /NEXT_PUBLIC_CONTRACT_ADDRESS=0x[a-fA-F0-9]{40}/,
          `NEXT_PUBLIC_CONTRACT_ADDRESS=${contractAddress}`
        );
      } else {
        content += `\nNEXT_PUBLIC_CONTRACT_ADDRESS=${contractAddress}\n`;
      }
      fs.writeFileSync(filePath, content);
      console.log(`Updated ${path.basename(filePath)} with contract address`);
    }
  };

  updateEnvFile(path.join(basePath, ".env"));
  updateEnvFile(path.join(basePath, ".env.local"));
}

main().catch((error) => {
  console.error("Deployment failed:", error);
  process.exitCode = 1;
});
