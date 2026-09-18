import { ToolItem, CategoryInfo } from '../types';
import { 
  AdminUser, 
  ActivityLogItem, 
  SeoSettings, 
  AdsSettings, 
  HomepageSettings, 
  SystemSettings, 
  ToolContentOverride,
  AnalyticsSummary 
} from '../types/admin';

// Storage keys
const STORAGE_PREFIX = 'ed_admin_';
const KEYS = {
  SESSION: `${STORAGE_PREFIX}session`,
  USERS: `${STORAGE_PREFIX}users`,
  TOOLS_OVERRIDE: `${STORAGE_PREFIX}tools_overrides`,
  CUSTOM_TOOLS: `${STORAGE_PREFIX}custom_tools`,
  CATEGORIES: `${STORAGE_PREFIX}categories`,
  SEO: `${STORAGE_PREFIX}seo`,
  ADS: `${STORAGE_PREFIX}ads`,
  HOMEPAGE: `${STORAGE_PREFIX}homepage`,
  SYSTEM: `${STORAGE_PREFIX}system`,
  LOGS: `${STORAGE_PREFIX}activity_logs`,
  ANALYTICS: `${STORAGE_PREFIX}analytics`,
  PAGE_CONTENT: `${STORAGE_PREFIX}page_content`,
};

// Default Master Credentials - Restricted Exclusively to Ajay Ade
export const DEFAULT_ADMIN_CREDENTIALS = {
  username: 'ajayade1004@gmail.com',
  secondaryUsername: 'ajayade1004',
  initialPassword: 'EncryptAdmin@2026#',
  name: 'Ajay Ade (Sole Administrator & Owner)',
};

// Default SEO configuration
export const DEFAULT_SEO_SETTINGS: SeoSettings = {
  defaultTitle: 'EncryptDecrypt.org - Free Client-Side Developer Security & Encryption Tools',
  defaultDescription: '100% private, client-side cryptographic and developer utilities. AES, SHA-256, RSA, Base64, UUID, JWT without server uploads.',
  keywords: ['cryptography', 'encryption', 'decryption', 'sha256', 'base64', 'aes-256', 'web crypto', 'developer tools'],
  canonicalBase: 'https://encryptdecrypt.org',
  ogTitle: 'EncryptDecrypt.org — 300+ Private Client-Side Tools',
  ogDescription: 'Zero-knowledge browser-based cryptographic suite for software developers and cybersecurity engineers.',
  ogImageUrl: 'https://encryptdecrypt.org/assets/og-image.png',
  twitterCard: 'summary_large_image',
  robotsTxt: 'User-agent: *\nAllow: /\nSitemap: https://encryptdecrypt.org/sitemap.xml',
  sitemapEnabled: true,
  schemaType: 'WebApplication',
};

// Default Ads configuration
export const DEFAULT_ADS_SETTINGS: AdsSettings = {
  enabled: false, // Default disabled until user receives Google AdSense approval
  autoAds: true,   // User requested auto-ads once approved
  adsensePublisherId: 'ca-pub-XXXXXXXXXX',
  headerAdSlot: '',
  toolAdSlot: '',
  footerAdSlot: '',
  showOnMobile: true,
  showOnDesktop: true,
  testMode: true,
};

// Default Homepage settings
export const DEFAULT_HOMEPAGE_SETTINGS: HomepageSettings = {
  heroTitle: '300+ Zero-Knowledge Developer Tools',
  heroSubtitle: 'High-performance cryptographic encoders, ciphers, hashes, formatters, and network utilities running 100% in your local browser.',
  featuredCategorySlugs: ['encoding-decoding', 'encryption-ciphers', 'hashing-security', 'generators-tokens'],
  quickRunnerSlugs: ['base64-encode-decode', 'url-encode-decode', 'sha-256-hash-generator', 'secure-password-generator'],
  bannerEnabled: false,
  bannerMessage: 'Welcome to EncryptDecrypt.org v2.5 — All 300+ utilities operate strictly client-side via W3C WebCrypto API.',
  bannerType: 'info',
};

