/**
 * 100% Client-Side Genealogy, Typography, Browser/Hardware, Cooking, and Civic Engines.
 * Pure TypeScript algorithms, navigator hardware inspection, and static references.
 */

// ==========================================
// 1. GENEALOGY & FAMILY ENGINES
// ==========================================

export function calculateFamilyRelationship(relationPath: string): {
  relationshipName: string;
  kinshipType: string;
  sharedAncestryPercent: string;
} {
  const path = relationPath.toLowerCase().trim();
  let name = 'First Cousin';
  let percent = '12.5%';
  let type = 'Collateral Relative';

  if (path.includes('father') && path.includes('brother')) { name = 'Uncle'; percent = '25%'; type = 'Direct Relative'; }
  else if (path.includes('mother') && path.includes('sister')) { name = 'Aunt'; percent = '25%'; type = 'Direct Relative'; }
  else if (path.includes('cousin') && path.includes('child')) { name = 'First Cousin Once Removed'; percent = '6.25%'; type = 'Collateral Relative'; }
  else if (path.includes('grandfather')) { name = 'Grandfather'; percent = '25%'; type = 'Direct Ancestor'; }

  return { relationshipName: name, kinshipType: type, sharedAncestryPercent: percent };
}

export function calculateGenerationGap(startYear = 1920, targetYear = 2026, averageGenerationSpan = 28): {
  totalYears: number;
  estimatedGenerations: number;
  generationNames: string[];
} {
  const years = Math.max(0, targetYear - startYear);
  const gens = Math.round(years / averageGenerationSpan);
  const names = ['Great-Grandparents Generation', 'Grandparents Generation', 'Parents Generation', 'Current Generation'];

  return { totalYears: years, estimatedGenerations: gens, generationNames: names.slice(0, Math.min(names.length, gens + 1)) };
}

// ==========================================
// 2. TYPOGRAPHY & FONTS ENGINES
// ==========================================

export function suggestFontPairings(headingStyle: 'serif' | 'sans' | 'display' = 'sans'): {
  headingFont: string;
  bodyFont: string;
  contrastRating: string;
  cssFontStack: string;
} {
  if (headingStyle === 'serif') {
    return { headingFont: 'Playfair Display', bodyFont: 'Inter', contrastRating: 'High Contrast (Editorial elegance)', cssFontStack: '"Playfair Display", Georgia, serif' };
  } else if (headingStyle === 'display') {
    return { headingFont: 'Montserrat', bodyFont: 'Open Sans', contrastRating: 'Modern Geometric Display', cssFontStack: 'Montserrat, system-ui, sans-serif' };
  }
  return { headingFont: 'Inter', bodyFont: 'Merriweather', contrastRating: 'Optimal Web UI Readability', cssFontStack: 'Inter, system-ui, sans-serif' };
}

export function generateTypographicScale(basePx = 16, ratio = 1.25): {
  ratioName: string;
  scaleStepsPx: Array<{ step: string; sizePx: number; sizeRem: number }>;
} {
  const steps = ['xs', 'sm', 'base', 'lg', 'xl', '2xl', '3xl', '4xl'];
  const scale = steps.map((s, idx) => {
    const exponent = idx - 2; // base is idx 2
    const px = basePx * Math.pow(ratio, exponent);
    return { step: s, sizePx: parseFloat(px.toFixed(1)), sizeRem: parseFloat((px / basePx).toFixed(3)) };
  });

  return { ratioName: ratio === 1.25 ? 'Major Third (1.250)' : 'Golden Ratio (1.618)', scaleStepsPx: scale };
}

export function optimizeLineLength(fontSizePx = 16, containerWidthPx = 680): {
  charactersPerLine: number;
  readabilityRating: string;
  recommendedContainerWidthPx: number;
} {
  const avgCharWidth = fontSizePx * 0.5;
  const cpl = Math.round(containerWidthPx / avgCharWidth);
  const recommended = Math.round(65 * avgCharWidth);

  let rating = 'Optimal Readability (60-75 CPL)';
  if (cpl > 85) rating = 'Too Long (Eye fatigue / difficulty finding line starts)';
  else if (cpl < 45) rating = 'Too Short (Excessive line breaks / broken rhythm)';

  return { charactersPerLine: cpl, readabilityRating: rating, recommendedContainerWidthPx: recommended };
}

// ==========================================
// 3. BROWSER & HARDWARE INFO ENGINES
// ==========================================

export function checkBrowserCapabilities(): {
  browserUserAgent: string;
  hasWebCrypto: boolean;
  hasLocalStorage: boolean;
  hasServiceWorker: boolean;
  hasWebAssembly: boolean;
  hardwareConcurrency: number;
} {
  const nav = typeof navigator !== 'undefined' ? navigator : ({} as Navigator);
  return {
    browserUserAgent: nav.userAgent || 'Server-Side Node.js',
    hasWebCrypto: typeof window !== 'undefined' && !!window.crypto,
    hasLocalStorage: typeof window !== 'undefined' && !!window.localStorage,
    hasServiceWorker: typeof nav !== 'undefined' && 'serviceWorker' in nav,
    hasWebAssembly: typeof WebAssembly !== 'undefined',
    hardwareConcurrency: nav.hardwareConcurrency || 4
  };
}

