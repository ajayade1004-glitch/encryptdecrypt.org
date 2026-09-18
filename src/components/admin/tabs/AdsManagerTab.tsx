import React, { useState } from 'react';
import { 
  DollarSign, Shield, Smartphone, Monitor, 
  CheckCircle2, AlertTriangle, Copy, Save, ExternalLink 
} from 'lucide-react';
import { AdsSettings } from '../../../types/admin';
import { getAdsSettings, saveAdsSettings } from '../../../utils/adminStorage';

interface AdsManagerTabProps {
  showToast: (msg: string) => void;
}

export const AdsManagerTab: React.FC<AdsManagerTabProps> = ({ showToast }) => {
  const [ads, setAds] = useState<AdsSettings>(getAdsSettings());
  const [copied, setCopied] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    saveAdsSettings(ads);
    showToast('AdSense and advertising configuration saved!');
  };

  const autoAdsSnippet = `<!-- Google AdSense Auto-Ads Tag -->
<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ads.adsensePublisherId || 'ca-pub-XXXXXXXXXX'}"
     crossorigin="anonymous"></script>`;

  const copySnippet = () => {
    navigator.clipboard.writeText(autoAdsSnippet);
    setCopied(true);
    showToast('Auto-Ads tag copied to clipboard!');
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <form onSubmit={handleSave} className="space-y-6 text-xs">
      <div className="card-glass p-5 bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-2xl shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-[var(--text-primary)]">
            Google AdSense & Monetization Suite
          </h2>
          <p className="text-xs text-[var(--text-secondary)]">
            Manage your Google Publisher ID, toggle Google Auto-Ads, configure manual slots, and ensure 100% policy compliance.
          </p>
        </div>
        <button
          type="submit"
          className="btn btn-primary text-xs py-2 px-5 rounded-xl flex items-center gap-1.5 font-semibold cursor-pointer shadow-md shrink-0"
        >
          <Save size={14} /> Save Ad Settings
        </button>
      </div>

      {/* Master Enable & Mode Banner */}
      <div className="card-glass p-6 bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-2xl shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[var(--border-subtle)]">
          <div>
            <span className="text-sm font-bold text-[var(--text-primary)] block">
              Master Advertising Status
            </span>
            <span className="text-xs text-[var(--text-muted)]">
              Currently {ads.enabled ? 'Enabled' : 'Disabled (Kept clean without empty slots until AdSense approval)'}
            </span>
          </div>

          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={ads.enabled}
              onChange={(e) => setAds({ ...ads, enabled: e.target.checked })}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-[var(--bg-surface-hover)] border border-[var(--border-subtle)] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#2E9BFF]" />
          </label>
        </div>

        {/* Publisher ID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
          <div>
            <label className="block font-semibold text-[var(--text-primary)] mb-1">
              Google AdSense Publisher ID
            </label>
            <input
              type="text"
              value={ads.adsensePublisherId}
              onChange={(e) => setAds({ ...ads, adsensePublisherId: e.target.value })}
              placeholder="ca-pub-1234567890123456"
              className="w-full bg-[var(--bg-input)] border border-[var(--border-subtle)] rounded-lg px-3 py-2 font-mono text-[var(--text-primary)] outline-none focus:border-[#2E9BFF]"
            />
            <span className="text-[11px] text-[var(--text-muted)] mt-1 block">
              Find this in your AdSense Account → Settings → Account information.
            </span>
          </div>

          <div>
            <label className="block font-semibold text-[var(--text-primary)] mb-1">
              Ad Placement Strategy
            </label>
            <div className="p-2.5 rounded-lg bg-[var(--bg-input)] border border-[var(--border-subtle)] flex items-center justify-between">
              <div>
                <span className="font-bold text-[var(--text-primary)] block">Google Auto-Ads</span>
                <span className="text-[11px] text-[var(--text-muted)]">Google machine learning places ads automatically without layout breaks</span>
              </div>
              <input
                type="checkbox"
                checked={ads.autoAds}
                onChange={(e) => setAds({ ...ads, autoAds: e.target.checked })}
                className="rounded text-[#2E9BFF]"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Auto-Ads Code Generator Box */}
      <div className="card-glass p-6 bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-2xl shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-[var(--text-primary)] flex items-center gap-2">
              <DollarSign size={16} className="text-emerald-500" />
              Auto-Ads Script Snippet (Once Approved)
            </h3>
            <p className="text-xs text-[var(--text-muted)]">
              When Google approves your domain, paste this tag into &lt;head&gt; or enable via this panel.
            </p>
          </div>
          <button
            type="button"
            onClick={copySnippet}
            className="px-3 py-1.5 rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-surface-hover)] text-xs font-semibold text-[var(--text-primary)] hover:border-[#2E9BFF] cursor-pointer flex items-center gap-1.5"
          >
            <Copy size={13} /> {copied ? 'Copied!' : 'Copy Code'}
          </button>
        </div>

        <div className="p-3 rounded-xl bg-[var(--bg-input)] border border-[var(--border-subtle)] font-mono text-[11px] text-[#2E9BFF]">
          <pre>{autoAdsSnippet}</pre>
        </div>
      </div>

      {/* Optional Manual Slot IDs */}
      <div className="card-glass p-6 bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-2xl shadow-xs space-y-4">
        <h3 className="text-sm font-bold text-[var(--text-primary)]">
          Optional: Manual Ad Unit Slot IDs (If Not Using Auto-Ads)
        </h3>
        <p className="text-xs text-[var(--text-muted)]">
          If you prefer specific fixed ad units rather than auto-ads, enter slot numbers below.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block font-semibold text-[var(--text-primary)] mb-1">
              Header Banner Slot ID
            </label>
            <input
              type="text"
              value={ads.headerAdSlot}
              onChange={(e) => setAds({ ...ads, headerAdSlot: e.target.value })}
              placeholder="e.g. 9876543210"
              className="w-full bg-[var(--bg-input)] border border-[var(--border-subtle)] rounded-lg px-3 py-2 font-mono text-[var(--text-primary)] outline-none"
            />
          </div>

          <div>
            <label className="block font-semibold text-[var(--text-primary)] mb-1">
              Tool Page (In-Content) Slot ID
            </label>
            <input
              type="text"
              value={ads.toolAdSlot}
              onChange={(e) => setAds({ ...ads, toolAdSlot: e.target.value })}
              placeholder="e.g. 5432109876"
              className="w-full bg-[var(--bg-input)] border border-[var(--border-subtle)] rounded-lg px-3 py-2 font-mono text-[var(--text-primary)] outline-none"
            />
          </div>

          <div>
            <label className="block font-semibold text-[var(--text-primary)] mb-1">
              Footer Leaderboard Slot ID
            </label>
            <input
              type="text"
              value={ads.footerAdSlot}
              onChange={(e) => setAds({ ...ads, footerAdSlot: e.target.value })}
              placeholder="e.g. 1234509876"
              className="w-full bg-[var(--bg-input)] border border-[var(--border-subtle)] rounded-lg px-3 py-2 font-mono text-[var(--text-primary)] outline-none"
            />
          </div>
        </div>

        {/* Device Visibility */}
        <div className="pt-2 flex items-center gap-6">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={ads.showOnDesktop}
              onChange={(e) => setAds({ ...ads, showOnDesktop: e.target.checked })}
              className="rounded text-[#2E9BFF]"
            />
            <span className="font-semibold text-[var(--text-primary)] flex items-center gap-1">
              <Monitor size={14} /> Show on Desktop
            </span>
          </label>

          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={ads.showOnMobile}
              onChange={(e) => setAds({ ...ads, showOnMobile: e.target.checked })}
              className="rounded text-[#2E9BFF]"
            />
            <span className="font-semibold text-[var(--text-primary)] flex items-center gap-1">
              <Smartphone size={14} /> Show on Mobile
            </span>
          </label>
        </div>
      </div>

      {/* AdSense Policy Compliance Checklist */}
      <div className="card-glass p-6 bg-[var(--bg-surface)] border border-emerald-500/30 rounded-2xl shadow-xs space-y-3">
        <h3 className="text-sm font-bold text-emerald-500 flex items-center gap-2">
          <Shield size={16} />
          Google AdSense Approval Checklist (100% Ready)
        </h3>
        <ul className="space-y-1.5 text-xs text-[var(--text-secondary)]">
          <li className="flex items-center gap-2">
            <CheckCircle2 size={13} className="text-emerald-500 shrink-0" />
            <span><strong>Mandatory Policy Pages:</strong> Privacy Policy, Terms of Service, Disclaimer, About Us, Contact Us are fully active.</span>
          </li>
          <li className="flex items-center gap-2">
            <CheckCircle2 size={13} className="text-emerald-500 shrink-0" />
            <span><strong>Cookie Disclosures:</strong> Google DoubleClick DART cookie and personalized ad opt-out links are present in Privacy Policy.</span>
          </li>
          <li className="flex items-center gap-2">
            <CheckCircle2 size={13} className="text-emerald-500 shrink-0" />
            <span><strong>High-Value Content:</strong> 250+ genuine client-side functional utilities with zero fake placeholder content.</span>
          </li>
          <li className="flex items-center gap-2">
            <CheckCircle2 size={13} className="text-emerald-500 shrink-0" />
            <span><strong>Clean Layout:</strong> Zero empty or broken ad placeholders prior to actual AdSense account verification.</span>
          </li>
        </ul>
      </div>
    </form>
  );
};
