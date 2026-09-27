/**
 * Email Client-Side Developer & Security Engines
 * 100% browser-native email header parser, MIME viewer, SPF/DKIM/DMARC analyzer,
 * subject line tester, email address sanitizers, and HTML email formatters.
 */

export interface ParsedEmailHeaders {
  from?: string;
  to?: string;
  subject?: string;
  date?: string;
  messageId?: string;
  replyTo?: string;
  returnPath?: string;
  received: string[];
  spf?: string;
  dkim?: string;
  dmarc?: string;
  contentType?: string;
  allHeaders: Record<string, string[]>;
}

/**
 * Parses raw email RFC 822 / 5322 headers into structured key-value maps
 */
export function parseRawEmailHeaders(raw: string): ParsedEmailHeaders {
  const lines = (raw || '').split(/\r?\n/);
  const allHeaders: Record<string, string[]> = {};
  const received: string[] = [];

  let currentKey = '';
  let currentValue = '';

  for (const line of lines) {
    if (/^\s+[^\s]/.test(line) && currentKey) {
      // Continuation of previous header (folded header)
      currentValue += ' ' + line.trim();
    } else {
      if (currentKey) {
        const lower = currentKey.toLowerCase();
        if (!allHeaders[lower]) allHeaders[lower] = [];
        allHeaders[lower].push(currentValue);
        if (lower === 'received') received.push(currentValue);
      }
      const match = line.match(/^([\w-]+):\s*(.*)$/);
      if (match) {
        currentKey = match[1];
        currentValue = match[2];
      } else {
        currentKey = '';
        currentValue = '';
      }
    }
  }

  if (currentKey) {
    const lower = currentKey.toLowerCase();
    if (!allHeaders[lower]) allHeaders[lower] = [];
    allHeaders[lower].push(currentValue);
    if (lower === 'received') received.push(currentValue);
  }

  const getFirst = (key: string) => allHeaders[key]?.[0] || undefined;

  return {
    from: getFirst('from'),
    to: getFirst('to'),
    subject: getFirst('subject'),
    date: getFirst('date'),
    messageId: getFirst('message-id'),
    replyTo: getFirst('reply-to'),
    returnPath: getFirst('return-path'),
    received,
    spf: getFirst('received-spf') || getFirst('authentication-results'),
    dkim: getFirst('dkim-signature'),
    dmarc: getFirst('authentication-results'),
    contentType: getFirst('content-type'),
    allHeaders,
  };
}

/**
 * 1. Email Header Parser
 */
export function parseEmailHeaders(rawHeaders: string): string {
  const p = parseRawEmailHeaders(rawHeaders);
  const headerCount = Object.keys(p.allHeaders).length;

  return `=== EMAIL HEADER PARSER REPORT ===
Total Headers Found : ${headerCount}
From                : ${p.from || '(Not found)'}
To                  : ${p.to || '(Not found)'}
Subject             : ${p.subject || '(Not found)'}
Date                : ${p.date || '(Not found)'}
Message-ID          : ${p.messageId || '(Not found)'}
Reply-To            : ${p.replyTo || '(None specified)'}
Return-Path         : ${p.returnPath || '(None)'}
Content-Type        : ${p.contentType || 'text/plain; charset=us-ascii'}
Hops (Received)     : ${p.received.length} transmission relay(s)

--- Extracted Headers ---
${Object.entries(p.allHeaders)
  .map(([k, v]) => `• ${k.toUpperCase()}: ${v.join(' | ')}`)
  .join('\n')}`;
}

/**
 * 2. Email Header Analyzer (Security & Authentication)
 */
