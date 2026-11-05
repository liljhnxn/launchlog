import hre from "hardhat";
const { ethers } = hre;
import * as fs from "fs";
import * as path from "path";

async function main() {
  console.log("=========================================");
  console.log("Connecting to network...");

  const [deployer] = await ethers.getSigners();
  if (!deployer) {
    throw new Error("No deployer signer found. Please check PRIVATE_KEY in .env or .env.local.");
  }

  const network = await ethers.provider.getNetwork();
  const chainId = Number(network.chainId);
  console.log(`Target Network: ${network.name} (Chain ID: ${chainId})`);
  console.log(`Deployer address: ${deployer.address}`);

  const balance = await ethers.provider.getBalance(deployer.address);
  console.log(`Deployer balance: ${ethers.formatEther(balance)} BOT`);

  const feeData = await ethers.provider.getFeeData();
  const gasPrice = feeData.gasPrice || ethers.parseUnits("20", "gwei");
  console.log(`Current Gas Price: ${ethers.formatUnits(gasPrice, "gwei")} gwei`);

  console.log("Estimating deployment gas...");
  const LaunchLogFactory = await ethers.getContractFactory("LaunchLog");
  const deploymentTx = await LaunchLogFactory.getDeployTransaction();
  const estimatedGas = await ethers.provider.estimateGas(deploymentTx);
  const estimatedCost = estimatedGas * gasPrice;
  console.log(`Estimated Gas Units: ${estimatedGas.toString()}`);
  console.log(`Estimated Deployment Cost: ~${ethers.formatEther(estimatedCost)} BOT`);

  if (balance < estimatedCost) {
    throw new Error(
      `Insufficient funds: Deployer has ${ethers.formatEther(balance)} BOT, but estimated cost is ${ethers.formatEther(estimatedCost)} BOT`
    );
  }

  console.log("Deploying LaunchLog smart contract...");
  const launchLog = await LaunchLogFactory.deploy({
    gasPrice: gasPrice,
  });

  console.log(`Transaction submitted with hash: ${launchLog.deploymentTransaction()?.hash}`);
  console.log("Waiting for deployment transaction confirmation...");
  await launchLog.waitForDeployment();
  const contractAddress = await launchLog.getAddress();

  const receipt = await launchLog.deploymentTransaction()?.wait();
  if (receipt) {
    const actualCost = receipt.gasUsed * receipt.gasPrice;
    console.log(`Actual Gas Used: ${receipt.gasUsed.toString()} units`);
    console.log(`Actual Gas Cost: ${ethers.formatEther(actualCost)} BOT`);
  }

  console.log("=========================================");
  console.log(`✅ LaunchLog deployed successfully to Mainnet!`);
  console.log(`Contract Address: ${contractAddress}`);
  console.log(`View on BotchainScan: https://scan.botchain.ai/address/${contractAddress}`);
  console.log("=========================================");

  // Output config file for frontend
  const deploymentData = {
    address: contractAddress,
    network: chainId === 677 ? "botchainMainnet" : "botchain",
    chainId: chainId,
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
      
      // Update contract address
      if (content.includes("NEXT_PUBLIC_CONTRACT_ADDRESS=")) {
        content = content.replace(
          /NEXT_PUBLIC_CONTRACT_ADDRESS=0x[a-fA-F0-9]{40}/,
          `NEXT_PUBLIC_CONTRACT_ADDRESS=${contractAddress}`
        );
      } else {
        content += `\nNEXT_PUBLIC_CONTRACT_ADDRESS=${contractAddress}\n`;
      }

      // Update Chain ID if needed
      if (content.includes("NEXT_PUBLIC_CHAIN_ID=")) {
        content = content.replace(/NEXT_PUBLIC_CHAIN_ID=\d+/, `NEXT_PUBLIC_CHAIN_ID=${chainId}`);
      }
      if (content.includes("RPC_URL=")) {
        content = content.replace(/RPC_URL=https?:\/\/[^\s]+/, `RPC_URL=https://rpc.botchain.ai`);
      }
      if (content.includes("NEXT_PUBLIC_RPC_URL=")) {
        content = content.replace(/NEXT_PUBLIC_RPC_URL=https?:\/\/[^\s]+/, `NEXT_PUBLIC_RPC_URL=https://rpc.botchain.ai`);
      }
      if (content.includes("NEXT_PUBLIC_BLOCK_EXPLORER=")) {
        content = content.replace(/NEXT_PUBLIC_BLOCK_EXPLORER=https?:\/\/[^\s]+/, `NEXT_PUBLIC_BLOCK_EXPLORER=https://scan.botchain.ai`);
      }

      fs.writeFileSync(filePath, content);
      console.log(`Updated ${path.basename(filePath)}`);
    }
  };

  updateEnvFile(path.join(basePath, ".env"));
  updateEnvFile(path.join(basePath, ".env.local"));

  // Verification step
  console.log("-----------------------------------------");
  console.log("Submitting contract verification to BotchainScan...");
  try {
    await hre.run("verify:verify", {
      address: contractAddress,
      constructorArguments: [],
    });
    console.log("✅ Verification succeeded on BotchainScan!");
  } catch (error: any) {
    console.log("ℹ️ Verification note:", error?.message || error);
    console.log("If needed, code can also be verified on https://scan.botchain.ai directly.");
  }
}

main().catch((error) => {
  console.error("Deployment failed:", error);
  process.exitCode = 1;
});
