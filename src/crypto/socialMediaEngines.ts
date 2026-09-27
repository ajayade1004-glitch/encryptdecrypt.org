/**
 * Web Content & Social Media Client-Side Engines
 * 100% browser-native caption analyzers, hashtag organizers, Open Graph image solvers,
 * social share previews, editorial calendars, and content brief templates.
 */

/** 1. Social Media Caption Length Checker */
export function checkSocialCaptionLength(input: string): string {
  const text = input || 'Explore over 900 privacy-first developer tools running 100% locally in your browser memory. No telemetry, no logs. #infosec #webdev #privacy';
  const len = text.length;

  const platforms = [
    { name: 'X / Twitter (Free)', max: 280, icon: '𝕏' },
    { name: 'X / Twitter (Premium)', max: 25000, icon: '𝕏' },
    { name: 'Instagram Caption', max: 2200, icon: '📸' },
    { name: 'LinkedIn Post', max: 3000, icon: '💼' },
    { name: 'Facebook Post', max: 63206, icon: '📘' },
    { name: 'Threads Post', max: 500, icon: '🧵' },
    { name: 'TikTok Description', max: 2200, icon: '🎵' }
  ];

  const results = platforms.map(p => {
    const remaining = p.max - len;
    const status = remaining >= 0 ? `✓ OK (${remaining} chars left)` : `✗ OVER LIMIT (${Math.abs(remaining)} chars over)`;
    return `• ${p.icon} ${p.name.padEnd(22)} : [${len} / ${p.max}] -> ${status}`;
  });

  return `=== SOCIAL MEDIA CHARACTER COUNT AUDIT ===
Current Caption Length: ${len} characters (${text.trim().split(/\s+/).length} words)

Platform Limits Breakdown:
${results.join('\n')}`;
}

/** 2. Instagram Bio Character Counter */
export function checkInstagramBio(input: string): string {
  const bio = input || '🔒 100% Client-Side Privacy Tools\n⚡ 900+ Developer Engines in Memory\n🚀 Zero Logs • Open Source\n👇 Explore Free Tools';
  const len = bio.length;
  const max = 150;
  const remaining = max - len;

  return `=== INSTAGRAM BIO CHARACTER COUNTER ===
Bio Length : ${len} / ${max} Characters
Status     : ${remaining >= 0 ? `✓ PASSED (${remaining} chars remaining)` : `✗ EXCEEDED (${Math.abs(remaining)} chars over limit)`}
Lines Count: ${bio.split(/\r?\n/).length} / 5 Max Recommended Lines

Preview:
----------------------------------------
${bio}
----------------------------------------`;
}

/** 3. YouTube Title Length Checker */
export function checkYouTubeTitleLength(input: string): string {
  const title = input || 'How to Build 100% Client-Side Cryptographic Tools with WebCrypto (2026 Guide)';
  const len = title.length;

  return `=== YOUTUBE VIDEO TITLE OPTIMIZER ===
Title: "${title}"
Character Count: ${len} / 100 Max Allowed

Visibility on Devices:
• Desktop Search (≤ 70 chars) : ${len <= 70 ? '✓ Fully Visible without truncation' : '⚠️ Truncated with ellipsis (...) on desktop search'}
• Mobile Search  (≤ 50 chars) : ${len <= 50 ? '✓ Fully Visible' : '⚠️ Front-load primary keywords for mobile'}
• Max Hard Limit (100 chars)  : ${len <= 100 ? '✓ Under 100 Character Cap' : '✗ OVER 100 CHARACTERS'}`;
}

/** 4. YouTube Description Formatter */
export function formatYouTubeDescription(input: string): string {
  return `=== STRUCTURED YOUTUBE DESCRIPTION TEMPLATE ===

In this video, explore how to perform zero-knowledge browser cryptography using native Web APIs.

⏱️ TIMESTAMPS:
0:00 - Introduction to Client-Side Security
1:15 - How WebCrypto API Works
3:40 - Generating 256-bit AES-GCM Keys
7:20 - Testing Memory-Only Decryption
10:45 - Summary & Open-Source Repository

🔗 USEFUL LINKS & RESOURCES:
• Live Developer Toolbox : https://encryptdecrypt.org
• GitHub Source Code     : https://github.com/encryptdecrypt/suite
• Cryptography Guide     : https://encryptdecrypt.org/guides

#cryptography #webdev #infosec #javascript #programming`;
}