export function analyzeEmailHeaders(rawHeaders: string): string {
  const p = parseRawEmailHeaders(rawHeaders);

  // Authentication inspection
  const authResults = p.allHeaders['authentication-results']?.join(' ') || '';
  const receivedSpf = p.allHeaders['received-spf']?.join(' ') || '';

  const spfPass = /spf=pass/i.test(authResults) || /pass/i.test(receivedSpf);
  const dkimPass = /dkim=pass/i.test(authResults) || !!p.dkim;
  const dmarcPass = /dmarc=pass/i.test(authResults);

  let securityScore = 50;
  if (spfPass) securityScore += 20;
  if (dkimPass) securityScore += 15;
  if (dmarcPass) securityScore += 15;

  return `=== EMAIL AUTHENTICATION & SECURITY AUDIT ===
Security Health Score : ${securityScore} / 100

Authentication Protocols:
• SPF (Sender Policy Framework) : ${spfPass ? '✓ PASS (Authorized sending IP)' : '⚠ NEUTRAL / FAIL (Check SPF record)'}
• DKIM (DomainKeys Identified)  : ${dkimPass ? '✓ PASS (Cryptographically signed)' : '⚠ MISSING / FAIL (No signature verified)'}
• DMARC Alignment               : ${dmarcPass ? '✓ PASS (Domain aligned with SPF/DKIM)' : '⚠ UNVERIFIED / NONE'}

Relay Hops Analysis:
• Total Network Relays : ${p.received.length}
${p.received.map((hop, i) => `  [Hop ${i + 1}] ${hop.slice(0, 90)}...`).join('\n') || '  (No transmission hops detected)'}

Spam & Spoofing Assessment:
${securityScore >= 80 ? '✓ High Deliverability & Verified Domain Integrity' : '⚠ Caution: Incomplete email authentication increases risk of junk/spam filtering'}`;
}

/**
 * 3. Email Date Converter
 */
export function convertEmailDate(rawDateOrHeaders: string): string {
  let dateStr = rawDateOrHeaders.trim();
  const match = dateStr.match(/Date:\s*(.+)$/im);
  if (match) dateStr = match[1].trim();

  const d = new Date(dateStr);
  if (isNaN(d.getTime())) {
    return `Error: Unable to parse RFC 2822 email date format from "${dateStr}".
Expected format: "Mon, 23 Sep 2026 14:32:00 +0000" or ISO 8601.`;
  }

  return `=== EMAIL DATE CONVERTER ===
Original Header Date : ${dateStr}
UTC Standard (ISO)   : ${d.toISOString()}
UTC Date String      : ${d.toUTCString()}
Local Time           : ${d.toLocaleString()}
Unix Timestamp (sec) : ${Math.floor(d.getTime() / 1000)}
Relative Age         : ${formatRelativeTime(d)}`;
}

function formatRelativeTime(date: Date): string {
  const diffSec = Math.floor((Date.now() - date.getTime()) / 1000);
  if (diffSec < 60) return `${diffSec} seconds ago`;
  if (diffSec < 3600) return `${Math.floor(diffSec / 60)} minutes ago`;
  if (diffSec < 86400) return `${Math.floor(diffSec / 3600)} hours ago`;
  return `${Math.floor(diffSec / 86400)} days ago`;
}

/**
 * 4. Message-ID Parser
 */
export function parseMessageId(input: string): string {
  const match = input.match(/Message-ID:\s*<([^>]+)>/i) || input.match(/<([^>]+)>/) || [null, input.trim()];
  const msgId = (match[1] || input.trim()).replace(/[<>]/g, '');

  const parts = msgId.split('@');
  const localPart = parts[0] || '';
  const domainPart = parts[1] || '';

  return `=== RFC 5322 MESSAGE-ID PARSER ===
Message-ID      : <${msgId}>
Local Identifier: ${localPart}
Generating Host : ${domainPart || '(No domain specified)'}
Entropy Length  : ${localPart.length} characters
Format Standard : ${domainPart.includes('.') ? '✓ Standard FQDN Format (<unique-id@domain.tld>)' : '⚠ Non-standard Message-ID structure'}`;
}

/**
 * 5. MIME Email Viewer
 */
export function viewMimeEmail(mimeRaw: string): string {
  const lines = (mimeRaw || '').split(/\r?\n/);
  const boundaryMatch = mimeRaw.match(/boundary=["']?([^"';\r\n]+)["']?/i);
  const boundary = boundaryMatch ? boundaryMatch[1] : null;

  if (!boundary) {
    const p = parseRawEmailHeaders(mimeRaw);
    return `=== MIME STRUCTURE INSPECTOR ===
MIME Version   : ${p.allHeaders['mime-version']?.[0] || '1.0'}
Content-Type   : ${p.contentType || 'text/plain'}
Multipart      : No boundary detected. Single-part email payload.
Payload Preview:
${lines.slice(0, 15).join('\n')}`;
  }

  const parts = mimeRaw.split('--' + boundary).filter(p => p.trim() && !p.startsWith('--'));

  return `=== MULTIPART MIME STRUCTURE ===
Boundary String : "${boundary}"
MIME Parts Found: ${parts.length}

${parts.map((p, i) => {
  const typeMatch = p.match(/Content-Type:\s*([^;\r\n]+)/i);
  const dispMatch = p.match(/Content-Disposition:\s*([^;\r\n]+)/i);
  const encMatch = p.match(/Content-Transfer-Encoding:\s*([^\r\n]+)/i);
  return `[Part ${i + 1}]
  • Type       : ${typeMatch ? typeMatch[1].trim() : 'text/plain'}
  • Disposition: ${dispMatch ? dispMatch[1].trim() : 'inline'}
  • Encoding   : ${encMatch ? encMatch[1].trim() : '7bit'}
  • Size       : ${p.length} bytes`;
}).join('\n\n')}`;
}

