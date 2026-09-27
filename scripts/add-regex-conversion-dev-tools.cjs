const fs = require('fs');
const path = require('path');

const toolsPath = path.join(__dirname, '../public/assets/data/tools.json');
const tools = JSON.parse(fs.readFileSync(toolsPath, 'utf8'));

const existingSlugs = new Set(tools.map(t => t.slug));

const newTools = [
  // --- 🧵 Regex / Pattern Tools ---
  {
    id: 'regex-to-plain-english-explainer',
    name: 'Regex to Plain English Explainer',
    slug: 'regex-to-plain-english-explainer',
    category: 'regex-pattern',
    categoryName: 'Regex & Pattern Tools',
    shortDesc: 'Deconstruct complex Regular Expression syntax patterns into readable plain English explanations.',
    metaTitle: 'Regex to Plain English Explainer Online - Pattern Breakdown',
    metaDescription: 'Deconstruct complex regular expressions into step-by-step plain English explanations.',
    primaryKeyword: 'regex to plain english explainer online',
    secondaryKeywords: ['explain regular expression online', 'regex breakdown tool', 'human readable regex explainer'],
    lsiKeywords: ['regular expression syntax', 'regex capture groups', 'lookaround assertions'],
    inputType: 'text',
    hasFileSupport: false,
    icon: 'Search',
    related: ['glob-pattern-to-regex-converter', 'regex-capture-group-tester'],
    popular: true
  },
  {
    id: 'glob-pattern-to-regex-converter',
    name: 'Glob Pattern to Regex Converter',
    slug: 'glob-pattern-to-regex-converter',
    category: 'regex-pattern',
    categoryName: 'Regex & Pattern Tools',
    shortDesc: 'Convert wildcards and file glob patterns (*.js, src/**/*.ts) into valid Regular Expressions.',
    metaTitle: 'Glob Pattern to Regex Converter Online - Wildcard Translator',
    metaDescription: 'Convert file path glob wildcards (*.ts, **/*.js) into RegExp strings online.',
    primaryKeyword: 'glob pattern to regex converter online',
    secondaryKeywords: ['convert wildcard glob to regex', 'file path glob to regexp solver', 'glob pattern matcher regex'],
    lsiKeywords: ['glob wildcard matching', 'regexp string conversion', 'path glob syntax'],
    inputType: 'text',
    hasFileSupport: false,
    icon: 'Search',
    related: ['regex-to-plain-english-explainer', 'regex-capture-group-tester'],
    popular: true
  },
  {
    id: 'regex-capture-group-tester',
    name: 'Regex Capture Group Extractor & Tester',
    slug: 'regex-capture-group-tester',
    category: 'regex-pattern',
    categoryName: 'Regex & Pattern Tools',
    shortDesc: 'Test Regular Expressions against text and extract numbered and named capture groups.',
    metaTitle: 'Regex Capture Group Extractor & Tester Online',
    metaDescription: 'Test regular expressions against sample text and extract numbered capture groups in browser RAM.',
    primaryKeyword: 'regex capture group tester online',
    secondaryKeywords: ['extract regex capture groups', 'regex group matching tool', 'test regular expression groups'],
    lsiKeywords: ['numbered capture groups', 'regexp exec matches', 'group extraction'],
    inputType: 'textarea',
    hasFileSupport: false,
    icon: 'Search',
    related: ['regex-to-plain-english-explainer', 'glob-pattern-to-regex-converter'],
    popular: true
  },

  // --- 🧮 Advanced Unit Conversion ---
  {
    id: 'torque-unit-converter-pro',
    name: 'Torque Unit Converter (Nm ↔ ft-lb ↔ kgf-cm)',
    slug: 'torque-unit-converter-pro',
    category: 'advanced-conversions',
    categoryName: 'Advanced Unit Conversions',
    shortDesc: 'Convert mechanical rotational torque between Newton-Meters (N·m), Foot-Pounds (ft-lb), and Kgf-cm.',
    metaTitle: 'Torque Unit Converter Online - Nm, Ft-Lb, Kgf-cm',
    metaDescription: 'Convert torque measurements between Newton-Meters (Nm), Foot-Pounds (ft-lb), and Kgf-cm.',
    primaryKeyword: 'torque unit converter online',
    secondaryKeywords: ['convert newton meters to foot pounds', 'torque unit conversion calculator', 'ft lbs to nm converter'],
    lsiKeywords: ['rotational force torque', 'newton meters foot pounds', 'mechanical torque conversion'],
    inputType: 'number',
    hasFileSupport: false,
    icon: 'RefreshCw',
    related: ['pressure-unit-converter-pro', 'fuel-efficiency-converter-pro'],
    popular: true
  },
  {
    id: 'pressure-unit-converter-pro',
    name: 'Pressure Unit Converter (PSI ↔ Bar ↔ Pascal ↔ ATM)',
    slug: 'pressure-unit-converter-pro',
    category: 'advanced-conversions',
    categoryName: 'Advanced Unit Conversions',
    shortDesc: 'Convert pressure units across PSI, Bar, Pascals (Pa), Kilopascals (kPa), and Atmospheres (ATM).',
    metaTitle: 'Pressure Unit Converter Online - PSI, Bar, Pascal, ATM',
    metaDescription: 'Convert pressure measurements across PSI, Bar, Pascals, KPa, and Atmospheres.',
    primaryKeyword: 'pressure unit converter online',
    secondaryKeywords: ['convert psi to bar', 'pascal to atm converter', 'pressure conversion calculator'],
    lsiKeywords: ['pascal atmospheric pressure', 'bar psi conversion', 'pressure measurement units'],
    inputType: 'number',
    hasFileSupport: false,
    icon: 'RefreshCw',
    related: ['torque-unit-converter-pro', 'fuel-efficiency-converter-pro'],
    popular: true
  },
  {
    id: 'fuel-efficiency-converter-pro',
    name: 'Fuel Efficiency Converter (MPG ↔ L/100km ↔ km/L)',
    slug: 'fuel-efficiency-converter-pro',
    category: 'advanced-conversions',
    categoryName: 'Advanced Unit Conversions',
    shortDesc: 'Convert vehicle fuel economy between Miles Per Gallon (MPG US/UK), Liters/100km, and Km/Liter.',
    metaTitle: 'Fuel Efficiency Converter Online - MPG, L/100km, km/L',
    metaDescription: 'Convert fuel efficiency between Miles Per Gallon (MPG), Liters per 100km, and Kilometers per Liter.',
    primaryKeyword: 'fuel efficiency converter online',
    secondaryKeywords: ['convert mpg to l 100km', 'km l to mpg calculator', 'fuel consumption unit converter'],
    lsiKeywords: ['miles per gallon mpg', 'liters per 100km', 'km per liter'],
    inputType: 'number',
    hasFileSupport: false,
    icon: 'RefreshCw',
    related: ['data-transfer-rate-converter-pro', 'torque-unit-converter-pro'],
    popular: true
  },
  {
    id: 'data-transfer-rate-converter-pro',
    name: 'Data Transfer Rate Converter (Mbps ↔ MB/s ↔ GB/hr)',
    slug: 'data-transfer-rate-converter-pro',
    category: 'advanced-conversions',
    categoryName: 'Advanced Unit Conversions',
    shortDesc: 'Convert network download speeds between Megabits per second (Mbps), Megabytes per second (MB/s), and GB/hr.',
    metaTitle: 'Data Transfer Rate Converter Online - Mbps, MB/s, GB/hr',
    metaDescription: 'Convert internet bandwidth speeds between Mbps, MB/s, and Gigabytes per hour.',
    primaryKeyword: 'data transfer rate converter online',
    secondaryKeywords: ['convert mbps to mb s', 'download speed converter gb hr', 'network bandwidth speed calculator'],
    lsiKeywords: ['megabits per second', 'megabytes per second', 'network throughput speed'],
    inputType: 'number',
    hasFileSupport: false,
    icon: 'RefreshCw',
    related: ['fuel-efficiency-converter-pro', 'pressure-unit-converter-pro'],
    popular: true
  },

  // --- 🔧 Developer Productivity ---
  {
    id: 'hello-world-reference-generator',
    name: 'Multi-Language "Hello World" Reference Generator',
    slug: 'hello-world-reference-generator',
    category: 'developer-productivity',
    categoryName: 'Developer Productivity',
    shortDesc: 'Generate canonical "Hello World" boilerplate code snippets across 25+ programming languages.',
    metaTitle: 'Multi-Language Hello World Reference Generator Online',
    metaDescription: 'Lookup standard Hello World code snippets across Python, JavaScript, Rust, Go, Java, C++, and Swift.',
    primaryKeyword: 'hello world reference generator online',
    secondaryKeywords: ['multi language hello world snippets', 'hello world code examples', 'programming language boilerplate'],
    lsiKeywords: ['hello world boilerplate', 'multi language programming', 'code syntax reference'],
    inputType: 'text',
    hasFileSupport: false,
    icon: 'Code',
    related: ['semantic-versioning-bump-calculator', 'rest-api-naming-convention-checker'],
    popular: true
  },
  {
    id: 'lorem-ipsum-variant-generator',
    name: 'Lorem Ipsum Generator (Cicero, Hipster, Bacon)',
    slug: 'lorem-ipsum-variant-generator',
    category: 'developer-productivity',
    categoryName: 'Developer Productivity',
    shortDesc: 'Generate dummy placeholder text paragraphs in standard Cicero Latin, Hipster, or Bacon variants.',
    metaTitle: 'Lorem Ipsum Variant Generator Online - Cicero, Hipster, Bacon',
    metaDescription: 'Generate customized dummy placeholder text in classical Latin, Hipster, or Bacon styles.',
    primaryKeyword: 'lorem ipsum variant generator online',
    secondaryKeywords: ['hipster ipsum generator', 'bacon ipsum generator', 'dummy placeholder text maker'],
    lsiKeywords: ['placeholder text generator', 'dummy text paragraphs', 'lorem ipsum cicero'],
    inputType: 'text',
    hasFileSupport: false,
    icon: 'Code',
    related: ['offline-placeholder-image-data-uri-generator', 'hello-world-reference-generator'],
    popular: true
  },
  {
    id: 'offline-placeholder-image-data-uri-generator',
    name: 'Offline Placeholder Image Data URI Generator',
    slug: 'offline-placeholder-image-data-uri-generator',
    category: 'developer-productivity',
    categoryName: 'Developer Productivity',
    shortDesc: 'Generate custom dimension SVG placeholder images directly as base64 Data URIs 100% offline.',
    metaTitle: 'Offline Placeholder Image Data URI Generator Online',
    metaDescription: 'Generate SVG placeholder image Data URIs offline with custom dimensions and background colors.',
    primaryKeyword: 'offline placeholder image generator online',
    secondaryKeywords: ['data uri placeholder image maker', 'svg placeholder generator offline', 'dummy image data uri'],
    lsiKeywords: ['data uri svg image', 'placeholder image dimensions', 'offline image data uri'],
    inputType: 'text',
    hasFileSupport: false,
    icon: 'Code',
    related: ['lorem-ipsum-variant-generator', 'hello-world-reference-generator'],
    popular: true
  },
  {
    id: 'semantic-versioning-bump-calculator',
    name: 'Semantic Versioning (SemVer) Bump Calculator',
    slug: 'semantic-versioning-bump-calculator',
    category: 'developer-productivity',
    categoryName: 'Developer Productivity',
    shortDesc: 'Calculate next release version numbers for Major (breaking), Minor (feat), and Patch (fix) SemVer bumps.',
    metaTitle: 'Semantic Versioning (SemVer) Bump Calculator Online',
    metaDescription: 'Calculate upcoming Semantic Version (SemVer) release tags for Major, Minor, and Patch changes.',
    primaryKeyword: 'semantic versioning bump calculator online',
    secondaryKeywords: ['semver release version calculator', 'major minor patch version bump', 'semver versioning preview'],
    lsiKeywords: ['semantic versioning semver', 'major minor patch bump', 'breaking change versioning'],
    inputType: 'text',
    hasFileSupport: false,
    icon: 'Code',
    related: ['rest-api-naming-convention-checker', 'hello-world-reference-generator'],
    popular: true
  },
  {
    id: 'rest-api-naming-convention-checker',
    name: 'REST API Endpoint Naming Convention Linter',
    slug: 'rest-api-naming-convention-checker',
    category: 'developer-productivity',
    categoryName: 'Developer Productivity',
    shortDesc: 'Lint REST API URL paths against industry best practices (kebab-case, lowercase, no trailing slashes).',
    metaTitle: 'REST API Endpoint Naming Convention Linter Online',
    metaDescription: 'Lint REST API URL endpoint paths against kebab-case, lowercase, and RESTful resource guidelines.',
    primaryKeyword: 'rest api naming convention checker online',
    secondaryKeywords: ['rest api endpoint linter', 'api URL best practices checker', 'kebab case rest path validator'],
    lsiKeywords: ['restful resource naming', 'kebab case endpoints', 'api url design best practices'],
    inputType: 'text',
    hasFileSupport: false,
    icon: 'Code',
    related: ['semantic-versioning-bump-calculator', 'hello-world-reference-generator'],
    popular: true
  }
];

let addedCount = 0;
newTools.forEach(tool => {
  if (!existingSlugs.has(tool.slug)) {
    tools.push(tool);
    existingSlugs.add(tool.slug);
    addedCount++;
  }
});

fs.writeFileSync(toolsPath, JSON.stringify(tools, null, 2), 'utf8');
console.log(`Successfully added ${addedCount} new tools. Total tools count: ${tools.length}`);
