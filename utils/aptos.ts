// File location: ./app/utils/aptos.ts
import { Aptos, Network, AptosConfig } from '@aptos-labs/ts-sdk';

// Initialize the Aptos client
const createAptosClient = () => {
  const config = new AptosConfig({ network: Network.TESTNET });
  return new Aptos(config);
};

export const fetchAccountResources = async (address: string) => {
  try {
    const client = createAptosClient();
    const resources = await client.getAccountResources({ accountAddress: address });
    return resources;
  } catch (error) {
    console.error('Error fetching account resources:', error);
    throw error;
  }
};

export const executeTransaction = async (
  sender: string,
  privateKey: string, // Note: In production, never expose private keys directly
  payload: any
) => {
  try {
    const client = createAptosClient();
    // Implementation would depend on the specific transaction
    // This is a placeholder for actual transaction execution
    console.log('Executing transaction:', payload);
    return { success: true, txHash: 'sample_hash' };
  } catch (error) {
    console.error('Error executing transaction:', error);
    throw error;
  }
};