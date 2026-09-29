import React, { Component, ErrorInfo, ReactNode } from 'react';
import { RefreshCw, AlertTriangle, Home } from 'lucide-react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  autoReloading: boolean;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
    autoReloading: false,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error, autoReloading: false };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an unhandled error:', error, errorInfo);

    // Check if error is due to a stale deployment or dynamic chunk fetch failure
    const isChunkError = 
      error?.message?.includes('Failed to fetch dynamically imported module') ||
      error?.message?.includes('Importing a module script failed') ||
      error?.message?.includes('dynamically imported module') ||
      error?.name === 'ChunkLoadError' ||
      error?.stack?.includes('chunk');

    if (isChunkError && typeof window !== 'undefined') {
      const reloadKey = 'ed_auto_recovered_chunk';
      const lastAttempt = sessionStorage.getItem(reloadKey);
      const now = Date.now();

      // Only auto-reload if we haven't already attempted within the last 15 seconds
      if (!lastAttempt || now - parseInt(lastAttempt, 10) > 15000) {
        sessionStorage.setItem(reloadKey, now.toString());
        this.setState({ autoReloading: true });
        setTimeout(() => {
          window.location.reload();
        }, 300);
      }
    }
  }

  private handleManualReload = () => {
    try {
      sessionStorage.removeItem('ed_auto_recovered_chunk');
      sessionStorage.removeItem('ed_tools_catalog_cache');
    } catch {}
    window.location.reload();
  };

  private handleGoHome = () => {
    try {
      sessionStorage.removeItem('ed_auto_recovered_chunk');
    } catch {}
    window.location.href = '/';
  };

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-screen bg-[#030712] text-slate-100 flex flex-col items-center justify-center p-4">
          <div className="w-full max-w-md bg-[#0B0F19] border border-blue-500/30 rounded-2xl p-6 sm:p-8 text-center shadow-2xl relative overflow-hidden">
            <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 mx-auto mb-4">
              <AlertTriangle size={28} />
            </div>

            <h2 className="text-xl font-bold tracking-tight text-white mb-2">
              {this.state.autoReloading ? 'Refreshing Workspace...' : 'Application Recovery'}
            </h2>

            <p className="text-xs text-slate-300 leading-relaxed mb-6">
              {this.state.autoReloading
                ? 'Updating cryptographic components to the latest version...'
                : 'A temporary network glitch or update prevented components from loading. Refreshing will restore the workspace.'}
            </p>

            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={this.handleManualReload}
                className="flex-1 py-2.5 px-4 rounded-xl bg-gradient-to-r from-blue-600 to-sky-500 hover:from-blue-500 hover:to-sky-400 text-white font-semibold text-xs transition flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-blue-500/20"
              >
                <RefreshCw size={14} className={this.state.autoReloading ? 'animate-spin' : ''} />
                Refresh Page
              </button>
              <button
                onClick={this.handleGoHome}
                className="py-2.5 px-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 hover:text-white font-semibold text-xs transition flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Home size={14} />
                Home
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
