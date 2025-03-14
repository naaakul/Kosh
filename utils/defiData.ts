// File location: ./app/utils/defiData.ts
import { DeFiProtocol } from "../types";
import { protocolRegistry } from "./protocolAdapters/registry";

// Mock DeFi protocol data
export const fetchUserDeFiPositions = async (
  walletAddress: string
): Promise<DeFiProtocol[]> => {
  try {
    return await protocolRegistry.fetchAllUserPositions(walletAddress);
  } catch (error) {
    console.error("Error fetching user positions:", error);
    // In a real app, this would fetch actual data from various DeFi protocols
    return [
      {
        name: "Aries Markets",
        chain: "Aptos",
        apy: 4.5,
        balanceUSD: 1000,
        tokenSymbol: "APT",
        riskLevel: "low",
      },
      {
        name: "Liquidswap",
        chain: "Aptos",
        apy: 8.2,
        balanceUSD: 500,
        tokenSymbol: "USDC",
        riskLevel: "medium",
      },
      {
        name: "Tortuga Finance",
        chain: "Aptos",
        apy: 12.7,
        balanceUSD: 250,
        tokenSymbol: "APT",
        riskLevel: "high",
      },
    ];
  }
};

export const getAvailableProtocols = async (): Promise<DeFiProtocol[]> => {
  const adapters = protocolRegistry.getAllAdapters();

  // If no adapters are available or they fail, return mock data
  if (adapters.length === 0) {
    // In a real app, this would fetch all available protocols
    return [
      {
        name: "Aries Markets",
        chain: "Aptos",
        apy: 4.5,
        balanceUSD: 0,
        tokenSymbol: "APT",
        riskLevel: "low",
      },
      {
        name: "Liquidswap",
        chain: "Aptos",
        apy: 8.2,
        balanceUSD: 0,
        tokenSymbol: "USDC",
        riskLevel: "medium",
      },
      {
        name: "Tortuga Finance",
        chain: "Aptos",
        apy: 12.7,
        balanceUSD: 0,
        tokenSymbol: "APT",
        riskLevel: "high",
      },
      {
        name: "Ditto Finance",
        chain: "Aptos",
        apy: 6.8,
        balanceUSD: 0,
        tokenSymbol: "USDT",
        riskLevel: "medium",
      },
      {
        name: "Abel Finance",
        chain: "Aptos",
        apy: 9.3,
        balanceUSD: 0,
        tokenSymbol: "USDC",
        riskLevel: "medium",
      },
    ];
  }

  // Return a list of all protocols with empty balances
  return adapters.map((adapter) => ({
    name: adapter.getName(),
    chain: adapter.getChain(),
    apy: 0, // Will be populated by the AI analysis
    balanceUSD: 0,
    tokenSymbol: "",
    riskLevel: "medium" as "low" | "medium" | "high", // Default risk level
  }));
};
