import { useState, useEffect } from 'react';
import { Download, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function PWAInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showPrompt, setShowPrompt] = useState(false);

  useEffect(() => {
    const handleBeforeInstallPrompt = (e) => {
      // Prevent the mini-infobar from appearing on mobile
      e.preventDefault();
      // Stash the event so it can be triggered later.
      setDeferredPrompt(e);
      // Immediately display the custom installation prompt
      setShowPrompt(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    // Setup the 2-minute recurring interval
    const interval = setInterval(() => {
      // If we have a deferredPrompt saved (meaning app is not installed and browser supports it),
      // we show the prompt again.
      setDeferredPrompt((prevPrompt) => {
        if (prevPrompt) {
          setShowPrompt(true);
        }
        return prevPrompt;
      });
    }, 120000); // 2 minutes

    // Stop recurring if app gets installed
    const handleAppInstalled = () => {
      setDeferredPrompt(null);
      setShowPrompt(false);
    };

    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
      clearInterval(interval);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    
    // Show the native install prompt
    deferredPrompt.prompt();
    
    // Wait for the user to respond to the prompt
    const { outcome } = await deferredPrompt.userChoice;
    
    // We've used the prompt, and can't use it again, throw it away
    setDeferredPrompt(null);
    setShowPrompt(false);
  };

  const handleDismiss = () => {
    setShowPrompt(false);
  };

  return (
    <AnimatePresence>
      {showPrompt && (
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 50, scale: 0.95 }}
          transition={{ duration: 0.3 }}
          className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-96 bg-white rounded-2xl shadow-2xl p-5 border border-gray-100 z-[9999] flex items-start gap-4"
        >
          <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center shrink-0">
             <Download className="w-6 h-6 text-primary" />
          </div>
          <div className="flex-1">
            <h3 className="font-heading font-bold text-text text-lg">Install App</h3>
            <p className="font-body text-sm text-text-muted mt-1 leading-relaxed">
              Install Sadguru Car Melo App for a better experience and faster access.
            </p>
            <div className="flex items-center gap-3 mt-4">
              <button
                onClick={handleInstallClick}
                className="flex-1 bg-primary text-white font-bold py-2 px-4 rounded-xl text-sm hover:bg-primary/90 transition-colors"
              >
                Install Now
              </button>
              <button
                onClick={handleDismiss}
                className="flex-1 bg-gray-100 text-text font-medium py-2 px-4 rounded-xl text-sm hover:bg-gray-200 transition-colors"
              >
                Maybe Later
              </button>
            </div>
          </div>
          <button 
            onClick={handleDismiss}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