// Default System settings
export const DEFAULT_SYSTEM_SETTINGS: SystemSettings = {
  siteName: 'EncryptDecrypt.org',
  siteTagline: '100% Client-Side Privacy & Cryptography',
  supportEmail: 'support@encryptdecrypt.org',
  developerEmail: 'ajayade1004@gmail.com',
  googleAnalyticsId: '',
  searchConsoleVerification: '',
  footerCopyright: '© 2026 EncryptDecrypt.org',
  maintenanceMode: false,
};

// Default Users - Single Exclusive Administrator
const DEFAULT_USERS: AdminUser[] = [
  {
    id: 'user_master_ajay',
    username: 'ajayade1004@gmail.com',
    email: 'ajayade1004@gmail.com',
    name: 'Ajay Ade',
    role: 'superadmin',
    createdAt: '2026-01-01T00:00:00Z',
    lastLogin: new Date().toISOString(),
  }
];

// Helper to safely access localStorage
function getStored<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function setStored<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (err) {
    console.warn(`Failed to store ${key}:`, err);
  }
}

// ==================== AUTHENTICATION ====================
export interface AuthSession {
  token: string;
  user: AdminUser;
  expiresAt: number;
}

export function getAdminSession(): AuthSession | null {
  const session = getStored<AuthSession | null>(KEYS.SESSION, null);
  if (!session) return null;
  if (Date.now() > session.expiresAt) {
    clearAdminSession();
    return null;
  }
  return session;
}

export function setAdminSession(session: AuthSession): void {
  setStored(KEYS.SESSION, session);
}

export function clearAdminSession(): void {
  try {
    localStorage.removeItem(KEYS.SESSION);
  } catch {
    // Ignore
  }
}

export const logoutAdmin = clearAdminSession;

export function authenticateAdmin(identifier: string, password: string): { success: boolean; user?: AdminUser; error?: string } {
  const cleanId = identifier.trim().toLowerCase();
  const cleanPass = password.trim();

  // Strictly restrict to Ajay Ade
  const isAjay = cleanId === 'ajayade1004@gmail.com' || 
                cleanId === 'ajayade1004' || 
                cleanId === 'ajay' || 
                cleanId === 'admin';

  if (!isAjay) {
    return { 
      success: false, 
      error: 'Invalid administrator credentials. Access is restricted.' 
    };
  }

  // Master authorized account
  const masterUser: AdminUser = {
    id: 'user_master_ajay',
    username: 'ajayade1004@gmail.com',
    email: 'ajayade1004@gmail.com',
    name: 'Ajay Ade',
    role: 'superadmin',
    createdAt: '2026-01-01T00:00:00Z',
    lastLogin: new Date().toISOString(),
  };

  // Get stored custom password if changed by user
  const storedPassword = getStored<string>(`${STORAGE_PREFIX}custom_password`, DEFAULT_ADMIN_CREDENTIALS.initialPassword);

  // Accepted passwords:
  // 1. Stored custom password
  // 2. Default password 'EncryptAdmin@2026#'
  // 3. Case-insensitive or common variations so Ajay never gets locked out
  const validPasswords = [
    storedPassword,
    DEFAULT_ADMIN_CREDENTIALS.initialPassword,
    'EncryptAdmin@2026',
    'encryptadmin@2026#',
    'encryptadmin@2026',
    'ajayade1004',
    'admin',
    'admin@2026',
    'ajayade1004@gmail.com'
  ].map(p => p.trim());

  const isPasswordValid = validPasswords.includes(cleanPass) || 
                          validPasswords.some(p => p.toLowerCase() === cleanPass.toLowerCase());

  if (!isPasswordValid) {
    return { 
      success: false, 
      error: 'Invalid administrator credentials. Access is restricted.' 
    };
  }

  // Update last login
  masterUser.lastLogin = new Date().toISOString();
  setStored(KEYS.USERS, [masterUser]);

  const session: AuthSession = {
    token: `adm_tok_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
    user: masterUser,
    expiresAt: Date.now() + 30 * 24 * 60 * 60 * 1000, // 30 days
  };
  setAdminSession(session);

  logActivity('User Login', 'Authentication', `Master administrator Ajay Ade signed in successfully.`, masterUser.username);

  return { success: true, user: masterUser };
}

export function updateAdminPassword(oldPass: string, newPass: string): { success: boolean; error?: string } {
  const storedPassword = getStored<string>(`${STORAGE_PREFIX}custom_password`, DEFAULT_ADMIN_CREDENTIALS.initialPassword);
  if (oldPass !== storedPassword && oldPass !== DEFAULT_ADMIN_CREDENTIALS.initialPassword) {
    return { success: false, error: 'Current password does not match.' };
  }
  if (!newPass || newPass.length < 6) {
    return { success: false, error: 'New password must be at least 6 characters.' };
  }
  setStored(`${STORAGE_PREFIX}custom_password`, newPass);
  logActivity('Password Changed', 'Users & Security', 'Master administrator password updated.');
  return { success: true };
}

// ==================== ACTIVITY AUDIT LOGS ====================
export function getActivityLogs(): ActivityLogItem[] {
  return getStored<ActivityLogItem[]>(KEYS.LOGS, [
    {
      id: 'log_init',
      timestamp: new Date().toISOString(),
      action: 'System Initialized',
      module: 'Core System',
      details: '300+ client-side tools loaded into administration management console.',
      user: 'System',
    }
  ]);
}

export function logActivity(action: string, module: string, details: string, user = 'Admin'): void {
  const currentLogs = getActivityLogs();
  const newLog: ActivityLogItem = {
    id: `log_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
    timestamp: new Date().toISOString(),
    action,
    module,
    details,
    user,
  };
  const updated = [newLog, ...currentLogs].slice(0, 150); // Keep last 150
  setStored(KEYS.LOGS, updated);
}

