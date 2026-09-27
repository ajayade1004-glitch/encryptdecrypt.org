/**
 * URL & UTM Client-Side Developer Engines
 * 100% browser-native URL parsing, UTM campaign builders, domain extractors, and query builders.
 */

function parseSafeUrl(rawUrl: string): URL {
  let urlStr = (rawUrl || '').trim();
  if (!/^https?:\/\//i.test(urlStr)) {
    urlStr = 'https://' + urlStr;
  }
  return new URL(urlStr);
}

/**
 * 1. URL Character Counter
 */
export function countUrlCharacters(rawUrl: string): string {
  const url = (rawUrl || 'https://encryptdecrypt.org/tools/web-developer-css-tools/?ref=producthunt&utm_source=newsletter').trim();
  let parsed: URL | null = null;
  try {
    parsed = parseSafeUrl(url);
  } catch {}

  const len = url.length;
  const pathLen = parsed ? parsed.pathname.length : 0;
  const queryLen = parsed ? parsed.search.length : 0;
  const hashLen = parsed ? parsed.hash.length : 0;

  let advice = 'Optimal (< 60 chars - Zero SERP snippet truncation)';
  if (len > 120) advice = 'Very Long (> 120 chars - Truncated on mobile and desktop search snippets)';
  else if (len > 75) advice = 'Moderate (> 75 chars - May truncate on compact mobile viewports)';

  return `=== URL CHARACTER COUNTER & BREAKDOWN ===
Total Characters : ${len}
Protocol Length  : ${parsed ? parsed.protocol.length : 0} chars
Domain / Host    : ${parsed ? parsed.hostname.length : 0} chars ("${parsed?.hostname || ''}")
Path Length      : ${pathLen} chars
Query String     : ${queryLen} chars (${parsed ? Array.from(parsed.searchParams.keys()).length : 0} parameters)
Hash Fragment    : ${hashLen} chars
Status Rating    : ${advice}

Recommendation:
${len > 75 ? '• Consider removing superfluous tracking parameters or shortening path slugs for cleaner sharing.' : '✓ Clean, concise URL length optimized for social sharing and search engines.'}`;
}

/**
 * 2. URL Structure Inspector
 */
export function inspectUrlStructure(rawUrl: string): string {
  try {
    const url = parseSafeUrl(rawUrl || 'https://sub.api.encryptdecrypt.org:8443/v2/crypto/keys?format=pem&verbose=1#section-3');

    const params: string[] = [];
    url.searchParams.forEach((v, k) => {
      params.push(`    • ${k} = "${v}"`);
    });

    return `=== URL COMPONENT ARCHITECTURE ===
Full URL         : ${url.href}
Protocol (Scheme): ${url.protocol.replace(':', '')} (${url.protocol === 'https:' ? 'Secure SSL/TLS' : 'Insecure HTTP'})
Host / FQDN      : ${url.hostname}
Port             : ${url.port || (url.protocol === 'https:' ? '443 (Default)' : '80 (Default)')}
Pathname         : ${url.pathname}
Query String     : ${url.search || '(None)'}
Parameters (${url.searchParams.size}):\n${params.join('\n') || '    (None)'}
Hash / Anchor    : ${url.hash || '(None)'}
Origin           : ${url.origin}`;
  } catch (err: any) {
    return `Error parsing URL structure: ${err.message}`;
  }
}

/**
 * 3. URL Parameter Cleaner
 */
export function cleanUrlParameters(rawUrl: string, removeTracking = true): string {
  try {
    const url = parseSafeUrl(rawUrl || 'https://encryptdecrypt.org/tools/?utm_source=twitter&utm_medium=social&utm_campaign=launch&fbclid=IwAR2&session_id=987123&keep=1');
    const trackingParams = [
      'utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content',
      'fbclid', 'gclid', 'msclkid', 'mc_cid', 'mc_eid', 'session_id', 'ref'
    ];

    const removed: string[] = [];
    if (removeTracking) {
      trackingParams.forEach(p => {
        if (url.searchParams.has(p)) {
          removed.push(p);
          url.searchParams.delete(p);
        }
      });
    }

    return `=== CLEANED URL RESULT ===
Clean URL:
${url.href}

Removed Tracking Parameters (${removed.length}):
${removed.map(r => `• ${r}`).join('\n') || '(No tracking parameters found)'}`;
  } catch (err: any) {
    return `Error: ${err.message}`;
  }
}

