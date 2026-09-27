const fs = require('fs');
const path = require('path');

const toolsPath = path.join(__dirname, '../public/assets/data/tools.json');
const tools = JSON.parse(fs.readFileSync(toolsPath, 'utf8'));

const defensiveTools = [
  { name: 'Password Entropy Calculator', slug: 'password-entropy-calculator', shortDesc: 'Calculate mathematical password entropy in bits and estimate GPU cluster crack times.' },
  { name: 'Password Policy Checker', slug: 'password-policy-checker', shortDesc: 'Validate passwords against NIST SP 800-63B and enterprise complexity guidelines.' },
  { name: 'Passphrase Strength Analyzer', slug: 'passphrase-strength-analyzer', shortDesc: 'Analyze Diceware multi-word passphrases using the EFF 7,776-word dictionary model.' },
  { name: 'Security Header Policy Builder', slug: 'security-header-policy-builder', shortDesc: 'Build hardened Nginx and Apache security headers configurations (HSTS, CSP, XFO).' },
  { name: 'Content Security Policy Explainer', slug: 'content-security-policy-explainer', shortDesc: 'Breakdown and explain CSP directives and Cross-Site Scripting (XSS) protections.' },
  { name: 'TLS Version Reference Tool', slug: 'tls-version-reference-tool', shortDesc: 'Compare TLS 1.3, TLS 1.2, and deprecated SSL protocol specifications and cipher suites.' },
  { name: 'Certificate Expiry Date Calculator', slug: 'certificate-expiry-date-calculator', shortDesc: 'Calculate remaining SSL/TLS certificate validity windows and ACME renewal urgency.' },
  { name: 'Certificate Chain Viewer', slug: 'certificate-chain-viewer', shortDesc: 'Inspect Public Key Infrastructure (PKI) leaf, intermediate, and root CA trust chains.' },
  { name: 'Public Key Format Inspector', slug: 'public-key-format-inspector', shortDesc: 'Inspect PKCS#8, PKCS#1, PEM, and OpenSSH asymmetric public key encodings.' },
  { name: 'SSH Public Key Validator', slug: 'ssh-public-key-validator', shortDesc: 'Validate OpenSSH public key algorithms (Ed25519, RSA) and Base64 format integrity.' },
  { name: 'SSH Fingerprint Comparator', slug: 'ssh-fingerprint-comparator', shortDesc: 'Compare SSH host key SHA256 fingerprints to prevent Man-in-the-Middle attacks.' },
  { name: 'File Hash Integrity Comparator', slug: 'file-hash-integrity-comparator', shortDesc: 'Verify bit-for-bit file integrity using SHA-256 and SHA-512 cryptographic digests.' },
  { name: 'HMAC Verification Tester', slug: 'hmac-verification-tester', shortDesc: 'Test Hash-Based Message Authentication Codes (HMAC) with constant-time verification.' },
  { name: 'JWT Claim Inspector', slug: 'jwt-claim-inspector', shortDesc: 'Decode JSON Web Token headers, payload claims, and check expiration lifetimes.' },
  { name: 'Cookie Security Attribute Checker', slug: 'cookie-security-attribute-checker', shortDesc: 'Audit HTTP cookies for HttpOnly, Secure, SameSite, and Path security flags.' },
  { name: 'Secure Cookie Configuration Builder', slug: 'secure-cookie-configuration-builder', shortDesc: 'Generate secure Set-Cookie code snippets for Express, Django, and modern servers.' },
  { name: 'CORS Policy Explainer', slug: 'cors-policy-explainer', shortDesc: 'Understand Cross-Origin Resource Sharing preflights, allowed headers, and credentials.' },
  { name: 'HTTP Security Header Reference', slug: 'http-security-header-reference', shortDesc: 'Comprehensive reference guide for modern defensive web security HTTP headers.' },
  { name: 'Encryption Algorithm Comparison Guide', slug: 'encryption-algorithm-comparison-guide', shortDesc: 'Compare AES-256-GCM, ChaCha20-Poly1305, Ed25519, and RSA encryption algorithms.' },
  { name: 'Secure Randomness Educational Tester', slug: 'secure-randomness-educational-tester', shortDesc: 'Test Web Crypto API CSPRNG uniform distribution vs insecure Math.random().' }
];

