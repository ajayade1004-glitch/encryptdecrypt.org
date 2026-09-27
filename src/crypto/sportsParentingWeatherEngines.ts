/**
 * 100% Client-Side Sports Stats, Parenting & Child Development, Weather Formulas Engines.
 * Pure mathematical formulas, WHO growth references, and meteorological physics.
 */

// ==========================================
// 1. SPORTS STATS ENGINES
// ==========================================

export function calculateCricketRunRates(currentRuns = 185, oversBowled = 32.4, targetRuns = 320, totalOvers = 50): {
  currentRunRate: number;
  requiredRunRate: number;
  runsNeeded: number;
  oversRemaining: number;
  projectedScore50Overs: number;
} {
  const oversDecimal = Math.floor(oversBowled) + (oversBowled % 1 * 10) / 6;
  const crr = oversDecimal > 0 ? currentRuns / oversDecimal : 0;
  const oversRem = totalOvers - oversDecimal;
  const runsNeeded = Math.max(0, targetRuns - currentRuns);
  const rrr = oversRem > 0 ? runsNeeded / oversRem : 0;
  const projected = crr * totalOvers;

  return {
    currentRunRate: parseFloat(crr.toFixed(2)),
    requiredRunRate: parseFloat(rrr.toFixed(2)),
    runsNeeded,
    oversRemaining: parseFloat(oversRem.toFixed(1)),
    projectedScore50Overs: Math.round(projected)
  };
}

export function calculateCricketAverages(runsScored = 2450, timesOut = 42, runsConceded = 1820, wicketsTaken = 78): {
  battingAverage: number;
  bowlingAverage: number;
  bowlingEconomy: number; // assuming overs = 320
  bowlingStrikeRate: number;
} {
  const batAvg = timesOut > 0 ? runsScored / timesOut : runsScored;
  const bowlAvg = wicketsTaken > 0 ? runsConceded / wicketsTaken : 0;
  const bowlSR = wicketsTaken > 0 ? (320 * 6) / wicketsTaken : 0; // 320 overs reference

  return {
    battingAverage: parseFloat(batAvg.toFixed(2)),
    bowlingAverage: parseFloat(bowlAvg.toFixed(2)),
    bowlingEconomy: parseFloat((runsConceded / 320).toFixed(2)),
    bowlingStrikeRate: parseFloat(bowlSR.toFixed(1))
  };
}

export function calculateFootballXg(shotsOnTarget = 6, averageDistanceMeters = 14, isHeader = false): {
  expectedGoalsXg: number;
  conversionProbabilityPercent: number;
  xgRating: string;
} {
  const distFactor = Math.max(0.02, 1 - averageDistanceMeters / 30);
  const headerFactor = isHeader ? 0.6 : 1.0;
  const baseProb = 0.15 * distFactor * headerFactor;
  const xG = shotsOnTarget * baseProb;

  let rating = 'Moderate Goal Chance';
  if (xG > 2.0) rating = 'High Quality Goal Chances / Dominant Attack';
  else if (xG < 0.8) rating = 'Low Probability Long Range Attempts';

  return {
    expectedGoalsXg: parseFloat(xG.toFixed(2)),
    conversionProbabilityPercent: parseFloat((baseProb * 100).toFixed(1)),
    xgRating: rating
  };
}

export function calculateGolfHandicap(scores: number[], courseRatings: number[], slopeRatings: number[]): {
  handicapIndex: number;
  courseHandicap: number;
  bestDifferentialsUsed: number;
} {
  const differentials: number[] = [];
  for (let i = 0; i < scores.length; i++) {
    const diff = ((scores[i] - courseRatings[i]) * 113) / slopeRatings[i];
    differentials.push(diff);
  }
  differentials.sort((a, b) => a - b);
  const lowest = differentials.slice(0, Math.min(8, differentials.length));
  const avg = lowest.reduce((sum, d) => sum + d, 0) / lowest.length;
  const handicap = avg * 0.96;

  return {
    handicapIndex: parseFloat(handicap.toFixed(1)),
    courseHandicap: Math.round(handicap * (120 / 113)), // Course slope 120 reference
    bestDifferentialsUsed: lowest.length
  };
}

