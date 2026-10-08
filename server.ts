import express, { Request, Response, NextFunction } from 'express';
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = parseInt(process.env.PORT || '3000', 10);
const isProd = process.env.NODE_ENV === 'production';

app.use(express.json({ limit: '15mb' }));
app.use(express.urlencoded({ extended: true, limit: '15mb' }));

// Database directory & file setup
const DATA_DIR = path.join(__dirname, 'data');
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}
const DB_FILE = path.join(DATA_DIR, 'admin-db.json');

// Cryptographic Password Hashing Utilities
function hashPassword(password: string, salt?: string): { hash: string; salt: string } {
  const generatedSalt = salt || crypto.randomBytes(16).toString('hex');
  const derivedKey = crypto.pbkdf2Sync(password, generatedSalt, 100000, 64, 'sha512');
  return {
    hash: derivedKey.toString('hex'),
    salt: generatedSalt
  };
}

function verifyPassword(password: string, storedHash: string, salt: string): boolean {
  const { hash } = hashPassword(password, salt);
  return crypto.timingSafeEqual(Buffer.from(hash, 'hex'), Buffer.from(storedHash, 'hex'));
}

// Initial Admin Credentials (Authorized: Ajjay@encryptdecrypt.org)
const INITIAL_ADMIN_EMAIL = 'ajjay@encryptdecrypt.org';
const INITIAL_PASSWORD_PLAIN = '8yQyU_5ir6q*w8(J[:a6+;+k';

interface AdminDatabase {
  auth: {
    email: string;
    passwordHash: string;
    salt: string;
    lastLogin: string | null;
    passwordUpdatedAt: string;
  };
  sessions: Record<string, { email: string; createdAt: string; expiresAt: number }>;
  toolOverrides: Record<string, any>;
  categoryOverrides: Record<string, any>;
  seoOverrides: Record<string, any>;
  pageContents: Record<string, any>;
  adsConfig: any;
  settings: any;
  auditLogs: Array<{
    id: string;
    timestamp: string;
    action: string;
    details: string;
    ip: string;
    status: 'SUCCESS' | 'WARNING' | 'FAILED';
  }>;
}

function getInitialDb(): AdminDatabase {
  const { hash, salt } = hashPassword(INITIAL_PASSWORD_PLAIN);
  return {
    auth: {
      email: INITIAL_ADMIN_EMAIL,
      passwordHash: hash,
      salt: salt,
      lastLogin: null,
      passwordUpdatedAt: new Date().toISOString()
    },
    sessions: {},
    toolOverrides: {},
    categoryOverrides: {},
    seoOverrides: {
      siteTitle: 'EncryptDecrypt.org - 1,000+ Free Client-Side Developer, SEO & Crypto Tools',
      metaDescription: 'Zero-knowledge developer, SEO, data cleaning, and cryptographic utilities running directly in your browser RAM.',
      defaultKeywords: ['cryptography', 'base64', 'aes-256', 'sha-256', 'developer tools', 'web crypto'],
      robotsTxtContent: `User-agent: *\nAllow: /\nDisallow: /admin\nDisallow: /#admin\n\nSitemap: https://encryptdecrypt.org/sitemap.xml\nLLM: https://encryptdecrypt.org/llms.txt`
    },
    pageContents: {},
    adsConfig: {
      enabled: false,
      publisherId: 'ca-pub-XXXXXXXXXXXXXXXX',
      slots: {
        header: { slotId: '1234567890', enabled: false },
        sidebar: { slotId: '2345678901', enabled: false },
        inContent: { slotId: '3456789012', enabled: false },
        footer: { slotId: '4567890123', enabled: false }
      },
      testMode: true
    },
    settings: {
      siteName: 'EncryptDecrypt.org',
      maintenanceMode: false,
      maxPayloadSizeMb: 50,
      enableAnalyticsLogging: true,
      lastBackupTimestamp: new Date().toISOString()
    },
    auditLogs: [
      {
        id: crypto.randomUUID(),
        timestamp: new Date().toISOString(),
        action: 'SYSTEM_BOOTSTRAP',
        details: 'Admin database initialized with secure salted PBKDF2 authentication.',
        ip: '127.0.0.1',
        status: 'SUCCESS'
      }
    ]
  };
}

