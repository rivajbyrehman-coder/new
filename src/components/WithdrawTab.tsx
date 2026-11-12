import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { PaymentMethod } from '../types';
import {
  Wallet,
  ArrowUpRight,
  ShieldCheck,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Ban,
} from 'lucide-react';

interface WithdrawTabProps {
  onOpenAdmin?: () => void;
}

export const WithdrawTab: React.FC<WithdrawTabProps> = ({ onOpenAdmin }) => {
  const { lang, t, balance, withdraw, transactions, pendingWithdrawalsCount, user } = useApp();
  const [method, setMethod] = useState<PaymentMethod>('easypaisa');
  const [accountNumber, setAccountNumber] = useState('');
  const [accountName, setAccountName] = useState('');
  const [amount, setAmount] = useState<string>('');

  const isUrdu = lang === 'ur';

  const handlePercentage = (percentage: number) => {
    const calculated = Math.floor(balance * percentage);
    setAmount(calculated > 0 ? calculated.toString() : '');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const numAmount = parseFloat(amount);
    const success = withdraw(numAmount, method, accountNumber, accountName);
    if (success) {
      setAmount('');
      setAccountNumber('');
      setAccountName('');
    }
  };

  const withdrawalTransactions = transactions.filter((tx) => tx.type === 'withdraw');

  return (
    <div className="space-y-4 pb-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-1.5 h-5 bg-amber-400 rounded-full"></div>
          <div>
            <h2 className="text-base font-extrabold text-white">{t.withdrawTitle}</h2>
            <p className="text-xs text-slate-400">{t.withdrawSubtitle}</p>
          </div>
        </div>

        {/* Admin Review Button - VISIBLE STRICTLY TO ADMIN */}
        {onOpenAdmin && user?.role === 'admin' && (
          <button
            onClick={onOpenAdmin}
            className="flex items-center gap-1.5 text-xs font-bold py-1.5 px-3 rounded-xl bg-purple-950/70 hover:bg-purple-900 border border-purple-500/40 text-purple-200 transition-all shadow-sm"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-purple-400" />
            <span>Admin Approvals</span>
            {pendingWithdrawalsCount > 0 && (
              <span className="w-4 h-4 rounded-full bg-amber-500 text-slate-950 text-[10px] font-black flex items-center justify-center">
                {pendingWithdrawalsCount}
              </span>
            )}
          </button>
        )}
      </div>

      {/* Pending Withdrawal Notification for Customer (Read-only status) */}
      {pendingWithdrawalsCount > 0 && (
        <div className="rounded-2xl p-3.5 bg-gradient-to-r from-amber-950/50 to-[#1e1708] border border-amber-500/30 flex items-center justify-between gap-3 shadow-md">
          <div className="flex items-center gap-2.5">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-ping shrink-0"></span>
            <div>
              <p className="text-xs font-bold text-amber-300">
                {isUrdu
                  ? `${pendingWithdrawalsCount} Withdrawal Request Admin Review Mein Hai`
                  : `${pendingWithdrawalsCount} Withdrawal Request Pending Admin Review`}
              </p>
              <p className="text-[11px] text-slate-300">
                {isUrdu
                  ? 'Admin verification aur payment ke baad status completed ho jayega.'
                  : 'Funds will be sent once approved by admin.'}
              </p>
            </div>
          </div>
          {onOpenAdmin && user?.role === 'admin' && (
            <button
              onClick={onOpenAdmin}
              className="shrink-0 text-xs font-black py-1.5 px-3 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 shadow transition-all hover:scale-105 active:scale-95"
            >
              {isUrdu ? 'Review Karein' : 'Review'}
            </button>
          )}
        </div>
      )}

      {/* Available Balance Card */}
      <div className="rounded-3xl bg-gradient-to-br from-[#121824] via-[#0f141f] to-[#0a0d14] p-5 border border-slate-800 shadow-xl text-center">
        <div className="flex items-center justify-center gap-1.5 text-xs text-slate-300 mb-1">
          <Wallet className="w-4 h-4 text-amber-400" />
          <span className="font-semibold">{t.withdrawableBalance}</span>
        </div>
        <h2 className="text-3.5xl sm:text-4xl font-black text-amber-400 font-mono tracking-tight mt-1">
          PKR {balance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        </h2>
        <div className="mt-3 flex items-center justify-center gap-4 text-[11px] text-slate-400">
          <span className="flex items-center gap-1 text-emerald-400 font-medium">
            <ShieldCheck className="w-3.5 h-3.5" />
            0% Fee
          </span>
          <span>•</span>
          <span className="flex items-center gap-1 text-amber-300 font-medium">
            <Clock className="w-3.5 h-3.5" />
            {isUrdu ? '10 minute se 2 ghantay' : '10m - 2h Payout'}
          </span>
        </div>
      </div>

      {/* Withdrawal Form */}
      <form onSubmit={handleSubmit} className="bg-[#121824] rounded-3xl p-5 border border-slate-800 shadow-xl space-y-4">
        {/* Method Selection */}
        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-2">
            {t.selectMethod}
          </label>
          <div className="grid grid-cols-3 gap-2">
            {[
              { id: 'easypaisa', label: 'EasyPaisa', urdu: 'EasyPaisa' },
              { id: 'jazzcash', label: 'JazzCash', urdu: 'JazzCash' },
              { id: 'bank', label: 'NayaPay / Bank', urdu: 'NayaPay / Bank' },
            ].map((m) => (
              <button
                key={m.id}
                type="button"
                onClick={() => setMethod(m.id as PaymentMethod)}
                className={`py-2.5 px-1.5 rounded-xl border text-center transition-all ${
                  method === m.id
                    ? 'bg-gradient-to-r from-amber-500 to-amber-600 border-amber-400 text-slate-950 font-black shadow-md scale-[1.02]'
                    : 'bg-slate-900/60 text-slate-400 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="text-xs font-bold">{m.label}</div>
                <div className="text-[10px] opacity-80">{isUrdu ? m.urdu : m.label}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Account Number */}
        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1.5">
            {t.enterAccountNo}
          </label>
          <input
            type="text"
            required
            value={accountNumber}
            onChange={(e) => setAccountNumber(e.target.value)}
            placeholder={method === 'bank' ? 'NayaPay Number / IBAN' : '03XXXXXXXXX'}
            className="w-full bg-[#0a0d14] border border-slate-800 focus:border-amber-500 rounded-xl py-2.5 px-3 text-sm text-white font-mono placeholder:text-slate-600 focus:outline-none focus:ring-1 focus:ring-amber-500"
          />
        </div>

        {/* Account Holder Name */}
        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1.5">
            {t.enterAccountName}
          </label>
          <input
            type="text"
            required
            value={accountName}
            onChange={(e) => setAccountName(e.target.value)}
            placeholder={isUrdu ? 'Misal: Muhammad Ali' : 'e.g. John Doe'}
            className="w-full bg-[#0a0d14] border border-slate-800 focus:border-amber-500 rounded-xl py-2.5 px-3 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:ring-1 focus:ring-amber-500"
          />
        </div>

        {/* Amount Input */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="block text-xs font-semibold text-slate-300">
              {t.withdrawAmount}
            </label>
            <span className="text-[11px] text-slate-400 font-mono">
              {isUrdu ? 'Kam az kam: PKR 150' : 'Min: PKR 150'}
            </span>
          </div>

          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-xs">
              PKR
            </span>
            <input
              type="number"
              min="150"
              max={balance}
              required
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.00"
              className="w-full bg-[#0a0d14] border border-slate-800 focus:border-amber-500 rounded-xl py-2.5 px-12 text-sm text-white font-mono placeholder:text-slate-600 focus:outline-none focus:ring-1 focus:ring-amber-500"
            />
          </div>

          {/* Quick Percentages */}
          <div className="grid grid-cols-4 gap-1.5 mt-2">
            {[0.25, 0.5, 0.75, 1].map((pct) => (
              <button
                key={pct}
                type="button"
                onClick={() => handlePercentage(pct)}
                className="py-1.5 px-2 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-[11px] font-bold text-slate-300 transition-colors"
              >
                {pct * 100}% {pct === 1 && (isUrdu ? '(Kul)' : '(Max)')}
              </button>
            ))}
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full bg-gradient-to-r from-amber-500 via-amber-600 to-amber-500 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black py-3 px-4 rounded-xl shadow-lg shadow-amber-950/50 flex items-center justify-center gap-2 transition-all hover:scale-[1.01] active:scale-[0.99] text-sm"
        >
          <ArrowUpRight className="w-4 h-4 stroke-[3]" />
          <span>{t.submitWithdraw}</span>
        </button>
      </form>

      {/* Notice Card */}
      <div className="bg-[#121824] rounded-2xl p-4 border border-slate-800 flex items-center gap-2.5 text-xs text-slate-400">
        <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
        <span className="leading-relaxed">{t.minWithdrawNotice}</span>
      </div>

      {/* Withdrawal History */}
      {withdrawalTransactions.length > 0 && (
        <div className="pt-2">
          <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-2 flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-amber-400" />
            {isUrdu ? 'Withdrawal History (Niklwai Gayi Raqam)' : 'Withdrawal History'}
          </h3>
          <div className="space-y-2">
            {withdrawalTransactions.slice(0, 8).map((tx) => (
              <div
                key={tx.id}
                className="bg-[#121824] border border-slate-800 rounded-2xl p-3 flex items-center justify-between text-xs"
              >
                <div className="flex items-center gap-2">
                  <div
                    className={`w-8 h-8 rounded-lg border flex items-center justify-center ${
                      tx.status === 'pending'
                        ? 'bg-amber-950/70 border-amber-500/40 text-amber-400'
                        : tx.status === 'rejected'
                        ? 'bg-rose-950/70 border-rose-500/30 text-rose-400'
                        : 'bg-emerald-950/70 border-emerald-500/30 text-emerald-400'
                    }`}
                  >
                    <ArrowUpRight className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="font-mono font-bold text-white">
                      -PKR {tx.amount.toLocaleString()}
                    </div>
                    <div className="text-[10px] text-slate-400">
                      {tx.note || `${tx.method?.toUpperCase()}: ${tx.accountNumber}`}
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  {tx.status === 'pending' ? (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-amber-950/80 text-amber-300 border border-amber-500/40">
                      <Clock className="w-3 h-3 text-amber-400" />
                      <span>{isUrdu ? 'Pending (Zair-e-Jaiza)' : 'Pending Review'}</span>
                    </span>
                  ) : tx.status === 'rejected' ? (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-rose-950 text-rose-300 border border-rose-500/30">
                      <Ban className="w-3 h-3 text-rose-400" />
                      <span>{isUrdu ? 'Mustarad (Refunded)' : 'Rejected (Refunded)'}</span>
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-950 text-emerald-300 border border-emerald-500/30">
                      <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                      <span>{isUrdu ? 'Bhej Di Gayi (Completed)' : 'Completed'}</span>
                    </span>
                  )}
                  <div className="text-[10px] text-slate-500 mt-0.5 font-mono">
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
