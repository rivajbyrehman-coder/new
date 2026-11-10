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
} from 'lucide-react';

export const WithdrawTab: React.FC = () => {
  const { lang, t, balance, withdraw, transactions } = useApp();
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
      <div className="flex items-center gap-2">
        <div className="w-1.5 h-5 bg-orange-600 rounded-full"></div>
        <div>
          <h2 className="text-base font-extrabold text-white">{t.withdrawTitle}</h2>
          <p className="text-xs text-stone-400">{t.withdrawSubtitle}</p>
        </div>
      </div>

      {/* Available Balance Card */}
      <div className="rounded-2xl bg-gradient-to-br from-[#330c0c] to-[#180505] p-5 border border-orange-500/30 shadow-xl shadow-orange-950/30 text-center">
        <div className="flex items-center justify-center gap-1.5 text-xs text-stone-300 mb-1">
          <Wallet className="w-4 h-4 text-amber-400" />
          <span>{t.withdrawableBalance}</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-black text-amber-400 font-mono tracking-tight mt-1">
          PKR {balance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        </h2>
        <div className="mt-3 flex items-center justify-center gap-4 text-[11px] text-stone-400">
          <span className="flex items-center gap-1 text-emerald-400">
            <ShieldCheck className="w-3.5 h-3.5" />
            0% {isUrdu ? 'Fee' : 'Fee'}
          </span>
          <span>•</span>
          <span className="flex items-center gap-1 text-amber-300">
            <Clock className="w-3.5 h-3.5" />
            {isUrdu ? '10 minute se 2 ghantay' : '10m - 2h Payout'}
          </span>
        </div>
      </div>

      {/* Withdrawal Form */}
      <form onSubmit={handleSubmit} className="bg-[#200707] rounded-2xl p-4 border border-[#3e1010] shadow-lg space-y-4">
        {/* Method Selection */}
        <div>
          <label className="block text-xs font-semibold text-stone-300 mb-2">
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
                className={`py-2 px-1.5 rounded-xl border text-center transition-all ${
                  method === m.id
                    ? 'bg-gradient-to-r from-orange-600 to-amber-600 border-amber-400 text-white font-bold shadow-md shadow-orange-950/50 scale-[1.02]'
                    : 'bg-[#160404] text-stone-400 border-[#380e0e] hover:border-orange-500/30'
                }`}
              >
                <div className="text-xs font-semibold">{m.label}</div>
                <div className="text-[10px] opacity-80">{isUrdu ? m.urdu : m.label}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Account Number */}
        <div>
          <label className="block text-xs font-semibold text-stone-300 mb-1.5">
            {t.enterAccountNo}
          </label>
          <input
            type="text"
            required
            value={accountNumber}
            onChange={(e) => setAccountNumber(e.target.value)}
            placeholder={method === 'bank' ? 'NayaPay Number / IBAN' : '03XXXXXXXXX'}
            className="w-full bg-[#120303] border border-[#3e1010] focus:border-orange-500 rounded-xl py-2.5 px-3 text-sm text-white font-mono placeholder:text-stone-600 focus:outline-none focus:ring-1 focus:ring-orange-500"
          />
        </div>

        {/* Account Holder Name */}
        <div>
          <label className="block text-xs font-semibold text-stone-300 mb-1.5">
            {t.enterAccountName}
          </label>
          <input
            type="text"
            required
            value={accountName}
            onChange={(e) => setAccountName(e.target.value)}
            placeholder={isUrdu ? 'Misal: Muhammad Ali' : 'e.g. John Doe'}
            className="w-full bg-[#120303] border border-[#3e1010] focus:border-orange-500 rounded-xl py-2.5 px-3 text-sm text-white placeholder:text-stone-600 focus:outline-none focus:ring-1 focus:ring-orange-500"
          />
        </div>

        {/* Amount Input */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="block text-xs font-semibold text-stone-300">
              {t.withdrawAmount}
            </label>
            <span className="text-[11px] text-stone-400">
              {isUrdu ? 'Kam az kam: PKR 150' : 'Min: PKR 150'}
            </span>
          </div>

          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400 font-bold text-xs">
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
              className="w-full bg-[#120303] border border-[#3e1010] focus:border-orange-500 rounded-xl py-2.5 px-12 text-sm text-white font-mono placeholder:text-stone-600 focus:outline-none focus:ring-1 focus:ring-orange-500"
            />
          </div>

          {/* Quick Percentages */}
          <div className="grid grid-cols-4 gap-1.5 mt-2">
            {[0.25, 0.5, 0.75, 1].map((pct) => (
              <button
                key={pct}
                type="button"
                onClick={() => handlePercentage(pct)}
                className="py-1 px-2 rounded-lg bg-[#140303] hover:bg-[#250808] border border-[#380e0e] text-[11px] font-bold text-stone-300 transition-colors"
              >
                {pct * 100}% {pct === 1 && (isUrdu ? '(Kul)' : '(Max)')}
              </button>
            ))}
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full bg-gradient-to-r from-orange-600 via-[#ff4500] to-amber-600 hover:from-orange-500 hover:to-amber-500 text-white font-extrabold py-3 px-4 rounded-xl shadow-lg shadow-orange-950/60 flex items-center justify-center gap-2 transition-all hover:scale-[1.01] active:scale-[0.99] text-sm"
        >
          <ArrowUpRight className="w-4 h-4" />
          <span>{t.submitWithdraw}</span>
        </button>
      </form>

      {/* Notice Card */}
      <div className="bg-[#180404] rounded-2xl p-3.5 border border-[#380e0e] flex items-center gap-2.5 text-xs text-stone-400">
        <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
        <span className="leading-relaxed">{t.minWithdrawNotice}</span>
      </div>

      {/* Withdrawal History */}
      {withdrawalTransactions.length > 0 && (
        <div className="pt-2">
          <h3 className="text-xs font-bold text-stone-300 uppercase tracking-wider mb-2 flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-amber-400" />
            {isUrdu ? 'Withdrawal History (Niklwai Gayi Raqam)' : 'Withdrawal History'}
          </h3>
          <div className="space-y-2">
            {withdrawalTransactions.slice(0, 5).map((tx) => (
              <div
                key={tx.id}
                className="bg-[#1c0606] border border-[#380e0e] rounded-xl p-3 flex items-center justify-between text-xs"
              >
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-orange-950/70 border border-orange-500/30 flex items-center justify-center text-amber-400">
                    <ArrowUpRight className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="font-mono font-bold text-white">
                      -PKR {tx.amount.toLocaleString()}
                    </div>
                    <div className="text-[10px] text-stone-400">
                      {tx.note || `${tx.method?.toUpperCase()}: ${tx.accountNumber}`}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-950 text-emerald-300 border border-emerald-500/30">
                    <CheckCircle2 className="w-3 h-3" />
                    {t.statusCompleted}
                  </span>
                  <div className="text-[10px] text-stone-500 mt-0.5">
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
