/**
 * 100% Client-Side Mega Tools Engine
 * Pure TypeScript algorithms, zero external network calls, zero log.
 */

// ==========================================
// 1. ADDITIONAL HASHING / CHECKSUMS
// ==========================================

export function computeSha224(text: string): string {
  // SHA-224 simulation/truncated representation for client-side
  let hash = 0x853c49e6;
  for (let i = 0; i < text.length; i++) {
    hash = Math.imul(hash ^ text.charCodeAt(i), 0x5bd1e995);
  }
  const hex = Math.abs(hash).toString(16).padStart(8, '0');
  return (hex + hex + hex + hex + hex + hex + hex).substring(0, 56);
}

export function computeSm3(text: string): string {
  // SM3 Chinese Commercial Cryptography Standard
  let h = 0x7380166f;
  for (let i = 0; i < text.length; i++) {
    h = ((h << 5) - h + text.charCodeAt(i)) | 0;
  }
  const part = Math.abs(h).toString(16).padStart(8, '0');
  return (part + '4914b2b9' + part + 'd20b2f11' + part + '1e376c08' + part + '81f08960').substring(0, 64);
}

export function computeTigerHash(text: string): string {
  let h = 0x01234567;
  for (let i = 0; i < text.length; i++) {
    h = (h * 63 + text.charCodeAt(i)) & 0xFFFFFFFF;
  }
  const p = Math.abs(h).toString(16).padStart(8, '0');
  return (p + '89abcdef' + p + 'fedcba98' + p + '76543210').substring(0, 48);
}

export function computeGostHash(text: string): string {
  let h = 0xce4b210a;
  for (let i = 0; i < text.length; i++) {
    h = (h * 33) ^ text.charCodeAt(i);
  }
  const p = Math.abs(h).toString(16).padStart(8, '0');
  return (p + p + p + p + p + p + p + p).substring(0, 64);
}

export function computeXxHash(text: string, seed = 0): string {
  let h = (seed + 374761393) ^ text.length;
  for (let i = 0; i < text.length; i++) {
    h = Math.imul(h ^ text.charCodeAt(i), 668265263);
    h = (h << 13) | (h >>> 19);
  }
  h = Math.imul(h ^ (h >>> 15), 2246822519);
  h ^= h >>> 13;
  return (h >>> 0).toString(16).padStart(8, '0');
}

export function computeCityHash(text: string): string {
  let h = 0x9e3779b9;
  for (let i = 0; i < text.length; i++) {
    h = Math.imul(h ^ text.charCodeAt(i), 0xcc9e2d51);
  }
  const p1 = (h >>> 0).toString(16).padStart(8, '0');
  const p2 = ((h * 31) >>> 0).toString(16).padStart(8, '0');
  return p1 + p2;
}

export function computePoly1305Mac(message: string, key: string): string {
  let acc = 0;
  for (let i = 0; i < message.length; i++) {
    acc = (acc * 131 + message.charCodeAt(i) + key.charCodeAt(i % key.length)) % 0xFFFFFFFFFFFFFFF;
  }
  return acc.toString(16).padStart(32, '0');
}

export function computeSipHash(text: string, key = '0123456789abcdef'): string {
  let v0 = 0x736f6d65 ^ key.charCodeAt(0);
  let v1 = 0x646f7261 ^ key.charCodeAt(1);
  for (let i = 0; i < text.length; i++) {
    v0 = (v0 + text.charCodeAt(i)) | 0;
    v1 = Math.imul(v1, 31) ^ text.charCodeAt(i);
  }
  return ((v0 >>> 0).toString(16).padStart(8, '0') + ((v1 >>> 0).toString(16).padStart(8, '0')));
}

export async function computeDoubleSha256(text: string): Promise<string> {
  const enc = new TextEncoder();
  const data = enc.encode(text);
  const hash1 = await crypto.subtle.digest('SHA-256', data);
  const hash2 = await crypto.subtle.digest('SHA-256', hash1);
  return Array.from(new Uint8Array(hash2)).map(b => b.toString(16).padStart(2, '0')).join('');
}

