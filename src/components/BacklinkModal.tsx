import React, { useState } from 'react';
import { 
  X, Copy, Check, Code, Globe, BookOpen, MessageSquare, 
  ExternalLink, ShieldCheck, Sparkles, Terminal
} from 'lucide-react';
import { ToolItem } from '../types';

interface BacklinkModalProps {
  tool: ToolItem;
  isOpen: boolean;
  onClose: () => void;
}

export const BacklinkModal: React.FC<BacklinkModalProps> = ({ tool, isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'markdown' | 'html' | 'embed' | 'citation' | 'forum'>('markdown');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  if (!isOpen) return null;

  const baseUrl = 'https://www.encryptdecrypt.org';
  const toolUrl = `${baseUrl}/tools/${tool.category}/${tool.slug}/`;
  const encodedName = encodeURIComponent(tool.name);

  // Markdown Badge snippet
  const markdownBadge = `[![${tool.name}](https://img.shields.io/badge/Utility-${encodedName}-2563EB?style=flat-square&logo=code)](${toolUrl})`;
  const markdownText = `[${tool.name} Online](${toolUrl}) — 100% Free, Private In-Browser Developer Utility on EncryptDecrypt.org`;

  // HTML DoFollow snippet
  const htmlAnchor = `<a href="${toolUrl}" target="_blank" rel="noopener" title="${tool.name} - Free Online Utility">${tool.name} - Free In-Browser Tool</a>`;
  const htmlCard = `<div style="padding:16px;border:1px solid #3b82f6;border-radius:10px;background:#0f172a;color:#f8fafc;font-family:sans-serif;max-width:480px;">
  <h4 style="margin:0 0 8px 0;font-size:16px;color:#60a5fa;"><a href="${toolUrl}" target="_blank" rel="noopener" style="color:#60a5fa;text-decoration:none;">${tool.name}</a></h4>
  <p style="margin:0 0 12px 0;font-size:13px;color:#94a3b8;">${tool.shortDesc}</p>
  <a href="${toolUrl}" target="_blank" rel="noopener" style="display:inline-block;padding:6px 14px;background:#2563eb;color:#fff;border-radius:6px;font-size:12px;font-weight:bold;text-decoration:none;">Open Tool Online &rarr;</a>
</div>`;

  // iFrame Embed snippet
  const iframeEmbed = `<iframe src="${toolUrl}" width="100%" height="680" style="border:1px solid #334155;border-radius:12px;max-width:100%;box-shadow:0 4px 12px rgba(0,0,0,0.15);" loading="lazy" title="${tool.name}"></iframe>`;

  // Academic BibTeX snippet
  const bibtexCitation = `@misc{encryptdecrypt_${tool.slug.replace(/-/g, '_')},
  author = {{EncryptDecrypt.org Engineering Team}},
  title = {${tool.name}: Secure Client-Side Web Utility},
  year = {2026},
  url = {${toolUrl}},
  note = {Air-gapped zero-knowledge browser implementation}
}`;

  // Forum BBCode snippet
  const bbcodeLink = `[url=${toolUrl}][b]${tool.name}[/b] - Free Online Tool[/url] - Zero-log client-side utility on EncryptDecrypt.org`;

  const copyToClipboard = async (text: string, key: string) => {
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(text);
      } else {
        const ta = document.createElement('textarea');
        ta.value = text;
        document.body.appendChild(ta);
        ta.select();
        document.execCommand('copy');
        document.body.removeChild(ta);
      }
      setCopiedKey(key);
      setTimeout(() => setCopiedKey(null), 2500);
    } catch (e) {
      console.error('Failed to copy', e);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/70 backdrop-blur-sm animate-fadeIn">
      <div 
        className="relative w-full max-w-2xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-5 border-b border-[var(--border-subtle)] bg-[var(--bg-card)]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-500/15 border border-blue-500/30 text-[#2E9BFF] flex items-center justify-center">
              <Code size={18} />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-[var(--text-primary)] leading-tight">
                Embed &amp; Backlink Badge Generator
              </h3>
              <p className="text-xs text-[var(--text-muted)] leading-tight mt-0.5">
                Generate 100% Organic, DoFollow Citations &amp; Embed Badges for {tool.name}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-surface-hover)] transition cursor-pointer"
            aria-label="Close dialog"
          >
            <X size={20} />
          </button>
        </div>

        {/* Informational Banner */}
        <div className="px-4 sm:px-5 py-2.5 bg-blue-500/10 border-b border-blue-500/20 flex items-center gap-2 text-xs text-blue-300">
          <ShieldCheck size={16} className="text-[#2E9BFF] shrink-0" />
          <span>
            <strong>White-Hat Natural Backlinking:</strong> Copy and paste these badges on GitHub, blogs, documentation, or forums to provide direct value to your users.
          </span>
        </div>

        {/* Tab Selection */}
        <div className="flex border-b border-[var(--border-subtle)] bg-[var(--bg-input)] overflow-x-auto text-xs font-semibold">
          <button
            onClick={() => setActiveTab('markdown')}
            className={`px-4 py-2.5 border-b-2 flex items-center gap-1.5 cursor-pointer whitespace-nowrap transition ${
              activeTab === 'markdown'
                ? 'border-[#2E9BFF] text-[#2E9BFF] bg-[var(--bg-surface)]'
                : 'border-transparent text-[var(--text-muted)] hover:text-[var(--text-primary)]'
            }`}
          >
            <Terminal size={14} />
            Markdown &amp; GitHub
          </button>
          <button
            onClick={() => setActiveTab('html')}
            className={`px-4 py-2.5 border-b-2 flex items-center gap-1.5 cursor-pointer whitespace-nowrap transition ${
              activeTab === 'html'
                ? 'border-[#2E9BFF] text-[#2E9BFF] bg-[var(--bg-surface)]'
                : 'border-transparent text-[var(--text-muted)] hover:text-[var(--text-primary)]'
            }`}
          >
            <Globe size={14} />
            HTML Anchor (DoFollow)
          </button>
          <button
            onClick={() => setActiveTab('embed')}
            className={`px-4 py-2.5 border-b-2 flex items-center gap-1.5 cursor-pointer whitespace-nowrap transition ${
              activeTab === 'embed'
                ? 'border-[#2E9BFF] text-[#2E9BFF] bg-[var(--bg-surface)]'
                : 'border-transparent text-[var(--text-muted)] hover:text-[var(--text-primary)]'
            }`}
          >
            <Code size={14} />
            iFrame Embed Widget
          </button>
          <button
            onClick={() => setActiveTab('citation')}
            className={`px-4 py-2.5 border-b-2 flex items-center gap-1.5 cursor-pointer whitespace-nowrap transition ${
              activeTab === 'citation'
                ? 'border-[#2E9BFF] text-[#2E9BFF] bg-[var(--bg-surface)]'
                : 'border-transparent text-[var(--text-muted)] hover:text-[var(--text-primary)]'
            }`}
          >
            <BookOpen size={14} />
            Academic (BibTeX)
          </button>
          <button
            onClick={() => setActiveTab('forum')}
            className={`px-4 py-2.5 border-b-2 flex items-center gap-1.5 cursor-pointer whitespace-nowrap transition ${
              activeTab === 'forum'
                ? 'border-[#2E9BFF] text-[#2E9BFF] bg-[var(--bg-surface)]'
                : 'border-transparent text-[var(--text-muted)] hover:text-[var(--text-primary)]'
            }`}
          >
            <MessageSquare size={14} />
            Forum / BBCode
          </button>
        </div>

        {/* Tab Content Area */}
        <div className="p-4 sm:p-5 overflow-y-auto space-y-4">
          {activeTab === 'markdown' && (
            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-bold text-[var(--text-primary)] flex items-center gap-1.5">
                    <Sparkles size={13} className="text-[#2E9BFF]" />
                    GitHub README Badge (DoFollow Markdown)
                  </label>
                  <button
                    onClick={() => copyToClipboard(markdownBadge, 'md-badge')}
                    className="flex items-center gap-1 px-2.5 py-1 rounded bg-[#2E9BFF]/15 text-[#2E9BFF] hover:bg-[#2E9BFF]/25 text-xs font-medium transition cursor-pointer"
                  >
                    {copiedKey === 'md-badge' ? <Check size={13} /> : <Copy size={13} />}
                    {copiedKey === 'md-badge' ? 'Copied!' : 'Copy Badge Code'}
                  </button>
                </div>
                <div className="p-3 bg-[var(--bg-input)] border border-[var(--border-subtle)] rounded-lg font-mono text-xs text-[var(--text-secondary)] break-all select-all">
                  {markdownBadge}
                </div>
                <div className="mt-2 p-2.5 rounded-lg bg-[var(--bg-card)] border border-[var(--border-subtle)] flex items-center gap-3">
                  <span className="text-[11px] text-[var(--text-muted)] font-semibold uppercase tracking-wider">Preview:</span>
                  <a href={toolUrl} target="_blank" rel="noopener noreferrer" className="inline-block hover:opacity-85">
                    <img 
                      src={`https://img.shields.io/badge/Utility-${encodedName}-2563EB?style=flat-square&logo=code`} 
                      alt={tool.name} 
                    />
                  </a>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-bold text-[var(--text-primary)]">
                    Standard Markdown Hyperlink
                  </label>
                  <button
                    onClick={() => copyToClipboard(markdownText, 'md-text')}
                    className="flex items-center gap-1 px-2.5 py-1 rounded bg-[var(--bg-input)] hover:bg-[var(--bg-surface-hover)] text-xs text-[var(--text-secondary)] transition cursor-pointer border border-[var(--border-subtle)]"
                  >
                    {copiedKey === 'md-text' ? <Check size={13} /> : <Copy size={13} />}
                    {copiedKey === 'md-text' ? 'Copied!' : 'Copy Link'}
                  </button>
                </div>
                <div className="p-3 bg-[var(--bg-input)] border border-[var(--border-subtle)] rounded-lg font-mono text-xs text-[var(--text-secondary)] break-all select-all">
                  {markdownText}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'html' && (
            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-bold text-[var(--text-primary)] flex items-center gap-1.5">
                    <Globe size={13} className="text-[#2E9BFF]" />
                    Clean HTML Anchor Link (100% DoFollow for Blogs &amp; WordPress)
                  </label>
                  <button
                    onClick={() => copyToClipboard(htmlAnchor, 'html-anchor')}
                    className="flex items-center gap-1 px-2.5 py-1 rounded bg-[#2E9BFF]/15 text-[#2E9BFF] hover:bg-[#2E9BFF]/25 text-xs font-medium transition cursor-pointer"
                  >
                    {copiedKey === 'html-anchor' ? <Check size={13} /> : <Copy size={13} />}
                    {copiedKey === 'html-anchor' ? 'Copied!' : 'Copy HTML Link'}
                  </button>
                </div>
                <div className="p-3 bg-[var(--bg-input)] border border-[var(--border-subtle)] rounded-lg font-mono text-xs text-[var(--text-secondary)] break-all select-all">
                  {htmlAnchor}
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-bold text-[var(--text-primary)]">
                    Styled HTML Resource Card (For Documentation &amp; Dev Portals)
                  </label>
                  <button
                    onClick={() => copyToClipboard(htmlCard, 'html-card')}
                    className="flex items-center gap-1 px-2.5 py-1 rounded bg-[var(--bg-input)] hover:bg-[var(--bg-surface-hover)] text-xs text-[var(--text-secondary)] transition cursor-pointer border border-[var(--border-subtle)]"
                  >
                    {copiedKey === 'html-card' ? <Check size={13} /> : <Copy size={13} />}
                    {copiedKey === 'html-card' ? 'Copied!' : 'Copy Card Code'}
                  </button>
                </div>
                <pre className="p-3 bg-[var(--bg-input)] border border-[var(--border-subtle)] rounded-lg font-mono text-xs text-[var(--text-secondary)] overflow-x-auto select-all m-0">
                  {htmlCard}
                </pre>
              </div>
            </div>
          )}

          {activeTab === 'embed' && (
            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-bold text-[var(--text-primary)] flex items-center gap-1.5">
                    <Code size={13} className="text-[#2E9BFF]" />
                    Interactive Responsive iFrame Embed Code
                  </label>
                  <button
                    onClick={() => copyToClipboard(iframeEmbed, 'iframe-code')}
                    className="flex items-center gap-1 px-2.5 py-1 rounded bg-[#2E9BFF]/15 text-[#2E9BFF] hover:bg-[#2E9BFF]/25 text-xs font-medium transition cursor-pointer"
                  >
                    {copiedKey === 'iframe-code' ? <Check size={13} /> : <Copy size={13} />}
                    {copiedKey === 'iframe-code' ? 'Copied!' : 'Copy Embed Code'}
                  </button>
                </div>
                <p className="text-xs text-[var(--text-muted)] mb-2">
                  Paste this snippet directly into any HTML page, Notion doc, Webflow, WordPress, or documentation site to embed the full interactive tool.
                </p>
                <div className="p-3 bg-[var(--bg-input)] border border-[var(--border-subtle)] rounded-lg font-mono text-xs text-[var(--text-secondary)] break-all select-all">
                  {iframeEmbed}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'citation' && (
            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-bold text-[var(--text-primary)] flex items-center gap-1.5">
                    <BookOpen size={13} className="text-[#2E9BFF]" />
                    BibTeX Academic Citation (LaTeX &amp; University Research)
                  </label>
                  <button
                    onClick={() => copyToClipboard(bibtexCitation, 'bibtex')}
                    className="flex items-center gap-1 px-2.5 py-1 rounded bg-[#2E9BFF]/15 text-[#2E9BFF] hover:bg-[#2E9BFF]/25 text-xs font-medium transition cursor-pointer"
                  >
                    {copiedKey === 'bibtex' ? <Check size={13} /> : <Copy size={13} />}
                    {copiedKey === 'bibtex' ? 'Copied!' : 'Copy BibTeX'}
                  </button>
                </div>
                <pre className="p-3 bg-[var(--bg-input)] border border-[var(--border-subtle)] rounded-lg font-mono text-xs text-[var(--text-secondary)] overflow-x-auto select-all m-0">
                  {bibtexCitation}
                </pre>
              </div>
            </div>
          )}

          {activeTab === 'forum' && (
            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-bold text-[var(--text-primary)] flex items-center gap-1.5">
                    <MessageSquare size={13} className="text-[#2E9BFF]" />
                    BBCode for Developer Forums &amp; Discussion Boards
                  </label>
                  <button
                    onClick={() => copyToClipboard(bbcodeLink, 'bbcode')}
                    className="flex items-center gap-1 px-2.5 py-1 rounded bg-[#2E9BFF]/15 text-[#2E9BFF] hover:bg-[#2E9BFF]/25 text-xs font-medium transition cursor-pointer"
                  >
                    {copiedKey === 'bbcode' ? <Check size={13} /> : <Copy size={13} />}
                    {copiedKey === 'bbcode' ? 'Copied!' : 'Copy BBCode'}
                  </button>
                </div>
                <div className="p-3 bg-[var(--bg-input)] border border-[var(--border-subtle)] rounded-lg font-mono text-xs text-[var(--text-secondary)] break-all select-all">
                  {bbcodeLink}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-3.5 sm:p-4 bg-[var(--bg-card)] border-t border-[var(--border-subtle)] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          <div className="text-[var(--text-muted)] flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Target URL: <code className="text-[var(--text-primary)]">{toolUrl}</code></span>
          </div>
          <button
            onClick={onClose}
            className="w-full sm:w-auto px-4 py-1.5 rounded-lg bg-[var(--bg-input)] hover:bg-[var(--bg-surface-hover)] text-[var(--text-primary)] font-semibold transition cursor-pointer border border-[var(--border-subtle)]"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
