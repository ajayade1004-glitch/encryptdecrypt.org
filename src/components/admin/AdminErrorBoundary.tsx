import React, { ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface Props {
  children: ReactNode;
  tabName?: string;
  onReset?: () => void;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class AdminErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
    };
  }

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error(`Error caught in ${this.props.tabName || 'Admin Tab'}:`, error, errorInfo);
  }

  private handleReload = () => {
    this.setState({ hasError: false, error: null });
    if (this.props.onReset) {
      this.props.onReset();
    }
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="card-glass p-8 bg-[var(--bg-surface)] border border-rose-500/30 rounded-2xl shadow-xl space-y-4 text-center my-6">
          <div className="w-12 h-12 rounded-full bg-rose-500/10 text-rose-500 flex items-center justify-center mx-auto">
            <AlertTriangle size={24} />
          </div>
          <div>
            <h3 className="text-base font-bold text-[var(--text-primary)]">
              An error occurred while loading {this.props.tabName || 'this section'}
            </h3>
            <p className="text-xs text-[var(--text-secondary)] mt-1 max-w-md mx-auto">
              The control panel intercepted a render issue safely. Your data and settings are preserved.
            </p>
            {this.state.error?.message && (
              <div className="mt-3 p-3 rounded-lg bg-[var(--bg-input)] border border-[var(--border-subtle)] font-mono text-[11px] text-rose-400 max-w-lg mx-auto text-left overflow-x-auto">
                {this.state.error.message}
              </div>
            )}
          </div>
          <button
            type="button"
            onClick={this.handleReload}
            className="btn btn-primary text-xs py-2 px-4 rounded-xl inline-flex items-center gap-2 cursor-pointer shadow-md"
          >
            <RefreshCw size={14} /> Reload {this.props.tabName || 'Section'}
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
