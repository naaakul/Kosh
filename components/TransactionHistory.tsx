// File location: ./app/components/TransactionHistory.tsx
'use client';

import { useState, useEffect } from 'react';

interface Transaction {
  id: string;
  date: Date;
  type: 'deposit' | 'withdraw' | 'optimize';
  fromProtocol?: string;
  toProtocol?: string;
  amount: number;
  status: 'completed' | 'pending' | 'failed';
}

interface TransactionHistoryProps {
  walletAddress: string;
}

export const TransactionHistory: React.FC<TransactionHistoryProps> = ({ walletAddress }) => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchTransactions = async () => {
      // In a real app, this would fetch from backend/blockchain
      // For now, we'll use mock data
      setTimeout(() => {
        setTransactions([
          {
            id: '0x1234',
            date: new Date(Date.now() - 86400000), // Yesterday
            type: 'optimize',
            fromProtocol: 'Aries Markets',
            toProtocol: 'Liquidswap',
            amount: 500,
            status: 'completed'
          },
          {
            id: '0x5678',
            date: new Date(Date.now() - 172800000), // 2 days ago
            type: 'deposit',
            toProtocol: 'Aries Markets',
            amount: 1000,
            status: 'completed'
          },
          {
            id: '0x9abc',
            date: new Date(Date.now() - 259200000), // 3 days ago
            type: 'withdraw',
            fromProtocol: 'Tortuga Finance',
            amount: 250,
            status: 'completed'
          }
        ]);
        setIsLoading(false);
      }, 1000);
    };

    if (walletAddress) {
      fetchTransactions();
    }
  }, [walletAddress]);

  if (isLoading) {
    return (
      <div className="border rounded-lg p-4 mb-4">
        <h2 className="text-xl font-bold mb-4">Transaction History</h2>
        <div className="flex justify-center py-4">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="border rounded-lg p-4 mb-4">
      <h2 className="text-xl font-bold mb-4">Transaction History</h2>
      
      {transactions.length === 0 ? (
        <p className="text-gray-500">No transactions found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="bg-gray-100">
                <th className="py-2 px-4 text-left">Date</th>
                <th className="py-2 px-4 text-left">Type</th>
                <th className="py-2 px-4 text-left">From</th>
                <th className="py-2 px-4 text-left">To</th>
                <th className="py-2 px-4 text-right">Amount</th>
                <th className="py-2 px-4 text-center">Status</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((tx) => (
                <tr key={tx.id} className="border-t">
                  <td className="py-2 px-4">{tx.date.toLocaleDateString()}</td>
                  <td className="py-2 px-4 capitalize">{tx.type}</td>
                  <td className="py-2 px-4">{tx.fromProtocol || '-'}</td>
                  <td className="py-2 px-4">{tx.toProtocol || '-'}</td>
                  <td className="py-2 px-4 text-right">${tx.amount.toFixed(2)}</td>
                  <td className="py-2 px-4 text-center">
                    <span className={`inline-block px-2 py-1 rounded text-xs ${
                      tx.status === 'completed' 
                        ? 'bg-green-100 text-green-800' 
                        : tx.status === 'pending'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-red-100 text-red-800'
                    }`}>
                      {tx.status.charAt(0).toUpperCase() + tx.status.slice(1)}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};