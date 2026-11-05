# AbuChat - User Profile, Diamond Balance & Recharge History

Comprehensive implementation plan for building a dedicated User Profile and Wallet section in AbuChat, featuring live diamond balance display, complete recharge transaction history with exact dates/times, payment gateway filters (UPI/PhonePe/GPay/Card), VIP status card, and room BP (wallpaper/backpack) controls.

## User Review & Critical Decisions

> [!IMPORTANT]
> The profile section will serve as the financial and identity hub for AbuChat users. Key specifications include:
> - **Unified Wallet & Ledger**: Displays real-time Diamond balance (`💎`), Charm points (`🌸`), and VIP level progression alongside an interactive Recharge button.
> - **Detailed Transaction Ledger**: Every recharge and diamond event records exact timestamp (e.g. `Nov 5, 2026 · 11:15 AM`), payment provider (PhonePe, GPay, Paytm, UPI, Card), transaction ID reference (`TXN-902914`), status tag (`Completed`), and diamond credit amount.
> - **Transaction Filters**: Filter tabs for **All Transactions**, **Recharges Only (+💎)**, **Gifts Sent (-💎)**, and **BP/VIP Store (-💎)**.
> - **VIP & BP (Background Picture) Center**: Direct access to change room wallpapers (Room BP), avatar frames, and vehicle entrance effects.

---

### 1. Overview & Core Concept

- **What It Delivers**: A mobile-first, responsive profile and financial management view allowing users to inspect their current diamond balance, review all past recharge transactions by date, initiate new diamond top-ups, edit their user profile, and manage VIP/BP perks.
- **Target Audience**: Voice chat partygoers, room hosts, and gifters in AbuChat who recharge diamonds via UPI/QR/Cards and need transparent accounting of their top-ups and expenditures.
- **Key Value**: Instant visibility of coin/diamond wallet balances, clear audit trail of recharges with dates and payment references, and effortless account switching between Google, Facebook, and Phone OTP.

---

### 2. User Experience & Visual Design

#### Visual Identity & Theme
- **Dominant Neutral Field**: Deep obsidian midnight (`#020617` / `slate-950`) with rich dark slate container cards (`#0f172a` / `slate-900`) and subtle hairline borders (`border-slate-800`).
- **Accent Budget**: Glowing golden amber (`#f59e0b`), royal violet (`#6366f1`), and energetic rose for VIP and diamond highlights.
- **Typography**: `Outfit` for display headings and numbers; `Plus Jakarta Sans` for clean, readable metadata and UI copy. Tabular numerals (`tabular-nums font-mono`) for balances, transaction amounts, and timestamps.
- **Ergonomics**: Mobile thumb-friendly action buttons ($\ge 44\text{px}$ touch targets), clean unboxed metadata with `·` separators, and sticky quick-action bar.

#### Key User Flows & Interfaces
1. **VIP Profile Header**:
   - High-resolution user avatar with active VIP ring/frame.
   - User name, AbuChat ID (`ABU-9020`) with 1-click copy button, and login provider tag (Google / Facebook / Phone).
   - VIP Rank Badge (VIP 1 to VIP 8) with an interactive XP progress bar (`420 / 650 XP to VIP 3`).
   - "Edit Profile" button to change name, bio, and gender.
2. **Diamond & Charm Balance Showcase**:
   - Prominent Diamond Wallet Card with shimmering gem counter (`1,540 💎`).
   - Charm Points counter (`340 🌸`) earned from receiving gifts.
   - Primary "Recharge Diamonds / रिचार्ज करें" CTA leading to the instant recharge modal.
3. **Recharge & Transaction History Ledger**:
   - Filter chips: `All` · `Recharges (+💎)` · `Gifts Sent (-💎)` · `BP / VIP (-💎)`.
   - Each transaction row displays:
     - Icon based on event type (UPI/Bank icon for recharge, Gift box for gifts, Crown for VIP).
     - Title (e.g. *Recharge via PhonePe UPI*, *Sent 5x Red Rose to Priya*).
     - Exact Date & Time: e.g. `05 Nov 2026, 11:20 AM`.
     - Transaction reference code: `REF#AP-884920`.
     - Amount in tabular numerals with colored sign: `+1,200 💎` (Emerald) or `-50 💎` (Rose).
     - Status tag: `Success` with green checkmark.
   - Date grouping (Today, Yesterday, Earlier) and empty state illustration if no transactions match.
