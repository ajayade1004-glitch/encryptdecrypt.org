/**
 * 100% Client-Side Wellness Reference & Miscellaneous Global Reference Engines.
 * Pure mathematical formulas, Navy body fat logs, 90-min sleep cycle timing, and note denomination solvers.
 */

// ==========================================
// 1. WELLNESS REFERENCE ENGINES
// ==========================================

export function calculateWaistToHipRatio(waistCm = 80, hipCm = 95, gender: 'male' | 'female' = 'male'): {
  waistToHipRatio: number;
  healthRiskCategory: string;
} {
  const ratio = waistCm / (hipCm || 1);
  let category = 'Low Risk (Healthy Abdominal Fat Distribution)';

  if (gender === 'male') {
    if (ratio >= 1.0) category = 'High Risk (Abdominal Obesity / Android Shape)';
    else if (ratio >= 0.90) category = 'Moderate Risk';
  } else {
    if (ratio >= 0.85) category = 'High Risk (Abdominal Obesity / Android Shape)';
    else if (ratio >= 0.80) category = 'Moderate Risk';
  }

  return {
    waistToHipRatio: parseFloat(ratio.toFixed(2)),
    healthRiskCategory: category
  };
}

export function calculateNavyBodyFat(gender: 'male' | 'female' = 'male', waistCm = 85, neckCm = 38, heightCm = 175, hipCm = 95): {
  bodyFatPercent: number;
  fatMassKg: number;
  leanMassKg: number;
} {
  let bf = 15;
  if (gender === 'male') {
    // 86.010 * log10(waist - neck) - 70.041 * log10(height) + 36.76
    const logWaistNeck = Math.log10(waistCm - neckCm);
    const logHeight = Math.log10(heightCm);
    bf = 495 / (1.0324 - 0.19077 * logWaistNeck + 0.15456 * logHeight) - 450;
  } else {
    const logWaistHipNeck = Math.log10(waistCm + hipCm - neckCm);
    const logHeight = Math.log10(heightCm);
    bf = 495 / (1.29577 - 0.21204 * logWaistHipNeck + 0.16877 * logHeight) - 450;
  }

  bf = Math.max(3, Math.min(60, bf));
  const totalWeightKg = 70; // baseline 70kg assumption
  const fatKg = (totalWeightKg * bf) / 100;
  const leanKg = totalWeightKg - fatKg;

  return {
    bodyFatPercent: parseFloat(bf.toFixed(1)),
    fatMassKg: parseFloat(fatKg.toFixed(1)),
    leanMassKg: parseFloat(leanKg.toFixed(1))
  };
}

export function calculateIdealBodyWeight(heightCm = 175, gender: 'male' | 'female' = 'male'): {
  devineFormulaKg: number;
  hamwiFormulaKg: number;
  healthyBmiRangeKg: { minKg: number; maxKg: number };
} {
  const heightInches = heightCm / 2.54;
  const inchesOver5Ft = Math.max(0, heightInches - 60);

  let devine = 50 + 2.3 * inchesOver5Ft;
  let hamwi = 48 + 2.7 * inchesOver5Ft;

  if (gender === 'female') {
    devine = 45.5 + 2.3 * inchesOver5Ft;
    hamwi = 45.5 + 2.2 * inchesOver5Ft;
  }

  const heightM = heightCm / 100;
  const minBmiKg = 18.5 * heightM * heightM;
  const maxBmiKg = 24.9 * heightM * heightM;

  return {
    devineFormulaKg: parseFloat(devine.toFixed(1)),
    hamwiFormulaKg: parseFloat(hamwi.toFixed(1)),
    healthyBmiRangeKg: {
      minKg: parseFloat(minBmiKg.toFixed(1)),
      maxKg: parseFloat(maxBmiKg.toFixed(1))
    }
  };
}

export function calculateSleepCycles(targetWakeUpTime = '07:00'): {
  wakeUpTime: string;
  recommendedBedtimes: Array<{ cycles: number; bedtime: string; totalHoursMinutes: string }>;
} {
  const parts = targetWakeUpTime.split(':').map(Number);
  const wakeMin = parts[0] * 60 + parts[1];

  // 90 minute cycles + 15 min to fall asleep
  const cycleCount = [6, 5, 4]; // 9h, 7.5h, 6h
  const times = cycleCount.map(c => {
    const totalSleepMin = c * 90 + 15;
    let bedMin = (wakeMin - totalSleepMin + 1440) % 1440;
    const h = Math.floor(bedMin / 60);
    const m = bedMin % 60;
    const bedStr = `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;

    return {
      cycles: c,
      bedtime: bedStr,
      totalHoursMinutes: `${Math.floor((c * 90) / 60)}h ${(c * 90) % 60}m`
    };
  });

  return {
    wakeUpTime: targetWakeUpTime,
    recommendedBedtimes: times
  };
}

export function calculateStepsToDistance(steps = 10000, strideLengthMeters = 0.75): {
  totalSteps: number;
  distanceKilometers: number;
  distanceMiles: number;
  caloriesBurnedEst: number;
} {
  const km = (steps * strideLengthMeters) / 1000;
  const mi = km * 0.621371;
  const cal = steps * 0.04; // ~0.04 kcal per step average

  return {
    totalSteps: steps,
    distanceKilometers: parseFloat(km.toFixed(2)),
    distanceMiles: parseFloat(mi.toFixed(2)),
    caloriesBurnedEst: Math.round(cal)
  };
}

// ==========================================
// 2. MISCELLANEOUS GLOBAL REFERENCE ENGINES
// ==========================================

export function calculateTimeToDestination(distanceKm = 250, averageSpeedKmh = 100): {
  distanceKm: number;
  speedKmh: number;
  durationHoursMinutes: string;
  durationDecimalHours: number;
} {
  const hours = distanceKm / (averageSpeedKmh || 1);
  const h = Math.floor(hours);
  const m = Math.round((hours - h) * 60);

  return {
    distanceKm,
    speedKmh: averageSpeedKmh,
    durationHoursMinutes: `${h} hrs ${m} mins`,
    durationDecimalHours: parseFloat(hours.toFixed(2))
  };
}

export function calculateCurrencyDenominations(amountTotal = 1875, currencySymbol = '$'): {
  totalAmount: number;
  noteBreakdown: Array<{ noteValue: number; count: number }>;
} {
  const notes = [2000, 500, 200, 100, 50, 20, 10, 5, 2, 1];
  let remaining = amountTotal;
  const result: Array<{ noteValue: number; count: number }> = [];

  notes.forEach(note => {
    if (remaining >= note) {
      const count = Math.floor(remaining / note);
      remaining %= note;
      result.push({ noteValue: note, count });
    }
  });

  return {
    totalAmount: amountTotal,
    noteBreakdown: result
  };
}
