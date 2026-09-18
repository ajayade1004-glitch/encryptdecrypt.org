import React, { useState } from 'react';
import { Home, Sparkles, Megaphone, Check, Save, Zap } from 'lucide-react';
import { ToolItem } from '../../../types';
import { HomepageSettings } from '../../../types/admin';
import { getHomepageSettings, saveHomepageSettings } from '../../../utils/adminStorage';
import { CATEGORY_HUBS_CONFIG } from '../../../App';

interface HomepageManagerTabProps {
  tools: ToolItem[];
  showToast: (msg: string) => void;
}

export const HomepageManagerTab: React.FC<HomepageManagerTabProps> = ({ tools, showToast }) => {
  const [config, setConfig] = useState<HomepageSettings>(getHomepageSettings());

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    saveHomepageSettings(config);
    showToast('Homepage hero & featured content saved successfully!');
  };

  const toggleCategory = (slug: string) => {
    setConfig(prev => {
      const exists = prev.featuredCategorySlugs.includes(slug);
      return {
        ...prev,
        featuredCategorySlugs: exists
          ? prev.featuredCategorySlugs.filter(s => s !== slug)
          : [...prev.featuredCategorySlugs, slug]
      };
    });
  };

  return (
    <form onSubmit={handleSave} className="space-y-6 text-xs">
      <div className="card-glass p-5 bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-2xl shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-[var(--text-primary)]">
            Homepage Structure & Hero Presentation
          </h2>
          <p className="text-xs text-[var(--text-secondary)]">
            Configure headline messaging, hero quick-runner tabs, spotlight categories, and announcement alerts.
          </p>
        </div>
        <button
          type="submit"
          className="btn btn-primary text-xs py-2 px-5 rounded-xl flex items-center gap-1.5 font-semibold cursor-pointer shadow-md shrink-0"
        >
          <Save size={14} /> Save Homepage
        </button>
      </div>

      {/* Hero Section */}
      <div className="card-glass p-6 bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-2xl shadow-xs space-y-4">
        <h3 className="text-sm font-bold text-[var(--text-primary)] flex items-center gap-2">
          <Sparkles size={16} className="text-[#2E9BFF]" />
          Hero Header Section
        </h3>

        <div>
          <label className="block font-semibold text-[var(--text-primary)] mb-1">
            Hero Primary Headline
          </label>
          <input
            type="text"
            value={config.heroTitle}
            onChange={(e) => setConfig({ ...config, heroTitle: e.target.value })}
            className="w-full bg-[var(--bg-input)] border border-[var(--border-subtle)] rounded-lg px-3 py-2 text-[var(--text-primary)] focus:border-[#2E9BFF] outline-none text-sm font-bold"
          />
        </div>

        <div>
          <label className="block font-semibold text-[var(--text-primary)] mb-1">
            Hero Subtitle & Value Proposition
          </label>
          <textarea
            rows={2}
            value={config.heroSubtitle}
            onChange={(e) => setConfig({ ...config, heroSubtitle: e.target.value })}
            className="w-full bg-[var(--bg-input)] border border-[var(--border-subtle)] rounded-lg p-2.5 text-[var(--text-primary)] focus:border-[#2E9BFF] outline-none"
          />
        </div>
      </div>

      {/* Announcement Banner */}
      <div className="card-glass p-6 bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-2xl shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-[var(--text-primary)] flex items-center gap-2">
            <Megaphone size={16} className="text-amber-400" />
            Sitewide Announcement Banner
          </h3>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={config.bannerEnabled}
              onChange={(e) => setConfig({ ...config, bannerEnabled: e.target.checked })}
              className="rounded text-[#2E9BFF]"
            />
            <span className="font-semibold text-[var(--text-primary)]">Enable Top Banner</span>
          </label>
        </div>

        {config.bannerEnabled && (
          <div className="space-y-3 pt-2">
            <div>
              <label className="block font-semibold text-[var(--text-primary)] mb-1">
                Banner Message Text
              </label>
              <input
                type="text"
                value={config.bannerMessage}
                onChange={(e) => setConfig({ ...config, bannerMessage: e.target.value })}
                className="w-full bg-[var(--bg-input)] border border-[var(--border-subtle)] rounded-lg px-3 py-2 text-[var(--text-primary)] outline-none"
              />
            </div>

            <div>
              <label className="block font-semibold text-[var(--text-primary)] mb-1">
                Banner Appearance Style
              </label>
              <select
                value={config.bannerType}
                onChange={(e) => setConfig({ ...config, bannerType: e.target.value as any })}
                className="w-full bg-[var(--bg-input)] border border-[var(--border-subtle)] rounded-lg px-3 py-2 text-[var(--text-primary)] outline-none"
              >
                <option value="info">Info (Blue Accent)</option>
                <option value="success">Success (Emerald Green)</option>
                <option value="warning">Warning / Alert (Amber)</option>
              </select>
            </div>
          </div>
        )}
      </div>

      {/* Spotlight Categories on Homepage */}
      <div className="card-glass p-6 bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-2xl shadow-xs space-y-3">
        <h3 className="text-sm font-bold text-[var(--text-primary)] flex items-center gap-2">
          <Zap size={16} className="text-purple-400" />
          Featured Category Hubs (Homepage Spotlight)
        </h3>
        <p className="text-xs text-[var(--text-muted)]">
          Selected categories receive highlighted pill badges and direct filter shortcuts above the tools grid.
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5 pt-2">
          {CATEGORY_HUBS_CONFIG.map(cat => {
            const isChecked = config.featuredCategorySlugs.includes(cat.slug);
            return (
              <label 
                key={cat.slug} 
                className={`p-3 rounded-xl border transition cursor-pointer flex items-center gap-2.5 ${
                  isChecked 
                    ? 'border-[#2E9BFF] bg-blue-500/10 text-[var(--text-primary)]' 
                    : 'border-[var(--border-subtle)] bg-[var(--bg-surface-hover)] text-[var(--text-secondary)]'
                }`}
              >
                <input
                  type="checkbox"
                  checked={isChecked}
                  onChange={() => toggleCategory(cat.slug)}
                  className="hidden"
                />
                <div className={`w-4 h-4 rounded flex items-center justify-center text-[10px] ${
                  isChecked ? 'bg-[#2E9BFF] text-white' : 'border border-[var(--border-subtle)]'
                }`}>
                  {isChecked && '✓'}
                </div>
                <span className="text-xs font-semibold truncate">{cat.name}</span>
              </label>
            );
          })}
        </div>
      </div>
    </form>
  );
};
