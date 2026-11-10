import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { PAYMENT_DETAILS, PAYMENT_METHODS, OFFICIAL_PLANS } from '../data/plans';
import { PaymentMethod } from '../types';
import {
  Copy,
  Check,
  CreditCard,
  Send,
  AlertCircle,
  HelpCircle,
  CheckCircle2,
  Clock,
  ArrowDownLeft,
  ShieldCheck,
  Ban,
} from 'lucide-react';

interface DepositTabProps {
  onOpenAdmin?: () => void;
}

export const DepositTab: React.FC<DepositTabProps> = ({ onOpenAdmin }) => {
  const { lang, t, deposit, transactions, showToast, pendingDepositsCount } = useApp();
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod>('easypaisa');
  const [tid, setTid] = useState('');
  const [amount, setAmount] = useState<string>('');
  const [copiedType, setCopiedType] = useState<'number' | 'name' | null>(null);
  const [showTidHelp, setShowTidHelp] = useState(false);

  const isUrdu = lang === 'ur';
  const currentAccount = PAYMENT_METHODS[selectedMethod] || PAYMENT_METHODS.easypaisa;

  const handleCopy = (text: string, type: 'number' | 'name') => {
    navigator.clipboard.writeText(text);
    setCopiedType(type);
    showToast(t.copied, 'success');
    setTimeout(() => setCopiedType(null), 2500);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const numAmount = parseFloat(amount);
    const success = deposit(numAmount, selectedMethod, tid);
    if (success) {
      setAmount('');
      setTid('');
    }
  };

  const depositTransactions = transactions.filter((tx) => tx.type === 'deposit');

  return (
    <div className="space-y-4 pb-6">
      {/* Tab Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-1.5 h-5 bg-orange-600 rounded-full"></div>
          <div>
            <h2 className="text-base font-extrabold text-white">{t.depositTitle}</h2>
            <p className="text-xs text-stone-400">{t.depositSubtitle}</p>
          </div>
        </div>

        {onOpenAdmin && (
          <button
            onClick={onOpenAdmin}
            className="flex items-center gap-1.5 text-xs font-bold py-1.5 px-3 rounded-xl bg-purple-950/70 hover:bg-purple-900 border border-purple-500/40 text-purple-200 transition-all shadow-sm"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-purple-400" />
            <span>Admin Approvals</span>
            {pendingDepositsCount > 0 && (
              <span className="w-4 h-4 rounded-full bg-amber-500 text-stone-950 text-[10px] font-black flex items-center justify-center">
                {pendingDepositsCount}
              </span>
            )}
          </button>
        )}
      </div>

      {/* Pending Deposit Alert Banner */}
      {pendingDepositsCount > 0 && (
        <div className="rounded-2xl p-3.5 bg-gradient-to-r from-amber-950/60 to-[#2c1304] border border-amber-500/40 flex items-center justify-between gap-3 animate-in fade-in shadow-lg">
          <div className="flex items-center gap-2.5">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-ping shrink-0"></span>
            <div>
              <p className="text-xs font-bold text-amber-300">
                {isUrdu
                  ? `${pendingDepositsCount} Deposit Request Admin Review Mein Hai`
                  : `${pendingDepositsCount} Deposit Request Pending Admin Review`}
              </p>
              <p className="text-[11px] text-stone-300">
                {isUrdu
                  ? 'Admin tasdeeq / approval ke baad balance foran credit ho jayega.'
                  : 'Balance will be credited immediately once approved by admin.'}
              </p>
            </div>
          </div>
          {onOpenAdmin && (
            <button
              onClick={onOpenAdmin}
              className="shrink-0 text-xs font-black py-1.5 px-3 rounded-lg bg-amber-500 hover:bg-amber-400 text-stone-950 shadow transition-all hover:scale-105 active:scale-95"
            >
              {isUrdu ? 'Approve Karein' : 'Approve'}
            </button>
          )}
        </div>
      )}

      {/* Official Payment Account Card */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#2f0c0c] via-[#220707] to-[#160404] p-5 border border-orange-500/40 shadow-xl shadow-orange-950/40">
        <div className="flex items-center justify-between text-xs text-stone-300 pb-3 mb-3 border-b border-[#3b0f0f]">
          <span className="font-bold flex items-center gap-1.5 text-amber-400">
            <CreditCard className="w-4 h-4 text-amber-400" />
            {t.accountDetails}
          </span>
          <span className="text-[11px] text-emerald-400 bg-emerald-950/70 border border-emerald-500/30 px-2 py-0.5 rounded-full font-medium">
            0% {isUrdu ? 'Fee' : 'Fee'} • {isUrdu ? 'Instant (Fauri)' : 'Instant'}
          </span>
        </div>

        {/* Payment Methods Tabs */}
        <div className="grid grid-cols-3 gap-2 mb-4">
          {PAYMENT_DETAILS.methods.map((method) => (
            <button
              key={method.id}
              type="button"
              onClick={() => setSelectedMethod(method.id as PaymentMethod)}
              className={`p-2 rounded-xl border text-center transition-all ${
                selectedMethod === method.id
                  ? 'bg-gradient-to-r from-orange-600 to-amber-600 border-amber-400 text-white font-bold shadow-md shadow-orange-950/50 scale-[1.02]'
                  : 'bg-[#180505] text-stone-400 border-[#380e0e] hover:border-orange-500/30'
              }`}
            >
              <div className="text-xs font-semibold">{method.name}</div>
              <div className="text-[10px] opacity-80">{isUrdu ? method.nameUrdu : method.badge}</div>
            </button>
          ))}
        </div>

        {/* Dynamic Account Details Box for Selected Method */}
        <div className="bg-[#120303] rounded-xl p-3.5 border border-[#3b0f0f] space-y-3">
          {/* Method Badge & Bank Name */}
          <div className="flex items-center justify-between pb-2 border-b border-[#240606] text-xs">
            <span className="font-bold text-amber-400 flex items-center gap-1">
              <span>{currentAccount.name}</span>
              {currentAccount.bankName && (
                <span className="text-[10px] bg-blue-950/80 text-blue-300 border border-blue-500/30 px-2 py-0.5 rounded-full">
                  Bank: {currentAccount.bankName}
                </span>
              )}
            </span>
            <span className="text-[11px] text-stone-400">
              {isUrdu ? 'Official Account' : 'Verified Payout'}
            </span>
          </div>

          {/* Account Number */}
          <div className="flex items-center justify-between gap-2">
            <div>
              <span className="text-[11px] text-stone-400 block">{t.accountNumber}:</span>
              <span className="text-lg font-black text-amber-300 font-mono tracking-wider">
                {currentAccount.accountNumber}
              </span>
            </div>
            <button
              type="button"
              onClick={() => handleCopy(currentAccount.accountNumberRaw, 'number')}
              className="flex items-center gap-1 text-xs font-bold py-1.5 px-3 rounded-lg bg-orange-600/30 hover:bg-orange-600/50 border border-orange-500/40 text-orange-200 transition-all active:scale-95"
            >
              {copiedType === 'number' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedType === 'number' ? t.copied : t.copyNumber}</span>
            </button>
          </div>

          {/* Account Title */}
          <div className="flex items-center justify-between gap-2 pt-2 border-t border-[#290808]">
            <div>
              <span className="text-[11px] text-stone-400 block">{t.accountHolder}:</span>
              <span className="text-sm font-bold text-white tracking-wide">
                {currentAccount.accountName}
              </span>
            </div>
            <button
              type="button"
              onClick={() => handleCopy(currentAccount.accountName, 'name')}
              className="flex items-center gap-1 text-xs font-semibold py-1 px-2.5 rounded-lg bg-white/5 hover:bg-white/10 text-stone-300 border border-white/10 transition-all active:scale-95"
            >
              {copiedType === 'name' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedType === 'name' ? t.copied : t.copyName}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Deposit Form */}
      <form onSubmit={handleSubmit} className="bg-[#200707] rounded-2xl p-4 border border-[#3e1010] shadow-lg space-y-4">
        {/* Quick Amount Pills */}
        <div>
          <label className="block text-xs font-semibold text-stone-300 mb-2 urdu-font">
            {t.quickAmounts}
          </label>
          <div className="grid grid-cols-3 sm:grid-cols-4 gap-1.5">
            {OFFICIAL_PLANS.slice(0, 6).map((plan) => (
              <button
                key={plan.id}
                type="button"
                onClick={() => setAmount(plan.price.toString())}
                className={`py-1.5 px-2 rounded-lg border text-xs font-mono font-semibold transition-all ${
                  amount === plan.price.toString()
                    ? 'bg-amber-500 text-stone-950 border-amber-400 font-bold'
                    : 'bg-[#160404] text-stone-300 border-[#380e0e] hover:border-orange-500/30'
                }`}
              >
                ₨ {plan.price.toLocaleString()}
              </button>
            ))}
          </div>
        </div>

        {/* Amount Input */}
        <div>
          <label className="block text-xs font-semibold text-stone-300 mb-1.5 urdu-font">
            {t.enterAmount}
          </label>
          <div className="relative">
            <span className="absolute left-3 [dir=rtl]:left-auto [dir=rtl]:right-3 top-1/2 -translate-y-1/2 text-stone-400 font-bold text-xs">
              PKR
            </span>
            <input
              type="number"
              min="100"
              required
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder={t.amountPlaceholder}
              className="w-full bg-[#120303] border border-[#3e1010] focus:border-orange-500 rounded-xl py-2.5 px-12 text-sm text-white font-mono placeholder:text-stone-600 focus:outline-none focus:ring-1 focus:ring-orange-500"
            />
          </div>
        </div>

        {/* Transaction ID (TID) Input */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="block text-xs font-semibold text-stone-300 urdu-font">
              {t.enterTid}
            </label>
            <button
              type="button"
              onClick={() => setShowTidHelp(!showTidHelp)}
              className="text-[11px] text-amber-400 flex items-center gap-1 hover:underline"
            >
              <HelpCircle className="w-3 h-3" />
              <span>{isUrdu ? 'TID Kya Hai?' : 'What is TID?'}</span>
            </button>
          </div>

          <input
            type="text"
            required
            value={tid}
            onChange={(e) => setTid(e.target.value)}
            placeholder={t.tidPlaceholder}
            className="w-full bg-[#120303] border border-[#3e1010] focus:border-orange-500 rounded-xl py-2.5 px-3 text-sm text-white font-mono placeholder:text-stone-600 focus:outline-none focus:ring-1 focus:ring-orange-500 uppercase"
          />

          {showTidHelp && (
            <div className="mt-2 p-3 rounded-xl bg-[#140303] border border-amber-500/30 text-[11px] text-stone-300 leading-relaxed animate-in fade-in">
              <p className="font-semibold text-amber-300 mb-1">
                {isUrdu ? '📌 TID Maloom Karne Ka Tareeqa:' : '📌 Finding your Transaction ID (TID):'}
              </p>
              <p>
                {isUrdu
                  ? 'Raqam transfer karne ke baad EasyPaisa (3737) ya JazzCash (8558) ki taraf se tasdeeqi SMS milta hai. Is SMS mein 11 ya 12 digits ka TID code (misal ke tor par: TID 29849204820) likha hota hai. Woh code yahan darj karein.'
                  : 'After sending money, you receive an SMS from EasyPaisa (3737) or JazzCash (8558). Look for the Trx ID / TID (e.g., TID: 29849204820) and enter it here.'}
              </p>
            </div>
          )}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full bg-gradient-to-r from-orange-600 via-[#ff4500] to-amber-600 hover:from-orange-500 hover:to-amber-500 text-white font-extrabold py-3 px-4 rounded-xl shadow-lg shadow-orange-950/60 flex items-center justify-center gap-2 transition-all hover:scale-[1.01] active:scale-[0.99] text-sm"
        >
          <Send className="w-4 h-4" />
          <span>{t.submitDeposit}</span>
        </button>
      </form>

      {/* Instructions Card */}
      <div className="bg-[#170404] rounded-2xl p-4 border border-[#360e0e]">
        <h4 className="text-xs font-bold text-stone-200 mb-3 flex items-center gap-1.5">
          <AlertCircle className="w-4 h-4 text-amber-400" />
          {t.depositInstructionsTitle}
        </h4>
        <div className="space-y-2 text-xs text-stone-400 leading-relaxed">
          <p>{t.step1}</p>
          <p>{t.step2}</p>
          <p>{t.step3}</p>
        </div>
      </div>

      {/* Recent Deposits History */}
      {depositTransactions.length > 0 && (
        <div className="pt-2">
          <h3 className="text-xs font-bold text-stone-300 uppercase tracking-wider mb-2 flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-amber-400" />
            {isUrdu ? 'Deposit History (Jama Shuda Raqam)' : 'Recent Deposits'}
          </h3>
          <div className="space-y-2">
            {depositTransactions.slice(0, 6).map((tx) => (
              <div
                key={tx.id}
                className={`border rounded-xl p-3 flex items-center justify-between text-xs transition-all ${
                  tx.status === 'pending'
                    ? 'bg-gradient-to-r from-[#290d05] to-[#1c0606] border-amber-500/40 shadow-sm'
                    : tx.status === 'rejected'
                    ? 'bg-[#180404] border-rose-500/30'
                    : 'bg-[#1c0606] border-[#380e0e]'
                }`}
              >
                <div className="flex items-center gap-2">
                  <div
                    className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                      tx.status === 'pending'
                        ? 'bg-amber-950/70 border border-amber-500/40 text-amber-400'
                        : tx.status === 'rejected'
                        ? 'bg-rose-950/70 border border-rose-500/30 text-rose-400'
                        : 'bg-emerald-950/70 border border-emerald-500/30 text-emerald-400'
                    }`}
                  >
                    <ArrowDownLeft className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="font-mono font-bold text-white">
                      +PKR {tx.amount.toLocaleString()}
                    </div>
                    <div className="text-[10px] text-stone-400 font-mono">
                      {tx.tid ? `TID: ${tx.tid}` : tx.note || 'Direct'}
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  {tx.status === 'pending' ? (
                    <button
                      type="button"
                      onClick={onOpenAdmin}
                      title="Click to view in Admin Portal"
                      className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-950/90 text-amber-300 border border-amber-500/50 hover:bg-amber-900 transition-colors"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping"></span>
                      <span>Pending Approval</span>
                    </button>
                  ) : tx.status === 'rejected' ? (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-rose-950 text-rose-300 border border-rose-500/30">
                      <Ban className="w-3 h-3" />
                      <span>{t.statusRejected}</span>
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-950 text-emerald-300 border border-emerald-500/30">
                      <CheckCircle2 className="w-3 h-3" />
                      <span>{t.statusCompleted}</span>
                    </span>
                  )}
                  <div className="text-[10px] text-stone-500 mt-0.5 font-mono">
                    {new Date(tx.date).toLocaleDateString()}
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
