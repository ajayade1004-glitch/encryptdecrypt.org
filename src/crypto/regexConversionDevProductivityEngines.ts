/**
 * 100% Client-Side Regex, Advanced Unit Conversions & Dev Productivity Engines.
 * Pure TypeScript algorithms, zero external network calls, zero log.
 */

// ==========================================
// 1. REGEX & PATTERN ENGINES
// ==========================================

export function explainRegexPattern(regexStr: string): {
  pattern: string;
  explanationSteps: string[];
  flags: string;
} {
  const clean = regexStr.trim();
  const steps: string[] = [];

  if (clean.includes('^')) steps.push('^ Assert start of string anchor');
  if (clean.includes('$')) steps.push('$ Assert end of string anchor');
  if (clean.includes('\\d+')) steps.push('\\d+ Match one or more numeric digits [0-9]');
  if (clean.includes('[a-zA-Z0-9._%+-]+')) steps.push('Match standard email username characters');
  if (clean.includes('@')) steps.push('@ Match literal "@" character');
  if (clean.includes('(?=')) steps.push('(?=...) Positive lookahead assertion');
  if (clean.includes('(?!')) steps.push('(?!...) Negative lookahead assertion');
  if (clean.includes('(?<=')) steps.push('(?<=...) Positive lookbehind assertion');

  if (steps.length === 0) {
    steps.push('Literal character sequence search');
    steps.push('Matches character patterns sequentially across string');
  }

  return {
    pattern: clean,
    explanationSteps: steps,
    flags: 'g, i, m (Global, Case-Insensitive, Multiline)'
  };
}

export function convertGlobToRegex(globPattern = '*.js'): {
  globPattern: string;
  regexPattern: string;
  regexEscapedString: string;
} {
  let regex = globPattern
    .replace(/\./g, '\\.')
    .replace(/\*/g, '.*')
    .replace(/\?/g, '.');
  regex = `^${regex}$`;

  return {
    globPattern,
    regexPattern: regex,
    regexEscapedString: `new RegExp("${regex}")`
  };
}

export function testRegexCaptureGroups(regexStr: string, textStr: string): {
  isMatch: boolean;
  matchCount: number;
  extractedGroups: Array<{ matchIndex: number; fullMatch: string; groups: string[] }>;
} {
  try {
    const re = new RegExp(regexStr, 'g');
    const matches: Array<{ matchIndex: number; fullMatch: string; groups: string[] }> = [];
    let match: RegExpExecArray | null;
    let idx = 0;

    while ((match = re.exec(textStr)) !== null && idx < 20) {
      matches.push({
        matchIndex: idx++,
        fullMatch: match[0],
        groups: match.slice(1)
      });
      if (!re.global) break;
    }

    return {
      isMatch: matches.length > 0,
      matchCount: matches.length,
      extractedGroups: matches
    };
  } catch {
    return { isMatch: false, matchCount: 0, extractedGroups: [] };
  }
}

// ==========================================
// 2. ADVANCED UNIT CONVERSIONS ENGINES
// ==========================================

export function convertTorqueUnits(val = 100, fromUnit: 'nm' | 'ftlb' | 'kgfcm' = 'nm'): {
  newtonMeters: number;
  footPounds: number;
  kgfCentimeters: number;
} {
  let nm = val;
  if (fromUnit === 'ftlb') nm = val * 1.355818;
  else if (fromUnit === 'kgfcm') nm = val * 0.0980665;

  return {
    newtonMeters: parseFloat(nm.toFixed(2)),
    footPounds: parseFloat((nm * 0.737562).toFixed(2)),
    kgfCentimeters: parseFloat((nm * 10.19716).toFixed(2))
  };
}

export function convertPressureUnits(val = 100, fromUnit: 'psi' | 'bar' | 'pascal' | 'atm' = 'psi'): {
  psi: number;
  bar: number;
  pascal: number;
  atm: number;
} {
  let pascals = val;
  if (fromUnit === 'psi') pascals = val * 6894.76;
  else if (fromUnit === 'bar') pascals = val * 100000;
  else if (fromUnit === 'atm') pascals = val * 101325;

  return {
    psi: parseFloat((pascals / 6894.76).toFixed(2)),
    bar: parseFloat((pascals / 100000).toFixed(4)),
    pascal: parseFloat(pascals.toFixed(0)),
    atm: parseFloat((pascals / 101325).toFixed(4))
  };
}

export function convertFuelEfficiency(val = 30, fromUnit: 'mpg_us' | 'l100km' | 'kml' = 'mpg_us'): {
  mpgUs: number;
  litersPer100km: number;
  kmPerLiter: number;
} {
  let l100 = val;
  if (fromUnit === 'mpg_us') l100 = 235.215 / val;
  else if (fromUnit === 'kml') l100 = 100 / val;

  const mpg = 235.215 / l100;
  const kml = 100 / l100;

  return {
    mpgUs: parseFloat(mpg.toFixed(1)),
    litersPer100km: parseFloat(l100.toFixed(1)),
    kmPerLiter: parseFloat(kml.toFixed(1))
  };
}

