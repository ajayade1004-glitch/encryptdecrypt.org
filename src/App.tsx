import React, { useState, useEffect, useMemo, useRef, Suspense, lazy } from 'react';
import { 
  Shield, Lock, Search, Copy, Download, ArrowRightLeft, 
  Check, Moon, Sun, Key, Hash, FileCode, Cpu, Layers,
  Terminal, ShieldCheck, Database, Zap, RefreshCw, X,
  ChevronRight, ArrowLeft, Binary, CheckCircle, FileText,
  Sliders, Wifi, Code, Sparkles, Menu, BookOpen, Info, Mail,
  Globe, Clock, Palette, Eye, Gauge, Image, Calculator
} from 'lucide-react';
import { ToolItem, CategoryInfo } from './types';
import * as engines from './crypto/toolEngines';
import { searchTools } from './utils/searchTools';
import { SeoHead } from './components/SeoHead';
import { AdUnit } from './components/AdUnit';
import { applyAdminOverrides, recordToolExecution, recordSearchQuery, recordPageView } from './utils/adminStorage';

// --- REACT LAZY IMPORTS (Code Splitting for 100% Mobile Score) ---
const ToolWorkspace = lazy(() => import('./components/ToolWorkspace').then(module => ({ default: module.ToolWorkspace })));
const AboutPage = lazy(() => import('./components/pages/AboutPage').then(module => ({ default: module.AboutPage })));
const ContactPage = lazy(() => import('./components/pages/ContactPage').then(module => ({ default: module.ContactPage })));
const TechGuidesPage = lazy(() => import('./components/pages/TechGuidesPage').then(module => ({ default: module.TechGuidesPage })));
const PrivacyPage = lazy(() => import('./components/pages/PrivacyPage').then(module => ({ default: module.PrivacyPage })));
const TermsPage = lazy(() => import('./components/pages/TermsPage').then(module => ({ default: module.TermsPage })));
const DisclaimerPage = lazy(() => import('./components/pages/DisclaimerPage').then(module => ({ default: module.DisclaimerPage })));
const NotFoundPage = lazy(() => import('./components/pages/NotFoundPage').then(module => ({ default: module.NotFoundPage })));
const AdminPanel = lazy(() => import('./components/admin/AdminPanel').then(module => ({ default: module.AdminPanel })));
// ------------------------------------------------------------------

export type AppView = 'catalog' | 'about' | 'contact' | 'guides' | 'privacy' | 'terms' | 'disclaimer' | 'admin' | 'notfound';

export const CATEGORY_HUBS_CONFIG = [
  { slug: 'json-developer-tools', name: 'JSON & Developer Tools', icon: Code, count: 9, desc: 'Minifier, Diff, Path Tester, Kotlin/Java/C#/Go, Schema' },
  { slug: 'api-web-development', name: 'API & Web Development', icon: Globe, count: 7, desc: 'HTTP Status, REST Builder, cURL, JWT, MIME Lookup' },
  { slug: 'seo-webmaster', name: 'SEO & Webmaster', icon: Search, count: 23, desc: 'Robots.txt, Sitemap, Meta Title/Desc, Schema, OG Card' },
  { slug: 'website-performance', name: 'Website Performance', icon: Gauge, count: 6, desc: 'Page Load, Image Size, CSS/JS/HTML Minifier, GZIP' },
  { slug: 'accessibility', name: 'Accessibility & WCAG', icon: Eye, count: 6, desc: 'WCAG Contrast, Alt Text, Heading, ARIA, Color Blindness' },
  { slug: 'text-writing-utilities', name: 'Text & Writing Utilities', icon: FileText, count: 7, desc: 'Sentence, Reading Time, Keyword Counter, Cleaner' },
  { slug: 'file-data-tools', name: 'File & Data Tools', icon: Database, count: 8, desc: 'CSV Viewer/Cleaner, TSV→CSV, JSON Table, XML, YAML' },
  { slug: 'date-time', name: 'Date & Time', icon: Clock, count: 7, desc: 'Unix Timestamp, Date Diff, Age, Duration, Business Days' },
  { slug: 'math-science', name: 'Math & Science', icon: Calculator, count: 8, desc: 'Scientific Calc, Fractions, Ratios, Averages, Compound Int' },
  { slug: 'color-design', name: 'Color & Design', icon: Palette, count: 8, desc: 'HEX Picker, RGB/HSL, Gradient, Palette, CSS Shadow' },
  { slug: 'network-dns', name: 'Network & DNS', icon: Wifi, count: 7, desc: 'DNS Lookup, IPv4/IPv6, CIDR, Subnet, User-Agent, Headers' },
  { slug: 'security-defensive', name: 'Security — Defensive', icon: ShieldCheck, count: 9, desc: 'Password Strength, Hash, Checksum, JWT, CSP, SRI' },
  { slug: 'developer-generators', name: 'Developer Generators', icon: Key, count: 7, desc: 'UUID, ULID, NanoID, Lorem Ipsum, Mock JSON, Regex' },
  { slug: 'image-web-optimization', name: 'Image & Web Optimization', icon: Image, count: 6, desc: 'Image Dimensions, Aspect Ratio, WebP, SVG Optimizer' },
  { slug: 'encoding-decoding', name: 'Encoding & Decoding', icon: Binary, count: 23, desc: 'Base64, Hex, URL, Morse, Base32, Base58, Binary' },
  { slug: 'encryption-ciphers', name: 'Encryption & Ciphers', icon: Lock, count: 24, desc: 'AES-GCM, Caesar, Vigenère, ROT13/47, ChaCha20' },
  { slug: 'hashing-security', name: 'Hashing & Security', icon: Hash, count: 20, desc: 'SHA-256/512, MD5, HMAC, CRC32, Keccak' },
  { slug: 'generators-tokens', name: 'Generators & Tokens', icon: Key, count: 19, desc: 'UUID v4/v7, Passwords, NanoID, API Keys, TOTP' },
  { slug: 'dev-tools-formatters', name: 'Dev Tools & Formatters', icon: Code, count: 16, desc: 'JSON, XML, SQL, YAML, Cron, RegEx, Markdown' },
  { slug: 'file-data-converters', name: 'File & Data Converters', icon: ArrowRightLeft, count: 16, desc: 'CSV to JSON, YAML, Base64 File, TS/JSON' },
  { slug: 'validators-checkers', name: 'Validators & Checkers', icon: CheckCircle, count: 14, desc: 'JWT, Credit Card Luhn, IP, IBAN, SemVer' },
  { slug: 'text-utilities', name: 'Text Utilities', icon: FileText, count: 15, desc: 'Word Counter, Case, Deduplication, Diff, Sort' },
  { slug: 'escape-network', name: 'Escape & Network', icon: Terminal, count: 15, desc: 'JS, SQL, HTML Entities, Shell, Regex, URLs' },
  { slug: 'security-certificates', name: 'Security & Certificates', icon: ShieldCheck, count: 15, desc: 'X.509, CSR, SSH Fingerprints, SRI, CSP, HSTS' },
  { slug: 'math-design', name: 'Math & Design', icon: Sliders, count: 19, desc: 'HEX/RGB/HSL, Aspect Ratio, Prime, Bitwise' },
  { slug: 'network-online', name: 'Network & Online Tools', icon: Wifi, count: 10, desc: 'IP Subnet CIDR, DNS, Port Lookup, User Agent' },
  { slug: 'converters-utilities', name: 'Converters & Utilities', icon: Cpu, count: 6, desc: 'Chmod Calc, Data Units, Number Words, UTC Time' },
];

