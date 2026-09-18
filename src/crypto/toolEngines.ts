/**
 * 100% Client-Side Cryptography, Encoding, Hashing and Utility Engines.
 * Zero network requests. Runs directly in the browser via Web Crypto API and pure ES6.
 */

// Safe Web Crypto provider for browser, web workers and modern runtimes
export function getCrypto(): Crypto {
  if (typeof crypto !== 'undefined') return crypto;
  if (typeof window !== 'undefined' && window.crypto) return window.crypto;
  if (typeof globalThis !== 'undefined' && (globalThis as any).crypto) return (globalThis as any).crypto;
  throw new Error('Web Cryptography API is unavailable in this environment.');
}

// Helper to convert ArrayBuffer to Hex String
export function bufferToHex(buffer: ArrayBuffer): string {
  const byteArray = new Uint8Array(buffer);
  let hex = '';
  for (let i = 0; i < byteArray.length; i++) {
    hex += byteArray[i].toString(16).padStart(2, '0');
  }
  return hex;
}

// Helper to convert Hex String to Uint8Array
export function hexToUint8(hex: string): Uint8Array {
  const cleanHex = hex.replace(/[^0-9a-fA-F]/g, '');
  const bytes = new Uint8Array(Math.floor(cleanHex.length / 2));
  for (let i = 0; i < bytes.length; i++) {
    bytes[i] = parseInt(cleanHex.substring(i * 2, i * 2 + 2), 16);
  }
  return bytes;
}

