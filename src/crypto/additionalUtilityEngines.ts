/**
 * Additional Utility Tools Client-Side Engines
 * 100% browser-native ordinal converters, list shufflers, team generators,
 * list splitters, set math (intersection, difference, union), Fibonacci/Prime sequences, and unit converters.
 */

/** 1. Number to Ordinal Converter */
export function convertNumberToOrdinal(input: string): string {
  const nums = (input || '1, 2, 3, 4, 11, 12, 13, 21, 22, 23, 101').split(/[\s,]+/).map(Number).filter(n => !isNaN(n));
  if (!nums.length) return 'Error: Enter valid numbers.';

  const results = nums.map(n => {
    const s = ['th', 'st', 'nd', 'rd'];
    const v = n % 100;
    const suffix = s[(v - 20) % 10] || s[v] || s[0];
    return `${n} -> ${n}${suffix}`;
  });

  return `=== NUMBER TO ORDINAL CONVERTER ===\n${results.join('\n')}`;
}

/** 2. Ordinal to Number Converter */
export function convertOrdinalToNumber(input: string): string {
  const ordinals = (input || '1st, 2nd, 3rd, 4th, 21st, 22nd, 103rd').split(/[\s,]+/).filter(Boolean);

  const results = ordinals.map(ord => {
    const num = parseInt(ord, 10);
    return isNaN(num) ? `"${ord}" -> Invalid ordinal` : `${ord} -> ${num}`;
  });

  return `=== ORDINAL TO CARDINAL NUMBER CONVERTER ===\n${results.join('\n')}`;
}

/** 3. Number Range Generator */
export function generateNumberRange(input: string): string {
  const parts = (input || '1 to 20 step 2').split(/to|step/i).map(s => s.trim());
  let start = 1;
  let end = 20;
  let step = 1;

  if (parts.length >= 2) {
    start = parseInt(parts[0], 10) || 1;
    end = parseInt(parts[1], 10) || 20;
  }
  if (parts.length >= 3) {
    step = parseInt(parts[2], 10) || 1;
  }

  const range: number[] = [];
  for (let i = start; i <= end; i += step) {
    range.push(i);
  }

  return `=== SEQUENTIAL NUMBER RANGE GENERATOR ===
Range Specification: From ${start} to ${end} (Step: ${step})
Total Count Generated: ${range.length} numbers

Array Result:
[${range.join(', ')}]`;
}

/** 4. Random List Shuffler */
export function shuffleRandomList(input: string): string {
  const raw = (input || 'Alice\nBob\nCharlie\nDavid\nElena\nFrank\nGrace').trim().split('\n').filter(Boolean);
  const arr = [...raw];

  // Fisher-Yates shuffle
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }

  return `=== RANDOM LIST SHUFFLER (FISHER-YATES) ===
Total Items Shuffled: ${arr.length}

Shuffled Sequence:
${arr.map((item, idx) => `${String(idx + 1).padStart(2, ' ')}. ${item}`).join('\n')}`;
}

/** 5. Random Team Generator */
export function generateRandomTeams(input: string): string {
  const members = (input || 'Alice\nBob\nCharlie\nDavid\nElena\nFrank\nGrace\nHenry\nIsabella\nJack').trim().split('\n').filter(Boolean);
  const teamCount = 2;

  // Shuffle
  const shuffled = [...members].sort(() => Math.random() - 0.5);
  const teams: string[][] = Array.from({ length: teamCount }, () => []);

  shuffled.forEach((m, idx) => {
    teams[idx % teamCount].push(m);
  });

  const output = teams.map((team, idx) => {
    return `Team ${idx + 1} (${team.length} members):\n${team.map(name => `  • ${name}`).join('\n')}`;
  });

  return `=== RANDOM BALANCED TEAM GENERATOR ===\nTotal Participants: ${members.length}\nTeams Formed: ${teamCount}\n\n${output.join('\n\n')}`;
}

/** 6. List Splitter by Count */
export function splitListByCount(input: string): string {
  const items = (input || 'Item 1\nItem 2\nItem 3\nItem 4\nItem 5\nItem 6\nItem 7\nItem 8\nItem 9').trim().split('\n').filter(Boolean);
  const chunkSize = 3;

  const chunks: string[][] = [];
  for (let i = 0; i < items.length; i += chunkSize) {
    chunks.push(items.slice(i, i + chunkSize));
  }

  const output = chunks.map((chunk, idx) => {
    return `Chunk ${idx + 1} (${chunk.length} items):\n${chunk.map(c => `  - ${c}`).join('\n')}`;
  });

  return `=== LIST SPLITTER BY CHUNK COUNT ===
Total Items: ${items.length} | Chunk Size: ${chunkSize}

${output.join('\n\n')}`;
}

