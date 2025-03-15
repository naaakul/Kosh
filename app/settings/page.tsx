// File location: ./app/settings/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useWallet } from '@aptos-labs/wallet-adapter-react';
import { WalletConnection } from '../../components/WalletConnection';

export default function SettingsPage() {
  const { connected, account } = useWallet();
  const [riskPreference, setRiskPreference] = useState<'conservative' | 'balanced' | 'aggressive'>('balanced');
  const [autoOptimize, setAutoOptimize] = useState<boolean>(false);
  const [minAPYChange, setMinAPYChange] = useState<number>(0.5);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [savedMessage, setSavedMessage] = useState<string>('');

  useEffect(() => {
    const loadSettings = async () => {
      // In a real app, this would load from backend/blockchain
      // For now, we'll use local storage
      if (connected && account?.address) {
        const storedSettings = localStorage.getItem(`settings_${account.address}`);
        if (storedSettings) {
          const settings = JSON.parse(storedSettings);
          setRiskPreference(settings.riskPreference || 'balanced');
          setAutoOptimize(settings.autoOptimize || false);
          setMinAPYChange(settings.minAPYChange || 0.5);
        }
      }
    };

    loadSettings();
  }, [connected, account?.address]);

  const saveSettings = async () => {
    if (connected && account?.address) {
      setIsSaving(true);
      
      // In a real app, this would save to backend/blockchain
      // For now, we'll use local storage
      const settings = {
        riskPreference,
        autoOptimize,
        minAPYChange
      };
      
      localStorage.setItem(`settings_${account.address}`, JSON.stringify(settings));
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setIsSaving(false);
      setSavedMessage('Settings saved successfully!');
      
      // Clear message after 3 seconds
      setTimeout(() => {
        setSavedMessage('');
      }, 3000);
    }
  };

  return (
    <main className="min-h-screen">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Settings</h1>
        
        <WalletConnection />
        
        {connected ? (
          <div className="border rounded-lg p-4">
            <h2 className="text-xl font-bold mb-4">Preferences</h2>
            
            <div className="space-y-4">
              <div>
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
                <p className="text-sm text-gray-500 mt-1">
                  {riskPreference === 'conservative' 
                    ? 'Prioritize safety over maximum returns'
                    : riskPreference === 'balanced'
                      ? 'Balance between risk and reward'
                      : 'Maximize returns accepting higher risk'}
                </p>
              </div>
              
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="autoOptimize"
                  checked={autoOptimize}
                  onChange={(e) => setAutoOptimize(e.target.checked)}
                  className="mr-2"
                />
                <label htmlFor="autoOptimize">Auto-optimize (automatically execute AI recommendations)</label>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">
                  Minimum APY Change (%)
                </label>
                <input
                  type="number"
                  value={minAPYChange}
                  onChange={(e) => setMinAPYChange(parseFloat(e.target.value))}
                  step="0.1"
                  min="0.1"
                  className="w-full p-2 border rounded"
                />
                <p className="text-sm text-gray-500 mt-1">
                  Only recommend optimizations that increase APY by at least this percentage
                </p>
              </div>
              
              <div className="mt-6">
                <button
                  onClick={saveSettings}
                  disabled={isSaving}
                  className={`py-2 px-4 rounded ${
                    isSaving 
                      ? 'bg-gray-400 cursor-not-allowed' 
                      : 'bg-blue-500 hover:bg-blue-600'
                  } text-white`}
                >
                  {isSaving ? 'Saving...' : 'Save Settings'}
                </button>
                
                {savedMessage && (
                  <p className="text-green-500 mt-2">{savedMessage}</p>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="border rounded-lg p-4 bg-yellow-50">
            <p>Please connect your wallet to manage settings.</p>
          </div>
        )}
      </div>
    </main>
  );
}