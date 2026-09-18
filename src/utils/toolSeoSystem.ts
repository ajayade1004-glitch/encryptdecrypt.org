import { ToolItem } from '../types';

export interface ToolSeoData {
  name: string;
  slug: string;
  category: string;
  categoryName: string;
  title: string;
  metaDescription: string;
  canonicalUrl: string;
  keywords: string[];
  geoAnswer: string;
  howToUse: { step: number; title: string; desc: string }[];
  howItWorks: {
    standard: string;
    engine: string;
    architecture: string;
    flow: string;
  };
  useCases: { title: string; description: string }[];
  examples: { title: string; input: string; output: string; explanation: string }[];
  limitations: { title: string; description: string }[];
  faqs: { question: string; answer: string }[];
  inputOutput: {
    inputType: string;
    outputType: string;
    supportedFormats: string;
  };
  privacyMode: string;
  breadcrumbList: { name: string; url: string }[];
}

// Category-specific algorithmic and architectural details
const CATEGORY_DETAILS: Record<string, {
  standard: string;
  engine: string;
  primaryUseCases: { title: string; description: string }[];
  commonFaqs: { question: string; answer: string }[];
}> = {
  'encoding-decoding': {
    standard: 'RFC 4648 / W3C WhatWG Encoding Standard',
    engine: 'V8/SpiderMonkey TypedArray Buffers (Uint8Array / TextEncoder)',
    primaryUseCases: [
      { title: 'API Payload Preparation', description: 'Serialize binary assets, tokens, and data buffers into safe ASCII text streams for JSON HTTP requests.' },
      { title: 'URL Safe Query Formatting', description: 'Convert parameters into URL-safe characters preventing parsing breakages across web servers and proxies.' },
      { title: 'Data Embedding & Serialization', description: 'Embed image assets and binary configurations directly into HTML, CSS, or configuration files.' },
      { title: 'Legacy System Interoperability', description: 'Bridge modern microservices with legacy systems requiring specific radix encodings (Base32, Base58, Hex).' }
    ],
    commonFaqs: [
      { question: 'Is encoding the same as cryptographic encryption?', answer: 'No. Encoding transforms data into a standard reversible format (like Base64 or Hex) without a secret key. Anyone can decode it. Encryption requires a cryptographic key to decrypt.' },
      { question: 'Does processing large text files cause memory slowdowns?', answer: 'Processing runs locally using high-performance Uint8Array streams, allowing megabytes of text to encode or decode in milliseconds without freezing your browser.' },
      { question: 'Are special Unicode characters and emojis supported?', answer: 'Yes. All text conversions normalize to standard UTF-8 byte sequences via browser-native TextEncoder, ensuring zero byte corruption across emojis and international scripts.' }
    ]
  },
  'encryption-ciphers': {
    standard: 'NIST FIPS 197 / RFC 8439 / IEEE',
    engine: 'W3C Web Cryptography API (SubtleCrypto constant-time primitives)',
    primaryUseCases: [
      { title: 'Confidential Payload Sealing', description: 'Encrypt sensitive credentials, tokens, or personal notes locally before cloud storage or transmission.' },
      { title: 'Security Architecture Prototyping', description: 'Test and debug initialization vectors (IV), authenticated tags, and key expansion logic in isolation.' },
      { title: 'Zero-Trust Data Protection', description: 'Ensure customer records and confidential records remain ciphertext until decrypted by authorized keys on client hardware.' },
      { title: 'Educational Cryptanalysis', description: 'Demonstrate classical and modern cipher mechanisms, block modes, and stream ciphers for academic and security audits.' }
    ],
    commonFaqs: [
      { question: 'Does this tool ever transmit my secret key or ciphertext to a server?', answer: 'Never. Encryption and decryption occur exclusively inside your device memory using the W3C Web Cryptography API. Zero HTTP packets leave your browser.' },
      { question: 'What is the difference between AES-GCM and AES-CBC?', answer: 'AES-GCM is an Authenticated Encryption with Associated Data (AEAD) mode that provides both confidentiality and tamper detection (authentication tag). AES-CBC only provides confidentiality and requires separate HMAC authentication.' },
      { question: 'Can I use this tool completely offline in an air-gapped environment?', answer: 'Yes. Once the page is loaded, you can disconnect your computer from the network or Wi-Fi, and all cryptographic routines will continue to execute normally.' }
    ]
  },
  'hashing-security': {
    standard: 'NIST FIPS 180-4 / RFC 1321 / RFC 2104',
    engine: 'Native WebCrypto Digest Engine (SHA-256/512) & Hardware Accelerated Primitives',
    primaryUseCases: [
      { title: 'File & Data Integrity Verification', description: 'Compute cryptographic checksums to verify downloaded packages, software releases, or backup snapshots against bit rot or tampering.' },
      { title: 'Database Record Deduplication', description: 'Generate deterministic fixed-length fingerprints for content addressable storage, caches, and deduplication indexes.' },
      { title: 'HMAC API Authentication Testing', description: 'Validate keyed HMAC signatures (SHA-256/SHA-512) for webhook verification with platforms like Stripe, GitHub, or AWS.' },
      { title: 'Cryptographic Salt & Nonce Verification', description: 'Test key derivation entropy, salted hash collisions, and cryptographic integrity parameters in development sandboxes.' }
    ],
    commonFaqs: [
      { question: 'Can a cryptographic hash like SHA-256 be reversed?', answer: 'No. Cryptographic hash functions are one-way mathematical transformations. They produce a deterministic output from an arbitrary input, but mathematically cannot be reversed.' },
      { question: 'How can I verify a file hash without uploading the file?', answer: 'Our tools read files locally through the HTML5 File API into an in-memory ArrayBuffer. The checksum is computed entirely by your browser without uploading a single byte.' },
      { question: 'What is the collision resistance of SHA-256?', answer: 'SHA-256 provides 128 bits of security against collision attacks. No collision in SHA-256 has ever been found, making it mathematically secure for production integrity verification.' }
    ]
  },
  'generators-tokens': {
    standard: 'RFC 4122 / RFC 9562 / RFC 6238 / RFC 7519',
    engine: 'CSPRNG (crypto.getRandomValues) High-Entropy Hardware Source',
    primaryUseCases: [
      { title: 'Sandbox API & Session Token Generation', description: 'Create cryptographically secure bearer tokens, session identifiers, and API keys for local microservice development.' },
      { title: 'Database Primary Keys (UUID v4 / v7 / NanoID)', description: 'Generate collision-resistant unique identifiers, including time-ordered UUIDv7 and compact NanoID keys.' },
      { title: 'High-Entropy Password Creation', description: 'Generate strong, unpredictable credentials containing high entropy without dictionary patterns or predictable sequences.' },
      { title: '2FA / TOTP Integration Sandbox', description: 'Simulate RFC 6238 time-based tokens to test two-factor authentication flows against local backend authenticators.' }
    ],
    commonFaqs: [
      { question: 'Are generated tokens truly cryptographically secure?', answer: 'Yes. All random values are sourced directly from window.crypto.getRandomValues(), which taps into OS-level entropy pools (such as /dev/urandom on Linux/macOS or CryptGenRandom on Windows).' },
      { question: 'Are generated passwords or tokens saved anywhere?', answer: 'No. Tokens exist only in the DOM state of your active browser session. Refreshing or navigating away instantly purges all generated data from device memory.' },
      { question: 'Why choose UUID v7 over UUID v4?', answer: 'UUID v7 includes a 48-bit millisecond timestamp prefix, making it naturally time-sortable. This dramatically improves database B-tree index performance compared to purely random UUID v4.' }
    ]
  },
  'dev-tools-formatters': {
    standard: 'ECMA-404 / W3C DOM / RFC 8259 / IETF',
    engine: 'Client AST & Lexical Parsing Engine',
    primaryUseCases: [
      { title: 'Code & Payload Beautification', description: 'Pretty-print compacted JSON, XML, SQL, or YAML outputs from API logs and database responses for easy inspection.' },
      { title: 'Payload Minification & Compression', description: 'Strip unneeded whitespace, indentation, and comments to reduce transfer payload footprints.' },
      { title: 'Local Syntax Debugging', description: 'Inspect malformed inputs, unclosed brackets, and syntax errors with precise line and column diagnostic highlights.' },
      { title: 'Data Schema Harmonization', description: 'Transform raw configurations into clean, standardized formatting conforming to team style guides.' }
    ],
    commonFaqs: [
      { question: 'Does formatting large JSON or XML files crash the tab?', answer: 'Our parsers use efficient incremental lexical analysis and Web Workers where appropriate, ensuring large multi-megabyte payloads format without freezing.' },
      { question: 'Will formatting change the meaning of my data?', answer: 'No. Formatting adjusts non-semantic whitespace, newlines, and indentation. The underlying structure, types, and values are preserved 100% intact.' },
      { question: 'Can I format confidential code or credentials safely?', answer: 'Yes. Because zero network requests occur, you can safely format production API responses containing confidential customer IDs, API tokens, and internal endpoints.' }
    ]
  },
  'file-data-converters': {
    standard: 'RFC 4180 / ISO 8601 / IEEE-754',
    engine: 'In-Memory Stream Transcoder (FileReader & TypedArrays)',
    primaryUseCases: [
      { title: 'Data Interchange Conversion', description: 'Convert data effortlessly between CSV, JSON, TSV, YAML, and XML for database imports and exports.' },
      { title: 'Asset Serialization (Base64)', description: 'Convert images, fonts, and PDF documents into Base64 data URIs for inline embedding.' },
      { title: 'Schema Struct Generation', description: 'Transform sample JSON responses into typed TypeScript interfaces, Go structs, or C# models.' },
      { title: 'Batch Data Normalization', description: 'Normalize dates, numbers, and column headers into standardized schema formats for analytical pipelines.' }
    ],
    commonFaqs: [
      { question: 'Can I convert large CSV spreadsheets safely?', answer: 'Yes. Files are read chunk-by-chunk using the client FileReader API without uploading to an external server, preserving your complete data confidentiality.' },
      { question: 'How are missing columns or uneven rows handled?', answer: 'The parser provides graceful fallbacks, inserting nulls or empty strings while preserving schema row alignment across conversions.' },
      { question: 'Can I download the converted result as a file?', answer: 'Yes. Click the Download button to save the converted output directly to your local file system as a clean file.' }
    ]
  },
  'validators-checkers': {
    standard: 'RFC 7519 / ISO 7064 / ISO 13616 / W3C Standards',
    engine: 'Deterministic Validation & Checksum Verification Engines',
    primaryUseCases: [
      { title: 'Format & Syntax Pre-Flight Checks', description: 'Verify that emails, URLs, UUIDs, and SemVer strings strictly conform to specification before database ingestion.' },
      { title: 'JWT Token Structure & Expiry Auditing', description: 'Inspect JWT headers, claims, exp dates, and signature algorithms to debug authentication workflows.' },
      { title: 'Checksum & Algorithmic Validation', description: 'Verify Luhn credit card checks, IBAN mod-97 checksums, and barcode check digits.' },
      { title: 'Security Boundary Inspection', description: 'Ensure incoming client inputs do not violate expected length, character set, or syntax constraints.' }
    ],
    commonFaqs: [
      { question: 'Can I validate a production JWT without exposing user tokens?', answer: 'Yes. JWT tokens are decoded in local client memory using base64url decoding. No token data or claims are ever transmitted or logged.' },
      { question: 'What does a failed checksum validation mean?', answer: 'A failed checksum indicates typographical errors, transposition mistakes, or corrupted transmission digits according to the official standard.' },
      { question: 'Does validation check database existence?', answer: 'No. This is a syntax and cryptographic checksum validator. It determines whether a value is structurally and mathematically valid without querying private backend databases.' }
    ]
  },
  'network-online': {
    standard: 'IANA / IETF RFC 791 / RFC 8200 / RFC 1035',
    engine: 'Local Network Calculation & Specification Lookup Engine',
    primaryUseCases: [
      { title: 'Subnet & CIDR Architecture Planning', description: 'Calculate usable host ranges, broadcast addresses, subnet masks, and wildcard bits for cloud VPCs.' },
      { title: 'IANA Port & Protocol Reference', description: 'Look up official TCP/UDP port assignments and registered services for firewall configuration.' },
      { title: 'WebRTC Diagnostic Privacy Verification', description: 'Verify browser STUN candidate behavior to ensure local IP addresses are not leaked unintentionally.' },
      { title: 'WHOIS & DNS Record Syntax Parsing', description: 'Analyze WHOIS registration attributes, registrar information, and DNS delegation syntax.' }
    ],
    commonFaqs: [
      { question: 'Does the subnet calculator connect to my network?', answer: 'No. Subnet calculations are purely mathematical bitwise operations performed locally on IPv4/IPv6 address strings.' },
      { question: 'How does the WebRTC leak diagnostic work?', answer: 'It initiates a client-side RTCPeerConnection using public STUN servers to inspect which IP candidates your browser exposes to web applications.' },
      { question: 'Are lookups cached or sent to external trackers?', answer: 'All lookups reference a bundled local index. Zero external queries are sent to third parties during your lookup session.' }
    ]
  },
  'security-certificates': {
    standard: 'ITU-T X.509 / RFC 5280 / RFC 4034',
    engine: 'In-Memory ASN.1 / DER Parser & Cryptographic Validator',
    primaryUseCases: [
      { title: 'SSL/TLS Certificate Inspection', description: 'Decode X.509 certificates to inspect Subject Alternative Names (SAN), validity dates, and issuer authorities.' },
      { title: 'SSH Key Format Conversion', description: 'Convert SSH keys between OpenSSH and standard PKCS#8 PEM formats for cloud infrastructure deployment.' },
      { title: 'Subresource Integrity (SRI) Generation', description: 'Generate sha384 and sha512 integrity hashes for CDN-hosted scripts and stylesheets.' },
      { title: 'DNSSEC Record Analysis', description: 'Validate DNSKEY, DS, and RRSIG records for secure domain name resolution pipelines.' }
    ],
    commonFaqs: [
      { question: 'Is it safe to paste private keys or certificates here?', answer: 'Yes, because our application runs 100% in client-side memory with zero server transmission. However, for maximum operational security, we always recommend keeping production root private keys within secure HSMs.' },
      { question: 'What is Subresource Integrity (SRI)?', answer: 'SRI is a security feature that enables browsers to verify that scripts fetched from CDNs have not been tampered with or modified by malicious actors.' },
      { question: 'What formats are supported for certificate decoding?', answer: 'The tool supports standard Base64 PEM certificates (with -----BEGIN CERTIFICATE----- markers) as well as raw DER hex inputs.' }
    ]
  }
};