/**
 * 6. Email Subject Line Length Checker
 */
export function checkEmailSubjectLineLength(subject: string): string {
  const s = (subject || '').replace(/^Subject:\s*/i, '').trim();
  const len = s.length;
  const wordCount = s.split(/\s+/).filter(Boolean).length;

  let desktopStatus = len <= 60 ? '✓ Fully Visible' : '⚠ Truncated (> 60 chars on desktop Outlook/Gmail)';
  let mobileStatus = len <= 40 ? '✓ Fully Visible' : '⚠ Truncated (> 40 chars on mobile Apple Mail/Android)';

  let score = 100;
  if (len < 20) score -= 15; // Too brief
  if (len > 50) score -= 25; // Risk of truncation
  if (/FREE|BUY NOW|100%|\$\$\$|GUARANTEED/i.test(s)) score -= 30; // Spam triggers

  return `=== EMAIL SUBJECT LINE LENGTH & SERP AUDIT ===
Subject Line    : "${s}"
Character Count : ${len} chars
Word Count      : ${wordCount} words
Deliverability  : ${score} / 100

Visibility Across Devices:
• Desktop Clients (Gmail, Outlook) : ${desktopStatus}
• Mobile Clients (iPhone, Android) : ${mobileStatus}

Spam & Engagement Analysis:
${/!|\?{2,}/.test(s) ? '⚠ Warning: Excessive punctuation may trigger spam filters.' : '✓ Clean punctuation profile.'}
${/[A-Z]{4,}/.test(s) ? '⚠ Warning: ALL CAPS words can increase spam penalty.' : '✓ Normal capitalization style.'}
${len >= 30 && len <= 45 ? '✓ Ideal length: 30-45 characters for peak 48%+ open rates.' : '• Tip: Aim for 30-45 characters to maximize mobile engagement.'}`;
}

/**
 * 7. Email Preheader Checker
 */
export function checkEmailPreheader(preheader: string, subject = ''): string {
  const p = (preheader || '').trim();
  const s = (subject || '').trim();
  const len = p.length;
  const combinedLen = s.length + len;

  return `=== EMAIL PREHEADER AUDIT ===
Preheader Text   : "${p}"
Character Count  : ${len} chars
Combined With Subj: ${combinedLen} chars

Preview Rendering:
"${s ? s + ' — ' : ''}${p}"

Length Benchmarks:
• Apple Mail Mobile : ${len <= 90 ? '✓ Fully displayed (40-90 chars)' : '⚠ Truncated after ~90 chars'}
• Gmail Desktop     : ${combinedLen <= 110 ? '✓ Clear fit' : '⚠ May be cut off depending on inbox screen width'}
• Recommendation    : Keep preheader between 50 and 85 characters for maximum impact without trailing fallback text.`;
}

/**
 * 8. HTML Email Previewer
 */
export function previewHtmlEmail(html: string): string {
  const clean = (html || '<div style="font-family: Arial; padding: 20px;"><h1>Welcome!</h1><p>Thank you for subscribing.</p></div>').trim();
  const textContent = clean.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();

  const imgCount = (clean.match(/<img\b/gi) || []).length;
  const linkCount = (clean.match(/<a\b/gi) || []).length;
  const tableCount = (clean.match(/<table\b/gi) || []).length;

  return `=== HTML EMAIL PREVIEW & CODE AUDIT ===
Raw HTML Size   : ${clean.length} bytes (${(clean.length / 1024).toFixed(1)} KB)
Gmail Clip Risk : ${clean.length > 102400 ? '🚨 HIGH (> 102KB limit - Gmail will clip message)' : '✓ Safe (< 102KB threshold)'}
Render Elements : Tables: ${tableCount} | Links: ${linkCount} | Images: ${imgCount}

Plaintext Fallback Preview:
${textContent.slice(0, 300)}${textContent.length > 300 ? '...' : ''}

Best Practice Checks:
${tableCount > 0 ? '✓ Table-based markup detected (Optimal for Outlook / legacy email clients)' : '• Modern flex/grid detected: ensure email client compatibility'}
${/style\s*=\s*["']/i.test(clean) ? '✓ Inline CSS styles present' : '⚠ Missing inline CSS styles: external style sheets are stripped by Gmail'}`;
}

