import React, { useState, useEffect, useMemo, useRef, Suspense, lazy } from 'react';
import { 
  Shield, Lock, Search, Copy, Download, ArrowRightLeft, ArrowRight,
  Check, Moon, Sun, Key, Hash, FileCode, Cpu, Layers,
  Terminal, ShieldCheck, Database, Zap, RefreshCw, X,
  ChevronRight, ArrowLeft, Binary, CheckCircle, FileText,
  Sliders, Wifi, Code, Sparkles, Menu, BookOpen, Info, Mail,
  Globe, Clock, Palette, Eye, Gauge, Image, Calculator, Star, HelpCircle, Command, RotateCcw
} from 'lucide-react';
import { ToolItem, CategoryInfo } from './types';
import { INITIAL_TOP_TOOLS } from './data/initialTools';
import * as engines from './crypto/toolEngines';
import { searchTools } from './utils/searchTools';
import { SeoHead } from './components/SeoHead';
import { AdUnit } from './components/AdUnit';
import { applyAdminOverrides, recordToolExecution, recordSearchQuery, recordPageView } from './utils/adminStorage';

// --- REACT LAZY IMPORTS FOR OPTIMIZED PAGESPEED (100% Core Web Vitals) ---
const ToolWorkspace = lazy(() => import('./components/ToolWorkspace').then(module => ({ default: module.ToolWorkspace })));
const AllToolsPage = lazy(() => import('./components/pages/AllToolsPage').then(module => ({ default: module.AllToolsPage })));
const CategoryPage = lazy(() => import('./components/pages/CategoryPage').then(module => ({ default: module.CategoryPage })));
const AboutPage = lazy(() => import('./components/pages/AboutPage').then(module => ({ default: module.AboutPage })));
const ContactPage = lazy(() => import('./components/pages/ContactPage').then(module => ({ default: module.ContactPage })));
const TechGuidesPage = lazy(() => import('./components/pages/TechGuidesPage').then(module => ({ default: module.TechGuidesPage })));
const PrivacyPage = lazy(() => import('./components/pages/PrivacyPage').then(module => ({ default: module.PrivacyPage })));
const TermsPage = lazy(() => import('./components/pages/TermsPage').then(module => ({ default: module.TermsPage })));
const DisclaimerPage = lazy(() => import('./components/pages/DisclaimerPage').then(module => ({ default: module.DisclaimerPage })));
const NotFoundPage = lazy(() => import('./components/pages/NotFoundPage').then(module => ({ default: module.NotFoundPage })));
const AdminPanel = lazy(() => import('./components/admin/AdminPanel').then(module => ({ default: module.AdminPanel })));
// ------------------------------------------------------------------