/**
 * 4. UTM Builder
 */
export function buildUtmUrl(
  baseUrl = 'https://encryptdecrypt.org/tools',
  source = 'newsletter',
  medium = 'email',
  campaign = 'autumn_release_2026',
  term = 'developer_tools',
  content = 'header_cta_button'
): string {
  try {
    const url = parseSafeUrl(baseUrl);
    if (source.trim()) url.searchParams.set('utm_source', source.trim().toLowerCase().replace(/\s+/g, '_'));
    if (medium.trim()) url.searchParams.set('utm_medium', medium.trim().toLowerCase().replace(/\s+/g, '_'));
    if (campaign.trim()) url.searchParams.set('utm_campaign', campaign.trim().toLowerCase().replace(/\s+/g, '_'));
    if (term.trim()) url.searchParams.set('utm_term', term.trim().toLowerCase().replace(/\s+/g, '_'));
    if (content.trim()) url.searchParams.set('utm_content', content.trim().toLowerCase().replace(/\s+/g, '_'));

    return `=== GENERATED CAMPAIGN UTM URL ===
${url.href}

Component Breakdown:
• Base URL     : ${url.origin}${url.pathname}
• utm_source   : ${url.searchParams.get('utm_source') || ''} (Referrer/Platform)
• utm_medium   : ${url.searchParams.get('utm_medium') || ''} (Marketing medium)
• utm_campaign : ${url.searchParams.get('utm_campaign') || ''} (Product / Promo name)
• utm_term     : ${url.searchParams.get('utm_term') || ''} (Keywords)
• utm_content  : ${url.searchParams.get('utm_content') || ''} (A/B Test / Link identifier)`;
  } catch (err: any) {
    return `Error building UTM URL: ${err.message}`;
  }
}

/**
 * 5. UTM Parser
 */
export function parseUtmParameters(rawUrl: string): string {
  try {
    const url = parseSafeUrl(rawUrl || 'https://encryptdecrypt.org/?utm_source=linkedin&utm_medium=cpc&utm_campaign=q4_growth&utm_term=cryptography&utm_content=banner_v2');
    const utmKeys = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content', 'utm_id'];
    const found: Record<string, string> = {};

    utmKeys.forEach(k => {
      if (url.searchParams.has(k)) {
        found[k] = url.searchParams.get(k) || '';
      }
    });

    const lines = [
      `=== PARSED UTM PARAMETERS ===`,
      `Target URL : ${url.origin}${url.pathname}`,
      `Total UTMs : ${Object.keys(found).length} found`,
      ''
    ];

    if (Object.keys(found).length === 0) {
      lines.push('⚠️ No standard UTM parameters detected in this URL.');
    } else {
      for (const [k, v] of Object.entries(found)) {
        lines.push(`• ${k.padEnd(14)} : "${v}"`);
      }
    }

    return lines.join('\n');
  } catch (err: any) {
    return `Error: ${err.message}`;
  }
}

/**
 * 6. UTM Validator
 */
export function validateUtmParameters(rawUrl: string): string {
  try {
    const url = parseSafeUrl(rawUrl || 'https://encryptdecrypt.org/?utm_source=Google&utm_medium=Email');
    const reports: string[] = ['=== UTM VALIDATION & GA4 COMPLIANCE REPORT ==='];
    const source = url.searchParams.get('utm_source');
    const medium = url.searchParams.get('utm_medium');
    const campaign = url.searchParams.get('utm_campaign');

    if (!source) reports.push('❌ Missing required parameter: utm_source (e.g. google, twitter, newsletter)');
    else reports.push(`✓ utm_source present: "${source}"`);

    if (!medium) reports.push('❌ Missing required parameter: utm_medium (e.g. cpc, email, social, referral)');
    else reports.push(`✓ utm_medium present: "${medium}"`);

    if (!campaign) reports.push('⚠️ Missing recommended parameter: utm_campaign (e.g. spring_sale_2026)');
    else reports.push(`✓ utm_campaign present: "${campaign}"`);

    // Check uppercase casing
    url.searchParams.forEach((v, k) => {
      if (k.startsWith('utm_') && /[A-Z]/.test(v)) {
        reports.push(`⚠️ Parameter "${k}" contains uppercase letters ("${v}"). GA4 treats parameters case-sensitively. Consider lowercase ("${v.toLowerCase()}").`);
      }
    });

    return reports.join('\n');
  } catch (err: any) {
    return `Error: ${err.message}`;
  }
}

