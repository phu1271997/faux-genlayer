import React, { useState } from 'react';
import { Navbar } from './components/Navbar';
import { Home } from './pages/Home';
import { NewCase } from './pages/NewCase';
import { CaseDetail } from './pages/CaseDetail';
import { Profile } from './pages/Profile';
import { ExternalLink, ShieldAlert } from 'lucide-react';

export function App() {
  const [activeTab, setActiveTab] = useState<string>('home');
  const [selectedCaseId, setSelectedCaseId] = useState<string | null>(null);
  const [walletAddress, setWalletAddress] = useState<string | null>(null);

  const handleSelectCase = (id: string) => {
    setSelectedCaseId(id);
    setActiveTab('detail');
  };

  const handleWalletConnected = (address: string) => {
    setWalletAddress(address);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#0a0d14] text-slate-100 font-['Inter',sans-serif]">
      {/* Top Banner Notice */}
      <div className="bg-gradient-to-r from-purple-900/60 via-dark-800 to-cyan-900/60 border-b border-purple-500/20 px-4 py-2 text-center text-xs text-purple-200 flex items-center justify-center gap-2">
        <ShieldAlert className="w-4 h-4 text-cyan-400 shrink-0" />
        <span>
          Deployed on <strong>GenLayer studionet</strong> (`chainId 61999` / `0xF1EF`). Please ensure your MetaMask holds GEN on studionet.
        </span>
        <a
          href="https://studio.genlayer.com"
          target="_blank"
          rel="noreferrer"
          className="underline font-bold hover:text-white flex items-center gap-1"
        >
          Studio Panel <ExternalLink className="w-3 h-3" />
        </a>
      </div>

      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        walletAddress={walletAddress}
        onConnected={handleWalletConnected}
      />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        {activeTab === 'home' && (
          <Home
            onSelectCase={handleSelectCase}
            onNewCase={() => setActiveTab('new')}
          />
        )}

        {activeTab === 'new' && (
          <NewCase
            onBack={() => setActiveTab('home')}
            onCreated={(caseId) => {
              setSelectedCaseId(caseId);
              setActiveTab('detail');
            }}
          />
        )}

        {activeTab === 'detail' && (
          <CaseDetail
            caseId={selectedCaseId || 'case-1'}
            onBack={() => setActiveTab('home')}
          />
        )}

        {activeTab === 'profile' && (
          <Profile walletAddress={walletAddress} />
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-white/10 py-8 bg-dark-900/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <div>
            <p className="font-semibold text-slate-300">Faux — Deepfake Bounty Marketplace</p>
            <p>Optimistic Democracy AI Jury Consensus on GenLayer studionet.</p>
          </div>
          <div className="flex items-center gap-4">
            <a href="https://studio.genlayer.com" target="_blank" rel="noreferrer" className="hover:text-white transition-colors">GenLayer Studio</a>
            <a href="https://portal.genlayer.foundation" target="_blank" rel="noreferrer" className="hover:text-white transition-colors">Builder Portal</a>
            <a href="https://genlayer-explorer.vercel.app" target="_blank" rel="noreferrer" className="hover:text-white transition-colors">Explorer</a>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
