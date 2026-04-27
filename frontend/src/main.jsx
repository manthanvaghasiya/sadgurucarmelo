import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { HelmetProvider } from 'react-helmet-async'
import ErrorBoundary from './components/ErrorBoundary'
import './index.css'
import App from './App.jsx'

// ── Global Chunk Load Error Handler ──
// Catches "Failed to fetch dynamically imported module" errors (MIME type mismatch)
// that occur when a new deployment invalidates old JS chunks cached by the user.
const handleChunkError = (e) => {
  const msg = e?.reason?.message || e?.message || '';
  const isChunkLoadError = 
    msg.includes('Failed to fetch dynamically imported module') ||
    msg.includes('Importing a module script failed') ||
    msg.includes('Expected a JavaScript-or-Wasm module script');

  if (isChunkLoadError || e.type === 'vite:preloadError') {
    const isReloading = sessionStorage.getItem('chunk-error-reloading');
    if (!isReloading && navigator.onLine) {
      sessionStorage.setItem('chunk-error-reloading', 'true');
      console.warn('Chunk load error detected. Reloading page to fetch latest version...');
      window.location.reload(true);
    }
  }
};

window.addEventListener('vite:preloadError', handleChunkError);
window.addEventListener('unhandledrejection', handleChunkError);
window.addEventListener('error', handleChunkError);

// Clear the reload flag on successful load
sessionStorage.removeItem('chunk-error-reloading');

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ErrorBoundary>
      <HelmetProvider>
        <App />
      </HelmetProvider>
    </ErrorBoundary>
  </StrictMode>,
)
