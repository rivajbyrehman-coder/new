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
  const { lang, setLang, onlineMembers, pendingDepositsCount, pendingWithdrawalsCount, user } = useApp();
  const totalPending = pendingDepositsCount + pendingWithdrawalsCount;

  return (
    <header className="sticky top-0 z-40 bg-[#0c1017]/95 backdrop-blur-md text-white shadow-xl border-b border-slate-800/80">
      <div className="max-w-2xl mx-auto px-4 py-3 flex items-center justify-between gap-2">
        {/* Brand */}
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 via-amber-500 to-amber-600 flex items-center justify-center shadow-md shadow-amber-950/40 text-slate-950 font-black text-xl border border-amber-300/40">
            7X
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h1 className="font-extrabold text-lg tracking-tight text-white flex items-center gap-1">
                7x Trading
                <TrendingUp className="w-4 h-4 text-emerald-400 inline" />
              </h1>
            </div>
            <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
              <span className="font-medium font-mono text-emerald-400">
                {onlineMembers.toLocaleString()} {lang === 'ur' ? 'Afraad Online Hain' : 'Live Traders'}
              </span>
            </div>
          </div>
        </div>

        {/* Action icons */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Admin Portal Button - EXCLUSIVELY for Admin */}
          {user?.role === 'admin' && (
            <button
              onClick={onOpenAdmin}
              title={lang === 'ur' ? 'Admin Portal: Approvals' : 'Admin Portal: Approvals'}
              className="relative p-2 rounded-xl bg-purple-950/60 hover:bg-purple-900 border border-purple-500/40 text-purple-200 transition-colors"
            >
              <ShieldCheck className="w-4 h-4" />
              {totalPending > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-amber-400 text-slate-950 text-[10px] font-black flex items-center justify-center animate-pulse">
                  {totalPending}
                </span>
              )}
            </button>
          )}

          {/* Calculator */}
          <button
            onClick={onOpenCalculator}
            title={lang === 'ur' ? 'Munafa Calculator (ROI)' : 'ROI Calculator'}
            className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 text-amber-300 transition-colors border border-slate-700/70"
          >
            <Calculator className="w-4 h-4" />
          </button>

          {/* Support */}
          <button
            onClick={onOpenSupport}
            title={`Customer Support Helpline (${SUPPORT_DETAILS.helpNumber})`}
            className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 text-amber-300 transition-colors border border-slate-700/70"
          >
            <Headphones className="w-4 h-4" />
          </button>

          {/* Language Switcher */}
          <button
            onClick={() => setLang(lang === 'ur' ? 'en' : 'ur')}
            className="flex items-center gap-1 text-xs font-bold px-2.5 py-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700/70 transition-all text-white"
          >
            <Globe className="w-3.5 h-3.5 text-amber-400" />
            <span>{lang === 'ur' ? 'English' : 'Roman Urdu'}</span>
          </button>
        </div>
      </div>
    </header>
  );
};
