import React from 'react';
import { useApp } from '../context/AppContext';
import { SUPPORT_DETAILS } from '../data/plans';
import { TrendingUp, Globe, Calculator, Headphones, ShieldCheck } from 'lucide-react';

interface HeaderProps {
  onOpenCalculator: () => void;
  onOpenSupport: () => void;
  onOpenAdmin: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenCalculator, onOpenSupport, onOpenAdmin }) => {
  const { lang, setLang, onlineMembers, pendingDepositsCount } = useApp();

  return (
    <header className="sticky top-0 z-40 bg-gradient-to-r from-[#2a0808] via-[#8b1500] to-[#ff4500] text-white shadow-xl shadow-red-950/30 border-b border-orange-500/20">
      <div className="max-w-2xl mx-auto px-4 py-3 flex items-center justify-between gap-2">
        {/* Brand */}
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-orange-600 flex items-center justify-center shadow-md shadow-orange-950/40 text-stone-950 font-black text-xl">
            7X
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h1 className="font-extrabold text-lg tracking-tight text-white flex items-center gap-1">
                7x Trading
                <TrendingUp className="w-4 h-4 text-amber-300 inline" />
              </h1>
            </div>
            <div className="flex items-center gap-1.5 text-[11px] text-orange-200">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
              <span className="font-medium font-mono">
                {onlineMembers.toLocaleString()} {lang === 'ur' ? 'Online Members' : 'Live Traders'}
              </span>
            </div>
          </div>
        </div>

        {/* Action icons */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Admin Portal Button */}
          <button
            onClick={onOpenAdmin}
            title={lang === 'ur' ? 'Admin Portal: Deposit Approvals' : 'Admin Portal: Deposit Approvals'}
            className="relative p-2 rounded-lg bg-purple-950/60 hover:bg-purple-900 border border-purple-500/40 text-purple-200 transition-colors"
          >
            <ShieldCheck className="w-4 h-4" />
            {pendingDepositsCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-amber-500 text-stone-950 text-[10px] font-black flex items-center justify-center animate-pulse">
                {pendingDepositsCount}
              </span>
            )}
          </button>

          {/* Calculator */}
          <button
            onClick={onOpenCalculator}
            title={lang === 'ur' ? 'Munafa Calculator' : 'ROI Calculator'}
            className="p-2 rounded-lg bg-black/20 hover:bg-black/40 text-amber-200 transition-colors border border-white/10"
          >
            <Calculator className="w-4 h-4" />
          </button>

          {/* Support */}
          <button
            onClick={onOpenSupport}
            title={`Customer Support Helpline (${SUPPORT_DETAILS.helpNumber})`}
            className="p-2 rounded-lg bg-black/20 hover:bg-black/40 text-amber-200 transition-colors border border-white/10"
          >
            <Headphones className="w-4 h-4" />
          </button>

          {/* Language Switcher */}
          <button
            onClick={() => setLang(lang === 'ur' ? 'en' : 'ur')}
            className="flex items-center gap-1 text-xs font-bold px-2.5 py-1.5 rounded-lg bg-black/30 hover:bg-black/50 border border-white/15 transition-all text-white"
          >
            <Globe className="w-3.5 h-3.5 text-amber-300" />
            <span>{lang === 'ur' ? 'English' : 'Roman Urdu'}</span>
          </button>
        </div>
      </div>
    </header>
  );
};
