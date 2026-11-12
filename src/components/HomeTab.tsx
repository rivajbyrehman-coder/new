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
  Share2,
  Copy,
  Check,
  Download,
  Smartphone,
  Wallet,
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
    user,
    balance,
    activeInvestments,
    dailyPotentialIncome,
    totalProfitEarned,
    canClaimProfit,
    claimDailyProfit,
    showToast,
  } = useApp();

  const [filter, setFilter] = useState<'all' | 'starter' | 'vip' | 'elite'>('all');
  const [copiedRefCode, setCopiedRefCode] = useState(false);
  const [copiedRefLink, setCopiedRefLink] = useState(false);
  const [copiedAppLink, setCopiedAppLink] = useState(false);
  const isUrdu = lang === 'ur';

  const userRefCode = user?.referralCode || 'rehman_99';
  const referralLink = `${window.location.origin}/join?ref=${userRefCode}`;
  const appDownloadUrl = `${window.location.origin}/downloads/7xTrading_Official_v2.4.apk`;

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

  const handleCopyRefCode = () => {
    navigator.clipboard.writeText(userRefCode);
    setCopiedRefCode(true);
    setTimeout(() => setCopiedRefCode(false), 2000);
    showToast(isUrdu ? 'Referral code copy ho gaya!' : 'Referral code copied!', 'success');
  };

  const handleCopyRefLink = () => {
    navigator.clipboard.writeText(referralLink);
    setCopiedRefLink(true);
    setTimeout(() => setCopiedRefLink(false), 2000);
    showToast(isUrdu ? 'Referral link copy ho gaya!' : 'Referral link copied!', 'success');
  };

  const handleShareWhatsApp = () => {
    const text = encodeURIComponent(
      `Assalam-o-Alaikum! 7x Trading platform par sarmayakari karein aur rozana guaranteed munafa kamayein.\n\nMera Referral Code: ${userRefCode}\nLink se account banayein: ${referralLink}`
    );
    window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank');
  };

  const handleDownloadApp = () => {
    try {
      const apkMockContent = '7X-TRADING-OFFICIAL-APK-V2.4-RELEASE';
      const blob = new Blob([apkMockContent], { type: 'application/vnd.android.package-archive' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = '7xTrading_Official_v2.4.apk';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      showToast(
        isUrdu
          ? '7x Trading Android App (APK) download shuru ho gaya hai!'
          : '7x Trading Android App (APK) download started!',
        'success'
      );
    } catch {
      showToast(
        isUrdu ? 'Download shuru karne ke liye link copy karein' : 'Please copy app download link',
        'info'
      );
    }
  };

  const handleCopyAppLink = () => {
    navigator.clipboard.writeText(appDownloadUrl);
    setCopiedAppLink(true);
    setTimeout(() => setCopiedAppLink(false), 2000);
    showToast(isUrdu ? 'App download link copy ho gaya!' : 'App download link copied!', 'success');
  };

  return (
    <div className="space-y-4 pb-6">
      {/* Balance Card - Professional Fintech Theme */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#121824] via-[#0f141f] to-[#0a0d14] p-5 border border-slate-800 shadow-2xl">
        {/* Ambient Subtle Glow */}
        <div className="absolute -top-12 -right-12 w-48 h-48 bg-amber-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute -bottom-12 -left-12 w-48 h-48 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
            <span className="font-semibold tracking-wide uppercase text-[11px] flex items-center gap-1.5">
              <Wallet className="w-3.5 h-3.5 text-amber-400" />
              {t.totalBalance}
            </span>
            <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-medium flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
              {isUrdu ? 'Tasdeeq Shuda Wallet' : 'Verified Wallet'}
            </span>
          </div>

          <div className="flex items-baseline gap-2 my-2.5">
            <span className="text-3.5xl sm:text-4xl font-black text-amber-400 font-mono tracking-tight drop-shadow-sm">
              PKR {balance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
          </div>

          {/* Quick Metrics */}
          <div className="grid grid-cols-2 gap-2 mt-3 pt-3 border-t border-slate-800/80 text-xs">
            <div className="bg-slate-900/60 p-2.5 rounded-2xl border border-slate-800">
              <span className="text-slate-400 block text-[11px] font-medium">{t.dailyIncome}</span>
              <span className="text-emerald-400 font-bold font-mono text-sm mt-0.5 block">
                +PKR {dailyPotentialIncome.toLocaleString()} / {isUrdu ? 'Din' : 'day'}
              </span>
            </div>
            <div className="bg-slate-900/60 p-2.5 rounded-2xl border border-slate-800">
              <span className="text-slate-400 block text-[11px] font-medium">{t.totalEarned}</span>
              <span className="text-amber-300 font-bold font-mono text-sm mt-0.5 block">
                PKR {totalProfitEarned.toLocaleString()}
              </span>
            </div>
          </div>

          {/* Action Buttons: Deposit, Plans (Center Column), Withdraw */}
          <div className="grid grid-cols-3 gap-2 mt-4">
            {/* 1. DEPOSIT BUTTON */}
            <button
              onClick={() => onSwitchTab('deposit')}
              className="flex items-center justify-center gap-1.5 py-3 px-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-extrabold text-xs shadow-lg shadow-emerald-950/40 transition-all active:scale-95"
            >
              <ArrowDownLeft className="w-3.5 h-3.5" />
              <span>{t.deposit}</span>
            </button>

            {/* 2. CENTER COLUMN: INVESTMENT PLANS */}
            <button
              onClick={() => {
                const el = document.getElementById('official-plans-section');
                el?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="flex items-center justify-center gap-1.5 py-3 px-2 rounded-xl bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 hover:from-amber-300 hover:to-amber-500 text-slate-950 font-black text-xs shadow-lg shadow-amber-950/40 transition-all hover:scale-[1.02] active:scale-95 border border-amber-300/40"
            >
              <Layers className="w-3.5 h-3.5 text-slate-950" />
              <span>{isUrdu ? 'Plans (60 Din)' : 'Investment Plans'}</span>
            </button>

            {/* 3. WITHDRAW BUTTON */}
            <button
              onClick={() => onSwitchTab('withdraw')}
              className="flex items-center justify-center gap-1.5 py-3 px-2 rounded-xl bg-slate-900/90 hover:bg-slate-800 border border-slate-700/80 hover:border-amber-500/40 text-amber-300 font-extrabold text-xs transition-all active:scale-95"
            >
              <ArrowUpRight className="w-3.5 h-3.5" />
              <span>{t.withdraw}</span>
            </button>
          </div>

          {/* ROI Calculator Quick Bar */}
          <div className="mt-3 flex justify-end">
            <button
              onClick={onOpenCalculator}
              className="inline-flex items-center gap-1 text-[11px] text-amber-300 hover:text-amber-200 font-semibold bg-slate-900/80 hover:bg-slate-800 px-3 py-1 rounded-lg border border-slate-700/80 transition-all"
            >
              <Sparkles className="w-3 h-3 text-amber-400" />
              <span>{isUrdu ? 'Munafa Calculator (ROI)' : 'ROI Calculator'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Claim Daily Profit Banner (If Active Investments Exist) */}
      {activeInvestments.length > 0 && (
        <div className="rounded-2xl p-4 bg-gradient-to-r from-[#0d2218] via-[#112d20] to-[#0d2218] border border-emerald-500/30 shadow-xl">
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
                className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs px-4 py-2.5 rounded-xl shadow-lg shadow-emerald-950/50 transition-all hover:scale-105 active:scale-95 animate-bounce"
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

      {/* SECTION 1: MERE ACTIVE PLANS (MY PLANS) - 100% ROMAN URDU */}
      <div className="space-y-2.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-5 bg-amber-400 rounded-full"></div>
            <h3 className="text-sm font-black text-white flex items-center gap-1.5">
              <Layers className="w-4 h-4 text-amber-400" />
              <span>{isUrdu ? 'Mere Active Plans (My Plans)' : 'My Active Plans'}</span>
            </h3>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-300 border border-amber-500/20 font-bold">
              {activeInvestments.length} {isUrdu ? 'Active' : 'Active'}
            </span>
          </div>

          {activeInvestments.length > 0 && canClaimProfit && (
            <button
              onClick={claimDailyProfit}
              className="text-[11px] font-bold bg-emerald-500 hover:bg-emerald-400 text-slate-950 px-2.5 py-1 rounded-lg flex items-center gap-1 shadow transition-transform active:scale-95"
            >
              <Zap className="w-3 h-3 fill-slate-950" />
              <span>{isUrdu ? 'Claim Munafa' : 'Claim Now'}</span>
            </button>
          )}
        </div>

        {activeInvestments.length === 0 ? (
          <div className="rounded-2xl p-5 bg-slate-900/40 border border-slate-800 text-center">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center mx-auto mb-2.5 text-amber-400">
              <Layers className="w-6 h-6" />
            </div>
            <h4 className="text-sm font-bold text-white">
              {isUrdu ? 'Aap Ka Abhi Koi Active Plan Nahi Hai' : 'No Active Investment Plans'}
            </h4>
            <p className="text-xs text-slate-400 max-w-sm mx-auto mt-1 mb-3.5 leading-relaxed">
              {isUrdu
                ? 'Rozana guaranteed munafa hasil karne ke liye niche diye gaye 60-din ke plans mein se sarmayakari karein.'
                : 'Choose any of our 60-day investment plans below to start earning guaranteed daily profits.'}
            </p>
            <button
              onClick={() => {
                const el = document.getElementById('official-plans-section');
                el?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="inline-flex items-center gap-1.5 text-xs font-black px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 shadow-md transition-all hover:scale-105 active:scale-95"
            >
              <span>{isUrdu ? 'Plans Dekhein Aur Invest Karein' : 'Explore Plans & Invest'}</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        ) : (
          <div className="space-y-2.5">
            {activeInvestments.map((inv) => {
              const percent = Math.min(100, Math.round((inv.daysPassed / inv.totalDays) * 100));
              return (
                <div
                  key={inv.id}
                  className="rounded-2xl p-4 bg-[#121824] border border-slate-800 hover:border-amber-500/30 shadow-md space-y-3 transition-all"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-extrabold text-amber-300 text-sm flex items-center gap-2">
                        <span>{inv.planName}</span>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-950/70 text-emerald-400 border border-emerald-500/30 font-mono">
                          {isUrdu ? 'Active Plan' : 'Active'}
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-400 mt-1 flex items-center gap-1.5 flex-wrap">
                        <span>{isUrdu ? 'Sarmayakari (Invested):' : 'Invested:'}</span>
                        <span className="text-white font-mono font-bold">
                          PKR {inv.investedAmount.toLocaleString()}
                        </span>
                        <span className="text-slate-600">•</span>
                        <span>{isUrdu ? 'Rozana Munafa:' : 'Daily:'}</span>
                        <span className="text-emerald-400 font-mono font-bold">
                          +PKR {inv.dailyProfit.toLocaleString()}
                        </span>
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="text-[11px] text-slate-400 font-medium">{isUrdu ? 'Total Kamai' : 'Total Earned'}</div>
                      <div className="text-emerald-400 font-black font-mono text-sm mt-0.5">
                        PKR {inv.totalEarned.toLocaleString()}
                      </div>
                    </div>
                  </div>

                  {/* 60-Day Progress Bar */}
                  <div className="space-y-1.5 pt-1 border-t border-slate-800/80">
                    <div className="flex justify-between text-[11px] text-slate-400 font-mono">
                      <span>
                        {isUrdu ? 'Progress:' : 'Progress:'} {inv.daysPassed} / {inv.totalDays} {isUrdu ? 'Din' : 'Days'}
                      </span>
                      <span className="text-amber-400 font-bold">{percent}%</span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-slate-950 overflow-hidden border border-slate-800">
                      <div
                        className="h-full bg-gradient-to-r from-amber-500 to-emerald-400 transition-all duration-500 rounded-full"
                        style={{ width: `${Math.max(4, percent)}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* SECTION 2: REFERRAL PROGRAM MALOMAT & INVITE */}
      <div className="rounded-3xl p-4 sm:p-5 bg-gradient-to-br from-[#121727] via-[#0f1422] to-[#0b0e17] border border-indigo-500/20 shadow-xl space-y-3.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
              <Share2 className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-xs font-black text-white flex items-center gap-1.5">
                <span>{isUrdu ? 'Referral Program (Team Banayein)' : 'Referral Program (Invite & Earn)'}</span>
                <span className="text-[10px] bg-amber-400 text-slate-950 px-2 py-0.2 rounded font-black">
                  22% Bonus
                </span>
              </h4>
              <p className="text-[11px] text-indigo-300/80">
                {isUrdu
                  ? 'Level 1: 15% | Level 2: 5% | Level 3: 2% Fauri Commission'
                  : 'Level 1: 15% | Level 2: 5% | Level 3: 2% Instant Payout'}
              </p>
            </div>
          </div>
        </div>

        {/* Code & Link Box */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
          {/* Referral Code */}
          <div className="p-3 rounded-2xl bg-slate-950/70 border border-indigo-500/20 flex items-center justify-between">
            <div>
              <span className="text-[10px] text-slate-400 block">{isUrdu ? 'Aap Ka Referral Code:' : 'Your Code:'}</span>
              <span className="text-amber-300 font-mono font-black text-sm">{userRefCode}</span>
            </div>
            <button
              onClick={handleCopyRefCode}
              className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-indigo-950/70 hover:bg-indigo-900 border border-indigo-500/30 text-indigo-200 text-xs font-bold transition-all active:scale-95"
            >
              {copiedRefCode ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedRefCode ? (isUrdu ? 'Copied' : 'Copied') : (isUrdu ? 'Code Copy' : 'Copy')}</span>
            </button>
          </div>

          {/* Referral Link */}
          <div className="p-3 rounded-2xl bg-slate-950/70 border border-indigo-500/20 flex items-center justify-between">
            <div className="truncate mr-2">
              <span className="text-[10px] text-slate-400 block">{isUrdu ? 'Aap Ka Referral Link:' : 'Invite Link:'}</span>
              <span className="text-slate-200 font-mono text-[11px] truncate block opacity-90">{referralLink}</span>
            </div>
            <button
              onClick={handleCopyRefLink}
              className="shrink-0 flex items-center gap-1 px-3 py-1.5 rounded-lg bg-indigo-950/70 hover:bg-indigo-900 border border-indigo-500/30 text-indigo-200 text-xs font-bold transition-all active:scale-95"
            >
              {copiedRefLink ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedRefLink ? (isUrdu ? 'Copied' : 'Copied') : (isUrdu ? 'Link Copy' : 'Copy')}</span>
            </button>
          </div>
        </div>

        {/* WhatsApp Share Button */}
        <button
          onClick={handleShareWhatsApp}
          className="w-full flex items-center justify-center gap-2 py-3 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs shadow-md shadow-emerald-950/40 transition-all hover:scale-[1.01] active:scale-[0.99]"
        >
          <Share2 className="w-4 h-4" />
          <span>{isUrdu ? 'WhatsApp Par Dostoon Ko Dawat Dein (Share Link)' : 'Invite Friends via WhatsApp'}</span>
        </button>
      </div>

      {/* SECTION 3: OFFICIAL APP DOWNLOAD (APK) */}
      <div className="rounded-3xl p-4 sm:p-5 bg-gradient-to-br from-[#0f192b] via-[#0d1524] to-[#090e18] border border-blue-500/20 shadow-xl space-y-3.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white shadow-md">
              <Smartphone className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-black text-white flex items-center gap-2">
                <span>{isUrdu ? 'Official 7x Trading Android App (APK)' : 'Official Android App (APK)'}</span>
                <span className="text-[10px] bg-blue-500/20 text-blue-300 border border-blue-500/30 px-2 py-0.2 rounded font-bold font-mono">
                  v2.4
                </span>
              </h4>
              <p className="text-[11px] text-blue-300/80">
                {isUrdu
                  ? 'Fauri notifications, tezi se withdrawals aur 100% mehfooz APK'
                  : 'Fast notifications, instant payouts, 100% safe APK (4.8 MB)'}
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={handleDownloadApp}
            className="flex items-center justify-center gap-1.5 py-3 px-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-black text-xs shadow-md shadow-blue-950/40 transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            <Download className="w-4 h-4" />
            <span>{isUrdu ? 'App Download Karein' : 'Download APK'}</span>
          </button>

          <button
            onClick={handleCopyAppLink}
            className="flex items-center justify-center gap-1.5 py-3 px-3 rounded-xl bg-slate-900/80 hover:bg-slate-800 border border-blue-500/20 text-blue-200 font-bold text-xs transition-colors"
          >
            {copiedAppLink ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-blue-400" />}
            <span>{copiedAppLink ? (isUrdu ? 'Copied' : 'Copied') : (isUrdu ? 'App Link Copy' : 'Copy Link')}</span>
          </button>
        </div>
      </div>

      {/* Live Payouts Activity Feed */}
      <div className="bg-[#0e131d] rounded-2xl p-3 border border-slate-800 flex items-center gap-2 overflow-x-auto text-[11px] scrollbar-none">
        <span className="font-bold text-amber-400 shrink-0 flex items-center gap-1 bg-amber-500/10 px-2.5 py-1 rounded-lg border border-amber-500/20">
          <Clock className="w-3.5 h-3.5 text-amber-400" />
          {isUrdu ? 'Live Payouts' : 'Live Payouts'}
        </span>
        <div className="flex items-center gap-3 shrink-0 text-slate-300">
          {socialFeed.map((item, idx) => (
            <span key={idx} className="flex items-center gap-1.5 font-mono">
              <span className="text-slate-400">{item.phone}</span>
              <span className="text-emerald-400 font-bold">{item.amount}</span>
              <span className="text-[10px] text-slate-500">({item.method})</span>
            </span>
          ))}
        </div>
      </div>

      {/* SECTION 4: OFFICIAL INVESTMENT PLANS */}
      <div id="official-plans-section" className="pt-2">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-5 bg-amber-400 rounded-full"></div>
            <h2 className="text-base font-extrabold text-white flex items-center gap-2">
              {t.plans}
              <span className="text-xs font-normal text-amber-400 font-mono">({OFFICIAL_PLANS.length})</span>
            </h2>
          </div>

          <span className="text-[11px] text-slate-400 flex items-center gap-1 font-medium">
            <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
            60 {t.days} {isUrdu ? 'Muddat' : 'Term'}
          </span>
        </div>

        {/* Filters */}
        <div className="flex gap-1.5 overflow-x-auto pb-1 mb-3.5 scrollbar-none text-xs">
          <button
            onClick={() => setFilter('all')}
            className={`px-3 py-1.5 rounded-xl border font-bold shrink-0 transition-all ${
              filter === 'all'
                ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-md'
                : 'bg-slate-900/60 text-slate-400 border-slate-800 hover:border-slate-700'
            }`}
          >
            {isUrdu ? 'Tamam Plans' : 'All Plans'}
          </button>
          <button
            onClick={() => setFilter('starter')}
            className={`px-3 py-1.5 rounded-xl border font-bold shrink-0 transition-all ${
              filter === 'starter'
                ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-md'
                : 'bg-slate-900/60 text-slate-400 border-slate-800 hover:border-slate-700'
            }`}
          >
            {isUrdu ? 'Starter (345 - 1250)' : 'Starter (345 - 1250)'}
          </button>
          <button
            onClick={() => setFilter('vip')}
            className={`px-3 py-1.5 rounded-xl border font-bold shrink-0 transition-all ${
              filter === 'vip'
                ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-md'
                : 'bg-slate-900/60 text-slate-400 border-slate-800 hover:border-slate-700'
            }`}
          >
            {isUrdu ? 'VIP (3000 - 13500)' : 'VIP (3000 - 13500)'}
          </button>
          <button
            onClick={() => setFilter('elite')}
            className={`px-3 py-1.5 rounded-xl border font-bold shrink-0 transition-all ${
              filter === 'elite'
                ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-md'
                : 'bg-slate-900/60 text-slate-400 border-slate-800 hover:border-slate-700'
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
              className={`relative rounded-3xl p-4.5 transition-all duration-200 border ${
                plan.popular
                  ? 'bg-gradient-to-r from-[#161d2d] via-[#131926] to-[#0f141f] border-amber-500/40 shadow-xl'
                  : 'bg-[#121824] border-slate-800 hover:border-slate-700'
              }`}
            >
              {/* Popular / Tag Badge */}
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-1.5">
                  <span
                    className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md border ${
                      plan.popular
                        ? 'bg-amber-400 text-slate-950 border-amber-300 font-extrabold'
                        : 'bg-slate-800/80 text-amber-300 border-slate-700'
                    }`}
                  >
                    {isUrdu ? plan.tagUrdu : plan.tag}
                  </span>
                  {userHasActive > 0 && (
                    <span className="text-[10px] font-semibold text-emerald-400 bg-emerald-950/60 border border-emerald-500/30 px-2 py-0.5 rounded-md font-mono">
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
                    {plan.name}
                  </h3>
                  <div className="flex items-center gap-2 mt-1 text-xs">
                    <span className="text-amber-300 font-mono font-black text-sm">
                      PKR {plan.price.toLocaleString()}
                    </span>
                    <span className="text-slate-600">•</span>
                    <span className="text-slate-300 font-medium">
                      {isUrdu ? 'Rozana Munafa:' : 'Daily:'}{' '}
                      <strong className="text-emerald-400 font-mono font-bold">PKR {plan.dailyProfit.toLocaleString()}</strong>
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-400 mt-1 flex items-center gap-1">
                    <span>{isUrdu ? '60 Din Mein Kul Return:' : '60-day return:'}</span>
                    <span className="text-amber-200 font-bold font-mono">
                      PKR {plan.totalReturn.toLocaleString()}
                    </span>
                  </div>
                </div>

                {/* Invest Button */}
                <button
                  onClick={() => onSelectPlan(plan)}
                  className="shrink-0 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-xs py-3 px-4 rounded-xl shadow-md transition-all hover:scale-105 active:scale-95 flex items-center gap-1"
                >
                  <span>{t.investNow}</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
