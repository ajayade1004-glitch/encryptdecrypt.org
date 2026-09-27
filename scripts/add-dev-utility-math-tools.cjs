const fs = require('fs');
const path = require('path');

const toolsPath = path.join(__dirname, '../public/assets/data/tools.json');
const tools = JSON.parse(fs.readFileSync(toolsPath, 'utf8'));

const existingSlugs = new Set(tools.map(t => t.slug));

const newTools = [
  // --- 🧑💻 Developer Utility Extras ---
  {
    id: 'semver-range-satisfier-tester',
    name: 'SemVer Range Satisfier Tester (^1.2.3)',
    slug: 'semver-range-satisfier-tester',
    category: 'dev-utility-extras',
    categoryName: 'Developer Utility Extras',
    shortDesc: 'Test whether a target package version satisfies caret (^), tilde (~), or exact SemVer range operators.',
    metaTitle: 'SemVer Range Satisfier Tester Online - Caret & Tilde Rules',
    metaDescription: 'Test whether version strings satisfy SemVer range rules (^, ~, >=) online.',
    primaryKeyword: 'semver range satisfier tester online',
    secondaryKeywords: ['caret tilde semver range checker', 'npm semver version satisfier test', 'semantic version range matcher'],
    lsiKeywords: ['caret operator caret semver', 'tilde version range', 'semver backward compatibility'],
    inputType: 'text',
    hasFileSupport: false,
    icon: 'Code',
    related: ['npm-package-name-validator', 'http-cache-control-directive-builder'],
    popular: true
  },
  {
    id: 'npm-package-name-validator',
    name: 'NPM Package Name Syntax Validator',
    slug: 'npm-package-name-validator',
    category: 'dev-utility-extras',
    categoryName: 'Developer Utility Extras',
    shortDesc: 'Validate npm package name syntax rules (lowercase, URL safety, 214 char limit, special characters).',
    metaTitle: 'NPM Package Name Syntax Validator Online',
    metaDescription: 'Validate npm registry package name syntax rules, special character limits, and URL safety.',
    primaryKeyword: 'npm package name validator online',
    secondaryKeywords: ['validate npm package name rules', 'npm registry name syntax checker', 'npm package name character limit'],
    lsiKeywords: ['npm package naming rules', 'registry package name validator', 'lowercase url safe package name'],
    inputType: 'text',
    hasFileSupport: false,
    icon: 'Code',
    related: ['semver-range-satisfier-tester', 'http-cache-control-directive-builder'],
    popular: true
  },
  {
    id: 'http-cache-control-directive-builder',
    name: 'HTTP Cache-Control Directive Header Builder',
    slug: 'http-cache-control-directive-builder',
    category: 'dev-utility-extras',
    categoryName: 'Developer Utility Extras',
    shortDesc: 'Build compliant HTTP Cache-Control header directives (max-age, public, private, no-cache, must-revalidate).',
    metaTitle: 'HTTP Cache-Control Directive Header Builder Online',
    metaDescription: 'Build RFC compliant HTTP Cache-Control headers (max-age, public, private, no-store).',
    primaryKeyword: 'http cache control header builder online',
    secondaryKeywords: ['build cache control header directives', 'max age no cache header generator', 'cdn HTTP caching header builder'],
    lsiKeywords: ['cache control header directives', 'max age seconds', 'cdn browser caching'],
    inputType: 'text',
    hasFileSupport: false,
    icon: 'Code',
    related: ['semver-range-satisfier-tester', 'webhook-retry-backoff-calculator'],
    popular: true
  },
  {
    id: 'webhook-retry-backoff-calculator',
    name: 'Webhook Exponential Retry Backoff Calculator',
    slug: 'webhook-retry-backoff-calculator',
    category: 'dev-utility-extras',
    categoryName: 'Developer Utility Extras',
    shortDesc: 'Calculate exponential retry backoff delays and cumulative wait times for failed API webhook deliveries.',
    metaTitle: 'Webhook Exponential Retry Backoff Calculator Online',
    metaDescription: 'Calculate exponential retry schedules, multipliers, and cumulative wait times for API webhooks.',
    primaryKeyword: 'webhook retry backoff calculator online',
    secondaryKeywords: ['exponential backoff retry schedule solver', 'api webhook retry delay calculator', 'calculate cumulative retry wait time'],
    lsiKeywords: ['exponential backoff schedule', 'webhook retry attempt', 'cumulative wait time seconds'],
    inputType: 'number',
    hasFileSupport: false,
    icon: 'Code',
    related: ['http-cache-control-directive-builder', 'etag-generator-weak-strong'],
    popular: true
  },
  {
    id: 'etag-generator-weak-strong',
    name: 'HTTP ETag Generator (Weak W/ vs Strong)',
    slug: 'etag-generator-weak-strong',
    category: 'dev-utility-extras',
    categoryName: 'Developer Utility Extras',
    shortDesc: 'Generate RFC 7232 weak (W/) and strong HTTP ETag headers for HTTP caching and conditional GET requests.',
    metaTitle: 'HTTP ETag Generator Online - Weak (W/) & Strong Headers',
    metaDescription: 'Generate weak (W/) and strong HTTP ETag header strings for cache validation.',
    primaryKeyword: 'http etag generator online',
    secondaryKeywords: ['generate weak etag header', 'strong etag generator online', 'http etag hash calculator'],
    lsiKeywords: ['etag header validation', 'weak etag w slash', 'conditional get caching'],
    inputType: 'text',
    hasFileSupport: false,
    icon: 'Code',
    related: ['http-cache-control-directive-builder', 'webhook-retry-backoff-calculator'],
    popular: true
  },

  // --- 🔢 Math & Number Extras ---
  {
    id: 'harmonic-mean-calculator',
    name: 'Harmonic Mean Calculator',
    slug: 'harmonic-mean-calculator',
    category: 'math-number-extras',
    categoryName: 'Math & Number Extras',
    shortDesc: 'Calculate harmonic mean averages for datasets, ratios, and rates of speed.',
    metaTitle: 'Harmonic Mean Calculator Online - Reciprocal Average',
    metaDescription: 'Calculate harmonic mean averages for positive numbers, rates, and ratios online.',
    primaryKeyword: 'harmonic mean calculator online',
    secondaryKeywords: ['calculate reciprocal average online', 'harmonic mean speed calculator', 'harmonic mean formula solver'],
    lsiKeywords: ['harmonic mean formula', 'reciprocals sum average', 'rate average calculation'],
    inputType: 'text',
    hasFileSupport: false,
    icon: 'Sigma',
    related: ['geometric-mean-calculator', 'compound-annual-growth-rate-cagr-calculator'],
    popular: true
  },
  {
    id: 'geometric-mean-calculator',
    name: 'Geometric Mean Calculator',
    slug: 'geometric-mean-calculator',
    category: 'math-number-extras',
    categoryName: 'Math & Number Extras',
    shortDesc: 'Calculate geometric mean averages for growth rates, financial yields, and proportional values.',
    metaTitle: 'Geometric Mean Calculator Online - nth Root Product',
    metaDescription: 'Calculate geometric mean values for financial returns and proportional growth rates.',
    primaryKeyword: 'geometric mean calculator online',
    secondaryKeywords: ['calculate geometric mean online', 'nth root product calculator', 'financial return geometric average'],
    lsiKeywords: ['geometric mean formula', 'nth root of product', 'compounded return average'],
    inputType: 'text',
    hasFileSupport: false,
    icon: 'Sigma',
    related: ['harmonic-mean-calculator', 'compound-annual-growth-rate-cagr-calculator'],
    popular: true
  },
  {
    id: 'compound-annual-growth-rate-cagr-calculator',
    name: 'Compound Annual Growth Rate (CAGR) Calculator',
    slug: 'compound-annual-growth-rate-cagr-calculator',
    category: 'math-number-extras',
    categoryName: 'Math & Number Extras',
    shortDesc: 'Calculate annualized CAGR investment growth percentages across multi-year periods.',
    metaTitle: 'Compound Annual Growth Rate (CAGR) Calculator Online',
    metaDescription: 'Calculate Compound Annual Growth Rate (CAGR %) and total growth percentages for investments.',
    primaryKeyword: 'cagr calculator online',
    secondaryKeywords: ['compound annual growth rate calculator', 'calculate cagr percent online', 'annualized investment yield solver'],
    lsiKeywords: ['cagr percentage formula', 'initial value final value', 'annualized growth yield'],
    inputType: 'text',
    hasFileSupport: false,
    icon: 'Sigma',
    related: ['rule-of-72-doubling-time-calculator', 'geometric-mean-calculator'],
    popular: true
  },
  {
    id: 'rule-of-72-doubling-time-calculator',
    name: 'Rule of 72 Doubling Time Calculator',
    slug: 'rule-of-72-doubling-time-calculator',
    category: 'math-number-extras',
    categoryName: 'Math & Number Extras',
    shortDesc: 'Estimate investment doubling years using the Rule of 72 shortcut vs exact logarithmic compound interest.',
    metaTitle: 'Rule of 72 Doubling Time Calculator Online',
    metaDescription: 'Estimate investment doubling years using the Rule of 72 shortcut and exact logarithmic compound interest.',
    primaryKeyword: 'rule of 72 calculator online',
    secondaryKeywords: ['calculate doubling time rule of 72', 'compound interest doubling years solver', 'rule of 72 vs exact log doubling'],
    lsiKeywords: ['rule of 72 shortcut', 'doubling years compound interest', 'logarithmic doubling time'],
    inputType: 'number',
    hasFileSupport: false,
    icon: 'Sigma',
    related: ['compound-annual-growth-rate-cagr-calculator', 'quadratic-formula-step-visualizer'],
    popular: true
  },
  {
    id: 'quadratic-formula-step-visualizer',
    name: 'Quadratic Formula (ax² + bx + c = 0) Step Solver',
    slug: 'quadratic-formula-step-visualizer',
    category: 'math-number-extras',
    categoryName: 'Math & Number Extras',
    shortDesc: 'Solve quadratic equations ax² + bx + c = 0 with discriminant (b² - 4ac) steps and complex root support.',
    metaTitle: 'Quadratic Formula Solver Online - Discriminant Steps',
    metaDescription: 'Solve quadratic equations ax² + bx + c = 0 step-by-step with real and complex roots.',
    primaryKeyword: 'quadratic formula solver online',
    secondaryKeywords: ['discriminant b2 4ac calculator', 'quadratic equation root solver', 'solve ax2 bx c 0 step by step'],
    lsiKeywords: ['quadratic equation formula', 'discriminant b squared 4ac', 'real complex conjugate roots'],
    inputType: 'text',
    hasFileSupport: false,
    icon: 'Sigma',
    related: ['two-by-two-matrix-inverse-calculator', 'harmonic-mean-calculator'],
    popular: true
  },
  {
    id: 'two-by-two-matrix-inverse-calculator',
    name: '2×2 Matrix Inverse & Determinant Calculator',
    slug: 'two-by-two-matrix-inverse-calculator',
    category: 'math-number-extras',
    categoryName: 'Math & Number Extras',
    shortDesc: 'Calculate 2×2 matrix determinants (ad - bc) and inverted matrix entries.',
    metaTitle: '2×2 Matrix Inverse & Determinant Calculator Online',
    metaDescription: 'Calculate determinants (ad - bc) and inverted 2x2 matrix values online.',
    primaryKeyword: '2x2 matrix inverse calculator online',
    secondaryKeywords: ['calculate matrix determinant ad bc', 'invert 2x2 matrix solver', 'linear algebra 2x2 matrix inverse'],
    lsiKeywords: ['matrix determinant ad bc', 'inverted 2x2 matrix', 'linear algebra matrix inversion'],
    inputType: 'text',
    hasFileSupport: false,
    icon: 'Sigma',
    related: ['quadratic-formula-step-visualizer', 'harmonic-mean-calculator'],
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
