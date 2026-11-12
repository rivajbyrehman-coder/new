import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { PaymentMethod, UserProfile } from '../types';
import {
  X,
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
  Share2,
  ChevronDown,
  ChevronUp,
  Mail,
  Phone,
  Calendar,
} from 'lucide-react';

interface AdminModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type AdminTab = 'withdrawals' | 'deposits' | 'accounts' | 'users';

export const AdminModal: React.FC<AdminModalProps> = ({ isOpen, onClose }) => {
  const {
    lang,
    transactions,
    approveDeposit,
    rejectDeposit,
    approveWithdrawal,
    rejectWithdrawal,
    paymentMethods,
    updatePaymentMethod,
    resetPaymentMethods,
    registeredUsers,
  } = useApp();

  const [activeTab, setActiveTab] = useState<AdminTab>('withdrawals');
  const [rejectReason, setRejectReason] = useState<string>('');
  const [activeRejectId, setActiveRejectId] = useState<string | null>(null);

  // Deposit Account Number Editing State
  const [editingMethod, setEditingMethod] = useState<PaymentMethod | null>(null);
  const [editNumber, setEditNumber] = useState<string>('');
  const [editName, setEditName] = useState<string>('');
  const [editBank, setEditBank] = useState<string>('');

  // Registered Users & Team State
  const [userSearch, setUserSearch] = useState<string>('');
  const [expandedUserId, setExpandedUserId] = useState<string | null>(null);

  if (!isOpen) return null;

  const isUrdu = lang === 'ur';

  // Deposits
  const pendingDeposits = transactions.filter((t) => t.type === 'deposit' && t.status === 'pending');
  const pastDeposits = transactions.filter((t) => t.type === 'deposit' && t.status !== 'pending');

  // Withdrawals
  const pendingWithdrawals = transactions.filter((t) => t.type === 'withdraw' && t.status === 'pending');
  const pastWithdrawals = transactions.filter((t) => t.type === 'withdraw' && t.status !== 'pending');

  const totalPending = pendingDeposits.length + pendingWithdrawals.length;

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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-gradient-to-b from-[#24061a] via-[#1c040d] to-[#120207] border border-pink-500/30 w-full max-w-xl rounded-3xl p-4 sm:p-5 shadow-2xl relative max-h-[94vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-pink-500/20 mb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-pink-500 to-purple-600 flex items-center justify-center text-white shadow-lg shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-black text-white flex items-center gap-2">
                <span>{isUrdu ? 'Admin Control Portal' : 'Admin Control Portal'}</span>
                {totalPending > 0 && (
                  <span className="text-[10px] bg-amber-500 text-stone-950 px-2 py-0.5 rounded-full font-extrabold animate-pulse">
                    {totalPending} {isUrdu ? 'Pending' : 'Pending'}
                  </span>
                )}
              </h3>
              <p className="text-[11px] text-pink-300/80">
                {isUrdu
                  ? 'Sirf Admin (03492928370) Access • Withdrawals, Deposits, Accounts & Team'
                  : 'Strict Admin Access • Withdrawals, Deposits, Accounts & Team'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-stone-400 hover:text-stone-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switcher: 4 Tabs (Withdrawals, Deposits, Accounts, Users & Team) */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 p-1 bg-black/50 rounded-2xl border border-white/5 mb-3 text-xs">
          <button
            type="button"
            onClick={() => {
              setActiveTab('withdrawals');
              setActiveRejectId(null);
              setRejectReason('');
            }}
            className={`flex items-center justify-center gap-1.5 py-2 px-2 rounded-xl font-bold transition-all ${
              activeTab === 'withdrawals'
                ? 'bg-gradient-to-r from-orange-600 to-amber-600 text-white shadow-md'
                : 'text-stone-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <ArrowUpRight className="w-3.5 h-3.5" />
            <span>{isUrdu ? 'Withdrawals' : 'Withdrawals'}</span>
            {pendingWithdrawals.length > 0 && (
              <span className="text-[10px] bg-amber-400 text-stone-950 px-1.5 py-0.2 rounded-full font-black">
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
            className={`flex items-center justify-center gap-1.5 py-2 px-2 rounded-xl font-bold transition-all ${
              activeTab === 'deposits'
                ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-md'
                : 'text-stone-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <ArrowDownLeft className="w-3.5 h-3.5" />
            <span>{isUrdu ? 'Deposits' : 'Deposits'}</span>
            {pendingDeposits.length > 0 && (
              <span className="text-[10px] bg-amber-400 text-stone-950 px-1.5 py-0.2 rounded-full font-black">
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
            className={`flex items-center justify-center gap-1.5 py-2 px-2 rounded-xl font-bold transition-all ${
              activeTab === 'accounts'
                ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-md'
                : 'text-stone-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span>{isUrdu ? 'Accounts' : 'Accounts'}</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setActiveTab('users');
              setActiveRejectId(null);
              setRejectReason('');
            }}
            className={`flex items-center justify-center gap-1.5 py-2 px-2 rounded-xl font-bold transition-all ${
              activeTab === 'users'
                ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md'
                : 'text-stone-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>{isUrdu ? 'Team & Users' : 'Team & Users'}</span>
            <span className="text-[10px] bg-blue-950 text-blue-300 border border-blue-500/30 px-1.5 py-0.2 rounded-full font-bold">
              {registeredUsers.length}
            </span>
          </button>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto space-y-4 pr-1">
          {/* TAB 1: WITHDRAWALS */}
          {activeTab === 'withdrawals' && (
            <div>
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5" />
                  <span>{isUrdu ? 'Customer Withdrawal Requests (Pending Approval):' : 'Customer Withdrawal Requests Queue:'}</span>
                </h4>
                <span className="text-xs font-mono text-stone-400">
                  {pendingWithdrawals.length} {isUrdu ? 'Requests' : 'Requests'}
                </span>
              </div>

              {pendingWithdrawals.length === 0 ? (
                <div className="p-6 rounded-2xl bg-[#14020a] border border-[#2e0919] text-center">
                  <AlertCircle className="w-8 h-8 text-stone-500 mx-auto mb-2 opacity-60" />
                  <p className="text-xs font-semibold text-stone-300">
                    {isUrdu ? 'Abhi koi pending withdrawal request nahi hai' : 'No pending withdrawal requests'}
                  </p>
                  <p className="text-[11px] text-stone-500 mt-1">
                    {isUrdu
                      ? 'Jab koi customer withdrawal request bheje ga to tasdeeq aur payment ke liye yahan show hoga.'
                      : 'When a customer requests a withdrawal, it will appear here for review and payout approval.'}
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {pendingWithdrawals.map((tx) => (
                    <div
                      key={tx.id}
                      className="p-3.5 rounded-2xl bg-gradient-to-br from-[#2a0618] to-[#1a030d] border border-orange-500/40 shadow-lg"
                    >
                      <div className="flex items-start justify-between gap-2 mb-2.5">
                        <div>
                          <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-orange-500/20 text-orange-300 border border-orange-500/30">
                            {tx.method?.toUpperCase() || 'PAYOUT'}
                          </span>
                          <div className="text-xl font-black text-amber-400 font-mono mt-1">
                            PKR {tx.amount.toLocaleString()}
                          </div>
                        </div>

                        <div className="text-right">
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-950 text-amber-300 border border-amber-500/40">
                            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping"></span>
                            {isUrdu ? 'Raqam Bhejna Baqi Hai' : 'Awaiting Payout'}
                          </span>
                          <div className="text-[10px] text-stone-400 font-mono mt-1">
                            {new Date(tx.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </div>
                        </div>
                      </div>

                      {/* Customer Details Box */}
                      <div className="p-3 rounded-xl bg-black/50 border border-white/5 text-xs space-y-1.5 mb-3">
                        <div className="flex items-center justify-between">
                          <span className="text-stone-400 flex items-center gap-1">
                            <User className="w-3.5 h-3.5 text-stone-500" />
                            {isUrdu ? 'Account Title / Naam:' : 'Account Holder Name:'}
                          </span>
                          <span className="text-white font-bold select-all">{tx.accountName || 'Customer'}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-stone-400 flex items-center gap-1">
                            <CreditCard className="w-3.5 h-3.5 text-stone-500" />
                            {isUrdu ? 'Account Number:' : 'Account Number:'}
                          </span>
                          <span className="text-emerald-400 font-mono font-bold select-all tracking-wider">
                            {tx.accountNumber || 'N/A'}
                          </span>
                        </div>
                        <div className="flex items-center justify-between text-[11px] pt-1 border-t border-white/5">
                          <span className="text-stone-500">Method:</span>
                          <span className="text-amber-300 font-semibold capitalize">{tx.method || 'Direct'}</span>
                        </div>
                      </div>

                      {/* Rejection Input if Active */}
                      {activeRejectId === tx.id && (
                        <div className="mb-3 p-2.5 rounded-xl bg-rose-950/40 border border-rose-500/30 animate-in fade-in">
                          <label className="block text-[11px] text-rose-300 font-semibold mb-1">
                            {isUrdu ? 'Radd karne ki wajah darj karein (Customer ko refund hoga):' : 'Rejection reason (Amount will be refunded):'}
                          </label>
                          <input
                            type="text"
                            value={rejectReason}
                            onChange={(e) => setRejectReason(e.target.value)}
                            placeholder={isUrdu ? 'Misal: Wrong Account Number / Name mismatch' : 'e.g. Account number invalid'}
                            className="w-full bg-black/60 border border-rose-500/40 rounded-lg p-2 text-xs text-white placeholder:text-stone-600 focus:outline-none mb-2"
                          />
                          <div className="flex gap-2">
                            <button
                              type="button"
                              onClick={() => handleConfirmRejectWithdrawal(tx.id)}
                              className="flex-1 py-1.5 px-2 rounded-lg bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs"
                            >
                              {isUrdu ? 'Reject & Refund Balance' : 'Confirm Reject & Refund'}
                            </button>
                            <button
                              type="button"
                              onClick={() => setActiveRejectId(null)}
                              className="py-1.5 px-3 rounded-lg bg-white/10 text-stone-300 text-xs"
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      )}

                      {/* Action Buttons */}
                      {activeRejectId !== tx.id && (
                        <div className="flex gap-2">
                          <button
                            type="button"
                            onClick={() => handleApproveWithdrawal(tx.id)}
                            className="flex-1 flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-black text-xs shadow-md shadow-emerald-950/50 transition-all hover:scale-[1.02] active:scale-[0.98]"
                          >
                            <Check className="w-4 h-4 stroke-[3]" />
                            <span>{isUrdu ? 'Approve & Paid (Raqam Bhej Di)' : 'Approve & Mark Paid'}</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => setActiveRejectId(tx.id)}
                            className="flex items-center justify-center gap-1 py-2.5 px-3 rounded-xl bg-rose-950/60 hover:bg-rose-900 border border-rose-500/30 text-rose-300 font-bold text-xs transition-colors"
                          >
                            <Ban className="w-3.5 h-3.5" />
                            <span>{isUrdu ? 'Reject & Refund' : 'Reject & Refund'}</span>
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {/* Past Withdrawals History */}
              {pastWithdrawals.length > 0 && (
                <div className="pt-3 border-t border-pink-500/20 mt-3">
                  <h4 className="text-xs font-bold text-stone-400 uppercase tracking-wider mb-2">
                    {isUrdu ? 'Sabiqa Withdrawals Faislay (History):' : 'Processed Withdrawals History:'}
                  </h4>
                  <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                    {pastWithdrawals.slice(0, 6).map((tx) => (
                      <div
                        key={tx.id}
                        className="p-2.5 rounded-xl bg-[#14020a] border border-[#2b0717] flex items-center justify-between text-xs"
                      >
                        <div className="flex items-center gap-2">
                          <div
                            className={`w-7 h-7 rounded-lg flex items-center justify-center ${
                              tx.status === 'completed'
                                ? 'bg-emerald-950 text-emerald-400 border border-emerald-500/30'
                                : 'bg-rose-950 text-rose-400 border border-rose-500/30'
                            }`}
                          >
                            <ArrowUpRight className="w-3.5 h-3.5" />
                          </div>
                          <div>
                            <div className="font-mono font-bold text-white">
                              PKR {tx.amount.toLocaleString()}
                            </div>
                            <div className="text-[10px] text-stone-400">
                              {tx.accountName} • {tx.accountNumber} ({tx.method?.toUpperCase()})
                            </div>
                          </div>
                        </div>

                        <div className="text-right">
                          <span
                            className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold ${
                              tx.status === 'completed'
                                ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/30'
                                : 'bg-rose-950 text-rose-300 border border-rose-500/30'
                            }`}
                          >
                            {tx.status === 'completed'
                              ? isUrdu ? 'Ada Kar Diya Gaya' : 'Paid & Completed'
                              : isUrdu ? 'Radd Kar Ke Refund Kar Diya' : 'Rejected & Refunded'}
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
          )}

          {/* TAB 2: DEPOSITS */}
          {activeTab === 'deposits' && (
            <div>
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5" />
                  <span>{isUrdu ? 'Zair-e-Jaiza Deposit Requests (Pending):' : 'Pending Deposits Verification Queue:'}</span>
                </h4>
                <span className="text-xs font-mono text-stone-400">
                  {pendingDeposits.length} {isUrdu ? 'Dastyab' : 'Requests'}
                </span>
              </div>

              {pendingDeposits.length === 0 ? (
                <div className="p-6 rounded-2xl bg-[#14020a] border border-[#2e0919] text-center">
                  <AlertCircle className="w-8 h-8 text-stone-500 mx-auto mb-2 opacity-60" />
                  <p className="text-xs font-semibold text-stone-300">
                    {isUrdu ? 'Abhi koi pending deposit request nahi hai' : 'No pending deposit requests'}
                  </p>
                  <p className="text-[11px] text-stone-500 mt-1">
                    {isUrdu ? 'Jab koi user deposit karega to approval ke liye yahan show hoga.' : 'When a user deposits, their request will appear here for verification.'}
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {pendingDeposits.map((tx) => (
                    <div
                      key={tx.id}
                      className="p-3.5 rounded-2xl bg-gradient-to-br from-[#2a0618] to-[#1a030d] border border-amber-500/40 shadow-lg"
                    >
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <div>
                          <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                            {tx.method?.toUpperCase() || 'PAYMENT'}
                          </span>
                          <div className="text-lg font-black text-amber-400 font-mono mt-1">
                            PKR {tx.amount.toLocaleString()}
                          </div>
                        </div>

                        <div className="text-right">
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-950 text-amber-300 border border-amber-500/40">
                            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping"></span>
                            {isUrdu ? 'Zair-e-Jaiza' : 'Pending Review'}
                          </span>
                          <div className="text-[10px] text-stone-400 font-mono mt-1">
                            {new Date(tx.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </div>
                        </div>
                      </div>

                      {/* TID & Details */}
                      <div className="p-2.5 rounded-xl bg-black/40 border border-white/5 text-xs font-mono space-y-1 mb-3">
                        <div className="flex justify-between">
                          <span className="text-stone-400">Transaction ID (TID):</span>
                          <span className="text-emerald-400 font-bold select-all">{tx.tid || 'N/A'}</span>
                        </div>
                        <div className="flex justify-between text-[11px]">
                          <span className="text-stone-500">Method:</span>
                          <span className="text-stone-300 capitalize">{tx.method || 'Direct'}</span>
                        </div>
                      </div>

                      {/* Reject Reason input if active */}
                      {activeRejectId === tx.id && (
                        <div className="mb-3 p-2.5 rounded-xl bg-rose-950/40 border border-rose-500/30 animate-in fade-in">
                          <label className="block text-[11px] text-rose-300 font-semibold mb-1">
                            {isUrdu ? 'Radd karne ki wajah darj karein:' : 'Reason for rejection:'}
                          </label>
                          <input
                            type="text"
                            value={rejectReason}
                            onChange={(e) => setRejectReason(e.target.value)}
                            placeholder="Misal: Wrong TID code / Payment not received"
                            className="w-full bg-black/60 border border-rose-500/40 rounded-lg p-2 text-xs text-white placeholder:text-stone-600 focus:outline-none mb-2"
                          />
                          <div className="flex gap-2">
                            <button
                              type="button"
                              onClick={() => handleConfirmRejectDeposit(tx.id)}
                              className="flex-1 py-1.5 px-2 rounded-lg bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs"
                            >
                              {isUrdu ? 'Mustarad Karein' : 'Confirm Reject'}
                            </button>
                            <button
                              type="button"
                              onClick={() => setActiveRejectId(null)}
                              className="py-1.5 px-3 rounded-lg bg-white/10 text-stone-300 text-xs"
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      )}

                      {/* Action Buttons */}
                      {activeRejectId !== tx.id && (
                        <div className="flex gap-2">
                          <button
                            type="button"
                            onClick={() => handleApproveDeposit(tx.id)}
                            className="flex-1 flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-black text-xs shadow-md shadow-emerald-950/50 transition-all hover:scale-[1.02] active:scale-[0.98]"
                          >
                            <Check className="w-4 h-4 stroke-[3]" />
                            <span>{isUrdu ? 'Approve Karein (Balance Add)' : 'Approve & Credit Balance'}</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => setActiveRejectId(tx.id)}
                            className="flex items-center justify-center gap-1 py-2.5 px-3 rounded-xl bg-rose-950/60 hover:bg-rose-900 border border-rose-500/30 text-rose-300 font-bold text-xs transition-colors"
                          >
                            <Ban className="w-3.5 h-3.5" />
                            <span>{isUrdu ? 'Reject' : 'Reject'}</span>
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {/* Past Deposits History */}
              {pastDeposits.length > 0 && (
                <div className="pt-3 border-t border-pink-500/20 mt-3">
                  <h4 className="text-xs font-bold text-stone-400 uppercase tracking-wider mb-2">
                    {isUrdu ? 'Sabiqa Deposit Faislay (Past Activity):' : 'Recent Decisions:'}
                  </h4>
                  <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                    {pastDeposits.slice(0, 6).map((tx) => (
                      <div
                        key={tx.id}
                        className="p-2.5 rounded-xl bg-[#14020a] border border-[#2b0717] flex items-center justify-between text-xs"
                      >
                        <div className="flex items-center gap-2">
                          <div
                            className={`w-7 h-7 rounded-lg flex items-center justify-center ${
                              tx.status === 'completed'
                                ? 'bg-emerald-950 text-emerald-400 border border-emerald-500/30'
                                : 'bg-rose-950 text-rose-400 border border-rose-500/30'
                            }`}
                          >
                            <ArrowDownLeft className="w-3.5 h-3.5" />
                          </div>
                          <div>
                            <div className="font-mono font-bold text-white">
                              PKR {tx.amount.toLocaleString()}
                            </div>
                            <div className="text-[10px] text-stone-400 font-mono">
                              {tx.tid || tx.note || 'Direct'}
                            </div>
                          </div>
                        </div>

                        <div className="text-right">
                          <span
                            className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold ${
                              tx.status === 'completed'
                                ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/30'
                                : 'bg-rose-950 text-rose-300 border border-rose-500/30'
                            }`}
                          >
                            {tx.status === 'completed'
                              ? isUrdu ? 'Manzoor Shuda' : 'Approved'
                              : isUrdu ? 'Mustarad Shuda' : 'Rejected'}
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
          )}

          {/* TAB 3: DEPOSIT ACCOUNTS (CHANGE NUMBERS) */}
          {activeTab === 'accounts' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                    <Edit3 className="w-3.5 h-3.5" />
                    <span>{isUrdu ? 'Deposit Accounts Numbers Tabdeel Karein:' : 'Change Deposit Account Numbers:'}</span>
                  </h4>
                  <p className="text-[11px] text-stone-400 mt-0.5">
                    {isUrdu
                      ? 'Naye numbers tamam users ke deposit screen par foran update ho jayenge.'
                      : 'Changes will immediately appear on the Deposit tab for all users.'}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={resetPaymentMethods}
                  title="Reset to default official numbers"
                  className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-[11px] text-stone-300 border border-white/10 transition-colors"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>{isUrdu ? 'Default Reset' : 'Reset'}</span>
                </button>
              </div>

              {/* List of 3 payment accounts */}
              <div className="space-y-3">
                {(['easypaisa', 'jazzcash', 'bank'] as PaymentMethod[]).map((mId) => {
                  const method = paymentMethods[mId];
                  const isEditing = editingMethod === mId;

                  return (
                    <div
                      key={mId}
                      className="p-3.5 rounded-2xl bg-gradient-to-br from-[#200515] to-[#14020a] border border-pink-500/30 shadow-md"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <span
                            className={`w-2.5 h-2.5 rounded-full ${
                              mId === 'easypaisa'
                                ? 'bg-emerald-400'
                                : mId === 'jazzcash'
                                ? 'bg-amber-400'
                                : 'bg-blue-400'
                            }`}
                          ></span>
                          <h5 className="font-bold text-white text-sm">
                            {method.name}
                          </h5>
                          {method.bankName && (
                            <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-950/80 text-blue-300 border border-blue-500/30">
                              {method.bankName}
                            </span>
                          )}
                        </div>

                        {!isEditing && (
                          <button
                            type="button"
                            onClick={() => handleStartEditAccount(mId)}
                            className="flex items-center gap-1 text-xs font-bold py-1 px-2.5 rounded-lg bg-pink-950/60 hover:bg-pink-900 border border-pink-500/40 text-pink-200 transition-colors"
                          >
                            <Edit3 className="w-3 h-3" />
                            <span>{isUrdu ? 'Tabdeel Karein' : 'Edit'}</span>
                          </button>
                        )}
                      </div>

                      {/* View Mode */}
                      {!isEditing ? (
                        <div className="p-2.5 rounded-xl bg-black/50 border border-white/5 space-y-1.5 text-xs">
                          <div className="flex justify-between items-center">
                            <span className="text-stone-400 flex items-center gap-1">
                              <CreditCard className="w-3.5 h-3.5 text-stone-500" />
                              {isUrdu ? 'Account Number:' : 'Account Number:'}
                            </span>
                            <span className="text-emerald-400 font-mono font-bold select-all tracking-wider text-sm">
                              {method.accountNumber}
                            </span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-stone-400 flex items-center gap-1">
                              <User className="w-3.5 h-3.5 text-stone-500" />
                              {isUrdu ? 'Account Title / Naam:' : 'Account Title:'}
                            </span>
                            <span className="text-white font-semibold select-all">
                              {method.accountName}
                            </span>
                          </div>
                        </div>
                      ) : (
                        /* Edit Form */
                        <div className="mt-2 p-3 rounded-xl bg-black/70 border border-pink-500/40 space-y-3 animate-in fade-in">
                          {mId === 'bank' && (
                            <div>
                              <label className="block text-[11px] font-semibold text-stone-300 mb-1 flex items-center gap-1">
                                <Building className="w-3 h-3 text-pink-400" />
                                {isUrdu ? 'Bank Name (Misal: NayaPay, Meezan, HBL):' : 'Bank Name:'}
                              </label>
                              <input
                                type="text"
                                value={editBank}
                                onChange={(e) => setEditBank(e.target.value)}
                                placeholder="NayaPay / Meezan Bank"
                                className="w-full bg-[#16020c] border border-pink-500/40 rounded-lg p-2 text-xs text-white focus:outline-none focus:border-pink-400"
                              />
                            </div>
                          )}

                          <div>
                            <label className="block text-[11px] font-semibold text-stone-300 mb-1 flex items-center gap-1">
                              <CreditCard className="w-3 h-3 text-pink-400" />
                              {isUrdu ? 'Naya Account Number Darj Karein:' : 'New Account Number:'}
                            </label>
                            <input
                              type="text"
                              value={editNumber}
                              onChange={(e) => setEditNumber(e.target.value)}
                              placeholder="03XXXXXXXXX ya IBAN"
                              className="w-full bg-[#16020c] border border-pink-500/40 rounded-lg p-2 text-xs text-white font-mono focus:outline-none focus:border-pink-400"
                            />
                          </div>

                          <div>
                            <label className="block text-[11px] font-semibold text-stone-300 mb-1 flex items-center gap-1">
                              <User className="w-3 h-3 text-pink-400" />
                              {isUrdu ? 'Account Holder Naam (Title):' : 'Account Holder Title / Name:'}
                            </label>
                            <input
                              type="text"
                              value={editName}
                              onChange={(e) => setEditName(e.target.value)}
                              placeholder="Misal: Rehman Khan"
                              className="w-full bg-[#16020c] border border-pink-500/40 rounded-lg p-2 text-xs text-white focus:outline-none focus:border-pink-400"
                            />
                          </div>

                          <div className="flex gap-2 pt-1">
                            <button
                              type="button"
                              onClick={() => handleSaveAccount(mId)}
                              className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs shadow-md transition-all active:scale-95"
                            >
                              <Save className="w-3.5 h-3.5" />
                              <span>{isUrdu ? 'Naya Number Save Karein' : 'Save Changes'}</span>
                            </button>

                            <button
                              type="button"
                              onClick={() => setEditingMethod(null)}
                              className="py-2 px-3 rounded-xl bg-white/10 hover:bg-white/15 text-stone-300 text-xs transition-colors"
                            >
                              {isUrdu ? 'Mansookh' : 'Cancel'}
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Informative Note */}
              <div className="p-3 rounded-2xl bg-[#14020a] border border-[#2b0717] text-xs text-stone-400 space-y-1">
                <p className="font-semibold text-amber-300 flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  {isUrdu ? 'Fauri Asar (Instant Update):' : 'Live Update Notice:'}
                </p>
                <p className="text-[11px] leading-relaxed">
                  {isUrdu
                    ? 'Yahan number save karne ke baad tamam customers jab bhi Deposit Tab kholen ge, to unhein aap ka diya hua naya number aur naam show hoga.'
                    : 'Once saved, all users visiting the Deposit Tab will immediately see and copy your updated account number.'}
                </p>
              </div>
            </div>
          )}

          {/* TAB 4: USERS & TEAMS (REGISTERED USERS & THEIR TEAMS) */}
          {activeTab === 'users' && (
            <div className="space-y-3.5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <h4 className="text-xs font-bold text-blue-400 uppercase tracking-wider flex items-center gap-1.5">
                    <Users className="w-3.5 h-3.5" />
                    <span>{isUrdu ? 'Registered Users Aur Unki Teams:' : 'Registered Users & Teams:'}</span>
                  </h4>
                  <p className="text-[11px] text-stone-400 mt-0.5">
                    {isUrdu
                      ? 'Naye register hone wale har user aur unke banaye gaye team members ki tafseelat.'
                      : 'All registered accounts, their referral codes, uplines, and downline team members.'}
                  </p>
                </div>

                <div className="flex items-center gap-2 text-xs">
                  <span className="px-2.5 py-1 rounded-lg bg-blue-950/80 border border-blue-500/30 text-blue-300 font-bold font-mono">
                    {registeredUsers.length} {isUrdu ? 'Users' : 'Users'}
                  </span>
                </div>
              </div>

              {/* Search Box */}
              <div className="relative">
                <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={userSearch}
                  onChange={(e) => setUserSearch(e.target.value)}
                  placeholder={
                    isUrdu
                      ? 'Naam, mobile number, email ya referral code se talash karein...'
                      : 'Search by name, phone/email, or referral code...'
                  }
                  className="w-full bg-black/60 border border-white/10 focus:border-blue-500 rounded-xl py-2 pl-9 pr-3 text-xs text-white placeholder:text-stone-500 focus:outline-none"
                />
                {userSearch && (
                  <button
                    onClick={() => setUserSearch('')}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-white text-xs"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              {/* Users List with Teams */}
              {filteredUsers.length === 0 ? (
                <div className="p-6 rounded-2xl bg-[#14020a] border border-[#2e0919] text-center">
                  <AlertCircle className="w-8 h-8 text-stone-500 mx-auto mb-2 opacity-60" />
                  <p className="text-xs font-semibold text-stone-300">
                    {isUrdu ? 'Koi user nahi mila' : 'No users found matching query'}
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
                        className="rounded-2xl p-3.5 bg-gradient-to-br from-[#1c0824] via-[#14051a] to-[#0d0210] border border-blue-500/30 shadow-md space-y-2.5 transition-all"
                      >
                        {/* User Header */}
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex items-center gap-2.5">
                            <div className="w-9 h-9 rounded-xl bg-blue-500/20 border border-blue-500/40 flex items-center justify-center text-blue-300 shrink-0 font-bold font-mono text-sm">
                              {u.name?.charAt(0).toUpperCase() || 'U'}
                            </div>
                            <div>
                              <div className="font-black text-white text-sm flex items-center gap-2">
                                <span>{u.name}</span>
                                <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-white/5 border border-white/10 text-stone-400">
                                  {u.id}
                                </span>
                              </div>
                              <div className="text-[11px] text-stone-400 flex items-center gap-1.5 mt-0.5">
                                {isEmail ? <Mail className="w-3 h-3 text-blue-400" /> : <Phone className="w-3 h-3 text-emerald-400" />}
                                <span className="text-stone-300 font-mono font-semibold select-all">{contactDisplay}</span>
                              </div>
                            </div>
                          </div>

                          <div className="text-right shrink-0">
                            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-blue-950 text-blue-300 border border-blue-500/40 font-bold block">
                              {team.length} {isUrdu ? 'Team Members' : 'Team Members'}
                            </span>
                            <span className="text-[10px] text-stone-500 mt-1 block font-mono">
                              {u.createdAt ? new Date(u.createdAt).toLocaleDateString() : 'Active'}
                            </span>
                          </div>
                        </div>

                        {/* Referral Details Row */}
                        <div className="grid grid-cols-2 gap-2 text-[11px] p-2 rounded-xl bg-black/40 border border-white/5 font-mono">
                          <div>
                            <span className="text-stone-500 block text-[10px]">
                              {isUrdu ? 'User Ka Referral Code:' : 'Referral Code:'}
                            </span>
                            <span className="text-amber-300 font-bold select-all">{u.referralCode || 'N/A'}</span>
                          </div>
                          <div>
                            <span className="text-stone-500 block text-[10px]">
                              {isUrdu ? 'Upline (Referred By):' : 'Referred By:'}
                            </span>
                            <span className="text-stone-300 font-bold select-all">{u.referredBy || 'Direct / None'}</span>
                          </div>
                        </div>

                        {/* Team Toggle Button */}
                        <button
                          type="button"
                          onClick={() => setExpandedUserId(isExpanded ? null : u.id)}
                          className="w-full flex items-center justify-between py-1.5 px-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs text-blue-200 transition-colors"
                        >
                          <span className="flex items-center gap-1.5 font-bold">
                            <Users className="w-3.5 h-3.5 text-blue-400" />
                            <span>
                              {isUrdu
                                ? `${u.name} Ki Team Dekhein (${team.length} Afraad)`
                                : `View ${u.name}'s Downline Team (${team.length})`}
                            </span>
                          </span>
                          {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4 text-stone-400" />}
                        </button>

                        {/* Expanded Team Members Details */}
                        {isExpanded && (
                          <div className="pt-2 border-t border-white/10 space-y-2 animate-in fade-in">
                            {team.length === 0 ? (
                              <div className="p-3 rounded-xl bg-black/50 border border-white/5 text-center text-[11px] text-stone-400">
                                {isUrdu
                                  ? 'Is user ne abhi tak kisi ko apne code se register nahi karwaya.'
                                  : 'This user does not have any direct downline registrations yet.'}
                              </div>
                            ) : (
                              <div className="space-y-1.5">
                                <span className="text-[10px] text-stone-400 font-bold uppercase tracking-wider block">
                                  {isUrdu ? 'Direct Team Members (Level 1):' : 'Direct Downline Members (Level 1):'}
                                </span>
                                {team.map((member) => {
                                  const subTeam = getUserTeam(member);
                                  return (
                                    <div
                                      key={member.id}
                                      className="p-2.5 rounded-xl bg-black/60 border border-blue-500/20 flex items-center justify-between text-xs"
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
                                        <div className="text-[9px] text-stone-500 mt-0.5">
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
        </div>

        {/* Footer */}
        <div className="pt-3 border-t border-pink-500/20 mt-3 flex justify-between items-center text-xs text-stone-400">
          <span className="flex items-center gap-1 text-[11px] text-pink-300">
            <Sparkles className="w-3 h-3 text-pink-400" />
            Admin: 03492928370 Verified
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-white/10 hover:bg-white/15 text-white font-semibold text-xs transition-colors"
          >
            {isUrdu ? 'Band Karein' : 'Close'}
          </button>
        </div>
      </div>
    </div>
  );
};
