/**
 * Web Forms & UI Generators Client-Side Engines
 * 100% browser-native HTML/CSS form builders, navigation, pricing tables,
 * accordions, modals, input regex patterns, and validation rules.
 */

/** 1. HTML Form Generator */
export function generateHtmlForm(input: string): string {
  return `<form action="/submit" method="POST" class="standard-form">
  <div class="form-group">
    <label for="fullName">Full Name</label>
    <input type="text" id="fullName" name="fullName" required placeholder="John Doe" autocomplete="name">
  </div>
  
  <div class="form-group">
    <label for="userEmail">Email Address</label>
    <input type="email" id="userEmail" name="userEmail" required placeholder="john@example.com" autocomplete="email">
  </div>

  <div class="form-group">
    <label for="userRole">Department</label>
    <select id="userRole" name="userRole">
      <option value="engineering">Engineering</option>
      <option value="security">Security & SecOps</option>
      <option value="devops">DevOps & Cloud</option>
    </select>
  </div>

  <button type="submit" class="btn-submit">Submit Details</button>
</form>`;
}

/** 2. Contact Form HTML Generator */
export function generateContactFormHtml(input: string): string {
  return `<form id="contactForm" class="contact-form" novalidate>
  <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
    <div class="form-field">
      <label for="contactName">Name <span class="required">*</span></label>
      <input type="text" id="contactName" name="name" required placeholder="Jane Smith">
    </div>
    <div class="form-field">
      <label for="contactEmail">Email <span class="required">*</span></label>
      <input type="email" id="contactEmail" name="email" required placeholder="jane@company.com">
    </div>
  </div>

  <div class="form-field">
    <label for="contactSubject">Subject</label>
    <input type="text" id="contactSubject" name="subject" placeholder="Inquiry about zero-knowledge encryption">
  </div>

  <div class="form-field">
    <label for="contactMessage">Message <span class="required">*</span></label>
    <textarea id="contactMessage" name="message" rows="5" required placeholder="Type your message here..."></textarea>
  </div>

  <button type="submit" class="btn-primary">Send Message</button>
</form>`;
}

/** 3. Login Form UI Generator */
export function generateLoginFormUi(input: string): string {
  return `<div class="auth-card">
  <div class="auth-header">
    <h2>Sign In to Account</h2>
    <p>Enter your credentials to access the secure dashboard.</p>
  </div>

  <form class="auth-form" method="POST">
    <div class="input-wrapper">
      <label for="loginEmail">Email / Username</label>
      <input type="email" id="loginEmail" name="email" autocomplete="username" required placeholder="developer@encryptdecrypt.org">
    </div>

    <div class="input-wrapper">
      <div class="label-row">
        <label for="loginPassword">Password</label>
        <a href="/forgot-password" class="forgot-link">Forgot password?</a>
      </div>
      <input type="password" id="loginPassword" name="password" autocomplete="current-password" required placeholder="••••••••••••">
    </div>

    <div class="checkbox-row">
      <label class="remember-me">
        <input type="checkbox" name="remember"> Remember this browser
      </label>
    </div>

    <button type="submit" class="btn-auth-primary">Sign In</button>
  </form>
</div>`;
}

/** 4. Registration Form UI Generator */
export function generateRegistrationFormUi(input: string): string {
  return `<form class="register-form" method="POST">
  <h2>Create Your Account</h2>
  
  <div class="form-row">
    <label for="regName">Full Legal Name</label>
    <input type="text" id="regName" name="name" required autocomplete="name">
  </div>

  <div class="form-row">
    <label for="regEmail">Work Email</label>
    <input type="email" id="regEmail" name="email" required autocomplete="email">
  </div>

  <div class="form-row">
    <label for="regPassword">Master Password</label>
    <input type="password" id="regPassword" name="password" minlength="12" required autocomplete="new-password">
    <small class="helper-text">Must be at least 12 characters with mixed case & symbols.</small>
  </div>

  <div class="form-terms">
    <label>
      <input type="checkbox" required> I agree to the <a href="/terms">Terms of Service</a> & <a href="/privacy">Privacy Policy</a>
    </label>
  </div>

  <button type="submit" class="btn-register">Create Account</button>
</form>`;
}

