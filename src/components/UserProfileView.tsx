import React, { useState } from 'react';
import { Transaction, UserProfile } from '../types';
import {
  Diamond,
  Crown,
  History,
  CreditCard,
  Gift,
  ArrowDownRight,
  ArrowUpRight,
  Calendar,
  Filter,
  LogOut,
  Edit3,
  Copy,
  Check,
  ShieldCheck,
  Sparkles,
  Smartphone,
  ChevronRight,
  Receipt,
  Download,
} from 'lucide-react';
import { sound } from '../utils/audio';

interface UserProfileViewProps {
  currentUser: UserProfile;
  transactions: Transaction[];
  onOpenRecharge: () => void;
  onOpenVipBp: () => void;
  onOpenAuth: () => void;
  onUpdateProfile: (updated: Partial<UserProfile>) => void;
  onOpenAndroidDownload?: () => void;
}

type TxnFilter = 'all' | 'recharge' | 'gift_sent' | 'bp_purchase';

export const UserProfileView: React.FC<UserProfileViewProps> = ({
  currentUser,
  transactions,
  onOpenRecharge,
  onOpenVipBp,
  onOpenAuth,
  onUpdateProfile,
  onOpenAndroidDownload,
}) => {
  const [filter, setFilter] = useState<TxnFilter>('all');
  const [copiedUid, setCopiedUid] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(currentUser.name);
  const [editBio, setEditBio] = useState(currentUser.bio);
  const [selectedTxnReceipt, setSelectedTxnReceipt] = useState<Transaction | null>(null);

  const handleCopyUid = () => {
    navigator.clipboard.writeText(currentUser.id);
    sound.playClick();
    setCopiedUid(true);
    setTimeout(() => setCopiedUid(false), 2000);
  };

  const handleSaveProfile = () => {
    sound.playClick();
    onUpdateProfile({ name: editName, bio: editBio });
    setIsEditing(false);
  };

  // Filtered transactions
  const filteredTransactions = transactions.filter((t) => {
    if (filter === 'all') return true;
    return t.type === filter;
  });

  // Financial statistics
  const totalRechargedRupees = transactions
    .filter((t) => t.type === 'recharge' && t.rupees)
    .reduce((sum, t) => sum + (t.rupees || 0), 0);

  const totalDiamondsPurchased = transactions
    .filter((t) => t.type === 'recharge')
    .reduce((sum, t) => sum + t.diamondsDelta, 0);

  const totalDiamondsSpent = transactions
    .filter((t) => t.diamondsDelta < 0)
    .reduce((sum, t) => sum + Math.abs(t.diamondsDelta), 0);

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-12">
      {/* TOP USER CARD */}
      <div className="relative overflow-hidden rounded-3xl bg-slate-900 border border-slate-800 p-6 sm:p-8 shadow-2xl">
        {/* Glow ambient background */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-bl from-amber-500/10 via-indigo-600/10 to-transparent blur-3xl pointer-events-none" />

        <div className="relative flex flex-col sm:flex-row items-center sm:items-start gap-6">
          {/* Avatar with VIP Crown Frame */}
          <div className="relative group shrink-0">
            <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full p-1 bg-gradient-to-tr from-amber-400 via-rose-500 to-indigo-500 shadow-xl shadow-amber-500/20">
              <img
                src={currentUser.avatar}
                alt={currentUser.name}
                referrerPolicy="no-referrer"
                className="w-full h-full rounded-full object-cover"
              />
            </div>
            <div className="absolute -bottom-1 -right-1 px-2.5 py-0.5 rounded-full bg-gradient-to-r from-amber-500 to-yellow-400 text-black font-extrabold text-[11px] shadow-md flex items-center gap-1">
              <Crown className="w-3 h-3 fill-black" />
              VIP {currentUser.vipLevel}
            </div>
          </div>

          {/* User Details */}
          <div className="flex-1 text-center sm:text-left space-y-2">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                {isEditing ? (
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      className="py-1 px-3 rounded-lg bg-slate-800 border border-slate-700 text-white font-bold text-lg"
                    />
                    <button
                      onClick={handleSaveProfile}
                      className="py-1 px-3 rounded-lg bg-emerald-600 text-white text-xs font-semibold"
                    >
                      Save
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center justify-center sm:justify-start gap-2">
                    <h1 className="text-2xl font-bold font-display text-white tracking-tight">
                      {currentUser.name}
                    </h1>
                    <button
                      onClick={() => setIsEditing(true)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                      title="Edit Profile"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                  </div>
                )}
                
                <div className="flex items-center justify-center sm:justify-start gap-2 text-xs text-slate-400 mt-1">
                  <span className="font-mono text-slate-300">UID: {currentUser.id}</span>
                  <button
                    onClick={handleCopyUid}
                    className="p-1 rounded text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                    title="Copy UID"
                  >
                    {copiedUid ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                  <span className="text-slate-600">·</span>
                  <span className="text-[11px] px-2 py-0.5 rounded-full bg-slate-800 text-indigo-300 border border-slate-700 capitalize flex items-center gap-1">
                    {currentUser.loginProvider === 'phone' ? <Smartphone className="w-3 h-3" /> : null}
                    {currentUser.loginProvider} Login
                  </span>
                </div>
              </div>

              {/* Account Switcher Button */}
              <button
                onClick={onOpenAuth}
                className="self-center sm:self-start py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1.5 transition-colors"
              >
                <LogOut className="w-3.5 h-3.5 text-slate-400" />
                Switch Account
              </button>
            </div>

            {/* Bio */}
            <p className="text-xs text-slate-300 max-w-xl">
              {currentUser.bio}
            </p>

            {/* VIP XP Progress Bar */}
            <div className="pt-2">
              <div className="flex justify-between items-center text-xs mb-1">
                <span className="text-amber-400 font-semibold flex items-center gap-1">
                  <Sparkles className="w-3 h-3" /> VIP {currentUser.vipLevel} Privileges Active
                </span>
                <span className="font-mono text-slate-400 text-[11px]">
                  {currentUser.vipExp} / 1,000 XP to VIP {currentUser.vipLevel + 1}
                </span>
              </div>
              <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-amber-500 via-rose-500 to-indigo-500 rounded-full transition-all duration-500"
                  style={{ width: `${Math.min(100, (currentUser.vipExp / 1000) * 100)}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* WALLET BALANCE & RECHARGE ACTION CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Diamond Wallet (Primary Focus) */}
        <div className="p-6 rounded-3xl bg-gradient-to-br from-amber-950/40 via-slate-900 to-slate-900 border border-amber-500/30 shadow-xl flex flex-col justify-between space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-amber-300 flex items-center gap-1.5">
              <Diamond className="w-4 h-4 fill-amber-400 text-amber-400" />
              Current Diamond Balance
            </span>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
              Live Wallet
            </span>
          </div>

          <div>
            <div className="text-3xl sm:text-4xl font-extrabold font-display text-white tracking-tight flex items-baseline gap-2">
              <span className="text-amber-400">💎</span>
              <span className="font-mono tabular-nums">{currentUser.diamonds.toLocaleString()}</span>
            </div>
            <p className="text-[11px] text-slate-400 mt-1">
              Use diamonds to send gifts in rooms, unlock VIP rooms, and bet in mini games.
            </p>
          </div>

          <button
            onClick={() => {
              sound.playClick();
              onOpenRecharge();
            }}
            className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 active:scale-[0.98] transition-all"
          >
            <CreditCard className="w-4 h-4" />
            Recharge Diamonds (रिचार्ज करें)
          </button>
        </div>

        {/* Charm Points & Gifting Rank */}
        <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl flex flex-col justify-between space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-rose-300 flex items-center gap-1.5">
              <span>🌸</span> Charm & Popularity Points
            </span>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30">
              Host Charm
            </span>
          </div>

          <div>
            <div className="text-3xl font-bold font-display text-white tracking-tight flex items-baseline gap-2">
              <span className="text-rose-400">🌸</span>
              <span className="font-mono tabular-nums">{currentUser.charmPoints.toLocaleString()}</span>
            </div>
            <p className="text-[11px] text-slate-400 mt-1">
              Earned from listeners sending roses, supercars, and gifts on your mic seat.
            </p>
          </div>

          <button
            onClick={() => {
              sound.playClick();
              onOpenVipBp();
            }}
            className="w-full py-3 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs flex items-center justify-center gap-2 border border-slate-700 transition-colors"
          >
            <Crown className="w-4 h-4 text-amber-400" />
            VIP BP & Backpack Mall
          </button>
        </div>

        {/* Total Recharge Stats */}
        <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl flex flex-col justify-between space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-indigo-300 flex items-center gap-1.5">
              <Receipt className="w-4 h-4" /> Lifetime Top-Up Summary
            </span>
            <span className="text-[10px] font-semibold text-emerald-400 font-mono">
              Verified
            </span>
          </div>

          <div className="space-y-2 text-xs">
            <div className="flex justify-between items-center pb-2 border-b border-slate-800">
              <span className="text-slate-400">Total Money Recharged</span>
              <span className="font-bold text-white font-mono">₹{totalRechargedRupees.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center pb-2 border-b border-slate-800">
              <span className="text-slate-400">Total Diamonds Purchased</span>
              <span className="font-bold text-amber-400 font-mono">+{totalDiamondsPurchased.toLocaleString()} 💎</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-400">Gifts & Items Spent</span>
              <span className="font-bold text-rose-400 font-mono">-{totalDiamondsSpent.toLocaleString()} 💎</span>
            </div>
          </div>

          <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800 text-[11px] text-slate-400 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>All recharges protected with instant bank verification</span>
          </div>
        </div>
      </div>

      {/* ANDROID PLAY STORE APP DOWNLOAD PROMO CARD */}
      {onOpenAndroidDownload && (
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-emerald-950/70 via-slate-900 to-indigo-950/70 border border-emerald-500/30 p-5 sm:p-6 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-5">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-slate-950 border border-emerald-500/40 p-1 flex items-center justify-center shrink-0 shadow-lg">
              <svg className="w-8 h-8" viewBox="0 0 512 512">
                <path fill="#00a0ff" d="M47.7 21.6L275.5 249.4 69.3 455.6c-4.4-4.8-7.1-11.2-7.1-18.3V74.7c0-7.1 2.7-13.5 7.1-18.3l-21.6-34.8z" />
                <path fill="#00e676" d="M356.5 168.4L275.5 249.4 47.7 21.6c6.2-4.1 13.6-6.6 21.6-6.6h287.2z" />
                <path fill="#ffd600" d="M455.8 238.9l-99.3-70.5-81 81 81 81 99.3-70.5c10.4-7.4 10.4-23.6 0-31z" />
                <path fill="#ff3d00" d="M69.3 455.6l206.2-206.2 81 81-287.2 0c-8 0-15.4-2.5-21.6-6.6l21.6 131.8z" />
              </svg>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-white font-display">
                  AbuChat Android Phone App
                </h3>
                <span className="text-[10px] bg-emerald-500/20 text-emerald-400 font-bold px-2 py-0.5 rounded-full border border-emerald-500/30">
                  Google Play v2.4.0
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-0.5">
                Install on your Android smartphone for background audio, lower latency, and push notifications.
              </p>
              <div className="flex items-center gap-3 text-[11px] text-slate-400 mt-1">
                <span className="text-emerald-400 flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" /> Play Protect Safe
                </span>
                <span>• 4.8 ★ (142K Reviews)</span>
                <span>• 28.4 MB</span>
              </div>
            </div>
          </div>

          <button
            onClick={() => {
              sound.playClick();
              onOpenAndroidDownload();
            }}
            className="w-full sm:w-auto py-2.5 px-5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/30 shrink-0 transition-all active:scale-[0.98]"
          >
            <Download className="w-4 h-4 stroke-[2.5]" />
            <span>Install on Android Phone</span>
          </button>
        </div>
      )}

      {/* RECHARGE HISTORY & TRANSACTIONS SECTION */}
      <div className="rounded-3xl bg-slate-900 border border-slate-800 p-6 sm:p-8 shadow-2xl space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold font-display text-white flex items-center gap-2">
              <History className="w-5 h-5 text-indigo-400" />
              Recharge History & Past Transactions
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Transparent ledger of all diamond recharges, gifts, and room BP purchases with exact dates.
            </p>
          </div>

          {/* Filter Tabs */}
          <div className="flex items-center gap-1 p-1 bg-slate-950 rounded-xl border border-slate-800 text-xs overflow-x-auto">
            <button
              onClick={() => { setFilter('all'); sound.playClick(); }}
              className={`py-1.5 px-3 rounded-lg font-medium whitespace-nowrap transition-colors ${
                filter === 'all'
                  ? 'bg-slate-800 text-white font-semibold shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              All Transactions ({transactions.length})
            </button>
            <button
              onClick={() => { setFilter('recharge'); sound.playClick(); }}
              className={`py-1.5 px-3 rounded-lg font-medium whitespace-nowrap transition-colors ${
                filter === 'recharge'
                  ? 'bg-emerald-950/80 text-emerald-300 font-semibold border border-emerald-800/60'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Recharges Only (+💎)
            </button>
            <button
              onClick={() => { setFilter('gift_sent'); sound.playClick(); }}
              className={`py-1.5 px-3 rounded-lg font-medium whitespace-nowrap transition-colors ${
                filter === 'gift_sent'
                  ? 'bg-rose-950/80 text-rose-300 font-semibold border border-rose-800/60'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Gifts Sent (-💎)
            </button>
            <button
              onClick={() => { setFilter('bp_purchase'); sound.playClick(); }}
              className={`py-1.5 px-3 rounded-lg font-medium whitespace-nowrap transition-colors ${
                filter === 'bp_purchase'
                  ? 'bg-amber-950/80 text-amber-300 font-semibold border border-amber-800/60'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              VIP BP Store
            </button>
          </div>
        </div>

        {/* Transactions List */}
        {filteredTransactions.length === 0 ? (
          <div className="py-12 text-center space-y-2">
            <History className="w-10 h-10 text-slate-600 mx-auto" />
            <p className="text-sm font-semibold text-slate-300">No transactions found</p>
            <p className="text-xs text-slate-500">
              There are no records matching your selected filter.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-slate-800/80 border-t border-b border-slate-800/80">
            {filteredTransactions.map((txn) => {
              const isCredit = txn.diamondsDelta > 0;
              const dateObj = new Date(txn.timestamp);
              const formattedDate = dateObj.toLocaleDateString('en-IN', {
                day: 'numeric',
                month: 'short',
                year: 'numeric',
              });
              const formattedTime = dateObj.toLocaleTimeString('en-IN', {
                hour: '2-digit',
                minute: '2-digit',
              });

              return (
                <div
                  key={txn.id}
                  onClick={() => setSelectedTxnReceipt(txn)}
                  className="py-4 flex items-center justify-between gap-4 hover:bg-slate-800/30 transition-colors px-2 rounded-xl cursor-pointer group"
                >
                  {/* Left Icon & Info */}
                  <div className="flex items-center gap-3.5 min-w-0">
                    <div
                      className={`w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 ${
                        txn.type === 'recharge'
                          ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                          : txn.type === 'bp_purchase'
                          ? 'bg-amber-500/15 text-amber-400 border border-amber-500/30'
                          : 'bg-rose-500/15 text-rose-400 border border-rose-500/30'
                      }`}
                    >
                      {txn.type === 'recharge' ? (
                        <ArrowDownRight className="w-5 h-5" />
                      ) : txn.type === 'bp_purchase' ? (
                        <Crown className="w-5 h-5" />
                      ) : (
                        <Gift className="w-5 h-5" />
                      )}
                    </div>

                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="text-xs sm:text-sm font-semibold text-white truncate group-hover:text-amber-300 transition-colors">
                          {txn.description}
                        </p>
                        {txn.rupees && (
                          <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-slate-800 text-slate-300 font-mono">
                            ₹{txn.rupees}
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-2 text-[11px] text-slate-400 mt-0.5">
                        <span className="flex items-center gap-1 font-mono">
                          <Calendar className="w-3 h-3 text-slate-500" />
                          {formattedDate} · {formattedTime}
                        </span>
                        <span className="text-slate-600">·</span>
                        <span className="text-slate-400 font-mono">{txn.id}</span>
                        {txn.paymentMethod && (
                          <>
                            <span className="text-slate-600">·</span>
                            <span className="text-indigo-400">{txn.paymentMethod}</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Right Delta & Status */}
                  <div className="text-right shrink-0">
                    <p
                      className={`text-sm sm:text-base font-bold font-mono tabular-nums ${
                        isCredit ? 'text-emerald-400' : 'text-rose-400'
                      }`}
                    >
                      {isCredit ? `+${txn.diamondsDelta.toLocaleString()}` : `${txn.diamondsDelta.toLocaleString()}`}{' '}
                      💎
                    </p>
                    <span className="text-[10px] text-emerald-400/90 font-medium flex items-center justify-end gap-1">
                      <Check className="w-3 h-3" /> Completed
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* RECEIPT DETAIL MODAL */}
      {selectedTxnReceipt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="relative w-full max-w-md rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl p-6 space-y-4">
            <div className="flex justify-between items-center pb-3 border-b border-slate-800">
              <h3 className="font-bold text-white text-base flex items-center gap-2">
                <Receipt className="w-4 h-4 text-amber-400" /> Transaction Receipt
              </h3>
              <button
                onClick={() => setSelectedTxnReceipt(null)}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 font-mono text-xs">
              <div className="flex justify-between">
                <span className="text-slate-400">Reference ID:</span>
                <span className="text-amber-400 font-bold">{selectedTxnReceipt.id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Date of Recharge:</span>
                <span className="text-white">
                  {new Date(selectedTxnReceipt.timestamp).toLocaleString('en-IN')}
                </span>
              </div>
              {selectedTxnReceipt.paymentMethod && (
                <div className="flex justify-between">
                  <span className="text-slate-400">Payment Channel:</span>
                  <span className="text-indigo-300">{selectedTxnReceipt.paymentMethod}</span>
                </div>
              )}
              {selectedTxnReceipt.rupees && (
                <div className="flex justify-between">
                  <span className="text-slate-400">Amount:</span>
                  <span className="text-white font-bold">₹{selectedTxnReceipt.rupees}</span>
                </div>
              )}
              <div className="flex justify-between items-center pt-2 border-t border-slate-800">
                <span className="text-slate-300 font-sans font-semibold">Diamond Value:</span>
                <span
                  className={`text-base font-bold ${
                    selectedTxnReceipt.diamondsDelta > 0 ? 'text-emerald-400' : 'text-rose-400'
                  }`}
                >
                  {selectedTxnReceipt.diamondsDelta > 0 ? '+' : ''}
                  {selectedTxnReceipt.diamondsDelta.toLocaleString()} 💎
                </span>
              </div>
            </div>

            <button
              onClick={() => setSelectedTxnReceipt(null)}
              className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs"
            >
              Close Receipt
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
