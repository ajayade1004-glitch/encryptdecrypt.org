const fs = require('fs');
const path = require('path');

const toolsPath = path.join(__dirname, '../public/assets/data/tools.json');
const tools = JSON.parse(fs.readFileSync(toolsPath, 'utf8'));

const existingSlugs = new Set(tools.map(t => t.slug));

const newTools = [
  // --- 🗣️ Language & Linguistics ---
  {
    id: 'phonetic-alphabet-converter-nato',
    name: 'Phonetic Alphabet Converter (NATO Standard)',
    slug: 'phonetic-alphabet-converter-nato',
    category: 'language-linguistics',
    categoryName: 'Language & Linguistics',
    shortDesc: 'Convert alphanumeric text into ICAO / NATO phonetic radio spelling (Alpha, Bravo, Charlie).',
    metaTitle: 'Phonetic Alphabet Converter Online - NATO & ICAO Radio Spelling',
    metaDescription: 'Spell out text using NATO / ICAO phonetic aviation alphabet words (Alpha, Bravo, Charlie).',
    primaryKeyword: 'phonetic alphabet converter nato online',
    secondaryKeywords: ['nato radio spelling converter', 'icao aviation alphabet generator', 'spell word nato phonetic'],
    lsiKeywords: ['nato phonetic alphabet', 'alpha bravo charlie', 'aviation radio spelling'],
    inputType: 'text',
    hasFileSupport: false,
    icon: 'MessageSquare',
    related: ['braille-alphabet-converter', 'language-pattern-detector'],
    popular: true
  },
  {
    id: 'language-pattern-detector',
    name: 'Language & Script Pattern Detector (Offline)',
    slug: 'language-pattern-detector',
    category: 'language-linguistics',
    categoryName: 'Language & Linguistics',
    shortDesc: 'Detect script types (Devanagari, Latin, Hanzi, Cyrillic) and language families offline via character patterns.',
    metaTitle: 'Language & Script Pattern Detector Online - 100% Offline',
    metaDescription: 'Detect Unicode script families (Devanagari, Hanzi, Cyrillic, Latin) without cloud network calls.',
    primaryKeyword: 'language pattern detector online',
    secondaryKeywords: ['detect unicode script family', 'offline language detector tool', 'devanagari hanzi script checker'],
    lsiKeywords: ['unicode character range', 'script pattern detection', 'offline language identification'],
    inputType: 'text',
    hasFileSupport: false,
    icon: 'MessageSquare',
    related: ['phonetic-alphabet-converter-nato', 'braille-alphabet-converter'],
    popular: true
  },
  {
    id: 'braille-alphabet-converter',
    name: 'Braille Alphabet Converter (UEB Grade 1)',
    slug: 'braille-alphabet-converter',
    category: 'language-linguistics',
    categoryName: 'Language & Linguistics',
    shortDesc: 'Convert English text into Unified English Braille (UEB) Unicode cell characters.',
    metaTitle: 'Braille Alphabet Converter Online - UEB Grade 1 Unicode',
    metaDescription: 'Translate English text into Unified English Braille (UEB) Unicode cell characters online.',
    primaryKeyword: 'braille alphabet converter online',
    secondaryKeywords: ['text to braille unicode translator', 'ueb grade 1 braille converter', 'braille dot generator'],
    lsiKeywords: ['unified english braille ueb', 'braille unicode cell', 'tactile writing system'],
    inputType: 'text',
    hasFileSupport: false,
    icon: 'MessageSquare',
    related: ['phonetic-alphabet-converter-nato', 'rhyme-finder-dictionary'],
    popular: true
  },
  {
    id: 'rhyme-finder-dictionary',
    name: 'Rhyme Finder & Slant Rhyme Dictionary',
    slug: 'rhyme-finder-dictionary',
    category: 'language-linguistics',
    categoryName: 'Language & Linguistics',
    shortDesc: 'Find perfect rhymes, slant rhymes, and assonance syllable matches for poetry and songwriting.',
    metaTitle: 'Rhyme Finder & Slant Rhyme Dictionary Online - Songs & Poetry',
    metaDescription: 'Find perfect and slant rhymes for lyrics, poetry, and creative writing using offline dictionaries.',
    primaryKeyword: 'rhyme finder dictionary online',
    secondaryKeywords: ['slant rhyme dictionary online', 'poetry rhyming dictionary', 'songwriting rhyme generator'],
    lsiKeywords: ['perfect rhyme slant rhyme', 'phonetic assonance', 'lyric writing assistant'],
    inputType: 'text',
    hasFileSupport: false,
    icon: 'MessageSquare',
    related: ['phonetic-alphabet-converter-nato', 'braille-alphabet-converter'],
    popular: true
  },

  // --- 🎓 Standardized Test Prep ---
  {
    id: 'sat-act-score-converter',
    name: 'SAT ↔ ACT Score Concordance Converter',
    slug: 'sat-act-score-converter',
    category: 'test-prep',
    categoryName: 'Standardized Test Prep',
    shortDesc: 'Convert official College Board SAT composite scores to ACT composite equivalents and percentile ranks.',
    metaTitle: 'SAT ↔ ACT Score Concordance Converter Online - Percentiles',
    metaDescription: 'Convert SAT total scores (400-1600) to equivalent ACT composite scores (1-36) and national percentiles.',
    primaryKeyword: 'sat act score converter online',
    secondaryKeywords: ['sat to act concordance table', 'convert sat score to act composite', 'college board sat act percentile'],
    lsiKeywords: ['sat act concordance', 'national percentile rank', 'college admissions test'],
    inputType: 'number',
    hasFileSupport: false,
    icon: 'BookOpen',
    related: ['ielts-toefl-score-calculator', 'curve-grading-calculator'],
    popular: true
  },
  {
    id: 'ielts-toefl-score-calculator',
    name: 'IELTS ↔ TOEFL Band Score & CEFR Converter',
    slug: 'ielts-toefl-score-calculator',
    category: 'test-prep',
    categoryName: 'Standardized Test Prep',
    shortDesc: 'Map IELTS band scores (0-9) to TOEFL iBT score ranges (0-120) and CEFR language framework levels.',
    metaTitle: 'IELTS ↔ TOEFL Band Score & CEFR Converter Online',
    metaDescription: 'Convert IELTS overall band scores to equivalent TOEFL iBT score ranges and CEFR levels (B2, C1, C2).',
    primaryKeyword: 'ielts toefl score calculator online',
    secondaryKeywords: ['ielts to toefl score conversion', 'cefr level ielts converter', 'toefl ibt score to ielts band'],
    lsiKeywords: ['ielts overall band score', 'toefl ibt score range', 'cefr language framework'],
    inputType: 'number',
    hasFileSupport: false,
    icon: 'BookOpen',
    related: ['sat-act-score-converter', 'curve-grading-calculator'],
    popular: true
  },
  {
    id: 'curve-grading-calculator',
    name: 'Curve Grading Calculator (Bell Curve Normalization)',
    slug: 'curve-grading-calculator',
    category: 'test-prep',
    categoryName: 'Standardized Test Prep',
    shortDesc: 'Apply standard deviation bell curve grading to exam raw scores to adjust class mean and letter grades.',
    metaTitle: 'Curve Grading Calculator Online - Bell Curve Normalization',
    metaDescription: 'Normalize test raw scores using mean and standard deviation bell curve grading models.',
    primaryKeyword: 'curve grading calculator online',
    secondaryKeywords: ['bell curve grade calculator', 'test score curve solver', 'standard deviation grade curve'],
    lsiKeywords: ['bell curve normalization', 'class mean standard deviation', 'curved letter grades'],
    inputType: 'text',
    hasFileSupport: false,
    icon: 'BookOpen',
    related: ['sat-act-score-converter', 'ielts-toefl-score-calculator'],
    popular: true
  },

  // --- 🌾 Agriculture & Gardening ---
  {
    id: 'crop-yield-estimator',
    name: 'Crop Yield Estimator (Area × Density)',
    slug: 'crop-yield-estimator',
    category: 'agriculture-gardening',
    categoryName: 'Agriculture & Gardening',
    shortDesc: 'Estimate total harvest crop yields in kilograms and metric tons from field area and planting density.',
    metaTitle: 'Crop Yield Estimator Online - Harvest Area & Density',
    metaDescription: 'Calculate total agricultural crop yield harvest predictions based on acreage and plant density.',
    primaryKeyword: 'crop yield estimator online',
    secondaryKeywords: ['calculate harvest yield per acre', 'crop density yield solver', 'farm harvest yield calculator'],
    lsiKeywords: ['yield per acre kg', 'plant population density', 'harvest yield prediction'],
    inputType: 'text',
    hasFileSupport: false,
    icon: 'Sprout',
    related: ['fertilizer-npk-ratio-calculator', 'irrigation-water-calculator'],
    popular: true
  },
  {
    id: 'fertilizer-npk-ratio-calculator',
    name: 'Fertilizer NPK Ratio & Application Calculator',
    slug: 'fertilizer-npk-ratio-calculator',
    category: 'agriculture-gardening',
    categoryName: 'Agriculture & Gardening',
    shortDesc: 'Calculate required bulk fertilizer application weight from target Nitrogen (N), Phosphorus (P), and Potassium (K) ratios.',
    metaTitle: 'Fertilizer NPK Ratio Calculator Online - Application Rate',
    metaDescription: 'Calculate required fertilizer product weight to supply target Nitrogen, Phosphorus, and Potassium requirements.',
    primaryKeyword: 'fertilizer npk ratio calculator online',
    secondaryKeywords: ['npk ratio fertilizer application rate', 'calculate fertilizer pounds per acre', 'nitrogen requirement solver'],
    lsiKeywords: ['npk percentage ratio', 'elemental nitrogen phosphorus potassium', 'fertilizer dose calculation'],
    inputType: 'text',
    hasFileSupport: false,
    icon: 'Sprout',
    related: ['crop-yield-estimator', 'irrigation-water-calculator'],
    popular: true
  },
  {
    id: 'irrigation-water-calculator',
    name: 'Irrigation Water Requirement Calculator',
    slug: 'irrigation-water-calculator',
    category: 'agriculture-gardening',
    categoryName: 'Agriculture & Gardening',
    shortDesc: 'Calculate total crop irrigation water volume in liters, cubic meters, and pumping hours from evapotranspiration rates.',
    metaTitle: 'Irrigation Water Requirement Calculator Online - Crop Liters',
    metaDescription: 'Calculate irrigation water volume requirements in liters and pump run hours based on evapotranspiration.',
    primaryKeyword: 'irrigation water requirement calculator online',
    secondaryKeywords: ['crop evapotranspiration water calculator', 'farm irrigation liters solver', 'water pumping hours calculator'],
    lsiKeywords: ['crop evapotranspiration eto', 'irrigation volume liters', 'pump flow rate lpm'],
    inputType: 'text',
    hasFileSupport: false,
    icon: 'Sprout',
    related: ['crop-yield-estimator', 'fertilizer-npk-ratio-calculator'],
    popular: true
  },

  // --- 🧾 Tax & Government Reference ---
  {
    id: 'income-tax-bracket-calculator',
    name: 'Income Tax Bracket Calculator (Static Slabs)',
    slug: 'income-tax-bracket-calculator',
    category: 'tax-reference',
    categoryName: 'Tax & Financial Reference',
    shortDesc: 'Calculate total tax owed, effective tax rate, and marginal tax bracket using static income tax slabs.',
    metaTitle: 'Income Tax Bracket Calculator Online - Effective & Marginal Rate',
    metaDescription: 'Calculate estimated income tax liability, effective rate %, and marginal bracket using reference slabs.',
    primaryKeyword: 'income tax bracket calculator online',
    secondaryKeywords: ['effective tax rate calculator', 'marginal tax bracket solver', 'progressive tax slab calculator'],
    lsiKeywords: ['progressive tax brackets', 'effective tax rate', 'marginal tax rate'],
    inputType: 'number',
    hasFileSupport: false,
    icon: 'Receipt',
    related: ['property-depreciation-calculator', 'vat-sales-tax-reverse-calculator'],
    popular: true
  },
  {
    id: 'property-depreciation-calculator',
    name: 'Property & Asset Depreciation Calculator',
    slug: 'property-depreciation-calculator',
    category: 'tax-reference',
    categoryName: 'Tax & Financial Reference',
    shortDesc: 'Calculate annual asset depreciation using Straight-Line and Double Declining Balance methods.',
    metaTitle: 'Property & Asset Depreciation Calculator Online - Straight-Line',
    metaDescription: 'Compute annual asset depreciation schedules using Straight-Line and Reducing Balance accounting methods.',
    primaryKeyword: 'property depreciation calculator online',
    secondaryKeywords: ['straight line depreciation solver', 'reducing balance depreciation calculator', 'asset salvage value depreciation'],
    lsiKeywords: ['straight line method', 'double declining balance', 'accumulated depreciation'],
    inputType: 'text',
    hasFileSupport: false,
    icon: 'Receipt',
    related: ['income-tax-bracket-calculator', 'vat-sales-tax-reverse-calculator'],
    popular: true
  },
  {
    id: 'vat-sales-tax-reverse-calculator',
    name: 'VAT & Sales Tax Reverse Calculator',
    slug: 'vat-sales-tax-reverse-calculator',
    category: 'tax-reference',
    categoryName: 'Tax & Financial Reference',
    shortDesc: 'Extract net amount before tax and total tax included from gross price tags.',
    metaTitle: 'VAT & Sales Tax Reverse Calculator Online - Extract Net Price',
    metaDescription: 'Calculate net price before VAT/sales tax and exact tax amount included in gross total price tags.',
    primaryKeyword: 'vat sales tax reverse calculator online',
    secondaryKeywords: ['reverse vat calculator', 'extract tax from total price', 'calculate net price before tax'],
    lsiKeywords: ['gross price gross vat', 'net price calculation', 'vat rate percentage'],
    inputType: 'number',
    hasFileSupport: false,
    icon: 'Receipt',
    related: ['income-tax-bracket-calculator', 'property-depreciation-calculator'],
    popular: true
  }
];

let addedCount = 0;
newTools.forEach(tool => {
  if (!existingSlugs.has(tool.slug)) {
    tools.push(tool);
    existingSlugs.add(tool.slug);
    addedCount++;
  }
});

fs.writeFileSync(toolsPath, JSON.stringify(tools, null, 2), 'utf8');
console.log(`Successfully added ${addedCount} new tools. Total tools count: ${tools.length}`);
