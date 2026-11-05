import React, { useState } from 'react';
import { RoomBpTheme, UserProfile, VipBackpackItem } from '../types';
import { ROOM_BP_THEMES, VIP_BACKPACK_ITEMS } from '../data/mockData';
import { X, Crown, Sparkles, Check, Lock, ShieldCheck, ArrowRight } from 'lucide-react';
import { sound } from '../utils/audio';

interface VipBpModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: UserProfile;
  onEquipItem: (category: VipBackpackItem['category'], itemId: string) => void;
  onOpenRecharge: () => void;
}

type TabMode = 'room_bp' | 'backpack' | 'privileges';

export const VipBpModal: React.FC<VipBpModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onEquipItem,
  onOpenRecharge,
}) => {
  const [activeTab, setActiveTab] = useState<TabMode>('room_bp');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-2xl my-auto rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl overflow-hidden text-slate-100 flex flex-col max-h-[92vh]">
        
        {/* Glow Header */}
        <div className="p-5 sm:p-6 pb-4 bg-gradient-to-r from-amber-950/60 via-slate-900 to-indigo-950/60 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-500 to-yellow-400 flex items-center justify-center shadow-lg shadow-amber-500/20 text-2xl text-black">
              <Crown className="w-7 h-7 fill-black" />
            </div>
            <div>
              <h2 className="text-lg font-bold font-display text-white flex items-center gap-2">
                VIP & BP Center (वीआईपी व बीपी मॉल)
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  VIP {currentUser.vipLevel} Status
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                Change room wallpaper (BP), equip luxury frames & supercar entrances
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

        {/* Tab Navigation */}
        <div className="px-5 pt-3 border-b border-slate-800 flex gap-2">
          <button
            onClick={() => { setActiveTab('room_bp'); sound.playClick(); }}
            className={`pb-2.5 px-3 text-xs font-bold transition-all relative ${
              activeTab === 'room_bp'
                ? 'text-amber-400 border-b-2 border-amber-400'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Room BP Wallpapers (कमरा बीपी)
          </button>
          <button
            onClick={() => { setActiveTab('backpack'); sound.playClick(); }}
            className={`pb-2.5 px-3 text-xs font-bold transition-all relative ${
              activeTab === 'backpack'
                ? 'text-amber-400 border-b-2 border-amber-400'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            VIP Backpack (बैगपैक सामान)
          </button>
          <button
            onClick={() => { setActiveTab('privileges'); sound.playClick(); }}
            className={`pb-2.5 px-3 text-xs font-bold transition-all relative ${
              activeTab === 'privileges'
                ? 'text-amber-400 border-b-2 border-amber-400'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            VIP Privileges (विशेषाधिकार)
          </button>
        </div>

        {/* Tab Content */}
        <div className="p-5 sm:p-6 space-y-4 overflow-y-auto">
          {/* TAB 1: ROOM BP WALLPAPERS */}
          {activeTab === 'room_bp' && (
            <div className="space-y-4">
              <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-xs flex items-center justify-between">
                <div>
                  <p className="font-semibold text-amber-300">
                    Room BP (Backdrop Picture) Customizer
                  </p>
                  <p className="text-[11px] text-slate-400">
                    VIP members can select and activate custom room backgrounds for their stages.
                  </p>
                </div>
                <button
                  onClick={onOpenRecharge}
                  className="py-1.5 px-3 rounded-lg bg-amber-500 text-black font-bold text-[11px] shrink-0"
                >
                  Upgrade VIP
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {ROOM_BP_THEMES.map((theme) => {
                  const isEquipped = currentUser.activeRoomBp === theme.id;
                  const isUnlocked = currentUser.vipLevel >= theme.minVip;
                  return (
                    <div
                      key={theme.id}
                      className={`p-3.5 rounded-2xl border text-left flex flex-col justify-between space-y-3 transition-all ${
                        isEquipped
                          ? 'bg-amber-500/10 border-amber-400 ring-2 ring-amber-400/30'
                          : 'bg-slate-950/60 border-slate-800'
                      }`}
                    >
                      <div className="h-28 rounded-xl overflow-hidden relative shadow-md">
                        <img
                          src={theme.previewUrl}
                          alt={theme.name}
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute top-2 left-2 px-2 py-0.5 rounded-full bg-black/70 backdrop-blur-sm text-[10px] font-bold text-white flex items-center gap-1">
                          <Crown className="w-3 h-3 text-amber-400" /> VIP {theme.minVip}+
                        </div>
                        {isEquipped && (
                          <div className="absolute top-2 right-2 px-2 py-0.5 rounded-full bg-emerald-500 text-black text-[10px] font-extrabold flex items-center gap-1">
                            <Check className="w-3 h-3 stroke-[3]" /> Equipped
                          </div>
                        )}
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-xs font-bold text-white">{theme.name}</p>
                          <span className="text-[10px] text-slate-400">{theme.nameHi}</span>
                        </div>

                        {isUnlocked ? (
                          <button
                            onClick={() => {
                              onEquipItem('room_bp', theme.id);
                              sound.playClick();
                            }}
                            className={`py-1.5 px-3 rounded-xl text-xs font-bold transition-colors ${
                              isEquipped
                                ? 'bg-slate-800 text-slate-400'
                                : 'bg-amber-500 hover:bg-amber-400 text-black'
                            }`}
                          >
                            {isEquipped ? 'Active BP' : 'Use BP'}
                          </button>
                        ) : (
                          <button
                            onClick={onOpenRecharge}
                            className="py-1.5 px-3 rounded-xl bg-slate-800 text-amber-400 border border-amber-500/30 text-xs font-semibold flex items-center gap-1"
                          >
                            <Lock className="w-3 h-3" /> VIP {theme.minVip} Required
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 2: VIP BACKPACK (Frames, Mic Halo, Vehicle Entrance) */}
          {activeTab === 'backpack' && (
            <div className="space-y-4">
              <p className="text-xs text-slate-400">
                Manage your avatar frames, mic seating halo rings, and room entry vehicles.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {VIP_BACKPACK_ITEMS.map((item) => {
                  const isEquipped =
                    (item.category === 'frame' && currentUser.activeFrame === item.id) ||
                    (item.category === 'mic_ring' && currentUser.activeMicRing === item.id) ||
                    (item.category === 'entrance' && currentUser.activeEntrance === item.id);
                  const isUnlocked = item.unlocked || currentUser.vipLevel >= item.minVip;

                  return (
                    <div
                      key={item.id}
                      className={`p-3.5 rounded-2xl border flex items-center justify-between gap-3 text-xs ${
                        isEquipped
                          ? 'bg-amber-500/10 border-amber-400'
                          : 'bg-slate-950/60 border-slate-800'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-2xl bg-slate-800/80 border border-slate-700 flex items-center justify-center text-2xl shadow-inner shrink-0">
                          {item.icon}
                        </div>
                        <div>
                          <p className="font-bold text-white flex items-center gap-1">
                            {item.name}
                          </p>
                          <p className="text-[10px] text-slate-400">{item.description}</p>
                          <span className="text-[10px] text-amber-400 font-mono">
                            VIP {item.minVip}+
                          </span>
                        </div>
                      </div>

                      <button
                        onClick={() => {
                          if (isUnlocked) {
                            onEquipItem(item.category, item.id);
                            sound.playClick();
                          } else {
                            onOpenRecharge();
                          }
                        }}
                        className={`py-1.5 px-3 rounded-xl text-xs font-bold transition-all shrink-0 ${
                          !isUnlocked
                            ? 'bg-slate-800 text-amber-400 border border-amber-500/30'
                            : isEquipped
                            ? 'bg-emerald-600 text-white'
                            : 'bg-indigo-600 hover:bg-indigo-500 text-white'
                        }`}
                      >
                        {!isUnlocked ? `VIP ${item.minVip}` : isEquipped ? 'Equipped' : 'Equip'}
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 3: VIP PRIVILEGES TIER LIST */}
          {activeTab === 'privileges' && (
            <div className="space-y-3">
              {[
                { lvl: 1, name: 'VIP 1 Bronze', exp: '100 XP', perk: 'Room BP Change + Silver Mic Ring' },
                { lvl: 2, name: 'VIP 2 Silver', exp: '300 XP', perk: 'Neon Chat Bubbles + Sunset Room BP' },
                { lvl: 3, name: 'VIP 3 Gold', exp: '650 XP', perk: 'Lamborghini Supercar Entrance + Crown Frame' },
                { lvl: 4, name: 'VIP 4 Platinum', exp: '1,400 XP', perk: 'Emerald Room BP + Flying Bullet Comments' },
                { lvl: 5, name: 'VIP 5 Diamond', exp: '3,800 XP', perk: 'Golden Dragon Entrance + Global Banner Notice' },
                { lvl: 6, name: 'VIP 6 Imperial', exp: '9,000 XP', perk: 'Anti-Kick Immunity + Unlimited Custom BP' },
              ].map((tier) => {
                const isCurrent = currentUser.vipLevel === tier.lvl;
                const isPassed = currentUser.vipLevel >= tier.lvl;
                return (
                  <div
                    key={tier.lvl}
                    className={`p-3.5 rounded-2xl border flex items-center justify-between gap-4 text-xs ${
                      isCurrent
                        ? 'bg-amber-500/15 border-amber-400 ring-1 ring-amber-400'
                        : isPassed
                        ? 'bg-slate-950/60 border-slate-800'
                        : 'bg-slate-950/30 border-slate-800/40 opacity-60'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold font-mono text-sm ${
                          isPassed ? 'bg-amber-500 text-black' : 'bg-slate-800 text-slate-400'
                        }`}
                      >
                        V{tier.lvl}
                      </div>
                      <div>
                        <p className="font-bold text-white flex items-center gap-2">
                          {tier.name}
                          {isCurrent && (
                            <span className="text-[9px] px-2 py-0.2 rounded-full bg-amber-400 text-black font-extrabold">
                              CURRENT
                            </span>
                          )}
                        </p>
                        <p className="text-[11px] text-slate-400">{tier.perk}</p>
                      </div>
                    </div>

                    <span className="font-mono text-slate-400 text-[11px]">
                      {tier.exp}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
