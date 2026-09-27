/**
 * SEO & Webmaster Client-Side Developer Engines
 * 100% browser-native SEO auditing, schema markup builders, and content strategy generators.
 */

/**
 * 1. URL Length Checker
 */
export function checkUrlLength(rawUrl: string): string {
  const url = (rawUrl || 'https://encryptdecrypt.org/tools/web-developer-css-tools/').trim();
  const charCount = url.length;
  let parsed: URL | null = null;
  try {
    parsed = new URL(url);
  } catch {}

  const pathLength = parsed ? parsed.pathname.length : 0;
  const paramCount = parsed ? Array.from(parsed.searchParams.keys()).length : 0;

  let serpRisk = 'Optimal (< 60 chars - Zero truncation risk)';
  if (charCount > 100) {
    serpRisk = 'High Risk (> 100 chars - Likely truncated in desktop & mobile SERPs)';
  } else if (charCount > 75) {
    serpRisk = 'Moderate (> 75 chars - May truncate on smaller mobile viewports)';
  }

  return `=== URL LENGTH & SERP SNIPPET AUDIT ===
Target URL        : ${url}
Total Characters  : ${charCount} chars
Path Length       : ${pathLength} chars
Query Parameters  : ${paramCount} found
Protocol          : ${parsed ? parsed.protocol : 'unknown'}
SERP Status       : ${serpRisk}

SEO Recommendations:
${charCount > 75 ? '• Consider shortening folder slugs to improve click-through rate (CTR).' : '✓ URL is concise and easy for search crawlers and users to parse.'}
${paramCount > 0 ? '• Query parameters detected. Ensure canonical tags are in place to prevent duplicate content.' : '✓ Clean semantic URL with zero tracking query bloat.'}`;
}

/**
 * 2. Keyword Clustering Tool
 */
export function clusterKeywords(inputText: string): string {
  const lines = (inputText || '').split(/\r?\n/).map(l => l.trim().toLowerCase()).filter(Boolean);
  if (lines.length === 0) return 'Enter keywords to cluster.';

  const stopWords = new Set(['in', 'on', 'the', 'for', 'to', 'a', 'of', 'and', 'with', 'by', 'at', 'is']);
  const clusters: Record<string, string[]> = {};

  for (const kw of lines) {
    const tokens = kw.split(/\s+/).filter(t => !stopWords.has(t) && t.length > 2);
    const rootToken = tokens[0] || 'other';

    if (!clusters[rootToken]) clusters[rootToken] = [];
    clusters[rootToken].push(kw);
  }

  const reports = [`=== KEYWORD SEMANTIC CLUSTERS (${lines.length} total keywords) ===\n`];
  for (const [clusterName, kws] of Object.entries(clusters)) {
    reports.push(`📂 Cluster: [${clusterName.toUpperCase()}] (${kws.length} keywords)`);
    kws.forEach(k => reports.push(`   • ${k}`));
    reports.push('');
  }

  return reports.join('\n');
}

/**
 * 3. Search Intent Classifier
 */
export function classifySearchIntent(inputText: string): string {
  const lines = (inputText || '').split(/\r?\n/).map(l => l.trim()).filter(Boolean);
  if (lines.length === 0) return 'Enter keywords to classify search intent.';

  const results: { keyword: string; intent: string; score: string }[] = [];

  for (const kw of lines) {
    const lower = kw.toLowerCase();
    let intent = 'Informational';

    if (/buy|price|cost|discount|deal|cheap|order|purchase|coupon/i.test(lower)) {
      intent = 'Transactional 💳';
    } else if (/best|top|vs|versus|review|compare|comparison|alternative/i.test(lower)) {
      intent = 'Commercial Investigation 🔍';
    } else if (/login|sign in|portal|dashboard|official|website|app/i.test(lower)) {
      intent = 'Navigational 🧭';
    } else if (/how|what|why|guide|tutorial|steps|tips|learn|calculator|generator/i.test(lower)) {
      intent = 'Informational 📚';
    }

    results.push({ keyword: kw, intent, score: 'High' });
  }

  return `=== SEARCH INTENT CLASSIFICATION ===\n` +
    results.map(r => `• ${r.keyword.padEnd(35)} -> ${r.intent}`).join('\n');
}

