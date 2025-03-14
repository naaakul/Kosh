// File location: ./app/utils/aiLogic.ts
import { DeFiProtocol, TransactionRecommendation, AIAnalysisResult } from '../types';

// Constants for risk scores
const RISK_SCORES = {
  low: 1,
  medium: 2,
  high: 3
};

// Risk preference modifiers
const RISK_PREFERENCE_MODIFIERS = {
  conservative: {
    maxRiskScore: 1.5,
    yieldWeight: 0.3,
    riskWeight: 0.7
  },
  balanced: {
    maxRiskScore: 2.5,
    yieldWeight: 0.5,
    riskWeight: 0.5
  },
  aggressive: {
    maxRiskScore: 3.5,
    yieldWeight: 0.7,
    riskWeight: 0.3
  }
};

// Calculate a risk-adjusted score for a protocol
const calculateRiskAdjustedScore = (
  protocol: DeFiProtocol, 
  riskPreference: 'conservative' | 'balanced' | 'aggressive'
) => {
  const riskScore = RISK_SCORES[protocol.riskLevel];
  const { yieldWeight, riskWeight } = RISK_PREFERENCE_MODIFIERS[riskPreference];
  
  // Higher is better for yield, lower is better for risk
  const yieldScore = protocol.apy;
  const inverseRiskScore = 4 - riskScore; // Invert so higher is better
  
  return (yieldWeight * yieldScore) + (riskWeight * inverseRiskScore);
};

// Gas cost estimation based on protocol
const estimateGasFee = (fromProtocol?: DeFiProtocol, toProtocol?: DeFiProtocol): number => {
  // In a real app, this would calculate actual gas costs based on blockchain state
  // For this example, we'll use a simple model
  const baseGasFee = 0.5; // Base fee in USD
  
  // If protocols are on different chains, gas would be higher
  if (fromProtocol && toProtocol && fromProtocol.chain !== toProtocol.chain) {
    return baseGasFee * 3; // Cross-chain transactions are more expensive
  }
  
  return baseGasFee;
};

// Determine if a move would be profitable
const isMoveProfitable = (
  fromProtocol: DeFiProtocol,
  toProtocol: DeFiProtocol,
  amount: number,
  gasFee: number
): boolean => {
  const currentYearlyYield = amount * (fromProtocol.apy / 100);
  const newYearlyYield = amount * (toProtocol.apy / 100);
  const yearlyGain = newYearlyYield - currentYearlyYield;
  
  // Calculate break-even time in days
  const breakEvenDays = (gasFee / (yearlyGain / 365));
  
  // Only recommend if break-even is less than 30 days
  return breakEvenDays < 30;
};

// Calculate risk level change
const getRiskChange = (fromRisk: 'low' | 'medium' | 'high', toRisk: 'low' | 'medium' | 'high'): 'lower' | 'same' | 'higher' => {
  const fromScore = RISK_SCORES[fromRisk];
  const toScore = RISK_SCORES[toRisk];
  
  if (toScore < fromScore) return 'lower';
  if (toScore > fromScore) return 'higher';
  return 'same';
};

// Generate detailed reasoning
const generateReasoning = (
  fromProtocol: DeFiProtocol,
  toProtocol: DeFiProtocol,
  amount: number,
  gasFee: number,
  riskChange: 'lower' | 'same' | 'higher'
): string => {
  const apyDiff = toProtocol.apy - fromProtocol.apy;
  const yearlyGain = amount * (apyDiff / 100);
  const breakEvenDays = Math.round(gasFee / (yearlyGain / 365));
  
  let riskMessage = '';
  if (riskChange === 'higher') {
    riskMessage = ` This increases your risk level from ${fromProtocol.riskLevel} to ${toProtocol.riskLevel}.`;
  } else if (riskChange === 'lower') {
    riskMessage = ` This decreases your risk level from ${fromProtocol.riskLevel} to ${toProtocol.riskLevel}.`;
  } else {
    riskMessage = ` This maintains your current risk level.`;
  }

  return `Moving $${amount.toFixed(2)} from ${fromProtocol.name} (${fromProtocol.apy.toFixed(1)}% APY) to ${toProtocol.name} (${toProtocol.apy.toFixed(1)}% APY) will increase your annual yield by $${yearlyGain.toFixed(2)}.${riskMessage} You'll break even on gas fees in approximately ${breakEvenDays} days.`;
};

