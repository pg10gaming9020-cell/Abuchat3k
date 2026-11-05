import React, { useState } from 'react';
import { UserProfile, LoginProvider } from '../types';
import { X, Phone, CheckCircle2, ShieldCheck, ArrowRight, RefreshCw } from 'lucide-react';
import { sound } from '../utils/audio';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: UserProfile;
  onLoginSuccess: (user: UserProfile) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onLoginSuccess,
}) => {
  const [activeTab, setActiveTab] = useState<LoginProvider>('google');
  
  // Phone login states
  const [phoneNumber, setPhoneNumber] = useState('9876543210');
  const [countryCode, setCountryCode] = useState('+91');
  const [otpSent, setOtpSent] = useState(false);
  const [otpCode, setOtpCode] = useState(['', '', '', '', '', '']);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [timer, setTimer] = useState(45);

  if (!isOpen) return null;

  const handleGoogleLogin = () => {
    setIsSubmitting(true);
    sound.playClick();
    setTimeout(() => {
      setIsSubmitting(false);
      const googleUser: UserProfile = {
        ...currentUser,
        id: 'user_goog_' + Math.floor(100000 + Math.random() * 900000),
        name: 'Prince_Gamer (Google)',
        email: 'pg10gaming9020@gmail.com',
        loginProvider: 'google',
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&h=200&q=80',
      };
      onLoginSuccess(googleUser);
      sound.playRechargeSuccess();
      onClose();
    }, 600);
  };

  const handleFacebookLogin = () => {
    setIsSubmitting(true);
    sound.playClick();
    setTimeout(() => {
      setIsSubmitting(false);
      const fbUser: UserProfile = {
        ...currentUser,
        id: 'user_fb_' + Math.floor(100000 + Math.random() * 900000),
        name: 'Prince_FB',
        loginProvider: 'facebook',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&h=200&q=80',
      };
      onLoginSuccess(fbUser);
      sound.playRechargeSuccess();
      onClose();
    }, 600);
  };

  const handleSendOtp = () => {
    if (phoneNumber.length < 10) return;
    setIsSubmitting(true);
    sound.playClick();
    setTimeout(() => {
      setIsSubmitting(false);
      setOtpSent(true);
      setOtpCode(['8', '4', '9', '2', '0', '1']); // pre-populate with simulated incoming SMS
    }, 700);
  };

  const handleVerifyOtp = () => {
    setIsSubmitting(true);
    sound.playClick();
    setTimeout(() => {
      setIsSubmitting(false);
      const phoneUser: UserProfile = {
        ...currentUser,
        id: 'user_ph_' + Math.floor(100000 + Math.random() * 900000),
        name: `AbuUser_${phoneNumber.slice(-4)}`,
        phone: `${countryCode} ${phoneNumber}`,
        loginProvider: 'phone',
        avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=200&h=200&q=80',
      };
      onLoginSuccess(phoneUser);
      sound.playRechargeSuccess();
      onClose();
    }, 700);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="relative w-full max-w-md overflow-hidden rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl text-slate-100">
        {/* Glow Header */}
        <div className="relative p-6 pb-4 bg-gradient-to-b from-indigo-950/80 to-slate-900 border-b border-slate-800/80">
          <button
            onClick={onClose}
            className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-500 via-rose-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-rose-500/20 text-2xl font-black">
              🎙️
            </div>
            <div>
              <h2 className="text-xl font-bold font-display tracking-tight text-white flex items-center gap-2">
                AbuChat Login
                <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  Secure
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                Log in to create rooms, recharge diamonds & chat
              </p>
            </div>
          </div>

          {/* Login Mode Switcher */}
          <div className="grid grid-cols-3 gap-1.5 mt-5 p-1 bg-slate-950/80 rounded-xl border border-slate-800">
            <button
              onClick={() => { setActiveTab('google'); sound.playClick(); }}
              className={`py-2 px-3 text-xs font-semibold rounded-lg flex items-center justify-center gap-1.5 transition-all ${
                activeTab === 'google'
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
              }`}
            >
              <GoogleSvg />
              Google
            </button>
            <button
              onClick={() => { setActiveTab('facebook'); sound.playClick(); }}
              className={`py-2 px-3 text-xs font-semibold rounded-lg flex items-center justify-center gap-1.5 transition-all ${
                activeTab === 'facebook'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
              }`}
            >
              <FacebookSvg />
              Facebook
            </button>
            <button
              onClick={() => { setActiveTab('phone'); sound.playClick(); }}
              className={`py-2 px-3 text-xs font-semibold rounded-lg flex items-center justify-center gap-1.5 transition-all ${
                activeTab === 'phone'
                  ? 'bg-emerald-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
              }`}
            >
              <Phone className="w-3.5 h-3.5" />
              Phone OTP
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-5">
          {/* GOOGLE TAB */}
          {activeTab === 'google' && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-slate-800/50 border border-slate-700/60 text-center">
                <div className="w-14 h-14 mx-auto rounded-full bg-white flex items-center justify-center shadow-md mb-3">
                  <GoogleSvg className="w-7 h-7" />
                </div>
                <h3 className="font-semibold text-white text-base">One-Tap Google Sign-In</h3>
                <p className="text-xs text-slate-400 mt-1 max-w-xs mx-auto">
                  Sign in with your Google account for instant cloud backup of diamonds & VIP levels.
                </p>
                <div className="mt-3 text-xs text-slate-300 font-mono bg-slate-900/60 py-1.5 px-3 rounded-lg inline-block border border-slate-800">
                  {currentUser.email || 'pg10gaming9020@gmail.com'}
                </div>
              </div>

              <button
                onClick={handleGoogleLogin}
                disabled={isSubmitting}
                className="w-full py-3.5 px-4 rounded-xl bg-white text-slate-900 font-bold text-sm flex items-center justify-center gap-2 hover:bg-slate-100 active:scale-[0.98] transition-all shadow-lg shadow-white/10"
              >
                {isSubmitting ? (
                  <RefreshCw className="w-4 h-4 animate-spin text-slate-900" />
                ) : (
                  <>
                    <GoogleSvg className="w-4 h-4" />
                    Continue with Google
                  </>
                )}
              </button>
            </div>
          )}

          {/* FACEBOOK TAB */}
          {activeTab === 'facebook' && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-blue-950/30 border border-blue-900/50 text-center">
                <div className="w-14 h-14 mx-auto rounded-full bg-blue-600 flex items-center justify-center shadow-md mb-3 text-white">
                  <FacebookSvg className="w-7 h-7 fill-white" />
                </div>
                <h3 className="font-semibold text-white text-base">Facebook Fast Connect</h3>
                <p className="text-xs text-slate-400 mt-1 max-w-xs mx-auto">
                  Connect your Facebook account to invite FB friends into your live party voice rooms!
                </p>
              </div>

              <button
                onClick={handleFacebookLogin}
                disabled={isSubmitting}
                className="w-full py-3.5 px-4 rounded-xl bg-[#1877F2] text-white font-bold text-sm flex items-center justify-center gap-2 hover:bg-[#166fe5] active:scale-[0.98] transition-all shadow-lg shadow-blue-600/20"
              >
                {isSubmitting ? (
                  <RefreshCw className="w-4 h-4 animate-spin text-white" />
                ) : (
                  <>
                    <FacebookSvg className="w-4 h-4 fill-white" />
                    Continue with Facebook
                  </>
                )}
              </button>
            </div>
          )}

          {/* PHONE TAB */}
          {activeTab === 'phone' && (
            <div className="space-y-4">
              {!otpSent ? (
                <>
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-slate-300">
                      Enter Mobile Number (मोबाइल नंबर दर्ज करें)
                    </label>
                    <div className="flex gap-2">
                      <select
                        value={countryCode}
                        onChange={(e) => setCountryCode(e.target.value)}
                        className="py-3 px-3 rounded-xl bg-slate-800 border border-slate-700 text-white font-semibold text-sm focus:outline-none focus:border-indigo-500"
                      >
                        <option value="+91">🇮🇳 +91 (IN)</option>
                        <option value="+971">🇦🇪 +971 (UAE)</option>
                        <option value="+966">🇸🇦 +966 (KSA)</option>
                        <option value="+1">🇺🇸 +1 (US)</option>
                      </select>
                      <input
                        type="tel"
                        maxLength={10}
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, ''))}
                        placeholder="98765 43210"
                        className="flex-1 py-3 px-4 rounded-xl bg-slate-800 border border-slate-700 text-white text-sm font-mono tracking-wider focus:outline-none focus:border-indigo-500"
                      />
                    </div>
                    <p className="text-[11px] text-slate-500 flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                      An SMS with a 6-digit verification code will be sent
                    </p>
                  </div>

                  <button
                    onClick={handleSendOtp}
                    disabled={phoneNumber.length < 10 || isSubmitting}
                    className="w-full py-3.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-bold text-sm flex items-center justify-center gap-2 active:scale-[0.98] transition-all shadow-lg shadow-emerald-600/20"
                  >
                    {isSubmitting ? (
                      <RefreshCw className="w-4 h-4 animate-spin text-white" />
                    ) : (
                      <>
                        Get OTP (ओटीपी भेजें)
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </>
              ) : (
                <div className="space-y-4">
                  <div className="text-center">
                    <p className="text-xs text-slate-400">
                      Code sent to <span className="text-white font-mono">{countryCode} {phoneNumber}</span>
                    </p>
                    <div className="mt-1 flex items-center justify-center gap-1 text-[11px] text-emerald-400 font-medium">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      SMS Code: 849201 (Simulated Auto-Fill)
                    </div>
                  </div>

                  {/* 6 Digit Box */}
                  <div className="flex justify-between gap-1.5">
                    {otpCode.map((digit, idx) => (
                      <input
                        key={idx}
                        type="text"
                        maxLength={1}
                        value={digit}
                        onChange={(e) => {
                          const val = e.target.value;
                          const next = [...otpCode];
                          next[idx] = val;
                          setOtpCode(next);
                        }}
                        className="w-12 h-12 text-center text-lg font-bold font-mono rounded-xl bg-slate-800 border border-slate-700 focus:border-emerald-500 focus:outline-none text-white shadow-inner"
                      />
                    ))}
                  </div>

                  <div className="flex items-center justify-between text-xs text-slate-400">
                    <button
                      onClick={() => setOtpSent(false)}
                      className="text-slate-400 hover:text-white underline text-[11px]"
                    >
                      Change Number
                    </button>
                    <span className="font-mono text-slate-500">
                      Resend in 00:{timer < 10 ? `0${timer}` : timer}
                    </span>
                  </div>

                  <button
                    onClick={handleVerifyOtp}
                    disabled={isSubmitting || otpCode.some((d) => !d)}
                    className="w-full py-3.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-bold text-sm flex items-center justify-center gap-2 active:scale-[0.98] transition-all shadow-lg shadow-emerald-600/20"
                  >
                    {isSubmitting ? (
                      <RefreshCw className="w-4 h-4 animate-spin text-white" />
                    ) : (
                      <>
                        Verify & Login (सत्यापित करें)
                        <CheckCircle2 className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Guest Info */}
          <div className="pt-2 text-center border-t border-slate-800/80">
            <p className="text-[11px] text-slate-500">
              By continuing, you accept AbuChat Terms of Service & Privacy Policy.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

function GoogleSvg({ className = 'w-4 h-4' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24">
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
      />
    </svg>
  );
}

function FacebookSvg({ className = 'w-4 h-4' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24">
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
    </svg>
  );
}