/**
 * 4. FAQ Generator
 */
export function generateFaqContent(inputText: string): string {
  const lines = (inputText || '').split(/\r?\n/).map(l => l.trim()).filter(Boolean);
  const faqs: { q: string; a: string }[] = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (line.includes('?') || line.toLowerCase().startsWith('q:') || line.toLowerCase().startsWith('how') || line.toLowerCase().startsWith('what')) {
      const q = line.replace(/^[qQ]:\s*/, '');
      const a = lines[i + 1] ? lines[i + 1].replace(/^[aA]:\s*/, '') : 'This client-side utility provides instant processing directly in your browser with zero data logging.';
      faqs.push({ q, a });
      i++;
    } else {
      faqs.push({
        q: `What are the benefits of ${line}?`,
        a: `${line} enhances workflow efficiency, optimizes developer productivity, and guarantees zero server transmission.`
      });
    }
  }

  const markdown = faqs.map(f => `### Q: ${f.q}\n${f.a}\n`).join('\n');
  return `=== EDITORIAL FAQ SECTION ===\n\n${markdown}`;
}

/**
 * 5. Content Outline Generator
 */
export function generateContentOutline(topic = 'Client-Side Cryptography in Web Browsers'): string {
  return `# Comprehensive Content Outline: ${topic}
Target Word Count: 2,500 - 3,200 words
Target Search Intent: Informational / Technical Guide

## 1. Introduction & Executive Summary (~300 words)
- What is ${topic}?
- Why traditional server-dependent workflows fail security and compliance audits.
- Core premise: Zero-knowledge client-side computation.

## 2. Core Architecture & Fundamentals (~700 words)
- Underlying Web APIs (WebCrypto, Canvas, TypedArray buffers).
- Key differences between client memory vs cloud storage.
- Benchmark: Sub-millisecond execution vs network latency.

## 3. Step-by-Step Implementation Guide (~1,000 words)
- Phase 1: In-memory initialization and input validation.
- Phase 2: Algorithm execution in volatile RAM.
- Phase 3: Immediate output rendering and clipboard/export actions.
- Practical Code Example (JavaScript / TypeScript).

## 4. Best Practices & Threat Mitigation (~600 words)
- Memory cleanup and avoiding DOM text leaks.
- CSP (Content Security Policy) and Subresource Integrity (SRI).
- Offline PWA service worker caching.

## 5. Frequently Asked Questions (~400 words)
- 4-5 High-intent FAQ items with Schema.org JSON-LD markup.

## 6. Conclusion & Next Steps (~200 words)
- Summary checklist and interactive tool CTA.`;
}

/**
 * 6. SEO Content Brief Generator
 */
export function generateSeoContentBrief(
  topic = 'CSS Clamp Fluid Typography',
  primaryKw = 'css clamp generator'
): string {
  return `=== SEO EDITORIAL CONTENT BRIEF ===
Target Topic       : ${topic}
Primary Keyword    : ${primaryKw}
Secondary Keywords : fluid typography formula, css clamp font size, responsive clamp calculator
Target Audience    : Frontend developers, UI/UX designers, web performance engineers
Search Intent      : Informational / Practical Utility
Recommended Length : 1,800 - 2,400 words

Content Objectives:
1. Explain the math behind clamp(min, val, max) using linear slope formulas.
2. Provide interactive examples of fluid scaling from 320px to 1440px viewports.
3. Compare clamp() against legacy @media query breakpoint cascades.

Crucial Heading Checklist:
- H1: Complete Guide to CSS clamp() & Fluid Typography Formulas
- H2: How Does the CSS clamp() Function Work?
- H2: Mathematical Formula: Calculating Slope and Viewport Units (vw)
- H2: clamp() vs Media Queries: Pros, Cons, and Performance
- H2: Step-by-Step Tutorial: Implementing Responsive Font Scaling
- H2: Browser Support, Accessibility, and Fallbacks
- H2: Frequently Asked Questions

Internal Link Directives:
- Link to /tool=css-responsive-typography-generator
- Link to /tool=css-breakpoint-planner
- Link to /tool=css-media-query-generator`;
}

