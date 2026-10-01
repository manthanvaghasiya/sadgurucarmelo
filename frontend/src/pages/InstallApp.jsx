import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { 
  Download, 
  CheckCircle2, 
  Share2, 
  PlusSquare, 
  Smartphone, 
  Sparkles, 
  ShieldCheck, 
  Zap, 
  Copy, 
  Check, 
  ArrowRight,
  Car,
  BellRing
} from 'lucide-react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import ReactGA from 'react-ga4';

export default function InstallApp() {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [isStandalone, setIsStandalone] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const [isInstalling, setIsInstalling] = useState(false);

  useEffect(() => {
    // Check if already installed in standalone PWA mode
    const standaloneCheck = window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone;
    setIsStandalone(!!standaloneCheck);

    // Detect iOS
    const ua = window.navigator.userAgent.toLowerCase();
    const iosCheck = /iphone|ipad|ipod/.test(ua);
    setIsIOS(iosCheck);

    // Reset prompt dismissed state on this page so the user can always trigger it
    try {
      sessionStorage.removeItem('pwa_prompt_dismissed');
    } catch (_) {}

    // Check if window captured deferred prompt
    if (window.deferredPWAInstallPrompt) {
      setDeferredPrompt(window.deferredPWAInstallPrompt);
    }

    const handleBeforeInstall = (e) => {
      e.preventDefault();
      window.deferredPWAInstallPrompt = e;
      setDeferredPrompt(e);
    };

    const handleEarlyPrompt = (e) => {
      if (e.detail) {
        setDeferredPrompt(e.detail);
      }
    };

    const handleAppInstalled = () => {
      setIsStandalone(true);
      setDeferredPrompt(null);
      window.deferredPWAInstallPrompt = null;
      toast.success('Sadguru Car Surat App installed successfully!', { icon: '🎉' });
      ReactGA.event({
        category: 'App Installation',
        action: 'PWA_Installed_Via_Install_Page',
        label: 'User installed via /install direct page',
      });
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstall);
    window.addEventListener('pwa-prompt-available', handleEarlyPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
      window.removeEventListener('pwa-prompt-available', handleEarlyPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const handleInstallClick = async () => {
    if (isStandalone) {
      toast('App is already installed on your device!', { icon: '✨' });
      return;
    }

    if (isIOS) {
      toast('On iPhone, tap Share then "Add to Home Screen"', { icon: '📲', duration: 4000 });
      return;
    }

    if (deferredPrompt) {
      setIsInstalling(true);
      try {
        deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;
        if (outcome === 'accepted') {
          ReactGA.event({
            category: 'App Installation',
            action: 'Install_Prompt_Accepted',
            label: 'Outcome Accepted',
          });
          setDeferredPrompt(null);
        }
      } catch (err) {
        console.error('PWA install error:', err);
      } finally {
        setIsInstalling(false);
      }
    } else {
      // Browser hasn't triggered event or does not support automatic prompt
      toast(
        'Tap the 3 dots (⋮) in Chrome and select "Install app" or "Add to Home screen".',
        { icon: '💡', duration: 5000 }
      );
    }
  };

  const handleCopyLink = () => {
    const installUrl = 'https://sadgurucarsurat.com/install';
    if (navigator.clipboard) {
      navigator.clipboard.writeText(installUrl);
      setIsCopied(true);
      toast.success('Direct install link copied to clipboard!');
      setTimeout(() => setIsCopied(false), 2500);
    }
  };

  return (
    <div className="bg-gradient-to-b from-slate-50 via-white to-slate-100 min-h-screen py-8 sm:py-16 px-4 sm:px-6 lg:px-8">
      <Helmet>
        <title>Install Sadguru Car Surat App — Direct 1-Click Install</title>
        <meta 
          name="description" 
          content="Direct install link for Sadguru Car Surat mobile app. 1-click install for Android and iOS iPhone. Browse 150+ certified used cars in Surat." 
        />
        <meta property="og:title" content="Install Sadguru Car Surat App" />
        <meta property="og:description" content="Direct 1-click install link for our certified pre-owned car app in Surat." />
      </Helmet>

      <div className="max-w-xl mx-auto space-y-8">

        {/* ── App Icon & Hero Section ── */}
        <div className="text-center space-y-4">
          {/* Animated App Icon */}
          <div className="relative inline-block">
            <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl bg-white p-3 shadow-[0_12px_40px_rgba(245,148,35,0.25)] border border-orange-100 flex items-center justify-center mx-auto relative z-10">
              <img 
                src="/sadgurulogo.png" 
                alt="Sadguru Car Surat Logo" 
                className="w-full h-full object-contain"
              />
            </div>
            {/* Ambient Background Glow */}
            <div className="absolute inset-0 bg-gradient-to-tr from-brand-orange/40 to-amber-400/40 rounded-3xl blur-xl -z-0 scale-110 animate-pulse" />
          </div>

          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-50 border border-orange-200/60 text-brand-orange text-xs font-heading font-black tracking-wider uppercase">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Official Web App (PWA)</span>
            </div>

            <h1 className="font-heading font-black text-2xl sm:text-3xl text-slate-900 tracking-tight">
              Sadguru Car Surat
            </h1>
            <p className="font-body text-xs sm:text-sm text-slate-500 font-medium max-w-sm mx-auto">
              સુરતની સૌથી વિશ્વસનીય સર્ટિફાઇડ પ્રી-ઓન્ડ કાર એપ સીધા તમારા ફોનમાં ઇન્સ્ટોલ કરો.
            </p>
          </div>
        </div>

        {/* ── Primary Action Card ── */}
        <div className="bg-white/90 backdrop-blur-xl rounded-3xl p-6 sm:p-8 shadow-[0_16px_50px_rgba(15,23,42,0.08)] border border-slate-200/80 text-center space-y-6">

          {isStandalone ? (
            /* Already Installed State */
            <div className="space-y-4 py-2">
              <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto border border-emerald-100 shadow-xs">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <div className="space-y-1">
                <h3 className="font-heading font-bold text-lg text-slate-900">
                  App Already Installed!
                </h3>
                <p className="font-body text-xs text-slate-500">
                  તમારા ફોનમાં એપ પહેલેથી ઇન્સ્ટોલ થયેલ છે. તમે હોમ સ્ક્રીન પરથી સીધા વાપરી શકો છો.
                </p>
              </div>
              <Link
                to="/inventory"
                className="inline-flex items-center justify-center gap-2 w-full py-3.5 px-6 rounded-2xl bg-slate-900 hover:bg-black text-white font-heading font-bold text-sm shadow-md active:scale-98 transition-all"
              >
                <Car className="w-4 h-4 text-brand-orange" />
                <span>Explore Cars / કાર જુઓ</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          ) : isIOS ? (
            /* iOS (iPhone/iPad) Step-by-Step Instructions */
            <div className="space-y-5 text-left">
              <div className="text-center space-y-1">
                <span className="text-xs font-heading font-black text-blue-600 uppercase tracking-widest bg-blue-50 px-3 py-1 rounded-full border border-blue-100">
                  iPhone / Safari Setup
                </span>
                <h3 className="font-heading font-bold text-lg text-slate-900 pt-1">
                  How to Install on iPhone:
                </h3>
              </div>

              <div className="space-y-3 font-body text-xs sm:text-sm text-slate-700">
                <div className="flex items-start gap-3.5 p-3.5 rounded-2xl bg-slate-50 border border-slate-100">
                  <span className="w-6 h-6 rounded-full bg-blue-600 text-white font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                    1
                  </span>
                  <div>
                    <p className="font-semibold text-slate-900">
                      Tap the <Share2 className="inline w-4 h-4 mx-1 text-blue-600" /> Share button
                    </p>
                    <p className="text-slate-500 text-xs mt-0.5">
                      Safari ના નીચેના ભાગમાં રહેલા <b>Share</b> આઇકન પર ક્લિક કરો.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3.5 p-3.5 rounded-2xl bg-slate-50 border border-slate-100">
                  <span className="w-6 h-6 rounded-full bg-blue-600 text-white font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                    2
                  </span>
                  <div>
                    <p className="font-semibold text-slate-900">
                      Scroll down &amp; tap <PlusSquare className="inline w-4 h-4 mx-1 text-slate-700" /> "Add to Home Screen"
                    </p>
                    <p className="text-slate-500 text-xs mt-0.5">
                      લિસ્ટમાં નીચે સ્ક્રોલ કરી <b>Add to Home Screen</b> પસંદ કરો.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3.5 p-3.5 rounded-2xl bg-slate-50 border border-slate-100">
                  <span className="w-6 h-6 rounded-full bg-blue-600 text-white font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                    3
                  </span>
                  <div>
                    <p className="font-semibold text-slate-900">
                      Tap <b className="text-blue-600">"Add"</b> in top right
                    </p>
                    <p className="text-slate-500 text-xs mt-0.5">
                      જમણી બાજુ ઉપર રહેલું <b>Add</b> બટન દબાવો. એપ ઇન્સ્ટોલ થઈ જશે!
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            /* Android & Chrome 1-Click Install Button */
            <div className="space-y-4">
              <button
                onClick={handleInstallClick}
                disabled={isInstalling}
                className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-amber-500 via-orange-500 to-brand-orange hover:brightness-110 active:scale-95 text-white font-heading font-black text-base shadow-[0_8px_24px_rgba(245,148,35,0.4)] flex items-center justify-center gap-3 transition-all select-none"
              >
                <Download className="w-5 h-5 stroke-[2.5] animate-bounce" />
                <span>{isInstalling ? 'Opening Installer...' : 'Install App Now / હમણાં ઇન્સ્ટોલ કરો'}</span>
              </button>

              <p className="font-body text-[11px] text-slate-400">
                1-tap direct install • Safe &amp; verified • No storage space required
              </p>

              {/* Android Fallback guide if browser blocks direct popup */}
              <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-100 text-left space-y-1">
                <p className="font-heading font-bold text-xs text-slate-800 flex items-center gap-1.5">
                  <Smartphone className="w-3.5 h-3.5 text-brand-orange" />
                  <span>Alternative manual step:</span>
                </p>
                <p className="font-body text-xs text-slate-500 leading-relaxed">
                  જો પોપ-અપ ન આવે તો ક્રોમના ઉપરના <b>3 dots (⋮)</b> પર ક્લિક કરી <b>"Install app"</b> અથવા <b>"Add to Home screen"</b> દબાવો.
                </p>
              </div>
            </div>
          )}

          {/* ── Share Direct Link Section ── */}
          <div className="pt-4 border-t border-slate-100 space-y-3">
            <span className="font-heading font-bold text-xs text-slate-500 uppercase tracking-wider block">
              Share Direct Link / લિંક શેર કરો
            </span>
            <div className="flex items-center gap-2 bg-slate-50 border border-slate-200/80 rounded-2xl p-1.5">
              <input
                type="text"
                readOnly
                value="https://sadgurucarsurat.com/install"
                className="flex-1 bg-transparent px-3 font-mono text-xs text-slate-700 outline-none select-all"
              />
              <button
                onClick={handleCopyLink}
                className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-black text-white font-heading font-bold text-xs flex items-center gap-1.5 transition-all active:scale-95 shrink-0"
              >
                {isCopied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy Link</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* ── App Features & Benefits ── */}
        <div className="grid grid-cols-2 gap-3 sm:gap-4">
          <div className="bg-white/80 backdrop-blur-md p-4 rounded-2xl border border-slate-100 shadow-xs space-y-2">
            <div className="w-8 h-8 rounded-xl bg-amber-50 text-brand-orange flex items-center justify-center">
              <Zap className="w-4 h-4" />
            </div>
            <h4 className="font-heading font-bold text-xs sm:text-sm text-slate-900">
              Lightning Fast
            </h4>
            <p className="font-body text-[11px] text-slate-500 leading-tight">
              બ્રાઉઝર ખોલ્યા વગર હોમ સ્ક્રીનથી 1 સેકન્ડમાં સીધું ખુલે છે.
            </p>
          </div>

          <div className="bg-white/80 backdrop-blur-md p-4 rounded-2xl border border-slate-100 shadow-xs space-y-2">
            <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <BellRing className="w-4 h-4" />
            </div>
            <h4 className="font-heading font-bold text-xs sm:text-sm text-slate-900">
              New Car Alerts
            </h4>
            <p className="font-body text-[11px] text-slate-500 leading-tight">
              નવી આવતી ગાડીઓ અને ભાવ ઘટાડાની નોટિફિકેશન સૌથી પહેલા મેળવો.
            </p>
          </div>

          <div className="bg-white/80 backdrop-blur-md p-4 rounded-2xl border border-slate-100 shadow-xs space-y-2">
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <h4 className="font-heading font-bold text-xs sm:text-sm text-slate-900">
              100% Verified
            </h4>
            <p className="font-body text-[11px] text-slate-500 leading-tight">
              150+ નોન-એક્સિડેન્ટલ સર્ટિફાઇડ કારનું લાઇવ ઇન્વેન્ટરી લિસ્ટિંગ.
            </p>
          </div>

          <div className="bg-white/80 backdrop-blur-md p-4 rounded-2xl border border-slate-100 shadow-xs space-y-2">
            <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
              <Smartphone className="w-4 h-4" />
            </div>
            <h4 className="font-heading font-bold text-xs sm:text-sm text-slate-900">
              Zero Storage
            </h4>
            <p className="font-body text-[11px] text-slate-500 leading-tight">
              માત્ર 2 MB થી ઓછી જગ્યા રોકે છે, ફોન ક્યારેય હેંગ નહીં થાય.
            </p>
          </div>
        </div>

        {/* ── Footer Link Back to Home ── */}
        <div className="text-center pt-2">
          <Link
            to="/"
            className="font-heading font-bold text-xs text-slate-500 hover:text-slate-900 transition-colors inline-flex items-center gap-1"
          >
            <span>Back to Sadguru Car Surat Showroom</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

      </div>
    </div>
  );
}
