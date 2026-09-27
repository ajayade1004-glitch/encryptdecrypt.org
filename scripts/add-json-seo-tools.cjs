const fs = require('fs');
const path = require('path');

const toolsPath = path.join(__dirname, '../public/assets/data/tools.json');
const tools = JSON.parse(fs.readFileSync(toolsPath, 'utf8'));

const jsonTools = [
  { name: 'JSON Flatten Tool', slug: 'json-flatten-tool', shortDesc: 'Flatten deeply nested JSON objects into clean dot-notation key-value pairs.' },
  { name: 'JSON Unflatten Tool', slug: 'json-unflatten-tool', shortDesc: 'Reconstruct dot-notation JSON keys into complete hierarchical nested objects.' },
  { name: 'JSON Array Sorter', slug: 'json-array-sorter', shortDesc: 'Sort arrays of JSON objects by any key in ascending or descending order.' },
  { name: 'JSON Array Filter', slug: 'json-array-filter', shortDesc: 'Filter JSON object arrays by field conditions, string match, and values.' },
  { name: 'JSON Key Renamer', slug: 'json-key-renamer', shortDesc: 'Rename keys recursively across JSON documents with camelCase and snake_case support.' },
  { name: 'JSON Key Remover', slug: 'json-key-remover', shortDesc: 'Strip sensitive keys such as passwords, secrets, tokens, and metadata recursively.' },
  { name: 'JSON Key Extractor', slug: 'json-key-extractor', shortDesc: 'Extract all unique key paths from any arbitrary JSON object or dataset.' },
  { name: 'JSON Lines Formatter', slug: 'json-lines-formatter', shortDesc: 'Convert standard JSON arrays into JSONL/NDJSON newline-delimited streams and back.' },
  { name: 'JSON Deep Merge Tool', slug: 'json-deep-merge-tool', shortDesc: 'Deeply merge two JSON documents recursively combining nested properties and arrays.' },
  { name: 'JSON Patch Generator', slug: 'json-patch-generator', shortDesc: 'Generate RFC 6902 JSON Patch diff operations (add, remove, replace) between states.' },
  { name: 'JSON Patch Tester', slug: 'json-patch-tester', shortDesc: 'Apply RFC 6902 JSON Patch operations onto a target document to verify updates.' },
  { name: 'JSON Pointer Tester', slug: 'json-pointer-tester', shortDesc: 'Evaluate RFC 6901 JSON Pointers to extract values from complex nested structures.' },
  { name: 'JSON Size Calculator', slug: 'json-size-calculator', shortDesc: 'Calculate raw bytes, minified size, and projected gzip compression savings for JSON payloads.' },
  { name: 'JSON Structure Visualizer', slug: 'json-structure-visualizer', shortDesc: 'Visualize JSON schemas as an ASCII tree outline with inferred primitive types.' },
  { name: 'JSON Array Deduplicator', slug: 'json-array-deduplicator', shortDesc: 'Remove duplicate elements or objects from a JSON array by unique identifier.' },
  { name: 'JSON Object Key Sorter', slug: 'json-object-key-sorter', shortDesc: 'Alphabetically sort all JSON object keys recursively for deterministic hashing.' },
  { name: 'JSON Nested Value Extractor', slug: 'json-nested-value-extractor', shortDesc: 'Extract all occurrences of a specific key across arbitrary nested depths.' },
  { name: 'JSON Path Generator', slug: 'json-path-generator', shortDesc: 'Generate JSONPath query expressions for every terminal node in a JSON document.' },
  { name: 'JSON Schema Diff Tool', slug: 'json-schema-diff-tool', shortDesc: 'Compare structural schemas of two JSON payloads and flag type and property mismatches.' },
  { name: 'JSON API Mock Response Generator', slug: 'json-api-mock-response-generator', shortDesc: 'Generate realistic REST API responses with HTTP status codes, headers, and pagination.' },
  { name: 'JSON Data Faker', slug: 'json-data-faker', shortDesc: 'Generate realistic mock JSON datasets with names, emails, UUIDs, and timestamps.' },
  { name: 'JSON to Rust Struct Converter', slug: 'json-to-rust-struct-converter', shortDesc: 'Convert JSON payloads into strongly-typed Rust structs with Serde serialization.' },
  { name: 'JSON to Swift Model Converter', slug: 'json-to-swift-model-converter', shortDesc: 'Generate Swift Codable struct models from JSON examples for iOS and macOS apps.' },
  { name: 'JSON to Dart Model Converter', slug: 'json-to-dart-model-converter', shortDesc: 'Generate Flutter and Dart model classes with fromJson and toJson serializers.' },
  { name: 'JSON to PHP Class Generator', slug: 'json-to-php-class-generator', shortDesc: 'Generate modern PHP 8.x typed classes with constructor promotion and JsonSerializable.' }
];

