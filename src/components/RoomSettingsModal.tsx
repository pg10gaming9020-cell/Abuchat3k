import React, { useState } from 'react';
import { Room, RoomCategory, UserProfile } from '../types';
import { ROOM_BP_THEMES } from '../data/mockData';
import { X, Lock, Globe, Crown, Check, Settings2, Trash2 } from 'lucide-react';
import { sound } from '../utils/audio';

interface RoomSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  room: Room;
  currentUser: UserProfile;
  onSaveSettings: (updatedRoom: Room) => void;
  onCloseRoom: () => void;
}

export const RoomSettingsModal: React.FC<RoomSettingsModalProps> = ({
  isOpen,
  onClose,
  room,
  currentUser,
  onSaveSettings,
  onCloseRoom,
}) => {
  const [title, setTitle] = useState(room.title);
  const [topic, setTopic] = useState(room.topic);
  const [announcement, setAnnouncement] = useState(room.announcement);
  const [isPrivate, setIsPrivate] = useState(room.isPrivate);
  const [password, setPassword] = useState(room.password || '7777');
  const [selectedBpThemeId, setSelectedBpThemeId] = useState(room.bpThemeId);

  if (!isOpen) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    sound.playClick();

    const updated: Room = {
      ...room,
      title: title.trim(),
      topic: topic.trim(),
      announcement: announcement.trim(),
      isPrivate,
      password: isPrivate ? password : undefined,
      bpThemeId: selectedBpThemeId,
    };

    onSaveSettings(updated);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-lg my-auto rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl overflow-hidden text-slate-100 flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="p-5 pb-4 bg-gradient-to-r from-slate-900 via-indigo-950/60 to-slate-900 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
              <Settings2 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold font-display text-white">
                Room Settings (कमरे की सेटिंग्स)
              </h2>
              <p className="text-[11px] text-slate-400">
                Change room name, topic, privacy & Room BP wallpaper
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

        {/* Form Body */}
        <form onSubmit={handleSave} className="p-5 space-y-4 overflow-y-auto text-xs">
          {/* Room Name */}
          <div>
            <label className="font-semibold text-slate-300 block mb-1">
              Room Title / Name (कमरे का नाम)
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full py-2.5 px-3 rounded-xl bg-slate-800 border border-slate-700 text-white font-medium focus:outline-none focus:border-indigo-500"
            />
          </div>

          {/* Description / Topic */}
          <div>
            <label className="font-semibold text-slate-300 block mb-1">
              Description / Topic (विषय)
            </label>
            <input
              type="text"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              className="w-full py-2.5 px-3 rounded-xl bg-slate-800 border border-slate-700 text-white focus:outline-none focus:border-indigo-500"
            />
          </div>

          {/* Announcement */}
          <div>
            <label className="font-semibold text-slate-300 block mb-1">
              Welcome Announcement (प्रवेश सूचना)
            </label>
            <textarea
              rows={2}
              value={announcement}
              onChange={(e) => setAnnouncement(e.target.value)}
              className="w-full py-2 px-3 rounded-xl bg-slate-800 border border-slate-700 text-white focus:outline-none focus:border-indigo-500"
            />
          </div>

          {/* CHANGE ROOM BP WALLPAPER (BP change karne wala VIP) */}
          <div className="space-y-2 pt-1 border-t border-slate-800">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-amber-300 flex items-center gap-1.5">
                <Crown className="w-3.5 h-3.5 text-amber-400" />
                Change Room BP Wallpaper (कमरे का बीपी बदलें)
              </span>
              <span className="text-[10px] text-slate-400">
                Host VIP {currentUser.vipLevel}
              </span>
            </div>

            <div className="grid grid-cols-3 gap-2">
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
                    className={`relative p-1.5 rounded-xl border text-left overflow-hidden transition-all ${
                      isSelected
                        ? 'border-amber-400 ring-2 ring-amber-400/40 shadow-md bg-amber-500/10'
                        : canUse
                        ? 'border-slate-800 hover:border-slate-700 bg-slate-950/60'
                        : 'border-slate-800/40 opacity-40 cursor-not-allowed bg-slate-950'
                    }`}
                  >
                    <div className="h-12 rounded-lg overflow-hidden relative">
                      <img
                        src={theme.previewUrl}
                        alt={theme.name}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover"
                      />
                      {isSelected && (
                        <div className="absolute top-1 right-1 w-4 h-4 rounded-full bg-amber-500 flex items-center justify-center text-black">
                          <Check className="w-2.5 h-2.5 stroke-[3]" />
                        </div>
                      )}
                      {!canUse && (
                        <div className="absolute inset-0 bg-black/75 flex items-center justify-center text-[9px] font-bold text-amber-400">
                          VIP {theme.minVip}
                        </div>
                      )}
                    </div>
                    <p className="text-[10px] font-semibold text-white mt-1 truncate">
                      {theme.name}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Privacy Toggle */}
          <div className="pt-2 border-t border-slate-800 space-y-2">
            <span className="font-semibold text-slate-300 block">
              Room Privacy Access
            </span>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setIsPrivate(false)}
                className={`py-2 px-3 rounded-xl border flex items-center justify-center gap-1.5 font-medium transition-all ${
                  !isPrivate
                    ? 'bg-emerald-600/20 border-emerald-500 text-emerald-300'
                    : 'bg-slate-950/60 border-slate-800 text-slate-400'
                }`}
              >
                <Globe className="w-3.5 h-3.5" /> Public Room
              </button>
              <button
                type="button"
                onClick={() => setIsPrivate(true)}
                className={`py-2 px-3 rounded-xl border flex items-center justify-center gap-1.5 font-medium transition-all ${
                  isPrivate
                    ? 'bg-rose-600/20 border-rose-500 text-rose-300'
                    : 'bg-slate-950/60 border-slate-800 text-slate-400'
                }`}
              >
                <Lock className="w-3.5 h-3.5" /> Private PIN
              </button>
            </div>

            {isPrivate && (
              <div className="mt-2">
                <label className="text-[11px] text-rose-300 font-medium">
                  Enter 4-Digit Password PIN
                </label>
                <input
                  type="text"
                  maxLength={6}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full mt-1 py-1.5 px-3 rounded-xl bg-slate-800 border border-rose-900 text-white font-mono tracking-widest text-xs"
                />
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="pt-3 border-t border-slate-800 flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={onCloseRoom}
              className="py-2.5 px-3.5 rounded-xl bg-rose-950/50 hover:bg-rose-900/60 text-rose-400 border border-rose-900/60 font-semibold flex items-center gap-1.5 transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" /> End Room
            </button>

            <button
              type="submit"
              className="flex-1 py-2.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold flex items-center justify-center gap-1.5 shadow-md shadow-indigo-600/20 transition-colors"
            >
              <Check className="w-4 h-4" /> Save Settings
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
