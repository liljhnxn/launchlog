# LaunchLog

> **Every launch deserves a record.**

LaunchLog is a decentralized project showcase and registry where developers and creators can record, showcase, and manage their builds on-chain. Built natively for **Botchain Mainnet**, LaunchLog lets users connect their MetaMask wallets, record project details with smart contract validation, explore community projects, and manage their listings directly through an intuitive, minimal Web3 interface.

---

## 🚀 Features

- **On-Chain Project Registry**: Every project is permanently and publicly recorded on Botchain Mainnet.
- **Smart Contract Validations**:
  - Project name (1–50 characters, non-empty)
  - Short description (1–200 characters, non-empty)
  - Project website URL (1–200 characters, validated `http://` or `https://`)
- **Creator Ownership & Permissions**: Only the creator wallet address has permission to edit or delete their listing.
- **Real-Time On-Chain Statistics**: Tracks total projects, unique builder wallets, and user-specific project counts directly from the contract.
- **MetaMask Web3 Integration**: Seamless wallet connection, network validation (Chain ID `677`), and on-chain transaction lifecycle management.
- **Modern Minimal UI**: Built with a sleek dark charcoal aesthetic, muted purple and green accents, clean rounded cards, and responsive layout.

---

## 🛠 Tech Stack

- **Smart Contract**: Solidity `^0.8.20`
- **Development & Testing Framework**: Hardhat, Ethers.js v6, Chai
- **Frontend Framework**: Next.js 14 (App Router), React 18, TypeScript
- **Styling**: Tailwind CSS
- **Web3 Libraries**: wagmi v2, viem v2, @tanstack/react-query
- **Icons**: Lucide React

---

## 🌐 Blockchain Network Details

- **Network**: Botchain Mainnet
- **Chain ID**: `677`
- **RPC URL**: `https://rpc.botchain.ai`
- **Native Currency**: `BOT` (18 Decimals)
- **Total Supply**: 150 Million BOT
- **Block Explorer**: [https://scan.botchain.ai](https://scan.botchain.ai)
- **Deployed Mainnet Contract**: [`0xE00857F9e625ec7D7272febc750C7391cfeC7f6F`](https://scan.botchain.ai/address/0xE00857F9e625ec7D7272febc750C7391cfeC7f6F#code)

---

## 📋 Smart Contract Architecture

The core contract [`LaunchLog.sol`](contracts/LaunchLog.sol) contains:

### Data Structure
```solidity
struct Project {
    uint256 id;
    string name;
    string description;
    string website;
    address creator;
    uint256 createdAt;
    bool isActive;
}
```

### Core Functions
- `createProject(string name, string description, string website)`: Validates inputs, assigns a unique auto-incrementing ID, stores creator address and timestamp, and emits `ProjectCreated`.
- `updateProject(uint256 projectId, string name, string description, string website)`: Only allows the project creator to modify details and emits `ProjectUpdated`.
- `deleteProject(uint256 projectId)`: Only allows the creator to deactivate their project listing and emits `ProjectDeleted`.
- `getAllProjects()`: Returns all active community projects.
- `getMyProjects()`: Returns all active projects created by `msg.sender`.
- `getProject(uint256 projectId)`: Returns a single active project by ID.

---

## 📦 Getting Started

### 1. Prerequisites
- Node.js (v18+ or v20+)
- MetaMask extension installed in your browser

### 2. Install Dependencies
```bash
npm install
```

### 3. Configure Environment Variables
Copy `.env.example` to `.env.local`:
```bash
cp .env.example .env.local
```

Fill in the required values:
```env
RPC_URL=https://rpc.botchain.ai
PRIVATE_KEY=your_deployer_wallet_private_key
NEXT_PUBLIC_CONTRACT_ADDRESS=0xE00857F9e625ec7D7272febc750C7391cfeC7f6F
NEXT_PUBLIC_CHAIN_ID=677
NEXT_PUBLIC_RPC_URL=https://rpc.botchain.ai
NEXT_PUBLIC_BLOCK_EXPLORER=https://scan.botchain.ai
```

---

## 🧪 Testing the Smart Contract

Run the comprehensive unit test suite:
```bash
npx hardhat test
```

---

## 🚀 Deploying to Botchain Mainnet

```bash
npm run deploy:mainnet
```

The script deploys the contract to Botchain Mainnet with optimized gas, logs the contract address, and automatically exports the deployment details to `src/config/contractAddress.json`.

---

## 💻 Running the Web Application

Start the local development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🦊 Adding Botchain Mainnet to MetaMask

1. Open **MetaMask** -> **Networks** -> **Add Network Manually**.
2. **Network Name**: `Botchain Mainnet`
3. **New RPC URL**: `https://rpc.botchain.ai`
4. **Chain ID**: `677`
5. **Currency Symbol**: `BOT`
6. **Block Explorer URL**: `https://scan.botchain.ai`

---

## 📄 License
MIT License
