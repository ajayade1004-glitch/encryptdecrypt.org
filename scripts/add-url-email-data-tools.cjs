const fs = require('fs');
const path = require('path');

const toolsPath = path.join(__dirname, '../public/assets/data/tools.json');
const tools = JSON.parse(fs.readFileSync(toolsPath, 'utf8'));

const urlTools = [
  { name: 'URL Character Counter', slug: 'url-character-counter', shortDesc: 'Count total URL characters and component breakdown to avoid SERP snippet truncation.' },
  { name: 'URL Structure Inspector', slug: 'url-structure-inspector', shortDesc: 'Inspect scheme, host, port, path, parameters, and fragment anatomy of any URL.' },
  { name: 'URL Parameter Cleaner', slug: 'url-parameter-cleaner', shortDesc: 'Strip tracking tokens like utm_*, fbclid, gclid, and clean up query string parameters.' },
  { name: 'UTM Builder', slug: 'utm-builder', shortDesc: 'Build clean, standardized campaign tracking URLs with source, medium, campaign, term, and content.' },
  { name: 'UTM Parser', slug: 'utm-parser', shortDesc: 'Parse and decode UTM marketing campaign parameters from complex URLs into a structured table.' },
  { name: 'UTM Validator', slug: 'utm-validator', shortDesc: 'Validate UTM URLs for syntax correctness, required fields, whitespace, and case consistency.' },
  { name: 'UTM Campaign Generator', slug: 'utm-campaign-generator', shortDesc: 'Generate a coordinated multi-channel UTM URL matrix for Newsletter, Facebook, Twitter, and LinkedIn.' },
  { name: 'URL Path Segment Extractor', slug: 'url-path-segment-extractor', shortDesc: 'Extract individual path segments, depth hierarchy, and slugs from hierarchical URLs.' },
  { name: 'Domain Extractor', slug: 'domain-extractor', shortDesc: 'Extract the registered domain and root hostname from long URLs and deep links.' },
  { name: 'Subdomain Extractor', slug: 'subdomain-extractor', shortDesc: 'Extract subdomains from complex multi-tenant URLs and API endpoints.' },
  { name: 'Protocol Extractor', slug: 'protocol-extractor', shortDesc: 'Identify URL protocol scheme, SSL encryption status, and security compliance.' },
  { name: 'Port Extractor', slug: 'port-extractor', shortDesc: 'Extract explicit or standard default TCP/UDP port numbers from URLs.' },
  { name: 'Filename from URL Extractor', slug: 'filename-from-url-extractor', shortDesc: 'Extract target filename, base slug, and file extension from asset and document URLs.' },
  { name: 'Query String Builder', slug: 'query-string-builder', shortDesc: 'Build RFC 3986 URL-encoded query strings from key-value pairs with instant preview.' },
  { name: 'Query String Parser', slug: 'query-string-parser', shortDesc: 'Parse query strings into structured JSON objects and key-value tables.' },
  { name: 'URL Comparison Tool', slug: 'url-comparison-tool', shortDesc: 'Compare two URLs side-by-side to highlight differences in protocol, host, path, and parameters.' },
  { name: 'URL Normalization Tool', slug: 'url-normalization-tool', shortDesc: 'Normalize URLs with lowercase hostnames, default port stripping, and path canonicalization.' },
  { name: 'URL Trailing Slash Checker', slug: 'url-trailing-slash-checker', shortDesc: 'Check trailing slash status to prevent SEO duplicate content penalties.' },
  { name: 'URL Fragment Extractor', slug: 'url-fragment-extractor', shortDesc: 'Extract anchor fragments and hash identifiers linking to specific DOM elements.' },
  { name: 'URL Redirect Mapping Formatter', slug: 'url-redirect-mapping-formatter', shortDesc: 'Format redirect maps into Apache .htaccess, NGINX rewrite, and Netlify _redirects syntax.' }
];