/** 5. Search Form Generator */
export function generateSearchForm(input: string): string {
  return `<form role="search" class="search-form" action="/search" method="GET">
  <div class="search-input-group">
    <svg class="search-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <circle cx="11" cy="11" r="8"></circle>
      <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
    </svg>
    <input type="search" name="q" placeholder="Search 1,000+ developer utilities..." aria-label="Search tools" autocomplete="off" required>
    <button type="submit" class="search-btn">Search</button>
  </div>
</form>`;
}

/** 6. Newsletter Form Generator */
export function generateNewsletterForm(input: string): string {
  return `<div class="newsletter-card">
  <h3>Subscribe to Zero-Knowledge Digest</h3>
  <p>Weekly updates on browser cryptography, WebCrypto APIs, and DevOps tooling.</p>
  
  <form class="newsletter-inline-form" action="/api/newsletter" method="POST">
    <input type="email" name="subscriber_email" placeholder="Enter your email address" required>
    <button type="submit" class="btn-subscribe">Subscribe Free</button>
  </form>
  <span class="privacy-note">🔒 Zero spam. Unsubscribe at any time.</span>
</div>`;
}

/** 7. Feedback Form Generator */
export function generateFeedbackForm(input: string): string {
  return `<form class="feedback-form">
  <h3>Give Product Feedback</h3>
  
  <div class="rating-group">
    <label>How satisfied are you with this developer tool?</label>
    <div class="stars">
      <input type="radio" id="star5" name="rating" value="5"><label for="star5">★ 5 (Excellent)</label>
      <input type="radio" id="star4" name="rating" value="4"><label for="star4">★ 4 (Good)</label>
      <input type="radio" id="star3" name="rating" value="3"><label for="star3">★ 3 (Average)</label>
      <input type="radio" id="star2" name="rating" value="2"><label for="star2">★ 2 (Poor)</label>
    </div>
  </div>

  <div class="comment-group">
    <label for="feedbackComments">What can we improve?</label>
    <textarea id="feedbackComments" name="comments" rows="4" placeholder="Tell us what features or ciphers you would like added..."></textarea>
  </div>

  <button type="submit" class="btn-feedback">Send Feedback</button>
</form>`;
}

/** 8. Survey Form Generator */
export function generateSurveyForm(input: string): string {
  return `<form class="survey-form">
  <fieldset class="survey-step">
    <legend>Question 1: Primary Developer Role</legend>
    <label><input type="radio" name="role" value="frontend"> Frontend Engineer</label>
    <label><input type="radio" name="role" value="backend"> Backend Engineer</label>
    <label><input type="radio" name="role" value="security"> SecOps / Infosec</label>
    <label><input type="radio" name="role" value="devops"> DevOps / SRE</label>
  </fieldset>

  <fieldset class="survey-step">
    <legend>Question 2: Cryptographic API Preference</legend>
    <label><input type="checkbox" name="api" value="webcrypto"> W3C WebCrypto API</label>
    <label><input type="checkbox" name="api" value="nodecrypto"> Node.js Crypto Module</label>
    <label><input type="checkbox" name="api" value="libsodium"> Libsodium / NaCl</label>
  </fieldset>

  <button type="submit" class="btn-survey-submit">Complete Survey</button>
</form>`;
}

/** 9. HTML Table Generator */
export function generateHtmlTable(input: string): string {
  return `<div class="table-responsive">
  <table class="data-table">
    <thead>
      <tr>
        <th scope="col">ID</th>
        <th scope="col">Algorithm</th>
        <th scope="col">Key Size</th>
        <th scope="col">Security Level</th>
        <th scope="col">Status</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>101</td>
        <td>AES-256-GCM</td>
        <td>256-bit</td>
        <td>NIST FIPS 197 / Military Grade</td>
        <td><span class="badge badge-success">Active</span></td>
      </tr>
      <tr>
        <td>102</td>
        <td>ChaCha20-Poly1305</td>
        <td>256-bit</td>
        <td>RFC 8439 Authenticated</td>
        <td><span class="badge badge-success">Active</span></td>
      </tr>
      <tr>
        <td>103</td>
        <td>RSA-OAEP</td>
        <td>4096-bit</td>
        <td>Post-Quantum Transition</td>
        <td><span class="badge badge-warning">High Overhead</span></td>
      </tr>
    </tbody>
  </table>
</div>`;
}

