const fs = require('fs');
const path = require('path');

const toolsPath = path.join(__dirname, '../public/assets/data/tools.json');
const tools = JSON.parse(fs.readFileSync(toolsPath, 'utf8'));

const baseUrl = 'https://www.encryptdecrypt.org';
const today = new Date().toISOString().split('T')[0]; // '2026-09-29'

const staticUrls = [
  { loc: `${baseUrl}/`, priority: '1.0', changefreq: 'daily', lastmod: today },
  { loc: `${baseUrl}/all-tools`, priority: '0.95', changefreq: 'daily', lastmod: today },
  { loc: `${baseUrl}/guides`, priority: '0.85', changefreq: 'weekly', lastmod: today },
  { loc: `${baseUrl}/about`, priority: '0.7', changefreq: 'monthly', lastmod: today },
  { loc: `${baseUrl}/contact`, priority: '0.7', changefreq: 'monthly', lastmod: today },
  { loc: `${baseUrl}/privacy`, priority: '0.5', changefreq: 'monthly', lastmod: today },
  { loc: `${baseUrl}/terms`, priority: '0.5', changefreq: 'monthly', lastmod: today },
  { loc: `${baseUrl}/disclaimer`, priority: '0.5', changefreq: 'monthly', lastmod: today },
];

// All category slugs (from both tools metadata and category hub configs)
const categorySlugs = [
  'json-developer-tools',
  'api-web-development',
  'seo-webmaster',
  'website-performance',
  'accessibility-tools',
  'text-writing-utilities',
  'file-data-tools',
  'date-calendar-time-tools',
  'math-science',
  'color-design',
  'network-dns-tools',
  'defensive-security-tools',
  'developer-generators',
  'image-web-optimization',
  'encoding-decoding',
  'encryption-ciphers',
  'hashing-security',
  'generators-tokens',
  'dev-tools-formatters',
  'file-data-converters',
  'validators-checkers',
  'text-utilities',
  'escape-network',
  'security-certificates',
  'math-design',
  'network-online',
  'converters-utilities',
  ...new Set(tools.map(t => t.category).filter(Boolean))
];

const uniqueCategorySlugs = [...new Set(categorySlugs)];

const categoryUrls = uniqueCategorySlugs.map(cat => ({
  loc: `${baseUrl}/category/${cat}`,
  priority: '0.85',
  changefreq: 'weekly',
  lastmod: today
}));

// Canonical Tool URLs (/tools/:slug)
const toolUrls = tools.map(t => ({
  loc: `${baseUrl}/tools/${t.slug}`,
  priority: t.popular ? '0.9' : '0.8',
  changefreq: 'weekly',
  lastmod: today
}));

// Unique list of all indexable URLs
const allUrlsMap = new Map();
[...staticUrls, ...categoryUrls, ...toolUrls].forEach(item => {
  allUrlsMap.set(item.loc, item);
});

const allUrls = Array.from(allUrlsMap.values());

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allUrls.map(u => `  <url>
    <loc>${u.loc}</loc>
    <lastmod>${u.lastmod}</lastmod>
  </url>`).join('\n')}
</urlset>
`;

// Write sitemap to root, public, and dist (if dist exists)
fs.writeFileSync(path.join(__dirname, '../sitemap.xml'), sitemap, 'utf8');
fs.writeFileSync(path.join(__dirname, '../public/sitemap.xml'), sitemap, 'utf8');

const distPath = path.join(__dirname, '../dist');
if (fs.existsSync(distPath)) {
  fs.writeFileSync(path.join(distPath, 'sitemap.xml'), sitemap, 'utf8');
}

console.log(`Generated XML Sitemap successfully with ${allUrls.length} total URLs (${tools.length} tools, ${uniqueCategorySlugs.length} categories, ${staticUrls.length} pages).`);