export function calculateMarathonSplits(targetHours = 3, targetMinutes = 30): {
  totalSeconds: number;
  kmPace: string;
  milePace: string;
  halfMarathonSplit: string;
  tenKmSplit: string;
} {
  const totalSecs = targetHours * 3600 + targetMinutes * 60;
  const secPerKm = totalSecs / 42.195;
  const secPerMile = totalSecs / 26.2188;

  const fmtPace = (s: number) => `${Math.floor(s / 60)}:${Math.floor(s % 60).toString().padStart(2, '0')}`;
  const fmtTime = (s: number) => {
    const h = Math.floor(s / 3600);
    const m = Math.floor((s % 3600) / 60);
    const sec = Math.floor(s % 60);
    return `${h}:${m.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}`;
  };

  return {
    totalSeconds: totalSecs,
    kmPace: `${fmtPace(secPerKm)} /km`,
    milePace: `${fmtPace(secPerMile)} /mi`,
    halfMarathonSplit: fmtTime(totalSecs / 2),
    tenKmSplit: fmtTime((totalSecs / 42.195) * 10)
  };
}

export function calculateSwimmingPace(distanceMeters = 1500, totalTimeMinutes = 25, totalTimeSeconds = 0): {
  pacePer100m: string;
  pacePer100yd: string;
  speedMps: number;
} {
  const totalSec = totalTimeMinutes * 60 + totalTimeSeconds;
  const secPer100m = (totalSec / distanceMeters) * 100;
  const secPer100yd = secPer100m * 0.9144;

  const fmt = (s: number) => `${Math.floor(s / 60)}:${Math.floor(s % 60).toString().padStart(2, '0')}`;

  return {
    pacePer100m: `${fmt(secPer100m)} /100m`,
    pacePer100yd: `${fmt(secPer100yd)} /100yd`,
    speedMps: parseFloat((distanceMeters / totalSec).toFixed(2))
  };
}

export function calculateFantasySportsPoints(stats: { passingYds?: number; passingTds?: number; rushingYds?: number; rushingTds?: number; receptions?: number }): {
  totalFantasyPoints: number;
  breakdown: Record<string, number>;
} {
  const passYds = (stats.passingYds || 0) * 0.04; // 1 pt per 25 yds
  const passTd = (stats.passingTds || 0) * 4;
  const rushYds = (stats.rushingYds || 0) * 0.1; // 1 pt per 10 yds
  const rushTd = (stats.rushingTds || 0) * 6;
  const rec = (stats.receptions || 0) * 1.0; // PPR

  const total = passYds + passTd + rushYds + rushTd + rec;

  return {
    totalFantasyPoints: parseFloat(total.toFixed(2)),
    breakdown: {
      passingPoints: parseFloat((passYds + passTd).toFixed(2)),
      rushingPoints: parseFloat((rushYds + rushTd).toFixed(2)),
      receptionPoints: parseFloat(rec.toFixed(2))
    }
  };
}

// ==========================================
// 2. PARENTING & CHILD DEVELOPMENT ENGINES
// ==========================================

export function calculatePregnancyDueDate(lastMenstrualPeriodStr?: string): {
  estimatedDueDate: string;
  conceptionDate: string;
  currentGestationalAgeWeeks: number;
  trimester: string;
} {
  const lmp = lastMenstrualPeriodStr ? new Date(lastMenstrualPeriodStr) : new Date();
  const dueDate = new Date(lmp.getTime() + 280 * 86400000); // 280 days Naegele's rule
  const conception = new Date(lmp.getTime() + 14 * 86400000);
  const now = new Date();

  const diffDays = Math.max(0, Math.floor((now.getTime() - lmp.getTime()) / 86400000));
  const weeks = Math.floor(diffDays / 7);

  let trimester = 'First Trimester (Weeks 1-12)';
  if (weeks >= 28) trimester = 'Third Trimester (Weeks 28-40)';
  else if (weeks >= 13) trimester = 'Second Trimester (Weeks 13-27)';

  return {
    estimatedDueDate: dueDate.toISOString().split('T')[0],
    conceptionDate: conception.toISOString().split('T')[0],
    currentGestationalAgeWeeks: weeks,
    trimester
  };
}

