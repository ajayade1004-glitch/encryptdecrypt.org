import fs from 'fs';
import path from 'path';

export interface ToolItem {
  id: string;
  name: string;
  slug: string;
  category: string;
  categoryName?: string;
  shortDesc: string;
  metaTitle?: string;
  metaDescription?: string;
  primaryKeyword?: string;
  secondaryKeywords?: string[];
  inputType?: string;
  hasFileSupport?: boolean;
  related?: string[];
  popular?: boolean;
}

export interface CategoryHub {
  slug: string;
  name: string;
  count: number;
  desc: string;
}

// Canonical Redirects mapping duplicate slugs to canonical primary tools (P2 Point 14)
export const REDIRECT_SLUGS: Record<string, string> = {
  // JWT (4 pages -> canonical: jwt-token-generator)
  'jwt-decoder': 'jwt-token-generator',
  'jwt-inspector': 'jwt-token-generator',
  'jwt-claim-inspector': 'jwt-token-generator',
  'jwt-validator': 'jwt-token-generator',
  // UUID (2 pages -> canonical: uuid-guid-generator)
  'uuid-generator': 'uuid-guid-generator',
  // CSP (2 pages -> canonical: csp-builder-analyzer)
  'csp-generator': 'csp-builder-analyzer',
  'content-security-policy-explainer': 'csp-builder-analyzer',
  // SRI (2 pages -> canonical: sri-hash-generator)
  'sri-generator': 'sri-hash-generator',
  'subresource-integrity-generator': 'sri-hash-generator',
  // Contrast Checker (3 pages -> canonical: color-contrast-checker)
  'contrast-checker': 'color-contrast-checker',
  'wcag-contrast-checker': 'color-contrast-checker',
  'accessibility-contrast-checker': 'color-contrast-checker',
  // WebP Converter (3 pages -> canonical: image-to-webp)
  'webp-converter': 'image-to-webp',
  'image-to-webp-converter': 'image-to-webp',
  'png-jpg-to-webp': 'image-to-webp',
  // Password Strength (2 pages -> canonical: password-strength-meter)
  'password-strength-checker': 'password-strength-meter',
  'password-entropy-calculator': 'password-strength-meter',
  // SHA-256 and SHA-512 hyphen variants
  'sha-256-hash-generator': 'sha256-hash-generator',
  'sha-512-hash-generator': 'sha512-hash-generator',
  'sha-1-hash-generator': 'sha1-hash-generator',
  'sha-384-hash-generator': 'sha384-hash-generator',
};

// Load tools data
let tools: ToolItem[] = [];
const toolsBySlug = new Map<string, ToolItem>();
const toolsById = new Map<string, ToolItem>();
const categoriesBySlug = new Map<string, { slug: string; name: string; tools: ToolItem[] }>();

export function initializeSsrData(baseDir: string = process.cwd()) {
  const toolsPath = path.join(baseDir, 'public', 'assets', 'data', 'tools.json');
  if (fs.existsSync(toolsPath)) {
    try {
      const raw = fs.readFileSync(toolsPath, 'utf8');
      tools = JSON.parse(raw);
      toolsBySlug.clear();
      toolsById.clear();
      categoriesBySlug.clear();

      tools.forEach(tool => {
        if (tool.slug) toolsBySlug.set(tool.slug.toLowerCase(), tool);
        if (tool.id) toolsById.set(tool.id.toLowerCase(), tool);

        const catSlug = (tool.category || 'general').toLowerCase();
        const catName = tool.categoryName || catSlug.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
        if (!categoriesBySlug.has(catSlug)) {
          categoriesBySlug.set(catSlug, { slug: catSlug, name: catName, tools: [] });
        }
        categoriesBySlug.get(catSlug)!.tools.push(tool);
      });
      console.log(`[SSR Engine] Initialized ${tools.length} tools across ${categoriesBySlug.size} categories.`);
    } catch (err) {
      console.error('[SSR Engine] Failed to load tools data:', err);
    }
  }
}

// Initial load
initializeSsrData();

