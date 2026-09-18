/**
 * encryptdecrypt.org - Programmatic Static Site Generator
 * Generates all clean URL directory paths, sitemaps, robots.txt, and llms.txt
 */

const fs = require('fs');
const path = require('path');

const tools = JSON.parse(fs.readFileSync(path.join(__dirname, '../assets/data/tools.json'), 'utf8'));
const template = fs.readFileSync(path.join(__dirname, '../templates/tool-template.html'), 'utf8');

// Ensure directories exist
function ensureDir(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
}

// Group tools by category
const categoryMap = new Map();
tools.forEach(tool => {
  if (!categoryMap.has(tool.category)) {
    categoryMap.set(tool.category, {
      name: tool.categoryName,
      slug: tool.category,
      tools: []
    });
  }
  categoryMap.get(tool.category).tools.push(tool);
});

console.log(`Building static structure for ${tools.length} tools across ${categoryMap.size} categories...`);

// 1. Generate Individual Tool Pages: /tools/{category-slug}/{tool-slug}/index.html
tools.forEach(tool => {
  const toolDir = path.join(__dirname, `../dist-static/tools/${tool.category}/${tool.slug}`);
  ensureDir(toolDir);

  const relatedHtml = (tool.related || []).map(relId => {
    const rel = tools.find(t => t.id === relId);
    if (!rel) return '';
    return `<li style="margin-bottom: 8px;"><a href="/tools/${rel.category}/${rel.slug}/" style="color: var(--text-secondary); font-size: 13px;">${rel.name}</a></li>`;
  }).join('');

  let html = template
    .replace(/{{META_TITLE}}/g, tool.metaTitle)
    .replace(/{{META_DESCRIPTION}}/g, tool.metaDescription)
    .replace(/{{CATEGORY_NAME}}/g, tool.categoryName)
    .replace(/{{CATEGORY_SLUG}}/g, tool.category)
    .replace(/{{TOOL_NAME}}/g, tool.name)
    .replace(/{{TOOL_SLUG}}/g, tool.slug)
    .replace(/{{PRIMARY_KEYWORD}}/g, tool.primaryKeyword)
    .replace(/{{ACTION_PRIMARY_LABEL}}/g, tool.name.includes('Encode') ? 'Encode' : (tool.name.includes('Encrypt') ? 'Encrypt' : 'Generate'))
    .replace(/{{ACTION_SECONDARY_LABEL}}/g, tool.name.includes('Decode') ? 'Decode' : (tool.name.includes('Decrypt') ? 'Decrypt' : 'Verify'))
    .replace(/{{RELATED_TOOLS_LIST}}/g, relatedHtml)
    .replace(/{{SEO_SECTION_WHAT_IS}}/g, `${tool.name} is a high-performance, browser-native security utility for developers needing fast and confidential data processing without network latency.`)
    .replace(/{{SEO_SECTION_HOW_IT_WORKS}}/g, `${tool.name} executes purely within JavaScript Web Crypto memory boundaries, converting buffers without third-party RPCs.`)
    .replace(/{{CODE_WORKED_EXAMPLE}}/g, `// Example transformation with ${tool.name}\nconst input = "Sample cryptographic payload";\nconsole.log("Processed:", input);`)
    .replace(/{{SEO_SECTION_USE_CASES}}/g, `<p>Commonly applied in authentication handshakes, token verification, and payload obfuscation.</p>`)
    .replace(/{{SEO_SECTION_SECURITY}}/g, `Because operations execute client-side, zero plaintext is broadcast over the wire, protecting against MITM and server log inspection.`)
    .replace(/{{CODE_EXAMPLE_JS}}/g, `// In-browser execution snippet\nasync function run() {\n  // 100% Client-Side Web Crypto\n  console.log("Executing ${tool.name}");\n}`)
    .replace(/{{SEO_SECTION_BEST_PRACTICES}}/g, `Always keep encryption keys confidential and verify checksum outputs against trusted digests.`);

  fs.writeFileSync(path.join(toolDir, 'index.html'), html);
});

// 2. Generate robots.txt
const robotsTxt = `User-agent: *
Allow: /
Disallow: /search?
Disallow: /*?*

Sitemap: https://encryptdecrypt.org/sitemap.xml
`;
fs.writeFileSync(path.join(__dirname, '../robots.txt'), robotsTxt);
fs.writeFileSync(path.join(__dirname, '../public/robots.txt'), robotsTxt);

// 3. Generate llms.txt (Plain text index of all tools for AI crawlers)
let llmsTxt = `# encryptdecrypt.org - LLM & AI Crawler Tools Directory
# Free, 100% Client-Side Developer Cryptography, Encoding & Utility Tools

`;
tools.forEach(t => {
  llmsTxt += `- [${t.name}](https://encryptdecrypt.org/tools/${t.category}/${t.slug}/): ${t.shortDesc}\n`;
});
fs.writeFileSync(path.join(__dirname, '../llms.txt'), llmsTxt);
fs.writeFileSync(path.join(__dirname, '../public/llms.txt'), llmsTxt);

// 4. Generate sitemap.xml
let sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://encryptdecrypt.org/</loc>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>https://encryptdecrypt.org/tools/</loc>
    <changefreq>daily</changefreq>
    <priority>0.9</priority>
  </url>
`;

tools.forEach(t => {
  sitemapXml += `  <url>
    <loc>https://encryptdecrypt.org/tools/${t.category}/${t.slug}/</loc>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>\n`;
});

sitemapXml += `</urlset>`;
fs.writeFileSync(path.join(__dirname, '../sitemap.xml'), sitemapXml);
fs.writeFileSync(path.join(__dirname, '../public/sitemap.xml'), sitemapXml);

console.log('Successfully generated static tool directories, robots.txt, llms.txt, and sitemap.xml.');
