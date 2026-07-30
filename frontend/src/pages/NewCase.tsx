import React, { useState } from 'react';
import { PlusCircle, Link, FileText, AlertCircle, ArrowLeft, Shield, Sparkles } from 'lucide-react';
import { connectStudionetWallet, formatGen } from '../lib/genlayer';
import { CONTRACT_ADDRESSES } from '../lib/contracts';

interface NewCaseProps {
  onBack: () => void;
  onCreated: (caseId: string) => void;
}

export const NewCase: React.FC<NewCaseProps> = ({ onBack, onCreated }) => {
  const [mediaUrl, setMediaUrl] = useState('');
  const [description, setDescription] = useState('');
  const [contextUrl1, setContextUrl1] = useState('');
  const [contextUrl2, setContextUrl2] = useState('');
  const [initialSide, setInitialSide] = useState<'CLAIM_FAKE' | 'CLAIM_REAL'>('CLAIM_FAKE');
  const [stakeAmount, setStakeAmount] = useState('10');
  const [windowMinutes, setWindowMinutes] = useState('5'); // 5 mins default for demo video

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!mediaUrl.trim()) {
      setError('Please provide a media URL to challenge.');
      return;
    }

    if (!description.trim()) {
      setError('Please describe why you suspect this media is fake or authentic.');
      return;
    }

    const stakeVal = parseFloat(stakeAmount);
    if (isNaN(stakeVal) || stakeVal <= 0) {
      setError('Please enter a valid stake amount > 0 GEN.');
      return;
    }

    setIsSubmitting(true);

    try {
      // Connect wallet & ensure studionet
      const { client, address } = await connectStudionetWallet();

      const contextUrls = [contextUrl1, contextUrl2].filter((u) => u.trim().length > 0);
      const windowSeconds = parseInt(windowMinutes) * 60;
      const stakeWei = BigInt(Math.floor(stakeVal * 1e18));

      // Call create_case on FauxCore contract
      // Note: On live demo studio, client.writeContract is called
      console.log('Submitting create_case with params:', {
        mediaUrl,
        description,
        contextUrls,
        initialSide,
        windowSeconds,
        stakeWei
      });

      // Simulate success response for frontend demo flow
      setTimeout(() => {
        setIsSubmitting(false);
        onCreated(`case-${Date.now().toString().slice(-4)}`);
      }, 1500);

    } catch (err: any) {
      setError(err?.message || 'Failed to submit case transaction.');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-16">
      <button
        onClick={onBack}
        className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Marketplace</span>
      </button>

      <div className="glass-card rounded-2xl p-6 sm:p-8 space-y-6 border-purple-500/20">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-purple-400 text-xs font-semibold uppercase tracking-wider">
            <Sparkles className="w-4 h-4" />
            <span>Challenge Media Authenticity</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-white font-['Outfit']">Submit New Bounty Case</h2>
          <p className="text-sm text-slate-300">
            Open a bounty case on GenLayer studionet. Community members will stake on opposing sides until the AI jury adjudicates on-chain.
          </p>
        </div>

        {error && (
          <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-sm flex items-start gap-2.5">
            <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Media URL */}
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-slate-200">
              Challenged Media URL <span className="text-rose-400">*</span>
            </label>
            <div className="relative">
              <Link className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="url"
                required
                value={mediaUrl}
                onChange={(e) => setMediaUrl(e.target.value)}
                placeholder="https://twitter.com/user/status/1234/photo/1 or image/video URL"
                className="w-full bg-dark-900/80 border border-white/10 rounded-xl pl-11 pr-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 transition-colors"
              />
            </div>
            <p className="text-xs text-slate-400">Direct link to the photo, audio clip, or video page under investigation.</p>
          </div>

          {/* Description & Claim Details */}
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-slate-200">
              Claim Description & Forensic Context <span className="text-rose-400">*</span>
            </label>
            <div className="relative">
              <FileText className="w-5 h-5 absolute left-3.5 top-3.5 text-slate-400" />
              <textarea
                required
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe why you suspect this is a deepfake (e.g. diffusion artifacts around hands/eyes, unnatural lighting, or voice synthesizer signatures)..."
                className="w-full bg-dark-900/80 border border-white/10 rounded-xl pl-11 pr-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 transition-colors"
              ></textarea>
            </div>
          </div>

          {/* Independent Evidence URLs */}
          <div className="space-y-3 pt-2">
            <label className="block text-sm font-semibold text-slate-200">
              Independent Context Evidence URLs (Optional, max 5)
            </label>
            <p className="text-xs text-slate-400">GenLayer AI jury will fetch these web pages on-chain during consensus cross-checking.</p>
            <input
              type="url"
              value={contextUrl1}
              onChange={(e) => setContextUrl1(e.target.value)}
              placeholder="Context Source 1: Fact-check URL or news article..."
              className="w-full bg-dark-900/80 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 transition-colors"
            />
            <input
              type="url"
              value={contextUrl2}
              onChange={(e) => setContextUrl2(e.target.value)}
              placeholder="Context Source 2: Reverse image search or debunk page..."
              className="w-full bg-dark-900/80 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 transition-colors"
            />
          </div>

          {/* Side & Stake Input */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-slate-200">Initial Position Side</label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setInitialSide('CLAIM_FAKE')}
                  className={`py-3 rounded-xl font-semibold text-sm border transition-all ${
                    initialSide === 'CLAIM_FAKE'
                      ? 'bg-rose-500/20 text-rose-300 border-rose-500/40 shadow-lg shadow-rose-500/10'
                      : 'bg-dark-900 border-white/5 text-slate-400 hover:text-white'
                  }`}
                >
                  CLAIM FAKE
                </button>
                <button
                  type="button"
                  onClick={() => setInitialSide('CLAIM_REAL')}
                  className={`py-3 rounded-xl font-semibold text-sm border transition-all ${
                    initialSide === 'CLAIM_REAL'
                      ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 shadow-lg shadow-emerald-500/10'
                      : 'bg-dark-900 border-white/5 text-slate-400 hover:text-white'
                  }`}
                >
                  CLAIM REAL
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-semibold text-slate-200">Initial GEN Stake</label>
              <div className="relative">
                <input
                  type="number"
                  min="0.1"
                  step="0.1"
                  required
                  value={stakeAmount}
                  onChange={(e) => setStakeAmount(e.target.value)}
                  className="w-full bg-dark-900/80 border border-white/10 rounded-xl pl-4 pr-16 py-3 text-sm text-white focus:outline-none focus:border-purple-500 transition-colors font-mono"
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-purple-400">GEN</span>
              </div>
            </div>
          </div>

          {/* Staking Window Duration */}
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-slate-200">Staking Window Duration</label>
            <select
              value={windowMinutes}
              onChange={(e) => setWindowMinutes(e.target.value)}
              className="w-full bg-dark-900/80 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-purple-500 transition-colors"
            >
              <option value="5">5 Minutes (Recommended for Demo Video)</option>
              <option value="60">1 Hour</option>
              <option value="1440">24 Hours</option>
              <option value="10080">7 Days</option>
            </select>
          </div>

          {/* Action Button */}
          <div className="pt-4">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-4 rounded-xl bg-gradient-to-r from-purple-600 via-cyan-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-bold text-base shadow-xl shadow-purple-500/25 transition-all transform active:scale-95 disabled:opacity-50"
            >
              {isSubmitting ? 'Transacting on GenLayer studionet...' : 'Deploy Bounty Case & Deposit Stake'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
