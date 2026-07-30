import { createClient } from 'genlayer-js';
import { simulator } from 'genlayer-js/chains';

export const STUDIONET_CHAIN = simulator;

export interface WalletState {
  address: string | null;
  client: any | null;
  isConnected: boolean;
  isConnecting: boolean;
  error: string | null;
}

export async function connectStudionetWallet(): Promise<{ client: any; address: string }> {
  if (typeof window === 'undefined' || !window.ethereum) {
    throw new Error('MetaMask or Web3 browser extension not detected.');
  }

  // 1. Request account access
  const accounts: string[] = await window.ethereum.request({
    method: 'eth_requestAccounts',
  });

  if (!accounts || accounts.length === 0) {
    throw new Error('No accounts selected in wallet.');
  }

  const address = accounts[0];

  // 2. Switch or add GenLayer Studionet network dynamically (R23)
  const chainIdHex = '0x' + (STUDIONET_CHAIN.id || 61999).toString(16); // 61999 = 0xF1EF

  try {
    await window.ethereum.request({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId: chainIdHex }],
    });
  } catch (switchError: any) {
    if (switchError.code === 4902 || switchError.code === -32603) {
      await window.ethereum.request({
        method: 'wallet_addEthereumChain',
        params: [
          {
            chainId: chainIdHex,
            chainName: 'Genlayer Studio Network',
            nativeCurrency: { name: 'GEN Token', symbol: 'GEN', decimals: 18 },
            rpcUrls: ['https://studio.genlayer.com/api'],
            blockExplorerUrls: ['https://genlayer-explorer.vercel.app'],
          },
        ],
      });
    } else {
      throw switchError;
    }
  }

  // 3. Initialize genlayer-js client with the ADDRESS STRING (MetaMask signs - R22)
  const client = createClient({
    chain: STUDIONET_CHAIN as any,
    account: address as any,
  });

  return { client, address };
}

export function formatAddress(addr: string): string {
  if (!addr || addr.length < 10) return addr;
  return `${addr.substring(0, 6)}...${addr.substring(addr.length - 4)}`;
}

export function formatGen(amountWei: number | bigint | string): string {
  try {
    const val = BigInt(amountWei);
    const whole = val / 10n**18n;
    const rem = (val % 10n**18n).toString().padStart(18, '0').slice(0, 2);
    return `${whole}.${rem} GEN`;
  } catch {
    return '0.00 GEN';
  }
}