// Load or initialize database
let db: AdminDatabase;
try {
  if (fs.existsSync(DB_FILE)) {
    const raw = fs.readFileSync(DB_FILE, 'utf-8');
    db = JSON.parse(raw);
    // Ensure email is set
    if (!db.auth || !db.auth.email) {
      db = getInitialDb();
      fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2), 'utf-8');
    }
  } else {
    db = getInitialDb();
    fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2), 'utf-8');
  }
} catch (e) {
  console.warn('Initializing fresh admin database:', e);
  db = getInitialDb();
  fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2), 'utf-8');
}

// Atomic database write helper
function saveDb() {
  try {
    const tempPath = `${DB_FILE}.tmp`;
    fs.writeFileSync(tempPath, JSON.stringify(db, null, 2), 'utf-8');
    fs.renameSync(tempPath, DB_FILE);
  } catch (err) {
    console.error('Error writing to admin database:', err);
  }
}

// In-Memory Rate Limiting for Login (Brute Force Defense)
const loginAttempts: Record<string, { count: number; lockedUntil: number }> = {};

function checkRateLimit(ip: string): { allowed: boolean; remainingSec: number } {
  const now = Date.now();
  const entry = loginAttempts[ip];
  if (!entry) return { allowed: true, remainingSec: 0 };

  if (entry.lockedUntil > now) {
    return { allowed: false, remainingSec: Math.ceil((entry.lockedUntil - now) / 1000) };
  }

  if (entry.lockedUntil <= now && entry.lockedUntil !== 0) {
    // Lockout expired, reset
    delete loginAttempts[ip];
    return { allowed: true, remainingSec: 0 };
  }

  return { allowed: true, remainingSec: 0 };
}

function recordFailedAttempt(ip: string) {
  const now = Date.now();
  if (!loginAttempts[ip]) {
    loginAttempts[ip] = { count: 1, lockedUntil: 0 };
  } else {
    loginAttempts[ip].count += 1;
    if (loginAttempts[ip].count >= 5) {
      // 5 failed attempts -> 15 minute lockout
      loginAttempts[ip].lockedUntil = now + 15 * 60 * 1000;
    }
  }
}

function clearRateLimit(ip: string) {
  delete loginAttempts[ip];
}

// Authentication Middleware
function requireAdminAuth(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ success: false, error: 'Unauthorized: Missing or invalid authentication token.' });
  }

  const token = authHeader.substring(7);
  const session = db.sessions[token];

  if (!session) {
    return res.status(401).json({ success: false, error: 'Unauthorized: Session expired or invalid.' });
  }

  if (session.expiresAt < Date.now()) {
    delete db.sessions[token];
    saveDb();
    return res.status(401).json({ success: false, error: 'Unauthorized: Session has expired. Please log in again.' });
  }

  // Refresh sliding window session (extend 8 hours)
  session.expiresAt = Date.now() + 8 * 60 * 60 * 1000;
  (req as any).adminEmail = session.email;
  next();
}

// ==========================================
// ADMIN API ROUTES (/api/admin/*)
// ==========================================

