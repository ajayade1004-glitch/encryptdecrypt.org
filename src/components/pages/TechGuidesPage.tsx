import React, { useState } from 'react';
import { BookOpen, Shield, Lock, Cpu, Key, ArrowRight, CheckCircle2, ChevronRight, Terminal } from 'lucide-react';
import { ToolItem } from '../../types';

interface TechGuidesPageProps {
  onNavigateHome: () => void;
  onSelectToolBySlug: (slug: string) => void;
}

interface GuideItem {
  id: string;
  slug: string;
  title: string;
  category: string;
  readTime: string;
  updated: string;
  summary: string;
  relatedToolSlug: string;
  content: {
    intro: string;
    sections: {
      heading: string;
      body: string;
      codeSnippet?: string;
    }[];
    takeaways: string[];
  };
}

export const TECH_GUIDES_DATA: GuideItem[] = [
  {
    id: 'guide-aes',
    slug: 'aes-256-gcm-vs-cbc',
    title: 'Symmetric Encryption Mastery: AES-256-GCM vs. AES-CBC in Modern Cryptography',
    category: 'Ciphers & Cryptanalysis',
    readTime: '7 min read',
    updated: 'Updated for 2026 Standards',
    summary: 'An architectural deep-dive into authenticated encryption with associated data (AEAD), comparing Galois/Counter Mode (GCM) against Cipher Block Chaining (CBC) to protect confidentiality and integrity.',
    relatedToolSlug: 'aes-encryption-decryption',
    content: {
      intro: 'The Advanced Encryption Standard (AES), formalized in NIST FIPS 197, is the undisputed cornerstone of modern symmetric cryptography. However, encrypting plaintext with a 256-bit key alone does not guarantee security; the chosen operational block cipher mode dictates whether the ciphertext is vulnerable to chosen-ciphertext and padding oracle attacks.',
      sections: [
        {
          heading: '1. Why AES-CBC is Deprecated in Modern Web Protocols',
          body: 'In Cipher Block Chaining (CBC) mode, each plaintext block is XORed with the preceding ciphertext block prior to encryption. The critical vulnerability of CBC lies in its lack of native integrity verification. When decrypted on an application server, variations in padding responses (e.g., PKCS#7 error vs. MAC failure) expose padding oracle exploits such as the infamous POODLE and Lucky Thirteen attacks. CBC requires an external HMAC applied under the "Encrypt-then-MAC" paradigm to achieve authenticated security, a process that is easily misconfigured.',
        },
        {
          heading: '2. The Supremacy of Galois/Counter Mode (GCM)',
          body: 'AES-GCM is an Authenticated Encryption with Associated Data (AEAD) construction. It pairs Counter (CTR) mode encryption with universal hashing over a binary Galois field (GHASH) to generate an unforgeable 128-bit authentication tag. If an attacker modifies even a single bit of the ciphertext, the GMAC calculation fails and the deciphering process aborts immediately, preventing plaintext leakage.',
          codeSnippet: `// Modern WebCrypto implementation of AES-256-GCM
const iv = crypto.getRandomValues(new Uint8Array(12)); // 96-bit IV
const key = await crypto.subtle.generateKey(
  { name: 'AES-GCM', length: 256 },
  true,
  ['encrypt', 'decrypt']
);

const ciphertextWithTag = await crypto.subtle.encrypt(
  { name: 'AES-GCM', iv },
  key,
  new TextEncoder().encode('Confidential payload')
);`,
        },
        {
          heading: '3. Critical Implementation Constraint: IV/Nonce Re-use',
          body: 'The Achilles heel of AES-GCM is nonce reuse. If the same 96-bit Initialization Vector (IV) is ever used twice with the same key, both ciphertexts can be XORed to reveal relative plaintext differences, and the underlying GHASH authentication key (H) can be mathematically extracted, destroying all integrity and confidentiality guarantees. Always utilize a cryptographically secure pseudo-random number generator (CSPRNG) or a strictly incremented 64-bit monotonic counter.',
        },
      ],
      takeaways: [
        'Always prioritize AES-256-GCM over AES-CBC for new software designs.',
        'Never reuse an IV/Nonce with the same symmetric key in GCM mode.',
        'Enforce 128-bit authentication tags to prevent forgery.',
        'Use native hardware acceleration via the Web Cryptography API.',
      ],
    },
  },
  {
    id: 'guide-jwt',
    slug: 'jwt-security-architecture-and-signature-verification',
    title: 'JWT Security Architecture: Signature Verification, Alg:None Attacks & Token Hardening',
    category: 'Token & Auth Security',
    readTime: '6 min read',
    updated: 'Updated for 2026 Standards',
    summary: 'Learn how to inspect, decode, and cryptographically harden JSON Web Tokens (RFC 7519) to mitigate signature stripping, weak HMAC secrets, and algorithm confusion vulnerabilities.',
    relatedToolSlug: 'jwt-token-debugger-generator',
    content: {
      intro: 'JSON Web Tokens (JWT) are ubiquitous in modern microservices and single-page applications for transmitting claims securely. Comprising three Base64URL-encoded segments (Header.Payload.Signature), JWTs provide stateless authorization. However, flawed client or server implementations consistently lead to authentication bypass vulnerabilities.',
      sections: [
        {
          heading: '1. Anatomy of the RFC 7519 Structure',
          body: 'A JWT is structured as three dot-separated components: the Header declares the token type and cryptographic algorithm (e.g., HS256, RS256); the Payload contains registered and custom claims (e.g., sub, exp, iss); and the Signature is generated by digesting the header and payload with a shared secret or private RSA/EC key.',
          codeSnippet: `// Token Format:
// [BASE64URL(Header)].[BASE64URL(Payload)].[BASE64URL(Signature)]

// Header Example:
{ "alg": "HS256", "typ": "JWT" }

// Payload Example:
{ "sub": "1234567890", "name": "Admin", "exp": 1773792000 }`,
        },
        {
          heading: '2. The "alg: none" Vulnerability & Algorithm Confusion',
          body: 'The RFC standard supports an unsigned token mode labeled "alg": "none". Poorly coded validation libraries that accept the header parameter at face value without server-side algorithm whitelisting will validate tampered payloads if an attacker replaces "HS256" with "none" and deletes the signature. Never rely on the client header to determine the verification key.',
        },
        {
          heading: '3. Symmetric (HS256) vs. Asymmetric (RS256 / ES256)',
          body: 'When multiple microservices inspect tokens, using symmetric HS256 requires distributing the shared secret to every service. If a single consumer is compromised, attackers can forge arbitrary valid tokens. Use asymmetric algorithms like RS256 or ES256 (ECDSA P-256) so only the authentication authority possesses the private signing key, while clients verify signatures using the public key.',
        },
      ],
      takeaways: [
        'Strictly whitelist allowed signing algorithms on the server.',
        'Always validate the "exp" (expiration) and "iss" (issuer) claims.',
        'Ensure HMAC secrets have at least 256 bits of cryptographically random entropy.',
        'Prefer RS256 or ES256 in distributed microservice architectures.',
      ],
    },
  },
  {
    id: 'guide-hashes',
    slug: 'cryptographic-hash-functions-sha-256-vs-sha-3-vs-md5',
    title: 'The Evolution of Cryptographic Hashing: Why SHA-256 and SHA-3 Succeeded MD5 and SHA-1',
    category: 'Hashing & Integrity',
    readTime: '8 min read',
    updated: 'Updated for 2026 Standards',
    summary: 'A definitive breakdown of collision resistance, pre-image resistance, Merkle-Damgård vulnerabilities (length extension), and the Sponge construction of Keccak / SHA-3.',
    relatedToolSlug: 'sha-256-hash-generator',
    content: {
      intro: 'A cryptographic hash function transforms an arbitrary-length binary stream into a fixed-size digest. The bedrock of digital signatures, blockchain ledgers, and password storage, hash functions must satisfy three golden properties: pre-image resistance, second pre-image resistance, and collision resistance.',
      sections: [
        {
          heading: '1. The Collapse of MD5 and SHA-1',
          body: 'MD5 (128-bit) and SHA-1 (160-bit) were once the global standard for data integrity. However, differential cryptanalysis shattered their collision resistance. In 2017, Google announced the SHAttered attack, producing two distinct PDF documents with identical SHA-1 hashes. Today, both algorithms are completely prohibited in security-sensitive protocols and digital certificates.',
        },
        {
          heading: '2. The Merkle-Damgård Construction & Length Extension Attacks',
          body: 'SHA-256 belongs to the SHA-2 family and uses the Merkle-Damgård iterative compression design. While robust against collisions, it is inherently susceptible to Length Extension Attacks when used in naive MAC schemes (e.g., Hash(Secret || Message)). An attacker who knows the hash and message length can append malicious data and calculate the valid hash without ever discovering the secret. This necessitated the creation of HMAC (RFC 2104).',
          codeSnippet: `// Length Extension Attack Pattern on Merkle-Damgård:
// Known: H(Secret || "view_account")
// Attacker computes: H(Secret || "view_account" || Padding || "grant_admin")
// Solution: Always use HMAC-SHA256: HMAC(Key, Message)`,
        },
        {
          heading: '3. SHA-3 and the Keccak Sponge Construction',
          body: 'Selected by NIST after an intensive multi-year competition, SHA-3 is based on the revolutionary Sponge Construction rather than Merkle-Damgård. By absorbing data into a fixed-state permutation and squeezing out arbitrary-length outputs, SHA-3 is naturally immune to length extension attacks without requiring HMAC encapsulation.',
        },
      ],
      takeaways: [
        'Never use MD5 or SHA-1 for signatures, authentication, or tamper detection.',
        'Use SHA-256 or SHA-512 for high-throughput baseline verification.',
        'Never concatenate Secret + Message to build a MAC; use HMAC-SHA256.',
        'Adopt SHA-3 for resistance against length extension vulnerabilities.',
      ],
    },
  },
  {
    id: 'guide-webcrypto',
    slug: 'zero-knowledge-web-apps-w3c-webcrypto-guide',
    title: 'Zero-Knowledge Web Applications: Utilizing the W3C Web Cryptography API Safely',
    category: 'Browser Security & Web Standards',
    readTime: '6 min read',
    updated: 'Updated for 2026 Standards',
    summary: 'Practical guidelines for implementing zero-knowledge encryption directly inside modern web browsers using SubtleCrypto, secure memory management, and Content Security Policy.',
    relatedToolSlug: 'web-crypto-api-suite',
    content: {
      intro: 'Web applications were historically considered unsafe for serious cryptography due to lack of secure random number generators and side-channel timing leaks in JavaScript. The W3C Web Cryptography API changed this paradigm forever, introducing native browser primitives executing inside constant-time C++ browser runtimes.',
      sections: [
        {
          heading: '1. Accessing window.crypto.subtle',
          body: 'The Web Cryptography API is only accessible in Secure Contexts (HTTPS or localhost). It exposes a non-blocking Promise-based interface called crypto.subtle that offloads cryptographic computation from the main thread directly to underlying platform libraries like BoringSSL (Chrome) or NSS (Firefox).',
        },
        {
          heading: '2. Secure Randomness via CSPRNG',
          body: 'Math.random() is a pseudo-random generator with a predictable internal state, completely useless for security. The WebCrypto API provides crypto.getRandomValues(), which seeds cryptographically secure entropy directly from the host operating system kernel (/dev/urandom on Unix, CryptGenRandom on Windows).',
          codeSnippet: `// Cryptographically secure random bytes generator
const buffer = new Uint8Array(32); // 256 bits of entropy
window.crypto.getRandomValues(buffer);
const hexString = Array.from(buffer)
  .map(b => b.toString(16).padStart(2, '0'))
  .join('');`,
        },
        {
          heading: '3. Memory Hygiene and Side-Channel Mitigation',
          body: 'JavaScript strings are immutable and cannot be zeroized in RAM, leaving remnants in garbage collection sweeps. When handling high-security credentials, use TypedArrays (Uint8Array) which can be actively overwritten using `buffer.fill(0)` immediately following cryptographic transformation.',
        },
      ],
      takeaways: [
        'Never use Math.random() for security tokens, keys, or passwords.',
        'WebCrypto requires HTTPS for all production deployments.',
        'Zeroize Uint8Array memory buffers after finishing computations.',
        'Implement strict Content Security Policy (CSP) to block malicious XSS injection.',
      ],
    },
  },
  {
    id: 'guide-chmod',
    slug: 'unix-file-permissions-and-octal-chmod-demystified',
    title: 'Unix File Permissions & Octal Chmod Demystified: The Complete Security Guide',
    category: 'System Security & Administration',
    readTime: '5 min read',
    updated: 'Updated for 2026 Standards',
    summary: 'A comprehensive operational guide to Unix permission bits (Read, Write, Execute), user classes (Owner, Group, Other), SUID, SGID, and the Sticky Bit.',
    relatedToolSlug: 'unix-file-permissions-chmod-calculator',
    content: {
      intro: 'POSIX file permissions are the first line of defense in Linux and Unix-like operating systems. A misconfigured permission bit on an SSH private key (`~/.ssh/id_rsa`), configuration file, or executable can lead to immediate system compromise through privilege escalation.',
      sections: [
        {
          heading: '1. Binary to Octal Mathematics',
          body: 'Each permission class (User, Group, Others) has three discrete bits: Read (4), Write (2), and Execute (1). By adding these numeric weights together, we obtain a single octal digit between 0 and 7. For example, Read + Write = 4 + 2 = 6; Read + Execute = 4 + 1 = 5; Read + Write + Execute = 4 + 2 + 1 = 7.',
        },
        {
          heading: '2. The Danger of chmod 777',
          body: 'Running `chmod 777 file.txt` grants full read, write, and execution capabilities to every user and process on the machine. On web servers, this allows web-facing scripts (e.g. Apache or Nginx worker pools) to be overwritten by attackers to achieve remote code execution (RCE). Standard files should generally be `644` (rw-r--r--) and directories `755` (rwxr-xr-x).',
        },
        {
          heading: '3. Special Permissions: SUID, SGID, and Sticky Bit',
          body: 'A leading fourth digit represents special flags: SUID (4) executes the binary with the file owner permissions; SGID (2) inherits group ownership; Sticky Bit (1) ensures only the file creator can delete or rename files inside a shared directory (such as /tmp).',
        },
      ],
      takeaways: [
        'Never use chmod 777 in production environments.',
        'SSH private keys must strictly have 600 or 400 permissions.',
        'Shared temporary directories require the sticky bit (chmod 1777 /tmp).',
        'Use our interactive Chmod Calculator to verify complex permission matrices.',
      ],
    },
  },
];

