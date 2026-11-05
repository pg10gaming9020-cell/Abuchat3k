import React, { useEffect, useState } from 'react';
import { ActiveGiftEffect } from '../types';

interface FullscreenGiftAnimationProps {
  effect: ActiveGiftEffect | null;
  onComplete: () => void;
}

export const FullscreenGiftAnimation: React.FC<FullscreenGiftAnimationProps> = ({
  effect,
  onComplete,
}) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (effect) {
      setVisible(true);
      const timer = setTimeout(() => {
        setVisible(false);
        onComplete();
      }, 3500);
      return () => clearTimeout(timer);
    }
  }, [effect, onComplete]);

  if (!effect || !visible) return null;

  const isCar = effect.gift.soundType === 'car';
  const isDragon = effect.gift.soundType === 'dragon';
  const isCastle = effect.gift.soundType === 'castle';

  return (
    <div className="fixed inset-0 z-50 pointer-events-none flex flex-col justify-between p-6 overflow-hidden">
      {/* Top Banner Notice */}
      <div className="mx-auto mt-16 max-w-lg w-full animate-bounce">
        <div className="p-3 px-5 rounded-full bg-gradient-to-r from-amber-500 via-rose-500 to-indigo-600 text-white font-bold text-xs sm:text-sm shadow-2xl flex items-center justify-center gap-2 border border-white/30 backdrop-blur-md">
          <span className="text-xl">🎁</span>
          <span className="text-yellow-200">{effect.senderName}</span>
          <span className="text-white/80 font-normal">sent</span>
          <span className="text-amber-200">
            {effect.gift.icon} {effect.gift.name} x{effect.count}
          </span>
          <span className="text-white/80 font-normal">to</span>
          <span className="text-rose-200">{effect.receiverName}</span>
        </div>
      </div>

      {/* Center Cinematic Animation Asset */}
      <div className="my-auto flex items-center justify-center relative">
        {isCar ? (
          <div className="relative animate-drive-across flex flex-col items-center">
            <span className="text-8xl sm:text-9xl drop-shadow-[0_15px_35px_rgba(239,68,68,0.7)]">
              🏎️
            </span>
            <div className="w-48 h-3 rounded-full bg-gradient-to-r from-transparent via-amber-400 to-transparent blur-sm -mt-3" />
          </div>
        ) : isDragon ? (
          <div className="relative animate-soar-dragon flex flex-col items-center">
            <span className="text-8xl sm:text-9xl drop-shadow-[0_20px_45px_rgba(245,158,11,0.8)] animate-pulse">
              🐉
            </span>
            <span className="text-xs font-bold font-mono text-amber-300 bg-black/60 px-3 py-1 rounded-full border border-amber-500/40 mt-2">
              LEGENDARY DRAGON FLIGHT
            </span>
          </div>
        ) : isCastle ? (
          <div className="relative flex flex-col items-center animate-scale-up">
            <span className="text-8xl sm:text-9xl drop-shadow-[0_25px_50px_rgba(168,85,247,0.8)]">
              🏰
            </span>
            <div className="text-center mt-3">
              <span className="text-sm font-extrabold text-amber-300 tracking-wider">
                IMPERIAL CASTLE CEREMONY
              </span>
            </div>
          </div>
        ) : (
          <div className="relative flex flex-col items-center animate-scale-up">
            <div className="text-7xl sm:text-8xl animate-bounce drop-shadow-[0_10px_25px_rgba(244,63,94,0.6)]">
              {effect.gift.icon}
            </div>
            <span className="text-xs font-bold text-amber-300 mt-2 bg-black/60 px-3 py-1 rounded-full border border-slate-700">
              {effect.gift.name} x{effect.count}
            </span>
          </div>
        )}
      </div>

      <div className="h-10" />
    </div>
  );
};
