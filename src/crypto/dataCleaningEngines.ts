/**
 * Data Cleaning & Analysis Client-Side Engines
 * 100% browser-native data quality auditing, deduplication, normalizers,
 * statistical profilers, outlier detectors, and automated data quality scoring.
 */

function parseDatasetRows(input: string, delimiter = ','): string[][] {
  const lines = (input || '').split(/\r?\n/).filter(l => l.trim().length > 0);
  if (lines.length === 0) return [];

  return lines.map(line => {
    // Basic CSV / TSV splitter that respects quotes
    const cells: string[] = [];
    let current = '';
    let inQuotes = false;
    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      if (char === '"') {
        inQuotes = !inQuotes;
      } else if (char === delimiter && !inQuotes) {
        cells.push(current.trim().replace(/^"|"$/g, ''));
        current = '';
      } else {
        current += char;
      }
    }
    cells.push(current.trim().replace(/^"|"$/g, ''));
    return cells;
  });
}

/**
 * 1. Duplicate Data Finder
 */
export function findDuplicateData(rawText: string): string {
  const lines = (rawText || '').split(/\r?\n/).map(l => l.trim()).filter(Boolean);
  const counts: Record<string, number> = {};

  lines.forEach(l => {
    counts[l] = (counts[l] || 0) + 1;
  });

  const dupes = Object.entries(counts).filter(([_, c]) => c > 1);

  return `=== DUPLICATE DATA FINDER ===
Total Records Checked : ${lines.length}
Unique Records Count  : ${Object.keys(counts).length}
Duplicate Groups Found: ${dupes.length}

${dupes.length > 0 ? '--- Duplicate Occurrences ---\n' + dupes.map(([k, c]) => `• (${c}x) "${k}"`).join('\n') : '✓ Zero duplicate lines found.'}`;
}

/**
 * 2. Duplicate Email Finder
 */
export function findDuplicateEmails(rawText: string): string {
  const tokens = (rawText || '').split(/[\r\n,;]+/).map(t => t.trim().toLowerCase()).filter(Boolean);
  const counts: Record<string, number> = {};

  tokens.forEach(t => {
    const match = t.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);
    if (match) {
      const email = match[0];
      counts[email] = (counts[email] || 0) + 1;
    }
  });

  const dupes = Object.entries(counts).filter(([_, c]) => c > 1);

  return `=== DUPLICATE EMAIL FINDER ===
Total Emails Parsed   : ${tokens.length}
Unique Mailboxes      : ${Object.keys(counts).length}
Duplicate Emails Found: ${dupes.length}

${dupes.length > 0 ? '--- Redundant Emails ---\n' + dupes.map(([e, c]) => `• ${e} : appears ${c} times`).join('\n') : '✓ All email addresses in the input list are unique.'}`;
}

/**
 * 3. Duplicate Phone Number Finder
 */
export function findDuplicatePhoneNumbers(rawText: string): string {
  const lines = (rawText || '').split(/\r?\n/).map(l => l.trim()).filter(Boolean);
  const counts: Record<string, { count: number; original: string }> = {};

  lines.forEach(l => {
    const normalizedDigits = l.replace(/\D/g, '');
    if (normalizedDigits.length >= 7) {
      if (!counts[normalizedDigits]) {
        counts[normalizedDigits] = { count: 0, original: l };
      }
      counts[normalizedDigits].count += 1;
    }
  });

  const dupes = Object.entries(counts).filter(([_, data]) => data.count > 1);

  return `=== DUPLICATE PHONE NUMBER FINDER ===
Total Phone Records    : ${lines.length}
Unique Normalized Phone: ${Object.keys(counts).length}
Duplicate Numbers Found: ${dupes.length}

${dupes.length > 0 ? '--- Duplicate Phone Matches ---\n' + dupes.map(([digits, d]) => `• (${d.count}x) Digits: ${digits} (Sample: "${d.original}")`).join('\n') : '✓ No duplicate phone numbers detected.'}`;
}

/**
 * 4. Duplicate URL Finder
 */
