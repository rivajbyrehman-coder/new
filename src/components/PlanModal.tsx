import React from 'react';
import { useApp } from '../context/AppContext';
import { Plan } from '../types';
import { CheckCircle2, AlertTriangle, ArrowRight, X, ShieldCheck, Zap } from 'lucide-react';

interface PlanModalProps {
  plan: Plan | null;
  onClose: () => void;
  onGoToDeposit: () => void;
}

export const PlanModal: React.FC<PlanModalProps> = ({ plan, onClose, onGoToDeposit }) => {
  const { lang, t, balance, buyPlan } = useApp();

  if (!plan) return null;

  const hasBalance = balance >= plan.price;
  const isUrdu = lang === 'ur';

  const handleConfirm = () => {
    const success = buyPlan(plan);
    if (success) {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-gradient-to-b from-[#161d2d] to-[#0f141f] border border-slate-700/80 w-full max-w-md rounded-3xl p-5 shadow-2xl relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 hover:text-slate-200 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-400 via-amber-500 to-amber-600 flex items-center justify-center text-slate-950 font-black shadow-lg">
            <Zap className="w-6 h-6 fill-slate-950" />
          </div>
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-md border border-amber-500/20 font-mono">
              {isUrdu ? plan.tagUrdu : plan.tag}
            </span>
            <h3 className="text-xl font-extrabold text-white mt-1">
              {plan.name}
            </h3>
          </div>
        </div>

        {/* Price & Returns Grid */}
        <div className="bg-[#0a0d14] rounded-2xl p-4 border border-slate-800 mb-4 space-y-3">
          <div className="flex justify-between items-center text-sm pb-2 border-b border-slate-800">
            <span className="text-slate-400 font-medium">{isUrdu ? 'Sarmayakari Raqam:' : 'Investment Price:'}</span>
            <span className="text-xl font-black text-amber-400 font-mono">
              PKR {plan.price.toLocaleString()}
            </span>
          </div>

          <div className="flex justify-between items-center text-sm">
            <span className="text-slate-400 font-medium">{isUrdu ? 'Rozana Munafa:' : 'Daily Profit:'}</span>
            <span className="text-base font-bold text-emerald-400 font-mono">
              +PKR {plan.dailyProfit.toLocaleString()} / {isUrdu ? 'Din' : 'day'}
            </span>
          </div>

          <div className="flex justify-between items-center text-sm">
            <span className="text-slate-400 font-medium">{isUrdu ? 'Plan Ki Muddat:' : 'Plan Duration:'}</span>
            <span className="text-sm font-semibold text-slate-200 font-mono">
              {plan.durationDays} {t.days}
            </span>
          </div>

          <div className="flex justify-between items-center text-sm pt-2 border-t border-slate-800">
            <span className="text-slate-300 font-medium">{isUrdu ? 'Total Return (Kul Return):' : 'Total 60-Day Return:'}</span>
            <span className="text-lg font-black text-amber-300 font-mono">
              PKR {plan.totalReturn.toLocaleString()}
            </span>
          </div>
        </div>

        {/* User Balance Check */}
        <div className={`p-3 rounded-2xl mb-4 border flex items-center justify-between text-xs ${
          hasBalance
            ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-300'
            : 'bg-rose-950/40 border-rose-500/40 text-rose-300'
        }`}>
          <div className="flex items-center gap-2">
            {hasBalance ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            ) : (
              <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
            )}
            <span className="font-semibold">
              {isUrdu ? 'Aap Ka Mojooda Balance:' : 'Your Current Balance:'}
            </span>
          </div>
          <span className="font-black text-sm font-mono text-white">
            PKR {balance.toLocaleString()}
          </span>
        </div>

        {/* Guarantee Info */}
        <div className="flex items-center gap-2 text-[11px] text-slate-400 mb-5">
          <ShieldCheck className="w-4 h-4 text-amber-400 shrink-0" />
          <span>
            {isUrdu
              ? '7x Trading Guarantee: Munafa har 24 ghantay baad claim ke liye dastyab hoga.'
              : '7x Trading Guarantee: Profit unlocks every 24 hours for daily instant claiming.'}
          </span>
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          {hasBalance ? (
            <button
              onClick={handleConfirm}
              className="flex-1 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black py-3 px-4 rounded-xl shadow-lg shadow-amber-950/40 flex items-center justify-center gap-2 transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              <span>{isUrdu ? 'Tasdeeq Karein Aur Plan Active Karein' : 'Confirm & Activate Plan'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={() => {
                onClose();
                onGoToDeposit();
              }}
              className="flex-1 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-black py-3 px-4 rounded-xl shadow-lg flex items-center justify-center gap-2 transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              <span>{isUrdu ? 'Deposit Karein (Balance Kam Hai)' : 'Deposit Now (Insufficient Balance)'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={onClose}
            className="px-4 py-3 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 font-semibold transition-colors"
          >
            {t.cancelButton}
          </button>
        </div>
      </div>
    </div>
  );
};
