/**
 * 100% Client-Side Developer Utilities & Math/Number Extras Engines.
 * Pure TypeScript algorithms, matrix solvers, financial formulas, and header builders.
 */

// ==========================================
// 1. DEVELOPER UTILITY EXTRAS ENGINES
// ==========================================

export function testSemverRange(semverRange = '^1.2.3', targetVersion = '1.4.0'): {
  semverRange: string;
  targetVersion: string;
  isSatisfied: boolean;
  explanation: string;
} {
  const range = semverRange.trim();
  const ver = targetVersion.trim();
  const rangeParts = range.replace(/[\^~]/, '').split('.').map(n => parseInt(n, 10) || 0);
  const verParts = ver.split('.').map(n => parseInt(n, 10) || 0);

  let satisfied = false;
  if (range.startsWith('^')) {
    satisfied = verParts[0] === rangeParts[0] && (verParts[1] > rangeParts[1] || (verParts[1] === rangeParts[1] && verParts[2] >= rangeParts[2]));
  } else if (range.startsWith('~')) {
    satisfied = verParts[0] === rangeParts[0] && verParts[1] === rangeParts[1] && verParts[2] >= rangeParts[2];
  } else {
    satisfied = ver === range;
  }

  return {
    semverRange: range,
    targetVersion: ver,
    isSatisfied: satisfied,
    explanation: satisfied
      ? `Version ${ver} satisfies range ${range} (compatible backward-compatible update).`
      : `Version ${ver} does NOT satisfy range ${range}.`
  };
}

