// File location: ./app/utils/transactionExecutor.ts
import { protocolRegistry } from './protocolAdapters/registry';
import { TransactionRecommendation } from '../types';
import { Aptos, AptosConfig, Network } from '@aptos-labs/ts-sdk';

export class TransactionExecutor {
  private client: Aptos;
  
  constructor() {
    const config = new AptosConfig({ network: Network.TESTNET });
    this.client = new Aptos(config);
  }
  
  async executeRecommendation(
    recommendation: TransactionRecommendation,
    walletAddress: string
  ): Promise<string> {
    try {
      // 1. Prepare withdrawal from source protocol
      if (!recommendation.fromProtocol) {
        throw new Error('Source protocol not specified');
      }
      
      const sourceAdapter = protocolRegistry.getAdapter(recommendation.fromProtocol.name);
      const targetAdapter = protocolRegistry.getAdapter(recommendation.toProtocol.name);
      
      if (!sourceAdapter || !targetAdapter) {
        throw new Error('Protocol adapter not found');
      }
      
      // 2. Create withdrawal transaction
      const withdrawalTx = await sourceAdapter.prepareWithdrawTransaction(
        recommendation.amountUSD,
        walletAddress
      );
      
      // 3. Create deposit transaction
      const depositTx = await targetAdapter.prepareDepositTransaction(
        recommendation.amountUSD,
        walletAddress
      );
      
      // 4. In a real implementation, these would be executed against the blockchain
      console.log('Executing withdrawal transaction:', withdrawalTx);
      console.log('Executing deposit transaction:', depositTx);
      
      // 5. Return a mock transaction hash
      return `0x${Math.random().toString(16).substring(2)}`;
    } catch (error) {
      console.error('Transaction execution failed:', error);
      throw error;
    }
  }
}

export const transactionExecutor = new TransactionExecutor();