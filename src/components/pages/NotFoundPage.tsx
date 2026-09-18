import React, { useState } from 'react';
import { Shield, Search, ArrowLeft, Terminal, Sparkles } from 'lucide-react';
import { SeoHead } from '../SeoHead';
import { ToolItem } from '../../types';

interface NotFoundPageProps {
  onNavigateHome: () => void;
  onSelectToolBySlug: (slug: string) => void;
  tools: ToolItem[];
}

export const NotFoundPage: React.FC<NotFoundPageProps> = ({
  onNavigateHome,
  onSelectToolBySlug,
  tools,
}) => {
  const [searchQuery, setSearchQuery] = useState('');

  const filtered = searchQuery.trim()
    ? tools.filter(t =>
        t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.slug.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.shortDesc.toLowerCase().includes(searchQuery.toLowerCase())
      ).slice(0, 8)
    : [];

  const popularShortcuts = [
    { name: 'Base64 Encode/Decode', slug: 'base64-encode-decode', category: 'Encoding' },
    { name: 'AES-256 Encryption', slug: 'aes-encryption-decryption', category: 'Ciphers' },
    { name: 'SHA-256 Hash Generator', slug: 'sha-256-hash-generator', category: 'Hashing' },
    { name: 'UUID/GUID Generator', slug: 'uuid-guid-generator', category: 'Generators' },
    { name: 'Password Generator', slug: 'secure-password-generator', category: 'Security' },
    { name: 'URL Encode/Decode', slug: 'url-encode-decode', category: 'Encoding' },
    { name: 'JWT Debugger', slug: 'jwt-token-debugger-generator', category: 'Security' },
    { name: 'QR Code Generator', slug: 'qr-code-generator', category: 'Utilities' },
  ];

  return (
    <div className="container py-12 max-w-4xl mx-auto">
      <SeoHead
        title="404 - Page Not Found | EncryptDecrypt.org"
        description="The requested tool or page could not be found. Explore 330+ free, client-side cryptography, encoding, and developer tools at EncryptDecrypt.org."
        canonicalUrl="https://encryptdecrypt.org/404"
        noIndex={true}
      />

      <div className="card-glass p-8 sm:p-12 text-center bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-2xl shadow-sm">
        <div className="w-16 h-16 rounded-2xl bg-blue-500/10 border border-blue-500/20 text-[#2E9BFF] flex items-center justify-center mx-auto mb-4">
          <Terminal size={32} />
        </div>

        <span className="text-xs font-mono font-bold text-[#2E9BFF] uppercase tracking-wider px-2.5 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 inline-block mb-3">
          Error 404 · Resource Not Found
        </span>

        <h1 className="text-3xl sm:text-4xl font-extrabold text-[var(--text-primary)] tracking-tight mb-3">
          Tool or Page Not Found
        </h1>

        <p className="text-sm sm:text-base text-[var(--text-secondary)] max-w-xl mx-auto mb-8 leading-relaxed">
          The link you followed may be broken, or the tool slug may have been updated. Don&apos;t worry—all 330+ client-side developer utilities are active and running. Search or pick a tool below:
        </p>

        {/* Live Search */}
        <div className="max-w-md mx-auto mb-8">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[var(--text-muted)]">
              <Search size={16} />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search 330+ tools (e.g. aes, base64, sha256)..."
              className="w-full h-11 bg-[var(--bg-input)] border border-[var(--border-subtle)] rounded-xl pl-10 pr-4 text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:border-[#2E9BFF] focus:ring-1 focus:ring-[#2E9BFF] transition"
              autoFocus
            />
          </div>

          {/* Search suggestions dropdown */}
          {filtered.length > 0 && (
            <div className="mt-2 bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-xl shadow-lg overflow-hidden text-left divide-y divide-[var(--border-subtle)]">
              {filtered.map(tool => (
                <button
                  key={tool.id}
                  onClick={() => onSelectToolBySlug(tool.slug)}
                  className="w-full p-3 hover:bg-[var(--bg-surface-hover)] transition flex items-center justify-between text-xs cursor-pointer group"
                >
                  <div>
                    <div className="font-bold text-[var(--text-primary)] group-hover:text-[#2E9BFF]">{tool.name}</div>
                    <div className="text-[11px] text-[var(--text-muted)] line-clamp-1">{tool.shortDesc}</div>
                  </div>
                  <span className="text-[#2E9BFF] font-semibold text-[11px] shrink-0 ml-2">Open →</span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Popular Shortcuts */}
        <div className="border-t border-[var(--border-subtle)] pt-8 mb-8 text-left">
          <h2 className="text-xs font-bold uppercase tracking-wider text-[var(--text-muted)] mb-4 flex items-center gap-1.5">
            <Sparkles size={14} className="text-[#2E9BFF]" />
            Popular Developer Utilities
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
            {popularShortcuts.map(item => (
              <button
                key={item.slug}
                onClick={() => onSelectToolBySlug(item.slug)}
                className="p-3 rounded-xl bg-[var(--bg-surface-hover)] border border-[var(--border-subtle)] hover:border-[#2E9BFF]/50 transition text-left cursor-pointer group"
              >
                <span className="text-[10px] font-mono text-[var(--text-muted)] block mb-1">{item.category}</span>
                <span className="text-xs font-bold text-[var(--text-primary)] group-hover:text-[#2E9BFF] block">{item.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Action Button */}
        <div>
          <button
            onClick={onNavigateHome}
            className="btn btn-primary px-6 py-2.5 text-xs font-semibold inline-flex items-center gap-2 cursor-pointer shadow-sm"
          >
            <ArrowLeft size={14} /> Back to Complete Tools Catalog
          </button>
        </div>
      </div>
    </div>
  );
};
