import React, { useState, useEffect, useRef } from 'react';
import { GiftItem, MicSeat, Room, RoomMessage, UserProfile } from '../types';
import { ROOM_BP_THEMES } from '../data/mockData';
import {
  Mic,
  MicOff,
  Volume2,
  Users,
  Settings,
  Share2,
  Lock,
  ArrowLeft,
  Send,
  Sparkles,
  Gift,
  Crown,
  Dices,
  Smile,
  Copy,
  Check,
  Radio,
} from 'lucide-react';
import { sound } from '../utils/audio';

interface LiveRoomViewProps {
  room: Room;
  currentUser: UserProfile;
  onLeaveRoom: () => void;
  onOpenSettings: () => void;
  onOpenInvite: () => void;
  onOpenGift: () => void;
  onOpenRecharge: () => void;
  onUpdateRoom: (updated: Room) => void;
  onSendRoomMessage: (text: string) => void;
}

export const LiveRoomView: React.FC<LiveRoomViewProps> = ({
  room,
  currentUser,
  onLeaveRoom,
  onOpenSettings,
  onOpenInvite,
  onOpenGift,
  onOpenRecharge,
  onUpdateRoom,
  onSendRoomMessage,
}) => {
  const [inputText, setInputText] = useState('');
  const [isMyMicMuted, setIsMyMicMuted] = useState(false);
  const [isSpeakingSim, setIsSpeakingSim] = useState(false);
  const [showGame, setShowGame] = useState(false);
  const [diceRolling, setDiceRolling] = useState(false);
  const [diceResult, setDiceResult] = useState<number | null>(null);
  const [copiedId, setCopiedId] = useState(false);

  // Chat message container scroll ref
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Active BP Theme
  const bpTheme =
    ROOM_BP_THEMES.find((t) => t.id === room.bpThemeId) || ROOM_BP_THEMES[0];

  // Check if current user is seated
  const mySeat = room.seats.find((s) => s.user?.id === currentUser.id);
  const isHost = room.hostId === currentUser.id;

  // Auto-scroll chat
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  // Periodic voice simulation & live chat simulation
  useEffect(() => {
    const interval = setInterval(() => {
      // Simulate random speaker talking wave
      onUpdateRoom({
        ...room,
        seats: room.seats.map((s) => {
          if (s.user && !s.user.isMuted) {
            return {
              ...s,
              user: {
                ...s.user,
                isSpeaking: Math.random() > 0.4,
              },
            };
          }
          return s;
        }),
      });
    }, 2400);

    return () => clearInterval(interval);
  }, [room, onUpdateRoom]);

  const handleCopyRoomId = () => {
    navigator.clipboard.writeText(room.id);
    sound.playClick();
    setCopiedId(true);
    setTimeout(() => setCopiedId(false), 2000);
  };

  const handleTakeSeat = (seatIndex: number) => {
    sound.playClick();
    const updatedSeats = [...room.seats];
    
    // Remove from previous seat if any
    updatedSeats.forEach((s) => {
      if (s.user?.id === currentUser.id) {
        delete s.user;
      }
    });

    updatedSeats[seatIndex] = {
      seatIndex,
      user: {
        id: currentUser.id,
        name: currentUser.name,
        avatar: currentUser.avatar,
        vipLevel: currentUser.vipLevel,
        activeFrame: currentUser.activeFrame,
        activeMicRing: currentUser.activeMicRing,
        isSpeaking: true,
        isMuted: isMyMicMuted,
        receivedGiftsCount: 0,
      },
    };

    onUpdateRoom({ ...room, seats: updatedSeats });
  };

  const handleLeaveSeat = () => {
    sound.playClick();
    const updatedSeats = room.seats.map((s) => {
      if (s.user?.id === currentUser.id) {
        return { seatIndex: s.seatIndex };
      }
      return s;
    });
    onUpdateRoom({ ...room, seats: updatedSeats });
  };

  const handleToggleMyMic = () => {
    sound.playClick();
    const nextMuted = !isMyMicMuted;
    setIsMyMicMuted(nextMuted);

    if (mySeat) {
      const updatedSeats = room.seats.map((s) => {
        if (s.user?.id === currentUser.id) {
          return {
            ...s,
            user: { ...s.user!, isMuted: nextMuted, isSpeaking: !nextMuted },
          };
        }
        return s;
      });
      onUpdateRoom({ ...room, seats: updatedSeats });
    }
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    sound.playClick();
    onSendRoomMessage(inputText.trim());
    setInputText('');
  };

  // Lucky 777 Dice mini game
  const handleRollDice = () => {
    if (currentUser.diamonds < 20) {
      onOpenRecharge();
      return;
    }
    sound.playClick();
    setDiceRolling(true);

    setTimeout(() => {
      setDiceRolling(false);
      const roll = Math.floor(1 + Math.random() * 6);
      setDiceResult(roll);
      if (roll === 6 || roll === 7) {
        sound.playRechargeSuccess();
      }
    }, 800);
  };

  return (
    <div className={`relative min-h-[90vh] rounded-3xl overflow-hidden border border-slate-800 shadow-2xl flex flex-col bg-gradient-to-b ${bpTheme.bgGradient}`}>
      {/* Background Wallpaper Image Overlay */}
      <div className="absolute inset-0 opacity-20 pointer-events-none mix-blend-overlay">
        <img
          src={bpTheme.previewUrl}
          alt={bpTheme.name}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover"
        />
      </div>

      {/* TOP ROOM NAV BAR */}
      <div className="relative z-10 p-3 sm:p-4 bg-slate-950/60 backdrop-blur-md border-b border-slate-800/80 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2.5 min-w-0">
          <button
            onClick={onLeaveRoom}
            className="p-2 rounded-xl bg-slate-900/80 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 transition-colors shrink-0"
            title="Leave Room"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>

          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <h2 className="text-xs sm:text-sm font-bold font-display text-white truncate max-w-[160px] sm:max-w-xs">
                {room.title}
              </h2>
              {room.isPrivate && (
                <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-rose-500/20 text-rose-300 border border-rose-500/30 flex items-center gap-0.5 shrink-0">
                  <Lock className="w-2.5 h-2.5" /> PIN
                </span>
              )}
            </div>

            <div className="flex items-center gap-2 text-[10px] text-slate-400 mt-0.5">
              <span className="font-mono text-amber-400 font-semibold flex items-center gap-1">
                ID: {room.id}
                <button onClick={handleCopyRoomId} className="hover:text-white">
                  {copiedId ? <Check className="w-2.5 h-2.5 text-emerald-400" /> : <Copy className="w-2.5 h-2.5" />}
                </button>
              </span>
              <span className="text-slate-600">·</span>
              <span className="flex items-center gap-1 text-slate-300">
                <Users className="w-3 h-3 text-emerald-400" /> {room.listenersCount} Listeners
              </span>
              <span className="text-slate-600">·</span>
              <span className="text-indigo-300 font-medium truncate max-w-[90px]">{bpTheme.name}</span>
            </div>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-1.5 shrink-0">
          <button
            onClick={onOpenInvite}
            className="p-2 sm:px-3 sm:py-1.5 rounded-xl bg-indigo-600/30 hover:bg-indigo-600/50 text-indigo-300 border border-indigo-500/30 text-xs font-semibold flex items-center gap-1.5 transition-colors"
            title="Invite Friends"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Invite</span>
          </button>

          {isHost && (
            <button
              onClick={onOpenSettings}
              className="p-2 sm:px-3 sm:py-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold flex items-center gap-1.5 transition-colors"
              title="Room Settings & Change BP"
            >
              <Settings className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Settings</span>
            </button>
          )}
        </div>
      </div>

      {/* ANNOUNCEMENT BANNER */}
      {room.announcement && (
        <div className="relative z-10 px-4 py-1.5 bg-amber-500/10 border-b border-amber-500/20 text-[11px] text-amber-200 flex items-center justify-between">
          <div className="flex items-center gap-1.5 truncate">
            <span className="font-bold text-amber-400">Notice:</span>
            <span className="truncate">{room.announcement}</span>
          </div>
          <span className="text-[10px] text-amber-400/70 font-mono shrink-0 ml-2">Host Announcement</span>
        </div>
      )}

      {/* STAGE & MIC SEATS GRID */}
      <div className="relative z-10 p-4 sm:p-6">
        <div
          className={`grid gap-3 sm:gap-4 max-w-2xl mx-auto ${
            room.seatsCount <= 4
              ? 'grid-cols-2 sm:grid-cols-4'
              : room.seatsCount <= 8
              ? 'grid-cols-4'
              : 'grid-cols-4 sm:grid-cols-6'
          }`}
        >
          {room.seats.map((seat, idx) => {
            const user = seat.user;
            const isHostSeat = idx === 0;
            const isMe = user?.id === currentUser.id;

            return (
              <div
                key={idx}
                className="flex flex-col items-center justify-center p-2 rounded-2xl bg-slate-950/40 backdrop-blur-sm border border-slate-800/60 relative group"
              >
                {/* Host Crown Indicator */}
                {isHostSeat && (
                  <div className="absolute -top-3 px-2 py-0.2 rounded-full bg-gradient-to-r from-amber-500 to-yellow-400 text-black font-extrabold text-[9px] shadow-md flex items-center gap-0.5 z-10">
                    <Crown className="w-2.5 h-2.5 fill-black" /> HOST
                  </div>
                )}

                {user ? (
                  // OCCUPIED SEAT
                  <div className="flex flex-col items-center relative">
                    <div className="relative">
                      {/* Talking Wave Rings */}
                      {user.isSpeaking && (
                        <div className="absolute inset-0 rounded-full bg-amber-400/30 animate-ping pointer-events-none" />
                      )}

                      <div
                        className={`w-14 h-14 sm:w-16 sm:h-16 rounded-full p-0.5 relative transition-transform ${
                          user.isSpeaking
                            ? 'ring-2 ring-amber-400 shadow-[0_0_15px_rgba(251,191,36,0.5)] scale-105'
                            : 'ring-1 ring-slate-700'
                        }`}
                      >
                        <img
                          src={user.avatar}
                          alt={user.name}
                          referrerPolicy="no-referrer"
                          className="w-full h-full rounded-full object-cover"
                        />

                        {/* Mute status badge */}
                        {user.isMuted && (
                          <div className="absolute bottom-0 right-0 w-4 h-4 rounded-full bg-rose-600 flex items-center justify-center text-white shadow">
                            <MicOff className="w-2.5 h-2.5" />
                          </div>
                        )}
                      </div>
                    </div>

                    <p className="text-[11px] font-semibold text-white mt-1.5 truncate max-w-[70px] text-center">
                      {isMe ? 'You' : user.name}
                    </p>

                    <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-indigo-500/20 text-indigo-300 font-mono">
                      VIP {user.vipLevel}
                    </span>

                    {/* Leave seat action for user */}
                    {isMe && (
                      <button
                        onClick={handleLeaveSeat}
                        className="text-[9px] text-rose-400 hover:underline mt-0.5"
                      >
                        Leave Seat
                      </button>
                    )}
                  </div>
                ) : (
                  // EMPTY SEAT
                  <button
                    onClick={() => handleTakeSeat(idx)}
                    className="w-14 h-14 sm:w-16 sm:h-16 rounded-full border-2 border-dashed border-slate-700 hover:border-amber-400/60 bg-slate-900/40 hover:bg-slate-800/60 flex flex-col items-center justify-center text-slate-500 hover:text-amber-400 transition-all"
                  >
                    <Mic className="w-5 h-5 mb-0.5" />
                    <span className="text-[9px] font-mono font-bold">#{idx + 1}</span>
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* SOUND EFFECTS BAR */}
      <div className="relative z-10 px-4 py-2 bg-slate-950/40 border-t border-b border-slate-800/60 flex items-center justify-center gap-3 overflow-x-auto text-xs">
        <span className="text-[10px] text-slate-400 font-medium shrink-0">SFX Reactions:</span>
        <button
          onClick={() => sound.playApplause()}
          className="py-1 px-2.5 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-200 text-[11px] flex items-center gap-1 shrink-0"
        >
          👏 Clap
        </button>
        <button
          onClick={() => sound.playGiftSent('dragon')}
          className="py-1 px-2.5 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-200 text-[11px] flex items-center gap-1 shrink-0"
        >
          🎺 Horn
        </button>
        <button
          onClick={() => sound.playGiftSent('rose')}
          className="py-1 px-2.5 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-200 text-[11px] flex items-center gap-1 shrink-0"
        >
          ✨ Chime
        </button>
        <button
          onClick={() => setShowGame(!showGame)}
          className="py-1 px-2.5 rounded-lg bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[11px] font-bold flex items-center gap-1 shrink-0"
        >
          <Dices className="w-3.5 h-3.5" /> Lucky Dice Game
        </button>
      </div>

      {/* MINI GAME MODAL / DRAWER */}
      {showGame && (
        <div className="relative z-20 mx-4 my-2 p-3.5 rounded-2xl bg-slate-900 border border-amber-500/40 shadow-xl flex items-center justify-between text-xs">
          <div>
            <p className="font-bold text-amber-300 flex items-center gap-1">
              <Dices className="w-4 h-4" /> Lucky 777 Dice (20 💎 Bet)
            </p>
            <p className="text-[10px] text-slate-400">
              Roll 6 to win 200 💎! Balance: {currentUser.diamonds} 💎
            </p>
          </div>

          <div className="flex items-center gap-2">
            {diceResult !== null && (
              <span className="text-xl font-black font-mono text-amber-400 px-2 py-0.5 rounded bg-slate-950 border border-amber-500/30">
                🎲 {diceResult}
              </span>
            )}
            <button
              onClick={handleRollDice}
              disabled={diceRolling}
              className="py-1.5 px-3 rounded-xl bg-amber-500 text-black font-bold text-xs"
            >
              {diceRolling ? 'Rolling...' : 'Roll Dice'}
            </button>
          </div>
        </div>
      )}

      {/* LIVE ROOM CHAT STREAM */}
      <div className="relative z-10 flex-1 px-4 py-2 overflow-y-auto max-h-56 sm:max-h-64 space-y-2">
        {/* Sample Welcome Message */}
        <div className="p-2 rounded-xl bg-indigo-950/40 border border-indigo-900/40 text-[11px] text-indigo-200 flex items-center gap-2">
          <Sparkles className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
          <span>Room Stage is Live! Follow guidelines and send gifts to cheer the mic speakers 🌹</span>
        </div>

        {/* Live messages */}
        <div className="space-y-1.5 text-xs">
          <div className="flex items-baseline gap-1.5">
            <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 font-mono">
              VIP 4
            </span>
            <span className="font-bold text-slate-300">Priya_Surila:</span>
            <span className="text-slate-200">Welcome guys! Who wants to sing next? 🎙️</span>
          </div>

          <div className="flex items-baseline gap-1.5">
            <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-indigo-500/20 text-indigo-300 font-mono">
              VIP 2
            </span>
            <span className="font-bold text-slate-300">Rohit_Guitar:</span>
            <span className="text-slate-200">Playing guitar tunes! Request your favorite song 🎸</span>
          </div>

          <div className="flex items-center gap-1.5 text-[11px] text-rose-300 font-medium py-0.5">
            <span>🎁</span>
            <span>Rohit_Guitar sent <strong>Red Rose 🌹</strong> to Priya_Surila!</span>
          </div>
        </div>

        <div ref={chatEndRef} />
      </div>

      {/* BOTTOM ACTION BAR */}
      <div className="relative z-10 p-3 sm:p-4 bg-slate-950/80 backdrop-blur-md border-t border-slate-800 flex items-center justify-between gap-2">
        {/* Mic toggle */}
        <button
          onClick={handleToggleMyMic}
          className={`p-2.5 rounded-2xl border transition-all ${
            isMyMicMuted
              ? 'bg-rose-950/60 border-rose-800 text-rose-400'
              : 'bg-emerald-950/60 border-emerald-800 text-emerald-400'
          }`}
          title={isMyMicMuted ? 'Unmute Mic' : 'Mute Mic'}
        >
          {isMyMicMuted ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
        </button>

        {/* Chat input form */}
        <form onSubmit={handleSendMessage} className="flex-1 flex items-center gap-1.5">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Type a message... (बातचीत करें)"
            className="flex-1 py-2 px-3.5 rounded-2xl bg-slate-900 border border-slate-700 text-white text-xs focus:outline-none focus:border-indigo-500"
          />
          <button
            type="submit"
            className="p-2.5 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white transition-colors"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>

        {/* Send Gift Button */}
        <button
          onClick={onOpenGift}
          className="py-2 px-3.5 rounded-2xl bg-gradient-to-r from-amber-500 to-rose-500 hover:opacity-95 text-white font-bold text-xs flex items-center gap-1.5 shadow-lg shadow-amber-500/20 active:scale-[0.98] transition-all shrink-0"
        >
          <Gift className="w-4 h-4" />
          <span>Gift (उपहार)</span>
        </button>
      </div>
    </div>
  );
};