/**
 * 7. Anchor Text Generator
 */
export function generateAnchorTextVariations(
  brand = 'EncryptDecrypt',
  keyword = 'css clamp generator',
  url = 'https://encryptdecrypt.org/tool=css-clamp-generator'
): string {
  return `=== ANCHOR TEXT DIVERSITY PROFILE ===
Target URL: ${url}
Primary Keyword: ${keyword}

1. Exact Match (Target: 15-20%):
   • "${keyword}"
   • "free ${keyword}"

2. Partial Match / Phrase Match (Target: 30-35%):
   • "use this ${keyword}"
   • "responsive ${keyword} for developers"
   • "calculate fluid typography with a ${keyword}"
   • "try the online ${keyword}"

3. Branded Anchors (Target: 25-30%):
   • "${brand}"
   • "${brand} ${keyword}"
   • "${brand} Web Developer Tools"

4. Generic / Natural Anchors (Target: 10-15%):
   • "click here to calculate"
   • "learn more"
   • "visit website"
   • "read the full documentation"

5. Naked URL Anchors (Target: 5-10%):
   • "${url}"
   • "${url.replace('https://', '')}"`;
}

/**
 * 8. Image Filename SEO Generator
 */
export function generateSeoImageFilename(description: string, ext = 'webp'): string {
  const clean = (description || 'client side encryption tool architecture dashboard')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

  const extClean = ext.replace(/^\./, '').toLowerCase();

  return `=== SEO-OPTIMIZED IMAGE FILENAMES ===
Clean Web Filename:
${clean}.${extClean}

Variants:
• ${clean}-preview.${extClean}
• ${clean}-diagram-2026.${extClean}
• ${clean}-hero-banner.${extClean}

SEO Tips:
✓ Hyphens (-) are recognized as word delimiters by Google Image bot (avoid underscores).
✓ Lowercase only; avoid special characters and timestamp camera names (IMG_4921.JPG).
✓ Prefer modern next-gen image formats (.webp / .avif) for Core Web Vitals.`;
}

/**
 * 9. Alt Text Template Generator
 */
export function generateAltTextTemplates(subject: string, context = 'developer tool preview'): string {
  const cleanSubject = (subject || 'CSS Grid Layout Generator interface').trim();

  return `=== ACCESSIBILITY & SEO ALT TEXT RECOMMENDATIONS ===

1. Standard Informative (Best for Articles & Documentation):
alt="${cleanSubject} showing live grid columns, rows, and responsive CSS preview"

2. Concise Functional (Best for Interactive UI & Buttons):
alt="${cleanSubject}"

3. Detailed Contextual (Best for Tutorials & Walkthroughs):
alt="Screenshot of ${cleanSubject} in ${context}, displaying custom CSS code snippet and live visual container"

4. E-Commerce / Feature Highlight:
alt="${cleanSubject} with zero data logging and instant browser-based execution"

Accessibility Guidelines (WCAG 2.1 AA):
✓ Keep alt text under 125 characters so screen readers do not paginate speech.
✓ Never start with "Image of..." or "Picture of..." (screen readers announce graphics automatically).`;
}

/**
 * 10. Content Length Analyzer
 */
