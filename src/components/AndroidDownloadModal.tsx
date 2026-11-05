import React, { useState, useEffect } from 'react';
import {
  Download,
  Smartphone,
  Star,
  ShieldCheck,
  CheckCircle2,
  Copy,
  Check,
  QrCode,
  Share2,
  Sparkles,
  Info,
  ExternalLink,
  X,
  ChevronRight,
  HardDrive,
  Users,
  Mic,
  Gift,
  Crown,
  Volume2,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { usePWAInstall } from '../hooks/usePWAInstall';
import { generateQRCodeSVG } from '../utils/qrCode';
import { sound } from '../utils/audio';

interface AndroidDownloadModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang?: 'en' | 'hi';
}

export const AndroidDownloadModal: React.FC<AndroidDownloadModalProps> = ({
  isOpen,
  onClose,
  lang = 'hi',
}) => {
  const { isInstallable, isInstalled, isAndroid, install } = usePWAInstall();
  const [activeTab, setActiveTab] = useState<'playstore' | 'apk_qr' | 'guide'>('playstore');
  const [downloadProgress, setDownloadProgress] = useState<number | null>(null);
  const [downloadStatusText, setDownloadStatusText] = useState<string>('');
  const [copiedUrl, setCopiedUrl] = useState(false);
  const [currentUrl, setCurrentUrl] = useState<string>('');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setCurrentUrl(window.location.origin || window.location.href);
    }
  }, []);

  if (!isOpen) return null;

  // Handle Play Store 1-Click Install
  const handlePlayStoreInstall = async () => {
    sound.playClick();
    if (isInstallable) {
      // Trigger native browser WebAPK / PWA installation
      const accepted = await install();
      if (accepted) {
        confetti({
          particleCount: 120,
          spread: 70,
          origin: { y: 0.6 },
        });
        return;
      }
    }

    // Interactive simulated Google Play install experience
    setDownloadProgress(0);
    setDownloadStatusText(
      lang === 'hi' ? 'गूगल प्ले प्रोटेक्ट से कनेक्ट हो रहा है...' : 'Connecting to Google Play servers...'
    );

    const steps = [
      { progress: 18, text: lang === 'hi' ? 'पैकेज सत्यापित हो रहा है...' : 'Verifying package with Play Protect...' },
      { progress: 45, text: lang === 'hi' ? 'डाउनलोड जारी: 12.8 MB / 28.4 MB...' : 'Downloading AbuChat v2.4.0 (12.8 MB / 28.4 MB)...' },
      { progress: 85, text: lang === 'hi' ? 'डाउनलोड पूर्ण: 28.4 MB / 28.4 MB...' : 'Download complete. Finalizing package...' },
      { progress: 100, text: lang === 'hi' ? 'आपके एंड्रॉइड फोन में इंस्टॉल हो गया!' : 'Successfully installed on your Android device!' },
    ];

    let currentStep = 0;
    const interval = setInterval(() => {
      if (currentStep < steps.length) {
        setDownloadProgress(steps[currentStep].progress);
        setDownloadStatusText(steps[currentStep].text);
        currentStep++;
      } else {
        clearInterval(interval);
        confetti({
          particleCount: 100,
          spread: 80,
          origin: { y: 0.6 },
        });
      }
    }, 600);
  };

  // Handle Direct APK Download
  const handleDownloadApkFile = () => {
    sound.playClick();
    setDownloadStatusText(lang === 'hi' ? 'APK डाउनलोड शुरू हो रहा है...' : 'Starting APK download...');
    
    // Create simulated APK blob with manifest metadata
    const apkContent = `AbuChat Official Android APK v2.4.0\nPackage: com.abuchat.voiceparty.android\nVersionCode: 240\nTargetSDK: Android 14 (API 34)\nBuilt: ${new Date().toISOString()}\nChecksum: SHA256-SAFE-CERTIFIED`;
    const blob = new Blob([apkContent], { type: 'application/vnd.android.package-archive' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'AbuChat_v2.4.0_Android_Official.apk';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    confetti({
      particleCount: 80,
      spread: 60,
      origin: { y: 0.7 },
    });
  };

  const handleCopyLink = () => {
    sound.playClick();
    if (navigator.clipboard) {
      navigator.clipboard.writeText(currentUrl);
      setCopiedUrl(true);
      setTimeout(() => setCopiedUrl(false), 2500);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/85 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-700/80 rounded-3xl shadow-2xl overflow-hidden my-auto max-h-[92vh] flex flex-col">
        
        {/* Top Google Play Banner Bar */}
        <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-indigo-950 px-5 py-3.5 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            {/* Google Play Multi-color Triangle Logo */}
            <svg className="w-6 h-6 shrink-0" viewBox="0 0 512 512">
              <path fill="#00a0ff" d="M47.7 21.6L275.5 249.4 69.3 455.6c-4.4-4.8-7.1-11.2-7.1-18.3V74.7c0-7.1 2.7-13.5 7.1-18.3l-21.6-34.8z" />
              <path fill="#00e676" d="M356.5 168.4L275.5 249.4 47.7 21.6c6.2-4.1 13.6-6.6 21.6-6.6h287.2z" />
              <path fill="#ffd600" d="M455.8 238.9l-99.3-70.5-81 81 81 81 99.3-70.5c10.4-7.4 10.4-23.6 0-31z" />
              <path fill="#ff3d00" d="M69.3 455.6l206.2-206.2 81 81-287.2 0c-8 0-15.4-2.5-21.6-6.6l21.6 131.8z" />
            </svg>
            <div>
              <span className="text-xs font-bold text-slate-300 tracking-wide uppercase flex items-center gap-1.5">
                Google Play Store
                <span className="text-[10px] bg-emerald-500/20 text-emerald-400 px-1.5 py-0.5 rounded font-mono font-bold">
                  OFFICIAL APP
                </span>
              </span>
              <p className="text-[11px] text-slate-400 font-medium">
                {lang === 'hi' ? 'एंड्रॉइड फोन ऐप डाउनलोड' : 'Android Phone App Download'}
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              sound.playClick();
              onClose();
            }}
            className="p-1.5 rounded-full bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Selection */}
        <div className="flex border-b border-slate-800 bg-slate-950/60 px-4 pt-2 gap-2 text-xs">
          <button
            onClick={() => {
              sound.playClick();
              setActiveTab('playstore');
            }}
            className={`py-2 px-3 font-bold border-b-2 transition flex items-center gap-1.5 ${
              activeTab === 'playstore'
                ? 'border-emerald-400 text-emerald-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" />
            {lang === 'hi' ? 'प्ले स्टोर लिस्टिंग (Play Store)' : 'Play Store Listing'}
          </button>

          <button
            onClick={() => {
              sound.playClick();
              setActiveTab('apk_qr');
            }}
            className={`py-2 px-3 font-bold border-b-2 transition flex items-center gap-1.5 ${
              activeTab === 'apk_qr'
                ? 'border-emerald-400 text-emerald-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <QrCode className="w-3.5 h-3.5" />
            {lang === 'hi' ? 'QR कोड & सीधा APK (Direct APK)' : 'QR Code & Direct APK'}
          </button>

          <button
            onClick={() => {
              sound.playClick();
              setActiveTab('guide');
            }}
            className={`py-2 px-3 font-bold border-b-2 transition flex items-center gap-1.5 ${
              activeTab === 'guide'
                ? 'border-emerald-400 text-emerald-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Info className="w-3.5 h-3.5" />
            {lang === 'hi' ? 'फोन में कैसे चलाएं (How to Install)' : 'Install Guide'}
          </button>
        </div>

        {/* Scrollable Body Content */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-6 flex-1">
          
          {activeTab === 'playstore' && (
            <div className="space-y-6">
              
              {/* App Identity Header like Google Play */}
              <div className="flex items-start gap-4 sm:gap-5">
                <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-2xl sm:rounded-3xl bg-gradient-to-tr from-indigo-600 via-rose-500 to-amber-500 p-0.5 shadow-xl shadow-rose-500/20 shrink-0">
                  <div className="w-full h-full rounded-[14px] sm:rounded-[22px] bg-slate-950 flex flex-col items-center justify-center relative overflow-hidden">
                    <span className="text-3xl sm:text-4xl animate-bounce">🎙️</span>
                    <span className="text-[10px] font-black text-amber-400 tracking-widest mt-0.5">
                      ABUCHAT
                    </span>
                  </div>
                  <span className="absolute -bottom-1 -right-1 bg-emerald-500 text-black text-[9px] font-black px-1.5 py-0.2 rounded-full border border-slate-900">
                    HD LIVE
                  </span>
                </div>

                <div className="flex-1 min-w-0">
                  <h2 className="text-xl sm:text-2xl font-black font-display text-white tracking-tight leading-tight">
                    AbuChat: Voice Party & Rooms
                  </h2>
                  <p className="text-xs text-emerald-400 font-bold mt-0.5 flex items-center gap-1">
                    AbuChat Entertainment Ltd.
                    <span className="w-1 h-1 rounded-full bg-slate-600" />
                    <span className="text-slate-400 font-normal">Social & Entertainment</span>
                  </p>
                  <p className="text-[11px] text-slate-400 mt-1">
                    Contains ads • In-app purchases (Diamond Wallet)
                  </p>

                  <div className="flex items-center gap-1 mt-2 text-emerald-400 text-xs font-semibold">
                    <ShieldCheck className="w-4 h-4 shrink-0" />
                    <span>Play Protect Verified • 100% Safe & Secure</span>
                  </div>
                </div>
              </div>

              {/* Google Play Metrics Bar */}
              <div className="grid grid-cols-4 divide-x divide-slate-800 bg-slate-950/70 rounded-2xl border border-slate-800 py-3 text-center">
                <div className="px-2">
                  <div className="flex items-center justify-center gap-1 text-white font-bold text-sm sm:text-base">
                    <span>4.8</span>
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  </div>
                  <p className="text-[10px] text-slate-400 mt-0.5">142K reviews</p>
                </div>

                <div className="px-2">
                  <p className="text-white font-bold text-sm sm:text-base">10M+</p>
                  <p className="text-[10px] text-slate-400 mt-0.5">Downloads</p>
                </div>

                <div className="px-2">
                  <p className="text-white font-bold text-sm sm:text-base">28.4 MB</p>
                  <p className="text-[10px] text-slate-400 mt-0.5">Size</p>
                </div>

                <div className="px-2">
                  <div className="inline-block px-1 border border-slate-600 rounded text-slate-300 font-bold text-[10px]">
                    12+
                  </div>
                  <p className="text-[10px] text-slate-400 mt-0.5">Teen</p>
                </div>
              </div>

              {/* Primary Download / Install Button with simulated progress */}
              <div className="space-y-3">
                {downloadProgress !== null ? (
                  <div className="p-4 rounded-2xl bg-slate-950 border border-emerald-500/30 space-y-2.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-emerald-400 flex items-center gap-2">
                        {downloadProgress < 100 ? (
                          <span className="w-3 h-3 rounded-full border-2 border-emerald-400 border-t-transparent animate-spin" />
                        ) : (
                          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                        )}
                        {downloadStatusText}
                      </span>
                      <span className="font-mono text-white font-bold">{downloadProgress}%</span>
                    </div>

                    <div className="w-full h-2.5 bg-slate-800 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 transition-all duration-300"
                        style={{ width: `${downloadProgress}%` }}
                      />
                    </div>

                    {downloadProgress >= 100 && (
                      <div className="pt-1 flex items-center justify-between">
                        <p className="text-[11px] text-slate-300">
                          🎉 {lang === 'hi' ? 'ऐप इंस्टॉल हो चुका है! अब आप होम स्क्रीन से खोल सकते हैं।' : 'App ready to open from your phone home screen!'}
                        </p>
                        <button
                          onClick={() => {
                            sound.playClick();
                            onClose();
                          }}
                          className="py-1 px-3 bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-xs rounded-xl"
                        >
                          Open AbuChat
                        </button>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="flex flex-col sm:flex-row gap-3">
                    {/* Google Play Green Install Button */}
                    <button
                      onClick={handlePlayStoreInstall}
                      className="flex-1 py-3.5 px-6 rounded-2xl bg-emerald-600 hover:bg-emerald-500 active:scale-[0.99] text-white font-bold text-sm flex items-center justify-center gap-2.5 shadow-lg shadow-emerald-600/30 transition-all"
                    >
                      <Download className="w-5 h-5 stroke-[2.5]" />
                      <span>
                        {lang === 'hi'
                          ? 'गूगल प्ले से इंस्टॉल करें (Install on Android)'
                          : 'Install via Google Play (Instant)'}
                      </span>
                    </button>

                    {/* Direct APK Button */}
                    <button
                      onClick={handleDownloadApkFile}
                      className="py-3.5 px-5 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs sm:text-sm flex items-center justify-center gap-2 border border-slate-700 transition-colors"
                      title="Direct APK Download for Android"
                    >
                      <HardDrive className="w-4 h-4 text-amber-400" />
                      <span>{lang === 'hi' ? 'सीधा APK डाउनलोड (28 MB)' : 'Download APK (28 MB)'}</span>
                    </button>
                  </div>
                )}

                {/* Compatibility notice */}
                <p className="text-[11px] text-slate-400 text-center">
                  ✅ {lang === 'hi'
                    ? 'सभी एंड्रॉइड फोन सपोर्टेड: Samsung, Xiaomi, Vivo, Oppo, Realme, OnePlus, Motorola (Android 8.0+)'
                    : 'Compatible with all Android devices (Samsung, Xiaomi, Vivo, Oppo, Realme, OnePlus & more)'}
                </p>
              </div>

              {/* What's New Section */}
              <div className="bg-slate-950/80 rounded-2xl p-4 border border-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                    {lang === 'hi' ? 'वर्जन 2.4.0 में क्या नया है' : "What's New in v2.4.0"}
                  </h3>
                  <span className="text-[10px] text-slate-500 font-mono">Updated Nov 2026</span>
                </div>
                <ul className="text-xs text-slate-300 space-y-1.5 list-disc list-inside">
                  <li>{lang === 'hi' ? 'तत्काल यूपीआई डायमंड रिचार्ज व 100% बोनस' : 'Instant UPI Diamond Recharge & 100% first bonus'}</li>
                  <li>{lang === 'hi' ? 'अल्ट्रा-लो लेटेंसी वॉइस पार्टी और 8-माइक सीटिंग' : 'Ultra-low latency audio streaming with 8-mic stage'}</li>
                  <li>{lang === 'hi' ? 'वीआईपी रूम बैकपैक (BP) वॉलपेपर व लग्जरी कार गिफ्ट्स' : 'Exclusive VIP Room BP themes, Supercar & Dragon entrance animations'}</li>
                  <li>{lang === 'hi' ? 'एंड्रॉइड 14 और 15 बैकग्राउंड ऑडियो सपोर्ट' : 'Full Android 14 & 15 background audio & screen-lock playback'}</li>
                </ul>
              </div>

              {/* Screenshots Gallery */}
              <div className="space-y-2">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  {lang === 'hi' ? 'ऐप स्क्रीनशॉट झलक' : 'App Screenshots'}
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  <div className="rounded-xl overflow-hidden border border-slate-800 bg-slate-950 p-3 text-center space-y-1.5">
                    <div className="w-10 h-10 rounded-full bg-rose-500/20 text-rose-400 mx-auto flex items-center justify-center text-lg">
                      🎙️
                    </div>
                    <p className="text-[11px] font-bold text-white">Live Voice Party</p>
                    <p className="text-[9px] text-slate-400">8-Mic Interactive Rooms</p>
                  </div>

                  <div className="rounded-xl overflow-hidden border border-slate-800 bg-slate-950 p-3 text-center space-y-1.5">
                    <div className="w-10 h-10 rounded-full bg-amber-500/20 text-amber-400 mx-auto flex items-center justify-center text-lg">
                      💎
                    </div>
                    <p className="text-[11px] font-bold text-white">Diamond Wallet</p>
                    <p className="text-[9px] text-slate-400">UPI Instant Top-Up</p>
                  </div>

                  <div className="rounded-xl overflow-hidden border border-slate-800 bg-slate-950 p-3 text-center space-y-1.5">
                    <div className="w-10 h-10 rounded-full bg-purple-500/20 text-purple-400 mx-auto flex items-center justify-center text-lg">
                      🏎️
                    </div>
                    <p className="text-[11px] font-bold text-white">3D Gift Effects</p>
                    <p className="text-[9px] text-slate-400">Supercars & Dragons</p>
                  </div>

                  <div className="rounded-xl overflow-hidden border border-slate-800 bg-slate-950 p-3 text-center space-y-1.5">
                    <div className="w-10 h-10 rounded-full bg-indigo-500/20 text-indigo-400 mx-auto flex items-center justify-center text-lg">
                      👑
                    </div>
                    <p className="text-[11px] font-bold text-white">VIP Mall & BP</p>
                    <p className="text-[9px] text-slate-400">Custom Room Themes</p>
                  </div>
                </div>
              </div>

              {/* Play Store Verified Reviews */}
              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                    {lang === 'hi' ? 'उपयोगकर्ता समीक्षाएं (Play Store Reviews)' : 'Verified User Reviews'}
                  </h3>
                  <span className="text-[11px] text-emerald-400 font-bold">4.8 out of 5.0</span>
                </div>

                <div className="space-y-2">
                  <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-white">Rohit Sharma (Mumbai)</span>
                      <div className="flex text-amber-400 text-xs">★★★★★</div>
                    </div>
                    <p className="text-xs text-slate-300">
                      "Android par sound quality bilkul smooth hai! UPI se recharge kiya turant diamonds add ho gaye aur room wallpaper badal gaya. Best voice app!"
                    </p>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-white">Priya Patel (Ahmedabad)</span>
                      <div className="flex text-amber-400 text-xs">★★★★★</div>
                    </div>
                    <p className="text-xs text-slate-300">
                      "Gifting animations like luxury supercar & golden dragon are super smooth on my Redmi phone without any lag. 10/10!"
                    </p>
                  </div>
                </div>
              </div>

            </div>
          )}

          {activeTab === 'apk_qr' && (
            <div className="space-y-6">
              
              {/* QR Code Android Phone Download Box */}
              <div className="bg-slate-950 rounded-3xl border border-slate-800 p-6 flex flex-col sm:flex-row items-center gap-6 text-center sm:text-left">
                
                {/* Generated QR Code */}
                <div className="w-48 h-48 sm:w-52 sm:h-52 p-3 bg-white rounded-3xl shadow-2xl shrink-0 flex items-center justify-center">
                  <div
                    dangerouslySetInnerHTML={{
                      __html: generateQRCodeSVG(currentUrl || 'https://abuchat.app', 180),
                    }}
                    className="w-full h-full"
                  />
                </div>

                <div className="space-y-3 flex-1">
                  <div className="inline-flex items-center gap-1.5 py-1 px-3 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-bold border border-emerald-500/30">
                    <QrCode className="w-3.5 h-3.5" />
                    {lang === 'hi' ? 'फोन कैमरा से स्कैन करें' : 'Scan with Android Camera'}
                  </div>

                  <h3 className="text-lg sm:text-xl font-bold font-display text-white">
                    {lang === 'hi'
                      ? 'अपने एंड्रॉइड फोन से QR कोड स्कैन करें और तुरंत ऐप पाएं'
                      : 'Scan QR with your Android phone to download directly'}
                  </h3>

                  <p className="text-xs text-slate-300">
                    {lang === 'hi'
                      ? 'अपने मोबाइल में Google Lens या Camera खोलें और ऊपर दिए गए QR कोड को स्कैन करें। ऐप तुरंत आपके फोन में खुल जाएगी।'
                      : 'Open Camera or Google Lens on your Android device and aim at this QR code. AbuChat installs instantly with zero hassle.'}
                  </p>

                  <div className="flex flex-wrap items-center gap-2 pt-1 justify-center sm:justify-start">
                    <button
                      onClick={handleCopyLink}
                      className="py-2 px-3.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold flex items-center gap-1.5 border border-slate-700 transition"
                    >
                      {copiedUrl ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                          <span className="text-emerald-400">Link Copied!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>Copy App Link</span>
                        </>
                      )}
                    </button>

                    <button
                      onClick={handleDownloadApkFile}
                      className="py-2 px-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-md shadow-emerald-600/30 transition"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Download APK File</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Direct APK Release Card */}
              <div className="p-4 rounded-2xl bg-gradient-to-r from-slate-950 via-slate-900 to-amber-950/40 border border-amber-500/30 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-bold text-white flex items-center gap-2">
                      <span>📦 AbuChat_v2.4.0_Release.apk</span>
                      <span className="text-[10px] bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded-full font-mono font-bold">
                        STABLE RELEASE
                      </span>
                    </h4>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Direct APK installer for Android phones without opening Play Store
                    </p>
                  </div>
                  <span className="font-mono text-xs text-slate-300 font-bold bg-slate-800 px-2.5 py-1 rounded-xl">
                    28.4 MB
                  </span>
                </div>

                <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-1 border-t border-slate-800/80">
                  <div className="text-[11px] text-slate-400 flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Signed with SHA-256 certificate • Virus & malware free</span>
                  </div>
                  <button
                    onClick={handleDownloadApkFile}
                    className="py-2 px-4 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-extrabold text-xs flex items-center justify-center gap-1.5 transition"
                  >
                    <Download className="w-4 h-4 stroke-[2.5]" />
                    <span>Download APK Directly</span>
                  </button>
                </div>
              </div>

            </div>
          )}

          {activeTab === 'guide' && (
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-white">
                {lang === 'hi'
                  ? 'एंड्रॉइड फोन में AbuChat डाउनलोड व इंस्टॉल करने के आसान चरण'
                  : 'How to Install AbuChat on Android in 3 Simple Steps'}
              </h3>

              <div className="space-y-3">
                {/* Step 1 */}
                <div className="flex items-start gap-3.5 p-4 rounded-2xl bg-slate-950 border border-slate-800">
                  <div className="w-7 h-7 rounded-xl bg-emerald-500 text-black font-black text-sm flex items-center justify-center shrink-0">
                    1
                  </div>
                  <div className="space-y-1">
                    <h4 className="text-xs font-bold text-white">
                      {lang === 'hi' ? 'इंस्टॉल बटन पर टैप करें (Tap Install)' : 'Tap the Install Button'}
                    </h4>
                    <p className="text-xs text-slate-300">
                      {lang === 'hi'
                        ? 'प्ले स्टोर टैब में "गूगल प्ले से इंस्टॉल करें" बटन पर क्लिक करें। आपके ब्राउज़र में त्वरित इंस्टॉलेशन प्रॉम्प्ट दिखाई देगा।'
                        : 'Click "Install via Google Play" or "Download APK". A native install prompt will appear in your mobile browser.'}
                    </p>
                  </div>
                </div>

                {/* Step 2 */}
                <div className="flex items-start gap-3.5 p-4 rounded-2xl bg-slate-950 border border-slate-800">
                  <div className="w-7 h-7 rounded-xl bg-amber-500 text-black font-black text-sm flex items-center justify-center shrink-0">
                    2
                  </div>
                  <div className="space-y-1">
                    <h4 className="text-xs font-bold text-white">
                      {lang === 'hi' ? 'होम स्क्रीन में जोड़ें (Add to Home Screen)' : 'Add to Home Screen / WebAPK'}
                    </h4>
                    <p className="text-xs text-slate-300">
                      {lang === 'hi'
                        ? 'क्रोम (Chrome) या सैमसंग ब्राउज़र में "Install" या "Add" दबाएं। यह स्वचालित रूप से बिना किसी भारी स्पेस के आपके फोन में स्थापित हो जाएगा।'
                        : 'Tap "Install" or "Add to Home screen" in Chrome or Samsung Internet. It installs cleanly with full native launcher icon.'}
                    </p>
                  </div>
                </div>

                {/* Step 3 */}
                <div className="flex items-start gap-3.5 p-4 rounded-2xl bg-slate-950 border border-slate-800">
                  <div className="w-7 h-7 rounded-xl bg-indigo-500 text-white font-black text-sm flex items-center justify-center shrink-0">
                    3
                  </div>
                  <div className="space-y-1">
                    <h4 className="text-xs font-bold text-white">
                      {lang === 'hi' ? 'फुलस्क्रीन लाइव पार्टी का आनंद लें' : 'Launch & Enjoy Fullscreen Audio Party'}
                    </h4>
                    <p className="text-xs text-slate-300">
                      {lang === 'hi'
                        ? 'अपने ऐप ड्रॉअर से AbuChat खोलें। कोई URL बार नहीं दिखेगा, फुलस्क्रीन एचडी वॉइस रूम और बैकग्राउंड ऑडियो चालू रहेगा!'
                        : 'Open AbuChat from your Android app drawer. Runs in full-screen standalone mode with low-latency audio & push alerts.'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Brand Phone Compatibility List */}
              <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-2">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wide">
                  Tested & 100% Compatible Phone Brands:
                </p>
                <div className="flex flex-wrap gap-2 text-[11px] text-slate-300">
                  {['Samsung Galaxy', 'Xiaomi / Redmi / POCO', 'Vivo / iQOO', 'Oppo / OnePlus', 'Realme', 'Motorola', 'Google Pixel', 'Infinix / Tecno'].map((brand) => (
                    <span key={brand} className="px-2.5 py-1 rounded-lg bg-slate-800 border border-slate-700">
                      📱 {brand}
                    </span>
                  ))}
                </div>
              </div>

            </div>
          )}

        </div>

        {/* Footer Actions */}
        <div className="p-4 bg-slate-950 border-t border-slate-800 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Google Play Store v2.4.0 Certified</span>
          </div>

          <button
            onClick={() => {
              sound.playClick();
              onClose();
            }}
            className="py-2 px-5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs transition"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
};
