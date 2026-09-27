const fs = require('fs');
const path = require('path');

const toolsPath = path.join(__dirname, '../public/assets/data/tools.json');
const tools = JSON.parse(fs.readFileSync(toolsPath, 'utf8'));

const errorTools = [
  { name: 'Stack Trace Formatter', slug: 'stack-trace-formatter', shortDesc: 'Format, parse, and beautify dense multi-language error stack traces into clear hierarchy.' },
  { name: 'Stack Trace Extractor', slug: 'stack-trace-extractor', shortDesc: 'Extract isolated error stack traces and exception frames from cluttered server log files.' },
  { name: 'Error Message Analyzer', slug: 'error-message-analyzer', shortDesc: 'Analyze runtime exceptions and generate underlying causes and code fixes.' },
  { name: 'HTTP Error Troubleshooter', slug: 'http-error-troubleshooter', shortDesc: 'Diagnose 4xx and 5xx HTTP response codes with root causes and remediation guides.' },
  { name: 'SQL Error Explainer', slug: 'sql-error-explainer', shortDesc: 'Explain database syntax, constraint violation, and deadlock error codes with SQL fixes.' },
  { name: 'JSON Error Explainer', slug: 'json-error-explainer', shortDesc: 'Inspect and explain invalid JSON parse failures, trailing commas, and unquoted keys.' },
  { name: 'JavaScript Error Formatter', slug: 'javascript-error-formatter', shortDesc: 'Format uncaught JavaScript TypeErrors, ReferenceErrors, and stack frames.' },
  { name: 'TypeScript Error Formatter', slug: 'typescript-error-formatter', shortDesc: 'Breakdown complex TypeScript compiler error codes (TS2339, TS2322, TS2345).' },
  { name: 'Python Traceback Formatter', slug: 'python-traceback-formatter', shortDesc: 'Format Python tracebacks, KeyError, AttributeError, and exception lines.' },
  { name: 'Java Exception Formatter', slug: 'java-exception-formatter', shortDesc: 'Beautify Java JVM NullPointerExceptions, ClassCastExceptions, and Spring traces.' },
  { name: 'Kotlin Exception Formatter', slug: 'kotlin-exception-formatter', shortDesc: 'Diagnose Kotlin null-safety exceptions and Coroutine dispatch stack traces.' },
  { name: 'PHP Error Formatter', slug: 'php-error-formatter', shortDesc: 'Format PHP fatal errors, PDO exceptions, and call stack backtraces.' },
  { name: 'Node.js Error Inspector', slug: 'node-js-error-inspector', shortDesc: 'Inspect Node.js ERR_MODULE_NOT_FOUND, EADDRINUSE, and process crash reasons.' },
  { name: 'Browser Console Log Formatter', slug: 'browser-console-log-formatter', shortDesc: 'Format and color-code raw browser console log streams and network warnings.' },
  { name: 'Log Timestamp Normalizer', slug: 'log-timestamp-normalizer', shortDesc: 'Normalize mixed log timestamp formats into uniform ISO 8601 UTC dates.' },
  { name: 'Log Level Extractor', slug: 'log-level-extractor', shortDesc: 'Extract and count log severity distribution (ERROR, WARN, INFO, DEBUG).' },
  { name: 'Log Pattern Analyzer', slug: 'log-pattern-analyzer', shortDesc: 'Cluster recurring log patterns and compute percentage frequency distributions.' },
  { name: 'Error Code Reference Finder', slug: 'error-code-reference-finder', shortDesc: 'Lookup POSIX and operating system error codes (ENOENT, EACCES, EADDRINUSE).' },
  { name: 'API Error Response Builder', slug: 'api-error-response-builder', shortDesc: 'Generate RFC 7807 Problem Details JSON schemas for REST API error responses.' },
  { name: 'Exception Message Cleaner', slug: 'exception-message-cleaner', shortDesc: 'Sanitize exception messages for safe user-facing toast notifications.' },
  { name: 'Source Map Reference Inspector', slug: 'source-map-reference-inspector', shortDesc: 'Resolve minified bundle line and column numbers back to original source files.' },
  { name: 'Regex Error Explainer', slug: 'regex-error-explainer', shortDesc: 'Diagnose regular expression syntax errors and catastrophic backtracking traps.' },
  { name: 'SQL Query Error Locator', slug: 'sql-query-error-locator', shortDesc: 'Locate syntax errors, trailing commas, and unclosed quotes in SQL queries.' },
  { name: 'JSON Parse Error Locator', slug: 'json-parse-error-locator', shortDesc: 'Pinpoint the exact line, column, and token where JSON parsing failed.' },
  { name: 'Configuration Error Checklist Generator', slug: 'configuration-error-checklist-generator', shortDesc: 'Generate pre-flight deployment configuration and environment error checklists.' }
];