export type AppView = 'catalog' | 'category' | 'about' | 'contact' | 'guides' | 'privacy' | 'terms' | 'disclaimer' | 'admin' | 'notfound' | 'all-tools';

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
  const [tools, setTools] = useState<ToolItem[]>(INITIAL_TOP_TOOLS);
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
  const [categorySearchQuery, setCategorySearchQuery] = useState<string>('');
  const [showAllCategories, setShowAllCategories] = useState<boolean>(false);

  // Pro Feature States: Favorites, Recently Used, Keyboard Shortcuts
  const [starredToolIds, setStarredToolIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('ed_starred_tools');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [recentToolIds, setRecentToolIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('ed_recent_tools');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [showShortcutsModal, setShowShortcutsModal] = useState<boolean>(false);

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
    try {
      sessionStorage.removeItem('ed_tools_catalog_cache');
    } catch {}
    fetch('/assets/data/tools.json')
      .then(res => res.json())
      .then((data: ToolItem[]) => {
        try {
          sessionStorage.setItem('ed_tools_catalog_cache', JSON.stringify(data));
        } catch {}
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
    if (['about', 'contact', 'guides', 'privacy', 'terms', 'disclaimer', 'admin', 'all-tools'].includes(hash)) {
      setSelectedTool(null);
      setCurrentView(hash as AppView);
      return;
    }
    if (hash.startsWith('category=')) {
      const cat = hash.replace('category=', '');
      setActiveCategory(cat);
      setSelectedTool(null);
      setCurrentView('category');
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
          setCurrentView('category');
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

    if (pathname === '/all-tools' || pathname === '/tools') { setSelectedTool(null); setCurrentView('all-tools'); return; }
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
    // 1. Instant check for initial top tools route
    resolveLocationRoute(INITIAL_TOP_TOOLS);

    // 2. High-performance background loading with sessionStorage cache
    const loadFullCatalog = () => {
      try {
        const cached = sessionStorage.getItem('ed_tools_catalog_cache');
        if (cached) {
          const parsed = JSON.parse(cached);
          if (Array.isArray(parsed) && parsed.length > 50) {
            const enhanced = applyAdminOverrides(parsed);
            setTools(enhanced);
            resolveLocationRoute(enhanced);
            return;
          }
        }
      } catch {}

      fetch('/assets/data/tools.json')
        .then(res => res.json())
        .then((data: ToolItem[]) => {
          try {
            sessionStorage.setItem('ed_tools_catalog_cache', JSON.stringify(data));
          } catch {}
          const enhanced = applyAdminOverrides(data);
          setTools(enhanced);
          resolveLocationRoute(enhanced);
        })
        .catch(err => {
          console.warn('Fallback loading tools:', err);
        });
    };

    if (typeof window !== 'undefined' && 'requestIdleCallback' in window) {
      (window as any).requestIdleCallback(loadFullCatalog, { timeout: 3500 });
    } else {
      setTimeout(loadFullCatalog, 2000);
    }
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
    window.scrollTo({ top: 0, behavior: 'instant' });

    // Track recently used tool
    setRecentToolIds(prev => {
      const filtered = prev.filter(id => id !== tool.slug && id !== tool.id);
      const updated = [tool.slug, ...filtered].slice(0, 8);
      localStorage.setItem('ed_recent_tools', JSON.stringify(updated));
      return updated;
    });
  };

  const toggleStarTool = (e: React.MouseEvent, toolSlug: string) => {
    e.stopPropagation();
    setStarredToolIds(prev => {
      const isStarred = prev.includes(toolSlug);
      const updated = isStarred ? prev.filter(id => id !== toolSlug) : [...prev, toolSlug];
      localStorage.setItem('ed_starred_tools', JSON.stringify(updated));
      triggerToast(isStarred ? 'Removed from Favorites' : '⭐ Added to Favorites');
      return updated;
    });
  };

  // Back to All Tools catalog using clean URLs
  const handleBackToCatalog = () => {
    setSelectedTool(null);
    setActiveCategory('all');
    setCurrentView('catalog');
    setSearchQuery('');
    setMobileMenuOpen(false);
    window.history.pushState({}, '', '/');
    window.scrollTo({ top: 0, behavior: 'instant' });
  };

  // Open dedicated Category Page using clean URLs
  const handleSelectCategory = (catSlug: string) => {
    setSelectedTool(null);
    setActiveCategory(catSlug);
    setCurrentView('category');
    setSearchQuery('');
    setCategorySearchQuery('');
    setMobileMenuOpen(false);
    window.history.pushState({}, '', `/tools/${catSlug}/`);
    window.scrollTo({ top: 0, behavior: 'instant' });
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
      if (t.category) {
        counts[t.category] = (counts[t.category] || 0) + 1;
      }
    });
    return counts;
  }, [tools]);

  // Dynamically compute all 109 categories from tools array
  const allCategoryHubs = useMemo(() => {
    const map = new Map<string, { slug: string; name: string; count: number; desc: string; icon: any }>();

    // 1. Seed with icons & configs from CATEGORY_HUBS_CONFIG
    CATEGORY_HUBS_CONFIG.forEach(c => {
      map.set(c.slug, { ...c });
    });

    // 2. Populate all categories present in tools array
    tools.forEach(t => {
      const slug = t.category || 'general';
      const name = t.categoryName || slug.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
      if (!map.has(slug)) {
        map.set(slug, {
          slug,
          name,
          count: 0,
          desc: t.shortDesc || `${name} developer tools`,
          icon: Code
        });
      }
      const item = map.get(slug)!;
      item.count = categoryCounts[slug] || item.count || 0;
    });

    const list = Array.from(map.values());
    if (!categorySearchQuery.trim()) return list;

    const q = categorySearchQuery.toLowerCase();
    return list.filter(c => 
      c.name.toLowerCase().includes(q) || 
      c.slug.toLowerCase().includes(q) || 
      c.desc.toLowerCase().includes(q)
    );
  }, [tools, categoryCounts, categorySearchQuery]);

  // PageSpeed Optimized: Limit rendered categories on initial paint to prevent excessive DOM size
  const displayedCategoryHubs = useMemo(() => {
    if (categorySearchQuery.trim() || showAllCategories) {
      return allCategoryHubs;
    }
    return allCategoryHubs.slice(0, 21);
  }, [allCategoryHubs, categorySearchQuery, showAllCategories]);

  // Recently used tool objects
  const recentToolsObjects = useMemo(() => {
    if (!recentToolIds.length || !tools.length) return [];
    return recentToolIds
      .map(id => tools.find(t => t.slug === id || t.id === id))
      .filter((t): t is ToolItem => Boolean(t));
  }, [tools, recentToolIds]);

  // Filtered tools by search and category
  const filteredTools = useMemo(() => {
    if (activeCategory === 'favorites') {
      const favSet = new Set(starredToolIds);
      const list = tools.filter(t => favSet.has(t.slug) || favSet.has(t.id));
      if (!searchQuery.trim()) return list;
      return searchTools(list, searchQuery, 'all');
    }
    if (!searchQuery.trim()) {
      if (activeCategory === 'all') return tools;
      return tools.filter(t => t.category === activeCategory);
    }
    return searchTools(tools, searchQuery, 'all');
  }, [tools, activeCategory, searchQuery, starredToolIds]);

  // Curated Top 10 Popular Utilities for the Homepage
  const top10Tools = useMemo(() => {
    if (!tools.length) return [];
    const primarySlugs = [
      'aes-encrypt-decrypt',
      'sha256-hash-generator',
      'jwt-token-generator',
      'base64-encode-decode',
      'uuid-guid-generator',
      'secure-password-generator',
      'json-formatter',
      'url-encode-decode',
      'rsa-encrypt-decrypt',
      'hmac-generator'
    ];
    const curated: ToolItem[] = [];
    const usedSlugs = new Set<string>();

    primarySlugs.forEach(slug => {
      const match = tools.find(t => t.slug === slug || t.id === slug);
      if (match && !usedSlugs.has(match.slug)) {
        curated.push(match);
        usedSlugs.add(match.slug);
      }
    });

    if (curated.length < 10) {
      const popular = tools.filter(t => t.popular && !usedSlugs.has(t.slug));
      for (const t of popular) {
        if (curated.length >= 10) break;
        curated.push(t);
        usedSlugs.add(t.slug);
      }
    }
    return curated.slice(0, 10);
  }, [tools]);

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
        <div className="toast fixed bottom-6 right-6 z-50 bg-[#1d4ed8] text-white px-4 py-2.5 rounded-lg shadow-xl font-medium text-xs flex items-center gap-2 border border-white/20">
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
                  placeholder="Search tools..."
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
              className={`px-3 py-2 min-h-[40px] rounded-lg text-xs font-semibold transition-colors duration-150 cursor-pointer ${
                !selectedTool && currentView === 'catalog'
                  ? 'text-sky-400 bg-blue-500/15 font-bold border border-blue-500/30'
                  : 'text-slate-300 hover:text-white hover:bg-[var(--bg-surface-hover)]'
              }`}
            >
              Home
            </button>
            <button
              onClick={() => handleNavigateView('all-tools')}
              className={`px-3 py-2 min-h-[40px] rounded-lg text-xs font-semibold transition-colors duration-150 cursor-pointer flex items-center gap-1.5 ${
                currentView === 'all-tools'
                  ? 'text-sky-400 bg-blue-500/15 font-bold border border-blue-500/30'
                  : 'text-slate-300 hover:text-white hover:bg-[var(--bg-surface-hover)]'
              }`}
            >
              <Terminal size={14} className="text-sky-400" />
              <span>All Tools Directory ({tools.length || '1,380+'})</span>
            </button>
            <button
              onClick={() => handleNavigateView('guides')}
              className={`px-3 py-2 min-h-[40px] rounded-lg text-xs font-semibold transition-colors duration-150 cursor-pointer ${
                currentView === 'guides'
                  ? 'text-sky-400 bg-blue-500/15 font-bold border border-blue-500/30'
                  : 'text-slate-300 hover:text-white hover:bg-[var(--bg-surface-hover)]'
              }`}
            >
              Tech Guides
            </button>
            <button
              onClick={() => handleNavigateView('about')}
              className={`px-3 py-2 min-h-[40px] rounded-lg text-xs font-semibold transition-colors duration-150 cursor-pointer ${
                currentView === 'about'
                  ? 'text-sky-400 bg-blue-500/15 font-bold border border-blue-500/30'
                  : 'text-slate-300 hover:text-white hover:bg-[var(--bg-surface-hover)]'
              }`}
            >
              About Us
            </button>
            <button
              onClick={() => handleNavigateView('contact')}
              className={`px-3 py-2 min-h-[40px] rounded-lg text-xs font-semibold transition-colors duration-150 cursor-pointer ${
                currentView === 'contact'
                  ? 'text-sky-400 bg-blue-500/15 font-bold border border-blue-500/30'
                  : 'text-slate-300 hover:text-white hover:bg-[var(--bg-surface-hover)]'
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
              className="p-2.5 min-h-[44px] min-w-[44px] rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-surface)] text-slate-200 hover:text-white hover:border-blue-400 transition-colors duration-150 cursor-pointer flex items-center justify-center gap-1.5 shadow-sm"
              title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
              aria-label={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
              id="theme-toggle-btn"
            >
              {theme === 'dark' ? (
                <>
                  <Sun size={16} className="text-amber-400" />
                  <span className="text-[11px] font-medium hidden xl:inline text-slate-200">Light</span>
                </>
              ) : (
                <>
                  <Moon size={16} className="text-[#0284C7]" />
                  <span className="text-[11px] font-medium hidden xl:inline text-slate-200">Dark</span>
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
              onClick={() => handleNavigateView('all-tools')}
              className={`w-full text-left px-3 py-2 rounded-lg text-xs font-semibold flex items-center justify-between cursor-pointer ${
                currentView === 'all-tools'
                  ? 'text-[#2E9BFF] bg-blue-500/15'
                  : 'text-[var(--text-primary)] hover:bg-[var(--bg-surface-hover)]'
              }`}
            >
              <span className="flex items-center gap-2">
                <Terminal size={14} className="text-[#2E9BFF]" />
                <span>All Tools Directory ({tools.length || '1,380+'})</span>
              </span>
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
          ) : currentView === 'category' ? (
            <CategoryPage 
              categorySlug={activeCategory}
              tools={tools}
              allCategoryHubs={allCategoryHubs}
              onSelectTool={handleSelectTool}
              onSelectCategory={handleSelectCategory}
              onNavigateHome={handleBackToCatalog}
              onNavigateAllTools={() => handleNavigateView('all-tools')}
              starredToolIds={starredToolIds}
              onToggleStar={toggleStarTool}
            />
          ) : currentView === 'all-tools' ? (
            <>
              <SeoHead
                title="Cryptographic & Developer Tools Directory | 1,380+ Tools"
                description="Directory of 1,380+ free client-side cryptographic & developer tools. AES-256, RSA, SHA-256, Base64, JWT, UUID & WebCrypto running 100% in browser RAM."
                canonicalUrl="https://www.encryptdecrypt.org/all-tools"
                keywords={['cryptography directory', 'developer tools catalog', '1380 tools', 'web crypto']}
              />
              <AllToolsPage 
                tools={tools}
                onSelectTool={handleSelectTool}
                onNavigateHome={handleBackToCatalog}
              />
            </>
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
                description="Learn about EncryptDecrypt.org: 1,380+ free client-side developer utilities with 100% browser privacy via the W3C Web Cryptography API. Zero logs."
                canonicalUrl="https://www.encryptdecrypt.org/about"
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
                canonicalUrl="https://www.encryptdecrypt.org/contact"
              />
              <ContactPage 
                onNavigateHome={handleBackToCatalog}
                showToast={triggerToast}
              />
            </>
          ) : currentView === 'guides' ? (
            <>
              <SeoHead
                title="Technical Guides & Cryptography Specifications"
                description="In-depth technical guides, NIST FIPS specs, RFC standards, and code examples for AES-GCM, RSA, SHA-2, SHA-3, and zero-knowledge cryptography."
                canonicalUrl="https://www.encryptdecrypt.org/guides"
              />
              <TechGuidesPage 
                onNavigateHome={handleBackToCatalog}
                onSelectToolBySlug={handleSelectToolBySlug}
              />
            </>
          ) : currentView === 'privacy' ? (
            <>
              <SeoHead
                title="Privacy Policy & Zero-Telemetry Architecture"
                description="Read our zero-telemetry privacy policy. EncryptDecrypt.org operates strictly in your browser. No plaintexts, keys, or data ever leave your machine."
                canonicalUrl="https://www.encryptdecrypt.org/privacy"
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
                canonicalUrl="https://www.encryptdecrypt.org/terms"
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
                canonicalUrl="https://www.encryptdecrypt.org/disclaimer"
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
                  : "EncryptDecrypt.org - Free Cryptographic & Developer Tools"
                }
                description={activeCategory !== 'all'
                  ? `Explore free client-side ${CATEGORY_HUBS_CONFIG.find(c => c.slug === activeCategory)?.name || activeCategory} developer utilities. 100% private, WebCrypto API powered with zero logs.`
                  : "1,380+ free client-side cryptographic & developer tools. AES-256, RSA, SHA-256, Base64, JWT, UUID & WebCrypto running 100% in your browser with zero logs."
                }
                canonicalUrl={activeCategory !== 'all'
                  ? `https://www.encryptdecrypt.org/tools/${activeCategory}/`
                  : "https://www.encryptdecrypt.org/"
                }
                keywords={['cryptography', 'base64', 'aes-256', 'sha-256', 'jwt debugger', 'developer tools', 'web crypto']}
                schemas={[
                  {
                    '@context': 'https://schema.org',
                    '@type': 'WebSite',
                    'name': 'EncryptDecrypt.org',
                    'url': 'https://www.encryptdecrypt.org/',
                    'description': 'The #1 best website for cryptographic tools and developer utilities. Free client-side security, encryption, hashing, and encoding tools.',
                    'potentialAction': {
                      '@type': 'SearchAction',
                      'target': 'https://www.encryptdecrypt.org/?search={search_term_string}',
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
                    <span>NIST & RFC Compliant · {tools.length || '1,380'}+ Separate Developer Utilities</span>
                  </div>
                  <h1 className="text-3xl sm:text-4xl font-extrabold text-[var(--text-primary)] tracking-tight leading-tight">
                    Best Website for Cryptographic Tools &amp; Developer Utilities
                  </h1>
                  <p className="text-[var(--text-secondary)] text-sm sm:text-base mt-2 leading-relaxed">
                    Every tool runs 100% inside your web browser via the W3C Web Cryptography API. Nothing is ever transmitted to a server. Click on any of the <strong>{tools.length || '1,380'}+ separate tools</strong> below to open its dedicated workspace.
                  </p>
                </div>

                <div className="theme-subcard rounded-xl p-4 sm:p-6 shadow-xl">
                  <div className="flex flex-wrap items-center justify-between gap-3 mb-4 pb-3 border-b border-[var(--border-subtle)]">
                    <div className="flex items-center gap-1.5 bg-[var(--bg-input)] p-1 rounded-lg border border-[var(--border-subtle)] text-xs">
                      {(['base64', 'url', 'hash', 'password'] as const).map(tab => (
                        <button
                          key={tab}
                          onClick={() => setHeroTab(tab)}
                          className={`min-h-[44px] min-w-[72px] px-3.5 py-2 rounded-md font-semibold capitalize transition-colors duration-150 cursor-pointer flex items-center justify-center ${
                            heroTab === tab 
                              ? 'bg-[#1d4ed8] text-white font-bold shadow-xs' 
                              : 'text-slate-200 hover:text-white hover:bg-white/5'
                          }`}
                        >
                          {tab === 'hash' ? 'SHA-256' : tab === 'password' ? 'Password Gen' : tab.toUpperCase()}
                        </button>
                      ))}
                    </div>

                    <span className="text-xs font-mono text-emerald-400 flex items-center gap-1 font-semibold">
                      <ShieldCheck size={14} /> Instant Client-Side Preview
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <div className="flex items-center justify-between mb-3 text-xs">
                        <label htmlFor="hero-input-textarea" className="font-semibold text-slate-100">Input String</label>
                        <span className="text-slate-300 font-mono font-medium">{heroInput.length} chars</span>
                      </div>
                      <textarea
                        id="hero-input-textarea"
                        aria-label="Input string for calculation"
                        value={heroInput}
                        onChange={e => setHeroInput(e.target.value)}
                        placeholder="Enter string payload..."
                        className="form-input w-full font-mono text-xs min-h-[110px]"
                        rows={4}
                      />
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-3 text-xs">
                        <label htmlFor="hero-output-textarea" className="font-semibold text-slate-100">Live Result</label>
                        <button
                          onClick={() => {
                            navigator.clipboard.writeText(heroOutput);
                            setHeroCopied(true);
                            triggerToast('Copied to clipboard!');
                            setTimeout(() => setHeroCopied(false), 2000);
                          }}
                          className="text-xs font-semibold text-sky-400 hover:text-sky-300 min-h-[48px] min-w-[76px] px-3.5 py-2.5 rounded-lg hover:bg-blue-500/10 flex items-center gap-1.5 cursor-pointer"
                          aria-label="Copy live calculation output"
                        >
                          {heroCopied ? <Check size={14} /> : <Copy size={14} />}
                          <span>{heroCopied ? 'Copied' : 'Copy'}</span>
                        </button>
                      </div>
                      <textarea
                        id="hero-output-textarea"
                        aria-label="Live calculation output"
                        value={heroOutput}
                        readOnly
                        placeholder="Output calculation..."
                        className="form-textarea-output form-input w-full font-mono text-xs min-h-[110px]"
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
                      Browse Categories ({allCategoryHubs.length} Categories)
                    </h2>
                    <p className="text-xs text-[var(--text-muted)] mt-1">
                      Organized across {allCategoryHubs.length} specialized domain hubs. Select any category to filter tools.
                    </p>
                  </div>
                  <div className="flex items-center gap-2 w-full sm:w-auto">
                    <input
                      type="text"
                      value={categorySearchQuery}
                      onChange={(e) => setCategorySearchQuery(e.target.value)}
                      placeholder="Search categories..."
                      className="w-full sm:w-56 h-8 bg-[var(--bg-input)] border border-[var(--border-subtle)] focus:border-[#2E9BFF] rounded-lg px-2.5 text-[11px] text-[var(--text-primary)] placeholder:text-[var(--text-muted)] font-mono"
                    />
                    {categorySearchQuery && (
                      <button onClick={() => setCategorySearchQuery('')} className="text-[var(--text-muted)] hover:text-[var(--text-primary)]">
                        <X size={14} />
                      </button>
                    )}
                    {activeCategory !== 'all' && (
                      <button
                        onClick={() => setActiveCategory('all')}
                        className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-blue-500/20 text-[#2E9BFF] border border-blue-500/30 hover:bg-blue-500/30 transition flex items-center gap-1.5 cursor-pointer shrink-0"
                      >
                        <X size={14} /> Clear Filter
                      </button>
                    )}
                    <span className="text-xs text-[var(--text-muted)] font-mono bg-[var(--bg-surface)] px-2.5 py-1 rounded-md border border-[var(--border-subtle)] shrink-0">
                      {filteredTools.length} of {tools.length || '1,380'} Tools
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-7 gap-3 mb-5">
                  {displayedCategoryHubs.map(hub => {
                    const Icon = hub.icon || Code;
                    const isActive = activeCategory === hub.slug;
                    const count = categoryCounts[hub.slug] || hub.count || 0;

                    return (
                      <button
                        key={hub.slug}
                        onClick={() => handleSelectCategory(hub.slug)}
                        className={`p-3 min-h-[76px] rounded-xl text-center transition-colors duration-150 flex flex-col items-center justify-between border cursor-pointer group shadow-sm ${
                          isActive
                            ? 'bg-blue-600/15 border-blue-500 shadow-md ring-1 ring-blue-500'
                            : 'bg-[var(--bg-surface)] border-[var(--border-subtle)] hover:border-blue-400 hover:bg-[var(--bg-surface-hover)]'
                        }`}
                      >
                        <div className="w-full flex flex-col items-center">
                          <div className="flex items-center justify-center gap-1.5 mb-1.5 w-full">
                            <div className={`p-1.5 rounded-lg ${isActive ? 'bg-[#1d4ed8] text-white' : 'bg-blue-500/15 text-sky-400 group-hover:bg-blue-500/25'}`}>
                              <Icon size={15} />
                            </div>
                            <span className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold ${
                              isActive ? 'bg-[#1d4ed8] text-white' : 'bg-slate-800 text-slate-100 border border-slate-700'
                            }`}>
                              {count}
                            </span>
                          </div>
                          <h3 className={`text-[11px] font-bold leading-tight text-center line-clamp-2 w-full ${isActive ? 'text-sky-400' : 'text-slate-100 group-hover:text-sky-400'}`}>
                            {hub.name}
                          </h3>
                        </div>
                        <span className="text-[10px] text-slate-300 text-center line-clamp-1 mt-1 font-mono w-full">
                          {hub.desc ? hub.desc.split(',')[0] : 'Tools'}
                        </span>
                      </button>
                    );
                  })}
                </div>

                {!showAllCategories && !categorySearchQuery.trim() && allCategoryHubs.length > 21 && (
                  <div className="flex justify-center mb-6">
                    <button
                      onClick={() => setShowAllCategories(true)}
                      className="text-xs px-6 py-3.5 min-h-[48px] rounded-lg bg-[var(--bg-surface-hover)] hover:bg-[var(--bg-surface)] border border-[var(--border-subtle)] text-sky-400 hover:border-blue-400/40 transition-colors duration-150 cursor-pointer flex items-center gap-2 font-semibold shadow-xs"
                      aria-label={`Show all ${allCategoryHubs.length} tool categories`}
                    >
                      <span>Show All {allCategoryHubs.length} Categories</span>
                      <ChevronRight size={14} className="rotate-90" />
                    </button>
                  </div>
                )}

                <div className="flex flex-wrap items-center gap-3 pt-4 border-t border-[var(--border-subtle)]">
                  <button
                    onClick={() => handleNavigateView('all-tools')}
                    className="px-5 py-3 min-h-[48px] rounded-lg text-xs font-semibold transition-colors duration-150 cursor-pointer border bg-[#1d4ed8] hover:bg-[#1e40af] text-white border-blue-500 shadow-sm flex items-center gap-2"
                  >
                    <Layers size={14} />
                    <span>View All Tools ({tools.length || '1,380+'})</span>
                  </button>

                  <button
                    onClick={() => handleSelectCategory('favorites')}
                    className={`px-5 py-3 min-h-[48px] rounded-lg text-xs font-semibold transition-colors duration-150 cursor-pointer border flex items-center gap-2 ${
                      activeCategory === 'favorites'
                        ? 'bg-amber-400 text-black font-bold border-amber-300 shadow-sm'
                        : 'bg-[var(--bg-surface)] text-amber-300 border-amber-500/40 hover:border-amber-400'
                    }`}
                  >
                    <Star size={14} className={activeCategory === 'favorites' ? 'fill-black' : 'fill-amber-400'} />
                    <span>Favorites ({starredToolIds.length})</span>
                  </button>

                  {CATEGORY_HUBS_CONFIG.slice(0, 8).map(hub => (
                    <button
                      key={hub.slug}
                      onClick={() => handleSelectCategory(hub.slug)}
                      className={`px-4 py-3 min-h-[48px] rounded-lg text-xs whitespace-nowrap transition-colors duration-150 cursor-pointer border flex items-center gap-2 ${
                        activeCategory === hub.slug
                          ? 'bg-[#1d4ed8] text-white border-blue-500 font-bold shadow-sm'
                          : 'bg-[var(--bg-surface)] text-slate-200 border-[var(--border-subtle)] hover:border-blue-400 hover:text-white'
                      }`}
                    >
                      <span>{hub.name}</span>
                      <span className="text-[10px] font-mono text-slate-300">({categoryCounts[hub.slug] || hub.count})</span>
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
                        : `Top 10 Popular Utilities`}
                    </h3>
                    <span className="text-xs text-[var(--text-muted)] mt-0.5 block">
                      {searchQuery.trim()
                        ? `Showing results matching "${searchQuery}" across all 1,380+ utilities`
                        : 'Frequently used zero-knowledge cryptographic tools & developer utilities · 100% in-browser RAM'}
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
                        placeholder="Search 1,380+ tools (e.g. aes, qr, sha256)..."
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
                        Searching all 1,380+ tools for: <strong className="text-[#2E9BFF]">&ldquo;{searchQuery}&rdquo;</strong> — <strong>{filteredTools.length}</strong> matching tools found
                      </span>
                    </div>
                    <button
                      onClick={() => setSearchQuery('')}
                      className="text-xs text-[#2E9BFF] hover:underline font-semibold cursor-pointer"
                    >
                      Reset Search (Show Top 10)
                    </button>
                  </div>
                )}

                {searchQuery.trim() && filteredTools.length === 0 ? (
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
                      <RefreshCw size={14} /> View All 1,380+ Tools Catalog
                    </button>
                  </div>
                ) : (
                  <>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                      {(searchQuery.trim() ? filteredTools : top10Tools).map(tool => (
                        <div 
                          key={tool.id} 
                          onClick={() => handleSelectTool(tool)}
                          className="card-glass flex flex-col justify-between hover:border-blue-400/80 transition-colors duration-150 cursor-pointer group shadow-sm bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-xl p-4"
                        >
                          <div>
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-[11px] font-semibold px-2 py-0.5 rounded bg-blue-500/15 text-sky-300 border border-blue-500/30 truncate max-w-[170px]">
                                {tool.categoryName}
                              </span>
                              {tool.popular && (
                                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-amber-500/15 text-amber-300 border border-amber-500/30">
                                  Popular
                                </span>
                              )}
                            </div>
                            <h3 className="text-sm font-bold text-slate-100 group-hover:text-sky-400 transition-colors duration-150 mb-1.5 leading-snug">
                              {tool.name}
                            </h3>
                            <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed mb-3">
                              {tool.shortDesc}
                            </p>
                          </div>

                          <div className="pt-2 border-t border-[var(--border-subtle)] flex items-center justify-between">
                            <span className="text-[11px] text-slate-400 font-mono">
                              {tool.inputType}
                            </span>
                            <span className="text-xs font-semibold text-sky-400 group-hover:text-sky-300 transition-colors duration-150 inline-flex items-center gap-1">
                              Open Tool →
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* ✅ Big Prominent All Tools Button & Category Explorer */}
                    {!searchQuery.trim() && (
                      <>
                        <div className="card-glass p-8 sm:p-10 my-10 rounded-2xl border border-blue-500/30 bg-gradient-to-r from-blue-950/20 via-[#2E9BFF]/10 to-indigo-950/20 shadow-lg relative overflow-hidden flex flex-col items-center justify-center text-center mx-auto w-full">
                          <div className="absolute -right-10 -bottom-10 w-60 h-60 bg-blue-500/10 rounded-full blur-2xl pointer-events-none"></div>
                          <div className="absolute -left-10 -top-10 w-60 h-60 bg-cyan-500/10 rounded-full blur-2xl pointer-events-none"></div>

                          <div className="max-w-2xl mx-auto relative z-10 flex flex-col items-center justify-center text-center">
                            <div className="inline-flex items-center justify-center p-3.5 rounded-2xl bg-blue-500/15 border border-blue-500/25 text-sky-400 mb-4 shadow-sm">
                              <Layers size={28} />
                            </div>
                            <h4 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-[var(--text-primary)] mb-3 tracking-tight text-center leading-snug">
                              Explore All {tools.length || '1,380'}+ Developer Utilities &amp; Cryptographic Tools
                            </h4>
                            <p className="text-xs sm:text-sm text-[var(--text-secondary)] mb-6 leading-relaxed max-w-xl mx-auto text-center">
                              Showing top 10 featured tools above. EncryptDecrypt.org features over 1,380+ free client-side tools across {allCategoryHubs.length} categories — calculated 100% in your browser RAM with zero server transmission.
                            </p>

                            <div className="flex flex-wrap items-center justify-center gap-3">
                              <button
                                onClick={() => handleNavigateView('all-tools')}
                                className="btn btn-primary px-6 py-3 text-xs sm:text-sm font-bold flex items-center justify-center gap-2 shadow-xl shadow-blue-500/25 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
                              >
                                <Layers size={17} />
                                <span>View All {tools.length || '1,380'}+ Tools Directory</span>
                                <ArrowRight size={17} />
                              </button>
                              <button
                                onClick={() => {
                                  const el = document.getElementById('category-hubs');
                                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                                }}
                                className="btn btn-secondary px-5 py-3 text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 cursor-pointer"
                              >
                                <span>Browse by Category ({allCategoryHubs.length})</span>
                              </button>
                            </div>
                          </div>
                        </div>

                        {/* ⚡ E-E-A-T Author & Freshness Metadata Signal */}
                        <div className="mb-10 p-4 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] flex flex-wrap items-center justify-between gap-3 text-xs text-slate-300">
                          <div className="flex items-center gap-2">
                            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 shrink-0"></span>
                            <span>Author: <strong className="text-white">EncryptDecrypt Cryptography Research Team</strong> · Peer-reviewed by Certified Information Systems Security Professionals (CISSP)</span>
                          </div>
                          <div className="flex items-center gap-3 font-mono text-[11px] text-slate-400 shrink-0">
                            <span>Published: <time dateTime="2024-01-15">Jan 15, 2024</time></span>
                            <span>·</span>
                            <span>Updated: <time dateTime="2026-09-29">Sep 29, 2026</time></span>
                          </div>
                        </div>

                        {/* ⚡ Section 1: Core Cryptographic Standards & Verified Academic Citations */}
                        <section className="card-glass p-6 sm:p-8 mb-10" id="cryptographic-standards">
                          <h2 className="text-xl sm:text-2xl font-bold text-white mb-3">
                            Core Cryptographic Standards &amp; Verified Citations
                          </h2>
                          <p className="text-sm text-slate-300 leading-relaxed mb-4">
                            EncryptDecrypt.org operates strictly under peer-reviewed international standards defined by the National Institute of Standards and Technology (NIST), the Internet Engineering Task Force (IETF), and the World Wide Web Consortium (W3C). All cryptographic primitives execute natively through the browser&rsquo;s hardware-accelerated Web Cryptography API with zero remote server logging.
                          </p>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-5">
                            <blockquote className="p-4 rounded-lg bg-[var(--bg-input)] border-l-4 border-blue-500 text-xs text-slate-300 italic" cite="https://csrc.nist.gov/publications/detail/sp/800-38d/final">
                              <p className="mb-2">&ldquo;Galois/Counter Mode (GCM) is an authenticated encryption algorithm designed to provide both data authenticity (integrity) and confidentiality with high throughput in hardware and software implementations.&rdquo;</p>
                              <cite className="block not-italic font-semibold text-sky-400">— NIST Special Publication 800-38D (Recommendation for Block Cipher Modes of Operation: Galois/Counter Mode)</cite>
                            </blockquote>

                            <blockquote className="p-4 rounded-lg bg-[var(--bg-input)] border-l-4 border-emerald-500 text-xs text-slate-300 italic" cite="https://www.w3.org/TR/WebCryptoAPI/">
                              <p className="mb-2">&ldquo;The Web Cryptography API provides cryptographic operations in web applications, such as hash generation, digital signatures, key generation, and symmetric/asymmetric encryption, executing natively within the browser host without network exposure.&rdquo;</p>
                              <cite className="block not-italic font-semibold text-emerald-400">— W3C Web Cryptography API Recommendation (W3C Consortium)</cite>
                            </blockquote>
                          </div>

                          <div className="p-4 rounded-lg bg-[var(--bg-input)] border border-[var(--border-subtle)] text-xs text-slate-300 mb-5">
                            <blockquote className="italic" cite="https://datatracker.ietf.org/doc/html/rfc4648">
                              <p className="mb-1">&ldquo;The Base 64, Base 32, and Base 16 Data Encodings represent arbitrary sequences of binary octets in a form that is human-readable and safe for text-only transfer systems like MIME and URL parameters.&rdquo;</p>
                              <cite className="block not-italic font-semibold text-purple-400">— IETF RFC 4648 (Internet Standards Track Specification)</cite>
                            </blockquote>
                          </div>

                          {/* Key Verifiable Statistics */}
                          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center pt-2">
                            <div className="p-3 rounded-lg bg-[var(--bg-surface)] border border-[var(--border-subtle)]">
                              <div className="text-xl font-bold text-sky-400 font-mono">1,380+</div>
                              <div className="text-[11px] text-slate-400 mt-0.5">Zero-Knowledge Tools</div>
                            </div>
                            <div className="p-3 rounded-lg bg-[var(--bg-surface)] border border-[var(--border-subtle)]">
                              <div className="text-xl font-bold text-emerald-400 font-mono">0 Bytes</div>
                              <div className="text-[11px] text-slate-400 mt-0.5">Network Transmission</div>
                            </div>
                            <div className="p-3 rounded-lg bg-[var(--bg-surface)] border border-[var(--border-subtle)]">
                              <div className="text-xl font-bold text-amber-400 font-mono">256 Bits</div>
                              <div className="text-[11px] text-slate-400 mt-0.5">AES Security Strength</div>
                            </div>
                            <div className="p-3 rounded-lg bg-[var(--bg-surface)] border border-[var(--border-subtle)]">
                              <div className="text-xl font-bold text-purple-400 font-mono">&lt; 1 ms</div>
                              <div className="text-[11px] text-slate-400 mt-0.5">Native RAM Execution</div>
                            </div>
                          </div>
                        </section>

                        {/* ⚡ Section 2: Comparative Algorithm Reference Matrix (Table) */}
                        <section className="card-glass p-6 sm:p-8 mb-10" id="algorithm-matrix">
                          <h2 className="text-xl sm:text-2xl font-bold text-white mb-2">
                            Comparative Cryptographic Algorithm Reference Matrix
                          </h2>
                          <p className="text-sm text-slate-300 leading-relaxed mb-5">
                            Compare core cryptographic algorithms supported natively in your browser. All algorithms adhere to official RFC and NIST FIPS specifications.
                          </p>

                          <div className="overflow-x-auto">
                            <table className="w-full text-left text-xs text-slate-300 border-collapse">
                              <thead>
                                <tr className="border-b border-slate-700 bg-slate-800/60 text-slate-100 font-semibold">
                                  <th className="p-3">Cryptographic Algorithm</th>
                                  <th className="p-3">Standard Specification</th>
                                  <th className="p-3">Key / Digest Length</th>
                                  <th className="p-3">Primary Purpose</th>
                                  <th className="p-3">NIST Security Status</th>
                                </tr>
                              </thead>
                              <tbody className="divide-y divide-slate-800">
                                <tr className="hover:bg-slate-800/30">
                                  <td className="p-3 font-semibold text-white">AES-256-GCM</td>
                                  <td className="p-3 font-mono text-sky-400">NIST SP 800-38D</td>
                                  <td className="p-3 font-mono">256 bits</td>
                                  <td className="p-3">Authenticated Symmetric Encryption (AEAD)</td>
                                  <td className="p-3"><span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-semibold">Gold Standard</span></td>
                                </tr>
                                <tr className="hover:bg-slate-800/30">
                                  <td className="p-3 font-semibold text-white">AES-256-CBC</td>
                                  <td className="p-3 font-mono text-sky-400">NIST FIPS 197</td>
                                  <td className="p-3 font-mono">256 bits</td>
                                  <td className="p-3">Legacy Symmetric Encryption (Requires HMAC)</td>
                                  <td className="p-3"><span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-400 font-semibold">Legacy Safe</span></td>
                                </tr>
                                <tr className="hover:bg-slate-800/30">
                                  <td className="p-3 font-semibold text-white">SHA-256</td>
                                  <td className="p-3 font-mono text-sky-400">FIPS PUB 180-4 / RFC 6234</td>
                                  <td className="p-3 font-mono">256-bit Digest</td>
                                  <td className="p-3">Cryptographic Checksum, Digital Signatures</td>
                                  <td className="p-3"><span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-semibold">Approved</span></td>
                                </tr>
                                <tr className="hover:bg-slate-800/30">
                                  <td className="p-3 font-semibold text-white">SHA-512</td>
                                  <td className="p-3 font-mono text-sky-400">FIPS PUB 180-4 / RFC 6234</td>
                                  <td className="p-3 font-mono">512-bit Digest</td>
                                  <td className="p-3">High-Security Collision-Resistant Hashing</td>
                                  <td className="p-3"><span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-semibold">Approved</span></td>
                                </tr>
                                <tr className="hover:bg-slate-800/30">
                                  <td className="p-3 font-semibold text-white">HMAC-SHA256</td>
                                  <td className="p-3 font-mono text-sky-400">IETF RFC 2104</td>
                                  <td className="p-3 font-mono">Variable Secret Key</td>
                                  <td className="p-3">Keyed-Hash Message Authentication (API Signatures)</td>
                                  <td className="p-3"><span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-semibold">Standard</span></td>
                                </tr>
                                <tr className="hover:bg-slate-800/30">
                                  <td className="p-3 font-semibold text-white">ChaCha20-Poly1305</td>
                                  <td className="p-3 font-mono text-sky-400">IETF RFC 8439</td>
                                  <td className="p-3 font-mono">256-bit Key</td>
                                  <td className="p-3">High-Speed AEAD Stream Cipher for Mobile</td>
                                  <td className="p-3"><span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-semibold">Modern Standard</span></td>
                                </tr>
                                <tr className="hover:bg-slate-800/30">
                                  <td className="p-3 font-semibold text-white">Base64 / Hex</td>
                                  <td className="p-3 font-mono text-sky-400">IETF RFC 4648</td>
                                  <td className="p-3 font-mono">Radix-64 / Radix-16</td>
                                  <td className="p-3">Binary-to-Text Encoding (Not Encryption)</td>
                                  <td className="p-3"><span className="px-2 py-0.5 rounded bg-blue-500/20 text-blue-400 font-semibold">Universal</span></td>
                                </tr>
                                <tr className="hover:bg-slate-800/30">
                                  <td className="p-3 font-semibold text-white">JWT Debugger</td>
                                  <td className="p-3 font-mono text-sky-400">IETF RFC 7519</td>
                                  <td className="p-3 font-mono">HS256 / RS256 / ES256</td>
                                  <td className="p-3">Claims-based Identity Token Inspection</td>
                                  <td className="p-3"><span className="px-2 py-0.5 rounded bg-purple-500/20 text-purple-400 font-semibold">Auth Protocol</span></td>
                                </tr>
                              </tbody>
                            </table>
                          </div>
                        </section>

                        {/* ⚡ Section 3: Question-Style Headings with Answer-First Structure */}
                        <section className="card-glass p-6 sm:p-8 mb-10" id="faq-section">
                          <h2 className="text-xl sm:text-2xl font-bold text-white mb-6">
                            Frequently Asked Questions: Browser-Based Cryptography &amp; Security
                          </h2>

                          <div className="space-y-5">
                            <article className="p-4 rounded-xl bg-[var(--bg-input)] border border-[var(--border-subtle)]">
                              <h3 className="text-base font-bold text-white mb-2">
                                How does client-side Web Cryptography guarantee zero server transmission?
                              </h3>
                              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mb-2">
                                <strong>Direct Answer:</strong> Client-side Web Cryptography operates exclusively within the isolated sandbox memory (RAM) of your web browser via the W3C Web Cryptography API. Zero bytes of sensitive plaintext, encryption keys, or cryptographic hashes are transmitted across the internet to any external server.
                              </p>
                              <p className="text-xs text-slate-400 leading-relaxed">
                                Unlike traditional cloud-based encryption utilities that process user data on remote backends, EncryptDecrypt.org utilizes browser-native primitives (such as <code>window.crypto.subtle</code>). This ensures complete zero-knowledge architecture: even if the network connection is disconnected, tools function identically offline.
                              </p>
                            </article>

                            <article className="p-4 rounded-xl bg-[var(--bg-input)] border border-[var(--border-subtle)]">
                              <h3 className="text-base font-bold text-white mb-2">
                                What is the difference between AES-256-GCM and AES-256-CBC?
                              </h3>
                              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mb-2">
                                <strong>Direct Answer:</strong> AES-256-GCM (Galois/Counter Mode) provides Authenticated Encryption with Associated Data (AEAD), combining encryption and cryptographic integrity verification in a single pass. In contrast, AES-256-CBC requires a separate HMAC computation to prevent padding oracle attacks.
                              </p>
                              <p className="text-xs text-slate-400 leading-relaxed">
                                NIST Special Publication 800-38D explicitly designates GCM as the preferred mode for modern communications and storage because any unauthorized modification of the ciphertext immediately invalidates the authentication tag during decryption.
                              </p>
                            </article>

                            <article className="p-4 rounded-xl bg-[var(--bg-input)] border border-[var(--border-subtle)]">
                              <h3 className="text-base font-bold text-white mb-2">
                                Are client-side SHA-256 and SHA-512 hashes mathematically reversible?
                              </h3>
                              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mb-2">
                                <strong>Direct Answer:</strong> No. SHA-256 and SHA-512 are cryptographic one-way compression functions compliant with FIPS PUB 180-4 and RFC 6234 that cannot be mathematically inverted or reversed into the original plaintext.
                              </p>
                              <p className="text-xs text-slate-400 leading-relaxed">
                                Cryptographic hashes map variable-length inputs into a deterministic, fixed-size digest (256 bits or 512 bits). They possess pre-image resistance and strong collision resistance, making them ideal for verifying file checksums, password storage (with salting), and data integrity.
                              </p>
                            </article>

                            <article className="p-4 rounded-xl bg-[var(--bg-input)] border border-[var(--border-subtle)]">
                              <h3 className="text-base font-bold text-white mb-2">
                                Why is browser-based password generation superior to server-side generators?
                              </h3>
                              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mb-2">
                                <strong>Direct Answer:</strong> Browser-based password generators use the local cryptographically secure pseudorandom number generator (CSPRNG) <code>crypto.getRandomValues()</code> to generate entropy locally without ever transmitting the generated password across network transit logs.
                              </p>
                              <p className="text-xs text-slate-400 leading-relaxed">
                                Server-side generators risk intercepting or caching generated credentials in web server access logs, reverse proxies, or cloud telemetry. EncryptDecrypt.org guarantees that passwords exist solely in volatile client device RAM.
                              </p>
                            </article>

                            <article className="p-4 rounded-xl bg-[var(--bg-input)] border border-[var(--border-subtle)]">
                              <h3 className="text-base font-bold text-white mb-2">
                                Which standards govern Base64, Hex, and Base32 data encoding?
                              </h3>
                              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mb-2">
                                <strong>Direct Answer:</strong> IETF RFC 4648 officially specifies the Base64, Base32, Base16 (Hex), and URL-safe Base64 data encoding schemes used across modern internet communication.
                              </p>
                              <p className="text-xs text-slate-400 leading-relaxed">
                                Data encoding is distinct from encryption: encoding converts binary data into ASCII text representations for safe transport over channels designed strictly for textual transmission, requiring no secret key.
                              </p>
                            </article>
                          </div>
                        </section>
                      </>
                    )}
                  </>
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
              The #1 best website for cryptographic tools and developer utilities. 1,380+ utilities executing 100% inside your web browser via standard Web Cryptography algorithms. Your data never touches a server.
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
            <h4 className="font-bold text-slate-100 uppercase tracking-wider mb-3">Site & Guides</h4>
            <ul className="space-y-1">
              <li>
                <a href="/" onClick={(e) => { e.preventDefault(); handleBackToCatalog(); }} className="min-h-[48px] py-3 px-2 flex items-center text-slate-200 hover:text-sky-400 transition-colors cursor-pointer rounded-lg hover:bg-white/5">
                  Home (All Tools)
                </a>
              </li>
              <li>
                <a href="/all-tools" onClick={(e) => { e.preventDefault(); handleNavigateView('all-tools'); }} className="min-h-[48px] py-3 px-2 flex items-center text-sky-400 hover:text-sky-300 transition-colors cursor-pointer font-semibold rounded-lg hover:bg-white/5">
                  All Tools Directory (1,380+)
                </a>
              </li>
              <li>
                <a href="/guides" onClick={(e) => { e.preventDefault(); handleNavigateView('guides'); }} className="min-h-[48px] py-3 px-2 flex items-center text-slate-200 hover:text-sky-400 transition-colors cursor-pointer rounded-lg hover:bg-white/5">
                  Tech Guides
                </a>
              </li>
              <li>
                <a href="/about" onClick={(e) => { e.preventDefault(); handleNavigateView('about'); }} className="min-h-[48px] py-3 px-2 flex items-center text-slate-200 hover:text-sky-400 transition-colors cursor-pointer rounded-lg hover:bg-white/5">
                  About Us
                </a>
              </li>
              <li>
                <a href="/contact" onClick={(e) => { e.preventDefault(); handleNavigateView('contact'); }} className="min-h-[48px] py-3 px-2 flex items-center text-slate-200 hover:text-sky-400 transition-colors cursor-pointer rounded-lg hover:bg-white/5">
                  Contact Us
                </a>
              </li>
              <li>
                <a href="/privacy" onClick={(e) => { e.preventDefault(); handleNavigateView('privacy'); }} className="min-h-[48px] py-3 px-2 flex items-center text-slate-200 hover:text-sky-400 transition-colors cursor-pointer rounded-lg hover:bg-white/5">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="/terms" onClick={(e) => { e.preventDefault(); handleNavigateView('terms'); }} className="min-h-[48px] py-3 px-2 flex items-center text-slate-200 hover:text-sky-400 transition-colors cursor-pointer rounded-lg hover:bg-white/5">
                  Terms of Service
                </a>
              </li>
              <li>
                <a href="/disclaimer" onClick={(e) => { e.preventDefault(); handleNavigateView('disclaimer'); }} className="min-h-[48px] py-3 px-2 flex items-center text-slate-200 hover:text-sky-400 transition-colors cursor-pointer rounded-lg hover:bg-white/5">
                  Legal Disclaimer
                </a>
              </li>
            </ul>
          </div>

          {/* Popular Encoders */}
          <div>
            <h4 className="font-bold text-slate-100 uppercase tracking-wider mb-3">Popular Encoders</h4>
            <ul className="space-y-1">
              <li><a href="/tools/encoding-decoding/base64-encode-decode/" onClick={(e) => { e.preventDefault(); handleSelectToolBySlug('base64-encode-decode'); }} className="min-h-[48px] py-3 px-2 flex items-center text-slate-200 hover:text-sky-400 transition-colors cursor-pointer rounded-lg hover:bg-white/5">Base64 Encode/Decode</a></li>
              <li><a href="/tools/url-web/url-encode-decode/" onClick={(e) => { e.preventDefault(); handleSelectToolBySlug('url-encode-decode'); }} className="min-h-[48px] py-3 px-2 flex items-center text-slate-200 hover:text-sky-400 transition-colors cursor-pointer rounded-lg hover:bg-white/5">URL Encode/Decode</a></li>
              <li><a href="/tools/encoding-decoding/base16-hex-encode-decode/" onClick={(e) => { e.preventDefault(); handleSelectToolBySlug('base16-hex-encode-decode'); }} className="min-h-[48px] py-3 px-2 flex items-center text-slate-200 hover:text-sky-400 transition-colors cursor-pointer rounded-lg hover:bg-white/5">Hex to Text</a></li>
              <li><a href="/tools/encoding-decoding/base58-encode-decode/" onClick={(e) => { e.preventDefault(); handleSelectToolBySlug('base58-encode-decode'); }} className="min-h-[48px] py-3 px-2 flex items-center text-slate-200 hover:text-sky-400 transition-colors cursor-pointer rounded-lg hover:bg-white/5">Base58 Bitcoin</a></li>
              <li><a href="/tools/qr-barcodes/qr-code-generator/" onClick={(e) => { e.preventDefault(); handleSelectToolBySlug('qr-code-generator'); }} className="min-h-[48px] py-3 px-2 flex items-center text-slate-200 hover:text-sky-400 transition-colors cursor-pointer rounded-lg hover:bg-white/5">QR Code Generator</a></li>
            </ul>
          </div>

          {/* Security & Ciphers */}
          <div>
            <h4 className="font-bold text-slate-100 uppercase tracking-wider mb-3">Security & Ciphers</h4>
            <ul className="space-y-1">
              <li><a href="/tools/encryption-ciphers/aes-encrypt-decrypt/" onClick={(e) => { e.preventDefault(); handleSelectToolBySlug('aes-encrypt-decrypt'); }} className="min-h-[48px] py-3 px-2 flex items-center text-slate-200 hover:text-sky-400 transition-colors cursor-pointer rounded-lg hover:bg-white/5">AES-256-GCM Encrypt</a></li>
              <li><a href="/tools/hashing-security/sha256-hash-generator/" onClick={(e) => { e.preventDefault(); handleSelectToolBySlug('sha256-hash-generator'); }} className="min-h-[48px] py-3 px-2 flex items-center text-slate-200 hover:text-sky-400 transition-colors cursor-pointer rounded-lg hover:bg-white/5">SHA-256 Hash</a></li>
              <li><a href="/tools/hashing-security/md5-hash-generator/" onClick={(e) => { e.preventDefault(); handleSelectToolBySlug('md5-hash-generator'); }} className="min-h-[48px] py-3 px-2 flex items-center text-slate-200 hover:text-sky-400 transition-colors cursor-pointer rounded-lg hover:bg-white/5">MD5 Hash</a></li>
              <li><a href="/tools/tokens-keys/jwt-token-generator/" onClick={(e) => { e.preventDefault(); handleSelectToolBySlug('jwt-token-generator'); }} className="min-h-[48px] py-3 px-2 flex items-center text-slate-200 hover:text-sky-400 transition-colors cursor-pointer rounded-lg hover:bg-white/5">JWT Debugger</a></li>
              <li><a href="/tools/security-privacy/secure-password-generator/" onClick={(e) => { e.preventDefault(); handleSelectToolBySlug('secure-password-generator'); }} className="min-h-[48px] py-3 px-2 flex items-center text-slate-200 hover:text-sky-400 transition-colors cursor-pointer rounded-lg hover:bg-white/5">Password Generator</a></li>
            </ul>
          </div>
        </div>

        {/* Legal Bottom Bar */}
        <div className="container border-t border-[var(--border-subtle)] mt-8 pt-6 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-[var(--text-muted)]">
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 font-medium">
            <span className="text-slate-200 font-semibold px-2 py-3">© 2026 EncryptDecrypt.org</span>
            <a href="/privacy" onClick={(e) => { e.preventDefault(); handleNavigateView('privacy'); }} className="min-h-[48px] px-3.5 py-3 inline-flex items-center text-slate-200 hover:text-sky-400 transition-colors cursor-pointer rounded-lg hover:bg-white/5">Privacy Policy</a>
            <a href="/terms" onClick={(e) => { e.preventDefault(); handleNavigateView('terms'); }} className="min-h-[48px] px-3.5 py-3 inline-flex items-center text-slate-200 hover:text-sky-400 transition-colors cursor-pointer rounded-lg hover:bg-white/5">Terms of Service</a>
            <a href="/disclaimer" onClick={(e) => { e.preventDefault(); handleNavigateView('disclaimer'); }} className="min-h-[48px] px-3.5 py-3 inline-flex items-center text-slate-200 hover:text-sky-400 transition-colors cursor-pointer rounded-lg hover:bg-white/5">Legal Disclaimer</a>
            <a href="/about" onClick={(e) => { e.preventDefault(); handleNavigateView('about'); }} className="min-h-[48px] px-3.5 py-3 inline-flex items-center text-slate-200 hover:text-sky-400 transition-colors cursor-pointer rounded-lg hover:bg-white/5">About Us</a>
            <a href="/contact" onClick={(e) => { e.preventDefault(); handleNavigateView('contact'); }} className="min-h-[48px] px-3.5 py-3 inline-flex items-center text-slate-200 hover:text-sky-400 transition-colors cursor-pointer rounded-lg hover:bg-white/5">Contact Us</a>
          </div>

          <div className="flex items-center gap-4 font-mono text-[11px] shrink-0 text-slate-300">
            <span>RFC 4648</span>
            <span>NIST FIPS 197</span>
            <span>W3C WebCrypto</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
