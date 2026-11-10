import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { OFFICIAL_PLANS } from '../data/plans';
import { Plan } from '../types';
import {
  TrendingUp,
  ArrowDownLeft,
  ArrowUpRight,
  Zap,
  Sparkles,
  ShieldCheck,
  CheckCircle,
  Clock,
  Layers,
  ChevronRight,
} from 'lucide-react';

interface HomeTabProps {
  onSelectPlan: (plan: Plan) => void;
  onSwitchTab: (tab: 'home' | 'deposit' | 'withdraw' | 'account') => void;
  onOpenCalculator: () => void;
}

export const HomeTab: React.FC<HomeTabProps> = ({ onSelectPlan, onSwitchTab, onOpenCalculator }) => {
  const {
    lang,
    t,
    balance,
    activeInvestments,
    dailyPotentialIncome,
    totalProfitEarned,
    canClaimProfit,
    claimDailyProfit,
  } = useApp();

  const [filter, setFilter] = useState<'all' | 'starter' | 'vip' | 'elite'>('all');
  const isUrdu = lang === 'ur';

  // Live social proof withdrawals stream
  const [socialFeed] = useState([
    { phone: '0304-482****', amount: 'PKR 1,450', method: 'EasyPaisa', time: '2m' },
    { phone: '0342-991****', amount: 'PKR 4,200', method: 'JazzCash', time: '4m' },
    { phone: '0313-728****', amount: 'PKR 850', method: 'EasyPaisa', time: '7m' },
    { phone: '0331-509****', amount: 'PKR 9,000', method: 'Bank Transfer', time: '11m' },
  ]);

  const filteredPlans = OFFICIAL_PLANS.filter((plan) => {
    if (filter === 'starter') return plan.price <= 1250;
    if (filter === 'vip') return plan.price > 1250 && plan.price <= 13500;
    if (filter === 'elite') return plan.price > 13500;
    return true;
  });

  return (
    <div className="space-y-4 pb-6">
      {/* Balance Card */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#3b0d0d] via-[#220707] to-[#120303] p-5 border border-orange-500/30 shadow-2xl shadow-orange-950/40">
        {/* Ambient Glow */}
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-orange-600/20 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-amber-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10">
          <div className="flex items-center justify-between text-stone-300 text-xs mb-1">
            <span className="font-medium">{t.totalBalance}</span>
            <span className="text-[11px] px-2 py-0.5 rounded-full bg-emerald-950/60 text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
              {isUrdu ? 'Verified Wallet' : 'Verified Wallet'}
            </span>
          </div>

          <div className="flex items-baseline gap-2 my-2">
            <span className="text-3xl sm:text-4xl font-black text-amber-400 font-mono tracking-tight drop-shadow-sm">
              PKR {balance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
          </div>

          {/* Quick Metrics */}
          <div className="grid grid-cols-2 gap-2 mt-3 pt-3 border-t border-white/10 text-xs">
            <div className="bg-black/30 p-2.5 rounded-xl border border-white/5">
              <span className="text-stone-400 block text-[11px]">{t.dailyIncome}</span>
              <span className="text-emerald-400 font-bold font-mono text-sm mt-0.5 block">
                +PKR {dailyPotentialIncome.toLocaleString()} / {isUrdu ? 'Din' : 'day'}
              </span>
            </div>
            <div className="bg-black/30 p-2.5 rounded-xl border border-white/5">
              <span className="text-stone-400 block text-[11px]">{t.totalEarned}</span>
              <span className="text-amber-300 font-bold font-mono text-sm mt-0.5 block">
                PKR {totalProfitEarned.toLocaleString()}
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-3 gap-2 mt-4">
            <button
              onClick={() => onSwitchTab('deposit')}
              className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-500 hover:to-amber-500 text-white font-bold text-xs shadow-md shadow-orange-950/50 transition-all active:scale-95"
            >
              <ArrowDownLeft className="w-3.5 h-3.5" />
              <span>{t.deposit}</span>
            </button>
            <button
              onClick={() => onSwitchTab('withdraw')}
              className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-[#280a0a] hover:bg-[#381010] border border-orange-500/30 text-amber-300 font-bold text-xs transition-all active:scale-95"
            >
              <ArrowUpRight className="w-3.5 h-3.5" />
              <span>{t.withdraw}</span>
            </button>
            <button
              onClick={onOpenCalculator}
              className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-black/40 hover:bg-black/60 border border-white/10 text-stone-200 font-bold text-xs transition-all active:scale-95"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>{isUrdu ? 'Calculator' : 'Calc'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Claim Daily Profit Banner (If Active Investments Exist) */}
      {activeInvestments.length > 0 && (
        <div className="rounded-2xl p-4 bg-gradient-to-r from-emerald-950/60 via-[#1b2f1e]/80 to-emerald-950/60 border border-emerald-500/40 shadow-xl shadow-emerald-950/30">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
                <Zap className="w-5 h-5 fill-emerald-400" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-emerald-200">
                  {canClaimProfit
                    ? isUrdu
                      ? 'Aaj Ka Munafa Tayyar Hai!'
                      : "Today's Profit is Ready!"
                    : isUrdu
                    ? 'Aaj Ka Munafa Claim Ho Chuka Hai'
                    : 'Profit Claimed Today'}
                </h4>
                <p className="text-[11px] text-emerald-300/80 font-mono">
                  +{dailyPotentialIncome.toLocaleString()} PKR ({activeInvestments.length}{' '}
                  {isUrdu ? 'Active Plans' : 'active plans'})
                </p>
              </div>
            </div>

            {canClaimProfit ? (
              <button
                onClick={claimDailyProfit}
                className="bg-emerald-500 hover:bg-emerald-400 text-stone-950 font-black text-xs px-4 py-2.5 rounded-xl shadow-lg shadow-emerald-950/50 transition-all hover:scale-105 active:scale-95 animate-bounce"
              >
                {t.claimProfit}
              </button>
            ) : (
              <div className="flex items-center gap-1 text-[11px] font-semibold text-emerald-400 bg-emerald-950/70 px-3 py-1.5 rounded-lg border border-emerald-500/30">
                <CheckCircle className="w-3.5 h-3.5" />
                <span>{isUrdu ? 'Claim Ho Chuka' : 'Claimed'}</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Live Payouts Activity Feed */}
      <div className="bg-[#180505] rounded-xl p-2.5 border border-[#3b0f0f] flex items-center gap-2 overflow-x-auto text-[11px] scrollbar-none">
        <span className="font-bold text-amber-400 shrink-0 flex items-center gap-1 bg-amber-950/50 px-2 py-0.5 rounded border border-amber-500/20">
          <Clock className="w-3 h-3 text-amber-400" />
          {isUrdu ? 'Live Payouts' : 'Live Payouts'}
        </span>
        <div className="flex items-center gap-3 shrink-0 text-stone-300">
          {socialFeed.map((item, idx) => (
            <span key={idx} className="flex items-center gap-1 font-mono">
              <span className="text-stone-400">{item.phone}</span>
              <span className="text-emerald-400 font-bold">{item.amount}</span>
              <span className="text-[10px] text-stone-500">({item.method})</span>
            </span>
          ))}
        </div>
      </div>

      {/* Section Title with Filter Chips */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-5 bg-orange-600 rounded-full"></div>
            <h2 className="text-base font-extrabold text-white flex items-center gap-2">
              {t.plans}
              <span className="text-xs font-normal text-amber-400 font-mono">({OFFICIAL_PLANS.length})</span>
            </h2>
          </div>

          <span className="text-[11px] text-stone-400 flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
            60 {t.days} {isUrdu ? 'Muddat' : 'Term'}
          </span>
        </div>

        {/* Filters */}
        <div className="flex gap-1.5 overflow-x-auto pb-1 mb-3 scrollbar-none text-xs">
          <button
            onClick={() => setFilter('all')}
            className={`px-3 py-1.5 rounded-lg border font-medium shrink-0 transition-all ${
              filter === 'all'
                ? 'bg-orange-600 text-white border-orange-500'
                : 'bg-[#1e0707] text-stone-400 border-[#380e0e] hover:border-orange-500/30'
            }`}
          >
            {isUrdu ? 'Tamam Plans' : 'All Plans'}
          </button>
          <button
            onClick={() => setFilter('starter')}
            className={`px-3 py-1.5 rounded-lg border font-medium shrink-0 transition-all ${
              filter === 'starter'
                ? 'bg-orange-600 text-white border-orange-500'
                : 'bg-[#1e0707] text-stone-400 border-[#380e0e] hover:border-orange-500/30'
            }`}
          >
            {isUrdu ? 'Starter (345 - 1250)' : 'Starter (345 - 1250)'}
          </button>
          <button
            onClick={() => setFilter('vip')}
            className={`px-3 py-1.5 rounded-lg border font-medium shrink-0 transition-all ${
              filter === 'vip'
                ? 'bg-orange-600 text-white border-orange-500'
                : 'bg-[#1e0707] text-stone-400 border-[#380e0e] hover:border-orange-500/30'
            }`}
          >
            {isUrdu ? 'VIP (3000 - 13500)' : 'VIP (3000 - 13500)'}
          </button>
          <button
            onClick={() => setFilter('elite')}
            className={`px-3 py-1.5 rounded-lg border font-medium shrink-0 transition-all ${
              filter === 'elite'
                ? 'bg-orange-600 text-white border-orange-500'
                : 'bg-[#1e0707] text-stone-400 border-[#380e0e] hover:border-orange-500/30'
            }`}
          >
            {isUrdu ? 'Elite (25000+)' : 'Elite (25000+)'}
          </button>
        </div>
      </div>

      {/* Plans List / Grid */}
      <div className="grid gap-3">
        {filteredPlans.map((plan) => {
          const userHasActive = activeInvestments.filter((inv) => inv.planId === plan.id).length;

          return (
            <div
              key={plan.id}
              className={`relative rounded-2xl p-4 transition-all duration-200 border ${
                plan.popular
                  ? 'bg-gradient-to-r from-[#2f0c0c] via-[#240808] to-[#1c0606] border-amber-500/40 shadow-lg shadow-orange-950/20'
                  : 'bg-[#220707] border-[#441111] hover:border-orange-500/40'
              }`}
            >
              {/* Popular / Tag Badge */}
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-1.5">
                  <span
                    className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md border ${
                      plan.popular
                        ? 'bg-amber-400 text-stone-950 border-amber-300 font-extrabold'
                        : 'bg-orange-950/60 text-orange-400 border-orange-500/30'
                    }`}
                  >
                    {isUrdu ? plan.tagUrdu : plan.tag}
                  </span>
                  {userHasActive > 0 && (
                    <span className="text-[10px] font-semibold text-emerald-400 bg-emerald-950/60 border border-emerald-500/30 px-2 py-0.5 rounded-md">
                      {userHasActive} {isUrdu ? 'Active' : 'Active'}
                    </span>
                  )}
                </div>

                <span className="text-[11px] font-bold text-amber-400 font-mono">
                  +{plan.roiPercentage}% ROI
                </span>
              </div>

              {/* Main Info Row */}
              <div className="flex items-center justify-between gap-3">
                <div>
                  <h3 className="text-base font-extrabold text-white flex items-center gap-2">
                    {isUrdu ? plan.nameUrdu : plan.name}
                  </h3>
                  <div className="flex items-center gap-2 mt-1 text-xs">
                    <span className="text-amber-300 font-mono font-bold text-sm">
                      PKR {plan.price.toLocaleString()}
                    </span>
                    <span className="text-stone-500">•</span>
                    <span className="text-stone-300 font-medium">
                      {isUrdu ? 'Rozana Profit:' : 'Daily:'}{' '}
                      <strong className="text-emerald-400 font-mono">PKR {plan.dailyProfit.toLocaleString()}</strong>
                    </span>
                  </div>
                  <div className="text-[11px] text-stone-400 mt-1 flex items-center gap-1">
                    <span>{isUrdu ? '60 Din Mein Kul Return:' : '60-day return:'}</span>
                    <span className="text-amber-200 font-semibold font-mono">
                      PKR {plan.totalReturn.toLocaleString()}
                    </span>
                  </div>
                </div>

                {/* Invest Button */}
                <button
                  onClick={() => onSelectPlan(plan)}
                  className="shrink-0 bg-gradient-to-r from-orange-600 to-[#ff4500] hover:from-orange-500 hover:to-[#ff5714] text-white font-extrabold text-xs py-2.5 px-4 rounded-xl shadow-md shadow-orange-950/50 hover:shadow-orange-900/60 transition-all hover:scale-105 active:scale-95 flex items-center gap-1"
                >
                  <span>{t.investNow}</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Active Investments Portfolio Details (if any) */}
      {activeInvestments.length > 0 && (
        <div className="mt-6 pt-4 border-t border-[#350d0d]">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Layers className="w-4 h-4 text-amber-400" />
              {t.activeInvestments}
            </h3>
            <span className="text-xs text-stone-400 font-mono">{activeInvestments.length} Active</span>
          </div>

          <div className="space-y-2">
            {activeInvestments.map((inv) => (
              <div
                key={inv.id}
                className="bg-[#1b0606] border border-[#3b0f0f] rounded-xl p-3 flex items-center justify-between text-xs"
              >
                <div>
                  <div className="font-bold text-amber-300">
                    {isUrdu ? inv.planNameUrdu : inv.planName}
                  </div>
                  <div className="text-[11px] text-stone-400 mt-0.5">
                    {isUrdu ? 'Sarmayakari:' : 'Invested:'} PKR {inv.investedAmount.toLocaleString()} •{' '}
                    {isUrdu ? 'Rozana:' : 'Daily:'} PKR {inv.dailyProfit.toLocaleString()}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-emerald-400 font-bold font-mono">
                    +PKR {inv.totalEarned.toLocaleString()}
                  </div>
                  <div className="text-[10px] text-stone-500">
                    {inv.daysPassed} / {inv.totalDays} {t.days}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
