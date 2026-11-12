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
  ChevronRight,
  TrendingUp,
  Download,
  HelpCircle,
  LogOut,
  ShieldCheck,
  Search,
  UserCheck,
} from 'lucide-react';

interface AccountTabProps {
  onOpenSupport: () => void;
  onOpenCalculator: () => void;
  onOpenAdmin: () => void;
}

export const AccountTab: React.FC<AccountTabProps> = ({ onOpenSupport, onOpenCalculator, onOpenAdmin }) => {
  const {
    lang,
    t,
    user,
    logout,
    realTeam,
    showToast,
    resetData,
    pendingDepositsCount,
    pendingWithdrawalsCount,
  } = useApp();

  const [copiedType, setCopiedType] = useState<'ref' | 'code' | 'download' | null>(null);
  const [teamTierFilter, setTeamTierFilter] = useState<'all' | '1' | '2' | '3'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const isUrdu = lang === 'ur';

  // Real Customer's Referral Credentials
  const userRefCode = user?.referralCode || (user?.contact ? `ref_${user.contact.slice(-4)}` : 'rehman_99');
  const referralLink = `${window.location.origin}/join?ref=${userRefCode}`;
  const appDownloadLink = `${window.location.origin}/downloads/7xTrading_Official_v2.4.apk`;

  // Real Team Tiers Calculation
  const level1Members = realTeam.filter((m) => m.tier === 1);
  const level2Members = realTeam.filter((m) => m.tier === 2);
  const level3Members = realTeam.filter((m) => m.tier === 3);

  const totalCommissionEarned = realTeam.reduce((sum, m) => sum + m.commissionEarned, 0);

  // Filtered Team Members
  const filteredTeam = realTeam.filter((member) => {
    if (teamTierFilter !== 'all' && member.tier.toString() !== teamTierFilter) {
      return false;
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      return (
        member.name.toLowerCase().includes(q) ||
        member.contact.toLowerCase().includes(q) ||
        member.referralCode.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const handleCopy = (text: string, type: 'ref' | 'code' | 'download') => {
    navigator.clipboard.writeText(text);
    setCopiedType(type);
    showToast(
      type === 'code'
        ? isUrdu
          ? 'Referral Code copy ho gaya!'
          : 'Referral code copied!'
        : type === 'ref'
        ? isUrdu
          ? 'Referral Link copy ho gaya!'
          : 'Referral link copied!'
        : isUrdu
        ? 'App link copy ho gaya!'
        : 'App link copied!',
      'success'
    );
    setTimeout(() => setCopiedType(null), 2500);
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
        isUrdu ? 'Download link copy karein' : 'Please copy download link',
        'info'
      );
    }
  };

  const handleShareWhatsApp = () => {
    const text = isUrdu
      ? `🚀 *7x Trading Online Investment App*\n\nAssalam-o-Alaikum! 7x Trading platform par rozana guaranteed munafa kamayein.\n\n🔑 *Mera Referral Code:* ${userRefCode}\n🔗 *Account Banane Ka Link:* ${referralLink}\n📲 *Official App APK:* ${appDownloadLink}\n\nEasyPaisa aur JazzCash se foran deposit aur fast withdrawal payein!`
      : `🚀 *7x Trading Investment App*\n\nEarn guaranteed daily profits!\n\n🔑 *Invite Code:* ${userRefCode}\n🔗 *Join via Link:* ${referralLink}\n📲 *App Download:* ${appDownloadLink}\n\nFast deposits and withdrawals with EasyPaisa & JazzCash.`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
  };

  return (
    <div className="space-y-4 pb-6">
      {/* Header */}
      <div className="flex items-center gap-2">
        <div className="w-1.5 h-5 bg-amber-400 rounded-full"></div>
        <div>
          <h2 className="text-base font-extrabold text-white">{t.account}</h2>
          <p className="text-xs text-slate-400">
            {isUrdu ? 'User Profile, Real Team (Sathiyan) aur Referral Program' : 'User Profile, Real Team & Referral Program'}
          </p>
        </div>
      </div>

      {/* User Profile Card */}
      <div className="rounded-3xl bg-gradient-to-br from-[#121824] via-[#0f141f] to-[#0a0d14] p-5 border border-slate-800 shadow-xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-400 via-amber-500 to-amber-600 flex items-center justify-center text-slate-950 font-black text-xl shadow-md border border-amber-300/40">
              7X
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-extrabold text-white text-base">
                  {user?.name || 'Rehman Khan'}
                </h3>
                <span className="text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/30">
                  {user?.role === 'admin' ? 'Admin Manager' : isUrdu ? 'VIP Investor' : 'VIP Trader'}
                </span>
              </div>
              <p className="text-xs text-slate-400 font-mono mt-0.5">
                ID: {user?.id || '7X-99812'} • {user?.contact || '03106241994'}
              </p>
            </div>
          </div>

          <div className="text-right flex flex-col items-end gap-1">
            <span className="text-[11px] text-emerald-400 font-semibold bg-emerald-950/60 border border-emerald-500/30 px-2.5 py-0.5 rounded-md flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              {isUrdu ? 'Tasdeeq Shuda' : 'Verified'}
            </span>
            <button
              onClick={logout}
              className="text-[11px] text-slate-400 hover:text-rose-400 flex items-center gap-1 mt-1 transition-colors"
            >
              <LogOut className="w-3 h-3" />
              <span>{isUrdu ? 'Logout' : 'Sign Out'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* REAL TEAM & SATHIYON KI TADAAD (CUSTOMER REAL TEAM SECTION) */}
      <div className="rounded-3xl bg-gradient-to-br from-[#121727] via-[#0f1422] to-[#0b0e17] p-5 border border-indigo-500/20 shadow-xl space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-black text-white flex items-center gap-2">
                <span>{isUrdu ? 'Aap Ki Real Team Aur Sathiyon Ki Tadaad' : 'Your Real Team & Members'}</span>
              </h3>
              <p className="text-[11px] text-indigo-300/80">
                {isUrdu ? 'Aap ke referral link se banne wale live members' : 'Live downline members registered with your code'}
              </p>
            </div>
          </div>

          <span className="text-xs font-mono font-bold px-3 py-1 rounded-full bg-indigo-950 text-indigo-300 border border-indigo-500/30">
            {realTeam.length} {isUrdu ? 'Sathiyan' : 'Members'}
          </span>
        </div>

        {/* Real Team Summary Metrics Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
          {/* Total Sathiyan */}
          <div className="bg-slate-950/60 p-3 rounded-2xl border border-slate-800">
            <span className="text-[10px] text-slate-400 block font-medium">{isUrdu ? 'Kul Sathiyan (Total):' : 'Total Team:'}</span>
            <span className="text-lg font-black text-amber-300 font-mono mt-0.5 block">
              {realTeam.length} {isUrdu ? 'Afraad' : 'Members'}
            </span>
          </div>

          {/* Level 1 Direct */}
          <div className="bg-slate-950/60 p-3 rounded-2xl border border-slate-800">
            <span className="text-[10px] text-slate-400 block font-medium">{isUrdu ? 'Direct Sathiyan (L1 - 15%):' : 'Direct (L1 - 15%):'}</span>
            <span className="text-lg font-black text-emerald-400 font-mono mt-0.5 block">
              {level1Members.length} {isUrdu ? 'Direct' : 'Direct'}
            </span>
          </div>

          {/* Level 2 & 3 Indirect */}
          <div className="bg-slate-950/60 p-3 rounded-2xl border border-slate-800">
            <span className="text-[10px] text-slate-400 block font-medium">{isUrdu ? 'Indirect Team (L2+L3):' : 'Sub-Team (L2+L3):'}</span>
            <span className="text-lg font-black text-blue-300 font-mono mt-0.5 block">
              {level2Members.length + level3Members.length} {isUrdu ? 'Afraad' : 'Members'}
            </span>
          </div>

          {/* Commission Earned */}
          <div className="bg-slate-950/60 p-3 rounded-2xl border border-slate-800">
            <span className="text-[10px] text-slate-400 block font-medium">{isUrdu ? 'Team Commission:' : 'Commission:'}</span>
            <span className="text-lg font-black text-emerald-400 font-mono mt-0.5 block">
              +PKR {totalCommissionEarned.toLocaleString()}
            </span>
          </div>
        </div>

        {/* Tier Filter Tabs */}
        <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-none text-xs">
          <button
            type="button"
            onClick={() => setTeamTierFilter('all')}
            className={`px-3 py-1.5 rounded-xl border font-bold shrink-0 transition-all ${
              teamTierFilter === 'all'
                ? 'bg-indigo-600 text-white border-indigo-500 shadow'
                : 'bg-slate-950/50 text-slate-400 border-slate-800 hover:text-white'
            }`}
          >
            {isUrdu ? 'Tamam Sathiyan' : 'All Members'} ({realTeam.length})
          </button>
          <button
            type="button"
            onClick={() => setTeamTierFilter('1')}
            className={`px-3 py-1.5 rounded-xl border font-bold shrink-0 transition-all ${
              teamTierFilter === '1'
                ? 'bg-emerald-600 text-white border-emerald-500 shadow'
                : 'bg-slate-950/50 text-slate-400 border-slate-800 hover:text-white'
            }`}
          >
            {isUrdu ? 'Level 1 (Direct 15%)' : 'Level 1 (Direct 15%)'} ({level1Members.length})
          </button>
          <button
            type="button"
            onClick={() => setTeamTierFilter('2')}
            className={`px-3 py-1.5 rounded-xl border font-bold shrink-0 transition-all ${
              teamTierFilter === '2'
                ? 'bg-amber-600 text-white border-amber-500 shadow'
                : 'bg-slate-950/50 text-slate-400 border-slate-800 hover:text-white'
            }`}
          >
            {isUrdu ? 'Level 2 (Tier 2 - 5%)' : 'Level 2 (5%)'} ({level2Members.length})
          </button>
          <button
            type="button"
            onClick={() => setTeamTierFilter('3')}
            className={`px-3 py-1.5 rounded-xl border font-bold shrink-0 transition-all ${
              teamTierFilter === '3'
                ? 'bg-rose-600 text-white border-rose-500 shadow'
                : 'bg-slate-950/50 text-slate-400 border-slate-800 hover:text-white'
            }`}
          >
            {isUrdu ? 'Level 3 (Tier 3 - 2%)' : 'Level 3 (2%)'} ({level3Members.length})
          </button>
        </div>

        {/* Search Input for Team Members */}
        {realTeam.length > 2 && (
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={isUrdu ? 'Sathi ka naam ya number talash karein...' : 'Search member by name or contact...'}
              className="w-full bg-slate-950/70 border border-slate-800 focus:border-indigo-500 rounded-xl py-2 pl-9 pr-3 text-xs text-white placeholder:text-slate-500 focus:outline-none"
            />
          </div>
        )}

        {/* Team Members List */}
        {filteredTeam.length === 0 ? (
          <div className="p-6 rounded-2xl bg-slate-950/40 border border-slate-800 text-center space-y-2">
            <UserCheck className="w-8 h-8 text-indigo-400/60 mx-auto" />
            <h4 className="text-xs font-bold text-white">
              {teamTierFilter === 'all'
                ? isUrdu
                  ? 'Aap Ki Team Mein Abhi Koi Sathi Shamil Nahi Hua'
                  : 'No Team Members Yet'
                : isUrdu
                ? `Is Level ${teamTierFilter} mein koi sathi nahi hai`
                : `No members in Tier ${teamTierFilter}`}
            </h4>
            <p className="text-[11px] text-slate-400 max-w-sm mx-auto leading-relaxed">
              {isUrdu
                ? `Apna invite code (${userRefCode}) doston ke sath share karein. Jab koi naya sathi is code se register hoga to foran aapki real team mein shamil ho jayega!`
                : `Share your invite code (${userRefCode}) with friends. When they register, they will appear here in your live team instantly!`}
            </p>
            <div className="pt-2 flex justify-center">
              <button
                type="button"
                onClick={handleShareWhatsApp}
                className="py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1.5 transition-all shadow"
              >
                <Share2 className="w-3.5 h-3.5" />
                <span>{isUrdu ? 'WhatsApp Par Doston Ko Bulayein' : 'Invite Friends via WhatsApp'}</span>
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
            {filteredTeam.map((member) => (
              <div
                key={member.id}
                className="p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800 flex items-center justify-between text-xs hover:border-slate-700 transition-colors"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center text-indigo-300 font-bold font-mono">
                    {member.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <div className="font-bold text-white flex items-center gap-2">
                      <span>{member.name}</span>
                      <span
                        className={`text-[9px] font-bold px-1.5 py-0.2 rounded font-mono ${
                          member.tier === 1
                            ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/40'
                            : member.tier === 2
                            ? 'bg-amber-950 text-amber-300 border border-amber-500/40'
                            : 'bg-rose-950 text-rose-300 border border-rose-500/40'
                        }`}
                      >
                        Tier {member.tier} ({member.tier === 1 ? '15%' : member.tier === 2 ? '5%' : '2%'})
                      </span>
                    </div>
                    <div className="text-[10px] text-slate-400 font-mono mt-0.5 flex items-center gap-2">
                      <span>{member.contact}</span>
                      <span>•</span>
                      <span className="text-slate-500">{member.joinDate}</span>
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-emerald-400 font-bold font-mono text-xs">
                    +PKR {member.commissionEarned}
                  </div>
                  <div className="text-[10px] text-emerald-400/90 font-medium">
                    {isUrdu ? 'Active Sathi' : 'Active Member'}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Referral Link & App Download Box */}
      <div className="rounded-3xl bg-[#121824] p-5 border border-slate-800 shadow-xl space-y-3.5">
        <div className="flex items-center justify-between text-xs">
          <span className="font-bold text-amber-400 flex items-center gap-1.5">
            <Share2 className="w-4 h-4 text-amber-400" />
            {isUrdu ? 'Aap Ke Referral Credentials' : 'Your Referral Credentials'}
          </span>
          <span className="text-[11px] text-amber-300 font-mono font-bold">22% Total Bonus</span>
        </div>

        {/* 1. Referral Code Box */}
        <div>
          <label className="block text-[11px] font-semibold text-slate-400 mb-1">
            {isUrdu ? '1. Aap Ka Personal Referral Code:' : '1. Your Personal Referral Code:'}
          </label>
          <div className="flex items-center gap-2 bg-[#0a0d14] border border-slate-800 p-1.5 rounded-xl">
            <input
              type="text"
              readOnly
              value={userRefCode}
              className="w-full bg-transparent text-amber-300 font-mono text-sm font-bold px-2 focus:outline-none select-all"
            />
            <button
              onClick={() => handleCopy(userRefCode, 'code')}
              className="flex items-center gap-1 shrink-0 py-1.5 px-3 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs transition-colors shadow-sm"
            >
              {copiedType === 'code' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedType === 'code' ? t.copied : isUrdu ? 'Code Copy' : 'Copy Code'}</span>
            </button>
          </div>
        </div>

        {/* 2. Referral Link Bar */}
        <div>
          <label className="block text-[11px] font-semibold text-slate-400 mb-1">
            {isUrdu ? '2. Aap Ka Referral Link:' : '2. Your Referral Link:'}
          </label>
          <div className="flex items-center gap-2 bg-[#0a0d14] border border-slate-800 p-1.5 rounded-xl">
            <input
              type="text"
              readOnly
              value={referralLink}
              className="w-full bg-transparent text-slate-200 font-mono text-xs px-2 focus:outline-none select-all"
            />
            <button
              onClick={() => handleCopy(referralLink, 'ref')}
              className="flex items-center gap-1 shrink-0 py-1.5 px-3 rounded-lg bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs transition-colors shadow-sm border border-slate-700"
            >
              {copiedType === 'ref' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedType === 'ref' ? t.copied : t.copyLink}</span>
            </button>
          </div>
        </div>

        {/* 3. App Download Link Bar */}
        <div>
          <label className="block text-[11px] font-semibold text-slate-400 mb-1">
            {isUrdu ? '3. Official Android App (APK):' : '3. Official Android App (APK):'}
          </label>
          <div className="flex items-center gap-2 bg-[#0a0d14] border border-slate-800 p-1.5 rounded-xl">
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
          className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-500 hover:to-teal-600 text-white font-black text-xs shadow-lg shadow-emerald-950/50 transition-all hover:scale-[1.01] active:scale-[0.99]"
        >
          <Download className="w-4 h-4" />
          <span>{isUrdu ? 'Direct App Download Karein (APK - 4.8 MB)' : 'Direct Download Official App (APK - 4.8 MB)'}</span>
        </button>

        {/* Social Share Buttons */}
        <div className="flex gap-2 pt-1">
          <button
            onClick={handleShareWhatsApp}
            className="w-full flex items-center justify-center gap-1.5 py-3 px-3 rounded-xl bg-[#075e54] hover:bg-[#097b6e] text-white font-bold text-xs transition-all shadow-md active:scale-95"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>{isUrdu ? 'WhatsApp Par Doston Ko Link & Code Bhejein' : 'Share Refer & App Download via WhatsApp'}</span>
          </button>
        </div>
      </div>

      {/* 3-Level Commission Rates */}
      <div className="grid grid-cols-3 gap-2">
        <div className="bg-[#121824] p-3.5 rounded-2xl border border-slate-800 text-center">
          <div className="text-[10px] text-slate-400 font-semibold">{t.level1}</div>
          <div className="text-xl font-black text-amber-400 font-mono mt-0.5">15%</div>
          <div className="text-[10px] text-slate-500 mt-0.5">{isUrdu ? 'Direct Investment' : 'Direct'}</div>
        </div>
        <div className="bg-[#121824] p-3.5 rounded-2xl border border-slate-800 text-center">
          <div className="text-[10px] text-slate-400 font-semibold">{t.level2}</div>
          <div className="text-xl font-black text-emerald-400 font-mono mt-0.5">5%</div>
          <div className="text-[10px] text-slate-500 mt-0.5">{isUrdu ? 'Doosra Level' : 'Indirect'}</div>
        </div>
        <div className="bg-[#121824] p-3.5 rounded-2xl border border-slate-800 text-center">
          <div className="text-[10px] text-slate-400 font-semibold">{t.level3}</div>
          <div className="text-xl font-black text-blue-400 font-mono mt-0.5">2%</div>
          <div className="text-[10px] text-slate-500 mt-0.5">{isUrdu ? 'Teesra Level' : 'Team Tier 3'}</div>
        </div>
      </div>

      {/* Support & Community Quick Links */}
      <div className="bg-[#121824] rounded-3xl p-5 border border-slate-800 space-y-2.5">
        <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider mb-2">
          {t.supportTitle}
        </h4>

        <button
          onClick={() => window.open(SUPPORT_DETAILS.whatsappUrl, '_blank')}
          className="w-full flex items-center justify-between p-3.5 rounded-2xl bg-[#0a2e1d]/70 hover:bg-[#0a2e1d] border border-emerald-500/40 text-xs text-emerald-200 transition-colors shadow-sm"
        >
          <div className="flex items-center gap-2.5">
            <div className="w-5 h-5 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center">
              <HelpCircle className="w-3.5 h-3.5 text-emerald-400" />
            </div>
            <MessageCircle className="w-4 h-4 text-emerald-400 fill-emerald-400" />
            <span className="font-semibold">{isUrdu ? 'WhatsApp Par Rabta Karein (Help Support)' : 'Chat on WhatsApp (Help Support)'}</span>
          </div>
          <ChevronRight className="w-4 h-4 text-emerald-400" />
        </button>

        <button
          onClick={() => window.open('https://t.me/7xTradingOfficialPak', '_blank')}
          className="w-full flex items-center justify-between p-3.5 rounded-2xl bg-[#0a0d14] hover:bg-slate-900 border border-slate-800 text-xs text-slate-200 transition-colors"
        >
          <div className="flex items-center gap-2.5">
            <Send className="w-4 h-4 text-sky-400" />
            <span>{t.telegramChannel}</span>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-500" />
        </button>

        <button
          onClick={onOpenCalculator}
          className="w-full flex items-center justify-between p-3.5 rounded-2xl bg-[#0a0d14] hover:bg-slate-900 border border-slate-800 text-xs text-slate-200 transition-colors"
        >
          <div className="flex items-center gap-2.5">
            <TrendingUp className="w-4 h-4 text-amber-400" />
            <span>{t.calculatorTitle}</span>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-500" />
        </button>

        {/* Admin Portal Button - EXCLUSIVELY FOR ADMIN */}
        {user?.role === 'admin' && (
          <button
            onClick={onOpenAdmin}
            className="w-full flex items-center justify-between p-3.5 rounded-2xl bg-purple-950/40 hover:bg-purple-950/60 border border-purple-500/40 text-xs text-purple-200 transition-colors shadow-sm"
          >
            <div className="flex items-center gap-2.5">
              <ShieldCheck className="w-4 h-4 text-purple-400" />
              <span className="font-bold">{isUrdu ? 'Admin Portal (Deposits, Withdrawals aur Users)' : 'Admin Portal (Deposits, Withdrawals & Users)'}</span>
            </div>
            {(pendingDepositsCount + pendingWithdrawalsCount) > 0 ? (
              <span className="bg-amber-400 text-slate-950 text-[10px] font-black px-2 py-0.5 rounded-full animate-pulse">
                {pendingDepositsCount + pendingWithdrawalsCount} {isUrdu ? 'Baqi' : 'Pending'}
              </span>
            ) : (
              <ChevronRight className="w-4 h-4 text-purple-400" />
            )}
          </button>
        )}
      </div>

      {/* Account Refresh & Reset */}
      <div className="pt-2">
        <button
          onClick={resetData}
          className="w-full py-2.5 px-3 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-semibold text-slate-400 flex items-center justify-center gap-1.5 transition-colors border border-white/5"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>{t.resetDataBtn}</span>
        </button>
      </div>
    </div>
  );
};
