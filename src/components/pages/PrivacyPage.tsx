import React from 'react';
import { Shield, Lock, EyeOff, Cookie, CheckCircle2, AlertCircle } from 'lucide-react';

interface PrivacyPageProps {
  onNavigateHome: () => void;
  onNavigateContact: () => void;
}

export const PrivacyPage: React.FC<PrivacyPageProps> = ({
  onNavigateHome,
  onNavigateContact,
}) => {
  return (
    <div className="container py-8 max-w-4xl mx-auto">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-xs text-[var(--text-muted)] mb-6">
        <a href="/" onClick={(e) => { e.preventDefault(); onNavigateHome(); }} className="hover:text-[#2E9BFF] cursor-pointer">
          Home
        </a>
        <span>/</span>
        <span className="text-[var(--text-primary)] font-semibold">Privacy Policy</span>
      </nav>

      {/* Header Banner */}
      <div className="card-glass p-8 bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-2xl shadow-xs mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-[#2E9BFF] text-xs font-semibold mb-3">
          <Shield size={14} />
          <span>Privacy & Security Compliance</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-[var(--text-primary)] tracking-tight mb-2">
          Privacy Policy
        </h1>
        <p className="text-xs text-[var(--text-muted)] font-mono">
          Last Updated & Effective Date: January 1, 2026 · Complies with GDPR, CCPA/CPRA & Google Publisher Policies
        </p>
      </div>

      {/* Zero Storage Notice Highlight */}
      <div className="p-6 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 mb-8 flex items-start gap-4">
        <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-500 flex items-center justify-center shrink-0 mt-0.5">
          <Lock size={22} />
        </div>
        <div>
          <h3 className="text-sm font-bold text-[var(--text-primary)] mb-1">
            Our Core Guarantee: Zero Client-Side Data Storage or Transmission
          </h3>
          <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
            When you enter sensitive text, passwords, AES secret keys, RSA private credentials, or JWT tokens into any of our 300+ tools, <strong>that data is never transmitted across the internet to our servers or any third-party infrastructure</strong>. All processing is computed in your device's local memory (RAM) via standard client-side JavaScript and the W3C Web Cryptography API.
          </p>
        </div>
      </div>

      {/* Policy Content Sections */}
      <article className="card-glass p-8 sm:p-10 bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-2xl shadow-xs space-y-6 text-sm text-[var(--text-secondary)] leading-relaxed">
        <section className="space-y-3">
          <h2 className="text-xl font-bold text-[var(--text-primary)]">1. Introduction</h2>
          <p>
            EncryptDecrypt.org (&ldquo;we&rdquo;, &ldquo;our&rdquo;, or &ldquo;us&rdquo;) operates the website located at https://encryptdecrypt.org. This Privacy Policy outlines our practices concerning the collection, use, disclosure, and protection of information when you access or use our online cryptographic tools and services.
          </p>
          <p>
            By accessing or using EncryptDecrypt.org, you consent to the practices described in this Privacy Policy. If you do not agree with this policy, please discontinue use of our site.
          </p>
        </section>

        <section className="space-y-3 pt-4 border-t border-[var(--border-subtle)]">
          <h2 className="text-xl font-bold text-[var(--text-primary)]">2. Information We Do NOT Collect</h2>
          <p>
            Unlike conventional web-based developer converters, we fundamentally do not collect, process, or store user cryptographic payloads. Specifically:
          </p>
          <ul className="list-disc pl-5 space-y-1 text-xs sm:text-sm">
            <li>We do not record, transmit, or inspect your plaintexts, ciphertexts, passwords, hashes, or symmetric/asymmetric keys.</li>
            <li>We do not log user data into server databases, cloud caches, or backend logging files.</li>
            <li>For client-side cryptographic and data tools, disconnecting your workstation from the internet does not interrupt tool functionality, confirming zero data exfiltration.</li>
          </ul>
        </section>

        <section className="space-y-3 pt-4 border-t border-[var(--border-subtle)]">
          <h2 className="text-xl font-bold text-[var(--text-primary)] flex items-center gap-2">
            <Shield size={18} className="text-emerald-400" />
            2.1. Network Request Disclosure: Client-Side vs Server-Assisted Tools
          </h2>
          <p>
            To provide complete transparency regarding network traffic:
          </p>
          <div className="space-y-3 text-xs sm:text-sm">
            <div className="p-3.5 rounded-xl bg-[var(--bg-input)] border border-[var(--border-subtle)]">
              <strong className="text-emerald-400 block mb-1">1. Client-Side Tools (1,300+ Tools) — Zero Network Transmission</strong>
              <p className="text-slate-300">
                All Cryptographic Ciphers (AES-GCM, AES-CBC, ChaCha20, RSA), Hashing Functions (SHA-256, SHA-512, MD5, SHA-3, BLAKE2, HMAC), Data Encoders (Base64, Hex, URL, Base58), Identifiers (UUID, NanoID), Formatters, and Converters run strictly within the client browser's local sandbox memory. Zero bytes are ever transmitted to any remote server.
              </p>
            </div>
            <div className="p-3.5 rounded-xl bg-[var(--bg-input)] border border-[var(--border-subtle)]">
              <strong className="text-sky-400 block mb-1">2. Server-Assisted Diagnostic Tools — Explicit On-Demand Queries</strong>
              <p className="text-slate-300 mb-2">
                A small, dedicated set of network diagnostic utilities inherently require external connectivity to perform their function when deliberately requested by the user:
              </p>
              <ul className="list-disc pl-5 space-y-1 text-slate-300 text-xs">
                <li><strong>DNS Lookup:</strong> Resolves DNS records (A, AAAA, MX, TXT, CNAME, NS) for the user-specified hostname via standard public DNS resolvers.</li>
                <li><strong>WHOIS Domain Checker:</strong> Queries public registrar WHOIS databases for the requested domain name.</li>
                <li><strong>HTTP Header &amp; Redirect Inspector:</strong> Fetches HTTP response headers and status codes from the target URL provided by the user.</li>
                <li><strong>Ping / Host Diagnostic:</strong> Measures round-trip reachability to the user-specified server.</li>
                <li><strong>Googlebot Simulator:</strong> Inspects public web page headers using Googlebot User-Agent simulation.</li>
              </ul>
              <p className="text-[11px] text-slate-400 mt-2">
                Privacy Guarantee for Server-Assisted Tools: The server acts solely as a stateless transparent proxy. Queries are processed on-demand in memory, never stored in databases, never linked to user identities, and immediately discarded upon response completion.
              </p>
            </div>
          </div>
        </section>

        <section className="space-y-3 pt-4 border-t border-[var(--border-subtle)]">
          <h2 className="text-xl font-bold text-[var(--text-primary)] flex items-center gap-2">
            <Cookie size={18} className="text-[#2E9BFF]" />
            3. Cookies, Advertising & Third-Party Vendors (Google AdSense)
          </h2>
          <p>
            To provide our 300+ utilities as a completely free, unrestricted service, we display digital advertisements through third-party advertising networks, including Google AdSense. In accordance with Google&rsquo;s required publisher policy disclosures:
          </p>
          <ul className="list-disc pl-5 space-y-2 text-xs sm:text-sm">
            <li>
              <strong>Third-Party Vendors:</strong> Third-party vendors, including Google, use cookies to serve ads based on a user&rsquo;s prior visits to this website or other websites on the Internet.
            </li>
            <li>
              <strong>Advertising Cookies:</strong> Google&rsquo;s use of advertising cookies (such as the DoubleClick DART cookie) enables it and its partners to serve personalized advertisements to users based on their visits to our site and/or other sites on the Internet.
            </li>
            <li>
              <strong>Personalized Advertising Opt-Out:</strong> Users may opt out of personalized advertising at any time by visiting <a href="https://www.google.com/settings/ads" target="_blank" rel="noopener noreferrer" className="text-[#2E9BFF] hover:underline font-semibold">Google Ads Settings</a>.
            </li>
            <li>
              <strong>Third-Party Opt-Out:</strong> Alternatively, you can opt out of a third-party vendor&rsquo;s use of cookies for personalized advertising by visiting the Digital Advertising Alliance Consumer Choice page at <a href="https://www.aboutads.info/choices/" target="_blank" rel="noopener noreferrer" className="text-[#2E9BFF] hover:underline font-semibold">www.aboutads.info</a> or the Network Advertising Initiative at <a href="https://www.networkadvertising.org/choices/" target="_blank" rel="noopener noreferrer" className="text-[#2E9BFF] hover:underline font-semibold">www.networkadvertising.org</a>.
            </li>
            <li>
              <strong>Browser Cookies:</strong> We only utilize non-identifying local storage values to remember your light/dark theme preference and locally saved favorites. These never leave your device.
            </li>
          </ul>
        </section>

        <section className="space-y-3 pt-4 border-t border-[var(--border-subtle)]">
          <h2 className="text-xl font-bold text-[var(--text-primary)]">4. Server Log Files & Technical Telemetry</h2>
          <p>
            Like virtually all website hosts, our network infrastructure automatically receives technical metadata sent by your browser. This includes:
          </p>
          <ul className="list-disc pl-5 space-y-1 text-xs sm:text-sm">
            <li>Browser type and version (User-Agent string)</li>
            <li>Operating system architecture</li>
            <li>Referring URL and requested page asset</li>
            <li>Date and time stamps of asset delivery</li>
            <li>Internet Protocol (IP) address for DDoS mitigation and geolocation routing</li>
          </ul>
          <p className="text-xs text-[var(--text-muted)]">
            This technical data is aggregated for system health, traffic monitoring, and server security. It is never linked to any personally identifiable information.
          </p>
        </section>

        <section className="space-y-3 pt-4 border-t border-[var(--border-subtle)]">
          <h2 className="text-xl font-bold text-[var(--text-primary)]">5. GDPR Privacy Rights (European Union & UK)</h2>
          <p>
            Under the European General Data Protection Regulation (GDPR), users located in the EEA and UK possess specific data rights:
          </p>
          <ul className="list-disc pl-5 space-y-1 text-xs sm:text-sm">
            <li><strong>Right to Access:</strong> You have the right to request copies of your personal data held by us.</li>
            <li><strong>Right to Rectification:</strong> You can request corrections to incomplete or inaccurate data.</li>
            <li><strong>Right to Erasure (&ldquo;Right to be Forgotten&rdquo;):</strong> You may request deletion of personal information.</li>
            <li><strong>Right to Restrict Processing:</strong> You can object to or restrict processing of your information.</li>
            <li><strong>Right to Data Portability:</strong> You can request transfer of collected data to another entity.</li>
          </ul>
          <p className="text-xs text-[var(--text-muted)]">
            Because our architecture does not retain user identities or payload data, our systems store negligible personal records beyond standard IP connection logs.
          </p>
        </section>

        <section className="space-y-3 pt-4 border-t border-[var(--border-subtle)]">
          <h2 className="text-xl font-bold text-[var(--text-primary)]">6. CCPA / CPRA Notice (California Residents)</h2>
          <p>
            Under the California Consumer Privacy Act (CCPA) and California Privacy Rights Act (CPRA), California consumers have specific rights:
          </p>
          <ul className="list-disc pl-5 space-y-1 text-xs sm:text-sm">
            <li><strong>No Sale of Personal Information:</strong> EncryptDecrypt.org does NOT sell, rent, or trade your personal information or browsing records to third parties for monetary or valuable consideration.</li>
            <li><strong>Right to Know:</strong> You may request disclosure of categories of personal information collected.</li>
            <li><strong>Non-Discrimination:</strong> We will not discriminate against any user for exercising their statutory CCPA/CPRA rights.</li>
          </ul>
        </section>

        <section className="space-y-3 pt-4 border-t border-[var(--border-subtle)]">
          <h2 className="text-xl font-bold text-[var(--text-primary)]">7. Children&rsquo;s Privacy (COPPA Compliance)</h2>
          <p>
            EncryptDecrypt.org does not knowingly collect or solicit personal information from children under the age of 13. If you believe that a child has provided personally identifiable information to us, please contact us immediately and we will promptly purge such records.
          </p>
        </section>

        <section className="space-y-3 pt-4 border-t border-[var(--border-subtle)]">
          <h2 className="text-xl font-bold text-[var(--text-primary)]">8. Changes to This Privacy Policy</h2>
          <p>
            We may periodically revise this Privacy Policy to reflect updates to our cryptographic tool collection, legal standards, or advertising guidelines. Changes will be posted to this URL with an updated effective date.
          </p>
        </section>

        <section className="space-y-3 pt-4 border-t border-[var(--border-subtle)]">
          <h2 className="text-xl font-bold text-[var(--text-primary)]">9. Contacting Our Data Protection Officer</h2>
          <p>
            If you have questions, inquiries, or privacy rights requests regarding this Privacy Policy, please contact our privacy desk:
          </p>
          <div className="p-4 rounded-xl bg-[var(--bg-surface-hover)] border border-[var(--border-subtle)] text-xs font-mono">
            <div>Email: <a href="mailto:admin@EncryptDecrypt.org" className="text-[#2E9BFF] hover:underline">admin@EncryptDecrypt.org</a></div>
            <div>Support: <a href="mailto:ajay.rathod8796@gmail.com" className="text-[#2E9BFF] hover:underline">ajay.rathod8796@gmail.com</a></div>
            <div>Postal: EncryptDecrypt.org Privacy Team, Global Operations</div>
          </div>
          <div className="pt-2">
            <a
              href="/contact"
              onClick={(e) => { e.preventDefault(); onNavigateContact(); }}
              className="text-xs font-semibold text-[#2E9BFF] hover:underline cursor-pointer"
            >
              Or submit an inquiry via our interactive Contact Form →
            </a>
          </div>
        </section>

        {/* Semantic Internal Linking Cluster for Search Crawlers */}
        <section className="space-y-3 pt-6 border-t border-[var(--border-subtle)]">
          <h3 className="text-sm font-bold text-[var(--text-primary)] uppercase tracking-wider">Related Legal &amp; Platform Pages</h3>
          <div className="flex flex-wrap gap-2 text-xs">
            <a href="/" onClick={(e) => { e.preventDefault(); onNavigateHome(); }} className="px-3 py-1.5 rounded-lg bg-[var(--bg-surface-hover)] border border-[var(--border-subtle)] hover:text-[#2E9BFF] transition">
              Home
            </a>
            <a href="/all-tools" className="px-3 py-1.5 rounded-lg bg-[var(--bg-surface-hover)] border border-[var(--border-subtle)] hover:text-[#2E9BFF] transition">
              All 1,380+ Tools Directory
            </a>
            <a href="/terms" className="px-3 py-1.5 rounded-lg bg-[var(--bg-surface-hover)] border border-[var(--border-subtle)] hover:text-[#2E9BFF] transition">
              Terms of Service
            </a>
            <a href="/disclaimer" className="px-3 py-1.5 rounded-lg bg-[var(--bg-surface-hover)] border border-[var(--border-subtle)] hover:text-[#2E9BFF] transition">
              Legal Disclaimer
            </a>
            <a href="/about" className="px-3 py-1.5 rounded-lg bg-[var(--bg-surface-hover)] border border-[var(--border-subtle)] hover:text-[#2E9BFF] transition">
              About EncryptDecrypt.org
            </a>
            <a href="/guides" className="px-3 py-1.5 rounded-lg bg-[var(--bg-surface-hover)] border border-[var(--border-subtle)] hover:text-[#2E9BFF] transition">
              Technical Guides &amp; Whitepapers
            </a>
            <a href="/contact" onClick={(e) => { e.preventDefault(); onNavigateContact(); }} className="px-3 py-1.5 rounded-lg bg-[var(--bg-surface-hover)] border border-[var(--border-subtle)] hover:text-[#2E9BFF] transition">
              Contact Desk
            </a>
          </div>
        </section>
      </article>
    </div>
  );
};