export function analyzeContentLength(text: string): string {
  const words = (text || '').trim().split(/\s+/).filter(Boolean);
  const wordCount = words.length;
  const charCount = text.length;
  const sentenceCount = (text.match(/[.!?]+(?:\s+|$)/g) || []).length || 1;
  const readingTimeMin = Math.max(1, Math.ceil(wordCount / 225));
  const avgWordsPerSentence = (wordCount / sentenceCount).toFixed(1);

  let targetDepth = 'Short / Social Snippet (< 300 words)';
  if (wordCount >= 2500) targetDepth = 'Comprehensive 10x Pillar Guide (2,500+ words)';
  else if (wordCount >= 1500) targetDepth = 'In-Depth SEO Long-Form Article (1,500 - 2,500 words)';
  else if (wordCount >= 800) targetDepth = 'Standard Blog Post / How-To (800 - 1,500 words)';
  else if (wordCount >= 300) targetDepth = 'Short Product or Tool Description (300 - 800 words)';

  return `=== CONTENT LENGTH & READABILITY METRICS ===
Total Words           : ${wordCount.toLocaleString()} words
Character Count       : ${charCount.toLocaleString()} chars
Estimated Reading Time: ~${readingTimeMin} min
Sentence Count        : ${sentenceCount} sentences
Avg Sentence Length   : ${avgWordsPerSentence} words/sentence
Classification        : ${targetDepth}

SERP Ranking Benchmark:
• Average top 3 Google result length for competitive queries is ~1,890 words.
• Ensure headings (H2/H3) appear every 250-350 words to avoid wall-of-text fatigue.`;
}

/**
 * 11. Topic Cluster Planner
 */
export function planTopicCluster(pillarTopic = 'Web Developer & CSS Tools', subtopicsStr = ''): string {
  const subtopics = subtopicsStr
    ? subtopicsStr.split(/\r?\n/).map(s => s.trim()).filter(Boolean)
    : [
        'CSS Clamp Fluid Typography Generator',
        'CSS Grid Layout Generator',
        'CSS Flexbox Container Builder',
        'CSS Animation & Keyframes Creator',
        'CSS Glassmorphism & Frosted Glass Styling',
        'CSS Breakpoint & Mobile-First Strategy'
      ];

  const lines = [
    `=== HUB & SPOKE TOPIC CLUSTER ARCHITECTURE ===`,
    `Central Pillar Page: [${pillarTopic}] (Target: 3,000+ words overview)`,
    '',
    `Supporting Spokes (In-Depth Subtopics):`
  ];

  subtopics.forEach((spoke, idx) => {
    lines.push(`  ${idx + 1}. ${spoke}`);
    lines.push(`     ↳ Links to: Pillar Page [${pillarTopic}] (Anchor: "${pillarTopic.toLowerCase()}")`);
    lines.push(`     ↳ Cross-links to: Neighbor Spoke ${idx > 0 ? `"${subtopics[idx - 1]}"` : 'Next subtopic'}`);
  });

  lines.push('');
  lines.push('SEO Benefit: Concentrates contextual domain authority and avoids keyword cannibalization.');

  return lines.join('\n');
}

/**
 * 12. Pillar Page Planner
 */
export function planPillarPage(pillarTitle = 'Ultimate Guide to Client-Side Developer Tools'): string {
  return `=== PILLAR PAGE STRUCTURAL BLUEPRINT ===
Pillar Title: ${pillarTitle}
Recommended Word Count: 3,500 - 4,500 words
Format: Long-form comprehensive evergreen hub

1. Header & Table of Contents (Sticky navigation with jump-links)
2. Module 1: Foundational Theory & Why Client-Side Computation Matters
3. Module 2: Security & Privacy Architecture (Zero-Logging WebCrypto API)
4. Module 3: CSS & Frontend Design Generation Primitives
5. Module 4: Git Workflow Automation & Version Control Command Center
6. Module 5: Performance Benchmarks & Core Web Vitals Optimization
7. Module 6: Full Directory of 50+ Interactive In-Browser Utilities
8. Module 7: FAQ Schema & Expert Troubleshooting
9. Downloadable Cheat Sheet / PDF Call-to-Action`;
}