const emailTools = [
  { name: 'Email Header Parser', slug: 'email-header-parser', shortDesc: 'Parse RFC 822/5322 email headers into structured sender, recipient, subject, and relay fields.' },
  { name: 'Email Header Analyzer', slug: 'email-header-analyzer', shortDesc: 'Audit email headers for SPF, DKIM, and DMARC authentication and transmission hops.' },
  { name: 'Email Date Converter', slug: 'email-date-converter', shortDesc: 'Convert RFC 2822 email header timestamps to UTC ISO strings, local time, and Unix epochs.' },
  { name: 'Message-ID Parser', slug: 'message-id-parser', shortDesc: 'Parse RFC 5322 Message-ID headers to verify entropy, domain origin, and standard format.' },
  { name: 'MIME Email Viewer', slug: 'mime-email-viewer', shortDesc: 'Inspect multipart MIME structures, boundary delimiters, content types, and transfer encodings.' },
  { name: 'Email Subject Line Length Checker', slug: 'email-subject-line-length-checker', shortDesc: 'Audit email subject line length and mobile display truncation for higher open rates.' },
  { name: 'Email Preheader Checker', slug: 'email-preheader-checker', shortDesc: 'Test email preheader text length alongside subject lines to ensure clean inbox previews.' },
  { name: 'HTML Email Previewer', slug: 'html-email-previewer', shortDesc: 'Preview HTML emails, calculate size against Gmail 102KB clipping limits, and audit table tags.' },
  { name: 'HTML Email Cleaner', slug: 'html-email-cleaner', shortDesc: 'Strip scripts, iframes, inline event handlers, and tracking comments for clean email rendering.' },
  { name: 'Email Signature Generator', slug: 'email-signature-generator', shortDesc: 'Generate responsive HTML and plaintext email signatures with contact details and branding.' },
  { name: 'Email Address List Cleaner', slug: 'email-address-list-cleaner', shortDesc: 'Filter and sanitize email lists, discarding invalid syntaxes and malformed entries.' },
  { name: 'Email Domain Extractor', slug: 'email-domain-extractor', shortDesc: 'Extract unique domains from email lists and generate mailbox frequency distributions.' },
  { name: 'Email Quoted-Printable Decoder', slug: 'email-quoted-printable-decoder', shortDesc: 'Decode RFC 2045 quoted-printable encoded email content into readable plaintext.' },
  { name: 'Email Base64 Attachment Decoder', slug: 'email-base64-attachment-decoder', shortDesc: 'Decode Base64 email attachments and inspect magic bytes for file type detection.' },
  { name: 'Email Header Date Normalizer', slug: 'email-header-date-normalizer', shortDesc: 'Normalize disparate email header date formats into synchronized ISO 8601 UTC stamps.' },
  { name: 'Email Address Deduplicator', slug: 'email-address-deduplicator', shortDesc: 'Remove duplicate email addresses from recipient lists with case-insensitive normalization.' },
  { name: 'Email List Format Converter', slug: 'email-list-format-converter', shortDesc: 'Convert email lists between CSV, JSON array, semicolon-delimited, and SQL INSERT formats.' },
  { name: 'Email Footer Generator', slug: 'email-footer-generator', shortDesc: 'Generate CAN-SPAM and GDPR compliant email footers with unsubscribe and physical address info.' },
  { name: 'Email Template HTML Formatter', slug: 'email-template-html-formatter', shortDesc: 'Format and indent nested HTML email tables and rows for clean code maintenance.' },
  { name: 'Email Character Encoding Inspector', slug: 'email-character-encoding-inspector', shortDesc: 'Inspect email character encodings, detect non-ASCII glyphs, and prevent garbled text.' }
];

