import React, { useState } from 'react';
import { 
  FileText, HelpCircle, ListOrdered, Link2, 
  Plus, Trash2, Save, Sparkles, BookOpen, Check 
} from 'lucide-react';
import { ToolItem } from '../../../types';
import { ToolFaqItem, ToolContentOverride } from '../../../types/admin';
import { getToolOverrides, saveToolOverride } from '../../../utils/adminStorage';

interface ContentManagerTabProps {
  tools: ToolItem[];
  showToast: (msg: string) => void;
}

export const ContentManagerTab: React.FC<ContentManagerTabProps> = ({ tools, showToast }) => {
  const [selectedToolSlug, setSelectedToolSlug] = useState<string>(tools[0]?.slug || 'base64-encode-decode');
  const selectedTool = tools.find(t => t.slug === selectedToolSlug || t.id === selectedToolSlug) || tools[0];

  const overrides = getToolOverrides();
  const currentOverride: Partial<ToolContentOverride> = (selectedTool ? (overrides[selectedTool.id] || overrides[selectedTool.slug]) : null) || {};

  // Content state
  const [longContent, setLongContent] = useState<string>(
    currentOverride.longDescription || 
    `# Technical Architecture & Cryptographic Overview\n\n${selectedTool?.name} is a high-assurance developer utility designed to execute transformations entirely within your browser's local memory. In accordance with zero-knowledge cryptographic design principles, zero plaintext or ciphertext is transmitted to remote server backends.\n\n## Algorithmic Standards & RFC Compliance\n\nThis implementation strictly adheres to canonical industry standards (such as NIST FIPS and IETF RFC guidelines). It leverages the W3C Web Cryptography API for constant-time cryptographic primitives where applicable, shielding operations against timing side-channel exploits.\n\n## Core Engineering Use Cases\n\n- **Security Token Auditing**: Quickly inspect base64 encoded JWT headers and payloads.\n- **API Payload Formatting**: Safely encode URL query parameters and JSON strings.\n- **Air-Gapped Workstations**: Perform critical data transformations completely offline.`
  );

  const [faqs, setFaqs] = useState<ToolFaqItem[]>(
    currentOverride.faqs || [
      {
        question: `Is ${selectedTool?.name} completely safe to use with sensitive data?`,
        answer: `Yes. All processing occurs 100% on your local machine using client-side JavaScript. Disconnecting your internet connection will not interrupt tool functionality.`
      },
      {
        question: `Which RFC or NIST specification does this implementation follow?`,
        answer: `Our implementation is tested against official standard test vectors to guarantee 100% interoperability with OpenSSL, Node.js crypto, and Python libraries.`
      }
    ]
  );

  const [howToSteps, setHowToSteps] = useState<string[]>(
    currentOverride.howToSteps || [
      'Paste or type your input string into the Primary Input textarea.',
      'Configure any specific cryptographic parameters (key, IV, shift value) if applicable.',
      'The output is calculated instantly in real-time. Click "Copy" or "Download" to retrieve the result.'
    ]
  );

  const [newFaqQ, setNewFaqQ] = useState('');
  const [newFaqA, setNewFaqA] = useState('');
  const [newStep, setNewStep] = useState('');

  // Handle Tool Change
  const handleToolChange = (slug: string) => {
    setSelectedToolSlug(slug);
    const t = tools.find(item => item.slug === slug || item.id === slug);
    if (!t) return;
    const over: Partial<ToolContentOverride> = overrides[t.id] || overrides[t.slug] || {};
    setLongContent(over.longDescription || `# Technical Architecture & Cryptographic Overview\n\n${t.name} operates 100% client-side.`);
    setFaqs(over.faqs || [
      {
        question: `Is ${t.name} safe for sensitive keys?`,
        answer: `Yes, computation happens entirely in your local browser sandbox.`
      }
    ]);
    setHowToSteps(over.howToSteps || [
      'Enter your input payload.',
      'Inspect generated output instantly.',
      'Click Copy to use in your project.'
    ]);
  };

  const handleAddFaq = () => {
    if (!newFaqQ.trim() || !newFaqA.trim()) return;
    setFaqs(prev => [...prev, { question: newFaqQ.trim(), answer: newFaqA.trim() }]);
    setNewFaqQ('');
    setNewFaqA('');
    showToast('FAQ item added!');
  };

  const handleDeleteFaq = (index: number) => {
    setFaqs(prev => prev.filter((_, idx) => idx !== index));
  };

  const handleAddStep = () => {
    if (!newStep.trim()) return;
    setHowToSteps(prev => [...prev, newStep.trim()]);
    setNewStep('');
  };

  const handleDeleteStep = (index: number) => {
    setHowToSteps(prev => prev.filter((_, idx) => idx !== index));
  };

  const handleSaveAllContent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTool) return;

    saveToolOverride(selectedTool.id, {
      longDescription: longContent,
      faqs,
      howToSteps,
    });

    showToast(`Content & FAQs saved for "${selectedTool.name}"!`);
  };

  return (
    <div className="space-y-6">
      <div className="card-glass p-5 bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-2xl shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-[var(--text-primary)]">
            Content Management & 1500+ Word SEO/GEO Guides
          </h2>
          <p className="text-xs text-[var(--text-secondary)]">
            Enrich any tool with comprehensive educational descriptions, structured FAQs, step-by-step How-To instructions, and internal linking.
          </p>
        </div>

        {/* Tool Selector Dropdown */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-[var(--text-muted)] whitespace-nowrap">Select Tool:</span>
          <select
            value={selectedToolSlug}
            onChange={(e) => handleToolChange(e.target.value)}
            className="bg-[var(--bg-input)] border border-[var(--border-subtle)] rounded-xl px-3 py-2 text-xs text-[var(--text-primary)] font-medium focus:outline-none focus:border-[#2E9BFF]"
          >
            {tools.map(t => (
              <option key={t.id} value={t.slug}>{t.name} ({t.categoryName})</option>
            ))}
          </select>
        </div>
      </div>

      <form onSubmit={handleSaveAllContent} className="space-y-6">
        {/* Section 1: 1500+ Word Technical Guide */}
        <div className="card-glass p-6 bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-2xl shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-[var(--text-primary)] flex items-center gap-2">
              <FileText size={16} className="text-[#2E9BFF]" />
              Technical Guide & In-Depth Algorithm Explainer (Markdown)
            </h3>
            <span className="text-[11px] font-mono text-[var(--text-muted)]">
              Word Count: ~{longContent.trim().split(/\s+/).filter(Boolean).length} words
            </span>
          </div>
          <p className="text-xs text-[var(--text-muted)]">
            Provides comprehensive educational depth required for top Google SERP authority and AI engine citation (Perplexity, ChatGPT, Gemini).
          </p>

          <textarea
            rows={10}
            value={longContent}
            onChange={(e) => setLongContent(e.target.value)}
            className="w-full bg-[var(--bg-input)] border border-[var(--border-subtle)] rounded-xl p-3.5 font-mono text-xs text-[var(--text-primary)] leading-relaxed focus:outline-none focus:border-[#2E9BFF]"
          />
        </div>

        {/* Section 2: Step-by-Step How-To Instructions */}
        <div className="card-glass p-6 bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-2xl shadow-xs space-y-4">
          <h3 className="text-sm font-bold text-[var(--text-primary)] flex items-center gap-2">
            <ListOrdered size={16} className="text-purple-400" />
            Step-by-Step &ldquo;How-To&rdquo; Instructional Workflow
          </h3>

          <div className="space-y-2">
            {howToSteps.map((step, idx) => (
              <div 
                key={idx}
                className="flex items-center justify-between gap-3 p-2.5 rounded-xl bg-[var(--bg-surface-hover)] border border-[var(--border-subtle)] text-xs"
              >
                <div className="flex items-center gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-blue-500/20 text-[#2E9BFF] flex items-center justify-center font-bold text-[10px]">
                    {idx + 1}
                  </span>
                  <span className="text-[var(--text-primary)]">{step}</span>
                </div>
                <button
                  type="button"
                  onClick={() => handleDeleteStep(idx)}
                  className="text-[var(--text-muted)] hover:text-rose-400 p-1 cursor-pointer"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            ))}
          </div>

          <div className="flex items-center gap-2 pt-1">
            <input
              type="text"
              value={newStep}
              onChange={(e) => setNewStep(e.target.value)}
              placeholder="Add next instructional step..."
              className="flex-1 bg-[var(--bg-input)] border border-[var(--border-subtle)] rounded-xl px-3 py-2 text-xs text-[var(--text-primary)] focus:outline-none focus:border-[#2E9BFF]"
              onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleAddStep(); } }}
            />
            <button
              type="button"
              onClick={handleAddStep}
              className="px-3.5 py-2 rounded-xl bg-[var(--bg-surface-hover)] border border-[var(--border-subtle)] text-xs font-semibold text-[var(--text-primary)] hover:border-[#2E9BFF] cursor-pointer"
            >
              Add Step
            </button>
          </div>
        </div>

        {/* Section 3: Interactive FAQ Manager */}
        <div className="card-glass p-6 bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-2xl shadow-xs space-y-4">
          <h3 className="text-sm font-bold text-[var(--text-primary)] flex items-center gap-2">
            <HelpCircle size={16} className="text-emerald-500" />
            Frequently Asked Questions (FAQ Schema Accordion)
          </h3>

          <div className="space-y-3">
            {faqs.map((faq, idx) => (
              <div 
                key={idx}
                className="p-3.5 rounded-xl bg-[var(--bg-surface-hover)] border border-[var(--border-subtle)] text-xs space-y-1.5"
              >
                <div className="flex items-start justify-between gap-2">
                  <span className="font-bold text-[var(--text-primary)]">
                    Q{idx + 1}: {faq.question}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleDeleteFaq(idx)}
                    className="text-[var(--text-muted)] hover:text-rose-400 p-1 cursor-pointer shrink-0"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
                <p className="text-[var(--text-secondary)] leading-relaxed">
                  {faq.answer}
                </p>
              </div>
            ))}
          </div>

          <div className="p-4 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-input)] space-y-3 text-xs">
            <span className="font-semibold text-[var(--text-primary)] block text-[11px] uppercase tracking-wider">
              Add New FAQ Question
            </span>
            <input
              type="text"
              value={newFaqQ}
              onChange={(e) => setNewFaqQ(e.target.value)}
              placeholder="e.g. Can I decrypt AES-256 without the secret key?"
              className="w-full bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-lg px-3 py-2 text-[var(--text-primary)] focus:outline-none focus:border-[#2E9BFF]"
            />
            <textarea
              rows={2}
              value={newFaqA}
              onChange={(e) => setNewFaqA(e.target.value)}
              placeholder="e.g. No. AES-256 is mathematically secure against brute-force attacks..."
              className="w-full bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-lg p-2.5 text-[var(--text-primary)] focus:outline-none focus:border-[#2E9BFF]"
            />
            <button
              type="button"
              onClick={handleAddFaq}
              className="btn btn-primary py-1.5 px-4 rounded-lg text-xs flex items-center gap-1.5 cursor-pointer font-semibold"
            >
              <Plus size={13} /> Add FAQ Item
            </button>
          </div>
        </div>

        {/* Save Bar */}
        <div className="flex items-center justify-between p-4 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-subtle)]">
          <span className="text-xs text-[var(--text-muted)]">
            Content updates apply to {selectedTool?.name} instantly across metadata, search, and page body.
          </span>
          <button
            type="submit"
            className="btn btn-primary py-2.5 px-6 rounded-xl flex items-center gap-2 font-semibold text-xs cursor-pointer shadow-md"
          >
            <Save size={15} /> Save All Content for {selectedTool?.name}
          </button>
        </div>
      </form>
    </div>
  );
};