// Main analysis function
export const analyzePositionsWithAI = (
  positions: DeFiProtocol[],
  availableProtocols: DeFiProtocol[],
  riskPreference: 'conservative' | 'balanced' | 'aggressive'
): AIAnalysisResult => {
  if (!positions.length) {
    return {
      recommendations: [],
      totalCurrentYieldUSD: 0,
      totalOptimizedYieldUSD: 0,
      riskAssessment: "No positions to analyze."
    };
  }
  
  const { maxRiskScore } = RISK_PREFERENCE_MODIFIERS[riskPreference];
  const recommendations: TransactionRecommendation[] = [];
  
  // Calculate current total yield
  const totalValue = positions.reduce((sum, pos) => sum + pos.balanceUSD, 0);
  const totalCurrentYield = positions.reduce(
    (sum, pos) => sum + (pos.balanceUSD * pos.apy / 100),
    0
  );
  
  // Find suitable protocols based on risk preference
  const suitableProtocols = availableProtocols.filter(protocol => 
    RISK_SCORES[protocol.riskLevel] <= maxRiskScore
  );
  
  // For each position, check if there's a better option
  for (const position of positions) {
    // Skip positions with very small balances
    if (position.balanceUSD < 10) continue;
    
    // Get suitable protocols with better APY
    const betterOptions = suitableProtocols.filter(protocol => 
      protocol.name !== position.name && 
      protocol.apy > position.apy
    );
    
    if (betterOptions.length === 0) continue;
    
    // Sort by risk-adjusted score
    betterOptions.sort((a, b) => 
      calculateRiskAdjustedScore(b, riskPreference) - calculateRiskAdjustedScore(a, riskPreference)
    );
    
    const bestOption = betterOptions[0];
    
    // Calculate optimal amount to move (based on risk preference)
    const movePercentage = riskPreference === 'conservative' ? 0.3 : 
                          riskPreference === 'balanced' ? 0.5 : 0.8;
    const moveAmount = position.balanceUSD * movePercentage;
    
    // Calculate gas fee and check profitability
    const gasFee = estimateGasFee(position, bestOption);
    
    if (isMoveProfitable(position, bestOption, moveAmount, gasFee)) {
      const riskChange = getRiskChange(position.riskLevel, bestOption.riskLevel);
      const expectedAPYIncrease = moveAmount * (bestOption.apy - position.apy) / 100;
      
      recommendations.push({
        fromProtocol: position,
        toProtocol: bestOption,
        amountUSD: moveAmount,
        expectedAPYIncrease,
        gasFeeUSD: gasFee,
        riskChange,
        reasoning: generateReasoning(position, bestOption, moveAmount, gasFee, riskChange)
      });
    }
  }
  
  // Calculate optimized yield
  const totalOptimizedYield = totalCurrentYield + 
    recommendations.reduce((sum, rec) => sum + rec.expectedAPYIncrease, 0);
  
  // Generate risk assessment
  let riskAssessment = `Your portfolio of $${totalValue.toFixed(2)} has a ${riskPreference} risk profile with a current estimated yield of $${totalCurrentYield.toFixed(2)} per year.`;
  
  if (recommendations.length > 0) {
    const improvementPercentage = ((totalOptimizedYield - totalCurrentYield) / totalCurrentYield * 100).toFixed(1);
    riskAssessment += ` Our AI analysis suggests optimizations that could increase your yield by ${improvementPercentage}% to $${totalOptimizedYield.toFixed(2)} per year.`;
  } else {
    riskAssessment += ` Our AI analysis indicates your portfolio is already well-optimized for your risk preference.`;
  }
  
  return {
    recommendations,
    totalCurrentYieldUSD: totalCurrentYield,
    totalOptimizedYieldUSD: totalOptimizedYield,
    riskAssessment
  };
};