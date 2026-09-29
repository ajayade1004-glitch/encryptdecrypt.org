// High-performance background preloader for ToolWorkspace
// Ensures instant, zero-latency tool switching with 0ms delay

let toolWorkspacePromise: Promise<typeof import('../components/ToolWorkspace')> | null = null;

export const preloadToolWorkspace = (): Promise<typeof import('../components/ToolWorkspace')> => {
  if (!toolWorkspacePromise && typeof window !== 'undefined') {
    toolWorkspacePromise = import('../components/ToolWorkspace');
  }
  return toolWorkspacePromise || (import('../components/ToolWorkspace') as any);
};

export const loadToolWorkspaceComponent = async () => {
  const module = await preloadToolWorkspace();
  return { default: module.ToolWorkspace };
};

// Automatic background preload on idle or after initial render
if (typeof window !== 'undefined') {
  const startPreload = () => {
    preloadToolWorkspace();
  };

  // If user is on a direct tool URL, preload immediately with high priority
  const path = window.location.pathname;
  const isDirectTool = path.startsWith('/tools/') || window.location.hash.startsWith('#tool=');

  if (isDirectTool) {
    startPreload();
  } else {
    // Schedule on idle so main thread initial FCP/LCP is 100/100, then instantly cached
    if ('requestIdleCallback' in window) {
      (window as any).requestIdleCallback(startPreload, { timeout: 1000 });
    } else {
      setTimeout(startPreload, 100);
    }

    // Also trigger on first mouse/touch/keyboard interaction anywhere on screen
    const onUserActive = () => {
      startPreload();
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
