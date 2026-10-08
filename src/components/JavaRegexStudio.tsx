import React, { useState, useMemo, useEffect } from 'react';
import {
  Code, Play, Check, Copy, AlertTriangle, Sparkles, Sliders,
  Layers, Replace, BookOpen, Terminal, CheckCircle, Info, RefreshCw,
  Search, Shield, Zap
} from 'lucide-react';
import {
  JavaRegexFlags,
  DEFAULT_JAVA_FLAGS,
  JAVA_REGEX_PRESETS,
  executeJavaRegex,
  JavaRegexPreset,
  JavaRegexResult
} from '../utils/javaRegexEngine';

interface JavaRegexStudioProps {
  toolSlug?: string;
  toolName?: string;
  onPayloadGenerated?: (summary: string) => void;
}

export const JavaRegexStudio: React.FC<JavaRegexStudioProps> = ({
  toolName = 'Java Regular Expression Tester',
  onPayloadGenerated
}) => {
  // State
  const [pattern, setPattern] = useState<string>('[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}');
  const [testString, setTestString] = useState<string>(
    'Contact support@encryptdecrypt.org or dev.team@company.co.uk for inquiries.\nInvalid email: test@.com or user@domain'
  );
  const [replacement, setReplacement] = useState<string>('[REDACTED_EMAIL]');
  const [flags, setFlags] = useState<JavaRegexFlags>({
    ...DEFAULT_JAVA_FLAGS,
    caseInsensitive: true
  });
  const [activeTab, setActiveTab] = useState<'matches' | 'replace' | 'code' | 'cheatsheet'>('matches');
  const [activeCodeMode, setActiveCodeMode] = useState<'loop' | 'validate' | 'replace' | 'string'>('loop');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // Execution memo
  const result: JavaRegexResult = useMemo(() => {
    return executeJavaRegex(pattern, testString, flags, replacement);
  }, [pattern, testString, flags, replacement]);

  // Synchronize payload with parent on changes
  useEffect(() => {
    if (onPayloadGenerated) {
      const summaryLines = [
        `=== JAVA REGULAR EXPRESSION TEST REPORT ===`,
        `Tool: ${toolName}`,
        `Pattern: ${result.pattern || '(empty)'}`,
        `Flags: ${result.flagsString} (Java: ${result.flagsJavaCode})`,
        `Total Matches: ${result.totalMatches}`,
        `Execution Latency: ${result.executionTimeMs} ms`,
        `Status: ${result.isValid ? 'Valid Java Pattern' : 'Syntax Error: ' + result.error}`,
        `------------------------------------------------------------`
      ];

      if (result.matches.length > 0) {
        result.matches.forEach(m => {
          summaryLines.push(`Match #${m.index}: "${m.fullMatch}" [Indices: ${m.start}..${m.end}]`);
          if (m.groups.length > 1) {
            m.groups.slice(1).forEach(g => {
              const nameTag = g.groupName ? ` (${g.groupName})` : '';
              summaryLines.push(`  ├─ Group ${g.groupNumber}${nameTag}: "${g.value}"`);
            });
          }
        });
      } else if (result.isValid) {
        summaryLines.push(`Zero matches found in test string.`);
      }

      if (result.replacedText !== undefined) {
        summaryLines.push(`------------------------------------------------------------`);
        summaryLines.push(`Replacement Preview (Matcher.replaceAll):`);
        summaryLines.push(result.replacedText);
      }

      summaryLines.push(`------------------------------------------------------------`);
      summaryLines.push(`Java String Literal:`);
      summaryLines.push(`String regex = ${result.javaCode.escapedJavaString};`);

      onPayloadGenerated(summaryLines.join('\n'));
    }
  }, [result, toolName, onPayloadGenerated]);

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleSelectPreset = (preset: JavaRegexPreset) => {
    setPattern(preset.pattern);
    setTestString(preset.sampleText);
    if (preset.replacement) setReplacement(preset.replacement);
    setFlags({
      ...DEFAULT_JAVA_FLAGS,
      ...preset.flags
    });
  };

  // Build highlighted test string with match spans
  const highlightedNodes = useMemo(() => {
    if (!result.isValid || result.matches.length === 0 || !testString) {
      return <span>{testString}</span>;
    }

    const elements: React.ReactNode[] = [];
    let lastIndex = 0;

    result.matches.forEach((m, idx) => {
      // Unmatched segment before this match
      if (m.start > lastIndex) {
        elements.push(
          <span key={`text-${lastIndex}`}>{testString.substring(lastIndex, m.start)}</span>
        );
      }

      // Highlighted match
      elements.push(
        <mark
          key={`match-${idx}`}
          className="bg-[#2E9BFF]/30 text-white border-b-2 border-[#2E9BFF] rounded-xs px-0.5 py-0.2 mx-0.2 font-mono font-semibold"
          title={`Match #${m.index}: [${m.start}..${m.end}]`}
        >
          {m.fullMatch}
        </mark>
      );

      lastIndex = m.end;
    });

    if (lastIndex < testString.length) {
      elements.push(
        <span key={`text-end`}>{testString.substring(lastIndex)}</span>
      );
    }

    return elements;
  }, [result, testString]);

  return (
    <div className="java-regex-studio card-glass p-5 sm:p-7 rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] shadow-lg my-6">
      {/* Studio Header & Badges */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-5 mb-5 border-b border-[var(--border-subtle)]">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-mono font-bold bg-[#1d4ed8]/20 text-[#2E9BFF] border border-[#2E9BFF]/30">
              java.util.regex.Pattern · Matcher Suite
            </span>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center gap-1">
              <Zap size={11} /> JVM Replicated
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-[var(--text-primary)] tracking-tight m-0">
            Java Regular Expression Tester &amp; Live Debugger
          </h2>
          <p className="text-xs text-[var(--text-muted)] mt-1 mb-0">
            Evaluate Java regular expression patterns with exact flag bitmasks, capturing groups, replacement syntax, and instant Java code generation.
          </p>
        </div>

        {/* Preset Selector Dropdown */}
        <div className="flex items-center gap-2">
          <label className="text-xs font-semibold text-[var(--text-muted)] flex items-center gap-1">
            <Sparkles size={13} className="text-[#2E9BFF]" />
            Presets:
          </label>
          <select
            onChange={(e) => {
              const found = JAVA_REGEX_PRESETS.find(p => p.id === e.target.value);
              if (found) handleSelectPreset(found);
            }}
            className="form-input text-xs py-1.5 px-3 rounded-lg bg-[var(--bg-input)] border border-[var(--border-subtle)] text-[var(--text-primary)] cursor-pointer focus:border-[#2E9BFF]"
            defaultValue="email-rfc5322"
          >
            {JAVA_REGEX_PRESETS.map((p) => (
              <option key={p.id} value={p.id}>
                {p.title}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Pattern Input Console */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <label className="text-xs font-bold text-[var(--text-primary)] flex items-center gap-1.5">
            <Code size={14} className="text-[#2E9BFF]" />
            Java Regular Expression Pattern:
          </label>
          <div className="flex items-center gap-2 text-xs font-mono">
            {result.isValid ? (
              <span className="text-emerald-400 flex items-center gap-1">
                <CheckCircle size={13} /> Valid Syntax ({result.totalMatches} matches in {result.executionTimeMs}ms)
              </span>
            ) : (
              <span className="text-rose-400 flex items-center gap-1">
                <AlertTriangle size={13} /> {result.error}
              </span>
            )}
          </div>
        </div>

        <div className="relative">
          <input
            type="text"
            value={pattern}
            onChange={(e) => setPattern(e.target.value)}
            placeholder="e.g. (?<year>\d{4})-(?<month>\d{2})-(?<day>\d{2})"
            className={`w-full font-mono text-sm px-4 py-3 rounded-xl bg-[var(--bg-input)] border ${
              result.isValid ? 'border-[var(--border-subtle)] focus:border-[#2E9BFF]' : 'border-rose-500 focus:border-rose-400'
            } text-[var(--text-primary)] shadow-inner transition`}
          />
        </div>
      </div>

      {/* Java Pattern Flags Toggle Strip */}
      <div className="mb-5 p-3 rounded-xl bg-[var(--bg-input)] border border-[var(--border-subtle)]">
        <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
          <span className="text-xs font-bold text-[var(--text-muted)] flex items-center gap-1">
            <Sliders size={13} className="text-[#2E9BFF]" />
            Java Pattern Flags (Bitmask: 0x{result.flagsBitmask.toString(16).toUpperCase()}):
          </span>
          <span className="text-[11px] font-mono text-sky-400">
            {result.flagsJavaCode}
          </span>
        </div>

        <div className="flex flex-wrap gap-2 text-xs">
          {[
            { key: 'caseInsensitive', label: 'CASE_INSENSITIVE (?i)', tip: 'Enables case-insensitive matching' },
            { key: 'multiline', label: 'MULTILINE (?m)', tip: '^ and $ match beginning and end of each line' },
            { key: 'dotall', label: 'DOTALL (?s)', tip: '. matches any character including line terminators' },
            { key: 'unicodeCase', label: 'UNICODE_CASE (?u)', tip: 'Enables Unicode-aware case folding' },
            { key: 'comments', label: 'COMMENTS (?x)', tip: 'Ignores whitespace and embedded comments' },
            { key: 'literal', label: 'LITERAL', tip: 'Treats pattern string as literal text' }
          ].map(({ key, label, tip }) => {
            const isActive = flags[key as keyof JavaRegexFlags];
            return (
              <button
                key={key}
                type="button"
                onClick={() => setFlags(prev => ({ ...prev, [key]: !prev[key as keyof JavaRegexFlags] }))}
                title={tip}
                className={`px-3 py-1.5 rounded-lg font-mono text-[11px] font-semibold border transition cursor-pointer flex items-center gap-1.5 ${
                  isActive
                    ? 'bg-[#1d4ed8] text-white border-blue-500 shadow-xs'
                    : 'bg-[var(--bg-surface)] text-[var(--text-muted)] border-[var(--border-subtle)] hover:text-[var(--text-primary)]'
                }`}
              >
                <span>{label}</span>
                {isActive && <Check size={11} />}
              </button>
            );
          })}
        </div>
      </div>

      {/* Test String Input Area */}
      <div className="mb-5">
        <div className="flex items-center justify-between mb-2">
          <label className="text-xs font-bold text-[var(--text-primary)] flex items-center gap-1.5">
            <Terminal size={14} className="text-[#2E9BFF]" />
            Test String (Target Input):
          </label>
          <div className="flex items-center gap-3 text-xs text-[var(--text-muted)]">
            <span>{testString.length} chars</span>
            <span>{testString.split('\n').length} lines</span>
          </div>
        </div>

        <textarea
          rows={5}
          value={testString}
          onChange={(e) => setTestString(e.target.value)}
          placeholder="Enter or paste text here to test against the Java regex pattern..."
          className="w-full font-mono text-xs p-3.5 rounded-xl bg-[var(--bg-input)] border border-[var(--border-subtle)] text-[var(--text-primary)] focus:border-[#2E9BFF] transition resize-y"
        />
      </div>

      {/* Sub-Tabs: Match Inspector | Replacement Tester | Java Code | Cheatsheet */}
      <div className="border-b border-[var(--border-subtle)] mb-5">
        <div className="flex flex-wrap gap-2 text-xs font-semibold">
          <button
            onClick={() => setActiveTab('matches')}
            className={`px-4 py-2.5 border-b-2 transition flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'matches'
                ? 'border-[#2E9BFF] text-[#2E9BFF]'
                : 'border-transparent text-[var(--text-muted)] hover:text-[var(--text-primary)]'
            }`}
          >
            <Layers size={14} />
            <span>Match Inspector ({result.totalMatches})</span>
          </button>
          <button
            onClick={() => setActiveTab('replace')}
            className={`px-4 py-2.5 border-b-2 transition flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'replace'
                ? 'border-[#2E9BFF] text-[#2E9BFF]'
                : 'border-transparent text-[var(--text-muted)] hover:text-[var(--text-primary)]'
            }`}
          >
            <Replace size={14} />
            <span>Java Replacement (replaceAll)</span>
          </button>
          <button
            onClick={() => setActiveTab('code')}
            className={`px-4 py-2.5 border-b-2 transition flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'code'
                ? 'border-[#2E9BFF] text-[#2E9BFF]'
                : 'border-transparent text-[var(--text-muted)] hover:text-[var(--text-primary)]'
            }`}
          >
            <Code size={14} />
            <span>Java Code Generator</span>
          </button>
          <button
            onClick={() => setActiveTab('cheatsheet')}
            className={`px-4 py-2.5 border-b-2 transition flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'cheatsheet'
                ? 'border-[#2E9BFF] text-[#2E9BFF]'
                : 'border-transparent text-[var(--text-muted)] hover:text-[var(--text-primary)]'
            }`}
          >
            <BookOpen size={14} />
            <span>Java Regex Cheatsheet</span>
          </button>
        </div>
      </div>

      {/* Tab 1: Match Inspector */}
      {activeTab === 'matches' && (
        <div className="space-y-4">
          {/* Visual Highlighted View */}
          <div className="p-4 rounded-xl bg-[var(--bg-input)] border border-[var(--border-subtle)]">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-[var(--text-primary)]">Interactive Match Highlighting</span>
              <span className="text-[11px] font-mono text-[var(--text-muted)]">Blue badges = Java Matcher.find() spans</span>
            </div>
            <div className="font-mono text-xs whitespace-pre-wrap leading-relaxed text-[var(--text-secondary)] break-all p-3 rounded-lg bg-[var(--bg-surface)] border border-[var(--border-subtle)] max-h-48 overflow-y-auto">
              {highlightedNodes}
            </div>
          </div>

          {/* Group Breakdown Cards */}
          <div>
            <h3 className="text-xs font-bold text-[var(--text-primary)] uppercase tracking-wider mb-2">
              Captured Matches &amp; Groups ({result.matches.length})
            </h3>

            {result.matches.length === 0 ? (
              <div className="p-6 text-center rounded-xl bg-[var(--bg-input)] border border-[var(--border-subtle)] text-xs text-[var(--text-muted)]">
                No matching sequences found. Modify your pattern, toggle flags (e.g. CASE_INSENSITIVE), or adjust test text.
              </div>
            ) : (
              <div className="space-y-2.5 max-h-80 overflow-y-auto pr-1">
                {result.matches.map((m) => (
                  <div
                    key={m.index}
                    className="p-3.5 rounded-xl bg-[var(--bg-input)] border border-[var(--border-subtle)] hover:border-[#2E9BFF]/40 transition text-xs font-mono"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                      <span className="font-bold text-[#2E9BFF]">
                        Match #{m.index}: &ldquo;{m.fullMatch}&rdquo;
                      </span>
                      <span className="text-[11px] text-[var(--text-muted)]">
                        Indices: [{m.start}..{m.end}] · Length: {m.fullMatch.length} chars
                      </span>
                    </div>

                    {m.groups.length > 1 && (
                      <div className="mt-2 pt-2 border-t border-[var(--border-subtle)] space-y-1.5">
                        <div className="text-[10px] text-[var(--text-muted)] uppercase tracking-wider font-sans font-semibold">
                          Capturing Groups (groupCount = {m.groups.length - 1}):
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                          {m.groups.slice(1).map((g) => (
                            <div
                              key={g.groupNumber}
                              className="p-2 rounded-lg bg-[var(--bg-surface)] border border-[var(--border-subtle)] flex flex-col justify-between"
                            >
                              <div className="flex items-center justify-between text-[10px] text-[var(--text-muted)] mb-1">
                                <span className="text-[#2E9BFF] font-bold">Group ${g.groupNumber}</span>
                                {g.groupName && <span className="text-emerald-400 font-semibold">&lt;{g.groupName}&gt;</span>}
                              </div>
                              <span className="text-slate-200 text-xs truncate">
                                &ldquo;{g.value}&rdquo;
                              </span>
                              <span className="text-[9px] text-[var(--text-muted)] mt-1">
                                [{g.start}..{g.end}]
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Tab 2: Replacement Tester */}
      {activeTab === 'replace' && (
        <div className="space-y-4">
          <div className="p-4 rounded-xl bg-[var(--bg-input)] border border-[var(--border-subtle)]">
            <label className="text-xs font-bold text-[var(--text-primary)] block mb-2">
              Java Replacement String Template (Matcher.replaceAll):
            </label>
            <input
              type="text"
              value={replacement}
              onChange={(e) => setReplacement(e.target.value)}
              placeholder="e.g. $1 or ${namedGroup} or [REDACTED]"
              className="w-full font-mono text-xs px-3.5 py-2.5 rounded-lg bg-[var(--bg-surface)] border border-[var(--border-subtle)] text-[var(--text-primary)] focus:border-[#2E9BFF]"
            />
            <p className="text-[11px] text-[var(--text-muted)] mt-1.5 mb-0">
              Supports Java references: <code>$0</code> (full match), <code>$1</code>, <code>$2</code> (capturing groups), <code>&#36;&#123;name&#125;</code> (named groups).
            </p>
          </div>

          <div className="p-4 rounded-xl bg-[var(--bg-input)] border border-[var(--border-subtle)]">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
                <CheckCircle size={14} /> Output Preview (Matcher.replaceAll result):
              </span>
              <button
                onClick={() => copyToClipboard(result.replacedText || '', 'replace-output')}
                className="text-xs font-semibold text-[#2E9BFF] hover:underline flex items-center gap-1 cursor-pointer"
              >
                {copiedKey === 'replace-output' ? <Check size={12} /> : <Copy size={12} />}
                {copiedKey === 'replace-output' ? 'Copied!' : 'Copy Result'}
              </button>
            </div>
            <textarea
              readOnly
              rows={5}
              value={result.replacedText || ''}
              className="w-full font-mono text-xs p-3 rounded-lg bg-[var(--bg-surface)] border border-[var(--border-subtle)] text-[var(--text-primary)] resize-y"
            />
          </div>
        </div>
      )}

      {/* Tab 3: Java Code Generator */}
      {activeTab === 'code' && (
        <div className="space-y-4">
          <div className="flex flex-wrap gap-2 text-xs font-semibold">
            {[
              { id: 'loop', label: 'Matcher.find() Loop' },
              { id: 'validate', label: 'Matcher.matches() Validation' },
              { id: 'replace', label: 'Matcher.replaceAll()' },
              { id: 'string', label: 'Escaped Java String Literal' }
            ].map((m) => (
              <button
                key={m.id}
                onClick={() => setActiveCodeMode(m.id as any)}
                className={`px-3 py-1.5 rounded-lg font-mono text-xs border transition cursor-pointer ${
                  activeCodeMode === m.id
                    ? 'bg-[#1d4ed8] text-white border-blue-500'
                    : 'bg-[var(--bg-input)] text-[var(--text-muted)] border-[var(--border-subtle)] hover:text-[var(--text-primary)]'
                }`}
              >
                {m.label}
              </button>
            ))}
          </div>

          <div className="relative rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-input)] overflow-hidden">
            <div className="flex items-center justify-between px-4 py-2 border-b border-[var(--border-subtle)] bg-[var(--bg-surface-hover)] text-xs font-mono">
              <span className="text-[var(--text-muted)]">Java 8 - Java 21 Standard Library</span>
              <button
                onClick={() => {
                  const snippet =
                    activeCodeMode === 'loop' ? result.javaCode.findLoop :
                    activeCodeMode === 'validate' ? result.javaCode.exactMatch :
                    activeCodeMode === 'replace' ? result.javaCode.replace :
                    result.javaCode.escapedJavaString;
                  copyToClipboard(snippet, 'java-snippet');
                }}
                className="text-[#2E9BFF] hover:underline flex items-center gap-1 cursor-pointer font-sans font-semibold"
              >
                {copiedKey === 'java-snippet' ? <Check size={12} /> : <Copy size={12} />}
                {copiedKey === 'java-snippet' ? 'Copied Code!' : 'Copy Java Code'}
              </button>
            </div>
            <pre className="m-0 p-4 font-mono text-xs text-slate-200 overflow-x-auto leading-relaxed">
              {activeCodeMode === 'loop' && result.javaCode.findLoop}
              {activeCodeMode === 'validate' && result.javaCode.exactMatch}
              {activeCodeMode === 'replace' && result.javaCode.replace}
              {activeCodeMode === 'string' && `// Paste this directly into your .java source file:\nString regex = ${result.javaCode.escapedJavaString};`}
            </pre>
          </div>
        </div>
      )}

      {/* Tab 4: Java Regex Cheatsheet */}
      {activeTab === 'cheatsheet' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div className="p-4 rounded-xl bg-[var(--bg-input)] border border-[var(--border-subtle)]">
            <h4 className="font-bold text-[#2E9BFF] mb-2 flex items-center gap-1.5">
              <BookOpen size={14} /> Java Character Classes &amp; POSIX
            </h4>
            <table className="w-full text-[11px] font-mono border-collapse">
              <tbody className="divide-y divide-[var(--border-subtle)]">
                <tr><td className="py-1 text-slate-300">\d</td><td className="py-1 text-[var(--text-muted)]">A digit: [0-9]</td></tr>
                <tr><td className="py-1 text-slate-300">\D</td><td className="py-1 text-[var(--text-muted)]">A non-digit: [^0-9]</td></tr>
                <tr><td className="py-1 text-slate-300">\s</td><td className="py-1 text-[var(--text-muted)]">A whitespace character: [ \t\n\x0B\f\r]</td></tr>
                <tr><td className="py-1 text-slate-300">\w</td><td className="py-1 text-[var(--text-muted)]">A word character: [a-zA-Z_0-9]</td></tr>
                <tr><td className="py-1 text-slate-300">\p&#123;Alpha&#125;</td><td className="py-1 text-[var(--text-muted)]">An alphabetic character: [a-zA-Z]</td></tr>
                <tr><td className="py-1 text-slate-300">\p&#123;Alnum&#125;</td><td className="py-1 text-[var(--text-muted)]">An alphanumeric character: [a-zA-Z0-9]</td></tr>
                <tr><td className="py-1 text-slate-300">\p&#123;Punct&#125;</td><td className="py-1 text-[var(--text-muted)]">Punctuation character</td></tr>
              </tbody>
            </table>
          </div>

          <div className="p-4 rounded-xl bg-[var(--bg-input)] border border-[var(--border-subtle)]">
            <h4 className="font-bold text-[#2E9BFF] mb-2 flex items-center gap-1.5">
              <Shield size={14} /> Java Boundary Matchers &amp; Lookarounds
            </h4>
            <table className="w-full text-[11px] font-mono border-collapse">
              <tbody className="divide-y divide-[var(--border-subtle)]">
                <tr><td className="py-1 text-slate-300">^ / $</td><td className="py-1 text-[var(--text-muted)]">Beginning / End of line (or input)</td></tr>
                <tr><td className="py-1 text-slate-300">\b / \B</td><td className="py-1 text-[var(--text-muted)]">Word boundary / Non-word boundary</td></tr>
                <tr><td className="py-1 text-slate-300">\A / \z</td><td className="py-1 text-[var(--text-muted)]">Beginning / End of entire input</td></tr>
                <tr><td className="py-1 text-slate-300">(?=...)</td><td className="py-1 text-[var(--text-muted)]">Positive lookahead assertion</td></tr>
                <tr><td className="py-1 text-slate-300">(?!...)</td><td className="py-1 text-[var(--text-muted)]">Negative lookahead assertion</td></tr>
                <tr><td className="py-1 text-slate-300">(?&lt;=...)</td><td className="py-1 text-[var(--text-muted)]">Positive lookbehind assertion</td></tr>
                <tr><td className="py-1 text-slate-300">(?&lt;!...)</td><td className="py-1 text-[var(--text-muted)]">Negative lookbehind assertion</td></tr>
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
