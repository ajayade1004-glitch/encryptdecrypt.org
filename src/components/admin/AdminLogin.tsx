import React, { useState } from 'react';
import { Shield, Lock, User, Eye, EyeOff, KeyRound, AlertCircle, ArrowLeft, CheckCircle2, X } from 'lucide-react';
import { authenticateAdmin } from '../../utils/adminStorage';
import { AdminUser } from '../../types/admin';

interface AdminLoginProps {
  onSuccess?: (user: AdminUser) => void;
  onLoginSuccess?: (user: AdminUser) => void;
  onExit?: () => void;
  onCancel?: () => void;
}

export const AdminLogin: React.FC<AdminLoginProps> = ({ 
  onSuccess, 
  onLoginSuccess, 
  onExit, 
  onCancel 
}) => {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Unified exit handler that ensures modal closes and URL hash resets
  const handleExit = () => {
    if (onCancel) onCancel();
    if (onExit) onExit();
    if (window.location.hash === '#admin' || window.location.hash === 'admin') {
      window.location.hash = '';
    }
  };

  // Unified success handler supporting both prop names
  const handleLoginSuccess = (user: AdminUser) => {
    if (onLoginSuccess) onLoginSuccess(user);
    if (onSuccess) onSuccess(user);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    setTimeout(() => {
      const res = authenticateAdmin(identifier, password);
      setLoading(false);
      if (res.success && res.user) {
        handleLoginSuccess(res.user);
      } else {
        setError(res.error || 'Invalid administrator credentials. Access is restricted.');
      }
    }, 300);
  };

  return (
    <div className="min-h-[85vh] w-full flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-md">
        {/* Back link & Close */}
        <div className="flex items-center justify-between mb-4">
          <button
            type="button"
            onClick={handleExit}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-[var(--text-secondary)] hover:text-[#2E9BFF] transition cursor-pointer px-2 py-1 rounded-lg hover:bg-[var(--bg-surface-hover)]"
          >
            <ArrowLeft size={14} /> Back to Live Website
          </button>
          <button
            type="button"
            onClick={handleExit}
            className="p-1.5 rounded-lg text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-surface-hover)] transition cursor-pointer"
            title="Close Admin Login"
          >
            <X size={18} />
          </button>
        </div>

        <div className="card-glass p-6 sm:p-8 bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-2xl shadow-2xl relative overflow-hidden">
          {/* Close button inside modal */}
          <button
            type="button"
            onClick={handleExit}
            className="absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-surface-hover)] transition cursor-pointer"
            title="Close"
          >
            <X size={16} />
          </button>

          {/* Header */}
          <div className="text-center mb-6">
            <div className="w-13 h-13 rounded-2xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-[#2E9BFF] mx-auto mb-3 shadow-sm">
              <Shield size={26} />
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-[var(--text-primary)] tracking-tight">
              Control Panel Authentication
            </h1>
            <p className="text-xs text-[var(--text-muted)] mt-1">
              Authorized personnel only. All access attempts are logged.
            </p>
          </div>

          {/* Error Alert */}
          {error && (
            <div className="mb-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs flex items-start gap-2">
              <AlertCircle size={15} className="shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-[var(--text-primary)] mb-1">
                Admin Username or Email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[var(--text-muted)]">
                  <User size={15} />
                </div>
                <input
                  type="text"
                  value={identifier}
                  onChange={(e) => { setIdentifier(e.target.value); setError(null); }}
                  placeholder="Enter administrator username"
                  autoComplete="username"
                  required
                  className="w-full bg-[var(--bg-input)] border border-[var(--border-subtle)] rounded-lg pl-9 pr-3 py-2.5 text-xs text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:border-[#2E9BFF] transition"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-semibold text-[var(--text-primary)]">
                  Master Password
                </label>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[var(--text-muted)]">
                  <Lock size={15} />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => { setPassword(e.target.value); setError(null); }}
                  placeholder="Enter administrator password"
                  autoComplete="current-password"
                  required
                  className="w-full bg-[var(--bg-input)] border border-[var(--border-subtle)] rounded-lg pl-9 pr-10 py-2.5 text-xs text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:border-[#2E9BFF] transition"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(prev => !prev)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-[var(--text-muted)] hover:text-[var(--text-primary)] cursor-pointer"
                  tabIndex={-1}
                  title={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full btn btn-primary py-2.5 text-xs font-semibold rounded-lg flex items-center justify-center gap-2 cursor-pointer transition shadow-md mt-2"
            >
              {loading ? (
                <span>Authenticating...</span>
              ) : (
                <>
                  <KeyRound size={14} /> Enter Admin Control Panel
                </>
              )}
            </button>
          </form>

          {/* Security Notice Footer */}
          <div className="mt-5 pt-4 border-t border-[var(--border-subtle)] text-center text-[10px] text-[var(--text-muted)] flex items-center justify-center gap-1.5">
            <CheckCircle2 size={12} className="text-emerald-500" />
            <span>Restricted Access • Encrypted Authentication</span>
          </div>
        </div>
      </div>
    </div>
  );
};
