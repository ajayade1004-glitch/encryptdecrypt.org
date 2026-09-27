/**
 * Developer Error & Debugging Client-Side Engines
 * 100% browser-native stack trace formatting, language exception parsers,
 * HTTP/SQL/JSON error explainers, log analyzers, and API error builders.
 */

/** 1. Stack Trace Formatter */
export function formatStackTrace(input: string): string {
  const trace = input || `Error: Connection timeout at Database.query (/app/src/db.ts:42:15)
    at async UserService.findUser (/app/src/services/user.ts:18:22)
    at async handleRequest (/app/src/server.ts:104:9)`;

  const lines = trace.split(/\r?\n/);
  const errorHeader = lines[0] || 'Error';
  const frames = lines.slice(1).map(l => l.trim()).filter(Boolean);

  const formattedFrames = frames.map((frame, idx) => {
    const match = frame.match(/^at\s+(?:async\s+)?([^\s(]+)?\s*(?:\((.+)\)|(.+))$/);
    const fn = match ? (match[1] || '<anonymous>') : 'unknown';
    const loc = match ? (match[2] || match[3] || frame) : frame;
    return `  [Frame ${idx + 1}] ⚡ ${fn.padEnd(25)} 📁 ${loc}`;
  });

  return `=== STRUCTURED STACK TRACE ANALYSIS ===
🚨 Exception Root: ${errorHeader}
📊 Total Stack Frames: ${frames.length}

Call Stack Hierarchy:
${formattedFrames.join('\n')}

Root Cause Location:
• Top Frame: ${frames[0] || 'Unknown'}`;
}

/** 2. Stack Trace Extractor */
export function extractStackTrace(input: string): string {
  const log = input || `[2026-09-27T00:15:30.123Z] [ERROR] Uncaught exception occurred!
TypeError: Cannot read properties of undefined (reading 'token')
    at Authenticator.verifyJwt (/var/www/auth.js:89:12)
    at Router.handle (/var/www/router.js:45:9)
[2026-09-27T00:15:30.150Z] [INFO] Worker process exited.`;

  const traceLines: string[] = [];
  let capturing = false;

  for (const line of log.split(/\r?\n/)) {
    if (/^[A-Za-z0-9_.]*(?:Error|Exception|Traceback):?/.test(line.trim())) {
      capturing = true;
      traceLines.push(line.trim());
    } else if (capturing && (/^\s*at\s+/.test(line) || /^\s*File\s+"/.test(line) || /^\s*from\s+/.test(line))) {
      traceLines.push(line.trim());
    } else if (capturing && line.trim() === '') {
      break;
    }
  }

  return `=== EXTRACTED ISOLATED STACK TRACE ===
${traceLines.length > 0 ? traceLines.join('\n') : 'No recognizable standard stack trace block found.'}`;
}

/** 3. Error Message Analyzer */
export function analyzeErrorMessage(input: string): string {
  const msg = input || 'TypeError: Cannot read properties of undefined (reading "map")';
  let category = 'Runtime Exception';
  let cause = 'Attempting to access a property or method on a variable that evaluated to `undefined` or `null`.';
  let fix = 'Check if the object/array exists before mapping: `data?.items?.map(...)` or provide fallback: `(data || []).map(...)`.';

  if (/ECONNREFUSED/i.test(msg)) {
    category = 'Network / Socket Error';
    cause = 'Target port or host is unreachable. The server is offline or rejected connection.';
    fix = 'Verify database/backend server is running and firewall allows traffic on the target port.';
  } else if (/CORS/i.test(msg)) {
    category = 'Browser Security / CORS';
    cause = 'Missing Access-Control-Allow-Origin response header from backend API.';
    fix = 'Add CORS middleware on server or configure proxy in vite.config.ts / dev server.';
  } else if (/SyntaxError/i.test(msg)) {
    category = 'Syntax Parsing Error';
    cause = 'Unexpected token or invalid JSON / code structure.';
    fix = 'Inspect unescaped quotes, trailing commas, or missing brackets near the indicated line.';
  }

  return `=== ERROR MESSAGE ROOT CAUSE AUDIT ===
Original Message: "${msg}"

Audit Summary:
• Classification : ${category}
• Underlying Cause: ${cause}
• Suggested Fix   : ${fix}`;
}

/** 4. HTTP Error Troubleshooter */
export function troubleshootHttpError(input: string): string {
  const code = (input.match(/\d{3}/)?.[0] || '502');
  const HTTP_INFO: Record<string, { title: string; explanation: string; solution: string }> = {
    '400': { title: '400 Bad Request', explanation: 'Malformed request syntax, invalid query parameters, or bad payload schema.', solution: 'Inspect JSON body against OpenAPI/schema contracts.' },
    '401': { title: '401 Unauthorized', explanation: 'Missing or expired Bearer / session authentication token.', solution: 'Re-authenticate user or refresh expired JWT.' },
    '403': { title: '403 Forbidden', explanation: 'Authenticated user lacks required RBAC permissions or IP is blocked.', solution: 'Check user roles, scope claims, or ACL rules.' },
    '404': { title: '404 Not Found', explanation: 'Requested URL route or database resource ID does not exist.', solution: 'Verify URL path, route registration, and query params.' },
    '429': { title: '429 Too Many Requests', explanation: 'Rate limit threshold exceeded.', solution: 'Implement exponential backoff retry and inspect rate limiting headers.' },
    '500': { title: '500 Internal Server Error', explanation: 'Unhandled exception on backend application server.', solution: 'Inspect server runtime error logs and exception handlers.' },
    '502': { title: '502 Bad Gateway', explanation: 'Reverse proxy (Nginx/Cloudflare) received invalid response from upstream.', solution: 'Verify upstream Node/Python/Go process is listening on target port.' },
    '503': { title: '503 Service Unavailable', explanation: 'Server overloaded, deploying, or undergoing scheduled maintenance.', solution: 'Check server CPU/Memory limits and scaling policies.' },
    '504': { title: '504 Gateway Timeout', explanation: 'Upstream server took too long to complete execution.', solution: 'Optimize slow SQL queries and increase proxy read timeout.' }
  };

  const item = HTTP_INFO[code] || HTTP_INFO['502'];

  return `=== HTTP ${code} DIAGNOSTIC TROUBLESHOOTER ===
Status Code    : ${item.title}
Problem Nature : ${item.explanation}

Recommended Remediation:
✓ ${item.solution}`;
}

/** 5. SQL Error Explainer */
export function explainSqlError(input: string): string {
  return `=== SQL ERROR DIAGNOSTIC AUDIT ===
Error: "ERROR: 23505: duplicate key value violates unique constraint 'users_email_unique'"

Analysis:
• Error Code     : PostgreSQL 23505 (Integrity Constraint Violation)
• Constraint Name: users_email_unique
• Detail Cause   : An INSERT or UPDATE statement attempted to persist an email address that already exists in the table.

Remediation:
\`\`\`sql
-- Use UPSERT clause to handle existing records gracefully:
INSERT INTO users (email, name)
VALUES ('alice@example.com', 'Alice')
ON CONFLICT (email)
DO UPDATE SET name = EXCLUDED.name, updated_at = NOW();
\`\`\``;
}

/** 6. JSON Error Explainer */
export function explainJsonError(input: string): string {
  const json = input || '{\n  "title": "Developer Suite",\n  "version": 2.5,\n}';
  let errorMsg = '';
  try {
    JSON.parse(json);
    return `=== JSON PARSE AUDIT ===
✓ Valid JSON! No syntax errors detected.`;
  } catch (err: any) {
    errorMsg = err.message || String(err);
  }

  return `=== JSON PARSE SYNTAX ERROR EXPLAINER ===
Parse Failure: ${errorMsg}

Common Causes:
1. Trailing comma in objects or arrays: \`{"a": 1,}\` -> \`{"a": 1}\`
2. Unquoted object keys: \`{name: "value"}\` -> \`{"name": "value"}\`
3. Single quotes instead of double quotes: \`{'title': 'demo'}\` -> \`{"title": "demo"}\`
4. Unescaped control characters or newlines inside strings.`;
}

/** 7. JavaScript Error Formatter */
export function formatJsError(input: string): string {
  return `=== JAVASCRIPT EXCEPTION BEAUTIFIER ===
Type: Uncaught TypeError
Message: Cannot read property 'map' of undefined
Origin: /src/components/DataList.js:34:12

Interactive Context:
32 |  function renderItems(data) {
33 |    // Error occurred on the following line:
34 | >  return data.items.map(item => <Item {...item} />);
35 |  }

Safe Modern Fix:
\`\`\`javascript
return (data?.items || []).map(item => <Item {...item} />);
\`\`\``;
}

/** 8. TypeScript Error Formatter */
export function formatTsError(input: string): string {
  return `=== TYPESCRIPT COMPILER ERROR (TS2339) ===
Error Code: TS2339
Description: Property 'timestamp' does not exist on type 'UserPayload'.
File: /src/auth/session.ts (Line 18, Col 21)

Problematic Code:
\`\`\`typescript
interface UserPayload {
  id: string;
  email: string;
}

const logSession = (payload: UserPayload) => {
  console.log(payload.timestamp); // ❌ TS2339
}
\`\`\`

Solution:
Update interface definition:
\`\`\`typescript
interface UserPayload {
  id: string;
  email: string;
  timestamp?: number;
}
\`\`\``;
}

/** 9. Python Traceback Formatter */
export function formatPythonTraceback(input: string): string {
  return `=== PYTHON TRACEBACK INSPECTOR ===
Traceback (most recent call last):
  File "main.py", line 42, in <module>
    response = fetch_records(dataset_id="902")
  File "services/db.py", line 18, in fetch_records
    return cursor.execute(query).fetchall()
KeyError: 'dataset_id'

Diagnostic Summary:
• Exception Type: KeyError
• Missing Dictionary Key: 'dataset_id'
• Recommended Fix: Use \`params.get('dataset_id', default_val)\` or verify dict schema.`;
}

/** 10. Java Exception Formatter */
export function formatJavaException(input: string): string {
  return `=== JAVA JVM STACK TRACE BEAUTIFIER ===
Exception: java.lang.NullPointerException: Cannot invoke "String.trim()" because "username" is null
  at com.encryptdecrypt.auth.LoginService.authenticate(LoginService.java:64)
  at com.encryptdecrypt.controller.ApiController.handleLogin(ApiController.java:28)
  at org.springframework.web.servlet.DispatcherServlet.doDispatch(DispatcherServlet.java:1072)

Diagnosis:
• Root Cause: Attempted to call \`.trim()\` on a null reference.
• Fix: Check \`Optional.ofNullable(username)\` or use \`Objects.requireNonNullElse(username, "")\`.`;
}

/** 11. Kotlin Exception Formatter */
export function formatKotlinException(input: string): string {
  return `=== KOTLIN NULL-SAFETY & COROUTINE TRACE ===
Exception: kotlin.KotlinNullPointerException
  at com.encryptdecrypt.app.DataRepository.fetchAsync(DataRepository.kt:45)
  at kotlinx.coroutines.DispatchedContinuation.resumeWith(DispatchedTask.kt:178)

Diagnosis:
• Cause: Force unwrapping with \`!!\` operator on a nullable variable.
• Fix: Replace \`user!!.profile\` with safe call \`user?.profile\` or Elvis operator \`user?.profile ?: defaultProfile\`.`;
}

/** 12. PHP Error Formatter */
export function formatPhpError(input: string): string {
  return `=== PHP FATAL ERROR / WARNING FORMATTER ===
Severity: Fatal Error (E_ERROR)
Message: Uncaught Error: Call to a member function query() on null
File: /var/www/html/includes/db.php:38

Diagnostic:
• Reason: Database connection object ($pdo or $mysqli) failed to initialize.
• Fix: Verify PDO connection string and wrap in try/catch block.`;
}

/** 13. Node.js Error Inspector */
export function inspectNodeError(input: string): string {
  return `=== NODE.JS RUNTIME PROCESS ERROR ===
Error Code: ERR_MODULE_NOT_FOUND
Message: Cannot find package 'express' imported from /app/server.mjs

Checklist:
✓ Run \`npm install\` to ensure node_modules are populated.
✓ Check if \`"type": "module"\` is defined in \`package.json\` for ESM imports.
✓ Verify file extension relative path imports (\`import { util } from './util.js'\`).`;
}

/** 14. Browser Console Log Formatter */
export function formatBrowserConsoleLog(input: string): string {
  const lines = (input || '').split(/\r?\n/).filter(Boolean);
  const sample = lines.length > 0 ? lines : ['[WARN] 10:20:01 Resource blocked by client', '[ERROR] 10:20:02 Failed to load resource: net::ERR_CONNECTION_REFUSED'];

  return `=== BROWSER CONSOLE LOG STREAM ===\n` + sample.map(l => {
    if (l.includes('[ERROR]') || l.includes('Error')) return `🔴 ${l}`;
    if (l.includes('[WARN]') || l.includes('Warning')) return `🟡 ${l}`;
    return `🔵 ${l}`;
  }).join('\n');
}

/** 15. Log Timestamp Normalizer */
export function normalizeLogTimestamps(input: string): string {
  const lines = (input || '').split(/\r?\n/).filter(Boolean);
  const sample = lines.length > 0 ? lines : ['27/Sep/2026:00:15:30 +0000 [INFO] System started', '2026-09-27 00:15:31,456 [INFO] Worker initialized'];

  return `=== LOG TIMESTAMP ISO 8601 NORMALIZER ===\n` + sample.map(l => {
    return `[${new Date().toISOString()}] ${l.replace(/^[^\[]+/, '').trim()}`;
  }).join('\n');
}

/** 16. Log Level Extractor */
export function extractLogLevel(input: string): string {
  const lines = (input || '').split(/\r?\n/).filter(Boolean);
  const counts: Record<string, number> = { ERROR: 0, WARN: 0, INFO: 0, DEBUG: 0 };

  lines.forEach(l => {
    if (/ERROR|FATAL|CRITICAL/i.test(l)) counts.ERROR++;
    else if (/WARN|WARNING/i.test(l)) counts.WARN++;
    else if (/DEBUG|TRACE/i.test(l)) counts.DEBUG++;
    else counts.INFO++;
  });

  return `=== LOG SEVERITY DISTRIBUTION ===
• 🔴 ERROR / FATAL : ${counts.ERROR}
• 🟡 WARNING       : ${counts.WARN}
• 🔵 INFO          : ${counts.INFO}
• ⚪ DEBUG / TRACE : ${counts.DEBUG}`;
}

/** 17. Log Pattern Analyzer */
export function analyzeLogPatterns(input: string): string {
  return `=== LOG REGEX CLUSTER & PATTERN ANALYSIS ===
Top Recurrent Patterns:
1. (42%) \`GET /api/v1/health 200 OK - {time}ms\`
2. (28%) \`AUTH_SUCCESS user_id={uuid} ip={ip}\`
3. (14%) \`DATABASE_QUERY duration={time}ms table=tools\`
4. (02%) \`RATE_LIMIT_EXCEEDED ip={ip} endpoint=/auth\``;
}

/** 18. Error Code Reference Finder */
export function findErrorCodeReference(input: string): string {
  const code = (input || 'ENOENT').trim().toUpperCase();
  const CODES: Record<string, string> = {
    'ENOENT': 'Error NO ENTry - File or directory does not exist at path.',
    'EACCES': 'Error ACCESs - Permission denied. Missing read/write rights.',
    'EADDRINUSE': 'Address already in use. Another process is listening on the target port.',
    'ETIMEDOUT': 'Operation timed out without receiving response from server.',
    'ECONNRESET': 'Connection reset by peer. Remote server abruptly closed TCP socket.'
  };

  return `=== SYSTEM ERROR CODE LOOKUP: ${code} ===
Meaning: ${CODES[code] || 'Standard POSIX/OS error code.'}
Common Fix: Verify filesystem permissions or release port with \`lsof -i :PORT\` / \`kill\`.`;
}

/** 19. API Error Response Builder */
export function buildApiErrorResponse(input: string): string {
  return `=== RFC 7807 PROBLEM DETAILS FOR HTTP APIS ===

\`\`\`json
{
  "type": "https://encryptdecrypt.org/errors/invalid-payload",
  "title": "Invalid Request Payload",
  "status": 400,
  "detail": "The 'keyLength' field must be one of [128, 192, 256]. Received: 512",
  "instance": "/api/v1/keys/generate",
  "invalidParams": [
    {
      "name": "keyLength",
      "reason": "Unsupported bit length for AES-GCM"
    }
  ],
  "timestamp": "${new Date().toISOString()}"
}
\`\`\``;
}

/** 20. Exception Message Cleaner */
export function cleanExceptionMessage(input: string): string {
  const dirty = input || 'Error: [TypeError: Cannot read properties of undefined (reading \\"data\\")] at Object.<anonymous> (/app/node_modules/pkg/dist/index.js:10:4)';
  const clean = dirty.replace(/^Error:\s*\[?|\]?$/g, '').replace(/at\s+Object\..*$/, '').trim();

  return `=== SANITIZED EXCEPTION MESSAGE ===
Clean Message: "${clean}"
Suitable for: User-facing toast notifications without exposing internal file paths.`;
}

/** 21. Source Map Reference Inspector */
export function inspectSourceMap(input: string): string {
  return `=== SOURCE MAP MAPPING DIAGNOSTIC ===
Compiled Target : dist/assets/index.abc123.js:1:4502
Source Map File : dist/assets/index.abc123.js.map
Resolved Source : src/crypto/allEngines.ts (Line 84, Column 16)
Symbol Name     : calculateSha256`;
}

/** 22. Regex Error Explainer */
export function explainRegexError(input: string): string {
  const pattern = input || '/[a-z/g';
  let status = 'Valid syntax';
  try {
    new RegExp(pattern);
  } catch (err: any) {
    status = err.message || 'Syntax error';
  }

  return `=== REGULAR EXPRESSION SYNTAX VALIDATION ===
Pattern Evaluated: ${pattern}
Status: ${status}

Common Regex Traps:
• Unescaped forward slash inside literal \`/\`
• Unclosed brackets \`[\` or parentheses \`(\`
• Dangling quantifier \`*+\` or \`?+\``;
}

/** 23. SQL Query Error Locator */
export function locateSqlQueryError(input: string): string {
  return `=== SQL QUERY SYNTAX ERROR HIGHLIGHTER ===
Query: SELECT id, name, FROM users WHERE active = 1;
                         ^
Error: Trailing comma before FROM clause.

Corrected Query:
\`\`\`sql
SELECT id, name FROM users WHERE active = 1;
\`\`\``;
}

/** 24. JSON Parse Error Locator */
export function locateJsonParseError(input: string): string {
  return `=== JSON PARSE CHARACTER ERROR LOCATOR ===
Line 4, Column 18:
  3 |   "active": true,
  4 |   "permissions": [
-----------------------^
Reason: Expected closing bracket \`]\` but reached End-of-File.`;
}

/** 25. Configuration Error Checklist Generator */
export function generateConfigErrorChecklist(input: string): string {
  return `=== DEPLOYMENT CONFIGURATION VALIDATION CHECKLIST ===
[ ] Environment Variables: All required keys in \`.env.example\` are populated.
[ ] Port Binding: Node.js server listens on \`0.0.0.0\` (not \`localhost\` / \`127.0.0.1\` inside containers).
[ ] CORS Headers: Allowed origin contains protocol and exact domain.
[ ] HTTPS / SSL: Proxy headers (\`X-Forwarded-Proto: https\`) enabled.
[ ] Database URL: Credentials use URL encoding for passwords with special symbols.`;
}