export function calculateOvulationCycle(lastPeriodStr?: string, cycleLengthDays = 28): {
  nextPeriodDate: string;
  estimatedOvulationDate: string;
  fertileWindowStart: string;
  fertileWindowEnd: string;
} {
  const start = lastPeriodStr ? new Date(lastPeriodStr) : new Date();
  const nextPeriod = new Date(start.getTime() + cycleLengthDays * 86400000);
  const ovulation = new Date(nextPeriod.getTime() - 14 * 86400000); // 14 days before next period

  const fertileStart = new Date(ovulation.getTime() - 5 * 86400000);
  const fertileEnd = new Date(ovulation.getTime() + 1 * 86400000);

  const fmt = (d: Date) => d.toISOString().split('T')[0];

  return {
    nextPeriodDate: fmt(nextPeriod),
    estimatedOvulationDate: fmt(ovulation),
    fertileWindowStart: fmt(fertileStart),
    fertileWindowEnd: fmt(fertileEnd)
  };
}

export function calculatePredictedChildHeight(motherHeightCm = 165, fatherHeightCm = 178, gender: 'boy' | 'girl' = 'boy'): {
  predictedAdultHeightCm: number;
  predictedAdultHeightFeetInches: string;
  targetRangeCm: string;
} {
  // Khamis-Roche / Mid-Parental Height Method
  let midParental = 0;
  if (gender === 'boy') {
    midParental = (fatherHeightCm + motherHeightCm + 13) / 2;
  } else {
    midParental = (fatherHeightCm + motherHeightCm - 13) / 2;
  }

  const feet = Math.floor(midParental / 30.48);
  const inches = Math.round((midParental % 30.48) / 2.54);

  return {
    predictedAdultHeightCm: parseFloat(midParental.toFixed(1)),
    predictedAdultHeightFeetInches: `${feet}' ${inches}"`,
    targetRangeCm: `${(midParental - 8.5).toFixed(1)} cm - ${(midParental + 8.5).toFixed(1)} cm`
  };
}

export function calculateAapScreenTime(ageYears = 4): {
  recommendedDailyLimitHours: string;
  guidelineSummary: string;
  healthyHabitTips: string[];
} {
  if (ageYears < 1.5) {
    return {
      recommendedDailyLimitHours: '0 Hours (Except video calls)',
      guidelineSummary: 'AAP recommends avoiding digital screen use for infants under 18 months.',
      healthyHabitTips: ['Focus on interactive play and face-to-face conversation', 'Allow high-quality video chatting with family']
    };
  } else if (ageYears <= 5) {
    return {
      recommendedDailyLimitHours: '1 Hour / Day (High Quality Content)',
      guidelineSummary: 'AAP recommends co-viewing high-quality educational programming with children aged 2-5.',
      healthyHabitTips: ['Co-view programs to help children understand content', 'Turn off screens 1 hour before bedtime']
    };
  } else {
    return {
      recommendedDailyLimitHours: '1.5 - 2 Hours / Day (Consistent Limits)',
      guidelineSummary: 'Establish consistent boundaries for screen time that do not replace sleep or physical activity.',
      healthyHabitTips: ['Designate screen-free zones in bedrooms', 'Encourage 60+ minutes of physical activity daily']
    };
  }
}

// ==========================================
// 3. WEATHER FORMULAS (EDUCATIONAL)
// ==========================================

export function calculateHeatIndex(tempFahrenheit = 90, relativeHumidityPercent = 70): {
  heatIndexFahrenheit: number;
  heatIndexCelsius: number;
  riskCategory: string;
} {
  const T = tempFahrenheit;
  const RH = relativeHumidityPercent;

  let HI = 0.5 * (T + 61.0 + ((T - 68.0) * 1.2) + (RH * 0.094));
  if (HI >= 80) {
    HI = -42.379 + 2.04901523 * T + 10.14333127 * RH - 0.22475541 * T * RH - 0.00683783 * T * T -
         0.05481717 * RH * RH + 0.00122874 * T * T * RH + 0.00085282 * T * RH * RH - 0.00000199 * T * T * RH * RH;
  }

  const hiC = (HI - 32) * (5 / 9);

  let category = 'Caution (Fatigue possible with prolonged exposure)';
  if (HI >= 130) category = 'Extreme Danger (Heat stroke highly likely)';
  else if (HI >= 103) category = 'Danger (Heat cramps or heat exhaustion likely)';
  else if (HI >= 90) category = 'Extreme Caution (Heat cramps and exhaustion possible)';

  return {
    heatIndexFahrenheit: parseFloat(HI.toFixed(1)),
    heatIndexCelsius: parseFloat(hiC.toFixed(1)),
    riskCategory: category
  };
}