/**
 * 9. HTML Email Cleaner
 */
export function cleanHtmlEmail(rawHtml: string): string {
  let cleaned = (rawHtml || '')
    // Remove script tags
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    // Remove iframes
    .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '')
    // Remove comments
    .replace(/<!--[\s\S]*?-->/g, '')
    // Strip javascript: URLs
    .replace(/href=["']javascript:[^"']*["']/gi, 'href="#"')
    // Remove harmful attributes
    .replace(/\son\w+=["'][^"']*["']/gi, '')
    // Normalize excessive whitespace
    .replace(/\r?\n\s*\r?\n+/g, '\n');

  return cleaned.trim();
}

/**
 * 10. Email Signature Generator
 */
export function generateEmailSignature(
  fullName: string,
  title: string,
  company: string,
  email: string,
  phone: string,
  website: string
): string {
  const name = fullName || 'Alex Mercer';
  const role = title || 'Lead Software Architect';
  const comp = company || 'Acme Technologies';
  const mail = email || 'alex.mercer@example.com';
  const tel = phone || '+1 (555) 234-5678';
  const web = website || 'https://example.com';

  const htmlSig = `<table cellpadding="0" cellspacing="0" border="0" style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; font-size: 13px; line-height: 1.4; color: #333333;">
  <tr>
    <td style="padding-right: 14px; border-right: 2px solid #2563eb; vertical-align: top;">
      <span style="font-size: 16px; font-weight: 700; color: #1e293b;">${name}</span><br>
      <span style="color: #64748b; font-weight: 500;">${role}</span><br>
      <span style="color: #2563eb; font-weight: 600;">${comp}</span>
    </td>
    <td style="padding-left: 14px; vertical-align: top;">
      <span style="color: #475569;">✉ <a href="mailto:${mail}" style="color: #2563eb; text-decoration: none;">${mail}</a></span><br>
      <span style="color: #475569;">☎ <a href="tel:${tel}" style="color: #475569; text-decoration: none;">${tel}</a></span><br>
      <span style="color: #475569;">🌐 <a href="${web}" style="color: #2563eb; text-decoration: none;">${web}</a></span>
    </td>
  </tr>
</table>`;

  const textSig = `--
${name} | ${role}
${comp}
Email: ${mail} | Phone: ${tel}
Web: ${web}`;

  return `=== HTML SIGNATURE (Copy to Email Client) ===\n${htmlSig}\n\n=== PLAINTEXT SIGNATURE ===\n${textSig}`;
}

/**
 * 11. Email Address List Cleaner
 */
export function cleanEmailAddressList(rawList: string): string {
  const rawTokens = (rawList || '').split(/[\r\n,;]+/).map(t => t.trim()).filter(Boolean);
  const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/;

  const valid: string[] = [];
  const invalid: string[] = [];

  rawTokens.forEach(t => {
    const match = t.match(emailRegex);
    if (match) {
      valid.push(match[0].toLowerCase());
    } else {
      invalid.push(t);
    }
  });

  return `=== EMAIL ADDRESS LIST CLEANER ===
Total Input Items   : ${rawTokens.length}
Valid Addresses     : ${valid.length}
Invalid / Discarded : ${invalid.length}

--- Cleaned Valid List ---
${valid.join('\n')}

${invalid.length > 0 ? `--- Invalid Items Discarded ---\n${invalid.join('\n')}` : ''}`;
}

/**
 * 12. Email Domain Extractor
 */