// 1. Admin Login (Sole authorized user: Ajjay@encryptdecrypt.org)
app.post('/api/admin/login', (req: Request, res: Response) => {
  const clientIp = (req.headers['x-forwarded-for'] as string) || req.socket.remoteAddress || 'unknown';
  const { email, password } = req.body;

  const rateCheck = checkRateLimit(clientIp);
  if (!rateCheck.allowed) {
    db.auditLogs.unshift({
      id: crypto.randomUUID(),
      timestamp: new Date().toISOString(),
      action: 'LOGIN_BLOCKED_RATE_LIMIT',
      details: `Too many failed attempts from IP ${clientIp}. Locked for ${rateCheck.remainingSec}s.`,
      ip: clientIp,
      status: 'WARNING'
    });
    saveDb();
    return res.status(429).json({
      success: false,
      error: `Security Lockout: Too many failed login attempts. Please wait ${rateCheck.remainingSec} seconds before trying again.`
    });
  }

  if (!email || !password) {
    return res.status(400).json({ success: false, error: 'Email and password are required.' });
  }

  const normalizedEmail = email.trim().toLowerCase();
  const targetEmail = db.auth.email.toLowerCase();

  if (normalizedEmail !== targetEmail) {
    recordFailedAttempt(clientIp);
    db.auditLogs.unshift({
      id: crypto.randomUUID(),
      timestamp: new Date().toISOString(),
      action: 'LOGIN_FAILED_UNKNOWN_USER',
      details: `Failed login attempt for unauthorized user: ${email}`,
      ip: clientIp,
      status: 'FAILED'
    });
    saveDb();
    return res.status(401).json({ success: false, error: 'Invalid administrator credentials.' });
  }

  const isValidPassword = verifyPassword(password, db.auth.passwordHash, db.auth.salt);
  if (!isValidPassword) {
    recordFailedAttempt(clientIp);
    db.auditLogs.unshift({
      id: crypto.randomUUID(),
      timestamp: new Date().toISOString(),
      action: 'LOGIN_FAILED_BAD_PASSWORD',
      details: `Password verification failed for ${email}`,
      ip: clientIp,
      status: 'FAILED'
    });
    saveDb();
    return res.status(401).json({ success: false, error: 'Invalid administrator credentials.' });
  }

  // Authentication succeeded!
  clearRateLimit(clientIp);
  const sessionToken = crypto.randomBytes(32).toString('hex');
  const now = new Date();
  const expiresAt = Date.now() + 8 * 60 * 60 * 1000; // 8 Hours

  db.sessions[sessionToken] = {
    email: db.auth.email,
    createdAt: now.toISOString(),
    expiresAt
  };
  db.auth.lastLogin = now.toISOString();

  db.auditLogs.unshift({
    id: crypto.randomUUID(),
    timestamp: now.toISOString(),
    action: 'ADMIN_LOGIN_SUCCESS',
    details: `Administrator ${db.auth.email} authenticated successfully.`,
    ip: clientIp,
    status: 'SUCCESS'
  });

  saveDb();

  return res.json({
    success: true,
    token: sessionToken,
    expiresAt,
    user: {
      email: db.auth.email,
      lastLogin: db.auth.lastLogin
    }
  });
});

// 2. Verify Session
app.get('/api/admin/verify-session', (req: Request, res: Response) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.json({ authenticated: false });
  }

  const token = authHeader.substring(7);
  const session = db.sessions[token];

  if (!session || session.expiresAt < Date.now()) {
    if (session) delete db.sessions[token];
    return res.json({ authenticated: false });
  }

  return res.json({
    authenticated: true,
    user: {
      email: session.email,
      lastLogin: db.auth.lastLogin
    }
  });
});

// 3. Admin Logout
app.post('/api/admin/logout', requireAdminAuth, (req: Request, res: Response) => {
  const token = req.headers.authorization!.substring(7);
  const clientIp = (req.headers['x-forwarded-for'] as string) || req.socket.remoteAddress || 'unknown';

  delete db.sessions[token];
  db.auditLogs.unshift({
    id: crypto.randomUUID(),
    timestamp: new Date().toISOString(),
    action: 'ADMIN_LOGOUT',
    details: `Administrator ${db.auth.email} logged out.`,
    ip: clientIp,
    status: 'SUCCESS'
  });
  saveDb();

  return res.json({ success: true, message: 'Logged out successfully.' });
});