const devopsTools = [
  { name: 'Dockerfile Generator', slug: 'dockerfile-generator', shortDesc: 'Generate optimized multi-stage Dockerfile configurations for Node.js, Python, and Go.' },
  { name: 'Docker Compose Generator', slug: 'docker-compose-generator', shortDesc: 'Create multi-container docker-compose.yml files for web apps, databases, and Redis.' },
  { name: 'Nginx Configuration Generator', slug: 'nginx-configuration-generator', shortDesc: 'Generate hardened Nginx reverse proxy, SSL, gzip, and SPA routing configs.' },
  { name: 'Apache Virtual Host Generator', slug: 'apache-virtual-host-generator', shortDesc: 'Generate Apache VirtualHost configs with HTTPS, SSL certificates, and rewrite rules.' },
  { name: 'GitHub Actions YAML Generator', slug: 'github-actions-yaml-generator', shortDesc: 'Generate GitHub Actions CI/CD workflows for linting, testing, and deployment.' },
  { name: 'GitLab CI YAML Generator', slug: 'gitlab-ci-yaml-generator', shortDesc: 'Create GitLab CI .gitlab-ci.yml pipeline stages for test, build, and deploy.' },
  { name: 'Jenkins Pipeline Template Generator', slug: 'jenkins-pipeline-template-generator', shortDesc: 'Generate declarative Jenkinsfile pipeline scripts with automated stages.' },
  { name: 'Kubernetes YAML Template Generator', slug: 'kubernetes-yaml-template-generator', shortDesc: 'Generate Kubernetes Deployment and Service YAML manifests.' },
  { name: 'Docker Ignore Generator', slug: 'docker-ignore-generator', shortDesc: 'Generate .dockerignore files to exclude node_modules, logs, and secret keys.' },
  { name: 'EditorConfig Generator', slug: 'editorconfig-generator', shortDesc: 'Generate .editorconfig files for consistent indentation and charsets across IDEs.' },
  { name: 'Prettier Configuration Generator', slug: 'prettier-configuration-generator', shortDesc: 'Generate .prettierrc JSON configuration files for automated code formatting.' },
  { name: 'ESLint Configuration Generator', slug: 'eslint-configuration-generator', shortDesc: 'Generate flat eslint.config.js rules for TypeScript and modern JavaScript.' },
  { name: 'Environment Variable Template Generator', slug: 'environment-variable-template-generator', shortDesc: 'Generate structured environment variable templates with secret guidelines.' },
  { name: '.env File Formatter', slug: 'env-file-formatter', shortDesc: 'Format, align, and uppercase environment variable key-value assignments.' },
  { name: '.env Example Generator', slug: 'env-example-generator', shortDesc: 'Mask sensitive credentials from .env into a safe .env.example template.' },
  { name: 'OpenAPI Specification Generator', slug: 'openapi-specification-generator', shortDesc: 'Generate OpenAPI 3.0 REST API schema definitions in YAML format.' },
  { name: 'API Documentation Template Generator', slug: 'api-documentation-template-generator', shortDesc: 'Generate markdown API endpoint documentation with request/response examples.' },
  { name: 'Docker Port Mapping Calculator', slug: 'docker-port-mapping-calculator', shortDesc: 'Calculate host-to-container port mappings and generate CLI flags.' },
  { name: 'Cron Schedule Explainer', slug: 'cron-schedule-explainer', shortDesc: 'Translate standard 5-part cron expressions into plain human-readable sentences.' },
  { name: 'CI/CD Pipeline Checklist Generator', slug: 'cicd-pipeline-checklist-generator', shortDesc: 'Generate CI/CD readiness checklists covering tests, linters, and rollbacks.' },
  { name: 'Kubernetes Resource Request Calculator', slug: 'kubernetes-resource-request-calculator', shortDesc: 'Calculate CPU and memory requests and limits for container pod sizing.' },
  { name: 'YAML Configuration Diff Tool', slug: 'yaml-configuration-diff-tool', shortDesc: 'Compare YAML manifests across staging and production environments.' },
  { name: 'Configuration File Validator', slug: 'configuration-file-validator', shortDesc: 'Validate YAML and Docker configuration files for syntax and schema compliance.' },
  { name: 'Environment Variable Comparison Tool', slug: 'environment-variable-comparison-tool', shortDesc: 'Compare .env and .env.example files to identify missing configuration keys.' },
  { name: 'Deployment Checklist Generator', slug: 'deployment-checklist-generator', shortDesc: 'Generate zero-downtime production deployment checklists and runbooks.' }
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
    metaTitle: `${tool.name} - Free Online Tool`,
    metaDescription: `${tool.shortDesc} Fast, 100% client-side, zero server logging.`,
    primaryKeyword: tool.name.toLowerCase(),
    secondaryKeywords: [
      `${tool.name.toLowerCase()} online`,
      `free ${tool.name.toLowerCase()}`,
      `${categoryName.toLowerCase()} tool`
    ],
    lsiKeywords: ['developer tools', 'client-side', 'privacy focused', 'instant calculation'],
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

errorTools.forEach(t => upsert(t, 'developer-error-debugging-tools', 'Developer Error & Debugging Tools'));
devopsTools.forEach(t => upsert(t, 'configuration-devops-tools', 'Configuration & DevOps Tools'));

// Link related tools
tools.forEach(t => {
  if (t.category === 'developer-error-debugging-tools') {
    t.related = errorTools.filter(x => x.slug !== t.slug).slice(0, 4).map(x => x.slug);
  } else if (t.category === 'configuration-devops-tools') {
    t.related = devopsTools.filter(x => x.slug !== t.slug).slice(0, 4).map(x => x.slug);
  }
});

fs.writeFileSync(toolsPath, JSON.stringify(tools, null, 2), 'utf8');
console.log(`Successfully populated 50 tools across 2 categories. Total tools now: ${tools.length}`);
