import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import {ErrorBoundary} from './components/ErrorBoundary.tsx';
import {registerWebMcpTools} from './utils/webMcpIntegration.ts';
import '../public/assets/css/main.css';
import './index.css';

// Handle dynamic module chunk loading failures (network hiccups / deployment updates)
if (typeof window !== 'undefined') {
  window.addEventListener('vite:preloadError', (event) => {
    event.preventDefault();
    console.warn('Vite preload error detected. Auto-reloading to fetch fresh deployment chunks.');
    const reloadKey = 'ed_vite_preload_error_ts';
    const last = sessionStorage.getItem(reloadKey);
    const now = Date.now();
    if (!last || now - parseInt(last, 10) > 10000) {
      sessionStorage.setItem(reloadKey, now.toString());
      window.location.reload();
    }
  });

  // Safe deferred initialization of WebMCP tools
  try {
    if ('requestIdleCallback' in window) {
      (window as any).requestIdleCallback(() => registerWebMcpTools(), { timeout: 2000 });
    } else {
      setTimeout(() => registerWebMcpTools(), 100);
    }
  } catch {
    // Non-blocking
  }
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </StrictMode>,
);