4. **Quick Shortcuts Strip**:
   - **BP & Room Wallpaper Store**: Change room background wallpapers and backpack items.
   - **Login & Switch Account**: Fast login with Google, Facebook, or Phone OTP.
   - **Language Toggle**: Instant switch between Hindi (हिन्दी) and English.

---

### 3. Key Product Decisions & Trade-Offs

- **Decision 1: Full-Screen Dedicated View + Accessible Floating Mini-Bar**:
  - *Chosen Approach*: Implement a primary "Profile & Wallet" tab in the bottom navigation bar and desktop header, while also keeping quick diamond balance badges on top of live chat rooms.
  - *Why*: Gives ample breathing room for the full transaction ledger, date breakdowns, and VIP perks without cramping the interface.
- **Decision 2: Unified Transaction State with LocalStorage Persistence**:
  - *Chosen Approach*: Persist all recharges, gift transfers, and BP purchases in a structured transaction log stored in `localStorage`.
  - *Why*: Recharging diamonds immediately adds a real transaction with the exact date/timestamp, and refreshing the browser preserves the user's balance and history.
- **Decision 3: Integrated Date-Time Formatting**:
  - *Chosen Approach*: Store ISO strings and render localized dates (e.g., `Today at 11:20 AM` or `Nov 05, 2026 · 11:20 AM`) with reference IDs.
  - *Why*: High credibility and transparent ledger tracking matching top social voice applications.

---

### 4. Technical Architecture & Data Strategy

```
┌────────────────────────────────────────────────────────────────────────┐
│                              AbuChat App                               │
│      (Top Nav · Voice Rooms · Recharge Mall · VIP BP · Profile)        │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │
          ┌─────────────────────────┼─────────────────────────┐
          ▼                         ▼                         ▼
┌──────────────────┐      ┌──────────────────┐      ┌──────────────────┐
│  UserProfileTab  │      │  RechargeModal   │      │   LiveRoomView   │
│  - Diamond Card  │      │  - UPI QR / GPay │      │  - 8-12 Mic Grid │
│  - VIP XP Bar    │◄────►│  - Plans ₹49-₹5k │◄────►│  - Gift Shower   │
│  - Txn History   │      │  - Adds Txn Log  │      │  - Room BP Stage │
│  - Date Filters  │      │  - Instant 💎    │      │  - Voice Waves   │
└─────────┬────────┘      └─────────┬────────┘      └─────────┬────────┘
          │                         │                         │
          └─────────────────────────┼─────────────────────────┘
                                    ▼
                     ┌──────────────────────────────┐
                     │   AbuChat Persistent Store   │
                     │  - User Profile & VIP Exp    │
                     │  - Diamond & Charm Balance   │
                     │  - Full Transaction History  │
                     │  - Active Rooms & Mic Seats  │
                     └──────────────────────────────┘
```

#### Component & State Mapping
- `src/components/UserProfileView.tsx`: Main profile screen featuring the VIP card, Diamond balance display, Recharge shortcut, and chronological transaction ledger with date filters.
- `src/components/RechargeModal.tsx`: UPI QR, PhonePe, GPay, Paytm, and Card payment flow; credits diamonds and appends new timestamped transactions.
- `src/components/VipBpModal.tsx`: Room wallpaper (BP) selector and VIP backpack equipment.
- `src/components/LiveRoomView.tsx`: Real-time voice room stage with mic seats, animated gifting, and dynamic room BP theme.
- `src/components/CreateRoomModal.tsx`: Room creation with custom seat count, privacy PIN, and BP wallpaper theme.
- `src/components/AuthModal.tsx`: Multi-auth login with Google, Facebook, and Phone OTP.
