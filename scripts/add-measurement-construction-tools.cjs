const fs = require('fs');
const path = require('path');

const toolsPath = path.join(__dirname, '../public/assets/data/tools.json');
const tools = JSON.parse(fs.readFileSync(toolsPath, 'utf8'));

const existingSlugs = new Set(tools.map(t => t.slug));

const newTools = [
  // --- 📏 Measurement / Conversion Extras ---
  {
    id: 'nautical-mile-km-mile-converter-pro',
    name: 'Nautical Mile ↔ KM / Statute Mile Converter',
    slug: 'nautical-mile-km-mile-converter-pro',
    category: 'measurement-conversions',
    categoryName: 'Measurement & Conversion Extras',
    shortDesc: 'Convert maritime nautical miles (nmi) to kilometers (km) and statute miles (mi).',
    metaTitle: 'Nautical Mile ↔ KM / Statute Mile Converter Online',
    metaDescription: 'Convert aviation and maritime nautical miles (nmi) to kilometers (km) and statute miles (mi).',
    primaryKeyword: 'nautical mile km mile converter online',
    secondaryKeywords: ['convert nautical miles to kilometers', 'maritime nmi to mi calculator', 'knot distance converter'],
    lsiKeywords: ['nautical miles nmi', 'statute miles', 'maritime navigation conversion'],
    inputType: 'number',
    hasFileSupport: false,
    icon: 'RefreshCw',
    related: ['torque-to-horsepower-converter-pro', 'screen-size-viewing-distance-calculator'],
    popular: true
  },
  {
    id: 'torque-to-horsepower-converter-pro',
    name: 'Torque to Horsepower Calculator (RPM Based)',
    slug: 'torque-to-horsepower-converter-pro',
    category: 'measurement-conversions',
    categoryName: 'Measurement & Conversion Extras',
    shortDesc: 'Calculate mechanical Horsepower (HP = Torque × RPM / 5252) and Kilowatts (kW).',
    metaTitle: 'Torque to Horsepower Calculator Online - HP = (Torque × RPM) / 5252',
    metaDescription: 'Calculate mechanical horsepower (HP) and kilowatts (kW) from engine torque (ft-lb) and RPM.',
    primaryKeyword: 'torque to horsepower calculator online',
    secondaryKeywords: ['convert torque and rpm to horsepower', 'hp torque rpm formula solver', 'torque ft lb to hp calculator'],
    lsiKeywords: ['torque foot pounds', 'engine rpm horsepower', '5252 constant formula'],
    inputType: 'text',
    hasFileSupport: false,
    icon: 'RefreshCw',
    related: ['nautical-mile-km-mile-converter-pro', 'paper-weight-gsm-lb-converter-pro'],
    popular: true
  },
  {
    id: 'screen-size-viewing-distance-calculator',
    name: 'Screen Size to Viewing Distance Calculator (THX / 4K)',
    slug: 'screen-size-viewing-distance-calculator',
    category: 'measurement-conversions',
    categoryName: 'Measurement & Conversion Extras',
    shortDesc: 'Calculate optimal TV viewing distance in feet and meters for 1080p and 4K displays.',
    metaTitle: 'Screen Size to Viewing Distance Calculator Online - THX / 4K',
    metaDescription: 'Calculate optimal TV viewing distances in feet and meters based on THX/SMPTE 4K guidelines.',
    primaryKeyword: 'screen size viewing distance calculator online',
    secondaryKeywords: ['optimal tv viewing distance 4k', 'thx screen size distance calculator', 'ideal viewing distance 65 inch tv'],
    lsiKeywords: ['tv screen diagonal inches', 'thx viewing angle', '4k tv viewing distance'],
    inputType: 'number',
    hasFileSupport: false,
    icon: 'RefreshCw',
    related: ['torque-to-horsepower-converter-pro', 'paper-weight-gsm-lb-converter-pro'],
    popular: true
  },
  {
    id: 'paper-weight-gsm-lb-converter-pro',
    name: 'Paper Weight Converter (GSM ↔ LB Text / Cover)',
    slug: 'paper-weight-gsm-lb-converter-pro',
    category: 'measurement-conversions',
    categoryName: 'Measurement & Conversion Extras',
    shortDesc: 'Convert commercial printing paper weight between GSM (g/m²), LB Text, and LB Cover stock.',
    metaTitle: 'Paper Weight Converter Online - GSM, LB Text, LB Cover',
    metaDescription: 'Convert paper weight stock between GSM (grams per sq meter), LB Text, and LB Cover.',
    primaryKeyword: 'paper weight gsm lb converter online',
    secondaryKeywords: ['convert gsm to lb text paper', 'lb cover stock to gsm converter', 'printing paper weight conversion'],
    lsiKeywords: ['paper weight gsm', 'lb text stock', 'lb cover stock'],
    inputType: 'number',
    hasFileSupport: false,
    icon: 'RefreshCw',
    related: ['screen-size-viewing-distance-calculator', 'nautical-mile-km-mile-converter-pro'],
    popular: true
  },

  // --- 🏗️ Construction / Home Extras ---
  {
    id: 'concrete-mix-ratio-calculator-pro',
    name: 'Concrete Mix Ratio & Volume Calculator',
    slug: 'concrete-mix-ratio-calculator-pro',
    category: 'construction-home',
    categoryName: 'Construction & Home Extras',
    shortDesc: 'Calculate required 50kg cement bags, sand, and gravel cubic meters for concrete slab volumes.',
    metaTitle: 'Concrete Mix Ratio & Volume Calculator Online',
    metaDescription: 'Calculate required 50kg cement bags, sand m³, and gravel m³ for concrete slab volumes.',
    primaryKeyword: 'concrete mix ratio calculator online',
    secondaryKeywords: ['calculate cement bags sand gravel concrete', '1 2 4 concrete volume calculator', 'concrete slab material volume solver'],
    lsiKeywords: ['concrete mix 1:2:4', 'cement bags 50kg', 'sand gravel volume m3'],
    inputType: 'text',
    hasFileSupport: false,
    icon: 'Wrench',
    related: ['tile-quantity-wastage-calculator-pro', 'paint-coverage-calculator-pro'],
    popular: true
  },
  {
    id: 'tile-quantity-wastage-calculator-pro',
    name: 'Tile Quantity & Wastage Box Calculator',
    slug: 'tile-quantity-wastage-calculator-pro',
    category: 'construction-home',
    categoryName: 'Construction & Home Extras',
    shortDesc: 'Calculate floor tile count, tile box requirements, and 10% cutting wastage margin.',
    metaTitle: 'Tile Quantity & Wastage Box Calculator Online',
    metaDescription: 'Calculate floor and wall tile count, box counts, and 10% cutting wastage margin.',
    primaryKeyword: 'tile quantity wastage calculator online',
    secondaryKeywords: ['calculate floor tile count wastage', 'tile box count calculator', 'square meter tile requirement solver'],
    lsiKeywords: ['tile dimensions cm', 'tile cutting wastage percentage', 'tile box count'],
    inputType: 'text',
    hasFileSupport: false,
    icon: 'Wrench',
    related: ['concrete-mix-ratio-calculator-pro', 'paint-coverage-calculator-pro'],
    popular: true
  },
  {
    id: 'paint-coverage-calculator-pro',
    name: 'Paint Coverage & Liters Required Calculator',
    slug: 'paint-coverage-calculator-pro',
    category: 'construction-home',
    categoryName: 'Construction & Home Extras',
    shortDesc: 'Calculate required paint volume in liters based on wall surface area (sq ft) and coat count.',
    metaTitle: 'Paint Coverage & Liters Required Calculator Online',
    metaDescription: 'Calculate required paint liters based on wall area (sq ft) and number of coats.',
    primaryKeyword: 'paint coverage calculator online',
    secondaryKeywords: ['calculate paint liters required', 'wall area sq ft paint coverage', 'double coat paint volume solver'],
    lsiKeywords: ['paint coverage sq ft per liter', 'double coat area', 'paint volume liters'],
    inputType: 'text',
    hasFileSupport: false,
    icon: 'Wrench',
    related: ['tile-quantity-wastage-calculator-pro', 'roof-pitch-angle-calculator-pro'],
    popular: true
  },
  {
    id: 'roof-pitch-angle-calculator-pro',
    name: 'Roof Pitch Angle & Slope Percentage Calculator',
    slug: 'roof-pitch-angle-calculator-pro',
    category: 'construction-home',
    categoryName: 'Construction & Home Extras',
    shortDesc: 'Calculate roof pitch angles (degrees), slope percentage %, and rise-to-run ratios (e.g., 6/12).',
    metaTitle: 'Roof Pitch Angle & Slope Percentage Calculator Online',
    metaDescription: 'Calculate roof pitch angle degrees, slope %, and rise-to-run ratios (6/12 pitch).',
    primaryKeyword: 'roof pitch angle calculator online',
    secondaryKeywords: ['convert rise to run to roof pitch degrees', 'roof slope percentage calculator', '6 12 roof pitch angle solver'],
    lsiKeywords: ['rise over run ratio', 'roof pitch degrees', 'slope percentage'],
    inputType: 'text',
    hasFileSupport: false,
    icon: 'Wrench',
    related: ['electrical-wire-gauge-awg-load-calculator-pro', 'paint-coverage-calculator-pro'],
    popular: true
  },
  {
    id: 'electrical-wire-gauge-awg-load-calculator-pro',
    name: 'Electrical Wire Gauge (AWG) Load & Voltage Drop Calculator',
    slug: 'electrical-wire-gauge-awg-load-calculator-pro',
    category: 'construction-home',
    categoryName: 'Construction & Home Extras',
    shortDesc: 'Calculate AWG wire ampacity limits, 80% continuous wattage load, and voltage drop % across wire run lengths.',
    metaTitle: 'Electrical Wire Gauge (AWG) Load & Voltage Drop Calculator',
    metaDescription: 'Calculate AWG wire ampacity limits, continuous wattage capacity, and voltage drop %.',
    primaryKeyword: 'electrical wire gauge awg load calculator online',
    secondaryKeywords: ['awg wire ampacity calculator', 'voltage drop percentage wire run', '12 awg 14 awg max wattage solver'],
    lsiKeywords: ['awg wire ampacity', 'voltage drop percentage', 'continuous wattage load'],
    inputType: 'text',
    hasFileSupport: false,
    icon: 'Wrench',
    related: ['roof-pitch-angle-calculator-pro', 'concrete-mix-ratio-calculator-pro'],
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
