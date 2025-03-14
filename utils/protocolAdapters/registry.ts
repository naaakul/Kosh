// File location: ./app/utils/protocolAdapters/registry.ts
import { ProtocolAdapter } from './types';
import { AriesMarketsAdapter } from './ariesMarkets';
import { Aptos, AptosConfig, Network } from '@aptos-labs/ts-sdk';

// Initialize Aptos client
const createAptosClient = () => {
  const config = new AptosConfig({ network: Network.TESTNET });
  return new Aptos(config);
};

export class ProtocolRegistry {
  private adapters: Map<string, ProtocolAdapter> = new Map();
  
  constructor() {
    this.initialize();
  }
  
  private initialize() {
    const aptosClient = createAptosClient();
    
    // Register protocol adapters
    this.registerAdapter(new AriesMarketsAdapter(aptosClient));
    // Add more adapters as needed
  }
  
  registerAdapter(adapter: ProtocolAdapter) {
    this.adapters.set(adapter.getName(), adapter);
  }
  
  getAdapter(protocolName: string): ProtocolAdapter | undefined {
    return this.adapters.get(protocolName);
  }
  
  getAllAdapters(): ProtocolAdapter[] {
    return Array.from(this.adapters.values());
  }
  
  async fetchAllUserPositions(walletAddress: string): Promise<any[]> {
    const positions = [];
    
    for (const adapter of this.adapters.values()) {
      try {
        const balance = await adapter.fetchUserBalance(walletAddress);
        
        // Only add positions with non-zero balance
        if (balance.balanceUSD > 0) {
          positions.push({
            name: adapter.getName(),
            chain: adapter.getChain(),
            ...balance,
            riskLevel: this.getRiskLevelForProtocol(adapter.getName())
          });
        }
      } catch (error) {
        console.error(`Error fetching balance for ${adapter.getName()}:`, error);
      }
    }
    
    return positions;
  }
  
  private getRiskLevelForProtocol(protocolName: string): 'low' | 'medium' | 'high' {
    // In a real app, this would use actual risk assessment data
    const riskMap: {[key: string]: 'low' | 'medium' | 'high'} = {
      'Aries Markets': 'low',
      'Liquidswap': 'medium',
      'Tortuga Finance': 'high'
    };
    
    return riskMap[protocolName] || 'medium';
  }
}

// Create a singleton instance
export const protocolRegistry = new ProtocolRegistry();