// File location: ./app/components/Dashboard.tsx
'use client';

import { useState, useEffect } from 'react';
import { DeFiProtocol } from '../types';

interface DashboardProps {
  positions: DeFiProtocol[];
  isLoading: boolean;
}

export const Dashboard: React.FC<DashboardProps> = ({ positions, isLoading }) => {
  const [totalValue, setTotalValue] = useState<number>(0);
  const [avgApy, setAvgApy] = useState<number>(0);
  const [portfolioRisk, setPortfolioRisk] = useState<string>('');

  useEffect(() => {
    if (positions.length > 0) {
      const total = positions.reduce((sum, pos) => sum + pos.balanceUSD, 0);
      
      const weightedApySum = positions.reduce(
        (sum, pos) => sum + (pos.apy * pos.balanceUSD),
        0
      );
      
      const avgApyValue = weightedApySum / total;
      
      // Calculate portfolio risk based on weighted average of risk levels
      const riskScores = { low: 1, medium: 2, high: 3 };
      const weightedRiskSum = positions.reduce(
        (sum, pos) => sum + (riskScores[pos.riskLevel] * pos.balanceUSD),
        0
      );
      
      const avgRiskScore = weightedRiskSum / total;
      
      let risk = 'Medium';
      if (avgRiskScore < 1.5) risk = 'Low';
      if (avgRiskScore > 2.5) risk = 'High';
      
      setTotalValue(total);
      setAvgApy(avgApyValue);
      setPortfolioRisk(risk);
    }
  }, [positions]);

  return (
    <div className="border rounded-lg p-4 mb-4">
      <h2 className="text-xl font-bold mb-4">Dashboard</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-blue-50 p-4 rounded-lg">
          <h3 className="text-sm font-medium text-blue-700">Total Value</h3>
          <p className="text-2xl font-bold">${totalValue.toFixed(2)}</p>
        </div>
        
        <div className="bg-green-50 p-4 rounded-lg">
          <h3 className="text-sm font-medium text-green-700">Average APY</h3>
          <p className="text-2xl font-bold">{avgApy.toFixed(2)}%</p>
        </div>
        
        <div className="bg-purple-50 p-4 rounded-lg">
          <h3 className="text-sm font-medium text-purple-700">Portfolio Risk</h3>
          <p className="text-2xl font-bold">{portfolioRisk}</p>
        </div>
      </div>
      
      <div className="mt-4">
        <h3 className="text-lg font-semibold mb-2">Portfolio Distribution</h3>
        <div className="h-8 bg-gray-200 rounded overflow-hidden">
          {positions.map((position, index) => {
            const percentage = (position.balanceUSD / totalValue) * 100;
            const colors = ['bg-blue-500', 'bg-green-500', 'bg-yellow-500', 'bg-red-500', 'bg-purple-500'];
            return (
              <div
                key={index}
                className={`h-full ${colors[index % colors.length]} float-left`}
                style={{ width: `${percentage}%` }}
                title={`${position.name}: ${percentage.toFixed(1)}%`}
              />
            );
          })}
        </div>
        <div className="mt-2 flex flex-wrap gap-2">
          {positions.map((position, index) => {
            const percentage = (position.balanceUSD / totalValue) * 100;
            const colors = ['bg-blue-500', 'bg-green-500', 'bg-yellow-500', 'bg-red-500', 'bg-purple-500'];
            return (
              <div key={index} className="flex items-center">
                <div className={`w-3 h-3 ${colors[index % colors.length]} rounded-full mr-1`} />
                <span className="text-xs">{position.name}: {percentage.toFixed(1)}%</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};