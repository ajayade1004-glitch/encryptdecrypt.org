/**
 * 100% Client-Side Language, Test Prep, Agriculture & Tax Reference Engines.
 * Pure static reference tables, linguistic patterns, and formula solvers.
 */

// ==========================================
// 1. LANGUAGE & LINGUISTICS ENGINES
// ==========================================

export function convertNatoPhonetic(text: string): {
  originalText: string;
  natoSpelling: string[];
  natoFormatted: string;
} {
  const natoMap: Record<string, string> = {
    A: 'Alpha', B: 'Bravo', C: 'Charlie', D: 'Delta', E: 'Echo', F: 'Foxtrot', G: 'Golf',
    H: 'Hotel', I: 'India', J: 'Juliet', K: 'Kilo', L: 'Lima', M: 'Mike', N: 'November',
    O: 'Oscar', P: 'Papa', Q: 'Quebec', R: 'Romeo', S: 'Sierra', T: 'Tango', U: 'Uniform',
    V: 'Victor', W: 'Whiskey', X: 'X-ray', Y: 'Yankee', Z: 'Zulu',
    '0': 'Zero', '1': 'One', '2': 'Two', '3': 'Three', '4': 'Four', '5': 'Five',
    '6': 'Six', '7': 'Seven', '8': 'Eight', '9': 'Nine'
  };

  const words = text.toUpperCase().split('');
  const spelling: string[] = [];

  words.forEach(ch => {
    if (natoMap[ch]) spelling.push(natoMap[ch]);
    else if (ch === ' ') spelling.push('[Space]');
    else spelling.push(ch);
  });

  return {
    originalText: text,
    natoSpelling: spelling,
    natoFormatted: spelling.join(' · ')
  };
}

export function detectLanguagePattern(text: string): {
  detectedLanguage: string;
  confidencePercent: number;
  scriptType: string;
} {
  const clean = text.trim();
  if (!clean) return { detectedLanguage: 'Unknown', confidencePercent: 0, scriptType: 'None' };

  if (/[\u0900-\u097F]/.test(clean)) return { detectedLanguage: 'Hindi / Devanagari', confidencePercent: 98, scriptType: 'Devanagari' };
  if (/[\u0600-\u06FF]/.test(clean)) return { detectedLanguage: 'Arabic / Persian', confidencePercent: 95, scriptType: 'Arabic' };
  if (/[\u4E00-\u9FFF]/.test(clean)) return { detectedLanguage: 'Chinese (Hanzi)', confidencePercent: 96, scriptType: 'Hanzi' };
  if (/[\u3040-\u30FF]/.test(clean)) return { detectedLanguage: 'Japanese (Hiragana/Katakana)', confidencePercent: 97, scriptType: 'Kana' };
  if (/[\u0400-\u04FF]/.test(clean)) return { detectedLanguage: 'Russian / Cyrillic', confidencePercent: 95, scriptType: 'Cyrillic' };
  if (/[éèàçùâêîôûëïü]/.test(clean.toLowerCase())) return { detectedLanguage: 'French', confidencePercent: 90, scriptType: 'Latin Accented' };
  if (/[ñáéíóúü]/.test(clean.toLowerCase())) return { detectedLanguage: 'Spanish', confidencePercent: 90, scriptType: 'Latin Accented' };

  return { detectedLanguage: 'English / Latin Script', confidencePercent: 88, scriptType: 'Latin' };
}

export function convertBrailleAlphabet(text: string): {
  brailleUnicode: string;
  brailleDotNotation: string;
} {
  const brailleMap: Record<string, string> = {
    a: '⠁', b: '⠃', c: '⠉', d: '⠙', e: '⠑', f: '⠋', g: '⠛', h: '⠪', i: '⠊', j: '⠚',
    k: '⠅', l: '⠇', m: '⠍', n: '⠝', o: '⠕', p: '⠏', q: '⠟', r: '⠗', s: '⠎', t: '⠞',
    u: '⠥', v: '⠧', w: '⠺', x: '⠭', y: '⠽', z: '⠵', ' ': ' '
  };

  const lower = text.toLowerCase();
  let result = '';
  for (const ch of lower) {
    result += brailleMap[ch] || ch;
  }

  return {
    brailleUnicode: result,
    brailleDotNotation: 'Unified English Braille (UEB) Grade 1 Standard'
  };
}