/**
 * 13. SEO Content Calendar Generator
 */
export function generateSeoContentCalendar(topicsList: string, startDateStr = '2026-10-01'): string {
  const topics = (topicsList || 'CSS Clamp Guide\nGit Workflow Automation\nJSON Patching Tutorial\nWebCrypto AES-256 Deep Dive')
    .split(/\r?\n/).map(t => t.trim()).filter(Boolean);

  const start = new Date(startDateStr);
  const rows: string[] = [
    '| Week | Target Date | Topic / Content Title | Target Search Intent | Word Target | Status |',
    '| :--- | :--- | :--- | :--- | :---: | :--- |'
  ];

  topics.forEach((t, i) => {
    const pubDate = new Date(start);
    pubDate.setDate(pubDate.getDate() + i * 7);
    const dateStr = pubDate.toISOString().slice(0, 10);
    const intent = i % 2 === 0 ? 'Informational' : 'Commercial / Tool';
    rows.push(`| Week ${i + 1} | ${dateStr} | ${t} | ${intent} | 2,000w | Scheduled |`);
  });

  return `=== 4-WEEK EDITORIAL SEO CONTENT SCHEDULE ===\n\n` + rows.join('\n');
}

/**
 * 14. Redirect Mapping Generator
 */
export function generateRedirectMapping(urlPairs: string): string {
  const lines = (urlPairs || '/old-tools/css-generator -> /tool=css-clamp-generator\n/docs/git-commit -> /tool=git-commit-message-generator')
    .split(/\r?\n/).map(l => l.trim()).filter(Boolean);

  const htaccess: string[] = ['# 1. Apache (.htaccess)'];
  const nginx: string[] = ['# 2. NGINX Configuration'];
  const cloudflare: string[] = ['# 3. Cloudflare / Netlify _redirects'];

  for (const line of lines) {
    const parts = line.split(/->|,|\s+/).map(p => p.trim()).filter(Boolean);
    if (parts.length >= 2) {
      const from = parts[0];
      const to = parts[1];
      htaccess.push(`Redirect 301 ${from} ${to}`);
      nginx.push(`rewrite ^${from.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$ ${to} permanent;`);
      cloudflare.push(`${from} ${to} 301!`);
    }
  }

  return [htaccess.join('\n'), '', nginx.join('\n'), '', cloudflare.join('\n')].join('\n');
}

/**
 * 15. Breadcrumb Schema Generator
 */
export function generateBreadcrumbSchema(siteUrl = 'https://encryptdecrypt.org', breadcrumbsStr = 'Home -> Tools -> CSS Tools -> CSS Clamp'): string {
  const crumbs = breadcrumbsStr.split(/->|>|\//).map(c => c.trim()).filter(Boolean);
  const elements = crumbs.map((crumb, idx) => ({
    '@type': 'ListItem',
    position: idx + 1,
    name: crumb,
    item: idx === 0 ? `${siteUrl}/` : `${siteUrl}/${crumb.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`
  }));

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: elements
  };

  return JSON.stringify(schema, null, 2);
}

/**
 * 16. LocalBusiness Schema Generator
 */
export function generateLocalBusinessSchema(
  name = 'EncryptDecrypt Technologies',
  address = '100 Market St, San Francisco, CA 94105',
  phone = '+1 (555) 234-5678',
  url = 'https://encryptdecrypt.org'
): string {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'ProfessionalService',
    name: name,
    image: `${url}/assets/og-image.png`,
    '@id': `${url}/#organization`,
    url: url,
    telephone: phone,
    priceRange: '$$',
    address: {
      '@type': 'PostalAddress',
      streetAddress: address,
      addressLocality: 'San Francisco',
      addressRegion: 'CA',
      postalCode: '94105',
      addressCountry: 'US'
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: 37.7749,
      longitude: -122.4194
    },
    openingHoursSpecification: {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
      opens: '09:00',
      closes: '18:00'
    }
  };

  return JSON.stringify(schema, null, 2);
}

