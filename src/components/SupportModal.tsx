import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { SUPPORT_DETAILS } from '../data/plans';
import { X, MessageCircle, Send, ChevronDown, ChevronUp, ShieldCheck, Clock, HelpCircle } from 'lucide-react';

interface SupportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SupportModal: React.FC<SupportModalProps> = ({ isOpen, onClose }) => {
  const { lang, t } = useApp();
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const isUrdu = lang === 'ur';

  if (!isOpen) return null;

  const faqs = isUrdu
    ? [
        {
          q: 'Raqam deposit karne ke baad balance kab tak show hota hai?',
          a: 'Deposit request submit karne ke baad system Transaction ID (TID) verify kar ke 5 se 15 minute mein balance aap ke account mein credit kar deta hai.',
        },
        {
          q: 'Kam az kam withdrawal ki had aur fee kya hai?',
          a: 'Kam az kam withdrawal sirf PKR 150 hai. Withdrawal par koi hidden fee nahi hai (0% fee) aur raqam 10 minute se 2 ghantay ke andar aap ke EasyPaisa / JazzCash mein pohnch jati hai.',
        },
        {
          q: 'Rozana munafa kis waqt claim kiya ja sakta hai?',
          a: 'Plan active hone ke baad har 24 ghantay baad dashboard par "Aaj Ka Munafa Claim Karein" ka button active ho jata hai, jis par click karte hi profit foran aap ke balance mein shamil ho jata hai.',
        },
        {
          q: 'Referral commission kis tarah milta hai?',
          a: 'Aap ke referral link se shamil hone walay doston ki investment par Level 1 se 15%, Level 2 se 5% aur Level 3 se 2% permanent commission foran aap ke wallet mein credit hota hai.',
        },
      ]
    : [
        {
          q: 'How long does a deposit take to reflect in balance?',
          a: 'After submitting your Transaction ID (TID), our team verifies the payment within 5-15 minutes and immediately credits your wallet.',
        },
        {
          q: 'What is the minimum withdrawal and fee?',
          a: 'Minimum withdrawal is just PKR 150 with 0% fee. Funds are transferred to your EasyPaisa / JazzCash within 10 minutes to 2 hours.',
        },
        {
          q: 'When can I claim my daily profit?',
          a: 'Every 24 hours after plan activation, your "Claim Today\'s Profit" button illuminates on the dashboard for instant one-click redemption.',
        },
        {
          q: 'How does the multi-tier referral system work?',
          a: 'You earn 15% on direct referrals (Tier 1), 5% on Tier 2 referrals, and 2% on Tier 3 referrals. All commissions are instantly withdrawable.',
        },
      ];

  const handleWhatsAppClick = () => {
    window.open(SUPPORT_DETAILS.whatsappUrl, '_blank');
  };

  const handleTelegramClick = () => {
    window.open('https://t.me/7xTradingOfficialPak', '_blank');
  };

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
            <HelpCircle className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">{t.supportTitle}</h3>
            <p className="text-xs text-slate-400">24/7 Official Representative Assistance</p>
          </div>
        </div>

        {/* Live Support Buttons */}
        <div className="grid grid-cols-2 gap-3 mb-5">
          <button
            onClick={handleWhatsAppClick}
            className="flex flex-col items-center justify-center gap-1.5 p-3.5 rounded-2xl bg-[#075e54]/30 hover:bg-[#075e54]/50 border border-emerald-500/40 text-emerald-300 font-bold text-xs transition-all hover:scale-[1.02]"
          >
            <div className="flex items-center gap-1.5">
              <div className="w-8 h-8 rounded-full bg-emerald-500 flex items-center justify-center text-white shadow">
                <MessageCircle className="w-4 h-4 fill-white" />
              </div>
            </div>
            <span>Chat on WhatsApp</span>
            <span className="text-[10px] text-emerald-400 font-medium">Click to Chat (Help)</span>
          </button>

          <button
            onClick={handleTelegramClick}
            className="flex flex-col items-center justify-center gap-1.5 p-3.5 rounded-2xl bg-[#0088cc]/20 hover:bg-[#0088cc]/40 border border-sky-500/40 text-sky-300 font-bold text-xs transition-all hover:scale-[1.02]"
          >
            <div className="flex items-center gap-1.5">
              <div className="w-8 h-8 rounded-full bg-[#0088cc] flex items-center justify-center text-white shadow">
                <Send className="w-4 h-4 fill-white" />
              </div>
            </div>
            <span>Telegram Channel</span>
            <span className="text-[10px] text-sky-400 font-normal">@7xTradingPak</span>
          </button>
        </div>

        {/* Badges */}
        <div className="grid grid-cols-2 gap-2 mb-5">
          <div className="bg-[#0a0d14] p-3 rounded-2xl border border-slate-800 flex items-center gap-2.5 text-xs text-slate-300">
            <Clock className="w-4 h-4 text-amber-400 shrink-0" />
            <div>
              <div className="font-semibold">{isUrdu ? 'Response Time' : 'Response Time'}</div>
              <div className="text-[10px] text-slate-400">{isUrdu ? '5 minute ke andar' : 'Under 5 minutes'}</div>
            </div>
          </div>
          <div className="bg-[#0a0d14] p-3 rounded-2xl border border-slate-800 flex items-center gap-2.5 text-xs text-slate-300">
            <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
            <div>
              <div className="font-semibold">{isUrdu ? 'Verified System' : 'Verified System'}</div>
              <div className="text-[10px] text-slate-400">{isUrdu ? '100% Mehfooz Funds' : 'SSL Encrypted'}</div>
            </div>
          </div>
        </div>

        {/* FAQ Accordion */}
        <div className="mb-2">
          <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-2.5">
            {t.faq}
          </h4>
          <div className="space-y-2">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className="bg-[#0a0d14] rounded-2xl border border-slate-800 overflow-hidden transition-all"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === index ? null : index)}
                  className="w-full p-3.5 text-left flex items-center justify-between gap-2 text-xs font-semibold text-slate-200 hover:text-white"
                >
                  <span>{faq.q}</span>
                  {openFaq === index ? (
                    <ChevronUp className="w-4 h-4 text-amber-400 shrink-0" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-slate-500 shrink-0" />
                  )}
                </button>
                {openFaq === index && (
                  <div className="px-3.5 pb-3.5 pt-1 text-[11px] text-slate-400 leading-relaxed border-t border-slate-800/80">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
