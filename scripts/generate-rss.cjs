/**
 * EncryptDecrypt Tools Updates - RSS 2.0 Generator
 * Generates valid RSS 2.0 XML feed for all 1,380+ tools for social syndication
 * Channel: 'EncryptDecrypt Tools Updates'
 * Link: 'https://www.encryptdecrypt.org'
 */

const fs = require('fs');
const path = require('path');

// Safe CDATA wrapper to prevent any XML escaping conflicts
function cdata(str) {
  if (!str) return '';
  const cleaned = String(str).replace(/]]>/g, ']]]]><![CDATA[>');
  return `<![CDATA[${cleaned}]]>`;
}

// Function to generate the complete RSS 2.0 XML feed string
function generateRssXml(tools, options = {}) {
  const baseUrl = options.baseUrl || 'https://www.encryptdecrypt.org';
  const channelTitle = options.channelTitle || 'EncryptDecrypt Tools Updates';
  const channelDesc = options.channelDesc || '1,380+ free, client-side, zero-knowledge cryptographic tools, encoders, formatters, and developer utilities running securely in your browser.';
  const buildDate = options.buildDate || new Date().toUTCString();

  // Baseline time for pubDates
  const now = Date.now();
  // 1 hour intervals backwards so feed items have distinct, descending chronological order
  const ONE_HOUR = 3600 * 1000;

  const itemsXml = tools.map((tool, index) => {
    const slug = tool.slug || tool.id;
    const url = `${baseUrl}/tools/${slug}`;
    const name = tool.name || slug;
    const desc = tool.shortDesc || tool.metaDescription || `Free online ${name} developer utility on EncryptDecrypt.org.`;
    const category = tool.categoryName || tool.category || 'Developer Tools';
    
    // Decrement publication date slightly for syndication queues (e.g. Buffer, Zapier, IFTTT)
    const pubDate = new Date(now - index * ONE_HOUR).toUTCString();

    return `    <item>
      <title>${cdata(name)}</title>
      <link>${url}</link>
      <guid isPermaLink="true">${url}</guid>
      <description>${cdata(desc)}</description>
      <category>${cdata(category)}</category>
      <pubDate>${pubDate}</pubDate>
    </item>`;
  }).join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" 
     xmlns:atom="http://www.w3.org/2005/Atom"
     xmlns:content="http://purl.org/rss/1.0/modules/content/"
     xmlns:dc="http://purl.org/dc/elements/1.1/">
  <channel>
    <title>${channelTitle}</title>
    <link>${baseUrl}</link>
    <description>${channelDesc}</description>
    <language>en-us</language>
    <lastBuildDate>${buildDate}</lastBuildDate>
    <atom:link href="${baseUrl}/rss.xml" rel="self" type="application/rss+xml" />
    <docs>https://www.rssboard.org/rss-specification</docs>
    <generator>EncryptDecrypt RSS 2.0 Engine</generator>
    <managingEditor>contact@encryptdecrypt.org (EncryptDecrypt)</managingEditor>
    <webMaster>contact@encryptdecrypt.org (EncryptDecrypt Webmaster)</webMaster>
    <ttl>60</ttl>
    <image>
      <url>${baseUrl}/favicon.png</url>
      <title>${channelTitle}</title>
      <link>${baseUrl}</link>
      <width>64</width>
      <height>64</height>
    </image>
${itemsXml}
  </channel>
</rss>
`;
}

// Main execution when run directly via node scripts/generate-rss.cjs
function main() {
  const toolsPath = path.join(__dirname, '../public/assets/data/tools.json');
  if (!fs.existsSync(toolsPath)) {
    console.error(`Error: tools.json not found at ${toolsPath}`);
    process.exit(1);
  }

  const tools = JSON.parse(fs.readFileSync(toolsPath, 'utf8'));
  console.log(`Loaded ${tools.length} tools from tools.json`);

  const rssXml = generateRssXml(tools);

  // Write to public/rss.xml (served statically in Vite/Vercel)
  const publicRssPath = path.join(__dirname, '../public/rss.xml');
  fs.writeFileSync(publicRssPath, rssXml, 'utf8');
  console.log(`✅ Saved public/rss.xml (${(rssXml.length / 1024).toFixed(1)} KB)`);

  // Write to root rss.xml (for static host root fallbacks)
  const rootRssPath = path.join(__dirname, '../rss.xml');
  fs.writeFileSync(rootRssPath, rssXml, 'utf8');
  console.log(`✅ Saved root rss.xml`);

  // Write to dist/rss.xml if dist directory exists
  const distDir = path.join(__dirname, '../dist');
  if (fs.existsSync(distDir)) {
    fs.writeFileSync(path.join(distDir, 'rss.xml'), rssXml, 'utf8');
    console.log(`✅ Saved dist/rss.xml`);
  }

  console.log(`🎉 Successfully generated RSS 2.0 feed with ${tools.length} tools items!`);
}

if (require.main === module) {
  main();
}

module.exports = { generateRssXml };