/** 10. Responsive Navigation Generator */
export function generateResponsiveNav(input: string): string {
  return `<nav class="navbar" role="navigation" aria-label="Main Navigation">
  <div class="nav-container">
    <a href="/" class="brand-logo">
      <span class="logo-text">EncryptDecrypt</span>
    </a>

    <!-- Hamburger Toggle for Mobile -->
    <button class="nav-toggle" aria-expanded="false" aria-controls="nav-menu" aria-label="Toggle navigation menu">
      <span class="bar"></span>
      <span class="bar"></span>
      <span class="bar"></span>
    </button>

    <div id="nav-menu" class="nav-links">
      <a href="/tools" class="nav-item">Tools</a>
      <a href="/guides" class="nav-item">Tech Guides</a>
      <a href="/about" class="nav-item">About</a>
      <a href="/contact" class="nav-item">Contact</a>
      <a href="/tools/aes" class="nav-cta">Launch AES →</a>
    </div>
  </div>
</nav>`;
}

/** 11. Breadcrumb UI Generator */
export function generateBreadcrumbUi(input: string): string {
  return `<nav aria-label="Breadcrumb" class="breadcrumb-container">
  <ol class="breadcrumb-list" itemscope itemtype="https://schema.org/BreadcrumbList">
    <li class="breadcrumb-item" itemprop="itemListElement" itemscope itemtype="https://schema.org/ListItem">
      <a href="/" itemprop="item"><span itemprop="name">Home</span></a>
      <meta itemprop="position" content="1" />
    </li>
    <span class="separator">/</span>
    <li class="breadcrumb-item" itemprop="itemListElement" itemscope itemtype="https://schema.org/ListItem">
      <a href="/tools/cryptography" itemprop="item"><span itemprop="name">Cryptography</span></a>
      <meta itemprop="position" content="2" />
    </li>
    <span class="separator">/</span>
    <li class="breadcrumb-item active" aria-current="page" itemprop="itemListElement" itemscope itemtype="https://schema.org/ListItem">
      <span itemprop="name">AES-256-GCM Engine</span>
      <meta itemprop="position" content="3" />
    </li>
  </ol>
</nav>`;
}

/** 12. Pagination UI Generator */
export function generatePaginationUi(input: string): string {
  return `<nav aria-label="Pagination Navigation" class="pagination-nav">
  <ul class="pagination-list">
    <li><a href="?page=1" class="page-link prev disabled" aria-disabled="true">← Previous</a></li>
    <li><a href="?page=1" class="page-link active" aria-current="page">1</a></li>
    <li><a href="?page=2" class="page-link">2</a></li>
    <li><a href="?page=3" class="page-link">3</a></li>
    <li class="page-ellipsis"><span>…</span></li>
    <li><a href="?page=10" class="page-link">10</a></li>
    <li><a href="?page=2" class="page-link next">Next →</a></li>
  </ul>
</nav>`;
}

