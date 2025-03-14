// File location: ./app/components/WalletConnection.tsx
'use client';

import { useEffect, useState } from 'react';
import { AptosWalletAdapterProvider, useWallet } from '@aptos-labs/wallet-adapter-react';
import { PetraWallet } from 'petra-plugin-wallet-adapter';


const wallets = [
    new PetraWallet(),
];

export const WalletConnection = () => {
  const { connect, account, connected, disconnect, wallet } = useWallet();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return null; // Prevent rendering during SSR
  }

  const handleConnect = async (walletName: string) => {
    try {
      await connect(walletName);
    } catch (error) {
      console.error('Failed to connect wallet:', error);
    }
  };

  return (
    <div className="border rounded-lg p-4 mb-4">
      <h2 className="text-xl font-bold mb-4">Wallet Connection</h2>
      
      {!connected ? (
        <div className="flex flex-wrap gap-2">
          {wallets.map((wallet) => (
            <button
              key={wallet.name}
              onClick={() => handleConnect(wallet.name)}
              className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded"
            >
              Connect {wallet.name}
            </button>
          ))}
        </div>
      ) : (
        <div>
          <div className="mb-2">
            <span className="font-semibold">Connected Wallet:</span> {wallet?.name}
          </div>
          <div className="mb-2">
            <span className="font-semibold">Address:</span>{' '}
            <code className="bg-gray-100 p-1 rounded">{account?.address?.toString()}</code>
          </div>
          <button
            onClick={disconnect}
            className="bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded"
          >
            Disconnect
          </button>
        </div>
      )}
    </div>
  );
};

export const WalletConnectionProvider: React.FC<{ children: React.ReactNode }> = ({ 
  children 
}) => {
    const wallets = [new PetraWallet()];
  return (
    <AptosWalletAdapterProvider plugins={wallets} autoConnect={false}>
      {children}
    </AptosWalletAdapterProvider>
  );
};
