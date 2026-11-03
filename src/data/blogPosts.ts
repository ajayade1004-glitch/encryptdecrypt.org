export interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  readTime: string;
  publishedDate: string;
  updatedDate: string;
  author: string;
  authorRole: string;
  relatedToolSlug: string;
  content: string; // Markdown or rich HTML-friendly text
}

export const BLOG_POSTS: BlogPost[] = [
  {
    slug: 'what-is-aes-256-encryption',
    title: 'What is AES-256 Encryption? A Beginner’s Guide',
    excerpt: 'Learn how AES-256 symmetric encryption protects passwords, messages, and files. We break down the math simply with practical JavaScript WebCrypto code examples.',
    category: 'Symmetric Cryptography',
    readTime: '6 min read',
    publishedDate: '2026-08-12',
    updatedDate: '2026-11-01',
    author: 'Ajay Rathod',
    authorRole: 'Founder & Full-Stack Developer',
    relatedToolSlug: 'aes-encrypt-decrypt',
    content: `
## Introduction: Why AES-256 Matters Every Day

When you sign into your online bank, message a friend on WhatsApp, or save credentials in a password manager, there is a very high probability that **AES-256** is working in the background to keep that data confidential.

AES stands for **Advanced Encryption Standard**. The "256" refers to the length of the secret key in bits. In simple terms, a 256-bit key has $2^{256}$ possible combinations—a number so astronomically large that even if all the supercomputers on Earth worked together for billions of years, they could not guess it by brute force.

Governments, banks, and cybersecurity professionals worldwide rely on AES-256 as the global standard for symmetric encryption. In this guide, we will explain how it works in plain language without unnecessary academic jargon.

---

## What Does "Symmetric Encryption" Mean?

To understand AES, you only need to understand one concept: **symmetric keys**.

In a symmetric cipher, the **exact same key** is used to lock (encrypt) the data and unlock (decrypt) the data. Think of it like a physical padlock on a storage locker:
1. You put your secret documents in the locker.
2. You turn your physical key to lock the door.
3. Anyone without the key sees only a locked metal door.
4. When you return with your key, you turn it in reverse to retrieve your documents.

Because the same key is required on both sides, keeping that key private is the most important rule in symmetric encryption.

---

## How AES-256 Transforms Plaintext into Scrambled Data

AES is a **block cipher**. It does not encrypt letters one-by-one; instead, it cuts your data into fixed 128-bit blocks (16 bytes each). If your message is smaller than 16 bytes, padding is added. If your message is larger, it is split into multiple blocks.

For AES-256, each 16-byte block goes through **14 rounds** of mathematical scrambling:

1. **SubBytes (Substitution):** Each byte is swapped with another byte using a predefined lookup table known as an S-Box. This introduces confusion so patterns disappear.
2. **ShiftRows (Permutation):** The rows of the 4x4 data matrix are shifted cyclically to mix the byte positions.
3. **MixColumns (Diffusion):** The columns are mathematically blended so changes to one byte spread across the entire block.
4. **AddRoundKey (Secret Key Mixing):** A subkey derived from your 256-bit secret master key is combined with the data using an XOR operation.

After 14 consecutive rounds of this mathematical blender, the original text becomes completely indistinguishable from pure random noise.

---

## Understanding Cipher Modes: Why GCM is Superior to CBC

When you use AES, you must choose a "mode of operation". Two common modes you will encounter are **CBC** (Cipher Block Chaining) and **GCM** (Galois/Counter Mode).

- **AES-CBC:** This is an older mode. It encrypts data well, but it does **not** verify whether someone tampered with the ciphertext during transmission. If an attacker modifies even one byte of the encrypted message, CBC can be vulnerable to padding oracle attacks.
- **AES-GCM (Recommended):** GCM is an "authenticated encryption" mode (AEAD). Along with encrypting your data, it creates a 16-byte cryptographic tag. When decrypting, your browser checks this tag first. If anyone changed even a single bit of the encrypted file, decryption immediately fails, protecting you from tampering.

On **EncryptDecrypt.org**, our AES tool uses **AES-GCM** by default because it is safe, fast, and modern.

---

## Code Example: Encrypting Text with Web Crypto in the Browser

Because modern browsers have the built-in W3C Web Cryptography API, you can encrypt text in JavaScript without installing any external libraries or sending data to a server:

\`\`\`javascript
async function encryptWithAES(plaintext, passphrase) {
  const enc = new TextEncoder();
  
  // 1. Derive a 256-bit key from the user passphrase using PBKDF2
  const keyMaterial = await window.crypto.subtle.importKey(
    "raw", enc.encode(passphrase), "PBKDF2", false, ["deriveKey"]
  );
  
  const salt = window.crypto.getRandomValues(new Uint8Array(16));
  const key = await window.crypto.subtle.deriveKey(
    { name: "PBKDF2", salt, iterations: 100000, hash: "SHA-256" },
    keyMaterial,
    { name: "AES-GCM", length: 256 },
    false,
    ["encrypt"]
  );

  // 2. Generate a fresh 12-byte initialization vector (IV)
  const iv = window.crypto.getRandomValues(new Uint8Array(12));

  // 3. Encrypt the data
  const ciphertext = await window.crypto.subtle.encrypt(
    { name: "AES-GCM", iv },
    key,
    enc.encode(plaintext)
  );

  return { ciphertext, iv, salt };
}
\`\`\`

---

## Summary Checklist for Developers

- Always use **AES-256-GCM** instead of older modes like ECB or CBC whenever possible.
- Never reuse an Initialization Vector (IV) with the same key. Always generate a random 12-byte IV for every message.
- If deriving keys from user passwords, always use a slow, salted key derivation function like PBKDF2 or Argon2.
- Run encryption inside the user's browser or device whenever you can to avoid logging sensitive data on remote servers.
    `
  },
  {
    slug: 'base64-vs-encryption',
    title: 'Base64 vs Encryption: What is the Difference?',
    excerpt: 'Many beginners confuse Base64 encoding with encryption. Discover why Base64 provides zero security, how encoding differs from ciphers, and when to use each.',
    category: 'Data Encoding',
    readTime: '5 min read',
    publishedDate: '2026-08-18',
    updatedDate: '2026-11-01',
    author: 'Ajay Rathod',
    authorRole: 'Founder & Full-Stack Developer',
    relatedToolSlug: 'base64-encode-decode',
    content: `
## A Common Misunderstanding

One of the most frequent security mistakes made by new developers is assuming that converting a string to **Base64** makes it secure. You might see a database password or API token that looks like:

\`\`\`text
c3VwZXJfc2VjcmV0X3Bhc3N3b3JkXzEyMw==
\`\`\`

Because this string looks scrambled to human eyes, it is easy to assume it has been encrypted. But in reality, **Base64 provides zero confidentiality**. Anyone with a web browser or a command line can turn that back into plain text in less than one second.

Let us explore the core differences between **data encoding** and **cryptographic encryption**.

---

## What is Base64 Encoding?

Base64 is a **data encoding format**, not a cipher. Its purpose is **data transport compatibility**, not secrecy.

Computers work with binary data (zeros and ones). However, many communication protocols—such as email (SMTP), URLs, and JSON APIs—were originally designed to handle printable ASCII characters like letters, numbers, and basic punctuation.

If you try to transmit raw binary data (such as a JPEG image, an audio file, or an encrypted ciphertext) over an ASCII-only channel, control characters might get stripped or misinterpreted, corrupting your file.

**Base64 solves this problem by translating binary bytes into 64 safe ASCII characters:**
- Uppercase letters: \`A-Z\` (26)
- Lowercase letters: \`a-z\` (26)
- Digits: \`0-9\` (10)
- Two symbols: \`+\` and \`/\` (2)
- Padding character: \`=\`

Because the translation rules are public and standardized (RFC 4648), **no password or key is required to decode Base64**.

---

## What is Encryption?

Encryption, by contrast, is designed specifically for **confidentiality and privacy**.

When you encrypt a message using a cipher like AES-256 or RSA:
1. The plaintext is combined mathematically with a **secret cryptographic key**.
2. Without that secret key, it is mathematically impossible to reverse the process.
3. Even if an attacker knows the exact encryption algorithm used, they cannot read the message without the key.

This fundamental rule is known as **Kerckhoffs's Principle**: a cryptographic system should be secure even if everything about the system, except the key, is public knowledge.

---

## Quick Comparison: Encoding vs. Encryption vs. Hashing

| Feature | Base64 Encoding | Encryption (e.g. AES) | Hashing (e.g. SHA-256) |
| :--- | :--- | :--- | :--- |
| **Primary Goal** | Transport binary over text | Keep information private | Verify data integrity |
| **Requires a Key?** | No | Yes (Symmetric or Private) | No |
| **Reversible?** | Yes, by anyone instantly | Yes, but only with the secret key | No, mathematically one-way |
| **Example Use Case** | Inline images in HTML/CSS | Protecting bank transactions | Storing passwords securely |

---

## How to Test This Yourself

Open your browser's developer console (press \`F12\`) and type:

\`\`\`javascript
// Encoding to Base64
const encoded = btoa("MySecretToken2026");
console.log(encoded); // Output: TXlTZWNyZXRUb2tlbjIwMjY=

// Decoding back to Plaintext without any password
const decoded = atob("TXlTZWNyZXRUb2tlbjIwMjY=");
console.log(decoded); // Output: MySecretToken2026
\`\`\`

Notice that \`atob()\` required no password, no secret key, and no authorization. It simply translated the characters back.

---

## When Should You Use Base64?

Use Base64 when you need to:
- Embed a small logo or font directly into a CSS or HTML file using a data URL.
- Send an encrypted binary ciphertext over a JSON API payload.
- Attach a PDF or image inside an email message.

Never use Base64 when your goal is to protect passwords, personal user data, or sensitive financial information. For sensitive data, always use a genuine encryption tool like AES-256.
    `
  },
  {
    slug: 'how-jwt-tokens-work',
    title: 'How JWT Tokens Work and How to Decode Them Safely',
    excerpt: 'Demystifying JSON Web Tokens (JWT). Learn the difference between headers, claims, and signatures, and why client-side inspection is essential for API developers.',
    category: 'Web Security',
    readTime: '6 min read',
    publishedDate: '2026-08-25',
    updatedDate: '2026-11-01',
    author: 'Ajay Rathod',
    authorRole: 'Founder & Full-Stack Developer',
    relatedToolSlug: 'jwt-token-generator',
    content: `
## What is a JSON Web Token?

If you have built or used a web application in the past few years, you have almost certainly handled a **JSON Web Token (JWT)**. When you sign in to modern platforms, the server issues a compact token that your frontend attaches to every subsequent HTTP request.

A JWT is an open standard (RFC 7519) that defines a compact, self-contained way for securely transmitting information between parties as a JSON object.

Because tokens can be digitally signed using a secret (with HMAC) or a public/private key pair (with RSA or ECDSA), the receiver can verify that the claims inside the token have not been altered.

---

## Anatomy of a JWT: The Three Parts

A JWT looks like one long string of letters and numbers separated by two periods:

\`\`\`text
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkFqYXkiLCJyb2xlIjoiYWRtaW4ifQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c
\`\`\`

If you split this string at the dots (\`.\`), you discover **three distinct components**:

### 1. Header (Red)
The header contains metadata about the token, typically the signing algorithm used (\`alg\`) and the token type (\`typ\`):
\`\`\`json
{
  "alg": "HS256",
  "typ": "JWT"
}
\`\`\`

### 2. Payload or Claims (Green)
The payload contains the user claims and session data. Standard claims include:
- \`sub\` (Subject: usually the user ID)
- \`exp\` (Expiration time in Unix epoch seconds)
- \`iat\` (Issued at timestamp)
- Custom claims like \`role\`, \`email\`, or \`tenantId\`

\`\`\`json
{
  "sub": "user_8912",
  "name": "Ajay",
  "role": "admin",
  "exp": 1793740800
}
\`\`\`

### 3. Signature (Blue)
The signature is created by taking the Base64URL-encoded header, the Base64URL-encoded payload, and hashing them together with a secret key:

\`\`\`text
HMACSHA256(
  base64UrlEncode(header) + "." + base64UrlEncode(payload),
  your_secret_key
)
\`\`\`

---

## Important Security Warning: JWTs Are Not Encrypted by Default!

A critical detail that trips up many engineers: **Standard JWTs are signed, NOT encrypted.**

Notice that both the header and payload are simply **Base64URL-encoded JSON**. Anyone who intercepts a JWT can decode the payload and read the user ID, email, or role in plain text without knowing your secret key.

- **Signature** ensures integrity (detects if someone changed \`"role": "user"\` to \`"role": "admin"\`).
- **Signature does NOT ensure confidentiality** (anyone can read the payload contents).

**Rule:** Never put sensitive secrets like passwords, credit card numbers, or database connection strings inside a standard JWT payload.

---

## How to Safely Decode a JWT in Plain JavaScript

You can inspect the contents of any JWT token right in your browser console:

\`\`\`javascript
function parseJwtPayload(token) {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch (e) {
    return null;
  }
}

// Example usage
const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTYiLCJ1c2VyIjoiQWpheSIsImFkbWluIjp0cnVlfQ.sample_signature";
console.log(parseJwtPayload(token));
// Outputs: { sub: "123456", user: "Ajay", admin: true }
\`\`\`

---

## Why You Should Inspect JWTs in Client-Side Tools

When debugging authentication tokens in development, many developers copy tokens into online decoders. If you use a website that transmits your JWT to a remote server, that server's logs might capture active session tokens that give access to your production APIs.

On **EncryptDecrypt.org**, our JWT Debugger operates 100% inside your browser memory. Your tokens never leave your computer.
    `
  },
  {
    slug: 'what-is-sha-256-hashing',
    title: 'What is SHA-256 Hashing? Why You Can’t Decrypt It',
    excerpt: 'Understand how cryptographic hash functions work, what the avalanche effect is, and why it is mathematically impossible to decrypt a SHA-256 hash.',
    category: 'Hashing & Integrity',
    readTime: '6 min read',
    publishedDate: '2026-09-02',
    updatedDate: '2026-11-01',
    author: 'Ajay Rathod',
    authorRole: 'Founder & Full-Stack Developer',
    relatedToolSlug: 'sha256-hash-generator',
    content: `
## The Question: "How Do I Decrypt a SHA-256 Hash?"

Search engines receive thousands of queries every day asking: *"How do I decrypt a SHA-256 hash?"* or *"Online SHA-256 Decryptor"*.

The honest answer from every computer scientist and cryptographer is simple: **You cannot decrypt a SHA-256 hash because a hash is not encrypted in the first place.**

In this article, we explain what a hash function actually does, why it is a one-way street, and why this property is essential for internet security.

---

## What is a Cryptographic Hash Function?

A cryptographic hash function is a mathematical algorithm that takes an input of **any size** (from a single letter to a 50-gigabyte video file) and squashes it into a **fixed-size string** of characters.

In the case of **SHA-256** (Secure Hash Algorithm 256-bit):
- The output is always exactly **256 bits** (32 bytes).
- Written in hexadecimal format, it is always exactly **64 characters** long.

For example:
- Input: \`cat\`
- SHA-256 Output: \`77af778b51abd4a3c51c5ddd97204a9c3ae614ebccb75a606c3b6865aed6744e\`

- Input: The entire text of the Encyclopedia Britannica (millions of words)
- SHA-256 Output: Still exactly 64 hexadecimal characters.

---

## Why Is Hashing Mathematically Irreversible?

Think of hashing like making a smoothie:
- You take strawberries, milk, bananas, and honey.
- You drop them in a high-speed blender.
- You pour a smooth pink beverage into a glass.

Looking at that smoothie, you cannot mechanically extract the original whole strawberries or un-blend the milk back into its carton. Information was discarded during the blending process.

Similarly, when SHA-256 reduces a 5-gigabyte file into 32 bytes, trillions of bits of original information are permanently discarded. Because multiple different inputs can theoretically map to the same output (known as a collision), you cannot mathematically "reverse" the calculation.

---

## The Four Golden Properties of SHA-256

For a hash function to be considered cryptographically secure by NIST (FIPS 180-4), it must satisfy four key requirements:

1. **Deterministic:** The exact same input will always produce the exact same 64-character hash, whether computed today in Mumbai or ten years from now in Tokyo.
2. **Fast to Compute:** Modern CPUs can hash gigabytes of data per second with minimal battery usage.
3. **Pre-Image Resistant (One-Way):** Given a hash value $H$, it must be computationally impossible to find any input $m$ such that $\\text{hash}(m) = H$.
4. **The Avalanche Effect:** Changing a single character, punctuation mark, or bit in the input causes a dramatic, unpredictable change in more than 50% of the output bits.

### The Avalanche Effect in Action:
- \`hello\` $\\rightarrow$ \`2cf24dba5fb0a30e26e83b2ac5b9e29e1b161e5c1fa7425e73043362938b9824\`
- \`Hello\` $\\rightarrow$ \`185f8db32271fe25f561a6fc938b2e264306ec304eda518007d1764826381969\`

Just capitalizing the letter **H** changed the entire hash completely.

---

## What Do "Hash Decryption" Websites Actually Do?

If SHA-256 cannot be decrypted, why are there websites claiming to "decrypt" hashes?

Those sites are not decrypting anything. Instead, they maintain massive pre-computed databases called **rainbow tables** or lookup dictionaries containing hundreds of millions of common passwords (like \`password123\`, \`admin\`, \`qwerty\`). When you submit a hash, they look up whether they have already pre-hashed that exact word. If your input is a random passphrase or unique sentence, their lookup will fail completely.

---

## Real-World Applications of SHA-256

- **Software Integrity:** When you download Ubuntu, VS Code, or Python, the maintainer provides a SHA-256 checksum so you can verify your downloaded file was not corrupted or modified by hackers.
- **Git Version Control:** Git uses hashes to track commits, branches, and tree objects.
- **Bitcoin & Blockchain:** The Bitcoin proof-of-work consensus mechanism requires miners to repeatedly hash block headers using SHA-256.
- **Digital Signatures:** TLS/HTTPS certificates sign SHA-256 digests of public keys to verify website authenticity.
    `
  },
  {
    slug: 'rsa-vs-aes',
    title: 'RSA vs AES: Which Encryption Should You Use?',
    excerpt: 'Comparing symmetric AES against asymmetric RSA encryption. Discover how hybrid encryption combines the speed of AES with the secure key exchange of RSA.',
    category: 'Asymmetric Cryptography',
    readTime: '7 min read',
    publishedDate: '2026-09-10',
    updatedDate: '2026-11-01',
    author: 'Ajay Rathod',
    authorRole: 'Founder & Full-Stack Developer',
    relatedToolSlug: 'rsa-encrypt-decrypt',
    content: `
## The Fundamental Comparison

When designing a secure application, developers frequently ask: *"Should I use RSA or AES to encrypt my data?"*

The short answer is: **You usually do not choose between them—you use both together.**

AES and RSA are fundamentally different cryptographic systems designed to solve two distinct problems. In this guide, we break down their mechanics, performance differences, and explain how the modern internet pairs them in **hybrid encryption**.

---

## Symmetric vs. Asymmetric: The Key Distinction

### AES: Symmetric Encryption (One Shared Key)
- Uses the **same secret key** to encrypt and decrypt.
- Key sizes: 128, 192, or 256 bits.
- **Superpower:** Extremely fast. CPU hardware acceleration (AES-NI) allows encrypting gigabytes of data per second with virtually zero latency.
- **The Challenge:** How do you safely send that shared secret key to a user or server thousands of miles away without an eavesdropper intercepting it?

### RSA: Asymmetric Encryption (Two Paired Keys)
- Uses a **keypair**: a **Public Key** and a **Private Key**.
- Anyone can use your Public Key to encrypt a message for you.
- Only you, holding the matching Private Key, can decrypt that message.
- Key sizes: 2048, 3072, or 4096 bits.
- **Superpower:** Solves the key distribution problem. You can publish your public key openly on your website or social media.
- **The Limitation:** Mathematically heavy and slow. RSA is roughly 1,000 times slower than AES and cannot encrypt files larger than the key size itself.

---

## Direct Comparison Table

| Metric | AES-256 (Symmetric) | RSA-4096 (Asymmetric) |
| :--- | :--- | :--- |
| **Key Type** | 1 Shared Secret Key | 1 Public Key + 1 Private Key |
| **Standard Key Length** | 256 bits | 2048 to 4096 bits |
| **Computational Speed** | Extremely fast (hardware-accelerated) | Relatively slow (modular arithmetic) |
| **Max Payload Size** | Virtually unlimited (gigabytes/terabytes) | Limited by key size (typically < 450 bytes) |
| **Primary Use Case** | Encrypting databases, hard drives, files | Key exchange, digital signatures, certificates |

---

## The Solution: How Hybrid Cryptography Powers HTTPS / TLS

Because AES is fast but hard to share, and RSA is easy to share but slow, internet engineers created **Hybrid Encryption**:

1. **Step 1 (Generate Random Session Key):** Your web browser generates a fresh, random 256-bit AES key.
2. **Step 2 (Encrypt the Session Key with RSA):** The browser fetches the web server's public RSA certificate and encrypts *only* the 256-bit AES session key.
3. **Step 3 (Send over Network):** The browser sends this small encrypted package to the server. The server uses its private RSA key to unlock the AES session key.
4. **Step 4 (Stream Fast Bulk Data with AES):** Now that both the browser and server securely share the AES key, all subsequent web traffic (HTML, images, API calls) is encrypted with ultra-fast AES-GCM.

This hybrid approach gives you the best of both worlds: the effortless key exchange of asymmetric cryptography and the raw processing speed of symmetric ciphers.

---

## When to Use Which in Your Projects

- **Use AES-256:**
  - Encrypting data at rest (database columns, user files, device backups).
  - Encrypting user sessions or local storage state.
  - Streaming audio or video securely between clients.

- **Use RSA (or modern ECC like Ed25519):**
  - Creating digital signatures to prove you authored a file or release.
  - Performing initial authentication and key exchange between two untrusted parties.
  - SSH keypairs for server administration.

On **EncryptDecrypt.org**, you can experiment with both ciphers directly in your browser: test **AES-256-GCM** with a shared passphrase, or generate an **RSA-2048/4096** keypair to encrypt and decrypt messages locally.
    `
  }
];

export function getBlogPostBySlug(slug: string): BlogPost | undefined {
  return BLOG_POSTS.find(p => p.slug === slug);
}
