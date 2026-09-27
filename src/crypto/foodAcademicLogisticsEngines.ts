/**
 * 100% Client-Side Food/Nutrition, Academic Research, and Logistics Supply Chain Engines.
 * Pure mathematical formulas, logistics inventory solvers, and survey statistics.
 */

// ==========================================
// 1. FOOD & NUTRITION ENGINES
// ==========================================

export function calculateRecipeCostPerServing(totalIngredientCost = 24.50, servingCount = 6): {
  totalCost: number;
  servings: number;
  costPerServing: number;
} {
  const cost = totalIngredientCost / (servingCount || 1);
  return {
    totalCost: totalIngredientCost,
    servings: servingCount,
    costPerServing: parseFloat(cost.toFixed(2))
  };
}

export function convertAlcoholAbvProof(val = 40, fromUnit: 'abv' | 'proof_us' | 'proof_uk' = 'abv'): {
  abvPercent: number;
  proofUs: number;
  proofUk: number;
} {
  let abv = val;
  if (fromUnit === 'proof_us') abv = val / 2;
  else if (fromUnit === 'proof_uk') abv = val / 1.75;

  return {
    abvPercent: parseFloat(abv.toFixed(1)),
    proofUs: parseFloat((abv * 2).toFixed(1)),
    proofUk: parseFloat((abv * 1.75).toFixed(1))
  };
}

export function calculateCoffeeWaterRatio(coffeeGrams = 20, brewMethod: 'pour_over' | 'french_press' | 'espresso' = 'pour_over'): {
  brewMethod: string;
  ratioString: string;
  waterGramsMl: number;
} {
  let ratio = 16; // 1:16 standard pour-over
  if (brewMethod === 'french_press') ratio = 15;
  else if (brewMethod === 'espresso') ratio = 2; // 1:2 ratio

  const water = coffeeGrams * ratio;

  return {
    brewMethod: brewMethod.replace('_', ' ').toUpperCase(),
    ratioString: `1 : ${ratio}`,
    waterGramsMl: Math.round(water)
  };
}

// ==========================================
// 2. ACADEMIC & RESEARCH ENGINES
// ==========================================

export function calculateSurveySampleSize(populationSize = 10000, marginOfErrorPercent = 5, confidenceLevelPercent = 95): {
  populationSize: number;
  marginOfErrorPercent: number;
  confidenceLevelPercent: number;
  recommendedSampleSize: number;
} {
  // Cochran formula
  const z = confidenceLevelPercent === 99 ? 2.576 : 1.96;
  const e = marginOfErrorPercent / 100;
  const p = 0.5;

  const n0 = (z * z * p * (1 - p)) / (e * e);
  const n = n0 / (1 + (n0 - 1) / populationSize);

  return {
    populationSize,
    marginOfErrorPercent,
    confidenceLevelPercent,
    recommendedSampleSize: Math.ceil(n)
  };
}

export function aggregateLikertScores(scores = [5, 4, 4, 3, 5, 2, 4, 5, 4, 3]): {
  totalResponses: number;
  meanScore: number;
  medianScore: number;
  positivePercentage: number;
} {
  const n = scores.length || 1;
  const sum = scores.reduce((a, b) => a + b, 0);
  const mean = sum / n;

  const sorted = [...scores].sort((a, b) => a - b);
  const mid = Math.floor(n / 2);
  const median = n % 2 !== 0 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2;

  const positive = scores.filter(s => s >= 4).length;
  const posPercent = (positive / n) * 100;

  return {
    totalResponses: n,
    meanScore: parseFloat(mean.toFixed(2)),
    medianScore: parseFloat(median.toFixed(1)),
    positivePercentage: parseFloat(posPercent.toFixed(1))
  };
}

// ==========================================
// 3. LOGISTICS & SUPPLY CHAIN ENGINES
// ==========================================

export function calculateContainerCbm(lengthCm = 120, widthCm = 80, heightCm = 100, cartonCount = 50): {
  singleCartonCbm: number;
  totalVolumeCbm: number;
  twentyFtContainerUtilizationPercent: number;
} {
  const cartonCbm = (lengthCm / 100) * (widthCm / 100) * (heightCm / 100);
  const totalCbm = cartonCbm * cartonCount;
  // 20ft container = 33.2 CBM usable
  const util = (totalCbm / 33.2) * 100;

  return {
    singleCartonCbm: parseFloat(cartonCbm.toFixed(3)),
    totalVolumeCbm: parseFloat(totalCbm.toFixed(2)),
    twentyFtContainerUtilizationPercent: parseFloat(util.toFixed(1))
  };
}

export function calculateDimensionalWeight(lengthInches = 20, widthInches = 15, heightInches = 10, actualWeightLbs = 12, dimFactor = 139): {
  actualWeightLbs: number;
  dimensionalWeightLbs: number;
  billableWeightLbs: number;
  isDimensionalWeightCharged: boolean;
} {
  const dimWeight = (lengthInches * widthInches * heightInches) / dimFactor;
  const billable = Math.max(actualWeightLbs, dimWeight);

  return {
    actualWeightLbs,
    dimensionalWeightLbs: parseFloat(dimWeight.toFixed(1)),
    billableWeightLbs: parseFloat(billable.toFixed(1)),
    isDimensionalWeightCharged: dimWeight > actualWeightLbs
  };
}

export function calculateEconomicOrderQuantity(annualDemandUnits = 10000, orderCostDollars = 50, holdingCostPerUnitDollars = 2.50): {
  annualDemandUnits: number;
  economicOrderQuantityEoq: number;
  totalOrdersPerYear: number;
} {
  // EOQ = sqrt((2 * D * S) / H)
  const eoq = Math.sqrt((2 * annualDemandUnits * orderCostDollars) / holdingCostPerUnitDollars);
  const orders = annualDemandUnits / eoq;

  return {
    annualDemandUnits,
    economicOrderQuantityEoq: Math.round(eoq),
    totalOrdersPerYear: parseFloat(orders.toFixed(1))
  };
}

export function calculateSafetyStock(maxDailyDemand = 100, avgDailyDemand = 80, maxLeadTimeDays = 14, avgLeadTimeDays = 10): {
  safetyStockUnits: number;
  reorderPointUnits: number;
} {
  // Safety Stock = (Max Daily Demand * Max Lead Time) - (Avg Daily Demand * Avg Lead Time)
  const safety = (maxDailyDemand * maxLeadTimeDays) - (avgDailyDemand * avgLeadTimeDays);
  const reorder = (avgDailyDemand * avgLeadTimeDays) + safety;

  return {
    safetyStockUnits: Math.round(safety),
    reorderPointUnits: Math.round(reorder)
  };
}
