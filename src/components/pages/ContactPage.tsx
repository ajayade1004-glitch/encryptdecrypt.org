import React, { useState } from 'react';
import { Mail, Shield, MessageSquare, Clock, CheckCircle2, AlertCircle, Send, Terminal, Key } from 'lucide-react';

interface ContactPageProps {
  onNavigateHome: () => void;
  showToast: (msg: string) => void;
}

export const ContactPage: React.FC<ContactPageProps> = ({
  onNavigateHome,
  showToast,
}) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    topic: 'General Inquiry',
    subject: '',
    message: '',
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
    setError(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) {
      setError('Please complete all required fields (Name, Email, Message).');
      return;
    }

    if (!formData.email.includes('@') || !formData.email.includes('.')) {
      setError('Please provide a valid email address.');
      return;
    }

    setLoading(true);
    // Simulate swift client validation & simulated receipt
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
      showToast('Thank you! Your message has been recorded. We will reply within 24-48 hours.');
    }, 600);
  };

  const handleReset = () => {
    setFormData({
      name: '',
      email: '',
      topic: 'General Inquiry',
      subject: '',
      message: '',
    });
    setSubmitted(false);
    setError(null);
  };

  return (
    <div className="container py-8 max-w-5xl mx-auto">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-xs text-[var(--text-muted)] mb-6">
        <button onClick={onNavigateHome} className="hover:text-[#2E9BFF] cursor-pointer">
          Home
        </button>
        <span>/</span>
        <span className="text-[var(--text-primary)] font-semibold">Contact Us</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-12">
        {/* Left Column: Contact Form */}
        <div className="lg:col-span-7">
          <div className="card-glass p-6 sm:p-8 bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-2xl shadow-xs">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-[#2E9BFF] text-xs font-semibold mb-3">
              <Mail size={14} />
              <span>Get In Touch</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-[var(--text-primary)] mb-2">
              Contact the Engineering Team
            </h1>
            <p className="text-xs sm:text-sm text-[var(--text-secondary)] mb-6 leading-relaxed">
              Have a question regarding cryptographic implementation, feature suggestion for our 300+ tools, or partnership inquiry? Send us a message and our technical team will respond promptly.
            </p>

            {submitted ? (
              <div className="p-8 text-center rounded-xl bg-emerald-500/10 border border-emerald-500/20 my-4">
                <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-500 flex items-center justify-center mx-auto mb-3">
                  <CheckCircle2 size={24} />
                </div>
                <h3 className="text-base font-bold text-[var(--text-primary)] mb-1">
                  Message Successfully Dispatched!
                </h3>
                <p className="text-xs text-[var(--text-secondary)] mb-6 max-w-md mx-auto">
                  Thank you for reaching out, <strong>{formData.name}</strong>. A confirmation has been logged for <strong>{formData.email}</strong>. Our security and engineering team will review your inquiry within 24 to 48 hours.
                </p>
                <button
                  onClick={handleReset}
                  className="btn btn-primary text-xs py-2 px-5 cursor-pointer"
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                {error && (
                  <div className="p-3 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs flex items-center gap-2">
                    <AlertCircle size={16} className="shrink-0" />
                    <span>{error}</span>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-[var(--text-primary)] mb-1.5">
                      Your Name <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="e.g. Alex Henderson"
                      required
                      className="w-full bg-[var(--bg-input)] border border-[var(--border-subtle)] rounded-lg px-3 py-2 text-xs text-[var(--text-primary)] focus:outline-none focus:border-[#2E9BFF] transition"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[var(--text-primary)] mb-1.5">
                      Email Address <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="alex@company.com"
                      required
                      className="w-full bg-[var(--bg-input)] border border-[var(--border-subtle)] rounded-lg px-3 py-2 text-xs text-[var(--text-primary)] focus:outline-none focus:border-[#2E9BFF] transition"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-[var(--text-primary)] mb-1.5">
                      Inquiry Category
                    </label>
                    <select
                      name="topic"
                      value={formData.topic}
                      onChange={handleChange}
                      className="w-full bg-[var(--bg-input)] border border-[var(--border-subtle)] rounded-lg px-3 py-2 text-xs text-[var(--text-primary)] focus:outline-none focus:border-[#2E9BFF] transition"
                    >
                      <option value="General Inquiry">General Inquiry</option>
                      <option value="Bug Report / Tool Issue">Bug Report / Tool Issue</option>
                      <option value="Feature Request">New Tool Request</option>
                      <option value="Security Vulnerability">Security Disclosure</option>
                      <option value="Advertising & Sponsorship">Advertising / Business</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[var(--text-primary)] mb-1.5">
                      Subject
                    </label>
                    <input
                      type="text"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      placeholder="Short summary of inquiry"
                      className="w-full bg-[var(--bg-input)] border border-[var(--border-subtle)] rounded-lg px-3 py-2 text-xs text-[var(--text-primary)] focus:outline-none focus:border-[#2E9BFF] transition"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[var(--text-primary)] mb-1.5">
                    Message Details <span className="text-rose-500">*</span>
                  </label>
                  <textarea
                    name="message"
                    rows={5}
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Describe your question, request, or issue with as much detail as possible..."
                    required
                    className="w-full bg-[var(--bg-input)] border border-[var(--border-subtle)] rounded-lg p-3 text-xs text-[var(--text-primary)] focus:outline-none focus:border-[#2E9BFF] transition resize-y"
                  />
                </div>

                <p className="text-[11px] text-[var(--text-muted)] leading-relaxed">
                  We value your privacy. We never share your contact information with third parties or use it for marketing spam.
                </p>

                <button
                  type="submit"
                  disabled={loading}
                  className="btn btn-primary text-xs py-2.5 px-6 inline-flex items-center gap-2 cursor-pointer"
                >
                  {loading ? (
                    <span>Sending message...</span>
                  ) : (
                    <>
                      <Send size={14} /> Send Message
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Right Column: Information & Security Disclosure */}
        <div className="lg:col-span-5 space-y-6">
          {/* Direct Channels */}
          <div className="card-glass p-6 bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-2xl shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-[var(--text-primary)] uppercase tracking-wider">
              Direct Contact Channels
            </h3>

            <div className="space-y-3 text-xs text-[var(--text-secondary)]">
              <div className="flex items-start gap-3 p-3 rounded-lg bg-[var(--bg-surface-hover)] border border-[var(--border-subtle)]">
                <Mail size={16} className="text-[#2E9BFF] shrink-0 mt-0.5" />
                <div>
                  <strong className="block text-[var(--text-primary)] mb-0.5">Technical Support & General Inquiries</strong>
                  <div className="space-y-0.5">
                    <span className="font-mono text-[11px] text-[#2E9BFF] block">support@encryptdecrypt.org</span>
                    <span className="font-mono text-[11px] text-[#2E9BFF] block">ajayade1004@gmail.com</span>
                  </div>
                  <p className="text-[11px] text-[var(--text-muted)] mt-1">For general utility troubleshooting, feedback, or custom tool requests.</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 rounded-lg bg-[var(--bg-surface-hover)] border border-[var(--border-subtle)]">
                <Shield size={16} className="text-emerald-500 shrink-0 mt-0.5" />
                <div>
                  <strong className="block text-[var(--text-primary)] mb-0.5">Security & Vulnerability Reports</strong>
                  <span className="font-mono text-[11px] text-emerald-500">security@encryptdecrypt.org</span>
                  <p className="text-[11px] text-[var(--text-muted)] mt-1">For responsible security disclosures conforming to RFC 9116.</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 rounded-lg bg-[var(--bg-surface-hover)] border border-[var(--border-subtle)]">
                <Clock size={16} className="text-purple-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="block text-[var(--text-primary)] mb-0.5">Response Time SLA</strong>
                  <p className="text-[11px] text-[var(--text-muted)]">Standard inquiries: 24–48 business hours.<br />Critical security reports: &lt; 12 hours.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Responsible Security Disclosure Box */}
          <div className="card-glass p-6 bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-2xl shadow-xs">
            <div className="flex items-center gap-2 mb-2 text-xs font-bold text-[var(--text-primary)]">
              <Key size={16} className="text-[#2E9BFF]" />
              <span>Coordinated Vulnerability Disclosure</span>
            </div>
            <p className="text-xs text-[var(--text-secondary)] leading-relaxed mb-3">
              We welcome findings from independent security researchers. If you identify a potential implementation bug in any of our 300+ client-side algorithms:
            </p>
            <ul className="list-disc pl-4 text-xs text-[var(--text-secondary)] space-y-1 mb-3">
              <li>Include reproducible test vectors and browser version details.</li>
              <li>Allow reasonable time for validation prior to public release.</li>
              <li>We will acknowledge valid findings on our security recognition board.</li>
            </ul>
            <div className="p-2.5 rounded-lg bg-[var(--bg-input)] border border-[var(--border-subtle)] font-mono text-[10px] text-[var(--text-muted)]">
              Security policy location: /.well-known/security.txt
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
