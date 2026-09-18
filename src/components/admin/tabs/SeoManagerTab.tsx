import React, { useState } from 'react';
import { 
  Globe, Search, Share2, FileCode, Check, Copy, 
  Download, RefreshCw, Save, Code, CheckCircle2, AlertCircle 
} from 'lucide-react';
import { ToolItem } from '../../../types';
import { SeoSettings } from '../../../types/admin';
import { getSeoSettings, saveSeoSettings } from '../../../utils/adminStorage';

interface SeoManagerTabProps {
  tools: ToolItem[];
  showToast: (msg: string) => void;
}

export const SeoManagerTab: React.FC<SeoManagerTabProps> = ({ tools, showToast }) => {
  const [seo, setSeo] = useState<SeoSettings>(getSeoSettings());
  const [activeSubTab, setActiveSubTab] = useState<'meta' | 'og' | 'robots' | 'sitemap' | 'schema'>('meta');
  const [copied, setCopied] = useState<string | null>(null);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    saveSeoSettings(seo);
    showToast('Global SEO & Crawler settings updated successfully!');
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopied(id);
    showToast('Copied to clipboard!');
    setTimeout(() => setCopied(null), 2000);
  };

  // Generate dynamic Sitemap XML for all 300+ tools
  const sitemapXml = React.useMemo(() => {
    const baseUrl = seo.canonicalBase.replace(/\/+$/, '');
    const today = new Date().toISOString().split('T')[0];

    const staticUrls = [
      { loc: `${baseUrl}/`, priority: '1.0', changefreq: 'daily' },
      { loc: `${baseUrl}/#about`, priority: '0.7', changefreq: 'monthly' },
      { loc: `${baseUrl}/#guides`, priority: '0.8', changefreq: 'weekly' },
      { loc: `${baseUrl}/#contact`, priority: '0.7', changefreq: 'monthly' },
      { loc: `${baseUrl}/#privacy`, priority: '0.5', changefreq: 'monthly' },
      { loc: `${baseUrl}/#terms`, priority: '0.5', changefreq: 'monthly' },
      { loc: `${baseUrl}/#disclaimer`, priority: '0.5', changefreq: 'monthly' },
    ];

    const toolUrls = tools.map(t => ({
      loc: `${baseUrl}/#tool=${t.slug}`,
      priority: t.popular ? '0.9' : '0.8',
      changefreq: 'weekly',
    }));

    const allUrls = [...staticUrls, ...toolUrls];

    return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allUrls.map(u => `  <url>
    <loc>${u.loc}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${u.changefreq}</changefreq>
    <priority>${u.priority}</priority>
  </url>`).join('\n')}
</urlset>`;
  }, [seo.canonicalBase, tools]);

  // Generate Schema.org JSON-LD
  const schemaJsonLd = React.useMemo(() => {
    return JSON.stringify({
      "@context": "https://schema.org",
      "@graph": [
        {
          "@type": "WebSite",
          "@id": `${seo.canonicalBase}/#website`,
          "url": seo.canonicalBase,
          "name": "EncryptDecrypt.org",
          "description": seo.defaultDescription,
          "potentialAction": {
            "@type": "SearchAction",
            "target": `${seo.canonicalBase}/#search={search_term_string}`,
            "query-input": "required name=search_term_string"
          }
        },
        {
          "@type": "SoftwareApplication",
          "@id": `${seo.canonicalBase}/#software`,
          "name": "EncryptDecrypt Cryptographic Suite",
          "operatingSystem": "All Web Browsers (Chrome, Firefox, Safari, Edge)",
          "applicationCategory": "DeveloperApplication",
          "offers": {
            "@type": "Offer",
            "price": "0",
            "priceCurrency": "USD"
          },
          "featureList": "Client-side AES-256-GCM, SHA-256, RSA, Base64, UUID, JWT, QR Code, Zero server telemetry"
        }
      ]
    }, null, 2);
  }, [seo.canonicalBase, seo.defaultDescription]);

  const downloadFile = (content: string, filename: string, type: string) => {
    const blob = new Blob([content], { type });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
    showToast(`Downloaded ${filename}`);
  };

  return (
    <div className="space-y-6">
      <div className="card-glass p-5 bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-2xl shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-[var(--text-primary)]">
            SEO, Social Cards & Webmaster Crawler Suite
          </h2>
          <p className="text-xs text-[var(--text-secondary)]">
            Configure global search engine rankings, OpenGraph share previews, robots.txt, and auto-generated 300+ tool sitemaps.
          </p>
        </div>

        {/* Sub Navigation */}
        <div className="flex flex-wrap items-center gap-1.5 p-1 rounded-xl bg-[var(--bg-surface-hover)] border border-[var(--border-subtle)] text-xs">
          <button
            onClick={() => setActiveSubTab('meta')}
            className={`px-3 py-1.5 rounded-lg font-medium transition cursor-pointer ${
              activeSubTab === 'meta' ? 'bg-[#2E9BFF] text-white shadow-xs' : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
            }`}
          >
            Meta & Canonical
          </button>
          <button
            onClick={() => setActiveSubTab('og')}
            className={`px-3 py-1.5 rounded-lg font-medium transition cursor-pointer ${
              activeSubTab === 'og' ? 'bg-[#2E9BFF] text-white shadow-xs' : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
            }`}
          >
            Social OpenGraph
          </button>
          <button
            onClick={() => setActiveSubTab('sitemap')}
            className={`px-3 py-1.5 rounded-lg font-medium transition cursor-pointer ${
              activeSubTab === 'sitemap' ? 'bg-[#2E9BFF] text-white shadow-xs' : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
            }`}
          >
            Sitemap.xml ({tools.length})
          </button>
          <button
            onClick={() => setActiveSubTab('robots')}
            className={`px-3 py-1.5 rounded-lg font-medium transition cursor-pointer ${
              activeSubTab === 'robots' ? 'bg-[#2E9BFF] text-white shadow-xs' : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
            }`}
          >
            Robots.txt
          </button>
          <button
            onClick={() => setActiveSubTab('schema')}
            className={`px-3 py-1.5 rounded-lg font-medium transition cursor-pointer ${
              activeSubTab === 'schema' ? 'bg-[#2E9BFF] text-white shadow-xs' : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
            }`}
          >
            JSON-LD Schema
          </button>
        </div>
      </div>

      {/* Sub Tab: Meta & Canonical */}
      {activeSubTab === 'meta' && (
        <form onSubmit={handleSave} className="card-glass p-6 bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-2xl shadow-xs space-y-4 text-xs">
          <div>
            <label className="block font-semibold text-[var(--text-primary)] mb-1">
              Global Default Meta Title
            </label>
            <input
              type="text"
              value={seo.defaultTitle}
              onChange={(e) => setSeo({ ...seo, defaultTitle: e.target.value })}
              className="w-full bg-[var(--bg-input)] border border-[var(--border-subtle)] rounded-lg px-3 py-2 text-[var(--text-primary)] focus:border-[#2E9BFF] outline-none"
            />
            <span className="text-[11px] text-[var(--text-muted)] mt-1 block">Recommended 50–60 characters. Current: {seo.defaultTitle.length} chars.</span>
          </div>

          <div>
            <label className="block font-semibold text-[var(--text-primary)] mb-1">
              Global Default Meta Description
            </label>
            <textarea
              rows={3}
              value={seo.defaultDescription}
              onChange={(e) => setSeo({ ...seo, defaultDescription: e.target.value })}
              className="w-full bg-[var(--bg-input)] border border-[var(--border-subtle)] rounded-lg p-2.5 text-[var(--text-primary)] focus:border-[#2E9BFF] outline-none"
            />
            <span className="text-[11px] text-[var(--text-muted)] mt-1 block">Recommended 140–160 characters. Current: {seo.defaultDescription.length} chars.</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-[var(--text-primary)] mb-1">
                Canonical Base URL
              </label>
              <input
                type="text"
                value={seo.canonicalBase}
                onChange={(e) => setSeo({ ...seo, canonicalBase: e.target.value })}
                className="w-full bg-[var(--bg-input)] border border-[var(--border-subtle)] rounded-lg px-3 py-2 font-mono text-[var(--text-primary)] focus:border-[#2E9BFF] outline-none"
              />
            </div>

            <div>
              <label className="block font-semibold text-[var(--text-primary)] mb-1">
                Global Keywords (Comma-separated)
              </label>
              <input
                type="text"
                value={seo.keywords.join(', ')}
                onChange={(e) => setSeo({ ...seo, keywords: e.target.value.split(',').map(s => s.trim()).filter(Boolean) })}
                className="w-full bg-[var(--bg-input)] border border-[var(--border-subtle)] rounded-lg px-3 py-2 text-[var(--text-primary)] focus:border-[#2E9BFF] outline-none"
              />
            </div>
          </div>

          <div className="pt-4 border-t border-[var(--border-subtle)] flex justify-end">
            <button
              type="submit"
              className="btn btn-primary py-2 px-5 rounded-lg flex items-center gap-1.5 font-semibold cursor-pointer shadow-md"
            >
              <Save size={14} /> Save Meta Settings
            </button>
          </div>
        </form>
      )}

      {/* Sub Tab: OpenGraph */}
      {activeSubTab === 'og' && (
        <form onSubmit={handleSave} className="card-glass p-6 bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-2xl shadow-xs space-y-4 text-xs">
          <div>
            <label className="block font-semibold text-[var(--text-primary)] mb-1">
              OG:Title (Social Card Title)
            </label>
            <input
              type="text"
              value={seo.ogTitle}
              onChange={(e) => setSeo({ ...seo, ogTitle: e.target.value })}
              className="w-full bg-[var(--bg-input)] border border-[var(--border-subtle)] rounded-lg px-3 py-2 text-[var(--text-primary)] outline-none"
            />
          </div>

          <div>
            <label className="block font-semibold text-[var(--text-primary)] mb-1">
              OG:Description
            </label>
            <textarea
              rows={2}
              value={seo.ogDescription}
              onChange={(e) => setSeo({ ...seo, ogDescription: e.target.value })}
              className="w-full bg-[var(--bg-input)] border border-[var(--border-subtle)] rounded-lg p-2.5 text-[var(--text-primary)] outline-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-[var(--text-primary)] mb-1">
                OG Image Asset URL
              </label>
              <input
                type="text"
                value={seo.ogImageUrl}
                onChange={(e) => setSeo({ ...seo, ogImageUrl: e.target.value })}
                className="w-full bg-[var(--bg-input)] border border-[var(--border-subtle)] rounded-lg px-3 py-2 font-mono text-[var(--text-primary)] outline-none"
              />
            </div>

            <div>
              <label className="block font-semibold text-[var(--text-primary)] mb-1">
                Twitter Card Format
              </label>
              <select
                value={seo.twitterCard}
                onChange={(e) => setSeo({ ...seo, twitterCard: e.target.value as any })}
                className="w-full bg-[var(--bg-input)] border border-[var(--border-subtle)] rounded-lg px-3 py-2 text-[var(--text-primary)] outline-none"
              >
                <option value="summary_large_image">summary_large_image (Large Hero Card)</option>
                <option value="summary">summary (Standard Square Thumbnail)</option>
              </select>
            </div>
          </div>

          <div className="pt-4 border-t border-[var(--border-subtle)] flex justify-end">
            <button
              type="submit"
              className="btn btn-primary py-2 px-5 rounded-lg flex items-center gap-1.5 font-semibold cursor-pointer shadow-md"
            >
              <Save size={14} /> Save OpenGraph Settings
            </button>
          </div>
        </form>
      )}

      {/* Sub Tab: Sitemap.xml */}
      {activeSubTab === 'sitemap' && (
        <div className="card-glass p-6 bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-2xl shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-sm font-bold text-[var(--text-primary)]">
                Live Dynamic Sitemap XML ({tools.length + 7} indexed URLs)
              </h3>
              <p className="text-xs text-[var(--text-muted)]">
                Automatically indexes all 300+ tools, category taxonomy hubs, and legal static pages conforming to sitemaps.org protocol.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => copyToClipboard(sitemapXml, 'sitemap')}
                className="px-3 py-1.5 rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-surface-hover)] text-xs font-semibold text-[var(--text-primary)] hover:border-[#2E9BFF] transition flex items-center gap-1.5 cursor-pointer"
              >
                <Copy size={13} /> {copied === 'sitemap' ? 'Copied XML!' : 'Copy XML'}
              </button>
              <button
                onClick={() => downloadFile(sitemapXml, 'sitemap.xml', 'text/xml')}
                className="btn btn-primary py-1.5 px-3 rounded-lg text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
              >
                <Download size={13} /> Download sitemap.xml
              </button>
            </div>
          </div>

          <div className="rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-input)] p-4 max-h-96 overflow-y-auto font-mono text-[11px] text-[var(--text-secondary)] leading-relaxed">
            <pre>{sitemapXml}</pre>
          </div>
        </div>
      )}

      {/* Sub Tab: Robots.txt */}
      {activeSubTab === 'robots' && (
        <form onSubmit={handleSave} className="card-glass p-6 bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-2xl shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-[var(--text-primary)]">
                Robots.txt Crawler Directives
              </h3>
              <p className="text-xs text-[var(--text-muted)]">
                Controls indexing permissions for Googlebot, Bingbot, and AI crawlers.
              </p>
            </div>
            <button
              onClick={() => copyToClipboard(seo.robotsTxt, 'robots')}
              type="button"
              className="px-3 py-1.5 rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-surface-hover)] text-xs font-semibold text-[var(--text-primary)] hover:border-[#2E9BFF] transition flex items-center gap-1.5 cursor-pointer"
            >
              <Copy size={13} /> {copied === 'robots' ? 'Copied!' : 'Copy'}
            </button>
          </div>

          <textarea
            rows={7}
            value={seo.robotsTxt}
            onChange={(e) => setSeo({ ...seo, robotsTxt: e.target.value })}
            className="w-full bg-[var(--bg-input)] border border-[var(--border-subtle)] rounded-xl p-3 font-mono text-xs text-[var(--text-primary)] focus:border-[#2E9BFF] outline-none"
          />

          <div className="flex justify-end">
            <button
              type="submit"
              className="btn btn-primary py-2 px-5 rounded-lg text-xs flex items-center gap-1.5 font-semibold cursor-pointer shadow-md"
            >
              <Save size={14} /> Save Robots.txt
            </button>
          </div>
        </form>
      )}

      {/* Sub Tab: JSON-LD Schema */}
      {activeSubTab === 'schema' && (
        <div className="card-glass p-6 bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-2xl shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-[var(--text-primary)]">
                Structured Data (Schema.org JSON-LD)
              </h3>
              <p className="text-xs text-[var(--text-muted)]">
                Rich snippets for Google Search Console validating SoftwareApplication & WebSite.
              </p>
            </div>
            <button
              onClick={() => copyToClipboard(schemaJsonLd, 'schema')}
              className="px-3 py-1.5 rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-surface-hover)] text-xs font-semibold text-[var(--text-primary)] hover:border-[#2E9BFF] transition flex items-center gap-1.5 cursor-pointer"
            >
              <Copy size={13} /> {copied === 'schema' ? 'Copied JSON-LD!' : 'Copy Schema'}
            </button>
          </div>

          <div className="rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-input)] p-4 max-h-96 overflow-y-auto font-mono text-[11px] text-[var(--text-secondary)]">
            <pre>{schemaJsonLd}</pre>
          </div>
        </div>
      )}
    </div>
  );
};