const accessibilityTools = [
  { name: 'Accessible Button Checker', slug: 'accessible-button-checker', shortDesc: 'Audit HTML button elements for accessible names, types, and screen reader labels.' },
  { name: 'Accessible Form Label Checker', slug: 'accessible-form-label-checker', shortDesc: 'Verify programmatic label associations (<label for="..."> and <input id="...">).' },
  { name: 'Keyboard Navigation Checklist', slug: 'keyboard-navigation-checklist', shortDesc: 'WCAG 2.1 Level A and AA keyboard operability and focus trap audit checklist.' },
  { name: 'Focus Order Inspector', slug: 'focus-order-inspector', shortDesc: 'Inspect DOM tab sequence and verify logical reading order for keyboard users.' },
  { name: 'Tab Index Analyzer', slug: 'tab-index-analyzer', shortDesc: 'Detect positive tabindex anti-patterns and optimize natural keyboard navigation flow.' },
  { name: 'ARIA Accessible Name Checker', slug: 'aria-accessible-name-checker', shortDesc: 'Compute accessible names using W3C AccName specification precedence rules.' },
  { name: 'Form Error Message Checker', slug: 'form-error-message-checker', shortDesc: 'Validate aria-invalid, aria-describedby, and role="alert" form error patterns.' },
  { name: 'Touch Target Size Calculator', slug: 'touch-target-size-calculator', shortDesc: 'Evaluate touch targets against WCAG 2.2 (24x24px) and WCAG 2.1 AAA (44x44px).' },
  { name: 'Font Size Accessibility Checker', slug: 'font-size-accessibility-checker', shortDesc: 'Check typographic font sizes against WCAG readability and contrast thresholds.' },
  { name: 'Line Height Accessibility Calculator', slug: 'line-height-accessibility-calculator', shortDesc: 'Calculate WCAG 1.4.12 compliant 1.5x line heights and paragraph margins.' },
  { name: 'Link Purpose Checker', slug: 'link-purpose-checker', shortDesc: 'Detect vague anchor text (click here, read more) and generate descriptive links.' },
  { name: 'Table Header Checker', slug: 'table-header-checker', shortDesc: 'Audit data tables for caption elements and th scope="col" / scope="row" headers.' },
  { name: 'HTML Language Attribute Checker', slug: 'html-language-attribute-checker', shortDesc: 'Verify root <html lang="..."> attributes for text-to-speech screen readers.' },
  { name: 'Skip Link Generator', slug: 'skip-link-generator', shortDesc: 'Generate accessible "Skip to main content" bypass links with Tailwind CSS styles.' },
  { name: 'Accessibility Statement Generator', slug: 'accessibility-statement-generator', shortDesc: 'Create a formal WCAG 2.1 Level AA conformance accessibility statement.' },
  { name: 'Accessible Color Palette Generator', slug: 'accessible-color-palette-generator', shortDesc: 'Generate high-contrast color palettes satisfying WCAG 2.1 AAA 7:1 contrast.' },
  { name: 'Image Alt Text Checklist', slug: 'image-alt-text-checklist', shortDesc: 'Decision tree for writing informative, functional, and decorative image alt text.' },
  { name: 'Keyboard Shortcut Conflict Checker', slug: 'keyboard-shortcut-conflict-checker', shortDesc: 'Identify browser shortcut collisions (Ctrl+P, Ctrl+S) for custom keybindings.' },
  { name: 'Accessible Form Template Generator', slug: 'accessible-form-template-generator', shortDesc: 'Generate WCAG 2.1 compliant accessible form markup with ARIA attributes.' },
  { name: 'WCAG Text Spacing Checker', slug: 'wcag-text-spacing-checker', shortDesc: 'Verify line height, paragraph margin, and letter-spacing for SC 1.4.12.' }
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

defensiveTools.forEach(t => upsert(t, 'defensive-security-tools', 'Defensive Security Tools'));
accessibilityTools.forEach(t => upsert(t, 'accessibility-tools', 'Accessibility Tools'));

// Link related tools
tools.forEach(t => {
  if (t.category === 'defensive-security-tools') {
    t.related = defensiveTools.filter(x => x.slug !== t.slug).slice(0, 4).map(x => x.slug);
  } else if (t.category === 'accessibility-tools') {
    t.related = accessibilityTools.filter(x => x.slug !== t.slug).slice(0, 4).map(x => x.slug);
  }
});

fs.writeFileSync(toolsPath, JSON.stringify(tools, null, 2), 'utf8');
console.log(`Successfully populated 40 tools across 2 categories. Total tools now: ${tools.length}`);
