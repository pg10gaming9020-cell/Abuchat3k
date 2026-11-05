import React from 'react';
import { Room } from '../types';
import { ROOM_BP_THEMES } from '../data/mockData';
import { Users, Lock, Crown, Mic, Volume2 } from 'lucide-react';
import { sound } from '../utils/audio';

interface RoomCardProps {
  room: Room;
  onJoin: (room: Room) => void;
}

export const RoomCard: React.FC<RoomCardProps> = ({ room, onJoin }) => {
  const bpTheme =
    ROOM_BP_THEMES.find((t) => t.id === room.bpThemeId) || ROOM_BP_THEMES[0];

  const occupiedSeatsCount = room.seats.filter((s) => s.user).length;

  return (
    <div
      onClick={() => {
        sound.playClick();
        onJoin(room);
      }}
      className="group relative rounded-3xl bg-slate-900 border border-slate-800 hover:border-slate-700 overflow-hidden shadow-xl hover:shadow-2xl hover:shadow-indigo-500/10 transition-all duration-300 cursor-pointer flex flex-col justify-between"
    >
      {/* Top Banner / Theme Background */}
      <div className="relative h-28 overflow-hidden">
        <img
          src={bpTheme.previewUrl}
          alt={room.title}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent" />

        {/* Listeners & Privacy Pill */}
        <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between">
          <span className="px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md text-emerald-400 font-mono text-[11px] font-bold flex items-center gap-1.5 border border-white/10">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <Users className="w-3 h-3 text-emerald-400" />
            {room.listenersCount}
          </span>

          <div className="flex items-center gap-1.5">
            {room.isPrivate && (
              <span className="p-1 rounded-full bg-rose-500/80 text-white shadow">
                <Lock className="w-3 h-3" />
              </span>
            )}
            <span className="px-2 py-0.5 rounded-full bg-indigo-950/80 border border-indigo-500/30 text-indigo-300 text-[10px] font-semibold capitalize">
              {room.category}
            </span>
          </div>
        </div>

        {/* Host Avatar Overlap */}
        <div className="absolute -bottom-3 left-4 flex items-end gap-2.5">
          <div className="relative">
            <img
              src={room.hostAvatar}
              alt={room.hostName}
              referrerPolicy="no-referrer"
              className="w-12 h-12 rounded-full object-cover ring-2 ring-amber-400 shadow-md"
            />
            <div className="absolute -bottom-1 -right-1 px-1.5 py-0.2 rounded-full bg-gradient-to-r from-amber-500 to-yellow-400 text-black font-extrabold text-[9px] flex items-center gap-0.5">
              <Crown className="w-2.5 h-2.5 fill-black" />
              V{room.hostVip}
            </div>
          </div>
          <span className="text-xs font-semibold text-slate-300 truncate max-w-[120px] pb-1">
            {room.hostName}
          </span>
        </div>
      </div>

      {/* Content Body */}
      <div className="p-4 pt-5 space-y-3">
        <div>
          <h3 className="font-bold font-display text-white text-sm line-clamp-1 group-hover:text-amber-300 transition-colors">
            {room.title}
          </h3>
          <p className="text-xs text-slate-400 line-clamp-1 mt-0.5">
            {room.topic}
          </p>
        </div>

        {/* Mic Slots Preview & Action */}
        <div className="flex items-center justify-between pt-2 border-t border-slate-800/80 text-xs">
          <div className="flex items-center gap-1 text-slate-400">
            <Mic className="w-3.5 h-3.5 text-amber-400" />
            <span className="font-mono text-[11px]">
              {occupiedSeatsCount}/{room.seatsCount} Mics
            </span>
          </div>

          <span className="py-1 px-3 rounded-xl bg-slate-800 group-hover:bg-indigo-600 text-slate-300 group-hover:text-white font-semibold text-[11px] transition-colors">
            Join Party →
          </span>
        </div>
      </div>
    </div>
  );
};
