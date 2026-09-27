const fs = require('fs');
const path = require('path');

const toolsPath = path.join(__dirname, '../public/assets/data/tools.json');
const tools = JSON.parse(fs.readFileSync(toolsPath, 'utf8'));

const existingSlugs = new Set(tools.map(t => t.slug));

const newTools = [
  // --- 🧑🍳 Food & Nutrition Reference ---
  {
    id: 'recipe-cost-per-serving-calculator',
    name: 'Recipe Cost Per Serving Calculator',
    slug: 'recipe-cost-per-serving-calculator',
    category: 'food-nutrition',
    categoryName: 'Food & Nutrition Reference',
    shortDesc: 'Calculate total recipe costs and individual portion cost per serving for meal planning and catering.',
    metaTitle: 'Recipe Cost Per Serving Calculator Online - Culinary Costing',
    metaDescription: 'Calculate total recipe ingredient costs and per-serving portion costs.',
    primaryKeyword: 'recipe cost per serving calculator online',
    secondaryKeywords: ['calculate portion cost per serving', 'recipe ingredient cost calculator', 'catering meal cost calculator'],
    lsiKeywords: ['recipe ingredient costing', 'portion cost per serving', 'food cost percentage'],
    inputType: 'text',
    hasFileSupport: false,
    icon: 'Coffee',
    related: ['alcohol-proof-abv-converter-pro', 'coffee-to-water-ratio-calculator-pro'],
    popular: true
  },
  {
    id: 'alcohol-proof-abv-converter-pro',
    name: 'Alcohol Proof ↔ ABV (Alcohol By Volume) Converter',
    slug: 'alcohol-proof-abv-converter-pro',
    category: 'food-nutrition',
    categoryName: 'Food & Nutrition Reference',
    shortDesc: 'Convert liquor strength between Alcohol By Volume (ABV %), US Proof, and UK Proof.',
    metaTitle: 'Alcohol Proof ↔ ABV (Alcohol By Volume) Converter Online',
    metaDescription: 'Convert alcohol strength between ABV percentage, US Proof (2x ABV), and UK Proof.',
    primaryKeyword: 'alcohol proof abv converter online',
    secondaryKeywords: ['convert abv to proof us uk', 'liquor strength proof converter', 'alcohol by volume to proof calculator'],
    lsiKeywords: ['alcohol by volume abv', 'us proof uk proof', 'liquor alcohol strength'],
    inputType: 'number',
    hasFileSupport: false,
    icon: 'Coffee',
    related: ['recipe-cost-per-serving-calculator', 'coffee-to-water-ratio-calculator-pro'],
    popular: true
  },
  {
    id: 'coffee-to-water-ratio-calculator-pro',
    name: 'Coffee-to-Water Brew Ratio Calculator',
    slug: 'coffee-to-water-ratio-calculator-pro',
    category: 'food-nutrition',
    categoryName: 'Food & Nutrition Reference',
    shortDesc: 'Calculate precise coffee dose (grams) and water volume (ml) by brew method (Pour Over, French Press, Espresso).',
    metaTitle: 'Coffee-to-Water Brew Ratio Calculator Online',
    metaDescription: 'Calculate exact coffee dose (grams) and water volume (ml) for Pour-Over, French Press, and Espresso.',
    primaryKeyword: 'coffee to water ratio calculator online',
    secondaryKeywords: ['calculate coffee brew ratio grams ml', 'pour over french press coffee calculator', 'espresso coffee to water ratio'],
    lsiKeywords: ['coffee dose grams', 'water volume ml', 'brew ratio 1 to 16'],
    inputType: 'text',
    hasFileSupport: false,
    icon: 'Coffee',
    related: ['recipe-cost-per-serving-calculator', 'alcohol-proof-abv-converter-pro'],
    popular: true
  },

  // --- 🎓 Academic & Research Extras ---
  {
    id: 'survey-sample-size-calculator-pro',
    name: 'Survey Research Sample Size Calculator (Cochran)',
    slug: 'survey-sample-size-calculator-pro',
    category: 'academic-research',
    categoryName: 'Academic & Research Extras',
    shortDesc: 'Calculate statistically representative survey sample sizes using Cochran\'s formula and 95%/99% confidence.',
    metaTitle: 'Survey Research Sample Size Calculator Online - Cochran Formula',
    metaDescription: 'Calculate statistically valid survey sample sizes from population size, margin of error, and confidence level.',
    primaryKeyword: 'survey sample size calculator online',
    secondaryKeywords: ['cochran sample size formula calculator', 'margin of error sample size solver', 'academic survey sample size calculator'],
    lsiKeywords: ['cochran sample size formula', 'margin of error percentage', 'confidence level 95 percent'],
    inputType: 'text',
    hasFileSupport: false,
    icon: 'GraduationCap',
    related: ['likert-scale-score-aggregator-pro', 'economic-order-quantity-eoq-calculator-pro'],
    popular: true
  },
  {
    id: 'likert-scale-score-aggregator-pro',
    name: 'Likert Scale Score Aggregator & Mean Calculator',
    slug: 'likert-scale-score-aggregator-pro',
    category: 'academic-research',
    categoryName: 'Academic & Research Extras',
    shortDesc: 'Aggregate survey Likert scale ratings (1-5 / 1-7) to compute mean scores, median, and positive sentiment %.',
    metaTitle: 'Likert Scale Score Aggregator & Mean Calculator Online',
    metaDescription: 'Aggregate survey Likert scale ratings to calculate mean scores, medians, and positive agreement %.',
    primaryKeyword: 'likert scale score aggregator online',
    secondaryKeywords: ['calculate likert scale mean score', 'survey likert scale percentage calculator', 'aggregate 5 point likert ratings'],
    lsiKeywords: ['likert scale mean median', '5 point likert ratings', 'positive agreement percentage'],
    inputType: 'text',
    hasFileSupport: false,
    icon: 'GraduationCap',
    related: ['survey-sample-size-calculator-pro', 'economic-order-quantity-eoq-calculator-pro'],
    popular: true
  },

  // --- 🚚 Logistics & Supply Chain ---
  {
    id: 'container-loading-volume-cbm-calculator',
    name: 'Container Loading Volume (CBM) Calculator',
    slug: 'container-loading-volume-cbm-calculator',
    category: 'logistics-supply-chain',
    categoryName: 'Logistics & Supply Chain',
    shortDesc: 'Calculate total shipment volume in Cubic Meters (CBM) and 20ft container space utilization %.',
    metaTitle: 'Container Loading Volume (CBM) Calculator Online',
    metaDescription: 'Calculate carton CBM volume and 20ft/40ft shipping container capacity utilization.',
    primaryKeyword: 'container loading volume cbm calculator online',
    secondaryKeywords: ['calculate shipping carton cbm volume', '20ft container utilization calculator', 'cubic meter cargo calculator'],
    lsiKeywords: ['cubic meters cbm', '20ft container capacity', 'carton dimensions cbm'],
    inputType: 'text',
    hasFileSupport: false,
    icon: 'Briefcase',
    related: ['dimensional-weight-shipping-calculator-pro', 'economic-order-quantity-eoq-calculator-pro'],
    popular: true
  },
  {
    id: 'dimensional-weight-shipping-calculator-pro',
    name: 'Shipping Dimensional Weight vs Actual Weight Calculator',
    slug: 'dimensional-weight-shipping-calculator-pro',
    category: 'logistics-supply-chain',
    categoryName: 'Logistics & Supply Chain',
    shortDesc: 'Calculate dimensional volumetric freight weight (L × W × H / 139) vs actual weight to identify billable weight.',
    metaTitle: 'Shipping Dimensional Weight vs Actual Weight Calculator Online',
    metaDescription: 'Calculate volumetric dimensional weight vs actual weight for FedEx, UPS, and air freight shipments.',
    primaryKeyword: 'dimensional weight shipping calculator online',
    secondaryKeywords: ['calculate dimensional weight fedex ups', 'volumetric weight vs actual weight calculator', 'billable shipping weight solver'],
    lsiKeywords: ['dimensional weight formula', 'dim factor 139', 'billable freight weight'],
    inputType: 'text',
    hasFileSupport: false,
    icon: 'Briefcase',
    related: ['container-loading-volume-cbm-calculator', 'safety-stock-reorder-point-calculator-pro'],
    popular: true
  },
  {
    id: 'economic-order-quantity-eoq-calculator-pro',
    name: 'Economic Order Quantity (EOQ) Inventory Calculator',
    slug: 'economic-order-quantity-eoq-calculator-pro',
    category: 'logistics-supply-chain',
    categoryName: 'Logistics & Supply Chain',
    shortDesc: 'Calculate optimal Economic Order Quantity (EOQ = √(2DS / H)) to minimize ordering and holding costs.',
    metaTitle: 'Economic Order Quantity (EOQ) Inventory Calculator Online',
    metaDescription: 'Calculate Economic Order Quantity (EOQ) to optimize inventory batch ordering and holding costs.',
    primaryKeyword: 'economic order quantity eoq calculator online',
    secondaryKeywords: ['calculate eoq inventory batch size', 'minimize ordering and holding costs solver', 'eoq formula calculator'],
    lsiKeywords: ['economic order quantity eoq', 'annual demand units', 'holding cost per unit'],
    inputType: 'text',
    hasFileSupport: false,
    icon: 'Briefcase',
    related: ['safety-stock-reorder-point-calculator-pro', 'container-loading-volume-cbm-calculator'],
    popular: true
  },
  {
    id: 'safety-stock-reorder-point-calculator-pro',
    name: 'Safety Stock & Reorder Point (ROP) Calculator',
    slug: 'safety-stock-reorder-point-calculator-pro',
    category: 'logistics-supply-chain',
    categoryName: 'Logistics & Supply Chain',
    shortDesc: 'Calculate buffer safety stock and reorder point (ROP) inventory levels to prevent supply stockouts.',
    metaTitle: 'Safety Stock & Reorder Point (ROP) Calculator Online',
    metaDescription: 'Calculate safety stock buffer levels and inventory reorder points (ROP) to avoid stockouts.',
    primaryKeyword: 'safety stock reorder point calculator online',
    secondaryKeywords: ['calculate reorder point rop inventory', 'safety stock buffer level solver', 'prevent supply chain stockouts calculator'],
    lsiKeywords: ['safety stock buffer', 'reorder point rop', 'lead time daily demand'],
    inputType: 'text',
    hasFileSupport: false,
    icon: 'Briefcase',
    related: ['economic-order-quantity-eoq-calculator-pro', 'dimensional-weight-shipping-calculator-pro'],
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