export function clearActivityLogs(): void {
  setStored(KEYS.LOGS, []);
}

// ==================== TOOLS OVERRIDES & CRUD ====================
export function getToolOverrides(): Record<string, ToolContentOverride> {
  return getStored<Record<string, ToolContentOverride>>(KEYS.TOOLS_OVERRIDE, {});
}

export function saveToolOverride(toolId: string, override: Partial<ToolContentOverride>): void {
  const current = getToolOverrides();
  current[toolId] = {
    ...(current[toolId] || { toolId, status: 'active' }),
    ...override,
  };
  setStored(KEYS.TOOLS_OVERRIDE, current);
  logActivity('Tool Updated', 'Tools Management', `Updated configuration & status for tool ${toolId}`);
}

export function getCustomTools(): ToolItem[] {
  return getStored<ToolItem[]>(KEYS.CUSTOM_TOOLS, []);
}

export function saveCustomTool(tool: ToolItem): void {
  const custom = getCustomTools();
  const existingIdx = custom.findIndex(t => t.id === tool.id || t.slug === tool.slug);
  if (existingIdx >= 0) {
    custom[existingIdx] = tool;
  } else {
    custom.unshift(tool);
  }
  setStored(KEYS.CUSTOM_TOOLS, custom);
  logActivity('Custom Tool Saved', 'Tools Management', `Tool ${tool.name} (${tool.slug}) added/updated.`);
}

export function deleteTool(toolId: string): void {
  // If in custom tools, remove it
  const custom = getCustomTools().filter(t => t.id !== toolId && t.slug !== toolId);
  setStored(KEYS.CUSTOM_TOOLS, custom);

  // If in overrides, mark as deleted/disabled
  saveToolOverride(toolId, { status: 'disabled' });
  logActivity('Tool Disabled/Deleted', 'Tools Management', `Tool with ID ${toolId} was disabled.`);
}

export function bulkUpdateToolStatus(toolIds: string[], status: 'active' | 'disabled'): void {
  const overrides = getToolOverrides();
  toolIds.forEach(id => {
    overrides[id] = {
      ...(overrides[id] || { toolId: id, status: 'active' }),
      status,
    };
  });
  setStored(KEYS.TOOLS_OVERRIDE, overrides);
  logActivity('Bulk Tool Status Update', 'Tools Management', `Updated ${toolIds.length} tools to status: ${status}`);
}

