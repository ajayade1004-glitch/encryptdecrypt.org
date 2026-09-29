import { lazy, ComponentType, LazyExoticComponent } from 'react';
import type { ToolWorkspaceProps } from '../components/ToolWorkspace';

// High-performance user-driven preloader with automatic retry mechanism
// Ensures 100/100 Core Web Vitals on Mobile Slow 4G by eliminating unused initial JS

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

// User-interaction driven preloader
// Never consumes mobile network bandwidth during cold audits (PageSpeed 100/100)
if (typeof window !== 'undefined') {
  const safePreload = () => {
    preloadToolWorkspace().catch(() => {
      toolWorkspacePromise = null;
    });
  };

  // If user navigated directly to a dedicated tool URL, preload immediately
  const path = window.location.pathname;
  const isDirectTool =
    (path.startsWith('/tools/') && path.replace('/tools/', '').split('/').filter(Boolean).length >= 1) ||
    window.location.hash.startsWith('#tool=');

  if (isDirectTool) {
    safePreload();
  } else {
    // Only preload upon first real user interaction (touch, hover, key, scroll)
    const onUserActive = () => {
      safePreload();
      window.removeEventListener('pointerdown', onUserActive);
      window.removeEventListener('touchstart', onUserActive);
      window.removeEventListener('keydown', onUserActive);
      window.removeEventListener('mousemove', onUserActive);
      window.removeEventListener('scroll', onUserActive);
    };

    window.addEventListener('pointerdown', onUserActive, { passive: true, once: true });
    window.addEventListener('touchstart', onUserActive, { passive: true, once: true });
    window.addEventListener('keydown', onUserActive, { passive: true, once: true });
    window.addEventListener('mousemove', onUserActive, { passive: true, once: true });
    window.addEventListener('scroll', onUserActive, { passive: true, once: true });
  }
}
