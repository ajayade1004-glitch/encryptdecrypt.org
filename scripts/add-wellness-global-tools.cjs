const fs = require('fs');
const path = require('path');

const toolsPath = path.join(__dirname, '../public/assets/data/tools.json');
const tools = JSON.parse(fs.readFileSync(toolsPath, 'utf8'));

const existingSlugs = new Set(tools.map(t => t.slug));

const newTools = [
  // --- 🧑⚕️ Wellness Reference ---
  {
    id: 'waist-to-hip-ratio-calculator-pro',
    name: 'Waist-to-Hip Ratio (WHR) Health Calculator',
    slug: 'waist-to-hip-ratio-calculator-pro',
    category: 'wellness-reference',
    categoryName: 'Wellness Reference',
    shortDesc: 'Calculate waist-to-hip ratio (WHR) and evaluate abdominal fat distribution health risk categories.',
    metaTitle: 'Waist-to-Hip Ratio (WHR) Health Calculator Online',
    metaDescription: 'Calculate waist-to-hip ratio (WHR) and evaluate body fat distribution health risks.',
    primaryKeyword: 'waist to hip ratio calculator online',
    secondaryKeywords: ['calculate whr waist hip ratio', 'abdominal obesity body shape health risk', 'waist to hip ratio gender norm'],
    lsiKeywords: ['waist circumference hip circumference', 'android obesity', 'health risk category'],
    inputType: 'text',
    hasFileSupport: false,
    icon: 'Heart',
    related: ['navy-body-fat-percentage-calculator-pro', 'ideal-body-weight-calculator-pro'],
    popular: true
  },
  {
    id: 'navy-body-fat-percentage-calculator-pro',
    name: 'US Navy Body Fat Percentage Calculator',
    slug: 'navy-body-fat-percentage-calculator-pro',
    category: 'wellness-reference',
    categoryName: 'Wellness Reference',
    shortDesc: 'Estimate body fat % and lean mass using the US Navy circumferential logarithm method (waist, neck, height, hip).',
    metaTitle: 'US Navy Body Fat Percentage Calculator Online',
    metaDescription: 'Estimate body fat percentage and lean tissue mass using the official US Navy circumference method.',
    primaryKeyword: 'us navy body fat percentage calculator online',
    secondaryKeywords: ['calculate navy method body fat percent', 'circumferential body fat log equation', 'lean body mass calculator'],
    lsiKeywords: ['us navy method formula', 'body fat percentage log', 'lean body mass kg'],
    inputType: 'text',
    hasFileSupport: false,
    icon: 'Heart',
    related: ['waist-to-hip-ratio-calculator-pro', 'ideal-body-weight-calculator-pro'],
    popular: true
  },
  {
    id: 'ideal-body-weight-calculator-pro',
    name: 'Ideal Body Weight (IBW) Calculator (Devine & Hamwi)',
    slug: 'ideal-body-weight-calculator-pro',
    category: 'wellness-reference',
    categoryName: 'Wellness Reference',
    shortDesc: 'Calculate ideal body weight (IBW) using Dr. Devine and Hamwi medical formulas alongside healthy BMI ranges.',
    metaTitle: 'Ideal Body Weight (IBW) Calculator Online - Devine & Hamwi',
    metaDescription: 'Calculate ideal body weight (IBW) in kg/lbs using Dr. Devine and Hamwi medical formulas.',
    primaryKeyword: 'ideal body weight calculator online',
    secondaryKeywords: ['devine formula ideal body weight', 'hamwi formula ibw calculator', 'healthy bmi body weight range'],
    lsiKeywords: ['devine formula kg', 'hamwi formula kg', 'healthy bmi range'],
    inputType: 'text',
    hasFileSupport: false,
    icon: 'Heart',
    related: ['navy-body-fat-percentage-calculator-pro', 'sleep-cycle-wake-up-calculator-pro'],
    popular: true
  },
  {
    id: 'sleep-cycle-wake-up-calculator-pro',
    name: 'Sleep Cycle Wake-up & Bedtime Planner (90-Min Cycles)',
    slug: 'sleep-cycle-wake-up-calculator-pro',
    category: 'wellness-reference',
    categoryName: 'Wellness Reference',
    shortDesc: 'Calculate optimal bedtimes based on 90-minute REM/NREM sleep cycles to avoid groggy sleep inertia.',
    metaTitle: 'Sleep Cycle Wake-up & Bedtime Planner Online - 90 Min',
    metaDescription: 'Calculate optimal bedtimes based on 90-minute sleep cycles to wake up feeling refreshed.',
    primaryKeyword: 'sleep cycle wake up calculator online',
    secondaryKeywords: ['90 minute sleep cycle bedtime planner', 'calculate sleep inertia optimal bedtime', 'rem nrem sleep cycle wake up time'],
    lsiKeywords: ['90 minute sleep cycles', 'sleep inertia prevention', 'optimal bedtime schedule'],
    inputType: 'text',
    hasFileSupport: false,
    icon: 'Clock',
    related: ['steps-to-distance-stride-calculator-pro', 'waist-to-hip-ratio-calculator-pro'],
    popular: true
  },
  {
    id: 'steps-to-distance-stride-calculator-pro',
    name: 'Steps-to-Distance & Calorie Calculator (Stride Length)',
    slug: 'steps-to-distance-stride-calculator-pro',
    category: 'wellness-reference',
    categoryName: 'Wellness Reference',
    shortDesc: 'Convert daily step counts into kilometers, miles, and estimated walking calories based on stride length.',
    metaTitle: 'Steps-to-Distance & Calorie Calculator Online',
    metaDescription: 'Convert daily step count into kilometers, miles, and estimated walking calories based on stride length.',
    primaryKeyword: 'steps to distance calculator online',
    secondaryKeywords: ['convert 10000 steps to km miles', 'stride length step distance calculator', 'walking steps calorie burn estimator'],
    lsiKeywords: ['stride length meters', 'steps to kilometers miles', 'walking calorie burn'],
    inputType: 'text',
    hasFileSupport: false,
    icon: 'Heart',
    related: ['sleep-cycle-wake-up-calculator-pro', 'waist-to-hip-ratio-calculator-pro'],
    popular: true
  },

  // --- 🌍 Miscellaneous Global Reference ---
  {
    id: 'time-to-destination-speed-calculator-pro',
    name: 'Time to Destination & Travel Duration Calculator',
    slug: 'time-to-destination-speed-calculator-pro',
    category: 'global-reference',
    categoryName: 'Miscellaneous Global Reference',
    shortDesc: 'Calculate total travel driving duration (hours and minutes) from road distance (km/mi) and average speed.',
    metaTitle: 'Time to Destination & Travel Duration Calculator Online',
    metaDescription: 'Calculate travel driving duration in hours and minutes from distance and average speed.',
    primaryKeyword: 'time to destination calculator online',
    secondaryKeywords: ['calculate travel time from speed distance', 'road trip duration calculator hours mins', 'driving time speed distance solver'],
    lsiKeywords: ['travel duration hours minutes', 'average speed kmh', 'road trip distance'],
    inputType: 'text',
    hasFileSupport: false,
    icon: 'Globe',
    related: ['currency-denomination-breakdown-calculator-pro', 'time-to-destination-speed-calculator-pro'],
    popular: true
  },
  {
    id: 'currency-denomination-breakdown-calculator-pro',
    name: 'Currency Denomination Breakdown Calculator',
    slug: 'currency-denomination-breakdown-calculator-pro',
    category: 'global-reference',
    categoryName: 'Miscellaneous Global Reference',
    shortDesc: 'Calculate optimal cash note and coin denomination counts (2000, 500, 200, 100, 50, 20, 10, 5, 1) for cash payouts.',
    metaTitle: 'Currency Denomination Breakdown Calculator Online',
    metaDescription: 'Calculate optimal cash note and coin denomination counts for cash registers, payroll, and banking.',
    primaryKeyword: 'currency denomination breakdown calculator online',
    secondaryKeywords: ['cash note count breakdown calculator', 'currency denomination counter bank payroll', 'optimal bank note coin distribution'],
    lsiKeywords: ['cash note denominations', 'optimal note count', 'cash register distribution'],
    inputType: 'number',
    hasFileSupport: false,
    icon: 'Globe',
    related: ['time-to-destination-speed-calculator-pro'],
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
