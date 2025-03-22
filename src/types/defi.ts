export interface ProtocolData {
  name: string;
  apy: number;
  tvl: number;
  riskScore: number;
  address?: string;
  description?: string;
}

export interface Recommendation {
  protocol: string;
  action: "deposit" | "withdraw";
  expectedReturn: number;
  netBenefit: number;
  riskLevel: number;
  address: string;
  description: string;
}