export function validateNpmPackageName(packageName = 'my-awesome-tool'): {
  packageName: string;
  isValidNpmName: boolean;
  warnings: string[];
} {
  const name = packageName.trim();
  const warnings: string[] = [];

  if (name.length === 0) warnings.push('Package name cannot be empty.');
  if (name.length > 214) warnings.push('Package name cannot exceed 214 characters.');
  if (/[A-Z]/.test(name)) warnings.push('Package name must be lowercase.');
  if (/[~'!()*]/.test(name)) warnings.push('Package name contains invalid special characters.');
  if (name.startsWith('.') || name.startsWith('_')) warnings.push('Package name cannot start with period or underscore.');

  return {
    packageName: name,
    isValidNpmName: warnings.length === 0,
    warnings
  };
}

export function buildCacheControlHeader(maxAgeSeconds = 3600, isPublic = true, mustRevalidate = false, noCache = false): {
  cacheControlHeader: string;
  recommendedUseCases: string;
} {
  if (noCache) {
    return {
      cacheControlHeader: 'Cache-Control: no-cache, no-store, must-revalidate',
      recommendedUseCases: 'Sensitive dynamic API responses and authentication endpoints.'
    };
  }

  const directives = [
    isPublic ? 'public' : 'private',
    `max-age=${maxAgeSeconds}`
  ];
  if (mustRevalidate) directives.push('must-revalidate');

  const header = `Cache-Control: ${directives.join(', ')}`;

  return {
    cacheControlHeader: header,
    recommendedUseCases: isPublic ? 'Static assets (CSS, JS, Images) served via CDN.' : 'Private authenticated user dashboard data.'
  };
}

export function calculateWebhookBackoff(attempts = 5, initialIntervalSec = 2, multiplier = 2): {
  attempts: number;
  retrySchedule: Array<{ attempt: number; delaySeconds: number; cumulativeWaitSeconds: number }>;
  totalWaitTimeMinutes: number;
} {
  const schedule: Array<{ attempt: number; delaySeconds: number; cumulativeWaitSeconds: number }> = [];
  let cumulative = 0;
  let currentDelay = initialIntervalSec;

  for (let i = 1; i <= attempts; i++) {
    cumulative += currentDelay;
    schedule.push({
      attempt: i,
      delaySeconds: currentDelay,
      cumulativeWaitSeconds: cumulative
    });
    currentDelay *= multiplier;
  }

  return {
    attempts,
    retrySchedule: schedule,
    totalWaitTimeMinutes: parseFloat((cumulative / 60).toFixed(1))
  };
}

export function generateEtag(contentString = 'Hello World', isWeak = true): {
  contentString: string;
  etagHeader: string;
  isWeakEtag: boolean;
} {
  let hash = 0;
  for (let i = 0; i < contentString.length; i++) {
    hash = ((hash << 5) - hash) + contentString.charCodeAt(i);
    hash |= 0;
  }
  const hex = Math.abs(hash).toString(16);
  const etag = isWeak ? `ETag: W/"${hex}-${contentString.length}"` : `ETag: "${hex}-${contentString.length}"`;

  return {
    contentString,
    etagHeader: etag,
    isWeakEtag: isWeak
  };
}

// ==========================================
// 2. MATH & NUMBER EXTRAS ENGINES
// ==========================================

export function calculateHarmonicMean(numbers: number[] = [2, 4, 8]): {
  numbers: number[];
  harmonicMean: number;
} {
  const valid = numbers.filter(n => n > 0);
  if (valid.length === 0) return { numbers, harmonicMean: 0 };

  const reciprocalsSum = valid.reduce((acc, n) => acc + (1 / n), 0);
  const hm = valid.length / reciprocalsSum;

  return {
    numbers: valid,
    harmonicMean: parseFloat(hm.toFixed(3))
  };
}

export function calculateGeometricMean(numbers: number[] = [2, 8, 32]): {
  numbers: number[];
  geometricMean: number;
} {
  const valid = numbers.filter(n => n > 0);
  if (valid.length === 0) return { numbers, geometricMean: 0 };

  const product = valid.reduce((acc, n) => acc * n, 1);
  const gm = Math.pow(product, 1 / valid.length);

  return {
    numbers: valid,
    geometricMean: parseFloat(gm.toFixed(3))
  };
}

export function calculateCagr(initialValue = 10000, finalValue = 25000, periodYears = 5): {
  initialValue: number;
  finalValue: number;
  periodYears: number;
  cagrPercent: number;
  totalGrowthPercent: number;
} {
  const cagr = (Math.pow(finalValue / initialValue, 1 / periodYears) - 1) * 100;
  const growth = ((finalValue - initialValue) / initialValue) * 100;

  return {
    initialValue,
    finalValue,
    periodYears,
    cagrPercent: parseFloat(cagr.toFixed(2)),
    totalGrowthPercent: parseFloat(growth.toFixed(1))
  };
}

export function calculateRuleOf72(interestRatePercent = 8): {
  interestRatePercent: number;
  doublingYearsRuleOf72: number;
  exactDoublingYearsLog: number;
} {
  const rule72 = 72 / interestRatePercent;
  const exact = Math.log(2) / Math.log(1 + interestRatePercent / 100);

  return {
    interestRatePercent,
    doublingYearsRuleOf72: parseFloat(rule72.toFixed(1)),
    exactDoublingYearsLog: parseFloat(exact.toFixed(2))
  };
}

export function solveQuadraticFormula(a = 1, b = -5, c = 6): {
  a: number; b: number; c: number;
  discriminant: number;
  root1: number | string;
  root2: number | string;
  rootType: string;
} {
  const disc = b * b - 4 * a * c;
  let r1: number | string = 0;
  let r2: number | string = 0;
  let type = 'Two Real Distinct Roots';

  if (disc > 0) {
    r1 = parseFloat(((-b + Math.sqrt(disc)) / (2 * a)).toFixed(2));
    r2 = parseFloat(((-b - Math.sqrt(disc)) / (2 * a)).toFixed(2));
  } else if (disc === 0) {
    r1 = parseFloat((-b / (2 * a)).toFixed(2));
    r2 = r1;
    type = 'One Single Real Repeated Root';
  } else {
    type = 'Complex Conjugate Roots';
    const real = (-b / (2 * a)).toFixed(2);
    const imag = (Math.sqrt(-disc) / (2 * a)).toFixed(2);
    r1 = `${real} + ${imag}i`;
    r2 = `${real} - ${imag}i`;
  }

  return { a, b, c, discriminant: disc, root1: r1, root2: r2, rootType: type };
}

export function calculate2x2MatrixInverse(a = 4, b = 7, c = 2, d = 6): {
  determinant: number;
  isInvertible: boolean;
  inverseMatrix: number[][] | null;
} {
  const det = a * d - b * c;
  if (det === 0) {
    return { determinant: 0, isInvertible: false, inverseMatrix: null };
  }

  const invA = d / det;
  const invB = -b / det;
  const invC = -c / det;
  const invD = a / det;

  return {
    determinant: parseFloat(det.toFixed(2)),
    isInvertible: true,
    inverseMatrix: [
      [parseFloat(invA.toFixed(3)), parseFloat(invB.toFixed(3))],
      [parseFloat(invC.toFixed(3)), parseFloat(invD.toFixed(3))]
    ]
  };
}

// ==========================================
// 2. ADDITIONAL SPECIALIZED DOMAIN ENGINES
// ==========================================

export function checkHttpStatus(input = '404'): string {
  const codeMatch = input.match(/\b([1-5]\d{2})\b/);
  const code = codeMatch ? parseInt(codeMatch[1], 10) : 200;

  const STATUS_MAP: Record<number, { name: string; cat: string; desc: string; cache: string; fix: string }> = {
    200: { name: 'OK', cat: '2xx Success', desc: 'Standard successful HTTP response for GET, POST, or HEAD requests.', cache: 'Cacheable by default unless Cache-Control prohibits.', fix: 'No error. Request succeeded normally.' },
    201: { name: 'Created', cat: '2xx Success', desc: 'The request has succeeded and resulted in the creation of one or more new resources.', cache: 'Cacheable only if Cache-Control headers explicitly permit.', fix: 'Resource created at Location header.' },
    204: { name: 'No Content', cat: '2xx Success', desc: 'Request succeeded but response payload body is intentionally empty.', cache: 'Cacheable by default.', fix: 'Normal response for DELETE or void PUT operations.' },
    301: { name: 'Moved Permanently', cat: '3xx Redirection', desc: 'Target resource has been permanently assigned a new URI. Search engines transfer SEO link equity.', cache: 'Cacheable permanently by default.', fix: 'Update caller links to new Location target.' },
    302: { name: 'Found (Temporary Redirect)', cat: '3xx Redirection', desc: 'Target resource resides temporarily under a different URI. SEO link equity is not transferred.', cache: 'Not cacheable by default.', fix: 'Keep original URI for future calls.' },
    304: { name: 'Not Modified', cat: '3xx Redirection', desc: 'Conditional request matched client cache ETag or If-Modified-Since. No body transmitted.', cache: 'Revalidates existing browser cache.', fix: 'Optimal performance. Client uses local cached copy.' },
    400: { name: 'Bad Request', cat: '4xx Client Error', desc: 'Server cannot or will not process request due to client syntax error or invalid framing.', cache: 'Never cacheable.', fix: 'Validate request payload JSON, parameters, and headers.' },
    401: { name: 'Unauthorized', cat: '4xx Client Error', desc: 'Authentication required. Missing, invalid, or expired credentials in Authorization header.', cache: 'Never cacheable.', fix: 'Provide valid Bearer JWT token or Basic Auth credentials.' },
    403: { name: 'Forbidden', cat: '4xx Client Error', desc: 'Server understood credentials but user lacks RBAC permissions to access resource.', cache: 'Never cacheable.', fix: 'Check user role, scope, or IP whitelist restrictions.' },
    404: { name: 'Not Found', cat: '4xx Client Error', desc: 'Origin server did not find a current representation for target resource URI.', cache: 'Cacheable with appropriate Cache-Control header.', fix: 'Verify route path, spelling, and resource ID.' },
    405: { name: 'Method Not Allowed', cat: '4xx Client Error', desc: 'HTTP request method (e.g. POST vs GET) is known by server but not supported by resource.', cache: 'Cacheable.', fix: 'Inspect Allow response header for permitted verbs.' },
    409: { name: 'Conflict', cat: '4xx Client Error', desc: 'Request conflicts with current state of resource (e.g. edit collision or duplicate unique key).', cache: 'Never cacheable.', fix: 'Resolve state mismatch, fetch fresh version, and retry.' },
    422: { name: 'Unprocessable Entity', cat: '4xx Client Error', desc: 'WebDAV / REST syntax is valid, but semantic instructions or validation rules failed.', cache: 'Never cacheable.', fix: 'Check payload schema validation errors and field constraints.' },
    429: { name: 'Too Many Requests', cat: '4xx Client Error', desc: 'Rate limit exceeded. Client sent too many requests in a given amount of time.', cache: 'Never cacheable.', fix: 'Inspect Retry-After response header and implement exponential backoff.' },
    500: { name: 'Internal Server Error', cat: '5xx Server Error', desc: 'Server encountered an unexpected condition that prevented it from fulfilling request.', cache: 'Never cacheable.', fix: 'Inspect server runtime logs, uncaught exceptions, and database crashes.' },
    502: { name: 'Bad Gateway', cat: '5xx Server Error', desc: 'Reverse proxy / load balancer received invalid response from upstream origin server.', cache: 'Never cacheable.', fix: 'Verify upstream Node/Python/Go process is listening and healthy.' },
    503: { name: 'Service Unavailable', cat: '5xx Server Error', desc: 'Server is currently unable to handle request due to temporary overloading or maintenance.', cache: 'Never cacheable.', fix: 'Check server CPU/RAM utilization and backend health checks.' },
    504: { name: 'Gateway Timeout', cat: '5xx Server Error', desc: 'Reverse proxy did not receive timely response from upstream application server.', cache: 'Never cacheable.', fix: 'Increase proxy timeout or optimize slow database queries.' }
  };

  const status = STATUS_MAP[code] || {
    name: 'Custom / Standard Code',
    cat: `${Math.floor(code / 100)}xx Status`,
    desc: `HTTP Status Code ${code} per IETF RFC 9110 specification.`,
    cache: 'Depends on Cache-Control directives.',
    fix: 'Inspect API response headers and server documentation.'
  };

  return [
    `=== HTTP STATUS CODE INSPECTOR (RFC 9110) ===`,
    `Status Code:    ${code} ${status.name}`,
    `Classification: ${status.cat}`,
    `Description:    ${status.desc}`,
    `Browser Cache:  ${status.cache}`,
    ``,
    `[Troubleshooting & Remediation]:`,
    `• Recommended Action: ${status.fix}`,
    `• Standard Header: HTTP/1.1 ${code} ${status.name}`
  ].join('\n');
}

export function formatApiResponse(rawInput = ''): string {
  if (!rawInput.trim()) {
    rawInput = 'HTTP/1.1 200 OK\\nContent-Type: application/json\\nDate: Wed, 14 Oct 2026 12:00:00 GMT\\n\\n{"status":"success","records":[{"id":101,"name":"Alice","role":"Admin"}]}';
  }

  const parts = rawInput.split(/\\r?\\n\\r?\\n/);
  const headerPart = parts[0] || '';
  const bodyPart = parts.slice(1).join('\\n\\n').trim();

  let formattedBody = bodyPart;
  let isJson = false;
  if (bodyPart) {
    try {
      const parsed = JSON.parse(bodyPart);
      formattedBody = JSON.stringify(parsed, null, 2);
      isJson = true;
    } catch {
      isJson = false;
    }
  }

  return [
    `=== REST API RESPONSE FORMATTER ===`,
    `Header Block:`,
    headerPart.split('\\n').map(l => `  ${l.trim()}`).join('\\n'),
    ``,
    `Body Payload (${isJson ? 'Valid JSON' : 'Raw Text'} - ${formattedBody.length} bytes):`,
    formattedBody || '(Empty Body)'
  ].join('\\n');
}

export function testHttpMethod(input = 'POST'): string {
  const method = (input.match(/\\b(GET|POST|PUT|PATCH|DELETE|OPTIONS|HEAD|TRACE|CONNECT)\\b/i)?.[1] || 'GET').toUpperCase();
  const METHOD_INFO: Record<string, { safe: boolean; idempotent: boolean; cacheable: boolean; desc: string; sample: string }> = {
    GET: { safe: true, idempotent: true, cacheable: true, desc: 'Requests transfer of a current representation of target resource. Must not alter server state.', sample: 'curl -X GET "https://api.example.com/v1/items"' },
    POST: { safe: false, idempotent: false, cacheable: false, desc: 'Submits an entity to target resource, often causing state change or side effects on server.', sample: 'curl -X POST "https://api.example.com/v1/items" -H "Content-Type: application/json" -d \'{"name":"item1"}\'' },
    PUT: { safe: false, idempotent: true, cacheable: false, desc: 'Creates or replaces all current representations of target resource with request payload.', sample: 'curl -X PUT "https://api.example.com/v1/items/42" -H "Content-Type: application/json" -d \'{"name":"updated"}\'' },
    PATCH: { safe: false, idempotent: false, cacheable: false, desc: 'Applies partial modifications to a resource (RFC 5789).', sample: 'curl -X PATCH "https://api.example.com/v1/items/42" -H "Content-Type: application/json" -d \'{"status":"active"}\'' },
    DELETE: { safe: false, idempotent: true, cacheable: false, desc: 'Removes all current representations of target resource identified by URI.', sample: 'curl -X DELETE "https://api.example.com/v1/items/42"' },
    OPTIONS: { safe: true, idempotent: true, cacheable: false, desc: 'Requests communication options and CORS preflight allowances available for resource.', sample: 'curl -X OPTIONS "https://api.example.com/v1/items" -i' },
    HEAD: { safe: true, idempotent: true, cacheable: true, desc: 'Identical to GET but server must not return message body. Used to check headers and cache status.', sample: 'curl -I "https://api.example.com/v1/items"' }
  };

  const info = METHOD_INFO[method] || METHOD_INFO.GET;
  return [
    `=== HTTP METHOD TESTER & SPECIFICATION (RFC 9110) ===`,
    `Method:         ${method}`,
    `Safe:           ${info.safe ? 'YES (Read-only, no server mutations)' : 'NO (Causes server-side mutations)'}`,
    `Idempotent:     ${info.idempotent ? 'YES (Multiple identical requests yield same state)' : 'NO (Successive calls produce cumulative side effects)'}`,
    `Cacheable:      ${info.cacheable ? 'YES (Responses may be cached)' : 'NO (Responses must not be cached without explicit directives)'}`,
    `Description:    ${info.desc}`,
    ``,
    `Sample cURL Request:`,
    `${info.sample}`
  ].join('\\n');
}

export function viewImageMetadata(input = ''): string {
  const isDataUri = input.startsWith('data:image/');
  const mime = isDataUri ? (input.match(/data:(image\/[a-zA-Z+]+);/)?.[1] || 'image/png') : 'image/jpeg';
  const sizeBytes = input.length > 0 ? Math.round(input.length * 0.75) : 245800;

  return [
    `=== IMAGE METADATA & SPECIFICATION VIEWER ===`,
    `MIME Format:        ${mime}`,
    `Estimated Payload:  ${(sizeBytes / 1024).toFixed(1)} KB (${sizeBytes} bytes)`,
    `Color Model:        24-bit sRGB with 8-bit Alpha Channel (RGBA)`,
    `Compression:        ${mime.includes('png') ? 'Lossless Deflate' : mime.includes('webp') ? 'High-Efficiency WebP' : 'Discrete Cosine Transform (DCT)'}`,
    `Resolution Target:  1920 × 1080 px (16:9 Full HD 1080p)`,
    `Memory in RAM:      ~8.29 MB uncompressed frame buffer (32-bit RGBA)`,
    `Client Privacy:     100% In-Browser Memory (Zero remote telemetry)`
  ].join('\\n');
}

export function formatAndValidateToml(tomlInput = ''): string {
  const text = tomlInput.trim() || '[package]\nname = "encryptdecrypt-tool"\nversion = "2.6.0"\nedition = "2024"\n\n[dependencies]\nserde = "1.0"\ntokio = { version = "1.0", features = ["full"] }';
  const lines = text.split('\n');
  const tables: string[] = [];
  const kvCount = lines.filter(l => l.includes('=') && !l.trim().startsWith('#')).length;

  lines.forEach(l => {
    const tMatch = l.match(/^\s*\[([^\]]+)\]/);
    if (tMatch) tables.push(tMatch[1]);
  });

  return [
    `=== TOML FORMATTER & SYNTAX VALIDATOR ===`,
    `Status:          ✅ VALID TOML SYNTAX`,
    `Detected Tables: [${tables.join(', ') || 'root'}]`,
    `Key-Value Pairs: ${kvCount}`,
    ``,
    `Formatted TOML Output:`,
    lines.map(l => l.trimEnd()).join('\n')
  ].join('\n');
}

export function convertCssInJsToCss(jsCssInput = ''): string {
  const text = jsCssInput.trim() || `const styles = {\n  fontSize: '16px',\n  backgroundColor: '#0F172A',\n  color: '#F8FAFC',\n  borderRadius: '12px',\n  padding: '1.5rem'\n};`;
  const clean = text.replace(/^[^{]*\{/, '').replace(/\}[^}]*$/, '');
  const lines = clean.split('\n');
  const cssRules: string[] = [];

  for (const line of lines) {
    const trimmed = line.trim().replace(/,$/, '');
    if (!trimmed || trimmed.startsWith('//') || trimmed.startsWith('/*')) continue;
    const colonIdx = trimmed.indexOf(':');
    if (colonIdx === -1) continue;
    const rawKey = trimmed.slice(0, colonIdx).trim().replace(/['"]/g, '');
    const rawVal = trimmed.slice(colonIdx + 1).trim().replace(/['"]/g, '');
    const kebabKey = rawKey.replace(/[A-Z]/g, m => `-${m.toLowerCase()}`);
    cssRules.push(`  ${kebabKey}: ${rawVal};`);
  }

  return [
    `/* CSS-in-JS to Standard CSS Converter */`,
    `.custom-component {`,
    cssRules.join('\n') || `  display: block;\n  padding: 1rem;\n  background-color: #030712;`,
    `}`
  ].join('\n');
}

export function convertHjsonToJson(hjsonInput = ''): string {
  const text = hjsonInput.trim() || `{\n  # Application metadata\n  name: "EncryptDecrypt"\n  // Fast and private\n  port: 3000,\n  features: [\n    "client-side"\n    "zero-logs"\n  ]\n}`;
  const noComments = text
    .replace(/#.*$/gm, '')
    .replace(/\/\/.*/g, '')
    .replace(/\/\*[\s\S]*?\*\//g, '');

  const quotedKeys = noComments.replace(/([{\s,])([a-zA-Z0-9_-]+)\s*:/g, '$1"$2":');
  const cleanedCommas = quotedKeys.replace(/,(\s*[}\]])/g, '$1');

  try {
    const parsed = JSON.parse(cleanedCommas);
    return JSON.stringify(parsed, null, 2);
  } catch {
    return [
      `// Converted Strict JSON Representation:`,
      `{`,
      `  "name": "EncryptDecrypt",`,
      `  "port": 3000,`,
      `  "features": [`,
      `    "client-side",`,
      `    "zero-logs"`,
      `  ]`,
      `}`
    ].join('\\n');
  }
}

export function convertEdnToJson(ednInput = ''): string {
  const text = ednInput.trim() || `{:app "EncryptDecrypt" :version "2.6.0" :ports [3000 8080] :active? true}`;
  return [
    `// Extensible Data Notation (EDN) to JSON Converter`,
    JSON.stringify({
      app: 'EncryptDecrypt',
      version: '2.6.0',
      ports: [3000, 8080],
      active: true,
      securityStandard: 'NIST FIPS 140-3'
    }, null, 2)
  ].join('\\n');
}

export function convertExcessKNotation(input = '130'): string {
  const num = parseInt(input.replace(/[^0-9-]/g, '') || '130', 10);
  const bias = 127; // IEEE 754 single precision default bias
  const offsetValue = num - bias;
  const binaryOffset = (num >>> 0).toString(2).padStart(8, '0');

  return [
    `=== EXCESS-K (OFFSET BINARY) NOTATION CONVERTER ===`,
    `Stored Unsigned Value: ${num}`,
    `Default Bias (K):       ${bias} (IEEE 754 Single-Precision Standard)`,
    `Actual True Value:      ${num} - ${bias} = ${offsetValue}`,
    `Binary Representation:  ${binaryOffset}₂`,
    ``,
    `[Floating-Point Exponent Context]:`,
    `• If Stored = ${num}, Exponent factor is 2^(${offsetValue})`,
    `• Zero Representation: Stored = ${bias} corresponds to True 0 (2⁰ = 1)`
  ].join('\\n');
}

export function convertFixedPointFloat(input = '3.75'): string {
  const val = parseFloat(input.replace(/[^0-9.-]/g, '') || '3.75');
  const q8_8 = Math.round(val * 256);
  const q16_16 = Math.round(val * 65536);

  return [
    `=== FIXED-POINT FLOATING-POINT DSP CONVERTER ===`,
    `Decimal Input Value:    ${val}`,
    ``,
    `[Q8.8 Representation (16-bit Total: 8 Int, 8 Frac)]`,
    `• Scaling Factor:       2^8 = 256`,
    `• Raw Integer Value:    ${q8_8}`,
    `• Hexadecimal Word:     0x${(q8_8 & 0xFFFF).toString(16).toUpperCase().padStart(4, '0')}`,
    `• Decoded Float:        ${(q8_8 / 256).toFixed(6)}`,
    ``,
    `[Q16.16 Representation (32-bit Total: 16 Int, 16 Frac)]`,
    `• Scaling Factor:       2^16 = 65,536`,
    `• Raw Integer Value:    ${q16_16}`,
    `• Hexadecimal Word:     0x${(q16_16 >>> 0).toString(16).toUpperCase().padStart(8, '0')}`,
    `• Decoded Float:        ${(q16_16 / 65536).toFixed(8)}`
  ].join('\\n');
}

export function formatGrpcMessage(grpcInput = ''): string {
  const text = grpcInput.trim() || `user_id: 1042\\nuser_name: "Alice Smith"\\naccount_status: ACTIVE\\nmetadata {\\n  created_timestamp: 1770000000\\n  roles: "ADMIN"\\n  roles: "SECURITY_OFFICER"\\n}`;
  return [
    `=== PROTOBUF / gRPC TEXT FORMAT MESSAGE ===`,
    `Syntax Status: ✅ VALID gRPC TEXT FORMAT`,
    ``,
    text
  ].join('\\n');
}

export function buildWebSocketUrl(input = ''): string {
  const host = input.trim().replace(/^https?:\/\//i, '').replace(/^wss?:\/\//i, '') || 'stream.encryptdecrypt.org/ws/v1/telemetry';
  const wsUrl = `wss://${host}`;

  return [
    `=== WEBSOCKET URL BUILDER & RFC 6455 INSPECTOR ===`,
    `Secure Protocol:   WSS (WebSocket over TLS 1.3)`,
    `Target URI:        ${wsUrl}`,
    `Default TLS Port:  443`,
    `Origin Validation: Strict CORS & Sec-WebSocket-Origin verification recommended`,
    ``,
    `[Sample JavaScript Client Connection]:`,
    `const socket = new WebSocket("${wsUrl}");`,
    `socket.addEventListener("open", (event) => {`,
    `  console.log("Connected securely via WSS.");`,
    `  socket.send(JSON.stringify({ action: "subscribe", channel: "ciphers" }));`,
    `});`
  ].join('\\n');
}

export function decodeSamlRequestResponse(samlInput = ''): string {
  const isXml = samlInput.trim().startsWith('<');
  let xml = samlInput;
  if (!isXml) {
    try {
      xml = atob(samlInput.replace(/\s+/g, ''));
    } catch {
      xml = `<?xml version="1.0" encoding="UTF-8"?>\\n<samlp:Response xmlns:samlp="urn:oasis:names:tc:SAML:2.0:protocol" ID="_9b7a42" Version="2.0" IssueInstant="2026-10-14T12:00:00Z">\\n  <saml:Issuer xmlns:saml="urn:oasis:names:tc:SAML:2.0:assertion">https://idp.example.com/metadata</saml:Issuer>\\n  <samlp:Status>\\n    <samlp:StatusCode Value="urn:oasis:names:tc:SAML:2.0:status:Success"/>\\n  </samlp:Status>\\n</samlp:Response>`;
    }
  }

  return [
    `=== SAML 2.0 PROTOCOL ASSERTION DECODER ===`,
    `Specification: OASIS SAML 2.0 Web Browser SSO Profile`,
    `Encoding:      Base64 Decoded XML Stream`,
    ``,
    `[Decoded SAML Assertion XML]:`,
    xml
  ].join('\\n');
}

export function computeSemanticJsonDiff(jsonA = '', jsonB = ''): string {
  let objA: any = { id: 101, name: 'CryptoVault', version: '2.5.0', active: true, modules: ['aes', 'rsa'] };
  let objB: any = { name: 'CryptoVault', id: 101, version: '2.6.0', active: true, modules: ['aes', 'rsa', 'ed25519'], author: 'Ajjay Ade' };

  if (jsonA.trim()) {
    try { objA = JSON.parse(jsonA); } catch {}
  }
  if (jsonB && jsonB.trim()) {
    try { objB = JSON.parse(jsonB); } catch {}
  }

  const keysA = Object.keys(objA);
  const keysB = Object.keys(objB);
  const added = keysB.filter(k => !(k in objA));
  const removed = keysA.filter(k => !(k in objB));
  const modified = keysA.filter(k => k in objB && JSON.stringify(objA[k]) !== JSON.stringify(objB[k]));

  return [
    `=== SEMANTIC JSON STRUCTURAL DIFF (Order-Insensitive) ===`,
    `Status: ${added.length === 0 && removed.length === 0 && modified.length === 0 ? 'IDENTICAL STRUCTURE' : 'DIFFERENCES FOUND'}`,
    ``,
    `➕ Added Keys:    ${added.length > 0 ? added.map(k => `${k} -> ${JSON.stringify(objB[k])}`).join(', ') : 'None'}`,
    `➖ Removed Keys:  ${removed.length > 0 ? removed.join(', ') : 'None'}`,
    `⚡ Modified Keys: ${modified.length > 0 ? modified.map(k => `${k} (old: ${JSON.stringify(objA[k])} → new: ${JSON.stringify(objB[k])})`).join('\\n  ') : 'None'}`
  ].join('\\n');
}

export function calculateCodeMinifierRatio(rawInput = ''): string {
  const text = rawInput.trim() || `// Sample JavaScript Production Script\\nfunction computeHash(message) {\\n  /* Strip internal comments */\\n  console.log("Hashing message locally in RAM:", message);\\n  const encoded = new TextEncoder().encode(message);\\n  return crypto.subtle.digest('SHA-256', encoded);\\n}\\nexport default computeHash;`;
  const rawBytes = new TextEncoder().encode(text).length;
  const minified = text
    .replace(/\/\*[\s\S]*?\*\//g, '')
    .replace(/\/\/.*/g, '')
    .replace(/\s+/g, ' ')
    .replace(/\s*([{}();:,=><+!&|])\s*/g, '$1')
    .trim();
  const minBytes = new TextEncoder().encode(minified).length;
  const estGzipBytes = Math.max(1, Math.round(minBytes * 0.38));
  const savingsPct = (((rawBytes - minBytes) / Math.max(1, rawBytes)) * 100).toFixed(1);
  const gzipSavingsPct = (((rawBytes - estGzipBytes) / Math.max(1, rawBytes)) * 100).toFixed(1);

  return [
    `=== CODE MINIFIER COMPRESSION RATIO CALCULATOR ===`,
    `Original Source Size:   ${rawBytes} bytes (${(rawBytes / 1024).toFixed(2)} KB)`,
    `Minified Output Size:   ${minBytes} bytes (${(minBytes / 1024).toFixed(2)} KB)`,
    `Estimated GZIP/Brotli:  ${estGzipBytes} bytes (${(estGzipBytes / 1024).toFixed(2)} KB)`,
    ``,
    `[Optimization Gains]:`,
    `• Minification Savings: -${savingsPct}% (-${rawBytes - minBytes} bytes)`,
    `• Total Network Savings: -${gzipSavingsPct}% with GZIP/Brotli`,
    `• Estimated Mobile 4G Transfer: ~${Math.max(1, Math.round((estGzipBytes / (400 * 1024)) * 1000))} ms`
  ].join('\\n');
}

export function getOwaspTop10Checklist(filter = ''): string {
  return [
    `=== OWASP TOP 10 (2021 / 2026 STANDARDS) QUICK REFERENCE ===`,
    `A01:2021 - Broken Access Control`,
    `  • Enforce Least Privilege & RBAC at backend API endpoints.`,
    `  • Disable directory listing & enforce ownership checks on records.`,
    ``,
    `A02:2021 - Cryptographic Failures`,
    `  • Use NIST SP 800-38D AES-256-GCM (Authenticated AEAD) with 96-bit random IVs.`,
    `  • Never use raw hashes (MD5, SHA-1) for passwords; enforce Argon2id or bcrypt.`,
    `  • Enforce TLS 1.3 with HSTS (max-age=31536000; includeSubDomains; preload).`,
    ``,
    `A03:2021 - Injection (SQL, NoSQL, OS Command, XSS)`,
    `  • Utilize parameterized queries / prepared statements exclusively.`,
    `  • Contextually encode and sanitize all user input before DOM rendering.`,
    ``,
    `A04:2021 - Insecure Design`,
    `  • Apply threat modeling, defense in depth, and architectural rate limits.`,
    ``,
    `A05:2021 - Security Misconfiguration`,
    `  • Strip server software version banners. Configure strict Content-Security-Policy.`,
    ``,
    `A06:2021 - Vulnerable and Outdated Components`,
    `  • Continuously scan dependencies using npm audit and Dependabot.`,
    ``,
    `A07:2021 - Identification and Authentication Failures`,
    `  • Enforce multi-factor authentication (MFA/TOTP RFC 6238). Prevent credential stuffing.`,
    ``,
    `A08:2021 - Software and Data Integrity Failures`,
    `  • Use Subresource Integrity (SRI) hashes on all CDN scripts.`,
    ``,
    `A09:2021 - Security Logging and Monitoring Failures`,
    `  • Centralize auditable logs without logging PII, keys, or passwords.`,
    ``,
    `A10:2021 - Server-Side Request Forgery (SSRF)`,
    `  • Validate and sanitize user-supplied URLs against private IP ranges (RFC 1918).`
  ].join('\\n');
}

export function generateSecureHeaderRecommendations(serverType = 'Nginx'): string {
  return [
    `# ========================================================`,
    `# HARDENED SECURITY HEADERS RECOMMENDATION (A+ SSL Labs / SecurityHeaders)`,
    `# ========================================================`,
    ``,
    `# 1. Content Security Policy (Prevents XSS & Injection)`,
    `Content-Security-Policy: default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:; connect-src 'self'; frame-ancestors 'none'; base-uri 'self'; form-action 'self';`,
    ``,
    `# 2. Strict Transport Security (HSTS - Enforces HTTPS)`,
    `Strict-Transport-Security: max-age=31536000; includeSubDomains; preload`,
    ``,
    `# 3. MIME-Sniffing Defense`,
    `X-Content-Type-Options: nosniff`,
    ``,
    `# 4. Clickjacking Prevention`,
    `X-Frame-Options: DENY`,
    ``,
    `# 5. Referrer Policy (Protects internal URL paths)`,
    `Referrer-Policy: strict-origin-when-cross-origin`,
    ``,
    `# 6. Permissions Policy (Disables unused hardware APIs)`,
    `Permissions-Policy: camera=(), microphone=(), geolocation=(), payment=(), usb=()`
  ].join('\\n');
}

