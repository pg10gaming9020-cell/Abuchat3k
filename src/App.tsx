import React, { useState, useEffect } from 'react';
import {
  ActiveGiftEffect,
  GiftItem,
  Room,
  RoomCategory,
  Transaction,
  UserProfile,
  VipBackpackItem,
} from './types';
import {
  INITIAL_ROOMS,
  INITIAL_TRANSACTIONS,
  INITIAL_USER,
} from './data/mockData';
import { AuthModal } from './components/AuthModal';
import { RechargeModal } from './components/RechargeModal';
import { CreateRoomModal } from './components/CreateRoomModal';
import { RoomSettingsModal } from './components/RoomSettingsModal';
import { InviteFriendsModal } from './components/InviteFriendsModal';
import { VipBpModal } from './components/VipBpModal';
import { GiftModal } from './components/GiftModal';
import { FullscreenGiftAnimation } from './components/FullscreenGiftAnimation';
import { LiveRoomView } from './components/LiveRoomView';
import { UserProfileView } from './components/UserProfileView';
import { RoomCard } from './components/RoomCard';
import { AndroidDownloadModal } from './components/AndroidDownloadModal';
import { AndroidDownloadBanner } from './components/AndroidDownloadBanner';
import {
  Mic,
  Plus,
  Diamond,
  Crown,
  History,
  User,
  Radio,
  Search,
  Lock,
  Globe,
  Sparkles,
  CreditCard,
  Languages,
} from 'lucide-react';
import { sound } from './utils/audio';

type NavTab = 'rooms' | 'recharge' | 'vip_bp' | 'profile';

