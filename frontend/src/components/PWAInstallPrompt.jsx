import { useState, useEffect, useRef } from 'react';
import { X } from 'lucide-react';

export default function PWAInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [isVisible, setIsVisible] = useState(false);
  const timeoutRef = useRef(null);

  useEffect(() => {
    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setIsVisible(true);
    };

    const handleAppInstalled = () => {
      // Permanently hide — app is installed
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      setDeferredPrompt(null);
      setIsVisible(false);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setDeferredPrompt(null);
    }
    setIsVisible(false);
  };

  const handleDismiss = () => {
    setIsVisible(false);
    // Re-show after exactly 2 minutes
    timeoutRef.current = setTimeout(() => {
      setDeferredPrompt((prev) => {
        if (prev) setIsVisible(true);
        return prev;
      });
    }, 120000);
  };

  return (
    <>
      {/* Backdrop overlay */}
      <div
        className={`fixed inset-0 bg-black/30 backdrop-blur-sm z-[9998] transition-opacity duration-500 ${isVisible ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
        onClick={handleDismiss}
      />

      {/* Prompt Card */}
      <div
        className={`fixed bottom-0 left-0 right-0 z-[9999] transition-transform duration-500 ease-out ${isVisible ? 'translate-y-0' : 'translate-y-full'}`}
      >
        <div className="mx-auto max-w-lg bg-white/95 backdrop-blur-xl rounded-t-3xl shadow-[0_-10px_60px_rgba(0,0,0,0.15)] border-t border-white/60 px-6 pt-5 pb-8 relative">

          {/* Drag Handle */}
          <div className="w-10 h-1 bg-gray-300 rounded-full mx-auto mb-5" />

          {/* Close Button */}
          <button
            onClick={handleDismiss}
            className="absolute top-4 right-5 w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
            aria-label="Close install prompt"
          >
            <X className="w-4 h-4 text-gray-500" />
          </button>

          {/* Content */}
          <div className="flex flex-col items-center text-center">
            {/* App Icon */}
            <div className="w-16 h-16 rounded-2xl overflow-hidden shadow-lg ring-1 ring-black/5 mb-4">
              <img src="/logo1.png" alt="Sadguru Car Melo" className="w-full h-full object-contain bg-white" />
            </div>

            <h3 className="font-heading font-bold text-xl text-slate-900 leading-tight">
              Sadguru Car Melo App
            </h3>
            <p className="font-body text-sm text-slate-500 mt-1.5 max-w-xs leading-relaxed">
              Install our app for faster access, offline browsing, and a native experience.
            </p>

            {/* Action Buttons */}
            <div className="flex items-center gap-3 mt-6 w-full">
              <button
                onClick={handleDismiss}
                className="flex-1 font-heading font-semibold text-sm text-slate-600 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 active:scale-[0.97] transition-all"
              >
                Maybe Later
              </button>
              <button
                onClick={handleInstallClick}
                className="flex-1 font-heading font-bold text-sm text-white py-3 rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-lg shadow-blue-600/25 active:scale-[0.97] transition-all"
              >
                Install Now
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