/**
 * 7. UTM Campaign Generator
 */
export function generateUtmCampaignSet(
  baseUrl = 'https://encryptdecrypt.org/tool=css-clamp-generator',
  campaign = 'v2_launch'
): string {
  const channels = [
    { name: 'Twitter / X', source: 'twitter', medium: 'social' },
    { name: 'LinkedIn Post', source: 'linkedin', medium: 'social' },
    { name: 'Email Newsletter', source: 'newsletter', medium: 'email' },
    { name: 'Google Ads CPC', source: 'google', medium: 'cpc' },
    { name: 'Reddit Developer', source: 'reddit', medium: 'community' },
    { name: 'Product Hunt', source: 'producthunt', medium: 'referral' }
  ];

  const results = [`=== MULTI-CHANNEL UTM CAMPAIGN URLs ===`, `Campaign: [${campaign}]`, ''];

  channels.forEach(ch => {
    const u = parseSafeUrl(baseUrl);
    u.searchParams.set('utm_source', ch.source);
    u.searchParams.set('utm_medium', ch.medium);
    u.searchParams.set('utm_campaign', campaign);
    results.push(`📌 ${ch.name}:`);
    results.push(u.href);
    results.push('');
  });

  return results.join('\n');
}

/**
 * 8. URL Path Segment Extractor
 */
export function extractUrlPathSegments(rawUrl: string): string {
  try {
    const url = parseSafeUrl(rawUrl || 'https://encryptdecrypt.org/tools/category/web-developer-css-tools/item/42');
    const segments = url.pathname.split('/').filter(Boolean);

    return `=== URL PATH SEGMENT HIERARCHY ===
Full Path: ${url.pathname}
Segments Count: ${segments.length}

${segments.map((s, idx) => `Level ${idx + 1}: "${s}" (Depth: /${segments.slice(0, idx + 1).join('/')})`).join('\n')}`;
  } catch (err: any) {
    return `Error: ${err.message}`;
  }
}

/**
 * 9. Domain Extractor
 */
export function extractDomain(rawUrl: string): string {
  const lines = (rawUrl || 'https://sub.encryptdecrypt.org/test\nhttp://api.github.com/v3\nhttps://developer.mozilla.org/en-US/')
    .split(/\r?\n/).map(l => l.trim()).filter(Boolean);

  const results: string[] = ['=== EXTRACTED DOMAINS ==='];
  lines.forEach(line => {
    try {
      const u = parseSafeUrl(line);
      results.push(`• ${u.hostname}`);
    } catch {
      results.push(`• (Invalid URL: ${line})`);
    }
  });

  return results.join('\n');
}

/**
 * 10. Subdomain Extractor
 */
export function extractSubdomain(rawUrl: string): string {
  try {
    const u = parseSafeUrl(rawUrl || 'https://staging.api.encryptdecrypt.org/health');
    const parts = u.hostname.split('.');
    let subdomain = '';

    if (parts.length > 2) {
      subdomain = parts.slice(0, parts.length - 2).join('.');
    }

    return `=== SUBDOMAIN INSPECTOR ===
Host Name  : ${u.hostname}
Subdomain  : ${subdomain ? `"${subdomain}"` : '(None / Apex root domain)'}
Root Domain: ${parts.slice(-2).join('.')}
SLD        : ${parts[parts.length - 2] || ''}
TLD        : .${parts[parts.length - 1] || ''}`;
  } catch (err: any) {
    return `Error: ${err.message}`;
  }
}

/**
 * 11. Protocol Extractor
 */
