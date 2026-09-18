import React from 'react';
import { AlertTriangle, Shield, CheckCircle2, Globe, Scale } from 'lucide-react';

interface DisclaimerPageProps {
  onNavigateHome: () => void;
  onNavigateContact: () => void;
}

export const DisclaimerPage: React.FC<DisclaimerPageProps> = ({
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
        <span className="text-[var(--text-primary)] font-semibold">Disclaimer</span>
      </nav>

      {/* Header */}
      <div className="card-glass p-8 bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-2xl shadow-xs mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-500 text-xs font-semibold mb-3">
          <Scale size={14} />
          <span>Legal & Cryptographic Disclaimers</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-[var(--text-primary)] tracking-tight mb-2">
          Disclaimer
        </h1>
        <p className="text-xs text-[var(--text-muted)] font-mono">
          Last Updated: January 1, 2026 · EncryptDecrypt.org
        </p>
      </div>

      <article className="card-glass p-8 sm:p-10 bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-2xl shadow-xs space-y-6 text-sm text-[var(--text-secondary)] leading-relaxed">
        <section className="space-y-3">
          <h2 className="text-xl font-bold text-[var(--text-primary)]">1. General Informational & Utility Purpose</h2>
          <p>
            The tools, calculators, formatters, and cryptographic functions provided on EncryptDecrypt.org are designed solely for educational, administrative, developmental, and testing purposes. While we rigorously test all implementations against NIST Known Answer Tests and relevant RFC standard vectors, we make no representation that these utilities are certified for classified, military, or life-critical environments.
          </p>
        </section>

        <section className="space-y-3 pt-4 border-t border-[var(--border-subtle)]">
          <h2 className="text-xl font-bold text-[var(--text-primary)]">2. High-Assurance Cryptography Notice</h2>
          <p>
            For enterprise systems requiring compliance with stringent statutory regimens (e.g. FIPS 140-2/3 Level 3+, HIPAA, PCI-DSS Level 1, or Common Criteria EAL4+), organizations should utilize dedicated hardware security modules (HSMs), key management services (AWS KMS, Google Cloud KMS, Azure Key Vault), or audited native libraries rather than browser-based interfaces.
          </p>
        </section>

        <section className="space-y-3 pt-4 border-t border-[var(--border-subtle)]">
          <h2 className="text-xl font-bold text-[var(--text-primary)]">3. Browser Environment & Side-Channel Leaks</h2>
          <p>
            Although our tools execute 100% on the client device without network transmission, all client-side JavaScript execution occurs within your host operating system and web browser environment. As such:
          </p>
          <ul className="list-disc pl-5 space-y-1 text-xs sm:text-sm">
            <li>Malicious browser extensions, keyloggers, or compromised device malware can inspect DOM contents and memory states outside our website's sandbox.</li>
            <li>Users handling classified or top-secret materials must only operate on air-gapped, hardened workstations with verified extensions disabled.</li>
          </ul>
        </section>

        <section className="space-y-3 pt-4 border-t border-[var(--border-subtle)]">
          <h2 className="text-xl font-bold text-[var(--text-primary)]">4. International Cryptography Export Regulations</h2>
          <p>
            Cryptographic software and algorithms may be subject to national and international export/import regulations, including the Wassenaar Arrangement and United States Export Administration Regulations (EAR). By accessing or using this website, you certify that your use complies with all applicable local, national, and international laws and restrictions.
          </p>
        </section>

        <section className="space-y-3 pt-4 border-t border-[var(--border-subtle)]">
          <h2 className="text-xl font-bold text-[var(--text-primary)]">5. Third-Party Advertisements & Links</h2>
          <p>
            EncryptDecrypt.org may display external links or advertisements provided by third parties (such as Google AdSense). We do not control or endorse the content, policies, or products offered by third-party advertisers. Accessing third-party websites is done solely at your own risk.
          </p>
          <div className="pt-4">
            <button
              onClick={onNavigateContact}
              className="text-xs font-semibold text-[#2E9BFF] hover:underline cursor-pointer"
            >
              Contact us regarding cryptographic verification →
            </button>
          </div>
        </section>
      </article>
    </div>
  );
};
