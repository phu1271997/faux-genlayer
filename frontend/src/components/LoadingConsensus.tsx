import React from 'react';
import { Cpu, ShieldCheck, Globe, Scale, RefreshCw } from 'lucide-react';

interface LoadingConsensusProps {
  mediaUrl: string;
  onCancel?: () => void;
}

export const LoadingConsensus: React.FC<LoadingConsensusProps> = ({ mediaUrl }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
      <div className="glass-card max-w-lg w-full rounded-2xl p-6 border-purple-500/30 shadow-2xl relative overflow-hidden">
        {/* Ambient background glow */}
        <div className="absolute -top-24 -left-24 w-48 h-48 bg-purple-600/30 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-cyan-600/30 rounded-full blur-3xl pointer-events-none"></div>

        <div className="text-center space-y-4">
          <div className="relative inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-purple-500/10 border border-purple-500/30 text-purple-400 mb-2">
            <Cpu className="w-10 h-10 animate-pulse" />
            <RefreshCw className="w-16 h-16 absolute text-cyan-400/40 animate-spin" style={{ animationDuration: '6s' }} />
          </div>

          <h3 className="text-xl font-bold text-white tracking-wide">
            GenLayer AI Jury Adjudicating...
          </h3>

          <p className="text-sm text-slate-300 max-w-md mx-auto leading-relaxed">
            Non-deterministic execution in progress. GenLayer validators are independently fetching web evidence on-chain and evaluating forensic prompts.
          </p>

          <div className="space-y-2.5 pt-2 text-left text-xs bg-dark-900/60 p-4 rounded-xl border border-white/5">
            <div className="flex items-center gap-2 text-cyan-400">
              <Globe className="w-4 h-4 shrink-0 animate-spin" style={{ animationDuration: '3s' }} />
              <span className="truncate">1. Fetching <code className="bg-black/40 px-1 py-0.5 rounded text-slate-200">{mediaUrl}</code> on-chain...</span>
            </div>
            <div className="flex items-center gap-2 text-purple-400">
              <Cpu className="w-4 h-4 shrink-0" />
              <span>2. Generating LLM forensic evidence prompt...</span>
            </div>
            <div className="flex items-center gap-2 text-emerald-400">
              <Scale className="w-4 h-4 shrink-0" />
              <span>3. Running Optimistic Democracy validator consensus...</span>
            </div>
            <div className="flex items-center gap-2 text-amber-400">
              <ShieldCheck className="w-4 h-4 shrink-0" />
              <span>4. Finalizing state & verdict on GenLayer studionet (30–90s)</span>
            </div>
          </div>

          <div className="w-full bg-dark-900 rounded-full h-1.5 overflow-hidden">
            <div className="bg-gradient-to-r from-purple-500 via-cyan-400 to-pink-500 h-full w-2/3 animate-pulse rounded-full"></div>
          </div>

          <p className="text-xs text-slate-400 italic">
            Please wait for block finalization. Do not close this browser window.
          </p>
        </div>
      </div>
    </div>
  );
};