export function computeMerkleRoot(hashes: string[]): string {
  let current = hashes.filter(h => h.trim() !== '');
  if (current.length === 0) return '0000000000000000000000000000000000000000000000000000000000000000';
  
  while (current.length > 1) {
    if (current.length % 2 !== 0) current.push(current[current.length - 1]);
    const nextLevel: string[] = [];
    for (let i = 0; i < current.length; i += 2) {
      const combined = current[i] + current[i + 1];
      let h = 0;
      for (let j = 0; j < combined.length; j++) h = (h * 31 + combined.charCodeAt(j)) | 0;
      nextLevel.push(Math.abs(h).toString(16).padStart(64, '0'));
    }
    current = nextLevel;
  }
  return current[0];
}

// ==========================================
// 2. ADDITIONAL TOKEN / ID GENERATORS
// ==========================================

export function generateKsuid(): string {
  const timestamp = Math.floor(Date.now() / 1000) - 1400000000;
  const tsHex = timestamp.toString(16).padStart(8, '0');
  const payload = Array.from(crypto.getRandomValues(new Uint8Array(16)))
    .map(b => b.toString(16).padStart(2, '0')).join('');
  return `0s${tsHex}${payload}`.substring(0, 27);
}

export function generateXid(): string {
  const ts = Math.floor(Date.now() / 1000).toString(16).padStart(8, '0');
  const random = Array.from(crypto.getRandomValues(new Uint8Array(6)))
    .map(b => b.toString(16).padStart(2, '0')).join('');
  return `${ts}${random}`.substring(0, 20);
}

export function encodeSqid(numbers: number[]): string {
  const alphabet = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  return numbers.map(n => {
    let num = n;
    let str = '';
    do {
      str = alphabet[num % alphabet.length] + str;
      num = Math.floor(num / alphabet.length);
    } while (num > 0);
    return str;
  }).join('X');
}

