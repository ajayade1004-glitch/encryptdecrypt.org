import { ToolItem, CategoryInfo } from '../types';

export interface AdminUser {
  id: string;
  username: string;
  email: string;
  role: 'superadmin' | 'editor' | 'seo_manager';
  name: string;
  lastLogin?: string;
  createdAt: string;
}

export interface ActivityLogItem {
  id: string;
  timestamp: string;
  action: string;
  module: string;
  details: string;
  user: string;
  ip?: string;
}

export interface SeoSettings {
  defaultTitle: string;
  defaultDescription: string;
  keywords: string[];
  canonicalBase: string;
  ogTitle: string;
  ogDescription: string;
  ogImageUrl: string;
  twitterCard: 'summary' | 'summary_large_image';
  robotsTxt: string;
  sitemapEnabled: boolean;
  schemaType: 'SoftwareApplication' | 'WebApplication';
}

export interface AdsSettings {
  enabled: boolean;
  autoAds: boolean;
  adsensePublisherId: string;
  headerAdSlot: string;
  toolAdSlot: string;
  footerAdSlot: string;
  showOnMobile: boolean;
  showOnDesktop: boolean;
  testMode: boolean;
}

export interface HomepageSettings {
  heroTitle: string;
  heroSubtitle: string;
  featuredCategorySlugs: string[];
  quickRunnerSlugs: string[];
  bannerEnabled: boolean;
  bannerMessage: string;
  bannerType: 'info' | 'success' | 'warning';
}

export interface SystemSettings {
  siteName: string;
  siteTagline: string;
  supportEmail: string;
  developerEmail: string;
  googleAnalyticsId: string;
  searchConsoleVerification: string;
  footerCopyright: string;
  maintenanceMode: boolean;
}

export interface ToolFaqItem {
  question: string;
  answer: string;
}

export interface ToolContentOverride {
  toolId: string;
  customName?: string;
  longDescription?: string;
  howToSteps?: string[];
  faqs?: ToolFaqItem[];
  metaTitle?: string;
  customMetaTitle?: string;
  metaDescription?: string;
  customMetaDescription?: string;
  customKeywords?: string[];
  canonicalUrl?: string;
  status: 'active' | 'disabled' | 'draft';
  disabled?: boolean;
  popular?: boolean;
  isFeatured?: boolean;
  displayOrder?: number;
}

export interface AnalyticsSummary {
  totalExecutions: number;
  totalPageViews: number;
  uniqueSessions: number;
  topSearches: { query: string; count: number }[];
  toolUsage: { toolId: string; toolName: string; count: number }[];
  deviceBreakdown: { device: string; percentage: number }[];
  browserBreakdown: { browser: string; percentage: number }[];
  realClientInfo?: {
    currentBrowser: string;
    platform: string;
    screenResolution: string;
    language: string;
    hardwareCores: number;
    memoryGB?: number;
    isOnline: boolean;
    storageUsedBytes: number;
    lastSessionTime: string;
  };
}

export type AdminModule = 
  | 'dashboard'
  | 'tools'
  | 'categories'
  | 'seo'
  | 'content'
  | 'homepage'
  | 'ads'
  | 'pages'
  | 'analytics'
  | 'users'
  | 'settings'
  | 'import-export';

export type AdminTabType = AdminModule;
