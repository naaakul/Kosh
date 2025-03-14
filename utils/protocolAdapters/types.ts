// File location: ./app/utils/protocolAdapters/types.ts
import { DeFiProtocol } from '../../types';

export interface ProtocolTransaction {
  protocol: string;
  method: string;
  args: any[];
  value?: string;
}

export interface ProtocolAdapter {
  getName(): string;
  getChain(): string;
  fetchUserBalance(walletAddress: string): Promise<{
    balanceUSD: number;
    tokenSymbol: string;
    apy: number;
  }>;
  prepareDepositTransaction(amount: number, walletAddress: string): Promise<ProtocolTransaction>;
  prepareWithdrawTransaction(amount: number, walletAddress: string): Promise<ProtocolTransaction>;
}