const dataTools = [
  { name: 'Duplicate Data Finder', slug: 'duplicate-data-finder', shortDesc: 'Scan datasets to identify repeated rows, identical records, and frequency counts.' },
  { name: 'Duplicate Email Finder', slug: 'duplicate-email-finder', shortDesc: 'Detect duplicate email addresses in subscriber lists and CRM exports.' },
  { name: 'Duplicate Phone Number Finder', slug: 'duplicate-phone-number-finder', shortDesc: 'Identify duplicate phone numbers normalized by stripping symbols and country codes.' },
  { name: 'Duplicate URL Finder', slug: 'duplicate-url-finder', shortDesc: 'Identify duplicate URLs across sitemaps, audit crawls, and content inventories.' },
  { name: 'Duplicate ID Finder', slug: 'duplicate-id-finder', shortDesc: 'Detect primary key ID collisions and duplicated identifiers in database exports.' },
  { name: 'Empty Value Cleaner', slug: 'empty-value-cleaner', shortDesc: 'Strip blank rows, empty cells, and placeholder dashes from tabular datasets.' },
  { name: 'Null Value Analyzer', slug: 'null-value-analyzer', shortDesc: 'Audit CSV datasets to quantify null, None, NaN, and missing values per column.' },
  { name: 'Whitespace Normalizer', slug: 'whitespace-normalizer', shortDesc: 'Normalize excessive spaces, tabs, and indentation across data columns and text.' },
  { name: 'Unicode Normalizer', slug: 'unicode-normalizer', shortDesc: 'Normalize Unicode strings to NFC, NFD, NFKC, or NFKD forms to fix search and collation.' },
  { name: 'Date Normalizer', slug: 'date-normalizer', shortDesc: 'Standardize mixed date formats into uniform ISO 8601 (YYYY-MM-DD) entries.' },
  { name: 'Phone Number Formatter', slug: 'phone-number-formatter', shortDesc: 'Format raw phone digits into standardized E.164, national, or dot formats.' },
  { name: 'Email List Cleaner', slug: 'email-list-cleaner', shortDesc: 'Clean, validate, and deduplicate bulk email lists for improved email deliverability.' },
  { name: 'URL List Cleaner', slug: 'url-list-cleaner', shortDesc: 'Sanitize bulk URL lists by removing tracking tags, hashes, and duplicate links.' },
  { name: 'CSV Dataset Profiler', slug: 'csv-dataset-profiler', shortDesc: 'Profile CSV datasets to automatically infer column data types, row counts, and memory footprint.' },
  { name: 'Dataset Statistics Generator', slug: 'dataset-statistics-generator', shortDesc: 'Calculate total observations, column density, and executive summary metrics for datasets.' },
  { name: 'Column Statistics Analyzer', slug: 'column-statistics-analyzer', shortDesc: 'Analyze specific dataset columns for min, max, mean, median, or discrete value frequencies.' },
  { name: 'Missing Value Report Generator', slug: 'missing-value-report-generator', shortDesc: 'Generate missingness percentages and completeness audit reports across dataset columns.' },
  { name: 'Data Quality Score Calculator', slug: 'data-quality-score-calculator', shortDesc: 'Compute overall data quality scores (0-100) based on completeness and uniqueness metrics.' },
  { name: 'Text Column Normalizer', slug: 'text-column-normalizer', shortDesc: 'Normalize text columns by stripping extraneous whitespace and control characters.' },
  { name: 'Number Format Normalizer', slug: 'number-format-normalizer', shortDesc: 'Convert currency symbols, European decimals, and percentages into standardized numeric values.' },
  { name: 'Address Line Cleaner', slug: 'address-line-cleaner', shortDesc: 'Clean street address strings by standardizing abbreviations (St, Ave, Rd, Apt) and title casing.' },
  { name: 'Name Case Normalizer', slug: 'name-case-normalizer', shortDesc: 'Normalize names to Title Case while respecting McDonald, O\'Connor, and hyphenated names.' },
  { name: 'Dataset Duplicate Report', slug: 'dataset-duplicate-report', shortDesc: 'Generate line-number duplicate reports highlighting identical data row clusters.' },
  { name: 'Data Outlier Detector', slug: 'data-outlier-detector', shortDesc: 'Detect statistical outliers in numeric columns using the Interquartile Range (1.5x IQR) rule.' },
  { name: 'Dataset Summary Generator', slug: 'dataset-summary-generator', shortDesc: 'Generate comprehensive data dictionaries and readiness summaries for data science pipelines.' }
];

function upsert(tool, category, categoryName) {
  const existingIdx = tools.findIndex(t => t.slug === tool.slug);
  const toolEntry = {
    id: tool.slug,
    name: tool.name,
    slug: tool.slug,
    category: category,
    categoryName: categoryName,
    shortDesc: tool.shortDesc,
    metaTitle: `${tool.name} - Free Online Developer Utility`,
    metaDescription: `${tool.shortDesc} Fast, 100% client-side, zero server logging.`,
    primaryKeyword: tool.name.toLowerCase(),
    secondaryKeywords: [
      `${tool.name.toLowerCase()} online`,
      `free ${tool.name.toLowerCase()}`,
      `${categoryName.toLowerCase()} tool`
    ],
    lsiKeywords: ['developer tools', 'data cleaning', 'client-side', 'privacy focused'],
    inputType: 'text',
    hasFileSupport: false,
    related: [],
    popular: false
  };

  if (existingIdx >= 0) {
    tools[existingIdx] = { ...tools[existingIdx], ...toolEntry };
  } else {
    tools.push(toolEntry);
  }
}

urlTools.forEach(t => upsert(t, 'url-utm-tools', 'URL & UTM Tools'));
emailTools.forEach(t => upsert(t, 'email-tools', 'Email Tools'));
dataTools.forEach(t => upsert(t, 'data-cleaning-analysis', 'Data Cleaning & Analysis'));

// Link related tools
tools.forEach(t => {
  if (t.category === 'url-utm-tools') {
    t.related = urlTools.filter(x => x.slug !== t.slug).slice(0, 4).map(x => x.slug);
  } else if (t.category === 'email-tools') {
    t.related = emailTools.filter(x => x.slug !== t.slug).slice(0, 4).map(x => x.slug);
  } else if (t.category === 'data-cleaning-analysis') {
    t.related = dataTools.filter(x => x.slug !== t.slug).slice(0, 4).map(x => x.slug);
  }
});

fs.writeFileSync(toolsPath, JSON.stringify(tools, null, 2), 'utf8');
console.log(`Successfully populated URL, Email, and Data Cleaning tools. Total tools now: ${tools.length}`);