export function findStaticRhymes(word: string): {
  word: string;
  perfectRhymes: string[];
  slantRhymes: string[];
} {
  const clean = word.trim().toLowerCase();
  const db: Record<string, { perfect: string[]; slant: string[] }> = {
    code: { perfect: ['mode', 'node', 'load', 'road', 'abode'], slant: ['coat', 'boat', 'cold', 'bold'] },
    light: { perfect: ['night', 'sight', 'bright', 'flight', 'kite'], slant: ['like', 'bike', 'life'] },
    data: { perfect: ['strata', 'beta'], slant: ['state', 'gate', 'later'] }
  };

  if (db[clean]) {
    return { word: clean, perfectRhymes: db[clean].perfect, slantRhymes: db[clean].slant };
  }

  const ending = clean.slice(-3);
  return {
    word: clean,
    perfectRhymes: [`sample_${ending}1`, `sample_${ending}2`, `example_${ending}`],
    slantRhymes: [`near_${ending}`, `approx_${ending}`]
  };
}

// ==========================================
// 2. STANDARDIZED TEST PREP ENGINES
// ==========================================

export function convertSatActScore(satScore = 1350): {
  satScore: number;
  equivalentActScore: number;
  percentileRank: string;
} {
  let act = 16;
  let perc = '50th Percentile';

  if (satScore >= 1570) { act = 36; perc = '99th+ Percentile'; }
  else if (satScore >= 1530) { act = 35; perc = '99th Percentile'; }
  else if (satScore >= 1490) { act = 34; perc = '98th Percentile'; }
  else if (satScore >= 1450) { act = 33; perc = '96th Percentile'; }
  else if (satScore >= 1400) { act = 31; perc = '93rd Percentile'; }
  else if (satScore >= 1350) { act = 29; perc = '90th Percentile'; }
  else if (satScore >= 1200) { act = 25; perc = '74th Percentile'; }
  else { act = 20; perc = '50th Percentile'; }

  return { satScore, equivalentActScore: act, percentileRank: perc };
}

export function calculateIeltsToeflScore(ieltsBand = 7.5): {
  ieltsBand: number;
  equivalentToeflIbtScore: string;
  cefrLevel: string;
} {
  let toefl = '0-31';
  let cefr = 'B1';

  if (ieltsBand >= 8.5) { toefl = '115-120'; cefr = 'C2 Mastery'; }
  else if (ieltsBand >= 8.0) { toefl = '110-114'; cefr = 'C1 Advanced'; }
  else if (ieltsBand >= 7.5) { toefl = '102-109'; cefr = 'C1 Advanced'; }
  else if (ieltsBand >= 7.0) { toefl = '94-101'; cefr = 'C1 Advanced'; }
  else if (ieltsBand >= 6.5) { toefl = '79-93'; cefr = 'B2 Vantage'; }
  else { toefl = '60-78'; cefr = 'B1 Threshold'; }

  return { ieltsBand, equivalentToeflIbtScore: toefl, cefrLevel: cefr };
}

export function calculateCurveGrading(scores: number[] = [65, 72, 80, 88, 95]): {
  originalMean: number;
  originalStdDev: number;
  curvedScores: Array<{ raw: number; curvedGrade: string; curvedScore: number }>;
} {
  const n = scores.length;
  const mean = scores.reduce((sum, s) => sum + s, 0) / n;
  const variance = scores.reduce((sum, s) => sum + Math.pow(s - mean, 2), 0) / n;
  const stdDev = Math.sqrt(variance);

  const curved = scores.map(raw => {
    const z = (raw - mean) / (stdDev || 1);
    const cScore = Math.min(100, Math.round(75 + z * 10)); // Curve mean to 75
    let grade = 'C';
    if (cScore >= 90) grade = 'A';
    else if (cScore >= 80) grade = 'B';
    else if (cScore >= 70) grade = 'C';
    else if (cScore >= 60) grade = 'D';
    else grade = 'F';

    return { raw, curvedGrade: grade, curvedScore: cScore };
  });

  return {
    originalMean: parseFloat(mean.toFixed(1)),
    originalStdDev: parseFloat(stdDev.toFixed(1)),
    curvedScores: curved
  };
}

// ==========================================
// 3. AGRICULTURE & GARDENING ENGINES
// ==========================================

export function calculateCropYield(areaAcres = 10, plantDensityPerAcre = 28000, avgYieldPerPlantKg = 0.15): {
  totalYieldKg: number;
  totalYieldTons: number;
  yieldPerAcreKg: number;
} {
  const perAcre = plantDensityPerAcre * avgYieldPerPlantKg;
  const totalKg = perAcre * areaAcres;

  return {
    totalYieldKg: Math.round(totalKg),
    totalYieldTons: parseFloat((totalKg / 1000).toFixed(2)),
    yieldPerAcreKg: Math.round(perAcre)
  };
}