export function findDuplicateUrls(rawText: string): string {
  const lines = (rawText || '').split(/\r?\n/).map(l => l.trim()).filter(Boolean);
  const counts: Record<string, number> = {};

  lines.forEach(l => {
    // Normalize URL for comparison (ignore trailing slash and lower host)
    let clean = l.replace(/\/+$/, '');
    counts[clean] = (counts[clean] || 0) + 1;
  });

  const dupes = Object.entries(counts).filter(([_, c]) => c > 1);

  return `=== DUPLICATE URL AUDIT ===
Total URLs Analyzed   : ${lines.length}
Unique Distinct URLs  : ${Object.keys(counts).length}
Duplicate URLs Flagged: ${dupes.length}

${dupes.length > 0 ? '--- Redundant URLs ---\n' + dupes.map(([u, c]) => `• (${c}x) ${u}`).join('\n') : '✓ All URLs are unique.'}`;
}

/**
 * 5. Duplicate ID Finder
 */
export function findDuplicateIds(rawText: string): string {
  const lines = (rawText || '').split(/[\r\n,;]+/).map(l => l.trim()).filter(Boolean);
  const counts: Record<string, number> = {};

  lines.forEach(id => {
    counts[id] = (counts[id] || 0) + 1;
  });

  const dupes = Object.entries(counts).filter(([_, c]) => c > 1);

  return `=== DUPLICATE IDENTIFIER (ID) FINDER ===
Total IDs Processed   : ${lines.length}
Unique Primary Keys   : ${Object.keys(counts).length}
Collisions / Duplicates: ${dupes.length}

${dupes.length > 0 ? '--- ID Collisions Detected ---\n' + dupes.map(([id, c]) => `• ID "${id}" repeated ${c} times`).join('\n') : '✓ High Data Integrity: Zero primary key duplicates.'}`;
}

/**
 * 6. Empty Value Cleaner
 */