export function detectScreenResolutionDpi(): {
  screenWidthPx: number;
  screenHeightPx: number;
  devicePixelRatio: number;
  estimatedDpi: number;
} {
  if (typeof window === 'undefined') return { screenWidthPx: 1920, screenHeightPx: 1080, devicePixelRatio: 1, estimatedDpi: 96 };
  const dpr = window.devicePixelRatio || 1;
  return {
    screenWidthPx: window.screen.width,
    screenHeightPx: window.screen.height,
    devicePixelRatio: dpr,
    estimatedDpi: Math.round(96 * dpr)
  };
}

export function detectDarkModePreference(): {
  isDarkModePreferred: boolean;
  colorScheme: string;
} {
  if (typeof window === 'undefined' || !window.matchMedia) return { isDarkModePreferred: false, colorScheme: 'light' };
  const dark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  return { isDarkModePreferred: dark, colorScheme: dark ? 'dark' : 'light' };
}

// ==========================================
// 4. COOKING & RECIPE MATH ENGINES
// ==========================================

export function convertOvenTemperature(temp: number, unit: 'f' | 'c' | 'gas' = 'f'): {
  fahrenheit: number;
  celsius: number;
  gasMark: string;
  fanForcedCelsius: number;
} {
  let f = temp;
  if (unit === 'c') f = (temp * 9) / 5 + 32;
  else if (unit === 'gas') f = temp * 25 + 250;

  const c = (f - 32) * (5 / 9);
  const fanC = c - 20;
  const gas = Math.max(1, Math.round((f - 250) / 25));

  return {
    fahrenheit: Math.round(f),
    celsius: Math.round(c),
    gasMark: `Gas Mark ${gas}`,
    fanForcedCelsius: Math.round(fanC)
  };
}

export function calculateBakersPercentage(flourGrams = 500, waterGrams = 350, saltGrams = 10, yeastGrams = 5): {
  flourPercent: number;
  hydrationPercent: number;
  saltPercent: number;
  yeastPercent: number;
  totalDoughWeightGrams: number;
} {
  return {
    flourPercent: 100,
    hydrationPercent: parseFloat(((waterGrams / flourGrams) * 100).toFixed(1)),
    saltPercent: parseFloat(((saltGrams / flourGrams) * 100).toFixed(1)),
    yeastPercent: parseFloat(((yeastGrams / flourGrams) * 100).toFixed(1)),
    totalDoughWeightGrams: flourGrams + waterGrams + saltGrams + yeastGrams
  };
}

export function scaleRecipeBatch(quantity = 2.5, multiplier = 2.5): {
  originalQuantity: number;
  scaledQuantity: number;
  multiplier: number;
} {
  return {
    originalQuantity: quantity,
    scaledQuantity: parseFloat((quantity * multiplier).toFixed(2)),
    multiplier
  };
}

// ==========================================
// 5. CIVIC & REFERENCE ENGINES
// ==========================================

export function lookupCountryCallingCode(countryName = 'India'): {
  country: string;
  callingCode: string;
  isoAlpha2: string;
  isoAlpha3: string;
  currencyCode: string;
} {
  const db: Record<string, { code: string; a2: string; a3: string; cur: string }> = {
    india: { code: '+91', a2: 'IN', a3: 'IND', cur: 'INR (₹)' },
    'united states': { code: '+1', a2: 'US', a3: 'USA', cur: 'USD ($)' },
    'united kingdom': { code: '+44', a2: 'GB', a3: 'GBR', cur: 'GBP (£)' },
    germany: { code: '+49', a2: 'DE', a3: 'DEU', cur: 'EUR (€)' },
    japan: { code: '+81', a2: 'JP', a3: 'JPN', cur: 'JPY (¥)' }
  };

  const key = countryName.trim().toLowerCase();
  const match = db[key] || { code: '+1', a2: 'US', a3: 'USA', cur: 'USD ($)' };

  return {
    country: countryName,
    callingCode: match.code,
    isoAlpha2: match.a2,
    isoAlpha3: match.a3,
    currencyCode: match.cur
  };
}

export function validatePostalCodeFormat(postalCode = '110001', country = 'IN'): {
  postalCode: string;
  country: string;
  isValidFormat: boolean;
  expectedPattern: string;
} {
  const patterns: Record<string, RegExp> = {
    IN: /^\d{6}$/,
    US: /^\d{5}(-\d{4})?$/,
    UK: /^[A-Z]{1,2}\d[A-Z\d]? \d[A-Z]{2}$/i,
    CA: /^[A-Z]\d[A-Z] \d[A-Z]\d$/i
  };

  const regex = patterns[country.toUpperCase()] || /^\d{4,6}$/;
  const valid = regex.test(postalCode.trim());

  return {
    postalCode,
    country,
    isValidFormat: valid,
    expectedPattern: country === 'IN' ? '6 numeric digits (e.g. 110001)' : 'Standard country postal pattern'
  };
}
