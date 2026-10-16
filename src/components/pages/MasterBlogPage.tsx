import React, { useState, useEffect, useMemo } from 'react';
import { 
  Shield, Lock, Key, Hash, FileCode, CheckCircle2, ChevronRight, 
  Terminal, Globe, Copy, Check, BookOpen, Layers, ArrowRight, 
  Share2, Printer, Search, Sparkles, AlertCircle, ExternalLink,
  Code, Clock, UserCheck, ShieldCheck, Cpu, Database
} from 'lucide-react';
import { SeoHead } from '../SeoHead';

interface MasterBlogPageProps {
  onNavigateHome: () => void;
  onSelectToolBySlug: (slug: string) => void;
  onNavigateGuides?: () => void;
}

export const MasterBlogPage: React.FC<MasterBlogPageProps> = ({
  onNavigateHome,
  onSelectToolBySlug,
}) => {
  const [copiedCodeIndex, setCopiedCodeIndex] = useState<string | null>(null);
  const [activeTocSection, setActiveTocSection] = useState<string>('part-1');
  const [searchFilter, setSearchFilter] = useState<string>('');
  const [shareSuccess, setShareSuccess] = useState<boolean>(false);
  const [scrollProgress, setScrollProgress] = useState<number>(0);

  // Track scroll position for reading progress bar and active TOC section
  useEffect(() => {
    const handleScroll = () => {
      const totalScroll = document.documentElement.scrollTop;
      const windowHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      if (windowHeight > 0) {
        setScrollProgress(Math.min(100, Math.max(0, (totalScroll / windowHeight) * 100)));
      }

      // Detect which section is in viewport
      const sections = [
        'part-1', 'part-2', 'part-3', 'part-4', 'part-5', 'part-6',
        'part-7', 'part-8', 'part-9', 'part-10', 'part-11', 'part-12', 'part-faq'
      ];
      for (let i = sections.length - 1; i >= 0; i--) {
        const el = document.getElementById(sections[i]);
        if (el && el.getBoundingClientRect().top <= 200) {
          setActiveTocSection(sections[i]);
          break;
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleCopyCode = (code: string, id: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCodeIndex(id);
    setTimeout(() => setCopiedCodeIndex(null), 2500);
  };

  const handleShare = async () => {
    const url = 'https://www.encryptdecrypt.org/blog';
    const title = 'The Ultimate Cryptography, Web Security & Google AdSense Publisher Master Guide (10,000+ Words)';
    if (navigator.share) {
      try {
        await navigator.share({ title, text: 'The definitive encyclopedia for client-side cryptography, zero-knowledge security, ads.txt, and monetization architecture.', url });
        return;
      } catch {}
    }
    navigator.clipboard.writeText(url);
    setShareSuccess(true);
    setTimeout(() => setShareSuccess(false), 3000);
  };

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="container py-8 max-w-6xl mx-auto px-4 sm:px-6 relative">
      {/* 100/100 SEO Meta & Schema.org JSON-LD Structured Data */}
      <SeoHead
        title="The Ultimate Cryptography, Web Security & Google AdSense Master Guide | EncryptDecrypt.org"
        description="The definitive handbook on modern cryptography (AES-256-GCM, RSA, SHA-3), zero-knowledge client-side security, Google AdSense setup, ads.txt crawler compliance, and developer utilities."
        canonicalUrl="https://www.encryptdecrypt.org/blog"
        keywords={[
          'google adsense setup',
          'ads.txt direct publisher id',
          'google adsense publisher id',
          'aes-256-gcm encryption',
          'cryptographic hashing sha-256',
          'sha-3 keccak sponge',
          'argon2id password hashing',
          'jwt signature verification',
          'client-side zero-knowledge cryptography',
          'web cryptography api subtlecrypto',
          'base64 rfc 4648',
          'unix chmod permissions calculator',
          'web security headers csp sri'
        ]}
        schemas={[
          {
            '@context': 'https://schema.org',
            '@type': 'TechArticle',
            'headline': 'The Definitive Cryptography, Web Security & Google AdSense Publisher Master Guide (2026 Edition)',
            'description': 'Exhaustive engineering guide covering symmetric/asymmetric cryptography, hashing algorithms, zero-knowledge browser memory privacy, Google AdSense monetization, and ads.txt crawler protocols.',
            'image': 'https://www.encryptdecrypt.org/assets/og-cryptography-master-guide.png',
            'datePublished': '2026-10-15T00:00:00Z',
            'dateModified': '2026-10-16T04:00:00Z',
            'author': {
              '@type': 'Organization',
              'name': 'EncryptDecrypt.org Cryptography & Web Security Research Lab',
              'url': 'https://www.encryptdecrypt.org/about'
            },
            'publisher': {
              '@type': 'Organization',
              'name': 'EncryptDecrypt.org',
              'logo': {
                '@type': 'ImageObject',
                'url': 'https://www.encryptdecrypt.org/favicon.svg'
              }
            },
            'mainEntityOfPage': {
              '@type': 'WebPage',
              '@id': 'https://www.encryptdecrypt.org/blog'
            },
            'proficiencyLevel': 'Expert',
            'wordCount': 10850,
            'keywords': 'Cryptography, AES-256, Google AdSense, ads.txt, SHA-256, JWT, Argon2id, WebCrypto API, Zero-Knowledge'
          },
          {
            '@context': 'https://schema.org',
            '@type': 'FAQPage',
            'mainEntity': [
              {
                '@type': 'Question',
                'name': 'What is the correct standard ads.txt entry for a Google AdSense publisher account?',
                'acceptedAnswer': {
                  '@type': 'Answer',
                  'text': 'The standard IAB Tech Lab compliant entry is: google.com, pub-XXXXXXXXXXXXXXXX, DIRECT, f08c47fec0942fa (where pub-XXXXXXXXXXXXXXXX is replaced with your verified 16-digit publisher ID). It must be served at the root domain (https://yourdomain.com/ads.txt) with Content-Type text/plain; charset=utf-8.'
                }
              },
              {
                '@type': 'Question',
                'name': 'Why is AES-256-GCM superior to AES-256-CBC in modern web applications?',
                'acceptedAnswer': {
                  '@type': 'Answer',
                  'text': 'AES-256-GCM provides Authenticated Encryption with Associated Data (AEAD). It computes a 128-bit authentication tag over the ciphertext using GHASH, guaranteeing both confidentiality and tamper-proof integrity. AES-CBC lacks authentication, leaving systems vulnerable to padding oracle attacks like POODLE and Lucky Thirteen.'
                }
              },
              {
                '@type': 'Question',
                'name': 'Can client-side SHA-256 or SHA-512 hashes be reversed to recover original plaintexts?',
                'acceptedAnswer': {
                  '@type': 'Answer',
                  'text': 'No. Cryptographic hash functions like SHA-256 and SHA-512 are one-way mathematical compression algorithms compliant with FIPS PUB 180-4. They have strong pre-image resistance and cannot be mathematically inverted.'
                }
              },
              {
                '@type': 'Question',
                'name': 'Why should passwords never be hashed with plain SHA-256 or MD5?',
                'acceptedAnswer': {
                  '@type': 'Answer',
                  'text': 'SHA-256 and MD5 are designed to be fast algorithms. High-performance GPUs and ASICs can compute tens of billions of SHA-256 hashes per second. For password storage, NIST SP 800-63B mandates memory-hard, computationally expensive algorithms such as Argon2id, scrypt, or PBKDF2 with high iteration counts.'
                }
              },
              {
                '@type': 'Question',
                'name': 'What makes browser-based zero-knowledge encryption truly private?',
                'acceptedAnswer': {
                  '@type': 'Answer',
                  'text': 'In a zero-knowledge architecture using the W3C Web Cryptography API, all cryptographic transformations occur exclusively in local device RAM using window.crypto.subtle. The plaintext data and encryption keys never cross the network or touch remote server storage.'
                }
              }
            ]
          }
        ]}
      />

      {/* Top Reading Progress Bar (Fixed Top) */}
      <div 
        className="fixed top-0 left-0 h-1 bg-gradient-to-r from-blue-500 via-sky-400 to-emerald-400 z-50 transition-all duration-150"
        style={{ width: `${scrollProgress}%` }}
        aria-hidden="true"
      />

      {/* Breadcrumb Navigation */}
      <nav className="flex items-center gap-2 text-xs text-[var(--text-muted)] mb-6 font-mono">
        <a href="/" onClick={(e) => { e.preventDefault(); onNavigateHome(); }} className="hover:text-[#2E9BFF] cursor-pointer">
          Home
        </a>
        <span>/</span>
        <span className="text-[var(--text-primary)] font-semibold">Master Blog &amp; Security Encyclopedia</span>
      </nav>

      {/* Article Header & Badges */}
      <header className="card-glass p-8 sm:p-12 bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-3xl shadow-lg mb-10 relative overflow-hidden">
        <div className="absolute -right-20 -top-20 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -left-20 -bottom-20 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10">
          <div className="flex flex-wrap items-center gap-2 mb-5">
            <span className="text-xs font-bold px-3 py-1 rounded-full bg-blue-500/15 text-sky-400 border border-blue-500/30 flex items-center gap-1.5">
              <ShieldCheck size={13} />
              Cryptography &amp; Security Engineering
            </span>
            <span className="text-xs font-bold px-3 py-1 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 flex items-center gap-1.5">
              <Lock size={13} />
              Zero-Knowledge Client-Side Memory
            </span>
            <span className="text-xs font-bold px-3 py-1 rounded-full bg-purple-500/15 text-purple-400 border border-purple-500/30 flex items-center gap-1.5">
              <Globe size={13} />
              Webmaster &amp; AdSense Architecture
            </span>
            <span className="text-xs text-[var(--text-muted)] font-mono ml-auto">
              Updated: Current 2026 Edition
            </span>
          </div>

          <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black text-[var(--text-primary)] tracking-tight leading-tight sm:leading-none mb-6">
            The Complete Cryptography, Zero-Knowledge Privacy &amp; Google AdSense Monetization Encyclopedia
          </h1>

          <p className="text-base sm:text-xl text-[var(--text-secondary)] leading-relaxed font-normal max-w-4xl mb-8">
            An exhaustive, production-grade handbook exploring the mathematics and implementation of modern symmetric ciphers (AES-256-GCM, ChaCha20), public-key cryptography (RSA, ECC), cryptographic hashing (SHA-256, SHA-3 Keccak), credential protection (Argon2id, PBKDF2), stateless token security (JWT RFC 7519), and full-stack web monetization with Google AdSense and IAB Tech Lab <code className="text-sky-300 font-mono px-1 py-0.5 rounded bg-blue-900/30">ads.txt</code> crawler directives.
          </p>

          <div className="flex flex-wrap items-center justify-between gap-4 pt-6 border-t border-[var(--border-subtle)] text-xs text-[var(--text-muted)]">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-blue-600 to-cyan-400 flex items-center justify-center text-white font-black text-sm shadow-md">
                ED
              </div>
              <div>
                <div className="font-bold text-[var(--text-primary)] text-sm">
                  Ajay Ade &amp; The EncryptDecrypt Engineering Security Lab
                </div>
                <div className="text-[var(--text-muted)] flex items-center gap-2">
                  <span>Senior Cryptographic Architects &amp; AdSense Webmasters</span>
                  <span>·</span>
                  <span className="flex items-center gap-1"><Clock size={12} /> ~48 Min Read</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleShare}
                className="px-4 py-2 rounded-xl bg-[var(--bg-input)] hover:bg-[var(--bg-surface-hover)] border border-[var(--border-subtle)] text-[var(--text-primary)] font-semibold transition flex items-center gap-1.5 cursor-pointer shadow-xs"
                title="Share this master guide"
              >
                <Share2 size={14} className="text-[#2E9BFF]" />
                <span>{shareSuccess ? 'Link Copied!' : 'Share Article'}</span>
              </button>
              <button
                onClick={() => window.print()}
                className="px-4 py-2 rounded-xl bg-[var(--bg-input)] hover:bg-[var(--bg-surface-hover)] border border-[var(--border-subtle)] text-[var(--text-primary)] font-semibold transition flex items-center gap-1.5 cursor-pointer shadow-xs"
                title="Print or Save as PDF"
              >
                <Printer size={14} className="text-emerald-400" />
                <span>Print / PDF</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Grid Layout: Interactive Sticky Sidebar TOC + Article Content */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Sticky Table of Contents (Desktop Sidebar) */}
        <aside className="lg:col-span-4 hidden lg:block">
          <div className="sticky top-24 p-6 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] shadow-sm space-y-4 max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-[var(--border-subtle)]">
              <div className="flex items-center gap-2 font-bold text-sm text-[var(--text-primary)]">
                <BookOpen size={16} className="text-[#2E9BFF]" />
                <span>Master Table of Contents</span>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-500/10 text-sky-400 font-semibold">
                12 Parts + FAQ
              </span>
            </div>

            <div className="relative">
              <input
                type="text"
                placeholder="Filter sections..."
                value={searchFilter}
                onChange={(e) => setSearchFilter(e.target.value)}
                className="w-full text-xs px-3 py-2 rounded-lg bg-[var(--bg-input)] border border-[var(--border-subtle)] text-[var(--text-primary)] focus:outline-none focus:border-blue-500"
              />
              {searchFilter && (
                <button 
                  onClick={() => setSearchFilter('')}
                  className="absolute right-2 top-2.5 text-xs text-[var(--text-muted)] hover:text-white"
                >
                  ✕
                </button>
              )}
            </div>

            <nav className="space-y-1 text-xs">
              {[
                { id: 'part-1', num: '01', title: 'AdSense Monetization & Integration' },
                { id: 'part-2', num: '02', title: 'Ads.txt Architecture & Crawl Fixes' },
                { id: 'part-3', num: '03', title: 'Zero-Knowledge Client-Side Crypto' },
                { id: 'part-4', num: '04', title: 'Symmetric Ciphers (AES-256-GCM)' },
                { id: 'part-5', num: '05', title: 'Asymmetric Cryptography (RSA & ECC)' },
                { id: 'part-6', num: '06', title: 'Cryptographic Hashing (SHA-2/3)' },
                { id: 'part-7', num: '07', title: 'Password Security & Argon2id Derivation' },
                { id: 'part-8', num: '08', title: 'Data Encodings (Base64, Hex, Base58)' },
                { id: 'part-9', num: '09', title: 'JWT Token Security & Stateless Auth' },
                { id: 'part-10', num: '10', title: 'Defensive Web Security (CSP, SRI, Chmod)' },
                { id: 'part-11', num: '11', title: 'Developer Utilities & Ecosystem' },
                { id: 'part-12', num: '12', title: 'Webmaster Audit & Compliance Roadmap' },
                { id: 'part-faq', num: '13', title: 'Frequently Asked Questions (FAQ)' },
              ]
                .filter(item => !searchFilter || item.title.toLowerCase().includes(searchFilter.toLowerCase()))
                .map((item) => {
                  const isActive = activeTocSection === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => scrollTo(item.id)}
                      className={`w-full text-left px-3 py-2 rounded-xl transition cursor-pointer flex items-center justify-between group ${
                        isActive
                          ? 'bg-blue-600/15 text-[#2E9BFF] font-bold border border-blue-500/30 shadow-xs'
                          : 'text-[var(--text-secondary)] hover:bg-[var(--bg-surface-hover)] hover:text-[var(--text-primary)]'
                      }`}
                    >
                      <span className="flex items-center gap-2 truncate">
                        <span className="font-mono text-[10px] text-[var(--text-muted)] group-hover:text-sky-400">
                          {item.num}
                        </span>
                        <span className="truncate">{item.title}</span>
                      </span>
                      <ChevronRight size={13} className={`shrink-0 ${isActive ? 'text-[#2E9BFF]' : 'text-transparent group-hover:text-[var(--text-muted)]'}`} />
                    </button>
                  );
                })}
            </nav>

            <div className="pt-4 border-t border-[var(--border-subtle)]">
              <div className="p-3.5 rounded-xl bg-blue-950/20 border border-blue-500/20 text-xs">
                <span className="font-bold text-sky-300 block mb-1">
                  1,380+ Online Tools Available
                </span>
                <span className="text-slate-400 block text-[11px] leading-relaxed mb-2">
                  Test and execute all algorithms directly in your browser without leaving this guide.
                </span>
                <button
                  onClick={() => onSelectToolBySlug('aes-encryption-decryption')}
                  className="w-full py-1.5 px-3 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-semibold text-[11px] transition cursor-pointer flex items-center justify-center gap-1"
                >
                  <span>Launch AES-256 Tool</span>
                  <ArrowRight size={12} />
                </button>
              </div>
            </div>
          </div>
        </aside>

        {/* Deep Dive Article Content (8 Columns) */}
        <article className="lg:col-span-8 space-y-12 text-[var(--text-secondary)] leading-relaxed text-sm sm:text-base">
          
          {/* Executive Overview Card */}
          <div className="p-6 sm:p-8 rounded-2xl bg-gradient-to-br from-blue-950/20 via-[var(--bg-surface)] to-emerald-950/20 border border-blue-500/30 shadow-sm space-y-4">
            <h2 className="text-xl sm:text-2xl font-black text-[var(--text-primary)] flex items-center gap-2.5 m-0">
              <Shield className="text-[#2E9BFF]" size={24} />
              Executive Introduction: The Intersection of Privacy, Security &amp; Sustainable Web Monetization
            </h2>
            <p>
              The contemporary digital ecosystem operates under dual pressures: <strong>uncompromising user privacy</strong> on one side, and the imperative for <strong>sustainable publisher monetization</strong> on the other. For over two decades, web utilities forced users to make an unacceptable compromise—transmitting sensitive plaintexts, corporate secrets, and authentication credentials to remote cloud backends where they were exposed to reverse-proxy logs, third-party data broker telemetry, and subpoena vulnerabilities.
            </p>
            <p>
              Simultaneously, webmasters deploying modern developer platforms face complex technical hurdles: configuring <strong>Google AdSense</strong> scripts in compliance with strict privacy standards (GDPR TCF v2.2, CCPA), eliminating <strong>ads.txt</strong> crawler errors across canonical domains, minimizing Cumulative Layout Shift (CLS) to preserve Google Core Web Vitals, and implementing <strong>Zero-Knowledge client-side cryptographic architectures</strong> using the standardized W3C Web Cryptography API.
            </p>
            <p>
              This comprehensive encyclopedia unifies these domains into a single authoritative treatise. Whether you are auditing your production web server for cryptographic vulnerabilities, integrating AdSense publisher tags (<code className="text-sky-300 font-mono text-xs px-1.5 py-0.5 rounded bg-blue-900/40">ca-pub-XXXXXXXXXXXXXXXX</code>), resolving crawler indexing deadlocks, or architecting post-quantum secure microservices, this guide provides the mathematical rigor, operational blueprints, and real-world code necessary for 100% compliance.
            </p>
          </div>

          {/* ======================================================== */}
          {/* PART 1: THE MODERN WEB MONETIZATION BLUEPRINT */}
          {/* ======================================================== */}
          <section id="part-1" className="card-glass p-6 sm:p-10 rounded-3xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] shadow-xs space-y-6">
            <div className="flex items-center gap-2 text-xs font-mono text-sky-400">
              <Globe size={14} />
              <span>CHAPTER 01 · MONETIZATION &amp; AD ENGINE ARCHITECTURE</span>
            </div>
            
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[var(--text-primary)] tracking-tight">
              1. The Modern Web Monetization Blueprint: Google AdSense Architecture, Setup &amp; Core Web Vitals
            </h2>

            <p>
              Google AdSense remains the global gold standard for programmatic display advertising, connecting independent web publishers with the world&apos;s largest demand-side network (Google Ads and Google Display Network). However, in the modern 2026 web landscape, monetizing a high-utility technical tool suite requires far more than pasting a generic JavaScript snippet into an HTML template.
            </p>

            <h3 className="text-lg sm:text-xl font-bold text-[var(--text-primary)] pt-2">
              1.1 Anatomy of the Google AdSense Script Tag
            </h3>
            <p>
              The modern client script tag for Google AdSense is designed for non-blocking asynchronous execution. Let us examine the standardized production script tag configured for verified publisher accounts:
            </p>

            <div className="relative rounded-2xl bg-[var(--bg-input)] border border-[var(--border-subtle)] p-4 font-mono text-xs overflow-x-auto">
              <div className="flex items-center justify-between pb-2 mb-2 border-b border-[var(--border-subtle)] text-[var(--text-muted)]">
                <span>HTML Entry Point (<code className="text-sky-400">index.html</code>)</span>
                <button
                  onClick={() => handleCopyCode(
                    `<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-XXXXXXXXXXXXXXXX"\n     crossorigin="anonymous"></script>`,
                    'code-ads-tag'
                  )}
                  className="hover:text-white flex items-center gap-1 cursor-pointer"
                >
                  {copiedCodeIndex === 'code-ads-tag' ? <Check size={13} className="text-emerald-400" /> : <Copy size={13} />}
                  <span>{copiedCodeIndex === 'code-ads-tag' ? 'Copied' : 'Copy Snippet'}</span>
                </button>
              </div>
              <pre className="text-sky-300 leading-relaxed m-0">
{`<script async 
  src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-XXXXXXXXXXXXXXXX"
  crossorigin="anonymous">
</script>`}
              </pre>
            </div>

            <div className="space-y-3 pt-2">
              <h4 className="font-bold text-[var(--text-primary)]">Key Architectural Directives Explained:</h4>
              <ul className="list-disc pl-5 space-y-2">
                <li>
                  <strong className="text-[var(--text-primary)]">The <code>async</code> Attribute:</strong> Guarantees that the browser HTML parser is never halted while the AdSense script downloads. The main thread continues constructing the Document Object Model (DOM) and Cascading Style Sheets Object Model (CSSOM), preventing render-blocking latency and preserving First Contentful Paint (FCP).
                </li>
                <li>
                  <strong className="text-[var(--text-primary)]">Publisher Client ID (<code className="text-sky-300">client=ca-pub-XXXXXXXXXXXXXXXX</code>):</strong> Uniquely ties all ad auctions, impression triggers, and revenue credits to your verified publisher account. The &quot;ca-&quot; prefix designates an active Google AdSense client account.
                </li>
                <li>
                  <strong className="text-[var(--text-primary)]">The <code>crossorigin=&quot;anonymous&quot;</code> Attribute:</strong> Enforces Cross-Origin Resource Sharing (CORS) security guidelines. It enables enhanced browser error logging without exposing sensitive cross-origin credentials, cookies, or HTTP authentication tokens to third-party CDNs.
                </li>
              </ul>
            </div>

            <h3 className="text-lg sm:text-xl font-bold text-[var(--text-primary)] pt-4">
              1.2 Protecting Google Core Web Vitals: CLS, INP &amp; LCP Optimization
            </h3>
            <p>
              A frequent fatal error among webmasters is allowing dynamic ad containers to inject themselves abruptly into the page flow, resulting in devastating <strong>Cumulative Layout Shift (CLS)</strong> penalties in Google Search Console. When an ad unit suddenly expands from 0 pixels to 250 pixels height while a user is reading or clicking, it damages user trust and collapses Core Web Vitals scores below the 75th percentile threshold.
            </p>
            <p>
              To maintain a flawless 100/100 performance score, every display ad slot must have <strong>pre-allocated minimum dimensions (CSS aspect-ratio or min-height)</strong>. For example:
            </p>

            <div className="relative rounded-2xl bg-[var(--bg-input)] border border-[var(--border-subtle)] p-4 font-mono text-xs overflow-x-auto">
              <pre className="text-emerald-300 leading-relaxed m-0">
{`/* Zero-CLS Container Reservation */
.ad-slot-header {
  min-height: 90px;
  width: 100%;
  max-width: 728px;
  margin: 1.5rem auto;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--bg-surface);
  border: 1px dashed var(--border-subtle);
  contain: layout-inline; /* CSS Containment prevents reflow cascades */
}`}
              </pre>
            </div>

            <h3 className="text-lg sm:text-xl font-bold text-[var(--text-primary)] pt-4">
              1.3 Regulatory Compliance: Consent Management (CMP), GDPR &amp; CCPA
            </h3>
            <p>
              Modern advertising regulations mandate strict consent controls. Publishers targeting European Union (EU) or UK visitors must implement an IAB TCF v2.2 compliant Consent Management Platform (CMP) certified by Google. Google AdSense automatically provides a native privacy &amp; messaging tool inside the AdSense dashboard that displays GDPR and US State Privacy consent dialogs seamlessly, ensuring that personalized ads are only served after explicit visitor confirmation.
            </p>
          </section>

          {/* ======================================================== */}
          {/* PART 2: THE DEFINITIVE ADS.TXT IMPLEMENTATION */}
          {/* ======================================================== */}
          <section id="part-2" className="card-glass p-6 sm:p-10 rounded-3xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] shadow-xs space-y-6">
            <div className="flex items-center gap-2 text-xs font-mono text-emerald-400">
              <Terminal size={14} />
              <span>CHAPTER 02 · ADS.TXT PROTOCOL &amp; CRAWLER VERIFICATION</span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-extrabold text-[var(--text-primary)] tracking-tight">
              2. The Definitive Ads.txt Implementation: IAB Standards, Syntax &amp; Crawler Troubleshooting
            </h2>

            <p>
              The <strong>Authorized Digital Sellers</strong> initiative (commonly known as <strong>ads.txt</strong>) is an open standard created by the <strong>IAB Tech Lab (Interactive Advertising Bureau)</strong> to eradicate domain spoofing, illegitimate arbitrage, and unauthorized ad inventory reselling. If a website lacks a correctly formatted <code className="text-sky-300 font-mono text-xs px-1 py-0.5 rounded bg-blue-900/30">ads.txt</code> file, ad exchanges and programmatic buyers instantly disqualify the domain from high-value bidding auctions, triggering the notorious Google AdSense warning: <em>&quot;Earnings at risk: You need to fix some ads.txt file issues to avoid severe impact to your revenue.&quot;</em>
            </p>

            <h3 className="text-lg sm:text-xl font-bold text-[var(--text-primary)] pt-2">
              2.1 The Official Production Ads.txt Directive
            </h3>
            <p>
              For standard Google AdSense integration, the standard-compliant record deployed at <code className="text-emerald-400 font-mono text-xs">/ads.txt</code> is:
            </p>

            <div className="relative rounded-2xl bg-[var(--bg-input)] border border-[var(--border-subtle)] p-4 font-mono text-xs overflow-x-auto">
              <div className="flex items-center justify-between pb-2 mb-2 border-b border-[var(--border-subtle)] text-[var(--text-muted)]">
                <span>Standard IAB Format (<code className="text-emerald-400">/ads.txt</code>)</span>
                <button
                  onClick={() => handleCopyCode(
                    `google.com, pub-XXXXXXXXXXXXXXXX, DIRECT, f08c47fec0942fa\n`,
                    'code-ads-txt'
                  )}
                  className="hover:text-white flex items-center gap-1 cursor-pointer"
                >
                  {copiedCodeIndex === 'code-ads-txt' ? <Check size={13} className="text-emerald-400" /> : <Copy size={13} />}
                  <span>{copiedCodeIndex === 'code-ads-txt' ? 'Copied' : 'Copy Line'}</span>
                </button>
              </div>
              <pre className="text-amber-300 text-sm font-bold leading-relaxed m-0">
{`google.com, pub-XXXXXXXXXXXXXXXX, DIRECT, f08c47fec0942fa`}
              </pre>
            </div>

            <div className="space-y-4 pt-3">
              <h4 className="font-bold text-[var(--text-primary)]">Dissecting the Four Comma-Separated Fields:</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-3.5 rounded-xl bg-[var(--bg-surface-hover)] border border-[var(--border-subtle)]">
                  <span className="font-bold text-sky-400 block mb-1">Field 1: Domain of the Ad Exchange</span>
                  <p className="text-[var(--text-secondary)] m-0">
                    <code className="text-sky-300">google.com</code> designates the canonical domain of the ad system connecting sellers and inventory buyers.
                  </p>
                </div>
                <div className="p-3.5 rounded-xl bg-[var(--bg-surface-hover)] border border-[var(--border-subtle)]">
                  <span className="font-bold text-emerald-400 block mb-1">Field 2: Publisher Account Identifier</span>
                  <p className="text-[var(--text-secondary)] m-0">
                    <code className="text-emerald-300">pub-XXXXXXXXXXXXXXXX</code> is the unique 16-digit publisher ID associated with your AdSense contract.
                  </p>
                </div>
                <div className="p-3.5 rounded-xl bg-[var(--bg-surface-hover)] border border-[var(--border-subtle)]">
                  <span className="font-bold text-purple-400 block mb-1">Field 3: Relationship Type</span>
                  <p className="text-[var(--text-secondary)] m-0">
                    <code className="text-purple-300">DIRECT</code> certifies that you control the domain directly. (Third-party ad networks utilize <code className="text-slate-400">RESELLER</code>).
                  </p>
                </div>
                <div className="p-3.5 rounded-xl bg-[var(--bg-surface-hover)] border border-[var(--border-subtle)]">
                  <span className="font-bold text-amber-400 block mb-1">Field 4: Certification Authority ID</span>
                  <p className="text-[var(--text-secondary)] m-0">
                    <code className="text-amber-300">f08c47fec0942fa</code> is Google&apos;s cryptographic security certificate ID registered with the Trustworthy Accountability Group (TAG).
                  </p>
                </div>
              </div>
            </div>

            <h3 className="text-lg sm:text-xl font-bold text-[var(--text-primary)] pt-4">
              2.2 The 5 Golden Rules of Ads.txt Hosting &amp; Server Configuration
            </h3>
            <ol className="list-decimal pl-5 space-y-3">
              <li>
                <strong>Strict Root Domain Placement:</strong> The file MUST be served from the apex root of the domain: <code className="text-sky-300">https://encryptdecrypt.org/ads.txt</code>. Subdirectory paths like <code className="text-rose-400">/assets/ads.txt</code> or <code className="text-rose-400">/blog/ads.txt</code> are completely ignored by Google crawlers.
              </li>
              <li>
                <strong>MIME Content-Type Header:</strong> The web server must return HTTP status <code>200 OK</code> with an explicit <code className="text-emerald-300">Content-Type: text/plain; charset=utf-8</code>. If your server returns <code>text/html</code> or <code>application/octet-stream</code>, the crawler rejects the file.
              </li>
              <li>
                <strong>Redirect Chain Discipline:</strong> Googlebot follows a maximum of 3 redirects. If your domain redirects from <code>http://example.com/ads.txt</code> → <code>https://example.com/ads.txt</code> → <code>https://www.example.com/ads.txt</code>, ensure that no infinite redirect loops exist.
              </li>
              <li>
                <strong>Zero UTF-8 Byte Order Mark (BOM):</strong> The file must be saved in pure UTF-8 without BOM characters (hexadecimal <code>EF BB BF</code>). A BOM at the start of line 1 corrupts the first field, causing Googlebot to read <code>ï»¿google.com</code> instead of <code>google.com</code>.
              </li>
              <li>
                <strong>Robots.txt Crawl Accessibility:</strong> Never place a <code>Disallow: /ads.txt</code> rule in your <code className="text-sky-300">robots.txt</code>. Ensure user-agents <code>Mediapartners-Google</code> and <code>Googlebot</code> have unobstructed access.
              </li>
            </ol>

            <h3 className="text-lg sm:text-xl font-bold text-[var(--text-primary)] pt-4">
              2.3 Verification via Terminal (cURL Diagnostics)
            </h3>
            <p>
              You can instantly audit the live deployment and HTTP response headers of your ads.txt using this standard cURL terminal command:
            </p>

            <div className="relative rounded-2xl bg-[var(--bg-input)] border border-[var(--border-subtle)] p-4 font-mono text-xs overflow-x-auto">
              <pre className="text-sky-300 leading-relaxed m-0">
{`# Test ads.txt response code and headers:
curl -I -L https://encryptdecrypt.org/ads.txt

# Expected Output:
# HTTP/2 200
# content-type: text/plain; charset=utf-8
# cache-control: public, max-age=3600
# ...
# google.com, pub-XXXXXXXXXXXXXXXX, DIRECT, f08c47fec0942fa`}
              </pre>
            </div>
          </section>

          {/* ======================================================== */}
          {/* PART 3: ZERO-KNOWLEDGE CLIENT-SIDE CRYPTOGRAPHY */}
          {/* ======================================================== */}
          <section id="part-3" className="card-glass p-6 sm:p-10 rounded-3xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] shadow-xs space-y-6">
            <div className="flex items-center gap-2 text-xs font-mono text-purple-400">
              <ShieldCheck size={14} />
              <span>CHAPTER 03 · ZERO-KNOWLEDGE ARCHITECTURE &amp; WEBCRYPTO API</span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-extrabold text-[var(--text-primary)] tracking-tight">
              3. Zero-Knowledge Client-Side Cryptography: The W3C WebCrypt API &amp; Memory Hygiene
            </h2>

            <p>
              In conventional web applications, cryptography was treated as a backend server responsibility. A user pasted their secret document or API key into a form, hit &quot;Encrypt&quot;, and the browser transmitted that raw payload across the internet to a server running Python, PHP, or Node.js. Even with Transport Layer Security (TLS 1.3), this model introduces colossal security liabilities:
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
              <div className="p-4 rounded-2xl bg-rose-950/20 border border-rose-500/30 text-xs">
                <span className="font-bold text-rose-400 block mb-1">Transit Log Ingestion</span>
                <p className="text-[var(--text-secondary)] m-0">
                  Reverse proxies, load balancers, and Cloudflare/WAF edge nodes routinely log request bodies during debugging, creating unencrypted copies of confidential plaintexts.
                </p>
              </div>
              <div className="p-4 rounded-2xl bg-rose-950/20 border border-rose-500/30 text-xs">
                <span className="font-bold text-rose-400 block mb-1">Subpoena &amp; Insider Risk</span>
                <p className="text-[var(--text-secondary)] m-0">
                  Any cloud hosting provider or database administrator with root access can be legally compelled to dump server memory containing user encryption keys.
                </p>
              </div>
              <div className="p-4 rounded-2xl bg-rose-950/20 border border-rose-500/30 text-xs">
                <span className="font-bold text-rose-400 block mb-1">Data Breach Amplification</span>
                <p className="text-[var(--text-secondary)] m-0">
                  A single vulnerability in the web framework (e.g. Log4j, Apache Struts, Node command injection) grants attackers access to millions of user inputs simultaneously.
                </p>
              </div>
            </div>

            <h3 className="text-lg sm:text-xl font-bold text-[var(--text-primary)] pt-4">
              3.1 The Zero-Knowledge Paradigm on EncryptDecrypt.org
            </h3>
            <p>
              EncryptDecrypt.org fundamentally redefines this model. By leveraging the standardized <strong>W3C Web Cryptography API (<code className="text-sky-300">window.crypto.subtle</code>)</strong>, all mathematical operations—block cipher transformations, Galois field matrix multiplications, SHA hash compressions, and key derivations—execute exclusively inside the client device&apos;s local CPU and volatile RAM.
            </p>
            <p>
              At no point during execution is any plaintext, passphrase, or derived private key serialized into an outbound HTTP request. The network telemetry remains precisely zero.
            </p>

            <h3 className="text-lg sm:text-xl font-bold text-[var(--text-primary)] pt-4">
              3.2 Cryptographically Secure Random Number Generation (CSPRNG)
            </h3>
            <p>
              Every cryptographic algorithm relies upon high-entropy randomness for generating keys, Initialization Vectors (IVs), salts, and nonces. A historic catastrophe in software engineering is the misuse of standard pseudorandom generators like JavaScript&apos;s <code className="text-rose-400">Math.random()</code>.
            </p>
            <p>
              <code className="text-rose-400">Math.random()</code> uses the Xoroshiro128+ algorithm, which has a tiny internal state (128 bits) and zero cryptographic unpredictability. An attacker observing a sequence of just a few generated outputs can reconstruct the internal PRNG seed and reliably predict all future and past outputs.
            </p>
            <p>
              In contrast, modern secure web systems invoke <strong><code className="text-emerald-400">window.crypto.getRandomValues()</code></strong>. This native API taps directly into the host operating system&apos;s kernel entropy pool:
            </p>
            <ul className="list-disc pl-5 space-y-1 text-xs">
              <li><strong>Linux / Android:</strong> <code className="text-sky-300">/dev/urandom</code> and the <code className="text-sky-300">getrandom(2)</code> syscall.</li>
              <li><strong>macOS / iOS:</strong> The kernel-level Fortuna CSPRNG implementation.</li>
              <li><strong>Windows:</strong> The CNG (Cryptography API: Next Generation) entropy provider (<code className="text-sky-300">BCryptGenRandom</code>).</li>
            </ul>

            <h3 className="text-lg sm:text-xl font-bold text-[var(--text-primary)] pt-4">
              3.3 JavaScript Memory Hygiene: TypedArrays vs. Immutable Strings
            </h3>
            <p>
              JavaScript strings are immutable primitives managed by the V8 or SpiderMonkey garbage collector. When a string variable is overwritten, the old memory buffer is not wiped immediately; it lingers in the heap until an asynchronous GC cycle reclaims it, creating a window for heap inspection attacks.
            </p>
            <p>
              For high-security operations, modern cryptographic code utilizes <strong><code className="text-sky-300">Uint8Array</code></strong> and <strong><code className="text-sky-300">ArrayBuffer</code></strong>. These mutable binary buffers can be explicitly overwritten with zeros (zeroized) the instant computation concludes:
            </p>

            <div className="relative rounded-2xl bg-[var(--bg-input)] border border-[var(--border-subtle)] p-4 font-mono text-xs overflow-x-auto">
              <pre className="text-sky-300 leading-relaxed m-0">
{`// Memory Hygiene Pattern: Explicit Zeroization
function secureZeroize(buffer: Uint8Array): void {
  // Overwrite sensitive key material with null bytes immediately
  buffer.fill(0);
}`}
              </pre>
            </div>
          </section>

          {/* ======================================================== */}
          {/* PART 4: THE COMPLETE SYMMETRIC ENCRYPTION ALMANAC */}
          {/* ======================================================== */}
          <section id="part-4" className="card-glass p-6 sm:p-10 rounded-3xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] shadow-xs space-y-6">
            <div className="flex items-center gap-2 text-xs font-mono text-blue-400">
              <Lock size={14} />
              <span>CHAPTER 04 · SYMMETRIC BLOCK &amp; STREAM CIPHERS</span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-extrabold text-[var(--text-primary)] tracking-tight">
              4. The Complete Symmetric Encryption Almanac: AES-256 (GCM vs. CBC), ChaCha20 &amp; Legacy Ciphers
            </h2>

            <p>
              Symmetric-key cryptography uses a single shared secret key for both encryption and decryption. Formalized in 2001 by NIST in <strong>FIPS PUB 197</strong>, the <strong>Advanced Encryption Standard (AES)</strong>—originally named <em>Rijndael</em> by Belgian cryptographers Joan Daemen and Vincent Rijmen—is the undisputed global foundation of modern data protection.
            </p>

            <h3 className="text-lg sm:text-xl font-bold text-[var(--text-primary)] pt-2">
              4.1 Mathematical Architecture of AES-256
            </h3>
            <p>
              AES is a symmetric block cipher operating on fixed blocks of <strong>128 bits (16 bytes)</strong> organized in a 4×4 byte matrix termed the <em>State</em>. The key size may be 128, 192, or 256 bits, dictating the number of cryptographic rounds:
            </p>
            <ul className="list-disc pl-5 space-y-1 text-xs">
              <li><strong>AES-128:</strong> 10 transformation rounds.</li>
              <li><strong>AES-192:</strong> 12 transformation rounds.</li>
              <li><strong>AES-256:</strong> 14 transformation rounds (military and top-secret government grade).</li>
            </ul>

            <p className="pt-2">
              Each round executes four deterministic algebraic operations:
            </p>
            <ol className="list-decimal pl-5 space-y-2 text-xs">
              <li>
                <strong>SubBytes:</strong> Non-linear byte substitution using a pre-calculated 8-bit S-Box derived from the multiplicative inverse over the Galois Field GF(2^8), providing strong non-linearity and confusion.
              </li>
              <li>
                <strong>ShiftRows:</strong> A transposition step where the bytes in each row of the State matrix are cyclically shifted to the left by row index offsets (Row 0 shifted by 0, Row 1 by 1, Row 2 by 2, Row 3 by 3), ensuring inter-column diffusion.
              </li>
              <li>
                <strong>MixColumns:</strong> A matrix multiplication step over GF(2^8) where each column is multiplied by a fixed polynomial matrix, guaranteeing that modifying a single bit in the input scrambles all 16 bytes of the state.
              </li>
              <li>
                <strong>AddRoundKey:</strong> A bitwise XOR operation combining the State matrix with a subkey generated by the Rijndael Key Schedule.
              </li>
            </ol>

            <h3 className="text-lg sm:text-xl font-bold text-[var(--text-primary)] pt-4">
              4.2 Operational Modes Compared: Why AES-GCM Dominates AES-CBC
            </h3>
            <p>
              Encrypting individual 16-byte blocks is insufficient for encrypting variable-length messages. The operational block cipher mode determines how sequential blocks are chained and authenticated:
            </p>

            <div className="overflow-x-auto my-4">
              <table className="w-full text-xs text-left border-collapse border border-[var(--border-subtle)] rounded-xl">
                <thead>
                  <tr className="bg-[var(--bg-input)] text-[var(--text-primary)] border-b border-[var(--border-subtle)]">
                    <th className="p-3">Cipher Mode</th>
                    <th className="p-3">Authentication (Integrity)</th>
                    <th className="p-3">Padding Required</th>
                    <th className="p-3">Vulnerability Exposure</th>
                    <th className="p-3">Recommended Use (2026)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--border-subtle)]">
                  <tr>
                    <td className="p-3 font-bold text-sky-400">AES-GCM (Galois/Counter)</td>
                    <td className="p-3 text-emerald-400 font-semibold">Native 128-bit Tag (GHASH)</td>
                    <td className="p-3">No (Stream behavior)</td>
                    <td className="p-3 text-emerald-400">Immune to padding attacks; vulnerable only if IV is reused</td>
                    <td className="p-3 font-bold text-emerald-400">Primary Standard (NIST SP 800-38D)</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-bold text-amber-400">AES-CBC (Cipher Block Chaining)</td>
                    <td className="p-3 text-rose-400 font-semibold">None (Confidentiality only)</td>
                    <td className="p-3">Yes (PKCS#7 padding)</td>
                    <td className="p-3 text-rose-400">Padding Oracle Attacks (POODLE, Lucky 13, BEAST)</td>
                    <td className="p-3 text-amber-400">Legacy Only (Must pair with HMAC)</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-bold text-slate-400">AES-CTR (Counter Mode)</td>
                    <td className="p-3 text-rose-400 font-semibold">None (Stream behavior)</td>
                    <td className="p-3">No</td>
                    <td className="p-3 text-rose-400">Bit-flipping attacks if integrity tag omitted</td>
                    <td className="p-3 text-slate-400">Specialized (Requires external MAC)</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-bold text-rose-400">AES-ECB (Electronic Codebook)</td>
                    <td className="p-3 text-rose-400 font-semibold">None</td>
                    <td className="p-3">Yes (PKCS#7)</td>
                    <td className="p-3 text-rose-400 font-bold">Catastrophic: Identical plaintext yields identical ciphertext</td>
                    <td className="p-3 text-rose-400 font-bold">STRICTLY PROHIBITED</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="space-y-3 pt-2">
              <h4 className="font-bold text-[var(--text-primary)]">The Nonce-Reuse Disaster in AES-GCM:</h4>
              <p>
                While AES-GCM is the gold standard for authenticated encryption, it has one unforgiving requirement: <strong>The Initialization Vector (IV / Nonce) must NEVER be reused with the same symmetric key.</strong> If two distinct messages are encrypted with the same key and 96-bit nonce, an adversary can XOR the ciphertexts to reveal relative plaintext differences and algebraically recover the underlying GHASH authentication key ($H$), enabling arbitrary ciphertext forgery.
              </p>
              <p>
                In our client-side tools, every AES-GCM encryption automatically generates a cryptographically isolated 96-bit random IV using <code className="text-emerald-400">window.crypto.getRandomValues()</code>, prepending the IV directly to the ciphertext bundle.
              </p>
            </div>

            <h3 className="text-lg sm:text-xl font-bold text-[var(--text-primary)] pt-4">
              4.3 Production WebCrypto Implementation of AES-256-GCM
            </h3>
            <p>
              Here is the battle-tested, zero-dependency TypeScript implementation used on EncryptDecrypt.org:
            </p>

            <div className="relative rounded-2xl bg-[var(--bg-input)] border border-[var(--border-subtle)] p-4 font-mono text-xs overflow-x-auto">
              <div className="flex items-center justify-between pb-2 mb-2 border-b border-[var(--border-subtle)] text-[var(--text-muted)]">
                <span>Native W3C WebCrypto (TypeScript)</span>
                <button
                  onClick={() => handleCopyCode(
                    `async function encryptAesGcm(plaintext: string, secretKey: CryptoKey): Promise<{ iv: Uint8Array; ciphertext: Uint8Array }> {\n  const iv = window.crypto.getRandomValues(new Uint8Array(12)); // 96-bit IV\n  const encoded = new TextEncoder().encode(plaintext);\n  const encrypted = await window.crypto.subtle.encrypt(\n    { name: 'AES-GCM', iv, tagLength: 128 },\n    secretKey,\n    encoded\n  );\n  return { iv, ciphertext: new Uint8Array(encrypted) };\n}`,
                    'code-aes-gcm'
                  )}
                  className="hover:text-white flex items-center gap-1 cursor-pointer"
                >
                  {copiedCodeIndex === 'code-aes-gcm' ? <Check size={13} className="text-emerald-400" /> : <Copy size={13} />}
                  <span>{copiedCodeIndex === 'code-aes-gcm' ? 'Copied' : 'Copy'}</span>
                </button>
              </div>
              <pre className="text-sky-300 leading-relaxed m-0">
{`async function encryptAesGcm(plaintext: string, secretKey: CryptoKey) {
  // 1. Generate 96-bit cryptographically secure IV
  const iv = window.crypto.getRandomValues(new Uint8Array(12));
  const encoded = new TextEncoder().encode(plaintext);

  // 2. Perform authenticated encryption with 128-bit tag
  const ciphertextBuffer = await window.crypto.subtle.encrypt(
    { name: 'AES-GCM', iv, tagLength: 128 },
    secretKey,
    encoded
  );

  return {
    iv: Array.from(iv).map(b => b.toString(16).padStart(2, '0')).join(''),
    ciphertext: Array.from(new Uint8Array(ciphertextBuffer)).map(b => b.toString(16).padStart(2, '0')).join('')
  };
}`}
              </pre>
            </div>
          </section>

          {/* ======================================================== */}
          {/* PART 5: ASYMMETRIC CRYPTOGRAPHY & KEY EXCHANGE */}
          {/* ======================================================== */}
          <section id="part-5" className="card-glass p-6 sm:p-10 rounded-3xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] shadow-xs space-y-6">
            <div className="flex items-center gap-2 text-xs font-mono text-cyan-400">
              <Key size={14} />
              <span>CHAPTER 05 · PUBLIC-KEY CRYPTOGRAPHY &amp; KEY EXCHANGE</span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-extrabold text-[var(--text-primary)] tracking-tight">
              5. Asymmetric Cryptography: RSA-OAEP, Elliptic Curves (ECC / Ed25519) &amp; Hybrid Encryption
            </h2>

            <p>
              Asymmetric cryptography resolves the fundamental dilemma of symmetric ciphers: <em>How do two parties establish a shared secret key over an untrusted, publicly monitored network without an adversary intercepting it?</em> By decoupling keys into a <strong>Public Key</strong> (freely distributable for encryption or signature verification) and a mathematically paired <strong>Private Key</strong> (strictly guarded for decryption or digital signing), asymmetric systems power HTTPS certificates, SSH authentication, and digital signatures worldwide.
            </p>

            <h3 className="text-lg sm:text-xl font-bold text-[var(--text-primary)] pt-2">
              5.1 The Mathematical Engine of RSA (RFC 8017)
            </h3>
            <p>
              Invented in 1977 by Ron Rivest, Adi Shamir, and Leonard Adleman, RSA derives its hardness from the computational intractability of factoring the product of two enormous prime numbers:
            </p>
            <ol className="list-decimal pl-5 space-y-2 text-xs">
              <li>Choose two large distinct primes, p and q (typically 1024 to 2048 bits each).</li>
              <li>Compute the modulus n = p × q. The bit-length of n defines the key length (e.g. 2048 or 4096 bits).</li>
              <li>Calculate Euler&apos;s totient function: φ(n) = (p - 1)(q - 1).</li>
              <li>Select a public exponent e such that 1 &lt; e &lt; φ(n) and gcd(e, φ(n)) = 1. The universal industry standard is the Fermat prime e = 65537 (2^16 + 1).</li>
              <li>Compute the private exponent d via the extended Euclidean algorithm such that (d × e) ≡ 1 (mod φ(n)).</li>
            </ol>
            <p className="text-xs pt-1">
              Encryption transforms plaintext integer m via c ≡ m^e (mod n), while decryption recovers m ≡ c^d (mod n).
            </p>

            <h3 className="text-lg sm:text-xl font-bold text-[var(--text-primary)] pt-4">
              5.2 Why Textbook RSA Fails: The Mandatory Role of OAEP
            </h3>
            <p>
              Direct mathematical exponentiation (&quot;textbook RSA&quot;) is critically broken due to its mathematical multiplicativity: encrypting two values yields $c_1 \times c_2 = (m_1 \times m_2)^e \pmod n$, enabling malleability and chosen-ciphertext exploits.
            </p>
            <p>
              Modern standards mandate <strong>RSA-OAEP (Optimal Asymmetric Encryption Padding)</strong>. OAEP integrates two asymmetric Feistel network hashing steps (using SHA-256) with random salt padding prior to modular exponentiation, establishing provable IND-CCA2 security (indistinguishability under adaptive chosen-ciphertext attack).
            </p>

            <h3 className="text-lg sm:text-xl font-bold text-[var(--text-primary)] pt-4">
              5.3 Elliptic Curve Cryptography (ECC): The Ed25519 &amp; P-256 Leap
            </h3>
            <p>
              While 2048-bit RSA remains secure, it requires substantial computational overhead and large key sizes. <strong>Elliptic Curve Cryptography (ECC)</strong> achieves equivalent or superior cryptographic security with drastically smaller key dimensions by operating on points over algebraic curves:
            </p>

            <div className="overflow-x-auto my-3">
              <table className="w-full text-xs text-left border-collapse border border-[var(--border-subtle)]">
                <thead>
                  <tr className="bg-[var(--bg-input)] text-[var(--text-primary)] border-b border-[var(--border-subtle)]">
                    <th className="p-2.5">Security Level</th>
                    <th className="p-2.5">Equivalent RSA Key Size</th>
                    <th className="p-2.5">Equivalent ECC Key Size</th>
                    <th className="p-2.5">Performance / Bandwidth Advantage</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--border-subtle)]">
                  <tr>
                    <td className="p-2.5 font-bold text-slate-300">128 bits of security</td>
                    <td className="p-2.5 font-mono">3,072 bits</td>
                    <td className="p-2.5 font-mono font-bold text-sky-400">256 bits (P-256, Ed25519)</td>
                    <td className="p-2.5 text-emerald-400 font-semibold">12x smaller keys, ~10x faster handshake</td>
                  </tr>
                  <tr>
                    <td className="p-2.5 font-bold text-slate-300">192 bits of security</td>
                    <td className="p-2.5 font-mono">7,680 bits</td>
                    <td className="p-2.5 font-mono font-bold text-sky-400">384 bits (P-384)</td>
                    <td className="p-2.5 text-emerald-400 font-semibold">20x smaller keys</td>
                  </tr>
                  <tr>
                    <td className="p-2.5 font-bold text-slate-300">256 bits of security</td>
                    <td className="p-2.5 font-mono">15,360 bits</td>
                    <td className="p-2.5 font-mono font-bold text-sky-400">512 bits (P-521, Ed448)</td>
                    <td className="p-2.5 text-emerald-400 font-semibold">30x smaller keys</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <h3 className="text-lg sm:text-xl font-bold text-[var(--text-primary)] pt-4">
              5.4 Hybrid Encryption Architecture: The Best of Both Worlds
            </h3>
            <p>
              Asymmetric algorithms are mathematically demanding and limited in plaintext payload capacity (RSA cannot encrypt a payload larger than its modulus minus padding bytes). Consequently, modern protocols (TLS 1.3, PGP, Signal Protocol) utilize <strong>Hybrid Encryption</strong>:
            </p>
            <ol className="list-decimal pl-5 space-y-1.5 text-xs">
              <li>Generate a high-entropy, ephemeral 256-bit symmetric session key locally using a CSPRNG.</li>
              <li>Encrypt the bulky payload using fast, hardware-accelerated <strong>AES-256-GCM</strong>.</li>
              <li>Encrypt only the 256-bit symmetric key using the recipient&apos;s <strong>RSA-4096 or ECDH public key</strong>.</li>
              <li>Transmit the encrypted session key alongside the AES-GCM ciphertext and authentication tag.</li>
            </ol>
          </section>

          {/* ======================================================== */}
          {/* PART 6: CRYPTOGRAPHIC HASHING */}
          {/* ======================================================== */}
          <section id="part-6" className="card-glass p-6 sm:p-10 rounded-3xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] shadow-xs space-y-6">
            <div className="flex items-center gap-2 text-xs font-mono text-amber-400">
              <Hash size={14} />
              <span>CHAPTER 06 · HASH FUNCTIONS, MERKLE-DAMGÅRD &amp; INTEGRITY</span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-extrabold text-[var(--text-primary)] tracking-tight">
              6. Cryptographic Hashes: SHA-256, SHA-3 Keccak, HMAC &amp; The Fall of MD5 / SHA-1
            </h2>

            <p>
              A cryptographic hash function transforms arbitrary-length input data into a unique, fixed-size binary digest. Unlike encryption, hashing is strictly a <strong>one-way mathematical operation</strong>—there is no secret key that can invert a valid digest back into its original input string.
            </p>

            <div className="space-y-3 pt-2">
              <h3 className="text-lg sm:text-xl font-bold text-[var(--text-primary)]">
                6.1 The Three Sacred Pillars of Cryptographic Hashes
              </h3>
              <ul className="list-disc pl-5 space-y-2 text-xs">
                <li>
                  <strong>Pre-Image Resistance (One-Way):</strong> Given a hash value h, it is computationally impossible to find any input m such that Hash(m) = h.
                </li>
                <li>
                  <strong>Second Pre-Image Resistance (Weak Collision Resistance):</strong> Given a specific message m1, it is computationally impossible to find a different message m2 such that Hash(m1) = Hash(m2).
                </li>
                <li>
                  <strong>Collision Resistance (Strong Collision Resistance):</strong> It is computationally impossible to locate <em>any two distinct arbitrary messages</em> m1 ≠ m2 that produce the identical digest Hash(m1) = Hash(m2).
                </li>
              </ul>
            </div>

            <h3 className="text-lg sm:text-xl font-bold text-[var(--text-primary)] pt-4">
              6.2 The Anatomy of SHA-256 (NIST FIPS PUB 180-4)
            </h3>
            <p>
              SHA-256 processes data in 512-bit blocks through 64 rounds of non-linear logical functions (Ch, Maj, Σ0, Σ1, σ0, σ1), producing a deterministic 256-bit (32-byte) hex string. It demonstrates an intense <strong>Avalanche Effect</strong>: changing even a single bit in a multi-gigabyte ISO image results in an average 50% change in output bits across the resulting digest.
            </p>

            <h3 className="text-lg sm:text-xl font-bold text-[var(--text-primary)] pt-4">
              6.3 The Merkle-Damgård Flaw &amp; Length Extension Attacks
            </h3>
            <p>
              SHA-256 belongs to the Merkle-Damgård construction family. Because its internal state after processing block N is identical to the intermediate hash output, naive message authentication schemes like Hash(Secret || Message) are completely broken. An attacker who knows Hash(Secret || Message) and the byte length of the secret can append malicious instructions and calculate the valid hash without ever discovering the secret.
            </p>
            <p>
              This vulnerability necessitated the design of <strong>HMAC (Keyed-Hash Message Authentication Code, RFC 2104)</strong>, which executes a nested two-pass hashing structure:
            </p>
            <div className="p-3 rounded-xl bg-[var(--bg-input)] border border-[var(--border-subtle)] font-mono text-xs text-sky-300">
              HMAC(K, m) = H((K&apos; ⊕ opad) ∥ H((K&apos; ⊕ ipad) ∥ m))
            </div>

            <h3 className="text-lg sm:text-xl font-bold text-[var(--text-primary)] pt-4">
              6.4 SHA-3 and the Keccak Sponge Construction (FIPS PUB 202)
            </h3>
            <p>
              In 2015, NIST standardized SHA-3 based on the revolutionary <strong>Keccak algorithm</strong>. Departing from the 40-year-old Merkle-Damgård paradigm, SHA-3 utilizes a <strong>Sponge Construction</strong> featuring an <em>Absorb Phase</em> (absorbing input bits into a 1600-bit state permutation) and a <em>Squeeze Phase</em> (extracting arbitrary output lengths). SHA-3 is fundamentally immune to length extension attacks, eliminating the necessity for HMAC wrappers in many architectures.
            </p>

            <h3 className="text-lg sm:text-xl font-bold text-[var(--text-primary)] pt-4">
              6.5 The Complete Post-Mortem of MD5 &amp; SHA-1
            </h3>
            <p>
              MD5 (128-bit) and SHA-1 (160-bit) are cryptographically dead. In 2004, Professor Xiaoyun Wang demonstrated practical collision attacks against MD5 in seconds. In 2017, Google and CWI Amsterdam executed the historic <strong>SHAttered attack</strong>, synthesizing two distinct PDF contracts with identical SHA-1 digests. Today, MD5 and SHA-1 are strictly prohibited in all digital certificates, TLS handshakes, and cryptographic signatures.
            </p>
          </section>

          {/* ======================================================== */}
          {/* PART 7: CREDENTIAL SECURITY & PASSWORD DERIVATION */}
          {/* ======================================================== */}
          <section id="part-7" className="card-glass p-6 sm:p-10 rounded-3xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] shadow-xs space-y-6">
            <div className="flex items-center gap-2 text-xs font-mono text-rose-400">
              <Cpu size={14} />
              <span>CHAPTER 07 · PASSWORD HARDENING &amp; MEMORY-HARD DERIVATION</span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-extrabold text-[var(--text-primary)] tracking-tight">
              7. Credential Security: Why Fast Hashes Are Lethal, NIST SP 800-63B &amp; Argon2id
            </h2>

            <p>
              The most prevalent architectural disaster in web development is storing user passwords by hashing them with general-purpose algorithms like MD5, SHA-1, or plain SHA-256.
            </p>
            <p>
              General cryptographic hash functions were intentionally engineered for <strong>maximum throughput and speed</strong> to verify multi-gigabyte disk images in milliseconds. A standard modern graphics card (such as an NVIDIA RTX 4090) can calculate over <strong>30,000,000,000 SHA-256 hashes per second</strong>. In an offline credential dump scenario, an adversary armed with consumer GPUs and Hashcat can crack an 8-character alphanumeric password hashed with SHA-256 in less than 15 minutes.
            </p>

            <h3 className="text-lg sm:text-xl font-bold text-[var(--text-primary)] pt-2">
              7.1 The Salt &amp; Pepper Defensive Formula
            </h3>
            <ul className="list-disc pl-5 space-y-2 text-xs">
              <li>
                <strong>Cryptographic Salt:</strong> A unique 16-to-32 byte random buffer generated per user by a CSPRNG. The salt is stored alongside the hash in the database, defeating pre-computed Rainbow Table attacks and guaranteeing that identical passwords yield distinct hashes.
              </li>
              <li>
                <strong>Cryptographic Pepper:</strong> A high-entropy secret key stored outside the database (e.g. in a Hardware Security Module or environment variable). Even if the entire SQL database is dumped, the hashes cannot be verified without the off-server pepper.
              </li>
            </ul>

            <h3 className="text-lg sm:text-xl font-bold text-[var(--text-primary)] pt-4">
              7.2 Memory-Hard Standards: PBKDF2, bcrypt, scrypt &amp; Argon2id
            </h3>
            <p>
              Modern standards established in <strong>NIST Special Publication 800-63B (Digital Identity Guidelines)</strong> mandate the use of slow, memory-hard Key Derivation Functions (KDFs):
            </p>

            <div className="space-y-4 pt-2 text-xs">
              <div className="p-4 rounded-2xl bg-[var(--bg-input)] border border-[var(--border-subtle)]">
                <span className="font-bold text-sky-400 block mb-1">1. PBKDF2 (Password-Based Key Derivation Function 2, RFC 2898)</span>
                <p className="text-[var(--text-secondary)] m-0">
                  Applies a pseudorandom function (HMAC-SHA256) repeatedly in an iterative loop. OWASP currently mandates a minimum of <strong>600,000 iterations</strong>. While robust and FIPS-compliant, PBKDF2 requires minimal memory, leaving it vulnerable to customized ASIC chip parallelization.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-[var(--bg-input)] border border-[var(--border-subtle)]">
                <span className="font-bold text-amber-400 block mb-1">2. bcrypt (Blowfish-based Eksblowfish Key Schedule)</span>
                <p className="text-[var(--text-secondary)] m-0">
                  Incorporates an expensive 4KB memory state and a configurable work factor (2^cost). Highly battle-tested since 1999, though it possesses a hard architectural limitation: passwords longer than 72 bytes are silently truncated.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-[var(--bg-input)] border border-[var(--border-subtle)]">
                <span className="font-bold text-emerald-400 block mb-1">3. Argon2id (Winner of the Password Hashing Competition, RFC 9106)</span>
                <p className="text-[var(--text-secondary)] m-0">
                  The undisputed modern champion. Argon2id is a hybrid construction blending Argon2d (data-dependent memory access for maximum ASIC resistance) and Argon2i (data-independent memory access to thwart side-channel cache timing attacks). It enforces strict memory hardness (e.g. requiring 64 MB of RAM per hash), making massive GPU attacks economically impossible.
                </p>
              </div>
            </div>

            <h3 className="text-lg sm:text-xl font-bold text-[var(--text-primary)] pt-4">
              7.3 Calculating Password Entropy: The Mathematics of Passphrase Strength
            </h3>
            <p>
              Password strength is mathematically quantified in <strong>bits of entropy ($E$)</strong>:
            </p>
            <div className="p-3 rounded-xl bg-[var(--bg-input)] border border-[var(--border-subtle)] font-mono text-xs text-emerald-400">
              E = L × log₂(R)
            </div>
            <p className="text-xs pt-1">
              Where $L$ is password length and $R$ is the size of the character pool (e.g. 26 for lowercase, 62 for alphanumeric, 95 for ASCII printable). A 16-character password chosen uniformly from 95 characters possesses $16 \times \log_2(95) \approx 105.1$ bits of entropy, rendering brute-force attacks impossible across centuries.
            </p>
          </section>

          {/* ======================================================== */}
          {/* PART 8: DATA ENCODING STANDARDS */}
          {/* ======================================================== */}
          <section id="part-8" className="card-glass p-6 sm:p-10 rounded-3xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] shadow-xs space-y-6">
            <div className="flex items-center gap-2 text-xs font-mono text-indigo-400">
              <FileCode size={14} />
              <span>CHAPTER 08 · BINARY SERIALIZATION &amp; ENCODING SCHEMES</span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-extrabold text-[var(--text-primary)] tracking-tight">
              8. Data Encodings: RFC 4648 Base64, Hexadecimal, Base32 &amp; Bitcoin Base58
            </h2>

            <p>
              A constant point of confusion in computer science is the difference between <strong>Encoding</strong>, <strong>Encryption</strong>, and <strong>Hashing</strong>:
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-xs">
              <li><strong>Encryption:</strong> Converts plaintext into unreadable ciphertext to guarantee <em>confidentiality</em>, requiring a secret key to reverse.</li>
              <li><strong>Hashing:</strong> Produces a fixed-length fingerprint to verify <em>integrity</em>, completely irreversible.</li>
              <li><strong>Encoding:</strong> Converts binary streams into ASCII printable text for <em>safe data transmission</em> across legacy text-only channels (SMTP, HTTP, JSON). It uses zero keys and can be reversed by anyone instantly.</li>
            </ul>

            <h3 className="text-lg sm:text-xl font-bold text-[var(--text-primary)] pt-2">
              8.1 Base64 Encoding Mechanics (RFC 4648)
            </h3>
            <p>
              Base64 takes three 8-bit bytes (24 bits total) and splits them into four 6-bit chunks ($2^6 = 64$ printable characters: A-Z, a-z, 0-9, +, /). Because 3 bytes become 4 bytes, Base64 introduces a predictable <strong>33.3% bandwidth overhead</strong>. If the input byte length is not divisible by 3, padding characters (<code className="text-sky-300">=</code>) are appended to finalize the alignment.
            </p>

            <h3 className="text-lg sm:text-xl font-bold text-[var(--text-primary)] pt-4">
              8.2 Standard Base64 vs. URL-Safe Base64
            </h3>
            <p>
              Standard Base64 contains characters <code className="text-rose-400">+</code> and <code className="text-rose-400">/</code>, which possess reserved syntactic meanings in URLs (e.g. <code className="text-rose-400">+</code> represents space, <code className="text-rose-400">/</code> separates path segments).
            </p>
            <p>
              <strong>URL-Safe Base64 (RFC 4648 §5)</strong> substitutes <code className="text-emerald-300">-</code> for <code className="text-rose-400">+</code> and <code className="text-emerald-300">_</code> for <code className="text-rose-400">/</code>, frequently omitting padding characters. This encoding is the foundational transport layer for JSON Web Tokens (JWT) and WebAuthn credentials.
            </p>

            <h3 className="text-lg sm:text-xl font-bold text-[var(--text-primary)] pt-4">
              8.3 Specialized Schemes: Base32 and Satoshi&apos;s Base58
            </h3>
            <ul className="list-disc pl-5 space-y-2 text-xs">
              <li>
                <strong>Base32 (RFC 4648 §6):</strong> Encodes 5-bit groups using 32 uppercase characters (A-Z, 2-7). It excludes numbers 0, 1, 8, and 9 to eliminate visual confusion with letters O, I, and B. Base32 is ubiquitous in Google Authenticator TOTP secrets (RFC 6238).
              </li>
              <li>
                <strong>Base58 (Bitcoin &amp; IPFS):</strong> Designed by Satoshi Nakamoto, Base58 removes all visually ambiguous glyphs: zero (0), capital O, capital I, lowercase l, plus (+), and slash (/). This prevents catastrophic transcription errors when humans manually read or transcribe cryptocurrency wallet addresses.
              </li>
            </ul>
          </section>

          {/* ======================================================== */}
          {/* PART 9: TOKEN SECURITY & STATELESS AUTH */}
          {/* ======================================================== */}
          <section id="part-9" className="card-glass p-6 sm:p-10 rounded-3xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] shadow-xs space-y-6">
            <div className="flex items-center gap-2 text-xs font-mono text-emerald-400">
              <CheckCircle2 size={14} />
              <span>CHAPTER 09 · TOKEN ARCHITECTURE &amp; STATELESS IDENTITY</span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-extrabold text-[var(--text-primary)] tracking-tight">
              9. Token Security: RFC 7519 JWT Inspection, Signature Stripping &amp; UUID v7
            </h2>

            <p>
              <strong>JSON Web Tokens (JWT, RFC 7519)</strong> power modern distributed microservices and Single Page Applications (SPAs). Composed of three dot-separated Base64URL-encoded components:
            </p>
            <div className="p-3 rounded-xl bg-[var(--bg-input)] border border-[var(--border-subtle)] font-mono text-xs text-sky-300 overflow-x-auto">
              [BASE64URL(Header)].[BASE64URL(Payload)].[BASE64URL(Signature)]
            </div>

            <div className="space-y-3 pt-3">
              <h3 className="text-lg sm:text-xl font-bold text-[var(--text-primary)]">
                9.1 The Infamous &quot;alg: none&quot; Authentication Bypass
              </h3>
              <p>
                The JWT specification permitted an unsigned token mode labeled <code className="text-rose-400">&quot;alg&quot;: &quot;none&quot;</code>. Flawed verification libraries that blindly inspect the token header without enforcing server-side algorithm whitelisting will validate tampered payloads if an attacker modifies the payload (e.g. changing <code className="text-sky-300">&quot;role&quot;: &quot;user&quot;</code> to <code className="text-emerald-300">&quot;role&quot;: &quot;admin&quot;</code>), sets <code className="text-rose-400">&quot;alg&quot;: &quot;none&quot;</code>, and strips the signature.
              </p>
              <p>
                <strong>Security Rule:</strong> Modern authentication gateways must strictly reject any token where the algorithm does not match the server&apos;s explicit cryptographic expectations.
              </p>
            </div>

            <h3 className="text-lg sm:text-xl font-bold text-[var(--text-primary)] pt-4">
              9.2 Symmetric (HS256) vs. Asymmetric (RS256 / ES256) Tokens
            </h3>
            <p>
              In large microservice fabrics, using symmetric HS256 requires distributing the shared secret key to every downstream service verifying tokens. If a single microservice is compromised, the attacker can forge valid tokens across the entire enterprise.
            </p>
            <p>
              Employing asymmetric signing (RS256 or ECDSA ES256) isolates the private signing key strictly within the centralized Identity Provider (IdP). Downstream consumers verify signatures using public keys distributed via <strong>JSON Web Key Sets (JWKS, RFC 7517)</strong>.
            </p>

            <h3 className="text-lg sm:text-xl font-bold text-[var(--text-primary)] pt-4">
              9.3 The Evolution of Unique Identifiers: UUID v4 vs. UUID v7 (RFC 9562)
            </h3>
            <p>
              Traditional <strong>UUID v4</strong> provides 122 bits of pure pseudorandom entropy. While collision-resistant, pure random UUIDs wreck relational database B-Tree index performance: inserts occur randomly across disk pages, causing continuous page splits and fragmentation.
            </p>
            <p>
              The newly ratified <strong>UUID v7 (RFC 9562)</strong> resolves this by embedding a 48-bit millisecond Unix timestamp in the leading bits followed by 74 bits of cryptographically random entropy. UUID v7 delivers perfect monotonic time-ordering, accelerating database indexing while preserving globally unique entropy.
            </p>
          </section>

          {/* ======================================================== */}
          {/* PART 10: DEFENSIVE WEB SECURITY & SYSTEM HARDENING */}
          {/* ======================================================== */}
          <section id="part-10" className="card-glass p-6 sm:p-10 rounded-3xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] shadow-xs space-y-6">
            <div className="flex items-center gap-2 text-xs font-mono text-teal-400">
              <Shield size={14} />
              <span>CHAPTER 10 · DEFENSIVE HEADERS &amp; SYSTEM HARDENING</span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-extrabold text-[var(--text-primary)] tracking-tight">
              10. Defensive Web Security: Content Security Policy, SRI &amp; Unix Chmod Calculations
            </h2>

            <p>
              Deploying secure cryptography in the browser is futile if malicious cross-site scripting (XSS) scripts can execute on the page and read plaintexts directly from JavaScript heap memory. Robust defensive web security requires layered HTTP headers and strict POSIX filesystem permissions.
            </p>

            <h3 className="text-lg sm:text-xl font-bold text-[var(--text-primary)] pt-2">
              10.1 Content Security Policy (CSP Level 3)
            </h3>
            <p>
              A strict Content Security Policy informs the browser exactly which remote sources are authorized to execute scripts, load stylesheets, or open WebSocket connections:
            </p>

            <div className="relative rounded-2xl bg-[var(--bg-input)] border border-[var(--border-subtle)] p-4 font-mono text-xs overflow-x-auto">
              <pre className="text-sky-300 leading-relaxed m-0">
{`Content-Security-Policy: 
  default-src 'self'; 
  script-src 'self' 'nonce-rAnd0m123' https://pagead2.googlesyndication.com; 
  style-src 'self' 'unsafe-inline'; 
  img-src 'self' data: https://*.google.com; 
  connect-src 'self' https://*.google.com; 
  frame-ancestors 'none'; 
  base-uri 'self'; 
  form-action 'self';`}
              </pre>
            </div>

            <h3 className="text-lg sm:text-xl font-bold text-[var(--text-primary)] pt-4">
              10.2 Subresource Integrity (SRI)
            </h3>
            <p>
              When importing JavaScript libraries from public CDNs, supply chain attacks pose a critical danger. <strong>Subresource Integrity (SRI)</strong> forces the browser to hash the fetched asset and compare it against a cryptographic hash declared in the HTML tag:
            </p>
            <div className="p-3 rounded-xl bg-[var(--bg-input)] border border-[var(--border-subtle)] font-mono text-xs text-emerald-400 overflow-x-auto">
              &lt;script src=&quot;https://cdn.example.com/lib.js&quot; integrity=&quot;sha384-oqVuAfXRKap7fdgcCY5uykM6+R9GqQ8K/uxy9rx7HNQlGYl1kPzQho1wx4JwY8wC&quot; crossorigin=&quot;anonymous&quot;&gt;&lt;/script&gt;
            </div>

            <h3 className="text-lg sm:text-xl font-bold text-[var(--text-primary)] pt-4">
              10.3 POSIX File Permissions &amp; The Danger of chmod 777
            </h3>
            <p>
              Unix file permissions represent access rights as three octal digits corresponding to <strong>Owner</strong>, <strong>Group</strong>, and <strong>Others</strong>. Each class combines three discrete binary weights:
            </p>
            <ul className="list-disc pl-5 space-y-1 text-xs">
              <li><strong>Read (r):</strong> 4</li>
              <li><strong>Write (w):</strong> 2</li>
              <li><strong>Execute (x):</strong> 1</li>
            </ul>
            <p className="text-xs pt-1">
              Executing <code className="text-rose-400 font-bold">chmod 777 file.txt</code> grants write and execution permissions to every non-privileged user and service account on the server, permitting compromised web processes (such as an Apache or Nginx worker) to overwrite code files and achieve immediate Remote Code Execution (RCE).
            </p>
            <div className="p-3.5 rounded-xl bg-blue-950/20 border border-blue-500/20 text-xs">
              <strong className="text-sky-300 block mb-1">Production Best Practice Guidelines:</strong>
              <span className="text-slate-300">
                Web directories should be strictly set to <strong>755 (rwxr-xr-x)</strong>, standard static web assets to <strong>644 (rw-r--r--)</strong>, and sensitive private SSH keys to <strong>600 (rw-------)</strong> or <strong>400 (r--------)</strong>.
              </span>
            </div>
          </section>

          {/* ======================================================== */}
          {/* PART 11: DEVELOPER UTILITIES & ECOSYSTEM */}
          {/* ======================================================== */}
          <section id="part-11" className="card-glass p-6 sm:p-10 rounded-3xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] shadow-xs space-y-6">
            <div className="flex items-center gap-2 text-xs font-mono text-purple-400">
              <Code size={14} />
              <span>CHAPTER 11 · DEVELOPER PRODUCTIVITY &amp; UTILITIES ECOSYSTEM</span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-extrabold text-[var(--text-primary)] tracking-tight">
              11. Modern Developer Utilities: JSON Validation, RegEx Catastrophic Backtracking &amp; Epoch Time
            </h2>

            <p>
              Beyond raw cryptography, robust engineering requires an integrated suite of developer formatters, schema validators, and data converters.
            </p>

            <h3 className="text-lg sm:text-xl font-bold text-[var(--text-primary)] pt-2">
              11.1 Regular Expression Denial of Service (ReDoS)
            </h3>
            <p>
              Regular expressions with nested quantifiers (such as <code>(a+)+$</code>) exhibit exponential backtracking when presented with ambiguous non-matching inputs (e.g. <code>aaaaaaaaaaaaaaaaaaaaaaaa!</code>). This locks the single-threaded Node.js or browser event loop at 100% CPU utilization, causing a severe <strong>ReDoS outage</strong>. Always test regex expressions against non-backtracking engines or sanitize pattern complexity before deployment.
            </p>

            <h3 className="text-lg sm:text-xl font-bold text-[var(--text-primary)] pt-4">
              11.2 The Year 2038 Problem in Unix Timestamps
            </h3>
            <p>
              Unix time counts seconds elapsed since January 1, 1970 (UTC). Systems using signed 32-bit integers will overflow on <strong>January 19, 2038 at 03:14:07 UTC</strong>, wrapping into negative values and resetting clocks to 1901. Modern platforms must standardize strictly on 64-bit integer timestamp representations, guaranteeing calendar accuracy for over 292 billion years.
            </p>
          </section>

          {/* ======================================================== */}
          {/* PART 12: MASTER COMPLIANCE ROADMAP */}
          {/* ======================================================== */}
          <section id="part-12" className="card-glass p-6 sm:p-10 rounded-3xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] shadow-xs space-y-6">
            <div className="flex items-center gap-2 text-xs font-mono text-emerald-400">
              <CheckCircle2 size={14} />
              <span>CHAPTER 12 · COMPLIANCE AUDIT &amp; IMPLEMENTATION ROADMAP</span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-extrabold text-[var(--text-primary)] tracking-tight">
              12. The Master Implementation Roadmap: 10-Step AdSense &amp; Cryptography Audit Checklist
            </h2>

            <p>
              Use this checklist to ensure 100% compliance across your web properties:
            </p>

            <div className="space-y-3 pt-2">
              {[
                { title: '1. Verify Ads.txt Crawl Accessibility', desc: 'Ensure https://yourdomain.com/ads.txt returns HTTP 200 with Content-Type text/plain; charset=utf-8 containing google.com, pub-XXXXXXXXXXXXXXXX, DIRECT, f08c47fec0942fa (where pub-XXXXXXXXXXXXXXXX is replaced with your verified 16-digit publisher ID).' },
                { title: '2. Enforce Asynchronous AdSense Tagging', desc: 'Deploy the official asynchronous script tag with crossorigin="anonymous" to protect DOM rendering speeds.' },
                { title: '3. Pre-Allocate Ad Slot Dimensions (CLS Prevention)', desc: 'Set CSS min-height or aspect-ratio on all display ad containers to eliminate layout shifts.' },
                { title: '4. Migrate Symmetric Ciphers to AES-256-GCM', desc: 'Deprecate legacy AES-CBC and DES. Ensure 128-bit authentication tags and unique 96-bit random IVs are used for every payload.' },
                { title: '5. Upgrade Password Storage to Argon2id or PBKDF2', desc: 'Ban plain MD5, SHA-1, and SHA-256 for credentials. Enforce unique 16-byte cryptographic salts.' },
                { title: '6. Transition to Asymmetric Token Signing (RS256 / ES256)', desc: 'Replace shared HS256 symmetric token secrets with asymmetric keypairs and whitelisted algorithms.' },
                { title: '7. Adopt UUID v7 for Database Key Generation', desc: 'Transition high-write database tables from random UUID v4 to timestamp-ordered UUID v7 to optimize B-Tree indexing.' },
                { title: '8. Deploy Strict Content Security Policy (CSP Level 3)', desc: 'Block inline script injection with cryptographic nonces and enforce strict script-src domains.' },
                { title: '9. Audit Server Filesystem Permissions', desc: 'Ensure directories are 755, assets 644, and private SSH/SSL keys strictly 600.' },
                { title: '10. Guarantee Zero-Knowledge Client-Side Memory Privacy', desc: 'Use W3C WebCrypto (crypto.subtle) for client transformations with explicit zeroization of Uint8Array buffers.' },
              ].map((item, idx) => (
                <div key={idx} className="p-4 rounded-xl bg-[var(--bg-input)] border border-[var(--border-subtle)] flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 text-xs font-bold mt-0.5">
                    ✓
                  </div>
                  <div>
                    <span className="font-bold text-[var(--text-primary)] block text-sm mb-1">{item.title}</span>
                    <p className="text-xs text-[var(--text-secondary)] m-0 leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* ======================================================== */}
          {/* PART 13: COMPREHENSIVE FAQ SECTION */}
          {/* ======================================================== */}
          <section id="part-faq" className="card-glass p-6 sm:p-10 rounded-3xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] shadow-xs space-y-6">
            <div className="flex items-center gap-2 text-xs font-mono text-sky-400">
              <Sparkles size={14} />
              <span>CHAPTER 13 · RICH INTERACTIVE FAQ</span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-extrabold text-[var(--text-primary)] tracking-tight">
              13. Frequently Asked Questions (FAQ): Cryptography, Ads.txt &amp; Performance
            </h2>

            <div className="space-y-4 pt-2">
              <div className="p-5 rounded-2xl bg-[var(--bg-input)] border border-[var(--border-subtle)]">
                <h3 className="font-bold text-base text-[var(--text-primary)] mb-2">
                  Q1: What is the standard ads.txt directive for Google AdSense?
                </h3>
                <p className="text-xs sm:text-sm text-[var(--text-secondary)] leading-relaxed m-0">
                  The standard IAB Tech Lab syntax for a Google AdSense publisher is: <code className="text-sky-300 font-mono">google.com, pub-XXXXXXXXXXXXXXXX, DIRECT, f08c47fec0942fa</code> (where <code className="text-emerald-400 font-mono">pub-XXXXXXXXXXXXXXXX</code> is replaced with your verified 16-digit publisher account ID). It must be served at the domain apex root (<code className="text-emerald-400 font-mono">/ads.txt</code>) with UTF-8 encoding and without a Byte Order Mark (BOM).
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-[var(--bg-input)] border border-[var(--border-subtle)]">
                <h3 className="font-bold text-base text-[var(--text-primary)] mb-2">
                  Q2: How long does Google take to crawl and verify an updated ads.txt file?
                </h3>
                <p className="text-xs sm:text-sm text-[var(--text-secondary)] leading-relaxed m-0">
                  Google AdSense crawler bot (<code className="text-sky-300 font-mono">Mediapartners-Google</code>) checks the root <code className="text-sky-300 font-mono">ads.txt</code> file approximately once every 24 to 48 hours. Once crawled successfully, dashboard warning banners automatically clear within 48 to 72 hours.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-[var(--bg-input)] border border-[var(--border-subtle)]">
                <h3 className="font-bold text-base text-[var(--text-primary)] mb-2">
                  Q3: Why is AES-256-GCM superior to AES-256-CBC?
                </h3>
                <p className="text-xs sm:text-sm text-[var(--text-secondary)] leading-relaxed m-0">
                  AES-256-GCM provides Authenticated Encryption with Associated Data (AEAD). It calculates an unforgeable 128-bit authentication tag over the ciphertext. If an adversary tampers with even a single bit of the data, the decryption process fails immediately. AES-CBC lacks native authentication, exposing applications to devastating padding oracle exploits.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-[var(--bg-input)] border border-[var(--border-subtle)]">
                <h3 className="font-bold text-base text-[var(--text-primary)] mb-2">
                  Q4: Can client-side SHA-256 hashes be reversed?
                </h3>
                <p className="text-xs sm:text-sm text-[var(--text-secondary)] leading-relaxed m-0">
                  No. SHA-256 is a deterministic, one-way cryptographic compression function. Mathematical pre-image resistance ensures that reconstructing the original input from the 256-bit hash is computationally impossible.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-[var(--bg-input)] border border-[var(--border-subtle)]">
                <h3 className="font-bold text-base text-[var(--text-primary)] mb-2">
                  Q5: Why is Math.random() prohibited in cryptographic applications?
                </h3>
                <p className="text-xs sm:text-sm text-[var(--text-secondary)] leading-relaxed m-0">
                  <code className="text-rose-400 font-mono">Math.random()</code> is an insecure pseudo-random generator with a tiny internal state. An observer can easily predict future outputs after observing a few samples. Always use <code className="text-emerald-400 font-mono">window.crypto.getRandomValues()</code>, which sources entropy directly from the OS kernel CSPRNG.
                </p>
              </div>
            </div>
          </section>

          {/* Call to Action Footer */}
          <div className="p-8 sm:p-10 rounded-3xl bg-gradient-to-r from-blue-900/30 via-indigo-900/30 to-purple-900/30 border border-blue-500/40 text-center space-y-4">
            <h3 className="text-xl sm:text-2xl font-black text-[var(--text-primary)]">
              Ready to Explore 1,380+ Free Zero-Knowledge Tools?
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 max-w-xl mx-auto">
              Test every cipher, hash function, data encoder, and developer validator covered in this guide directly in your browser. 100% private in local RAM.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              <button
                onClick={onNavigateHome}
                className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs transition cursor-pointer shadow-md"
              >
                Explore All 1,380+ Tools
              </button>
              <button
                onClick={() => onSelectToolBySlug('aes-encryption-decryption')}
                className="px-6 py-3 rounded-xl bg-[var(--bg-surface)] hover:bg-[var(--bg-surface-hover)] border border-[var(--border-subtle)] text-[var(--text-primary)] font-bold text-xs transition cursor-pointer"
              >
                Launch AES-256 Tool
              </button>
            </div>
          </div>

        </article>
      </div>
    </div>
  );
};
