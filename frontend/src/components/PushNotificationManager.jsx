import React, { useState, useEffect } from 'react';
import axiosInstance from '../api/axiosConfig';

// Helper to convert base64 VAPID key to Uint8Array for PushManager
function urlBase64ToUint8Array(base64String) {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

const DEFAULT_VAPID_PUBLIC_KEY = 'BFKd4ejW7KnCHmvNK27-9aVFk1tpqMMrxgfoKLz-GSLmsXctlnoOBUFOy3L-RvBm14Rftm5HkQ0DZngAsAiePMg';

export default function PushNotificationManager() {
  const [showPrompt, setShowPrompt] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [successToast, setSuccessToast] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined' || !('serviceWorker' in navigator) || !('PushManager' in window)) {
      return;
    }

    let swReg = null;

    const initSW = async () => {
      try {
        swReg = await navigator.serviceWorker.register('/sw.js');

        // Check current subscription
        const existingSub = await swReg.pushManager.getSubscription();
        if (existingSub) {
          setIsSubscribed(true);
          // Sync with backend
          try {
            await axiosInstance.post('/notifications/subscribe', existingSub);
          } catch {
            // Non-blocking sync error
          }
          return;
        }

        // If permission is already granted, subscribe automatically
        if (Notification.permission === 'granted') {
          await subscribeUser(swReg);
          return;
        }

        // If permission is default and user hasn't dismissed recently, show the prompt
        if (Notification.permission === 'default') {
          const dismissedAt = localStorage.getItem('sadguru_push_prompt_dismissed');
          const threeDays = 3 * 24 * 60 * 60 * 1000;
          if (!dismissedAt || Date.now() - Number(dismissedAt) > threeDays) {
            const timer = setTimeout(() => {
              setShowPrompt(true);
            }, 3500); // 3.5s delay so page loads first
            return () => clearTimeout(timer);
          }
        }
      } catch (err) {
        console.warn('Service worker registration or push check skipped:', err);
      }
    };

    initSW();
  }, []);

  const subscribeUser = async (registration) => {
    try {
      setLoading(true);
      let reg = registration;
      if (!reg) {
        reg = await navigator.serviceWorker.ready;
      }

      // Fetch dynamic VAPID public key or fallback
      let vapidKey = DEFAULT_VAPID_PUBLIC_KEY;
      try {
        const res = await axiosInstance.get('/notifications/vapid-public-key');
        if (res.data?.publicKey) {
          vapidKey = res.data.publicKey;
        }
      } catch {
        // Use default
      }

      const subscription = await reg.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(vapidKey),
      });

      await axiosInstance.post('/notifications/subscribe', subscription);
      setIsSubscribed(true);
      setShowPrompt(false);
      setSuccessToast(true);
      setTimeout(() => setSuccessToast(false), 4000);
    } catch (err) {
      console.error('Failed to subscribe user to push notifications:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleEnable = async () => {
    try {
      setLoading(true);
      const permission = await Notification.requestPermission();
      if (permission === 'granted') {
        await subscribeUser();
      } else {
        setShowPrompt(false);
      }
    } catch (err) {
      console.error('Permission request failed:', err);
      setShowPrompt(false);
    } finally {
      setLoading(false);
    }
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    localStorage.setItem('sadguru_push_prompt_dismissed', Date.now().toString());
  };

  return (
    <>
      {/* Success Notification Toast */}
      {successToast && (
        <div className="fixed top-20 right-4 z-50 max-w-sm animate-bounce">
          <div className="flex items-center gap-3 px-4 py-3 bg-emerald-900/95 text-emerald-100 border border-emerald-500/30 rounded-2xl shadow-2xl backdrop-blur-md">
            <span className="text-xl">🔔</span>
            <div>
              <p className="text-xs font-bold text-emerald-300">સૂચના સક્રિય થઈ ગઈ! / Alerts Enabled!</p>
              <p className="text-[11px] text-emerald-200/80">નવી કાર આવતા જ તમને તુરંત જાણ થશે.</p>
            </div>
          </div>
        </div>
      )}

      {/* Floating Permission Prompt Banner */}
      {showPrompt && !isSubscribed && (
        <div className="fixed bottom-20 md:bottom-6 right-4 left-4 md:left-auto md:max-w-md z-50 animate-in fade-in slide-in-from-bottom-5 duration-300">
          <div className="relative overflow-hidden p-5 rounded-3xl bg-slate-900/95 border border-amber-500/30 shadow-[0_10px_40px_rgba(0,0,0,0.6)] backdrop-blur-xl">
            {/* Top decorative gradient glow */}
            <div className="absolute -top-10 -right-10 w-32 h-32 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />

            <div className="flex items-start gap-3.5">
              <div className="w-11 h-11 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center shrink-0 text-xl shadow-inner">
                🔔
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <h4 className="text-sm font-bold text-white tracking-wide">
                    નવી કાર સૂચનાઓ <span className="text-amber-400 font-normal text-xs">/ Instant Alerts</span>
                  </h4>
                  <button
                    onClick={handleDismiss}
                    aria-label="Close notification prompt"
                    className="text-slate-400 hover:text-white text-sm p-1 transition-colors"
                  >
                    ✕
                  </button>
                </div>
                <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                  સુરતમાં સદગુરુ કાર મેળોમાં નવી વેરિફાઇડ કાર આવતા જ સૌથી પહેલા તમારા ફોન પર માહિતી મેળવો.
                </p>
                <p className="text-[11px] text-slate-400 mt-0.5 font-medium">
                  Be the first to know when verified cars are listed!
                </p>

                <div className="flex items-center gap-2 mt-4">
                  <button
                    onClick={handleEnable}
                    disabled={loading}
                    className="flex-1 px-4 py-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-bold text-xs rounded-xl shadow-lg shadow-amber-500/20 transition-all active:scale-95 flex items-center justify-center gap-1.5"
                  >
                    {loading ? (
                      <span className="animate-spin text-sm">⏳</span>
                    ) : (
                      <span>🔔 હા, ચાલુ કરો (Enable)</span>
                    )}
                  </button>
                  <button
                    onClick={handleDismiss}
                    className="px-3 py-2 bg-slate-800/80 hover:bg-slate-700/80 text-slate-300 text-xs font-semibold rounded-xl border border-slate-700 transition-colors"
                  >
                    પછીથી (Later)
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