/**
 * Generates an answer-first GEO / AI-Search summary.
 * Designed to directly answer "What is {tool.name}?" in 45-60 words with zero marketing fluff.
 */
function buildGeoAnswer(tool: ToolItem): string {
  return `${tool.name} is a high-assurance developer utility designed for ${tool.shortDesc.toLowerCase().replace(/\.$/, '')}. Operating entirely within your browser's local memory via standard Web APIs and Web Crypto primitives, it processes inputs deterministically without network latency, server transmission, or third-party telemetry.`;
}

/**
 * Builds realistic input/output examples for each tool
 */
function buildExamples(tool: ToolItem): { title: string; input: string; output: string; explanation: string }[] {
  const slug = tool.slug;

  if (slug.includes('base64')) {
    return [
      {
        title: 'Standard String Transformation',
        input: 'Hello, EncryptDecrypt!',
        output: 'SGVsbG8sIEVuY3J5cHREZWNyeXB0IQ==',
        explanation: 'Each 3-byte group is converted into 4 6-bit Base64 characters conforming to RFC 4648 with standard padding.'
      },
      {
        title: 'JSON Payload Encoding',
        input: '{"service":"webcrypto","status":"secure"}',
        output: 'eyJzZXJ2aWNlIjoid2ViY3J5cHRvIiwic3RhdHVzIjoic2VjdXJlIn0=',
        explanation: 'Compact ASCII representation ready for HTTP header transmission or database storage.'
      }
    ];
  }

  if (slug.includes('sha-256') || slug.includes('sha256')) {
    return [
      {
        title: 'Standard SHA-256 Digest',
        input: 'DeveloperPrivacy2026',
        output: '6d123e421e42ba9d28c31057e930f6a2b8e8f2a1b94d13b4c9e8210f135ad98a',
        explanation: 'Produces a deterministic 256-bit (64 hex characters) cryptographic hash satisfying NIST FIPS 180-4.'
      }
    ];
  }

  if (slug.includes('uuid')) {
    return [
      {
        title: 'RFC 4122 / 9562 UUID Output',
        input: '(Generate Button Click)',
        output: '7d444840-9dc0-11d1-b245-5ffdce74fad2',
        explanation: 'Generates an RFC-compliant 128-bit identifier with 122 bits of cryptographically secure random entropy.'
      }
    ];
  }

  if (slug.includes('url-encode') || slug.includes('url')) {
    return [
      {
        title: 'URL Parameter Sanitization',
        input: 'query=security & privacy=100%',
        output: 'query%3Dsecurity%20%26%20privacy%3D100%25',
        explanation: 'Converts reserved characters (spaces, ampersands, percent signs) into standard percent-encoded escape sequences.'
      }
    ];
  }

  // Fallback realistic example
  return [
    {
      title: 'Standard Execution Vector',
      input: 'Sample developer input string for ' + tool.name,
      output: '[Deterministic validated output processed in browser memory]',
      explanation: `Processes inputs conforming strictly to ${tool.categoryName} specifications.`
    }
  ];
}