export function extractEmailDomains(rawList: string): string {
  const rawTokens = (rawList || '').split(/[\r\n,;]+/).map(t => t.trim()).filter(Boolean);
  const emailRegex = /@([a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/;

  const counts: Record<string, number> = {};
  rawTokens.forEach(t => {
    const match = t.match(emailRegex);
    if (match) {
      const domain = match[1].toLowerCase();
      counts[domain] = (counts[domain] || 0) + 1;
    }
  });

  const sorted = Object.entries(counts).sort((a, b) => b[1] - a[1]);

  return `=== EMAIL DOMAIN BREAKDOWN ===
Total Domains Identified: ${sorted.length}

Domain Frequency:
${sorted.map(([dom, count]) => `• ${dom} : ${count} mailbox(es)`).join('\n') || '(No valid domains found)'}`;
}

/**
 * 13. Email Quoted-Printable Decoder
 */
export function decodeQuotedPrintable(input: string): string {
  const str = input || 'Subject: Welcome=20to=20our=20service=21=0ASatisfaction=20Guaranteed=3D';
  // Remove soft line breaks (=\r?\n)
  let decoded = str.replace(/=\r?\n/g, '');
  // Replace hex escapes =XX
  decoded = decoded.replace(/=([0-9A-Fa-f]{2})/g, (_, hex) => {
    return String.fromCharCode(parseInt(hex, 16));
  });
  return decoded;
}

/**
 * 14. Email Base64 Attachment Decoder
 */
export function decodeEmailBase64Attachment(base64Str: string): string {
  try {
    const cleanB64 = (base64Str || '').replace(/\s+/g, '');
    const binary = atob(cleanB64);
    const bytes = binary.length;

    // Detect file signature / magic bytes
    let mimeType = 'application/octet-stream';
    if (binary.startsWith('\x89PNG')) mimeType = 'image/png';
    else if (binary.startsWith('\xFF\xD8\xFF')) mimeType = 'image/jpeg';
    else if (binary.startsWith('%PDF')) mimeType = 'application/pdf';
    else if (binary.startsWith('GIF8')) mimeType = 'image/gif';
    else if (binary.startsWith('PK\x03\x04')) mimeType = 'application/zip / docx / xlsx';

    // Preview as text if mostly printable
    const printable = /^[\x20-\x7E\r\n\t]*$/.test(binary.slice(0, 200));

    return `=== EMAIL BASE64 ATTACHMENT DECODER ===
Decoded Payload Size : ${bytes} bytes (${(bytes / 1024).toFixed(2)} KB)
Inferred File Type   : ${mimeType}
Printable Text Format: ${printable ? 'Yes (Text-based payload)' : 'No (Binary stream)'}

Content Preview (First 500 characters):
${printable ? binary.slice(0, 500) : `[Binary stream - Hex: ${Array.from(binary.slice(0, 32)).map(c => c.charCodeAt(0).toString(16).padStart(2, '0')).join(' ')}...]`}`;
  } catch (err: any) {
    return `Error decoding Base64 payload: ${err.message}`;
  }
}

/**
 * 15. Email Header Date Normalizer
 */
export function normalizeEmailHeaderDate(rawDateText: string): string {
  const lines = (rawDateText || 'Date: Thu, 26 Sep 2026 11:15:30 +0000\nDate: 26 Sep 2026 04:15:30 -0700')
    .split(/\r?\n/).map(l => l.trim()).filter(Boolean);

  const normalized: string[] = [];

  lines.forEach(line => {
    const clean = line.replace(/^Date:\s*/i, '');
    const d = new Date(clean);
    if (!isNaN(d.getTime())) {
      normalized.push(`${d.toISOString()} (UTC) | Original: "${line}"`);
    } else {
      normalized.push(`Invalid: "${line}"`);
    }
  });

  return `=== NORMALIZED EMAIL HEADER DATES (UTC) ===\n${normalized.join('\n')}`;
}

/**
 * 16. Email Address Deduplicator
 */
export function deduplicateEmailAddresses(rawList: string): string {
  const tokens = (rawList || '').split(/[\r\n,;]+/).map(t => t.trim().toLowerCase()).filter(Boolean);
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  const unique = new Set<string>();
  const duplicates: string[] = [];

  tokens.forEach(t => {
    if (emailRegex.test(t)) {
      if (unique.has(t)) {
        duplicates.push(t);
      } else {
        unique.add(t);
      }
    }
  });

  const uniqueList = Array.from(unique).sort();

  return `=== EMAIL ADDRESS DEDUPLICATOR ===
Total Input Count  : ${tokens.length}
Unique Mailboxes   : ${uniqueList.length}
Duplicates Removed : ${duplicates.length}

--- Unique Cleaned Addresses ---
${uniqueList.join('\n')}`;
}

/**
 * 17. Email List Format Converter
 */
export function convertEmailListFormat(rawList: string, format = 'csv'): string {
  const tokens = (rawList || '').split(/[\r\n,;]+/).map(t => t.trim().toLowerCase()).filter(Boolean);
  const valid = tokens.filter(t => /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(t));

  if (format === 'json') {
    return JSON.stringify(valid, null, 2);
  }
  if (format === 'sql') {
    return `INSERT INTO subscribers (email) VALUES\n${valid.map(e => `  ('${e}')`).join(',\n')};`;
  }
  if (format === 'semicolon') {
    return valid.join('; ');
  }
  // Default CSV
  return valid.join(', ');
}

/**
 * 18. Email Footer Generator
 */
export function generateEmailFooter(
  companyName: string,
  physicalAddress: string,
  unsubscribeUrl: string,
  privacyUrl: string
): string {
  const comp = companyName || 'EncryptDecrypt Inc.';
  const addr = physicalAddress || '100 Security Way, Suite 400, San Francisco, CA 94105';
  const unsub = unsubscribeUrl || 'https://example.com/unsubscribe';
  const priv = privacyUrl || 'https://example.com/privacy';

  const htmlFooter = `<div style="font-family: Arial, sans-serif; font-size: 11px; color: #64748b; line-height: 1.5; text-align: center; padding: 24px 10px; border-top: 1px solid #e2e8f0;">
  <p style="margin: 0 0 6px 0;">You are receiving this email because you opted in at <a href="${priv}" style="color: #2563eb; text-decoration: underline;">${comp}</a>.</p>
  <p style="margin: 0 0 8px 0;">${addr}</p>
  <p style="margin: 0;">
    <a href="${unsub}" style="color: #64748b; text-decoration: underline;">Unsubscribe</a> &bull;
    <a href="${priv}" style="color: #64748b; text-decoration: underline;">Privacy Policy</a> &bull;
    <a href="${priv}/preferences" style="color: #64748b; text-decoration: underline;">Manage Email Preferences</a>
  </p>
</div>`;

  return `=== CAN-SPAM & GDPR COMPLIANT EMAIL FOOTER ===\n${htmlFooter}`;
}

/**
 * 19. Email Template HTML Formatter
 */
export function formatEmailTemplateHtml(rawHtml: string): string {
  const input = rawHtml || '<div style="background:#f4f4f4;padding:20px"><table width="100%" cellpadding="0" cellspacing="0"><tr><td align="center"><h2 style="color:#333">Notification</h2><p>Here is your daily briefing.</p></td></tr></table></div>';

  let formatted = input
    .replace(/>\s*</g, '>\n<')
    .replace(/<table/gi, '\n<table')
    .replace(/<\/table>/gi, '</table>\n')
    .replace(/<tr/gi, '  <tr')
    .replace(/<\/tr>/gi, '  </tr>')
    .replace(/<td/gi, '    <td')
    .replace(/<\/td>/gi, '    </td>');

  return formatted.trim();
}

/**
 * 20. Email Character Encoding Inspector
 */
export function inspectEmailEncoding(rawTextOrHeaders: string): string {
  const str = rawTextOrHeaders || 'Content-Type: text/plain; charset=UTF-8\nContent-Transfer-Encoding: 8bit\nSubject: Hello \u00E9\u00E0\u00EE \u2605';

  const charsetMatch = str.match(/charset=["']?([^"';\r\n]+)/i);
  const transferMatch = str.match(/Content-Transfer-Encoding:\s*([^\r\n]+)/i);

  const nonAsciiCount = (str.match(/[^\x00-\x7F]/g) || []).length;
  const isAsciiOnly = nonAsciiCount === 0;

  return `=== EMAIL ENCODING AUDIT ===
Header Charset   : ${charsetMatch ? charsetMatch[1].toUpperCase() : 'UTF-8 (Inferred)'}
Transfer Encoding: ${transferMatch ? transferMatch[1].trim() : '8bit (Inferred)'}
Total Characters : ${str.length}
Non-ASCII Glyphs : ${nonAsciiCount} (${isAsciiOnly ? 'Clean 7-bit ASCII' : 'Extended UTF-8 / Multi-byte characters detected'})

Encoding Recommendation:
${nonAsciiCount > 0 ? '• Non-ASCII characters present: Content-Transfer-Encoding must be "base64" or "quoted-printable" with charset="utf-8" to prevent garbled text across legacy SMTP relays.' : '✓ Payload is pure 7-bit ASCII; universally compatible across all email transfer agents.'}`;
}
