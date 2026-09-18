import React from 'react';
import { FileText, Shield, AlertTriangle, CheckCircle2 } from 'lucide-react';

interface TermsPageProps {
  onNavigateHome: () => void;
  onNavigateContact: () => void;
}

export const TermsPage: React.FC<TermsPageProps> = ({
  onNavigateHome,
  onNavigateContact,
}) => {
  return (
    <div className="container py-8 max-w-4xl mx-auto">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-xs text-[var(--text-muted)] mb-6">
        <button onClick={onNavigateHome} className="hover:text-[#2E9BFF] cursor-pointer">
          Home
        </button>
        <span>/</span>
        <span className="text-[var(--text-primary)] font-semibold">Terms of Service</span>
      </nav>

      {/* Header */}
      <div className="card-glass p-8 bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-2xl shadow-xs mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-[#2E9BFF] text-xs font-semibold mb-3">
          <FileText size={14} />
          <span>User Agreement & Conditions</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-[var(--text-primary)] tracking-tight mb-2">
          Terms of Service
        </h1>
        <p className="text-xs text-[var(--text-muted)] font-mono">
          Last Updated & Effective Date: January 1, 2026
        </p>
      </div>

      <article className="card-glass p-8 sm:p-10 bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-2xl shadow-xs space-y-6 text-sm text-[var(--text-secondary)] leading-relaxed">
        <section className="space-y-3">
          <h2 className="text-xl font-bold text-[var(--text-primary)]">1. Acceptance of Terms</h2>
          <p>
            By accessing, browsing, or utilizing the services provided by EncryptDecrypt.org (&ldquo;the Site&rdquo;, &ldquo;we&rdquo;, &ldquo;our&rdquo;), you acknowledge that you have read, understood, and agree to be bound by these Terms of Service. If you do not accept these terms in full, you must refrain from using the platform.
          </p>
        </section>

        <section className="space-y-3 pt-4 border-t border-[var(--border-subtle)]">
          <h2 className="text-xl font-bold text-[var(--text-primary)]">2. Zero-Knowledge Cryptographic Nature & User Responsibility</h2>
          <p>
            All encryption, decryption, hashing, signing, and conversion utilities available on EncryptDecrypt.org operate strictly within your client web browser. Consequently:
          </p>
          <ul className="list-disc pl-5 space-y-2 text-xs sm:text-sm">
            <li>
              <strong>No Key Recovery:</strong> Because we never transmit or store your symmetric keys, private keys, or passphrases, <strong>EncryptDecrypt.org has no technical capability to recover lost keys or restore encrypted data</strong>. You bear sole responsibility for safeguarding your cryptographic keys and passphrases.
            </li>
            <li>
              <strong>Data Accuracy:</strong> You are responsible for validating the suitability, accuracy, and security parameters of outputs prior to utilizing them in production, legal, or high-assurance workflows.
            </li>
          </ul>
        </section>

        <section className="space-y-3 pt-4 border-t border-[var(--border-subtle)]">
          <h2 className="text-xl font-bold text-[var(--text-primary)]">3. Acceptable Use Policy</h2>
          <p>
            You agree to use our services exclusively for lawful purposes. You shall not:
          </p>
          <ul className="list-disc pl-5 space-y-1 text-xs sm:text-sm">
            <li>Employ our tools to facilitate cyber attacks, ransomware distribution, unauthorized penetration testing, or software piracy.</li>
            <li>Attempt to bypass, overwhelm, or launch Denial of Service (DoS/DDoS) attacks against our website infrastructure.</li>
            <li>Misrepresent the algorithmic origin of generated payloads or forge digital signatures without authorization.</li>
            <li>Circumvent or tamper with technical security headers or access restriction mechanisms.</li>
          </ul>
        </section>

        <section className="space-y-3 pt-4 border-t border-[var(--border-subtle)]">
          <h2 className="text-xl font-bold text-[var(--text-primary)]">4. Intellectual Property & Algorithmic Standards</h2>
          <p>
            The software design, UI layouts, documentation, and curated technical guides on EncryptDecrypt.org are protected by international copyright laws. Underlying cryptographic algorithms (such as AES, SHA, HMAC, and RSA) are public domain mathematical standards formalised by NIST, ISO, and the IETF.
          </p>
        </section>

        <section className="space-y-3 pt-4 border-t border-[var(--border-subtle)]">
          <h2 className="text-xl font-bold text-[var(--text-primary)]">5. Disclaimer of Warranties</h2>
          <p>
            THE SERVICES, CODE, AND TOOLS ARE PROVIDED ON AN &ldquo;AS IS&rdquo; AND &ldquo;AS AVAILABLE&rdquo; BASIS WITHOUT WARRANTIES OF ANY KIND, EITHER EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, OR NON-INFRINGEMENT. WE DO NOT WARRANT THAT THE SERVICE WILL BE UNINTERRUPTED, BUG-FREE, OR FREE OF HARMFUL COMPONENTS.
          </p>
        </section>

        <section className="space-y-3 pt-4 border-t border-[var(--border-subtle)]">
          <h2 className="text-xl font-bold text-[var(--text-primary)]">6. Limitation of Liability</h2>
          <p>
            TO THE FULLEST EXTENT PERMISSIBLE BY APPLICABLE LAW, ENCRYPTDECRYPT.ORG AND ITS OPERATORS SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, INCLUDING BUT NOT LIMITED TO LOSS OF PROFITS, DATA, SYSTEM COMPROMISE, OR REPUTATIONAL DAMAGE ARISING OUT OF OR IN CONNECTION WITH YOUR USE OR INABILITY TO USE THE TOOLS.
          </p>
        </section>

        <section className="space-y-3 pt-4 border-t border-[var(--border-subtle)]">
          <h2 className="text-xl font-bold text-[var(--text-primary)]">7. Governing Law & Modification of Terms</h2>
          <p>
            These Terms shall be construed and governed by applicable commercial laws. We reserve the right to revise or replace these Terms at our sole discretion. Continued usage of the site following notice of modifications constitutes acceptance of the amended Terms.
          </p>
          <div className="pt-4">
            <button
              onClick={onNavigateContact}
              className="text-xs font-semibold text-[#2E9BFF] hover:underline cursor-pointer"
            >
              Questions regarding our Terms? Contact our legal desk →
            </button>
          </div>
        </section>
      </article>
    </div>
  );
};