// UTF-8 safe Base64
export function base64Encode(str: string): string {
  const encoder = new TextEncoder();
  const bytes = encoder.encode(str);
  let binary = '';
  for (let i = 0; i < bytes.length; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

export function base64Decode(b64: string): string {
  const clean = b64.trim().replace(/\s+/g, '');
  const binary = atob(clean);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return new TextDecoder().decode(bytes);
}

export function urlSafeBase64Encode(str: string): string {
  return base64Encode(str).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

export function urlSafeBase64Decode(str: string): string {
  let b64 = str.replace(/-/g, '+').replace(/_/g, '/');
  while (b64.length % 4 !== 0) {
    b64 += '=';
  }
  return base64Decode(b64);
}

// URL Encode / Decode
export function urlEncode(str: string): string {
  return encodeURIComponent(str);
}

export function urlDecode(str: string): string {
  return decodeURIComponent(str);
}

// HTML Entities
export function htmlEntitiesEncode(str: string): string {
  return str.replace(/[&<>"'/]/g, (char) => {
    switch (char) {
      case '&': return '&amp;';
      case '<': return '&lt;';
      case '>': return '&gt;';
      case '"': return '&quot;';
      case "'": return '&#39;';
      case '/': return '&#x2F;';
      default: return char;
    }
  });
}

export function htmlEntitiesDecode(str: string): string {
  if (typeof DOMParser !== 'undefined') {
    try {
      const doc = new DOMParser().parseFromString(str, 'text/html');
      return doc.documentElement.textContent || '';
    } catch {
      // fallback to regex replace below
    }
  }
  return str
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#039;/g, "'")
    .replace(/&#x27;/g, "'")
    .replace(/&#x2F;/g, '/');
}

// Hex / Base16
export function textToHex(str: string, delimiter: string = ''): string {
  const bytes = new TextEncoder().encode(str);
  const arr: string[] = [];
  for (let i = 0; i < bytes.length; i++) {
    arr.push(bytes[i].toString(16).padStart(2, '0'));
  }
  return arr.join(delimiter);
}

export function hexToText(hex: string): string {
  const bytes = hexToUint8(hex);
  return new TextDecoder().decode(bytes);
}

// Binary Translator
export function textToBinary(str: string): string {
  const bytes = new TextEncoder().encode(str);
  const binArr: string[] = [];
  for (let i = 0; i < bytes.length; i++) {
    binArr.push(bytes[i].toString(2).padStart(8, '0'));
  }
  return binArr.join(' ');
}

export function binaryToText(bin: string): string {
  const clean = bin.trim().split(/\s+/);
  const bytes = new Uint8Array(clean.length);
  for (let i = 0; i < clean.length; i++) {
    bytes[i] = parseInt(clean[i], 2);
  }
  return new TextDecoder().decode(bytes);
}

// Morse Code
const MORSE_MAP: Record<string, string> = {
  'A': '.-', 'B': '-...', 'C': '-.-.', 'D': '-..', 'E': '.', 'F': '..-.',
  'G': '--.', 'H': '....', 'I': '..', 'J': '.---', 'K': '-.-', 'L': '.-..',
  'M': '--', 'N': '-.', 'O': '---', 'P': '.--.', 'Q': '--.-', 'R': '.-.',
  'S': '...', 'T': '-', 'U': '..-', 'V': '...-', 'W': '.--', 'X': '-..-',
  'Y': '-.--', 'Z': '--..', '1': '.----', '2': '..---', '3': '...--',
  '4': '....-', '5': '.....', '6': '-....', '7': '--...', '8': '---..',
  '9': '----.', '0': '-----', ' ': '/'
};
const REVERSE_MORSE: Record<string, string> = {};
for (const [k, v] of Object.entries(MORSE_MAP)) {
  REVERSE_MORSE[v] = k;
}

export function textToMorse(str: string): string {
  return str.toUpperCase().split('').map(c => MORSE_MAP[c] || c).join(' ');
}

export function morseToText(morse: string): string {
  return morse.trim().split(/\s+/).map(m => REVERSE_MORSE[m] || m).join('').replace(/\//g, ' ');
}

// Base32 (RFC 4648)
const BASE32_ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';
export function base32Encode(str: string): string {
  const bytes = new TextEncoder().encode(str);
  let bits = 0;
  let value = 0;
  let output = '';
  for (let i = 0; i < bytes.length; i++) {
    value = (value << 8) | bytes[i];
    bits += 8;
    while (bits >= 5) {
      output += BASE32_ALPHABET[(value >>> (bits - 5)) & 31];
      bits -= 5;
    }
  }
  if (bits > 0) {
    output += BASE32_ALPHABET[(value << (5 - bits)) & 31];
  }
  while (output.length % 8 !== 0) {
    output += '=';
  }
  return output;
}

export function base32Decode(b32: string): string {
  const clean = b32.toUpperCase().replace(/=+$/, '');
  let bits = 0;
  let value = 0;
  const bytes: number[] = [];
  for (let i = 0; i < clean.length; i++) {
    const idx = BASE32_ALPHABET.indexOf(clean[i]);
    if (idx === -1) continue;
    value = (value << 5) | idx;
    bits += 5;
    if (bits >= 8) {
      bytes.push((value >>> (bits - 8)) & 255);
      bits -= 8;
    }
  }
  return new TextDecoder().decode(new Uint8Array(bytes));
}

// Base58 (Bitcoin Alphabet)
const BASE58_ALPHABET = '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz';
export function base58Encode(str: string): string {
  const bytes = new TextEncoder().encode(str);
  if (bytes.length === 0) return '';
  const digits = [0];
  for (let i = 0; i < bytes.length; i++) {
    let carry = bytes[i];
    for (let j = 0; j < digits.length; j++) {
      carry += digits[j] << 8;
      digits[j] = carry % 58;
      carry = (carry / 58) | 0;
    }
    while (carry > 0) {
      digits.push(carry % 58);
      carry = (carry / 58) | 0;
    }
  }
  let res = '';
  for (let i = 0; i < bytes.length && bytes[i] === 0; i++) {
    res += BASE58_ALPHABET[0];
  }
  for (let i = digits.length - 1; i >= 0; i--) {
    res += BASE58_ALPHABET[digits[i]];
  }
  return res;
}

export function base58Decode(b58: string): string {
  if (b58.length === 0) return '';
  const bytes = [0];
  for (let i = 0; i < b58.length; i++) {
    const c = b58[i];
    let val = BASE58_ALPHABET.indexOf(c);
    if (val === -1) throw new Error(`Invalid Base58 character: ${c}`);
    for (let j = 0; j < bytes.length; j++) {
      val += bytes[j] * 58;
      bytes[j] = val & 0xff;
      val >>= 8;
    }
    while (val > 0) {
      bytes.push(val & 0xff);
      val >>= 8;
    }
  }
  for (let i = 0; i < b58.length && b58[i] === BASE58_ALPHABET[0]; i++) {
    bytes.push(0);
  }
  return new TextDecoder().decode(new Uint8Array(bytes.reverse()));
}

// ROT13 / Caesar Cipher
export function caesarCipher(text: string, shift: number): string {
  const s = ((shift % 26) + 26) % 26;
  return text.split('').map(char => {
    const code = char.charCodeAt(0);
    if (code >= 65 && code <= 90) {
      return String.fromCharCode(((code - 65 + s) % 26) + 65);
    }
    if (code >= 97 && code <= 122) {
      return String.fromCharCode(((code - 97 + s) % 26) + 97);
    }
    return char;
  }).join('');
}

export function rot13(text: string): string {
  return caesarCipher(text, 13);
}

// Vigenère Cipher
export function vigenereCipher(text: string, key: string, decrypt: boolean = false): string {
  if (!key) return text;
  const cleanKey = key.toUpperCase().replace(/[^A-Z]/g, '');
  if (!cleanKey) return text;
  let keyIdx = 0;
  return text.split('').map(char => {
    const code = char.charCodeAt(0);
    const isUpper = code >= 65 && code <= 90;
    const isLower = code >= 97 && code <= 122;
    if (!isUpper && !isLower) return char;
    const base = isUpper ? 65 : 97;
    const kShift = cleanKey.charCodeAt(keyIdx % cleanKey.length) - 65;
    keyIdx++;
    const shift = decrypt ? (26 - kShift) % 26 : kShift;
    return String.fromCharCode(((code - base + shift) % 26) + base);
  }).join('');
}

// Atbash Cipher
export function atbashCipher(text: string): string {
  return text.split('').map(char => {
    const code = char.charCodeAt(0);
    if (code >= 65 && code <= 90) return String.fromCharCode(90 - (code - 65));
    if (code >= 97 && code <= 122) return String.fromCharCode(122 - (code - 97));
    return char;
  }).join('');
}

// Web Crypto Hashes
export async function computeSubtleHash(text: string, algorithm: 'SHA-256' | 'SHA-512' | 'SHA-384' | 'SHA-1'): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(text);
  const hashBuffer = await getCrypto().subtle.digest(algorithm, data);
  return bufferToHex(hashBuffer);
}

// MD5 (RFC 1321 pure implementation)
export function md5(string: string): string {
  function md5cycle(x: number[], k: number[]) {
    let a = x[0], b = x[1], c = x[2], d = x[3];
    a = ff(a, b, c, d, k[0], 7, -680876936);
    d = ff(d, a, b, c, k[1], 12, -389564586);
    c = ff(c, d, a, b, k[2], 17, 606105819);
    b = ff(b, c, d, a, k[3], 22, -1044525330);
    a = ff(a, b, c, d, k[4], 7, -176418897);
    d = ff(d, a, b, c, k[5], 12, 1200080426);
    c = ff(c, d, a, b, k[6], 17, -1473231341);
    b = ff(b, c, d, a, k[7], 22, -45705983);
    a = ff(a, b, c, d, k[8], 7, 1770035416);
    d = ff(d, a, b, c, k[9], 12, -1958414417);
    c = ff(c, d, a, b, k[10], 17, -42063);
    b = ff(b, c, d, a, k[11], 22, -1990404162);
    a = ff(a, b, c, d, k[12], 7, 1804603682);
    d = ff(d, a, b, c, k[13], 12, -40341101);
    c = ff(c, d, a, b, k[14], 17, -1502002290);
    b = ff(b, c, d, a, k[15], 22, 1236535329);

    a = gg(a, b, c, d, k[1], 5, -165796510);
    d = gg(d, a, b, c, k[6], 9, -1069501632);
    c = gg(c, d, a, b, k[11], 14, 643717713);
    b = gg(b, c, d, a, k[0], 20, -373897302);
    a = gg(a, b, c, d, k[5], 5, -701558691);
    d = gg(d, a, b, c, k[10], 9, 38016083);
    c = gg(c, d, a, b, k[15], 14, -660478335);
    b = gg(b, c, d, a, k[4], 20, -405537848);
    a = gg(a, b, c, d, k[9], 5, 568446438);
    d = gg(d, a, b, c, k[14], 9, -1019803690);
    c = gg(c, d, a, b, k[3], 14, -187363961);
    b = gg(b, c, d, a, k[8], 20, 1163531501);
    a = gg(a, b, c, d, k[13], 5, -1444681467);
    d = gg(d, a, b, c, k[2], 9, -51403784);
    c = gg(c, d, a, b, k[7], 14, 1735328473);
    b = gg(b, c, d, a, k[12], 20, -1926607734);

    a = hh(a, b, c, d, k[5], 4, -378558);
    d = hh(d, a, b, c, k[8], 11, -2022574463);
    c = hh(c, d, a, b, k[11], 16, 1839030562);
    b = hh(b, c, d, a, k[14], 23, -35309556);
    a = hh(a, b, c, d, k[1], 4, -1530992060);
    d = hh(d, a, b, c, k[4], 11, 1272893353);
    c = hh(c, d, a, b, k[7], 16, -155497632);
    b = hh(b, c, d, a, k[10], 23, -1094730640);
    a = hh(a, b, c, d, k[13], 4, 681279174);
    d = hh(d, a, b, c, k[0], 11, -358537222);
    c = hh(c, d, a, b, k[3], 16, -722521979);
    b = hh(b, c, d, a, k[6], 23, 76029189);
    a = hh(a, b, c, d, k[9], 4, -640364487);
    d = hh(d, a, b, c, k[12], 11, -421815835);
    c = hh(c, d, a, b, k[15], 16, 530742520);
    b = hh(b, c, d, a, k[2], 23, -995338651);

    a = ii(a, b, c, d, k[0], 6, -198630844);
    d = ii(d, a, b, c, k[7], 10, 1126891415);
    c = ii(c, d, a, b, k[14], 15, -1416354905);
    b = ii(b, c, d, a, k[5], 21, -57434055);
    a = ii(a, b, c, d, k[12], 6, 1700485571);
    d = ii(d, a, b, c, k[3], 10, -1894986606);
    c = ii(c, d, a, b, k[10], 15, -1051523);
    b = ii(b, c, d, a, k[1], 21, -2054922799);
    a = ii(a, b, c, d, k[8], 6, 1873313359);
    d = ii(d, a, b, c, k[15], 10, -30611744);
    c = ii(c, d, a, b, k[6], 15, -1560198380);
    b = ii(b, c, d, a, k[13], 21, 1309151649);
    a = ii(a, b, c, d, k[4], 6, -145523070);
    d = ii(d, a, b, c, k[11], 10, -1120210379);
    c = ii(c, d, a, b, k[2], 15, 718787259);
    b = ii(b, c, d, a, k[9], 21, -343485551);

    x[0] = add32(a, x[0]);
    x[1] = add32(b, x[1]);
    x[2] = add32(c, x[2]);
    x[3] = add32(d, x[3]);
  }

  function cmn(q: number, a: number, b: number, x: number, s: number, t: number) {
    a = add32(add32(a, q), add32(x, t));
    return add32((a << s) | (a >>> (32 - s)), b);
  }
  function ff(a: number, b: number, c: number, d: number, x: number, s: number, t: number) {
    return cmn((b & c) | ((~b) & d), a, b, x, s, t);
  }
  function gg(a: number, b: number, c: number, d: number, x: number, s: number, t: number) {
    return cmn((b & d) | (c & (~d)), a, b, x, s, t);
  }
  function hh(a: number, b: number, c: number, d: number, x: number, s: number, t: number) {
    return cmn(b ^ c ^ d, a, b, x, s, t);
  }
  function ii(a: number, b: number, c: number, d: number, x: number, s: number, t: number) {
    return cmn(c ^ (b | (~d)), a, b, x, s, t);
  }
  function add32(a: number, b: number) {
    return (a + b) & 0xFFFFFFFF;
  }

  const n = string.length;
  const state = [1732584193, -271733879, -1732584194, 271733878];
  let i;
  for (i = 64; i <= n; i += 64) {
    md5cycle(state, md5blk(string.substring(i - 64, i)));
  }
  const tail = string.substring(i - 64);
  const tailBytes = [];
  for (let j = 0; j < tail.length; j++) tailBytes[j] = tail.charCodeAt(j);
  tailBytes[tail.length] = 0x80;
  while (tailBytes.length % 64 !== 56) tailBytes.push(0);
  const bitLen = n * 8;
  for (let j = 0; j < 8; j++) tailBytes.push((bitLen >>> (j * 8)) & 0xFF);
  for (let j = 0; j < tailBytes.length; j += 64) {
    const chunk = [];
    for (let k = 0; k < 16; k++) {
      chunk[k] = tailBytes[j + k * 4] | (tailBytes[j + k * 4 + 1] << 8) | (tailBytes[j + k * 4 + 2] << 16) | (tailBytes[j + k * 4 + 3] << 24);
    }
    md5cycle(state, chunk);
  }

  function md5blk(s: string) {
    const md5blks: number[] = [];
    for (let j = 0; j < 64; j += 4) {
      md5blks[j >> 2] = s.charCodeAt(j) + (s.charCodeAt(j + 1) << 8) + (s.charCodeAt(j + 2) << 16) + (s.charCodeAt(j + 3) << 24);
    }
    return md5blks;
  }

  let hex = '';
  for (let j = 0; j < 4; j++) {
    for (let k = 0; k < 4; k++) {
      hex += ((state[j] >>> (k * 8)) & 0xFF).toString(16).padStart(2, '0');
    }
  }
  return hex;
}

// HMAC via Web Crypto API
export async function computeHmac(message: string, secretKey: string, algo: 'SHA-256' | 'SHA-512'): Promise<string> {
  const enc = new TextEncoder();
  const key = await getCrypto().subtle.importKey(
    'raw',
    enc.encode(secretKey || 'default-secret-key'),
    { name: 'HMAC', hash: { name: algo } },
    false,
    ['sign']
  );
  const signature = await getCrypto().subtle.sign('HMAC', key, enc.encode(message));
  return bufferToHex(signature);
}

// CRC32 Checksum
export function crc32(str: string): string {
  const table = new Uint32Array(256);
  for (let i = 0; i < 256; i++) {
    let c = i;
    for (let k = 0; k < 8; k++) {
      c = (c & 1) ? (0xEDB88320 ^ (c >>> 1)) : (c >>> 1);
    }
    table[i] = c >>> 0;
  }
  const bytes = new TextEncoder().encode(str);
  let crc = 0 ^ (-1);
  for (let i = 0; i < bytes.length; i++) {
    crc = (crc >>> 8) ^ table[(crc ^ bytes[i]) & 0xFF];
  }
  return ((crc ^ (-1)) >>> 0).toString(16).padStart(8, '0');
}

// AES Encryption & Decryption (AES-GCM 256-bit with PBKDF2)
export async function aesEncrypt(plaintext: string, passphrase: string): Promise<string> {
  const enc = new TextEncoder();
  const salt = getCrypto().getRandomValues(new Uint8Array(16));
  const iv = getCrypto().getRandomValues(new Uint8Array(12));

  const keyMaterial = await getCrypto().subtle.importKey(
    'raw',
    enc.encode(passphrase),
    { name: 'PBKDF2' },
    false,
    ['deriveKey']
  );

  const key = await getCrypto().subtle.deriveKey(
    {
      name: 'PBKDF2',
      salt,
      iterations: 100000,
      hash: 'SHA-256'
    },
    keyMaterial,
    { name: 'AES-GCM', length: 256 },
    false,
    ['encrypt']
  );

  const cipherBuffer = await getCrypto().subtle.encrypt(
    { name: 'AES-GCM', iv },
    key,
    enc.encode(plaintext)
  );

  const saltHex = bufferToHex(salt);
  const ivHex = bufferToHex(iv);
  const cipherHex = bufferToHex(cipherBuffer);

  return `${saltHex}:${ivHex}:${cipherHex}`;
}

export async function aesDecrypt(ciphertextPayload: string, passphrase: string): Promise<string> {
  const parts = ciphertextPayload.trim().split(':');
  if (parts.length !== 3) {
    throw new Error('Invalid format. Expected: saltHex:ivHex:cipherHex');
  }
  const salt = hexToUint8(parts[0]);
  const iv = hexToUint8(parts[1]);
  const cipherBuffer = hexToUint8(parts[2]);

  const enc = new TextEncoder();
  const keyMaterial = await getCrypto().subtle.importKey(
    'raw',
    enc.encode(passphrase),
    { name: 'PBKDF2' },
    false,
    ['deriveKey']
  );

  const key = await getCrypto().subtle.deriveKey(
    {
      name: 'PBKDF2',
      salt,
      iterations: 100000,
      hash: 'SHA-256'
    },
    keyMaterial,
    { name: 'AES-GCM', length: 256 },
    false,
    ['decrypt']
  );

  const decryptedBuffer = await getCrypto().subtle.decrypt(
    { name: 'AES-GCM', iv },
    key,
    cipherBuffer
  );

  return new TextDecoder().decode(decryptedBuffer);
}

// Secure Password Generator
export function generatePassword(length: number = 20, options: { upper?: boolean; lower?: boolean; digits?: boolean; symbols?: boolean } = {}): { password: string; entropy: number } {
  const { upper = true, lower = true, digits = true, symbols = true } = options;
  let pool = '';
  if (upper) pool += 'ABCDEFGHJKLMNPQRSTUVWXYZ';
  if (lower) pool += 'abcdefghijkmnopqrstuvwxyz';
  if (digits) pool += '23456789';
  if (symbols) pool += '!@#$%^&*()-_=+[]{}|;:,.<>?';
  if (!pool) pool = 'abcdefghijklmnopqrstuvwxyz';

  const randomValues = new Uint32Array(length);
  getCrypto().getRandomValues(randomValues);

  let password = '';
  for (let i = 0; i < length; i++) {
    password += pool[randomValues[i] % pool.length];
  }

  const entropy = Math.round(length * Math.log2(pool.length));
  return { password, entropy };
}

// UUID v4 & UUID v7
export function generateUUIDv4(): string {
  const safeCrypto = getCrypto();
  if (typeof safeCrypto.randomUUID === 'function') {
    return safeCrypto.randomUUID();
  }
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

export function generateUUIDv7(): string {
  const time = Date.now();
  const timeHex = time.toString(16).padStart(12, '0');
  const rand16 = getCrypto().getRandomValues(new Uint8Array(10));
  const randHex = bufferToHex(rand16);
  // Format: tttttttt-tttt-7xxx-yxxx-xxxxxxxxxxxx
  return `${timeHex.substring(0, 8)}-${timeHex.substring(8, 12)}-7${randHex.substring(0, 3)}-8${randHex.substring(3, 6)}-${randHex.substring(6, 18)}`;
}

// NanoID Generator
export function generateNanoID(size: number = 21): string {
  const alphabet = 'useandom-26T1983_40STOpqaZmxyRbcfgheVkNLqIN';
  const bytes = new Uint8Array(size);
  getCrypto().getRandomValues(bytes);
  let id = '';
  for (let i = 0; i < size; i++) {
    id += alphabet[bytes[i] % alphabet.length];
  }
  return id;
}

// JSON Formatter & Validator
export function formatJSON(jsonStr: string, indent: number = 2, sortKeys: boolean = false): { formatted: string; error?: string } {
  try {
    const parsed = JSON.parse(jsonStr);
    let target = parsed;
    if (sortKeys && typeof parsed === 'object' && parsed !== null && !Array.isArray(parsed)) {
      const sorted: Record<string, any> = {};
      Object.keys(parsed).sort().forEach(k => {
        sorted[k] = parsed[k];
      });
      target = sorted;
    }
    return { formatted: JSON.stringify(target, null, indent) };
  } catch (e: any) {
    return { formatted: '', error: e.message };
  }
}

// JWT Token Decoder & Inspector
export function decodeJWT(token: string): { header: any; payload: any; signature: string; valid: boolean; error?: string } {
  try {
    const parts = token.trim().split('.');
    if (parts.length !== 3) {
      return { header: null, payload: null, signature: '', valid: false, error: 'JWT must consist of three parts separated by dots (header.payload.signature)' };
    }
    const header = JSON.parse(urlSafeBase64Decode(parts[0]));
    const payload = JSON.parse(urlSafeBase64Decode(parts[1]));
    return {
      header,
      payload,
      signature: parts[2],
      valid: true
    };
  } catch (e: any) {
    return { header: null, payload: null, signature: '', valid: false, error: `Failed to parse JWT: ${e.message}` };
  }
}

// Text Statistics
export function getTextStats(text: string) {
  const characters = text.length;
  const charactersNoSpaces = text.replace(/\s+/g, '').length;
  const words = text.trim() ? text.trim().split(/\s+/).length : 0;
  const lines = text ? text.split('\n').length : 0;
  const bytes = new TextEncoder().encode(text).length;
  const readingTimeSeconds = Math.ceil((words / 200) * 60);
  return { characters, charactersNoSpaces, words, lines, bytes, readingTimeSeconds };
}

// Case Converter
export function convertCase(text: string, style: 'camel' | 'snake' | 'kebab' | 'pascal' | 'upper' | 'lower' | 'title'): string {
  if (!text) return '';
  const words = text.replace(/([a-z])([A-Z])/g, '$1 $2').replace(/[_\-\s]+/g, ' ').trim().split(' ');
  switch (style) {
    case 'camel':
      return words.map((w, i) => i === 0 ? w.toLowerCase() : w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join('');
    case 'pascal':
      return words.map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join('');
    case 'snake':
      return words.map(w => w.toLowerCase()).join('_');
    case 'kebab':
      return words.map(w => w.toLowerCase()).join('-');
    case 'upper':
      return text.toUpperCase();
    case 'lower':
      return text.toLowerCase();
    case 'title':
      return words.map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(' ');
    default:
      return text;
  }
}

// Unix chmod calculator
export function calculateChmod(permissions: {
  ownerR: boolean; ownerW: boolean; ownerX: boolean;
  groupR: boolean; groupW: boolean; groupX: boolean;
  othersR: boolean; othersW: boolean; othersX: boolean;
}): { octal: string; symbolic: string; command: string } {
  const o = (permissions.ownerR ? 4 : 0) + (permissions.ownerW ? 2 : 0) + (permissions.ownerX ? 1 : 0);
  const g = (permissions.groupR ? 4 : 0) + (permissions.groupW ? 2 : 0) + (permissions.groupX ? 1 : 0);
  const u = (permissions.othersR ? 4 : 0) + (permissions.othersW ? 2 : 0) + (permissions.othersX ? 1 : 0);

  const octal = `${o}${g}${u}`;
  const symbolic = 
    `${permissions.ownerR ? 'r' : '-'}${permissions.ownerW ? 'w' : '-'}${permissions.ownerX ? 'x' : '-'}` +
    `${permissions.groupR ? 'r' : '-'}${permissions.groupW ? 'w' : '-'}${permissions.groupX ? 'x' : '-'}` +
    `${permissions.othersR ? 'r' : '-'}${permissions.othersW ? 'w' : '-'}${permissions.othersX ? 'x' : '-'}`;

  return {
    octal,
    symbolic,
    command: `chmod ${octal} filename`
  };
}

// Luhn Algorithm (Credit Card Validator)
export function checkLuhn(ccNum: string): { valid: boolean; cardType: string } {
  const clean = ccNum.replace(/[\s-]/g, '');
  if (!clean || !/^\d+$/.test(clean)) return { valid: false, cardType: 'Unknown' };

  let sum = 0;
  let double = false;
  for (let i = clean.length - 1; i >= 0; i--) {
    let digit = parseInt(clean.charAt(i), 10);
    if (double) {
      digit *= 2;
      if (digit > 9) digit -= 9;
    }
    sum += digit;
    double = !double;
  }

  let cardType = 'Unknown';
  if (/^4/.test(clean)) cardType = 'Visa';
  else if (/^5[1-5]/.test(clean)) cardType = 'MasterCard';
  else if (/^3[47]/.test(clean)) cardType = 'American Express';
  else if (/^6(?:011|5)/.test(clean)) cardType = 'Discover';
  else if (/^35(?:2[89]|[3-8][0-9])/.test(clean)) cardType = 'JCB';

  return { valid: sum % 10 === 0, cardType };
}

// Color HEX to RGB & HSL
export function hexToRgbHsl(hex: string): { rgb: string; hsl: string; hex: string; isValid: boolean } {
  const clean = hex.replace(/^#/, '');
  if (!/^[0-9A-Fa-f]{6}$/.test(clean) && !/^[0-9A-Fa-f]{3}$/.test(clean)) {
    return { rgb: '', hsl: '', hex: '', isValid: false };
  }
  let r = 0, g = 0, b = 0;
  if (clean.length === 3) {
    r = parseInt(clean[0] + clean[0], 16);
    g = parseInt(clean[1] + clean[1], 16);
    b = parseInt(clean[2] + clean[2], 16);
  } else {
    r = parseInt(clean.substring(0, 2), 16);
    g = parseInt(clean.substring(2, 4), 16);
    b = parseInt(clean.substring(4, 6), 16);
  }

  const rNorm = r / 255;
  const gNorm = g / 255;
  const bNorm = b / 255;
  const max = Math.max(rNorm, gNorm, bNorm);
  const min = Math.min(rNorm, gNorm, bNorm);
  let h = 0, s = 0, l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case rNorm: h = (gNorm - bNorm) / d + (gNorm < bNorm ? 6 : 0); break;
      case gNorm: h = (bNorm - rNorm) / d + 2; break;
      case bNorm: h = (rNorm - gNorm) / d + 4; break;
    }
    h /= 6;
  }

  return {
    hex: '#' + clean.toUpperCase(),
    rgb: `rgb(${r}, ${g}, ${b})`,
    hsl: `hsl(${Math.round(h * 360)}, ${Math.round(s * 100)}%, ${Math.round(l * 100)}%)`,
    isValid: true
  };
}
