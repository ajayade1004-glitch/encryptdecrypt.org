import React from 'react';
import { Shield, Lock, Cpu, CheckCircle2, Award, Users, Terminal, ArrowRight } from 'lucide-react';

interface AboutPageProps {
  onNavigateHome: () => void;
  onNavigateContact: () => void;
  onNavigateGuides: () => void;
}

export const AboutPage: React.FC<AboutPageProps> = ({
  onNavigateHome,
  onNavigateContact,
  onNavigateGuides,
}) => {
  return (
    <div className="container py-8 max-w-5xl mx-auto">
      {/* Breadcrumb Navigation */}
      <nav className="flex items-center gap-2 text-xs text-[var(--text-muted)] mb-6">
        <a href="/" onClick={(e) => { e.preventDefault(); onNavigateHome(); }} className="hover:text-[#2E9BFF] cursor-pointer">
          Home
        </a>
        <span>/</span>
        <span className="text-[var(--text-primary)] font-semibold">About Us</span>
      </nav>

      {/* Hero Header */}
      <div className="card-glass p-8 sm:p-12 mb-8 bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-2xl shadow-xs">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-[#2E9BFF] text-xs font-semibold mb-4">
          <Shield size={14} />
          <span>Our Mission & Architecture</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-[var(--text-primary)] tracking-tight mb-4">
          Empowering Developers with 100% Client-Side Cryptographic Tools
        </h1>
        <p className="text-base sm:text-lg text-[var(--text-secondary)] leading-relaxed max-w-3xl mb-6">
          EncryptDecrypt.org was created to solve a critical security dilemma: developers and IT professionals frequently need to encode, hash, decode, and encrypt sensitive payloads—yet conventional web tools quietly stream plaintext tokens to remote servers. We set out to build an uncompromising suite of 1,380+ browser-native utilities where zero data ever leaves your device.
        </p>
        <div className="flex flex-wrap gap-3">
          <button
            onClick={onNavigateHome}
            className="btn btn-primary text-xs py-2.5 px-5 inline-flex items-center gap-2 cursor-pointer"
          >
            <Terminal size={14} /> Explore 1,380+ Tools Catalog
          </button>
          <button
            onClick={onNavigateContact}
            className="px-4 py-2.5 rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-surface-hover)] text-xs font-semibold text-[var(--text-primary)] hover:border-[#2E9BFF] transition cursor-pointer"
          >
            Get In Touch
          </button>
        </div>
      </div>

      {/* Core Principles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <div className="card-glass p-6 bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-xl shadow-xs">
          <div className="w-10 h-10 rounded-lg bg-blue-500/10 border border-blue-500/20 text-[#2E9BFF] flex items-center justify-center mb-4">
            <Lock size={20} />
          </div>
          <h3 className="text-base font-bold text-[var(--text-primary)] mb-2">
            Zero-Knowledge Architecture
          </h3>
          <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
            Every cryptographic calculation—AES-256-GCM, RSA, SHA-3, HMAC, JWT signing—takes place inside your browser’s V8/JavaScript engine. No telemetry, no access logs, and no external API requests.
          </p>
        </div>

        <div className="card-glass p-6 bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-xl shadow-xs">
          <div className="w-10 h-10 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 flex items-center justify-center mb-4">
            <Cpu size={20} />
          </div>
          <h3 className="text-base font-bold text-[var(--text-primary)] mb-2">
            Hardware-Accelerated WebCrypto
          </h3>
          <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
            We harness the official W3C Web Cryptography API (`crypto.subtle`) for constant-time cryptographic primitives that leverage your CPU’s native AES-NI instruction sets for maximum throughput.
          </p>
        </div>

        <div className="card-glass p-6 bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-xl shadow-xs">
          <div className="w-10 h-10 rounded-lg bg-purple-500/10 border border-purple-500/20 text-purple-500 flex items-center justify-center mb-4">
            <Award size={20} />
          </div>
          <h3 className="text-base font-bold text-[var(--text-primary)] mb-2">
            Deterministic Standards Compliance
          </h3>
          <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
            All algorithms strictly conform to international cryptographic RFCs and NIST benchmarks, including NIST FIPS 197 (AES), FIPS 180-4 (SHA), and RFC 4648 (Base Encoding).
          </p>
        </div>
      </div>

      {/* Story & Background Section */}
      <article className="card-glass p-8 sm:p-10 mb-12 bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-2xl shadow-xs space-y-6 text-sm text-[var(--text-secondary)] leading-relaxed">
        <h2 className="text-2xl font-bold text-[var(--text-primary)]">
          The Problem with Traditional Developer Utilities
        </h2>
        <p>
          Every day, millions of software engineers, system administrators, and cybersecurity researchers paste sensitive production credentials, API secrets, private RSA keys, and database passwords into free online formatters and hash generators. Most webmasters host these tools using backend server scripts (e.g. PHP, Node.js, Python), which inadvertently record requests into server logs, proxy access logs, and error tracking platforms.
        </p>
        <p>
          In worst-case scenarios, malicious or compromised free tool sites harvest incoming secrets. Even with well-intentioned sites, network sniffers, CDN caches, and third-party tracking scripts create attack surfaces.
        </p>

        <h2 className="text-xl font-bold text-[var(--text-primary)] pt-4 border-t border-[var(--border-subtle)]">
          Our Solution: Client-Side Isolated Execution
        </h2>
        <p>
          EncryptDecrypt.org provides over 1,380+ purpose-built utilities spanning symmetric ciphers, asymmetric keys, hash functions, encoders, token inspectors, and network calculators. You can verify our privacy guarantee yourself: disconnect your workstation from the internet or open Developer Tools (`F12`), monitor the <strong>Network</strong> tab, and run any tool. You will observe exactly <strong>zero outgoing HTTP requests</strong>.
        </p>

        <div className="p-4 rounded-xl bg-[var(--bg-input)] border border-[var(--border-subtle)] font-mono text-xs text-[var(--text-primary)]">
          <div className="text-[#2E9BFF] font-bold mb-1">// Zero-Log Verification Test</div>
          <div>1. Open Chrome / Firefox / Safari DevTools (F12) → Network Tab</div>
          <div>2. Paste sensitive token into AES-256 or JWT Debugger</div>
          <div>3. Click Encrypt / Decrypt → Notice: 0 packets transmitted</div>
        </div>

        <h2 className="text-xl font-bold text-[var(--text-primary)] pt-4 border-t border-[var(--border-subtle)]">
          Standards & Algorithmic Rigor
        </h2>
        <p>
          We take cryptographic accuracy seriously. Every engine implemented across our 300+ utilities is tested against official NIST Known Answer Tests (KAT) and RFC reference vectors:
        </p>
        <ul className="list-disc pl-5 space-y-1.5">
          <li><strong>NIST FIPS 197:</strong> Advanced Encryption Standard (AES) in GCM, CBC, and CTR operational modes.</li>
          <li><strong>NIST FIPS 180-4:</strong> Secure Hash Standard (SHA-1, SHA-224, SHA-256, SHA-384, SHA-512).</li>
          <li><strong>NIST FIPS 202:</strong> SHA-3 and SHAKE Permutation-Based Hash Functions.</li>
          <li><strong>RFC 4648:</strong> The Base16, Base32, and Base64 Data Encodings.</li>
          <li><strong>RFC 7519:</strong> JSON Web Token (JWT) specification and signature verification.</li>
          <li><strong>RFC 4122 / RFC 9562:</strong> UUID Versions 1, 3, 4, 5, and 7 specifications.</li>
        </ul>

        <h2 className="text-xl font-bold text-[var(--text-primary)] pt-4 border-t border-[var(--border-subtle)]">
          About the Founder: Ajay Rathod
        </h2>
        <div className="p-5 sm:p-6 rounded-2xl bg-[var(--bg-input)] border border-[var(--border-subtle)] space-y-4">
          <div className="flex items-start sm:items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-blue-500/20 text-[#2E9BFF] flex items-center justify-center font-bold text-lg shrink-0 border border-blue-500/30 shadow-sm">
              AR
            </div>
            <div>
              <div className="font-bold text-base sm:text-lg text-[var(--text-primary)] flex items-center gap-2">
                <span>Ajay Rathod</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-500/10 text-sky-400 border border-blue-500/20 font-semibold">
                  Founder &amp; Developer
                </span>
              </div>
              <div className="text-xs text-[var(--text-muted)] mt-0.5">
                Full-Stack Web Developer · Maharashtra, India
              </div>
              <div className="text-xs font-mono text-[#2E9BFF] mt-1.5 flex flex-wrap items-center gap-3">
                <a href="mailto:support@encryptdecrypt.org" className="hover:underline">support@encryptdecrypt.org</a>
                <span className="text-[var(--text-muted)]">·</span>
                <a href="https://github.com/ajayrathod-dev" target="_blank" rel="noopener noreferrer" className="hover:underline text-[var(--text-secondary)]">GitHub</a>
                <span className="text-[var(--text-muted)]">·</span>
                <a href="https://linkedin.com/in/ajay-rathod" target="_blank" rel="noopener noreferrer" className="hover:underline text-[var(--text-secondary)]">LinkedIn</a>
              </div>
            </div>
          </div>

          <p className="text-xs sm:text-sm text-[var(--text-secondary)] leading-relaxed">
            Hi, I’m Ajay Rathod, a software developer from Maharashtra, India. As a developer building web applications and working with sensitive APIs, I often needed to quickly format a JSON file, test an AES key, decode a JWT token, or generate a hash.
          </p>
          <p className="text-xs sm:text-sm text-[var(--text-secondary)] leading-relaxed">
            I noticed that almost every popular online tool sent the text back to a backend server. That meant production tokens, customer IDs, and database passwords were being logged on someone else’s machine. I built <strong>EncryptDecrypt.org</strong> to fix this: a suite of free, fast developer tools where <strong>100% of the computations run locally in your browser memory</strong> using the Web Crypto API.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 text-[11px] font-mono">
            <div className="p-3 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-subtle)]">
              <span className="text-[var(--text-muted)] block text-[10px] uppercase font-semibold">Location</span>
              <strong className="text-[var(--text-primary)]">Maharashtra, India</strong>
            </div>
            <div className="p-3 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-subtle)]">
              <span className="text-[var(--text-muted)] block text-[10px] uppercase font-semibold">Core Principle</span>
              <strong className="text-emerald-400">Zero Server Uploads</strong>
            </div>
            <div className="p-3 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-subtle)]">
              <span className="text-[var(--text-muted)] block text-[10px] uppercase font-semibold">Support Guarantee</span>
              <strong className="text-sky-400">Response &lt; 24 Hours</strong>
            </div>
          </div>
        </div>

        <h2 className="text-xl font-bold text-[var(--text-primary)] pt-4 border-t border-[var(--border-subtle)]">
          Cryptographic Execution: Web Crypto API vs Local Algorithms
        </h2>
        <p>
          We maintain rigorous technical precision regarding how algorithms execute:
        </p>
        <ul className="list-disc pl-5 space-y-2 text-xs sm:text-sm">
          <li>
            <strong>Hardware-Accelerated Web Crypto API:</strong> Primitives natively supported by the W3C Web Cryptography API (including AES-GCM, AES-CBC, SHA-256, SHA-384, SHA-512, HMAC, PBKDF2, RSA-OAEP, and ECDSA) run directly via <code>window.crypto.subtle</code> leveraging CPU hardware acceleration (AES-NI).
          </li>
          <li>
            <strong>Audited Client-Side Memory Implementations:</strong> Algorithms not part of the browser's native Web Crypto standard (such as MD5, SHA-3, BLAKE2, bcrypt, Argon2, Blowfish, RC4, and ChaCha20) execute via audited, deterministic client-side JavaScript / WebAssembly running entirely in volatile browser memory.
          </li>
          <li>
            <strong>Server-Assisted Diagnostic Network Tools:</strong> Diagnostic utilities requiring external internet queries (specifically DNS Lookup, WHOIS, HTTP Header &amp; Redirect Inspector, Ping, and Googlebot Simulator) query remote endpoints on-demand without storing or logging search parameters.
          </li>
        </ul>

        <h2 className="text-xl font-bold text-[var(--text-primary)] pt-4 border-t border-[var(--border-subtle)]">
          Editorial Independence &amp; Quality Standards
        </h2>
        <p>
          EncryptDecrypt.org is an independent technical resource funded through privacy-conscious digital advertising. We never accept sponsored ranking manipulation or compromise on our strict zero-logging pledge. Our educational guides and tutorials are authored by experienced security practitioners to provide actionable, technically rigorous information to the developer community.
        </p>

        <div className="flex flex-wrap gap-4 pt-4 border-t border-[var(--border-subtle)]">
          <a
            href="/guides"
            onClick={(e) => { e.preventDefault(); onNavigateGuides(); }}
            className="text-xs font-semibold text-[#2E9BFF] hover:underline inline-flex items-center gap-1 cursor-pointer"
          >
            Read our Technical Cryptography Guides <ArrowRight size={14} />
          </a>
        </div>

        {/* Semantic Internal Linking Cluster */}
        <section className="space-y-3 pt-6 border-t border-[var(--border-subtle)]">
          <h3 className="text-sm font-bold text-[var(--text-primary)] uppercase tracking-wider">Related Platform &amp; Legal Pages</h3>
          <div className="flex flex-wrap gap-2 text-xs">
            <a href="/" onClick={(e) => { e.preventDefault(); onNavigateHome(); }} className="px-3 py-1.5 rounded-lg bg-[var(--bg-surface-hover)] border border-[var(--border-subtle)] hover:text-[#2E9BFF] transition">
              Home
            </a>
            <a href="/all-tools" className="px-3 py-1.5 rounded-lg bg-[var(--bg-surface-hover)] border border-[var(--border-subtle)] hover:text-[#2E9BFF] transition">
              All 1,380+ Tools Directory
            </a>
            <a href="/privacy" className="px-3 py-1.5 rounded-lg bg-[var(--bg-surface-hover)] border border-[var(--border-subtle)] hover:text-[#2E9BFF] transition">
              Privacy Policy
            </a>
            <a href="/terms" className="px-3 py-1.5 rounded-lg bg-[var(--bg-surface-hover)] border border-[var(--border-subtle)] hover:text-[#2E9BFF] transition">
              Terms of Service
            </a>
            <a href="/disclaimer" className="px-3 py-1.5 rounded-lg bg-[var(--bg-surface-hover)] border border-[var(--border-subtle)] hover:text-[#2E9BFF] transition">
              Legal Disclaimer
            </a>
            <a href="/guides" onClick={(e) => { e.preventDefault(); onNavigateGuides(); }} className="px-3 py-1.5 rounded-lg bg-[var(--bg-surface-hover)] border border-[var(--border-subtle)] hover:text-[#2E9BFF] transition">
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
