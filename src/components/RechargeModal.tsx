import React, { useState } from 'react';
import { RechargePlan, Transaction, UserProfile } from '../types';
import { RECHARGE_PLANS } from '../data/mockData';
import {
  X,
  CreditCard,
  QrCode,
  CheckCircle2,
  ShieldCheck,
  Sparkles,
  ArrowRight,
  Download,
  Lock,
  RefreshCw,
  ExternalLink,
} from 'lucide-react';
import { sound } from '../utils/audio';
import confetti from 'canvas-confetti';

interface RechargeModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: UserProfile;
  onRechargeSuccess: (newBalance: number, newVipExp: number, transaction: Transaction) => void;
  onOpenProfile?: () => void;
}

type PaymentGateway = 'stripe' | 'paypal' | 'upi_qr' | 'phonepe' | 'gpay';

export const RechargeModal: React.FC<RechargeModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onRechargeSuccess,
  onOpenProfile,
}) => {
  const [selectedPlan, setSelectedPlan] = useState<RechargePlan>(RECHARGE_PLANS[1]); // ₹99 default
  const [selectedGateway, setSelectedGateway] = useState<PaymentGateway>('stripe');
  
  // Card form state for Stripe
  const [cardNumber, setCardNumber] = useState('4242 •••• •••• 4242');
  const [cardExpiry, setCardExpiry] = useState('12/28');
  const [cardCvc, setCardCvc] = useState('888');
  const [cardHolder, setCardHolder] = useState('Prince Gamer');

  // Processing & Confirmation state
  const [isProcessing, setIsProcessing] = useState(false);
  const [completedTxn, setCompletedTxn] = useState<Transaction | null>(null);

  if (!isOpen) return null;

  const totalDiamonds = selectedPlan.diamonds + selectedPlan.bonusDiamonds;

  const handlePayNow = () => {
    setIsProcessing(true);
    sound.playClick();

    setTimeout(() => {
      setIsProcessing(false);
      const now = new Date();
      const gatewayName =
        selectedGateway === 'stripe'
          ? `Stripe Card (•••• ${cardNumber.slice(-4)})`
          : selectedGateway === 'paypal'
          ? 'PayPal Secure Express'
          : selectedGateway === 'phonepe'
          ? 'PhonePe UPI'
          : selectedGateway === 'gpay'
          ? 'Google Pay UPI'
          : 'UPI Instant QR Scan';

      const newTxn: Transaction = {
        id: `TXN-${selectedGateway.toUpperCase().slice(0, 3)}-${Math.floor(100000 + Math.random() * 900000)}`,
        type: 'recharge',
        diamondsDelta: totalDiamonds,
        rupees: selectedPlan.rupees,
        paymentMethod: gatewayName,
        description: `Diamond Top-up (${selectedPlan.diamonds.toLocaleString()} + ${selectedPlan.bonusDiamonds.toLocaleString()} Bonus)`,
        timestamp: now.toISOString(),
        status: 'completed',
      };

      // Sound and confetti celebration
      sound.playRechargeSuccess();
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#f59e0b', '#6366f1', '#ec4899', '#10b981'],
      });

      setCompletedTxn(newTxn);
      onRechargeSuccess(currentUser.diamonds + totalDiamonds, currentUser.vipExp + selectedPlan.vipExp, newTxn);
    }, 1200);
  };

  const handleDownloadReceipt = () => {
    sound.playClick();
    if (!completedTxn) return;
    const content = `
========================================
           ABUCHAT INVOICE
========================================
Receipt ID: ${completedTxn.id}
Date: ${new Date(completedTxn.timestamp).toLocaleString('en-IN')}
User: ${currentUser.name} (${currentUser.id})
Payment Gateway: ${completedTxn.paymentMethod}
Amount Paid: ₹${completedTxn.rupees}
Diamonds Credited: +${completedTxn.diamondsDelta.toLocaleString()} 💎
Status: COMPLETED (Verified via 256-bit SSL)
========================================
Thank you for supporting AbuChat Live!
========================================
    `.trim();

    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `AbuChat_Receipt_${completedTxn.id}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-2xl my-auto rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl overflow-hidden text-slate-100 flex flex-col max-h-[92vh]">
        
        {/* SUCCESS CONFIRMATION SCREEN */}
        {completedTxn ? (
          <div className="p-6 sm:p-8 space-y-6 text-center overflow-y-auto">
            <div className="w-16 h-16 mx-auto rounded-2xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shadow-xl shadow-emerald-500/10">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div>
              <span className="text-xs font-semibold px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                Payment Successful · भुगतान सफल
              </span>
              <h2 className="text-2xl font-bold font-display text-white mt-2">
                Recharge Confirmed!
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                Your diamonds and VIP experience points have been instantly credited to your wallet.
              </p>
            </div>

            {/* Receipt Summary Card */}
            <div className="p-5 rounded-2xl bg-slate-950/80 border border-slate-800 text-left space-y-3 font-mono text-xs">
              <div className="flex justify-between items-center pb-2 border-b border-slate-800/80">
                <span className="text-slate-400">Transaction ID</span>
                <span className="text-amber-400 font-bold">{completedTxn.id}</span>
              </div>
              <div className="flex justify-between items-center pb-2 border-b border-slate-800/80">
                <span className="text-slate-400">Date of Recharge</span>
                <span className="text-white">
                  {new Date(completedTxn.timestamp).toLocaleDateString('en-IN', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </span>
              </div>
              <div className="flex justify-between items-center pb-2 border-b border-slate-800/80">
                <span className="text-slate-400">Payment Gateway</span>
                <span className="text-indigo-300">{completedTxn.paymentMethod}</span>
              </div>
              <div className="flex justify-between items-center pb-2 border-b border-slate-800/80">
                <span className="text-slate-400">Amount Paid</span>
                <span className="text-white font-bold text-sm">₹{completedTxn.rupees}</span>
              </div>
              <div className="flex justify-between items-center pt-1">
                <span className="text-slate-300 font-sans font-semibold">Credited to Balance</span>
                <span className="text-emerald-400 font-bold text-base flex items-center gap-1">
                  +{completedTxn.diamondsDelta.toLocaleString()} 💎
                </span>
              </div>
            </div>

            {/* Current Wallet Preview */}
            <div className="p-4 rounded-xl bg-gradient-to-r from-amber-500/10 via-indigo-500/10 to-rose-500/10 border border-amber-500/20 flex items-center justify-between">
              <div className="text-left">
                <p className="text-[11px] text-slate-400">Updated Diamond Balance</p>
                <p className="text-xl font-bold font-display text-amber-300 flex items-center gap-1.5 mt-0.5">
                  💎 {(currentUser.diamonds + completedTxn.diamondsDelta).toLocaleString()} Diamonds
                </p>
              </div>
              <div className="text-right">
                <p className="text-[11px] text-slate-400">VIP Level</p>
                <p className="text-sm font-bold text-indigo-300">Level {currentUser.vipLevel}</p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <button
                onClick={handleDownloadReceipt}
                className="py-3 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs flex items-center justify-center gap-2 border border-slate-700 transition-colors"
              >
                <Download className="w-4 h-4 text-amber-400" />
                Download Receipt (.txt)
              </button>
              <button
                onClick={() => {
                  setCompletedTxn(null);
                  onClose();
                  if (onOpenProfile) onOpenProfile();
                }}
                className="py-3 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/30 transition-all"
              >
                View in Profile & Wallet
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        ) : (
          <>
            {/* Header */}
            <div className="p-5 sm:p-6 pb-4 bg-gradient-to-r from-slate-900 via-indigo-950/60 to-slate-900 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-amber-500 to-rose-500 flex items-center justify-center shadow-lg shadow-amber-500/20 text-2xl">
                  💎
                </div>
                <div>
                  <h2 className="text-lg font-bold font-display text-white flex items-center gap-2">
                    Diamond Recharge (डायमंड रिचार्ज)
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                      Instant 100%
                    </span>
                  </h2>
                  <p className="text-xs text-slate-400">
                    Current Balance:{' '}
                    <span className="text-amber-400 font-mono font-bold">
                      {currentUser.diamonds.toLocaleString()} 💎
                    </span>
                    {' · '}VIP {currentUser.vipLevel}
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

            {/* Body */}
            <div className="p-5 sm:p-6 space-y-6 overflow-y-auto">
              
              {/* Step 1: Choose Diamond Package */}
              <div className="space-y-2.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-300">
                    1. Select Diamond Plan (प्लान चुनें)
                  </span>
                  <span className="text-amber-400 flex items-center gap-1 font-medium">
                    <Sparkles className="w-3.5 h-3.5" /> Bonus Diamonds Included
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                  {RECHARGE_PLANS.map((plan) => {
                    const isSelected = selectedPlan.id === plan.id;
                    const totalD = plan.diamonds + plan.bonusDiamonds;
                    return (
                      <button
                        key={plan.id}
                        onClick={() => {
                          setSelectedPlan(plan);
                          sound.playClick();
                        }}
                        className={`relative p-3 rounded-2xl border text-left transition-all ${
                          isSelected
                            ? 'bg-amber-500/10 border-amber-500 ring-2 ring-amber-500/30 shadow-lg shadow-amber-500/10'
                            : 'bg-slate-950/60 border-slate-800 hover:border-slate-700 hover:bg-slate-800/40'
                        }`}
                      >
                        {plan.tag && (
                          <span className="absolute -top-2.5 right-2 text-[9px] font-bold px-2 py-0.5 rounded-full bg-gradient-to-r from-amber-500 to-rose-500 text-black shadow-sm">
                            {plan.tag}
                          </span>
                        )}

                        <div className="flex items-center gap-1 text-amber-300 font-bold text-sm">
                          <span>💎</span>
                          <span>{totalD.toLocaleString()}</span>
                        </div>

                        <div className="text-[11px] text-emerald-400 font-medium mt-0.5">
                          +{plan.bonusDiamonds} Bonus
                        </div>

                        <div className="mt-2 pt-2 border-t border-slate-800/80 flex items-center justify-between">
                          <span className="text-xs font-bold text-white font-mono">
                            ₹{plan.rupees}
                          </span>
                          <span className="text-[10px] text-indigo-300 font-medium">
                            +{plan.vipExp} VIP
                          </span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Step 2: Choose Payment Gateway */}
              <div className="space-y-2.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-300">
                    2. Select Payment Method (भुगतान माध्यम)
                  </span>
                  <span className="text-[11px] text-slate-500 flex items-center gap-1">
                    <Lock className="w-3 h-3 text-emerald-400" /> 256-Bit SSL Encrypted
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  <button
                    onClick={() => { setSelectedGateway('stripe'); sound.playClick(); }}
                    className={`p-3 rounded-xl border flex flex-col items-center justify-center gap-1.5 transition-all ${
                      selectedGateway === 'stripe'
                        ? 'bg-indigo-600/20 border-indigo-500 text-white ring-1 ring-indigo-500'
                        : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800/40'
                    }`}
                  >
                    <CreditCard className="w-5 h-5 text-indigo-400" />
                    <span className="text-xs font-semibold">Stripe / Cards</span>
                    <span className="text-[10px] text-slate-500">Visa · Master</span>
                  </button>

                  <button
                    onClick={() => { setSelectedGateway('paypal'); sound.playClick(); }}
                    className={`p-3 rounded-xl border flex flex-col items-center justify-center gap-1.5 transition-all ${
                      selectedGateway === 'paypal'
                        ? 'bg-blue-600/20 border-blue-500 text-white ring-1 ring-blue-500'
                        : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800/40'
                    }`}
                  >
                    <span className="text-lg font-black text-blue-400 font-serif">P</span>
                    <span className="text-xs font-semibold">PayPal</span>
                    <span className="text-[10px] text-slate-500">Global Express</span>
                  </button>

                  <button
                    onClick={() => { setSelectedGateway('upi_qr'); sound.playClick(); }}
                    className={`p-3 rounded-xl border flex flex-col items-center justify-center gap-1.5 transition-all ${
                      selectedGateway === 'upi_qr'
                        ? 'bg-emerald-600/20 border-emerald-500 text-white ring-1 ring-emerald-500'
                        : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800/40'
                    }`}
                  >
                    <QrCode className="w-5 h-5 text-emerald-400" />
                    <span className="text-xs font-semibold">UPI QR Scanner</span>
                    <span className="text-[10px] text-slate-500">Instant Scan</span>
                  </button>

                  <button
                    onClick={() => { setSelectedGateway('phonepe'); sound.playClick(); }}
                    className={`p-3 rounded-xl border flex flex-col items-center justify-center gap-1.5 transition-all ${
                      selectedGateway === 'phonepe'
                        ? 'bg-purple-600/20 border-purple-500 text-white ring-1 ring-purple-500'
                        : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800/40'
                    }`}
                  >
                    <span className="w-5 h-5 rounded-full bg-purple-600 text-white text-[11px] font-bold flex items-center justify-center">
                      पे
                    </span>
                    <span className="text-xs font-semibold">PhonePe / GPay</span>
                    <span className="text-[10px] text-slate-500">Auto App Link</span>
                  </button>
                </div>
              </div>

              {/* Dynamic Payment Details Interface */}
              <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800/80">
                {selectedGateway === 'stripe' && (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-xs text-slate-400 pb-1">
                      <span className="font-semibold text-white">Stripe Payment Gateway</span>
                      <span className="text-[10px] text-emerald-400 flex items-center gap-1">
                        <ShieldCheck className="w-3 h-3" /> PCI-DSS Level 1
                      </span>
                    </div>

                    <div>
                      <label className="text-[11px] text-slate-400 font-medium">Card Number</label>
                      <input
                        type="text"
                        value={cardNumber}
                        onChange={(e) => setCardNumber(e.target.value)}
                        className="w-full mt-1 py-2 px-3 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs font-mono tracking-wider focus:outline-none focus:border-indigo-500"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-[11px] text-slate-400 font-medium">Expires (MM/YY)</label>
                        <input
                          type="text"
                          value={cardExpiry}
                          onChange={(e) => setCardExpiry(e.target.value)}
                          className="w-full mt-1 py-2 px-3 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs font-mono focus:outline-none focus:border-indigo-500"
                        />
                      </div>
                      <div>
                        <label className="text-[11px] text-slate-400 font-medium">Security CVC</label>
                        <input
                          type="password"
                          maxLength={3}
                          value={cardCvc}
                          onChange={(e) => setCardCvc(e.target.value)}
                          className="w-full mt-1 py-2 px-3 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs font-mono focus:outline-none focus:border-indigo-500"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {selectedGateway === 'paypal' && (
                  <div className="py-2 text-center space-y-2">
                    <p className="text-xs text-slate-300 font-medium">
                      Pay securely with your PayPal account or linked cards in 1 tap.
                    </p>
                    <p className="text-[11px] text-slate-500">
                      Standard exchange rate: 1 USD ≈ ₹85.00 INR
                    </p>
                    <div className="inline-flex items-center gap-2 py-1.5 px-3 rounded-lg bg-blue-900/30 text-blue-300 text-xs border border-blue-800">
                      <Lock className="w-3.5 h-3.5" /> Buyer Protection Included
                    </div>
                  </div>
                )}

                {selectedGateway === 'upi_qr' && (
                  <div className="flex flex-col sm:flex-row items-center gap-4 py-1">
                    <div className="w-28 h-28 rounded-xl bg-white p-2 flex items-center justify-center shadow-md shrink-0">
                      {/* Stylized QR Code */}
                      <div className="w-full h-full bg-slate-900 rounded p-1 flex flex-col justify-between">
                        <div className="flex justify-between">
                          <div className="w-6 h-6 border-2 border-white rounded-sm flex items-center justify-center">
                            <div className="w-3 h-3 bg-white" />
                          </div>
                          <div className="w-6 h-6 border-2 border-white rounded-sm flex items-center justify-center">
                            <div className="w-3 h-3 bg-white" />
                          </div>
                        </div>
                        <div className="text-[8px] font-mono font-bold text-center text-amber-400">
                          ₹{selectedPlan.rupees}
                        </div>
                        <div className="flex justify-between">
                          <div className="w-6 h-6 border-2 border-white rounded-sm flex items-center justify-center">
                            <div className="w-3 h-3 bg-white" />
                          </div>
                          <div className="w-5 h-5 bg-amber-400 rounded-sm flex items-center justify-center text-[7px] font-bold text-black">
                            UPI
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="text-center sm:text-left text-xs space-y-1">
                      <p className="font-semibold text-white">Scan & Pay ₹{selectedPlan.rupees}</p>
                      <p className="text-slate-400 text-[11px]">
                        Scan via PhonePe, Google Pay, Paytm or any BHIM UPI app on your phone.
                      </p>
                      <p className="text-emerald-400 font-mono text-[11px]">
                        UPI ID: abuchat.recharge@hdfcbank
                      </p>
                    </div>
                  </div>
                )}

                {selectedGateway === 'phonepe' && (
                  <div className="py-2 text-center space-y-2">
                    <p className="text-xs text-slate-300 font-medium">
                      One-Click Fast Checkout via PhonePe or Google Pay App
                    </p>
                    <p className="text-[11px] text-slate-500">
                      A payment request of ₹{selectedPlan.rupees} will be approved instantly.
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Sticky Action Footer */}
            <div className="p-4 sm:p-5 bg-slate-950 border-t border-slate-800 flex items-center justify-between gap-4">
              <div>
                <p className="text-[11px] text-slate-400">Total Payable</p>
                <div className="flex items-baseline gap-2">
                  <span className="text-xl font-bold font-mono text-white">
                    ₹{selectedPlan.rupees}
                  </span>
                  <span className="text-xs font-semibold text-amber-400">
                    +{totalDiamonds.toLocaleString()} 💎
                  </span>
                </div>
              </div>

              <button
                onClick={handlePayNow}
                disabled={isProcessing}
                className="flex-1 max-w-xs py-3.5 px-6 rounded-2xl bg-gradient-to-r from-amber-500 via-rose-500 to-indigo-600 hover:opacity-95 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 active:scale-[0.98] transition-all disabled:opacity-50"
              >
                {isProcessing ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin text-white" />
                    Processing Payment...
                  </>
                ) : (
                  <>
                    Pay ₹{selectedPlan.rupees} & Recharge
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