export function cleanEmptyValues(rawCsvOrText: string): string {
  const lines = (rawCsvOrText || '').split(/\r?\n/);
  const cleaned: string[] = [];
  let strippedCount = 0;

  lines.forEach(line => {
    const trimmed = line.trim();
    // Check if line is empty or only commas/tabs
    if (!trimmed || /^[,\s\t"-]+$/.test(trimmed)) {
      strippedCount++;
    } else {
      // Clean empty cells
      const cells = line.split(',').map(c => c.trim() === '""' || c.trim() === '-' ? '' : c.trim());
      cleaned.push(cells.join(','));
    }
  });

  return `=== EMPTY VALUE CLEANER SUMMARY ===
Original Row Count : ${lines.length}
Cleaned Row Count  : ${cleaned.length}
Empty Rows Removed : ${strippedCount}

--- Cleaned Output ---
${cleaned.join('\n')}`;
}

/**
 * 7. Null Value Analyzer
 */
export function analyzeNullValues(rawCsv: string): string {
  const rows = parseDatasetRows(rawCsv);
  if (rows.length === 0) return 'Error: Empty dataset.';

  const headers = rows[0];
  const dataRows = rows.slice(1);
  const nullTokens = new Set(['', 'null', 'none', 'nan', 'n/a', 'na', 'nil', '-', 'undefined']);

  const colNulls: number[] = new Array(headers.length).fill(0);

  dataRows.forEach(r => {
    headers.forEach((_, colIdx) => {
      const val = (r[colIdx] || '').trim().toLowerCase();
      if (nullTokens.has(val)) {
        colNulls[colIdx]++;
      }
    });
  });

  return `=== NULL VALUE AUDIT REPORT ===
Total Records Analyzed : ${dataRows.length}
Total Columns Evaluated: ${headers.length}

Column Breakdown:
${headers.map((h, i) => {
  const missing = colNulls[i];
  const pct = dataRows.length > 0 ? ((missing / dataRows.length) * 100).toFixed(1) : '0';
  return `• [${h}] : ${missing} missing / null (${pct}%) ${missing > 0 ? '⚠' : '✓'}`;
}).join('\n')}`;
}

/**
 * 8. Whitespace Normalizer
 */
export function normalizeWhitespace(rawText: string): string {
  return (rawText || '')
    .split(/\r?\n/)
    .map(line => line.replace(/[ \t]+/g, ' ').trim())
    .filter(Boolean)
    .join('\n');
}

/**
 * 9. Unicode Normalizer
 */
export function normalizeUnicode(rawText: string, form: 'NFC' | 'NFD' | 'NFKC' | 'NFKD' = 'NFC'): string {
  const text = rawText || '';
  const normalized = text.normalize(form);

  return `=== UNICODE NORMALIZATION (${form}) ===
Original Length   : ${text.length} code units
Normalized Length : ${normalized.length} code units

--- Normalized Result ---
${normalized}`;
}

/**
 * 10. Date Normalizer
 */
export function normalizeDates(rawList: string, targetFormat = 'YYYY-MM-DD'): string {
  const lines = (rawList || '2026/09/26\n09-26-2026\nSep 26, 2026\n26-09-2026')
    .split(/\r?\n/).map(l => l.trim()).filter(Boolean);

  const results: string[] = [];

  lines.forEach(l => {
    const d = new Date(l);
    if (!isNaN(d.getTime())) {
      const yyyy = d.getFullYear();
      const mm = String(d.getMonth() + 1).padStart(2, '0');
      const dd = String(d.getDate()).padStart(2, '0');
      if (targetFormat === 'ISO') {
        results.push(`${d.toISOString()} (from "${l}")`);
      } else {
        results.push(`${yyyy}-${mm}-${dd} (from "${l}")`);
      }
    } else {
      results.push(`INVALID_DATE: "${l}"`);
    }
  });

  return `=== DATE NORMALIZATION ===\n${results.join('\n')}`;
}

/**
 * 11. Phone Number Formatter
 */
export function formatPhoneNumbers(rawList: string, format = 'E164'): string {
  const lines = (rawList || '(555) 234-5678\n+1 555 987 6543\n5558889999\n+44 20 7946 0991')
    .split(/\r?\n/).map(l => l.trim()).filter(Boolean);

  const formatted: string[] = [];

  lines.forEach(l => {
    const digits = l.replace(/\D/g, '');
    if (digits.length === 10) {
      // US standard
      if (format === 'NATIONAL') {
        formatted.push(`(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`);
      } else if (format === 'DOTS') {
        formatted.push(`${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6)}`);
      } else {
        // E164
        formatted.push(`+1${digits}`);
      }
    } else if (digits.length === 11 && digits.startsWith('1')) {
      if (format === 'NATIONAL') {
        formatted.push(`(${digits.slice(1, 4)}) ${digits.slice(4, 7)}-${digits.slice(7)}`);
      } else {
        formatted.push(`+${digits}`);
      }
    } else {
      formatted.push(`+${digits} (International format)`);
    }
  });

  return `=== PHONE NUMBER FORMATTER ===\n${formatted.join('\n')}`;
}

/**
 * 12. Email List Cleaner
 */
export function cleanEmailList(rawInput: string): string {
  const tokens = (rawInput || '').split(/[\r\n,;]+/).map(t => t.trim().toLowerCase()).filter(Boolean);
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  const valid = new Set<string>();
  const invalid: string[] = [];

  tokens.forEach(t => {
    if (emailRegex.test(t)) {
      valid.add(t);
    } else {
      invalid.push(t);
    }
  });

  return `=== EMAIL LIST CLEANER & DEDUPLICATOR ===
Total Raw Items : ${tokens.length}
Valid Unique    : ${valid.size}
Invalid Discards: ${invalid.length}

--- Cleaned Email List ---
${Array.from(valid).sort().join('\n')}`;
}

/**
 * 13. URL List Cleaner
 */
export function cleanUrlList(rawInput: string): string {
  const lines = (rawInput || '').split(/\r?\n/).map(l => l.trim()).filter(Boolean);
  const cleanedSet = new Set<string>();

  lines.forEach(line => {
    let uStr = line;
    if (!/^https?:\/\//i.test(uStr)) uStr = 'https://' + uStr;
    try {
      const u = new URL(uStr);
      // Remove UTM params
      const params = new URLSearchParams(u.search);
      const toDelete: string[] = [];
      params.forEach((_, k) => {
        if (/^utm_|fbclid|gclid|_ga/i.test(k)) toDelete.push(k);
      });
      toDelete.forEach(k => params.delete(k));

      u.search = params.toString() ? '?' + params.toString() : '';
      u.hash = '';
      cleanedSet.add(u.href.replace(/\/+$/, ''));
    } catch {}
  });

  return `=== URL LIST CLEANER ===
Input Count : ${lines.length}
Unique Clean: ${cleanedSet.size}

--- Cleaned URLs ---
${Array.from(cleanedSet).sort().join('\n')}`;
}

/**
 * 14. CSV Dataset Profiler
 */
export function profileCsvDataset(rawCsv: string): string {
  const rows = parseDatasetRows(rawCsv);
  if (rows.length === 0) return 'Error: Empty dataset.';

  const headers = rows[0];
  const data = rows.slice(1);
  const colTypes: Record<string, string> = {};

  headers.forEach((h, colIdx) => {
    let numericCount = 0;
    let boolCount = 0;
    let dateCount = 0;
    data.forEach(r => {
      const val = (r[colIdx] || '').trim();
      if (!isNaN(Number(val)) && val !== '') numericCount++;
      else if (/^(true|false|yes|no|1|0)$/i.test(val)) boolCount++;
      else if (!isNaN(Date.parse(val)) && val.length > 5) dateCount++;
    });

    if (numericCount > data.length * 0.7) colTypes[h] = 'Numeric (Number/Float)';
    else if (boolCount > data.length * 0.7) colTypes[h] = 'Boolean (Flag)';
    else if (dateCount > data.length * 0.7) colTypes[h] = 'DateTime';
    else colTypes[h] = 'Categorical / Text';
  });

  return `=== CSV DATASET PROFILER ===
Dimensions : ${data.length} rows × ${headers.length} columns
Memory Est : ~${((rawCsv.length * 2) / 1024).toFixed(1)} KB

Column Schemas Inferred:
${headers.map(h => `• ${h.padEnd(20)}: ${colTypes[h]}`).join('\n')}`;
}

/**
 * 15. Dataset Statistics Generator
 */
export function generateDatasetStatistics(rawCsv: string): string {
  const rows = parseDatasetRows(rawCsv);
  if (rows.length <= 1) return 'Error: Insufficient dataset rows.';

  const headers = rows[0];
  const data = rows.slice(1);

  return `=== DATASET SUMMARY STATISTICS ===
Total Observations : ${data.length}
Variables (Columns): ${headers.length}
Cell Density       : ${data.length * headers.length} total cells
Average Row Length : ${(rawCsv.length / rows.length).toFixed(1)} characters`;
}

/**
 * 16. Column Statistics Analyzer
 */
export function analyzeColumnStatistics(rawCsv: string, targetColIndex = 0): string {
  const rows = parseDatasetRows(rawCsv);
  if (rows.length <= 1) return 'Error: Empty data.';

  const headers = rows[0];
  const colName = headers[targetColIndex] || `Column ${targetColIndex + 1}`;
  const values = rows.slice(1).map(r => r[targetColIndex] || '').filter(Boolean);

  const numVals = values.map(v => Number(v)).filter(n => !isNaN(n));
  const isNumeric = numVals.length > values.length * 0.5;

  if (isNumeric && numVals.length > 0) {
    const sum = numVals.reduce((acc, v) => acc + v, 0);
    const mean = sum / numVals.length;
    const min = Math.min(...numVals);
    const max = Math.max(...numVals);
    const sorted = [...numVals].sort((a, b) => a - b);
    const median = sorted[Math.floor(sorted.length / 2)];

    return `=== COLUMN NUMERIC ANALYSIS: [${colName}] ===
Data Type   : Numeric (${numVals.length} / ${values.length} valid)
Minimum     : ${min}
Maximum     : ${max}
Mean / Avg  : ${mean.toFixed(2)}
Median (Q2) : ${median}
Sum Total   : ${sum.toFixed(2)}`;
  }

  // Categorical stats
  const freqs: Record<string, number> = {};
  values.forEach(v => { freqs[v] = (freqs[v] || 0) + 1; });
  const sorted = Object.entries(freqs).sort((a, b) => b[1] - a[1]);

  return `=== COLUMN CATEGORICAL ANALYSIS: [${colName}] ===
Data Type   : Text / Discrete Category
Distinct    : ${sorted.length} unique values
Top Value   : "${sorted[0]?.[0] || 'N/A'}" (${sorted[0]?.[1] || 0} occurrences)
Frequency Breakdown:
${sorted.slice(0, 10).map(([k, c]) => `  • ${k} : ${c}`).join('\n')}`;
}

/**
 * 17. Missing Value Report Generator
 */
export function generateMissingValueReport(rawCsv: string): string {
  const rows = parseDatasetRows(rawCsv);
  if (rows.length <= 1) return 'Error: Empty dataset.';

  const headers = rows[0];
  const data = rows.slice(1);
  let totalMissing = 0;

  const colReports = headers.map((h, colIdx) => {
    let missing = 0;
    data.forEach(r => {
      const val = (r[colIdx] || '').trim();
      if (!val || /^(null|none|nan|n\/a|na|-)$/i.test(val)) missing++;
    });
    totalMissing += missing;
    return { header: h, missing, pct: ((missing / data.length) * 100).toFixed(1) };
  });

  return `=== MISSING VALUE REPORT ===
Total Observations : ${data.length}
Total Empty Cells  : ${totalMissing} (${((totalMissing / (data.length * headers.length)) * 100).toFixed(1)}% missingness)

Audit per Column:
${colReports.map(c => `• ${c.header.padEnd(20)} : ${c.missing} null (${c.pct}%)`).join('\n')}`;
}

/**
 * 18. Data Quality Score Calculator
 */
export function calculateDataQualityScore(rawCsv: string): string {
  const rows = parseDatasetRows(rawCsv);
  if (rows.length <= 1) return 'Error: Empty dataset.';

  const headers = rows[0];
  const data = rows.slice(1);

  let completenessScore = 100;
  let totalCells = data.length * headers.length;
  let missingCells = 0;

  // 1. Missing values
  data.forEach(r => {
    headers.forEach((_, i) => {
      const v = (r[i] || '').trim();
      if (!v || /^(null|none|nan|n\/a|-)$/i.test(v)) missingCells++;
    });
  });
  completenessScore = Math.max(0, 100 - (missingCells / totalCells) * 100);

  // 2. Uniqueness (duplicates)
  const lineSet = new Set(data.map(r => r.join('|||')));
  const uniquenessScore = (lineSet.size / data.length) * 100;

  // 3. Overall Composite Score
  const overallQuality = (completenessScore * 0.6 + uniquenessScore * 0.4).toFixed(1);

  return `=== DATA QUALITY SCORECARD ===
Overall Quality Score : ${overallQuality} / 100

Key Dimensions:
• Completeness : ${completenessScore.toFixed(1)} / 100 (${missingCells} null values detected)
• Uniqueness   : ${uniquenessScore.toFixed(1)} / 100 (${data.length - lineSet.size} redundant rows detected)

Integrity Grade:
${Number(overallQuality) >= 90 ? 'Grade A (Excellent - Production & ML Ready)' : Number(overallQuality) >= 75 ? 'Grade B (Good - Minor sanitization recommended)' : 'Grade C/D (Requires cleaning before downstream processing)'}`;
}

/**
 * 19. Text Column Normalizer
 */
export function normalizeTextColumns(rawCsv: string): string {
  const rows = parseDatasetRows(rawCsv);
  if (rows.length === 0) return '';

  const normalized = rows.map(r => {
    return r.map(cell => {
      return cell.replace(/\s+/g, ' ').trim();
    }).join(',');
  });

  return normalized.join('\n');
}

/**
 * 20. Number Format Normalizer
 */
export function normalizeNumberFormats(rawText: string): string {
  const lines = (rawText || '$1,234.56\n1.234,56 €\n1 000 000,00\n-45.2%')
    .split(/\r?\n/).map(l => l.trim()).filter(Boolean);

  const normalized: string[] = [];

  lines.forEach(l => {
    // Strip currencies and percentage
    let clean = l.replace(/[$€£¥₹%]/g, '').trim();
    // Handle European format (1.234,56 -> 1234.56)
    if (/\d+\.\d{3},\d+/.test(clean)) {
      clean = clean.replace(/\./g, '').replace(',', '.');
    } else {
      // Remove commas
      clean = clean.replace(/,/g, '');
    }
    // Remove inner spaces (1 000 000 -> 1000000)
    clean = clean.replace(/\s+/g, '');

    const num = parseFloat(clean);
    normalized.push(`${!isNaN(num) ? num : 'NaN'} (from "${l}")`);
  });

  return `=== NORMALIZED NUMBERS ===\n${normalized.join('\n')}`;
}

/**
 * 21. Address Line Cleaner
 */
export function cleanAddressLines(rawText: string): string {
  const lines = (rawText || '123  Main   St.,   apt #4B\n456 elm  road, suite  100\n789 broadway ave')
    .split(/\r?\n/).map(l => l.trim()).filter(Boolean);

  const cleaned = lines.map(line => {
    let s = line
      .replace(/\s+/g, ' ')
      .replace(/\bapt\.?\b/i, 'Apt')
      .replace(/\bste\.?\b/i, 'Suite')
      .replace(/\bst\.?\b/i, 'St')
      .replace(/\brd\.?\b/i, 'Rd')
      .replace(/\bave\.?\b/i, 'Ave')
      .replace(/\bblvd\.?\b/i, 'Blvd')
      .replace(/\bdr\.?\b/i, 'Dr');

    // Title case
    s = s.replace(/\b\w+/g, word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase());
    return s;
  });

  return `=== CLEANED ADDRESS LINES ===\n${cleaned.join('\n')}`;
}

/**
 * 22. Name Case Normalizer
 */
export function normalizeNameCases(rawText: string): string {
  const lines = (rawText || 'JOHN DOE\njane m. smith\nALEX O\'CONNOR\nmcdonald, ronald')
    .split(/\r?\n/).map(l => l.trim()).filter(Boolean);

  const cleaned = lines.map(line => {
    return line
      .toLowerCase()
      .replace(/\b\w/g, char => char.toUpperCase())
      .replace(/\bMc(\w)/g, (_, c) => `Mc${c.toUpperCase()}`)
      .replace(/\bO'(\w)/g, (_, c) => `O'${c.toUpperCase()}`);
  });

  return `=== NORMALIZED NAME CASING ===\n${cleaned.join('\n')}`;
}

/**
 * 23. Dataset Duplicate Report
 */
export function generateDatasetDuplicateReport(rawCsv: string): string {
  const rows = parseDatasetRows(rawCsv);
  if (rows.length <= 1) return 'Error: Empty dataset.';

  const data = rows.slice(1);
  const seen: Record<string, number[]> = {};

  data.forEach((r, idx) => {
    const key = r.join('|||');
    if (!seen[key]) seen[key] = [];
    seen[key].push(idx + 2); // 1-indexed row in file
  });

  const dupes = Object.entries(seen).filter(([_, lineNums]) => lineNums.length > 1);

  return `=== DATASET DUPLICATE REPORT ===
Total Data Rows     : ${data.length}
Unique Combinations : ${Object.keys(seen).length}
Duplicate Clusters  : ${dupes.length}

Detailed Duplication:
${dupes.map(([k, rows]) => `• Rows [${rows.join(', ')}] are identical:\n   Preview: "${k.replace(/\|\|\|/g, ', ').slice(0, 80)}"`).join('\n\n') || '✓ Zero duplicate records detected across all columns.'}`;
}

/**
 * 24. Data Outlier Detector
 */
export function detectDataOutliers(rawCsv: string, colIndex = 0): string {
  const rows = parseDatasetRows(rawCsv);
  if (rows.length <= 4) return 'Error: Minimum 5 records required for IQR outlier analysis.';

  const headers = rows[0];
  const colName = headers[colIndex] || `Column ${colIndex + 1}`;
  const values = rows.slice(1).map(r => Number(r[colIndex])).filter(n => !isNaN(n));

  if (values.length < 5) return `Error: Column "${colName}" has insufficient numeric values for outlier detection.`;

  const sorted = [...values].sort((a, b) => a - b);
  const q1 = sorted[Math.floor(sorted.length * 0.25)];
  const q3 = sorted[Math.floor(sorted.length * 0.75)];
  const iqr = q3 - q1;
  const lowerBound = q1 - 1.5 * iqr;
  const upperBound = q3 + 1.5 * iqr;

  const outliers = sorted.filter(v => v < lowerBound || v > upperBound);

  return `=== STATISTICAL OUTLIER DETECTION (IQR METHOD) ===
Audited Column : [${colName}]
Sample Count   : ${values.length} numbers
Quartile 1 (Q1): ${q1}
Quartile 3 (Q3): ${q3}
IQR Spread     : ${iqr}
Lower Fence    : ${lowerBound}
Upper Fence    : ${upperBound}
Outliers Count : ${outliers.length}

${outliers.length > 0 ? `Flagged Anomaly Outliers: ${outliers.join(', ')}` : '✓ No statistical outliers detected within 1.5x IQR boundaries.'}`;
}

/**
 * 25. Dataset Summary Generator
 */
export function generateDatasetSummary(rawCsv: string): string {
  const rows = parseDatasetRows(rawCsv);
  if (rows.length === 0) return 'Error: Empty input.';

  const headers = rows[0];
  const data = rows.slice(1);

  return `=== EXECUTIVE DATASET SUMMARY ===
File Dimensions : ${data.length} records, ${headers.length} attributes
Total Data Points: ${data.length * headers.length} values
Attribute List  : ${headers.join(', ')}

Health Verdict:
Ready for import, database ingestion, or spreadsheet transformation. Complete local processing with zero server transmission.`;
}
