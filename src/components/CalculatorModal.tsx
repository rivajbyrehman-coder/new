import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { OFFICIAL_PLANS } from '../data/plans';
import { X, Calculator, TrendingUp, Sparkles } from 'lucide-react';

interface CalculatorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectPlan: (planId: number) => void;
}

export const CalculatorModal: React.FC<CalculatorModalProps> = ({ isOpen, onClose, onSelectPlan }) => {
  const { lang } = useApp();
  const [selectedPlanId, setSelectedPlanId] = useState<number>(3); // default silver
  const isUrdu = lang === 'ur';

  if (!isOpen) return null;

  const currentPlan = OFFICIAL_PLANS.find((p) => p.id === selectedPlanId) || OFFICIAL_PLANS[0];
  const daily = currentPlan.dailyProfit;
  const weekly = daily * 7;
  const monthly = daily * 30;
  const total = currentPlan.totalReturn;
  const netProfit = total - currentPlan.price;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-gradient-to-b from-[#161d2d] to-[#0f141f] border border-slate-700/80 w-full max-w-lg rounded-3xl p-5 shadow-2xl relative max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 hover:text-slate-200 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
            <Calculator className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">
              {isUrdu ? 'Munafa Calculator (ROI)' : 'Investment Profit Calculator'}
            </h3>
            <p className="text-xs text-slate-400">
              {isUrdu ? 'Plan select kar ke apna expected munafa calculate karein' : 'Select a plan to calculate your projected earnings'}
            </p>
          </div>
        </div>

        {/* Plan Selector Buttons */}
        <div className="mb-5">
          <label className="block text-xs font-semibold text-slate-300 mb-2">
            {isUrdu ? 'Plan Chunein:' : 'Select Investment Tier:'}
          </label>
          <div className="grid grid-cols-3 gap-2">
            {OFFICIAL_PLANS.map((plan) => (
              <button
                key={plan.id}
                onClick={() => setSelectedPlanId(plan.id)}
                className={`p-2.5 rounded-xl border text-center transition-all ${
                  selectedPlanId === plan.id
                    ? 'bg-gradient-to-br from-amber-500 to-amber-600 text-slate-950 border-amber-400 font-black shadow-md scale-[1.02]'
                    : 'bg-slate-900/60 text-slate-300 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="text-[11px] opacity-80">{plan.name.split(' - ')[0]}</div>
                <div className="text-xs font-mono font-bold mt-0.5">₨ {plan.price.toLocaleString()}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Calculation Cards */}
        <div className="bg-[#0a0d14] rounded-2xl p-4 border border-slate-800 mb-5 space-y-3">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <span className="text-xs text-slate-400 font-medium">{isUrdu ? 'Sarmayakari Raqam:' : 'Capital Invested:'}</span>
            <span className="text-lg font-black text-amber-400 font-mono">PKR {currentPlan.price.toLocaleString()}</span>
          </div>

          <div className="grid grid-cols-2 gap-2.5 pt-1">
            <div className="bg-slate-900/60 p-3 rounded-xl border border-slate-800">
              <span className="text-[11px] text-slate-400 block font-medium">{isUrdu ? 'Rozana Munafa' : 'Daily Profit'}</span>
              <span className="text-base font-bold text-emerald-400 font-mono">+PKR {daily.toLocaleString()}</span>
            </div>
            <div className="bg-slate-900/60 p-3 rounded-xl border border-slate-800">
              <span className="text-[11px] text-slate-400 block font-medium">{isUrdu ? 'Hafta-war (7 Din)' : 'Weekly (7 Days)'}</span>
              <span className="text-base font-bold text-emerald-400 font-mono">+PKR {weekly.toLocaleString()}</span>
            </div>
            <div className="bg-slate-900/60 p-3 rounded-xl border border-slate-800">
              <span className="text-[11px] text-slate-400 block font-medium">{isUrdu ? 'Mahana (30 Din)' : 'Monthly (30 Days)'}</span>
              <span className="text-base font-bold text-emerald-400 font-mono">+PKR {monthly.toLocaleString()}</span>
            </div>
            <div className="bg-slate-900/60 p-3 rounded-xl border border-slate-800">
              <span className="text-[11px] text-slate-400 block font-medium">{isUrdu ? 'Kul Khalis Munafa (Net Profit)' : 'Total Net Profit'}</span>
              <span className="text-base font-bold text-amber-300 font-mono">+PKR {netProfit.toLocaleString()}</span>
            </div>
          </div>

          <div className="bg-gradient-to-r from-amber-500/10 via-amber-500/15 to-amber-500/10 p-3.5 rounded-xl border border-amber-500/30 flex items-center justify-between mt-2">
            <div>
              <span className="text-xs text-amber-200 font-bold flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                {isUrdu ? 'Total 60 Din Ka Return (Kul Return)' : 'Total 60-Day Return'}
              </span>
              <span className="text-[11px] text-slate-400">{isUrdu ? 'Asal Raqam + Kul Munafa' : 'Principal + Total Profits'}</span>
            </div>
            <span className="text-xl font-black text-amber-300 font-mono">
              PKR {total.toLocaleString()}
            </span>
          </div>
        </div>

        {/* Action Button */}
        <button
          onClick={() => {
            onClose();
            onSelectPlan(currentPlan.id);
          }}
          className="w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black py-3 rounded-xl shadow-lg shadow-amber-950/40 flex items-center justify-center gap-2 transition-all hover:scale-[1.01] active:scale-[0.99]"
        >
          <TrendingUp className="w-4 h-4" />
          <span>{isUrdu ? `Yeh Plan Invest Karein (PKR ${currentPlan.price.toLocaleString()})` : `Invest in this Plan (PKR ${currentPlan.price.toLocaleString()})`}</span>
        </button>
      </div>
    </div>
  );
};
