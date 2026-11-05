# LaunchLog Whitepaper
**Version 1.0 — November 2026**  
*Decentralized Project Registry & Builder Showcase on Botchain Mainnet*

---

## 1. Executive Summary

In the modern Web3 ecosystem, hundreds of protocols, dApps, tools, and smart contracts are deployed daily. However, discovery, validation, and verifiable provenance for new projects remain fragmented across centralized forums, private databases, and transient social media feeds. When a builder deploys a project, their deployment history and project metadata are often lost in network noise.

**LaunchLog** is an open, immutable, decentralized project showcase designed to provide permanent on-chain records for every launch. Built natively on **Botchain Mainnet**, LaunchLog enables developers to register project metadata directly to smart contracts, retain cryptographic ownership over their listings, and offer the ecosystem a transparent, verifiable registry of builder activity.

> **Tagline:** *Every launch deserves a record.*

---

## 2. Problem Statement

### 2.1 Centralized Gatekeeping & Ephemeral Discovery
Traditional project directories (Product Hunt, directory aggregators, Web2 registries) suffer from:
- **Centralized curation & censorship:** Arbitrary listing rules and fee barriers.
- **Data volatility:** Platforms shut down, APIs deprecate, and project profiles disappear.
- **Lack of cryptographic provenance:** Anyone can claim ownership of a project URL or repository without proof of cryptographic authority.

### 2.2 Lack of Verifiable Builder Footprints in Emerging Networks
For emerging ecosystems like Botchain, tracking real ecosystem momentum is difficult without a native, verifiable registry where every launch is provable on-chain.

---

## 3. The LaunchLog Solution

LaunchLog provides a serverless, database-free architecture where:
1. **Records are Immutable and On-Chain:** Project IDs, names, summaries, links, timestamps, and creator addresses live directly inside the `LaunchLog.sol` smart contract on Botchain Mainnet (`Chain ID: 677`).
2. **Cryptographic Identity & Ownership:** Project listings are permanently tied to the publisher’s wallet address (`msg.sender`). Only the creator has permission to update metadata or deactivate the listing.
3. **Public Good Architecture:** No token gates, platform fees, or proprietary lock-ins. LaunchLog serves as public infrastructure for all Botchain builders.

---

## 4. Architecture & Technical Specifications

```
  +------------------------------------------------------------------+
  |                     Frontend Web Application                     |
  |           Next.js 14 • TypeScript • Tailwind CSS • Wagmi         |
  +---------------------------------+--------------------------------+
                                    |
                    JSON-RPC / Web3 Injected Provider
                                    |
                                    v
  +------------------------------------------------------------------+
  |                    Botchain Mainnet (Chain ID 677)               |
  |                        RPC: https://rpc.botchain.ai              |
  |                                                                  |
  |       +--------------------------------------------------+       |
  |       |               LaunchLog.sol Contract             |       |
  |       |   Address: 0xE00857F9e625ec7D7272febc750C7391cfeC7f6F   |       |
  |       +--------------------------------------------------+       |
  |          - createProject(...)                                    |
  |          - updateProject(...)                                    |
  |          - deleteProject(...)                                    |
  |          - getAllProjects()                                      |
  |          - getMyProjects()                                       |
  +------------------------------------------------------------------+
```

### 4.1 Data Structure
```solidity
struct Project {
    uint256 id;          // Unique sequential launch ID
    string name;         // Project name (1–50 bytes)
    string description;  // Short description (1–200 bytes)
    string website;      // External application URL (1–200 bytes)
    address creator;     // Publisher wallet address
    uint256 createdAt;   // Block timestamp
    bool isActive;       // Listing status flag
}
```

### 4.2 Gas Optimization & Boundary Enforcement
To maintain low gas costs and prevent state bloat:
- **Strict Byte Limits:** Names are constrained to 50 bytes; descriptions and URLs to 200 bytes.
- **Custom Errors:** Solidity 0.8.20 custom errors (`EmptyField`, `ExceedsMaxLength`, `NotCreator`, `ProjectNotFound`) are utilized over verbose revert strings to minimize bytecode and execution gas.
- **Soft Deactivation:** Deletion is performed via an `isActive` boolean flag, preserving historical integrity while excluding deactivated projects from active queries.

---

## 5. Security & Permission Model

- **Zero Admin Keys:** There is no contract owner, backdoor, or admin withdrawal mechanism. The contract is trustless and permissionless.
- **Caller Authentication:** State mutation routines (`updateProject`, `deleteProject`) verify that `project.creator == msg.sender`. Unauthorized callers revert immediately.
- **Client-Side Sanitation:** The frontend enforces URL formatting standards (`http://` and `https://`) and safe link redirection (`rel="noopener noreferrer"`) to prevent malicious phishing vectors.

---

## 6. Ecosystem Impact for Botchain

1. **Ecosystem Activity Metric:** Provides Botchain leadership and validators with real-time insight into active builder numbers.
2. **Community Discovery Hub:** Users, investors, and fellow developers have a single transparent dashboard to explore what is being shipped on Botchain.
3. **Builder Credibility:** Serves as a public verifiable portfolio for hackathon entrants and grant applicants.

---

## 7. Roadmap

### Phase 1: Core Deployment (Completed)
- [x] Solidity smart contract architecture and gas optimization.
- [x] 15/15 unit tests passing with Hardhat.
- [x] Contract deployed and verified on BotchainScan Mainnet (`0xE00857F9e625ec7D7272febc750C7391cfeC7f6F`).
- [x] Responsive Next.js Web3 frontend deployed.

### Phase 2: Community & Ecosystem Growth
- [ ] Integration with Botchain official explorer & ecosystem directory.
- [ ] Tagging & category filters (DeFi, Infrastructure, Gaming, Social).
- [ ] On-chain upvoting / social attestation mechanism.

### Phase 3: Cross-Ecosystem Syndication
- [ ] Verified builder badges.
- [ ] Contract event webhooks for Discord/Telegram ecosystem announcement bots.

---

## 8. Conclusion

LaunchLog bridges the gap between smart contract deployment and community discovery. By anchoring project identity directly to Botchain, LaunchLog ensures that every builder’s contribution is recorded transparently and permanently on-chain.

*Contract Address:* [`0xE00857F9e625ec7D7272febc750C7391cfeC7f6F`](https://scan.botchain.ai/address/0xE00857F9e625ec7D7272febc750C7391cfeC7f6F#code)  
*GitHub Repository:* [https://github.com/liljhnxn/launchlog](https://github.com/liljhnxn/launchlog)