/** 13. Pricing Table Generator */
export function generatePricingTable(input: string): string {
  return `<div class="pricing-grid">
  <!-- Free Tier -->
  <div class="pricing-card">
    <h3 class="tier-title">Community</h3>
    <div class="price">$0 <span class="period">/ forever</span></div>
    <p class="tier-desc">100% client-side privacy tools for individual developers.</p>
    <ul class="features-list">
      <li>✓ 1,000+ Online Developer Tools</li>
      <li>✓ Zero Server Logging Guaranteed</li>
      <li>✓ W3C WebCrypto API Accelerated</li>
      <li>✓ No Signup or Credit Card Required</li>
    </ul>
    <a href="/tools" class="btn-tier">Start Free</a>
  </div>

  <!-- Pro Tier -->
  <div class="pricing-card featured">
    <div class="badge-featured">Popular</div>
    <h3 class="tier-title">Enterprise Self-Hosted</h3>
    <div class="price">$49 <span class="period">/ license</span></div>
    <p class="tier-desc">Deploy offline air-gapped container inside private clouds.</p>
    <ul class="features-list">
      <li>✓ Docker & K8s Air-Gapped Image</li>
      <li>✓ Custom Internal Branding</li>
      <li>✓ SOC2 / HIPAA Ready Verification</li>
      <li>✓ Priority Technical Support</li>
    </ul>
    <a href="/contact" class="btn-tier-featured">Contact Enterprise</a>
  </div>
</div>`;
}

/** 14. FAQ Accordion Generator */
export function generateFaqAccordion(input: string): string {
  return `<div class="faq-accordion" itemscope itemtype="https://schema.org/FAQPage">
  <!-- FAQ Item 1 -->
  <details class="faq-item" itemscope itemprop="mainEntity" itemtype="https://schema.org/Question">
    <summary class="faq-question" itemprop="name">
      Is my sensitive encryption key or password transmitted to any server?
    </summary>
    <div class="faq-answer" itemscope itemprop="acceptedAnswer" itemtype="https://schema.org/Answer">
      <p itemprop="text">
        No. EncryptDecrypt executes 100% inside your local web browser using the W3C Web Cryptography API. No plaintext or keys ever leave your machine.
      </p>
    </div>
  </details>

  <!-- FAQ Item 2 -->
  <details class="faq-item" itemscope itemprop="mainEntity" itemtype="https://schema.org/Question">
    <summary class="faq-question" itemprop="name">
      Can these tools be used offline without an internet connection?
    </summary>
    <div class="faq-answer" itemscope itemprop="acceptedAnswer" itemtype="https://schema.org/Answer">
      <p itemprop="text">
        Yes. Once loaded, the Single Page Application operates completely offline and requires zero external API communication.
      </p>
    </div>
  </details>
</div>`;
}

/** 15. Responsive Card Grid Generator */
export function generateResponsiveCardGrid(input: string): string {
  return `<div class="card-grid">
  <div class="ui-card">
    <div class="card-icon">🛡️</div>
    <h4>AES-256 Encryption</h4>
    <p>Symmetric cipher with authenticated GCM mode and random IV initialization.</p>
    <a href="/tools/aes" class="card-link">Launch Utility →</a>
  </div>

  <div class="ui-card">
    <div class="card-icon">⚡</div>
    <h4>SHA-512 Hashing</h4>
    <p>Cryptographic one-way digest generator with HMAC integrity keys.</p>
    <a href="/tools/sha512" class="card-link">Launch Utility →</a>
  </div>

  <div class="ui-card">
    <div class="card-icon">🔑</div>
    <h4>UUID v4 / v7</h4>
    <p>Cryptographically secure pseudo-random and time-ordered unique identifiers.</p>
    <a href="/tools/uuid" class="card-link">Launch Utility →</a>
  </div>
</div>`;
}

/** 16. Modal Dialog HTML Generator */
export function generateModalDialogHtml(input: string): string {
  return `<dialog id="securityModal" class="ui-modal">
  <div class="modal-content">
    <header class="modal-header">
      <h3>Zero-Knowledge Security Notice</h3>
      <button onclick="document.getElementById('securityModal').close()" class="btn-close" aria-label="Close dialog">✕</button>
    </header>

    <div class="modal-body">
      <p>All operations are processed strictly in browser volatile RAM. No server logs or cookies are generated.</p>
    </div>

    <footer class="modal-footer">
      <button onclick="document.getElementById('securityModal').close()" class="btn-secondary">Dismiss</button>
      <button onclick="document.getElementById('securityModal').close()" class="btn-primary">I Understand</button>
    </footer>
  </div>
</dialog>

<!-- Trigger Button -->
<button onclick="document.getElementById('securityModal').showModal()" class="btn-open-modal">Open Security Modal</button>`;
}

