const fs = require('fs');
const path = require('path');

const categories = [
  { slug: 'encoding-decoding', name: 'Encoding & Decoding', count: 23 },
  { slug: 'encryption-ciphers', name: 'Encryption & Ciphers', count: 24 },
  { slug: 'hashing-security', name: 'Hashing & Security', count: 21 },
  { slug: 'generators-tokens', name: 'Generators & Tokens', count: 21 },
  { slug: 'dev-tools-formatters', name: 'Dev Tools & Formatters', count: 16 },
  { slug: 'file-data-converters', name: 'File & Data Converters', count: 16 },
  { slug: 'validators-checkers', name: 'Validators & Checkers', count: 14 },
  { slug: 'text-utilities', name: 'Text Utilities', count: 15 },
  { slug: 'escape-network', name: 'Escape & Network', count: 15 },
  { slug: 'seo-webmaster', name: 'SEO & Webmaster', count: 15 },
  { slug: 'security-certificates', name: 'Security & Certificates', count: 15 },
  { slug: 'math-design', name: 'Math & Design', count: 19 },
];

// Specific definitions for all 210 tools
const rawTools = [
  // 1. Encoding & Decoding (23)
  { id: "base64-encode-decode", name: "Base64 Encode/Decode", cat: 0, desc: "Encode or decode strings and binary files to Base64 format instantly.", inType: "textarea", file: true, pop: true },
  { id: "url-encode-decode", name: "URL Encode/Decode", cat: 0, desc: "Percent-encode or decode URL query strings and URI components safely.", inType: "textarea", file: false, pop: true },
  { id: "html-encode-decode", name: "HTML Entities Encode/Decode", cat: 0, desc: "Convert special characters to HTML entities and back to prevent XSS.", inType: "textarea", file: false, pop: true },
  { id: "base32-encode-decode", name: "Base32 Encode/Decode", cat: 0, desc: "Encode and decode RFC 4648 Base32 strings and authenticator keys.", inType: "textarea", file: true, pop: false },
  { id: "base16-hex-encode-decode", name: "Base16 Hex Encode/Decode", cat: 0, desc: "Convert ASCII/UTF-8 text into hexadecimal byte values and reverse.", inType: "textarea", file: true, pop: true },
  { id: "base58-encode-decode", name: "Base58 Encode/Decode", cat: 0, desc: "Bitcoin and IPFS standard Base58 string encoder and decoder tool.", inType: "textarea", file: true, pop: true },
  { id: "base85-ascii85-encode", name: "Base85 (Ascii85) Encode/Decode", cat: 0, desc: "Adobe PostScript and Git binary diff standard Base85 converter.", inType: "textarea", file: true, pop: false },
  { id: "url-safe-base64", name: "URL-Safe Base64 Encode/Decode", cat: 0, desc: "Base64 encoding replacing + and / with - and _ without padding.", inType: "textarea", file: true, pop: true },
  { id: "utf8-encode-decode", name: "UTF-8 Bytes Encoder/Decoder", cat: 0, desc: "Inspect UTF-8 byte representation, code units, and Unicode points.", inType: "textarea", file: false, pop: false },
  { id: "binary-translator", name: "Binary to Text Translator", cat: 0, desc: "Convert 8-bit binary 0s and 1s to human-readable text and ASCII.", inType: "textarea", file: false, pop: true },
  { id: "morse-code-translator", name: "Morse Code Translator", cat: 0, desc: "Convert international Morse code dots and dashes to text audio-ready.", inType: "textarea", file: false, pop: false },
  { id: "punycode-converter", name: "Punycode IDN Converter", cat: 0, desc: "Convert international domain names with Unicode characters to Punycode.", inType: "text", file: false, pop: false },
  { id: "uuencode-uudecode", name: "UUEncode / UUDecode", cat: 0, desc: "Legacy Unix-to-Unix historical encoding format encoder and decoder.", inType: "textarea", file: true, pop: false },
  { id: "quoted-printable", name: "Quoted-Printable Encode/Decode", cat: 0, desc: "MIME email format quoted-printable transfer encoding decoder.", inType: "textarea", file: false, pop: false },
  { id: "base64-to-image", name: "Base64 to Image Data URI", cat: 0, desc: "Convert raw Base64 data strings into visual images and preview inline.", inType: "textarea", file: true, pop: true },
  { id: "image-to-base64", name: "Image to Base64 Converter", cat: 0, desc: "Generate data:image/png;base64 URI strings from any uploaded file.", inType: "file", file: true, pop: true },
  { id: "base91-encode-decode", name: "Base91 Encode/Decode", cat: 0, desc: "High-density binary-to-ASCII Base91 byte packer algorithm.", inType: "textarea", file: true, pop: false },
  { id: "percent-encoding-decoder", name: "Percent Encoding Decoder", cat: 0, desc: "Strict RFC 3986 percent-encoding and component parsing tool.", inType: "textarea", file: false, pop: false },
  { id: "hex-to-binary", name: "Hex to Binary Converter", cat: 0, desc: "Translate hex digits directly to raw 4-bit nibble binary streams.", inType: "textarea", file: false, pop: false },
  { id: "binary-to-hex", name: "Binary to Hex Converter", cat: 0, desc: "Group binary 8-bit bytes into clean hexadecimal string values.", inType: "textarea", file: false, pop: false },
  { id: "octal-to-text", name: "Octal to Text String", cat: 0, desc: "Convert 3-digit octal byte representations back into plain ASCII.", inType: "textarea", file: false, pop: false },
  { id: "decimal-to-binary-hex", name: "Decimal to Binary & Hex", cat: 0, desc: "Convert arbitrary base 10 integers into binary, octal, and hex.", inType: "number", file: false, pop: false },
  { id: "rot47-cipher", name: "ROT47 Cipher & Encoder", cat: 0, desc: "Rotate all 94 printable ASCII characters by 47 positions.", inType: "textarea", file: false, pop: false },

  // 2. Encryption & Ciphers (24)
  { id: "aes-encrypt-decrypt", name: "AES 256 Encrypt & Decrypt", cat: 1, desc: "Military-grade AES-GCM and AES-CBC symmetric encryption in browser.", inType: "dual", file: true, pop: true },
  { id: "rsa-encrypt-decrypt", name: "RSA Keypair & Encryption", cat: 1, desc: "Generate 2048/4096-bit RSA keys and encrypt messages with public key.", inType: "dual", file: true, pop: true },
  { id: "chacha20-poly1305", name: "ChaCha20-Poly1305 Cipher", cat: 1, desc: "High-speed authenticated stream cipher encryption per RFC 8439.", inType: "dual", file: true, pop: false },
  { id: "triple-des-3des", name: "Triple DES (3DES) Cipher", cat: 1, desc: "Legacy Triple Data Encryption Standard cipher encoder and tester.", inType: "dual", file: false, pop: false },
  { id: "blowfish-encrypt", name: "Blowfish Cipher Tool", cat: 1, desc: "Bruce Schneier symmetric 64-bit block cipher encryptor.", inType: "dual", file: false, pop: false },
  { id: "twofish-cipher", name: "Twofish 256-bit Cipher", cat: 1, desc: "AES finalist Twofish symmetric encryption implementation.", inType: "dual", file: false, pop: false },
  { id: "rc4-stream-cipher", name: "RC4 Stream Cipher", cat: 1, desc: "Rivest Cipher 4 variable key-size stream cipher generator.", inType: "dual", file: false, pop: false },
  { id: "caesar-cipher-decoder", name: "Caesar Cipher Decoder", cat: 1, desc: "Classic Roman shift cipher solver with automatic shift brute-force.", inType: "textarea", file: false, pop: true },
  { id: "vigenere-cipher-solver", name: "Vigenère Cipher Solver", cat: 1, desc: "Polyalphabetic substitution cipher encryption and cryptanalysis tool.", inType: "dual", file: false, pop: true },
  { id: "rot13-cipher", name: "ROT13 Cipher", cat: 1, desc: "Standard 13-character Caesar alphabet rotation cipher for spoilers.", inType: "textarea", file: false, pop: true },
  { id: "atbash-cipher", name: "Atbash Hebrew Cipher", cat: 1, desc: "Hebrew alphabet reversal substitution cipher encoder and decoder.", inType: "textarea", file: false, pop: false },
  { id: "affine-cipher", name: "Affine Mathematical Cipher", cat: 1, desc: "Monoalphabetic substitution using linear congruence (ax + b) mod 26.", inType: "dual", file: false, pop: false },
  { id: "rail-fence-cipher", name: "Rail Fence Cipher", cat: 1, desc: "Zig-zag transposition cipher encryptor with variable rails.", inType: "dual", file: false, pop: false },
  { id: "playfair-cipher", name: "Playfair Digraph Cipher", cat: 1, desc: "Historic 5x5 key matrix polygraphic substitution cipher.", inType: "dual", file: false, pop: false },
  { id: "substitution-cipher", name: "Simple Substitution Cipher", cat: 1, desc: "Custom alphabet mapping substitution cipher generator and solver.", inType: "dual", file: false, pop: false },
  { id: "polybius-square", name: "Polybius Square Cipher", cat: 1, desc: "Fractionating grid cipher converting letters to 2-digit coordinates.", inType: "dual", file: false, pop: false },
  { id: "baconian-cipher", name: "Baconian Steganography Cipher", cat: 1, desc: "Sir Francis Bacon 5-character binary steganography encoder.", inType: "textarea", file: false, pop: false },
  { id: "xor-cipher", name: "XOR Stream Cipher", cat: 1, desc: "Bitwise XOR binary key encryption and stream masking utility.", inType: "dual", file: false, pop: true },
  { id: "hill-cipher", name: "Hill Matrix Cipher 2x2 / 3x3", cat: 1, desc: "Lester Hill linear algebra matrix modular arithmetic cipher.", inType: "dual", file: false, pop: false },
  { id: "enigma-machine-simulator", name: "Enigma Machine Simulator", cat: 1, desc: "WWII Wehrmacht M3/M4 Enigma cryptographic rotor machine emulator.", inType: "dual", file: false, pop: true },
  { id: "bifid-cipher", name: "Bifid Delastelle Cipher", cat: 1, desc: "Fractionation plus transposition polygraphic cipher.", inType: "dual", file: false, pop: false },
  { id: "beaufort-cipher", name: "Beaufort Reciprocal Cipher", cat: 1, desc: "Variant of Vigenère cipher where ciphertext = key - plaintext.", inType: "dual", file: false, pop: false },
  { id: "one-time-pad", name: "One-Time Pad (OTP) Tool", cat: 1, desc: "Information-theoretically secure unbreakable Vernam cipher.", inType: "dual", file: false, pop: false },
  { id: "columnar-transposition", name: "Columnar Transposition Cipher", cat: 1, desc: "Rearrange message characters into tabular key columns.", inType: "dual", file: false, pop: false },

  // 3. Hashing & Security (21)
  { id: "sha256-hash-generator", name: "SHA-256 Hash Generator", cat: 2, desc: "Cryptographic 256-bit hash generator using native Web Crypto API.", inType: "textarea", file: true, pop: true },
  { id: "sha512-hash-generator", name: "SHA-512 Hash Generator", cat: 2, desc: "Generate 512-bit SHA-2 secure cryptographic hashes for files and text.", inType: "textarea", file: true, pop: true },
  { id: "md5-hash-generator", name: "MD5 Hash Generator", cat: 2, desc: "Calculate 128-bit MD5 checksum digests for verification.", inType: "textarea", file: true, pop: true },
  { id: "sha1-hash-generator", name: "SHA-1 Hash Generator", cat: 2, desc: "Generate 160-bit SHA-1 hash values for legacy and Git commit checks.", inType: "textarea", file: true, pop: false },
  { id: "sha3-keccak-generator", name: "SHA-3 (Keccak) Hasher", cat: 2, desc: "FIPS 202 SHA-3 and Ethereum Keccak-256 cryptographic sponge hash.", inType: "textarea", file: true, pop: true },
  { id: "sha384-hash-generator", name: "SHA-384 Hash Generator", cat: 2, desc: "NIST FIPS 180-4 384-bit truncated SHA-2 hash calculator.", inType: "textarea", file: true, pop: false },
  { id: "hmac-generator", name: "HMAC Generator (SHA-256/512)", cat: 2, desc: "Hash-based Message Authentication Code keyed digest generator.", inType: "dual", file: true, pop: true },
  { id: "blake2b-blake2s", name: "BLAKE2b / BLAKE2s Hasher", cat: 2, desc: "High performance cryptographic hash faster than MD5 on modern CPUs.", inType: "textarea", file: true, pop: false },
  { id: "blake3-hasher", name: "BLAKE3 Tree Hasher", cat: 2, desc: "Tree-hashing BLAKE3 algorithm generator for ultra-fast throughput.", inType: "textarea", file: true, pop: false },
  { id: "ripemd160-hasher", name: "RIPEMD-160 Hash Tool", cat: 2, desc: "Bitcoin address generation standard 160-bit cryptographic hash.", inType: "textarea", file: false, pop: false },
  { id: "crc32-checksum", name: "CRC32 Checksum Calculator", cat: 2, desc: "Cyclic Redundancy Check 32-bit polynomial error detection.", inType: "textarea", file: true, pop: true },
  { id: "crc16-calculator", name: "CRC16 Checksum Calculator", cat: 2, desc: "Modbus, CCITT, and USB standard 16-bit CRC checksum generator.", inType: "textarea", file: true, pop: false },
  { id: "whirlpool-hash", name: "Whirlpool 512-bit Hasher", cat: 2, desc: "ISO/IEC 10118-3 NESSIE recommended 512-bit block cipher hash.", inType: "textarea", file: false, pop: false },
  { id: "argon2-hasher", name: "Argon2 Password Hash Simulator", cat: 2, desc: "Password Hashing Competition winner Argon2i/Argon2d/Argon2id.", inType: "dual", file: false, pop: true },
  { id: "bcrypt-generator", name: "bcrypt Hash Generator & Check", cat: 2, desc: "Blowfish-derived adaptive salted password hashing algorithm.", inType: "dual", file: false, pop: true },
  { id: "pbkdf2-key-derivation", name: "PBKDF2 Key Derivation Tool", cat: 2, desc: "RFC 2898 Password-Based Key Derivation Function with iterations.", inType: "dual", file: false, pop: true },
  { id: "scrypt-hash-simulator", name: "scrypt Key Derivation", cat: 2, desc: "Memory-hard cryptographic hash designed to thwart custom ASIC attacks.", inType: "dual", file: false, pop: false },
  { id: "adler32-checksum", name: "Adler-32 Checksum", cat: 2, desc: "Mark Adler zlib compression checksum algorithm calculator.", inType: "textarea", file: true, pop: false },
  { id: "murmurhash3-calculator", name: "MurmurHash3 Calculator", cat: 2, desc: "Fast non-cryptographic hash function for hash table lookups.", inType: "textarea", file: false, pop: false },
  { id: "fnv1a-hash", name: "FNV-1a Hash Generator", cat: 2, desc: "Fowler-Noll-Vo 32-bit and 64-bit non-cryptographic hash.", inType: "textarea", file: false, pop: false },
  { id: "ntlm-hash-generator", name: "NTLM Hash Generator", cat: 2, desc: "Windows NT LAN Manager MD4 Unicode authentication password hash.", inType: "textarea", file: false, pop: false },

  // 4. Generators & Tokens (21)
  { id: "secure-password-generator", name: "Secure Password Generator", cat: 3, desc: "Generate cryptographically secure random passwords with entropy metrics.", inType: "number", file: false, pop: true },
  { id: "uuid-guid-generator", name: "UUID / GUID v4 & v7 Generator", cat: 3, desc: "Generate random RFC 4122 v4 and timestamped v7 UUID tokens.", inType: "number", file: false, pop: true },
  { id: "nanoid-generator", name: "NanoID Token Generator", cat: 3, desc: "Compact, URL-friendly unique string identifier generator for JS.", inType: "number", file: false, pop: true },
  { id: "jwt-token-generator", name: "JWT Token Generator & Debugger", cat: 3, desc: "Create, sign, decode, and verify JSON Web Tokens in browser.", inType: "dual", file: false, pop: true },
  { id: "api-key-generator", name: "API Key & Bearer Generator", cat: 3, desc: "Generate hex, base64, or prefixed API keys (sk_live_...) instantly.", inType: "number", file: false, pop: true },
  { id: "crypto-random-string", name: "Cryptographic Random String", cat: 3, desc: "CSPRNG powered random alphanumeric strings using crypto.getRandomValues.", inType: "number", file: false, pop: false },
  { id: "totp-token-generator", name: "TOTP 2FA Authenticator Code", cat: 3, desc: "Simulate Google Authenticator 6-digit TOTP codes from secret keys.", inType: "text", file: false, pop: true },
  { id: "hotp-token-generator", name: "HOTP Counter Token Generator", cat: 3, desc: "RFC 4226 HMAC-based one-time password generator with counter.", inType: "dual", file: false, pop: false },
  { id: "diceware-passphrase", name: "DiceWare Passphrase Generator", cat: 3, desc: "Generate memorable high-entropy multi-word passphrases per EFF lists.", inType: "number", file: false, pop: true },
  { id: "ulid-generator", name: "ULID Generator", cat: 3, desc: "Universally Unique Lexicographically Sortable Identifier creator.", inType: "number", file: false, pop: false },
  { id: "cuid2-generator", name: "CUID2 Identifier Generator", cat: 3, desc: "Collision-resistant unique IDs optimized for horizontal scale.", inType: "number", file: false, pop: false },
  { id: "random-hex-bytes", name: "Random Hex Byte Generator", cat: 3, desc: "Generate raw random hex strings of any byte length for crypto seeds.", inType: "number", file: false, pop: false },
  { id: "csrf-token-generator", name: "CSRF Token Generator", cat: 3, desc: "Generate secure cryptographic tokens for cross-site request forgery defense.", inType: "number", file: false, pop: false },
  { id: "pin-code-generator", name: "Strong PIN Code Generator", cat: 3, desc: "Generate 4 to 12 digit cryptographically random PIN codes.", inType: "number", file: false, pop: false },
  { id: "mac-address-generator", name: "MAC Address Generator", cat: 3, desc: "Generate unicast or multicast random IEEE 802 MAC hardware addresses.", inType: "number", file: false, pop: false },
  { id: "encryption-key-generator", name: "AES Encryption Key Generator", cat: 3, desc: "Generate random 128-bit, 192-bit, and 256-bit symmetric encryption keys.", inType: "number", file: false, pop: true },
  { id: "salt-nonce-generator", name: "Salt & Nonce Generator", cat: 3, desc: "Generate random cryptographic salt and initialization nonce buffers.", inType: "number", file: false, pop: false },
  { id: "luhn-test-card-generator", name: "Luhn Test Card Generator", cat: 3, desc: "Generate synthetic test payment card numbers valid under Luhn checks.", inType: "number", file: false, pop: false },
  { id: "bip39-seed-generator", name: "BIP-39 Mnemonic Seed Generator", cat: 3, desc: "Generate 12 and 24-word cryptographic mnemonic passphrases.", inType: "number", file: false, pop: true },
  { id: "random-iv-generator", name: "Random IV (Vector) Generator", cat: 3, desc: "Generate 96-bit and 128-bit Initialization Vectors for AES-GCM.", inType: "number", file: false, pop: false },
  { id: "snowflake-id-generator", name: "Snowflake ID Generator", cat: 3, desc: "Generate Twitter Snowflake-compatible 64-bit distributed IDs.", inType: "number", file: false, pop: false },

  // 5. Dev Tools & Formatters (16)
  { id: "json-formatter", name: "JSON Formatter & Validator", cat: 4, desc: "Beautify, indent, minify, and validate JSON data structures.", inType: "textarea", file: true, pop: true },
  { id: "xml-formatter", name: "XML Formatter & Beautifier", cat: 4, desc: "Format messy XML markup with custom indentation and tag validation.", inType: "textarea", file: true, pop: false },
  { id: "yaml-to-json", name: "YAML to JSON Converter", cat: 4, desc: "Convert YAML configuration files to valid structured JSON format.", inType: "textarea", file: true, pop: true },
  { id: "json-to-yaml", name: "JSON to YAML Converter", cat: 4, desc: "Convert JSON documents to clean, readable YAML syntax.", inType: "textarea", file: true, pop: true },
  { id: "sql-formatter", name: "SQL Query Formatter", cat: 4, desc: "Beautify SQL queries with standardized keywords, joins, and indentation.", inType: "textarea", file: false, pop: true },
  { id: "html-minifier", name: "HTML Minifier & Formatter", cat: 4, desc: "Strip whitespace, comments, and compress HTML payloads for production.", inType: "textarea", file: true, pop: false },
  { id: "css-minifier", name: "CSS Minifier & Formatter", cat: 4, desc: "Minify stylesheet rules or beautify nested CSS with clean tabs.", inType: "textarea", file: true, pop: false },
  { id: "js-deobfuscator", name: "JS Deobfuscator & Beautifier", cat: 4, desc: "Unpack and pretty-print minified JavaScript code cleanly.", inType: "textarea", file: true, pop: false },
  { id: "regex-tester", name: "RegEx Tester & Debugger", cat: 4, desc: "Test regular expressions in real-time with full match groups.", inType: "dual", file: false, pop: true },
  { id: "cron-expression-parser", name: "Cron Expression Parser", cat: 4, desc: "Explain cron syntax in English and compute the next 10 execution dates.", inType: "text", file: false, pop: true },
  { id: "timestamp-epoch-converter", name: "Unix Timestamp Converter", cat: 4, desc: "Convert epoch seconds and milliseconds to human ISO-8601 dates.", inType: "text", file: false, pop: true },
  { id: "diff-checker", name: "Diff Checker & Text Compare", cat: 4, desc: "Side-by-side text difference comparison highlighting changes.", inType: "dual", file: false, pop: true },
  { id: "markdown-to-html", name: "Markdown to HTML Converter", cat: 4, desc: "Convert CommonMark Markdown to clean HTML with live preview.", inType: "textarea", file: true, pop: true },
  { id: "graphql-query-beautifier", name: "GraphQL Query Beautifier", cat: 4, desc: "Format GraphQL queries, mutations, and fragments with correct nesting.", inType: "textarea", file: false, pop: false },
  { id: "typescript-transpiler-preview", name: "TypeScript Preview Tool", cat: 4, desc: "Strip TypeScript type annotations to view pure JavaScript output.", inType: "textarea", file: false, pop: false },
  { id: "json-schema-validator", name: "JSON Schema Validator", cat: 4, desc: "Validate JSON documents against draft-07 and draft-2020-12 schemas.", inType: "dual", file: false, pop: false },

  // 6. File & Data Converters (16)
  { id: "csv-to-json", name: "CSV to JSON Converter", cat: 5, desc: "Convert comma and tab-separated values into JSON arrays and objects.", inType: "textarea", file: true, pop: true },
  { id: "json-to-csv", name: "JSON to CSV Converter", cat: 5, desc: "Flatten structured JSON array documents into downloadable CSV tables.", inType: "textarea", file: true, pop: true },
  { id: "xml-to-json", name: "XML to JSON Converter", cat: 5, desc: "Convert XML element hierarchies to modern JSON representations.", inType: "textarea", file: true, pop: false },
  { id: "json-to-xml", name: "JSON to XML Converter", cat: 5, desc: "Serialize JSON objects into standard well-formed XML strings.", inType: "textarea", file: true, pop: false },
  { id: "base64-to-pdf", name: "Base64 to PDF Converter", cat: 5, desc: "Decode Base64 strings to downloadable PDF files with preview.", inType: "textarea", file: true, pop: true },
  { id: "pdf-to-base64", name: "PDF to Base64 Converter", cat: 5, desc: "Encode local PDF documents into raw Base64 data strings.", inType: "file", file: true, pop: true },
  { id: "image-to-webp", name: "Image to WebP Converter", cat: 5, desc: "Compress PNG and JPEG files to WebP format inside your browser.", inType: "file", file: true, pop: true },
  { id: "svg-to-png", name: "SVG to PNG Converter", cat: 5, desc: "Render vector SVG markup into raster PNG images with custom scaling.", inType: "textarea", file: true, pop: true },
  { id: "text-to-hex-dump", name: "Text to Hex Dump Viewer", cat: 5, desc: "Display classical 16-byte hex dump offset views with ASCII sidebar.", inType: "textarea", file: true, pop: false },
  { id: "hex-dump-to-binary", name: "Hex Dump to Binary File", cat: 5, desc: "Reconstruct binary files from hex dump strings and download.", inType: "textarea", file: true, pop: false },
  { id: "excel-tsv-to-markdown", name: "TSV to Markdown Table", cat: 5, desc: "Convert copied spreadsheet rows into GitHub Markdown tables.", inType: "textarea", file: false, pop: false },
  { id: "json-to-typescript", name: "JSON to TypeScript Interface", cat: 5, desc: "Auto-generate TypeScript type interfaces from sample JSON data.", inType: "textarea", file: false, pop: true },
  { id: "curl-to-fetch", name: "cURL to Fetch & Axios Converter", cat: 5, desc: "Convert raw cURL command lines into modern JavaScript Fetch code.", inType: "textarea", file: false, pop: true },
  { id: "file-checksum-verifier", name: "File Checksum Verifier", cat: 5, desc: "Compute SHA-256 and MD5 hashes of local files with zero upload.", inType: "file", file: true, pop: true },
  { id: "gzip-deflate-decompressor", name: "Gzip Decompressor", cat: 5, desc: "Decompress Gzip, Deflate, and zlib binary files in browser.", inType: "file", file: true, pop: false },
  { id: "brotli-decompressor", name: "Brotli Stream Decompressor", cat: 5, desc: "Decompress Brotli compressed payload files client-side.", inType: "file", file: true, pop: false },

  // 7. Validators & Checkers (14)
  { id: "jwt-validator", name: "JWT Token Signature Validator", cat: 6, desc: "Check expiration, claims, and verify HMAC/RSA signatures of JWTs.", inType: "textarea", file: false, pop: true },
  { id: "ssl-cert-decoder", name: "SSL / TLS Certificate Decoder", cat: 6, desc: "Parse X.509 PEM certificates to inspect SAN, issuer, and expiry dates.", inType: "textarea", file: true, pop: true },
  { id: "credit-card-luhn-validator", name: "Credit Card Luhn Validator", cat: 6, desc: "Verify card checksums using Mod 10 Luhn formula algorithm.", inType: "text", file: false, pop: true },
  { id: "ip-address-validator", name: "IPv4 & IPv6 Address Validator", cat: 6, desc: "Validate IP address formats, private ranges, and subnet boundaries.", inType: "text", file: false, pop: false },
  { id: "email-syntax-checker", name: "Email Address Syntax Checker", cat: 6, desc: "Verify RFC 5322 email formatting, TLDs, and domain structures.", inType: "text", file: false, pop: false },
  { id: "domain-syntax-validator", name: "Domain Name Syntax Validator", cat: 6, desc: "Check FQDN domain validity against ICANN RFC specifications.", inType: "text", file: false, pop: false },
  { id: "password-strength-meter", name: "Password Strength Meter", cat: 6, desc: "Measure password entropy, crack times, and dictionary vulnerabilities.", inType: "text", file: false, pop: true },
  { id: "json-syntax-checker", name: "JSON Syntax Checker", cat: 6, desc: "Pinpoint exact line and column numbers of JSON syntax parse errors.", inType: "textarea", file: true, pop: false },
  { id: "url-query-parser", name: "URL & Query Parameter Parser", cat: 6, desc: "Deconstruct URLs into protocol, hostname, path, and param keys.", inType: "text", file: false, pop: false },
  { id: "iban-validator", name: "IBAN Bank Account Validator", cat: 6, desc: "Validate International Bank Account Numbers using MOD 97-10.", inType: "text", file: false, pop: false },
  { id: "uuid-format-validator", name: "UUID Format Validator", cat: 6, desc: "Check UUID version (v1-v7) and variant conformance.", inType: "text", file: false, pop: false },
  { id: "semver-validator", name: "SEMVER Version Validator", cat: 6, desc: "Verify Semantic Versioning 2.0.0 strings and version comparisons.", inType: "text", file: false, pop: false },
  { id: "isbn-validator", name: "ISBN-10 & ISBN-13 Validator", cat: 6, desc: "Calculate and verify book ISBN check digits.", inType: "text", file: false, pop: false },
  { id: "mime-type-lookup", name: "MIME Type Lookup & Checker", cat: 6, desc: "Search MIME types and corresponding canonical file extensions.", inType: "text", file: false, pop: false },

  // 8. Text Utilities (15)
  { id: "word-character-counter", name: "Word, Character & Byte Counter", cat: 7, desc: "Count characters, words, sentences, UTF-8 bytes, and reading time.", inType: "textarea", file: true, pop: true },
  { id: "case-converter", name: "Case Converter", cat: 7, desc: "Convert text to camelCase, snake_case, PascalCase, kebab-case, UPPER.", inType: "textarea", file: false, pop: true },
  { id: "slugify-generator", name: "Clean URL Slug Generator", cat: 7, desc: "Transform arbitrary headings and strings into SEO-friendly URL slugs.", inType: "text", file: false, pop: true },
  { id: "remove-duplicate-lines", name: "Remove Duplicate Lines Tool", cat: 7, desc: "Deduplicate text rows with optional case sensitivity and whitespace trim.", inType: "textarea", file: true, pop: false },
  { id: "sort-text-lines", name: "Sort Text Lines Tool", cat: 7, desc: "Sort lines alphabetically, naturally, by string length, or reverse.", inType: "textarea", file: true, pop: false },
  { id: "reverse-text-inverter", name: "Reverse Text & String Inverter", cat: 7, desc: "Invert character strings, words, or full multi-line paragraphs.", inType: "textarea", file: false, pop: false },
  { id: "strip-html-tags", name: "Strip HTML Tags from Text", cat: 7, desc: "Remove all HTML and XML element tags leaving clean plain text.", inType: "textarea", file: false, pop: false },
  { id: "add-line-numbers", name: "Add Line Numbers / Prefix", cat: 7, desc: "Prepend sequential numbers or custom prefix/suffix strings to lines.", inType: "textarea", file: false, pop: false },
  { id: "find-replace-regex", name: "Find & Replace with RegEx", cat: 7, desc: "Perform multi-pattern global regular expression text substitutions.", inType: "dual", file: false, pop: false },
  { id: "whitespace-cleaner", name: "Whitespace & Empty Line Cleaner", cat: 7, desc: "Remove redundant spaces, tabs, and excess blank lines from text.", inType: "textarea", file: false, pop: false },
  { id: "levenshtein-distance", name: "Levenshtein Distance Calculator", cat: 7, desc: "Calculate edit distance and string similarity percentage.", inType: "dual", file: false, pop: false },
  { id: "lorem-ipsum-generator", name: "Lorem Ipsum Text Generator", cat: 7, desc: "Generate placeholder Latin dummy text by words, sentences, or paras.", inType: "number", file: false, pop: false },
  { id: "text-to-ascii-art", name: "Text to ASCII Banner Generator", cat: 7, desc: "Convert words into stylish ASCII banner art fonts.", inType: "text", file: false, pop: false },
  { id: "bulk-case-transformer", name: "Bulk Case Transformer", cat: 7, desc: "Batch transform lines into title case, sentence case, and screaming case.", inType: "textarea", file: false, pop: false },
  { id: "zero-width-space-detector", name: "Zero-Width Character Cleaner", cat: 7, desc: "Detect and remove invisible zero-width spaces (ZWSP, ZWNJ, BOM).", inType: "textarea", file: false, pop: true },

  // 9. Escape & Network (15)
  { id: "js-string-escape", name: "JavaScript String Escape", cat: 8, desc: "Escape quotes, newlines, and control codes for JS string literals.", inType: "textarea", file: false, pop: true },
  { id: "sql-string-escape", name: "SQL String & Query Escaper", cat: 8, desc: "Escape single quotes and special characters for safe SQL queries.", inType: "textarea", file: false, pop: true },
  { id: "html-special-chars", name: "HTML Special Characters Escaper", cat: 8, desc: "Escape &, <, >, \", ' into safe HTML entities.", inType: "textarea", file: false, pop: false },
  { id: "json-string-escaper", name: "JSON String Escaper", cat: 8, desc: "Escape text for safe inclusion inside JSON string fields.", inType: "textarea", file: false, pop: false },
  { id: "regex-char-escaper", name: "RegEx Special Character Escaper", cat: 8, desc: "Escape regex metacharacters [ ] ( ) { } * + ? ^ $ \\ |.", inType: "textarea", file: false, pop: false },
  { id: "shell-argument-escaper", name: "Shell & Bash Argument Escaper", cat: 8, desc: "Quote and escape shell parameters to prevent command injection.", inType: "textarea", file: false, pop: false },
  { id: "xml-attribute-escaper", name: "XML Attribute Escaper", cat: 8, desc: "Escape XML attribute value delimiters and special entities.", inType: "textarea", file: false, pop: false },
  { id: "csv-field-escaper", name: "CSV Field Escaper", cat: 8, desc: "Wrap fields with quotes and escape internal delimiters per RFC 4180.", inType: "textarea", file: false, pop: false },
  { id: "url-path-query-escaper", name: "URL Path vs Query Escaper", cat: 8, desc: "Differentiate encodeURI vs encodeURIComponent escaping rules.", inType: "textarea", file: false, pop: false },
  { id: "markdown-syntax-escaper", name: "Markdown Syntax Escaper", cat: 8, desc: "Backslash-escape Markdown formatting markers.", inType: "textarea", file: false, pop: false },
  { id: "ldap-filter-escaper", name: "LDAP Filter Escaper", cat: 8, desc: "RFC 4515 LDAP search filter special character escaper.", inType: "textarea", file: false, pop: false },
  { id: "cpp-string-literal-escaper", name: "C / C++ String Literal Escaper", cat: 8, desc: "Format strings into escaped C/C++ char arrays with octal/hex codes.", inType: "textarea", file: false, pop: false },
  { id: "java-unicode-escaper", name: "Java Unicode Escaper", cat: 8, desc: "Convert non-ASCII characters to \\uXXXX Java escape sequences.", inType: "textarea", file: false, pop: false },
  { id: "python-raw-string-escaper", name: "Python Raw String Escaper", cat: 8, desc: "Format text for Python raw strings and unicode escapes.", inType: "textarea", file: false, pop: false },
  { id: "postman-header-escaper", name: "HTTP Header Value Escaper", cat: 8, desc: "Sanitize HTTP headers to prevent header injection vulnerabilities.", inType: "textarea", file: false, pop: false },

  // 10. SEO & Webmaster (15)
  { id: "robots-txt-generator", name: "Robots.txt Generator & Tester", cat: 9, desc: "Create and validate robots.txt crawl directives and sitemap URLs.", inType: "textarea", file: false, pop: true },
  { id: "xml-sitemap-validator", name: "XML Sitemap Syntax Validator", cat: 9, desc: "Validate sitemaps against Google sitemap.xsd specifications.", inType: "textarea", file: true, pop: true },
  { id: "open-graph-generator", name: "Open Graph Meta Tag Builder", cat: 9, desc: "Generate Facebook OG and Twitter card social share tags.", inType: "dual", file: false, pop: true },
  { id: "serp-preview-tool", name: "Google SERP Snippet Preview", cat: 9, desc: "Preview search engine title and description truncation on desktop & mobile.", inType: "dual", file: false, pop: true },
  { id: "hreflang-tag-builder", name: "Hreflang & Canonical Tag Builder", cat: 9, desc: "Generate multi-language ISO hreflang tags and self-referential canonicals.", inType: "dual", file: false, pop: false },
  { id: "schema-org-generator", name: "Schema.org JSON-LD Generator", cat: 9, desc: "Create Organization, FAQPage, Article, and Product structured data.", inType: "dual", file: false, pop: true },
  { id: "http-status-code-lookup", name: "HTTP Status Code Reference", cat: 9, desc: "Search HTTP status codes (200, 301, 404, 500) and caching behavior.", inType: "text", file: false, pop: false },
  { id: "htaccess-redirect-generator", name: ".htaccess 301 Redirect Builder", cat: 9, desc: "Generate Apache mod_rewrite rules for SSL, www, and clean paths.", inType: "dual", file: false, pop: false },
  { id: "keyword-density-analyzer", name: "Keyword Density Analyzer", cat: 9, desc: "Measure word frequency and 1-word/2-word/3-word phrase density.", inType: "textarea", file: false, pop: false },
  { id: "heading-structure-checker", name: "Heading Hierarchy Checker", cat: 9, desc: "Validate semantic H1 to H6 heading structure for SEO and accessibility.", inType: "textarea", file: false, pop: false },
  { id: "url-redirect-chain-mapper", name: "Redirect Chain Mapper", cat: 9, desc: "Analyze 301, 302, and 307 redirect hops to avoid SEO penalty.", inType: "text", file: false, pop: false },
  { id: "security-headers-tester", name: "Security Headers Evaluator", cat: 9, desc: "Check CSP, HSTS, X-Content-Type-Options, and Referrer-Policy headers.", inType: "textarea", file: false, pop: true },
  { id: "favicon-meta-generator", name: "Favicon HTML Tag Generator", cat: 9, desc: "Generate complete favicon and Apple touch icon link tags.", inType: "text", file: false, pop: false },
  { id: "readability-calculator", name: "Readability Score Calculator", cat: 9, desc: "Calculate Flesch-Kincaid grade level and reading ease scores.", inType: "textarea", file: false, pop: false },
  { id: "googlebot-simulator", name: "User-Agent Header Simulator", cat: 9, desc: "Simulate Googlebot and search crawler user-agent headers.", inType: "text", file: false, pop: false },

  // 11. Security & Certificates (15)
  { id: "csr-decoder", name: "CSR (Signing Request) Decoder", cat: 10, desc: "Inspect Certificate Signing Requests (CSR) for CN, SAN, and key specs.", inType: "textarea", file: true, pop: true },
  { id: "x509-cert-parser", name: "X.509 Certificate Parser", cat: 10, desc: "View detailed cryptographic attributes of PEM SSL certificates.", inType: "textarea", file: true, pop: true },
  { id: "pem-to-der-converter", name: "PEM to DER Certificate Converter", cat: 10, desc: "Convert ASCII PEM base64 certificates to binary DER format.", inType: "textarea", file: true, pop: false },
  { id: "der-to-pem-converter", name: "DER to PEM Certificate Converter", cat: 10, desc: "Convert binary DER certificates to readable ASCII PEM format.", inType: "file", file: true, pop: false },
  { id: "pkcs7-pkcs12-inspector", name: "PKCS#7 / PFX Certificate Viewer", cat: 10, desc: "Inspect certificate chains and bundle files client-side.", inType: "file", file: true, pop: false },
  { id: "ssh-fingerprint-calculator", name: "SSH Public Key Fingerprint", cat: 10, desc: "Calculate SHA-256 and MD5 fingerprints of OpenSSH public keys.", inType: "textarea", file: true, pop: true },
  { id: "openssh-to-pem-converter", name: "OpenSSH to PEM Key Converter", cat: 10, desc: "Convert modern OpenSSH keys to PKCS#8 or traditional PEM format.", inType: "textarea", file: true, pop: false },
  { id: "pgp-key-inspector", name: "PGP / GPG Key Fingerprint", cat: 10, desc: "Extract key ID, fingerprint, and user IDs from ASCII-armored PGP keys.", inType: "textarea", file: true, pop: false },
  { id: "sri-hash-generator", name: "SRI Subresource Integrity Hash", cat: 10, desc: "Generate sha384 and sha512 integrity hashes for CDN scripts.", inType: "dual", file: true, pop: true },
  { id: "csp-builder-analyzer", name: "CSP (Content Security Policy) Builder", cat: 10, desc: "Construct directive-based CSP headers with nonce and sha256 hashes.", inType: "dual", file: false, pop: true },
  { id: "hsts-header-evaluator", name: "HSTS Preload Header Evaluator", cat: 10, desc: "Verify max-age, includeSubDomains, and preload eligibility.", inType: "text", file: false, pop: false },
  { id: "dnssec-analyzer", name: "DNSSEC Record Analyzer", cat: 10, desc: "Inspect DS, DNSKEY, and RRSIG records for domain verification.", inType: "text", file: false, pop: false },
  { id: "dkim-spf-validator", name: "DKIM & SPF Record Validator", cat: 10, desc: "Verify email authentication DNS TXT record syntax.", inType: "text", file: false, pop: false },
  { id: "dmarc-policy-evaluator", name: "DMARC Policy Generator", cat: 10, desc: "Generate DMARC p=reject/quarantine policies and reporting addresses.", inType: "dual", file: false, pop: false },
  { id: "tls-cipher-inspector", name: "TLS Cipher Suite Inspector", cat: 10, desc: "Lookup cipher suite security status, forward secrecy, and key exchange.", inType: "text", file: false, pop: false },

  // 12. Math & Design (19)
  { id: "hex-to-rgb-hsl", name: "Color HEX to RGB & HSL Converter", cat: 11, desc: "Convert colors between HEX, RGB, HSL, HSV, and modern OKLCH.", inType: "text", file: false, pop: true },
  { id: "color-contrast-checker", name: "Color Contrast Checker (WCAG)", cat: 11, desc: "Calculate contrast ratios and test WCAG 2.1 AA / AAA compliance.", inType: "dual", file: false, pop: true },
  { id: "bitwise-calculator", name: "Bitwise Operations Calculator", cat: 11, desc: "Compute AND, OR, XOR, NOT, left and right bit shift operations.", inType: "dual", file: false, pop: true },
  { id: "prime-number-checker", name: "Prime Number Checker & Factors", cat: 11, desc: "Check primality and find prime factors for arbitrary integers.", inType: "number", file: false, pop: false },
  { id: "modulo-arithmetic", name: "Modulo & Modular Calculator", cat: 11, desc: "Compute modular arithmetic, modular inverses, and powers.", inType: "dual", file: false, pop: false },
  { id: "gcd-lcm-calculator", name: "GCD & LCM Calculator", cat: 11, desc: "Calculate Greatest Common Divisor and Least Common Multiple.", inType: "dual", file: false, pop: false },
  { id: "aspect-ratio-calculator", name: "Aspect Ratio & Screen Calculator", cat: 11, desc: "Calculate 16:9, 4:3, 21:9 image dimensions and scaling.", inType: "dual", file: false, pop: false },
  { id: "golden-ratio-generator", name: "Golden Ratio Dimension Generator", cat: 11, desc: "Compute phi (1.618) proportional layout scales for UI design.", inType: "number", file: false, pop: false },
  { id: "css-box-shadow-generator", name: "CSS Box Shadow Generator", cat: 11, desc: "Design multi-layer smooth elevation drop shadows with clean code.", inType: "dual", file: false, pop: false },
  { id: "px-to-rem-converter", name: "PX to REM & EM Calculator", cat: 11, desc: "Convert pixels to REM units based on configurable root font size.", inType: "number", file: false, pop: false },
  { id: "bigint-calculator", name: "BigInt Arbitrary Calculator", cat: 11, desc: "Perform arbitrary precision integer arithmetic without overflow.", inType: "dual", file: false, pop: false },
  { id: "matrix-multiplication", name: "Matrix Operations & Determinant", cat: 11, desc: "Multiply 2x2, 3x3 matrices and compute determinants.", inType: "dual", file: false, pop: false },
  { id: "crypto-random-number", name: "Random Number Generator (CSPRNG)", cat: 11, desc: "Generate uniformly distributed random numbers using Web Crypto.", inType: "dual", file: false, pop: false },
  { id: "boolean-truth-table", name: "Boolean Logic Truth Table", cat: 11, desc: "Generate truth tables for propositional logic formulas.", inType: "text", file: false, pop: false },
  { id: "degrees-to-radians", name: "Angle Degrees to Radians", cat: 11, desc: "Convert degrees, radians, and gradians with exact pi fractions.", inType: "number", file: false, pop: false },
  { id: "percentage-calculator", name: "Percentage Change Calculator", cat: 11, desc: "Calculate percentage increase, decrease, discount, and portions.", inType: "dual", file: false, pop: false },
  { id: "roman-numeral-converter", name: "Roman Numeral Converter", cat: 11, desc: "Convert Roman numerals to Arabic numbers (I - MMMCMXCIX) and back.", inType: "text", file: false, pop: false },
  { id: "base-conversion-calculator", name: "Base Converter (Base 2 to 36)", cat: 11, desc: "Convert numbers across arbitrary radix bases from binary to base 36.", inType: "dual", file: false, pop: true },
  { id: "standard-deviation-calc", name: "Standard Deviation & Variance", cat: 11, desc: "Calculate mean, median, variance, and standard deviation of dataset.", inType: "textarea", file: false, pop: false },

  // 13. Network & Online Tools (10)
  { id: "ip-subnet-cidr-calc", name: "IP Subnet CIDR Calculator", cat: 12, desc: "Calculate network range, broadcast, wildcard mask, and host count.", inType: "text", file: false, pop: true },
  { id: "dns-lookup-tool", name: "DNS Record Inspector", cat: 12, desc: "Inspect standard DNS records (A, AAAA, CNAME, MX, TXT) syntax.", inType: "text", file: false, pop: true },
  { id: "port-number-lookup", name: "Port Number & Protocol Lookup", cat: 12, desc: "Search IANA standard TCP/UDP port assignments and vulnerabilities.", inType: "text", file: false, pop: false },
  { id: "user-agent-parser", name: "User-Agent String Parser", cat: 12, desc: "Parse browser, OS, engine, and device architecture from client strings.", inType: "textarea", file: false, pop: true },
  { id: "webrtc-ip-leak-checker", name: "WebRTC Local IP Leak Checker", cat: 12, desc: "Test whether STUN/WebRTC exposes private local IP addresses.", inType: "text", file: false, pop: true },
  { id: "http-headers-inspector", name: "HTTP Request Header Inspector", cat: 12, desc: "Inspect and analyze incoming browser request headers client-side.", inType: "textarea", file: false, pop: false },
  { id: "mac-vendor-oui-lookup", name: "MAC Vendor OUI Lookup", cat: 12, desc: "Lookup hardware manufacturer from IEEE MAC Organizationally Unique ID.", inType: "text", file: false, pop: false },
  { id: "ping-diagnostic-simulator", name: "Ping & ICMP Diagnostic Tool", cat: 12, desc: "Simulate network round-trip latency and packet delay variance.", inType: "text", file: false, pop: false },
  { id: "traceroute-hop-visualizer", name: "Traceroute Route Visualizer", cat: 12, desc: "Parse and visualize traceroute terminal outputs into clean hops.", inType: "textarea", file: false, pop: false },
  { id: "whois-syntax-inspector", name: "WHOIS Domain Inspector", cat: 12, desc: "Analyze WHOIS record output fields, registrars, and status flags.", inType: "textarea", file: false, pop: false },

  // 14. Converters & Utilities (6)
  { id: "chmod-permissions-calculator", name: "Unix Chmod Calculator", cat: 13, desc: "Calculate octal (755, 644) and symbolic (rwxr-xr-x) Linux permissions.", inType: "text", file: false, pop: true },
  { id: "data-storage-units-converter", name: "Data Storage Units Converter", cat: 13, desc: "Convert bytes, KB, MB, GB, TB between binary (1024) and decimal (1000).", inType: "dual", file: false, pop: false },
  { id: "number-to-words-converter", name: "Number to Words Converter", cat: 13, desc: "Convert numerals to English words for checks, invoices, and contracts.", inType: "number", file: false, pop: false },
  { id: "utc-timezone-difference", name: "UTC Offset & Timezone Tool", cat: 13, desc: "Compare time offsets and calculate UTC conversions across zones.", inType: "dual", file: false, pop: false },
  { id: "ascii-table-reference", name: "ASCII Code Table Reference", cat: 13, desc: "Complete 7-bit ASCII reference chart with hex, octal, and HTML codes.", inType: "text", file: false, pop: true },
  { id: "qr-code-generator", name: "QR Code Generator (Client-Side)", cat: 13, desc: "Generate custom QR codes instantly with error correction and SVG download.", inType: "textarea", file: false, pop: true }
];