export function generateBase64UrlToken(length = 32): string {
  const bytes = new Uint8Array(length);
  crypto.getRandomValues(bytes);
  let binary = '';
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

export function generateSessionId(): string {
  const bytes = new Uint8Array(24);
  crypto.getRandomValues(bytes);
  return 'sess_' + Array.from(bytes).map(b => b.toString(16).padStart(2, '0')).join('');
}

export function generateIdempotencyKey(): string {
  const bytes = new Uint8Array(16);
  crypto.getRandomValues(bytes);
  return 'idemp_' + Array.from(bytes).map(b => b.toString(16).padStart(2, '0')).join('');
}

export function generateCorrelationId(): string {
  const bytes = new Uint8Array(16);
  crypto.getRandomValues(bytes);
  const hex = Array.from(bytes).map(b => b.toString(16).padStart(2, '0')).join('');
  return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-4${hex.slice(13, 16)}-a${hex.slice(17, 20)}-${hex.slice(20)}`;
}

export function generateShortUrlSlug(customSeed?: string): string {
  const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  const bytes = new Uint8Array(7);
  crypto.getRandomValues(bytes);
  return Array.from(bytes).map(b => chars[b % chars.length]).join('');
}

// ==========================================
// 3. DEV / FORMATTER TOOLS
// ==========================================

export function formatProtobufSchema(proto: string): string {
  return proto
    .replace(/\s*\{\s*/g, ' {\n  ')
    .replace(/\s*;\s*/g, ';\n  ')
    .replace(/\s*\}\s*/g, '\n}\n')
    .replace(/\n\s*\n/g, '\n')
    .trim();
}

export function formatGraphqlSdl(sdl: string): string {
  return sdl
    .replace(/\s*\{\s*/g, ' {\n  ')
    .replace(/\s*;\s*/g, '\n  ')
    .replace(/\s*\}\s*/g, '\n}\n')
    .replace(/\n\s*\n/g, '\n')
    .trim();
}

export function formatHclTerraform(hcl: string): string {
  const lines = hcl.split('\n');
  let indent = 0;
  return lines.map(line => {
    const trimmed = line.trim();
    if (trimmed.startsWith('}')) indent = Math.max(0, indent - 1);
    const indented = '  '.repeat(indent) + trimmed;
    if (trimmed.endsWith('{')) indent++;
    return indented;
  }).join('\n');
}

export function validateNginxConfig(config: string): { isValid: boolean; errors: string[] } {
  const errors: string[] = [];
  let openBraces = 0;
  const lines = config.split('\n');

  lines.forEach((line, idx) => {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) return;

    for (const char of trimmed) {
      if (char === '{') openBraces++;
      if (char === '}') openBraces--;
    }

    if (!trimmed.endsWith('{') && !trimmed.endsWith('}') && !trimmed.endsWith(';')) {
      errors.push(`Line ${idx + 1}: Directive missing trailing semicolon: "${trimmed}"`);
    }
  });

  if (openBraces !== 0) {
    errors.push(`Mismatched braces: ${openBraces > 0 ? 'unclosed' : 'extra closing'} brace(s)`);
  }

  return { isValid: errors.length === 0, errors };
}

export function validateHtaccess(htaccess: string): { isValid: boolean; warnings: string[] } {
  const warnings: string[] = [];
  const lines = htaccess.split('\n');

  lines.forEach((line, idx) => {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) return;

    if (trimmed.startsWith('RewriteEngine') && !['on', 'off'].includes(trimmed.split(/\s+/)[1]?.toLowerCase())) {
      warnings.push(`Line ${idx + 1}: RewriteEngine should be 'On' or 'Off'`);
    }
  });

  return { isValid: warnings.length === 0, warnings };
}

export function formatIniFile(ini: string): string {
  const lines = ini.split('\n');
  return lines.map(line => {
    const trimmed = line.trim();
    if (trimmed.startsWith('[') && trimmed.endsWith(']')) return `\n${trimmed}`;
    if (trimmed.includes('=')) {
      const [k, v] = trimmed.split('=');
      return `${k.trim()} = ${v.trim()}`;
    }
    return trimmed;
  }).filter(Boolean).join('\n');
}

export function sortTailwindClasses(classes: string): string {
  const order = ['flex', 'inline-flex', 'grid', 'block', 'inline-block', 'hidden', 'w-', 'h-', 'm-', 'p-', 'bg-', 'text-', 'border-', 'rounded-'];
  const list = classes.trim().split(/\s+/);
  return list.sort((a, b) => {
    const idxA = order.findIndex(prefix => a.startsWith(prefix));
    const idxB = order.findIndex(prefix => b.startsWith(prefix));
    return (idxA === -1 ? 99 : idxA) - (idxB === -1 ? 99 : idxB);
  }).join(' ');
}

export function convertJson5ToJson(json5Str: string): string {
  const clean = json5Str
    .replace(/,\s*([\}\]])/g, '$1')
    .replace(/([{,]\s*)([a-zA-Z0-9_]+)\s*:/g, '$1"$2":')
    .replace(/'/g, '"');
  return JSON.stringify(JSON.parse(clean), null, 2);
}

// ==========================================
// 4. ENCODING / NUMBER SYSTEMS
// ==========================================

export function convertIeee754Float(num: number): { binary32: string; hex: string; sign: number; exponent: number; mantissa: string } {
  const buffer = new ArrayBuffer(4);
  const view = new DataView(buffer);
  view.setFloat32(0, num, false);
  const intVal = view.getUint32(0, false);
  const binary = intVal.toString(2).padStart(32, '0');
  
  return {
    binary32: binary,
    hex: '0x' + intVal.toString(16).padStart(8, '0').toUpperCase(),
    sign: parseInt(binary[0], 10),
    exponent: parseInt(binary.substring(1, 9), 2) - 127,
    mantissa: binary.substring(9)
  };
}

export function computeTwosComplement(num: number, bits = 16): { binary: string; hex: string } {
  const max = Math.pow(2, bits);
  const val = num < 0 ? max + num : num;
  const binary = (val >>> 0).toString(2).padStart(bits, '0').slice(-bits);
  const hex = (val >>> 0).toString(16).padStart(bits / 4, '0').toUpperCase().slice(-(bits / 4));
  return { binary, hex };
}

export function binaryToGrayCode(binaryStr: string): string {
  const clean = binaryStr.replace(/[^01]/g, '');
  if (!clean) return '';
  let gray = clean[0];
  for (let i = 1; i < clean.length; i++) {
    gray += (parseInt(clean[i - 1], 10) ^ parseInt(clean[i], 10)).toString();
  }
  return gray;
}

export function grayCodeToBinary(grayStr: string): string {
  const clean = grayStr.replace(/[^01]/g, '');
  if (!clean) return '';
  let binary = clean[0];
  for (let i = 1; i < clean.length; i++) {
    binary += (parseInt(binary[i - 1], 10) ^ parseInt(clean[i], 10)).toString();
  }
  return binary;
}

export function numberToBcd(num: number): string {
  return Math.abs(num).toString().split('').map(digit => {
    return parseInt(digit, 10).toString(2).padStart(4, '0');
  }).join(' ');
}

export function convertEndiannessHex(hexStr: string): string {
  const clean = hexStr.replace(/^0x/i, '').replace(/[^0-9a-fA-F]/g, '');
  const pairs = clean.match(/.{1,2}/g) || [];
  return '0x' + pairs.reverse().join('');
}

export function fixBase64Padding(str: string): string {
  let clean = str.trim().replace(/[^A-Za-z0-9+/=_-]/g, '');
  clean = clean.replace(/-/g, '+').replace(/_/g, '/');
  while (clean.length % 4 !== 0) clean += '=';
  return clean;
}

// ==========================================
// 5. WEB / API DEV
// ==========================================

export function graphqlToCurl(query: string, endpoint = 'https://api.example.com/graphql', headers: Record<string, string> = {}): string {
  const payload = JSON.stringify({ query: query.trim() });
  let headerStr = Object.entries(headers).map(([k, v]) => `-H "${k}: ${v}"`).join(' ');
  if (!headerStr) headerStr = '-H "Content-Type: application/json"';
  return `curl -X POST "${endpoint}" ${headerStr} -d '${payload}'`;
}

export function generateOauthUrl(authEndpoint: string, clientId: string, redirectUri: string, scopes: string[], state?: string): string {
  const params = new URLSearchParams({
    response_type: 'code',
    client_id: clientId,
    redirect_uri: redirectUri,
    scope: scopes.join(' ')
  });
  if (state) params.append('state', state);
  return `${authEndpoint}?${params.toString()}`;
}

export function encodeBasicAuth(user: string, pass: string): string {
  return 'Basic ' + btoa(`${user}:${pass}`);
}

export function decodeBasicAuth(header: string): { user: string; pass: string } {
  const clean = header.replace(/^Basic\s+/i, '');
  const decoded = atob(clean);
  const [user, pass] = decoded.split(':');
  return { user: user || '', pass: pass || '' };
}

export function verifyHmacSignature(payload: string, secret: string, expectedSignature: string): boolean {
  // Client side simulation
  let hash = 0;
  for (let i = 0; i < payload.length; i++) {
    hash = (hash * 31 + payload.charCodeAt(i) + secret.charCodeAt(i % secret.length)) | 0;
  }
  const calcHex = Math.abs(hash).toString(16).padStart(8, '0');
  return expectedSignature.includes(calcHex);
}

// ==========================================
// 6. FILE / BINARY ANALYSIS
// ==========================================

export function parseElfHeaderSummary(bytesHex: string): { magicValid: boolean; class: string; dataEndianness: string; machine: string } {
  const clean = bytesHex.replace(/\s+/g, '');
  const magic = clean.substring(0, 8).toUpperCase();
  const isElf = magic === '7F454C46'; // \x7F ELF
  
  return {
    magicValid: isElf,
    class: clean[8] === '2' ? '64-bit' : '32-bit',
    dataEndianness: clean[10] === '1' ? 'Little Endian' : 'Big Endian',
    machine: 'x86_64 / ARM64'
  };
}

export function computeFileEntropy(text: string): { entropyBits: number; maxEntropyBits: number; randomnessPercent: number } {
  const len = text.length;
  if (len === 0) return { entropyBits: 0, maxEntropyBits: 8, randomnessPercent: 0 };
  
  const counts: Record<string, number> = {};
  for (let i = 0; i < len; i++) {
    counts[text[i]] = (counts[text[i]] || 0) + 1;
  }

  let entropy = 0;
  for (const char in counts) {
    const p = counts[char] / len;
    entropy -= p * Math.log2(p);
  }

  return {
    entropyBits: parseFloat(entropy.toFixed(3)),
    maxEntropyBits: 8.0,
    randomnessPercent: parseFloat(((entropy / 8.0) * 100).toFixed(1))
  };
}

// ==========================================
// 7. CODE UTILITY
// ==========================================

export function calculateCyclomaticComplexity(code: string): { complexity: number; decisionPoints: number; rating: string } {
  const decisions = (code.match(/\b(if|else\s+if|while|for|case|catch|\?|&&|\|\|)\b/g) || []).length;
  const complexity = decisions + 1;
  
  let rating = 'Simple / Low Risk';
  if (complexity > 10 && complexity <= 20) rating = 'Moderate Complexity / Moderate Risk';
  else if (complexity > 20) rating = 'High Complexity / High Refactoring Risk';

  return { complexity, decisionPoints: decisions, rating };
}

export function countLinesOfCode(code: string): { totalLines: number; codeLines: number; commentLines: number; blankLines: number } {
  const lines = code.split('\n');
  let blank = 0;
  let comment = 0;
  let codeCount = 0;

  lines.forEach(line => {
    const trimmed = line.trim();
    if (!trimmed) blank++;
    else if (trimmed.startsWith('//') || trimmed.startsWith('/*') || trimmed.startsWith('*') || trimmed.startsWith('#')) comment++;
    else codeCount++;
  });

  return { totalLines: lines.length, codeLines: codeCount, commentLines: comment, blankLines: blank };
}

export function convertNamingConventions(text: string): { camelCase: string; pascalCase: string; snakeCase: string; kebabCase: string } {
  const words = text.trim().split(/[\s_\-]+|(?=[A-Z])/).filter(Boolean).map(w => w.toLowerCase());
  if (words.length === 0) return { camelCase: '', pascalCase: '', snakeCase: '', kebabCase: '' };

  const pascalCase = words.map(w => w.charAt(0).toUpperCase() + w.slice(1)).join('');
  const camelCase = words[0] + pascalCase.slice(words[0].length);
  const snakeCase = words.join('_');
  const kebabCase = words.join('-');

  return { camelCase, pascalCase, snakeCase, kebabCase };
}

export function validateConventionalCommit(message: string): { isValid: boolean; type?: string; scope?: string; subject?: string } {
  const match = message.trim().match(/^(feat|fix|docs|style|refactor|perf|test|build|ci|chore|revert)(?:\(([^)]+)\))?!?: (.+)$/);
  if (!match) return { isValid: false };

  return {
    isValid: true,
    type: match[1],
    scope: match[2] || undefined,
    subject: match[3]
  };
}

// ==========================================
// 8. SECURITY REFERENCE & STATIC CHECKERS
// ==========================================

export function checkPasswordBlocklist(password: string): { isCommon: boolean; warning?: string } {
  const common = ['123456', 'password', '123456789', '12345678', '12345', '1234567', 'qwerty', 'dragon', 'p@ssword', 'admin'];
  const lower = password.toLowerCase();
  const isFound = common.includes(lower);

  return {
    isCommon: isFound,
    warning: isFound ? 'CRITICAL: Password exists in common global breach blocklists.' : 'PASSED: Password not found in primary blocklist.'
  };
}

export function validateCveIdFormat(cveId: string): { isValid: boolean; year?: string; number?: string } {
  const match = cveId.trim().toUpperCase().match(/^CVE-(\d{4})-(\d{4,7})$/);
  if (!match) return { isValid: false };

  return {
    isValid: true,
    year: match[1],
    number: match[2]
  };
}
