import React, { useState } from 'react';
import { Room, RoomCategory, UserProfile } from '../types';
import { ROOM_BP_THEMES } from '../data/mockData';
import { X, Lock, Globe, Sparkles, Crown, ArrowRight, Mic, Hash } from 'lucide-react';
import { sound } from '../utils/audio';

interface CreateRoomModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: UserProfile;
  onCreateRoom: (room: Room) => void;
}

const CATEGORY_OPTIONS: { id: RoomCategory; label: string; icon: string }[] = [
  { id: 'party', label: 'Party & Fun (पार्टी)', icon: '🎉' },
  { id: 'voice', label: 'Voice Chat (बातचीत)', icon: '🎙️' },
  { id: 'music', label: 'Music & Singing (गाना)', icon: '🎵' },
  { id: 'gaming', label: 'Gaming Squad (गेमिंग)', icon: '🎮' },
  { id: 'dating', label: 'Dil Ki Baatein (दोस्ती)', icon: '💫' },
  { id: 'vip', label: 'VIP Lounge (वीआईपी)', icon: '👑' },
];

export const CreateRoomModal: React.FC<CreateRoomModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onCreateRoom,
}) => {
  const [title, setTitle] = useState(`${currentUser.name}'s Party Lounge`);
  const [topic, setTopic] = useState('Voice chatting, fun shayri and diamond showers 💎');
  const [announcement, setAnnouncement] = useState('Welcome to my room! Respect everyone and enjoy the music 🌹');
  const [category, setCategory] = useState<RoomCategory>('party');
  const [seatsCount, setSeatsCount] = useState<number>(8);
  const [isPrivate, setIsPrivate] = useState<boolean>(false);
  const [password, setPassword] = useState<string>('7777');
  const [selectedBpThemeId, setSelectedBpThemeId] = useState<string>('theme_galaxy');

  if (!isOpen) return null;

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    sound.playClick();
    const newRoomId = `${Math.floor(10000 + Math.random() * 90000)}`;

    const newSeats = Array.from({ length: seatsCount }).map((_, idx) => {
      if (idx === 0) {
        // Host takes seat 0
        return {
          seatIndex: 0,
          user: {
            id: currentUser.id,
            name: currentUser.name,
            avatar: currentUser.avatar,
            vipLevel: currentUser.vipLevel,
            activeFrame: currentUser.activeFrame,
            activeMicRing: currentUser.activeMicRing,
            isSpeaking: false,
            isMuted: false,
            receivedGiftsCount: 0,
          },
        };
      }
      return { seatIndex: idx };
    });

    const newRoom: Room = {
      id: newRoomId,
      title: title.trim(),
      topic: topic.trim(),
      category,
      bpThemeId: selectedBpThemeId,
      hostId: currentUser.id,
      hostName: currentUser.name,
      hostAvatar: currentUser.avatar,
      hostVip: currentUser.vipLevel,
      listenersCount: 1,
      isPrivate,
      password: isPrivate ? password : undefined,
      seatsCount,
      seats: newSeats,
      announcement: announcement.trim(),
      createdAt: Date.now(),
    };

    onCreateRoom(newRoom);
    sound.playRechargeSuccess();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-xl my-auto rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl overflow-hidden text-slate-100 flex flex-col max-h-[92vh]">
        
        {/* Header */}
        <div className="p-5 sm:p-6 pb-4 bg-gradient-to-r from-slate-900 via-indigo-950/70 to-slate-900 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-rose-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-rose-500/20 text-2xl">
              🎙️
            </div>
            <div>
              <h2 className="text-lg font-bold font-display text-white flex items-center gap-2">
                Create Voice Room (कमरा बनाएं)
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                  Host Stage
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                Setup your live voice party, choose seats, and customize Room BP
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleCreate} className="p-5 sm:p-6 space-y-5 overflow-y-auto">
          {/* Room Title */}
          <div>
            <label className="text-xs font-semibold text-slate-300">
              Room Name / Title (कमरे का नाम)
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. 🎵 Bollywood Singing & Masti"
              className="w-full mt-1.5 py-2.5 px-3.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-sm focus:outline-none focus:border-indigo-500"
            />
          </div>

          {/* Room Description / Topic */}
          <div>
            <label className="text-xs font-semibold text-slate-300">
              Description / Topic (विषय)
            </label>
            <input
              type="text"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="What will you talk or sing about?"
              className="w-full mt-1.5 py-2.5 px-3.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs focus:outline-none focus:border-indigo-500"
            />
          </div>

          {/* Category Selector */}
          <div>
            <label className="text-xs font-semibold text-slate-300 mb-1.5 block">
              Room Category (श्रेणी)
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {CATEGORY_OPTIONS.map((cat) => (
                <button
                  type="button"
                  key={cat.id}
                  onClick={() => {
                    setCategory(cat.id);
                    sound.playClick();
                  }}
                  className={`py-2 px-3 rounded-xl border text-xs font-medium flex items-center gap-2 transition-all ${
                    category === cat.id
                      ? 'bg-indigo-600/20 border-indigo-500 text-white ring-1 ring-indigo-500 shadow-sm'
                      : 'bg-slate-950/50 border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800/40'
                  }`}
                >
                  <span className="text-base">{cat.icon}</span>
                  <span className="truncate">{cat.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Seat Count & Privacy */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-slate-300 mb-1.5 block">
                Mic Seats Count (माइक सीटें)
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[4, 8, 12].map((cnt) => (
                  <button
                    type="button"
                    key={cnt}
                    onClick={() => {
                      setSeatsCount(cnt);
                      sound.playClick();
                    }}
                    className={`py-2 px-2 rounded-xl border text-xs font-bold font-mono text-center transition-all ${
                      seatsCount === cnt
                        ? 'bg-amber-500/20 border-amber-500 text-amber-300 ring-1 ring-amber-500'
                        : 'bg-slate-950/50 border-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    {cnt} Seats
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 mb-1.5 block">
                Room Privacy (गोपनीयता)
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setIsPrivate(false);
                    sound.playClick();
                  }}
                  className={`py-2 px-2.5 rounded-xl border text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
                    !isPrivate
                      ? 'bg-emerald-600/20 border-emerald-500 text-emerald-300 ring-1 ring-emerald-500'
                      : 'bg-slate-950/50 border-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  <Globe className="w-3.5 h-3.5" /> Public Room
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setIsPrivate(true);
                    sound.playClick();
                  }}
                  className={`py-2 px-2.5 rounded-xl border text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
                    isPrivate
                      ? 'bg-rose-600/20 border-rose-500 text-rose-300 ring-1 ring-rose-500'
                      : 'bg-slate-950/50 border-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  <Lock className="w-3.5 h-3.5" /> Private PIN
                </button>
              </div>
            </div>
          </div>

          {/* Password Input if Private */}
          {isPrivate && (
            <div className="p-3.5 rounded-2xl bg-rose-950/20 border border-rose-900/40 space-y-1.5">
              <label className="text-xs font-semibold text-rose-300 flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5" /> 4-Digit Room PIN Password
              </label>
              <input
                type="text"
                maxLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="e.g. 7777"
                className="w-full py-2 px-3 rounded-xl bg-slate-900 border border-rose-900/60 text-white font-mono tracking-widest text-sm focus:outline-none focus:border-rose-500"
              />
              <p className="text-[11px] text-slate-400">
                Only friends with this PIN can enter your private party.
              </p>
            </div>
          )}

          {/* Choose Room BP (Background Theme Wallpaper) */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-slate-300 flex items-center gap-1.5">
                <Crown className="w-3.5 h-3.5 text-amber-400" />
                Select Room BP Wallpaper (कमरे का बीपी चुनें)
              </span>
              <span className="text-[11px] text-amber-400 font-medium">
                VIP BP Change Privileges
              </span>
            </div>

            <div className="grid grid-cols-3 gap-2.5">
              {ROOM_BP_THEMES.map((theme) => {
                const isSelected = selectedBpThemeId === theme.id;
                const canUse = currentUser.vipLevel >= theme.minVip;
                return (
                  <button
                    type="button"
                    key={theme.id}
                    disabled={!canUse}
                    onClick={() => {
                      setSelectedBpThemeId(theme.id);
                      sound.playClick();
                    }}
                    className={`relative p-2 rounded-2xl border text-left overflow-hidden transition-all ${
                      isSelected
                        ? 'border-amber-400 ring-2 ring-amber-400/40 shadow-lg shadow-amber-500/20'
                        : canUse
                        ? 'border-slate-800 hover:border-slate-700 bg-slate-950/40'
                        : 'border-slate-800/50 opacity-40 cursor-not-allowed bg-slate-950/80'
                    }`}
                  >
                    <div className="h-14 rounded-xl overflow-hidden relative">
                      <img
                        src={theme.previewUrl}
                        alt={theme.name}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover"
                      />
                      {!canUse && (
                        <div className="absolute inset-0 bg-black/70 flex items-center justify-center text-[10px] font-bold text-amber-400 flex items-center gap-1">
                          <Lock className="w-3 h-3" /> VIP {theme.minVip}
                        </div>
                      )}
                    </div>
                    <p className="text-[11px] font-semibold text-white mt-1.5 truncate">
                      {theme.name}
                    </p>
                    <span className="text-[9px] text-slate-400 block">{theme.tag}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Welcome Announcement */}
          <div>
            <label className="text-xs font-semibold text-slate-300">
              Welcome Announcement (प्रवेश सूचना)
            </label>
            <textarea
              rows={2}
              value={announcement}
              onChange={(e) => setAnnouncement(e.target.value)}
              className="w-full mt-1.5 py-2 px-3 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs focus:outline-none focus:border-indigo-500"
            />
          </div>

          {/* Submit CTA */}
          <div className="pt-2">
            <button
              type="submit"
              className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-amber-500 via-rose-500 to-indigo-600 hover:opacity-95 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-xl shadow-rose-500/20 active:scale-[0.98] transition-all"
            >
              <Mic className="w-4 h-4" />
              कमरा बनाएं & स्टेज संभालें (Launch Room Now)
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
