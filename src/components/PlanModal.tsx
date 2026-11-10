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
      <div className="bg-gradient-to-b from-[#2a0b0b] to-[#180404] border border-orange-600/40 w-full max-w-md rounded-2xl p-5 shadow-2xl shadow-orange-950/60 relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1 rounded-lg bg-white/5 hover:bg-white/10 text-stone-400 hover:text-stone-200 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center text-stone-950 font-black shadow-lg">
            <Zap className="w-6 h-6 fill-stone-950" />
          </div>
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-amber-400 bg-amber-950/50 px-2 py-0.5 rounded border border-amber-500/20">
              {isUrdu ? plan.tagUrdu : plan.tag}
            </span>
            <h3 className="text-xl font-extrabold text-white mt-1">
              {isUrdu ? plan.nameUrdu : plan.name}
            </h3>
          </div>
        </div>

        {/* Price & Returns Grid */}
        <div className="bg-[#120303] rounded-xl p-4 border border-[#3b0f0f] mb-4 space-y-3">
          <div className="flex justify-between items-center text-sm pb-2 border-b border-[#290909]">
            <span className="text-stone-400">{isUrdu ? 'Investment Raqam:' : 'Investment Price:'}</span>
            <span className="text-xl font-bold text-amber-400 font-mono">
              PKR {plan.price.toLocaleString()}
            </span>
          </div>

          <div className="flex justify-between items-center text-sm">
            <span className="text-stone-400">{isUrdu ? 'Rozana Profit:' : 'Daily Profit:'}</span>
            <span className="text-base font-bold text-emerald-400 font-mono">
              +PKR {plan.dailyProfit.toLocaleString()} / {isUrdu ? 'Din' : 'day'}
            </span>
          </div>

          <div className="flex justify-between items-center text-sm">
            <span className="text-stone-400">{isUrdu ? 'Plan Ki Muddat:' : 'Plan Duration:'}</span>
            <span className="text-sm font-semibold text-stone-200">
              {plan.durationDays} {t.days}
            </span>
          </div>

          <div className="flex justify-between items-center text-sm pt-2 border-t border-[#290909]">
            <span className="text-stone-300 font-medium">{isUrdu ? 'Kul Return (Total Return):' : 'Total 60-Day Return:'}</span>
            <span className="text-lg font-black text-amber-300 font-mono">
              PKR {plan.totalReturn.toLocaleString()}
            </span>
          </div>
        </div>

        {/* User Balance Check */}
        <div className={`p-3 rounded-xl mb-4 border flex items-center justify-between text-xs ${
          hasBalance
            ? 'bg-emerald-950/30 border-emerald-600/30 text-emerald-300'
            : 'bg-rose-950/30 border-rose-600/30 text-rose-300'
        }`}>
          <div className="flex items-center gap-2">
            {hasBalance ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            ) : (
              <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
            )}
            <span className="font-medium">
              {isUrdu ? 'Aap Ka Mojooda Balance:' : 'Your Current Balance:'}
            </span>
          </div>
          <span className="font-bold text-sm font-mono text-white">
            PKR {balance.toLocaleString()}
          </span>
        </div>

        {/* Guarantee Info */}
        <div className="flex items-center gap-2 text-[11px] text-stone-400 mb-5">
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
              className="flex-1 bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-500 hover:to-amber-500 text-white font-bold py-3 px-4 rounded-xl shadow-lg shadow-orange-950/50 flex items-center justify-center gap-2 transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              <span>{isUrdu ? 'Tasdeeq Karein Aur Khareedein' : 'Confirm & Activate Plan'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={() => {
                onClose();
                onGoToDeposit();
              }}
              className="flex-1 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-stone-950 font-black py-3 px-4 rounded-xl shadow-lg flex items-center justify-center gap-2 transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              <span>{isUrdu ? 'Deposit Karein (Balance Kam Hai)' : 'Deposit Now (Insufficient Balance)'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={onClose}
            className="px-4 py-3 rounded-xl bg-white/5 hover:bg-white/10 text-stone-300 font-semibold transition-colors"
          >
            {t.cancelButton}
          </button>
        </div>
      </div>
    </div>
  );
};
