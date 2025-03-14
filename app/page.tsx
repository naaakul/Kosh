// File location: ./app/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useWallet } from '@aptos-labs/wallet-adapter-react';
import { WalletConnection } from '../components/WalletConnection';
import { AnalysisResults } from '../components/AnalysisResults';
import { fetchUserDeFiPositions } from '../utils/defiData';
import { AIAnalysisResult, DeFiProtocol, TransactionRecommendation } from '../types';

export default function Home() {
  const { account, connected } = useWallet();
  const [positions, setPositions] = useState<DeFiProtocol[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [analysis, setAnalysis] = useState<AIAnalysisResult | null>(null);
  const [riskPreference, setRiskPreference] = useState<'conservative' | 'balanced' | 'aggressive'>('balanced');

  useEffect(() => {
    const loadPositions = async () => {
      if (connected && account?.address) {
        setIsLoading(true);
        try {
          const userPositions = await fetchUserDeFiPositions(account.address.toString());
          setPositions(userPositions);
        } catch (error) {
          console.error('Failed to load DeFi positions:', error);
        } finally {
          setIsLoading(false);
        }
      }
    };

    loadPositions();
  }, [connected, account?.address]);

  const analyzePositions = async () => {
    if (!connected || !account?.address || positions.length === 0) {
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch('/api/ai/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          walletAddress: account.address,
          positions,
          riskPreference,
        }),
      });

      if (!response.ok) {
        throw new Error('AI analysis failed');
      }

      const result = await response.json();
      setAnalysis(result);
    } catch (error) {
      console.error('Error analyzing positions:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const executeTransaction = async (recommendation: TransactionRecommendation) => {
    // In a real app, this would create and execute a blockchain transaction
    console.log('Executing transaction:', recommendation);
    
    // Simulate a transaction
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Update positions after transaction (mock)
    if (recommendation.fromProtocol) {
      setPositions(prev => 
        prev.map(p => {
          if (p.name === recommendation.fromProtocol?.name) {
            return { ...p, balanceUSD: p.balanceUSD - recommendation.amountUSD };
          }
          if (p.name === recommendation.toProtocol.name) {
            return { ...p, balanceUSD: p.balanceUSD + recommendation.amountUSD };
          }
          return p;
        })
      );
    }
    
    // Re-analyze after transaction
    await analyzePositions();
  };

  return (
    <main className="min-h-screen">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">AI-Powered DeFi Optimizer</h1>
        
        <WalletConnection />
        
        {connected && positions.length > 0 && (
          <>
            <div className="border rounded-lg p-4 mb-4">
              <h2 className="text-xl font-bold mb-4">Your DeFi Positions</h2>
              <div className="overflow-x-auto">
                <table className="min-w-full">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="py-2 px-4 text-left">Protocol</th>
                      <th className="py-2 px-4 text-left">Chain</th>
                      <th className="py-2 px-4 text-left">Token</th>
                      <th className="py-2 px-4 text-right">Balance (USD)</th>
                      <th className="py-2 px-4 text-right">APY (%)</th>
                      <th className="py-2 px-4 text-center">Risk Level</th>
                    </tr>
                  </thead>
                  <tbody>
                    {positions.map((position, index) => (
                      <tr key={index} className="border-t">
                        <td className="py-2 px-4">{position.name}</td>
                        <td className="py-2 px-4">{position.chain}</td>
                        <td className="py-2 px-4">{position.tokenSymbol}</td>
                        <td className="py-2 px-4 text-right">${position.balanceUSD.toFixed(2)}</td>
                        <td className="py-2 px-4 text-right">{position.apy.toFixed(1)}%</td>
                        <td className="py-2 px-4 text-center">
                          <span className={`inline-block px-2 py-1 rounded text-xs ${
                            position.riskLevel === 'low' 
                              ? 'bg-green-100 text-green-800' 
                              : position.riskLevel === 'medium'
                                ? 'bg-yellow-100 text-yellow-800'
                                : 'bg-red-100 text-red-800'
                          }`}>
                            {position.riskLevel.charAt(0).toUpperCase() + position.riskLevel.slice(1)}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              <div className="mt-4">
                <div className="mb-3">
                  <label className="block text-sm font-medium mb-1">Risk Preference</label>
                  <select
                    value={riskPreference}
                    onChange={(e) => setRiskPreference(e.target.value as any)}
                    className="w-full p-2 border rounded"
                  >
                    <option value="conservative">Conservative</option>
                    <option value="balanced">Balanced</option>
                    <option value="aggressive">Aggressive</option>
                  </select>
                </div>
                
                <button
                  onClick={analyzePositions}
                  disabled={isLoading}
                  className={`py-2 px-4 rounded ${
                    isLoading 
                      ? 'bg-gray-400 cursor-not-allowed' 
                      : 'bg-blue-500 hover:bg-blue-600'
                  } text-white`}
                >
                  {isLoading ? 'Analyzing...' : 'Analyze & Optimize'}
                </button>
              </div>
            </div>
            
            {analysis && (
              <AnalysisResults 
                analysis={analysis} 
                onExecuteTransaction={executeTransaction} 
              />
            )}
          </>
        )}
        
        {connected && positions.length === 0 && !isLoading && (
          <div className="border rounded-lg p-4 mb-4 bg-yellow-50">
            <p>No DeFi positions found for this wallet. Please connect a wallet with existing DeFi positions.</p>
          </div>
        )}
        
        {isLoading && (
          <div className="flex justify-center items-center p-8">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        )}
      </div>
    </main>
  );
}