export function convertDataTransferRate(val = 100, fromUnit: 'mbps' | 'mbs' | 'gbhr' = 'mbps'): {
  megaBitsPerSec: number;
  megaBytesPerSec: number;
  gigaBytesPerHour: number;
} {
  let mbps = val;
  if (fromUnit === 'mbs') mbps = val * 8;
  else if (fromUnit === 'gbhr') mbps = (val * 8000) / 3600;

  const mbs = mbps / 8;
  const gbhr = (mbs * 3600) / 1000;

  return {
    megaBitsPerSec: parseFloat(mbps.toFixed(2)),
    megaBytesPerSec: parseFloat(mbs.toFixed(2)),
    gigaBytesPerHour: parseFloat(gbhr.toFixed(2))
  };
}

// ==========================================
// 3. DEVELOPER PRODUCTIVITY ENGINES
// ==========================================

export function generateHelloWorldReference(language = 'python'): {
  language: string;
  codeSnippet: string;
  executionNote: string;
} {
  const db: Record<string, { code: string; note: string }> = {
    python: { code: 'print("Hello, World!")', note: 'Run with `python script.py`' },
    javascript: { code: 'console.log("Hello, World!");', note: 'Run with Node.js or browser console' },
    rust: { code: 'fn main() {\n    println!("Hello, World!");\n}', note: 'Compile with `rustc main.rs`' },
    go: { code: 'package main\nimport "fmt"\n\nfunc main() {\n    fmt.Println("Hello, World!")\n}', note: 'Run with `go run main.go`' },
    java: { code: 'public class Main {\n    public static void main(String[] args) {\n        System.out.println("Hello, World!");\n    }\n}', note: 'Compile with `javac Main.java`' }
  };

  const key = language.toLowerCase().trim();
  const res = db[key] || db.python;

  return {
    language: key.toUpperCase(),
    codeSnippet: res.code,
    executionNote: res.note
  };
}

export function generateLoremIpsumVariant(variant: 'cicero' | 'hipster' | 'bacon' = 'cicero', paragraphCount = 2): {
  variant: string;
  generatedText: string;
} {
  let text = '';
  if (variant === 'bacon') {
    text = 'Bacon ipsum dolor amet shankle pork belly brisket strip steak. Ribeye sirloin shoulder drumstick pastrami. Tenderloin pork loin kielbasa landjaeger.';
  } else if (variant === 'hipster') {
    text = 'Hipster ipsum dolor amet aesthetic single-origin coffee craft beer artisanal, kombucha Brooklyn viral bicycle rights crucifix tofu.';
  } else {
    text = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.';
  }

  return {
    variant,
    generatedText: Array(paragraphCount).fill(text).join('\n\n')
  };
}

export function generateOfflinePlaceholderImageUri(width = 300, height = 200, label = '300x200', bgColor = '3b82f6', textColor = 'ffffff'): {
  svgDataUri: string;
  dimensions: string;
  htmlImgTag: string;
} {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}"><rect width="100%" height="100%" fill="#${bgColor}"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="#${textColor}" font-family="sans-serif" font-size="16" font-weight="bold">${label}</text></svg>`;
  const encoded = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;

  return {
    svgDataUri: encoded,
    dimensions: `${width}x${height} px`,
    htmlImgTag: `<img src="${encoded}" alt="${label}" width="${width}" height="${height}" />`
  };
}

export function calculateSemverBump(currentVersion = '1.2.3', bumpType: 'major' | 'minor' | 'patch' = 'minor'): {
  currentVersion: string;
  nextVersion: string;
  bumpType: string;
  isBreakingChange: boolean;
} {
  const parts = currentVersion.trim().split('.').map(n => parseInt(n, 10) || 0);
  let [major, minor, patch] = [parts[0] || 1, parts[1] || 0, parts[2] || 0];

  if (bumpType === 'major') { major += 1; minor = 0; patch = 0; }
  else if (bumpType === 'minor') { minor += 1; patch = 0; }
  else { patch += 1; }

  const next = `${major}.${minor}.${patch}`;

  return {
    currentVersion,
    nextVersion: next,
    bumpType,
    isBreakingChange: bumpType === 'major'
  };
}

export function checkRestApiNamingConvention(endpointPath = '/v1/user_profiles/{userId}'): {
  endpointPath: string;
  isValidRestConvention: boolean;
  warnings: string[];
} {
  const warnings: string[] = [];
  if (/[A-Z]/.test(endpointPath)) warnings.push('Endpoints should use lowercase characters only.');
  if (/_/.test(endpointPath)) warnings.push('Endpoints should use hyphens (kebab-case) instead of underscores.');
  if (endpointPath.endsWith('/')) warnings.push('Avoid trailing slashes in REST API endpoint paths.');

  return {
    endpointPath,
    isValidRestConvention: warnings.length === 0,
    warnings
  };
}
