// File location: ./app/types/index.ts
export interface UserWallet {
    address: string;
    publicKey: string | null;
    isConnected: boolean;
  }
  
  export interface DeFiProtocol {
    name: string;
    chain: string;
    apy: number;
    balanceUSD: number;
    tokenSymbol: string;
    riskLevel: 'low' | 'medium' | 'high';
  }
  
  export interface TransactionRecommendation {
    fromProtocol?: DeFiProtocol;
    toProtocol: DeFiProtocol;
    amountUSD: number;
    expectedAPYIncrease: number;
    gasFeeUSD: number;
    riskChange: 'lower' | 'same' | 'higher';
    reasoning: string;
  }
  
  export interface AIAnalysisResult {
    recommendations: TransactionRecommendation[];
    totalCurrentYieldUSD: number;
    totalOptimizedYieldUSD: number;
    riskAssessment: string;
  }