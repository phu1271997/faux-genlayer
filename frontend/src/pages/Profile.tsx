import React from 'react';
import { UserCheck, Award, Shield, CheckCircle2, XCircle, TrendingUp } from 'lucide-react';
import { formatAddress, formatGen } from '../lib/genlayer';

interface ProfileProps {
  walletAddress: string | null;
}

export const Profile: React.FC<ProfileProps> = ({ walletAddress }) => {
  const displayAddress = walletAddress || '0x71C7656EC7ab88b098defB751B7401B5f6d8976F';

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-16">
      {/* Header Profile Card */}
      <div className="glass-card rounded-2xl p-6 sm:p-8 space-y-4 border-purple-500/20">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-purple-600 via-cyan-500 to-pink-500 p-0.5 shadow-lg shadow-purple-500/20">
              <div className="w-full h-full bg-dark-900 rounded-[14px] flex items-center justify-center">
                <UserCheck className="w-7 h-7 text-purple-400" />
              </div>
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-white font-['Outfit'] font-mono">
                {formatAddress(displayAddress)}
              </h2>
              <div className="flex items-center gap-2 text-xs text-slate-400">
                <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                <span>GenLayer studionet participant</span>
              </div>
            </div>
          </div>

          <div className="px-4 py-2 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-300 text-xs font-semibold">
            FauxReputation On-Chain Profile
          </div>
        </div>
      </div>

      {/* Reputation Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="glass-card p-5 rounded-2xl space-y-2">
          <div className="flex items-center justify-between text-slate-400 text-xs font-semibold">
            <span>Accuracy Rate</span>
            <TrendingUp className="w-4 h-4 text-emerald-400" />
          </div>
          <p className="text-3xl font-extrabold text-white font-['Outfit']">87.5%</p>
          <p className="text-[11px] text-slate-400">8,750 basis points (accuracy_bp)</p>
        </div>

        <div className="glass-card p-5 rounded-2xl space-y-2">
          <div className="flex items-center justify-between text-slate-400 text-xs font-semibold">
            <span>Correct Predictions</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          </div>
          <p className="text-3xl font-extrabold text-emerald-400 font-['Outfit']">7</p>
          <p className="text-[11px] text-slate-400">Cases correctly staked</p>
        </div>

        <div className="glass-card p-5 rounded-2xl space-y-2">
          <div className="flex items-center justify-between text-slate-400 text-xs font-semibold">
            <span>Wrong Predictions</span>
            <XCircle className="w-4 h-4 text-rose-400" />
          </div>
          <p className="text-3xl font-extrabold text-rose-400 font-['Outfit']">1</p>
          <p className="text-[11px] text-slate-400">Cases lost to consensus</p>
        </div>

        <div className="glass-card p-5 rounded-2xl space-y-2">
          <div className="flex items-center justify-between text-slate-400 text-xs font-semibold">
            <span>Total Staked</span>
            <Award className="w-4 h-4 text-purple-400" />
          </div>
          <p className="text-3xl font-extrabold text-purple-300 font-['Outfit']">850 GEN</p>
          <p className="text-[11px] text-slate-400">Cumulative escrow volume</p>
        </div>
      </div>

      {/* Leaderboard Section */}
      <div className="glass-card rounded-2xl p-6 space-y-4">
        <h3 className="text-lg font-bold text-white font-['Outfit']">Faux Community Leaderboard</h3>
        <p className="text-xs text-slate-400">Top stakers ranked by accuracy_bp recorded on `FauxReputation` contract.</p>

        <div className="space-y-2">
          <div className="flex items-center justify-between p-3.5 rounded-xl bg-dark-900/60 border border-white/5 text-xs text-slate-300">
            <div className="flex items-center gap-3">
              <span className="w-6 font-bold text-amber-400 font-mono">#1</span>
              <span className="font-mono text-white">0x71C7656EC7ab88b098defB751B7401B5f6d8976F</span>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-emerald-400 font-bold">87.5%</span>
              <span className="text-purple-300 font-mono">850 GEN</span>
            </div>
          </div>

          <div className="flex items-center justify-between p-3.5 rounded-xl bg-dark-900/40 border border-white/5 text-xs text-slate-400">
            <div className="flex items-center gap-3">
              <span className="w-6 font-bold text-slate-400 font-mono">#2</span>
              <span className="font-mono text-slate-300">0x3C44CdD46a935571ed359B09d73d2a7c4a17955F</span>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-emerald-400 font-bold">83.3%</span>
              <span className="text-purple-300 font-mono">600 GEN</span>
            </div>
          </div>

          <div className="flex items-center justify-between p-3.5 rounded-xl bg-dark-900/40 border border-white/5 text-xs text-slate-400">
            <div className="flex items-center gap-3">
              <span className="w-6 font-bold text-slate-400 font-mono">#3</span>
              <span className="font-mono text-slate-300">0x90F79bf6EB2c4f870365E785982E1f101E93b906</span>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-emerald-400 font-bold">80.0%</span>
              <span className="text-purple-300 font-mono">420 GEN</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