/**
 * 17. HowTo Schema Generator
 */
export function generateHowToSchema(title = 'How to Generate Fluid CSS Clamp Values', stepsStr = ''): string {
  const steps = stepsStr
    ? stepsStr.split(/\r?\n/).map(s => s.trim()).filter(Boolean)
    : [
        'Determine your minimum and maximum target font sizes in pixels.',
        'Define your minimum and maximum mobile-to-desktop viewport boundaries.',
        'Calculate the linear slope and viewport width offset.',
        'Implement the resulting clamp() formula directly into your CSS stylesheet.'
      ];

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name: title,
    description: `Step-by-step instructions to ${title.toLowerCase()}.`,
    step: steps.map((s, idx) => ({
      '@type': 'HowToStep',
      position: idx + 1,
      name: `Step ${idx + 1}`,
      text: s
    }))
  };

  return JSON.stringify(schema, null, 2);
}

/**
 * 18. FAQ Schema Validator
 */
export function validateFaqSchema(input: string): string {
  let parsed: any = null;
  try {
    parsed = JSON.parse(input);
  } catch {
    return '⚠️ Input is not valid JSON. Ensure you paste a Schema.org FAQPage JSON-LD snippet.';
  }

  const reports: string[] = ['=== FAQ SCHEMA (JSON-LD) VALIDATION ==='];
  if (parsed['@context'] !== 'https://schema.org') {
    reports.push('❌ Missing or invalid "@context". Must be "https://schema.org".');
  } else {
    reports.push('✓ Valid @context declared.');
  }

  if (parsed['@type'] !== 'FAQPage') {
    reports.push(`⚠️ @type is "${parsed['@type']}". Google expects "FAQPage".`);
  } else {
    reports.push('✓ Valid @type "FAQPage".');
  }

  const entities = parsed.mainEntity;
  if (!Array.isArray(entities) || entities.length === 0) {
    reports.push('❌ "mainEntity" must be a non-empty array of Question objects.');
  } else {
    reports.push(`✓ Found ${entities.length} FAQ items.`);
    entities.forEach((item: any, i: number) => {
      if (!item.name) reports.push(`  • Question ${i + 1}: Missing "name" (Question title).`);
      if (!item.acceptedAnswer || !item.acceptedAnswer.text) {
        reports.push(`  • Question ${i + 1}: Missing "acceptedAnswer.text".`);
      }
    });
  }

  if (reports.length === 3) {
    reports.push('✓ Schema is 100% compliant with Google FAQ Rich Results specifications!');
  }

  return reports.join('\n');
}

/**
 * 19. Meta Robots Tag Builder
 */
export function buildMetaRobotsTag(
  index = true,
  follow = true,
  noarchive = false,
  maxSnippet = -1
): string {
  const directives: string[] = [
    index ? 'index' : 'noindex',
    follow ? 'follow' : 'nofollow'
  ];

  if (noarchive) directives.push('noarchive');
  directives.push('max-image-preview:large');
  directives.push(`max-snippet:${maxSnippet}`);
  directives.push('max-video-preview:-1');

  const content = directives.join(', ');

  return `<!-- 1. HTML Head Tag -->
<meta name="robots" content="${content}" />

<!-- 2. HTTP Response Header (for NGINX / Express / Cloudflare) -->
X-Robots-Tag: ${content}

Directives Breakdown:
• ${index ? 'index: Allows Google to index this page in search results.' : 'noindex: Prevents this page from showing in search engines.'}
• ${follow ? 'follow: Crawlers will follow links found on this page.' : 'nofollow: Tells crawlers not to follow internal or external links.'}
• max-image-preview:large: Enables high-resolution previews in Google Discover.`;
}