export interface SsrResult {
  status: number;
  html?: string;
  redirect?: string;
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function replaceMetaTags(
  templateHtml: string,
  options: {
    title: string;
    description: string;
    canonicalUrl: string;
    ogType?: string;
    robots?: string;
    jsonLd?: object;
  }
): string {
  let html = templateHtml;

  // Title
  html = html.replace(/<title>.*?<\/title>/is, `<title>${escapeHtml(options.title)}</title>`);

  // Meta Description
  html = html.replace(
    /<meta\s+name=["']description["']\s+content=["'].*?["']\s*\/?>/is,
    `<meta name="description" content="${escapeHtml(options.description)}" />`
  );

  // Canonical
  html = html.replace(
    /<link\s+rel=["']canonical["']\s+href=["'].*?["']\s*\/?>/is,
    `<link rel="canonical" href="${escapeHtml(options.canonicalUrl)}" />`
  );

  // Robots
  if (options.robots) {
    html = html.replace(
      /<meta\s+name=["']robots["']\s+content=["'].*?["']\s*\/?>/is,
      `<meta name="robots" content="${escapeHtml(options.robots)}" />`
    );
  }

  // Open Graph Title, Description, URL
  html = html.replace(
    /<meta\s+property=["']og:title["']\s+content=["'].*?["']\s*\/?>/is,
    `<meta property="og:title" content="${escapeHtml(options.title)}" />`
  );
  html = html.replace(
    /<meta\s+property=["']og:description["']\s+content=["'].*?["']\s*\/?>/is,
    `<meta property="og:description" content="${escapeHtml(options.description)}" />`
  );
  html = html.replace(
    /<meta\s+property=["']og:url["']\s+content=["'].*?["']\s*\/?>/is,
    `<meta property="og:url" content="${escapeHtml(options.canonicalUrl)}" />`
  );

  // Twitter Title, Description
  html = html.replace(
    /<meta\s+name=["']twitter:title["']\s+content=["'].*?["']\s*\/?>/is,
    `<meta name="twitter:title" content="${escapeHtml(options.title)}" />`
  );
  html = html.replace(
    /<meta\s+name=["']twitter:description["']\s+content=["'].*?["']\s*\/?>/is,
    `<meta name="twitter:description" content="${escapeHtml(options.description)}" />`
  );

  // Schema Injection
  if (options.jsonLd) {
    const jsonLdScript = `\n    <script type="application/ld+json">\n${JSON.stringify(options.jsonLd, null, 2)}\n    </script>\n`;
    html = html.replace('</head>', `${jsonLdScript}</head>`);
  }

  return html;
}

function injectRootContent(html: string, bodyContent: string): string {
  const rootStartIdx = html.indexOf('<div id="root">');
  if (rootStartIdx === -1) return html;

  // Find where the script starts before </body>
  const scriptIdx = html.indexOf('<script type="module"');
  if (scriptIdx !== -1 && scriptIdx > rootStartIdx) {
    return html.slice(0, rootStartIdx) + `<div id="root">\n${bodyContent}\n    </div>\n    ` + html.slice(scriptIdx);
  }

  // Fallback to before </body>
  const bodyCloseIdx = html.indexOf('</body>');
  if (bodyCloseIdx !== -1 && bodyCloseIdx > rootStartIdx) {
    return html.slice(0, rootStartIdx) + `<div id="root">\n${bodyContent}\n    </div>\n` + html.slice(bodyCloseIdx);
  }

  return html;
}

export function renderSsrRoute(rawPath: string, templateHtml: string): SsrResult {
  const cleanPath = rawPath.split('?')[0].split('#')[0];

  // 1. Singular pattern redirect: /tool/:slug -> /tools/:slug
  if (cleanPath.startsWith('/tool/')) {
    const slug = cleanPath.replace('/tool/', '').replace(/\/+$/, '').toLowerCase();
    const parts = slug.split('/').filter(Boolean);
    const finalSlug = parts[parts.length - 1];
    const targetSlug = REDIRECT_SLUGS[finalSlug] || finalSlug;
    return {
      status: 301,
      redirect: `/tools/${targetSlug}`
    };
  }

  // 2. Category path redirect or multi-part in /tools/ (e.g. /tools/encryption-ciphers/aes-encrypt-decrypt/)
  if (cleanPath.startsWith('/tools/')) {
    const parts = cleanPath.replace('/tools/', '').split('/').filter(Boolean);
    if (parts.length > 1) {
      const slug = parts[parts.length - 1].toLowerCase();
      const targetSlug = REDIRECT_SLUGS[slug] || slug;
      return {
        status: 301,
        redirect: `/tools/${targetSlug}`
      };
    }

    // Duplicate slug redirect: /tools/jwt-decoder -> /tools/jwt-token-generator
    if (parts.length === 1) {
      const slug = parts[0].toLowerCase();
      if (REDIRECT_SLUGS[slug]) {
        return {
          status: 301,
          redirect: `/tools/${REDIRECT_SLUGS[slug]}`
        };
      }
    }
  }

  // 3. Trailing slash redirect (except root '/')
  if (cleanPath.length > 1 && cleanPath.endsWith('/')) {
    return {
      status: 301,
      redirect: cleanPath.replace(/\/+$/, '')
    };
  }

  // 5. Root Homepage
  if (cleanPath === '' || cleanPath === '/') {
    return {
      status: 200,
      html: templateHtml
    };
  }

  // 6. Known Static Pages
  if (cleanPath === '/all-tools') {
    const title = 'All Tools Directory (1,360+ Developer Utilities) | EncryptDecrypt.org';
    const description = 'Complete directory of 1,360+ free client-side cryptographic tools, ciphers, hash generators, data encoders, and developer utilities.';
    const canonical = 'https://www.encryptdecrypt.org/all-tools';
    
    let content = `
      <div class="container py-8 max-w-6xl mx-auto">
        <nav class="flex items-center gap-2 text-xs text-slate-400 mb-6 font-mono">
          <a href="/" class="hover:text-sky-400">Home</a>
          <span>/</span>
          <span class="text-white font-semibold">All Tools Directory</span>
        </nav>
        <header class="card-glass p-8 rounded-2xl mb-8">
          <h1 class="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mb-3">
            Complete Directory of 1,360+ Free Developer &amp; Cryptographic Tools
          </h1>
          <p class="text-slate-300 text-sm sm:text-base max-w-4xl leading-relaxed mb-4">
            Browse our full catalog of verified client-side cryptographic algorithms, formatters, and developer utilities computed locally in browser memory.
          </p>
        </header>
        <div class="space-y-8">
    `;

    categoriesBySlug.forEach(cat => {
      content += `
        <section id="cat-${escapeHtml(cat.slug)}" class="card-glass p-6 rounded-2xl">
          <h2 class="text-xl font-bold text-white mb-2">${escapeHtml(cat.name)} (${cat.tools.length} Tools)</h2>
          <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 pt-3">
            ${cat.tools.map(t => `
              <div class="p-3.5 rounded-xl bg-slate-900 border border-slate-800 flex flex-col justify-between">
                <div>
                  <h3 class="text-xs font-bold text-white mb-1"><a href="/tools/${escapeHtml(t.slug)}" class="hover:text-sky-400">${escapeHtml(t.name)}</a></h3>
                  <p class="text-[11px] text-slate-400 line-clamp-2">${escapeHtml(t.shortDesc || '')}</p>
                </div>
                <div class="pt-2 mt-2 border-t border-slate-800 text-[10px] text-sky-400 font-semibold">
                  <a href="/tools/${escapeHtml(t.slug)}">Open Tool →</a>
                </div>
              </div>
            `).join('')}
          </div>
        </section>
      `;
    });

    content += `</div></div>`;

    const jsonLd = {
      "@context": "https://schema.org",
      "@type": "CollectionPage",
      "name": title,
      "url": canonical,
      "description": description
    };

    return {
      status: 200,
      html: injectRootContent(replaceMetaTags(templateHtml, { title, description, canonicalUrl: canonical, jsonLd }), content)
    };
  }

  if (cleanPath === '/guides') {
    const title = 'Technical Cryptography & Developer Guides | EncryptDecrypt.org';
    const description = 'In-depth engineering guides covering AES-256-GCM AEAD, SHA-256 vs SHA-3, JWT signature verification, PBKDF2 password derivation, and Web Cryptography.';
    const canonical = 'https://www.encryptdecrypt.org/guides';

    const content = `
      <div class="container py-8 max-w-4xl mx-auto">
        <nav class="flex items-center gap-2 text-xs text-slate-400 mb-6 font-mono">
          <a href="/" class="hover:text-sky-400">Home</a>
          <span>/</span>
          <span class="text-white font-semibold">Tech Guides</span>
        </nav>
        <header class="card-glass p-8 rounded-2xl mb-8">
          <h1 class="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mb-3">
            Technical Cryptography &amp; Security Engineering Guides
          </h1>
          <p class="text-slate-300 text-sm sm:text-base leading-relaxed">
            Rigorous, peer-reviewed engineering deep dives into symmetric encryption, cryptographic hashing, authenticated data structures, and web security.
          </p>
        </header>
        <div class="space-y-6">
          <article class="card-glass p-6 rounded-2xl">
            <h2 class="text-xl font-bold text-white mb-2"><a href="/tools/aes-encrypt-decrypt" class="hover:text-sky-400">AES-256-GCM vs AES-CBC: Authenticated Encryption Mechanics</a></h2>
            <p class="text-xs text-slate-300 leading-relaxed mb-3">Understanding Galois/Counter Mode (GCM) AEAD, 96-bit initialization vectors, authentication tags, and why CBC requires separate HMAC validation.</p>
            <a href="/tools/aes-encrypt-decrypt" class="text-xs text-sky-400 font-semibold">Launch AES-256 Tool →</a>
          </article>
          <article class="card-glass p-6 rounded-2xl">
            <h2 class="text-xl font-bold text-white mb-2"><a href="/tools/sha-256-hash-generator" class="hover:text-sky-400">Cryptographic Hash Functions: SHA-256, SHA-512, and SHA-3 Keccak</a></h2>
            <p class="text-xs text-slate-300 leading-relaxed mb-3">Collision resistance, pre-image resistance, length-extension vulnerabilities, and why passwords require memory-hard KDFs like Argon2, bcrypt, or PBKDF2.</p>
            <a href="/tools/sha-256-hash-generator" class="text-xs text-sky-400 font-semibold">Launch SHA-256 Tool →</a>
          </article>
          <article class="card-glass p-6 rounded-2xl">
            <h2 class="text-xl font-bold text-white mb-2"><a href="/tools/jwt-token-generator" class="hover:text-sky-400">JSON Web Tokens (JWT): RFC 7519 Architecture &amp; Signatures</a></h2>
            <p class="text-xs text-slate-300 leading-relaxed mb-3">Header, Payload, and Signature structure, cryptographic verification using HS256 vs RS256, and defending against the 'alg: none' vulnerability.</p>
            <a href="/tools/jwt-token-generator" class="text-xs text-sky-400 font-semibold">Launch JWT Debugger →</a>
          </article>
        </div>
      </div>
    `;

    return {
      status: 200,
      html: injectRootContent(replaceMetaTags(templateHtml, { title, description, canonicalUrl: canonical }), content)
    };
  }

  if (cleanPath === '/about') {
    const title = 'About EncryptDecrypt.org | Verified Architecture & Author';
    const description = 'Learn about EncryptDecrypt.org: 100% client-side cryptographic engineering, zero server data transmission, and verified compliance with NIST FIPS and IETF standards.';
    const canonical = 'https://www.encryptdecrypt.org/about';

    const content = `
      <div class="container py-8 max-w-4xl mx-auto">
        <nav class="flex items-center gap-2 text-xs text-slate-400 mb-6 font-mono">
          <a href="/" class="hover:text-sky-400">Home</a>
          <span>/</span>
          <span class="text-white font-semibold">About Us</span>
        </nav>
        <article class="card-glass p-8 sm:p-10 rounded-2xl">
          <h1 class="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mb-4">
            About EncryptDecrypt.org: Client-Side Security Architecture
          </h1>
          <p class="text-slate-300 text-sm sm:text-base leading-relaxed mb-6">
            EncryptDecrypt.org was engineered to provide developers, cryptographers, and IT professionals with a dependable suite of 1,360+ developer utilities where sensitive plaintext data and secret keys never leave local browser memory.
          </p>
          <h2 class="text-xl font-bold text-white mb-3">Lead Author &amp; Engineering Contributors</h2>
          <p class="text-slate-300 text-xs sm:text-sm leading-relaxed mb-4">
            Maintained by Ajjay Ade (Lead Software &amp; Cryptographic Engineer) alongside open-source contributors. All algorithmic test harnesses are systematically verified against NIST Computer Security Division test vectors and IETF RFC specifications.
          </p>
          <h2 class="text-xl font-bold text-white mb-3">Web Crypto API vs Local Memory Algorithms</h2>
          <p class="text-slate-300 text-xs sm:text-sm leading-relaxed mb-4">
            Primitives supported natively by the browser execute via hardware-accelerated W3C Web Cryptography (<code>crypto.subtle</code>). Non-WebCrypto algorithms (MD5, SHA-3, BLAKE2, bcrypt, Argon2) run via audited client-side JavaScript/Wasm in memory. Diagnostic network tools (DNS, WHOIS, HTTP headers) perform explicit, on-demand queries without logging.
          </p>
        </article>
      </div>
    `;

    return {
      status: 200,
      html: injectRootContent(replaceMetaTags(templateHtml, { title, description, canonicalUrl: canonical }), content)
    };
  }

  if (cleanPath === '/contact') {
    const title = 'Contact Security & Engineering Support | EncryptDecrypt.org';
    const description = 'Contact the EncryptDecrypt.org engineering team for security disclosures, cryptographic tool requests, or technical bug reports.';
    const canonical = 'https://www.encryptdecrypt.org/contact';

    const content = `
      <div class="container py-8 max-w-3xl mx-auto">
        <nav class="flex items-center gap-2 text-xs text-slate-400 mb-6 font-mono">
          <a href="/" class="hover:text-sky-400">Home</a>
          <span>/</span>
          <span class="text-white font-semibold">Contact</span>
        </nav>
        <div class="card-glass p-8 rounded-2xl">
          <h1 class="text-3xl font-extrabold text-white mb-3">Contact Security &amp; Engineering Support</h1>
          <p class="text-slate-300 text-sm leading-relaxed mb-6">
            Have a question, feedback, or a security inquiry? Get in touch directly with our maintainers:
          </p>
          <div class="p-4 rounded-xl bg-slate-900 border border-slate-800 text-xs font-mono text-slate-300 space-y-2">
            <div>Email: <a href="mailto:admin@EncryptDecrypt.org" class="text-sky-400">admin@EncryptDecrypt.org</a></div>
            <div>Secondary: <a href="mailto:ajay.rathod8796@gmail.com" class="text-sky-400">ajay.rathod8796@gmail.com</a></div>
            <div>Platform: EncryptDecrypt.org Engineering Desk</div>
          </div>
        </div>
      </div>
    `;

    return {
      status: 200,
      html: injectRootContent(replaceMetaTags(templateHtml, { title, description, canonicalUrl: canonical }), content)
    };
  }

  if (cleanPath === '/privacy') {
    const title = 'Privacy Policy & Zero-Knowledge Architecture | EncryptDecrypt.org';
    const description = 'EncryptDecrypt.org privacy policy: zero client data collection, local browser memory execution, and complete disclosure of server-assisted network diagnostic tools.';
    const canonical = 'https://www.encryptdecrypt.org/privacy';

    const content = `
      <div class="container py-8 max-w-4xl mx-auto">
        <nav class="flex items-center gap-2 text-xs text-slate-400 mb-6 font-mono">
          <a href="/" class="hover:text-sky-400">Home</a>
          <span>/</span>
          <span class="text-white font-semibold">Privacy Policy</span>
        </nav>
        <article class="card-glass p-8 sm:p-10 rounded-2xl space-y-4">
          <h1 class="text-3xl font-extrabold text-white mb-3">Privacy Policy</h1>
          <p class="text-slate-300 text-sm leading-relaxed">
            EncryptDecrypt.org operates under a zero-knowledge architectural design. Cryptographic computations execute directly in your browser's local RAM.
          </p>
          <h2 class="text-xl font-bold text-white pt-2">Network Transmission Disclosure</h2>
          <p class="text-slate-300 text-xs sm:text-sm leading-relaxed">
            All cryptographic ciphers, hashes, encoders, and generators run 100% locally with zero server requests. Server-assisted diagnostic utilities (DNS, WHOIS, HTTP headers, Ping, Googlebot Simulator) query external endpoints on-demand without storing or logging search parameters.
          </p>
        </article>
      </div>
    `;

    return {
      status: 200,
      html: injectRootContent(replaceMetaTags(templateHtml, { title, description, canonicalUrl: canonical }), content)
    };
  }

  if (cleanPath === '/terms') {
    const title = 'Terms of Service | EncryptDecrypt.org';
    const description = 'EncryptDecrypt.org terms of service: user responsibilities, zero key retention policy, and acceptable use guidelines.';
    const canonical = 'https://www.encryptdecrypt.org/terms';

    const content = `
      <div class="container py-8 max-w-4xl mx-auto">
        <nav class="flex items-center gap-2 text-xs text-slate-400 mb-6 font-mono">
          <a href="/" class="hover:text-sky-400">Home</a>
          <span>/</span>
          <span class="text-white font-semibold">Terms of Service</span>
        </nav>
        <article class="card-glass p-8 rounded-2xl">
          <h1 class="text-3xl font-extrabold text-white mb-3">Terms of Service</h1>
          <p class="text-slate-300 text-sm leading-relaxed">
            By using EncryptDecrypt.org, you acknowledge that all encryption keys are generated and processed locally in your browser. EncryptDecrypt.org has no capability to recover lost keys or restore encrypted data.
          </p>
        </article>
      </div>
    `;

    return {
      status: 200,
      html: injectRootContent(replaceMetaTags(templateHtml, { title, description, canonicalUrl: canonical }), content)
    };
  }

  if (cleanPath === '/disclaimer') {
    const title = 'Cryptographic & Legal Disclaimer | EncryptDecrypt.org';
    const description = 'Legal and technical disclaimer regarding cryptographic standards, local processing, and output verification.';
    const canonical = 'https://www.encryptdecrypt.org/disclaimer';

    const content = `
      <div class="container py-8 max-w-4xl mx-auto">
        <nav class="flex items-center gap-2 text-xs text-slate-400 mb-6 font-mono">
          <a href="/" class="hover:text-sky-400">Home</a>
          <span>/</span>
          <span class="text-white font-semibold">Disclaimer</span>
        </nav>
        <article class="card-glass p-8 rounded-2xl">
          <h1 class="text-3xl font-extrabold text-white mb-3">Cryptographic &amp; Security Disclaimer</h1>
          <p class="text-slate-300 text-sm leading-relaxed">
            The cryptographic tools on EncryptDecrypt.org are provided for developer testing, education, and administrative use. Always adhere to official NIST, IETF, and OWASP standards when deploying cryptographic systems in production.
          </p>
        </article>
      </div>
    `;

    return {
      status: 200,
      html: injectRootContent(replaceMetaTags(templateHtml, { title, description, canonicalUrl: canonical }), content)
    };
  }

  if (cleanPath === '/admin') {
    return {
      status: 200,
      html: templateHtml
    };
  }

  // 7. Category Pages: /category/:slug
  if (cleanPath.startsWith('/category/')) {
    const catSlug = cleanPath.replace('/category/', '').toLowerCase();
    const cat = categoriesBySlug.get(catSlug);

    if (cat) {
      const title = `${cat.name} Tools (Free Client-Side) | EncryptDecrypt.org`;
      const description = `Explore ${cat.tools.length} free client-side ${cat.name} tools. Computed locally in browser RAM with zero server transmission.`;
      const canonical = `https://www.encryptdecrypt.org/category/${cat.slug}`;

      let content = `
        <div class="container py-8 max-w-6xl mx-auto">
          <nav class="flex items-center gap-2 text-xs text-slate-400 mb-6 font-mono">
            <a href="/" class="hover:text-sky-400">Home</a>
            <span>/</span>
            <a href="/all-tools" class="hover:text-sky-400">Categories</a>
            <span>/</span>
            <span class="text-white font-semibold">${escapeHtml(cat.name)}</span>
          </nav>
          <header class="card-glass p-8 rounded-2xl mb-8">
            <h1 class="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mb-3">
              ${escapeHtml(cat.name)} Tools
            </h1>
            <p class="text-slate-300 text-sm sm:text-base leading-relaxed">
              Explore ${cat.tools.length} verified developer utilities and cryptographic algorithms in this hub. 100% private in browser memory.
            </p>
          </header>
          <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            ${cat.tools.map(t => `
              <div class="p-4 rounded-xl bg-slate-900 border border-slate-800 flex flex-col justify-between">
                <div>
                  <h2 class="text-sm font-bold text-white mb-1"><a href="/tools/${escapeHtml(t.slug)}" class="hover:text-sky-400">${escapeHtml(t.name)}</a></h2>
                  <p class="text-xs text-slate-400 line-clamp-2 leading-relaxed mb-3">${escapeHtml(t.shortDesc || '')}</p>
                </div>
                <div class="pt-2 border-t border-slate-800 text-xs text-sky-400 font-semibold">
                  <a href="/tools/${escapeHtml(t.slug)}">Open Tool →</a>
                </div>
              </div>
            `).join('')}
          </div>
        </div>
      `;

      const jsonLd = {
        "@context": "https://schema.org",
        "@type": "CollectionPage",
        "name": title,
        "url": canonical,
        "description": description,
        "breadcrumb": {
          "@type": "BreadcrumbList",
          "itemListElement": [
            { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://www.encryptdecrypt.org/" },
            { "@type": "ListItem", "position": 2, "name": cat.name, "item": canonical }
          ]
        }
      };

      return {
        status: 200,
        html: injectRootContent(replaceMetaTags(templateHtml, { title, description, canonicalUrl: canonical, jsonLd }), content)
      };
    } else {
      // Invalid category -> 404
      return render404Page(cleanPath, templateHtml);
    }
  }

  // 8. Tool Pages: /tools/:slug
  if (cleanPath.startsWith('/tools/')) {
    const slug = cleanPath.replace('/tools/', '').toLowerCase();
    let tool = toolsBySlug.get(slug) || toolsById.get(slug);

    if (!tool) {
      const cleanSlug = slug.replace(/-/g, '');
      tool = tools.find(t => t.slug.replace(/-/g, '') === cleanSlug || t.id.replace(/-/g, '') === cleanSlug);
      if (tool) {
        return {
          status: 301,
          redirect: `/tools/${tool.slug}`
        };
      }
    }

    if (tool) {
      const title = tool.metaTitle || `${tool.name} - Free Online Tool | EncryptDecrypt.org`;
      const description = tool.metaDescription || tool.shortDesc || `Use free ${tool.name} online in browser RAM. 100% private, zero server transmission.`;
      const canonical = `https://www.encryptdecrypt.org/tools/${tool.slug}`;

      const content = `
        <div class="container py-8 max-w-5xl mx-auto">
          <nav class="flex items-center gap-2 text-xs text-slate-400 mb-6 font-mono">
            <a href="/" class="hover:text-sky-400">Home</a>
            <span>/</span>
            <a href="/category/${escapeHtml(tool.category)}" class="hover:text-sky-400">${escapeHtml(tool.categoryName || tool.category)}</a>
            <span>/</span>
            <span class="text-white font-semibold">${escapeHtml(tool.name)}</span>
          </nav>
          
          <article class="card-glass p-6 sm:p-10 rounded-2xl mb-8">
            <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-sky-400 text-xs font-mono mb-4">
              <span>Client-Side Execution · Zero Server Transmission</span>
            </div>
            
            <h1 class="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mb-3">
              ${escapeHtml(tool.name)}
            </h1>
            
            <p class="text-slate-300 text-sm sm:text-base leading-relaxed mb-6">
              ${escapeHtml(tool.shortDesc || `Free, client-side ${tool.name} running directly in your browser memory.`)}
            </p>

            <div class="p-6 rounded-xl bg-slate-900/90 border border-slate-800 mb-8 space-y-4">
              <div class="flex items-center justify-between text-xs text-slate-400 pb-2 border-b border-slate-800">
                <span>Input Workspace</span>
                <span class="font-mono text-emerald-400">100% In-Browser Memory</span>
              </div>
              <textarea rows="4" class="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-xs text-white font-mono" placeholder="Enter input here to compute with ${escapeHtml(tool.name)}..." readonly></textarea>
              <div class="flex justify-end">
                <button class="btn btn-primary px-5 py-2 text-xs font-semibold rounded-lg bg-blue-600 text-white">Execute ${escapeHtml(tool.name)}</button>
              </div>
            </div>

            <section class="mt-8 pt-6 border-t border-slate-800" id="tool-faq">
              <h2 class="text-xl font-bold text-white mb-4">Frequently Asked Questions: ${escapeHtml(tool.name)}</h2>
              <div class="space-y-4 text-xs sm:text-sm text-slate-300">
                <div class="p-4 rounded-xl bg-slate-900 border border-slate-800">
                  <h3 class="font-bold text-white mb-1">Is this ${escapeHtml(tool.name)} private and secure?</h3>
                  <p class="leading-relaxed">Yes. All computations execute directly in your client device's browser memory (RAM). Zero bytes are transmitted across the internet to our servers or third parties.</p>
                </div>
                <div class="p-4 rounded-xl bg-slate-900 border border-slate-800">
                  <h3 class="font-bold text-white mb-1">Does this tool comply with industry standards?</h3>
                  <p class="leading-relaxed">All ciphers, hashes, and encodings follow NIST FIPS and IETF RFC specifications with verified Known Answer Test vectors.</p>
                </div>
              </div>
            </section>
          </article>
        </div>
      `;

      const jsonLd = {
        "@context": "https://schema.org",
        "@graph": [
          {
            "@type": "WebApplication",
            "name": tool.name,
            "url": canonical,
            "applicationCategory": "DeveloperApplication",
            "operatingSystem": "All modern web browsers",
            "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" },
            "description": tool.shortDesc
          },
          {
            "@type": "BreadcrumbList",
            "itemListElement": [
              { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://www.encryptdecrypt.org/" },
              { "@type": "ListItem", "position": 2, "name": tool.categoryName || tool.category, "item": `https://www.encryptdecrypt.org/category/${tool.category}` },
              { "@type": "ListItem", "position": 3, "name": tool.name, "item": canonical }
            ]
          },
          {
            "@type": "FAQPage",
            "mainEntity": [
              {
                "@type": "Question",
                "name": `Is this ${tool.name} private and secure?`,
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": `Yes. All computations execute directly in your client device's browser memory (RAM). Zero bytes are transmitted to any server.`
                }
              },
              {
                "@type": "Question",
                "name": `Does this ${tool.name} tool comply with industry standards?`,
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": `All algorithms strictly adhere to NIST FIPS, IETF RFC, and W3C Web Cryptography API specifications.`
                }
              }
            ]
          }
        ]
      };

      return {
        status: 200,
        html: injectRootContent(replaceMetaTags(templateHtml, { title, description, canonicalUrl: canonical, jsonLd }), content)
      };
    } else {
      // Invalid tool slug -> 404
      return render404Page(cleanPath, templateHtml);
    }
  }

  // 9. Any other unknown path -> Genuine HTTP 404
  return render404Page(cleanPath, templateHtml);
}

function render404Page(requestedPath: string, templateHtml: string): SsrResult {
  const title = '404 - Page Not Found | EncryptDecrypt.org';
  const description = 'The requested tool or page could not be found. Explore 1,360+ free client-side developer utilities at EncryptDecrypt.org.';
  const canonical = 'https://www.encryptdecrypt.org/404';

  const content = `
    <div class="container py-12 max-w-4xl mx-auto">
      <div class="card-glass p-8 sm:p-12 text-center rounded-2xl bg-slate-900 border border-slate-800">
        <span class="text-xs font-mono font-bold text-sky-400 uppercase tracking-wider px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 inline-block mb-3">
          HTTP 404 · Resource Not Found
        </span>
        <h1 class="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mb-3">
          404 - Page or Tool Not Found
        </h1>
        <p class="text-slate-300 text-sm sm:text-base max-w-xl mx-auto mb-8 leading-relaxed">
          The requested path <code class="text-sky-400 font-mono">${escapeHtml(requestedPath)}</code> does not exist or has been moved. All 1,360+ client-side utilities are active and running in our catalog.
        </p>
        <div class="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-2xl mx-auto mb-8 text-left">
          <a href="/tools/base64-encode-decode" class="p-3 rounded-xl bg-slate-950 border border-slate-800 hover:border-sky-500 transition">
            <span class="text-[10px] text-slate-400 block font-mono">Encoding</span>
            <span class="text-xs font-bold text-white block">Base64 Encode</span>
          </a>
          <a href="/tools/aes-encrypt-decrypt" class="p-3 rounded-xl bg-slate-950 border border-slate-800 hover:border-sky-500 transition">
            <span class="text-[10px] text-slate-400 block font-mono">Ciphers</span>
            <span class="text-xs font-bold text-white block">AES-256 GCM</span>
          </a>
          <a href="/tools/sha-256-hash-generator" class="p-3 rounded-xl bg-slate-950 border border-slate-800 hover:border-sky-500 transition">
            <span class="text-[10px] text-slate-400 block font-mono">Hashing</span>
            <span class="text-xs font-bold text-white block">SHA-256 Hash</span>
          </a>
          <a href="/tools/jwt-token-generator" class="p-3 rounded-xl bg-slate-950 border border-slate-800 hover:border-sky-500 transition">
            <span class="text-[10px] text-slate-400 block font-mono">Security</span>
            <span class="text-xs font-bold text-white block">JWT Debugger</span>
          </a>
        </div>
        <div>
          <a href="/" class="btn btn-primary px-6 py-2.5 text-xs font-semibold inline-flex items-center gap-2 rounded-lg bg-blue-600 text-white">
            ← Return to Homepage &amp; Tools Directory
          </a>
        </div>
      </div>
    </div>
  `;

  const html = injectRootContent(
    replaceMetaTags(templateHtml, {
      title,
      description,
      canonicalUrl: canonical,
      robots: 'noindex, nofollow'
    }),
    content
  );

  return {
    status: 404,
    html
  };
}