export default function App() {
  // PERSISTED LOCAL STORAGE HOOKS
  const [currentUser, setCurrentUser] = useState<UserProfile>(() => {
    try {
      const saved = localStorage.getItem('abuchat_user');
      return saved ? JSON.parse(saved) : INITIAL_USER;
    } catch {
      return INITIAL_USER;
    }
  });

  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    try {
      const saved = localStorage.getItem('abuchat_txns');
      return saved ? JSON.parse(saved) : INITIAL_TRANSACTIONS;
    } catch {
      return INITIAL_TRANSACTIONS;
    }
  });

  const [rooms, setRooms] = useState<Room[]>(() => {
    try {
      const saved = localStorage.getItem('abuchat_rooms');
      return saved ? JSON.parse(saved) : INITIAL_ROOMS;
    } catch {
      return INITIAL_ROOMS;
    }
  });

  // App UI state
  const [activeTab, setActiveTab] = useState<NavTab>('rooms');
  const [activeRoom, setActiveRoom] = useState<Room | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [lang, setLang] = useState<'en' | 'hi'>('hi');

  // Modals
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isRechargeOpen, setIsRechargeOpen] = useState(false);
  const [isCreateRoomOpen, setIsCreateRoomOpen] = useState(false);
  const [isRoomSettingsOpen, setIsRoomSettingsOpen] = useState(false);
  const [isInviteFriendsOpen, setIsInviteFriendsOpen] = useState(false);
  const [isGiftModalOpen, setIsGiftModalOpen] = useState(false);
  const [isVipBpOpen, setIsVipBpOpen] = useState(false);
  const [isAndroidDownloadOpen, setIsAndroidDownloadOpen] = useState(false);

  // Private room password prompt modal
  const [pinPromptRoom, setPinPromptRoom] = useState<Room | null>(null);
  const [enteredPin, setEnteredPin] = useState('');
  const [pinError, setPinError] = useState('');

  // Active full screen gift celebration
  const [activeGiftEffect, setActiveGiftEffect] = useState<ActiveGiftEffect | null>(null);

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem('abuchat_user', JSON.stringify(currentUser));
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem('abuchat_txns', JSON.stringify(transactions));
  }, [transactions]);

  useEffect(() => {
    localStorage.setItem('abuchat_rooms', JSON.stringify(rooms));
  }, [rooms]);

  // Recharge success handler
  const handleRechargeSuccess = (
    newDiamonds: number,
    newVipExp: number,
    newTxn: Transaction
  ) => {
    const nextVip =
      newVipExp >= 9000
        ? 7
        : newVipExp >= 3800
        ? 5
        : newVipExp >= 1400
        ? 4
        : newVipExp >= 650
        ? 3
        : newVipExp >= 300
        ? 2
        : newVipExp >= 100
        ? 1
        : currentUser.vipLevel;

    setCurrentUser((prev) => ({
      ...prev,
      diamonds: newDiamonds,
      vipExp: newVipExp,
      vipLevel: Math.max(prev.vipLevel, nextVip),
    }));

    setTransactions((prev) => [newTxn, ...prev]);
  };

  // Equip BP / VIP Backpack item
  const handleEquipItem = (category: VipBackpackItem['category'], itemId: string) => {
    if (category === 'room_bp') {
      setCurrentUser((prev) => ({ ...prev, activeRoomBp: itemId }));
      // If host in active room, update room BP too!
      if (activeRoom && activeRoom.hostId === currentUser.id) {
        const updated = { ...activeRoom, bpThemeId: itemId };
        setActiveRoom(updated);
        setRooms((prev) => prev.map((r) => (r.id === updated.id ? updated : r)));
      }
    } else if (category === 'frame') {
      setCurrentUser((prev) => ({ ...prev, activeFrame: itemId }));
    } else if (category === 'mic_ring') {
      setCurrentUser((prev) => ({ ...prev, activeMicRing: itemId }));
    } else if (category === 'entrance') {
      setCurrentUser((prev) => ({ ...prev, activeEntrance: itemId }));
    }
  };

  // Join Room Logic (verifies PIN if private)
  const handleAttemptJoinRoom = (room: Room) => {
    if (room.isPrivate && room.password && room.hostId !== currentUser.id) {
      setPinPromptRoom(room);
      setEnteredPin('');
      setPinError('');
    } else {
      setActiveRoom(room);
      sound.playClick();
    }
  };

  const handleConfirmPin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pinPromptRoom) return;

    if (enteredPin.trim() === pinPromptRoom.password) {
      setActiveRoom(pinPromptRoom);
      setPinPromptRoom(null);
      sound.playClick();
    } else {
      setPinError('Invalid 4-digit PIN password! (गलत पासवर्ड)');
    }
  };

  // Send Gift Handler
  const handleSendGift = (
    gift: GiftItem,
    count: number,
    receiverId: string,
    receiverName: string
  ) => {
    const totalDiamonds = gift.diamonds * count;
    if (currentUser.diamonds < totalDiamonds) {
      setIsRechargeOpen(true);
      return;
    }

    // Deduct diamonds
    setCurrentUser((prev) => ({
      ...prev,
      diamonds: prev.diamonds - totalDiamonds,
    }));

    // Add transaction record with date
    const giftTxn: Transaction = {
      id: `TXN-GIFT-${Math.floor(100000 + Math.random() * 900000)}`,
      type: 'gift_sent',
      diamondsDelta: -totalDiamonds,
      description: `Sent ${count}x ${gift.name} to ${receiverName}`,
      timestamp: new Date().toISOString(),
      status: 'completed',
    };
    setTransactions((prev) => [giftTxn, ...prev]);

    // Trigger full screen visual animation
    setActiveGiftEffect({
      id: `effect_${Date.now()}`,
      gift,
      senderName: currentUser.name,
      receiverName,
      count,
    });
  };

  // Filtered rooms
  const filteredRooms = rooms.filter((r) => {
    const matchesCategory =
      selectedCategory === 'all' || r.category === selectedCategory;
    const matchesQuery =
      !searchQuery.trim() ||
      r.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.id.includes(searchQuery.trim());
    return matchesCategory && matchesQuery;
  });

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-amber-500 selection:text-black">
      
      {/* FULLSCREEN GIFT CELEBRATION */}
      <FullscreenGiftAnimation
        effect={activeGiftEffect}
        onComplete={() => setActiveGiftEffect(null)}
      />

      {/* TOP BAR / HEADER */}
      <header className="sticky top-0 z-40 bg-slate-950/90 backdrop-blur-md border-b border-slate-800/80 px-4 sm:px-6 py-3">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          
          {/* Brand Wordmark & Mode */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                setActiveRoom(null);
                setActiveTab('rooms');
                sound.playClick();
              }}
              className="flex items-center gap-2.5 text-left group"
            >
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-500 via-rose-500 to-indigo-600 flex items-center justify-center text-xl shadow-lg shadow-rose-500/20 group-hover:scale-105 transition-transform">
                🎙️
              </div>
              <div>
                <span className="text-xl font-black font-display tracking-tight text-white flex items-center gap-1.5">
                  AbuChat
                  <span className="text-[10px] font-bold px-1.5 py-0.2 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                    LIVE
                  </span>
                </span>
                <p className="text-[10px] text-slate-400 font-medium">
                  {lang === 'hi' ? 'लाइव वॉइस पार्टी व डायमंड' : 'Voice Party & Diamonds'}
                </p>
              </div>
            </button>
          </div>

          {/* Quick Diamond Wallet & Header Actions */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Diamond Balance with 1-click Recharge shortcut */}
            <button
              onClick={() => {
                sound.playClick();
                setIsRechargeOpen(true);
              }}
              className="flex items-center gap-1.5 py-1.5 px-3 rounded-2xl bg-slate-900 border border-amber-500/30 hover:border-amber-400/70 text-amber-300 transition-all shadow-sm group"
              title="Recharge Diamonds"
            >
              <span className="text-base group-hover:scale-110 transition-transform">💎</span>
              <span className="font-mono font-bold text-xs sm:text-sm tabular-nums text-white">
                {currentUser.diamonds.toLocaleString()}
              </span>
              <span className="w-4 h-4 rounded-full bg-amber-500 text-black text-[10px] font-extrabold flex items-center justify-center ml-0.5">
                +
              </span>
            </button>

            {/* Language Switcher */}
            <button
              onClick={() => {
                sound.playClick();
                setLang((prev) => (prev === 'hi' ? 'en' : 'hi'));
              }}
              className="py-1.5 px-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-xs text-slate-300 flex items-center gap-1 transition-colors"
              title="Toggle Hindi / English"
            >
              <Languages className="w-3.5 h-3.5 text-indigo-400" />
              <span className="font-bold">{lang === 'hi' ? 'हिं' : 'EN'}</span>
            </button>

            {/* Android Play Store App Download CTA */}
            <button
              onClick={() => {
                sound.playClick();
                setIsAndroidDownloadOpen(true);
              }}
              className="flex items-center gap-1.5 py-1.5 px-2.5 sm:px-3 rounded-2xl bg-emerald-950/80 hover:bg-emerald-900 border border-emerald-500/50 hover:border-emerald-400 text-emerald-300 transition-all shadow-sm group active:scale-95"
              title="Download AbuChat Android App from Play Store"
            >
              {/* Play Store multi-color vector */}
              <svg className="w-3.5 h-3.5 shrink-0 group-hover:scale-110 transition-transform" viewBox="0 0 512 512">
                <path fill="#00a0ff" d="M47.7 21.6L275.5 249.4 69.3 455.6c-4.4-4.8-7.1-11.2-7.1-18.3V74.7c0-7.1 2.7-13.5 7.1-18.3l-21.6-34.8z" />
                <path fill="#00e676" d="M356.5 168.4L275.5 249.4 47.7 21.6c6.2-4.1 13.6-6.6 21.6-6.6h287.2z" />
                <path fill="#ffd600" d="M455.8 238.9l-99.3-70.5-81 81 81 81 99.3-70.5c10.4-7.4 10.4-23.6 0-31z" />
                <path fill="#ff3d00" d="M69.3 455.6l206.2-206.2 81 81-287.2 0c-8 0-15.4-2.5-21.6-6.6l21.6 131.8z" />
              </svg>
              <span className="text-[11px] sm:text-xs font-bold text-white whitespace-nowrap">
                <span className="hidden sm:inline">Play Store App</span>
                <span className="sm:hidden">App</span>
              </span>
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse hidden sm:block" />
            </button>

            {/* Create Room Primary CTA */}
            <button
              onClick={() => {
                sound.playClick();
                setIsCreateRoomOpen(true);
              }}
              className="hidden sm:flex items-center gap-1.5 py-2 px-3.5 rounded-2xl bg-gradient-to-r from-amber-500 via-rose-500 to-indigo-600 hover:opacity-95 text-white font-bold text-xs shadow-lg shadow-rose-500/20 active:scale-[0.98] transition-all"
            >
              <Plus className="w-3.5 h-3.5 stroke-[3]" />
              <span>{lang === 'hi' ? 'कमरा बनाएं (Create Room)' : 'Create Room'}</span>
            </button>

            {/* User Profile Avatar shortcut */}
            <button
              onClick={() => {
                sound.playClick();
                setActiveTab('profile');
                setActiveRoom(null);
              }}
              className="relative p-0.5 rounded-full ring-2 ring-amber-400 hover:ring-amber-300 transition-all"
            >
              <img
                src={currentUser.avatar}
                alt={currentUser.name}
                referrerPolicy="no-referrer"
                className="w-8 h-8 rounded-full object-cover"
              />
              <span className="absolute -bottom-1 -right-1 px-1 rounded-full bg-amber-400 text-black text-[8px] font-extrabold">
                V{currentUser.vipLevel}
              </span>
            </button>
          </div>
        </div>
      </header>

      {/* MAIN VIEW CONTAINER */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 pb-24 sm:pb-12">
        {activeRoom ? (
          // LIVE ROOM STAGE VIEW
          <LiveRoomView
            room={activeRoom}
            currentUser={currentUser}
            onLeaveRoom={() => {
              sound.playClick();
              setActiveRoom(null);
            }}
            onOpenSettings={() => setIsRoomSettingsOpen(true)}
            onOpenInvite={() => setIsInviteFriendsOpen(true)}
            onOpenGift={() => setIsGiftModalOpen(true)}
            onOpenRecharge={() => setIsRechargeOpen(true)}
            onUpdateRoom={(updated) => {
              setActiveRoom(updated);
              setRooms((prev) => prev.map((r) => (r.id === updated.id ? updated : r)));
            }}
            onSendRoomMessage={(text) => {
              // Add message to active room
              const newMsg = {
                id: `msg_${Date.now()}`,
                userId: currentUser.id,
                userName: currentUser.name,
                userAvatar: currentUser.avatar,
                vipLevel: currentUser.vipLevel,
                type: 'chat' as const,
                text,
                timestamp: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
              };
              // Simulated speech waves
              sound.playClick();
            }}
          />
        ) : activeTab === 'profile' ? (
          // USER PROFILE & RECHARGE HISTORY VIEW
          <UserProfileView
            currentUser={currentUser}
            transactions={transactions}
            onOpenRecharge={() => setIsRechargeOpen(true)}
            onOpenVipBp={() => setIsVipBpOpen(true)}
            onOpenAuth={() => setIsAuthOpen(true)}
            onUpdateProfile={(updated) => setCurrentUser((prev) => ({ ...prev, ...updated }))}
            onOpenAndroidDownload={() => setIsAndroidDownloadOpen(true)}
          />
        ) : (
          // EXPLORE ROOMS TAB
          <div className="space-y-6">
            
            {/* Hero Banner / Quick Promo */}
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-indigo-950 via-slate-900 to-amber-950/80 border border-slate-800 p-6 sm:p-8 shadow-2xl flex flex-col sm:flex-row items-center justify-between gap-6">
              <div className="space-y-2 text-center sm:text-left">
                <div className="inline-flex items-center gap-1.5 py-1 px-3 rounded-full bg-amber-500/20 text-amber-300 text-xs font-bold border border-amber-500/30">
                  <Sparkles className="w-3.5 h-3.5" />
                  {lang === 'hi' ? 'आज का डायमंड बोनस चालू है!' : 'Today Special 100% Diamond Bonus'}
                </div>
                <h1 className="text-2xl sm:text-3xl font-extrabold font-display text-white tracking-tight">
                  {lang === 'hi'
                    ? 'दोस्तों के साथ वॉइस पार्टी करें & डायमंड जीतें'
                    : 'Live Voice Party & Diamond Gifting Rooms'}
                </h1>
                <p className="text-xs sm:text-sm text-slate-300 max-w-lg">
                  {lang === 'hi'
                    ? 'अपना कमरा बनाएं, बीपी वॉलपेपर बदलें, पसंदीदा होस्ट को उपहार भेजें और यूपीआई से तुरंत रिचार्ज करें।'
                    : 'Create voice party rooms, change VIP room wallpapers, send gifts and recharge instantly via UPI/Cards.'}
                </p>

                <div className="flex flex-wrap items-center gap-2 pt-2 justify-center sm:justify-start">
                  <button
                    onClick={() => {
                      sound.playClick();
                      setIsCreateRoomOpen(true);
                    }}
                    className="py-2.5 px-4 rounded-xl bg-gradient-to-r from-amber-500 via-rose-500 to-indigo-600 text-white font-bold text-xs flex items-center gap-1.5 shadow-md shadow-rose-500/20"
                  >
                    <Plus className="w-4 h-4" />
                    {lang === 'hi' ? 'कमरा बनाएं (Create Room)' : 'Create Room'}
                  </button>
                  <button
                    onClick={() => {
                      sound.playClick();
                      setIsRechargeOpen(true);
                    }}
                    className="py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-300 font-bold text-xs flex items-center gap-1.5 border border-amber-500/30"
                  >
                    <CreditCard className="w-4 h-4" />
                    {lang === 'hi' ? 'डायमंड रिचार्ज (Recharge 💎)' : 'Recharge 💎'}
                  </button>
                  <button
                    onClick={() => {
                      sound.playClick();
                      setIsVipBpOpen(true);
                    }}
                    className="py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs flex items-center gap-1.5 border border-slate-700"
                  >
                    <Crown className="w-4 h-4 text-amber-400" />
                    {lang === 'hi' ? 'बीपी व वीआईपी (VIP BP)' : 'VIP BP Mall'}
                  </button>
                </div>
              </div>

              {/* Floating Live Indicator Graphic */}
              <div className="w-28 h-28 sm:w-36 sm:h-36 rounded-3xl bg-gradient-to-tr from-amber-500/30 via-rose-500/30 to-indigo-500/30 border border-white/10 flex flex-col items-center justify-center p-3 text-center shadow-xl backdrop-blur-md shrink-0">
                <span className="text-4xl sm:text-5xl animate-bounce">🎙️</span>
                <span className="text-[11px] font-bold text-amber-300 mt-1 font-mono">
                  {rooms.length} Active Parties
                </span>
                <span className="text-[9px] text-emerald-400 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                  Live Audio
                </span>
              </div>
            </div>

            {/* ANDROID PLAY STORE DOWNLOAD BANNER */}
            <AndroidDownloadBanner
              onOpenDownloadModal={() => setIsAndroidDownloadOpen(true)}
              lang={lang}
            />

            {/* Search & Category Filter Bar */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
              {/* Category Segmented Control */}
              <div className="flex items-center gap-1.5 p-1 bg-slate-900 rounded-2xl border border-slate-800 text-xs overflow-x-auto">
                {[
                  { id: 'all', label: lang === 'hi' ? 'सभी रूम (All)' : 'All Rooms' },
                  { id: 'party', label: '🎉 Party' },
                  { id: 'music', label: '🎵 Singing' },
                  { id: 'gaming', label: '🎮 Gaming' },
                  { id: 'dating', label: '💫 Chill & Dosti' },
                ].map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => {
                      setSelectedCategory(cat.id);
                      sound.playClick();
                    }}
                    className={`py-1.5 px-3.5 rounded-xl font-medium whitespace-nowrap transition-colors ${
                      selectedCategory === cat.id
                        ? 'bg-indigo-600 text-white font-bold shadow-sm'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>

              {/* Search input */}
              <div className="relative min-w-[200px] sm:min-w-[240px]">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={lang === 'hi' ? 'कमरा नाम या आईडी खोजें...' : 'Search room by name or ID...'}
                  className="w-full py-2 pl-9 pr-3 rounded-2xl bg-slate-900 border border-slate-800 text-white text-xs placeholder:text-slate-500 focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>

            {/* Room Cards Grid */}
            {filteredRooms.length === 0 ? (
              <div className="py-16 text-center rounded-3xl bg-slate-900/60 border border-slate-800 space-y-3">
                <Radio className="w-12 h-12 text-slate-600 mx-auto" />
                <p className="text-base font-bold text-white">No active rooms found</p>
                <p className="text-xs text-slate-400">
                  Be the first to create a live voice party room right now!
                </p>
                <button
                  onClick={() => setIsCreateRoomOpen(true)}
                  className="py-2 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs"
                >
                  Create Room Now
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                {filteredRooms.map((room) => (
                  <RoomCard
                    key={room.id}
                    room={room}
                    onJoin={handleAttemptJoinRoom}
                  />
                ))}
              </div>
            )}
          </div>
        )}
      </main>

      {/* MOBILE BOTTOM NAVIGATION BAR */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 bg-slate-950/95 backdrop-blur-md border-t border-slate-800/80 px-2 sm:px-4 py-2">
        <div className="max-w-md mx-auto grid grid-cols-5 items-center">
          <button
            onClick={() => {
              sound.playClick();
              setActiveRoom(null);
              setActiveTab('rooms');
            }}
            className={`flex flex-col items-center py-1 transition-colors ${
              activeTab === 'rooms' && !activeRoom
                ? 'text-amber-400 font-bold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Radio className="w-5 h-5" />
            <span className="text-[10px] mt-0.5">Rooms</span>
          </button>

          <button
            onClick={() => {
              sound.playClick();
              setIsRechargeOpen(true);
            }}
            className="flex flex-col items-center py-1 text-slate-400 hover:text-amber-300 transition-colors"
          >
            <div className="relative">
              <Diamond className="w-5 h-5 text-amber-400 fill-amber-400" />
              <span className="absolute -top-1 -right-2 w-2 h-2 rounded-full bg-rose-500" />
            </div>
            <span className="text-[10px] mt-0.5 text-amber-300 font-semibold">Recharge</span>
          </button>

          <button
            onClick={() => {
              sound.playClick();
              setIsVipBpOpen(true);
            }}
            className="flex flex-col items-center py-1 text-slate-400 hover:text-white transition-colors"
          >
            <Crown className="w-5 h-5 text-yellow-400" />
            <span className="text-[10px] mt-0.5">VIP BP</span>
          </button>

          {/* Android Play Store App Tab */}
          <button
            onClick={() => {
              sound.playClick();
              setIsAndroidDownloadOpen(true);
            }}
            className="flex flex-col items-center py-1 text-emerald-400 hover:text-emerald-300 transition-colors group"
            title="Download Play Store App"
          >
            <div className="relative">
              <svg className="w-5 h-5 group-hover:scale-110 transition-transform" viewBox="0 0 512 512">
                <path fill="#00a0ff" d="M47.7 21.6L275.5 249.4 69.3 455.6c-4.4-4.8-7.1-11.2-7.1-18.3V74.7c0-7.1 2.7-13.5 7.1-18.3l-21.6-34.8z" />
                <path fill="#00e676" d="M356.5 168.4L275.5 249.4 47.7 21.6c6.2-4.1 13.6-6.6 21.6-6.6h287.2z" />
                <path fill="#ffd600" d="M455.8 238.9l-99.3-70.5-81 81 81 81 99.3-70.5c10.4-7.4 10.4-23.6 0-31z" />
                <path fill="#ff3d00" d="M69.3 455.6l206.2-206.2 81 81-287.2 0c-8 0-15.4-2.5-21.6-6.6l21.6 131.8z" />
              </svg>
              <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            </div>
            <span className="text-[10px] mt-0.5 text-emerald-400 font-bold">Android</span>
          </button>

          <button
            onClick={() => {
              sound.playClick();
              setActiveRoom(null);
              setActiveTab('profile');
            }}
            className={`flex flex-col items-center py-1 transition-colors ${
              activeTab === 'profile'
                ? 'text-amber-400 font-bold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <User className="w-5 h-5" />
            <span className="text-[10px] mt-0.5">Profile</span>
          </button>
        </div>
      </nav>

      {/* PRIVATE ROOM PIN PASSWORD PROMPT MODAL */}
      {pinPromptRoom && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="relative w-full max-w-sm rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl p-6 space-y-4 text-center">
            <div className="w-12 h-12 mx-auto rounded-2xl bg-rose-500/20 border border-rose-500/30 flex items-center justify-center text-rose-400">
              <Lock className="w-6 h-6" />
            </div>

            <div>
              <h3 className="text-lg font-bold font-display text-white">
                Private Room Access
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Enter the 4-digit PIN password to enter{' '}
                <strong className="text-white">{pinPromptRoom.title}</strong>
              </p>
            </div>

            <form onSubmit={handleConfirmPin} className="space-y-3">
              <input
                type="password"
                maxLength={6}
                autoFocus
                value={enteredPin}
                onChange={(e) => {
                  setEnteredPin(e.target.value);
                  setPinError('');
                }}
                placeholder="PIN (e.g. 7777)"
                className="w-full py-3 px-4 rounded-xl bg-slate-950 border border-slate-700 text-center text-xl font-mono tracking-widest text-white focus:outline-none focus:border-rose-500"
              />

              {pinError && (
                <p className="text-xs text-rose-400 font-semibold">{pinError}</p>
              )}

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setPinPromptRoom(null)}
                  className="flex-1 py-2.5 rounded-xl bg-slate-800 text-slate-300 font-semibold text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs shadow-md shadow-rose-600/30"
                >
                  Enter Party
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODALS */}
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        currentUser={currentUser}
        onLoginSuccess={(u) => setCurrentUser(u)}
      />

      <RechargeModal
        isOpen={isRechargeOpen}
        onClose={() => setIsRechargeOpen(false)}
        currentUser={currentUser}
        onRechargeSuccess={handleRechargeSuccess}
        onOpenProfile={() => {
          setActiveRoom(null);
          setActiveTab('profile');
        }}
      />

      <CreateRoomModal
        isOpen={isCreateRoomOpen}
        onClose={() => setIsCreateRoomOpen(false)}
        currentUser={currentUser}
        onCreateRoom={(newRoom) => {
          setRooms((prev) => [newRoom, ...prev]);
          setActiveRoom(newRoom);
        }}
      />

      {activeRoom && (
        <>
          <RoomSettingsModal
            isOpen={isRoomSettingsOpen}
            onClose={() => setIsRoomSettingsOpen(false)}
            room={activeRoom}
            currentUser={currentUser}
            onSaveSettings={(updated) => {
              setActiveRoom(updated);
              setRooms((prev) => prev.map((r) => (r.id === updated.id ? updated : r)));
            }}
            onCloseRoom={() => {
              setRooms((prev) => prev.filter((r) => r.id !== activeRoom.id));
              setActiveRoom(null);
              setIsRoomSettingsOpen(false);
            }}
          />

          <InviteFriendsModal
            isOpen={isInviteFriendsOpen}
            onClose={() => setIsInviteFriendsOpen(false)}
            room={activeRoom}
          />

          <GiftModal
            isOpen={isGiftModalOpen}
            onClose={() => setIsGiftModalOpen(false)}
            room={activeRoom}
            currentUser={currentUser}
            onSendGift={handleSendGift}
            onOpenRecharge={() => {
              setIsGiftModalOpen(false);
              setIsRechargeOpen(true);
            }}
          />
        </>
      )}

      <VipBpModal
        isOpen={isVipBpOpen}
        onClose={() => setIsVipBpOpen(false)}
        currentUser={currentUser}
        onEquipItem={handleEquipItem}
        onOpenRecharge={() => {
          setIsVipBpOpen(false);
          setIsRechargeOpen(true);
        }}
      />

      {/* ANDROID PLAY STORE DOWNLOAD MODAL */}
      <AndroidDownloadModal
        isOpen={isAndroidDownloadOpen}
        onClose={() => setIsAndroidDownloadOpen(false)}
        lang={lang}
      />
    </div>
  );
}