/**
 * 20. SEO URL Cleaner
 */
export function cleanSeoUrl(rawUrl: string): string {
  const urlStr = (rawUrl || 'https://www.encryptdecrypt.org/tools/css/?utm_source=twitter&utm_medium=social&session_id=987123#preview').trim();
  try {
    const url = new URL(urlStr);
    
    // Tracking parameters to strip
    const trackingParams = [
      'utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content',
      'fbclid', 'gclid', 'msclkid', 'session_id', 'ref', 'source'
    ];
    trackingParams.forEach(p => url.searchParams.delete(p));

    url.hash = ''; // Remove fragments
    let clean = url.toString().toLowerCase();
    
    // Remove trailing slash if path is longer than root
    if (url.pathname !== '/' && clean.endsWith('/')) {
      clean = clean.slice(0, -1);
    }

    return `=== CLEANED CANONICAL URL ===
Original: ${urlStr}
Cleaned : ${clean}

Removed: UTM tracking parameters, query session tokens, and hash fragments.`;
  } catch {
    return `Error: Could not parse "${rawUrl}" as a valid URL.`;
  }
}

/**
 * 21. Internal Link Anchor Planner
 */
export function planInternalLinkAnchors(
  donorPage = '/guides/modern-frontend-design',
  targetPage = '/tool=css-clamp-generator',
  targetKeyword = 'css clamp generator'
): string {
  return `=== INTERNAL LINK PLACEMENT PLAN ===
Source (Donor Page)  : ${donorPage}
Target (Recipient)   : ${targetPage}
Target Keyword       : ${targetKeyword}

Recommended Contextual Sentence Variations:
1. "To achieve fluid scaling without complex breakpoints, test your typography using our [${targetKeyword}]."
2. "You can calculate precise viewport bounds with the [${targetKeyword}] running directly in your browser."
3. "For responsive spacing math, check out the [free ${targetKeyword}]."

Link Attribute Best Practices:
<a href="${targetPage}" title="${targetKeyword}">...</a>
✓ Do NOT add rel="nofollow" to internal links.
✓ Ensure anchor text aligns with the recipient page's primary target keyword.`;
}

/**
 * 22. Keyword Group Comparison Tool
 */
export function compareKeywordGroups(groupAStr: string, groupBStr: string): string {
  const listA = (groupAStr || 'css clamp\ncss grid\ncss flexbox\ncss animation')
    .split(/\r?\n/).map(s => s.trim().toLowerCase()).filter(Boolean);
  const listB = (groupBStr || 'css clamp generator\ncss grid\ncss flexbox\ncss transform')
    .split(/\r?\n/).map(s => s.trim().toLowerCase()).filter(Boolean);

  const setA = new Set(listA);
  const setB = new Set(listB);

  const overlap = listA.filter(k => setB.has(k));
  const uniqueA = listA.filter(k => !setB.has(k));
  const uniqueB = listB.filter(k => !setA.has(k));

  return `=== KEYWORD GROUP COMPARISON & OVERLAP AUDIT ===
Group A Keywords : ${listA.length}
Group B Keywords : ${listB.length}
Shared Overlap   : ${overlap.length} keywords (${((overlap.length / Math.max(1, listA.length)) * 100).toFixed(1)}% overlap)

Overlapping Keywords (Cannibalization Risk if targeting same page):
${overlap.map(k => `  • ${k}`).join('\n') || '  (None)'}

Unique to Group A:
${uniqueA.map(k => `  • ${k}`).join('\n') || '  (None)'}

Unique to Group B:
${uniqueB.map(k => `  • ${k}`).join('\n') || '  (None)'}`;
}

/**
 * 23. Sitemap URL Count Analyzer
 */