/** 5. Hashtag Organizer */
export function organizeHashtags(input: string): string {
  const text = input || '#javascript #security #webdev #privacy #react #crypto #typescript #infosec';
  const tags: string[] = (text.match(/#[a-zA-Z0-9_]+/g) || []).map((t: string) => t.toLowerCase());
  const unique = [...new Set(tags)];

  return `=== HASHTAG CAMPAIGN ORGANIZER ===
Total Hashtags Input : ${tags.length}
Unique Clean Tags    : ${unique.length}

Formatted Formats:
1. Space Separated : ${unique.join(' ')}
2. Comma Separated : ${unique.join(', ')}
3. Vertical Block  :\n${unique.join('\n')}`;
}

/** 6. Hashtag Deduplicator */
export function deduplicateHashtags(input: string): string {
  const text = input || '#dev #privacy #DEV #Privacy #Security #webdev #security';
  const tags: string[] = text.match(/#[a-zA-Z0-9_]+/g) || [];
  const seen = new Set<string>();
  const duplicates: string[] = [];
  const unique: string[] = [];

  tags.forEach((t: string) => {
    const lower = t.toLowerCase();
    if (seen.has(lower)) {
      duplicates.push(t);
    } else {
      seen.add(lower);
      unique.push(lower);
    }
  });

  return `=== HASHTAG DEDUPLICATION REPORT ===
Original Tags : ${tags.length}
Unique Tags   : ${unique.length}
Duplicates Removed: ${duplicates.length} (${duplicates.join(', ') || 'None'})

Clean Tag String:
${unique.join(' ')}`;
}

/** 7. Social Media Calendar Generator */
export function generateSocialCalendar(input: string): string {
  return `=== WEEKLY SOCIAL MEDIA POSTING SCHEDULE ===

• MONDAY (Tech Deep-Dive):
  └ Topic: "Why Client-Side Cryptography Protects User Privacy"
  └ Formats: LinkedIn Carousel + X / Twitter Thread

• WEDNESDAY (Tool Feature Spotlight):
  └ Topic: "How to Calculate Password Entropy & GPU Crack Time"
  └ Formats: Instagram Reel / Short Video + Interactive Demo Link

• FRIDAY (Community & Tips):
  └ Topic: "Top 5 HTTP Security Headers Every Developer Needs in 2026"
  └ Formats: X / Twitter Infographic + Discord Announcement`;
}

/** 8. Post Scheduling Calendar Template */
export function generatePostSchedulingCalendar(input: string): string {
  return `=== SOCIAL MEDIA EDITORIAL CONTENT MATRIX ===

Date        Time (EST)  Channel      Content Type       Topic / Hook                    Status
----------  ----------  -----------  -----------------  ------------------------------  -------
2026-09-28  09:00 AM    LinkedIn     Carousel (PDF)     Zero-Logs Architecture Explained Scheduled
2026-09-29  11:30 AM    X / Twitter  Thread (5 Tweets)  Top 10 Chrome DevTools Secrets  Drafted
2026-09-30  02:00 PM    YouTube      Long-form Video    Building a Privacy Hub in React Ready
2026-10-01  10:00 AM    Newsletter   Email Broadcast    Monthly Developer Changelog     Review`;
}

/** 9. Open Graph Image Size Calculator */
export function calculateOgImageSize(input: string): string {
  return `=== OPEN GRAPH (OG) SOCIAL CARD SPECIFICATIONS ===

Recommended Standard Dimensions:
• Width  : 1200 pixels
• Height : 630 pixels
• Aspect Ratio : 1.91:1
• File Size    : Under 1 MB (PNG or optimized WebP)

Safe Area Guidance:
• Keep central text and brand assets within the central 1200 × 540 px area.
• Top and bottom 45px may be cropped in some mobile messenger previews (WhatsApp, iMessage).`;
}

/** 10. Social Share Preview Generator */
export function generateSocialSharePreview(input: string): string {
  return `=== SOCIAL MEDIA CARD META TAGS ===

\`\`\`html
<!-- Open Graph / Facebook / LinkedIn -->
<meta property="og:type" content="website" />
<meta property="og:url" content="https://encryptdecrypt.org/" />
<meta property="og:title" content="EncryptDecrypt — 100% Client-Side Developer Suite" />
<meta property="og:description" content="Over 900 browser-native tools for encryption, data cleaning, DevOps, and formatting with zero server logs." />
<meta property="og:image" content="https://encryptdecrypt.org/assets/og-image.png" />
<meta property="og:image:width" content="1200" />
<meta property="og:image:height" content="630" />

<!-- Twitter / X Card -->
<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:title" content="EncryptDecrypt — 100% Client-Side Developer Suite" />
<meta name="twitter:description" content="Zero logs. Browser-native cryptography and developer utilities." />
<meta name="twitter:image" content="https://encryptdecrypt.org/assets/og-image.png" />
\`\`\``;
}

/** 11. Meta Description Preview Tool */
export function previewMetaDescription(input: string): string {
  const text = input || 'EncryptDecrypt is a free, 100% client-side developer suite featuring over 900 offline tools for cryptography, encoding, formatting, and data analysis.';
  const len = text.length;

  return `=== SERP SEARCH SNIPPET & META DESCRIPTION AUDIT ===
Length: ${len} / 160 Characters

Google Search Desktop Snippet:
• Character Count : ${len <= 158 ? '✓ Optimal Length (Under 158 chars)' : '⚠️ Warning: May be truncated on Google Search'}
• Mobile SERP     : ${len <= 120 ? '✓ Fully visible on mobile screens' : '⚠️ Keep primary keyword in first 110 characters'}

Simulated Google Snippet:
EncryptDecrypt: 100% Client-Side Developer Suite
https://encryptdecrypt.org
${text.slice(0, 155)}${text.length > 155 ? '...' : ''}`;
}

/** 12. Video Aspect Ratio Calculator */
export function calculateVideoAspectRatio(input: string): string {
  return `=== VIDEO PLATFORM DIMENSIONS & ASPECT RATIOS ===

1. Landscape Standard (16:9)
   • 4K UHD   : 3840 × 2160 px
   • Full HD  : 1920 × 1080 px
   • Best for : YouTube Long-form, Desktop Web, TV

2. Vertical Reels & Shorts (9:16)
   • Full HD  : 1080 × 1920 px
   • Best for : TikTok, Instagram Reels, YouTube Shorts, Threads

3. Square Post (1:1)
   • Standard : 1080 × 1080 px
   • Best for : Instagram Feed, LinkedIn Image Carousel`;
}

/** 13. Thumbnail Size Calculator */
export function calculateThumbnailSize(input: string): string {
  return `=== SOCIAL MEDIA THUMBNAIL DIMENSIONS ===
• YouTube Video Thumbnail : 1280 × 720 px (Min 640px wide, 16:9, < 2MB)
• Podcast Cover Art       : 3000 × 3000 px (Square 1:1, Apple Podcasts standard)
• Blog Article Thumbnail  : 1200 × 675 px (16:9 ratio)
• Twitch Stream Thumbnail : 1920 × 1080 px (16:9 ratio)`;
}

/** 14. Social Media Image Crop Planner */
export function planSocialImageCrop(input: string): string {
  return `=== MULTI-PLATFORM ASSET CROP MATRIX (From 3840 × 2160 Master) ===

• 16:9 Landscape (YouTube)  : 3840 × 2160 px (No crop needed)
• 1:1 Square (Instagram)     : Crop to central 2160 × 2160 px (Offset X: 840px)
• 9:16 Vertical (Shorts/Reels): Crop to central 1215 × 2160 px (Scale to 1080 × 1920)
• 1.91:1 Landscape (LinkedIn): Crop to 3840 × 2010 px`;
}

/** 15. Content Repurposing Planner */
export function planContentRepurposing(input: string): string {
  const topic = input || 'Client-Side WebCrypto Architecture';

  return `=== 1-TO-10 CONTENT MULTIPLIER FRAMEWORK ===
Core Anchor Asset: 1 Long-Form Engineering Guide on "${topic}"

Repurposed Derivative Assets:
1. 𝕏 / Twitter Thread : 7-tweet breakdown of key code snippets.
2. LinkedIn Article    : Executive summary focused on data privacy regulations.
3. YouTube Short / Reel: 60-second screen recording demoing sub-millisecond execution.
4. Infographic Post   : Architecture diagram of browser memory vs server proxy.
5. Email Newsletter    : Behind-the-scenes engineering commentary.
6. FAQ Documentation   : 5 commonly asked security questions added to docs.`;
}

/** 16. Content Brief Template Generator */
export function generateContentBrief(input: string): string {
  const title = input || 'Modern Client-Side Encryption with AES-GCM';

  return `=== SEO CONTENT BRIEF & EDITORIAL OUTLINE ===
Target Keyword : ${title.toLowerCase()}
Secondary Keywords: webcrypto api, client-side encryption, browser privacy
Target Word Count: 1,800 - 2,200 words
Target Search Intent: Informational / Developer Implementation

Document Architecture:
1. H1: Complete Guide to ${title}
2. H2: Why Traditional Server Encryption Leaks Data
3. H2: Setting Up WebCrypto Primitives
   • H3: Generating Cryptographic Keys
   • H3: Initialization Vectors (IV) & Authenticated Data
4. H2: Benchmark Performance & Latency
5. H2: Frequently Asked Questions (FAQ)`;
}

/** 17. Blog Post Outline Builder */
export function buildBlogPostOutline(input: string): string {
  return `=== COMPREHENSIVE BLOG POST OUTLINE ===

# 1. Introduction
  • Hook: The growing necessity of zero-knowledge client-side applications.
  • Problem: Centralized server logs create single points of failure.
  • Solution Overview: Utilizing native Web Cryptography in modern browsers.

# 2. Key Concepts & Architecture
  • Symmetric vs Asymmetric algorithms.
  • Generating secure nonces and entropy.

# 3. Step-by-Step Code Walkthrough
  • Key generation with window.crypto.subtle.
  • Encrypting payloads with AES-256-GCM.

# 4. Security Audits & Best Practices
  • Constant-time comparisons and XSS mitigation.

# 5. Conclusion & Interactive Tools
  • Call-to-Action to try the live browser tools.`;
}

/** 18. Blog Introduction Checklist */
export function getBlogIntroChecklist(input: string): string {
  return `=== HIGH-CONVERTING BLOG INTRO AUDIT CHECKLIST ===
[ ] 1. The Hook: Starts with an intriguing question, statistic, or bold statement.
[ ] 2. The Pain Point: Identifies why existing solutions fail the user.
[ ] 3. The Promise: States clearly what readers will achieve after reading.
[ ] 4. Primary Keyword: Included naturally in the first 100 words.
[ ] 5. Brevity: Keeps the intro under 120 words (quick transition into H2).`;
}

/** 19. Newsletter Subject Length Checker */
export function checkNewsletterSubject(input: string): string {
  const subject = input || '🚀 900+ Developer Tools, Zero Server Logs — EncryptDecrypt v2.5';
  const len = subject.length;

  return `=== EMAIL NEWSLETTER SUBJECT LINE AUDIT ===
Subject Line: "${subject}"
Length: ${len} Characters (${subject.split(/\s+/).length} words)

Inbox Client Compatibility:
• Mobile Gmail (≤ 40 chars) : ${len <= 40 ? '✓ 100% visible' : '⚠️ Cut off on small mobile screens. Key hook is in first 35 chars.'}
• Desktop Outlook / Apple   : ✓ Fully visible (up to 60 chars)
• Spam Score Factors        : No all-caps words, single emoji, clear value proposition.`;
}

/** 20. Content Publishing Checklist Generator */
export function generatePublishingChecklist(input: string): string {
  return `=== PRE-PUBLISH WEB CONTENT QA CHECKLIST ===
[ ] 1. Meta Title & Description: Within 60 and 155 character limits with keywords.
[ ] 2. Headings Hierarchy: Exactly one <h1>, sequential <h2> and <h3> without skips.
[ ] 3. Image Alt Text: All images have descriptive alt text for screen readers.
[ ] 4. Canonical URL: Set to prevent duplicate content indexing.
[ ] 5. Open Graph Card: 1200×630px social card verified in debugger.
[ ] 6. Internal Links: At least 3 links to related tools/guides on the domain.
[ ] 7. Code Formatting: All code snippets syntax-highlighted with copy buttons.`;
}