export function calculateWindChill(tempFahrenheit = 20, windSpeedMph = 15): {
  windChillFahrenheit: number;
  windChillCelsius: number;
  frostbiteRiskTime: string;
} {
  const T = tempFahrenheit;
  const V = windSpeedMph;

  const WC = 35.74 + 0.6215 * T - 35.75 * Math.pow(V, 0.16) + 0.4275 * T * Math.pow(V, 0.16);
  const wcC = (WC - 32) * (5 / 9);

  let risk = 'Low Frostbite Risk (30+ minutes exposure)';
  if (WC <= -18) risk = 'High Risk: Frostbite in 10-30 minutes';
  else if (WC <= -35) risk = 'Extreme Risk: Frostbite in under 10 minutes';

  return {
    windChillFahrenheit: parseFloat(WC.toFixed(1)),
    windChillCelsius: parseFloat(wcC.toFixed(1)),
    frostbiteRiskTime: risk
  };
}

export function calculateDewPoint(tempCelsius = 25, relativeHumidityPercent = 60): {
  dewPointCelsius: number;
  dewPointFahrenheit: number;
  comfortLevel: string;
} {
  const T = tempCelsius;
  const RH = relativeHumidityPercent;

  // Magnus-Tetens approximation
  const a = 17.27;
  const b = 237.7;
  const alpha = ((a * T) / (b + T)) + Math.log(RH / 100);
  const Tdp = (b * alpha) / (a - alpha);
  const TdpF = (Tdp * 9) / 5 + 32;

  let comfort = 'Comfortable / Dry';
  if (Tdp >= 24) comfort = 'Severely Oppressive / Tropical Moisture';
  else if (Tdp >= 20) comfort = 'Uncomfortable / Very Humid';
  else if (Tdp >= 16) comfort = 'Noticeably Humid';

  return {
    dewPointCelsius: parseFloat(Tdp.toFixed(1)),
    dewPointFahrenheit: parseFloat(TdpF.toFixed(1)),
    comfortLevel: comfort
  };
}

export function calculateUvExposure(uvIndex = 8, skinType: 'fair' | 'medium' | 'dark' = 'fair'): {
  safeSunTimeMinutes: number;
  spfRecommendation: string;
} {
  let baseMinutes = 67.5;
  if (skinType === 'fair') baseMinutes = 67.5;
  else if (skinType === 'medium') baseMinutes = 100;
  else baseMinutes = 200;

  const safeMinutes = Math.max(5, baseMinutes / uvIndex);

  return {
    safeSunTimeMinutes: Math.round(safeMinutes),
    spfRecommendation: uvIndex >= 8 ? 'SPF 30+ Broad Spectrum + Hat & Sunglasses' : 'SPF 15+ Daily Sunscreen'
  };
}

export function calculateRainfallVolume(rainfallMm = 25, catchmentAreaSqM = 100): {
  volumeLiters: number;
  volumeGallons: number;
  usableRainwaterLiters: number; // 85% runoff coefficient
} {
  const liters = rainfallMm * catchmentAreaSqM;
  const usable = liters * 0.85;

  return {
    volumeLiters: Math.round(liters),
    volumeGallons: Math.round(liters * 0.264172),
    usableRainwaterLiters: Math.round(usable)
  };
}

export function convertBarometricPressureAltitude(pressureHpa = 1013.25, altitudeMeters = 500): {
  seaLevelPressureHpa: number;
  pressureInHg: number;
  pressureAtm: number;
} {
  const p0 = pressureHpa / Math.pow(1 - (altitudeMeters / 44330), 5.255);
  const inHg = pressureHpa * 0.02953;

  return {
    seaLevelPressureHpa: parseFloat(p0.toFixed(2)),
    pressureInHg: parseFloat(inHg.toFixed(2)),
    pressureAtm: parseFloat((pressureHpa / 1013.25).toFixed(3))
  };
}