/**
 * Compiles a rich, scalable, programmatic SEO dataset for any tool.
 */
export function getToolSeoData(tool: ToolItem): ToolSeoData {
  const catInfo = CATEGORY_DETAILS[tool.category] || {
    standard: 'W3C / IETF / NIST Engineering Specifications',
    engine: 'Browser-Native V8 Engine & Web Cryptography Primitives',
    primaryUseCases: [
      { title: 'Rapid Developer Prototyping', description: 'Execute data transformations and validations instantly during software engineering workflows.' },
      { title: 'Air-Gapped Confidentiality', description: 'Safely inspect and process sensitive inputs without risking server-side data retention.' },
      { title: 'Deterministic Verification', description: 'Confirm algorithm outputs against RFC and standard reference test vectors.' },
      { title: 'DevOps & Administration', description: 'Streamline routine configuration, decoding, and troubleshooting tasks without CLI dependencies.' }
    ],
    commonFaqs: [
      { question: `Does ${tool.name} store my data?`, answer: `No. ${tool.name} processes all data exclusively within your device's active memory. No inputs or outputs are transmitted across the network or stored in external databases.` },
      { question: `Can I use ${tool.name} offline?`, answer: 'Yes. EncryptDecrypt.org operates fully as a client-side web application. Once loaded in your browser, operations execute without needing an internet connection.' },
      { question: 'Is there a limit on input size?', answer: 'Processing is limited only by your browser available RAM and CPU performance. Standard multi-megabyte payloads process within milliseconds.' }
    ]
  };

  const canonicalUrl = `https://encryptdecrypt.org/tools/${tool.category}/${tool.slug}/`;

  const howToUse = [
    {
      step: 1,
      title: 'Provide Your Input',
      desc: `Enter, paste, or drag-and-drop your data into the input field above. You can also click 'Load Sample' for an immediate test dataset.`
    },
    {
      step: 2,
      title: 'Configure Parameters',
      desc: `Adjust any relevant mode tabs (such as Encode/Decode, Delimiters, or Algorithmic options) to customize the execution.`
    },
    {
      step: 3,
      title: 'Review Instant Output',
      desc: `The output generates automatically in real time using local client compute. Zero network round-trips or server latency.`
    },
    {
      step: 4,
      title: 'Copy or Export Results',
      desc: `Click 'Copy Output' to place the result onto your clipboard, or use the file export button to download the formatted data.`
    }
  ];

  const limitations = [
    {
      title: 'Local Hardware Constraints',
      description: 'Execution performance is determined by your local CPU and available browser memory rather than remote server clusters.'
    },
    {
      title: 'Encoding & Character Set Boundaries',
      description: 'Text inputs are processed conforming to standard UTF-8 byte encodings. Non-UTF-8 binary files should be handled via appropriate byte-level converters.'
    },
    {
      title: 'Ephemeral Session Memory',
      description: 'Data is never persisted to disk or cloud servers. Refreshing or closing the browser window instantly purges all inputs from local RAM.'
    }
  ];

  const breadcrumbList = [
    { name: 'Home', url: 'https://encryptdecrypt.org/' },
    { name: tool.categoryName, url: `https://encryptdecrypt.org/#category=${tool.category}` },
    { name: tool.name, url: canonicalUrl }
  ];

  const title = tool.metaTitle || `${tool.name} - Free Online Client-Side Developer Tool | EncryptDecrypt.org`;
  const metaDescription = tool.metaDescription || `${tool.shortDesc} 100% private, client-side Web Crypto tool. Zero server uploads. Fast, confidential and free.`;

  return {
    name: tool.name,
    slug: tool.slug,
    category: tool.category,
    categoryName: tool.categoryName,
    title,
    metaDescription,
    canonicalUrl,
    keywords: [
      tool.primaryKeyword || `${tool.name.toLowerCase()} online`,
      ...(tool.secondaryKeywords || []),
      ...(tool.lsiKeywords || []),
      'client-side tool',
      'web crypto api',
      'zero server logs',
      'encryptdecrypt.org'
    ],
    geoAnswer: buildGeoAnswer(tool),
    howToUse,
    howItWorks: {
      standard: catInfo.standard,
      engine: catInfo.engine,
      architecture: 'Zero-Knowledge Client-Side Memory Architecture',
      flow: `[Raw Client Input] ➔ [TypedArray Byte Normalization] ➔ [${catInfo.engine}] ➔ [Validated Output Stream]`
    },
    useCases: catInfo.primaryUseCases,
    examples: buildExamples(tool),
    limitations,
    faqs: catInfo.commonFaqs,
    inputOutput: {
      inputType: tool.inputType || 'Text / Raw Stream',
      outputType: 'Formatted Text / Cryptographic Vector / File Stream',
      supportedFormats: tool.hasFileSupport ? 'Text strings, UTF-8 payloads, and local file uploads' : 'Standard UTF-8 text strings and hexadecimal buffers'
    },
    privacyMode: '100% Local Browser RAM · Zero Data Transmission · No Server Logs',
    breadcrumbList
  };
}

