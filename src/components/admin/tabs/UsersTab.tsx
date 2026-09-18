import React, { useState } from 'react';
import { 
  Key, Shield, UserCheck, Lock, 
  Activity, CheckCircle2, AlertCircle, Save, ShieldAlert, Check
} from 'lucide-react';
import { AdminUser, ActivityLogItem } from '../../../types/admin';
import { updateAdminPassword, clearActivityLogs, DEFAULT_ADMIN_CREDENTIALS } from '../../../utils/adminStorage';

interface UsersTabProps {
  currentUser: AdminUser;
  activityLogs: ActivityLogItem[];
  onRefreshLogs: () => void;
  showToast: (msg: string) => void;
}

export const UsersTab: React.FC<UsersTabProps> = ({
  currentUser,
  activityLogs,
  onRefreshLogs,
  showToast,
}) => {
  // Password change state
  const [currentPass, setCurrentPass] = useState('');
  const [newPass, setNewPass] = useState('');
  const [confirmPass, setConfirmPass] = useState('');
  const [passError, setPassError] = useState<string | null>(null);
  const [passSuccess, setPassSuccess] = useState<string | null>(null);

  const handlePasswordChange = (e: React.FormEvent) => {
    e.preventDefault();
    setPassError(null);
    setPassSuccess(null);

    if (newPass !== confirmPass) {
      setPassError('New passwords do not match.');
      return;
    }

    if (newPass.length < 6) {
      setPassError('Password must be at least 6 characters long.');
      return;
    }

    const res = updateAdminPassword(currentPass, newPass);
    if (res.success) {
      setPassSuccess('Master administrator password successfully updated!');
      showToast('Master administrator password successfully updated!');
      setCurrentPass('');
      setNewPass('');
      setConfirmPass('');
    } else {
      setPassError(res.error || 'Failed to update password. Please check your current password.');
    }
  };

  const handleClearLogs = () => {
    if (confirm('Clear all audit logs?')) {
      clearActivityLogs();
      onRefreshLogs();
      showToast('Activity logs cleared.');
    }
  };

  return (
    <div className="space-y-6 text-xs">
      {/* Header */}
      <div className="card-glass p-5 sm:p-6 bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-2xl shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h2 className="text-lg font-bold text-[var(--text-primary)]">
              Exclusive Administrator Access & Security
            </h2>
            <span className="px-2 py-0.5 text-[10px] rounded-md font-semibold bg-blue-500/10 text-[#2E9BFF] border border-blue-500/20">
              Single-Tenant Mode
            </span>
          </div>
          <p className="text-xs text-[var(--text-secondary)]">
            Control panel access is locked strictly to Ajay Ade (<strong className="text-[var(--text-primary)]">ajayade1004@gmail.com</strong>). Auxiliary sub-users and guest administrators are disabled.
          </p>
        </div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 font-semibold text-[11px]">
          <Shield size={13} />
          <span>Access Restricted to Owner</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Profile & Password */}
        <div className="lg:col-span-6 space-y-6">
          {/* Active Profile Info */}
          <div className="card-glass p-6 bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-2xl shadow-xs space-y-3">
            <h3 className="text-sm font-bold text-[var(--text-primary)] flex items-center gap-2">
              <UserCheck size={16} className="text-emerald-500" />
              Sole Master Administrator Profile
            </h3>
            <div className="p-4 rounded-xl bg-[var(--bg-input)] border border-[var(--border-subtle)] space-y-2.5 text-xs">
              <div className="flex justify-between items-center">
                <span className="text-[var(--text-muted)]">Full Name:</span>
                <span className="font-bold text-[var(--text-primary)]">Ajay Ade</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[var(--text-muted)]">Master Email:</span>
                <span className="font-mono font-semibold text-[#2E9BFF]">ajayade1004@gmail.com</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[var(--text-muted)]">Access Level:</span>
                <span className="px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-400 font-bold text-[10px]">
                  ALL PRIVILEGES (OWNER)
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[var(--text-muted)]">Multi-Tenant Access:</span>
                <span className="text-xs font-semibold text-rose-400">DISABLED (Strict Single Owner)</span>
              </div>
            </div>
          </div>

          {/* Change Password Form */}
          <form onSubmit={handlePasswordChange} className="card-glass p-6 bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-2xl shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-[var(--text-primary)] flex items-center gap-2">
              <Key size={16} className="text-[#2E9BFF]" />
              Update Master Administrator Password
            </h3>

            {passError && (
              <div className="p-3 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs flex items-center gap-2">
                <AlertCircle size={14} className="shrink-0" />
                <span>{passError}</span>
              </div>
            )}

            {passSuccess && (
              <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs flex items-center gap-2">
                <Check size={14} className="shrink-0" />
                <span>{passSuccess}</span>
              </div>
            )}

            <div>
              <label className="block font-semibold text-[var(--text-primary)] mb-1">
                Current Password
              </label>
              <input
                type="password"
                value={currentPass}
                onChange={(e) => setCurrentPass(e.target.value)}
                placeholder="Enter current master password"
                required
                className="w-full bg-[var(--bg-input)] border border-[var(--border-subtle)] rounded-lg px-3 py-2 text-[var(--text-primary)] outline-none focus:border-[#2E9BFF]"
              />
            </div>

            <div>
              <label className="block font-semibold text-[var(--text-primary)] mb-1">
                New Master Password
              </label>
              <input
                type="password"
                value={newPass}
                onChange={(e) => setNewPass(e.target.value)}
                placeholder="Minimum 6 characters"
                required
                className="w-full bg-[var(--bg-input)] border border-[var(--border-subtle)] rounded-lg px-3 py-2 text-[var(--text-primary)] outline-none focus:border-[#2E9BFF]"
              />
            </div>

            <div>
              <label className="block font-semibold text-[var(--text-primary)] mb-1">
                Confirm New Password
              </label>
              <input
                type="password"
                value={confirmPass}
                onChange={(e) => setConfirmPass(e.target.value)}
                placeholder="Re-enter new password"
                required
                className="w-full bg-[var(--bg-input)] border border-[var(--border-subtle)] rounded-lg px-3 py-2 text-[var(--text-primary)] outline-none focus:border-[#2E9BFF]"
              />
            </div>

            <button
              type="submit"
              className="btn btn-primary py-2 px-5 rounded-lg flex items-center gap-1.5 font-semibold cursor-pointer shadow-md"
            >
              <Save size={14} /> Update Master Password
            </button>
          </form>
        </div>

        {/* Right Column: Security Policy & Audit Trail */}
        <div className="lg:col-span-6 space-y-6">
          {/* Single Owner Policy Notice */}
          <div className="card-glass p-6 bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-2xl shadow-xs space-y-3">
            <h3 className="text-sm font-bold text-[var(--text-primary)] flex items-center gap-2">
              <ShieldAlert size={16} className="text-amber-400" />
              Access Control Enforcement Policy
            </h3>
            <div className="p-4 rounded-xl bg-[var(--bg-input)] border border-[var(--border-subtle)] space-y-2 text-xs leading-relaxed text-[var(--text-secondary)]">
              <div className="flex items-start gap-2">
                <CheckCircle2 size={14} className="text-emerald-400 shrink-0 mt-0.5" />
                <span><strong>No Public Registrations:</strong> The application does not accept any user signups or logins from public visitors.</span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle2 size={14} className="text-emerald-400 shrink-0 mt-0.5" />
                <span><strong>No Sub-Admins:</strong> Sub-account creation is locked out so no external user can ever obtain admin privileges.</span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle2 size={14} className="text-emerald-400 shrink-0 mt-0.5" />
                <span><strong>Exclusive Keyholder:</strong> Only Ajay Ade credentials will authenticate the admin console.</span>
              </div>
            </div>
          </div>

          {/* Activity Audit Logs */}
          <div className="card-glass p-6 bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-2xl shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-[var(--text-primary)] flex items-center gap-2">
                <Activity size={16} className="text-emerald-500" />
                Security & Activity Audit Trail
              </h3>
              <button
                type="button"
                onClick={handleClearLogs}
                className="text-[11px] text-[var(--text-muted)] hover:text-rose-400 cursor-pointer"
              >
                Clear Log
              </button>
            </div>

            <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
              {activityLogs.map((log) => (
                <div key={log.id} className="p-2.5 rounded-xl bg-[var(--bg-input)] border border-[var(--border-subtle)] space-y-1 text-[11px]">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-[var(--text-primary)]">{log.action}</span>
                    <span className="font-mono text-[10px] text-[var(--text-muted)]">
                      {new Date(log.timestamp).toLocaleTimeString()}
                    </span>
                  </div>
                  <p className="text-[var(--text-secondary)]">{log.details}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
