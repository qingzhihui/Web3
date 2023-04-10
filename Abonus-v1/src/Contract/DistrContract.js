export const Distr_ADDRESS = "0xb3d836d6b143b6125c7d0f002503df6e0ad9c968";
export const Distr_ABI = [
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "previousOwner",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "newOwner",
        type: "address",
      },
    ],
    name: "OwnershipTransferred",
    type: "event",
  },
  {
    inputs: [],
    name: "fee",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "owner",
    outputs: [{ internalType: "address", name: "", type: "address" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "renounceOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ internalType: "uint256", name: "_fee", type: "uint256" }],
    name: "setFee",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address payable[]", name: "to", type: "address[]" },
      { internalType: "uint256", name: "amount", type: "uint256" },
    ],
    name: "transferEth",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [{ internalType: "address", name: "newOwner", type: "address" }],
    name: "transferOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address payable[]", name: "to", type: "address[]" },
      { internalType: "uint256[]", name: "amount", type: "uint256[]" },
    ],
    name: "transferProEth",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "_token", type: "address" },
      { internalType: "address[]", name: "to", type: "address[]" },
      { internalType: "uint256[]", name: "amount", type: "uint256[]" },
    ],
    name: "transferProToken",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "_token", type: "address" },
      { internalType: "address[]", name: "to", type: "address[]" },
      { internalType: "uint256", name: "amount", type: "uint256" },
    ],
    name: "transferToken",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
];
