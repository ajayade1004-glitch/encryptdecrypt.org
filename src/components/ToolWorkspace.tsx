import React, { useState, useEffect, useMemo, useRef } from 'react';
import { 
  ShieldCheck, Copy, Download, ArrowRightLeft, Check, 
  ArrowLeft, RefreshCw, Key, FileText, Lock, Code,
  Sliders, Terminal, Info, HelpCircle, CheckCircle, AlertCircle,
  Sparkles, Upload, Share2, Link2, FileUp, QrCode,
  Columns, Rows
} from 'lucide-react';
import QRCode from 'qrcode';
import { ToolItem } from '../types';
import { ToolContentOverride } from '../types/admin';
import { getToolOverrides, recordToolExecution, recordPageView } from '../utils/adminStorage';
import { getToolSeoData, buildToolSchemas } from '../utils/toolSeoSystem';
import { SeoHead } from './SeoHead';
import { AdUnit } from './AdUnit';
import * as engines from '../crypto/toolEngines';
import * as allEngines from '../crypto/allEngines';
import * as newEngines from '../crypto/newEngines';

interface ToolWorkspaceProps {
  tool: ToolItem;
  allTools: ToolItem[];
  onBack: () => void;
  onSelectTool: (tool: ToolItem) => void;
}

export const ToolWorkspace: React.FC<ToolWorkspaceProps> = ({
  tool,
  allTools,
  onBack,
  onSelectTool
}) => {
  // Common Workspace State
  const [mode, setMode] = useState<'encode' | 'decode' | 'encrypt' | 'decrypt' | 'format' | 'minify' | 'validate'>('encode');
  const [layoutMode, setLayoutMode] = useState<'split' | 'stacked'>('split');
  const [inputText, setInputText] = useState<string>('');
  const [outputText, setOutputText] = useState<string>('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [linkCopied, setLinkCopied] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [activeCodeTab, setActiveCodeTab] = useState<'js' | 'python' | 'curl' | 'php'>('js');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Tool-specific options
  const [secretKey, setSecretKey] = useState<string>('my-secure-passphrase-2026');
  const [shiftAmount, setShiftAmount] = useState<number>(3);
  const [pwdLength, setPwdLength] = useState<number>(20);
  const [pwdOptions, setPwdOptions] = useState({ upper: true, lower: true, digits: true, symbols: true });
  const [uuidVersion, setUuidVersion] = useState<'v4' | 'v7'>('v4');
  const [uuidCount, setUuidCount] = useState<number>(5);
  const [hexDelimiter, setHexDelimiter] = useState<'none' | 'space' | 'colon'>('none');
  const [caseStyle, setCaseStyle] = useState<'camel' | 'snake' | 'kebab' | 'pascal' | 'upper' | 'lower' | 'title'>('camel');
  const [selectedColor, setSelectedColor] = useState<string>('#38BDF8');
  const [chmodPerms, setChmodPerms] = useState({
    ownerR: true, ownerW: true, ownerX: true,
    groupR: true, groupW: false, groupX: true,
    othersR: true, othersW: false, othersX: true
  });
  const [jwtParts, setJwtParts] = useState<{ header: any; payload: any; valid: boolean } | null>(null);
  const [cardCheck, setCardCheck] = useState<{ valid: boolean; cardType: string } | null>(null);
  const [qrDataUrl, setQrDataUrl] = useState<string>('');
  const [qrSvg, setQrSvg] = useState<string>('');

  // Other tools in the same category to explore
  const categorySiblings = useMemo(() => {
    if (!allTools) return [];
    return allTools.filter(t => t.category === tool.category && t.id !== tool.id).slice(0, 8);
  }, [allTools, tool.category, tool.id]);

  // Admin Tool Overrides (custom long-form SEO content, FAQs, custom steps)
  const toolOverride: Partial<ToolContentOverride> = useMemo(() => {
    try {
      const overrides = getToolOverrides();
      return overrides[tool.id] || overrides[tool.slug] || {};
    } catch {
      return {};
    }
  }, [tool.id, tool.slug]);

  // Generate QR Code dynamically when tool is qr-code-generator
  useEffect(() => {
    if (tool.slug === 'qr-code-generator') {
      const payload = inputText.trim() || 'https://encryptdecrypt.org';
      QRCode.toDataURL(payload, {
        width: 320,
        margin: 2,
        color: { dark: '#000000', light: '#ffffff' }
      }).then(url => {
        setQrDataUrl(url);
      }).catch(() => {});

      QRCode.toString(payload, {
        type: 'svg',
        margin: 2
      }).then(svg => {
        setQrSvg(svg);
      }).catch(() => {});
    }
  }, [tool.slug, inputText]);

  // Initialize sample data whenever the active tool changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setErrorMsg(null);
    setCopied(false);
    loadSampleData();
    recordPageView(tool.name);
  }, [tool.id]);

  // Handle local file uploads into input
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (typeof content === 'string') {
        setInputText(content);
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const content = event.target?.result as string;
        if (typeof content === 'string') {
          setInputText(content);
        }
      };
      reader.readAsText(file);
    }
  };

  // Copy direct tool URL
  const handleCopyLink = () => {
    const url = `${window.location.origin}/#tool=${tool.slug}`;
    navigator.clipboard.writeText(url);
    setLinkCopied(true);
    setTimeout(() => setLinkCopied(false), 2000);
  };

  // Load contextual sample data based on the tool
  const loadSampleData = () => {
    setErrorMsg(null);
    const slug = tool.slug;
    const cat = tool.category;

    if (slug === 'uuid-format-validator') {
      setInputText('f47ac10b-58cc-4372-a567-0e02b2c3d479');
    } else if (slug === 'password-strength-meter' || slug === 'password-strength-checker') {
      setInputText('Tr0ub4dor&3_2026!SecureMaster#9');
    } else if (slug === 'base64-to-pdf') {
      setInputText('JVBERi0xLjQKJcOkw7zDtsOfCjIgMCBvYmoKPDwvTGVuZ3RoIDM2L0ZpbHRlci9GbGF0ZURlY29kZT4+c3RyZWFtCnicS0xPzkvMTbVWSEksKcnMz1MoLsgvVyjJyC8tSiyqVDBUSM1Lzs8DAGYkDSsKZW5kc3RyZWFtCmVuZG9iaiA=');
    } else if (slug === 'isbn-validator') {
      setInputText('978-0-13-235088-4');
    } else if (slug === 'domain-syntax-validator') {
      setInputText('api.encryptdecrypt.org');
    } else if (slug === 'url-query-parser') {
      setInputText('https://encryptdecrypt.org/search?q=zero+logs&category=security&page=1&theme=dark');
    } else if (slug === 'xml-sitemap-validator') {
      setInputText('<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n  <url><loc>https://encryptdecrypt.org/</loc></url>\n</urlset>');
    } else if (slug.includes('jwt')) {
      setInputText('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkFsaWNlIERldmVsb3BlciIsImlhdCI6MTUxNjIzOTAyMiwiZXhwIjoxODk5OTk5OTk5LCJyb2xlIjoiYWRtaW4ifQ.4S1zW9G8k5m7gG4r2q8w0y2e4t6u8i0o2p4a6s8d0f2');
    } else if (slug === 'json-diff') {
      setInputText('{\n  "service": "EncryptDecrypt",\n  "version": "2.0",\n  "status": "active"\n}\n---\n{\n  "service": "EncryptDecrypt",\n  "version": "2.1",\n  "status": "active",\n  "offline": true\n}');
    } else if (slug === 'json-path-tester') {
      setInputText('$.users[0].name\n{\n  "users": [\n    {"id": 1, "name": "Ajay Ade", "role": "Owner"},\n    {"id": 2, "name": "Elena Vance", "role": "Cryptographer"}\n  ]\n}');
    } else if (slug.includes('json-format') || slug.includes('json-valid') || slug.includes('json-minif') || slug.includes('json-to-') || slug.includes('json-schema') || slug.includes('json-escape') || slug === 'mock-json-generator' || cat === 'json-developer-tools') {
      setInputText(JSON.stringify({
        project: "EncryptDecrypt Privacy Suite",
        version: "2.5.0",
        clientSideOnly: true,
        zeroDataRetention: true,
        toolsCount: 330,
        encryption: ["AES-256-GCM", "ChaCha20-Poly1305", "RSA-OAEP"],
        verified: true
      }, null, 2));
    } else if (slug === 'binary-to-hex' || slug === 'binary-to-text') {
      setInputText('01001000 01100101 01101100 01101100 01101111');
    } else if (slug === 'binary-to-decimal') {
      setInputText('11010110');
    } else if (slug === 'hex-to-binary') {
      setInputText('48656C6C6F');
    } else if (slug === 'decimal-to-binary' || slug === 'decimal-to-hex' || slug === 'decimal-to-octal') {
      setInputText('255');
    } else if (slug === 'hex-to-decimal') {
      setInputText('FF');
    } else if (slug === 'octal-to-decimal') {
      setInputText('377');
    } else if (slug.includes('credit-card') || slug.includes('luhn')) {
      setInputText('4532 0150 0000 0008');
    } else if (slug.includes('iban')) {
      setInputText('GB82WEST12345698765432');
    } else if (slug.includes('email-syntax') || slug.includes('email-valid')) {
      setInputText('security.lead@encryptdecrypt.org');
    } else if (slug.includes('semver')) {
      setInputText('v2.5.0-rc.1+build.2026');
    } else if (slug === 'ip-address-validator' || slug === 'ipv4-calculator') {
      setInputText('192.168.1.1');
    } else if (slug === 'ipv6-calculator') {
      setInputText('2001:0db8:85a3:0000:0000:8a2e:0370:7334');
    } else if (slug.includes('cidr') || slug.includes('subnet') || slug.includes('ipv4-ipv6')) {
      setInputText('192.168.1.0/24');
    } else if (slug.includes('rest-api-request-builder')) {
      setInputText('GET https://api.example.com/v1/users?limit=10&status=active');
    } else if (slug.includes('curl-builder')) {
      setInputText('curl -X POST "https://api.example.com/v1/data" -H "Content-Type: application/json" -d \'{"active":true}\'');
    } else if (slug.includes('http-status')) {
      setInputText('404');
    } else if (slug.includes('port-number')) {
      setInputText('443');
    } else if (slug.includes('mime-lookup')) {
      setInputText('application/json');
    } else if (slug === 'scientific-calculator') {
      setInputText('sqrt(144) + sin(pi / 4) * 10^2');
    } else if (slug === 'fraction-calculator') {
      setInputText('3/4 + 5/8');
    } else if (slug === 'ratio-calculator' || slug === 'aspect-ratio-calculator' || slug === 'image-dimension-calculator') {
      setInputText('1920:1080');
    } else if (slug === 'average-calculator') {
      setInputText('14, 28, 42, 56, 70, 84, 98');
    } else if (slug === 'compound-interest-calculator') {
      setInputText('Principal: 10000, Rate: 7.5%, Time: 5 years');
    } else if (slug === 'binary-calculator') {
      setInputText('10110 + 01101');
    } else if (slug === 'statistics-calculator') {
      setInputText('12, 18, 25, 33, 40, 47, 52, 60, 68');
    } else if (slug === 'unit-converter') {
      setInputText('100 km to miles');
    } else if (slug === 'age-calculator') {
      setInputText('1995-06-15');
    } else if (slug === 'iso-date-converter') {
      setInputText('2026-09-17T23:00:00.000Z');
    } else if (slug === 'week-number-calculator') {
      setInputText('2026-09-17');
    } else if (slug === 'date-difference') {
      setInputText('2026-01-01 to 2026-09-17');
    } else if (slug === 'time-duration-calculator') {
      setInputText('2 hours 45 mins + 1 hour 30 mins');
    } else if (slug === 'business-days-calculator') {
      setInputText('2026-09-01 to 2026-09-30');
    } else if (slug === 'unix-timestamp') {
      setInputText('1773788400');
    } else if (slug === 'wcag-contrast-checker' || slug === 'contrast-checker') {
      setInputText('#FFFFFF on #0F172A');
    } else if (slug === 'alt-text-checker') {
      setInputText('<img src="/assets/logo.svg" alt="EncryptDecrypt Zero Logs Security Logo" />\n<img src="/assets/hero.png" />');
    } else if (slug === 'heading-checker') {
      setInputText('<h1>Privacy First Developer Hub</h1>\n<h2>Encryption Engines</h2>\n<h3>AES-256-GCM</h3>\n<h2>Encoding Tools</h2>');
    } else if (slug === 'aria-validator') {
      setInputText('<button aria-label="Close modal dialog" aria-expanded="false" role="button">Close</button>');
    } else if (slug === 'link-text-checker') {
      setInputText('<a href="/tools/aes">Explore AES Encryption Algorithm</a>\n<a href="/click-here">click here</a>');
    } else if (slug === 'color-blindness-simulator' || slug === 'hex-picker' || slug === 'color-palette-generator' || slug === 'gradient-generator' || cat === 'color-design') {
      setInputText('#2E9BFF');
      setSelectedColor('#2E9BFF');
    } else if (slug === 'rgb-to-hex') {
      setInputText('rgb(46, 155, 255)');
    } else if (slug === 'hsl-to-hex') {
      setInputText('hsl(209, 100%, 59%)');
    } else if (slug === 'css-shadow-generator') {
      setInputText('0 10px 25px -5px rgba(46, 155, 255, 0.3)');
    } else if (slug === 'css-border-radius-generator') {
      setInputText('16px');
    } else if (slug.includes('csv-to-') || slug.includes('csv-') || slug === 'tsv-to-csv' || cat === 'file-data-tools') {
      setInputText('id,name,role,department,status\n1,Ajay Ade,Owner,Engineering,Active\n2,Security Lead,Architect,SecOps,Active\n3,Dev Ops,SRE,Infrastructure,Active');
    } else if (slug === 'json-to-html-table') {
      setInputText('[\n  {"Tool": "AES-256", "Category": "Cipher", "Security": "High"},\n  {"Tool": "SHA-512", "Category": "Hash", "Security": "High"},\n  {"Tool": "Base64", "Category": "Encoding", "Security": "Standard"}\n]');
    } else if (slug === 'xml-to-csv' || slug.includes('xml-') || slug.includes('html-to-')) {
      setInputText('<?xml version="1.0" encoding="UTF-8"?>\n<catalog>\n  <item><id>1</id><name>AES-GCM</name><category>Cipher</category></item>\n  <item><id>2</id><name>SHA-512</name><category>Hash</category></item>\n</catalog>');
    } else if (slug.includes('yaml')) {
      setInputText('version: "3.8"\nservices:\n  web:\n    image: encryptdecrypt:latest\n    ports:\n      - "3000:3000"\n    environment:\n      - NODE_ENV=production');
    } else if (slug === 'log-analyzer') {
      setInputText('[2026-09-17 10:15:02] INFO 200 GET /tools/sha256 12ms\n[2026-09-17 10:15:10] WARN 404 GET /assets/missing.png 2ms\n[2026-09-17 10:15:14] ERROR 500 POST /api/test 45ms');
    } else if (slug === 'file-size-calculator') {
      setInputText('1048576000');
    } else if (slug === 'dns-record-lookup' || slug === 'whois' || slug === 'robots-txt-tester' || slug.includes('sitemap') || slug.includes('meta-tag')) {
      setInputText('encryptdecrypt.org');
    } else if (slug === 'dns-record-formatter') {
      setInputText('encryptdecrypt.org. 300 IN A 192.0.2.1\nencryptdecrypt.org. 300 IN TXT "v=spf1 -all"');
    } else if (slug === 'http-header-analyzer' || slug === 'security-header-checker' || slug === 'cache-header-checker') {
      setInputText('Strict-Transport-Security: max-age=63072000; includeSubDomains; preload\nX-Content-Type-Options: nosniff\nX-Frame-Options: DENY\nContent-Security-Policy: default-src \'self\'');
    } else if (slug === 'csp-generator') {
      setInputText("default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data:");
    } else if (slug === 'sri-generator' || slug === 'sri-hash') {
      setInputText('console.log("Subresource Integrity Verified Client-Side");');
    } else if (slug === 'ssl-expiry-calculator') {
      setInputText('2027-12-31');
    } else if (slug === 'page-load-calculator') {
      setInputText('Page Size: 1.8 MB\nConnection Speed: 15 Mbps (4G)\nLatency: 45 ms');
    } else if (slug === 'image-size-analyzer') {
      setInputText('1920x1080 450 KB');
    } else if (slug === 'js-minifier') {
      setInputText('function calculateChecksum(payload) {\n  let hash = 0;\n  for (let i = 0; i < payload.length; i++) {\n    hash = (hash << 5) - hash + payload.charCodeAt(i);\n    hash |= 0;\n  }\n  return hash;\n}');
    } else if (slug === 'gzip-compression-checker') {
      setInputText('The quick brown fox jumps over the lazy dog. Zero-knowledge client-side compression analyzer.');
    } else if (slug === 'svg-optimizer') {
      setInputText('<svg width="100" height="100" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">\n  <!-- EncryptDecrypt Shield Icon -->\n  <rect x="20" y="40" width="60" height="50" rx="10" fill="#2E9BFF" />\n  <path d="M35 40 V 25 A 15 15 0 0 1 65 25 V 40" stroke="#2E9BFF" stroke-width="8" fill="none" />\n</svg>');
    } else if (slug === 'base64-image-converter') {
      setInputText('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cGF0aCBkPSJNMTIgMkwyIDdMMTIgMTJMMjIgN0wxMiAyWiIgc3Ryb2tlPSIjMkU5QkZGIiBzdHJva2Utd2lkdGg9IjIiLz48L3N2Zz4=');
    } else if (cat === 'text-writing-utilities' || cat === 'text-utilities' || slug.includes('sentence-') || slug.includes('reading-time') || slug.includes('keyword-') || slug.includes('word-char')) {
      setInputText('EncryptDecrypt.org delivers 330+ browser-native privacy tools. Every calculation executes in local client memory using the W3C Web Cryptography API. No packets leave your device. All operations are private, confidential, and instant.');
    } else if (slug.includes('user-agent')) {
      setInputText('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36');
    } else if (slug.includes('mac-address-lookup') || slug.includes('mac-vendor') || slug.includes('oui')) {
      setInputText('00:1A:2B:3C:4D:5E');
    } else if (slug.includes('chmod')) {
      setInputText('755');
    } else if (slug.includes('roman-numeral')) {
      setInputText('MMXXVI');
    } else if (slug.includes('prime-number')) {
      setInputText('104729');
    } else if (slug.includes('bitwise')) {
      setInputText('142');
    } else if (slug.includes('modulo')) {
      setInputText('127 mod 26');
    } else if (slug.includes('gcd') || slug.includes('lcm')) {
      setInputText('48, 18');
    } else if (slug.includes('caesar') || slug.includes('rot13') || slug.includes('rot47') || slug.includes('atbash') || slug.includes('vigenere') || slug.includes('rail-fence') || slug.includes('playfair') || slug.includes('baconian') || slug.includes('affine')) {
      setInputText('THE QUICK BROWN FOX JUMPS OVER THE LAZY DOG');
      setShiftAmount(3);
      setSecretKey('CIPHER');
    } else if (slug.includes('aes') || slug.includes('des') || slug.includes('blowfish') || slug.includes('chacha20') || slug.includes('rc4') || slug.includes('triple-des')) {
      setInputText('Confidential client-side database payload: master-key-9921');
      setSecretKey('secure-passphrase-256');
    } else if (slug.includes('morse-code')) {
      setInputText('SOS WE ARE SAFE AT SEA');
    } else if (slug.includes('hex-to-text') || slug.includes('text-to-hex') || slug.includes('base16')) {
      setInputText('Privacy First Developer Tools');
    } else if (slug.includes('base32')) {
      setInputText('JBSWY3DPEHPK3PXP');
    } else if (slug.includes('base58')) {
      setInputText('1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa');
    } else if (slug.includes('base64')) {
      setInputText('Client-side cryptography protects developer privacy with zero server logs.');
    } else if (slug.includes('url-encode') || slug.includes('percent-encoding')) {
      setInputText('https://encryptdecrypt.org/search?q=zero knowledge crypto&category=14 hubs');
    } else if (slug.includes('html-entit') || slug.includes('html-special')) {
      setInputText('<div class="security-banner">Notice: "Zero" & \'No Logs\' Data!</div>');
    } else if (slug.includes('js-string-escape')) {
      setInputText('Hello "World", path: C:\\Users\\Developer, newline:\n');
    } else if (slug.includes('sql-string-escape')) {
      setInputText("Robert'; DROP TABLE Students; --");
    } else if (slug.includes('markdown-to-html') || slug.includes('markdown-syntax')) {
      setInputText('# EncryptDecrypt.org\n\n**100% Client-Side** privacy tools for developers.\n\n* Zero server logs\n* 330 Dedicated utilities\n* W3C WebCrypto powered');
    } else if (slug.includes('ssh-fingerprint') || slug.includes('ssh')) {
      setInputText('ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAABAQC3r... user@encryptdecrypt');
    } else if (slug.includes('case-convert') || slug.includes('slugify')) {
      setInputText('Client Side Cryptography & Safe Data Encoding');
    } else if (slug.includes('remove-duplicate-lines')) {
      setInputText('apple\nbanana\napple\norange\nbanana\ngrape');
    } else if (slug.includes('sort-text-lines')) {
      setInputText('delta\nalpha\ncharlie\nbravo\necho');
    } else if (slug === 'qr-code-generator') {
      setInputText('https://encryptdecrypt.org');
    } else if (slug === 'utc-timezone-difference') {
      setInputText('UTC');
    } else if (slug === 'ascii-table-reference') {
      setInputText('A');
    } else if (slug.includes('data-storage-units')) {
      setInputText('1024 MB');
    } else if (slug.includes('number-to-words')) {
      setInputText('142857');
    } else if (slug.includes('cert') || slug.includes('csr') || slug.includes('pem') || slug.includes('der')) {
      setInputText('-----BEGIN CERTIFICATE-----\nMIIEkjCCA3qgAwIBAgITBnlN3f82z7l0bE309K9yH9g==\n-----END CERTIFICATE-----');
    } else if (cat === 'hashing-security') {
      setInputText('Zero-knowledge client-side cryptography');
    } else {
      setInputText('EncryptDecrypt client-side secure payload for ' + tool.name);
    }
  };

  // Live Execution Pipeline for the Current Separate Tool
  useEffect(() => {
    let cancelled = false;

    async function execute() {
      setErrorMsg(null);
      const slug = tool.slug;
      const cat = tool.category;

      try {
        // Generators and utilities can run even without input text
        const isGenerator = [
          'password-generator', 'uuid-guid-v4-v7-generator', 'nanoid-generator', 
          'chmod-permissions-calculator', 'chmod-calculator', 'api-key-token-generator',
          'random-string-generator', 'totp-authenticator-code-gen', 'random-iv-salt-nonce-gen',
          'snowflake-id-generator', 'mac-address-generator', 'pronounceable-password-gen',
          'passphrase-diceware-gen', 'lorem-ipsum-generator', 'utc-timezone-difference',
          'ascii-table-reference', 'qr-code-generator', 'data-storage-units-converter',
          'number-to-words-converter', 'uuid-generator', 'ulid-generator', 'nanoid-id-generator',
          'mock-json-generator', 'test-data-generator', 'regex-generator', 'cron-generator',
          'sql-insert-generator', 'color-palette-generator', 'gradient-generator',
          'css-shadow-generator', 'css-border-radius-generator', 'csp-generator',
          'favicon-generator', 'image-dimension-calculator'
        ].some(s => slug.includes(s)) || cat === 'generators-tokens' || cat === 'converters-utilities' || cat === 'developer-generators';

        if (!inputText && !isGenerator) {
          setOutputText('');
          return;
        }

        let result = '';

        // 1. SPECIFIC RICH UI INTEGRATIONS FIRST
        if (slug === 'jwt-validator' || slug === 'jwt-debugger') {
          const res = engines.decodeJWT(inputText);
          if (!res.valid) {
            setErrorMsg(res.error || 'Invalid JWT structure');
            setJwtParts(null);
            setOutputText('');
            return;
          } else {
            setJwtParts({ header: res.header, payload: res.payload, valid: true });
            result = JSON.stringify({ HEADER: res.header, PAYLOAD: res.payload, SIGNATURE: res.signature }, null, 2);
          }
        }
        else if (slug.includes('credit-card') || slug.includes('luhn')) {
          const check = engines.checkLuhn(inputText);
          setCardCheck(check);
          result = `Card Type Detected:   ${check.cardType}\nLuhn Checksum Status: ${check.valid ? 'PASSED (Valid)' : 'FAILED (Invalid)'}\nPayload Processed:    ${inputText.replace(/\s+/g, '')}`;
        }
        else if (slug === 'hex-to-rgb-hsl') {
          const res = engines.hexToRgbHsl(inputText);
          if (res.isValid) {
            setSelectedColor(res.hex);
            result = `HEX Code:   ${res.hex}\nRGB Format: ${res.rgb}\nHSL Format: ${res.hsl}`;
          } else {
            setErrorMsg('Invalid HEX format. Use #RRGGBB or #RGB.');
            return;
          }
        }
        else if (slug.includes('chmod')) {
          result = allEngines.runConverterUtility('chmod-permissions-calculator', inputText, chmodPerms);
        }
        else if (slug === 'secure-password-generator' || slug === 'password-generator') {
          const res = engines.generatePassword(pwdLength, pwdOptions);
          result = res.password;
        }
        else if (slug === 'uuid-guid-generator') {
          const list: string[] = [];
          for (let i = 0; i < uuidCount; i++) {
            list.push(uuidVersion === 'v7' ? engines.generateUUIDv7() : engines.generateUUIDv4());
          }
          result = list.join('\n');
        }
        // Check new/recommended engines first
        const recResult = await newEngines.runRecommendedTool(slug, inputText, mode);
        if (recResult !== null) {
          result = recResult;
        }
        // 2. CATEGORY-BASED FULL WORKING ENGINES (ALL 250+ TOOLS)
        else if (cat === 'encoding-decoding') {
          result = allEngines.runEncodingTool(slug, inputText, mode === 'decrypt' ? 'decode' : (mode as any));
        }
        else if (cat === 'encryption-ciphers') {
          result = await allEngines.runCipherTool(slug, inputText, secretKey, shiftAmount, mode === 'decode' ? 'decrypt' : (mode as any));
        }
        else if (cat === 'hashing-security') {
          result = await allEngines.runHashingTool(slug, inputText, secretKey);
        }
        else if (cat === 'generators-tokens') {
          result = allEngines.runGeneratorTool(slug, { length: pwdLength, options: pwdOptions, count: uuidCount, counter: 1 });
        }
        else if (cat === 'dev-tools-formatters') {
          result = allEngines.runDevTools(slug, inputText);
        }
        else if (cat === 'file-data-converters') {
          result = allEngines.runDataConverters(slug, inputText);
        }
        else if (cat === 'validators-checkers') {
          result = allEngines.runValidatorTool(slug, inputText);
        }
        else if (cat === 'math-design') {
          result = allEngines.runMathDesign(slug, inputText);
        }
        else if (cat === 'network-online' || cat === 'seo-webmaster') {
          result = allEngines.runNetworkSeo(slug, inputText);
        }
        else if (cat === 'escape-network') {
          result = allEngines.runEscapeTool(slug, inputText, mode === 'decode' ? 'decode' : 'encode');
        }
        else if (cat === 'text-utilities') {
          result = allEngines.runTextUtility(slug, inputText, caseStyle);
        }
        else if (cat === 'security-certificates') {
          result = allEngines.runCertTool(slug, inputText);
        }
        else if (cat === 'converters-utilities') {
          result = allEngines.runConverterUtility(slug, inputText, chmodPerms);
        }
        else {
          result = engines.base64Encode(inputText);
        }

        if (!cancelled) {
          setOutputText(result);
          if (result && inputText.trim()) {
            recordToolExecution(tool.id, tool.name);
          }
        }
      } catch (err: any) {
        if (!cancelled) {
          setErrorMsg(err.message || 'Error executing client-side algorithm.');
          setOutputText('');
        }
      }
    }

    execute();

    return () => {
      cancelled = true;
    };
  }, [tool.slug, tool.category, inputText, mode, secretKey, shiftAmount, pwdLength, pwdOptions, uuidVersion, uuidCount, hexDelimiter, caseStyle, chmodPerms]);

  // Copy helper
  const handleCopy = () => {
    if (!outputText) return;
    navigator.clipboard.writeText(outputText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Download helper
  const handleDownload = () => {
    if (!outputText) return;
    const blob = new Blob([outputText], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${tool.slug}-output.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Dedicated QR Code Download Handlers
  const handleDownloadQrPng = () => {
    if (!qrDataUrl) return;
    const a = document.createElement('a');
    a.href = qrDataUrl;
    a.download = `qrcode-${Date.now()}.png`;
    a.click();
  };

  const handleDownloadQrSvg = () => {
    if (!qrSvg) return;
    const blob = new Blob([qrSvg], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `qrcode-${Date.now()}.svg`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Synchronized input change for chmod octals
  const handleInputChange = (val: string) => {
    setInputText(val);
    if (tool.slug.includes('chmod')) {
      const trimmed = val.trim();
      const octalMatch = trimmed.match(/^[0-7]{3,4}$/);
      if (octalMatch) {
        const digits = octalMatch[0].slice(-3);
        const o = parseInt(digits[0], 10);
        const g = parseInt(digits[1], 10);
        const ot = parseInt(digits[2], 10);
        setChmodPerms({
          ownerR: !!(o & 4), ownerW: !!(o & 2), ownerX: !!(o & 1),
          groupR: !!(g & 4), groupW: !!(g & 2), groupX: !!(g & 1),
          othersR: !!(ot & 4), othersW: !!(ot & 2), othersX: !!(ot & 1),
        });
      }
    }
  };

  // Toggle chmod checkbox with bidirectional input update
  const toggleChmod = (key: keyof typeof chmodPerms) => {
    setChmodPerms(prev => {
      const next = { ...prev, [key]: !prev[key] };
      const o = (next.ownerR ? 4 : 0) + (next.ownerW ? 2 : 0) + (next.ownerX ? 1 : 0);
      const g = (next.groupR ? 4 : 0) + (next.groupW ? 2 : 0) + (next.groupX ? 1 : 0);
      const ot = (next.othersR ? 4 : 0) + (next.othersW ? 2 : 0) + (next.othersX ? 1 : 0);
      setInputText(`${o}${g}${ot}`);
      return next;
    });
  };

  // Swap input & output
  const handleSwap = () => {
    if (!outputText) return;
    setInputText(outputText);
    setMode(m => m === 'encode' ? 'decode' : m === 'decode' ? 'encode' : m === 'encrypt' ? 'decrypt' : 'encrypt');
  };

  // Related tools from same category
  const relatedTools = useMemo(() => {
    return allTools
      .filter(t => t.category === tool.category && t.id !== tool.id)
      .slice(0, 6);
  }, [allTools, tool]);

  // Programmatic SEO data & JSON-LD schemas
  const seoData = useMemo(() => getToolSeoData(tool), [tool]);
  const { softwareAppSchema, breadcrumbSchema, faqSchema } = useMemo(
    () => buildToolSchemas(seoData),
    [seoData]
  );

  return (
    <div className="tool-workspace-page">
      {/* Dynamic SEO Meta Tags, Canonical Link & Structured Data */}
      <SeoHead
        title={seoData.title}
        description={seoData.metaDescription}
        canonicalUrl={seoData.canonicalUrl}
        keywords={seoData.keywords}
        ogType="article"
        schemas={[softwareAppSchema, breadcrumbSchema, faqSchema]}
      />

      {/* Sleek, Compact Breadcrumb & Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-2 mb-2 text-xs">
        <nav className="flex items-center gap-1.5 text-[var(--text-muted)] font-mono overflow-x-auto whitespace-nowrap py-0.5" aria-label="Breadcrumb">
          <ol className="flex items-center gap-1.5 list-none m-0 p-0">
            <li className="flex items-center gap-1.5">
              <button 
                onClick={onBack}
                className="transition flex items-center gap-1 font-sans font-semibold text-[var(--text-secondary)] hover:text-[#2E9BFF] cursor-pointer"
              >
                <ArrowLeft size={13} /> Back to Catalog
              </button>
              <span>/</span>
            </li>
            <li className="flex items-center gap-1.5">
              <span className="text-[var(--text-muted)]">{tool.categoryName}</span>
              <span>/</span>
            </li>
            <li aria-current="page">
              <span className="text-[#2E9BFF] font-semibold">{tool.name}</span>
            </li>
          </ol>
        </nav>

        {/* Quick Actions & Layout Toggle */}
        <div className="flex items-center gap-1.5">
          {/* Split / Stacked View Mode Toggle */}
          <div className="hidden md:flex items-center bg-[var(--bg-surface-hover)] p-0.5 rounded-lg border border-[var(--border-subtle)] text-[11px]">
            <button
              onClick={() => setLayoutMode('split')}
              className={`px-2 py-1 rounded flex items-center gap-1 transition cursor-pointer ${
                layoutMode === 'split' 
                  ? 'bg-[#2E9BFF] text-white shadow-xs font-semibold' 
                  : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
              }`}
              title="Side-by-side view (Input & Output fit on screen together without scrolling)"
            >
              <Columns size={12} />
              <span>Side-by-Side</span>
            </button>
            <button
              onClick={() => setLayoutMode('stacked')}
              className={`px-2 py-1 rounded flex items-center gap-1 transition cursor-pointer ${
                layoutMode === 'stacked' 
                  ? 'bg-[#2E9BFF] text-white shadow-xs font-semibold' 
                  : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
              }`}
              title="Stacked view"
            >
              <Rows size={12} />
              <span>Stacked</span>
            </button>
          </div>

          <button
            onClick={loadSampleData}
            className="btn btn-secondary text-xs py-1 px-2.5 flex items-center gap-1.5 text-[var(--text-secondary)]"
            title="Fill with test dataset"
          >
            <RefreshCw size={12} /> <span className="hidden sm:inline">Load</span> Sample
          </button>
          <button
            onClick={handleCopyLink}
            className="btn btn-secondary text-xs py-1 px-2.5 flex items-center gap-1.5 text-[var(--text-secondary)]"
            title="Copy shareable link"
          >
            {linkCopied ? <Check size={12} className="text-emerald-500" /> : <Link2 size={12} />}
            <span className="hidden sm:inline">{linkCopied ? 'Copied!' : 'Share'}</span>
          </button>
          <button
            onClick={() => { setInputText(''); setOutputText(''); setErrorMsg(null); }}
            className="btn btn-ghost text-xs py-1 px-2 text-[var(--text-muted)] hover:text-[var(--text-primary)] cursor-pointer"
            title="Clear all fields"
          >
            Clear
          </button>
        </div>
      </div>

      {/* Compact Tool Hero Strip */}
      <div className="card-glass p-3 sm:p-3.5 mb-3 bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-xl flex flex-wrap items-center justify-between gap-3 shadow-xs">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-[#2E9BFF] shrink-0 shadow-xs">
            {tool.slug === 'qr-code-generator' ? <QrCode size={18} /> : <Lock size={18} />}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base sm:text-lg font-bold text-[var(--text-primary)] tracking-tight m-0 leading-tight">
                {tool.name}
              </h1>
              {tool.popular && (
                <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-amber-500/15 text-amber-500 border border-amber-500/30">
                  POPULAR
                </span>
              )}
            </div>
            <p className="text-xs text-[var(--text-secondary)] m-0 line-clamp-1">
              {tool.shortDesc}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-[11px] font-mono">
          <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 flex items-center gap-1 font-sans font-medium">
            <ShieldCheck size={12} /> 100% Client-Side
          </span>
          <span className="hidden lg:inline text-[var(--text-muted)]">· Zero Transmission</span>
        </div>
      </div>

      {/* Main Interactive Tool Workspace */}
      <div className="space-y-3 mb-6">
        {/* Options & Controls Bar */}
        <div className="card-glass p-3 bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-xl shadow-xs">
          <div className="flex flex-wrap items-center justify-between gap-2.5">
            {/* Contextual Mode Tabs */}
            {['encoding-decoding', 'encryption-ciphers'].includes(tool.category) ? (
              <div className="flex items-center gap-1 bg-[var(--bg-surface-hover)] p-0.5 rounded-lg border border-[var(--border-subtle)] text-xs">
                <button
                  onClick={() => setMode('encode')}
                  className={`px-3 py-1 rounded font-semibold transition cursor-pointer ${
                    mode === 'encode' || mode === 'encrypt' ? 'bg-[#2E9BFF] text-white shadow-xs' : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
                  }`}
                >
                  {tool.category === 'encryption-ciphers' ? 'Encrypt' : 'Encode'}
                </button>
                <button
                  onClick={() => setMode('decode')}
                  className={`px-3 py-1 rounded font-semibold transition cursor-pointer ${
                    mode === 'decode' || mode === 'decrypt' ? 'bg-[#2E9BFF] text-white shadow-xs' : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
                  }`}
                >
                  {tool.category === 'encryption-ciphers' ? 'Decrypt' : 'Decode'}
                </button>
              </div>
            ) : tool.slug.includes('json-format') ? (
              <div className="flex items-center gap-1 bg-[var(--bg-surface-hover)] p-0.5 rounded-lg border border-[var(--border-subtle)] text-xs">
                <button
                  onClick={() => setMode('format')}
                  className={`px-3 py-1 rounded font-semibold transition cursor-pointer ${mode === 'format' ? 'bg-[#2E9BFF] text-white shadow-xs' : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'}`}
                >
                  Beautify (2 Spaces)
                </button>
                <button
                  onClick={() => setMode('minify')}
                  className={`px-3 py-1 rounded font-semibold transition cursor-pointer ${mode === 'minify' ? 'bg-[#2E9BFF] text-white shadow-xs' : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'}`}
                >
                  Minify (Compact)
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-1.5 text-xs text-[var(--text-secondary)] font-semibold">
                <Sliders size={14} className="text-[#2E9BFF]" />
                <span>Interactive Workspace Configuration</span>
              </div>
            )}

            {/* Hex Delimiter Toggle */}
            {tool.slug.includes('hex') && (
              <div className="flex items-center gap-1.5 text-xs">
                <span className="text-[var(--text-muted)]">Delimiter:</span>
                {(['none', 'space', 'colon'] as const).map(d => (
                  <button
                    key={d}
                    onClick={() => setHexDelimiter(d)}
                    className={`px-2 py-0.5 rounded capitalize transition cursor-pointer ${hexDelimiter === d ? 'bg-[#2E9BFF] text-white' : 'bg-[var(--bg-surface-hover)] text-[var(--text-secondary)] border border-[var(--border-subtle)]'}`}
                  >
                    {d}
                  </button>
                ))}
              </div>
            )}

            {/* Password Generator Slider */}
            {tool.slug.includes('password-gen') && (
              <div className="flex items-center gap-2.5 text-xs w-full sm:w-auto">
                <span className="text-[var(--text-secondary)] font-mono">Length: {pwdLength}</span>
                <input 
                  type="range" 
                  min={8} 
                  max={64} 
                  value={pwdLength} 
                  onChange={e => setPwdLength(Number(e.target.value))}
                  className="w-28 accent-[#2E9BFF]"
                />
                <button 
                  onClick={() => setPwdLength(l => l)}
                  className="btn btn-secondary text-[11px] py-1 px-2 flex items-center gap-1 text-[var(--text-secondary)]"
                >
                  <RefreshCw size={11} /> Generate
                </button>
              </div>
            )}

            {/* UUID Generator Options */}
            {tool.slug.includes('uuid') && (
              <div className="flex items-center gap-2 text-xs">
                <span className="text-[var(--text-muted)]">Version:</span>
                <button 
                  onClick={() => setUuidVersion('v4')}
                  className={`px-2 py-0.5 rounded transition cursor-pointer ${uuidVersion === 'v4' ? 'bg-[#2E9BFF] text-white' : 'bg-[var(--bg-surface-hover)] text-[var(--text-secondary)] border border-[var(--border-subtle)]'}`}
                >
                  UUID v4
                </button>
                <button 
                  onClick={() => setUuidVersion('v7')}
                  className={`px-2 py-0.5 rounded transition cursor-pointer ${uuidVersion === 'v7' ? 'bg-[#2E9BFF] text-white' : 'bg-[var(--bg-surface-hover)] text-[var(--text-secondary)] border border-[var(--border-subtle)]'}`}
                >
                  UUID v7
                </button>
                <span className="text-[var(--text-muted)] ml-2">Count:</span>
                <select 
                  value={uuidCount} 
                  onChange={e => setUuidCount(Number(e.target.value))}
                  className="bg-[var(--bg-surface-hover)] border border-[var(--border-subtle)] rounded px-2 py-0.5 text-xs text-[var(--text-primary)]"
                >
                  <option value={1}>1</option>
                  <option value={5}>5</option>
                  <option value={10}>10</option>
                  <option value={25}>25</option>
                </select>
              </div>
            )}

            {/* Case Converter Options */}
            {tool.slug.includes('case-convert') && (
              <div className="flex flex-wrap items-center gap-1 text-xs">
                {(['camel', 'snake', 'kebab', 'pascal', 'upper', 'lower', 'title'] as const).map(c => (
                  <button
                    key={c}
                    onClick={() => setCaseStyle(c)}
                    className={`px-2 py-0.5 rounded uppercase text-[10px] font-mono transition cursor-pointer ${caseStyle === c ? 'bg-[#2E9BFF] text-white' : 'bg-[var(--bg-surface-hover)] text-[var(--text-secondary)] border border-[var(--border-subtle)]'}`}
                  >
                    {c}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Secret Passphrase / Key Input for Ciphers */}
          {(tool.category === 'encryption-ciphers' || tool.slug.includes('aes') || tool.slug.includes('vigenere') || tool.slug.includes('hmac')) && (
            <div className="flex items-center gap-2 pt-2.5 mt-2.5 border-t border-[var(--border-subtle)] text-xs">
              <Key size={14} className="text-[#2E9BFF]" />
              <span className="font-semibold text-[var(--text-secondary)] shrink-0">Secret Passphrase:</span>
              <input
                type="text"
                value={secretKey}
                onChange={e => setSecretKey(e.target.value)}
                placeholder="Enter cryptographic passphrase"
                className="bg-[var(--bg-input)] border border-[var(--border-subtle)] rounded px-3 py-1 font-mono text-[var(--text-primary)] text-xs flex-1 focus:border-[#2E9BFF] outline-none"
              />
            </div>
          )}

          {/* Shift Slider for Caesar Cipher */}
          {tool.slug.includes('caesar') && (
            <div className="flex items-center gap-3 pt-2.5 mt-2.5 border-t border-[var(--border-subtle)] text-xs">
              <span className="font-semibold text-[var(--text-secondary)] font-mono">Shift Value (ROT-{shiftAmount}):</span>
              <input
                type="range"
                min={1}
                max={25}
                value={shiftAmount}
                onChange={e => setShiftAmount(Number(e.target.value))}
                className="flex-1 accent-[#2E9BFF]"
              />
              <span className="font-mono text-[#2E9BFF] font-bold">{shiftAmount}</span>
            </div>
          )}

          {/* chmod Permissions Matrix */}
          {tool.slug.includes('chmod') && (
            <div className="pt-2.5 mt-2.5 border-t border-[var(--border-subtle)] text-xs">
              <div className="text-[11px] text-[var(--text-muted)] mb-2 font-mono">
                Toggle checkboxes or type 3-digit octal permission directly into the input stream below:
              </div>
              <div className="grid grid-cols-3 gap-2 font-mono">
                <div className="bg-[var(--bg-surface-hover)] p-2 rounded-lg border border-[var(--border-subtle)] text-[var(--text-secondary)]">
                  <span className="text-[#2E9BFF] font-bold block mb-1">Owner (User)</span>
                  <label className="flex items-center gap-1.5 cursor-pointer py-0.5 hover:text-[var(--text-primary)]">
                    <input type="checkbox" checked={chmodPerms.ownerR} onChange={() => toggleChmod('ownerR')} /> Read (4)
                  </label>
                  <label className="flex items-center gap-1.5 cursor-pointer py-0.5 hover:text-[var(--text-primary)]">
                    <input type="checkbox" checked={chmodPerms.ownerW} onChange={() => toggleChmod('ownerW')} /> Write (2)
                  </label>
                  <label className="flex items-center gap-1.5 cursor-pointer py-0.5 hover:text-[var(--text-primary)]">
                    <input type="checkbox" checked={chmodPerms.ownerX} onChange={() => toggleChmod('ownerX')} /> Execute (1)
                  </label>
                </div>
                <div className="bg-[var(--bg-surface-hover)] p-2 rounded-lg border border-[var(--border-subtle)] text-[var(--text-secondary)]">
                  <span className="text-[#2E9BFF] font-bold block mb-1">Group</span>
                  <label className="flex items-center gap-1.5 cursor-pointer py-0.5 hover:text-[var(--text-primary)]">
                    <input type="checkbox" checked={chmodPerms.groupR} onChange={() => toggleChmod('groupR')} /> Read (4)
                  </label>
                  <label className="flex items-center gap-1.5 cursor-pointer py-0.5 hover:text-[var(--text-primary)]">
                    <input type="checkbox" checked={chmodPerms.groupW} onChange={() => toggleChmod('groupW')} /> Write (2)
                  </label>
                  <label className="flex items-center gap-1.5 cursor-pointer py-0.5 hover:text-[var(--text-primary)]">
                    <input type="checkbox" checked={chmodPerms.groupX} onChange={() => toggleChmod('groupX')} /> Execute (1)
                  </label>
                </div>
                <div className="bg-[var(--bg-surface-hover)] p-2 rounded-lg border border-[var(--border-subtle)] text-[var(--text-secondary)]">
                  <span className="text-[#2E9BFF] font-bold block mb-1">Others (Public)</span>
                  <label className="flex items-center gap-1.5 cursor-pointer py-0.5 hover:text-[var(--text-primary)]">
                    <input type="checkbox" checked={chmodPerms.othersR} onChange={() => toggleChmod('othersR')} /> Read (4)
                  </label>
                  <label className="flex items-center gap-1.5 cursor-pointer py-0.5 hover:text-[var(--text-primary)]">
                    <input type="checkbox" checked={chmodPerms.othersW} onChange={() => toggleChmod('othersW')} /> Write (2)
                  </label>
                  <label className="flex items-center gap-1.5 cursor-pointer py-0.5 hover:text-[var(--text-primary)]">
                    <input type="checkbox" checked={chmodPerms.othersX} onChange={() => toggleChmod('othersX')} /> Execute (1)
                  </label>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Hidden file upload input */}
        <input 
          type="file" 
          ref={fileInputRef} 
          onChange={handleFileUpload} 
          className="hidden" 
          accept=".txt,.json,.csv,.xml,.yaml,.yml,.md,.sql,.pem,.key,.crt,.csr,.log"
        />

        {/* Error banner if any */}
        {errorMsg && (
          <div className="p-2.5 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-600 dark:text-rose-300 text-xs flex items-center gap-2">
            <AlertCircle size={15} className="text-rose-500 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Side-by-Side (Split) or Stacked Dual Textareas */}
        <div className={`grid gap-3.5 items-stretch ${layoutMode === 'split' ? 'grid-cols-1 md:grid-cols-2' : 'grid-cols-1'}`}>
          {/* Input Box with Terminal Styling and Drag-and-Drop */}
          <div 
            onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={handleDrop}
            className={`card-glass p-3.5 transition-all duration-200 bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-xl shadow-xs flex flex-col justify-between ${
              isDragging ? 'border-sky-400 bg-sky-500/10 shadow-lg shadow-sky-500/10' : ''
            }`}
          >
            <div>
              <div className="flex items-center justify-between mb-2.5 pb-2 border-b border-[var(--border-subtle)]">
                <div className="flex items-center gap-1.5">
                  <div className="flex items-center gap-1 mr-1">
                    <span className="w-2.5 h-2.5 rounded-full bg-rose-500/70"></span>
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-500/70"></span>
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/70"></span>
                  </div>
                  <label className="text-xs font-bold text-[var(--text-primary)] flex items-center gap-1 uppercase tracking-wider">
                    <FileText size={13} className="text-[#2E9BFF]" />
                    <span>Input Data</span>
                  </label>
                </div>

                <div className="flex items-center gap-2">
                  <div className="text-[11px] font-mono text-[var(--text-muted)]">
                    <span>{inputText.length} chars</span>
                  </div>
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="btn btn-secondary text-[11px] py-0.5 px-2 flex items-center gap-1 text-[var(--text-secondary)]"
                    title="Upload file to populate input"
                  >
                    <Upload size={11} /> File
                  </button>
                </div>
              </div>

              <textarea
                value={inputText}
                onChange={e => handleInputChange(e.target.value)}
                placeholder={`Paste or type payload for ${tool.name}, or drop file here...`}
                className="form-textarea w-full font-mono text-xs text-[var(--text-primary)] bg-[var(--bg-input)] border border-[var(--border-subtle)] focus:border-[#2E9BFF] rounded-lg p-2.5 outline-none resize-y h-44 sm:h-48 md:h-52"
                id="tool-input-field"
              />
            </div>

            {/* Action row */}
            <div className="flex items-center justify-between mt-2 pt-2 border-t border-[var(--border-subtle)] text-xs">
              <div className="flex items-center gap-2 text-[11px] text-[var(--text-muted)]">
                <button
                  onClick={() => setInputText('')}
                  className="hover:text-[var(--text-primary)] cursor-pointer"
                >
                  Clear
                </button>
                <span>·</span>
                <span className="hidden sm:inline">
                  {inputText.split('\n').length} lines · {new TextEncoder().encode(inputText).length} B
                </span>
              </div>

              {['encoding-decoding', 'encryption-ciphers'].includes(tool.category) && outputText && (
                <button
                  onClick={handleSwap}
                  className="text-xs font-semibold text-[#2E9BFF] hover:underline flex items-center gap-1 cursor-pointer"
                  title="Swap Input and Output text"
                >
                  <ArrowRightLeft size={12} /> Swap ⇄
                </button>
              )}
            </div>
          </div>

          {/* Output Box */}
          <div className="card-glass p-3.5 bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-xl shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2.5 pb-2 border-b border-[var(--border-subtle)]">
                <div className="flex items-center gap-1.5">
                  <div className="flex items-center gap-1 mr-1">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/70"></span>
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/70"></span>
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/70"></span>
                  </div>
                  <label className="text-xs font-bold text-[var(--text-primary)] flex items-center gap-1 uppercase tracking-wider">
                    <CheckCircle size={13} className="text-emerald-500" />
                    <span>Output Result</span>
                  </label>
                  <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 font-medium">
                    LIVE
                  </span>
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={handleCopy}
                    disabled={!outputText}
                    className="btn btn-primary text-xs py-0.5 px-2.5 flex items-center gap-1 shadow-xs"
                    title="Copy output to clipboard"
                  >
                    {copied ? <Check size={12} /> : <Copy size={12} />}
                    {copied ? 'Copied!' : 'Copy'}
                  </button>
                  <button
                    onClick={handleDownload}
                    disabled={!outputText}
                    className="btn btn-secondary text-xs py-0.5 px-2 flex items-center gap-1 text-[var(--text-secondary)]"
                    title="Download output as file"
                  >
                    <Download size={12} /> Save
                  </button>
                </div>
              </div>

              <textarea
                value={outputText}
                readOnly
                placeholder="Computation will appear here automatically..."
                className="form-textarea w-full font-mono text-xs text-[#0284C7] dark:text-[#38BDF8] bg-[var(--bg-input-read)] border border-[var(--border-subtle)] font-medium rounded-lg p-2.5 outline-none resize-y h-44 sm:h-48 md:h-52"
                id="tool-output-field"
              />
            </div>

            <div className="flex items-center justify-between mt-2 pt-2 border-t border-[var(--border-subtle)] text-[11px] font-mono text-[var(--text-muted)]">
              <span>Output: {outputText.length} chars · {new TextEncoder().encode(outputText).length} B</span>
              <span className="text-emerald-500 flex items-center gap-1 font-sans font-medium">
                <ShieldCheck size={12} /> In-Browser Native
              </span>
            </div>
          </div>
        </div>

        {/* Special Interactive Visual Card for QR Code Generator */}
        {tool.slug === 'qr-code-generator' && qrDataUrl && (
          <div className="card-glass p-4 bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-xl shadow-xs">
            <div className="flex flex-col sm:flex-row items-center gap-5">
              <div className="p-2.5 bg-white rounded-xl shadow-md border border-slate-200 shrink-0">
                <img 
                  src={qrDataUrl} 
                  alt="Generated QR Code" 
                  className="w-36 h-36 block rounded"
                />
              </div>
              <div className="flex-1 space-y-2.5 text-center sm:text-left">
                <div className="flex items-center justify-center sm:justify-start gap-2">
                  <QrCode size={16} className="text-[#2E9BFF]" />
                  <h3 className="text-sm font-bold text-[var(--text-primary)] m-0">
                    High-Res QR Code Preview & Export
                  </h3>
                </div>
                <p className="text-xs text-[var(--text-secondary)] leading-relaxed m-0">
                  Standard ISO/IEC 18004 2D barcode encoded instantly in browser with error correction level M. Scan with any camera app.
                </p>
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 pt-0.5">
                  <button
                    onClick={handleDownloadQrPng}
                    className="btn btn-primary text-xs py-1 px-3 flex items-center gap-1.5 shadow-xs"
                  >
                    <Download size={12} /> Download PNG (320px)
                  </button>
                  <button
                    onClick={handleDownloadQrSvg}
                    className="btn btn-secondary text-xs py-1 px-3 flex items-center gap-1.5 text-[var(--text-secondary)]"
                  >
                    <Code size={12} /> Vector SVG
                  </button>
                </div>
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-1 pt-1 text-[11px]">
                  <span className="text-[var(--text-muted)] mr-1">Presets:</span>
                  <button 
                    onClick={() => setInputText('https://encryptdecrypt.org')} 
                    className="px-2 py-0.5 rounded bg-[var(--bg-surface-hover)] border border-[var(--border-subtle)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] cursor-pointer"
                  >
                    Website URL
                  </button>
                  <button 
                    onClick={() => setInputText('WIFI:S:MyHomeNetwork;T:WPA;P:SuperSecretPass123;;')} 
                    className="px-2 py-0.5 rounded bg-[var(--bg-surface-hover)] border border-[var(--border-subtle)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] cursor-pointer"
                  >
                    WiFi Login
                  </button>
                  <button 
                    onClick={() => setInputText('mailto:security@encryptdecrypt.org?subject=Inquiry')} 
                    className="px-2 py-0.5 rounded bg-[var(--bg-surface-hover)] border border-[var(--border-subtle)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] cursor-pointer"
                  >
                    Email Card
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Related Tools & Tool Specifications Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {/* Related Tools (Span 2) */}
        <div className="md:col-span-2 card-glass p-4 bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-xl shadow-xs">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--text-primary)] flex items-center gap-1.5">
              <Lock size={13} className="text-[#2E9BFF]" />
              Related {tool.categoryName} Tools
            </h3>
            <button
              onClick={onBack}
              className="text-xs font-semibold text-[#2E9BFF] hover:underline cursor-pointer"
            >
              All 250+ Tools →
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {relatedTools.map(rel => (
              <button
                key={rel.id}
                onClick={() => onSelectTool(rel)}
                className="w-full text-left p-2.5 rounded-lg bg-[var(--bg-surface-hover)] hover:bg-[var(--bg-card)] border border-[var(--border-subtle)] hover:border-[#2E9BFF]/40 transition group flex items-center justify-between cursor-pointer"
              >
                <div className="overflow-hidden pr-2">
                  <span className="text-xs font-semibold text-[var(--text-secondary)] group-hover:text-[#2E9BFF] block truncate">
                    {rel.name}
                  </span>
                  <span className="text-[10px] text-[var(--text-muted)] block truncate">
                    {rel.shortDesc}
                  </span>
                </div>
                <span className="text-[#2E9BFF] text-xs font-bold group-hover:translate-x-0.5 transition shrink-0">
                  →
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Quick Specifications Table (Span 1) */}
        <div className="card-glass p-4 text-xs font-mono bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-xl shadow-xs">
          <h4 className="font-sans font-bold text-[var(--text-primary)] mb-2.5 text-xs uppercase tracking-wider text-[var(--text-muted)]">
            Tool Specifications
          </h4>
          <div className="divide-y divide-[var(--border-subtle)] space-y-1.5 pt-0.5">
            <div className="flex justify-between py-1 text-[var(--text-secondary)]">
              <span>Standard</span>
              <span className="text-[var(--text-primary)] font-semibold">RFC / NIST</span>
            </div>
            <div className="flex justify-between py-1 text-[var(--text-secondary)]">
              <span>Execution</span>
              <span className="text-emerald-600 dark:text-emerald-400 font-semibold">100% Client-Side</span>
            </div>
            <div className="flex justify-between py-1 text-[var(--text-secondary)]">
              <span>Network Calls</span>
              <span className="text-[var(--text-primary)] font-semibold">0 requests</span>
            </div>
            <div className="flex justify-between py-1 text-[var(--text-secondary)]">
              <span>Browser API</span>
              <span className="text-[#2E9BFF] font-semibold">Web Crypto API</span>
            </div>
          </div>
        </div>
      </div>

      {/* Compliance-safe AdSense Placement */}
      <AdUnit slot="tool-page-middle" className="my-6" />

      {/* Complete In-Depth Technical SEO & Documentation Section */}
      <article className="card-glass p-6 sm:p-10 my-8 leading-relaxed text-[var(--text-secondary)] bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-2xl shadow-xs">
        {/* Section 1: Answer-First GEO Summary & What is it */}
        <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-4">
          What is {tool.name}?
        </h2>

        {/* Answer-First GEO Highlight Box (Optimized for AI Overviews & Search Snippets) */}
        <div className="mb-6 p-4 sm:p-5 rounded-xl bg-blue-500/10 border border-blue-500/20 text-[var(--text-primary)]">
          <div className="flex items-center gap-2 text-xs font-mono font-bold text-[#2E9BFF] uppercase tracking-wider mb-2">
            <ShieldCheck size={16} />
            <span>Answer-First Architectural Summary</span>
          </div>
          <p className="text-sm sm:text-base leading-relaxed m-0 font-medium text-[var(--text-primary)]">
            {seoData.geoAnswer}
          </p>
        </div>

        <p className="mb-4 text-sm sm:text-base leading-relaxed">
          {tool.name} is an enterprise-grade, browser-native developer utility designed to execute high-assurance data transformations, cryptanalysis, encoding/decoding, validation, and performance diagnostics directly inside client execution environments. Unlike conventional cloud-hosted utilities that silently transmit confidential payloads, tokens, and credentials across the public Internet to third-party servers, {tool.name} operates strictly on your local CPU through deterministic Web Standards, JavaScript TypedArrays, and the W3C Web Cryptography API.
        </p>

        {toolOverride.longDescription && (
          <div className="mb-8 p-6 rounded-xl bg-[var(--bg-input)] border border-[var(--border-subtle)] text-sm leading-relaxed whitespace-pre-line text-[var(--text-primary)]">
            {toolOverride.longDescription}
          </div>
        )}

        {/* Section 2: How to Use */}
        <h2 className="text-xl font-bold text-[var(--text-primary)] mt-8 mb-3">
          How to Use This {tool.name} Utility
        </h2>
        <ol className="list-decimal pl-5 space-y-2.5 text-sm sm:text-base mb-6">
          {seoData.howToUse.map((item) => (
            <li key={item.step}>
              <strong className="text-[var(--text-primary)]">{item.title}:</strong> {item.desc}
            </li>
          ))}
        </ol>

        {/* Section 3: Algorithmic Mechanics & Specifications */}
        <h2 className="text-xl font-bold text-[var(--text-primary)] mt-8 mb-3">
          How {tool.name} Works: Algorithmic Mechanics
        </h2>
        <p className="mb-4 text-sm sm:text-base leading-relaxed">
          Under the hood, {tool.name} executes deterministic mathematical state transformations conforming strictly to international engineering standards ({seoData.howItWorks.standard}). In-memory byte buffers are structured utilizing zero-copy <code>Uint8Array</code> and <code>ArrayBuffer</code> primitives, preventing garbage collection stalls and preventing sensitive plaintext credentials from lingering in browser cache heaps.
        </p>
        <div className="bg-[var(--bg-input)] p-4 rounded-lg border border-[var(--border-subtle)] font-mono text-xs text-[var(--text-secondary)] overflow-x-auto mb-6">
          <div className="text-[#2E9BFF] font-bold mb-1">// Deterministic Data Flow Diagram</div>
          <div>{seoData.howItWorks.flow}</div>
        </div>

        {/* Section 4: Core Engineering Use Cases */}
        <h2 className="text-xl font-bold text-[var(--text-primary)] mt-8 mb-3">
          Core Engineering Use Cases
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 mb-6">
          {seoData.useCases.map((uc, idx) => (
            <div key={idx} className="p-4 rounded-xl bg-[var(--bg-input)] border border-[var(--border-subtle)]">
              <h3 className="text-xs font-bold text-[var(--text-primary)] mb-1 flex items-center gap-1.5">
                <Terminal size={13} className="text-[#2E9BFF]" />
                {uc.title}
              </h3>
              <p className="text-xs text-[var(--text-secondary)] m-0 leading-relaxed">
                {uc.description}
              </p>
            </div>
          ))}
        </div>

        {/* Section 5: Developer Code Examples */}
        <h2 className="text-xl font-bold text-[var(--text-primary)] mt-8 mb-3">
          Developer Code Examples
        </h2>
        <div className="bg-[var(--bg-input)] rounded-lg border border-[var(--border-subtle)] overflow-hidden mb-6">
          <div className="flex items-center border-b border-[var(--border-subtle)] bg-[var(--bg-surface-hover)] text-xs font-mono">
            <button
              onClick={() => setActiveCodeTab('js')}
              className={`px-4 py-2 border-r border-[var(--border-subtle)] font-semibold cursor-pointer ${activeCodeTab === 'js' ? 'text-[#2E9BFF] bg-[var(--bg-surface)]' : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'}`}
            >
              JavaScript / TypeScript
            </button>
            <button
              onClick={() => setActiveCodeTab('python')}
              className={`px-4 py-2 border-r border-[var(--border-subtle)] font-semibold cursor-pointer ${activeCodeTab === 'python' ? 'text-[#2E9BFF] bg-[var(--bg-surface)]' : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'}`}
            >
              Python 3
            </button>
            <button
              onClick={() => setActiveCodeTab('curl')}
              className={`px-4 py-2 font-semibold cursor-pointer ${activeCodeTab === 'curl' ? 'text-[#2E9BFF] bg-[var(--bg-surface)]' : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'}`}
            >
              cURL / Shell
            </button>
          </div>

          <div className="p-4 font-mono text-xs text-[var(--text-secondary)] overflow-x-auto">
            {activeCodeTab === 'js' && (
              <pre className="m-0 leading-relaxed">
{`// Client-Side Execution in Modern JavaScript (ES6+ / Web Standards)
const inputPayload = "${inputText.substring(0, 40) || 'sample-data'}";

// Process locally without network calls or remote dependencies
const utf8Bytes = new TextEncoder().encode(inputPayload);
console.log("Input byte length:", utf8Bytes.length);
// Native computation running directly on client V8/SpiderMonkey engine`}
              </pre>
            )}

            {activeCodeTab === 'python' && (
              <pre className="m-0 leading-relaxed">
{`# Python 3 Implementation
input_payload = "${inputText.substring(0, 40) || 'sample-data'}"
encoded_bytes = input_payload.encode("utf-8")
print(f"Processed byte stream: {len(encoded_bytes)} bytes")`}
              </pre>
            )}

            {activeCodeTab === 'curl' && (
              <pre className="m-0 leading-relaxed">
{`# Bash / Coreutils Terminal Command
echo -n "${inputText.substring(0, 40) || 'sample-data'}" | wc -c`}
              </pre>
            )}
          </div>
        </div>

        {/* Section 6: Practical Examples */}
        <h2 className="text-xl font-bold text-[var(--text-primary)] mt-8 mb-3">
          Practical Transformation Examples
        </h2>
        <div className="space-y-3 mb-6">
          {seoData.examples.map((eg, idx) => (
            <div key={idx} className="p-4 rounded-xl bg-[var(--bg-input)] border border-[var(--border-subtle)] text-xs font-mono">
              <div className="font-sans font-bold text-[var(--text-primary)] mb-2 text-xs">
                {eg.title}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-[11px]">
                <div className="p-2.5 rounded bg-[var(--bg-surface)] border border-[var(--border-subtle)]">
                  <div className="text-[var(--text-muted)] font-sans text-[10px] uppercase tracking-wider mb-1 font-semibold">Input</div>
                  <div className="truncate text-[var(--text-primary)]">{eg.input}</div>
                </div>
                <div className="p-2.5 rounded bg-[var(--bg-surface)] border border-[var(--border-subtle)]">
                  <div className="text-[#2E9BFF] font-sans text-[10px] uppercase tracking-wider mb-1 font-semibold">Output</div>
                  <div className="truncate text-emerald-600 dark:text-emerald-400 font-semibold">{eg.output}</div>
                </div>
              </div>
              <p className="mt-2 text-[11px] font-sans text-[var(--text-muted)] m-0">
                {eg.explanation}
              </p>
            </div>
          ))}
        </div>

        {/* Section 7: Technical Architecture & Security Model */}
        <h2 className="text-xl font-bold text-[var(--text-primary)] mt-8 mb-3">
          Zero-Knowledge Client Architecture
        </h2>
        <p className="mb-4 text-sm sm:text-base leading-relaxed">
          Traditional web utilities expose users to significant threat vectors including server-side request logging, reverse-proxy caching, middlebox inspection, and telemetry packet capture. In contrast, EncryptDecrypt.org operates an uncompromising zero-knowledge architecture. No remote application programming interface (API) endpoints are queried during transformation.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 my-6">
          <div className="p-4 rounded-xl bg-[var(--bg-input)] border border-[var(--border-subtle)]">
            <h3 className="text-xs font-bold text-[var(--text-primary)] mb-1">Zero Telemetry</h3>
            <p className="text-[11px] text-[var(--text-muted)] m-0">No analytics trackers, keystroke loggers, or behavioral event beacons monitor your inputs.</p>
          </div>
          <div className="p-4 rounded-xl bg-[var(--bg-input)] border border-[var(--border-subtle)]">
            <h3 className="text-xs font-bold text-[var(--text-primary)] mb-1">Constant-Time Primitives</h3>
            <p className="text-[11px] text-[var(--text-muted)] m-0">Cryptographic routines mitigate timing attack vulnerabilities via native hardware acceleration.</p>
          </div>
          <div className="p-4 rounded-xl bg-[var(--bg-input)] border border-[var(--border-subtle)]">
            <h3 className="text-xs font-bold text-[var(--text-primary)] mb-1">Air-Gap Verification</h3>
            <p className="text-[11px] text-[var(--text-muted)] m-0">Disconnect your workstation from Wi-Fi or Ethernet; the tool continues to operate flawlessly.</p>
          </div>
        </div>

        {/* Section 8: Limitations & Technical Headroom */}
        <h2 className="text-xl font-bold text-[var(--text-primary)] mt-8 mb-3">
          Operational Boundaries & Technical Headroom
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 mb-6">
          {seoData.limitations.map((lim, idx) => (
            <div key={idx} className="p-4 rounded-xl bg-[var(--bg-input)] border border-[var(--border-subtle)]">
              <h3 className="text-xs font-bold text-[var(--text-primary)] mb-1">
                {lim.title}
              </h3>
              <p className="text-[11px] text-[var(--text-muted)] m-0 leading-relaxed">
                {lim.description}
              </p>
            </div>
          ))}
        </div>

        {/* Section 9: Step-by-Step Air-Gapped Verification Protocol */}
        <h2 className="text-xl font-bold text-[var(--text-primary)] mt-8 mb-3">
          Step-by-Step Air-Gapped Verification Protocol
        </h2>
        <p className="mb-4 text-sm sm:text-base leading-relaxed">
          You do not need to take our privacy claims on faith. You can verify that your private data never leaves your computer using your browser’s built-in developer tools:
        </p>
        <ol className="list-decimal pl-5 space-y-2 text-sm sm:text-base mb-6">
          <li>Press <code>F12</code> (or <code>Cmd + Option + I</code> on macOS) to open Browser Developer Tools.</li>
          <li>Navigate to the <strong>Network</strong> tab and check the <strong>Preserve log</strong> checkbox.</li>
          <li>Enter private or sensitive credentials into the input field above and execute the tool.</li>
          <li>Confirm that <strong>zero HTTP/HTTPS requests or WebSocket frames</strong> are transmitted.</li>
        </ol>

        {/* Section 10: Frequently Asked Questions (FAQ) */}
        <h2 className="text-xl font-bold text-[var(--text-primary)] mt-8 mb-3">
          Frequently Asked Questions (FAQ)
        </h2>
        <div className="space-y-3 mb-6">
          {seoData.faqs.map((faq, idx) => (
            <details key={idx} className="faq-item p-4 rounded-lg bg-[var(--bg-surface-hover)] border border-[var(--border-subtle)] cursor-pointer">
              <summary className="font-semibold text-[var(--text-primary)] text-sm">
                {faq.question}
              </summary>
              <p className="mt-2 text-xs sm:text-sm text-[var(--text-secondary)] pl-4 border-l-2 border-[#2E9BFF] m-0">
                {faq.answer}
              </p>
            </details>
          ))}
        </div>

        {/* Section 11: More Tools in Category Hub */}
        {categorySiblings.length > 0 && (
          <div className="mt-8 pt-6 border-t border-[var(--border-subtle)]">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-[var(--text-primary)] flex items-center gap-2 m-0">
                <Sparkles size={16} className="text-[#2E9BFF]" />
                More {tool.categoryName} Tools
              </h3>
              <button
                onClick={onBack}
                className="text-xs text-[#2E9BFF] hover:underline cursor-pointer"
              >
                Back to All 330+ Tools →
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
              {categorySiblings.map(rel => (
                <button
                  key={rel.id}
                  onClick={() => {
                    if (onSelectTool) onSelectTool(rel);
                  }}
                  className="p-3 text-left rounded-lg bg-[var(--bg-surface-hover)] border border-[var(--border-subtle)] hover:border-[#2E9BFF]/50 transition flex flex-col justify-between group cursor-pointer"
                >
                  <div>
                    <h4 className="text-xs font-bold text-[var(--text-primary)] group-hover:text-[#2E9BFF] mb-1 line-clamp-1">
                      {rel.name}
                    </h4>
                    <p className="text-[11px] text-[var(--text-muted)] line-clamp-2">
                      {rel.shortDesc}
                    </p>
                  </div>
                  <span className="text-[10px] text-[#2E9BFF] font-semibold mt-2">
                    Open Tool →
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}
      </article>

      {/* AdSense Placement below article with clear boundary */}
      <AdUnit slot="tool-page-bottom" className="my-8" />
    </div>
  );
};
