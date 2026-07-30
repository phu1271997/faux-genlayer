import React from 'react';
import { AlertTriangle, CheckCircle2, HelpCircle, Clock, Cpu } from 'lucide-react';

interface VerdictBadgeProps {
  status: 'OPEN' | 'ADJUDICATING' | 'RESOLVED' | 'REFUNDED';
  verdict?: 'FAKE' | 'REAL' | 'INCONCLUSIVE' | '';
  confidence?: number;
  size?: 'sm' | 'md' | 'lg';
}

export const VerdictBadge: React.FC<VerdictBadgeProps> = ({
  status,
  verdict,
  confidence,
  size = 'md'
}) => {
  const sizeClasses = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-3 py-1 text-sm',
    lg: 'px-4 py-1.5 text-base font-semibold'
  }[size];

  if (status === 'OPEN') {
    return (
      <span className={`inline-flex items-center gap-1.5 rounded-full bg-purple-500/10 text-purple-400 border border-purple-500/20 ${sizeClasses}`}>
        <Clock className="w-3.5 h-3.5 animate-pulse" />
        <span>OPEN FOR STAKING</span>
      </span>
    );
  }

  if (status === 'ADJUDICATING') {
    return (
      <span className={`inline-flex items-center gap-1.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20 ${sizeClasses}`}>
        <Cpu className="w-3.5 h-3.5 animate-spin" />
        <span>AI JURY EVALUATING...</span>
      </span>
    );
  }

  if (status === 'REFUNDED') {
    return (
      <span className={`inline-flex items-center gap-1.5 rounded-full bg-slate-500/10 text-slate-400 border border-slate-500/20 ${sizeClasses}`}>
        <HelpCircle className="w-3.5 h-3.5" />
        <span>REFUNDED (LOW CONFIDENCE)</span>
      </span>
    );
  }

  if (verdict === 'FAKE') {
    return (
      <span className={`inline-flex items-center gap-1.5 rounded-full bg-rose-500/10 text-rose-400 border border-rose-500/30 ${sizeClasses}`}>
        <AlertTriangle className="w-3.5 h-3.5" />
        <span>VERDICT: DEEPFAKE ({confidence}% CONFIDENCE)</span>
      </span>
    );
  }

  if (verdict === 'REAL') {
    return (
      <span className={`inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 ${sizeClasses}`}>
        <CheckCircle2 className="w-3.5 h-3.5" />
        <span>VERDICT: AUTHENTIC ({confidence}% CONFIDENCE)</span>
      </span>
    );
  }

  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full bg-slate-500/10 text-slate-400 border border-slate-500/20 ${sizeClasses}`}>
      <HelpCircle className="w-3.5 h-3.5" />
      <span>INCONCLUSIVE</span>
    </span>
  );
};