// ==================== SEO, ADS & SYSTEM CONFIGS ====================
export function getSeoSettings(): SeoSettings {
  return getStored<SeoSettings>(KEYS.SEO, DEFAULT_SEO_SETTINGS);
}

export function saveSeoSettings(settings: SeoSettings): void {
  setStored(KEYS.SEO, settings);
  logActivity('SEO Settings Saved', 'SEO Management', 'Global meta tags, robots.txt, and sitemap configuration updated.');
}

export function getAdsSettings(): AdsSettings {
  return getStored<AdsSettings>(KEYS.ADS, DEFAULT_ADS_SETTINGS);
}

export function saveAdsSettings(settings: AdsSettings): void {
  setStored(KEYS.ADS, settings);
  logActivity('Ads Settings Saved', 'Ads Management', `AdSense status set to: ${settings.enabled ? 'Enabled' : 'Disabled'}. Auto-Ads: ${settings.autoAds ? 'Yes' : 'No'}.`);
}

export function getHomepageSettings(): HomepageSettings {
  return getStored<HomepageSettings>(KEYS.HOMEPAGE, DEFAULT_HOMEPAGE_SETTINGS);
}

export function saveHomepageSettings(settings: HomepageSettings): void {
  setStored(KEYS.HOMEPAGE, settings);
  logActivity('Homepage Saved', 'Homepage Management', 'Hero content and featured sections updated.');
}

export function getSystemSettings(): SystemSettings {
  return getStored<SystemSettings>(KEYS.SYSTEM, DEFAULT_SYSTEM_SETTINGS);
}

export function saveSystemSettings(settings: SystemSettings): void {
  setStored(KEYS.SYSTEM, settings);
  logActivity('System Settings Saved', 'System Settings', 'Site branding and tracking configurations updated.');
}

// ==================== PAGES MANAGEMENT ====================
export interface PageContentConfig {
  aboutTitle?: string;
  aboutBody?: string;
  contactEmail?: string;
  supportPhone?: string;
  privacyNotice?: string;
  termsNotice?: string;
  disclaimerNotice?: string;
}

export function getPageContent(): PageContentConfig {
  return getStored<PageContentConfig>(KEYS.PAGE_CONTENT, {
    aboutTitle: 'Empowering Developers with 100% Client-Side Cryptographic Tools',
    contactEmail: 'ajayade1004@gmail.com',
  });
}

export function savePageContent(content: PageContentConfig): void {
  setStored(KEYS.PAGE_CONTENT, content);
  logActivity('Page Content Updated', 'Pages Management', 'Static legal & company pages modified.');
}

// ==================== REAL CLIENT ANALYTICS TRACKING ====================

// Real-time client environment diagnostics
export function getClientTelemetry() {
  if (typeof window === 'undefined') {
    return {
      currentBrowser: 'Browser Engine',
      platform: 'Web Client',
      screenResolution: 'Standard Display',
      language: 'en-US',
      hardwareCores: 4,
      memoryGB: 8,
      isOnline: true,
      storageUsedBytes: 0,
      lastSessionTime: new Date().toLocaleTimeString(),
    };
  }

  const ua = navigator.userAgent;
  let browser = 'Google Chrome';
  if (ua.includes('Firefox')) browser = 'Mozilla Firefox';
  else if (ua.includes('Edg/')) browser = 'Microsoft Edge';
  else if (ua.includes('Safari') && !ua.includes('Chrome')) browser = 'Apple Safari';
  else if (ua.includes('OPR') || ua.includes('Opera')) browser = 'Opera';

  let platform = navigator.platform || 'Desktop';
  if (/Android/i.test(ua)) platform = 'Android Mobile';
  else if (/iPhone/i.test(ua)) platform = 'Apple iPhone';
  else if (/iPad/i.test(ua)) platform = 'Apple iPad';
  else if (/Mac/i.test(ua)) platform = 'macOS Desktop';
  else if (/Win/i.test(ua)) platform = 'Windows PC';
  else if (/Linux/i.test(ua)) platform = 'Linux Workstation';

  // Calculate actual bytes used in localStorage
  let storageBytes = 0;
  try {
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key) {
        storageBytes += (key.length + (localStorage.getItem(key) || '').length) * 2;
      }
    }
  } catch {
    storageBytes = 4096;
  }

  return {
    currentBrowser: browser,
    platform,
    screenResolution: `${window.screen?.width || window.innerWidth} × ${window.screen?.height || window.innerHeight}`,
    language: navigator.language || 'en',
    hardwareCores: navigator.hardwareConcurrency || 4,
    memoryGB: (navigator as any).deviceMemory || undefined,
    isOnline: navigator.onLine !== false,
    storageUsedBytes: storageBytes,
    lastSessionTime: new Date().toLocaleTimeString(),
  };
}

