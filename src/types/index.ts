export type LoginProvider = 'google' | 'facebook' | 'phone' | 'guest';

export interface UserProfile {
  id: string;
  name: string;
  avatar: string;
  handle: string;
  email?: string;
  phone?: string;
  loginProvider: LoginProvider;
  diamonds: number;
  charmPoints: number;
  vipLevel: number;
  vipExp: number;
  activeFrame?: string;
  activeMicRing?: string;
  activeEntrance?: string;
  activeRoomBp?: string;
  gender: 'male' | 'female' | 'other';
  bio: string;
  isHost?: boolean;
}

export type RoomCategory = 'party' | 'voice' | 'music' | 'gaming' | 'dating' | 'vip';

export interface RoomBpTheme {
  id: string;
  name: string;
  nameHi: string;
  minVip: number;
  bgGradient: string;
  previewUrl: string;
  accentColor: string;
  tag?: string;
}

export interface VipBackpackItem {
  id: string;
  name: string;
  nameHi: string;
  category: 'room_bp' | 'frame' | 'entrance' | 'mic_ring';
  minVip: number;
  priceDiamonds: number;
  icon: string;
  preview: string;
  unlocked: boolean;
  equipped?: boolean;
  description: string;
}

export interface MicSeat {
  seatIndex: number;
  user?: {
    id: string;
    name: string;
    avatar: string;
    vipLevel: number;
    activeFrame?: string;
    activeMicRing?: string;
    isSpeaking?: boolean;
    isMuted?: boolean;
    receivedGiftsCount?: number;
  };
  isLocked?: boolean;
}

export interface RoomMessage {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string;
  vipLevel: number;
  type: 'chat' | 'system' | 'gift' | 'entry' | 'bp_change';
  text: string;
  timestamp: string;
  giftData?: {
    giftId: string;
    giftName: string;
    giftIcon: string;
    count: number;
    diamonds: number;
    receiverName: string;
  };
}

export interface Room {
  id: string;
  title: string;
  topic: string;
  category: RoomCategory;
  bpThemeId: string;
  hostId: string;
  hostName: string;
  hostAvatar: string;
  hostVip: number;
  listenersCount: number;
  isPrivate: boolean;
  password?: string;
  seatsCount: number;
  seats: MicSeat[];
  announcement: string;
  createdAt: number;
}

export interface GiftItem {
  id: string;
  name: string;
  nameHi: string;
  diamonds: number;
  icon: string;
  type: 'common' | 'rare' | 'luxury' | 'legendary';
  description: string;
  soundType: 'rose' | 'heart' | 'ring' | 'car' | 'yacht' | 'dragon' | 'castle';
}

export interface RechargePlan {
  id: string;
  rupees: number;
  diamonds: number;
  bonusDiamonds: number;
  vipExp: number;
  popular?: boolean;
  tag?: string;
  perks: string[];
}

export interface Transaction {
  id: string;
  type: 'recharge' | 'gift_sent' | 'gift_received' | 'game_reward' | 'bp_purchase';
  diamondsDelta: number;
  rupees?: number;
  paymentMethod?: string;
  description: string;
  timestamp: string;
  status: 'completed' | 'processing';
}

export interface ActiveGiftEffect {
  id: string;
  gift: GiftItem;
  senderName: string;
  receiverName: string;
  count: number;
}