export function extractProtocol(rawUrl: string): string {
  try {
    const u = parseSafeUrl(rawUrl || 'wss://socket.encryptdecrypt.org:9000/stream');
    return `=== PROTOCOL / SCHEME DETAILS ===
Input URL : ${rawUrl}
Protocol  : ${u.protocol.replace(':', '')}
Encrypted : ${['https:', 'wss:', 'sftp:', 'ftps:'].includes(u.protocol) ? 'Yes (Encrypted Transport)' : 'No / Unencrypted'}
Standard Port: ${u.protocol === 'https:' ? '443' : u.protocol === 'http:' ? '80' : u.protocol === 'wss:' ? '443' : 'custom'}`;
  } catch (err: any) {
    return `Error: ${err.message}`;
  }
}

/**
 * 12. Port Extractor
 */
export function extractPort(rawUrl: string): string {
  try {
    const u = parseSafeUrl(rawUrl || 'http://127.0.0.1:3000/dashboard');
    const explicitPort = u.port;
    const defaultPort = u.protocol === 'https:' ? '443' : '80';

    return `=== PORT INSPECTION ===
Host Name     : ${u.hostname}
Explicit Port : ${explicitPort || '(None explicitly defined)'}
Active Port   : ${explicitPort || defaultPort}
Standard Port : ${defaultPort}`;
  } catch (err: any) {
    return `Error: ${err.message}`;
  }
}

/**
 * 13. Filename from URL Extractor
 */
export function extractFilenameFromUrl(rawUrl: string): string {
  try {
    const u = parseSafeUrl(rawUrl || 'https://encryptdecrypt.org/assets/downloads/archive-v2.5.tar.gz?token=abc#hash');
    const segments = u.pathname.split('/').filter(Boolean);
    const last = segments[segments.length - 1] || '';
    const hasDot = last.includes('.');
    const filename = hasDot ? last : '(None - Directory path)';
    const ext = hasDot ? last.slice(last.lastIndexOf('.')) : '';

    return `=== URL FILENAME & ASSET EXTRACTOR ===
Full Path : ${u.pathname}
Filename  : ${filename}
Extension : ${ext || '(None)'}`;
  } catch (err: any) {
    return `Error: ${err.message}`;
  }
}

/**
 * 14. Query String Builder
 */
export function buildQueryString(paramsText: string): string {
  const lines = (paramsText || 'q = css clamp generator\ncategory = tools\npage = 1\nverified = true')
    .split(/\r?\n/).map(l => l.trim()).filter(Boolean);

  const searchParams = new URLSearchParams();
  lines.forEach(l => {
    const parts = l.split(/[=:]/).map(p => p.trim());
    if (parts.length >= 2) {
      searchParams.set(parts[0], parts.slice(1).join('='));
    }
  });

  return `=== COMPILED QUERY STRING ===
?${searchParams.toString()}

URL-Encoded:
${searchParams.toString()}`;
}

/**
 * 15. Query String Parser
 */
export function parseQueryString(queryString: string): string {
  const clean = (queryString || '?user=alice&role=admin&tags=crypto&tags=privacy&verified=1').replace(/^\?/, '');
  const searchParams = new URLSearchParams(clean);
  const json: Record<string, any> = {};

  searchParams.forEach((val, key) => {
    if (key in json) {
      if (Array.isArray(json[key])) json[key].push(val);
      else json[key] = [json[key], val];
    } else {
      json[key] = val;
    }
  });

  return `=== PARSED QUERY PARAMETERS ===\n` + JSON.stringify(json, null, 2);
}

/**
 * 16. URL Comparison Tool
 */
export function compareUrls(urlAStr: string, urlBStr: string): string {
  try {
    const a = parseSafeUrl(urlAStr || 'https://encryptdecrypt.org/tools?sort=asc&page=1');
    const b = parseSafeUrl(urlBStr || 'https://encryptdecrypt.org/tools?page=1&sort=asc#top');

    const diffs: string[] = ['=== URL COMPARISON AUDIT ==='];
    if (a.origin !== b.origin) diffs.push(`• Origin Mismatch: "${a.origin}" vs "${b.origin}"`);
    if (a.pathname !== b.pathname) diffs.push(`• Path Mismatch: "${a.pathname}" vs "${b.pathname}"`);
    if (a.search !== b.search) {
      diffs.push(`• Query String Mismatch:\n    A: "${a.search}"\n    B: "${b.search}"`);
    }
    if (a.hash !== b.hash) diffs.push(`• Hash Fragment Mismatch: "${a.hash}" vs "${b.hash}"`);

    if (diffs.length === 1) {
      diffs.push('✓ Both URLs are completely identical in structure and parameters!');
    }

    return diffs.join('\n');
  } catch (err: any) {
    return `Error: ${err.message}`;
  }
}