// 4. Password Rotation
app.post('/api/admin/change-password', requireAdminAuth, (req: Request, res: Response) => {
  const clientIp = (req.headers['x-forwarded-for'] as string) || req.socket.remoteAddress || 'unknown';
  const { currentPassword, newPassword } = req.body;

  if (!currentPassword || !newPassword) {
    return res.status(400).json({ success: false, error: 'Current password and new password are required.' });
  }

  if (newPassword.length < 12) {
    return res.status(400).json({ success: false, error: 'New password must be at least 12 characters long.' });
  }

  const isCurrentValid = verifyPassword(currentPassword, db.auth.passwordHash, db.auth.salt);
  if (!isCurrentValid) {
    db.auditLogs.unshift({
      id: crypto.randomUUID(),
      timestamp: new Date().toISOString(),
      action: 'PASSWORD_CHANGE_FAILED',
      details: 'Current password verification failed during password update.',
      ip: clientIp,
      status: 'WARNING'
    });
    saveDb();
    return res.status(401).json({ success: false, error: 'Current password is incorrect.' });
  }

  // Update password with fresh salt & hash
  const { hash, salt } = hashPassword(newPassword);
  db.auth.passwordHash = hash;
  db.auth.salt = salt;
  db.auth.passwordUpdatedAt = new Date().toISOString();

  // Invalidate all other sessions for security
  db.sessions = {};

  // Create new session for current user
  const newToken = crypto.randomBytes(32).toString('hex');
  const now = new Date();
  db.sessions[newToken] = {
    email: db.auth.email,
    createdAt: now.toISOString(),
    expiresAt: Date.now() + 8 * 60 * 60 * 1000
  };

  db.auditLogs.unshift({
    id: crypto.randomUUID(),
    timestamp: now.toISOString(),
    action: 'PASSWORD_UPDATED',
    details: 'Master administrator password successfully updated.',
    ip: clientIp,
    status: 'SUCCESS'
  });

  saveDb();

  return res.json({
    success: true,
    message: 'Password successfully updated.',
    token: newToken
  });
});

// 5. Fetch Full System Admin State
app.get('/api/admin/data', requireAdminAuth, (req: Request, res: Response) => {
  return res.json({
    success: true,
    data: {
      toolOverrides: db.toolOverrides || {},
      categoryOverrides: db.categoryOverrides || {},
      seoOverrides: db.seoOverrides || {},
      pageContents: db.pageContents || {},
      adsConfig: db.adsConfig || {},
      settings: db.settings || {},
      auditLogs: (db.auditLogs || []).slice(0, 100)
    }
  });
});

// 6. Save Tool Overrides
app.post('/api/admin/save-tools', requireAdminAuth, (req: Request, res: Response) => {
  const clientIp = (req.headers['x-forwarded-for'] as string) || req.socket.remoteAddress || 'unknown';
  const { toolOverrides } = req.body;

  if (typeof toolOverrides !== 'object') {
    return res.status(400).json({ success: false, error: 'Invalid toolOverrides format.' });
  }

  db.toolOverrides = toolOverrides;
  db.auditLogs.unshift({
    id: crypto.randomUUID(),
    timestamp: new Date().toISOString(),
    action: 'TOOLS_OVERRIDE_SAVED',
    details: `Updated metadata/flags for ${Object.keys(toolOverrides).length} tools.`,
    ip: clientIp,
    status: 'SUCCESS'
  });

  saveDb();
  return res.json({ success: true, message: 'Tool configurations saved successfully.' });
});

