import { lazy, ComponentType, LazyExoticComponent } from 'react';
import type { ToolWorkspaceProps } from '../components/ToolWorkspace';

// High-performance background preloader with automatic retry mechanism
// Prevents blank screens caused by network hiccups or stale chunk hashes

let toolWorkspacePromise: Promise<any> | null = null;

export const preloadToolWorkspace = async (retriesOrEvent?: any): Promise<any> => {
  const retries = typeof retriesOrEvent === 'number' ? retriesOrEvent : 2;
  if (toolWorkspacePromise) return toolWorkspacePromise;

  const attempt = async (remaining: number): Promise<any> => {
    try {
      const promise = import('../components/ToolWorkspace');
      toolWorkspacePromise = promise;
      const module = await promise;
      return module;
    } catch (err) {
      toolWorkspacePromise = null; // Clear cached rejection so next try can fetch freshly
      if (remaining > 0) {
        await new Promise(r => setTimeout(r, 600));
        return attempt(remaining - 1);
      }
      throw err;
    }
  };

  return attempt(retries);
};

export const loadToolWorkspaceComponent = async (): Promise<{ default: ComponentType<ToolWorkspaceProps> }> => {
  try {
    const module = await preloadToolWorkspace(2);
    return { default: module.ToolWorkspace };
  } catch (err) {
    toolWorkspacePromise = null;
    const direct = await import('../components/ToolWorkspace');
    return { default: direct.ToolWorkspace };
  }
};

/**
 * Robust lazy import with automatic retry on chunk loading errors
 */
export function lazyWithRetry<T extends ComponentType<any>>(
  importFn: () => Promise<{ default: T } | any>,
  retries = 2,
  interval = 600
): LazyExoticComponent<T> {
  return lazy(() =>
    new Promise<{ default: T }>((resolve, reject) => {
      const execute = (remaining: number) => {
        importFn()
          .then(module => {
            const comp = module.default || module;
            resolve({ default: comp });
          })
          .catch(error => {
            if (remaining > 0) {
              setTimeout(() => execute(remaining - 1), interval);
            } else {
              const isChunkLoadFailed =
                error?.message?.includes('Failed to fetch dynamically imported module') ||
                error?.name === 'ChunkLoadError' ||
                error?.message?.includes('dynamically imported module') ||
                error?.message?.includes('Loading chunk');

              if (isChunkLoadFailed && typeof window !== 'undefined') {
                const reloadKey = 'ed_lazy_chunk_reload';
                const hasReloaded = sessionStorage.getItem(reloadKey);
                if (!hasReloaded) {
                  sessionStorage.setItem(reloadKey, 'true');
                  window.location.reload();
                  return;
                }
              }
              reject(error);
            }
          });
      };
      execute(retries);
    })
  );
}

// Automatic background preload on idle or after initial render
if (typeof window !== 'undefined') {
  const safePreload = () => {
    preloadToolWorkspace().catch(() => {
      toolWorkspacePromise = null;
    });
  };

  // If user is on a direct tool URL, preload immediately with high priority
  const path = window.location.pathname;
  const isDirectTool = path.startsWith('/tools/') || window.location.hash.startsWith('#tool=');

  if (isDirectTool) {
    safePreload();
  } else {
    // Schedule on idle so main thread initial FCP/LCP is 100/100, then instantly cached
    if ('requestIdleCallback' in window) {
      (window as any).requestIdleCallback(safePreload, { timeout: 1500 });
    } else {
      setTimeout(safePreload, 200);
    }

    // Also trigger on first mouse/touch/keyboard interaction anywhere on screen
    const onUserActive = () => {
      safePreload();
      window.removeEventListener('pointerdown', onUserActive);
      window.removeEventListener('touchstart', onUserActive);
      window.removeEventListener('keydown', onUserActive);
      window.removeEventListener('mousemove', onUserActive);
    };

    window.addEventListener('pointerdown', onUserActive, { passive: true, once: true });
    window.addEventListener('touchstart', onUserActive, { passive: true, once: true });
    window.addEventListener('keydown', onUserActive, { passive: true, once: true });
    window.addEventListener('mousemove', onUserActive, { passive: true, once: true });
  }
}
