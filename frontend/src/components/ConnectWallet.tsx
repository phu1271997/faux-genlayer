import React, { useState } from 'react';
import { Wallet, AlertCircle, CheckCircle, ExternalLink, Shield } from 'lucide-react';
import { connectStudionetWallet, formatAddress, STUDIONET_CHAIN } from '../lib/genlayer';

interface ConnectWalletProps {
  onConnected?: (address: string, client: any) => void;
}

export const ConnectWallet: React.FC<ConnectWalletProps> = ({ onConnected }) => {
  const [address, setAddress] = useState<string | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleConnect = async () => {
    setIsConnecting(true);
    setError(null);
    try {
      const { client, address: walletAddr } = await connectStudionetWallet();
      setAddress(walletAddr);
      if (onConnected) {
        onConnected(walletAddr, client);
      }
    } catch (err: any) {
      setError(err?.message || 'Failed to connect wallet on studionet.');
    } finally {
      setIsConnecting(false);
    }
  };

  return (
    <div className="flex flex-col items-end gap-2">
      {address ? (
        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-purple-500/10 text-purple-300 border border-purple-500/20 text-xs">
            <Shield className="w-3.5 h-3.5" />
            <span>studionet ({STUDIONET_CHAIN.id})</span>
          </div>
          <button className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-dark-700 hover:bg-dark-600 text-white border border-white/10 text-sm font-medium transition-colors">
            <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
            <span>{formatAddress(address)}</span>
          </button>
        </div>
      ) : (
        <button
          onClick={handleConnect}
          disabled={isConnecting}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-500 hover:to-cyan-500 text-white font-medium text-sm shadow-lg shadow-purple-500/20 transition-all transform active:scale-95 disabled:opacity-50"
        >
          <Wallet className="w-4 h-4" />
          <span>{isConnecting ? 'Connecting...' : 'Connect Wallet'}</span>
        </button>
      )}

      {error && (
        <div className="flex items-center gap-1.5 text-xs text-rose-400 bg-rose-500/10 px-3 py-1.5 rounded-lg border border-rose-500/20 max-w-xs">
          <AlertCircle className="w-3.5 h-3.5 shrink-0" />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
};