// 7. Save Category Overrides
app.post('/api/admin/save-categories', requireAdminAuth, (req: Request, res: Response) => {
  const clientIp = (req.headers['x-forwarded-for'] as string) || req.socket.remoteAddress || 'unknown';
  const { categoryOverrides } = req.body;

  if (typeof categoryOverrides !== 'object') {
    return res.status(400).json({ success: false, error: 'Invalid categoryOverrides format.' });
  }

  db.categoryOverrides = categoryOverrides;
  db.auditLogs.unshift({
    id: crypto.randomUUID(),
    timestamp: new Date().toISOString(),
    action: 'CATEGORIES_OVERRIDE_SAVED',
    details: `Updated configuration for ${Object.keys(categoryOverrides).length} categories.`,
    ip: clientIp,
    status: 'SUCCESS'
  });

  saveDb();
  return res.json({ success: true, message: 'Category settings saved successfully.' });
});

// 8. Save SEO & GEO Overrides
app.post('/api/admin/save-seo', requireAdminAuth, (req: Request, res: Response) => {
  const clientIp = (req.headers['x-forwarded-for'] as string) || req.socket.remoteAddress || 'unknown';
  const { seoOverrides } = req.body;

  if (typeof seoOverrides !== 'object') {
    return res.status(400).json({ success: false, error: 'Invalid seoOverrides format.' });
  }

  db.seoOverrides = { ...db.seoOverrides, ...seoOverrides };
  db.auditLogs.unshift({
    id: crypto.randomUUID(),
    timestamp: new Date().toISOString(),
    action: 'SEO_CONFIG_SAVED',
    details: 'Global SEO metadata, structured data, and robots.txt configurations updated.',
    ip: clientIp,
    status: 'SUCCESS'
  });

  saveDb();
  return res.json({ success: true, message: 'SEO configuration saved successfully.' });
});

// 9. Save Page Content CMS Overrides
app.post('/api/admin/save-pages', requireAdminAuth, (req: Request, res: Response) => {
  const clientIp = (req.headers['x-forwarded-for'] as string) || req.socket.remoteAddress || 'unknown';
  const { pageContents } = req.body;

  if (typeof pageContents !== 'object') {
    return res.status(400).json({ success: false, error: 'Invalid pageContents format.' });
  }

  db.pageContents = { ...db.pageContents, ...pageContents };
  db.auditLogs.unshift({
    id: crypto.randomUUID(),
    timestamp: new Date().toISOString(),
    action: 'PAGES_CMS_SAVED',
    details: `Updated CMS content for pages: ${Object.keys(pageContents).join(', ')}`,
    ip: clientIp,
    status: 'SUCCESS'
  });

  saveDb();
  return res.json({ success: true, message: 'Page content successfully saved and published.' });
});

// 10. Save AdSense Configuration
app.post('/api/admin/save-ads', requireAdminAuth, (req: Request, res: Response) => {
  const clientIp = (req.headers['x-forwarded-for'] as string) || req.socket.remoteAddress || 'unknown';
  const { adsConfig } = req.body;

  if (typeof adsConfig !== 'object') {
    return res.status(400).json({ success: false, error: 'Invalid adsConfig format.' });
  }

  db.adsConfig = { ...db.adsConfig, ...adsConfig };
  db.auditLogs.unshift({
    id: crypto.randomUUID(),
    timestamp: new Date().toISOString(),
    action: 'ADSENSE_CONFIG_SAVED',
    details: `AdSense config updated. Status: ${adsConfig.enabled ? 'ACTIVE' : 'PAUSED'}, Publisher: ${adsConfig.publisherId}`,
    ip: clientIp,
    status: 'SUCCESS'
  });

  saveDb();
  return res.json({ success: true, message: 'AdSense settings saved successfully.' });
});

// 11. Save Website General Settings
app.post('/api/admin/save-settings', requireAdminAuth, (req: Request, res: Response) => {
  const clientIp = (req.headers['x-forwarded-for'] as string) || req.socket.remoteAddress || 'unknown';
  const { settings } = req.body;

  if (typeof settings !== 'object') {
    return res.status(400).json({ success: false, error: 'Invalid settings format.' });
  }

  db.settings = { ...db.settings, ...settings };
  db.auditLogs.unshift({
    id: crypto.randomUUID(),
    timestamp: new Date().toISOString(),
    action: 'SETTINGS_SAVED',
    details: 'General website configuration updated.',
    ip: clientIp,
    status: 'SUCCESS'
  });

  saveDb();
  return res.json({ success: true, message: 'General settings saved successfully.' });
});