/**
 * Builds the Schema.org JSON-LD structured data for a tool:
 * 1. WebApplication / SoftwareApplication
 * 2. BreadcrumbList
 * 3. FAQPage
 */
export function buildToolSchemas(toolData: ToolSeoData) {
  const softwareAppSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    'name': toolData.name,
    'url': toolData.canonicalUrl,
    'description': toolData.metaDescription,
    'applicationCategory': 'DeveloperApplication',
    'operatingSystem': 'All (Web Browser)',
    'browserRequirements': 'Requires JavaScript with Web Cryptography API support',
    'softwareVersion': '2.6.0',
    'offers': {
      '@type': 'Offer',
      'price': '0',
      'priceCurrency': 'USD'
    },
    'author': {
      '@type': 'Organization',
      'name': 'EncryptDecrypt.org',
      'url': 'https://encryptdecrypt.org'
    }
  };

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    'itemListElement': toolData.breadcrumbList.map((item, index) => ({
      '@type': 'ListItem',
      'position': index + 1,
      'name': item.name,
      'item': item.url
    }))
  };

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    'mainEntity': toolData.faqs.map(faq => ({
      '@type': 'Question',
      'name': faq.question,
      'acceptedAnswer': {
        '@type': 'Answer',
        'text': faq.answer
      }
    }))
  };

  return {
    softwareAppSchema,
    breadcrumbSchema,
    faqSchema
  };
}
