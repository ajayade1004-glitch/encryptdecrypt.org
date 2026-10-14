const fs = require('fs');
const path = require('path');

const toolsPath = path.join(__dirname, '../public/assets/data/tools.json');
const compactPath = path.join(__dirname, '../public/assets/data/tools-compact.json');
const initialToolsPath = path.join(__dirname, '../src/data/initialTools.ts');

const tools = JSON.parse(fs.readFileSync(toolsPath, 'utf8'));

const updates = {
  'aes-encrypt-decrypt': {
    name: 'AES 256 Encrypt & Decrypt',
    shortDesc: 'Encrypt and decrypt text, code, JSON, and files online with military-grade AES-256-GCM / CBC. 100% client-side Web Crypto with zero server logging.',
    metaTitle: 'Encrypt Decrypt Online – Free AES-256 Text & File Encryption Tool',
    metaDescription: 'Encrypt and decrypt text, code, JSON, and files online with military-grade AES-256. 100% private in-browser Web Crypto API. Zero server uploads.',
    primaryKeyword: 'encrypt decrypt online',
    secondaryKeywords: [
      'decrypt online',
      'encrypt online',
      'encrypt tool',
      'encrypt decrypt text online',
      'encryption and decryption online',
      'online decrypter',
      'online decryptor',
      'decrypt text online',
      'code encryptor',
      'decrypt code online',
      'encrypt code online',
      'javascript encrypt decrypt',
      'json encrypt',
      'link encryptor'
    ],
    lsiKeywords: [
      'aes gcm authenticated encryption',
      'pbkdf2 key derivation',
      'client side encryption zero server logs',
      'web crypto api symmetric cipher'
    ]
  },
  'sha256-hash-generator': {
    name: 'SHA-256 Hash Generator & Checksum Verifier',
    shortDesc: 'Calculate secure SHA-256 cryptographic digests, verify file checksums, and compute HMAC signatures. 100% private in-browser Web Crypto.',
    metaTitle: 'SHA-256 Hash Generator Online – 256-Bit Checksum & Digest Tool',
    metaDescription: 'Calculate secure SHA-256 cryptographic hashes online. Verify file integrity, compute HMAC digests, and understand one-way hash security. 100% client-side.',
    primaryKeyword: 'sha256 hash generator online',
    secondaryKeywords: [
      'encrypt decrypt sha256',
      'online unhash',
      'sha256 checksum verifier',
      'sha256 hash calculator',
      'generate sha256 hash in browser',
      'sha256 file checksum',
      'verify sha256 checksum online',
      'free sha256 hash generator',
      'sha256 online tool'
    ],
    lsiKeywords: [
      'nist fips 180-4 secure hash standard',
      'one way cryptographic digest',
      'sha256 collision resistance',
      'hmac sha256 webhook verification'
    ]
  },
  'md5-hash-generator': {
    name: 'MD5 Hash Generator & Checksum Tool',
    shortDesc: 'Generate 128-bit MD5 checksum digests for file integrity checks and legacy system verification. 100% client-side in browser RAM.',
    metaTitle: 'MD5 Hash Generator Online – 128-Bit Checksum Calculator',
    metaDescription: 'Generate 128-bit MD5 checksums online for file integrity checks and legacy verification. Learn why MD5 cannot be decrypted. Fast, free & 100% private in browser.',
    primaryKeyword: 'md5 hash generator online',
    secondaryKeywords: [
      'encrypt decrypt md5',
      'md5 checksum online',
      'online unhash md5',
      'md5 checksum calculator',
      'generate md5 hash in browser',
      'md5 file integrity checker',
      'free md5 hasher online'
    ],
    lsiKeywords: [
      'rfc 1321 md5 digest',
      'file deduplication checksum',
      'one way hash vs encryption',
      'browser client side md5'
    ]
  },
  'frequency-analysis-cryptanalysis-tool': {
    name: 'Cipher Identifier & Frequency Analysis Tool',
    shortDesc: 'Identify and detect unknown ciphers, encodings, and hashes. Analyze unigram letter distributions, Shannon entropy, and Index of Coincidence (IC).',
    metaTitle: 'Cipher Identifier & Frequency Analysis Tool – Online Cryptanalysis',
    metaDescription: 'Detect unknown ciphers and hashes online. Analyze letter frequencies, Index of Coincidence (IC), and entropy to identify Caesar, Vigenère, Substitution, Base64 & hashes.',
    primaryKeyword: 'cipher detect',
    secondaryKeywords: [
      'encryption identifier',
      'online cryptography tool',
      'cryptography online',
      'cryptography decode',
      'decode ciphertext online',
      'frequency analysis tool online',
      'cipher identifier online',
      'detect cipher online',
      'index of coincidence calculator',
      'classical cryptanalysis tool online'
    ],
    lsiKeywords: [
      'friedman index of coincidence',
      'unigram bigram frequency distribution',
      'classical cipher solver',
      'ctf cryptography challenge tools'
    ]
  }
};

let updatedCount = 0;
tools.forEach(t => {
  if (updates[t.slug]) {
    Object.assign(t, updates[t.slug]);
    updatedCount++;
    console.log(`✓ Updated metadata for: ${t.slug} -> "${t.metaTitle}"`);
  }
});

fs.writeFileSync(toolsPath, JSON.stringify(tools, null, 2), 'utf8');
console.log(`Successfully saved updated tools.json (${tools.length} tools).`);

// Also update tools-compact.json
if (fs.existsSync(compactPath)) {
  const compact = JSON.parse(fs.readFileSync(compactPath, 'utf8'));
  compact.forEach(t => {
    if (updates[t.slug]) {
      Object.assign(t, updates[t.slug]);
    }
  });
  fs.writeFileSync(compactPath, JSON.stringify(compact), 'utf8');
  console.log(`Successfully updated tools-compact.json.`);
}

console.log(`Priority cluster tool metadata sync complete: ${updatedCount} tools updated.`);