// 12. Full System Backup Snapshot Export
app.get('/api/admin/backup', requireAdminAuth, (req: Request, res: Response) => {
  const backupSnapshot = {
    timestamp: new Date().toISOString(),
    version: '3.5.0',
    platform: 'EncryptDecrypt.org',
    data: {
      toolOverrides: db.toolOverrides,
      categoryOverrides: db.categoryOverrides,
      seoOverrides: db.seoOverrides,
      pageContents: db.pageContents,
      adsConfig: db.adsConfig,
      settings: db.settings,
      auditLogs: db.auditLogs
    }
  };

  db.settings.lastBackupTimestamp = backupSnapshot.timestamp;
  saveDb();

  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Content-Disposition', `attachment; filename=encryptdecrypt-backup-${Date.now()}.json`);
  return res.send(JSON.stringify(backupSnapshot, null, 2));
});

// 13. Full System Restore from Validated Backup
app.post('/api/admin/restore', requireAdminAuth, (req: Request, res: Response) => {
  const clientIp = (req.headers['x-forwarded-for'] as string) || req.socket.remoteAddress || 'unknown';
  const { backupData } = req.body;

  if (!backupData || !backupData.data) {
    return res.status(400).json({ success: false, error: 'Invalid backup file format.' });
  }

  const { data } = backupData;
  if (data.toolOverrides) db.toolOverrides = data.toolOverrides;
  if (data.categoryOverrides) db.categoryOverrides = data.categoryOverrides;
  if (data.seoOverrides) db.seoOverrides = data.seoOverrides;
  if (data.pageContents) db.pageContents = data.pageContents;
  if (data.adsConfig) db.adsConfig = data.adsConfig;
  if (data.settings) db.settings = data.settings;

  db.auditLogs.unshift({
    id: crypto.randomUUID(),
    timestamp: new Date().toISOString(),
    action: 'SYSTEM_RESTORE_COMPLETED',
    details: `System restored from backup created at ${backupData.timestamp || 'unknown date'}.`,
    ip: clientIp,
    status: 'SUCCESS'
  });

  saveDb();
  return res.json({ success: true, message: 'System data successfully restored from backup snapshot.' });
});

