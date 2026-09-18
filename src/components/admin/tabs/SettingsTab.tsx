import React, { useState } from 'react';
import { Settings, Globe, Mail, Search, Save, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { SystemSettings } from '../../../types/admin';
import { getSystemSettings, saveSystemSettings } from '../../../utils/adminStorage';

interface SettingsTabProps {
  showToast: (msg: string) => void;
}

export const SettingsTab: React.FC<SettingsTabProps> = ({ showToast }) => {
  const [settings, setSettings] = useState<SystemSettings>(getSystemSettings());

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    saveSystemSettings(settings);
    showToast('System & tracking settings saved successfully!');
  };

  const handleResetDefaults = () => {
    if (confirm('Reset system settings to factory default values?')) {
      const defaults: SystemSettings = {
        siteName: 'EncryptDecrypt.org',
        siteTagline: '100% Client-Side Privacy & Cryptography',
        supportEmail: 'support@encryptdecrypt.org',
        developerEmail: 'ajayade1004@gmail.com',
        googleAnalyticsId: '',
        searchConsoleVerification: '',
        footerCopyright: '© 2026 EncryptDecrypt.org',
        maintenanceMode: false,
      };
      setSettings(defaults);
      saveSystemSettings(defaults);
      showToast('Settings reset to factory defaults.');
    }
  };

  return (
    <form onSubmit={handleSave} className="space-y-6 text-xs">
      <div className="card-glass p-5 bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-2xl shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-[var(--text-primary)]">
            System & Webmaster Settings
          </h2>
          <p className="text-xs text-[var(--text-secondary)]">
            Configure site metadata, brand identity, tracking IDs, and contact routing.
          </p>
        </div>
        <button
          type="submit"
          className="btn btn-primary text-xs py-2 px-5 rounded-xl flex items-center gap-1.5 font-semibold cursor-pointer shadow-md shrink-0"
        >
          <Save size={14} /> Save System Settings
        </button>
      </div>

      {/* Brand Identity */}
      <div className="card-glass p-6 bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-2xl shadow-xs space-y-4">
        <h3 className="text-sm font-bold text-[var(--text-primary)] flex items-center gap-2">
          <Globe size={16} className="text-[#2E9BFF]" />
          Brand & Global Identity
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block font-semibold text-[var(--text-primary)] mb-1">
              Website Brand Name
            </label>
            <input
              type="text"
              value={settings.siteName}
              onChange={(e) => setSettings({ ...settings, siteName: e.target.value })}
              className="w-full bg-[var(--bg-input)] border border-[var(--border-subtle)] rounded-lg px-3 py-2 text-[var(--text-primary)] outline-none"
            />
          </div>

          <div>
            <label className="block font-semibold text-[var(--text-primary)] mb-1">
              Global Tagline
            </label>
            <input
              type="text"
              value={settings.siteTagline}
              onChange={(e) => setSettings({ ...settings, siteTagline: e.target.value })}
              className="w-full bg-[var(--bg-input)] border border-[var(--border-subtle)] rounded-lg px-3 py-2 text-[var(--text-primary)] outline-none"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block font-semibold text-[var(--text-primary)] mb-1">
              Direct Developer Contact Email
            </label>
            <input
              type="email"
              value={settings.developerEmail}
              onChange={(e) => setSettings({ ...settings, developerEmail: e.target.value })}
              className="w-full bg-[var(--bg-input)] border border-[var(--border-subtle)] rounded-lg px-3 py-2 font-mono text-[var(--text-primary)] outline-none"
            />
          </div>

          <div>
            <label className="block font-semibold text-[var(--text-primary)] mb-1">
              General Support Email
            </label>
            <input
              type="email"
              value={settings.supportEmail}
              onChange={(e) => setSettings({ ...settings, supportEmail: e.target.value })}
              className="w-full bg-[var(--bg-input)] border border-[var(--border-subtle)] rounded-lg px-3 py-2 font-mono text-[var(--text-primary)] outline-none"
            />
          </div>
        </div>
      </div>

      {/* Webmaster Tracking Verification */}
      <div className="card-glass p-6 bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-2xl shadow-xs space-y-4">
        <h3 className="text-sm font-bold text-[var(--text-primary)] flex items-center gap-2">
          <Search size={16} className="text-purple-400" />
          Webmaster Verification & Traffic Analytics
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block font-semibold text-[var(--text-primary)] mb-1">
              Google Analytics 4 Measurement ID
            </label>
            <input
              type="text"
              value={settings.googleAnalyticsId}
              onChange={(e) => setSettings({ ...settings, googleAnalyticsId: e.target.value })}
              placeholder="G-XXXXXXXXXX"
              className="w-full bg-[var(--bg-input)] border border-[var(--border-subtle)] rounded-lg px-3 py-2 font-mono text-[var(--text-primary)] outline-none"
            />
          </div>

          <div>
            <label className="block font-semibold text-[var(--text-primary)] mb-1">
              Google Search Console Verification Token
            </label>
            <input
              type="text"
              value={settings.searchConsoleVerification}
              onChange={(e) => setSettings({ ...settings, searchConsoleVerification: e.target.value })}
              placeholder="google-site-verification=..."
              className="w-full bg-[var(--bg-input)] border border-[var(--border-subtle)] rounded-lg px-3 py-2 font-mono text-[var(--text-primary)] outline-none"
            />
          </div>
        </div>
      </div>

      {/* Footer Settings */}
      <div className="card-glass p-6 bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-2xl shadow-xs space-y-4">
        <h3 className="text-sm font-bold text-[var(--text-primary)]">
          Footer Branding
        </h3>
        <div>
          <label className="block font-semibold text-[var(--text-primary)] mb-1">
            Footer Copyright Text
          </label>
          <input
            type="text"
            value={settings.footerCopyright}
            onChange={(e) => setSettings({ ...settings, footerCopyright: e.target.value })}
            className="w-full bg-[var(--bg-input)] border border-[var(--border-subtle)] rounded-lg px-3 py-2 text-[var(--text-primary)] outline-none"
          />
        </div>
      </div>

      {/* Reset Section */}
      <div className="p-4 rounded-xl border border-rose-500/20 bg-rose-500/5 flex items-center justify-between">
        <div>
          <span className="font-bold text-rose-400 block">Factory Settings Reset</span>
          <span className="text-[11px] text-[var(--text-muted)]">Restore baseline URLs, emails, and system branding.</span>
        </div>
        <button
          type="button"
          onClick={handleResetDefaults}
          className="px-3 py-1.5 rounded-lg bg-rose-500/15 border border-rose-500/30 text-rose-400 hover:bg-rose-500/25 font-semibold cursor-pointer"
        >
          Reset Defaults
        </button>
      </div>
    </form>
  );
};
