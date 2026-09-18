import React, { useState } from 'react';
import { FileText, Mail, Shield, Save, Check, Scale } from 'lucide-react';
import { PageContentConfig, getPageContent, savePageContent } from '../../../utils/adminStorage';

interface PagesManagerTabProps {
  showToast: (msg: string) => void;
}

export const PagesManagerTab: React.FC<PagesManagerTabProps> = ({ showToast }) => {
  const [content, setContent] = useState<PageContentConfig>(getPageContent());
  const [selectedPage, setSelectedPage] = useState<'about' | 'contact' | 'privacy' | 'terms' | 'disclaimer' | 'guides'>('about');

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    savePageContent(content);
    showToast('Static page content updated successfully!');
  };

  return (
    <div className="space-y-6 text-xs">
      <div className="card-glass p-5 bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-2xl shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-[var(--text-primary)]">
            Static Policy & Information Pages
          </h2>
          <p className="text-xs text-[var(--text-secondary)]">
            Edit text, legal disclaimers, and contact details for all mandatory Google compliance pages.
          </p>
        </div>

        {/* Page Switcher */}
        <div className="flex flex-wrap items-center gap-1.5 p-1 rounded-xl bg-[var(--bg-surface-hover)] border border-[var(--border-subtle)]">
          {[
            { id: 'about', label: 'About Us' },
            { id: 'contact', label: 'Contact Us' },
            { id: 'privacy', label: 'Privacy Policy' },
            { id: 'terms', label: 'Terms' },
            { id: 'disclaimer', label: 'Disclaimer' },
            { id: 'guides', label: 'Tech Guides' },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setSelectedPage(tab.id as any)}
              className={`px-3 py-1.5 rounded-lg font-medium transition cursor-pointer ${
                selectedPage === tab.id ? 'bg-[#2E9BFF] text-white shadow-xs' : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <form onSubmit={handleSave} className="card-glass p-6 bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-2xl shadow-xs space-y-4">
        {selectedPage === 'about' && (
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-[var(--text-primary)] flex items-center gap-2">
              <FileText size={16} className="text-[#2E9BFF]" />
              About Us Page Content
            </h3>
            <div>
              <label className="block font-semibold text-[var(--text-primary)] mb-1">
                Main Headline
              </label>
              <input
                type="text"
                value={content.aboutTitle || ''}
                onChange={(e) => setContent({ ...content, aboutTitle: e.target.value })}
                className="w-full bg-[var(--bg-input)] border border-[var(--border-subtle)] rounded-lg px-3 py-2 text-[var(--text-primary)] outline-none"
              />
            </div>
            <div>
              <label className="block font-semibold text-[var(--text-primary)] mb-1">
                Mission Statement Overview
              </label>
              <textarea
                rows={4}
                value={content.aboutBody || 'EncryptDecrypt.org provides an uncompromising suite of 300+ browser-native utilities where zero data ever leaves your device.'}
                onChange={(e) => setContent({ ...content, aboutBody: e.target.value })}
                className="w-full bg-[var(--bg-input)] border border-[var(--border-subtle)] rounded-lg p-2.5 text-[var(--text-primary)] outline-none"
              />
            </div>
          </div>
        )}

        {selectedPage === 'contact' && (
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-[var(--text-primary)] flex items-center gap-2">
              <Mail size={16} className="text-[#2E9BFF]" />
              Contact Us Configuration
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold text-[var(--text-primary)] mb-1">
                  Primary Developer Contact Email
                </label>
                <input
                  type="email"
                  value={content.contactEmail || 'ajayade1004@gmail.com'}
                  onChange={(e) => setContent({ ...content, contactEmail: e.target.value })}
                  className="w-full bg-[var(--bg-input)] border border-[var(--border-subtle)] rounded-lg px-3 py-2 text-[var(--text-primary)] outline-none"
                />
              </div>
              <div>
                <label className="block font-semibold text-[var(--text-primary)] mb-1">
                  Technical Support Email
                </label>
                <input
                  type="email"
                  defaultValue="support@encryptdecrypt.org"
                  className="w-full bg-[var(--bg-input)] border border-[var(--border-subtle)] rounded-lg px-3 py-2 text-[var(--text-primary)] outline-none"
                />
              </div>
            </div>
          </div>
        )}

        {selectedPage === 'privacy' && (
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-[var(--text-primary)] flex items-center gap-2">
              <Shield size={16} className="text-emerald-500" />
              Privacy Policy Disclosures
            </h3>
            <p className="text-xs text-[var(--text-muted)]">
              Includes mandated Google AdSense DoubleClick cookie disclosures and California CCPA / EU GDPR notices.
            </p>
            <textarea
              rows={6}
              value={content.privacyNotice || 'Zero client-side data storage or transmission. All processing computed locally via W3C Web Cryptography API.'}
              onChange={(e) => setContent({ ...content, privacyNotice: e.target.value })}
              className="w-full bg-[var(--bg-input)] border border-[var(--border-subtle)] rounded-lg p-2.5 text-[var(--text-primary)] outline-none font-mono text-xs"
            />
          </div>
        )}

        {(selectedPage === 'terms' || selectedPage === 'disclaimer' || selectedPage === 'guides') && (
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-[var(--text-primary)] flex items-center gap-2">
              <Scale size={16} className="text-purple-400" />
              {selectedPage.toUpperCase()} Legal & Informational Text
            </h3>
            <textarea
              rows={6}
              defaultValue={`Standard legal parameters and operational specifications for ${selectedPage}. Rigorously aligned with NIST and RFC guidelines.`}
              className="w-full bg-[var(--bg-input)] border border-[var(--border-subtle)] rounded-lg p-2.5 text-[var(--text-primary)] outline-none font-mono text-xs"
            />
          </div>
        )}

        <div className="pt-4 border-t border-[var(--border-subtle)] flex justify-end">
          <button
            type="submit"
            className="btn btn-primary py-2 px-5 rounded-lg flex items-center gap-1.5 font-semibold cursor-pointer shadow-md"
          >
            <Save size={14} /> Save Page Content
          </button>
        </div>
      </form>
    </div>
  );
};
