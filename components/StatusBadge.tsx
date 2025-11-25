import React from 'react';
import { Verdict, RiskLevel } from '../types';
import { TrendingUp, TrendingDown, Minus, AlertTriangle } from 'lucide-react';

interface StatusBadgeProps {
  type: 'verdict' | 'risk';
  value: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ type, value }) => {
  if (type === 'verdict') {
    const verdict = value as Verdict;
    let colorClass = '';
    let icon = null;

    switch (verdict) {
      case Verdict.BUY:
        colorClass = 'bg-emerald-500/20 text-emerald-400 border-emerald-500/50';
        icon = <TrendingUp size={16} className="mr-2" />;
        break;
      case Verdict.SELL:
        colorClass = 'bg-rose-500/20 text-rose-400 border-rose-500/50';
        icon = <TrendingDown size={16} className="mr-2" />;
        break;
      case Verdict.HOLD:
        colorClass = 'bg-amber-500/20 text-amber-400 border-amber-500/50';
        icon = <Minus size={16} className="mr-2" />;
        break;
      default:
        colorClass = 'bg-slate-500/20 text-slate-400 border-slate-500/50';
        icon = <AlertTriangle size={16} className="mr-2" />;
    }

    return (
      <div className={`flex items-center px-4 py-1.5 rounded-full border ${colorClass} font-bold text-sm tracking-wide uppercase`}>
        {icon}
        {verdict}
      </div>
    );
  } else {
    const risk = value as RiskLevel;
    let colorClass = '';
    
    switch (risk) {
      case RiskLevel.LOW:
        colorClass = 'text-emerald-400';
        break;
      case RiskLevel.MEDIUM:
        colorClass = 'text-amber-400';
        break;
      case RiskLevel.HIGH:
        colorClass = 'text-orange-400';
        break;
      case RiskLevel.EXTREME:
        colorClass = 'text-rose-500 font-bold';
        break;
    }

    return (
      <div className="flex items-center space-x-2 bg-slate-800/50 px-3 py-1 rounded-md border border-slate-700">
        <span className="text-slate-400 text-xs uppercase tracking-wider">Risk Level</span>
        <span className={`text-sm font-semibold ${colorClass}`}>{risk}</span>
      </div>
    );
  }
};