const seoTools = [
  { name: 'URL Length Checker', slug: 'url-length-checker', shortDesc: 'Analyze URL character counts and path lengths to prevent Google SERP snippet truncation.' },
  { name: 'Keyword Clustering Tool', slug: 'keyword-clustering-tool', shortDesc: 'Group keyword lists into semantic clusters using token matching and search intent.' },
  { name: 'Search Intent Classifier', slug: 'search-intent-classifier', shortDesc: 'Classify keywords into Informational, Commercial, Transactional, or Navigational intent.' },
  { name: 'FAQ Generator', slug: 'faq-generator', shortDesc: 'Transform Q&A lists into formatted FAQ markdown and Schema.org rich results.' },
  { name: 'Content Outline Generator', slug: 'content-outline-generator', shortDesc: 'Generate structured H1, H2, and H3 article outlines with target word counts and key modules.' },
  { name: 'SEO Content Brief Generator', slug: 'seo-content-brief-generator', shortDesc: 'Create comprehensive writer briefs with keywords, search intent, audience, and internal links.' },
  { name: 'Anchor Text Generator', slug: 'anchor-text-generator', shortDesc: 'Generate natural, branded, partial-match, and LSI anchor text distributions for link building.' },
  { name: 'Image Filename SEO Generator', slug: 'image-filename-seo-generator', shortDesc: 'Convert camera filenames and descriptions into hyphenated, keyword-rich image filenames.' },
  { name: 'Alt Text Template Generator', slug: 'alt-text-template-generator', shortDesc: 'Generate accessibility-compliant and SEO-friendly image alt text templates for web pages.' },
  { name: 'Content Length Analyzer', slug: 'content-length-analyzer', shortDesc: 'Evaluate word counts, reading time, sentence density, and SERP competitive depth.' },
  { name: 'Topic Cluster Planner', slug: 'topic-cluster-planner', shortDesc: 'Plan Hub-and-Spoke topic clusters with pillar pages and supporting subtopic link routes.' },
  { name: 'Pillar Page Planner', slug: 'pillar-page-planner', shortDesc: 'Create modular blueprints for comprehensive 3,000+ word evergreen 10x pillar guides.' },
  { name: 'SEO Content Calendar Generator', slug: 'seo-content-calendar-generator', shortDesc: 'Generate an editorial 4-week publishing calendar with target intents and deadlines.' },
  { name: 'Redirect Mapping Generator', slug: 'redirect-mapping-generator', shortDesc: 'Generate Apache .htaccess, NGINX rewrite, and Cloudflare 301 redirect rules.' },
  { name: 'Breadcrumb Schema Generator', slug: 'breadcrumb-schema-generator', shortDesc: 'Generate Google-compliant BreadcrumbList Schema.org JSON-LD structured data.' },
  { name: 'LocalBusiness Schema Generator', slug: 'localbusiness-schema-generator', shortDesc: 'Generate LocalBusiness Schema.org JSON-LD with geo-coordinates, address, and hours.' },
  { name: 'HowTo Schema Generator', slug: 'howto-schema-generator', shortDesc: 'Build Schema.org HowTo JSON-LD markup with numbered steps and descriptions.' },
  { name: 'FAQ Schema Validator', slug: 'faq-schema-validator', shortDesc: 'Validate FAQPage JSON-LD against Google Rich Snippet search requirements.' },
  { name: 'Meta Robots Tag Builder', slug: 'meta-robots-tag-builder', shortDesc: 'Generate meta robots HTML tags and X-Robots-Tag HTTP headers with index and follow flags.' },
  { name: 'SEO URL Cleaner', slug: 'seo-url-cleaner', shortDesc: 'Sanitize URLs by stripping UTM tracking tags, session IDs, trailing slashes, and hash fragments.' },
  { name: 'Internal Link Anchor Planner', slug: 'internal-link-anchor-planner', shortDesc: 'Plan natural in-content anchor text sentences to pass internal PageRank authority.' },
  { name: 'Keyword Group Comparison Tool', slug: 'keyword-group-comparison-tool', shortDesc: 'Compare two keyword sets for overlap, unique opportunities, and cannibalization risks.' },
  { name: 'Sitemap URL Count Analyzer', slug: 'sitemap-url-count-analyzer', shortDesc: 'Parse XML sitemaps, count URL loc entries, and audit compliance with Google limits.' },
  { name: 'Canonical URL Normalizer', slug: 'canonical-url-normalizer', shortDesc: 'Fix HTTPS protocol, non-www consistency, trailing slashes, and output canonical link tags.' },
  { name: 'SEO Heading Outline Generator', slug: 'seo-heading-outline-generator', shortDesc: 'Audit H1-H6 heading hierarchy, check for missing H1 tags, and detect skipped heading levels.' }
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
    lsiKeywords: ['developer tools', 'webmaster utilities', 'client-side', 'privacy focused'],
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

jsonTools.forEach(t => upsert(t, 'json-developer-tools', 'JSON & Developer Tools'));
seoTools.forEach(t => upsert(t, 'seo-webmaster', 'SEO & Webmaster'));

// Link related tools
tools.forEach(t => {
  if (t.category === 'json-developer-tools') {
    t.related = jsonTools.filter(x => x.slug !== t.slug).slice(0, 4).map(x => x.slug);
  } else if (t.category === 'seo-webmaster') {
    t.related = seoTools.filter(x => x.slug !== t.slug).slice(0, 4).map(x => x.slug);
  }
});

fs.writeFileSync(toolsPath, JSON.stringify(tools, null, 2), 'utf8');
console.log(`Successfully updated tools.json. Total tools now: ${tools.length}`);
