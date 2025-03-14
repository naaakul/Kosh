// File location: ./app/api/ai/analyze/route.ts
import { NextResponse } from 'next/server';
import { AIAnalysisResult, DeFiProtocol } from '../../../../types';

import { analyzePositionsWithAI } from '../../../../utils/aiLogic';
import { getAvailableProtocols } from '../../../../utils/defiData';

export async function POST(request: Request) {
  try {
    const { walletAddress, positions, riskPreference } = await request.json();

    if (!walletAddress || !positions || !riskPreference) {
      return NextResponse.json(
        { error: 'Missing required parameters' },
        { status: 400 }
      );
    }

    // Get all available protocols to consider for recommendations
    const availableProtocols = await getAvailableProtocols();
    
    // Use our AI logic to analyze positions
    const analysis = analyzePositionsWithAI(
      positions,
      availableProtocols,
      riskPreference
    );

    return NextResponse.json(analysis);
  } catch (error) {
    console.error('Error in AI analysis:', error);
    return NextResponse.json(
      { error: 'Failed to analyze positions' },
      { status: 500 }
    );
  }
}

function analyzePositions(
  positions: DeFiProtocol[],
  riskPreference: 'conservative' | 'balanced' | 'aggressive'
): AIAnalysisResult {
  // This is a mock analysis function
  // In a real app, this would use AI to analyze the positions
  
  const totalCurrentValue = positions.reduce(
    (sum, position) => sum + position.balanceUSD,
    0
  );
  
  const totalCurrentYield = positions.reduce(
    (sum, position) => sum + position.balanceUSD * (position.apy / 100),
    0
  );

  // Simple mock recommendation logic
  let recommendations = [];
  
  if (positions.length >= 2) {
    const lowestYield = positions.reduce(
      (lowest, position) => (position.apy < lowest.apy ? position : lowest),
      positions[0]
    );
    
    const highestYield = positions.reduce(
      (highest, position) => (position.apy > highest.apy ? position : highest),
      positions[0]
    );
    
    // Only recommend if there's a significant difference
    if (highestYield.apy - lowestYield.apy > 2) {
      // Adjust amount based on risk preference
      const moveAmount = riskPreference === 'conservative' 
        ? lowestYield.balanceUSD * 0.3 
        : riskPreference === 'balanced'
          ? lowestYield.balanceUSD * 0.5
          : lowestYield.balanceUSD * 0.8;
      
      recommendations.push({
        fromProtocol: lowestYield,
        toProtocol: highestYield,
        amountUSD: moveAmount,
        expectedAPYIncrease: ((highestYield.apy - lowestYield.apy) * moveAmount / 100),
        gasFeeUSD: 0.5, // Mock gas fee
        riskChange: highestYield.riskLevel === 'high' ? ('higher' as const) : ('same' as const),
        reasoning: `Moving funds from ${lowestYield.name} (${lowestYield.apy}% APY) to ${highestYield.name} (${highestYield.apy}% APY) will increase your yield while maintaining a ${riskPreference} risk profile.`
      });
    }
  }

  const totalOptimizedYield = totalCurrentYield + 
    recommendations.reduce((sum, rec) => sum + rec.expectedAPYIncrease, 0);

  return {
    recommendations,
    totalCurrentYieldUSD: totalCurrentYield,
    totalOptimizedYieldUSD: totalOptimizedYield,
    riskAssessment: `Your current portfolio has a ${riskPreference} risk profile with an estimated yield of $${totalCurrentYield.toFixed(2)} per year.`
  };
}