export const TechGuidesPage: React.FC<TechGuidesPageProps> = ({
  onNavigateHome,
  onSelectToolBySlug,
}) => {
  const [selectedGuide, setSelectedGuide] = useState<GuideItem | null>(null);

  return (
    <div className="container py-8 max-w-5xl mx-auto">
      {/* Breadcrumb Navigation */}
      <nav className="flex items-center gap-2 text-xs text-[var(--text-muted)] mb-6">
        <button onClick={onNavigateHome} className="hover:text-[#2E9BFF] cursor-pointer">
          Home
        </button>
        <span>/</span>
        {selectedGuide ? (
          <>
            <button
              onClick={() => setSelectedGuide(null)}
              className="hover:text-[#2E9BFF] cursor-pointer"
            >
              Tech Guides
            </button>
            <span>/</span>
            <span className="text-[var(--text-primary)] font-semibold truncate max-w-xs">
              {selectedGuide.title}
            </span>
          </>
        ) : (
          <span className="text-[var(--text-primary)] font-semibold">Tech Guides & Cryptography Documentation</span>
        )}
      </nav>

      {selectedGuide ? (
        /* Full Article Reader View */
        <div className="space-y-6">
          <button
            onClick={() => setSelectedGuide(null)}
            className="text-xs font-semibold text-[#2E9BFF] hover:underline inline-flex items-center gap-1 cursor-pointer mb-2"
          >
            ← Back to All Tech Guides
          </button>

          <article className="card-glass p-8 sm:p-12 bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-2xl shadow-xs">
            <div className="flex flex-wrap items-center gap-2 mb-4">
              <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded bg-blue-500/10 text-[#2E9BFF] border border-blue-500/20">
                {selectedGuide.category}
              </span>
              <span className="text-xs text-[var(--text-muted)]">·</span>
              <span className="text-xs text-[var(--text-muted)]">{selectedGuide.readTime}</span>
              <span className="text-xs text-[var(--text-muted)]">·</span>
              <span className="text-xs text-emerald-500 font-semibold">{selectedGuide.updated}</span>
            </div>

            <h1 className="text-2xl sm:text-4xl font-extrabold text-[var(--text-primary)] tracking-tight mb-6 leading-tight">
              {selectedGuide.title}
            </h1>

            <p className="text-base sm:text-lg text-[var(--text-secondary)] leading-relaxed mb-8 pb-6 border-b border-[var(--border-subtle)]">
              {selectedGuide.content.intro}
            </p>

            {/* Sections */}
            <div className="space-y-8 text-sm text-[var(--text-secondary)] leading-relaxed">
              {selectedGuide.content.sections.map((sec, idx) => (
                <div key={idx} className="space-y-3">
                  <h2 className="text-xl font-bold text-[var(--text-primary)]">
                    {sec.heading}
                  </h2>
                  <p>{sec.body}</p>
                  {sec.codeSnippet && (
                    <div className="my-4 rounded-xl bg-[var(--bg-input)] border border-[var(--border-subtle)] p-4 font-mono text-xs text-[var(--text-primary)] overflow-x-auto">
                      <pre className="m-0 leading-relaxed">{sec.codeSnippet}</pre>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Key Takeaways Card */}
            <div className="mt-10 p-6 rounded-xl bg-[var(--bg-surface-hover)] border border-[var(--border-subtle)]">
              <h3 className="text-sm font-bold text-[var(--text-primary)] uppercase tracking-wider mb-3 flex items-center gap-2">
                <CheckCircle2 size={16} className="text-emerald-500" />
                Key Security Takeaways
              </h3>
              <ul className="space-y-2 text-xs sm:text-sm text-[var(--text-secondary)]">
                {selectedGuide.content.takeaways.map((point, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-[#2E9BFF] font-bold">✓</span>
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Interactive Tool Banner */}
            <div className="mt-8 pt-6 border-t border-[var(--border-subtle)] flex flex-wrap items-center justify-between gap-4">
              <div>
                <h4 className="text-sm font-bold text-[var(--text-primary)] mb-1">
                  Test This Concept Instantly in Your Browser
                </h4>
                <p className="text-xs text-[var(--text-muted)]">
                  Launch the associated 100% client-side tool with zero server logging.
                </p>
              </div>
              <button
                onClick={() => onSelectToolBySlug(selectedGuide.relatedToolSlug)}
                className="btn btn-primary text-xs py-2 px-5 inline-flex items-center gap-2 cursor-pointer"
              >
                <Terminal size={14} /> Open Live Interactive Tool →
              </button>
            </div>
          </article>
        </div>
      ) : (
        /* Guides Catalog Grid */
        <div>
          {/* Header Banner */}
          <div className="card-glass p-8 sm:p-10 mb-8 bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-2xl shadow-xs">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-[#2E9BFF] text-xs font-semibold mb-3">
              <BookOpen size={14} />
              <span>Technical Knowledge Base</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-[var(--text-primary)] tracking-tight mb-3">
              Developer Cryptography & Security Guides
            </h1>
            <p className="text-sm sm:text-base text-[var(--text-secondary)] max-w-3xl leading-relaxed">
              In-depth, peer-reviewed technical tutorials on symmetric encryption algorithms, modern token architectures, collision-resistant hash functions, and POSIX permission modeling. Written by engineers for engineers.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
            {TECH_GUIDES_DATA.map(guide => (
              <div
                key={guide.id}
                onClick={() => setSelectedGuide(guide)}
                className="card-glass p-6 bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-xl shadow-xs hover:-translate-y-1 hover:border-[#2E9BFF]/60 transition duration-200 cursor-pointer group flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[11px] font-semibold px-2 py-0.5 rounded bg-blue-500/10 text-[#2E9BFF] border border-blue-500/20">
                      {guide.category}
                    </span>
                    <span className="text-[11px] text-[var(--text-muted)]">
                      {guide.readTime}
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-[var(--text-primary)] group-hover:text-[#2E9BFF] transition mb-2 leading-snug">
                    {guide.title}
                  </h3>
                  <p className="text-xs text-[var(--text-secondary)] line-clamp-3 leading-relaxed mb-4">
                    {guide.summary}
                  </p>
                </div>

                <div className="pt-3 border-t border-[var(--border-subtle)] flex items-center justify-between">
                  <span className="text-[11px] text-emerald-500 font-semibold">
                    {guide.updated}
                  </span>
                  <span className="text-xs font-semibold text-[#2E9BFF] group-hover:translate-x-1 transition inline-flex items-center gap-1">
                    Read Guide <ChevronRight size={14} />
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
