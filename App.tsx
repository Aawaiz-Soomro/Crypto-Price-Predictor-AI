import React, { useState } from 'react';
import { analyzeCrypto } from './services/geminiService';
import { CryptoAnalysis } from './types';
import { LoadingScreen } from './components/LoadingScreen';
import { AnalysisView } from './components/AnalysisView';
import { Search, BrainCircuit, Sparkles } from 'lucide-react';

const App: React.FC = () => {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<CryptoAnalysis | null>(null);
  const [error, setError] = useState<string | null>(null);

  const performAnalysis = async (coinName: string) => {
    if (!coinName.trim()) return;

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const data = await analyzeCrypto(coinName);
      setResult(data);
    } catch (err: any) {
      setError(err.message || "Something went wrong during analysis. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!loading) {
      performAnalysis(query);
    }
  };

  const reset = () => {
    setResult(null);
    setQuery('');
    setError(null);
  };

  // Pre-defined popular coins for quick access
  const quickSearches = ["Bitcoin (BTC)", "Ethereum (ETH)", "Solana (SOL)", "Ripple (XRP)", "Dogecoin (DOGE)"];

  const handleQuickSearch = (coin: string) => {
    if (loading) return;
    setQuery(coin);
    performAnalysis(coin);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center p-4">
        <LoadingScreen />
      </div>
    );
  }

  if (result) {
    return (
      <div className="min-h-screen bg-slate-900 p-4 md:p-8">
        <AnalysisView data={result} onReset={reset} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-cyan-500/10 rounded-full blur-[100px]"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-500/10 rounded-full blur-[100px]"></div>
      </div>

      <div className="max-w-2xl w-full relative z-10 space-y-12">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="flex justify-center mb-6">
            <div className="p-4 bg-slate-800 rounded-2xl border border-slate-700 shadow-2xl relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-purple-600 rounded-2xl opacity-20 blur group-hover:opacity-30 transition-opacity"></div>
              <BrainCircuit className="w-12 h-12 text-cyan-400 relative z-10" />
            </div>
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 tracking-tight pb-2">
            CryptoOracle AI
          </h1>
          <p className="text-lg text-slate-400 max-w-lg mx-auto leading-relaxed">
            Professional-grade market analysis powered by Gemini 2.5. 
            Real-time insights, technical patterns, and predictive modeling.
          </p>
        </div>

        {/* Search Box */}
        <div className="bg-slate-800/80 backdrop-blur-md p-2 rounded-2xl border border-slate-700 shadow-2xl transform transition-all hover:scale-[1.01] hover:border-slate-600 hover:shadow-cyan-900/20">
          <form onSubmit={handleSearch} className="flex items-center">
            <div className="pl-4 text-slate-500">
              <Search size={24} />
            </div>
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Enter coin name or symbol (e.g., BTC, Pepe)"
              className="w-full bg-transparent border-none text-white text-xl p-4 focus:ring-0 placeholder-slate-500 outline-none"
            />
            <button
              type="submit"
              disabled={!query.trim() || loading}
              className="bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white px-8 py-3 rounded-xl font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
            >
              Analyze
              <Sparkles size={18} className="ml-2" />
            </button>
          </form>
        </div>

        {/* Quick Selections */}
        <div className="flex flex-wrap justify-center gap-3">
          {quickSearches.map((coin) => (
            <button
              key={coin}
              onClick={() => handleQuickSearch(coin)}
              disabled={loading}
              className="px-4 py-2 bg-slate-800/50 hover:bg-slate-700 border border-slate-700 rounded-full text-sm text-slate-300 transition-colors disabled:opacity-50 disabled:cursor-wait"
            >
              {coin}
            </button>
          ))}
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-rose-500/10 border border-rose-500/50 text-rose-400 px-6 py-4 rounded-xl text-center animate-shake">
            <p>{error}</p>
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="absolute bottom-6 text-slate-600 text-sm">
        <p>&copy; {new Date().getFullYear()} CryptoOracle AI. Not financial advice.</p>
      </footer>
    </div>
  );
};

export default App;