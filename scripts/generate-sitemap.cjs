const fs = require('fs');
const path = require('path');

const toolsPath = path.join(__dirname, '../public/assets/data/tools.json');
const tools = JSON.parse(fs.readFileSync(toolsPath, 'utf8'));

const baseUrl = 'https://encryptdecrypt.org';
const staticUrls = [
  { loc: `${baseUrl}/`, priority: '1.0', changefreq: 'daily' },
  { loc: `${baseUrl}/tools/`, priority: '0.9', changefreq: 'daily' },
  { loc: `${baseUrl}/about`, priority: '0.7', changefreq: 'monthly' },
  { loc: `${baseUrl}/guides`, priority: '0.8', changefreq: 'weekly' },
  { loc: `${baseUrl}/contact`, priority: '0.7', changefreq: 'monthly' },
  { loc: `${baseUrl}/privacy`, priority: '0.5', changefreq: 'monthly' },
  { loc: `${baseUrl}/terms`, priority: '0.5', changefreq: 'monthly' },
  { loc: `${baseUrl}/disclaimer`, priority: '0.5', changefreq: 'monthly' },
];

const categorySlugs = [...new Set(tools.map(t => t.category))];
const categoryUrls = categorySlugs.map(cat => ({
  loc: `${baseUrl}/category/${cat}`,
  priority: '0.85',
  changefreq: 'weekly'
}));

const toolUrls = tools.map(t => ({
  loc: `${baseUrl}/tool/${t.slug}`,
  priority: t.popular ? '0.9' : '0.8',
  changefreq: 'weekly'
}));

const allUrls = [...staticUrls, ...categoryUrls, ...toolUrls];

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allUrls.map(u => `  <url>
    <loc>${u.loc}</loc>
    <changefreq>${u.changefreq}</changefreq>
    <priority>${u.priority}</priority>
  </url>`).join('\n')}
</urlset>
`;

fs.writeFileSync(path.join(__dirname, '../sitemap.xml'), sitemap, 'utf8');
fs.writeFileSync(path.join(__dirname, '../public/sitemap.xml'), sitemap, 'utf8');
console.log(`Generated sitemap with ${allUrls.length} URLs (including ${tools.length} tools).`);
