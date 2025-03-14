// File location: ./app/utils/defiData.ts
import { DeFiProtocol } from '../types';

// Mock DeFi protocol data
export const fetchUserDeFiPositions = async (walletAddress: string): Promise<DeFiProtocol[]> => {
  // In a real app, this would fetch actual data from various DeFi protocols
  return [
    {
      name: 'Aries Markets',
      chain: 'Aptos',
      apy: 4.5,
      balanceUSD: 1000,
      tokenSymbol: 'APT',
      riskLevel: 'low'
    },
    {
      name: 'Liquidswap',
      chain: 'Aptos',
      apy: 8.2,
      balanceUSD: 500,
      tokenSymbol: 'USDC',
      riskLevel: 'medium'
    },
    {
      name: 'Tortuga Finance',
      chain: 'Aptos',
      apy: 12.7,
      balanceUSD: 250,
      tokenSymbol: 'APT',
      riskLevel: 'high'
    }
  ];
};

export const getAvailableProtocols = async (): Promise<DeFiProtocol[]> => {
  // In a real app, this would fetch all available protocols
  return [
    {
      name: 'Aries Markets',
      chain: 'Aptos',
      apy: 4.5,
      balanceUSD: 0,
      tokenSymbol: 'APT',
      riskLevel: 'low'
    },
    {
      name: 'Liquidswap',
      chain: 'Aptos',
      apy: 8.2,
      balanceUSD: 0,
      tokenSymbol: 'USDC',
      riskLevel: 'medium'
    },
    {
      name: 'Tortuga Finance',
      chain: 'Aptos',
      apy: 12.7,
      balanceUSD: 0,
      tokenSymbol: 'APT',
      riskLevel: 'high'
    },
    {
      name: 'Ditto Finance',
      chain: 'Aptos',
      apy: 6.8,
      balanceUSD: 0,
      tokenSymbol: 'USDT',
      riskLevel: 'medium'
    },
    {
      name: 'Abel Finance',
      chain: 'Aptos',
      apy: 9.3,
      balanceUSD: 0,
      tokenSymbol: 'USDC',
      riskLevel: 'medium'
    }
  ];
};