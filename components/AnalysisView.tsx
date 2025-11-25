import React from 'react';
import { CryptoAnalysis } from '../types';
import { StatusBadge } from './StatusBadge';
import { ChartComponent } from './ChartComponent';
import ReactMarkdown from 'react-markdown';
import { ArrowLeft, Target, Shield, Zap, ExternalLink, Crosshair, TrendingUp, AlertOctagon } from 'lucide-react';

interface AnalysisViewProps {
  data: CryptoAnalysis;
  onReset: () => void;
}

export const AnalysisView: React.FC<AnalysisViewProps> = ({ data, onReset }) => {
  return (
    <div className="w-full max-w-5xl mx-auto space-y-6 animate-fade-in pb-12">
      {/* Header / Nav */}
      <button 
        onClick={onReset}
        className="flex items-center text-slate-400 hover:text-white transition-colors mb-4 group"
      >
        <ArrowLeft size={18} className="mr-2 group-hover:-translate-x-1 transition-transform" />
        Analyze another coin
      </button>

      {/* Top Card: Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Main Verdict Card */}
        <div className="md:col-span-2 bg-slate-800 rounded-2xl p-6 border border-slate-700 shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <Target size={120} />
          </div>
          
          <div className="relative z-10">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h1 className="text-3xl font-bold text-white mb-1">{data.coin}</h1>
                <p className="text-2xl text-slate-400 font-medium">{data.currentPrice}</p>
              </div>
              <StatusBadge type="verdict" value={data.verdict} />
            </div>

            <p className="text-slate-300 text-lg mb-6 leading-relaxed">
              {data.summary}
            </p>

            <div className="flex items-center space-x-6">
              <StatusBadge type="risk" value={data.riskLevel} />
              <div className="flex items-center space-x-2">
                <span className="text-slate-400 text-xs uppercase tracking-wider">AI Confidence</span>
                <div className="w-24 h-2 bg-slate-700 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-cyan-400 rounded-full" 
                    style={{ width: `${data.confidenceScore}%` }}
                  ></div>
                </div>
                <span className="text-sm font-mono text-cyan-400">{data.confidenceScore}%</span>
              </div>
            </div>
          </div>
        </div>

        {/* Key Factors Card */}
        <div className="bg-slate-800 rounded-2xl p-6 border border-slate-700 shadow-xl flex flex-col">
          <h3 className="text-slate-400 uppercase text-xs font-bold tracking-wider mb-4 flex items-center">
            <Zap size={14} className="mr-2 text-yellow-400" />
            Key Factors
          </h3>
          <ul className="space-y-3 flex-1">
            {data.keyFactors.map((factor, idx) => (
              <li key={idx} className="flex items-start text-sm text-slate-300">
                <span className="mr-2 mt-1.5 w-1.5 h-1.5 bg-cyan-500 rounded-full flex-shrink-0"></span>
                {factor}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Trading Strategy Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-slate-800/80 p-5 rounded-2xl border border-blue-500/30 shadow-lg backdrop-blur-sm relative overflow-hidden">
          <div className="absolute right-0 top-0 p-3 opacity-10">
            <Crosshair size={48} className="text-blue-400" />
          </div>
          <p className="text-blue-400 text-xs uppercase font-bold tracking-widest mb-1">Optimal Entry</p>
          <p className="text-xl font-bold text-white tracking-tight">{data.entryPrice}</p>
        </div>

        <div className="bg-slate-800/80 p-5 rounded-2xl border border-emerald-500/30 shadow-lg backdrop-blur-sm relative overflow-hidden">
          <div className="absolute right-0 top-0 p-3 opacity-10">
            <TrendingUp size={48} className="text-emerald-400" />
          </div>
          <p className="text-emerald-400 text-xs uppercase font-bold tracking-widest mb-1">Take Profit</p>
          <p className="text-xl font-bold text-white tracking-tight">{data.takeProfit}</p>
        </div>

        <div className="bg-slate-800/80 p-5 rounded-2xl border border-rose-500/30 shadow-lg backdrop-blur-sm relative overflow-hidden">
          <div className="absolute right-0 top-0 p-3 opacity-10">
            <AlertOctagon size={48} className="text-rose-400" />
          </div>
          <p className="text-rose-400 text-xs uppercase font-bold tracking-widest mb-1">Stop Loss</p>
          <p className="text-xl font-bold text-white tracking-tight">{data.stopLoss}</p>
        </div>
      </div>

      {/* Chart Section */}
      <div className="bg-slate-800 rounded-2xl p-6 border border-slate-700 shadow-xl">
        <h3 className="text-slate-400 uppercase text-xs font-bold tracking-wider mb-2">Price Prediction (3 Months)</h3>
        <ChartComponent data={data.predictedTrend} />
      </div>

      {/* Detailed Analysis */}
      <div className="bg-slate-800 rounded-2xl p-8 border border-slate-700 shadow-xl">
        <h3 className="text-slate-400 uppercase text-xs font-bold tracking-wider mb-6 flex items-center">
          <Shield size={14} className="mr-2 text-cyan-400" />
          Professional Analysis
        </h3>
        <div className="prose prose-invert prose-slate max-w-none">
          <ReactMarkdown>{data.detailedAnalysis}</ReactMarkdown>
        </div>
      </div>

      {/* Sources / Disclaimer */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {data.sources.length > 0 && (
          <div className="bg-slate-900/50 rounded-xl p-6 border border-slate-800">
             <h4 className="text-slate-500 uppercase text-xs font-bold tracking-wider mb-3">Sources & References</h4>
             <ul className="space-y-2">
                {data.sources.map((source, idx) => (
                  <li key={idx}>
                    <a 
                      href={source.uri} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-cyan-600 hover:text-cyan-400 text-sm flex items-center truncate transition-colors"
                    >
                      <ExternalLink size={12} className="mr-2 flex-shrink-0" />
                      <span className="truncate">{source.title}</span>
                    </a>
                  </li>
                ))}
             </ul>
          </div>
        )}
        
        <div className="bg-slate-900/50 rounded-xl p-6 border border-slate-800 flex items-center">
          <p className="text-xs text-slate-500 leading-relaxed italic">
            <strong>Disclaimer:</strong> This application is powered by Artificial Intelligence and uses historical data and current search results to generate predictions. Cryptocurrency markets are highly volatile and unpredictable. This information is for educational and entertainment purposes only and does not constitute financial advice. Always perform your own due diligence.
          </p>
        </div>
      </div>
    </div>
  );
};