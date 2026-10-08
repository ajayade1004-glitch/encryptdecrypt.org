// Vercel Serverless Function: /api/rss
// Returns dynamic or freshly cached RSS 2.0 feed for all 1,380+ tools
import fs from 'fs';
import path from 'path';

function cdata(str) {
  if (!str) return '';
  const cleaned = String(str).replace(/]]>/g, ']]]]><![CDATA[>');
  return `<![CDATA[${cleaned}]]>`;
}

export default function handler(req, res) {
  try {
    // 1. If static pre-built rss.xml exists, stream it directly for ultra-fast response
    const staticRssPath = path.join(process.cwd(), 'public', 'rss.xml');
    if (fs.existsSync(staticRssPath)) {
      const xml = fs.readFileSync(staticRssPath, 'utf8');
      res.setHeader('Content-Type', 'application/rss+xml; charset=utf-8');
      res.setHeader('Cache-Control', 'public, max-age=3600, s-maxage=86400, stale-while-revalidate=86400');
      return res.status(200).send(xml);
    }

    // 2. Otherwise generate dynamically on the fly from tools.json
    const toolsPath = path.join(process.cwd(), 'public', 'assets', 'data', 'tools.json');
    const tools = JSON.parse(fs.readFileSync(toolsPath, 'utf8'));

    const baseUrl = 'https://www.encryptdecrypt.org';
    const channelTitle = 'EncryptDecrypt Tools Updates';
    const channelDesc = '1,380+ free, client-side, zero-knowledge cryptographic tools, encoders, formatters, and developer utilities running securely in your browser.';
    const buildDate = new Date().toUTCString();
    const now = Date.now();
    const ONE_HOUR = 3600 * 1000;

    const itemsXml = tools.map((tool, index) => {
      const slug = tool.slug || tool.id;
      const url = `${baseUrl}/tools/${slug}`;
      const name = tool.name || slug;
      const desc = tool.shortDesc || tool.metaDescription || `Free online ${name} developer utility on EncryptDecrypt.org.`;
      const category = tool.categoryName || tool.category || 'Developer Tools';
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

    const rssXml = `<?xml version="1.0" encoding="UTF-8"?>
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

    res.setHeader('Content-Type', 'application/rss+xml; charset=utf-8');
    res.setHeader('Cache-Control', 'public, max-age=3600, s-maxage=86400, stale-while-revalidate=86400');
    return res.status(200).send(rssXml);
  } catch (error) {
    console.error('Error generating dynamic RSS feed:', error);
    return res.status(500).json({ error: 'Failed to generate RSS feed' });
  }
}