export function getAnalyticsData(): AnalyticsSummary {
  const telemetry = getClientTelemetry();
  const raw = getStored<AnalyticsSummary | null>(KEYS.ANALYTICS, null);

  // Clear out any old fake placeholder seed with 14250 or empty
  if (!raw || raw.totalExecutions === 14250 || typeof raw.totalExecutions !== 'number') {
    const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
    const initial: AnalyticsSummary = {
      totalExecutions: 0,
      totalPageViews: 1, // Real initial visit count
      uniqueSessions: 1,
      topSearches: [],
      toolUsage: [],
      deviceBreakdown: isMobile 
        ? [{ device: 'Mobile Browser', percentage: 100 }]
        : [{ device: 'Desktop Workstation', percentage: 100 }],
      browserBreakdown: [
        { browser: telemetry.currentBrowser, percentage: 100 }
      ],
      realClientInfo: telemetry,
    };
    setStored(KEYS.ANALYTICS, initial);
    return initial;
  }

  // Refresh genuine hardware & storage telemetry
  raw.realClientInfo = telemetry;
  return raw;
}

export function resetAnalyticsData(): AnalyticsSummary {
  const telemetry = getClientTelemetry();
  const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
  const fresh: AnalyticsSummary = {
    totalExecutions: 0,
    totalPageViews: 1,
    uniqueSessions: 1,
    topSearches: [],
    toolUsage: [],
    deviceBreakdown: isMobile 
      ? [{ device: 'Mobile Browser', percentage: 100 }]
      : [{ device: 'Desktop Workstation', percentage: 100 }],
    browserBreakdown: [
      { browser: telemetry.currentBrowser, percentage: 100 }
    ],
    realClientInfo: telemetry,
  };
  setStored(KEYS.ANALYTICS, fresh);
  logActivity('Analytics Reset', 'Analytics Management', 'Client analytics metrics reset to zero by Ajay Ade.');
  return fresh;
}

export function recordPageView(pageName = 'Catalog'): void {
  try {
    const data = getAnalyticsData();
    data.totalPageViews = (data.totalPageViews || 0) + 1;
    setStored(KEYS.ANALYTICS, data);
  } catch {
    // Silently ignore storage issues
  }
}

export function recordToolExecution(toolId: string, toolName: string): void {
  try {
    const data = getAnalyticsData();
    data.totalExecutions = (data.totalExecutions || 0) + 1;
    const existing = data.toolUsage.find(t => t.toolId === toolId);
    if (existing) {
      existing.count += 1;
    } else {
      data.toolUsage.push({ toolId, toolName, count: 1 });
    }
    data.toolUsage.sort((a, b) => b.count - a.count);
    setStored(KEYS.ANALYTICS, data);
  } catch {
    // Silently ignore storage issues
  }
}

export function recordSearchQuery(query: string): void {
  try {
    const clean = query.trim().toLowerCase();
    if (!clean || clean.length < 2) return;
    const data = getAnalyticsData();
    const existing = data.topSearches.find(s => s.query.toLowerCase() === clean);
    if (existing) {
      existing.count += 1;
    } else {
      data.topSearches.push({ query: clean, count: 1 });
    }
    data.topSearches.sort((a, b) => b.count - a.count);
    setStored(KEYS.ANALYTICS, data);
  } catch {
    // Silently ignore storage issues
  }
}

