/**
 * Documentation & Writing Developer Client-Side Engines
 * 100% browser-native README generators, API doc generators, changelogs,
 * markdown formatters, TOC generators, JSDoc/TypeDoc builders, and legal templates.
 */

/** 1. README Generator */
export function generateReadme(input: string): string {
  const lines = (input || '').split(/\r?\n/).map(l => l.trim()).filter(Boolean);
  const projectName = lines[0] || 'My Awesome Project';
  const description = lines[1] || 'A fast, client-side, zero-knowledge open-source web application.';
  const license = lines[2] || 'MIT';

  return `# ${projectName}

> ${description}

[![License: ${license}](https://img.shields.io/badge/License-${encodeURIComponent(license)}-blue.svg)](LICENSE)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](CONTRIBUTING.md)
[![Built with TypeScript](https://img.shields.io/badge/Built%20with-TypeScript-blue.svg)](https://www.typescriptlang.org/)

## ⚡ Features

- 🔒 **100% Client-Side Privacy**: All processing executes in the browser memory. Zero server logging.
- 🚀 **High Performance**: Native Web APIs and optimized algorithms for sub-millisecond execution.
- 📱 **Fully Responsive**: Designed for mobile, tablet, and high-DPI desktop displays.
- 🛠 **Zero External Runtime Dependencies**: Lightweight and reliable.

## 📦 Installation

\`\`\`bash
# Clone the repository
git clone https://github.com/username/${projectName.toLowerCase().replace(/\s+/g, '-')}.git

# Navigate into the workspace
cd ${projectName.toLowerCase().replace(/\s+/g, '-')}

# Install dependencies
npm install
\`\`\`

## 🚀 Usage

\`\`\`bash
# Start local development server
npm run dev

# Build production bundle
npm run build
\`\`\`

## 📂 Project Structure

\`\`\`text
├── src/
│   ├── components/       # Reusable UI widgets
│   ├── crypto/           # Browser-native computation engines
│   ├── utils/            # Shared utilities & helpers
│   └── App.tsx           # Main application entry point
├── public/               # Static assets & metadata
├── package.json
└── README.md
\`\`\`

## 🤝 Contributing

Contributions, issues, and feature requests are welcome! Feel free to check out the [issues page](https://github.com/username/${projectName.toLowerCase().replace(/\s+/g, '-')}/issues).

## 📝 License

Distributed under the **${license} License**. See \`LICENSE\` for more information.
`;
}

/** 2. API Documentation Generator */
export function generateApiDocumentation(input: string): string {
  return `### Endpoint: \`POST /api/v1/encrypt\`

Encrypts payload using client-side authenticated AES-GCM cipher.

#### Request Headers
| Header | Type | Required | Description |
| :--- | :--- | :--- | :--- |
| \`Content-Type\` | \`string\` | Yes | Must be \`application/json\` |
| \`Authorization\` | \`string\` | No | Bearer access token |

#### Request Body
\`\`\`json
{
  "algorithm": "AES-GCM",
  "keySize": 256,
  "plaintext": "Confidential database connection string"
}
\`\`\`

#### Response (\`200 OK\`)
\`\`\`json
{
  "status": "success",
  "ciphertext": "k3J8v9...==",
  "iv": "3f9d12a...",
  "tag": "e4b109...",
  "timestamp": "${new Date().toISOString()}"
}
\`\`\`

#### Error Codes
| Code | Error Message | Reason |
| :--- | :--- | :--- |
| \`400\` | \`INVALID_PAYLOAD\` | Missing required plaintext field |
| \`422\` | \`UNSUPPORTED_CIPHER\` | Requested algorithm is not available |
`;
}

/** 3. Changelog Generator */
export function generateChangelog(input: string): string {
  const version = input.match(/v?\d+\.\d+\.\d+/)?.[0] || 'v2.5.0';
  const today = new Date().toISOString().split('T')[0];

  return `# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [${version}] - ${today}

### Added
- Added 20 new Documentation & Writing utilities.
- Added 20 new File & Binary analysis tools.
- Added 20 new Time & Productivity calculation engines.
- Instant copy-to-clipboard and markdown formatting export.

### Changed
- Improved client-side engine response times to < 2ms.
- Enhanced WCAG contrast compliance across dark and light UI themes.

### Fixed
- Fixed edge case in multi-line delimiter detection for nested data.
- Resolved memory leak during batch file metadata extraction.

### Security
- Verified zero network requests for all crypto calculations.
`;
}

