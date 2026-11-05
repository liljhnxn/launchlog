import addressData from "./contractAddress.json";

export const MAINNET_CONTRACT_ADDRESS: `0x${string}` =
  "0xE00857F9e625ec7D7272febc750C7391cfeC7f6F";

export const CONTRACT_ADDRESS: `0x${string}` =
  (process.env.NEXT_PUBLIC_CONTRACT_ADDRESS as `0x${string}`) ||
  ((addressData as { address?: string })?.address as `0x${string}`) ||
  MAINNET_CONTRACT_ADDRESS;

export const LAUNCHLOG_ABI = [
  {
    type: "function",
    name: "createProject",
    inputs: [
      { name: "name", type: "string", internalType: "string" },
      { name: "description", type: "string", internalType: "string" },
      { name: "website", type: "string", internalType: "string" },
    ],
    outputs: [{ name: "", type: "uint256", internalType: "uint256" }],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "updateProject",
    inputs: [
      { name: "projectId", type: "uint256", internalType: "uint256" },
      { name: "name", type: "string", internalType: "string" },
      { name: "description", type: "string", internalType: "string" },
      { name: "website", type: "string", internalType: "string" },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "deleteProject",
    inputs: [{ name: "projectId", type: "uint256", internalType: "uint256" }],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "getAllProjects",
    inputs: [],
    outputs: [
      {
        name: "",
        type: "tuple[]",
        internalType: "struct LaunchLog.Project[]",
        components: [
          { name: "id", type: "uint256", internalType: "uint256" },
          { name: "name", type: "string", internalType: "string" },
          { name: "description", type: "string", internalType: "string" },
          { name: "website", type: "string", internalType: "string" },
          { name: "creator", type: "address", internalType: "address" },
          { name: "createdAt", type: "uint256", internalType: "uint256" },
          { name: "isActive", type: "bool", internalType: "bool" },
        ],
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "getMyProjects",
    inputs: [],
    outputs: [
      {
        name: "",
        type: "tuple[]",
        internalType: "struct LaunchLog.Project[]",
        components: [
          { name: "id", type: "uint256", internalType: "uint256" },
          { name: "name", type: "string", internalType: "string" },
          { name: "description", type: "string", internalType: "string" },
          { name: "website", type: "string", internalType: "string" },
          { name: "creator", type: "address", internalType: "address" },
          { name: "createdAt", type: "uint256", internalType: "uint256" },
          { name: "isActive", type: "bool", internalType: "bool" },
        ],
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "getProject",
    inputs: [{ name: "projectId", type: "uint256", internalType: "uint256" }],
    outputs: [
      {
        name: "",
        type: "tuple",
        internalType: "struct LaunchLog.Project",
        components: [
          { name: "id", type: "uint256", internalType: "uint256" },
          { name: "name", type: "string", internalType: "string" },
          { name: "description", type: "string", internalType: "string" },
          { name: "website", type: "string", internalType: "string" },
          { name: "creator", type: "address", internalType: "address" },
          { name: "createdAt", type: "uint256", internalType: "uint256" },
          { name: "isActive", type: "bool", internalType: "bool" },
        ],
      },
    ],
    stateMutability: "view",
  },
  {
    type: "event",
    name: "ProjectCreated",
    inputs: [
      { name: "projectId", type: "uint256", indexed: true },
      { name: "creator", type: "address", indexed: true },
      { name: "name", type: "string", indexed: false },
      { name: "website", type: "string", indexed: false },
      { name: "createdAt", type: "uint256", indexed: false },
    ],
    anonymous: false,
  },
  {
    type: "event",
    name: "ProjectUpdated",
    inputs: [
      { name: "projectId", type: "uint256", indexed: true },
      { name: "creator", type: "address", indexed: true },
      { name: "name", type: "string", indexed: false },
      { name: "website", type: "string", indexed: false },
      { name: "updatedAt", type: "uint256", indexed: false },
    ],
    anonymous: false,
  },
  {
    type: "event",
    name: "ProjectDeleted",
    inputs: [
      { name: "projectId", type: "uint256", indexed: true },
      { name: "creator", type: "address", indexed: true },
      { name: "timestamp", type: "uint256", indexed: false },
    ],
    anonymous: false,
  },
] as const;
