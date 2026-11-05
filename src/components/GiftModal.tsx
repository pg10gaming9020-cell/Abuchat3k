import React, { useState } from 'react';
import { GiftItem, MicSeat, Room, UserProfile } from '../types';
import { GIFTS_CATALOG } from '../data/mockData';
import { X, Sparkles, Send, Plus, Diamond, Crown } from 'lucide-react';
import { sound } from '../utils/audio';

interface GiftModalProps {
  isOpen: boolean;
  onClose: () => void;
  room: Room;
  currentUser: UserProfile;
  onSendGift: (gift: GiftItem, count: number, receiverId: string, receiverName: string) => void;
  onOpenRecharge: () => void;
}

const MULTIPLIERS = [1, 5, 10, 66, 99, 520];

export const GiftModal: React.FC<GiftModalProps> = ({
  isOpen,
  onClose,
  room,
  currentUser,
  onSendGift,
  onOpenRecharge,
}) => {
  const [selectedGift, setSelectedGift] = useState<GiftItem>(GIFTS_CATALOG[0]);
  const [multiplier, setMultiplier] = useState<number>(1);
  const [selectedReceiverId, setSelectedReceiverId] = useState<string>(room.hostId);

  if (!isOpen) return null;

  // Active users on mic seats who can receive gifts
  const seatedUsers = room.seats
    .filter((s) => s.user)
    .map((s) => s.user!);

  const receiverUser =
    seatedUsers.find((u) => u.id === selectedReceiverId) || {
      id: room.hostId,
      name: room.hostName,
      avatar: room.hostAvatar,
      vipLevel: room.hostVip,
    };

  const totalDiamondsCost = selectedGift.diamonds * multiplier;
  const hasEnoughDiamonds = currentUser.diamonds >= totalDiamondsCost;

  const handleSend = () => {
    if (!hasEnoughDiamonds) {
      onOpenRecharge();
      return;
    }
    sound.playGiftSent(selectedGift.soundType);
    onSendGift(selectedGift, multiplier, receiverUser.id, receiverUser.name);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/75 backdrop-blur-sm">
      <div className="relative w-full max-w-lg rounded-t-3xl sm:rounded-3xl bg-slate-900 border-t sm:border border-slate-800 shadow-2xl overflow-hidden text-slate-100 flex flex-col max-h-[85vh]">
        
        {/* Header */}
        <div className="p-4 pb-3 bg-slate-950/80 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xl">🎁</span>
            <div>
              <h3 className="font-bold font-display text-white text-sm">
                Send Gift (उपहार भेजें)
              </h3>
              <p className="text-[10px] text-slate-400">
                Support your favorite host & speaker on mic
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1 rounded-full text-slate-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Recipient Selector */}
        <div className="px-4 py-2.5 bg-slate-950/40 border-b border-slate-800/80 flex items-center gap-2 overflow-x-auto text-xs">
          <span className="text-slate-400 text-[11px] font-medium shrink-0">Send To:</span>
          {seatedUsers.map((user) => {
            const isSelected = selectedReceiverId === user.id;
            return (
              <button
                key={user.id}
                onClick={() => {
                  setSelectedReceiverId(user.id);
                  sound.playClick();
                }}
                className={`flex items-center gap-1.5 py-1 px-2.5 rounded-full border shrink-0 transition-all ${
                  isSelected
                    ? 'bg-amber-500/20 border-amber-500 text-amber-300 font-semibold'
                    : 'bg-slate-800/60 border-slate-700 text-slate-300 hover:text-white'
                }`}
              >
                <img
                  src={user.avatar}
                  alt={user.name}
                  referrerPolicy="no-referrer"
                  className="w-4 h-4 rounded-full object-cover"
                />
                <span className="truncate max-w-[80px]">{user.name}</span>
                {user.id === room.hostId && (
                  <Crown className="w-3 h-3 text-amber-400 fill-amber-400" />
                )}
              </button>
            );
          })}
        </div>

        {/* Gift Grid */}
        <div className="p-4 grid grid-cols-4 gap-2.5 overflow-y-auto max-h-60 sm:max-h-72">
          {GIFTS_CATALOG.map((gift) => {
            const isSelected = selectedGift.id === gift.id;
            return (
              <button
                key={gift.id}
                onClick={() => {
                  setSelectedGift(gift);
                  sound.playClick();
                }}
                className={`p-2.5 rounded-2xl border text-center flex flex-col items-center justify-between transition-all ${
                  isSelected
                    ? 'bg-amber-500/15 border-amber-400 ring-2 ring-amber-400/40 shadow-lg shadow-amber-500/10'
                    : 'bg-slate-950/50 border-slate-800 hover:border-slate-700 hover:bg-slate-800/30'
                }`}
              >
                <span className="text-3xl transform transition-transform hover:scale-110 duration-200">
                  {gift.icon}
                </span>
                <p className="text-[11px] font-semibold text-white mt-1 truncate w-full">
                  {gift.name}
                </p>
                <span className="text-[10px] text-amber-400 font-bold font-mono flex items-center gap-0.5 mt-0.5">
                  💎 {gift.diamonds}
                </span>
              </button>
            );
          })}
        </div>

        {/* Multiplier & Footer Bar */}
        <div className="p-4 bg-slate-950 border-t border-slate-800 space-y-3">
          {/* Multipliers */}
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-400 font-medium">Count:</span>
            <div className="flex items-center gap-1.5 overflow-x-auto">
              {MULTIPLIERS.map((num) => (
                <button
                  key={num}
                  onClick={() => {
                    setMultiplier(num);
                    sound.playClick();
                  }}
                  className={`py-1 px-2.5 rounded-lg font-mono font-bold text-xs transition-colors ${
                    multiplier === num
                      ? 'bg-indigo-600 text-white'
                      : 'bg-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  x{num}
                </button>
              ))}
            </div>
          </div>

          {/* Action Row */}
          <div className="flex items-center justify-between gap-3 pt-1">
            {/* Balance + Recharge Shortcut */}
            <div className="flex items-center gap-2">
              <div className="text-left">
                <p className="text-[10px] text-slate-400">Your Diamonds</p>
                <p className="text-sm font-bold font-mono text-amber-300 flex items-center gap-1">
                  💎 {currentUser.diamonds.toLocaleString()}
                </p>
              </div>

              <button
                onClick={() => {
                  sound.playClick();
                  onOpenRecharge();
                }}
                className="py-1 px-2 rounded-lg bg-amber-500/20 text-amber-400 border border-amber-500/30 text-[10px] font-bold flex items-center gap-0.5 hover:bg-amber-500/30 transition-colors"
              >
                <Plus className="w-3 h-3" /> Top Up
              </button>
            </div>

            {/* Send Button */}
            <button
              onClick={handleSend}
              className={`py-2.5 px-5 rounded-2xl font-bold text-xs flex items-center gap-2 shadow-lg transition-all active:scale-[0.98] ${
                hasEnoughDiamonds
                  ? 'bg-gradient-to-r from-amber-500 to-rose-500 hover:opacity-95 text-white shadow-amber-500/20'
                  : 'bg-indigo-600 hover:bg-indigo-500 text-white'
              }`}
            >
              {hasEnoughDiamonds ? (
                <>
                  <Send className="w-3.5 h-3.5" />
                  Send ({totalDiamondsCost.toLocaleString()} 💎)
                </>
              ) : (
                <>
                  <Plus className="w-3.5 h-3.5" />
                  Recharge Diamonds
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
