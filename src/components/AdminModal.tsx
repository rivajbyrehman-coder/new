import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  X,
  ShieldCheck,
  Check,
  Ban,
  Clock,
  ArrowDownLeft,
  AlertCircle,
  Sparkles,
} from 'lucide-react';

interface AdminModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AdminModal: React.FC<AdminModalProps> = ({ isOpen, onClose }) => {
  const { lang, transactions, approveDeposit, rejectDeposit } = useApp();
  const [rejectReason, setRejectReason] = useState<string>('');
  const [activeRejectId, setActiveRejectId] = useState<string | null>(null);

  if (!isOpen) return null;

  const isUrdu = lang === 'ur';
  const pendingDeposits = transactions.filter((t) => t.type === 'deposit' && t.status === 'pending');
  const pastDeposits = transactions.filter((t) => t.type === 'deposit' && t.status !== 'pending');

  const handleApprove = (id: string) => {
    approveDeposit(id);
  };

  const handleConfirmReject = (id: string) => {
    rejectDeposit(id, rejectReason || 'Invalid Transaction ID');
    setActiveRejectId(null);
    setRejectReason('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-gradient-to-b from-[#24061a] via-[#1c040d] to-[#120207] border border-pink-500/30 w-full max-w-lg rounded-3xl p-5 shadow-2xl relative max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-pink-500/20 mb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-pink-500 to-purple-600 flex items-center justify-center text-white shadow-lg">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-black text-white flex items-center gap-2">
                <span>{isUrdu ? 'Admin Portal: Deposit Approvals' : 'Admin Portal: Deposit Approvals'}</span>
                {pendingDeposits.length > 0 && (
                  <span className="text-[10px] bg-amber-500 text-stone-950 px-2 py-0.5 rounded-full font-extrabold animate-pulse">
                    {pendingDeposits.length} {isUrdu ? 'Naye' : 'Pending'}
                  </span>
                )}
              </h3>
              <p className="text-[11px] text-pink-300/80">
                {isUrdu ? 'Deposit requests ki tasdeeq aur wallet credit karein' : 'Verify TID and credit balance to user account'}
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

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto space-y-4 pr-1">
          {/* Pending Section */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5" />
                <span>{isUrdu ? 'Zair-e-Jaiza Requests (Pending Approval):' : 'Pending Verification Queue:'}</span>
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
                          Pending Review
                        </span>
                        <div className="text-[10px] text-stone-400 font-mono mt-1">
                          {new Date(tx.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </div>
                      </div>
                    </div>

                    {/* TID & Details */}
                    <div className="p-2 rounded-xl bg-black/40 border border-white/5 text-xs font-mono space-y-1 mb-3">
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
                          className="w-full bg-black/60 border border-rose-500/40 rounded-lg p-1.5 text-xs text-white placeholder:text-stone-600 focus:outline-none mb-2"
                        />
                        <div className="flex gap-2">
                          <button
                            type="button"
                            onClick={() => handleConfirmReject(tx.id)}
                            className="flex-1 py-1 px-2 rounded-lg bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs"
                          >
                            {isUrdu ? 'Mustarad Karein' : 'Confirm Reject'}
                          </button>
                          <button
                            type="button"
                            onClick={() => setActiveRejectId(null)}
                            className="py-1 px-2 rounded-lg bg-white/10 text-stone-300 text-xs"
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
                          onClick={() => handleApprove(tx.id)}
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
          </div>

          {/* Past Approvals / Rejections History */}
          {pastDeposits.length > 0 && (
            <div className="pt-2 border-t border-pink-500/20">
              <h4 className="text-xs font-bold text-stone-400 uppercase tracking-wider mb-2">
                {isUrdu ? 'Sabiqa Faislay (Past Activity):' : 'Recent Decisions:'}
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
                        {tx.status === 'completed' ? 'Approved' : 'Rejected'}
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

        {/* Footer */}
        <div className="pt-3 border-t border-pink-500/20 mt-3 flex justify-between items-center text-xs text-stone-400">
          <span className="flex items-center gap-1 text-[11px]">
            <Sparkles className="w-3 h-3 text-pink-400" />
            Admin Security Verified
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
