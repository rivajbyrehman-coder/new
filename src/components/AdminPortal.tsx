import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { PaymentMethod, UserProfile } from '../types';
import {
  ShieldCheck,
  Check,
  Ban,
  Clock,
  ArrowDownLeft,
  ArrowUpRight,
  AlertCircle,
  Sparkles,
  User,
  CreditCard,
  Edit3,
  RotateCcw,
  Save,
  Building,
  Users,
  Search,
  ChevronDown,
  ChevronUp,
  Mail,
  Phone,
  LogOut,
  Globe,
  RefreshCw,
  Wallet,
  Activity,
  Trash2,
  AlertTriangle,
  UserX,
} from 'lucide-react';

type AdminTab = 'withdrawals' | 'deposits' | 'accounts' | 'users';

export const AdminPortal: React.FC = () => {
  const {
    lang,
    setLang,
    logout,
    transactions,
    approveDeposit,
    rejectDeposit,
    approveWithdrawal,
    rejectWithdrawal,
    paymentMethods,
    updatePaymentMethod,
    resetPaymentMethods,
    registeredUsers,
    clearAllRegisteredUsers,
    showToast,
  } = useApp();

  const [activeTab, setActiveTab] = useState<AdminTab>('withdrawals');
  const [rejectReason, setRejectReason] = useState<string>('');
  const [activeRejectId, setActiveRejectId] = useState<string | null>(null);
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  // Deposit Account Number Editing State
  const [editingMethod, setEditingMethod] = useState<PaymentMethod | null>(null);
  const [editNumber, setEditNumber] = useState<string>('');
  const [editName, setEditName] = useState<string>('');
  const [editBank, setEditBank] = useState<string>('');

  // Registered Users & Team Search
  const [userSearch, setUserSearch] = useState<string>('');
  const [expandedUserId, setExpandedUserId] = useState<string | null>(null);

  const isUrdu = lang === 'ur';

  // Deposits
  const pendingDeposits = transactions.filter((t) => t.type === 'deposit' && t.status === 'pending');
  const pastDeposits = transactions.filter((t) => t.type === 'deposit' && t.status !== 'pending');

  // Withdrawals
  const pendingWithdrawals = transactions.filter((t) => t.type === 'withdraw' && t.status === 'pending');
  const pastWithdrawals = transactions.filter((t) => t.type === 'withdraw' && t.status !== 'pending');

  const totalPendingWithdrawalAmount = pendingWithdrawals.reduce((sum, t) => sum + t.amount, 0);
  const totalPendingDepositAmount = pendingDeposits.reduce((sum, t) => sum + t.amount, 0);

  const handleApproveDeposit = (id: string) => {
    approveDeposit(id);
  };

  const handleConfirmRejectDeposit = (id: string) => {
    rejectDeposit(id, rejectReason || 'Invalid Transaction ID');
    setActiveRejectId(null);
    setRejectReason('');
  };

  const handleApproveWithdrawal = (id: string) => {
    approveWithdrawal(id);
  };

  const handleConfirmRejectWithdrawal = (id: string) => {
    rejectWithdrawal(id, rejectReason || 'Wrong account details');
    setActiveRejectId(null);
    setRejectReason('');
  };

  // Start editing a payment method
  const handleStartEditAccount = (methodId: PaymentMethod) => {
    const current = paymentMethods[methodId];
    if (current) {
      setEditingMethod(methodId);
      setEditNumber(current.accountNumber);
      setEditName(current.accountName);
      setEditBank(current.bankName || '');
    }
  };

  // Save edited payment method
  const handleSaveAccount = (methodId: PaymentMethod) => {
    const success = updatePaymentMethod(methodId, {
      accountNumber: editNumber,
      accountName: editName,
      bankName: methodId === 'bank' ? editBank : undefined,
    });
    if (success) {
      setEditingMethod(null);
    }
  };

  // Filter registered users
  const filteredUsers = registeredUsers.filter((u) => {
    const q = userSearch.toLowerCase().trim();
    if (!q) return true;
    return (
      u.name?.toLowerCase().includes(q) ||
      u.contact?.toLowerCase().includes(q) ||
      u.phone?.toLowerCase().includes(q) ||
      u.email?.toLowerCase().includes(q) ||
      u.referralCode?.toLowerCase().includes(q) ||
      u.referredBy?.toLowerCase().includes(q)
    );
  });

  // Helper to get team members for a given user
  const getUserTeam = (targetUser: UserProfile) => {
    return registeredUsers.filter((member) => {
      if (member.id === targetUser.id) return false;
      const upline = member.referredBy?.toLowerCase() || '';
      const userRef = targetUser.referralCode?.toLowerCase() || '';
      const userContact = (targetUser.contact || targetUser.phone || '').toLowerCase().replace(/[-\s+]/g, '');
      const uplineClean = upline.replace(/[-\s+]/g, '');

      return (
        (userRef && upline === userRef) ||
        (userContact && (upline === userContact || uplineClean === userContact))
      );
    });
  };

  return (
    <div className="min-h-screen bg-[#080c14] text-slate-100 flex flex-col font-sans pb-12">
      {/* Background Glow */}
      <div className="fixed -top-24 -left-24 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="fixed -bottom-24 -right-24 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl pointer-events-none"></div>

      {/* TOP ADMIN HEADER */}
      <header className="sticky top-0 z-40 bg-[#0c121e]/95 backdrop-blur-md border-b border-slate-800 px-4 py-3 shadow-xl">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-amber-400 via-amber-500 to-amber-600 flex items-center justify-center text-slate-950 font-black text-lg shadow-lg shadow-amber-950/40 border border-amber-300/40">
              7X
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base font-black text-white tracking-tight flex items-center gap-1.5">
                  <span>{isUrdu ? 'Admin Control Dashboard' : 'Admin Control Dashboard'}</span>
                  <ShieldCheck className="w-4 h-4 text-pink-400" />
                </h1>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-pink-950 text-pink-300 border border-pink-500/40 font-bold">
                  03492928370
                </span>
              </div>
              <p className="text-[11px] text-pink-300/80">
                {isUrdu ? 'Makhsoos Admin Profile • Deposits, Withdrawals, Accounts & Users' : 'Strict Admin Access • Financial Review & Management'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setLang(lang === 'ur' ? 'en' : 'ur')}
              className="px-2.5 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-stone-300 text-xs font-semibold border border-white/10 flex items-center gap-1 transition-all"
              title="Change Language"
            >
              <Globe className="w-3.5 h-3.5 text-amber-400" />
              <span>{lang === 'ur' ? 'English' : 'Roman Urdu'}</span>
            </button>

            <button
              onClick={logout}
              className="px-3 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold shadow-md shadow-rose-950/50 flex items-center gap-1.5 transition-all active:scale-95"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>{isUrdu ? 'Admin Logout' : 'Sign Out'}</span>
            </button>
          </div>
        </div>
      </header>

      {/* MAIN ADMIN CONTENT WRAPPER */}
      <main className="max-w-4xl mx-auto w-full px-4 pt-5 space-y-4">
        {/* KPI OVERVIEW METRICS */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          {/* Pending Withdrawals */}
          <div
            onClick={() => setActiveTab('withdrawals')}
            className={`cursor-pointer p-4 rounded-3xl border transition-all ${
              activeTab === 'withdrawals'
                ? 'bg-gradient-to-br from-amber-500/15 to-[#161d2d] border-amber-500/50 shadow-lg'
                : 'bg-[#121824] border-slate-800 hover:border-slate-700'
            }`}
          >
            <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
              <span>{isUrdu ? 'Pending Withdrawals' : 'Pending Withdrawals'}</span>
              <ArrowUpRight className="w-4 h-4 text-amber-400" />
            </div>
            <div className="text-xl font-black text-amber-400 font-mono">
              {pendingWithdrawals.length}
            </div>
            <div className="text-[11px] text-slate-400 font-mono mt-0.5">
              PKR {totalPendingWithdrawalAmount.toLocaleString()}
            </div>
          </div>

          {/* Pending Deposits */}
          <div
            onClick={() => setActiveTab('deposits')}
            className={`cursor-pointer p-4 rounded-3xl border transition-all ${
              activeTab === 'deposits'
                ? 'bg-gradient-to-br from-purple-500/15 to-[#161d2d] border-purple-500/50 shadow-lg'
                : 'bg-[#121824] border-slate-800 hover:border-slate-700'
            }`}
          >
            <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
              <span>{isUrdu ? 'Pending Deposits' : 'Pending Deposits'}</span>
              <ArrowDownLeft className="w-4 h-4 text-purple-400" />
            </div>
            <div className="text-xl font-black text-purple-300 font-mono">
              {pendingDeposits.length}
            </div>
            <div className="text-[11px] text-slate-400 font-mono mt-0.5">
              PKR {totalPendingDepositAmount.toLocaleString()}
            </div>
          </div>

          {/* Registered Users */}
          <div
            onClick={() => setActiveTab('users')}
            className={`cursor-pointer p-4 rounded-3xl border transition-all ${
              activeTab === 'users'
                ? 'bg-gradient-to-br from-blue-500/15 to-[#161d2d] border-blue-500/50 shadow-lg'
                : 'bg-[#121824] border-slate-800 hover:border-slate-700'
            }`}
          >
            <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
              <span>{isUrdu ? 'Customers & Teams' : 'Customers & Teams'}</span>
              <Users className="w-4 h-4 text-blue-400" />
            </div>
            <div className="text-xl font-black text-blue-300 font-mono">
              {registeredUsers.length}
            </div>
            <div className="text-[11px] text-slate-400 mt-0.5">
              {isUrdu ? 'Mukammal Network' : 'Live Accounts'}
            </div>
          </div>

          {/* Deposit Gateways */}
          <div
            onClick={() => setActiveTab('accounts')}
            className={`cursor-pointer p-4 rounded-3xl border transition-all ${
              activeTab === 'accounts'
                ? 'bg-gradient-to-br from-emerald-500/15 to-[#161d2d] border-emerald-500/50 shadow-lg'
                : 'bg-[#121824] border-slate-800 hover:border-slate-700'
            }`}
          >
            <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
              <span>{isUrdu ? 'Deposit Accounts' : 'Deposit Gateways'}</span>
              <CreditCard className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="text-xl font-black text-emerald-400 font-mono">
              3
            </div>
            <div className="text-[11px] text-slate-400 mt-0.5">
              EasyPaisa • JazzCash • Bank
            </div>
          </div>
        </div>

        {/* ADMIN TAB NAVIGATION BAR */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 p-1.5 bg-[#0e1422] rounded-3xl border border-slate-800 shadow-md text-xs font-bold">
          <button
            type="button"
            onClick={() => {
              setActiveTab('withdrawals');
              setActiveRejectId(null);
              setRejectReason('');
            }}
            className={`py-3 px-3 rounded-xl flex items-center justify-center gap-2 transition-all ${
              activeTab === 'withdrawals'
                ? 'bg-gradient-to-r from-orange-600 via-amber-600 to-orange-600 text-white shadow-lg shadow-orange-950/50'
                : 'text-stone-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <ArrowUpRight className="w-4 h-4" />
            <span>{isUrdu ? 'Withdrawals' : 'Withdrawals'}</span>
            {pendingWithdrawals.length > 0 && (
              <span className="text-[10px] bg-amber-400 text-stone-950 px-2 py-0.2 rounded-full font-black animate-pulse">
                {pendingWithdrawals.length}
              </span>
            )}
          </button>

          <button
            type="button"
            onClick={() => {
              setActiveTab('deposits');
              setActiveRejectId(null);
              setRejectReason('');
            }}
            className={`py-3 px-3 rounded-xl flex items-center justify-center gap-2 transition-all ${
              activeTab === 'deposits'
                ? 'bg-gradient-to-r from-purple-600 via-pink-600 to-purple-600 text-white shadow-lg shadow-purple-950/50'
                : 'text-stone-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <ArrowDownLeft className="w-4 h-4" />
            <span>{isUrdu ? 'Deposits' : 'Deposits'}</span>
            {pendingDeposits.length > 0 && (
              <span className="text-[10px] bg-amber-400 text-stone-950 px-2 py-0.2 rounded-full font-black animate-pulse">
                {pendingDeposits.length}
              </span>
            )}
          </button>

          <button
            type="button"
            onClick={() => {
              setActiveTab('accounts');
              setActiveRejectId(null);
              setRejectReason('');
            }}
            className={`py-3 px-3 rounded-xl flex items-center justify-center gap-2 transition-all ${
              activeTab === 'accounts'
                ? 'bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-600 text-white shadow-lg shadow-emerald-950/50'
                : 'text-stone-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Edit3 className="w-4 h-4" />
            <span>{isUrdu ? 'Deposit Accounts' : 'Deposit Accounts'}</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setActiveTab('users');
              setActiveRejectId(null);
              setRejectReason('');
            }}
            className={`py-3 px-3 rounded-xl flex items-center justify-center gap-2 transition-all ${
              activeTab === 'users'
                ? 'bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-600 text-white shadow-lg shadow-blue-950/50'
                : 'text-stone-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>{isUrdu ? 'Customers & Teams' : 'Customers & Teams'}</span>
            <span className="text-[10px] bg-blue-950 text-blue-300 border border-blue-500/40 px-2 py-0.2 rounded-full font-bold">
              {registeredUsers.length}
            </span>
          </button>
        </div>

        {/* TAB 1: WITHDRAWALS MANAGEMENT */}
        {activeTab === 'withdrawals' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-black text-amber-400 uppercase tracking-wider flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  <span>{isUrdu ? 'Customer Withdrawal Requests (Pending Approval):' : 'Customer Withdrawal Queue:'}</span>
                </h3>
                <p className="text-xs text-stone-400 mt-0.5">
                  {isUrdu
                    ? 'Customer ne raqam nikalne ki request bheji hai. Raqam bhej kar Approve karein ya waja darj kar ke Reject karein.'
                    : 'Review withdrawal requests, verify customer bank/wallet details, and confirm payment.'}
                </p>
              </div>

              <span className="text-xs font-mono font-bold px-3 py-1 rounded-xl bg-orange-950/80 border border-orange-500/40 text-amber-300">
                {pendingWithdrawals.length} {isUrdu ? 'Baqi Requests' : 'Pending Requests'}
              </span>
            </div>

            {pendingWithdrawals.length === 0 ? (
              <div className="p-8 rounded-3xl bg-[#121824] border border-slate-800 text-center space-y-2">
                <AlertCircle className="w-10 h-10 text-slate-500 mx-auto opacity-60" />
                <h4 className="text-sm font-bold text-slate-300">
                  {isUrdu ? 'Koi Pending Withdrawal Request Nahi Hai' : 'No Pending Withdrawal Requests'}
                </h4>
                <p className="text-xs text-slate-400 max-w-md mx-auto">
                  {isUrdu
                    ? 'Jab bhi koi customer EasyPaisa, JazzCash ya Bank Transfer par withdrawal mangega to tasdeeq ke liye foran yahan show hoga.'
                    : 'When a customer submits a withdrawal request, it will appear here in real time for approval and payout.'}
                </p>
              </div>
            ) : (
              <div className="grid gap-3 sm:grid-cols-2">
                {pendingWithdrawals.map((tx) => (
                  <div
                    key={tx.id}
                    className="p-4 rounded-3xl bg-gradient-to-br from-[#161d2d] via-[#121824] to-[#0f141f] border border-amber-500/30 shadow-xl space-y-3"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-orange-500/20 text-orange-300 border border-orange-500/30">
                          {tx.method?.toUpperCase() || 'PAYOUT'}
                        </span>
                        <div className="text-2xl font-black text-amber-400 font-mono mt-1">
                          PKR {tx.amount.toLocaleString()}
                        </div>
                      </div>

                      <div className="text-right">
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-950 text-amber-300 border border-amber-500/40">
                          <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping"></span>
                          {isUrdu ? 'Payment Baqi Hai' : 'Awaiting Payment'}
                        </span>
                        <div className="text-[10px] text-stone-400 font-mono mt-1">
                          {new Date(tx.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </div>
                      </div>
                    </div>

                    {/* Customer Account Details Card */}
                    <div className="p-3 rounded-2xl bg-black/60 border border-white/5 text-xs space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-stone-400 flex items-center gap-1.5">
                          <User className="w-3.5 h-3.5 text-stone-500" />
                          {isUrdu ? 'Account Holder Naam:' : 'Account Title:'}
                        </span>
                        <span className="text-white font-bold select-all">{tx.accountName || 'Customer'}</span>
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="text-stone-400 flex items-center gap-1.5">
                          <CreditCard className="w-3.5 h-3.5 text-stone-500" />
                          {isUrdu ? 'Account Number:' : 'Account Number:'}
                        </span>
                        <span className="text-emerald-400 font-mono font-bold select-all tracking-wider text-sm">
                          {tx.accountNumber || 'N/A'}
                        </span>
                      </div>

                      <div className="flex items-center justify-between text-[11px] pt-1.5 border-t border-white/5">
                        <span className="text-stone-500">Method:</span>
                        <span className="text-amber-300 font-semibold uppercase">{tx.method || 'Direct'}</span>
                      </div>
                    </div>

                    {/* Rejection Input Box if Active */}
                    {activeRejectId === tx.id && (
                      <div className="p-3 rounded-2xl bg-rose-950/60 border border-rose-500/40 space-y-2 animate-in fade-in">
                        <label className="block text-xs text-rose-300 font-semibold">
                          {isUrdu ? 'Radd karne ki wajah darj karein (Customer ko refund hoga):' : 'Rejection Reason (Funds will be refunded):'}
                        </label>
                        <input
                          type="text"
                          value={rejectReason}
                          onChange={(e) => setRejectReason(e.target.value)}
                          placeholder={isUrdu ? 'Misal: Wrong Account Number / Title mismatch' : 'e.g. Account number invalid'}
                          className="w-full bg-black/70 border border-rose-500/40 rounded-xl p-2 text-xs text-white placeholder:text-stone-600 focus:outline-none"
                        />
                        <div className="flex gap-2">
                          <button
                            type="button"
                            onClick={() => handleConfirmRejectWithdrawal(tx.id)}
                            className="flex-1 py-2 px-3 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs"
                          >
                            {isUrdu ? 'Reject Aur Wallet Refund' : 'Reject & Refund'}
                          </button>
                          <button
                            type="button"
                            onClick={() => setActiveRejectId(null)}
                            className="py-2 px-3 rounded-xl bg-white/10 text-stone-300 text-xs font-semibold"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    )}

                    {/* Action Buttons */}
                    {activeRejectId !== tx.id && (
                      <div className="flex gap-2 pt-1">
                        <button
                          type="button"
                          onClick={() => handleApproveWithdrawal(tx.id)}
                          className="flex-1 flex items-center justify-center gap-1.5 py-3 px-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-black text-xs shadow-lg shadow-emerald-950/50 transition-all hover:scale-[1.02] active:scale-[0.98]"
                        >
                          <Check className="w-4 h-4 stroke-[3]" />
                          <span>{isUrdu ? 'Approve & Mark Paid (Raqam Bhej Di)' : 'Approve & Mark Paid'}</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => setActiveRejectId(tx.id)}
                          className="flex items-center justify-center gap-1.5 py-3 px-3 rounded-xl bg-rose-950/60 hover:bg-rose-900 border border-rose-500/30 text-rose-300 font-bold text-xs transition-colors"
                        >
                          <Ban className="w-4 h-4" />
                          <span>{isUrdu ? 'Reject' : 'Reject'}</span>
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* Processed Withdrawals History */}
            {pastWithdrawals.length > 0 && (
              <div className="pt-4 border-t border-pink-500/20">
                <h4 className="text-xs font-bold text-stone-400 uppercase tracking-wider mb-3">
                  {isUrdu ? 'Sabiqa Withdrawals Faislay (History):' : 'Processed Withdrawals History:'}
                </h4>
                <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                  {pastWithdrawals.map((tx) => (
                    <div
                      key={tx.id}
                      className="p-3.5 rounded-2xl bg-[#121824] border border-slate-800 flex items-center justify-between text-xs"
                    >
                      <div className="flex items-center gap-2.5">
                        <div
                          className={`w-8 h-8 rounded-xl flex items-center justify-center ${
                            tx.status === 'completed'
                              ? 'bg-emerald-950 text-emerald-400 border border-emerald-500/30'
                              : 'bg-rose-950 text-rose-400 border border-rose-500/30'
                          }`}
                        >
                          <ArrowUpRight className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="font-mono font-bold text-white text-sm">
                            PKR {tx.amount.toLocaleString()}
                          </div>
                          <div className="text-[11px] text-stone-400">
                            {tx.accountName} • {tx.accountNumber} ({tx.method?.toUpperCase()})
                          </div>
                        </div>
                      </div>

                      <div className="text-right">
                        <span
                          className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                            tx.status === 'completed'
                              ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/40'
                              : 'bg-rose-950 text-rose-300 border border-rose-500/40'
                          }`}
                        >
                          {tx.status === 'completed'
                            ? isUrdu ? 'Ada Kar Diya Gaya' : 'Paid & Completed'
                            : isUrdu ? 'Radd & Refunded' : 'Rejected'}
                        </span>
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
        )}

        {/* TAB 2: DEPOSITS MANAGEMENT */}
        {activeTab === 'deposits' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-black text-amber-400 uppercase tracking-wider flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  <span>{isUrdu ? 'Customer Deposit Requests (TID Tasdeeq):' : 'Pending Deposits Verification Queue:'}</span>
                </h3>
                <p className="text-xs text-stone-400 mt-0.5">
                  {isUrdu
                    ? 'Customer ne EasyPaisa, JazzCash ya Bank par paise bhej kar TID bheji hai. Tasdeeq kar ke Balance Add karein.'
                    : 'Verify customer Transaction ID (TID) against your received SMS/receipt to credit their balance.'}
                </p>
              </div>

              <span className="text-xs font-mono font-bold px-3 py-1 rounded-xl bg-purple-950/80 border border-purple-500/40 text-purple-300">
                {pendingDeposits.length} {isUrdu ? 'Zair-e-Jaiza' : 'Pending'}
              </span>
            </div>

            {pendingDeposits.length === 0 ? (
              <div className="p-8 rounded-3xl bg-[#121824] border border-slate-800 text-center space-y-2">
                <AlertCircle className="w-10 h-10 text-slate-500 mx-auto opacity-60" />
                <h4 className="text-sm font-bold text-slate-300">
                  {isUrdu ? 'Koi Pending Deposit Request Nahi Hai' : 'No Pending Deposit Requests'}
                </h4>
                <p className="text-xs text-slate-400 max-w-md mx-auto">
                  {isUrdu
                    ? 'Jab koi user raqam deposit karega to unka TID aur amount tasdeeq ke liye yahan show hoga.'
                    : 'When a user deposits funds, their TID and amount will appear here for verification.'}
                </p>
              </div>
            ) : (
              <div className="grid gap-3 sm:grid-cols-2">
                {pendingDeposits.map((tx) => (
                  <div
                    key={tx.id}
                    className="p-4 rounded-3xl bg-gradient-to-br from-[#161d2d] via-[#121824] to-[#0f141f] border border-purple-500/30 shadow-xl space-y-3"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 border border-purple-500/30">
                          {tx.method?.toUpperCase() || 'PAYMENT'}
                        </span>
                        <div className="text-2xl font-black text-amber-400 font-mono mt-1">
                          PKR {tx.amount.toLocaleString()}
                        </div>
                      </div>

                      <div className="text-right">
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-950 text-amber-300 border border-amber-500/40">
                          <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping"></span>
                          {isUrdu ? 'Zair-e-Jaiza' : 'Review Required'}
                        </span>
                        <div className="text-[10px] text-stone-400 font-mono mt-1">
                          {new Date(tx.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </div>
                      </div>
                    </div>

                    {/* TID Display Box */}
                    <div className="p-3 rounded-2xl bg-black/60 border border-white/5 text-xs font-mono space-y-1.5">
                      <div className="flex justify-between items-center">
                        <span className="text-stone-400 text-[11px]">Transaction ID (TID):</span>
                        <span className="text-emerald-400 font-bold text-sm select-all tracking-wider">{tx.tid || 'N/A'}</span>
                      </div>
                      <div className="flex justify-between items-center text-[11px] pt-1 border-t border-white/5">
                        <span className="text-stone-500">Method:</span>
                        <span className="text-stone-300 uppercase">{tx.method || 'Direct'}</span>
                      </div>
                    </div>

                    {/* Rejection Input if Active */}
                    {activeRejectId === tx.id && (
                      <div className="p-3 rounded-2xl bg-rose-950/60 border border-rose-500/40 space-y-2 animate-in fade-in">
                        <label className="block text-xs text-rose-300 font-semibold">
                          {isUrdu ? 'Radd karne ki wajah darj karein:' : 'Reason for rejection:'}
                        </label>
                        <input
                          type="text"
                          value={rejectReason}
                          onChange={(e) => setRejectReason(e.target.value)}
                          placeholder="Misal: Wrong TID code / Payment not received"
                          className="w-full bg-black/70 border border-rose-500/40 rounded-xl p-2 text-xs text-white placeholder:text-stone-600 focus:outline-none"
                        />
                        <div className="flex gap-2">
                          <button
                            type="button"
                            onClick={() => handleConfirmRejectDeposit(tx.id)}
                            className="flex-1 py-2 px-3 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs"
                          >
                            {isUrdu ? 'Mustarad Karein' : 'Confirm Reject'}
                          </button>
                          <button
                            type="button"
                            onClick={() => setActiveRejectId(null)}
                            className="py-2 px-3 rounded-xl bg-white/10 text-stone-300 text-xs font-semibold"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    )}

                    {/* Action Buttons */}
                    {activeRejectId !== tx.id && (
                      <div className="flex gap-2 pt-1">
                        <button
                          type="button"
                          onClick={() => handleApproveDeposit(tx.id)}
                          className="flex-1 flex items-center justify-center gap-1.5 py-3 px-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-black text-xs shadow-lg shadow-emerald-950/50 transition-all hover:scale-[1.02] active:scale-[0.98]"
                        >
                          <Check className="w-4 h-4 stroke-[3]" />
                          <span>{isUrdu ? 'Approve (Wallet Mein Balance Add)' : 'Approve & Credit Balance'}</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => setActiveRejectId(tx.id)}
                          className="flex items-center justify-center gap-1.5 py-3 px-3 rounded-xl bg-rose-950/60 hover:bg-rose-900 border border-rose-500/30 text-rose-300 font-bold text-xs transition-colors"
                        >
                          <Ban className="w-4 h-4" />
                          <span>{isUrdu ? 'Reject' : 'Reject'}</span>
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* Processed Deposits History */}
            {pastDeposits.length > 0 && (
              <div className="pt-4 border-t border-pink-500/20">
                <h4 className="text-xs font-bold text-stone-400 uppercase tracking-wider mb-3">
                  {isUrdu ? 'Sabiqa Deposit Faislay (History):' : 'Processed Deposits History:'}
                </h4>
                <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                  {pastDeposits.map((tx) => (
                    <div
                      key={tx.id}
                      className="p-3.5 rounded-2xl bg-[#121824] border border-slate-800 flex items-center justify-between text-xs"
                    >
                      <div className="flex items-center gap-2.5">
                        <div
                          className={`w-8 h-8 rounded-xl flex items-center justify-center ${
                            tx.status === 'completed'
                              ? 'bg-emerald-950 text-emerald-400 border border-emerald-500/30'
                              : 'bg-rose-950 text-rose-400 border border-rose-500/30'
                          }`}
                        >
                          <ArrowDownLeft className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="font-mono font-bold text-white text-sm">
                            PKR {tx.amount.toLocaleString()}
                          </div>
                          <div className="text-[11px] text-stone-400 font-mono">
                            {tx.tid || tx.note || 'Direct'}
                          </div>
                        </div>
                      </div>

                      <div className="text-right">
                        <span
                          className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                            tx.status === 'completed'
                              ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/40'
                              : 'bg-rose-950 text-rose-300 border border-rose-500/40'
                          }`}
                        >
                          {tx.status === 'completed'
                            ? isUrdu ? 'Manzoor Shuda' : 'Approved'
                            : isUrdu ? 'Mustarad Shuda' : 'Rejected'}
                        </span>
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
        )}

        {/* TAB 3: DEPOSIT ACCOUNTS SETTINGS (CHANGE NUMBERS) */}
        {activeTab === 'accounts' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-black text-emerald-400 uppercase tracking-wider flex items-center gap-2">
                  <Edit3 className="w-4 h-4" />
                  <span>{isUrdu ? 'Deposit Accounts Numbers Tabdeel Karein:' : 'Manage Deposit Account Numbers:'}</span>
                </h3>
                <p className="text-xs text-stone-400 mt-0.5">
                  {isUrdu
                    ? 'Yahan number ya naam tabdeel karein ge to tamam customers ke deposit page par foran naya number update ho jayega.'
                    : 'Updated account numbers will immediately appear on the deposit screen for all users.'}
                </p>
              </div>

              <button
                type="button"
                onClick={resetPaymentMethods}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-xs text-stone-300 border border-white/10 transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>{isUrdu ? 'Default Reset' : 'Reset'}</span>
              </button>
            </div>

            <div className="grid gap-3 sm:grid-cols-3">
              {(['easypaisa', 'jazzcash', 'bank'] as PaymentMethod[]).map((mId) => {
                const method = paymentMethods[mId];
                const isEditing = editingMethod === mId;

                return (
                  <div
                    key={mId}
                    className="p-4 rounded-3xl bg-gradient-to-br from-[#161d2d] to-[#101624] border border-slate-800 shadow-lg space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span
                          className={`w-3 h-3 rounded-full ${
                            mId === 'easypaisa'
                              ? 'bg-emerald-400'
                              : mId === 'jazzcash'
                              ? 'bg-amber-400'
                              : 'bg-blue-400'
                          }`}
                        ></span>
                        <h4 className="font-bold text-white text-sm">
                          {method.name}
                        </h4>
                      </div>

                      {!isEditing && (
                        <button
                          type="button"
                          onClick={() => handleStartEditAccount(mId)}
                          className="flex items-center gap-1 text-xs font-bold py-1 px-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 transition-colors"
                        >
                          <Edit3 className="w-3 h-3" />
                          <span>{isUrdu ? 'Tabdeel' : 'Edit'}</span>
                        </button>
                      )}
                    </div>

                    {!isEditing ? (
                      <div className="p-3 rounded-2xl bg-[#0a0d14] border border-slate-800 space-y-2 text-xs">
                        {method.bankName && (
                          <div className="flex justify-between items-center text-[11px] pb-1 border-b border-slate-800">
                            <span className="text-slate-400">Bank:</span>
                            <span className="text-blue-300 font-bold">{method.bankName}</span>
                          </div>
                        )}
                        <div>
                          <span className="text-slate-400 block text-[10px] mb-0.5">Account Number:</span>
                          <span className="text-emerald-400 font-mono font-bold select-all tracking-wider text-sm block">
                            {method.accountNumber}
                          </span>
                        </div>
                        <div>
                          <span className="text-slate-400 block text-[10px] mb-0.5">Account Title:</span>
                          <span className="text-white font-semibold select-all block">
                            {method.accountName}
                          </span>
                        </div>
                      </div>
                    ) : (
                      <div className="p-3 rounded-2xl bg-[#0a0d14] border border-slate-800 space-y-2.5 animate-in fade-in">
                        {mId === 'bank' && (
                          <div>
                            <label className="block text-[10px] text-slate-300 mb-1">Bank Name:</label>
                            <input
                              type="text"
                              value={editBank}
                              onChange={(e) => setEditBank(e.target.value)}
                              placeholder="NayaPay / Meezan"
                              className="w-full bg-[#121824] border border-slate-700 rounded-lg p-2 text-xs text-white focus:outline-none"
                            />
                          </div>
                        )}
                        <div>
                          <label className="block text-[10px] text-slate-300 mb-1">Naya Number:</label>
                          <input
                            type="text"
                            value={editNumber}
                            onChange={(e) => setEditNumber(e.target.value)}
                            placeholder="03XXXXXXXXX"
                            className="w-full bg-[#121824] border border-slate-700 rounded-lg p-2 text-xs text-white font-mono focus:outline-none"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] text-slate-300 mb-1">Account Title (Naam):</label>
                          <input
                            type="text"
                            value={editName}
                            onChange={(e) => setEditName(e.target.value)}
                            placeholder="Rehman Khan"
                            className="w-full bg-[#121824] border border-slate-700 rounded-lg p-2 text-xs text-white focus:outline-none"
                          />
                        </div>
                        <div className="flex gap-2 pt-1">
                          <button
                            type="button"
                            onClick={() => handleSaveAccount(mId)}
                            className="flex-1 py-2 px-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-bold text-xs flex items-center justify-center gap-1 shadow"
                          >
                            <Save className="w-3.5 h-3.5" />
                            <span>Save</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => setEditingMethod(null)}
                            className="py-2 px-3 rounded-xl bg-white/10 text-stone-300 text-xs"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB 4: REGISTERED USERS & DOWNLINE TEAMS */}
        {activeTab === 'users' && (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-sm font-black text-blue-400 uppercase tracking-wider flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  <span>{isUrdu ? 'Registered Customers Aur Unki Teams:' : 'Customers & Downline Teams Directory:'}</span>
                </h3>
                <p className="text-xs text-stone-400 mt-0.5">
                  {isUrdu
                    ? 'Tamam registered users aur unke referral code ke tehat bane team members ki mukammal tafseelat.'
                    : 'Comprehensive directory of all user accounts and their referral trees.'}
                </p>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                {/* Reset All Registered Users Button */}
                <button
                  type="button"
                  onClick={() => setShowResetConfirm(true)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-950/80 hover:bg-rose-900 border border-rose-500/40 text-rose-200 text-xs font-bold transition-all shadow-sm active:scale-95"
                  title="Clear all registered customer data"
                >
                  <Trash2 className="w-3.5 h-3.5 text-rose-400" />
                  <span>{isUrdu ? 'Users Data Reset' : 'Reset Users'}</span>
                </button>

                <span className="text-xs font-mono font-bold px-3 py-1.5 rounded-xl bg-blue-950 border border-blue-500/40 text-blue-300">
                  {registeredUsers.length} {isUrdu ? 'Customers' : 'Users'}
                </span>
              </div>
            </div>

            {/* Reset Users Confirmation Dialog */}
            {showResetConfirm && (
              <div className="p-4 rounded-3xl bg-gradient-to-br from-[#380918] via-[#280512] to-[#1a020b] border border-rose-500/50 shadow-2xl space-y-3 animate-in fade-in">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-rose-500/20 border border-rose-500/40 flex items-center justify-center text-rose-400 shrink-0">
                    <AlertTriangle className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-black text-white">
                      {isUrdu ? 'Tamam Registered Users Ka Data Reset Karein?' : 'Clear All Registered Users Data?'}
                    </h4>
                    <p className="text-xs text-rose-200/90 mt-1 leading-relaxed">
                      {isUrdu
                        ? 'Is amal se tamam customer accounts mukammal delete ho jayenge. Koi bhi customer purani registration se login nahi kar sakega aur unhein naya account banana hoga. (Admin profile 03492928370 mehfooz rahegi).'
                        : 'This will delete all registered customer accounts. No customer will be able to log in without registering a new account first. (Admin profile 03492928370 remains untouched).'}
                    </p>
                  </div>
                </div>

                <div className="flex gap-2 justify-end pt-1">
                  <button
                    type="button"
                    onClick={() => {
                      clearAllRegisteredUsers();
                      setShowResetConfirm(false);
                    }}
                    className="py-2 px-4 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-extrabold text-xs shadow-md shadow-rose-950/60 transition-all flex items-center gap-1.5 active:scale-95"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>{isUrdu ? 'Haan, Tamam Users Clear Karein' : 'Yes, Delete All Users'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setShowResetConfirm(false)}
                    className="py-2 px-3.5 rounded-xl bg-white/10 hover:bg-white/15 text-stone-300 text-xs font-semibold transition-colors"
                  >
                    {isUrdu ? 'Mansookh (Cancel)' : 'Cancel'}
                  </button>
                </div>
              </div>
            )}

            {/* Search Input */}
            <div className="relative">
              <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={userSearch}
                onChange={(e) => setUserSearch(e.target.value)}
                placeholder={
                  isUrdu
                    ? 'Customer ka naam, mobile number, email ya referral code talash karein...'
                    : 'Search by customer name, phone/email, or referral code...'
                }
                className="w-full bg-black/60 border border-white/10 focus:border-blue-500 rounded-2xl py-2.5 pl-10 pr-4 text-xs text-white placeholder:text-stone-500 focus:outline-none"
              />
            </div>

            {/* Users Cards / Empty State */}
            {filteredUsers.length === 0 ? (
              <div className="p-8 rounded-3xl bg-[#121824] border border-slate-800 text-center space-y-2">
                <UserX className="w-10 h-10 text-slate-500 mx-auto opacity-60" />
                <h4 className="text-sm font-bold text-slate-300">
                  {userSearch ? (isUrdu ? 'Koi user nahi mila' : 'No users found matching query') : (isUrdu ? 'Koi Registered Customer Nahi Hai' : 'No Registered Customers')}
                </h4>
                <p className="text-xs text-slate-400 max-w-md mx-auto">
                  {isUrdu
                    ? 'Naye customers ke register hone par unka data aur unki downline teams yahan live show hongi.'
                    : 'When users register, their accounts and downline teams will appear here in real time.'}
                </p>
              </div>
            ) : (
              <div className="space-y-3">
              {filteredUsers.map((u) => {
                const team = getUserTeam(u);
                const isExpanded = expandedUserId === u.id;
                const contactDisplay = u.contact || u.phone || u.email || 'N/A';
                const isEmail = contactDisplay.includes('@');

                return (
                  <div
                    key={u.id}
                    className="p-4 rounded-3xl bg-gradient-to-br from-[#1c0824] via-[#14051a] to-[#0d0210] border border-blue-500/30 shadow-md space-y-3 transition-all"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-2xl bg-blue-500/20 border border-blue-500/40 flex items-center justify-center text-blue-300 font-bold font-mono text-base shrink-0">
                          {u.name?.charAt(0).toUpperCase() || 'U'}
                        </div>
                        <div>
                          <div className="font-black text-white text-sm flex items-center gap-2">
                            <span>{u.name}</span>
                            <span className="text-[10px] font-mono px-2 py-0.2 rounded bg-white/5 border border-white/10 text-stone-400">
                              {u.id}
                            </span>
                          </div>
                          <div className="text-xs text-stone-300 font-mono flex items-center gap-1.5 mt-0.5">
                            {isEmail ? <Mail className="w-3.5 h-3.5 text-blue-400" /> : <Phone className="w-3.5 h-3.5 text-emerald-400" />}
                            <span className="select-all font-semibold">{contactDisplay}</span>
                          </div>
                        </div>
                      </div>

                      <div className="text-right shrink-0">
                        <span className="text-xs font-mono font-bold px-2.5 py-0.5 rounded-full bg-blue-950 text-blue-300 border border-blue-500/40 block">
                          {team.length} {isUrdu ? 'Sathiyan' : 'Team Members'}
                        </span>
                        <span className="text-[10px] text-stone-500 font-mono mt-1 block">
                          {u.createdAt ? new Date(u.createdAt).toLocaleDateString() : 'Active'}
                        </span>
                      </div>
                    </div>

                    {/* Referral Meta Row */}
                    <div className="grid grid-cols-2 gap-2 text-xs p-2.5 rounded-2xl bg-black/40 border border-white/5 font-mono">
                      <div>
                        <span className="text-stone-500 text-[10px] block">Referral Code:</span>
                        <span className="text-amber-300 font-bold select-all">{u.referralCode || 'N/A'}</span>
                      </div>
                      <div>
                        <span className="text-stone-500 text-[10px] block">Referred By (Upline):</span>
                        <span className="text-stone-300 font-bold select-all">{u.referredBy || 'Direct'}</span>
                      </div>
                    </div>

                    {/* Team Toggle */}
                    <button
                      type="button"
                      onClick={() => setExpandedUserId(isExpanded ? null : u.id)}
                      className="w-full flex items-center justify-between py-2 px-3 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs text-blue-200 transition-colors"
                    >
                      <span className="flex items-center gap-2 font-bold">
                        <Users className="w-4 h-4 text-blue-400" />
                        <span>
                          {isUrdu
                            ? `${u.name} Ki Team Dekhein (${team.length} Afraad)`
                            : `Inspect Downline Team (${team.length} Members)`}
                        </span>
                      </span>
                      {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4 text-stone-400" />}
                    </button>

                    {/* Team Members Breakdown List */}
                    {isExpanded && (
                      <div className="pt-2 border-t border-white/10 space-y-2 animate-in fade-in">
                        {team.length === 0 ? (
                          <div className="p-4 rounded-2xl bg-black/50 border border-white/5 text-center text-xs text-stone-400">
                            {isUrdu
                              ? 'Is user ne abhi tak kisi ko apne code se register nahi karwaya.'
                              : 'No downline registrations for this user yet.'}
                          </div>
                        ) : (
                          <div className="space-y-2">
                            <span className="text-[10px] text-stone-400 font-bold uppercase tracking-wider block">
                              Direct Downline (Level 1):
                            </span>
                            {team.map((member) => {
                              const subTeam = getUserTeam(member);
                              return (
                                <div
                                  key={member.id}
                                  className="p-3 rounded-2xl bg-black/60 border border-blue-500/20 flex items-center justify-between text-xs"
                                >
                                  <div>
                                    <div className="font-bold text-white flex items-center gap-1.5">
                                      <span>{member.name}</span>
                                      <span className="text-[10px] text-amber-300 font-mono">({member.referralCode})</span>
                                    </div>
                                    <div className="text-[10px] text-stone-400 font-mono mt-0.5">
                                      {member.contact || member.phone || member.email}
                                    </div>
                                  </div>

                                  <div className="text-right">
                                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-950 text-blue-300 border border-blue-500/30 font-mono">
                                      Sub-team: {subTeam.length}
                                    </span>
                                    <div className="text-[9px] text-stone-500 mt-0.5 font-mono">
                                      {member.createdAt ? new Date(member.createdAt).toLocaleDateString() : ''}
                                    </div>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
};