// ==================== IMPORT & EXPORT ====================
export function exportToolsToJson(tools: ToolItem[]): string {
  return JSON.stringify(tools, null, 2);
}

export function exportToolsToCsv(tools: ToolItem[]): string {
  const headers = ['ID', 'Name', 'Slug', 'Category', 'Category Name', 'Input Type', 'Popular', 'Short Description', 'Meta Title', 'Meta Description', 'Primary Keyword'];
  const rows = tools.map(t => [
    `"${(t.id || '').replace(/"/g, '""')}"`,
    `"${(t.name || '').replace(/"/g, '""')}"`,
    `"${(t.slug || '').replace(/"/g, '""')}"`,
    `"${(t.category || '').replace(/"/g, '""')}"`,
    `"${(t.categoryName || '').replace(/"/g, '""')}"`,
    `"${(t.inputType || '').replace(/"/g, '""')}"`,
    t.popular ? 'true' : 'false',
    `"${(t.shortDesc || '').replace(/"/g, '""')}"`,
    `"${(t.metaTitle || '').replace(/"/g, '""')}"`,
    `"${(t.metaDescription || '').replace(/"/g, '""')}"`,
    `"${(t.primaryKeyword || '').replace(/"/g, '""')}"`
  ]);
  return [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
}

export function exportFullSiteBackup(tools: ToolItem[]): string {
  const backup = {
    version: '2.5.0',
    timestamp: new Date().toISOString(),
    site: 'EncryptDecrypt.org',
    tools,
    overrides: getToolOverrides(),
    seo: getSeoSettings(),
    ads: getAdsSettings(),
    homepage: getHomepageSettings(),
    system: getSystemSettings(),
    pages: getPageContent(),
  };
  return JSON.stringify(backup, null, 2);
}

export const getAnalyticsSummary = getAnalyticsData;

export function exportAllAdminData(): string {
  const data = {
    version: '2.5.0',
    exportedAt: new Date().toISOString(),
    overrides: getToolOverrides(),
    customTools: getCustomTools(),
    seo: getSeoSettings(),
    ads: getAdsSettings(),
    homepage: getHomepageSettings(),
    system: getSystemSettings(),
    pages: getPageContent(),
  };
  return JSON.stringify(data, null, 2);
}

export function importAllAdminData(jsonString: string): { success: boolean; error?: string } {
  try {
    const data = JSON.parse(jsonString);
    if (data.overrides) setStored(KEYS.TOOLS_OVERRIDE, data.overrides);
    if (data.customTools) setStored(KEYS.CUSTOM_TOOLS, data.customTools);
    if (data.seo) setStored(KEYS.SEO, data.seo);
    if (data.ads) setStored(KEYS.ADS, data.ads);
    if (data.homepage) setStored(KEYS.HOMEPAGE, data.homepage);
    if (data.system) setStored(KEYS.SYSTEM, data.system);
    if (data.pages) setStored(KEYS.PAGE_CONTENT, data.pages);
    logActivity('System Backup Restored', 'Import/Export', 'All administrative settings successfully imported from backup.');
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message || 'Invalid backup JSON file.' };
  }
}

export function applyAdminOverrides(baseTools: ToolItem[]): ToolItem[] {
  const overrides = getToolOverrides();
  const custom = getCustomTools();
  
  const modifiedBase = baseTools.map(tool => {
    const override = overrides[tool.id] || overrides[tool.slug];
    if (!override) return tool;
    return {
      ...tool,
      name: override.customName || tool.name,
      metaTitle: override.metaTitle || tool.metaTitle,
      metaDescription: override.metaDescription || tool.metaDescription,
      popular: override.popular !== undefined ? override.popular : tool.popular,
      disabled: override.status === 'disabled',
    };
  });

  const customNotInBase = custom.filter(c => !modifiedBase.some(b => b.id === c.id || b.slug === c.slug));
  return [...customNotInBase, ...modifiedBase];
}
