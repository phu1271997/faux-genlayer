import React, { useState } from 'react';
import { Shield, Sparkles, AlertCircle, ArrowUpRight, Scale, Clock, ExternalLink } from 'lucide-react';
import { CaseData, DEMO_MOCK_CASES } from '../lib/contracts';
import { VerdictBadge } from '../components/VerdictBadge';
import { formatGen, formatAddress } from '../lib/genlayer';

interface HomeProps {
  onSelectCase: (caseId: string) => void;
  onNewCase: () => void;
}

export const Home: React.FC<HomeProps> = ({ onSelectCase, onNewCase }) => {
  const [filter, setFilter] = useState<'ALL' | 'OPEN' | 'RESOLVED'>('ALL');
  const [cases] = useState<CaseData[]>(DEMO_MOCK_CASES);

  const filteredCases = cases.filter((c) => {
    if (filter === 'OPEN') return c.status === 'OPEN';
    if (filter === 'RESOLVED') return c.status === 'RESOLVED' || c.status === 'REFUNDED';
    return true;
  });

  return (
    <div className="space-y-12 pb-16">
      {/* Hero Section */}
      <section className="relative pt-8 pb-12 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-gradient-to-b from-purple-600/15 via-cyan-500/5 to-transparent blur-3xl pointer-events-none -z-10"></div>
        
        <div className="max-w-4xl mx-auto text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-300 text-xs font-semibold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span>GenLayer Studionet Powered • Optimistic Democracy</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white leading-tight font-['Outfit']">
            Neutral Court for <br className="hidden sm:inline" />
            <span className="gradient-text">Deepfake Verification</span>
          </h1>

          <p className="text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Stake GEN tokens on media authenticity. GenLayer's decentralized AI jury reads multi-source evidence on-chain and delivers transparent, objective verdicts.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <button
              onClick={onNewCase}
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-500 hover:to-cyan-500 text-white font-semibold text-sm shadow-xl shadow-purple-500/25 transition-all transform hover:-translate-y-0.5"
            >
              Challenge a Media URL
            </button>
            <a
              href="https://studio.genlayer.com"
              target="_blank"
              rel="noreferrer"
              className="px-6 py-3 rounded-xl glass-card hover:bg-white/5 text-slate-200 font-semibold text-sm transition-all flex items-center gap-2 border border-white/10"
            >
              <span>GenLayer Studio</span>
              <ExternalLink className="w-4 h-4 text-slate-400" />
            </a>
          </div>

          {/* Quick Metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-8">
            <div className="glass-card p-4 rounded-xl text-center">
              <p className="text-2xl font-bold text-white font-['Outfit']">3</p>
              <p className="text-xs text-slate-400 font-medium">Active Contracts</p>
            </div>
            <div className="glass-card p-4 rounded-xl text-center">
              <p className="text-2xl font-bold text-purple-400 font-['Outfit']">1,270 GEN</p>
              <p className="text-xs text-slate-400 font-medium">Total Volume Staked</p>
            </div>
            <div className="glass-card p-4 rounded-xl text-center">
              <p className="text-2xl font-bold text-cyan-400 font-['Outfit']">93%</p>
              <p className="text-xs text-slate-400 font-medium">Avg AI Confidence</p>
            </div>
            <div className="glass-card p-4 rounded-xl text-center">
              <p className="text-2xl font-bold text-emerald-400 font-['Outfit']">2%</p>
              <p className="text-xs text-slate-400 font-medium">Protocol Fee</p>
            </div>
          </div>
        </div>
      </section>

      {/* Case Filtering & Grid */}
      <section className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
          <div>
            <h2 className="text-2xl font-bold text-white font-['Outfit']">Bounty Marketplace Cases</h2>
            <p className="text-sm text-slate-400">Explore community challenged media and AI consensus verdicts.</p>
          </div>

          <div className="flex items-center gap-1 bg-dark-800 p-1 rounded-xl border border-white/5 self-start">
            <button
              onClick={() => setFilter('ALL')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                filter === 'ALL' ? 'bg-purple-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              All Cases
            </button>
            <button
              onClick={() => setFilter('OPEN')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                filter === 'OPEN' ? 'bg-purple-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              Open Staking
            </button>
            <button
              onClick={() => setFilter('RESOLVED')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                filter === 'RESOLVED' ? 'bg-purple-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              Resolved Verdicts
            </button>
          </div>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCases.map((item) => (
            <div
              key={item.id}
              onClick={() => onSelectCase(item.id)}
              className="glass-card glass-card-hover rounded-2xl p-5 cursor-pointer flex flex-col justify-between space-y-4 group"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono text-slate-400 font-medium">#{item.id}</span>
                  <VerdictBadge
                    status={item.status}
                    verdict={item.verdict}
                    confidence={item.confidence}
                    size="sm"
                  />
                </div>

                {/* Media Image Preview */}
                <div className="relative h-44 rounded-xl overflow-hidden bg-dark-900 border border-white/5 group-hover:border-purple-500/30 transition-colors">
                  <img
                    src={item.media_url}
                    alt="Challenged media"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    onError={(e) => {
                      (e.target as HTMLElement).style.display = 'none';
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-dark-900/90 via-transparent to-transparent"></div>
                  <div className="absolute bottom-2.5 left-2.5 right-2.5 flex items-center justify-between text-xs text-slate-300">
                    <span className="truncate max-w-[180px] bg-black/60 backdrop-blur-md px-2 py-0.5 rounded text-[11px] font-mono">
                      {item.media_url}
                    </span>
                    <ArrowUpRight className="w-4 h-4 text-purple-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                </div>

                <p className="text-sm text-slate-200 line-clamp-2 leading-snug font-medium">
                  {item.description}
                </p>
              </div>

              {/* Pool & Stake Breakdown */}
              <div className="pt-3 border-t border-white/5 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-400">Total Pool Staked:</span>
                  <span className="font-bold text-purple-300">{formatGen(item.total_fake + item.total_real)}</span>
                </div>

                {/* Side ratio bar */}
                <div className="w-full bg-dark-900 h-2 rounded-full overflow-hidden flex">
                  <div
                    className="bg-rose-500 h-full transition-all"
                    style={{
                      width: `${
                        item.total_fake + item.total_real > 0
                          ? (item.total_fake / (item.total_fake + item.total_real)) * 100
                          : 50
                      }%`
                    }}
                    title="FAKE pool"
                  ></div>
                  <div
                    className="bg-emerald-500 h-full transition-all"
                    style={{
                      width: `${
                        item.total_fake + item.total_real > 0
                          ? (item.total_real / (item.total_fake + item.total_real)) * 100
                          : 50
                      }%`
                    }}
                    title="REAL pool"
                  ></div>
                </div>

                <div className="flex justify-between text-[11px] font-medium text-slate-400">
                  <span className="text-rose-400">FAKE: {formatGen(item.total_fake)}</span>
                  <span className="text-emerald-400">REAL: {formatGen(item.total_real)}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