/** 4. Release Notes Generator */
export function generateReleaseNotes(input: string): string {
  const version = input.match(/v?\d+\.\d+\.\d+/)?.[0] || 'v2.5.0';
  return `## 🚀 Release Notes — ${version}

We are excited to announce the release of **${version}**! This update introduces brand new developer tools, performance optimizations, and documentation generators.

### 🌟 What's New
* **Documentation Suite**: Automated README, API doc, and GitHub templates.
* **Binary File Analyzers**: Inspect MIME types, magic numbers, and byte offsets locally.
* **Productivity Engines**: Pomodoro intervals, sprint planners, and meeting timers.

### 📦 Quick Upgrade
\`\`\`bash
npm install package-name@${version}
\`\`\`

---
*Thank you to all contributors who submitted PRs for this milestone!*`;
}

/** 5. Markdown Table Generator */
export function generateMarkdownTable(input: string): string {
  const lines = (input || '').split(/\r?\n/).filter(l => l.trim());
  if (lines.length === 0) {
    return `| ID | Tool Name | Category | Status |
| :--- | :--- | :--- | :--- |
| 1 | README Generator | Documentation | Active |
| 2 | File Extension Extractor | File & Binary | Active |
| 3 | Pomodoro Timer | Productivity | Active |`;
  }

  const delimiter = input.includes('\t') ? '\t' : input.includes(',') ? ',' : '|';
  const parsedRows = lines.map(row => 
    row.split(delimiter)
      .map(c => c.trim().replace(/^\||\|$/g, '').trim())
      .filter(Boolean)
  );

  const header = parsedRows[0] || ['Column 1', 'Column 2'];
  const data = parsedRows.slice(1);

  const headerLine = `| ${header.join(' | ')} |`;
  const sepLine = `| ${header.map(() => ':---').join(' | ')} |`;
  const dataLines = data.map(r => {
    while (r.length < header.length) r.push('');
    return `| ${r.slice(0, header.length).join(' | ')} |`;
  });

  return [headerLine, sepLine, ...dataLines].join('\n');
}

/** 6. Markdown Table Formatter */
export function formatMarkdownTable(input: string): string {
  const lines = (input || '').split(/\r?\n/).filter(l => l.trim().startsWith('|'));
  if (lines.length === 0) return generateMarkdownTable(input);

  const rows = lines.map(line => 
    line.split('|')
      .map(c => c.trim())
      .filter((_, idx, arr) => idx > 0 && idx < arr.length - 1)
  );

  const colCount = Math.max(...rows.map(r => r.length));
  const colWidths: number[] = Array(colCount).fill(3);

  rows.forEach(r => {
    r.forEach((cell, idx) => {
      if (cell.match(/^:?-+:?$/)) return;
      colWidths[idx] = Math.max(colWidths[idx] || 3, cell.length);
    });
  });

  const formatted = rows.map((r, rowIdx) => {
    if (rowIdx === 1 && r.every(c => c.match(/^:?-+:?$/))) {
      return `| ${colWidths.map(w => ':' + '-'.repeat(Math.max(1, w - 1))).join(' | ')} |`;
    }
    const padded = r.map((c, idx) => c.padEnd(colWidths[idx]));
    while (padded.length < colCount) padded.push(''.padEnd(colWidths[padded.length]));
    return `| ${padded.join(' | ')} |`;
  });

  return formatted.join('\n');
}

/** 7. Markdown TOC Generator */
export function generateMarkdownToc(input: string): string {
  const lines = (input || '').split(/\r?\n/);
  const headings: { level: number; text: string; anchor: string }[] = [];

  lines.forEach(line => {
    const match = line.match(/^(#{1,6})\s+(.+)$/);
    if (match) {
      const level = match[1].length;
      const text = match[2].replace(/\[([^\]]+)\]\([^)]+\)/g, '$1').trim();
      const anchor = text.toLowerCase()
        .replace(/[^\w\s-]/g, '')
        .replace(/\s+/g, '-');
      headings.push({ level, text, anchor });
    }
  });

  if (headings.length === 0) {
    return `<!-- Table of Contents -->
## Table of Contents
- [1. Overview](#1-overview)
  - [1.1 Core Architecture](#11-core-architecture)
- [2. Installation](#2-installation)
- [3. API Reference](#3-api-reference)
  - [3.1 Authentication](#31-authentication)
  - [3.2 Endpoints](#32-endpoints)
- [4. Contributing](#4-contributing)
- [5. License](#5-license)`;
  }

  const tocLines = headings.map(h => {
    const indent = '  '.repeat(Math.max(0, h.level - 1));
    return `${indent}- [${h.text}](#${h.anchor})`;
  });

  return `## Table of Contents\n\n` + tocLines.join('\n');
}