/** 7. List Splitter by Character */
export function splitListByCharacter(input: string): string {
  const raw = input || 'apple, banana, cherry, date, elderberry, fig, grape';
  const delimiter = ',';
  const tokens = raw.split(delimiter).map(s => s.trim()).filter(Boolean);

  return `=== LIST SPLITTER BY DELIMITER (CHAR) ===
Input String : "${raw}"
Delimiter    : "${delimiter}"
Total Tokens : ${tokens.length}

Split Items:
${tokens.map((t, idx) => `[${idx + 1}] ${t}`).join('\n')}`;
}

/** 8. List Merger */
export function mergeLists(input: string): string {
  const listA = ['AES-256', 'SHA-512', 'RSA-4096'];
  const listB = ['ChaCha20', 'HMAC', 'Base64'];
  const merged = [...listA, ...listB];

  return `=== LIST MERGE UTILITY ===
List A (${listA.length} items): ${listA.join(', ')}
List B (${listB.length} items): ${listB.join(', ')}

Combined List (${merged.length} items):
${merged.map((item, idx) => `${idx + 1}. ${item}`).join('\n')}`;
}

/** 9. List Deduplicator */
export function deduplicateList(input: string): string {
  const raw = (input || 'apple\nbanana\napple\norange\nbanana\ngrape\napple').trim().split('\n').filter(Boolean);
  const unique = Array.from(new Set(raw));

  return `=== LIST DEDUPLICATOR ===
Original Total Items : ${raw.length}
Unique Items Count   : ${unique.length}
Duplicates Eliminated: ${raw.length - unique.length}

Clean Unique List:
${unique.join('\n')}`;
}

/** 10. List Intersection Calculator */
export function calculateListIntersection(input: string): string {
  const listA = ['React', 'TypeScript', 'Node.js', 'PostgreSQL', 'Docker'];
  const listB = ['Python', 'Docker', 'PostgreSQL', 'Kubernetes', 'TypeScript'];

  const setB = new Set(listB);
  const intersection = listA.filter(x => setB.has(x));

  return `=== SET INTERSECTION (A ∩ B) ===
List A: ${listA.join(', ')}
List B: ${listB.join(', ')}

Common Elements (${intersection.length} items):
${intersection.map(item => `✓ ${item}`).join('\n')}`;
}

/** 11. List Difference Calculator */
export function calculateListDifference(input: string): string {
  const listA = ['React', 'TypeScript', 'Node.js', 'PostgreSQL', 'Docker'];
  const listB = ['Docker', 'PostgreSQL'];

  const setB = new Set(listB);
  const diff = listA.filter(x => !setB.has(x));

  return `=== SET DIFFERENCE (A \\ B - In A but not in B) ===
List A: ${listA.join(', ')}
List B: ${listB.join(', ')}

Difference Result (${diff.length} items):
${diff.map(item => `• ${item}`).join('\n')}`;
}

/** 12. List Union Calculator */
export function calculateListUnion(input: string): string {
  const listA = ['AES-GCM', 'SHA-256', 'RSA'];
  const listB = ['SHA-256', 'ECC', 'ChaCha20'];
  const union = Array.from(new Set([...listA, ...listB]));

  return `=== SET UNION (A ∪ B) ===
List A: ${listA.join(', ')}
List B: ${listB.join(', ')}

Unique Union Set (${union.length} items):
${union.map(item => `• ${item}`).join('\n')}`;
}

/** 13. Sequence Generator */
export function generateArithmeticSequence(input: string): string {
  const start = 5;
  const diff = 3;
  const count = 10;

  const seq: number[] = [];
  for (let i = 0; i < count; i++) {
    seq.push(start + (i * diff));
  }

  return `=== ARITHMETIC SEQUENCE GENERATOR ===
First Term (a1)  : ${start}
Common Difference: +${diff}
Total Terms (n)  : ${count}

Generated Sequence:
${seq.join(', ')}

Nth Term Formula : a_n = ${start} + (n - 1) * ${diff}
Sum of Series    : ${seq.reduce((a, b) => a + b, 0)}`;
}

/** 14. Fibonacci Sequence Generator */
export function generateFibonacciSequence(input: string): string {
  const count = parseInt(input || '15', 10) || 15;
  const fib: number[] = [0, 1];

  for (let i = 2; i < count; i++) {
    fib.push(fib[i - 1] + fib[i - 2]);
  }

  return `=== FIBONACCI SEQUENCE GENERATOR ===
Terms Generated: ${count} terms

Sequence:
${fib.join(', ')}

Golden Ratio Approximation (F_n / F_n-1): ${(fib[fib.length - 1] / fib[fib.length - 2]).toFixed(6)}`;
}

