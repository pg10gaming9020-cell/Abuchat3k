import React, { useState } from 'react';
import { Room } from '../types';
import { X, Copy, Check, UserPlus, Share2, MessageCircle, Lock, ShieldCheck } from 'lucide-react';
import { sound } from '../utils/audio';

interface InviteFriendsModalProps {
  isOpen: boolean;
  onClose: () => void;
  room: Room;
}

interface MockFriend {
  id: string;
  name: string;
  avatar: string;
  status: 'online' | 'in_party' | 'offline';
  vipLevel: number;
}

const MOCK_ONLINE_FRIENDS: MockFriend[] = [
  {
    id: 'f_1',
    name: 'Aman_Dholi',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
    status: 'online',
    vipLevel: 3,
  },
  {
    id: 'f_2',
    name: 'Neha_Singer',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80',
    status: 'online',
    vipLevel: 4,
  },
  {
    id: 'f_3',
    name: 'Kabir_Gaming',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80',
    status: 'online',
    vipLevel: 2,
  },
  {
    id: 'f_4',
    name: 'Zoya_Star',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
    status: 'in_party',
    vipLevel: 5,
  },
];

export const InviteFriendsModal: React.FC<InviteFriendsModalProps> = ({
  isOpen,
  onClose,
  room,
}) => {
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedPin, setCopiedPin] = useState(false);
  const [invitedIds, setInvitedIds] = useState<string[]>([]);

  if (!isOpen) return null;

  const inviteUrl = `${window.location.origin}?room=${room.id}${room.isPrivate && room.password ? `&pin=${room.password}` : ''}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(inviteUrl);
    sound.playClick();
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleCopyPin = () => {
    if (!room.password) return;
    navigator.clipboard.writeText(room.password);
    sound.playClick();
    setCopiedPin(true);
    setTimeout(() => setCopiedPin(false), 2000);
  };

  const handleInviteFriend = (friendId: string) => {
    sound.playClick();
    setInvitedIds((prev) => [...prev, friendId]);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md">
      <div className="relative w-full max-w-md rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl overflow-hidden text-slate-100 flex flex-col">
        
        {/* Header */}
        <div className="p-5 pb-4 bg-gradient-to-r from-slate-900 via-indigo-950/70 to-slate-900 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-rose-500/20 border border-rose-500/30 flex items-center justify-center text-rose-400">
              <UserPlus className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold font-display text-white">
                Invite Friends (दोस्तों को बुलाएं)
              </h2>
              <p className="text-[11px] text-slate-400">
                Share private room invite or send direct party ping
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-5 space-y-4">
          {/* Room Card Preview */}
          <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 space-y-2 text-xs">
            <div className="flex justify-between items-center">
              <span className="font-semibold text-white truncate max-w-[200px]">
                {room.title}
              </span>
              <span className="font-mono text-amber-400 font-bold">
                ID: {room.id}
              </span>
            </div>

            {room.isPrivate && (
              <div className="flex items-center justify-between p-2 rounded-xl bg-rose-950/30 border border-rose-900/50 text-rose-300">
                <span className="flex items-center gap-1.5 font-medium">
                  <Lock className="w-3.5 h-3.5" /> Room PIN: <strong className="font-mono tracking-widest text-white">{room.password}</strong>
                </span>
                <button
                  onClick={handleCopyPin}
                  className="py-1 px-2.5 rounded-lg bg-rose-900/50 hover:bg-rose-800 text-white text-[11px] font-semibold flex items-center gap-1"
                >
                  {copiedPin ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  Copy PIN
                </button>
              </div>
            )}

            {/* Quick Share Link */}
            <div className="flex items-center gap-2 pt-1">
              <input
                readOnly
                type="text"
                value={inviteUrl}
                className="flex-1 py-1.5 px-3 rounded-xl bg-slate-900 border border-slate-800 text-[11px] text-slate-400 font-mono truncate"
              />
              <button
                onClick={handleCopyLink}
                className="py-1.5 px-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs flex items-center gap-1 transition-colors shrink-0"
              >
                {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                {copiedLink ? 'Copied' : 'Copy'}
              </button>
            </div>
          </div>

          {/* Online Friends List */}
          <div>
            <div className="flex items-center justify-between text-xs mb-2">
              <span className="font-semibold text-slate-300">
                Online Friends (ऑनलाइन दोस्त)
              </span>
              <span className="text-[11px] text-emerald-400 font-medium">
                4 Active Now
              </span>
            </div>

            <div className="space-y-2 max-h-48 overflow-y-auto">
              {MOCK_ONLINE_FRIENDS.map((friend) => {
                const isInvited = invitedIds.includes(friend.id);
                return (
                  <div
                    key={friend.id}
                    className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800/80 flex items-center justify-between gap-3 text-xs"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="relative">
                        <img
                          src={friend.avatar}
                          alt={friend.name}
                          referrerPolicy="no-referrer"
                          className="w-9 h-9 rounded-full object-cover"
                        />
                        <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 border-2 border-slate-900" />
                      </div>
                      <div>
                        <p className="font-semibold text-white">{friend.name}</p>
                        <span className="text-[10px] text-amber-400 font-medium">
                          VIP {friend.vipLevel}
                        </span>
                      </div>
                    </div>

                    <button
                      onClick={() => handleInviteFriend(friend.id)}
                      disabled={isInvited}
                      className={`py-1 px-3 rounded-lg text-xs font-semibold flex items-center gap-1 transition-all ${
                        isInvited
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                          : 'bg-indigo-600 hover:bg-indigo-500 text-white'
                      }`}
                    >
                      {isInvited ? (
                        <>
                          <Check className="w-3 h-3 text-emerald-400" /> Invited
                        </>
                      ) : (
                        'Invite'
                      )}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Social Share Shortcuts */}
          <div className="pt-2 border-t border-slate-800 flex items-center justify-between gap-2 text-xs">
            <button
              onClick={() => {
                sound.playClick();
                window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(`Join my private AbuChat live room! ${inviteUrl}`)}`, '_blank');
              }}
              className="flex-1 py-2 px-3 rounded-xl bg-emerald-950/60 hover:bg-emerald-900/60 border border-emerald-800/60 text-emerald-300 font-semibold flex items-center justify-center gap-1.5 transition-colors"
            >
              <MessageCircle className="w-4 h-4 text-emerald-400" /> WhatsApp
            </button>
            <button
              onClick={handleCopyLink}
              className="flex-1 py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold flex items-center justify-center gap-1.5 transition-colors"
            >
              <Share2 className="w-4 h-4 text-indigo-400" /> Copy Share Text
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
