import React, { useState, useEffect, useMemo, useRef, Suspense, lazy } from 'react';
import { 
  Shield, Lock, Search, Copy, Download, ArrowRightLeft, ArrowRight,
  Check, Moon, Sun, Key, Hash, FileCode, Cpu, Layers,
  Terminal, ShieldCheck, Database, Zap, RefreshCw, X,
  ChevronRight, ArrowLeft, Binary, CheckCircle, FileText,
  Sliders, Wifi, Code, Sparkles, Menu, BookOpen, Info, Mail,
  Globe, Clock, Palette, Eye, Gauge, ImageIcon, Calculator, Star, HelpCircle, Command, RotateCcw,
  UserCheck, User
} from 'lucide-react';
import { ToolItem, CategoryInfo } from './types';
import { INITIAL_TOP_TOOLS } from './data/initialTools';
import { searchTools } from './utils/searchTools';
import { SeoHead } from './components/SeoHead';
import { AdUnit } from './components/AdUnit';
import { applyAdminOverrides, recordToolExecution, recordSearchQuery, recordPageView } from './utils/adminStorage';

// Lightweight native Web API implementations for homepage hero runner (zero bundle bloat)
function heroBase64(str: string): string {
  try {
    return btoa(unescape(encodeURIComponent(str)));
  } catch {
    return btoa(str);
  }
}

function heroUrl(str: string): string {
  return encodeURIComponent(str);
}

async function heroSha256(str: string): Promise<string> {
  if (typeof crypto !== 'undefined' && crypto.subtle) {
    const data = new TextEncoder().encode(str);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    return Array.from(new Uint8Array(hashBuffer))
      .map(b => b.toString(16).padStart(2, '0'))
      .join('');
  }
  return 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855';
}

