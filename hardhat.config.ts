import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import * as dotenv from "dotenv";

dotenv.config({ path: ".env.local" });
dotenv.config();

const BOTCHAIN_MAINNET_RPC = process.env.RPC_URL || "https://rpc.botchain.ai";
let privateKey = (process.env.PRIVATE_KEY || "").trim();
if (privateKey && !privateKey.startsWith("0x")) {
  privateKey = `0x${privateKey}`;
}

const config: HardhatUserConfig = {
  solidity: {
    version: "0.8.20",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
      viaIR: false,
    },
  },
  networks: {
    hardhat: {
      chainId: 31337,
    },
    botchainMainnet: {
      url: BOTCHAIN_MAINNET_RPC,
      chainId: 677,
      accounts: privateKey && privateKey !== "0x" ? [privateKey] : [],
    },
    // Retain testnet for fallback reference
    botchainTestnet: {
      url: "https://rpc.bohr.life",
      chainId: 968,
      accounts: privateKey && privateKey !== "0x" ? [privateKey] : [],
    },
  },
  etherscan: {
    apiKey: {
      botchainMainnet: "empty",
      botchainTestnet: "empty",
    },
    customChains: [
      {
        network: "botchainMainnet",
        chainId: 677,
        urls: {
          apiURL: "https://scan.botchain.ai/api",
          browserURL: "https://scan.botchain.ai",
        },
      },
      {
        network: "botchainTestnet",
        chainId: 968,
        urls: {
          apiURL: "https://scan.bohr.life/api",
          browserURL: "https://scan.bohr.life",
        },
      },
    ],
  },
  paths: {
    sources: "./contracts",
    tests: "./test",
    cache: "./cache",
    artifacts: "./artifacts",
  },
};

export default config;
