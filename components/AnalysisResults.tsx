// File location: ./app/components/AnalysisResults.tsx
'use client';

import { useState } from 'react';
import { AIAnalysisResult, TransactionRecommendation } from '../types';

interface AnalysisResultsProps {
  analysis: AIAnalysisResult | null;
  onExecuteTransaction: (recommendation: TransactionRecommendation) => Promise<void>;
}

export const AnalysisResults: React.FC<AnalysisResultsProps> = ({ 
  analysis, 
  onExecuteTransaction 
}) => {
  const [isExecuting, setIsExecuting] = useState<string | null>(null);

  const handleExecute = async (recommendation: TransactionRecommendation) => {
    const id = `${recommendation.fromProtocol?.name}-${recommendation.toProtocol.name}`;
    setIsExecuting(id);
    
    try {
      await onExecuteTransaction(recommendation);
    } catch (error) {
      console.error('Failed to execute transaction:', error);
    } finally {
      setIsExecuting(null);
    }
  };

  if (!analysis) {
    return null;
  }

  return (
    <div className="border rounded-lg p-4">
      <h2 className="text-xl font-bold mb-4">AI Analysis Results</h2>
      
      <div className="mb-4">
        <p className="mb-2">{analysis.riskAssessment}</p>
        <div className="flex justify-between">
          <div>
            <span className="font-semibold">Current Yield:</span> ${analysis.totalCurrentYieldUSD.toFixed(2)}/year
          </div>
          <div>
            <span className="font-semibold">Optimized Yield:</span> ${analysis.totalOptimizedYieldUSD.toFixed(2)}/year
          </div>
        </div>
      </div>
      
      <h3 className="text-lg font-semibold mb-2">Recommendations</h3>
      {analysis.recommendations.length === 0 ? (
        <p>No recommendations at this time. Your portfolio is already optimized.</p>
      ) : (
        <div className="space-y-4">
          {analysis.recommendations.map((rec, index) => {
            const id = `${rec.fromProtocol?.name}-${rec.toProtocol.name}`;
            return (
              <div key={index} className="border rounded p-3 bg-gray-50">
                <div className="mb-2">
                  <span className="font-semibold">Action:</span> Transfer ${rec.amountUSD.toFixed(2)} from {rec.fromProtocol?.name} to {rec.toProtocol.name}
                </div>
                <div className="mb-2">
                  <span className="font-semibold">Expected APY Increase:</span> ${rec.expectedAPYIncrease.toFixed(2)}/year
                </div>
                <div className="mb-2">
                  <span className="font-semibold">Gas Fee:</span> ${rec.gasFeeUSD.toFixed(2)}
                </div>
                <div className="mb-2">
                  <span className="font-semibold">Risk Change:</span> {rec.riskChange.charAt(0).toUpperCase() + rec.riskChange.slice(1)}
                </div>
                <div className="mb-2">
                  <span className="font-semibold">Reasoning:</span> {rec.reasoning}
                </div>
                <button
                  onClick={() => handleExecute(rec)}
                  disabled={isExecuting !== null}
                  className={`py-2 px-4 rounded ${
                    isExecuting === id
                      ? 'bg-gray-400 cursor-not-allowed'
                      : 'bg-green-500 hover:bg-green-600'
                  } text-white`}
                >
                  {isExecuting === id ? 'Executing...' : 'Execute Transaction'}
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};