export default function App() {
  const [tools, setTools] = useState<ToolItem[]>([]);
  const [selectedTool, setSelectedTool] = useState<ToolItem | null>(null);
  const [currentView, setCurrentView] = useState<AppView>('catalog');
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [searchFocused, setSearchFocused] = useState<boolean>(false);
  const [searchHighlightIndex, setSearchHighlightIndex] = useState<number>(-1);
  const [mobileSearchOpen, setMobileSearchOpen] = useState<boolean>(false);
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const headerSearchInputRef = useRef<HTMLInputElement>(null);
  const catalogSearchInputRef = useRef<HTMLInputElement>(null);
  const searchDropdownRef = useRef<HTMLDivElement>(null);

  // Quick Runner state for Homepage Hero (Base64, URL, SHA-256, Password)
  const [heroTab, setHeroTab] = useState<'base64' | 'url' | 'hash' | 'password'>('base64');
  const [heroInput, setHeroInput] = useState('Hello, Web Crypto & Privacy!');
  const [heroOutput, setHeroOutput] = useState('');
  const [heroCopied, setHeroCopied] = useState(false);

  // 1. Fetch tools.json on startup & reload
  const reloadToolsCatalog = () => {
    fetch('/assets/data/tools.json')
      .then(res => res.json())
      .then((data: ToolItem[]) => {
        const enhanced = applyAdminOverrides(data);
        setTools(enhanced);
      })
      .catch(err => {
        console.warn('Fallback loading tools:', err);
      });
  };

  // Route resolver supporting both hash and canonical path routes
  const resolveLocationRoute = (toolsList: ToolItem[]) => {
    const hash = window.location.hash.replace(/^#/, '');
    const pathname = window.location.pathname.replace(/\/+$/, '');

    // 1. Hash-based route
    if (hash.startsWith('tool=')) {
      const slug = hash.replace('tool=', '');
      const match = toolsList.find(t => t.slug === slug || t.id === slug);
      if (match) {
        setSelectedTool(match);
        setCurrentView('catalog');
        return;
      }
      setSelectedTool(null);
      setCurrentView('notfound');
      return;
    }
    if (['about', 'contact', 'guides', 'privacy', 'terms', 'disclaimer', 'admin'].includes(hash)) {
      setSelectedTool(null);
      setCurrentView(hash as AppView);
      return;
    }
    if (hash.startsWith('category=')) {
      const cat = hash.replace('category=', '');
      setActiveCategory(cat);
      setSelectedTool(null);
      setCurrentView('catalog');
      return;
    }

    // 2. Clean pathname-based route (sitemap / organic search direct landing)
    if (pathname.startsWith('/tools/')) {
      const parts = pathname.replace('/tools/', '').split('/').filter(Boolean);
      if (parts.length === 1) {
        const slug = parts[0];
        const match = toolsList.find(t => t.slug === slug || t.id === slug);
        if (match) {
          setSelectedTool(match);
          setCurrentView('catalog');
          return;
        }
        const isCat = CATEGORY_HUBS_CONFIG.some(c => c.slug === slug) || toolsList.some(t => t.category === slug);
        if (isCat) {
          setActiveCategory(slug);
          setSelectedTool(null);
          setCurrentView('catalog');
          return;
        }
      } else if (parts.length >= 2) {
        const toolSlug = parts[1];
        const match = toolsList.find(t => t.slug === toolSlug || t.id === toolSlug);
        if (match) {
          setSelectedTool(match);
          setCurrentView('catalog');
          return;
        }
      }
      setSelectedTool(null);
      setCurrentView('notfound');
      return;
    }

    if (pathname === '/about') { setSelectedTool(null); setCurrentView('about'); return; }
    if (pathname === '/contact') { setSelectedTool(null); setCurrentView('contact'); return; }
    if (pathname === '/guides') { setSelectedTool(null); setCurrentView('guides'); return; }
    if (pathname === '/privacy') { setSelectedTool(null); setCurrentView('privacy'); return; }
    if (pathname === '/terms') { setSelectedTool(null); setCurrentView('terms'); return; }
    if (pathname === '/disclaimer') { setSelectedTool(null); setCurrentView('disclaimer'); return; }
    if (pathname === '/admin') { setSelectedTool(null); setCurrentView('admin'); return; }

    // ✅ FIX FOR OLD WORDPRESS URLs (e.g. /hmac-generator, /css-formatter, ALL 330+ TOOLS)
    const cleanPath = pathname.replace(/^\//, ''); // Removes starting slash
    if (cleanPath && !cleanPath.includes('/')) {
      const match = toolsList.find(t => t.slug === cleanPath || t.id === cleanPath);
      if (match) {
        setSelectedTool(match);
        setCurrentView('catalog');
        // Auto-redirect URL to the new format so Google learns the new URL
        window.history.replaceState({}, '', `/tools/${match.slug}`);
        return;
      }
    }

    if (!hash && (!pathname || pathname === '/')) {
      setSelectedTool(null);
      setCurrentView('catalog');
    } else if (pathname !== '/') {
      setSelectedTool(null);
      setCurrentView('notfound');
    }
  };

  useEffect(() => {
    fetch('/assets/data/tools.json')
      .then(res => res.json())
      .then((data: ToolItem[]) => {
        const enhanced = applyAdminOverrides(data);
        setTools(enhanced);
        resolveLocationRoute(enhanced);
      })
      .catch(err => {
        console.warn('Fallback loading tools:', err);
      });
  }, []);

  // 2. Browser History Listener
  useEffect(() => {
    const handleNavigationEvent = () => {
      if (tools.length > 0) {
        resolveLocationRoute(tools);
      }
    };

    window.addEventListener('hashchange', handleNavigationEvent);
    window.addEventListener('popstate', handleNavigationEvent);
    return () => {
      window.removeEventListener('hashchange', handleNavigationEvent);
      window.removeEventListener('popstate', handleNavigationEvent);
    };
  }, [tools]);

  // 3. Theme management
  useEffect(() => {
    const stored = localStorage.getItem('ed_theme') as 'dark' | 'light';
    const initial = stored || (window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark');
    setTheme(initial);
    document.documentElement.setAttribute('data-theme', initial);
  }, []);

  // 4. Real Client-Side Analytics Tracking
  useEffect(() => {
    if (currentView !== 'admin') {
      recordPageView(currentView);
    }
  }, [currentView]);

  useEffect(() => {
    const q = searchQuery.trim();
    if (q.length >= 2) {
      const timer = setTimeout(() => {
        recordSearchQuery(q);
      }, 750);
      return () => clearTimeout(timer);
    }
  }, [searchQuery]);

  const toggleAppTheme = () => {
    const next = theme === 'dark' ? 'light' : 'dark';
    setTheme(next);
    localStorage.setItem('ed_theme', next);
    document.documentElement.setAttribute('data-theme', next);
  };

  const triggerToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 2500);
  };

  // Keyboard shortcut '/' to focus search, Escape to close
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === 'A' || e.key === 'a')) {
        e.preventDefault();
        handleNavigateView('admin');
        return;
      }

      if (e.key === '/' && document.activeElement?.tagName !== 'INPUT' && document.activeElement?.tagName !== 'TEXTAREA') {
        e.preventDefault();
        if (headerSearchInputRef.current) {
          headerSearchInputRef.current.focus();
          setSearchFocused(true);
        } else if (catalogSearchInputRef.current) {
          catalogSearchInputRef.current.focus();
        }
      } else if (e.key === 'Escape') {
        setSearchFocused(false);
        setSearchHighlightIndex(-1);
      }
    };

    const handleClickOutside = (e: MouseEvent) => {
      if (
        searchDropdownRef.current &&
        !searchDropdownRef.current.contains(e.target as Node) &&
        headerSearchInputRef.current &&
        !headerSearchInputRef.current.contains(e.target as Node)
      ) {
        setSearchFocused(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // 4. Hero Quick Tool Execution
  useEffect(() => {
    async function runHero() {
      try {
        if (!heroInput && heroTab !== 'password') {
          setHeroOutput('');
          return;
        }
        if (heroTab === 'base64') {
          setHeroOutput(engines.base64Encode(heroInput));
        } else if (heroTab === 'url') {
          setHeroOutput(engines.urlEncode(heroInput));
        } else if (heroTab === 'hash') {
          const h = await engines.computeSubtleHash(heroInput, 'SHA-256');
          setHeroOutput(h);
        } else if (heroTab === 'password') {
          setHeroOutput(engines.generatePassword(24).password);
        }
      } catch (e: any) {
        setHeroOutput(`Error: ${e.message}`);
      }
    }
    runHero();
  }, [heroInput, heroTab]);

  // Navigate to a specific separate tool using clean URLs
  const handleSelectTool = (tool: ToolItem) => {
    setSelectedTool(tool);
    setCurrentView('catalog');
    setMobileMenuOpen(false);
    window.history.pushState({}, '', `/tools/${tool.slug}`);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Back to All Tools catalog using clean URLs
  const handleBackToCatalog = () => {
    setSelectedTool(null);
    setCurrentView('catalog');
    setMobileMenuOpen(false);
    window.history.pushState({}, '', '/');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Navigate to any page view using clean URLs
  const handleNavigateView = (view: AppView) => {
    setSelectedTool(null);
    setCurrentView(view);
    setMobileMenuOpen(false);
    if (view === 'catalog') {
      window.history.pushState({}, '', '/');
    } else {
      window.history.pushState({}, '', `/${view}`);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Select tool by slug (e.g. from guides or footer)
  const handleSelectToolBySlug = (slug: string) => {
    const t = tools.find(item => item.slug === slug || item.id === slug);
    if (t) {
      handleSelectTool(t);
    } else {
      handleBackToCatalog();
    }
  };

  // Category counts
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    tools.forEach(t => {
      counts[t.category] = (counts[t.category] || 0) + 1;
    });
    return counts;
  }, [tools]);

  // Filtered tools by search and category
  const filteredTools = useMemo(() => {
    if (!searchQuery.trim()) {
      if (activeCategory === 'all') return tools;
      return tools.filter(t => t.category === activeCategory);
    }
    return searchTools(tools, searchQuery, 'all');
  }, [tools, activeCategory, searchQuery]);

  // Top search quick matches for live header dropdown
  const searchQuickMatches = useMemo(() => {
    if (!searchQuery.trim()) return [];
    return searchTools(tools, searchQuery, 'all').slice(0, 10);
  }, [tools, searchQuery]);

  // Handle keyboard navigation in search dropdown
  const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!searchQuickMatches.length) return;
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSearchHighlightIndex(prev => (prev + 1) % searchQuickMatches.length);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSearchHighlightIndex(prev => (prev - 1 + searchQuickMatches.length) % searchQuickMatches.length);
    } else if (e.key === 'Enter') {
      e.preventDefault();
      const targetTool = searchHighlightIndex >= 0 && searchHighlightIndex < searchQuickMatches.length
        ? searchQuickMatches[searchHighlightIndex]
        : searchQuickMatches[0];
      if (targetTool) {
        handleSelectTool(targetTool);
        setSearchQuery('');
        setSearchFocused(false);
        setSearchHighlightIndex(-1);
      }
    } else if (e.key === 'Escape') {
      setSearchFocused(false);
      setSearchHighlightIndex(-1);
    }
  };

  return (
    <div className="site-wrapper min-h-screen flex flex-col theme-canvas selection:bg-blue-500 selection:text-white">
      {/* Toast Notification */}
      {toastMsg && (
        <div className="toast fixed bottom-6 right-6 z-50 bg-[#2E9BFF] text-white px-4 py-2.5 rounded-lg shadow-xl font-medium text-xs flex items-center gap-2 animate-fade-in border border-white/20">
          <Check size={16} />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Semantic Sticky Header */}
      <header className="site-header sticky top-0 z-40 theme-header" id="main-header">
        <div className="container flex items-center justify-between py-3 gap-2 sm:gap-4">
          {/* Logo & Brand */}
          <button 
            onClick={handleBackToCatalog}
            className="flex items-center gap-2 sm:gap-2.5 group text-left cursor-pointer shrink-0"
          >
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-[#2E9BFF] group-hover:border-[#2E9BFF] transition duration-200">
              <Shield size={18} className="sm:w-5 sm:h-5" />
            </div>
            <div>
              <span className="font-extrabold text-sm sm:text-base tracking-tight text-[var(--text-primary)] flex items-center gap-1">
                EncryptDecrypt<span className="text-[#2E9BFF]">.org</span>
              </span>
              <span className="text-[9px] sm:text-[10px] text-[var(--text-muted)] font-mono hidden xs:block">
                100% Client-Side Privacy
              </span>
            </div>
          </button>

          {/* Header Search Box */}
          <div className="relative flex-1 max-w-xs sm:max-w-md mx-1 sm:mx-4" ref={searchDropdownRef}>
            <div className="flex items-center gap-1.5 w-full">
              <div 
                className="hidden xs:flex shrink-0 items-center justify-center w-8 h-8 rounded-lg bg-[var(--bg-surface)] border border-[var(--border-subtle)] text-[#2E9BFF] shadow-xs"
                title="Search Tools"
              >
                <Search size={15} />
              </div>
              <div className="relative flex-1 flex items-center">
                <input
                  ref={headerSearchInputRef}
                  type="text"
                  value={searchQuery}
                  onFocus={() => setSearchFocused(true)}
                  onKeyDown={handleSearchKeyDown}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setSearchFocused(true);
                    setSearchHighlightIndex(-1);
                  }}
                  placeholder="Search all 330+ tools (Press '/' to focus)..."
                  className="w-full h-9 bg-[var(--bg-input)] border border-[var(--border-subtle)] rounded-lg px-3 pr-9 text-xs text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:border-[#2E9BFF] focus:ring-1 focus:ring-[#2E9BFF] transition leading-normal"
                  id="global-search-input"
                />
                <div className="absolute inset-y-0 right-0 pr-2.5 flex items-center">
                  {searchQuery ? (
                    <button
                      onClick={() => {
                        setSearchQuery('');
                        setSearchHighlightIndex(-1);
                        if (headerSearchInputRef.current) headerSearchInputRef.current.focus();
                      }}
                      className="text-[var(--text-muted)] hover:text-[var(--text-primary)] cursor-pointer p-1 rounded-md transition flex items-center justify-center"
                      title="Clear search"
                    >
                      <X size={14} />
                    </button>
                  ) : (
                    <kbd className="hidden md:flex items-center justify-center h-5 min-w-[20px] px-1.5 text-[10px] font-mono text-[var(--text-muted)] bg-[var(--bg-surface-hover)] border border-[var(--border-subtle)] rounded pointer-events-none select-none">
                      /
                    </kbd>
                  )}
                </div>
              </div>
            </div>

            {/* Instant Live Search Results Dropdown */}
            {searchFocused && searchQuery.trim().length > 0 && (
              <div className="absolute left-0 right-0 top-full mt-1.5 bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-xl shadow-2xl overflow-hidden z-50 max-h-96 overflow-y-auto divide-y divide-[var(--border-subtle)]">
                <div className="p-2.5 text-[11px] font-mono text-[var(--text-muted)] bg-[var(--bg-surface-hover)] flex items-center justify-between">
                  <span className="font-semibold text-[var(--text-secondary)]">
                    Found {filteredTools.length} tools across all categories
                  </span>
                  <span className="text-[10px]">↑↓ navigate · Enter to open</span>
                </div>

                {searchQuickMatches.length === 0 ? (
                  <div className="p-4 text-center text-xs text-[var(--text-muted)]">
                    <p className="font-semibold text-[var(--text-secondary)] mb-1">
                      No tools found matching &ldquo;{searchQuery}&rdquo;
                    </p>
                    <p className="text-[11px]">Try searching for base64, sha256, aes, qr, chmod, uuid, jwt</p>
                  </div>
                ) : (
                  searchQuickMatches.map((tool, idx) => {
                    const isHighlighted = idx === searchHighlightIndex;
                    return (
                      <button
                        key={tool.id}
                        onClick={() => {
                          handleSelectTool(tool);
                          setSearchQuery('');
                          setSearchFocused(false);
                          setSearchHighlightIndex(-1);
                        }}
                        onMouseEnter={() => setSearchHighlightIndex(idx)}
                        className={`w-full text-left p-3 transition flex items-center justify-between group cursor-pointer ${
                          isHighlighted ? 'bg-blue-500/15 border-l-2 border-[#2E9BFF]' : 'hover:bg-[var(--bg-surface-hover)]'
                        }`}
                      >
                        <div className="pr-2 overflow-hidden">
                          <span className={`text-xs font-bold block truncate ${
                            isHighlighted ? 'text-[#2E9BFF]' : 'text-[var(--text-primary)] group-hover:text-[#2E9BFF]'
                          }`}>
                            {tool.name}
                          </span>
                          <span className="text-[11px] text-[var(--text-muted)] line-clamp-1">
                            {tool.shortDesc}
                          </span>
                        </div>
                        <div className="flex items-center gap-1.5 shrink-0 ml-2">
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-500/10 text-[#2E9BFF] border border-blue-500/20 whitespace-nowrap">
                            {tool.categoryName}
                          </span>
                        </div>
                      </button>
                    );
                  })
                )}

                {filteredTools.length > searchQuickMatches.length && (
                  <div className="p-2 bg-[var(--bg-surface-hover)] text-center">
                    <button
                      onClick={() => {
                        setSearchFocused(false);
                        const el = document.getElementById('catalog-grid');
                        if (el) el.scrollIntoView({ behavior: 'smooth' });
                      }}
                      className="text-xs font-semibold text-[#2E9BFF] hover:underline cursor-pointer"
                    >
                      View all {filteredTools.length} results in catalog below ↓
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
            <button
              onClick={handleBackToCatalog}
              className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
                !selectedTool && currentView === 'catalog'
                  ? 'text-[#2E9BFF] bg-blue-500/10'
                  : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-surface-hover)]'
              }`}
            >
              Home
            </button>
            <button
              onClick={() => {
                handleNavigateView('catalog');
                setTimeout(() => {
                  const el = document.getElementById('catalog-grid');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }, 50);
              }}
              className="px-2.5 py-1.5 rounded-lg text-xs font-semibold text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-surface-hover)] transition cursor-pointer"
            >
              All Tools ({tools.length || '300+'})
            </button>
            <button
              onClick={() => handleNavigateView('guides')}
              className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
                currentView === 'guides'
                  ? 'text-[#2E9BFF] bg-blue-500/10'
                  : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-surface-hover)]'
              }`}
            >
              Tech Guides
            </button>
            <button
              onClick={() => handleNavigateView('about')}
              className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
                currentView === 'about'
                  ? 'text-[#2E9BFF] bg-blue-500/10'
                  : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-surface-hover)]'
              }`}
            >
              About Us
            </button>
            <button
              onClick={() => handleNavigateView('contact')}
              className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
                currentView === 'contact'
                  ? 'text-[#2E9BFF] bg-blue-500/10'
                  : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-surface-hover)]'
              }`}
            >
              Contact Us
            </button>
          </nav>

          {/* Action Controls */}
          <div className="flex items-center gap-2">
            <a
              href="https://www.buymeacoffee.com/encryptdecrypt" 
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-lg bg-[#FFDD00] text-black font-bold text-[11px] sm:text-xs hover:bg-[#FFEA4C] transition shadow-sm border border-[#E5C700] cursor-pointer"
              title="Support this free project"
            >
              <span className="text-base leading-none">☕</span>
              <span className="hidden sm:inline tracking-tight text-black">Buy me a coffee</span>
            </a>

            <button
              onClick={toggleAppTheme}
              className="p-2 rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-surface)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:border-[var(--accent)] transition cursor-pointer flex items-center gap-1.5 shadow-sm"
              title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
              id="theme-toggle-btn"
            >
              {theme === 'dark' ? (
                <>
                  <Sun size={16} className="text-amber-400" />
                  <span className="text-[11px] font-medium hidden xl:inline text-slate-300">Light</span>
                </>
              ) : (
                <>
                  <Moon size={16} className="text-[#0284C7]" />
                  <span className="text-[11px] font-medium hidden xl:inline text-slate-700">Dark</span>
                </>
              )}
            </button>

            <button
              onClick={() => setMobileMenuOpen(prev => !prev)}
              className="p-2 rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-surface)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] lg:hidden cursor-pointer"
              title="Toggle Menu"
            >
              {mobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-[var(--border-subtle)] bg-[var(--bg-surface)] px-4 py-3 space-y-1 shadow-lg">
            <button
              onClick={handleBackToCatalog}
              className="w-full text-left px-3 py-2 rounded-lg text-xs font-semibold text-[var(--text-primary)] hover:bg-[var(--bg-surface-hover)] flex items-center justify-between cursor-pointer"
            >
              <span>Home</span>
              <ChevronRight size={14} className="text-[var(--text-muted)]" />
            </button>
            <button
              onClick={() => {
                handleNavigateView('catalog');
                setTimeout(() => {
                  const el = document.getElementById('catalog-grid');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }, 50);
              }}
              className="w-full text-left px-3 py-2 rounded-lg text-xs font-semibold text-[var(--text-primary)] hover:bg-[var(--bg-surface-hover)] flex items-center justify-between cursor-pointer"
            >
              <span>All 300+ Tools Catalog</span>
              <ChevronRight size={14} className="text-[var(--text-muted)]" />
            </button>
            <button
              onClick={() => handleNavigateView('guides')}
              className="w-full text-left px-3 py-2 rounded-lg text-xs font-semibold text-[var(--text-primary)] hover:bg-[var(--bg-surface-hover)] flex items-center justify-between cursor-pointer"
            >
              <span>Tech Guides & Cryptography Docs</span>
              <ChevronRight size={14} className="text-[var(--text-muted)]" />
            </button>
            <button
              onClick={() => handleNavigateView('about')}
              className="w-full text-left px-3 py-2 rounded-lg text-xs font-semibold text-[var(--text-primary)] hover:bg-[var(--bg-surface-hover)] flex items-center justify-between cursor-pointer"
            >
              <span>About Us & Zero-Knowledge Architecture</span>
              <ChevronRight size={14} className="text-[var(--text-muted)]" />
            </button>
            <button
              onClick={() => handleNavigateView('contact')}
              className="w-full text-left px-3 py-2 rounded-lg text-xs font-semibold text-[var(--text-primary)] hover:bg-[var(--bg-surface-hover)] flex items-center justify-between cursor-pointer"
            >
              <span>Contact Us & Technical Support</span>
              <ChevronRight size={14} className="text-[var(--text-muted)]" />
            </button>
            <div className="pt-2 border-t border-[var(--border-subtle)] flex items-center justify-around text-xs text-[var(--text-muted)]">
              <button onClick={() => handleNavigateView('privacy')} className="hover:text-[#2E9BFF] cursor-pointer py-1">Privacy</button>
              <span>·</span>
              <button onClick={() => handleNavigateView('terms')} className="hover:text-[#2E9BFF] cursor-pointer py-1">Terms</button>
              <span>·</span>
              <button onClick={() => handleNavigateView('disclaimer')} className="hover:text-[#2E9BFF] cursor-pointer py-1">Disclaimer</button>
            </div>
          </div>
        )}
      </header>

      {/* Main Container */}
      <main className="container flex-1 py-6" id="main-content">
        <Suspense fallback={
          <div className="flex flex-col items-center justify-center min-h-[50vh] text-[var(--text-muted)] gap-3">
            <RefreshCw size={24} className="animate-spin text-[#2E9BFF]" />
            <span className="text-sm font-semibold">Loading Workspace...</span>
          </div>
        }>
          {selectedTool ? (
            /* Separate Dedicated Tool View */
            <ToolWorkspace 
              tool={selectedTool}
              allTools={tools}
              onBack={handleBackToCatalog}
              onSelectTool={handleSelectTool}
            />
          ) : currentView === 'admin' ? (
            <>
              <SeoHead
                title="Admin Control Panel | EncryptDecrypt.org"
                description="Administrator control panel and site management settings."
                noIndex={true}
              />
              <AdminPanel 
                tools={tools}
                onCloseAdmin={handleBackToCatalog}
                onRefreshToolsCatalog={reloadToolsCatalog}
              />
            </>
          ) : currentView === 'about' ? (
            <>
              <SeoHead
                title="About Us & Zero-Knowledge Architecture | EncryptDecrypt.org"
                description="Learn about EncryptDecrypt.org's mission: providing 330+ enterprise-grade, browser-native developer utilities with 100% client-side privacy via the W3C Web Cryptography API."
                canonicalUrl="https://encryptdecrypt.org/about"
                ogType="article"
              />
              <AboutPage 
                onNavigateHome={handleBackToCatalog}
                onNavigateContact={() => handleNavigateView('contact')}
                onNavigateGuides={() => handleNavigateView('guides')}
              />
            </>
          ) : currentView === 'contact' ? (
            <>
              <SeoHead
                title="Contact Us & Engineering Support | EncryptDecrypt.org"
                description="Get in touch with the EncryptDecrypt.org engineering team. Inquire about cryptographic specifications, report edge cases, or suggest developer utilities."
                canonicalUrl="https://encryptdecrypt.org/contact"
              />
              <ContactPage 
                onNavigateHome={handleBackToCatalog}
                showToast={triggerToast}
              />
            </>
          ) : currentView === 'guides' ? (
            <>
              <SeoHead
                title="Technical Guides & Cryptography Specifications | EncryptDecrypt.org"
                description="Explore in-depth technical documentation, NIST FIPS guidelines, RFC standards, and code examples for AES-GCM, RSA, SHA-2, SHA-3, and zero-knowledge data pipelines."
                canonicalUrl="https://encryptdecrypt.org/guides"
              />
              <TechGuidesPage 
                onNavigateHome={handleBackToCatalog}
                onSelectToolBySlug={handleSelectToolBySlug}
              />
            </>
          ) : currentView === 'privacy' ? (
            <>
              <SeoHead
                title="Privacy Policy & Zero-Telemetry Architecture | EncryptDecrypt.org"
                description="Read our zero-telemetry privacy policy. EncryptDecrypt.org operates strictly inside your web browser. No plaintexts, keys, or passwords ever leave your machine."
                canonicalUrl="https://encryptdecrypt.org/privacy"
              />
              <PrivacyPage 
                onNavigateHome={handleBackToCatalog}
                onNavigateContact={() => handleNavigateView('contact')}
              />
            </>
          ) : currentView === 'terms' ? (
            <>
              <SeoHead
                title="Terms of Service | EncryptDecrypt.org"
                description="Review the terms of service governing usage of EncryptDecrypt.org developer utilities and client-side cryptographic functions."
                canonicalUrl="https://encryptdecrypt.org/terms"
              />
              <TermsPage 
                onNavigateHome={handleBackToCatalog}
                onNavigateContact={() => handleNavigateView('contact')}
              />
            </>
          ) : currentView === 'disclaimer' ? (
            <>
              <SeoHead
                title="Cryptographic Disclaimer & Compliance | EncryptDecrypt.org"
                description="Operational limits, security guidelines, and cryptographic compliance disclaimers for EncryptDecrypt.org."
                canonicalUrl="https://encryptdecrypt.org/disclaimer"
              />
              <DisclaimerPage 
                onNavigateHome={handleBackToCatalog}
                onNavigateContact={() => handleNavigateView('contact')}
              />
            </>
          ) : currentView === 'notfound' ? (
            <NotFoundPage 
              tools={tools}
              onNavigateHome={handleBackToCatalog}
              onSelectToolBySlug={handleSelectToolBySlug}
            />
          ) : (
            /* Homepage Catalog View */
            <div>
              <SeoHead
                title={activeCategory !== 'all'
                  ? `${CATEGORY_HUBS_CONFIG.find(c => c.slug === activeCategory)?.name || activeCategory} Tools | EncryptDecrypt.org`
                  : "EncryptDecrypt.org | 330+ Free Online Cryptography, Encoding & Developer Tools"
                }
                description={activeCategory !== 'all'
                  ? `Explore free client-side ${CATEGORY_HUBS_CONFIG.find(c => c.slug === activeCategory)?.name || activeCategory} developer utilities. 100% private, zero server transmissions, WebCrypto API powered.`
                  : "Free, client-side cryptography, encoding, decoding, hash generation, and developer tools. 100% private and offline-capable via the W3C Web Cryptography API."
                }
                canonicalUrl={activeCategory !== 'all'
                  ? `https://encryptdecrypt.org/tools/${activeCategory}/`
                  : "https://encryptdecrypt.org/"
                }
                keywords={['cryptography', 'base64', 'aes-256', 'sha-256', 'jwt debugger', 'developer tools', 'web crypto']}
                schemas={[
                  {
                    '@context': 'https://schema.org',
                    '@type': 'WebSite',
                    'name': 'EncryptDecrypt.org',
                    'url': 'https://encryptdecrypt.org/',
                    'description': 'Free client-side developer security, encryption, hashing, and encoding tools.',
                    'potentialAction': {
                      '@type': 'SearchAction',
                      'target': {
                        '@type': 'EntryPoint',
                        'urlTemplate': 'https://encryptdecrypt.org/#search={search_term_string}'
                      },
                      'query-input': 'required name=search_term_string'
                    }
                  }
                ]}
              />

              {/* Hero Quick Access Runner */}
              <div className="card-glass p-6 sm:p-10 mb-10 relative overflow-hidden">
                <div className="absolute -right-10 -bottom-10 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl pointer-events-none"></div>

                <div className="max-w-3xl mb-6">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-[#2E9BFF] text-xs font-mono mb-3">
                    <ShieldCheck size={14} />
                    <span>NIST & RFC Compliant · {tools.length || 330}+ Separate Developer Utilities</span>
                  </div>
                  <h1 className="text-3xl sm:text-4xl font-extrabold text-[var(--text-primary)] tracking-tight leading-tight">
                    Free Client-Side Cryptography, Encoding & Developer Tools
                  </h1>
                  <p className="text-[var(--text-secondary)] text-sm sm:text-base mt-2 leading-relaxed">
                    Every tool runs 100% inside your web browser via the W3C Web Cryptography API. Nothing is ever transmitted to a server. Click on any of the <strong>{tools.length || 330}+ separate tools</strong> below to open its dedicated workspace.
                  </p>
                </div>

                <div className="theme-subcard rounded-xl p-4 sm:p-6 shadow-xl">
                  <div className="flex flex-wrap items-center justify-between gap-3 mb-4 pb-3 border-b border-[var(--border-subtle)]">
                    <div className="flex items-center gap-1 bg-[var(--bg-input)] p-1 rounded-lg border border-[var(--border-subtle)] text-xs">
                      {(['base64', 'url', 'hash', 'password'] as const).map(tab => (
                        <button
                          key={tab}
                          onClick={() => setHeroTab(tab)}
                          className={`px-3 py-1 rounded font-semibold capitalize transition ${heroTab === tab ? 'bg-[#2E9BFF] text-white' : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'}`}
                        >
                          {tab === 'hash' ? 'SHA-256' : tab === 'password' ? 'Password Gen' : tab.toUpperCase()}
                        </button>
                      ))}
                    </div>

                    <span className="text-xs font-mono text-emerald-500 flex items-center gap-1 font-semibold">
                      <ShieldCheck size={14} /> Instant Client-Side Preview
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <div className="flex items-center justify-between mb-1.5 text-xs">
                        <label className="font-semibold text-[var(--text-secondary)]">Input String</label>
                        <span className="text-[var(--text-muted)] font-mono">{heroInput.length} chars</span>
                      </div>
                      <textarea
                        value={heroInput}
                        onChange={e => setHeroInput(e.target.value)}
                        placeholder="Enter string payload..."
                        className="form-input w-full font-mono text-xs"
                        rows={4}
                      />
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-1.5 text-xs">
                        <label className="font-semibold text-[var(--text-secondary)]">Live Result</label>
                        <button
                          onClick={() => {
                            navigator.clipboard.writeText(heroOutput);
                            setHeroCopied(true);
                            triggerToast('Copied to clipboard!');
                            setTimeout(() => setHeroCopied(false), 2000);
                          }}
                          className="text-xs font-semibold text-[#2E9BFF] hover:underline flex items-center gap-1 cursor-pointer"
                        >
                          {heroCopied ? <Check size={12} /> : <Copy size={12} />}
                          {heroCopied ? 'Copied' : 'Copy'}
                        </button>
                      </div>
                      <textarea
                        value={heroOutput}
                        readOnly
                        placeholder="Output calculation..."
                        className="form-textarea-output form-input w-full font-mono text-xs"
                        rows={4}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Dedicated Hubs Section */}
              <div className="my-8" id="category-hubs">
                <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
                  <div>
                    <h2 className="text-xl font-bold text-[var(--text-primary)] flex items-center gap-2 m-0">
                      <Layers size={22} className="text-[#2E9BFF]" />
                      Browse Categories
                    </h2>
                    <p className="text-xs text-[var(--text-muted)] mt-1">
                      Select any hub to view its dedicated utilities, or click directly on any tool below.
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    {activeCategory !== 'all' && (
                      <button
                        onClick={() => setActiveCategory('all')}
                        className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-blue-500/20 text-[#2E9BFF] border border-blue-500/30 hover:bg-blue-500/30 transition flex items-center gap-1.5 cursor-pointer"
                      >
                        <X size={14} /> Clear Filter (Show All {tools.length || '330'})
                      </button>
                    )}
                    <span className="text-xs text-[var(--text-muted)] font-mono bg-[var(--bg-surface)] px-2.5 py-1 rounded-md border border-[var(--border-subtle)]">
                      {filteredTools.length} of {tools.length || '330'} Tools
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-3 mb-6">
                  {CATEGORY_HUBS_CONFIG.map(hub => {
                    const Icon = hub.icon;
                    const isActive = activeCategory === hub.slug;
                    const count = categoryCounts[hub.slug] || hub.count;

                    return (
                      <button
                        key={hub.slug}
                        onClick={() => {
                          setActiveCategory(isActive ? 'all' : hub.slug);
                          const el = document.getElementById('catalog-grid');
                          if (el) el.scrollIntoView({ behavior: 'smooth' });
                        }}
                        className={`p-3 rounded-xl text-left transition flex flex-col justify-between border cursor-pointer group shadow-sm ${
                          isActive
                            ? 'bg-blue-600/15 border-[#2E9BFF] shadow-md ring-1 ring-[#2E9BFF]'
                            : 'bg-[var(--bg-surface)] border-[var(--border-subtle)] hover:border-[var(--accent)] hover:bg-[var(--bg-surface-hover)]'
                        }`}
                      >
                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <div className={`p-1.5 rounded-lg ${isActive ? 'bg-[#2E9BFF] text-white' : 'bg-blue-500/10 text-[#2E9BFF] group-hover:bg-blue-500/20'}`}>
                              <Icon size={18} />
                            </div>
                            <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded ${
                              isActive ? 'bg-[#2E9BFF] text-white font-bold' : 'bg-[var(--bg-surface-hover)] text-[var(--text-muted)] border border-[var(--border-subtle)]'
                            }`}>
                              {count}
                            </span>
                          </div>
                          <h3 className={`text-xs font-bold leading-tight line-clamp-2 ${isActive ? 'text-[#2E9BFF]' : 'text-[var(--text-primary)] group-hover:text-[#2E9BFF]'}`}>
                            {hub.name}
                          </h3>
                        </div>
                        <span className="text-[10px] text-[var(--text-muted)] line-clamp-1 mt-2 font-mono">
                          {hub.desc.split(',')[0]}...
                        </span>
                      </button>
                    );
                  })}
                </div>

                <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-[var(--border-subtle)]">
                  <button
                    onClick={() => setActiveCategory('all')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer border ${
                      activeCategory === 'all'
                        ? 'bg-[#2E9BFF] text-white border-[#2E9BFF] shadow-sm'
                        : 'bg-[var(--bg-surface)] text-[var(--text-secondary)] border-[var(--border-subtle)] hover:border-[var(--accent)] hover:text-[var(--text-primary)]'
                    }`}
                  >
                    All Tools ({tools.length || '300+'})
                  </button>
                  {CATEGORY_HUBS_CONFIG.map(hub => (
                    <button
                      key={hub.slug}
                      onClick={() => setActiveCategory(hub.slug)}
                      className={`px-3 py-1.5 rounded-lg text-xs whitespace-nowrap transition cursor-pointer border flex items-center gap-1.5 ${
                        activeCategory === hub.slug
                          ? 'bg-[#2E9BFF] text-white border-[#2E9BFF] font-semibold shadow-sm'
                          : 'bg-[var(--bg-surface)] text-[var(--text-secondary)] border-[var(--border-subtle)] hover:border-[var(--accent)] hover:text-[var(--text-primary)]'
                      }`}
                    >
                      <span>{hub.name}</span>
                      <span className="text-[10px] opacity-75 font-mono">({categoryCounts[hub.slug] || hub.count})</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Tools Catalog Grid */}
              <div className="my-6" id="catalog-grid">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-4">
                  <div>
                    <h3 className="text-base font-bold text-[var(--text-primary)] flex items-center gap-2 m-0">
                      <Terminal size={17} className="text-[#2E9BFF]" />
                      {searchQuery.trim() 
                        ? `Search Results (${filteredTools.length} tools found)` 
                        : activeCategory === 'all' 
                        ? `All Utilities (${filteredTools.length})` 
                        : `${CATEGORY_HUBS_CONFIG.find(c => c.slug === activeCategory)?.name || activeCategory} (${filteredTools.length} tools)`}
                    </h3>
                    <span className="text-xs text-[var(--text-muted)] mt-0.5 block">
                      {searchQuery.trim()
                        ? `Showing results matching "${searchQuery}" across all 330+ utilities`
                        : 'Instant client-side execution · Click to open any isolated tool'}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 w-full md:w-80">
                    <div 
                      className="shrink-0 flex items-center justify-center w-8 h-8 rounded-lg bg-[var(--bg-surface)] border border-[var(--border-subtle)] text-[#2E9BFF] shadow-xs"
                      title="Search Catalog"
                    >
                      <Search size={15} />
                    </div>
                    <div className="relative flex-1 flex items-center">
                      <input
                        ref={catalogSearchInputRef}
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search 330+ tools (e.g. aes, qr, sha256)..."
                        className="w-full h-9 bg-[var(--bg-input)] border border-[var(--border-subtle)] rounded-lg px-3 pr-9 text-xs text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:border-[#2E9BFF] focus:ring-1 focus:ring-[#2E9BFF] transition leading-normal"
                        id="catalog-search-input"
                      />
                      {searchQuery && (
                        <div className="absolute inset-y-0 right-0 pr-2 flex items-center">
                          <button
                            onClick={() => setSearchQuery('')}
                            className="text-[var(--text-muted)] hover:text-[var(--text-primary)] p-1 cursor-pointer flex items-center justify-center transition"
                            title="Clear search"
                          >
                            <X size={14} />
                          </button>
                        </div>
                      )}
                    </div>
                    {searchQuery && (
                      <button
                        onClick={() => setSearchQuery('')}
                        className="h-9 text-xs px-2.5 rounded-lg bg-[var(--bg-surface-hover)] border border-[var(--border-subtle)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] whitespace-nowrap cursor-pointer transition flex items-center"
                      >
                        Clear
                      </button>
                    )}
                  </div>
                </div>

                {searchQuery.trim() && (
                  <div className="mb-4 p-3 rounded-xl bg-blue-500/10 border border-blue-500/20 flex flex-wrap items-center justify-between gap-2 text-xs">
                    <div className="flex items-center gap-2 text-[var(--text-primary)] font-medium">
                      <Search size={14} className="text-[#2E9BFF]" />
                      <span>
                        Searching all 330+ tools for: <strong className="text-[#2E9BFF]">&ldquo;{searchQuery}&rdquo;</strong> — <strong>{filteredTools.length}</strong> matching tools found
                      </span>
                    </div>
                    <button
                      onClick={() => setSearchQuery('')}
                      className="text-xs text-[#2E9BFF] hover:underline font-semibold cursor-pointer"
                    >
                      Reset Search (Show All)
                    </button>
                  </div>
                )}

                {filteredTools.length === 0 ? (
                  <div className="card-glass p-8 sm:p-12 text-center my-6 max-w-xl mx-auto rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] shadow-xs">
                    <div className="w-12 h-12 rounded-full bg-blue-500/10 border border-blue-500/20 text-[#2E9BFF] flex items-center justify-center mx-auto mb-3">
                      <Search size={24} />
                    </div>
                    <h4 className="text-base font-bold text-[var(--text-primary)] mb-1">
                      No tools found matching &ldquo;{searchQuery}&rdquo;
                    </h4>
                    <p className="text-xs text-[var(--text-secondary)] mb-5 max-w-md mx-auto">
                      Try searching for different keywords, acronyms, or click any of these popular tools below to launch them immediately:
                    </p>
                    <div className="flex flex-wrap items-center justify-center gap-2 mb-6">
                      {[
                        { name: 'Base64', query: 'base64' },
                        { name: 'AES-256', query: 'aes' },
                        { name: 'QR Code', query: 'qr' },
                        { name: 'SHA-256', query: 'sha256' },
                        { name: 'Chmod Calc', query: 'chmod' },
                        { name: 'UUID v4/v7', query: 'uuid' },
                        { name: 'JWT Debugger', query: 'jwt' },
                        { name: 'CSV to JSON', query: 'csv' },
                        { name: 'Password Gen', query: 'password' },
                        { name: 'Diff Checker', query: 'diff' },
                        { name: 'MD5 Hash', query: 'md5' },
                        { name: 'URL Encode', query: 'url' }
                      ].map(item => (
                        <button
                          key={item.name}
                          onClick={() => setSearchQuery(item.query)}
                          className="px-3 py-1.5 text-xs rounded-lg bg-[var(--bg-surface-hover)] border border-[var(--border-subtle)] text-[var(--text-secondary)] hover:text-[#2E9BFF] hover:border-[#2E9BFF]/40 cursor-pointer transition font-medium"
                        >
                          {item.name}
                        </button>
                      ))}
                    </div>
                    <button
                      onClick={() => {
                        setSearchQuery('');
                        setActiveCategory('all');
                      }}
                      className="btn btn-primary text-xs py-2 px-5 inline-flex items-center gap-1.5"
                    >
                      <RefreshCw size={14} /> View All 330+ Tools Catalog
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {filteredTools.map(tool => (
                      <div 
                        key={tool.id} 
                        onClick={() => handleSelectTool(tool)}
                        className="card-glass flex flex-col justify-between hover:-translate-y-1 hover:border-[#2E9BFF]/60 transition duration-200 cursor-pointer group shadow-sm bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-xl p-4"
                      >
                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-[11px] font-semibold px-2 py-0.5 rounded bg-blue-500/10 text-[#2E9BFF] border border-blue-500/20">
                              {tool.categoryName}
                            </span>
                            {tool.popular && (
                              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-500 border border-amber-500/20">
                                Popular
                              </span>
                            )}
                          </div>
                          <h3 className="text-sm font-bold text-[var(--text-primary)] group-hover:text-[#2E9BFF] transition mb-1.5 leading-snug">
                            {tool.name}
                          </h3>
                          <p className="text-xs text-[var(--text-muted)] line-clamp-2 leading-relaxed mb-3">
                            {tool.shortDesc}
                          </p>
                        </div>

                        <div className="pt-2 border-t border-[var(--border-subtle)] flex items-center justify-between">
                          <span className="text-[11px] text-[var(--text-muted)] font-mono">
                            {tool.inputType}
                          </span>
                          <span className="text-xs font-semibold text-[#2E9BFF] group-hover:translate-x-1 transition inline-flex items-center gap-1">
                            Open Tool →
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </Suspense>
      </main>

      {/* Semantic Footer */}
      <footer className="site-footer theme-header py-12" id="main-footer">
        <div className="container grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-8 text-xs text-[var(--text-muted)]">
          {/* Brand & Guarantee */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 text-[var(--text-primary)] font-bold text-sm mb-3">
              <Shield size={18} className="text-[#2E9BFF]" />
              <span>EncryptDecrypt.org</span>
            </div>
            <p className="leading-relaxed mb-3 text-[var(--text-secondary)]">
              Free, private, zero-log cryptographic tools and developer utilities. 330+ utilities executing 100% inside your web browser via standard Web Cryptography algorithms. Your data never touches a server.
            </p>
            <div className="flex flex-wrap gap-2 text-[11px] font-mono">
              <span className="px-2 py-1 rounded bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 font-semibold">
                100% Client-Side RAM
              </span>
              <span className="px-2 py-1 rounded bg-blue-500/10 text-[#2E9BFF] border border-blue-500/20">
                Zero Data Transmission
              </span>
            </div>
          </div>

          {/* Navigation & Documentation */}
          <div>
            <h4 className="font-bold text-[var(--text-primary)] uppercase tracking-wider mb-3">Site & Guides</h4>
            <ul className="space-y-2">
              <li>
                <button onClick={handleBackToCatalog} className="hover:text-[#2E9BFF] cursor-pointer transition">
                  Home (All Tools)
                </button>
              </li>
              <li>
                <button onClick={() => handleNavigateView('guides')} className="hover:text-[#2E9BFF] cursor-pointer transition">
                  Tech Guides
                </button>
              </li>
              <li>
                <button onClick={() => handleNavigateView('about')} className="hover:text-[#2E9BFF] cursor-pointer transition">
                  About Us
                </button>
              </li>
              <li>
                <button onClick={() => handleNavigateView('contact')} className="hover:text-[#2E9BFF] cursor-pointer transition">
                  Contact Us
                </button>
              </li>
              <li>
                <button onClick={() => handleNavigateView('privacy')} className="hover:text-[#2E9BFF] cursor-pointer transition">
                  Privacy Policy
                </button>
              </li>
            </ul>
          </div>

          {/* Popular Encoders */}
          <div>
            <h4 className="font-bold text-[var(--text-primary)] uppercase tracking-wider mb-3">Popular Encoders</h4>
            <ul className="space-y-2">
              <li><button onClick={() => handleSelectToolBySlug('base64-encode-decode')} className="hover:text-[#2E9BFF] cursor-pointer transition">Base64 Encode/Decode</button></li>
              <li><button onClick={() => handleSelectToolBySlug('url-encode-decode')} className="hover:text-[#2E9BFF] cursor-pointer transition">URL Encode/Decode</button></li>
              <li><button onClick={() => handleSelectToolBySlug('base16-hex-encode-decode')} className="hover:text-[#2E9BFF] cursor-pointer transition">Hex to Text</button></li>
              <li><button onClick={() => handleSelectToolBySlug('base58-encode-decode')} className="hover:text-[#2E9BFF] cursor-pointer transition">Base58 Bitcoin</button></li>
              <li><button onClick={() => handleSelectToolBySlug('qr-code-generator')} className="hover:text-[#2E9BFF] cursor-pointer transition">QR Code Generator</button></li>
            </ul>
          </div>

          {/* Security & Ciphers */}
          <div>
            <h4 className="font-bold text-[var(--text-primary)] uppercase tracking-wider mb-3">Security & Ciphers</h4>
            <ul className="space-y-2">
              <li><button onClick={() => handleSelectToolBySlug('aes-encryption-decryption')} className="hover:text-[#2E9BFF] cursor-pointer transition">AES-256-GCM Encrypt</button></li>
              <li><button onClick={() => handleSelectToolBySlug('sha-256-hash-generator')} className="hover:text-[#2E9BFF] cursor-pointer transition">SHA-256 Hash</button></li>
              <li><button onClick={() => handleSelectToolBySlug('md5-hash-generator')} className="hover:text-[#2E9BFF] cursor-pointer transition">MD5 Hash</button></li>
              <li><button onClick={() => handleSelectToolBySlug('jwt-token-debugger-generator')} className="hover:text-[#2E9BFF] cursor-pointer transition">JWT Debugger</button></li>
              <li><button onClick={() => handleSelectToolBySlug('secure-password-generator')} className="hover:text-[#2E9BFF] cursor-pointer transition">Password Generator</button></li>
            </ul>
          </div>
        </div>

        {/* Legal Bottom Bar */}
        <div className="container border-t border-[var(--border-subtle)] mt-8 pt-6 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-[var(--text-muted)]">
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-x-2.5 gap-y-1 font-medium">
            <span className="text-[var(--text-secondary)] font-semibold">© 2026 EncryptDecrypt.org</span>
            <span>|</span>
            <button onClick={() => handleNavigateView('privacy')} className="hover:text-[#2E9BFF] cursor-pointer transition">Privacy</button>
            <span>|</span>
            <button onClick={() => handleNavigateView('terms')} className="hover:text-[#2E9BFF] cursor-pointer transition">Terms</button>
            <span>|</span>
            <button onClick={() => handleNavigateView('disclaimer')} className="hover:text-[#2E9BFF] cursor-pointer transition">Disclaimer</button>
            <span>|</span>
            <button onClick={() => handleNavigateView('about')} className="hover:text-[#2E9BFF] cursor-pointer transition">About Us</button>
            <span>|</span>
            <button onClick={() => handleNavigateView('contact')} className="hover:text-[#2E9BFF] cursor-pointer transition">Contact Us</button>
          </div>

          <div className="flex items-center gap-4 font-mono text-[11px] shrink-0 text-[var(--text-muted)]">
            <span>RFC 4648</span>
            <span>NIST FIPS 197</span>
            <span>W3C WebCrypto</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
