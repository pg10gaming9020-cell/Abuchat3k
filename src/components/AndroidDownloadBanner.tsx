import React from 'react';
import { Download, Smartphone, Star, ShieldCheck, QrCode } from 'lucide-react';
import { sound } from '../utils/audio';

interface AndroidDownloadBannerProps {
  onOpenDownloadModal: () => void;
  lang?: 'en' | 'hi';
}

export const AndroidDownloadBanner: React.FC<AndroidDownloadBannerProps> = ({
  onOpenDownloadModal,
  lang = 'hi',
}) => {
  return (
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-emerald-950/60 via-slate-900 to-indigo-950/70 border border-emerald-500/30 p-4 sm:p-5 shadow-xl flex flex-col md:flex-row items-center justify-between gap-4">
      {/* Decorative Glow */}
      <div className="absolute -top-12 -left-12 w-36 h-36 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />

      {/* App Identity & Rating */}
      <div className="flex items-center gap-3.5 z-10 w-full md:w-auto">
        <div className="relative w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-tr from-emerald-500 via-teal-400 to-indigo-600 p-0.5 shadow-lg shrink-0">
          <div className="w-full h-full rounded-[14px] bg-slate-950 flex flex-col items-center justify-center">
            <span className="text-2xl sm:text-3xl">🎙️</span>
          </div>
          <span className="absolute -bottom-1 -right-1 bg-emerald-500 text-black text-[8px] font-black px-1.5 rounded-full">
            APK
          </span>
        </div>

        <div>
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-sm sm:text-base font-extrabold text-white font-display">
              AbuChat Android App
            </span>
            <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-bold border border-emerald-500/30">
              Google Play 4.8 ★
            </span>
          </div>
          <p className="text-xs text-slate-300 mt-0.5">
            {lang === 'hi'
              ? 'एंड्रॉइड फोन में डाउनलोड करें — बिना किसी लैग के क्रिस्टल-क्लियर वॉइस पार्टी!'
              : 'Download for Android Phone — Low-latency party audio & push alerts.'}
          </p>
          <div className="flex items-center gap-3 text-[11px] text-slate-400 mt-1">
            <span className="flex items-center gap-1 text-emerald-400">
              <ShieldCheck className="w-3.5 h-3.5" />
              Play Protect Safe
            </span>
            <span>• 10M+ Downloads</span>
            <span>• 28 MB</span>
          </div>
        </div>
      </div>

      {/* Buttons */}
      <div className="flex items-center gap-2.5 z-10 w-full md:w-auto justify-end">
        <button
          onClick={() => {
            sound.playClick();
            onOpenDownloadModal();
          }}
          className="flex-1 md:flex-initial py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 active:scale-[0.98] text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/25 transition-all"
        >
          {/* Google Play mini logo */}
          <svg className="w-4 h-4 shrink-0" viewBox="0 0 512 512">
            <path fill="#00a0ff" d="M47.7 21.6L275.5 249.4 69.3 455.6c-4.4-4.8-7.1-11.2-7.1-18.3V74.7c0-7.1 2.7-13.5 7.1-18.3l-21.6-34.8z" />
            <path fill="#00e676" d="M356.5 168.4L275.5 249.4 47.7 21.6c6.2-4.1 13.6-6.6 21.6-6.6h287.2z" />
            <path fill="#ffd600" d="M455.8 238.9l-99.3-70.5-81 81 81 81 99.3-70.5c10.4-7.4 10.4-23.6 0-31z" />
            <path fill="#ff3d00" d="M69.3 455.6l206.2-206.2 81 81-287.2 0c-8 0-15.4-2.5-21.6-6.6l21.6 131.8z" />
          </svg>
          <span>{lang === 'hi' ? 'प्ले स्टोर ऐप डाउनलोड' : 'Download Play Store App'}</span>
        </button>

        <button
          onClick={() => {
            sound.playClick();
            onOpenDownloadModal();
          }}
          className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition"
          title="Scan QR Code"
        >
          <QrCode className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