/** 8. Markdown Link Checker */
export function checkMarkdownLinks(input: string): string {
  const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
  let match;
  const links: { text: string; url: string; type: string; status: string }[] = [];

  while ((match = linkRegex.exec(input)) !== null) {
    const text = match[1];
    const url = match[2];
    let type = 'External URL';
    let status = 'Valid syntax';

    if (url.startsWith('#')) {
      type = 'Internal Anchor';
    } else if (url.startsWith('/')) {
      type = 'Relative Root Path';
    } else if (url.startsWith('./') || url.startsWith('../')) {
      type = 'Relative File Path';
    } else if (!url.startsWith('http://') && !url.startsWith('https://') && !url.startsWith('mailto:')) {
      status = 'Warning: Missing protocol (http/https)';
    }

    links.push({ text, url, type, status });
  }

  if (links.length === 0) {
    return `=== MARKDOWN LINK AUDIT ===
No markdown links found.
Paste text containing markdown links like [Link Text](https://example.com) to validate.`;
  }

  return `=== MARKDOWN LINK AUDIT (${links.length} Links Found) ===
` + links.map((l, idx) => `[${idx + 1}] "${l.text}"
  • Target : ${l.url}
  • Type   : ${l.type}
  • Status : ${l.status}`).join('\n\n');
}