export function analyzeSitemapUrls(input: string): string {
  const matches = input.match(/<loc>(.*?)<\/loc>/g) || [];
  const urls = matches.map(m => m.replace(/<\/?loc>/g, '').trim());
  const total = urls.length || input.split(/\r?\n/).filter(l => l.startsWith('http')).length;

  const categories: Record<string, number> = {};
  urls.forEach(u => {
    try {
      const p = new URL(u).pathname.split('/')[1] || 'root';
      categories[p] = (categories[p] || 0) + 1;
    } catch {}
  });

  return `=== XML SITEMAP HEALTH & URL COUNT ===
Total URLs Found     : ${total.toLocaleString()} URLs
Google Limit Status  : ${total <= 50000 ? '✓ Valid (Well under 50,000 URLs per sitemap)' : '⚠️ Exceeds Google 50,000 URL limit! Split into sitemap index.'}

Path Breakdown:
${Object.entries(categories).map(([cat, count]) => `• /${cat.padEnd(20)} : ${count} URLs`).join('\n') || '• No <loc> XML tags found. Pasted plain URLs.'}`;
}

/**
 * 24. Canonical URL Normalizer
 */
export function normalizeCanonicalUrl(rawUrl: string): string {
  const url = (rawUrl || 'http://www.encryptdecrypt.org/tool=css-clamp-generator/?utm=test#top').trim();
  try {
    const p = new URL(url);
    p.protocol = 'https:';
    p.hostname = p.hostname.replace(/^www\./, '');
    p.search = '';
    p.hash = '';

    const normalized = p.toString();

    return `=== CANONICAL TAG GENERATOR ===
Raw Input URL   : ${url}
Normalized URL  : ${normalized}

HTML Tag:
<link rel="canonical" href="${normalized}" />

Issues Resolved:
✓ Upgraded protocol to secure HTTPS
✓ Removed non-standard "www." subdomain prefix
✓ Stripped dynamic query strings and hash anchors`;
  } catch {
    return `Error: Invalid URL "${rawUrl}".`;
  }
}

/**
 * 25. SEO Heading Outline Generator
 */
export function generateHeadingOutline(text: string): string {
  const lines = (text || '').split(/\r?\n/).map(l => l.trim()).filter(Boolean);
  const headings: { level: number; text: string }[] = [];

  for (const line of lines) {
    const mdMatch = line.match(/^(#{1,6})\s+(.*)/);
    if (mdMatch) {
      headings.push({ level: mdMatch[1].length, text: mdMatch[2] });
      continue;
    }
    const htmlMatch = line.match(/<h([1-6])>(.*?)<\/h\1>/i);
    if (htmlMatch) {
      headings.push({ level: parseInt(htmlMatch[1]), text: htmlMatch[2] });
    }
  }

  if (headings.length === 0) {
    return `Enter HTML content with <h1>-<h6> tags or Markdown (# to ######) to analyze heading hierarchy.`;
  }

  const h1Count = headings.filter(h => h.level === 1).length;
  const issues: string[] = [];

  if (h1Count === 0) issues.push('⚠️ Missing <h1> tag! Google relies on a single H1 for primary topical relevance.');
  if (h1Count > 1) issues.push(`⚠️ Found ${h1Count} multiple <h1> tags. Best practice is exactly one H1 per page.`);

  for (let i = 1; i < headings.length; i++) {
    if (headings[i].level > headings[i - 1].level + 1) {
      issues.push(`⚠️ Skipped heading level: H${headings[i - 1].level} jumped directly to H${headings[i].level} ("${headings[i].text}")`);
    }
  }

  const outline = headings.map(h => `${'  '.repeat(h.level - 1)}H${h.level}: ${h.text}`).join('\n');

  return `=== SEO HEADING STRUCTURE AUDIT ===
Total Headings Found: ${headings.length}
H1 Count: ${h1Count}

Heading Outline:
${outline}

Hierarchy Audit:
${issues.length > 0 ? issues.join('\n') : '✓ Perfect heading hierarchy! Zero skipped levels detected.'}`;
}
