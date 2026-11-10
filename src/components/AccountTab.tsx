import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { SUPPORT_DETAILS } from '../data/plans';
import {
  Users,
  Copy,
  Check,
  Share2,
  MessageCircle,
  Send,
  RotateCcw,
  Sparkles,
  ChevronRight,
  TrendingUp,
  Download,
  Smartphone,
  HelpCircle,
  LogOut,
  ShieldCheck,
} from 'lucide-react';

interface AccountTabProps {
  onOpenSupport: () => void;
  onOpenCalculator: () => void;
  onOpenAdmin: () => void;
}

export const AccountTab: React.FC<AccountTabProps> = ({ onOpenSupport, onOpenCalculator, onOpenAdmin }) => {
  const { lang, t, user, logout, referrals, showToast, resetData, pendingDepositsCount } = useApp();
  const [copiedType, setCopiedType] = useState<'ref' | 'download' | null>(null);
  const isUrdu = lang === 'ur';

  const referralCode = 'rehman_99';
  const referralLink = 'https://7xtrading.app/ref=rehman_99';
  const appDownloadLink = 'https://7xtrading.app/download/7xTrading_v2.apk';

  const handleCopy = (text: string, type: 'ref' | 'download') => {
    navigator.clipboard.writeText(text);
    setCopiedType(type);
    showToast(t.copied, 'success');
    setTimeout(() => setCopiedType(null), 2500);
  };

  const handleDownloadApp = () => {
    // Trigger download of app APK
    const element = document.createElement('a');
    element.setAttribute('href', appDownloadLink);
    element.setAttribute('download', '7xTrading_v2.apk');
    element.style.display = 'none';
    document.body.appendChild(element);
    showToast(isUrdu ? 'App downloading shuru ho gayi hai...' : 'Downloading 7x Trading APK...', 'success');
    setTimeout(() => {
      document.body.removeChild(element);
    }, 1000);
  };

  const handleShareWhatsApp = () => {
    const text = isUrdu
      ? `🚀 *7x Trading Online Investment App*\n\n📲 *App Download Link:* ${appDownloadLink}\n🔗 *Referral Link:* ${referralLink}\n🔑 *Invite Code:* ${referralCode}\n\nRozana guaranteed profit hasil karein. EasyPaisa aur JazzCash se foran deposit aur fast withdrawal payein!`
      : `🚀 *7x Trading Investment App*\n\n📲 *Download Official App:* ${appDownloadLink}\n🔗 *Join via Referral Link:* ${referralLink}\n🔑 *Invite Code:* ${referralCode}\n\nEarn daily profits with instant EasyPaisa & JazzCash payments!`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
  };

  const totalCommission = referrals.reduce((sum, r) => sum + r.commissionEarned, 0);
  const activeMembers = referrals.filter((r) => r.status === 'active').length;

  return (
    <div className="space-y-4 pb-6">
      {/* Header */}
      <div className="flex items-center gap-2">
        <div className="w-1.5 h-5 bg-orange-600 rounded-full"></div>
        <div>
          <h2 className="text-base font-extrabold text-white">{t.account}</h2>
          <p className="text-xs text-stone-400">User Profile, Referral & App Download</p>
        </div>
      </div>

      {/* User Profile Card */}
      <div className="rounded-2xl bg-gradient-to-br from-[#330c0c] to-[#180505] p-5 border border-orange-500/30 shadow-xl shadow-orange-950/30">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-600 flex items-center justify-center text-stone-950 font-black text-xl shadow-md">
              7X
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-white text-base">
                  {user?.name || 'Rehman Khan'}
                </h3>
                <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/30">
                  {user?.role === 'admin' ? 'Admin Manager' : 'VIP Trader'}
                </span>
              </div>
              <p className="text-xs text-stone-400 font-mono mt-0.5">
                ID: {user?.id || '7X-99812'} • {user?.contact || '03106241994'}
              </p>
            </div>
          </div>

          <div className="text-right flex flex-col items-end gap-1">
            <span className="text-[11px] text-emerald-400 font-semibold bg-emerald-950/60 border border-emerald-500/30 px-2 py-0.5 rounded-md flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              {isUrdu ? 'Verified Account' : 'Verified'}
            </span>
            <button
              onClick={logout}
              className="text-[10px] text-stone-400 hover:text-rose-400 flex items-center gap-1 mt-1 transition-colors"
            >
              <LogOut className="w-3 h-3" />
              <span>{isUrdu ? 'Logout' : 'Sign Out'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Referral Link & App Download Box */}
      <div className="rounded-2xl bg-[#220707] p-5 border border-orange-500/30 shadow-lg space-y-3.5">
        <div className="flex items-center justify-between text-xs">
          <span className="font-bold text-amber-400 flex items-center gap-1.5">
            <Users className="w-4 h-4 text-amber-400" />
            {t.referralTitle}
          </span>
          <span className="text-[11px] text-stone-400">15% Direct Commission</span>
        </div>

        <p className="text-xs text-stone-300 leading-relaxed">
          {t.referralSubtitle}
        </p>

        {/* 1. Referral Link Bar */}
        <div>
          <label className="block text-[11px] font-semibold text-stone-400 mb-1">
            {isUrdu ? '1. Aap Ka Referral Link:' : '1. Your Referral Link:'}
          </label>
          <div className="flex items-center gap-2 bg-[#120303] border border-[#3e1010] p-1.5 rounded-xl">
            <input
              type="text"
              readOnly
              value={referralLink}
              className="w-full bg-transparent text-amber-300 font-mono text-xs px-2 focus:outline-none select-all"
            />
            <button
              onClick={() => handleCopy(referralLink, 'ref')}
              className="flex items-center gap-1 shrink-0 py-1.5 px-3 rounded-lg bg-orange-600 hover:bg-orange-500 text-white font-bold text-xs transition-colors shadow-sm"
            >
              {copiedType === 'ref' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedType === 'ref' ? t.copied : t.copyLink}</span>
            </button>
          </div>
        </div>

        {/* 2. App Download Link Bar */}
        <div>
          <label className="block text-[11px] font-semibold text-stone-400 mb-1">
            {isUrdu ? '2. Official App Download Link (APK):' : '2. Official App Download Link (APK):'}
          </label>
          <div className="flex items-center gap-2 bg-[#120303] border border-[#3e1010] p-1.5 rounded-xl">
            <input
              type="text"
              readOnly
              value={appDownloadLink}
              className="w-full bg-transparent text-emerald-400 font-mono text-xs px-2 focus:outline-none select-all"
            />
            <button
              onClick={() => handleCopy(appDownloadLink, 'download')}
              className="flex items-center gap-1 shrink-0 py-1.5 px-3 rounded-lg bg-emerald-700 hover:bg-emerald-600 text-white font-bold text-xs transition-colors shadow-sm"
            >
              {copiedType === 'download' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedType === 'download' ? t.copied : 'Copy Link'}</span>
            </button>
          </div>
        </div>

        {/* Direct Download App APK Button */}
        <button
          onClick={handleDownloadApp}
          className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-500 hover:to-teal-600 text-white font-extrabold text-xs shadow-lg shadow-emerald-950/50 transition-all hover:scale-[1.01] active:scale-[0.99]"
        >
          <Download className="w-4 h-4" />
          <span>{isUrdu ? 'Direct App Download Karein (APK - 4.8 MB)' : 'Direct Download Official App (APK - 4.8 MB)'}</span>
        </button>

        {/* Social Share Buttons */}
        <div className="flex gap-2 pt-1">
          <button
            onClick={handleShareWhatsApp}
            className="flex-1 flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-[#075e54] hover:bg-[#097b6e] text-white font-bold text-xs transition-all shadow-md active:scale-95"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>{isUrdu ? 'WhatsApp Par Refer Link & App Download Bhejein' : 'Share Refer & App Download via WhatsApp'}</span>
          </button>
        </div>
      </div>

      {/* 3-Level Commission Rates */}
      <div className="grid grid-cols-3 gap-2">
        <div className="bg-[#1b0606] p-3 rounded-xl border border-amber-500/30 text-center">
          <div className="text-[10px] text-stone-400 font-semibold">{t.level1}</div>
          <div className="text-xl font-black text-amber-400 font-mono mt-0.5">15%</div>
          <div className="text-[10px] text-stone-500 mt-0.5">{isUrdu ? 'Direct Investment' : 'Direct'}</div>
        </div>
        <div className="bg-[#1b0606] p-3 rounded-xl border border-orange-500/20 text-center">
          <div className="text-[10px] text-stone-400 font-semibold">{t.level2}</div>
          <div className="text-xl font-black text-orange-400 font-mono mt-0.5">5%</div>
          <div className="text-[10px] text-stone-500 mt-0.5">{isUrdu ? 'Doosra Level' : 'Indirect'}</div>
        </div>
        <div className="bg-[#1b0606] p-3 rounded-xl border border-rose-500/20 text-center">
          <div className="text-[10px] text-stone-400 font-semibold">{t.level3}</div>
          <div className="text-xl font-black text-rose-400 font-mono mt-0.5">2%</div>
          <div className="text-[10px] text-stone-500 mt-0.5">{isUrdu ? 'Teesra Level' : 'Team Tier 3'}</div>
        </div>
      </div>

      {/* Referral Stats Summary */}
      <div className="bg-[#180404] rounded-2xl p-4 border border-[#380e0e]">
        <h4 className="text-xs font-bold text-stone-300 uppercase tracking-wider mb-3 flex items-center justify-between">
          <span>{t.teamMembers}</span>
          <span className="text-amber-400 font-mono text-[11px]">{referrals.length} Members</span>
        </h4>

        <div className="grid grid-cols-2 gap-2 mb-3">
          <div className="bg-[#120303] p-2.5 rounded-xl border border-[#2b0a0a]">
            <span className="text-[11px] text-stone-400 block">{t.totalCommission}</span>
            <span className="text-base font-bold text-emerald-400 font-mono mt-0.5 block">
              +PKR {totalCommission.toLocaleString()}
            </span>
          </div>
          <div className="bg-[#120303] p-2.5 rounded-xl border border-[#2b0a0a]">
            <span className="text-[11px] text-stone-400 block">{t.activeMembers}</span>
            <span className="text-base font-bold text-amber-300 font-mono mt-0.5 block">
              {activeMembers} / {referrals.length}
            </span>
          </div>
        </div>

        {/* Member List */}
        <div className="space-y-2">
          {referrals.map((ref) => (
            <div
              key={ref.id}
              className="bg-[#140303] p-2.5 rounded-xl border border-[#260808] flex items-center justify-between text-xs"
            >
              <div>
                <div className="font-semibold text-stone-200">{ref.name}</div>
                <div className="text-[10px] text-stone-500 font-mono">
                  {ref.phone} • Tier {ref.tier}
                </div>
              </div>
              <div className="text-right">
                <div className="text-emerald-400 font-bold font-mono">
                  +PKR {ref.commissionEarned}
                </div>
                <div className="text-[10px] text-emerald-400/80 font-medium">{ref.status}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Support & Community Quick Links */}
      <div className="bg-[#1e0707] rounded-2xl p-4 border border-[#3d0f0f] space-y-2.5">
        <h4 className="text-xs font-bold text-stone-200 uppercase tracking-wider">
          {t.supportTitle}
        </h4>

        <button
          onClick={() => window.open(SUPPORT_DETAILS.whatsappUrl, '_blank')}
          className="w-full flex items-center justify-between p-3 rounded-xl bg-[#0a2e1d]/70 hover:bg-[#0a2e1d] border border-emerald-500/40 text-xs text-emerald-200 transition-colors shadow-sm"
        >
          <div className="flex items-center gap-2.5">
            <div className="w-5 h-5 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center">
              <HelpCircle className="w-3.5 h-3.5 text-emerald-400" />
            </div>
            <MessageCircle className="w-4 h-4 text-emerald-400 fill-emerald-400" />
            <span className="font-semibold">Chat on WhatsApp (Help Support)</span>
          </div>
          <ChevronRight className="w-4 h-4 text-emerald-400" />
        </button>

        <button
          onClick={() => window.open('https://t.me/7xTradingOfficialPak', '_blank')}
          className="w-full flex items-center justify-between p-3 rounded-xl bg-[#140303] hover:bg-[#250808] border border-[#300a0a] text-xs text-stone-200 transition-colors"
        >
          <div className="flex items-center gap-2.5">
            <Send className="w-4 h-4 text-sky-400" />
            <span>{t.telegramChannel}</span>
          </div>
          <ChevronRight className="w-4 h-4 text-stone-500" />
        </button>

        <button
          onClick={onOpenCalculator}
          className="w-full flex items-center justify-between p-3 rounded-xl bg-[#140303] hover:bg-[#250808] border border-[#300a0a] text-xs text-stone-200 transition-colors"
        >
          <div className="flex items-center gap-2.5">
            <TrendingUp className="w-4 h-4 text-amber-400" />
            <span>{t.calculatorTitle}</span>
          </div>
          <ChevronRight className="w-4 h-4 text-stone-500" />
        </button>

        {/* Admin Portal Button */}
        <button
          onClick={onOpenAdmin}
          className="w-full flex items-center justify-between p-3 rounded-xl bg-purple-950/40 hover:bg-purple-950/60 border border-purple-500/40 text-xs text-purple-200 transition-colors shadow-sm"
        >
          <div className="flex items-center gap-2.5">
            <ShieldCheck className="w-4 h-4 text-purple-400" />
            <span className="font-bold">Admin Portal (Deposit Approvals)</span>
          </div>
          {pendingDepositsCount > 0 ? (
            <span className="bg-amber-500 text-stone-950 text-[10px] font-black px-2 py-0.5 rounded-full animate-pulse">
              {pendingDepositsCount} Pending
            </span>
          ) : (
            <ChevronRight className="w-4 h-4 text-purple-400" />
          )}
        </button>
      </div>

      {/* Account Refresh & Reset */}
      <div className="pt-2">
        <button
          onClick={resetData}
          className="w-full py-2.5 px-3 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-semibold text-stone-400 flex items-center justify-center gap-1.5 transition-colors border border-white/5"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>{t.resetDataBtn}</span>
        </button>
      </div>
    </div>
  );
};