/** 9. Markdown Image Link Checker */
export function checkMarkdownImageLinks(input: string): string {
  const imgRegex = /!\[([^\]]*)\]\(([^)]+)\)/g;
  let match;
  const images: { alt: string; src: string; format: string; status: string }[] = [];

  while ((match = imgRegex.exec(input)) !== null) {
    const alt = match[1];
    const src = match[2];
    const ext = src.split('.').pop()?.split(/[?#]/)[0]?.toLowerCase() || 'unknown';
    const hasAlt = alt.trim().length > 0;

    images.push({
      alt: alt || '(Missing Alt Text)',
      src,
      format: ext.toUpperCase(),
      status: hasAlt ? '✓ Accessible Alt Text Present' : '⚠ Accessibility Warning: Alt text is empty'
    });
  }

  if (images.length === 0) {
    return `=== MARKDOWN IMAGE LINK AUDIT ===
No markdown images found.
Paste markdown like ![Alt Text](https://example.com/image.png) to audit.`;
  }

  return `=== MARKDOWN IMAGE AUDIT (${images.length} Images Found) ===
` + images.map((img, idx) => `[${idx + 1}] Alt: "${img.alt}"
  • Source : ${img.src}
  • Format : ${img.format}
  • Status : ${img.status}`).join('\n\n');
}

/** 10. JSDoc Generator */
export function generateJsDoc(input: string): string {
  const lines = (input || '').split(/\r?\n/);
  const fnLine = lines.find(l => l.includes('function') || l.includes('=>') || l.includes('(')) || 'function calculateChecksum(payload: string, rounds: number = 3): Promise<string>';

  const fnNameMatch = fnLine.match(/function\s+([a-zA-Z0-9_$]+)/) || fnLine.match(/const\s+([a-zA-Z0-9_$]+)/);
  const fnName = fnNameMatch ? fnNameMatch[1] : 'processData';

  return `/**
 * Executes high-performance client-side ${fnName} operation.
 *
 * @param {string} payload - The raw input data string to be processed.
 * @param {number} [rounds=3] - Number of iterations to apply for the transformation.
 * @param {Object} [options={}] - Optional configuration overrides.
 * @param {boolean} [options.verbose=false] - When true, enables diagnostic timing output.
 * @returns {Promise<string>} The transformed and validated result string.
 * @throws {TypeError} When the input payload is null or undefined.
 *
 * @example
 * \`\`\`ts
 * const result = await ${fnName}('sample-token', 5);
 * console.log(result);
 * \`\`\`
 */
${fnLine}`;
}

/** 11. TypeDoc Comment Generator */
export function generateTypeDocComment(input: string): string {
  return `/**
 * Represents the configuration options for cryptographic operations.
 *
 * @remarks
 * This interface conforms to the Web Cryptography API standards.
 * All properties are immutable once initialized.
 *
 * @category Cryptography
 * @public
 */
export interface CryptoConfigOptions {
  /**
   * The symmetric encryption algorithm to use.
   * @defaultValue \`'AES-GCM'\`
   */
  algorithm: 'AES-GCM' | 'ChaCha20-Poly1305' | 'AES-CBC';

  /**
   * Key length in bits.
   * @defaultValue \`256\`
   */
  keyLength: 128 | 192 | 256;

  /**
   * Flag indicating if sensitive key material should be exportable.
   */
  extractable?: boolean;
}`;
}

/** 12. License File Generator */
export function generateLicenseFile(input: string): string {
  const type = (input || 'MIT').toUpperCase();
  const year = new Date().getFullYear();
  const author = input.includes('by') ? input.split('by')[1].trim() : 'EncryptDecrypt Project Contributors';

  if (type.includes('APACHE')) {
    return `                                 Apache License
                           Version 2.0, January 2004
                        http://www.apache.org/licenses/

   Copyright ${year} ${author}

   Licensed under the Apache License, Version 2.0 (the "License");
   you may not use this file except in compliance with the License.
   You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.`;
  }

  return `MIT License

Copyright (c) ${year} ${author}

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.`;
}

/** 13. CONTRIBUTING.md Generator */
export function generateContributingMd(input: string): string {
  const name = input.trim() || 'EncryptDecrypt Suite';
  return `# Contributing to ${name}

Thank you for your interest in contributing to **${name}**! We welcome all developers, designers, and documentation writers.

## 📜 Code of Conduct
Please be respectful and polite in all interactions within issues, pull requests, and discussions.

## 🛠 How to Contribute

1. **Fork the Repository** on GitHub.
2. **Clone your fork** locally:
   \`\`\`bash
   git clone https://github.com/your-username/project.git
   \`\`\`
3. **Create a Feature Branch**:
   \`\`\`bash
   git checkout -b feature/amazing-new-tool
   \`\`\`
4. **Make your changes** and add unit tests.
5. **Run the test suite and linter**:
   \`\`\`bash
   npm run lint
   npm test
   \`\`\`
6. **Commit your changes**:
   \`\`\`bash
   git commit -m "feat(tools): add new binary inspector engine"
   \`\`\`
7. **Push to GitHub**:
   \`\`\`bash
   git push origin feature/amazing-new-tool
   \`\`\`
8. **Open a Pull Request** describing your work.

## 🔒 Security Policy
If you find a security vulnerability, please do NOT create a public issue. See \`SECURITY.md\` for private disclosure instructions.`;
}

/** 14. SECURITY.md Generator */
export function generateSecurityMd(input: string): string {
  const email = input.includes('@') ? input.trim() : 'security@encryptdecrypt.org';
  return `# Security Policy

## Supported Versions

| Version | Supported          |
| ------- | ------------------ |
| 2.x.x   | :white_check_mark: |
| 1.x.x   | :x:                |

## Reporting a Vulnerability

We take the security of our cryptographic algorithms and client-side privacy extremely seriously.

If you believe you have discovered a vulnerability:
1. **Email us directly at** [\`${email}\`](mailto:${email}).
2. Please include detailed steps to reproduce the issue, proof of concept, and environment specs.
3. We will acknowledge receipt of your vulnerability report within 24 hours.
4. We aim to release a patched version within 7 business days.

**Please do not report security vulnerabilities via public GitHub issues.**`;
}

/** 15. CODEOWNERS Generator */
export function generateCodeowners(input: string): string {
  return `# Global default owners for the entire repository
* @ajayade1004 @core-team

# Frontend & UI components
/src/components/ @frontend-leads @ajayade1004

# Core cryptographic engines & math algorithms
/src/crypto/ @crypto-leads @security-architects

# Documentation & GitHub workflows
/docs/ @docs-team
/.github/ @devops-team`;
}

/** 16. Issue Template Generator */
export function generateIssueTemplate(input: string): string {
  return `---
name: 🐛 Bug Report
about: Create a report to help us improve the tool
title: '[BUG] '
labels: 'bug, triage'
assignees: ''
---

**Describe the bug**
A clear and concise description of what the bug is.

**Steps to Reproduce**
1. Go to '...'
2. Input '...'
3. Click on '....'
4. See error

**Expected behavior**
A clear and concise description of what you expected to happen.

**Screenshots / Code Snippets**
If applicable, add code or screenshots to help explain your problem.

**Environment (please complete the following information):**
 - OS: [e.g. macOS Sonoma, Windows 11, Ubuntu 24.04]
 - Browser: [e.g. Chrome 128, Firefox 130, Safari 17]
 - Version: [e.g. 2.5.0]
`;
}

/** 17. Pull Request Template Generator */
export function generatePrTemplate(input: string): string {
  return `## 📝 Description
Provide a concise overview of the changes introduced in this PR.

Fixes # (issue)

## 🛠 Type of Change
- [ ] 🐛 Bug fix (non-breaking change which fixes an issue)
- [ ] ✨ New feature (non-breaking change which adds functionality)
- [ ] 💥 Breaking change (fix or feature that would cause existing functionality to not work as expected)
- [ ] 📚 Documentation update

## ✅ Checklist:
- [ ] My code follows the code style guidelines of this project.
- [ ] I have performed a self-review of my own code.
- [ ] I have commented my code, particularly in hard-to-understand areas.
- [ ] I have made corresponding changes to the documentation.
- [ ] My changes generate no new warnings or lint errors.
`;
}

/** 18. Markdown Frontmatter Generator */
export function generateMarkdownFrontmatter(input: string): string {
  const title = input || 'Introduction to Browser Cryptography';
  const slug = title.toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-');
  const date = new Date().toISOString().split('T')[0];

  return `---
title: "${title}"
slug: "${slug}"
date: "${date}"
author: "EncryptDecrypt Team"
category: "Developer Tools"
tags: ["cryptography", "privacy", "webcrypto", "client-side"]
description: "Comprehensive developer guide to client-side encryption and zero-log architecture."
draft: false
layout: "post"
canonical_url: "https://encryptdecrypt.org/blog/${slug}"
---`;
}

/** 19. Markdown Heading Numbering Tool */
export function numberMarkdownHeadings(input: string): string {
  const lines = (input || '').split(/\r?\n/);
  let h1 = 0, h2 = 0, h3 = 0;

  const numbered = lines.map(line => {
    const m1 = line.match(/^#\s+(.+)$/);
    if (m1) {
      h1++; h2 = 0; h3 = 0;
      const clean = m1[1].replace(/^\d+\.\s*/, '');
      return `# ${h1}. ${clean}`;
    }
    const m2 = line.match(/^##\s+(.+)$/);
    if (m2) {
      h2++; h3 = 0;
      const clean = m2[1].replace(/^\d+(\.\d+)*\.\s*/, '');
      return `## ${h1}.${h2}. ${clean}`;
    }
    const m3 = line.match(/^###\s+(.+)$/);
    if (m3) {
      h3++;
      const clean = m3[1].replace(/^\d+(\.\d+)*\.\s*/, '');
      return `### ${h1}.${h2}.${h3}. ${clean}`;
    }
    return line;
  });

  return numbered.join('\n');
}

/** 20. Documentation Word Count Analyzer */
export function analyzeDocWordCount(input: string): string {
  const text = input || '';
  const words = text.trim() ? text.trim().split(/\s+/).length : 0;
  const chars = text.length;
  const charsNoSpaces = text.replace(/\s/g, '').length;
  const lines = text.split(/\r?\n/).length;
  const paragraphs = text.split(/\n\s*\n/).filter(p => p.trim()).length;
  const readingTimeMin = (words / 200).toFixed(1);
  const speakingTimeMin = (words / 130).toFixed(1);

  return `=== DOCUMENTATION METRICS & WORD COUNT AUDIT ===
• Total Word Count       : ${words.toLocaleString()} words
• Character Count (Total): ${chars.toLocaleString()} characters
• Characters (No Spaces) : ${charsNoSpaces.toLocaleString()} characters
• Line Count             : ${lines.toLocaleString()} lines
• Paragraphs             : ${paragraphs} paragraphs

Reading & Speaking Estimates:
• Silent Reading Time    : ~${readingTimeMin} minutes (@ 200 WPM)
• Spoken Presentation    : ~${speakingTimeMin} minutes (@ 130 WPM)

Content Density:
• Avg Words / Paragraph  : ${paragraphs > 0 ? (words / paragraphs).toFixed(1) : 0}
• Avg Characters / Word  : ${words > 0 ? (charsNoSpaces / words).toFixed(1) : 0}`;
}