/**
 * 17. URL Normalization Tool
 */
export function normalizeUrl(rawUrl: string): string {
  try {
    const u = parseSafeUrl(rawUrl || 'HTTP://www.EncryptDecrypt.org:80/Tools//CSS/?b=2&a=1#top');
    u.protocol = 'https:';
    u.hostname = u.hostname.toLowerCase().replace(/^www\./, '');
    u.pathname = u.pathname.replace(/\/+/g, '/').toLowerCase();
    if (u.pathname !== '/' && u.pathname.endsWith('/')) {
      u.pathname = u.pathname.slice(0, -1);
    }
    u.searchParams.sort();
    u.hash = '';

    return `=== NORMALIZED CANONICAL URL ===
Original   : ${rawUrl}
Normalized : ${u.href}

Actions Applied:
✓ Upgraded HTTP to HTTPS
✓ Lowercased hostname and stripped "www."
✓ Deduplicated redundant slashes (// -> /)
✓ Alphabetized query string parameters
✓ Removed fragment anchor tags (#)`;
  } catch (err: any) {
    return `Error: ${err.message}`;
  }
}

/**
 * 18. URL Trailing Slash Checker
 */
export function checkUrlTrailingSlash(rawUrl: string): string {
  const url = (rawUrl || 'https://encryptdecrypt.org/tools/').trim();
  const hasSlash = url.endsWith('/');
  const hasExt = /\.[a-z0-9]{2,5}(\?.*)?$/i.test(url);

  return `=== TRAILING SLASH AUDIT ===
Target URL     : ${url}
Trailing Slash : ${hasSlash ? 'Present (/)' : 'Absent (No trailing slash)'}
File Extension : ${hasExt ? 'Detected file asset' : 'Directory or Route'}

SEO & Crawling Impact:
Google treats "example.com/page" and "example.com/page/" as two distinct URLs.
Ensure your server enforces a consistent 301 redirect rule to avoid duplicate content penalties.

Suggested Canonical:
${hasSlash ? url.slice(0, -1) : url + '/'}`;
}

/**
 * 19. URL Fragment Extractor
 */
export function extractUrlFragment(rawUrl: string): string {
  try {
    const u = parseSafeUrl(rawUrl || 'https://encryptdecrypt.org/guides#heading-zero-knowledge');
    const frag = u.hash.replace(/^#/, '');

    return `=== URL FRAGMENT / ANCHOR INSPECTOR ===
Full URL : ${u.href}
Fragment : ${frag ? `"#${frag}"` : '(None)'}
HTML ID  : ${frag ? `Matches DOM element with id="${frag}"` : 'No jump-link anchor in URL'}`;
  } catch (err: any) {
    return `Error: ${err.message}`;
  }
}

/**
 * 20. URL Redirect Mapping Formatter
 */
export function formatUrlRedirectMapping(rawList: string): string {
  const lines = (rawList || '/old-link -> /new-link\n/product-a -> /tools/product-a\n/blog/2024 -> /blog/2026')
    .split(/\r?\n/).map(l => l.trim()).filter(Boolean);

  const htaccess: string[] = ['# 1. Apache (.htaccess)'];
  const nginx: string[] = ['# 2. NGINX'];
  const netlify: string[] = ['# 3. Netlify / Cloudflare (_redirects)'];

  lines.forEach(l => {
    const parts = l.split(/->|,|\s+/).map(p => p.trim()).filter(Boolean);
    if (parts.length >= 2) {
      const from = parts[0];
      const to = parts[1];
      htaccess.push(`Redirect 301 ${from} ${to}`);
      nginx.push(`rewrite ^${from.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$ ${to} permanent;`);
      netlify.push(`${from} ${to} 301!`);
    }
  });

  return [htaccess.join('\n'), '', nginx.join('\n'), '', netlify.join('\n')].join('\n');
}
