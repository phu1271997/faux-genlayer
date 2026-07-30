import React, { useState } from 'react';
import { ArrowLeft, ExternalLink, Cpu, ShieldCheck, Scale, AlertCircle, CheckCircle2, Clock, Globe, Award, HelpCircle } from 'lucide-react';
import { CaseData, DEMO_MOCK_CASES, CONTRACT_ADDRESSES } from '../lib/contracts';
import { VerdictBadge } from '../components/VerdictBadge';
import { LoadingConsensus } from '../components/LoadingConsensus';
import { connectStudionetWallet, formatGen, formatAddress } from '../lib/genlayer';

interface CaseDetailProps {
  caseId: string;
  onBack: () => void;
}

export const CaseDetail: React.FC<CaseDetailProps> = ({ caseId, onBack }) => {
  const [c, setCase] = useState<CaseData | undefined>(
    DEMO_MOCK_CASES.find((item) => item.id === caseId) || DEMO_MOCK_CASES[0]
  );

  const [stakeSide, setStakeSide] = useState<'CLAIM_FAKE' | 'CLAIM_REAL'>('CLAIM_FAKE');
  const [stakeAmount, setStakeAmount] = useState('25');
  const [isStaking, setIsStaking] = useState(false);
  const [isAdjudicating, setIsAdjudicating] = useState(false);
  const [isClaiming, setIsClaiming] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);

  if (!c) {
    return (
      <div className="text-center py-16 space-y-4">
        <p className="text-slate-400">Case not found.</p>
        <button onClick={onBack} className="text-purple-400 font-medium underline">Return to marketplace</button>
      </div>
    );
  }

  const handleStakeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setActionError(null);
    setActionSuccess(null);

    const val = parseFloat(stakeAmount);
    if (isNaN(val) || val <= 0) {
      setActionError('Please enter a valid stake amount > 0 GEN.');
      return;
    }

    setIsStaking(true);
    try {
      await connectStudionetWallet();
      setTimeout(() => {
        setIsStaking(false);
        const stakeWei = val * 1e18;
        setCase({
          ...c,
          total_fake: c.total_fake + (stakeSide === 'CLAIM_FAKE' ? stakeWei : 0),
          total_real: c.total_real + (stakeSide === 'CLAIM_REAL' ? stakeWei : 0)
        });
        setActionSuccess(`Successfully staked ${val} GEN on ${stakeSide}!`);
      }, 1200);
    } catch (err: any) {
      setActionError(err?.message || 'Failed to stake GEN.');
      setIsStaking(false);
    }
  };

  const handleAdjudicate = async () => {
    setActionError(null);
    setActionSuccess(null);
    setIsAdjudicating(true);

    try {
      await connectStudionetWallet();

      // Simulate non-deterministic AI consensus execution on GenLayer studionet
      setTimeout(() => {
        setIsAdjudicating(false);
        setCase({
          ...c,
          status: 'RESOLVED',
          verdict: 'FAKE',
          verdict_side: 'CLAIM_FAKE',
          confidence: 88,
          reason: 'Consensus reached across 3 validators. Spectral boundary artifacts and diffusion noise signatures confirmed manipulating foreground lighting.'
        });
        setActionSuccess('GenLayer AI Jury verdict finalized! Case status updated to RESOLVED.');
      }, 4000);
    } catch (err: any) {
      setActionError(err?.message || 'Adjudication consensus failed.');
      setIsAdjudicating(false);
    }
  };

  const handleClaimPayout = async () => {
    setActionError(null);
    setActionSuccess(null);
    setIsClaiming(true);

    try {
      await connectStudionetWallet();
      setTimeout(() => {
        setIsClaiming(false);
        setActionSuccess('Payout share successfully claimed and transferred to your wallet via Treasury!');
      }, 1500);
    } catch (err: any) {
      setActionError(err?.message || 'Claim payout failed.');
      setIsClaiming(false);
    }
  };

  return (
    <div className="space-y-6 pb-16 max-w-5xl mx-auto">
      {isAdjudicating && <LoadingConsensus mediaUrl={c.media_url} />}

      <button
        onClick={onBack}
        className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Marketplace</span>
      </button>

      {/* Header Banner */}
      <div className="glass-card rounded-2xl p-6 sm:p-8 border-purple-500/20 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono text-slate-400">CASE ID #{c.id}</span>
              <VerdictBadge status={c.status} verdict={c.verdict} confidence={c.confidence} size="md" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white font-['Outfit']">Deepfake Bounty Evaluation</h1>
          </div>

          {c.status === 'OPEN' && (
            <button
              onClick={handleAdjudicate}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-purple-600 hover:from-amber-400 hover:to-purple-500 text-white font-bold text-sm shadow-lg shadow-amber-500/20 transition-all flex items-center gap-2"
            >
              <Cpu className="w-4 h-4" />
              <span>Trigger GenLayer AI Jury Adjudication</span>
            </button>
          )}
        </div>

        {actionSuccess && (
          <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm flex items-center gap-2.5">
            <CheckCircle2 className="w-5 h-5 shrink-0" />
            <span>{actionSuccess}</span>
          </div>
        )}

        {actionError && (
          <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-sm flex items-center gap-2.5">
            <AlertCircle className="w-5 h-5 shrink-0" />
            <span>{actionError}</span>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Media & Evidence */}
        <div className="lg:col-span-2 space-y-6">
          {/* Media Preview Card */}
          <div className="glass-card rounded-2xl p-6 space-y-4">
            <h3 className="text-lg font-bold text-white font-['Outfit']">Challenged Media Target</h3>
            
            <div className="relative rounded-xl overflow-hidden bg-dark-900 border border-white/5 max-h-96">
              <img
                src={c.media_url}
                alt="Challenged media"
                className="w-full h-full object-contain mx-auto"
                onError={(e) => {
                  (e.target as HTMLElement).style.display = 'none';
                }}
              />
            </div>

            <div className="space-y-2">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Target URL</span>
              <a
                href={c.media_url}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 text-sm text-cyan-400 hover:text-cyan-300 transition-colors break-all bg-dark-900/60 p-3 rounded-xl border border-white/5"
              >
                <Globe className="w-4 h-4 shrink-0 text-slate-400" />
                <span className="truncate">{c.media_url}</span>
                <ExternalLink className="w-4 h-4 shrink-0 ml-auto" />
              </a>
            </div>

            <div className="space-y-2">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Forensic Claim Description</span>
              <p className="text-sm text-slate-200 bg-dark-900/60 p-4 rounded-xl border border-white/5 leading-relaxed">
                {c.description}
              </p>
            </div>
          </div>

          {/* Independent Evidence Sources */}
          <div className="glass-card rounded-2xl p-6 space-y-4">
            <h3 className="text-lg font-bold text-white font-['Outfit']">Independent Context Sources</h3>
            <p className="text-xs text-slate-400">GenLayer AI Jury validators fetch these URLs directly on-chain during Optimistic Democracy consensus execution.</p>

            <div className="space-y-2.5">
              {c.context_urls.length > 0 ? (
                c.context_urls.map((url, idx) => (
                  <a
                    key={idx}
                    href={url}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center justify-between p-3 rounded-xl bg-dark-900/60 hover:bg-dark-900 border border-white/5 text-xs text-slate-300 hover:text-white transition-colors"
                  >
                    <span className="truncate max-w-md">{url}</span>
                    <ExternalLink className="w-3.5 h-3.5 text-slate-400 shrink-0 ml-2" />
                  </a>
                ))
              ) : (
                <p className="text-xs text-slate-500 italic">No additional context URLs attached.</p>
              )}
            </div>
          </div>

          {/* AI Verdict Reasoning Breakdown (Visible when RESOLVED) */}
          {c.status === 'RESOLVED' && (
            <div className="glass-card rounded-2xl p-6 border-cyan-500/30 space-y-4 bg-gradient-to-b from-cyan-950/20 to-transparent">
              <div className="flex items-center gap-2">
                <Cpu className="w-5 h-5 text-cyan-400" />
                <h3 className="text-lg font-bold text-white font-['Outfit']">GenLayer AI Consensus Reasoning</h3>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-400 font-medium">Confidence Score:</span>
                  <span className="text-sm font-bold text-cyan-400">{c.confidence}%</span>
                </div>
                {/* Confidence Bar */}
                <div className="w-full bg-dark-900 h-2.5 rounded-full overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-purple-500 to-cyan-400 h-full rounded-full transition-all duration-500"
                    style={{ width: `${c.confidence}%` }}
                  ></div>
                </div>

                <div className="space-y-1.5 pt-2">
                  <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">AI Jury Explanation (`reason`)</span>
                  <p className="text-sm text-cyan-100 bg-dark-900/80 p-4 rounded-xl border border-cyan-500/20 leading-relaxed font-mono">
                    "{c.reason}"
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right 1 Col: Staking & Payout Sidebar */}
        <div className="space-y-6">
          {/* Pool Distribution Card */}
          <div className="glass-card rounded-2xl p-6 space-y-4">
            <h3 className="text-lg font-bold text-white font-['Outfit']">Stake Distribution Pool</h3>

            <div className="space-y-3">
              <div className="flex justify-between items-center text-sm">
                <span className="text-slate-400">Total Escrow Pool:</span>
                <span className="font-bold text-purple-300 text-base">{formatGen(c.total_fake + c.total_real)}</span>
              </div>

              <div className="w-full bg-dark-900 h-3 rounded-full overflow-hidden flex">
                <div
                  className="bg-rose-500 h-full transition-all"
                  style={{
                    width: `${
                      c.total_fake + c.total_real > 0
                        ? (c.total_fake / (c.total_fake + c.total_real)) * 100
                        : 50
                    }%`
                  }}
                ></div>
                <div
                  className="bg-emerald-500 h-full transition-all"
                  style={{
                    width: `${
                      c.total_fake + c.total_real > 0
                        ? (c.total_real / (c.total_fake + c.total_real)) * 100
                        : 50
                    }%`
                  }}
                ></div>
              </div>

              <div className="grid grid-cols-2 gap-2 text-center pt-1">
                <div className="bg-rose-500/10 border border-rose-500/20 p-2.5 rounded-xl">
                  <p className="text-xs text-rose-400 font-semibold">CLAIM FAKE</p>
                  <p className="text-sm font-bold text-white">{formatGen(c.total_fake)}</p>
                </div>
                <div className="bg-emerald-500/10 border border-emerald-500/20 p-2.5 rounded-xl">
                  <p className="text-xs text-emerald-400 font-semibold">CLAIM REAL</p>
                  <p className="text-sm font-bold text-white">{formatGen(c.total_real)}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Staking Action Form */}
          {c.status === 'OPEN' ? (
            <div className="glass-card rounded-2xl p-6 space-y-4">
              <h3 className="text-lg font-bold text-white font-['Outfit']">Stake GEN Tokens</h3>

              <form onSubmit={handleStakeSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setStakeSide('CLAIM_FAKE')}
                    className={`py-2.5 rounded-xl font-semibold text-xs border transition-all ${
                      stakeSide === 'CLAIM_FAKE'
                        ? 'bg-rose-500/20 text-rose-300 border-rose-500/40'
                        : 'bg-dark-900 border-white/5 text-slate-400'
                    }`}
                  >
                    CLAIM FAKE
                  </button>
                  <button
                    type="button"
                    onClick={() => setStakeSide('CLAIM_REAL')}
                    className={`py-2.5 rounded-xl font-semibold text-xs border transition-all ${
                      stakeSide === 'CLAIM_REAL'
                        ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                        : 'bg-dark-900 border-white/5 text-slate-400'
                    }`}
                  >
                    CLAIM REAL
                  </button>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-slate-300">Amount (GEN)</label>
                  <div className="relative">
                    <input
                      type="number"
                      min="1"
                      step="1"
                      required
                      value={stakeAmount}
                      onChange={(e) => setStakeAmount(e.target.value)}
                      className="w-full bg-dark-900/80 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-purple-500 font-mono"
                    />
                    <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-purple-400">GEN</span>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isStaking}
                  className="w-full py-3 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-sm shadow-lg shadow-purple-500/20 transition-all disabled:opacity-50"
                >
                  {isStaking ? 'Staking...' : `Stake ${stakeAmount} GEN on ${stakeSide}`}
                </button>
              </form>
            </div>
          ) : (
            c.status === 'RESOLVED' && (
              <div className="glass-card rounded-2xl p-6 space-y-4 border-emerald-500/20">
                <div className="flex items-center gap-2">
                  <Award className="w-5 h-5 text-emerald-400" />
                  <h3 className="text-lg font-bold text-white font-['Outfit']">Claim Payout Share</h3>
                </div>

                <p className="text-xs text-slate-300">
                  Winning stakers receive their initial deposit plus their prorata share of the losing pool (minus 2% protocol fee).
                </p>

                <button
                  onClick={handleClaimPayout}
                  disabled={isClaiming}
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-cyan-600 hover:from-emerald-500 hover:to-cyan-500 text-white font-bold text-sm shadow-lg shadow-emerald-500/20 transition-all disabled:opacity-50"
                >
                  {isClaiming ? 'Claiming...' : 'Claim Winning Share via Treasury'}
                </button>
              </div>
            )
          )}

          {/* On-chain Details */}
          <div className="glass-card rounded-2xl p-6 space-y-3 text-xs text-slate-400">
            <div className="flex justify-between">
              <span>Submitter:</span>
              <span className="font-mono text-slate-200">{formatAddress(c.submitter)}</span>
            </div>
            <div className="flex justify-between">
              <span>Protocol Fee:</span>
              <span className="font-semibold text-purple-400">2%</span>
            </div>
            <div className="flex justify-between">
              <span>Network:</span>
              <span className="font-semibold text-cyan-400">GenLayer studionet</span>
            </div>
            <div className="pt-2 border-t border-white/5">
              <a
                href="https://genlayer-explorer.vercel.app"
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-between text-slate-300 hover:text-white transition-colors"
              >
                <span>View on GenLayer Explorer</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