// 14. Real-time Site Health & Tool Route Diagnostics
app.get('/api/admin/site-health', requireAdminAuth, (req: Request, res: Response) => {
  try {
    const toolsPath = path.join(__dirname, 'public', 'assets', 'data', 'tools.json');
    let toolsCount = 0;
    let popularCount = 0;
    let categoriesCount = 0;
    const missingMetadata: string[] = [];

    if (fs.existsSync(toolsPath)) {
      const rawTools = JSON.parse(fs.readFileSync(toolsPath, 'utf-8'));
      toolsCount = rawTools.length;
      const categoriesSet = new Set<string>();

      rawTools.forEach((t: any) => {
        if (t.category) categoriesSet.add(t.category);
        if (t.popular) popularCount++;
        if (!t.shortDesc || !t.name || !t.slug) {
          missingMetadata.push(t.name || t.id || 'Unnamed Tool');
        }
      });
      categoriesCount = categoriesSet.size;
    }

    const sitemapExists = fs.existsSync(path.join(__dirname, 'public', 'sitemap.xml'));
    const robotsExists = fs.existsSync(path.join(__dirname, 'public', 'robots.txt'));
    const llmsExists = fs.existsSync(path.join(__dirname, 'public', 'llms.txt'));

    return res.json({
      success: true,
      health: {
        status: missingMetadata.length === 0 ? 'HEALTHY' : 'WARNINGS',
        score: missingMetadata.length === 0 ? 100 : 92,
        totalTools: toolsCount,
        popularTools: popularCount,
        totalCategories: categoriesCount,
        sitemapStatus: sitemapExists ? 'VALID' : 'MISSING',
        robotsStatus: robotsExists ? 'VALID' : 'MISSING',
        llmsStatus: llmsExists ? 'VALID' : 'MISSING',
        missingMetadataIssues: missingMetadata,
        lastCheckTimestamp: new Date().toISOString(),
        serverMemoryMb: Math.round(process.memoryUsage().heapUsed / 1024 / 1024),
        uptimeSeconds: Math.round(process.uptime())
      }
    });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

// Public read-only endpoint for live public site to consume persistent admin overrides
app.get('/api/public/config', (req: Request, res: Response) => {
  return res.json({
    toolOverrides: db.toolOverrides || {},
    categoryOverrides: db.categoryOverrides || {},
    seoOverrides: db.seoOverrides || {},
    pageContents: db.pageContents || {},
    adsConfig: db.adsConfig || {},
    settings: {
      siteName: db.settings?.siteName || 'EncryptDecrypt.org',
      maintenanceMode: db.settings?.maintenanceMode || false
    }
  });
});

// AI Catalog & ARD Protocol Manifest Endpoints (RFC 8141 & ARD Spec)
const serveAiCatalog = (req: Request, res: Response) => {
  const filePath = path.join(__dirname, 'public', '.well-known', 'ai-catalog.json');
  if (fs.existsSync(filePath)) {
    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Cache-Control', 'public, max-age=3600');
    return res.sendFile(filePath);
  }
  return res.status(404).json({ error: 'Manifest not found' });
};

const serveMcp = (req: Request, res: Response) => {
  const filePath = path.join(__dirname, 'public', '.well-known', 'mcp.json');
  if (fs.existsSync(filePath)) {
    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Cache-Control', 'public, max-age=3600');
    return res.sendFile(filePath);
  }
  return res.status(404).json({ error: 'MCP manifest not found' });
};

app.get('/.well-known/ai-catalog.json', serveAiCatalog);
app.get('/ai-catalog.json', serveAiCatalog);
app.get('/.well-known/ard.json', serveAiCatalog);
app.get('/ard.json', serveAiCatalog);
app.get('/.well-known/mcp.json', serveMcp);
app.get('/mcp.json', serveMcp);

// RSS 2.0 Syndication Feed Endpoint (RFC 822 / RSS 2.0 Spec)
const serveRssFeed = (req: Request, res: Response) => {
  const filePath = path.join(__dirname, 'public', 'rss.xml');
  if (fs.existsSync(filePath)) {
    res.setHeader('Content-Type', 'application/rss+xml; charset=utf-8');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Cache-Control', 'public, max-age=3600, s-maxage=86400, stale-while-revalidate=86400');
    return res.sendFile(filePath);
  }
  return res.status(404).json({ error: 'RSS feed not found' });
};

app.get('/rss.xml', serveRssFeed);
app.get('/feed.xml', serveRssFeed);
app.get('/rss', serveRssFeed);

// ==========================================
// VITE DEV SERVER / PRODUCTION STATIC ASSETS
// ==========================================

async function startServer() {
  if (!isProd) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(__dirname, 'dist');
    app.use(express.static(distPath, { dotfiles: 'allow' }));
    app.get('*', (req: Request, res: Response) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`\n======================================================`);
    console.log(`🚀 EncryptDecrypt.org Server running at http://0.0.0.0:${PORT}`);
    console.log(`🔒 Sole Authorized Administrator: ${db.auth.email}`);
    console.log(`🛡️ Rate-limiting & PBKDF2 Password Security Active`);
    console.log(`======================================================\n`);
  });
}

startServer();