/** 17. Accessible Dropdown Generator */
export function generateAccessibleDropdown(input: string): string {
  return `<div class="custom-dropdown">
  <label id="cryptoLabel" for="cryptoSelect">Select Encryption Mode:</label>
  <select id="cryptoSelect" name="cryptoMode" aria-labelledby="cryptoLabel" class="form-select">
    <option value="gcm" selected>AES-GCM (Galois/Counter Mode - Recommended)</option>
    <option value="cbc">AES-CBC (Cipher Block Chaining with PKCS#7)</option>
    <option value="ctr">AES-CTR (Counter Mode)</option>
  </select>
</div>`;
}

/** 18. Form Validation Rules Generator */
export function generateFormValidationRules(input: string): string {
  return `=== STANDARD JAVASCRIPT / SCHEMA VALIDATION RULES ===

// 1. Password Complexity Regex:
const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{12,}$/;

// 2. RFC 5322 Compliant Email Regex:
const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$/;

// 3. E.164 International Phone Regex:
const phoneRegex = /^\\+[1-9]\\d{1,14}$/;

// 4. URL Validator Regex:
const urlRegex = /^https?:\\/\\/(?:www\\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\\.[a-zA-Z0-9()]{1,6}\\b(?:[-a-zA-Z0-9()@:%_+.~#?&/=]*)$/;

// 5. Semantic Versioning (SemVer) Regex:
const semverRegex = /^v?(0|[1-9]\\d*)\\.(0|[1-9]\\d*)\\.(0|[1-9]\\d*)(?:-((?:0|[1-9]\\d*|\\d*[a-zA-Z-][0-9a-zA-Z-]*)(?:\\.(?:0|[1-9]\\d*|\\d*[a-zA-Z-][0-9a-zA-Z-]*))*))?(?:\\+([0-9a-zA-Z-]+(?:\\.[0-9a-zA-Z-]+)*))?$/;`;
}

/** 19. HTML Input Pattern Generator */
export function generateHtmlInputPattern(input: string): string {
  return `=== HTML5 NATIVE FORM INPUT PATTERNS ===

1. Username (Alphanumeric 4-16 chars):
<input type="text" pattern="^[a-zA-Z0-9_]{4,16}$" title="4 to 16 letters, numbers, or underscores" required>

2. Credit Card (16 digits with optional dashes):
<input type="text" pattern="^(?:\\d{4}[- ]?){3}\\d{4}$" title="16-digit card number" required>

3. US ZIP Code (5 digits or ZIP+4):
<input type="text" pattern="^\\d{5}(?:-\\d{4})?$" title="5-digit ZIP or ZIP+4 format">

4. Hexadecimal Color Code (#RGB or #RRGGBB):
<input type="text" pattern="^#(?:[0-9a-fA-F]{3}){1,2}$" title="Hex code like #2E9BFF">

5. IPv4 Address:
<input type="text" pattern="^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$" title="Valid IPv4 Address">`;
}

/** 20. Responsive Footer Generator */
export function generateResponsiveFooter(input: string): string {
  return `<footer class="site-footer">
  <div class="footer-container">
    <div class="footer-col brand">
      <h3>EncryptDecrypt.org</h3>
      <p>100% private, zero-log developer cryptographic tools running in client memory.</p>
    </div>

    <div class="footer-col">
      <h4>Tools</h4>
      <ul>
        <li><a href="/tools/aes">AES Encryption</a></li>
        <li><a href="/tools/sha256">SHA-256 Hashing</a></li>
        <li><a href="/tools/base64">Base64 Encoder</a></li>
      </ul>
    </div>

    <div class="footer-col">
      <h4>Legal</h4>
      <ul>
        <li><a href="/privacy">Privacy Policy</a></li>
        <li><a href="/terms">Terms of Service</a></li>
        <li><a href="/disclaimer">Disclaimer</a></li>
      </ul>
    </div>
  </div>

  <div class="footer-bottom">
    <p>© 2026 EncryptDecrypt.org. All rights reserved. Zero server tracking.</p>
  </div>
</footer>`;
}