function heroPassword(length = 24): string {
  const chars = 'abcdefghjkmnpqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ23456789!@#$%&*';
  const array = new Uint8Array(length);
  if (typeof crypto !== 'undefined' && crypto.getRandomValues) {
    crypto.getRandomValues(array);
    return Array.from(array).map(x => chars[x % chars.length]).join('');
  }
  return Array.from({ length }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
}

import { ToolWorkspaceSkeleton } from './components/ToolWorkspaceSkeleton';
import { preloadToolWorkspace, loadToolWorkspaceComponent, lazyWithRetry } from './utils/toolPreloader';
import { ErrorBoundary } from './components/ErrorBoundary';

// --- REACT LAZY IMPORTS WITH AUTO-RETRY PRELOADER (Zero Blank Screens) ---
const ToolWorkspace = lazy(loadToolWorkspaceComponent);
const AllToolsPage = lazyWithRetry(() => import('./components/pages/AllToolsPage').then(m => ({ default: m.AllToolsPage })));
const CategoryPage = lazyWithRetry(() => import('./components/pages/CategoryPage').then(m => ({ default: m.CategoryPage })));
const AboutPage = lazyWithRetry(() => import('./components/pages/AboutPage').then(m => ({ default: m.AboutPage })));
const ContactPage = lazyWithRetry(() => import('./components/pages/ContactPage').then(m => ({ default: m.ContactPage })));
const TechGuidesPage = lazyWithRetry(() => import('./components/pages/TechGuidesPage').then(m => ({ default: m.TechGuidesPage })));
const PrivacyPage = lazyWithRetry(() => import('./components/pages/PrivacyPage').then(m => ({ default: m.PrivacyPage })));
const TermsPage = lazyWithRetry(() => import('./components/pages/TermsPage').then(m => ({ default: m.TermsPage })));
const DisclaimerPage = lazyWithRetry(() => import('./components/pages/DisclaimerPage').then(m => ({ default: m.DisclaimerPage })));
const NotFoundPage = lazyWithRetry(() => import('./components/pages/NotFoundPage').then(m => ({ default: m.NotFoundPage })));
const AdminPanel = lazyWithRetry(() => import('./components/admin/AdminPanel').then(m => ({ default: m.AdminPanel })));
const MasterBlogPage = lazyWithRetry(() => import('./components/pages/MasterBlogPage').then(m => ({ default: m.MasterBlogPage })));
const BlogPostPage = lazyWithRetry(() => import('./components/pages/BlogPostPage').then(m => ({ default: m.BlogPostPage })));
import { BLOG_POSTS, BlogPost } from './data/blogPosts';
// ------------------------------------------------------------------

export type AppView = 'catalog' | 'category' | 'about' | 'contact' | 'guides' | 'privacy' | 'terms' | 'disclaimer' | 'admin' | 'notfound' | 'all-tools' | 'blog';

export const CATEGORY_HUBS_CONFIG = [
  { slug: 'json-developer-tools', name: 'JSON & Developer Tools', icon: Code, count: 9, desc: 'Minifier, Diff, Path Tester, Kotlin/Java/C#/Go, Schema' },
  { slug: 'api-web-development', name: 'API & Web Development', icon: Globe, count: 7, desc: 'HTTP Status, REST Builder, cURL, JWT, MIME Lookup' },
  { slug: 'seo-webmaster', name: 'SEO & Webmaster', icon: Search, count: 23, desc: 'Robots.txt, Sitemap, Meta Title/Desc, Schema, OG Card' },
  { slug: 'website-performance', name: 'Website Performance', icon: Gauge, count: 6, desc: 'Page Load, Image Size, CSS/JS/HTML Minifier, GZIP' },
  { slug: 'accessibility-tools', name: 'Accessibility & WCAG', icon: Eye, count: 20, desc: 'WCAG Contrast, Alt Text, Heading, ARIA, Color Blindness' },
  { slug: 'text-writing-utilities', name: 'Text & Writing Utilities', icon: FileText, count: 7, desc: 'Sentence, Reading Time, Keyword Counter, Cleaner' },
  { slug: 'file-data-tools', name: 'File & Data Tools', icon: Database, count: 8, desc: 'CSV Viewer/Cleaner, TSV→CSV, JSON Table, XML, YAML' },
  { slug: 'date-calendar-time-tools', name: 'Date & Time', icon: Clock, count: 20, desc: 'Unix Timestamp, Date Diff, Age, Duration, Business Days' },
  { slug: 'math-science', name: 'Math & Science', icon: Calculator, count: 8, desc: 'Scientific Calc, Fractions, Ratios, Averages, Compound Int' },
  { slug: 'color-design', name: 'Color & Design', icon: Palette, count: 8, desc: 'HEX Picker, RGB/HSL, Gradient, Palette, CSS Shadow' },
  { slug: 'network-dns-tools', name: 'Network & DNS', icon: Wifi, count: 20, desc: 'DNS Lookup, IPv4/IPv6, CIDR, Subnet, User-Agent, Headers' },
  { slug: 'defensive-security-tools', name: 'Security — Defensive', icon: ShieldCheck, count: 20, desc: 'Password Strength, Hash, Checksum, JWT, CSP, SRI' },
  { slug: 'developer-generators', name: 'Developer Generators', icon: Key, count: 7, desc: 'UUID, ULID, NanoID, Lorem Ipsum, Mock JSON, Regex' },
  { slug: 'image-web-optimization', name: 'Image & Web Optimization', icon: ImageIcon, count: 6, desc: 'Image Dimensions, Aspect Ratio, WebP, SVG Optimizer' },
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

export const POPULAR_12_TOOLS = [
  { name: 'AES-256 Encryption', slug: 'aes-encrypt-decrypt', category: 'Encryption', icon: Lock, desc: 'Military-grade authenticated symmetric encryption using browser Web Crypto API.' },
  { name: 'Base64 Encode & Decode', slug: 'base64-encode-decode', category: 'Encoding', icon: Binary, desc: 'Instant ASCII text to RFC 4648 Radix-64 encoding with full UTF-8 support.' },
  { name: 'SHA-256 Hash Generator', slug: 'sha-256-hash-generator', category: 'Hashing', icon: Hash, desc: 'Generate deterministic 256-bit cryptographic digest checksums for verification.' },
  { name: 'JWT Token Debugger', slug: 'jwt-token-generator', category: 'API & Auth', icon: CheckCircle, desc: 'Decode JSON Web Token headers, payload claims, and check expiry safely.' },
  { name: 'UUID / GUID Generator', slug: 'uuid-guid-generator', category: 'Generators', icon: Key, desc: 'Generate cryptographically random UUID v4 and timestamp-ordered UUID v7.' },
  { name: 'Secure Password Generator', slug: 'secure-password-generator', category: 'Security', icon: ShieldCheck, desc: 'High-entropy random passwords using window.crypto.getRandomValues CSPRNG.' },
  { name: 'URL Encode & Decode', slug: 'url-encode-decode', category: 'Web Dev', icon: Globe, desc: 'Convert percent-encoded query parameters and RFC 3986 URI components.' },
  { name: 'RSA Key Generator', slug: 'rsa-key-generator-pem', category: 'Asymmetric', icon: Cpu, desc: 'Generate 2048-bit and 4096-bit RSA public and private key pairs in PEM format.' },
  { name: 'MD5 Hash Generator', slug: 'md5-hash-generator', category: 'Hashing', icon: FileCode, desc: '128-bit legacy checksum calculation for database indexing and file integrity.' },
  { name: 'HMAC-SHA256 Generator', slug: 'hmac-generator', category: 'Security', icon: Sliders, desc: 'Compute keyed-hash message authentication codes for API webhooks.' },
  { name: 'QR Code Generator', slug: 'qr-code-generator', category: 'Utilities', icon: Terminal, desc: 'Create high-resolution scannable QR codes with custom error correction levels.' },
  { name: 'JSON Formatter & Validator', slug: 'json-formatter-beautifier', category: 'Dev Tools', icon: Layers, desc: 'Beautify, indent, format, and validate complex JSON strings with syntax error detection.' }
];

function synthesizeToolFromSlug(slug: string): ToolItem {
  const formattedTitle = slug
    .split('-')
    .map(w => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');

  return {
    id: slug,
    name: formattedTitle,
    slug: slug,
    category: 'utilities',
    categoryName: 'Developer Tools',
    shortDesc: `${formattedTitle} - 100% private, client-side browser cryptographic utility.`,
    metaTitle: `${formattedTitle} - Free Online Tool | EncryptDecrypt.org`,
    metaDescription: `Use free ${formattedTitle} online. 100% client-side privacy, zero server storage, instant execution in browser RAM.`,
    primaryKeyword: formattedTitle.toLowerCase(),
    secondaryKeywords: [slug, 'cryptography', 'security', 'developer tool'],
    inputType: 'textarea',
    hasFileSupport: true,
    related: ['sha-256-hash-generator', 'base64-encode-decode', 'aes-encryption-decryption'],
    popular: false
  };
}

const REDIRECT_SLUGS: Record<string, string> = {
  'jwt-decoder': 'jwt-token-generator',
  'jwt-inspector': 'jwt-token-generator',
  'jwt-claim-inspector': 'jwt-token-generator',
  'jwt-validator': 'jwt-token-generator',
  'uuid-generator': 'uuid-guid-generator',
  'csp-generator': 'csp-builder-analyzer',
  'content-security-policy-explainer': 'csp-builder-analyzer',
  'sri-generator': 'sri-hash-generator',
  'contrast-checker': 'color-contrast-checker',
  'wcag-contrast-checker': 'color-contrast-checker',
  'webp-converter': 'image-to-webp',
  'image-to-webp-converter': 'image-to-webp',
  'password-strength-checker': 'password-strength-meter',
  'password-entropy-calculator': 'password-strength-meter',
};

function getInitialRouteState(): {
  selectedTool: ToolItem | null;
  currentView: AppView;
  activeCategory: string;
} {
  if (typeof window === 'undefined') {
    return { selectedTool: null, currentView: 'catalog', activeCategory: 'all' };
  }

  const hash = window.location.hash.replace(/^#/, '');
  const pathname = window.location.pathname.replace(/\/+$/, '');

  // 1. Hash routes
  if (hash.startsWith('tool=')) {
    const rawSlug = hash.replace('tool=', '');
    const slug = REDIRECT_SLUGS[rawSlug] || rawSlug;
    const match = INITIAL_TOP_TOOLS.find(t => t.slug === slug || t.id === slug);
    return { selectedTool: match || null, currentView: 'catalog', activeCategory: 'all' };
  }
  if (['about', 'contact', 'guides', 'privacy', 'terms', 'disclaimer', 'admin', 'all-tools', 'blog'].includes(hash)) {
    return { selectedTool: null, currentView: hash as AppView, activeCategory: 'all' };
  }
  if (hash.startsWith('category=')) {
    const cat = hash.replace('category=', '');
    return { selectedTool: null, currentView: 'category', activeCategory: cat };
  }

  // 2. Clean Pathname routes (/tools/:slug, /tool/:slug, /category/:slug)
  if (pathname.startsWith('/tools/') || pathname.startsWith('/tool/')) {
    const rawPath = pathname.startsWith('/tools/') ? pathname.replace('/tools/', '') : pathname.replace('/tool/', '');
    const parts = rawPath.split('/').filter(Boolean);
    if (parts.length >= 1) {
      const rawSlug = parts[parts.length - 1];
      const slug = REDIRECT_SLUGS[rawSlug] || rawSlug;
      const isCat = CATEGORY_HUBS_CONFIG.some(c => c.slug === slug);
      if (isCat) {
        return { selectedTool: null, currentView: 'category', activeCategory: slug };
      }
      const match = INITIAL_TOP_TOOLS.find(t => t.slug === slug || t.id === slug);
      if (match) {
        return { selectedTool: match, currentView: 'catalog', activeCategory: 'all' };
      }
      return { selectedTool: null, currentView: 'catalog', activeCategory: 'all' };
    }
  }

  if (pathname.startsWith('/category/')) {
    const catSlug = pathname.replace('/category/', '').split('/')[0];
    return { selectedTool: null, currentView: 'category', activeCategory: catSlug };
  }

  if (pathname === '' || pathname === '/') return { selectedTool: null, currentView: 'catalog', activeCategory: 'all' };
  if (pathname === '/blog' || pathname.startsWith('/blog')) return { selectedTool: null, currentView: 'blog', activeCategory: 'all' };
  if (pathname === '/all-tools' || pathname === '/tools') return { selectedTool: null, currentView: 'all-tools', activeCategory: 'all' };
  if (pathname === '/about') return { selectedTool: null, currentView: 'about', activeCategory: 'all' };
  if (pathname === '/contact') return { selectedTool: null, currentView: 'contact', activeCategory: 'all' };
  if (pathname === '/guides') return { selectedTool: null, currentView: 'guides', activeCategory: 'all' };
  if (pathname === '/privacy') return { selectedTool: null, currentView: 'privacy', activeCategory: 'all' };
  if (pathname === '/terms') return { selectedTool: null, currentView: 'terms', activeCategory: 'all' };
  if (pathname === '/disclaimer') return { selectedTool: null, currentView: 'disclaimer', activeCategory: 'all' };
  if (pathname === '/admin') return { selectedTool: null, currentView: 'admin', activeCategory: 'all' };

  // Direct single slug check (e.g. /sha256-hash-generator)
  const cleanSinglePath = pathname.replace(/^\//, '');
  if (cleanSinglePath && !cleanSinglePath.includes('/')) {
    const slug = REDIRECT_SLUGS[cleanSinglePath] || cleanSinglePath;
    const isCat = CATEGORY_HUBS_CONFIG.some(c => c.slug === slug);
    if (isCat) {
      return { selectedTool: null, currentView: 'category', activeCategory: slug };
    }
    const match = INITIAL_TOP_TOOLS.find(t => t.slug === slug || t.id === slug);
    if (match) {
      return { selectedTool: match, currentView: 'catalog', activeCategory: 'all' };
    }
  }

  return { selectedTool: null, currentView: 'notfound', activeCategory: 'all' };
}

export default function App() {
  const [initialRoute] = useState(getInitialRouteState);
  const [tools, setTools] = useState<ToolItem[]>(() => {
    try {
      const cached = sessionStorage.getItem('ed_tools_catalog_cache');
      if (cached) {
        const parsed = JSON.parse(cached);
        if (Array.isArray(parsed) && parsed.length > 50) {
          return applyAdminOverrides(parsed);
        }
      }
    } catch {}
    return INITIAL_TOP_TOOLS;
  });
  const [selectedTool, setSelectedTool] = useState<ToolItem | null>(initialRoute.selectedTool);
  const [currentView, setCurrentView] = useState<AppView>(initialRoute.currentView);
  const [activeCategory, setActiveCategory] = useState<string>(initialRoute.activeCategory);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [searchFocused, setSearchFocused] = useState<boolean>(false);
  const [searchHighlightIndex, setSearchHighlightIndex] = useState<number>(-1);
  const [mobileSearchOpen, setMobileSearchOpen] = useState<boolean>(false);
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const [categorySearchQuery, setCategorySearchQuery] = useState<string>('');
  const [showAllCategories, setShowAllCategories] = useState<boolean>(false);
  const [selectedBlogPost, setSelectedBlogPost] = useState<BlogPost | null>(() => {
    if (typeof window !== 'undefined') {
      const p = window.location.pathname.replace(/\/+$/, '');
      if (p.startsWith('/blog/')) {
        const slug = p.replace('/blog/', '').split('/')[0];
        return BLOG_POSTS.find(b => b.slug === slug) || null;
      }
    }
    return null;
  });

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

  // 1. Fetch tools on startup & reload (uses fast compact 490KB index)
  const reloadToolsCatalog = () => {
    try {
      sessionStorage.removeItem('ed_tools_catalog_cache');
    } catch {}
    fetch('/assets/data/tools-compact.json')
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

  // Route resolver supporting /tools/:slug, /tool/:slug, /category/:slug, canonical path routes, and old URLs
  const resolveLocationRoute = (toolsList: ToolItem[]) => {
    const hash = window.location.hash.replace(/^#/, '');
    const pathname = window.location.pathname.replace(/\/+$/, '');

    const isCatalogLoaded = toolsList.length > 50;

    // 1. Hash-based route
    if (hash.startsWith('tool=')) {
      const slug = hash.replace('tool=', '');
      const match = toolsList.find(t => t.slug === slug || t.id === slug);
      if (match) {
        setSelectedTool(match);
        setCurrentView('catalog');
        return;
      }
      if (!isCatalogLoaded) {
        setSelectedTool(synthesizeToolFromSlug(slug));
        setCurrentView('catalog');
        reloadToolsCatalog();
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

    // 2. Clean pathname-based route (/tools/:slug or /tool/:slug)
    if (pathname.startsWith('/tools/') || pathname.startsWith('/tool/')) {
      const isSingular = pathname.startsWith('/tool/');
      const rawPath = isSingular ? pathname.replace('/tool/', '') : pathname.replace('/tools/', '');
      const parts = rawPath.split('/').filter(Boolean);

      if (parts.length >= 1) {
        const rawSlug = parts[parts.length - 1].toLowerCase().trim().replace(/^\/+|\/+$/g, '');
        const targetSlug = REDIRECT_SLUGS[rawSlug] || rawSlug;
        
        // 1. Check direct tool match
        const match = toolsList.find(t => 
          t.slug.toLowerCase() === targetSlug || 
          t.id.toLowerCase() === targetSlug ||
          t.slug.toLowerCase().replace(/-/g, '') === targetSlug.replace(/-/g, '')
        );

        if (match) {
          setSelectedTool(match);
          setCurrentView('catalog');
          if (isSingular || rawSlug !== match.slug || pathname.includes('//')) {
            window.history.replaceState({}, '', `/tools/${match.slug}`);
          }
          return;
        }

        // 2. Check category match
        const isCat = CATEGORY_HUBS_CONFIG.some(c => c.slug.toLowerCase() === targetSlug) || 
                      toolsList.some(t => t.category.toLowerCase() === targetSlug);
        if (isCat) {
          setActiveCategory(targetSlug);
          setSelectedTool(null);
          setCurrentView('category');
          return;
        }

        // 3. If catalog is loaded and tool does not exist -> 404 Not Found
        if (isCatalogLoaded) {
          setSelectedTool(null);
          setCurrentView('notfound');
          return;
        } else {
          reloadToolsCatalog();
          return;
        }
      }
    }

    if (pathname.startsWith('/category/')) {
      const catSlug = pathname.replace('/category/', '').split('/')[0];
      setActiveCategory(catSlug);
      setSelectedTool(null);
      setCurrentView('category');
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

    // Direct single slug route (e.g. /sha256-hash-generator)
    const cleanPath = pathname.replace(/^\//, '');
    if (cleanPath && !cleanPath.includes('/')) {
      const targetSlug = REDIRECT_SLUGS[cleanPath] || cleanPath;
      const match = toolsList.find(t => t.slug === targetSlug || t.id === targetSlug);
      if (match) {
        setSelectedTool(match);
        setCurrentView('catalog');
        window.history.replaceState({}, '', `/tools/${match.slug}`);
        return;
      }
      const isCat = CATEGORY_HUBS_CONFIG.some(c => c.slug === targetSlug);
      if (isCat) {
        setActiveCategory(targetSlug);
        setSelectedTool(null);
        setCurrentView('category');
        return;
      }
      if (isCatalogLoaded) {
        setSelectedTool(null);
        setCurrentView('notfound');
        return;
      } else {
        reloadToolsCatalog();
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
    // 1. Initial route sync with current tools
    resolveLocationRoute(tools);

    // 2. High-performance catalog loading
    const loadFullCatalog = () => {
      // Check cache first
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

      fetch('/assets/data/tools-compact.json')
        .then(res => {
          if (!res.ok) throw new Error(`HTTP ${res.status}`);
          return res.json();
        })
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

    // If on homepage, defer loading full 1,380 JSON catalog until first interaction or 6s idle
    // Eliminates the 2,260 ms critical path chaining penalty flagged by Lighthouse
    const isHomepage = window.location.pathname === '/' && !window.location.hash;
    if (isHomepage && tools.length >= 10) {
      let loaded = false;
      const triggerLoad = () => {
        if (loaded) return;
        loaded = true;
        loadFullCatalog();
        ['pointerdown', 'touchstart', 'scroll', 'keydown'].forEach(ev => {
          window.removeEventListener(ev, triggerLoad);
        });
      };

      ['pointerdown', 'touchstart', 'scroll', 'keydown'].forEach(ev => {
        window.addEventListener(ev, triggerLoad, { once: true, passive: true });
      });

      const idleTimer = setTimeout(triggerLoad, 6000);
      return () => {
        clearTimeout(idleTimer);
        ['pointerdown', 'touchstart', 'scroll', 'keydown'].forEach(ev => {
          window.removeEventListener(ev, triggerLoad);
        });
      };
    } else {
      loadFullCatalog();
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

  // 3. Theme management (White Mode and Dark Mode only)
  useEffect(() => {
    const stored = localStorage.getItem('ed_theme') as 'dark' | 'light' | null;
    const initial = stored === 'light' ? 'light' : 'dark';
    setTheme(initial);
    document.documentElement.setAttribute('data-theme', initial);
    document.documentElement.classList.toggle('dark', initial === 'dark');
    document.documentElement.classList.toggle('light', initial === 'light');
  }, []);

  // 4. Real Client-Side Analytics Tracking & GA4 SPA Events
  useEffect(() => {
    if (currentView !== 'admin') {
      recordPageView(currentView);

      // Transmit SPA route changes to Google Analytics 4
      if (typeof window !== 'undefined' && typeof (window as any).gtag === 'function') {
        const pagePath = selectedTool 
          ? `/tools/${selectedTool.slug}` 
          : (currentView === 'catalog' ? '/' : `/${currentView}`);
        
        const pageTitle = selectedTool 
          ? (selectedTool.metaTitle || `${selectedTool.name} - Free Online Tool | EncryptDecrypt.org`)
          : document.title;

        (window as any).gtag('event', 'page_view', {
          page_title: pageTitle,
          page_location: window.location.href,
          page_path: pagePath
        });
      }
    }
  }, [currentView, selectedTool]);

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
    document.documentElement.classList.toggle('dark', next === 'dark');
    document.documentElement.classList.toggle('light', next === 'light');
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
          setHeroOutput(heroBase64(heroInput));
        } else if (heroTab === 'url') {
          setHeroOutput(heroUrl(heroInput));
        } else if (heroTab === 'hash') {
          const h = await heroSha256(heroInput);
          setHeroOutput(h);
        } else if (heroTab === 'password') {
          setHeroOutput(heroPassword(24));
        }
      } catch (e: any) {
        setHeroOutput(`Error: ${e.message}`);
      }
    }
    runHero();
  }, [heroInput, heroTab]);

  // Navigate to a specific separate tool using clean URLs
  const handleSelectTool = (tool: ToolItem) => {
    preloadToolWorkspace();
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
    preloadToolWorkspace();
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
            aria-label="Go to EncryptDecrypt Home"
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
          <div className="relative flex-1 max-w-xs sm:max-w-md md:max-w-lg mx-1 sm:mx-4" ref={searchDropdownRef}>
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
                  aria-label="Search 1,380+ tools"
                  onFocus={() => {
                    setSearchFocused(true);
                    if (tools.length <= 50) reloadToolsCatalog();
                    preloadToolWorkspace();
                  }}
                  onKeyDown={handleSearchKeyDown}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setSearchFocused(true);
                    setSearchHighlightIndex(-1);
                    preloadToolWorkspace();
                  }}
                  placeholder="Search 1,380+ tools (e.g. aes, sha256, jwt, uuid)..."
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
                      aria-label="Clear search input"
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

            {/* Instant Live Search Results Dropdown - Fully Responsive & Mobile Viewport Safe */}
            {searchFocused && searchQuery.trim().length > 0 && (
              <div 
                className="fixed left-2 right-2 sm:absolute sm:left-0 sm:right-auto top-[58px] sm:top-full mt-1.5 bg-[var(--bg-surface)] border border-blue-500/30 rounded-xl shadow-2xl overflow-hidden z-50 max-h-[70vh] sm:max-h-[440px] sm:w-[500px] sm:max-w-[calc(100vw-32px)] overflow-y-auto divide-y divide-[var(--border-subtle)]"
              >
                <div className="p-2.5 text-[11px] font-mono text-[var(--text-muted)] bg-[var(--bg-surface-hover)] flex items-center justify-between">
                  <span className="font-semibold text-[var(--text-secondary)]">
                    Found {filteredTools.length} tools across all categories
                  </span>
                  <span className="text-[10px]">↑↓ navigate · Enter to open</span>
                </div>

                {searchQuickMatches.length === 0 ? (
                  <div className="p-5 text-center text-xs text-[var(--text-muted)]">
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
                        aria-label={`Open tool ${tool.name}`}
                        onClick={() => {
                          handleSelectTool(tool);
                          setSearchQuery('');
                          setSearchFocused(false);
                          setSearchHighlightIndex(-1);
                        }}
                        onMouseEnter={() => {
                          setSearchHighlightIndex(idx);
                          preloadToolWorkspace();
                        }}
                        onTouchStart={preloadToolWorkspace}
                        className={`w-full text-left px-3.5 py-2.5 transition flex flex-col gap-1 group cursor-pointer ${
                          isHighlighted ? 'bg-blue-500/15 border-l-3 border-[#2E9BFF]' : 'hover:bg-[var(--bg-surface-hover)]'
                        }`}
                      >
                        <div className="w-full flex items-center justify-between gap-3">
                          <span className={`text-xs sm:text-sm font-bold truncate ${
                            isHighlighted ? 'text-[#2E9BFF]' : 'text-[var(--text-primary)] group-hover:text-[#2E9BFF]'
                          }`}>
                            {tool.name}
                          </span>
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-500/10 text-[#2E9BFF] border border-blue-500/20 whitespace-nowrap shrink-0">
                            {tool.categoryName}
                          </span>
                        </div>
                        <p className="text-[11px] text-[var(--text-muted)] truncate w-full m-0">
                          {tool.shortDesc}
                        </p>
                      </button>
                    );
                  })
                )}

                {filteredTools.length > searchQuickMatches.length && (
                  <div className="p-2.5 bg-[var(--bg-surface-hover)] text-center border-t border-[var(--border-subtle)]">
                    <button
                      onClick={() => {
                        setSearchFocused(false);
                        const el = document.getElementById('catalog-grid');
                        if (el) el.scrollIntoView({ behavior: 'smooth' });
                      }}
                      aria-label="View all results in catalog below"
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
              aria-label="Navigate to Home"
              className={`px-3 py-2 min-h-[40px] rounded-lg text-xs font-semibold transition-colors duration-150 cursor-pointer ${
                !selectedTool && currentView === 'catalog'
                  ? 'text-sky-400 bg-blue-500/15 font-bold border border-blue-500/30'
                  : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-surface-hover)]'
              }`}
            >
              Home
            </button>
            <button
              onClick={() => handleNavigateView('all-tools')}
              aria-label="Navigate to All Tools Directory"
              className={`px-3 py-2 min-h-[40px] rounded-lg text-xs font-semibold transition-colors duration-150 cursor-pointer flex items-center gap-1.5 ${
                currentView === 'all-tools'
                  ? 'text-sky-400 bg-blue-500/15 font-bold border border-blue-500/30'
                  : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-surface-hover)]'
              }`}
            >
              <Terminal size={14} className="text-sky-400" />
              <span>All Tools Directory ({tools.length || '1,380+'})</span>
            </button>
            <button
              onClick={() => handleNavigateView('blog')}
              aria-label="Navigate to Master Blog"
              className={`px-3 py-2 min-h-[40px] rounded-lg text-xs font-semibold transition-colors duration-150 cursor-pointer flex items-center gap-1.5 ${
                currentView === 'blog'
                  ? 'text-sky-400 bg-blue-500/15 font-bold border border-blue-500/30'
                  : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-surface-hover)]'
              }`}
            >
              <BookOpen size={14} className="text-sky-400" />
              <span>Master Blog &amp; Guides</span>
            </button>
            <button
              onClick={() => handleNavigateView('guides')}
              aria-label="Navigate to Tech Guides"
              className={`px-3 py-2 min-h-[40px] rounded-lg text-xs font-semibold transition-colors duration-150 cursor-pointer ${
                currentView === 'guides'
                  ? 'text-sky-400 bg-blue-500/15 font-bold border border-blue-500/30'
                  : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-surface-hover)]'
              }`}
            >
              Tech Guides
            </button>
            <button
              onClick={() => handleNavigateView('about')}
              aria-label="Navigate to About Us"
              className={`px-3 py-2 min-h-[40px] rounded-lg text-xs font-semibold transition-colors duration-150 cursor-pointer ${
                currentView === 'about'
                  ? 'text-sky-400 bg-blue-500/15 font-bold border border-blue-500/30'
                  : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-surface-hover)]'
              }`}
            >
              About Us
            </button>
            <button
              onClick={() => handleNavigateView('contact')}
              aria-label="Navigate to Contact Us"
              className={`px-3 py-2 min-h-[40px] rounded-lg text-xs font-semibold transition-colors duration-150 cursor-pointer ${
                currentView === 'contact'
                  ? 'text-sky-400 bg-blue-500/15 font-bold border border-blue-500/30'
                  : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-surface-hover)]'
              }`}
            >
              Contact Us
            </button>
          </nav>

          {/* Action Controls */}
          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            <a
              href="https://www.buymeacoffee.com/encryptdecrypt" 
              target="_blank" 
              rel="noopener noreferrer"
              aria-label="Support this free project on Buy Me a Coffee"
              className="hidden sm:flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-lg bg-[#FFDD00] text-black font-bold text-[11px] sm:text-xs hover:bg-[#FFEA4C] transition shadow-sm border border-[#E5C700] cursor-pointer"
              title="Support this free project"
            >
              <span className="text-base leading-none">☕</span>
              <span className="hidden md:inline tracking-tight text-black">Buy me a coffee</span>
            </a>

            <button
              onClick={toggleAppTheme}
              className="p-2 sm:p-2.5 min-h-[40px] min-w-[40px] sm:min-h-[44px] sm:min-w-[44px] rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-surface)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:border-blue-400 transition-colors duration-150 cursor-pointer flex items-center justify-center gap-1.5 shadow-sm"
              title={`Switch to ${theme === 'dark' ? 'White' : 'Dark'} Mode`}
              aria-label={`Switch to ${theme === 'dark' ? 'White' : 'Dark'} Mode`}
              id="theme-toggle-btn"
            >
              {theme === 'dark' ? (
                <>
                  <Sun size={16} className="text-amber-400" />
                  <span className="text-[11px] font-semibold hidden xl:inline text-[var(--text-primary)]">White Mode</span>
                </>
              ) : (
                <>
                  <Moon size={16} className="text-[#2563EB]" />
                  <span className="text-[11px] font-semibold hidden xl:inline text-[var(--text-primary)]">Dark Mode</span>
                </>
              )}
            </button>

            <button
              onClick={() => setMobileMenuOpen(prev => !prev)}
              aria-label="Toggle navigation menu"
              className="p-2 min-h-[40px] min-w-[40px] rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-surface)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] lg:hidden cursor-pointer flex items-center justify-center shadow-sm"
              title="Toggle Menu"
            >
              {mobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-[var(--border-subtle)] bg-[var(--bg-surface)] px-4 py-3.5 space-y-1.5 shadow-2xl">
            <button
              onClick={handleBackToCatalog}
              aria-label="Navigate to Home"
              className={`w-full text-left px-3.5 py-2.5 rounded-lg text-xs font-semibold flex items-center justify-between cursor-pointer ${
                !selectedTool && currentView === 'catalog'
                  ? 'text-sky-400 bg-blue-500/15 border border-blue-500/30'
                  : 'text-[var(--text-primary)] hover:bg-[var(--bg-surface-hover)]'
              }`}
            >
              <span>Home (All Tools)</span>
              <ChevronRight size={14} className="text-[var(--text-muted)]" />
            </button>
            <button
              onClick={() => handleNavigateView('all-tools')}
              aria-label="Navigate to All Tools Directory"
              className={`w-full text-left px-3.5 py-2.5 rounded-lg text-xs font-semibold flex items-center justify-between cursor-pointer ${
                currentView === 'all-tools'
                  ? 'text-sky-400 bg-blue-500/15 border border-blue-500/30'
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
              onClick={() => handleNavigateView('blog')}
              aria-label="Navigate to Master Blog"
              className={`w-full text-left px-3.5 py-2.5 rounded-lg text-xs font-semibold flex items-center justify-between cursor-pointer ${
                currentView === 'blog'
                  ? 'text-amber-400 bg-amber-500/15 border border-amber-500/30 font-bold'
                  : 'text-[var(--text-primary)] hover:bg-[var(--bg-surface-hover)]'
              }`}
            >
              <span className="flex items-center gap-2">
                <BookOpen size={14} className="text-amber-400" />
                <span className="text-amber-400 font-bold">★ Master Blog &amp; Guides</span>
              </span>
              <ChevronRight size={14} className="text-[var(--text-muted)]" />
            </button>
            <button
              onClick={() => handleNavigateView('guides')}
              aria-label="Navigate to Tech Guides"
              className={`w-full text-left px-3.5 py-2.5 rounded-lg text-xs font-semibold flex items-center justify-between cursor-pointer ${
                currentView === 'guides'
                  ? 'text-sky-400 bg-blue-500/15 border border-blue-500/30'
                  : 'text-[var(--text-primary)] hover:bg-[var(--bg-surface-hover)]'
              }`}
            >
              <span>Tech Guides &amp; Whitepapers</span>
              <ChevronRight size={14} className="text-[var(--text-muted)]" />
            </button>
            <button
              onClick={() => handleNavigateView('about')}
              aria-label="Navigate to About Us"
              className={`w-full text-left px-3.5 py-2.5 rounded-lg text-xs font-semibold flex items-center justify-between cursor-pointer ${
                currentView === 'about'
                  ? 'text-sky-400 bg-blue-500/15 border border-blue-500/30'
                  : 'text-[var(--text-primary)] hover:bg-[var(--bg-surface-hover)]'
              }`}
            >
              <span>About Us (Ajay Ade &amp; Mission)</span>
              <ChevronRight size={14} className="text-[var(--text-muted)]" />
            </button>
            <button
              onClick={() => handleNavigateView('contact')}
              aria-label="Navigate to Contact Us"
              className={`w-full text-left px-3.5 py-2.5 rounded-lg text-xs font-semibold flex items-center justify-between cursor-pointer ${
                currentView === 'contact'
                  ? 'text-sky-400 bg-blue-500/15 border border-blue-500/30'
                  : 'text-[var(--text-primary)] hover:bg-[var(--bg-surface-hover)]'
              }`}
            >
              <span>Contact Us &amp; Technical Support</span>
              <ChevronRight size={14} className="text-[var(--text-muted)]" />
            </button>

            {/* Mobile Buy Me a Coffee Callout */}
            <a
              href="https://www.buymeacoffee.com/encryptdecrypt" 
              target="_blank" 
              rel="noopener noreferrer"
              aria-label="Support this free project on Buy Me a Coffee"
              className="w-full px-3.5 py-2.5 rounded-lg bg-[#FFDD00] text-black font-bold text-xs flex items-center justify-center gap-2 shadow-sm border border-[#E5C700] my-2 cursor-pointer hover:bg-[#FFEA4C] transition"
            >
              <span className="text-sm">☕</span>
              <span>Support EncryptDecrypt on Buy Me a Coffee</span>
            </a>

            <button
              onClick={() => {
                toggleAppTheme();
              }}
              aria-label={`Switch to ${theme === 'dark' ? 'White' : 'Dark'} Mode`}
              className="w-full text-left px-3.5 py-2.5 rounded-lg text-xs font-semibold text-[var(--text-primary)] hover:bg-[var(--bg-surface-hover)] flex items-center justify-between cursor-pointer border-t border-[var(--border-subtle)] my-1 pt-2.5"
            >
              <span className="flex items-center gap-2">
                {theme === 'dark' ? <Sun size={15} className="text-amber-400" /> : <Moon size={15} className="text-[#2563EB]" />}
                <span>Theme: {theme === 'dark' ? 'Dark' : 'White'} Mode</span>
              </span>
              <span className="px-2.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-blue-500/15 text-[#2563EB] dark:text-[#60A5FA]">
                Switch to {theme === 'dark' ? 'White' : 'Dark'}
              </span>
            </button>
            <div className="pt-2 border-t border-[var(--border-subtle)] flex items-center justify-around text-xs text-[var(--text-muted)]">
              <button onClick={() => handleNavigateView('privacy')} aria-label="Navigate to Privacy Policy" className="hover:text-[#2E9BFF] cursor-pointer py-1.5 px-2">Privacy</button>
              <span>·</span>
              <button onClick={() => handleNavigateView('terms')} aria-label="Navigate to Terms of Service" className="hover:text-[#2E9BFF] cursor-pointer py-1.5 px-2">Terms</button>
              <span>·</span>
              <button onClick={() => handleNavigateView('disclaimer')} aria-label="Navigate to Legal Disclaimer" className="hover:text-[#2E9BFF] cursor-pointer py-1.5 px-2">Disclaimer</button>
            </div>
          </div>
        )}
      </header>

      {/* Main Container */}
      <main className="container flex-1 py-6" id="main-content">
        <ErrorBoundary>
          <Suspense fallback={
            selectedTool ? (
              <ToolWorkspaceSkeleton tool={selectedTool} onBack={handleBackToCatalog} />
            ) : (
              <div className="flex flex-col items-center justify-center min-h-[50vh] text-[var(--text-muted)] gap-3">
                <RefreshCw size={24} className="animate-spin text-[#2E9BFF]" />
                <span className="text-sm font-semibold">Loading...</span>
              </div>
            )
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
          ) : currentView === 'blog' ? (
            selectedBlogPost ? (
              <BlogPostPage
                post={selectedBlogPost}
                onBackToBlog={() => {
                  setSelectedBlogPost(null);
                  window.history.pushState({}, '', '/blog');
                  window.scrollTo({ top: 0, behavior: 'instant' });
                }}
                onNavigateHome={handleBackToCatalog}
                onSelectToolBySlug={handleSelectToolBySlug}
              />
            ) : (
              <MasterBlogPage 
                onNavigateHome={handleBackToCatalog}
                onSelectToolBySlug={handleSelectToolBySlug}
                onNavigateGuides={() => handleNavigateView('guides')}
              />
            )
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
                  ? `Explore free client-side ${CATEGORY_HUBS_CONFIG.find(c => c.slug === activeCategory)?.name || activeCategory} developer utilities. Fast, private, and secure in your browser.`
                  : "1,360+ free client-side cryptographic & developer tools. AES-256, RSA, SHA-256, Base64, JWT, UUID & WebCrypto running in your browser memory."
                }
                canonicalUrl={activeCategory !== 'all'
                  ? `https://www.encryptdecrypt.org/category/${activeCategory}`
                  : "https://www.encryptdecrypt.org/"
                }
                keywords={['cryptography', 'base64', 'aes-256', 'sha-256', 'jwt debugger', 'developer tools', 'web crypto']}
                schemas={[
                  {
                    '@context': 'https://schema.org',
                    '@type': 'WebSite',
                    'name': 'EncryptDecrypt.org',
                    'url': 'https://www.encryptdecrypt.org/',
                    'description': 'Comprehensive suite of 1,360+ client-side developer utilities, cryptography tools, and encoders.',
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
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-[#2E9BFF] text-xs font-semibold mb-3">
                    <ShieldCheck size={14} />
                    <span>100% Client-Side Privacy · Browser Web Crypto API</span>
                  </div>
                  <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[var(--text-primary)] tracking-tight leading-tight mb-4">
                    Free Client-Side Encryption, Hashing &amp; Developer Tools
                  </h1>
                  <p className="text-[var(--text-secondary)] text-sm sm:text-base leading-relaxed">
                    Welcome to EncryptDecrypt.org. We built this website to give developers, students, and security professionals a simple, fast, and completely safe place to <strong>encrypt decrypt</strong> text, generate hashes, decode tokens, and convert data without risking sensitive information.
                  </p>
                  <p className="text-[var(--text-secondary)] text-sm sm:text-base mt-2.5 leading-relaxed">
                    Unlike typical online utilities that transmit your passwords or keys across the web to remote servers, every cryptographic tool on our platform runs entirely inside your browser using the native Web Cryptography API. Whether you need to <strong>encrypt decrypt</strong> payloads with AES-256, compute a SHA-256 checksum, inspect a JWT, or generate a random password, your data never leaves your computer.
                  </p>
                  <p className="text-[var(--text-secondary)] text-sm sm:text-base mt-2.5 leading-relaxed">
                    No user accounts, no hidden tracking, and no cloud uploads. You can even disconnect your internet and use our tools offline. It is completely free, transparent, and designed for genuine privacy.
                  </p>
                </div>

                <div className="theme-subcard rounded-xl p-4 sm:p-6 shadow-xl">
                  <div className="flex flex-wrap items-center justify-between gap-3 mb-4 pb-3 border-b border-[var(--border-subtle)]">
                    <div className="grid grid-cols-4 w-full sm:w-auto sm:flex items-center gap-1 sm:gap-1.5 bg-[var(--bg-input)] p-1 rounded-lg border border-[var(--border-subtle)] text-xs">
                      {(['base64', 'url', 'hash', 'password'] as const).map(tab => (
                        <button
                          key={tab}
                          onClick={() => setHeroTab(tab)}
                          className={`min-h-[40px] sm:min-h-[44px] px-2 sm:px-3.5 py-2 rounded-md font-semibold capitalize text-center text-[11px] sm:text-xs transition-colors duration-150 cursor-pointer flex items-center justify-center ${
                            heroTab === tab 
                              ? 'bg-[#1d4ed8] text-white font-bold shadow-xs' 
                              : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-surface-hover)]'
                          }`}
                        >
                          {tab === 'hash' ? 'SHA-256' : tab === 'password' ? 'Password' : tab.toUpperCase()}
                        </button>
                      ))}
                    </div>

                    <span className="text-[11px] sm:text-xs font-mono text-emerald-500 flex items-center gap-1 font-semibold w-full sm:w-auto justify-end sm:justify-start">
                      <ShieldCheck size={14} /> Instant Client-Side Preview
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <div className="flex items-center justify-between mb-3 text-xs">
                        <label htmlFor="hero-input-textarea" className="font-semibold text-[var(--text-primary)]">Input String</label>
                        <span className="text-[var(--text-muted)] font-mono font-medium">{heroInput.length} chars</span>
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
                        <label htmlFor="hero-output-textarea" className="font-semibold text-[var(--text-primary)]">Live Result</label>
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

              {/* 🛡️ Section 1: Why Our Tools Are Safe (100% Browser-Side) */}
              <section className="card-glass p-6 sm:p-8 mb-10 bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-2xl shadow-xs" id="why-safe">
                <div className="max-w-3xl mb-6">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold mb-2">
                    <ShieldCheck size={14} />
                    <span>Zero-Knowledge Privacy</span>
                  </div>
                  <h2 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-[var(--text-primary)] tracking-tight">
                    Why Our Tools Are Safe (100% Browser-Side)
                  </h2>
                  <p className="text-xs sm:text-sm text-[var(--text-secondary)] mt-1.5 leading-relaxed">
                    Most converter and utility websites send your secret keys or sensitive tokens to remote servers. EncryptDecrypt.org operates differently.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="p-4 sm:p-5 rounded-xl bg-[var(--bg-input)] border border-[var(--border-subtle)] flex flex-col justify-between">
                    <div>
                      <div className="w-10 h-10 rounded-lg bg-blue-500/10 border border-blue-500/20 text-[#2E9BFF] flex items-center justify-center mb-3">
                        <Cpu size={20} />
                      </div>
                      <h3 className="font-bold text-sm text-[var(--text-primary)] mb-1.5">
                        Native Web Crypto API
                      </h3>
                      <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                        All encryption, decryption, and hashing routines use standard browser-native cryptographic primitives (<code>crypto.subtle</code>) for hardware-accelerated execution.
                      </p>
                    </div>
                    <span className="text-[11px] font-mono text-emerald-400 font-semibold mt-3">
                      ✓ No external plugins
                    </span>
                  </div>

                  <div className="p-4 sm:p-5 rounded-xl bg-[var(--bg-input)] border border-[var(--border-subtle)] flex flex-col justify-between">
                    <div>
                      <div className="w-10 h-10 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center mb-3">
                        <ShieldCheck size={20} />
                      </div>
                      <h3 className="font-bold text-sm text-[var(--text-primary)] mb-1.5">
                        Zero Server Uploads
                      </h3>
                      <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                        Your plaintexts, secret keys, passwords, and sensitive files never leave your computer. We do not store, log, or transmit any user input data.
                      </p>
                    </div>
                    <span className="text-[11px] font-mono text-emerald-400 font-semibold mt-3">
                      ✓ 0 bytes sent over network
                    </span>
                  </div>

                  <div className="p-4 sm:p-5 rounded-xl bg-[var(--bg-input)] border border-[var(--border-subtle)] flex flex-col justify-between">
                    <div>
                      <div className="w-10 h-10 rounded-lg bg-purple-500/10 border border-purple-500/20 text-purple-400 flex items-center justify-center mb-3">
                        <Wifi size={20} />
                      </div>
                      <h3 className="font-bold text-sm text-[var(--text-primary)] mb-1.5">
                        Works 100% Offline
                      </h3>
                      <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                        You can test our privacy guarantee: turn off your Wi-Fi or inspect DevTools Network tab (F12). Our cryptographic tools continue running smoothly offline.
                      </p>
                    </div>
                    <span className="text-[11px] font-mono text-emerald-400 font-semibold mt-3">
                      ✓ Air-gap verifiable
                    </span>
                  </div>

                  <div className="p-4 sm:p-5 rounded-xl bg-[var(--bg-input)] border border-[var(--border-subtle)] flex flex-col justify-between">
                    <div>
                      <div className="w-10 h-10 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center mb-3">
                        <Eye size={20} />
                      </div>
                      <h3 className="font-bold text-sm text-[var(--text-primary)] mb-1.5">
                        No Cookies &amp; No Logins
                      </h3>
                      <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                        No accounts required, no hidden trackers for tools, and zero paywalls. Everything is open, transparent, and completely free for developers worldwide.
                      </p>
                    </div>
                    <span className="text-[11px] font-mono text-emerald-400 font-semibold mt-3">
                      ✓ Instant open access
                    </span>
                  </div>
                </div>
              </section>

              {/* ⚡ Section 2: Popular Tools (12 Featured Tools with Icons) */}
              <section className="card-glass p-6 sm:p-8 mb-10 bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-2xl shadow-xs" id="popular-tools">
                <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
                  <div>
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-[#2E9BFF] text-xs font-semibold mb-2">
                      <Star size={14} />
                      <span>Most Frequently Used</span>
                    </div>
                    <h2 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-[var(--text-primary)] tracking-tight m-0">
                      Popular Tools
                    </h2>
                    <p className="text-xs sm:text-sm text-[var(--text-muted)] mt-1">
                      Quickly access our 12 most-used client-side encryption, encoding, and developer utilities.
                    </p>
                  </div>
                  <button
                    onClick={() => handleNavigateView('all-tools')}
                    className="btn btn-secondary text-xs py-2 px-3.5 flex items-center gap-1.5 cursor-pointer font-semibold"
                  >
                    <span>View All Tools</span>
                    <ArrowRight size={14} />
                  </button>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3.5">
                  {POPULAR_12_TOOLS.map(pTool => {
                    const IconComponent = pTool.icon;
                    return (
                      <div
                        key={pTool.slug}
                        onClick={() => handleSelectToolBySlug(pTool.slug)}
                        onMouseEnter={preloadToolWorkspace}
                        onTouchStart={preloadToolWorkspace}
                        className="p-3.5 rounded-xl bg-[var(--bg-input)] border border-[var(--border-subtle)] hover:border-[#2E9BFF] hover:bg-[var(--bg-surface-hover)] transition flex flex-col justify-between cursor-pointer group shadow-2xs"
                      >
                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <div className="w-8 h-8 rounded-lg bg-blue-500/10 text-[#2E9BFF] group-hover:bg-[#2E9BFF] group-hover:text-white transition flex items-center justify-center shrink-0">
                              <IconComponent size={16} />
                            </div>
                            <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-[var(--bg-surface)] text-[var(--text-muted)] border border-[var(--border-subtle)]">
                              {pTool.category}
                            </span>
                          </div>

                          <h3 className="text-xs font-bold text-[var(--text-primary)] group-hover:text-[#2E9BFF] transition line-clamp-1 mb-1">
                            {pTool.name}
                          </h3>
                          <p className="text-[11px] text-[var(--text-muted)] line-clamp-2 leading-relaxed mb-3">
                            {pTool.desc}
                          </p>
                        </div>

                        <span className="text-[11px] font-semibold text-[#2E9BFF] flex items-center gap-1 group-hover:translate-x-1 transition pt-1 border-t border-[var(--border-subtle)]">
                          Open Tool <ArrowRight size={11} />
                        </span>
                      </div>
                    );
                  })}
                </div>
              </section>

              {/* 👥 Section 3: Who Uses Our Tools? */}
              <section className="card-glass p-6 sm:p-8 mb-10 bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-2xl shadow-xs" id="who-uses">
                <div className="max-w-3xl mb-6">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 text-xs font-semibold mb-2">
                    <UserCheck size={14} />
                    <span>Trusted Community</span>
                  </div>
                  <h2 className="text-xl sm:text-2xl font-bold text-[var(--text-primary)] tracking-tight">
                    Who Uses Our Tools?
                  </h2>
                  <p className="text-xs sm:text-sm text-[var(--text-secondary)] mt-1.5 leading-relaxed">
                    Over 100,000 developers, students, and engineers rely on EncryptDecrypt.org each month to inspect, transform, and protect data without risking confidentiality.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="p-4 rounded-xl bg-[var(--bg-input)] border border-[var(--border-subtle)]">
                    <div className="w-8 h-8 rounded-lg bg-blue-500/10 border border-blue-500/20 text-[#2E9BFF] flex items-center justify-center font-bold text-xs mb-3">
                      FE
                    </div>
                    <h3 className="font-bold text-sm text-[var(--text-primary)] mb-1">Frontend Developers</h3>
                    <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                      Formatting JSON payloads, inspecting JWT auth claims, testing Base64 strings, and generating UUIDs during day-to-day web development.
                    </p>
                  </div>

                  <div className="p-4 rounded-xl bg-[var(--bg-input)] border border-[var(--border-subtle)]">
                    <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-xs mb-3">
                      BE
                    </div>
                    <h3 className="font-bold text-sm text-[var(--text-primary)] mb-1">Backend &amp; DevOps</h3>
                    <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                      Validating HMAC API webhooks, computing SHA-256 release checksums, generating strong passphrases, and calculating chmod octal masks.
                    </p>
                  </div>

                  <div className="p-4 rounded-xl bg-[var(--bg-input)] border border-[var(--border-subtle)]">
                    <div className="w-8 h-8 rounded-lg bg-purple-500/10 border border-purple-500/20 text-purple-400 flex items-center justify-center font-bold text-xs mb-3">
                      SEC
                    </div>
                    <h3 className="font-bold text-sm text-[var(--text-primary)] mb-1">Security Analysts</h3>
                    <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                      Inspecting SSL/TLS certificates, validating cipher modes (GCM vs CBC), and testing encoding anomalies safely without external leaks.
                    </p>
                  </div>

                  <div className="p-4 rounded-xl bg-[var(--bg-input)] border border-[var(--border-subtle)]">
                    <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center font-bold text-xs mb-3">
                      EDU
                    </div>
                    <h3 className="font-bold text-sm text-[var(--text-primary)] mb-1">Students &amp; Learners</h3>
                    <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                      Gaining a hands-on understanding of cryptographic algorithms, hash collisions, and mathematical standards for college and university courses.
                    </p>
                  </div>
                </div>
              </section>

              {/* 📚 Section 4: From Our Blog: Security & Cryptography Guides */}
              <section className="card-glass p-6 sm:p-8 mb-10 bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-2xl shadow-xs" id="blog-guides">
                <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
                  <div>
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-[#2E9BFF] text-xs font-semibold mb-2">
                      <BookOpen size={14} />
                      <span>Educational Tutorials</span>
                    </div>
                    <h2 className="text-xl sm:text-2xl font-bold text-[var(--text-primary)] tracking-tight m-0">
                      From Our Blog: Security &amp; Cryptography Guides
                    </h2>
                    <p className="text-xs sm:text-sm text-[var(--text-muted)] mt-1">
                      Detailed, human-written tutorials with practical code examples. Reviewed by Ajay Rathod.
                    </p>
                  </div>
                  <button
                    onClick={() => handleNavigateView('blog')}
                    className="btn btn-secondary text-xs py-2 px-3.5 flex items-center gap-1.5 cursor-pointer font-semibold"
                  >
                    <span>View All 5 Guides</span>
                    <ArrowRight size={14} />
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {BLOG_POSTS.slice(0, 3).map(post => (
                    <article
                      key={post.slug}
                      onClick={() => {
                        setSelectedBlogPost(post);
                        setCurrentView('blog');
                        window.history.pushState({}, '', `/blog/${post.slug}`);
                        window.scrollTo({ top: 0, behavior: 'instant' });
                      }}
                      className="p-5 rounded-xl bg-[var(--bg-input)] border border-[var(--border-subtle)] hover:border-blue-500/50 hover:shadow-md transition flex flex-col justify-between cursor-pointer group"
                    >
                      <div>
                        <div className="flex items-center justify-between text-xs text-[var(--text-muted)] mb-2.5">
                          <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-blue-500/10 text-sky-400 border border-blue-500/20">
                            {post.category}
                          </span>
                          <span className="text-[11px] font-mono flex items-center gap-1">
                            <Clock size={11} /> {post.readTime}
                          </span>
                        </div>
                        <h3 className="font-bold text-sm sm:text-base text-[var(--text-primary)] group-hover:text-[#2E9BFF] transition leading-snug mb-2">
                          {post.title}
                        </h3>
                        <p className="text-xs text-[var(--text-secondary)] line-clamp-3 leading-relaxed mb-4">
                          {post.excerpt}
                        </p>
                      </div>
                      <div className="pt-3 border-t border-[var(--border-subtle)] flex items-center justify-between text-xs">
                        <span className="text-[11px] text-[var(--text-muted)] flex items-center gap-1">
                          <User size={11} /> {post.author}
                        </span>
                        <span className="text-xs font-semibold text-[#2E9BFF] flex items-center gap-1 group-hover:translate-x-0.5 transition">
                          Read Guide →
                        </span>
                      </div>
                    </article>
                  ))}
                </div>
              </section>

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
                      aria-label="Search tool categories"
                      onChange={(e) => setCategorySearchQuery(e.target.value)}
                      placeholder="Search categories..."
                      className="w-full sm:w-56 h-8 bg-[var(--bg-input)] border border-[var(--border-subtle)] focus:border-[#2E9BFF] rounded-lg px-2.5 text-[11px] text-[var(--text-primary)] placeholder:text-[var(--text-muted)] font-mono"
                    />
                    {categorySearchQuery && (
                      <button 
                        onClick={() => setCategorySearchQuery('')} 
                        aria-label="Clear category search"
                        className="text-[var(--text-muted)] hover:text-[var(--text-primary)] cursor-pointer"
                      >
                        <X size={14} />
                      </button>
                    )}
                    {activeCategory !== 'all' && (
                      <button
                        onClick={() => setActiveCategory('all')}
                        aria-label="Clear active category filter"
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
                        aria-label={`Browse ${hub.name} tools`}
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
                              isActive ? 'bg-[#1d4ed8] text-white' : 'bg-[var(--bg-surface-hover)] text-[var(--text-primary)] border border-[var(--border-subtle)]'
                            }`}>
                              {count}
                            </span>
                          </div>
                          <h3 className={`text-[11px] font-bold leading-tight text-center line-clamp-2 w-full ${isActive ? 'text-[#2E9BFF]' : 'text-[var(--text-primary)] group-hover:text-[#2E9BFF]'}`}>
                            {hub.name}
                          </h3>
                        </div>
                        <span className="text-[10px] text-[var(--text-muted)] text-center line-clamp-1 mt-1 font-mono w-full">
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
                    aria-label="View All Tools Directory"
                    className="px-5 py-3 min-h-[48px] rounded-lg text-xs font-semibold transition-colors duration-150 cursor-pointer border bg-[#1d4ed8] hover:bg-[#1e40af] text-white border-blue-500 shadow-sm flex items-center gap-2"
                  >
                    <Layers size={14} />
                    <span>View All Tools ({tools.length || '1,380+'})</span>
                  </button>

                  <button
                    onClick={() => handleSelectCategory('favorites')}
                    aria-label="View Favorite Tools"
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
                      aria-label={`Filter by ${hub.name}`}
                      onClick={() => handleSelectCategory(hub.slug)}
                      className={`px-4 py-3 min-h-[48px] rounded-lg text-xs whitespace-nowrap transition-colors duration-150 cursor-pointer border flex items-center gap-2 ${
                        activeCategory === hub.slug
                          ? 'bg-[#1d4ed8] text-white border-blue-500 font-bold shadow-sm'
                          : 'bg-[var(--bg-surface)] text-[var(--text-secondary)] border-[var(--border-subtle)] hover:border-blue-400 hover:text-[var(--text-primary)]'
                      }`}
                    >
                      <span>{hub.name}</span>
                      <span className="text-[10px] font-mono text-[var(--text-muted)]">({categoryCounts[hub.slug] || hub.count})</span>
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
                        aria-label="Search tools catalog"
                        onFocus={() => {
                          if (tools.length <= 50) reloadToolsCatalog();
                        }}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search 1,380+ tools (e.g. aes, qr, sha256)..."
                        className="w-full h-9 bg-[var(--bg-input)] border border-[var(--border-subtle)] rounded-lg px-3 pr-9 text-xs text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:border-[#2E9BFF] focus:ring-1 focus:ring-[#2E9BFF] transition leading-normal"
                        id="catalog-search-input"
                      />
                      {searchQuery && (
                        <div className="absolute inset-y-0 right-0 pr-2 flex items-center">
                          <button
                            onClick={() => setSearchQuery('')}
                            aria-label="Clear catalog search"
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
                        aria-label="Reset search filter"
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
                      aria-label="Reset search filter and show top 10 tools"
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
                    <h3 className="text-base font-bold text-[var(--text-primary)] mb-1">
                      No tools found matching &ldquo;{searchQuery}&rdquo;
                    </h3>
                    <p className="text-xs text-slate-300 mb-5 max-w-md mx-auto">
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
                          aria-label={`Search for ${item.name}`}
                          onClick={() => setSearchQuery(item.query)}
                          className="px-3 py-1.5 text-xs rounded-lg bg-[var(--bg-surface-hover)] border border-[var(--border-subtle)] text-slate-200 hover:text-sky-300 hover:border-sky-400/40 cursor-pointer transition font-medium"
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
                      aria-label="View all tools in catalog"
                      className="btn btn-primary text-xs py-2 px-5 inline-flex items-center gap-1.5 cursor-pointer"
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
                          onMouseEnter={preloadToolWorkspace}
                          onTouchStart={preloadToolWorkspace}
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
                            <h3 className="text-sm font-bold text-[var(--text-primary)] group-hover:text-[#2E9BFF] transition-colors duration-150 mb-1.5 leading-snug">
                              {tool.name}
                            </h3>
                            <p className="text-xs text-[var(--text-secondary)] line-clamp-2 leading-relaxed mb-3">
                              {tool.shortDesc}
                            </p>
                          </div>

                          <div className="pt-2 border-t border-[var(--border-subtle)] flex items-center justify-between">
                            <span className="text-[11px] text-[var(--text-muted)] font-mono">
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
                            <h3 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-[var(--text-primary)] mb-3 tracking-tight text-center leading-snug">
                              Explore All {tools.length || '1,380'}+ Developer Utilities &amp; Cryptographic Tools
                            </h3>
                            <p className="text-xs sm:text-sm text-slate-300 mb-6 leading-relaxed max-w-xl mx-auto text-center">
                              Showing top 10 featured tools above. EncryptDecrypt.org features over 1,380+ free client-side tools across {allCategoryHubs.length} categories — calculated 100% in your browser RAM with zero server transmission.
                            </p>

                            <div className="flex flex-wrap items-center justify-center gap-3">
                              <button
                                onClick={() => handleNavigateView('all-tools')}
                                aria-label="View All Tools Directory"
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
                                aria-label="Browse all tool categories"
                                className="btn btn-secondary px-5 py-3 text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 cursor-pointer"
                              >
                                <span>Browse by Category ({allCategoryHubs.length})</span>
                              </button>
                            </div>
                          </div>
                        </div>

                        {/* ⚡ E-E-A-T Author & Freshness Metadata Signal */}
                        <div className="mb-10 p-4 sm:p-5 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] flex flex-wrap items-center justify-between gap-3 text-xs text-[var(--text-secondary)] shadow-xs">
                          <div className="flex items-center gap-3">
                            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 shrink-0 ring-4 ring-emerald-500/10"></span>
                            <div>
                              <span>Authored &amp; Maintained by: <strong className="text-[var(--text-primary)]">Ajay Rathod</strong> (Founder &amp; Developer · Maharashtra, India) · </span>
                              <span className="text-[var(--text-muted)] font-mono">Peer-reviewed against NIST FIPS &amp; IETF RFC benchmarks</span>
                            </div>
                          </div>
                          <div className="flex items-center gap-3 font-mono text-[11px] text-[var(--text-muted)] shrink-0">
                            <a href="mailto:support@encryptdecrypt.org" className="text-[#2E9BFF] hover:underline">support@encryptdecrypt.org</a>
                            <span>·</span>
                            <span>Updated: <time dateTime="2026-11-01">October 2026</time></span>
                          </div>
                        </div>

                        {/* ⚡ Architectural Deep Dive: Zero-Knowledge Client-Side Computing */}
                        <section className="card-glass p-6 sm:p-8 mb-10 bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-2xl shadow-xs" id="architecture-overview">
                          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-[#2E9BFF] text-xs font-semibold mb-3">
                            <Shield size={14} />
                            <span>Security Architecture &amp; Privacy Model</span>
                          </div>
                          <h2 className="text-xl sm:text-2xl font-bold text-[var(--text-primary)] mb-3">
                            In-Browser Client-Side Cryptography: Zero-Knowledge Architecture
                          </h2>
                          <p className="text-xs sm:text-sm text-[var(--text-secondary)] leading-relaxed mb-4">
                            Most conventional online converters and formatting websites process user data by transmitting payloads over the internet to remote backend servers (typically running PHP, Python, or Node.js). Even with HTTPS encryption in transit, this cloud-centric model exposes sensitive tokens, database passwords, confidential SQL dumps, and private cryptographic keys to server-side access logs, edge CDN caches, cloud provider telemetry, and potential intermediate process compromise.
                          </p>
                          <p className="text-xs sm:text-sm text-[var(--text-secondary)] leading-relaxed mb-5">
                            <strong>EncryptDecrypt.org operates on an uncompromising zero-knowledge architecture:</strong> Every cryptographic calculation, hashing routine, format transformation, and encoding operation executes natively within the volatile memory (RAM) of your web browser via standard ECMAScript engines and the hardware-accelerated W3C Web Cryptography API (<code>window.crypto.subtle</code>). Zero bytes of cryptographic plaintext, ciphertexts, secret keys, or hashes are transmitted across the network.
                          </p>

                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                            <div className="p-4 rounded-xl bg-[var(--bg-input)] border border-[var(--border-subtle)]">
                              <h3 className="text-xs font-bold text-[var(--text-primary)] mb-1.5 flex items-center gap-1.5">
                                <span className="w-2 h-2 rounded-full bg-emerald-400"></span> Hardware Acceleration
                              </h3>
                              <p className="text-[11px] text-[var(--text-secondary)] leading-relaxed">
                                Modern browsers delegate WebCrypto primitives to native CPU instructions (such as Intel AES-NI and ARM Cryptography Extensions), achieving constant-time execution and gigabit-per-second encryption throughput.
                              </p>
                            </div>
                            <div className="p-4 rounded-xl bg-[var(--bg-input)] border border-[var(--border-subtle)]">
                              <h3 className="text-xs font-bold text-[var(--text-primary)] mb-1.5 flex items-center gap-1.5">
                                <span className="w-2 h-2 rounded-full bg-blue-400"></span> Memory Sandbox Isolation
                              </h3>
                              <p className="text-[11px] text-[var(--text-secondary)] leading-relaxed">
                                Tool calculations reside inside browser tab memory sandboxes. Once you refresh or close the tab, the volatile RAM buffers are garbage collected, leaving zero persistent storage or server disk traces.
                              </p>
                            </div>
                            <div className="p-4 rounded-xl bg-[var(--bg-input)] border border-[var(--border-subtle)]">
                              <h3 className="text-xs font-bold text-[var(--text-primary)] mb-1.5 flex items-center gap-1.5">
                                <span className="w-2 h-2 rounded-full bg-purple-400"></span> Verifiable Offline Mode
                              </h3>
                              <p className="text-[11px] text-[var(--text-secondary)] leading-relaxed">
                                You can test our zero-log guarantee: disconnect your workstation from Wi-Fi or monitor DevTools Network tab (F12). All cryptographic tools execute seamlessly offline without network packets.
                              </p>
                            </div>
                          </div>

                          {/* Key Statistics */}
                          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center pt-2 border-t border-[var(--border-subtle)]">
                            <div className="p-3 rounded-xl bg-[var(--bg-input)] border border-[var(--border-subtle)]">
                              <div className="text-xl font-bold text-sky-400 font-mono">1,380+</div>
                              <div className="text-[11px] text-[var(--text-muted)] mt-0.5">Separate Utilities</div>
                            </div>
                            <div className="p-3 rounded-xl bg-[var(--bg-input)] border border-[var(--border-subtle)]">
                              <div className="text-xl font-bold text-emerald-400 font-mono">0 Bytes</div>
                              <div className="text-[11px] text-[var(--text-muted)] mt-0.5">Crypto Network Transit</div>
                            </div>
                            <div className="p-3 rounded-xl bg-[var(--bg-input)] border border-[var(--border-subtle)]">
                              <div className="text-xl font-bold text-amber-400 font-mono">256 Bits</div>
                              <div className="text-[11px] text-[var(--text-muted)] mt-0.5">AES Military Strength</div>
                            </div>
                            <div className="p-3 rounded-xl bg-[var(--bg-input)] border border-[var(--border-subtle)]">
                              <div className="text-xl font-bold text-purple-400 font-mono">100% Free</div>
                              <div className="text-[11px] text-[var(--text-muted)] mt-0.5">Open Developer Access</div>
                            </div>
                          </div>
                        </section>

                        {/* ⚡ Section 1: Core Cryptographic Standards & Verified Academic Citations */}
                        <section className="card-glass p-6 sm:p-8 mb-10 bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-2xl shadow-xs" id="cryptographic-standards">
                          <h2 className="text-xl sm:text-2xl font-bold text-[var(--text-primary)] mb-3">
                            Core Cryptographic Standards &amp; Verified Citations
                          </h2>
                          <p className="text-xs sm:text-sm text-[var(--text-secondary)] leading-relaxed mb-4">
                            EncryptDecrypt.org operates strictly under peer-reviewed international standards defined by the National Institute of Standards and Technology (NIST), the Internet Engineering Task Force (IETF), and the World Wide Web Consortium (W3C). Standard ciphers execute natively through the browser&rsquo;s hardware-accelerated Web Cryptography API.
                          </p>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-5">
                            <blockquote className="p-4 rounded-xl bg-[var(--bg-input)] border-l-4 border-blue-500 text-xs text-[var(--text-secondary)] italic" cite="https://csrc.nist.gov/publications/detail/sp/800-38d/final">
                              <p className="mb-2">&ldquo;Galois/Counter Mode (GCM) is an authenticated encryption algorithm designed to provide both data authenticity (integrity) and confidentiality with high throughput in hardware and software implementations.&rdquo;</p>
                              <cite className="block not-italic font-semibold text-sky-400">— NIST Special Publication 800-38D (Block Cipher Modes of Operation: Galois/Counter Mode)</cite>
                            </blockquote>

                            <blockquote className="p-4 rounded-xl bg-[var(--bg-input)] border-l-4 border-emerald-500 text-xs text-[var(--text-secondary)] italic" cite="https://www.w3.org/TR/WebCryptoAPI/">
                              <p className="mb-2">&ldquo;The Web Cryptography API provides cryptographic operations in web applications, such as hash generation, digital signatures, key generation, and symmetric/asymmetric encryption, executing natively within the browser host without network exposure.&rdquo;</p>
                              <cite className="block not-italic font-semibold text-emerald-400">— W3C Web Cryptography API Recommendation (W3C Consortium)</cite>
                            </blockquote>
                          </div>

                          <div className="p-4 rounded-xl bg-[var(--bg-input)] border border-[var(--border-subtle)] text-xs text-[var(--text-secondary)] mb-5">
                            <blockquote className="italic" cite="https://datatracker.ietf.org/doc/html/rfc4648">
                              <p className="mb-1">&ldquo;The Base 64, Base 32, and Base 16 Data Encodings represent arbitrary sequences of binary octets in a form that is human-readable and safe for text-only transfer systems.&rdquo;</p>
                              <cite className="block not-italic font-semibold text-purple-400">— IETF RFC 4648 (Internet Standards Track Specification)</cite>
                            </blockquote>
                          </div>
                        </section>

                        {/* ⚡ Section 2: Comparative Algorithm Reference Matrix (Table) */}
                        <section className="card-glass p-6 sm:p-8 mb-10 bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-2xl shadow-xs" id="algorithm-matrix">
                          <h2 className="text-xl sm:text-2xl font-bold text-[var(--text-primary)] mb-2">
                            Comparative Cryptographic Algorithm Reference Matrix
                          </h2>
                          <p className="text-xs sm:text-sm text-[var(--text-secondary)] leading-relaxed mb-5">
                            Compare core cryptographic algorithms supported natively in your browser. All algorithms adhere to official RFC and NIST FIPS specifications.
                          </p>

                          <div className="overflow-x-auto">
                            <table className="w-full text-left text-xs text-[var(--text-secondary)] border-collapse">
                              <thead>
                                <tr className="border-b border-[var(--border-subtle)] bg-[var(--bg-input)] text-[var(--text-primary)] font-semibold">
                                  <th className="p-3">Cryptographic Algorithm</th>
                                  <th className="p-3">Standard Specification</th>
                                  <th className="p-3">Key / Digest Length</th>
                                  <th className="p-3">Primary Purpose</th>
                                  <th className="p-3">Cryptographic Status &amp; Application</th>
                                </tr>
                              </thead>
                              <tbody className="divide-y divide-[var(--border-subtle)]">
                                <tr className="hover:bg-[var(--bg-surface-hover)]">
                                  <td className="p-3 font-semibold text-[var(--text-primary)]">AES-256-GCM</td>
                                  <td className="p-3 font-mono text-sky-400">NIST SP 800-38D</td>
                                  <td className="p-3 font-mono">256 bits</td>
                                  <td className="p-3">Authenticated Symmetric Encryption (AEAD)</td>
                                  <td className="p-3"><span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-semibold">NIST SP 800-38D (AEAD)</span></td>
                                </tr>
                                <tr className="hover:bg-[var(--bg-surface-hover)]">
                                  <td className="p-3 font-semibold text-[var(--text-primary)]">AES-256-CBC</td>
                                  <td className="p-3 font-mono text-sky-400">NIST FIPS 197</td>
                                  <td className="p-3 font-mono">256 bits</td>
                                  <td className="p-3">Legacy Symmetric Encryption (Requires Separate MAC)</td>
                                  <td className="p-3"><span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-400 font-semibold">NIST FIPS 197 Approved</span></td>
                                </tr>
                                <tr className="hover:bg-[var(--bg-surface-hover)]">
                                  <td className="p-3 font-semibold text-[var(--text-primary)]">SHA-256</td>
                                  <td className="p-3 font-mono text-sky-400">FIPS PUB 180-4 / RFC 6234</td>
                                  <td className="p-3 font-mono">256-bit Digest</td>
                                  <td className="p-3">Cryptographic Checksum, Digital Signatures</td>
                                  <td className="p-3"><span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-semibold">NIST FIPS 180-4 Approved</span></td>
                                </tr>
                                <tr className="hover:bg-[var(--bg-surface-hover)]">
                                  <td className="p-3 font-semibold text-[var(--text-primary)]">SHA-512</td>
                                  <td className="p-3 font-mono text-sky-400">FIPS PUB 180-4 / RFC 6234</td>
                                  <td className="p-3 font-mono">512-bit Digest</td>
                                  <td className="p-3">High-Security Collision-Resistant Hashing</td>
                                  <td className="p-3"><span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-semibold">NIST FIPS 180-4 Approved</span></td>
                                </tr>
                                <tr className="hover:bg-[var(--bg-surface-hover)]">
                                  <td className="p-3 font-semibold text-[var(--text-primary)]">HMAC-SHA256</td>
                                  <td className="p-3 font-mono text-sky-400">IETF RFC 2104</td>
                                  <td className="p-3 font-mono">Variable Secret Key</td>
                                  <td className="p-3">Keyed-Hash Message Authentication (API Signatures)</td>
                                  <td className="p-3"><span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-semibold">IETF RFC 2104 Standard</span></td>
                                </tr>
                                <tr className="hover:bg-[var(--bg-surface-hover)]">
                                  <td className="p-3 font-semibold text-[var(--text-primary)]">ChaCha20-Poly1305</td>
                                  <td className="p-3 font-mono text-sky-400">IETF RFC 8439</td>
                                  <td className="p-3 font-mono">256-bit Key</td>
                                  <td className="p-3">High-Speed AEAD Stream Cipher for Mobile</td>
                                  <td className="p-3"><span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-semibold">IETF RFC 8439 Standard</span></td>
                                </tr>
                                <tr className="hover:bg-[var(--bg-surface-hover)]">
                                  <td className="p-3 font-semibold text-[var(--text-primary)]">Base64 / Hex</td>
                                  <td className="p-3 font-mono text-sky-400">IETF RFC 4648</td>
                                  <td className="p-3 font-mono">Radix-64 / Radix-16</td>
                                  <td className="p-3">Binary-to-Text Encoding (Not Encryption)</td>
                                  <td className="p-3"><span className="px-2 py-0.5 rounded bg-blue-500/20 text-blue-400 font-semibold">IETF RFC 4648 Standard</span></td>
                                </tr>
                                <tr className="hover:bg-[var(--bg-surface-hover)]">
                                  <td className="p-3 font-semibold text-[var(--text-primary)]">JWT Debugger</td>
                                  <td className="p-3 font-mono text-sky-400">IETF RFC 7519</td>
                                  <td className="p-3 font-mono">HS256 / RS256 / ES256</td>
                                  <td className="p-3">Claims-based Identity Token Inspection</td>
                                  <td className="p-3"><span className="px-2 py-0.5 rounded bg-purple-500/20 text-purple-400 font-semibold">IETF RFC 7519 Standard</span></td>
                                </tr>
                              </tbody>
                            </table>
                          </div>
                        </section>

                        {/* ⚡ Section 3: Developer Security Guidelines & Anti-Pattern Prevention */}
                        <section className="card-glass p-6 sm:p-8 mb-10 bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-2xl shadow-xs" id="security-guidelines">
                          <h2 className="text-xl sm:text-2xl font-bold text-[var(--text-primary)] mb-3">
                            Developer Implementation Guidelines &amp; Anti-Pattern Prevention
                          </h2>
                          <p className="text-xs sm:text-sm text-[var(--text-secondary)] leading-relaxed mb-5">
                            Building secure software systems requires understanding not just what algorithms do, but how common implementation mistakes introduce vulnerabilities:
                          </p>

                          <div className="space-y-4 text-xs sm:text-sm">
                            <div className="p-4 rounded-xl bg-[var(--bg-input)] border border-[var(--border-subtle)]">
                              <h3 className="font-bold text-[var(--text-primary)] mb-1.5 flex items-center gap-2">
                                <span className="text-rose-400 font-mono">1.</span> Never Reuse Nonces or IVs with AES-GCM or ChaCha20
                              </h3>
                              <p className="text-[var(--text-secondary)] leading-relaxed">
                                In Galois/Counter Mode (AES-GCM), reusing the same 96-bit Initialization Vector (IV) with the identical secret key catastrophic reveals the internal GHASH authentication subkey. Once compromised, an active attacker can forge arbitrary ciphertexts without knowing the secret key. Always generate a fresh 12-byte cryptographically random IV via <code>crypto.getRandomValues(new Uint8Array(12))</code> for every distinct encryption operation.
                              </p>
                            </div>

                            <div className="p-4 rounded-xl bg-[var(--bg-input)] border border-[var(--border-subtle)]">
                              <h3 className="font-bold text-[var(--text-primary)] mb-1.5 flex items-center gap-2">
                                <span className="text-rose-400 font-mono">2.</span> Base64 is Data Encoding, NOT Encryption
                              </h3>
                              <p className="text-[var(--text-secondary)] leading-relaxed">
                                A frequent antipattern among junior developers is treating Base64, Hex, or URL encoding as a security layer. RFC 4648 encodings represent binary data in printable ASCII characters to prevent corruption over text-only protocols (e.g., SMTP or JSON). Encodings possess zero secrecy and can be decoded instantaneously by any observer without a key. Confidentiality requires true symmetric ciphers (AES-256-GCM) or asymmetric cryptography (RSA-OAEP).
                              </p>
                            </div>

                            <div className="p-4 rounded-xl bg-[var(--bg-input)] border border-[var(--border-subtle)]">
                              <h3 className="font-bold text-[var(--text-primary)] mb-1.5 flex items-center gap-2">
                                <span className="text-rose-400 font-mono">3.</span> Never Use Fast Hashes (MD5, SHA-1, SHA-256) for Password Storage
                              </h3>
                              <p className="text-[var(--text-secondary)] leading-relaxed">
                                General-purpose cryptographic hashes (like SHA-256) are designed for maximum hardware throughput (verifying gigabyte files in seconds). A consumer GPU can compute billions of SHA-256 hashes per second, making raw hashed passwords trivially vulnerable to offline dictionary and rainbow table attacks. For password authentication, NIST SP 800-63B mandates memory-hard, computationally expensive key derivation functions: <strong>Argon2id</strong> (preferred), <strong>bcrypt</strong>, or <strong>PBKDF2</strong> with at least 600,000 iterations.
                              </p>
                            </div>

                            <div className="p-4 rounded-xl bg-[var(--bg-input)] border border-[var(--border-subtle)]">
                              <h3 className="font-bold text-[var(--text-primary)] mb-1.5 flex items-center gap-2">
                                <span className="text-rose-400 font-mono">4.</span> Constant-Time Comparison to Prevent Timing Side-Channels
                              </h3>
                              <p className="text-[var(--text-secondary)] leading-relaxed">
                                When verifying HMAC signatures, API authentication tokens, or password hashes, never use standard string equality operators (e.g. <code>===</code> or <code>strcmp</code>). Standard equality checks terminate early on the first mismatched byte, allowing attackers to deduce valid signatures byte-by-byte via microsecond timing measurements. Use constant-time comparison algorithms (such as <code>crypto.timingSafeEqual()</code>) that examine every byte regardless of mismatch location.
                              </p>
                            </div>
                          </div>
                        </section>

                        {/* ⚡ Section 4: Question-Style Headings with Answer-First Structure (FAQ) */}
                        <section className="card-glass p-6 sm:p-8 mb-10 bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-2xl shadow-xs" id="faq-section">
                          <h2 className="text-xl sm:text-2xl font-bold text-[var(--text-primary)] mb-6">
                            Frequently Asked Questions: Browser-Based Cryptography &amp; Security
                          </h2>

                          <div className="space-y-4">
                            <article className="p-4 rounded-xl bg-[var(--bg-input)] border border-[var(--border-subtle)]">
                              <h3 className="text-sm sm:text-base font-bold text-[var(--text-primary)] mb-2">
                                How does client-side Web Cryptography guarantee zero server transmission?
                              </h3>
                              <p className="text-xs sm:text-sm text-[var(--text-secondary)] leading-relaxed mb-2">
                                <strong>Direct Answer:</strong> Client-side Web Cryptography operates exclusively within the isolated sandbox memory (RAM) of your web browser via the W3C Web Cryptography API. Zero bytes of sensitive plaintext, encryption keys, or cryptographic hashes are transmitted across the internet to any external server.
                              </p>
                              <p className="text-xs text-[var(--text-muted)] leading-relaxed">
                                Unlike traditional cloud-based encryption utilities that process user data on remote backends, EncryptDecrypt.org utilizes browser-native primitives (such as <code>window.crypto.subtle</code>). This ensures complete zero-knowledge architecture: even if the network connection is disconnected, tools function identically offline.
                              </p>
                            </article>

                            <article className="p-4 rounded-xl bg-[var(--bg-input)] border border-[var(--border-subtle)]">
                              <h3 className="text-sm sm:text-base font-bold text-[var(--text-primary)] mb-2">
                                What is the difference between AES-256-GCM and AES-256-CBC?
                              </h3>
                              <p className="text-xs sm:text-sm text-[var(--text-secondary)] leading-relaxed mb-2">
                                <strong>Direct Answer:</strong> AES-256-GCM (Galois/Counter Mode) provides Authenticated Encryption with Associated Data (AEAD), combining encryption and cryptographic integrity verification in a single pass. In contrast, AES-256-CBC requires a separate HMAC computation to prevent padding oracle attacks.
                              </p>
                              <p className="text-xs text-[var(--text-muted)] leading-relaxed">
                                NIST Special Publication 800-38D explicitly designates GCM as the preferred mode for modern communications and storage because any unauthorized modification of the ciphertext immediately invalidates the authentication tag during decryption.
                              </p>
                            </article>

                            <article className="p-4 rounded-xl bg-[var(--bg-input)] border border-[var(--border-subtle)]">
                              <h3 className="text-sm sm:text-base font-bold text-[var(--text-primary)] mb-2">
                                Are client-side SHA-256 and SHA-512 hashes mathematically reversible?
                              </h3>
                              <p className="text-xs sm:text-sm text-[var(--text-secondary)] leading-relaxed mb-2">
                                <strong>Direct Answer:</strong> No. SHA-256 and SHA-512 are cryptographic one-way compression functions compliant with FIPS PUB 180-4 and RFC 6234 that cannot be mathematically inverted or reversed into the original plaintext.
                              </p>
                              <p className="text-xs text-[var(--text-muted)] leading-relaxed">
                                Cryptographic hashes map variable-length inputs into a deterministic, fixed-size digest (256 bits or 512 bits). They possess pre-image resistance and strong collision resistance, making them ideal for verifying file checksums, digital signatures, and data integrity verification. Note: SHA-256 alone is not recommended for password storage; modern cryptographic standards (such as NIST SP 800-63B) mandate memory-hard algorithms like Argon2id, bcrypt, or PBKDF2.
                              </p>
                            </article>

                            <article className="p-4 rounded-xl bg-[var(--bg-input)] border border-[var(--border-subtle)]">
                              <h3 className="text-sm sm:text-base font-bold text-[var(--text-primary)] mb-2">
                                Why is browser-based password generation superior to server-side generators?
                              </h3>
                              <p className="text-xs sm:text-sm text-[var(--text-secondary)] leading-relaxed mb-2">
                                <strong>Direct Answer:</strong> Browser-based password generators use the local cryptographically secure pseudorandom number generator (CSPRNG) <code>crypto.getRandomValues()</code> to generate entropy locally without ever transmitting the generated password across network transit logs.
                              </p>
                              <p className="text-xs text-[var(--text-muted)] leading-relaxed">
                                Server-side generators risk intercepting or caching generated credentials in web server access logs, reverse proxies, or cloud telemetry. EncryptDecrypt.org guarantees that passwords exist solely in volatile client device RAM.
                              </p>
                            </article>

                            <article className="p-4 rounded-xl bg-[var(--bg-input)] border border-[var(--border-subtle)]">
                              <h3 className="text-sm sm:text-base font-bold text-[var(--text-primary)] mb-2">
                                Which standards govern Base64, Hex, and Base32 data encoding?
                              </h3>
                              <p className="text-xs sm:text-sm text-[var(--text-secondary)] leading-relaxed mb-2">
                                <strong>Direct Answer:</strong> IETF RFC 4648 officially specifies the Base64, Base32, Base16 (Hex), and URL-safe Base64 data encoding schemes used across modern internet communication.
                              </p>
                              <p className="text-xs text-[var(--text-muted)] leading-relaxed">
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
        </ErrorBoundary>
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
              Client-side cryptographic tools, data encoders, and developer utilities. Cryptographic tools execute locally in browser memory; server-assisted diagnostic tools query public endpoints upon request.
            </p>
            <div className="flex flex-wrap gap-2 text-[11px] font-mono">
              <span className="px-2 py-1 rounded bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 font-semibold">
                Client-Side Memory
              </span>
              <span className="px-2 py-1 rounded bg-blue-500/10 text-[#2E9BFF] border border-blue-500/20">
                Private &amp; Secure
              </span>
            </div>
          </div>

          {/* Navigation & Documentation */}
          <div>
            <h4 className="font-bold text-[var(--text-primary)] uppercase tracking-wider mb-3">Site & Guides</h4>
            <ul className="space-y-1">
              <li>
                <a href="/" onClick={(e) => { e.preventDefault(); handleBackToCatalog(); }} className="min-h-[48px] py-3 px-2 flex items-center text-[var(--text-secondary)] hover:text-[#2E9BFF] transition-colors cursor-pointer rounded-lg hover:bg-[var(--bg-surface-hover)]">
                  Home (All Tools)
                </a>
              </li>
              <li>
                <a href="/all-tools" onClick={(e) => { e.preventDefault(); handleNavigateView('all-tools'); }} className="min-h-[48px] py-3 px-2 flex items-center text-[#2E9BFF] hover:underline transition-colors cursor-pointer font-semibold rounded-lg hover:bg-[var(--bg-surface-hover)]">
                  All Tools Directory (1,360+)
                </a>
              </li>
              <li>
                <a href="/guides" onClick={(e) => { e.preventDefault(); handleNavigateView('guides'); }} className="min-h-[48px] py-3 px-2 flex items-center text-[var(--text-secondary)] hover:text-[#2E9BFF] transition-colors cursor-pointer rounded-lg hover:bg-[var(--bg-surface-hover)]">
                  Tech Guides
                </a>
              </li>
              <li>
                <a href="/blog" onClick={(e) => { e.preventDefault(); handleNavigateView('blog'); }} className="min-h-[48px] py-3 px-2 flex items-center text-[var(--text-secondary)] hover:text-[#2E9BFF] transition-colors cursor-pointer rounded-lg hover:bg-[var(--bg-surface-hover)]">
                  Blog &amp; Tutorials (5 Guides)
                </a>
              </li>
              <li>
                <a href="/about" onClick={(e) => { e.preventDefault(); handleNavigateView('about'); }} className="min-h-[48px] py-3 px-2 flex items-center text-[var(--text-secondary)] hover:text-[#2E9BFF] transition-colors cursor-pointer rounded-lg hover:bg-[var(--bg-surface-hover)]">
                  About Us
                </a>
              </li>
              <li>
                <a href="/contact" onClick={(e) => { e.preventDefault(); handleNavigateView('contact'); }} className="min-h-[48px] py-3 px-2 flex items-center text-[var(--text-secondary)] hover:text-[#2E9BFF] transition-colors cursor-pointer rounded-lg hover:bg-[var(--bg-surface-hover)]">
                  Contact Us
                </a>
              </li>
              <li>
                <a href="/privacy" onClick={(e) => { e.preventDefault(); handleNavigateView('privacy'); }} className="min-h-[48px] py-3 px-2 flex items-center text-[var(--text-secondary)] hover:text-[#2E9BFF] transition-colors cursor-pointer rounded-lg hover:bg-[var(--bg-surface-hover)]">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="/terms" onClick={(e) => { e.preventDefault(); handleNavigateView('terms'); }} className="min-h-[48px] py-3 px-2 flex items-center text-[var(--text-secondary)] hover:text-[#2E9BFF] transition-colors cursor-pointer rounded-lg hover:bg-[var(--bg-surface-hover)]">
                  Terms of Service
                </a>
              </li>
              <li>
                <a href="/disclaimer" onClick={(e) => { e.preventDefault(); handleNavigateView('disclaimer'); }} className="min-h-[48px] py-3 px-2 flex items-center text-[var(--text-secondary)] hover:text-[#2E9BFF] transition-colors cursor-pointer rounded-lg hover:bg-[var(--bg-surface-hover)]">
                  Legal Disclaimer
                </a>
              </li>
            </ul>
          </div>

          {/* Popular Encoders */}
          <div>
            <h4 className="font-bold text-[var(--text-primary)] uppercase tracking-wider mb-3">Popular Encoders</h4>
            <ul className="space-y-1">
              <li><a href="/tools/base64-encode-decode" onMouseEnter={preloadToolWorkspace} onTouchStart={preloadToolWorkspace} onClick={(e) => { e.preventDefault(); handleSelectToolBySlug('base64-encode-decode'); }} className="min-h-[48px] py-3 px-2 flex items-center text-[var(--text-secondary)] hover:text-[#2E9BFF] transition-colors cursor-pointer rounded-lg hover:bg-[var(--bg-surface-hover)]">Base64 Encode/Decode</a></li>
              <li><a href="/tools/url-encode-decode" onMouseEnter={preloadToolWorkspace} onTouchStart={preloadToolWorkspace} onClick={(e) => { e.preventDefault(); handleSelectToolBySlug('url-encode-decode'); }} className="min-h-[48px] py-3 px-2 flex items-center text-[var(--text-secondary)] hover:text-[#2E9BFF] transition-colors cursor-pointer rounded-lg hover:bg-[var(--bg-surface-hover)]">URL Encode/Decode</a></li>
              <li><a href="/tools/base16-hex-encode-decode" onMouseEnter={preloadToolWorkspace} onTouchStart={preloadToolWorkspace} onClick={(e) => { e.preventDefault(); handleSelectToolBySlug('base16-hex-encode-decode'); }} className="min-h-[48px] py-3 px-2 flex items-center text-[var(--text-secondary)] hover:text-[#2E9BFF] transition-colors cursor-pointer rounded-lg hover:bg-[var(--bg-surface-hover)]">Hex to Text</a></li>
              <li><a href="/tools/base58-encode-decode" onMouseEnter={preloadToolWorkspace} onTouchStart={preloadToolWorkspace} onClick={(e) => { e.preventDefault(); handleSelectToolBySlug('base58-encode-decode'); }} className="min-h-[48px] py-3 px-2 flex items-center text-[var(--text-secondary)] hover:text-[#2E9BFF] transition-colors cursor-pointer rounded-lg hover:bg-[var(--bg-surface-hover)]">Base58 Bitcoin</a></li>
              <li><a href="/tools/qr-code-generator" onMouseEnter={preloadToolWorkspace} onTouchStart={preloadToolWorkspace} onClick={(e) => { e.preventDefault(); handleSelectToolBySlug('qr-code-generator'); }} className="min-h-[48px] py-3 px-2 flex items-center text-[var(--text-secondary)] hover:text-[#2E9BFF] transition-colors cursor-pointer rounded-lg hover:bg-[var(--bg-surface-hover)]">QR Code Generator</a></li>
            </ul>
          </div>

          {/* Security & Ciphers */}
          <div>
            <h4 className="font-bold text-[var(--text-primary)] uppercase tracking-wider mb-3">Security & Ciphers</h4>
            <ul className="space-y-1">
              <li><a href="/tools/aes-encrypt-decrypt" onMouseEnter={preloadToolWorkspace} onTouchStart={preloadToolWorkspace} onClick={(e) => { e.preventDefault(); handleSelectToolBySlug('aes-encrypt-decrypt'); }} className="min-h-[48px] py-3 px-2 flex items-center text-[var(--text-secondary)] hover:text-[#2E9BFF] transition-colors cursor-pointer rounded-lg hover:bg-[var(--bg-surface-hover)]">AES-256-GCM Encrypt</a></li>
              <li><a href="/tools/sha-256-hash-generator" onMouseEnter={preloadToolWorkspace} onTouchStart={preloadToolWorkspace} onClick={(e) => { e.preventDefault(); handleSelectToolBySlug('sha-256-hash-generator'); }} className="min-h-[48px] py-3 px-2 flex items-center text-[var(--text-secondary)] hover:text-[#2E9BFF] transition-colors cursor-pointer rounded-lg hover:bg-[var(--bg-surface-hover)]">SHA-256 Hash</a></li>
              <li><a href="/tools/md5-hash-generator" onMouseEnter={preloadToolWorkspace} onTouchStart={preloadToolWorkspace} onClick={(e) => { e.preventDefault(); handleSelectToolBySlug('md5-hash-generator'); }} className="min-h-[48px] py-3 px-2 flex items-center text-[var(--text-secondary)] hover:text-[#2E9BFF] transition-colors cursor-pointer rounded-lg hover:bg-[var(--bg-surface-hover)]">MD5 Hash</a></li>
              <li><a href="/tools/jwt-token-generator" onMouseEnter={preloadToolWorkspace} onTouchStart={preloadToolWorkspace} onClick={(e) => { e.preventDefault(); handleSelectToolBySlug('jwt-token-generator'); }} className="min-h-[48px] py-3 px-2 flex items-center text-[var(--text-secondary)] hover:text-[#2E9BFF] transition-colors cursor-pointer rounded-lg hover:bg-[var(--bg-surface-hover)]">JWT Debugger</a></li>
              <li><a href="/tools/secure-password-generator" onMouseEnter={preloadToolWorkspace} onTouchStart={preloadToolWorkspace} onClick={(e) => { e.preventDefault(); handleSelectToolBySlug('secure-password-generator'); }} className="min-h-[48px] py-3 px-2 flex items-center text-[var(--text-secondary)] hover:text-[#2E9BFF] transition-colors cursor-pointer rounded-lg hover:bg-[var(--bg-surface-hover)]">Password Generator</a></li>
            </ul>
          </div>
        </div>

        {/* Legal Bottom Bar */}
        <div className="container border-t border-[var(--border-subtle)] mt-8 pt-6 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-[var(--text-muted)]">
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 font-medium">
            <span className="text-[var(--text-primary)] font-semibold px-2 py-3">© 2026 EncryptDecrypt.org</span>
            <span className="text-[var(--text-muted)] hidden lg:inline">· Founded by Ajay Rathod (Maharashtra, India)</span>
            <a href="/privacy" onClick={(e) => { e.preventDefault(); handleNavigateView('privacy'); }} className="min-h-[48px] px-3.5 py-3 inline-flex items-center text-[var(--text-secondary)] hover:text-[#2E9BFF] transition-colors cursor-pointer rounded-lg hover:bg-[var(--bg-surface-hover)]">Privacy Policy</a>
            <a href="/terms" onClick={(e) => { e.preventDefault(); handleNavigateView('terms'); }} className="min-h-[48px] px-3.5 py-3 inline-flex items-center text-[var(--text-secondary)] hover:text-[#2E9BFF] transition-colors cursor-pointer rounded-lg hover:bg-[var(--bg-surface-hover)]">Terms of Service</a>
            <a href="/disclaimer" onClick={(e) => { e.preventDefault(); handleNavigateView('disclaimer'); }} className="min-h-[48px] px-3.5 py-3 inline-flex items-center text-[var(--text-secondary)] hover:text-[#2E9BFF] transition-colors cursor-pointer rounded-lg hover:bg-[var(--bg-surface-hover)]">Legal Disclaimer</a>
            <a href="/about" onClick={(e) => { e.preventDefault(); handleNavigateView('about'); }} className="min-h-[48px] px-3.5 py-3 inline-flex items-center text-[var(--text-secondary)] hover:text-[#2E9BFF] transition-colors cursor-pointer rounded-lg hover:bg-[var(--bg-surface-hover)]">About Us</a>
            <a href="/contact" onClick={(e) => { e.preventDefault(); handleNavigateView('contact'); }} className="min-h-[48px] px-3.5 py-3 inline-flex items-center text-[var(--text-secondary)] hover:text-[#2E9BFF] transition-colors cursor-pointer rounded-lg hover:bg-[var(--bg-surface-hover)]">Contact Us</a>
            <a href="/rss.xml" target="_blank" rel="noopener noreferrer" className="min-h-[48px] px-3.5 py-3 inline-flex items-center text-amber-500 hover:text-amber-600 transition-colors cursor-pointer rounded-lg hover:bg-[var(--bg-surface-hover)] font-semibold">
              <span className="w-2 h-2 rounded-full bg-amber-400 mr-1.5 animate-pulse"></span>
              RSS Feed
            </a>
            <a href="/sitemap.xml" target="_blank" rel="noopener noreferrer" className="min-h-[48px] px-3.5 py-3 inline-flex items-center text-[var(--text-secondary)] hover:text-[#2E9BFF] transition-colors cursor-pointer rounded-lg hover:bg-[var(--bg-surface-hover)]">Sitemap</a>
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