const fullCategories = [
  ...categories,
  { slug: 'network-online', name: 'Network & Online Tools', count: 10 },
  { slug: 'converters-utilities', name: 'Converters & Utilities', count: 6 }
];

// Shield and lock icons
const lockIcon = "M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z";
const shieldIcon = "M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z";

const tools = rawTools.map((t, index) => {
  const catObj = fullCategories[t.cat];
  const relatedCandidates = rawTools
    .filter((other, idx) => idx !== index && (other.cat === t.cat || other.pop))
    .slice(0, 6)
    .map(o => o.id);

  const primary = t.name.toLowerCase() + " online";
  return {
    id: t.id,
    name: t.name,
    slug: t.id,
    category: catObj.slug,
    categoryName: catObj.name,
    shortDesc: t.desc.slice(0, 90),
    metaTitle: `${t.name} Online - 100% Free & Private`,
    metaDescription: `${t.desc} 100% client-side Web Crypto tool. Zero server uploads. Fast, private and free.`,
    primaryKeyword: primary,
    secondaryKeywords: [
      `${t.name.toLowerCase()} tool`,
      `free ${t.name.toLowerCase()}`,
      `client-side ${t.name.toLowerCase()}`,
      `browser ${t.name.toLowerCase()}`
    ],
    lsiKeywords: [
      `${catObj.name.toLowerCase()} utility`,
      "web crypto api",
      "developer tools online",
      "privacy first encryption"
    ],
    inputType: t.inType,
    hasFileSupport: t.file,
    icon: (index % 2 === 0) ? shieldIcon : lockIcon,
    related: relatedCandidates,
    popular: !!t.pop
  };
});

console.log(`Generated ${tools.length} tools across ${fullCategories.length} categories.`);

fs.writeFileSync(path.join(__dirname, '../assets/data/tools.json'), JSON.stringify(tools, null, 2));
fs.writeFileSync(path.join(__dirname, '../public/assets/data/tools.json'), JSON.stringify(tools, null, 2));
console.log('Successfully written assets/data/tools.json and public/assets/data/tools.json');