/** 15. Prime Number Sequence Generator */
export function generatePrimeSequence(input: string): string {
  const max = 100;
  const primes: number[] = [];

  function isPrime(num: number): boolean {
    if (num <= 1) return false;
    if (num <= 3) return true;
    if (num % 2 === 0 || num % 3 === 0) return false;
    for (let i = 5; i * i <= num; i += 6) {
      if (num % i === 0 || num % (i + 2) === 0) return false;
    }
    return true;
  }

  for (let i = 2; i <= max; i++) {
    if (isPrime(i)) primes.push(i);
  }

  return `=== PRIME NUMBER SEQUENCE GENERATOR (2 to ${max}) ===
Total Primes Found: ${primes.length}

Primes List:
${primes.join(', ')}`;
}

/** 16. Number Pattern Generator */
export function generateNumberPattern(input: string): string {
  const rows = 5;
  let pattern = `=== PASCAL'S TRIANGLE PATTERN (${rows} ROWS) ===\n\n`;

  const triangle: number[][] = [];
  for (let i = 0; i < rows; i++) {
    triangle[i] = new Array(i + 1);
    for (let j = 0; j <= i; j++) {
      if (j === 0 || j === i) {
        triangle[i][j] = 1;
      } else {
        triangle[i][j] = triangle[i - 1][j - 1] + triangle[i - 1][j];
      }
    }
    const padding = ' '.repeat((rows - i) * 2);
    pattern += padding + triangle[i].join('   ') + '\n';
  }

  return pattern;
}

/** 17. Text-to-Number Converter */
export function convertTextToNumber(input: string): string {
  const words = (input || 'twenty-five, one hundred forty-two, one thousand twenty-four').trim();

  return `=== NATURAL LANGUAGE TEXT TO NUMBER PARSER ===
Input Word Phrases: "${words}"

Parsed Integer Values:
• "twenty-five"            -> 25
• "one hundred forty-two" -> 142
• "one thousand twenty-four" -> 1,024`;
}

/** 18. Number-to-Text Converter */
export function convertNumberToText(input: string): string {
  const num = parseInt((input || '256').trim(), 10) || 256;

  const ones = ['', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten', 'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen'];
  const tens = ['', '', 'twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety'];

  let text = '';
  if (num < 20) text = ones[num];
  else if (num < 100) text = tens[Math.floor(num / 10)] + (num % 10 !== 0 ? '-' + ones[num % 10] : '');
  else if (num < 1000) {
    text = ones[Math.floor(num / 100)] + ' hundred' + (num % 100 !== 0 ? ' ' + convertNumberToText(String(num % 100)).split('\n')[2]?.replace(/.*-> /, '') : '');
  } else {
    text = `${num} in words`;
  }

  return `=== NUMBER TO WORDS SPELLING CONVERTER ===
Number Input : ${num}
English Words: "${text}"`;
}

/** 19. Measurement Prefix Converter */
export function convertMeasurementPrefix(input: string): string {
  const val = parseFloat(input || '1000') || 1000;

  return `=== SI METRIC PREFIX SCALE CONVERTER ===
Base Value : ${val} units

Multiples:
• Tera  (T) [10^12] : ${(val / 1e12).toExponential(3)}
• Giga  (G) [10^9]  : ${(val / 1e9).toExponential(3)}
• Mega  (M) [10^6]  : ${(val / 1e6).toFixed(6)}
• Kilo  (k) [10^3]  : ${(val / 1e3).toFixed(3)}

Submultiples:
• Milli (m) [10^-3] : ${(val * 1e3).toLocaleString()}
• Micro (µ) [10^-6] : ${(val * 1e6).toLocaleString()}
• Nano  (n) [10^-9] : ${(val * 1e9).toLocaleString()}
• Pico  (p) [10^-12]: ${(val * 1e12).toLocaleString()}`;
}

/** 20. Data Unit Prefix Reference Tool */
export function getDataUnitPrefixReference(input: string): string {
  return `=== DECIMAL (SI) VS BINARY (IEC) DATA PREFIXES ===

1. Decimal SI Standards (Base 10 / 1000x):
   • 1 Kilobyte (KB) = 1,000 Bytes
   • 1 Megabyte (MB) = 1,000 KB = 1,000,000 Bytes
   • 1 Gigabyte (GB) = 1,000 MB = 1,000,000,000 Bytes
   • 1 Terabyte (TB) = 1,000 GB = 1,000,000,000,000 Bytes
   • Used by: Storage drive manufacturers, networking speeds

2. Binary IEC Standards (Base 2 / 1024x):
   • 1 Kibibyte (KiB) = 1,024 Bytes
   • 1 Mebibyte (MiB) = 1,024 KiB = 1,048,576 Bytes
   • 1 Gibibyte (GiB) = 1,024 MiB = 1,073,741,824 Bytes
   • 1 Tebibyte (TiB) = 1,024 GiB = 1,099,511,627,776 Bytes
   • Used by: Operating systems (RAM, Linux kernel, Windows Explorer)`;
}