export function calculateNpkFertilizer(nitrogenReqKg = 50, nRatio = 10, pRatio = 26, kRatio = 26): {
  totalFertilizerKgNeeded: number;
  nitrogenProvidedKg: number;
  phosphorusProvidedKg: number;
  potassiumProvidedKg: number;
} {
  const totalKg = (nitrogenReqKg * 100) / nRatio;
  const pKg = (totalKg * pRatio) / 100;
  const kKg = (totalKg * kRatio) / 100;

  return {
    totalFertilizerKgNeeded: Math.round(totalKg),
    nitrogenProvidedKg: nitrogenReqKg,
    phosphorusProvidedKg: Math.round(pKg),
    potassiumProvidedKg: Math.round(kKg)
  };
}

export function calculateIrrigationRequirement(fieldAreaSqM = 5000, cropEvapotranspirationMmPerDay = 5.5, days = 7): {
  totalWaterLitersNeeded: number;
  totalWaterCubicMeters: number;
  irrigationHoursAt50Lpm: number;
} {
  const depthMeters = (cropEvapotranspirationMmPerDay * days) / 1000;
  const totalLiters = fieldAreaSqM * depthMeters * 1000;
  const hours = totalLiters / (50 * 60);

  return {
    totalWaterLitersNeeded: Math.round(totalLiters),
    totalWaterCubicMeters: Math.round(totalLiters / 1000),
    irrigationHoursAt50Lpm: parseFloat(hours.toFixed(1))
  };
}

// ==========================================
// 4. TAX & GOVERNMENT REFERENCE (STATIC)
// ==========================================

export function calculateTaxBrackets(taxableIncome = 75000, region: 'US_SINGLE' | 'INDIA_NEW' = 'US_SINGLE'): {
  taxableIncome: number;
  totalTaxOwed: number;
  effectiveTaxRatePercent: number;
  marginalTaxBracketPercent: number;
} {
  let tax = 0;
  let marginal = 10;

  if (region === 'US_SINGLE') {
    if (taxableIncome <= 11600) { tax = taxableIncome * 0.10; marginal = 10; }
    else if (taxableIncome <= 47150) { tax = 1160 + (taxableIncome - 11600) * 0.12; marginal = 12; }
    else if (taxableIncome <= 100525) { tax = 5426 + (taxableIncome - 47150) * 0.22; marginal = 22; }
    else { tax = 17168.5 + (taxableIncome - 100525) * 0.24; marginal = 24; }
  } else {
    // India New Slab
    if (taxableIncome <= 300000) { tax = 0; marginal = 0; }
    else if (taxableIncome <= 700000) { tax = (taxableIncome - 300000) * 0.05; marginal = 5; }
    else if (taxableIncome <= 1000000) { tax = 20000 + (taxableIncome - 700000) * 0.10; marginal = 10; }
    else { tax = 50000 + (taxableIncome - 1000000) * 0.15; marginal = 15; }
  }

  const effective = (tax / taxableIncome) * 100;

  return {
    taxableIncome,
    totalTaxOwed: Math.round(tax),
    effectiveTaxRatePercent: parseFloat(effective.toFixed(2)),
    marginalTaxBracketPercent: marginal
  };
}

export function calculatePropertyDepreciation(assetValue = 100000, salvageValue = 10000, usefulLifeYears = 10): {
  straightLineAnnualDepreciation: number;
  straightLineAccumulatedYear5: number;
  reducingBalanceYear1Depreciation: number;
} {
  const slAnnual = (assetValue - salvageValue) / usefulLifeYears;
  const slYear5 = slAnnual * 5;
  const rate = 2 / usefulLifeYears; // Double declining
  const dbYear1 = assetValue * rate;

  return {
    straightLineAnnualDepreciation: Math.round(slAnnual),
    straightLineAccumulatedYear5: Math.round(slYear5),
    reducingBalanceYear1Depreciation: Math.round(dbYear1)
  };
}

export function calculateReverseVat(totalAmountWithVat = 118, vatRatePercent = 18): {
  netAmountBeforeVat: number;
  vatAmountIncluded: number;
  totalGrossAmount: number;
} {
  const net = totalAmountWithVat / (1 + vatRatePercent / 100);
  const vat = totalAmountWithVat - net;

  return {
    netAmountBeforeVat: parseFloat(net.toFixed(2)),
    vatAmountIncluded: parseFloat(vat.toFixed(2)),
    totalGrossAmount: totalAmountWithVat
  };
}
