/**
 * 100% Client-Side CAD, Design System, Number Theory, IT Sysadmin & Creator Engines.
 * Pure mathematical algorithms, number theory solvers, and offline reference tables.
 */

// ==========================================
// 1. CAD & ENGINEERING REFERENCE ENGINES
// ==========================================

export function calculateGearRatio(teethDriver = 20, teethDriven = 60, driverRpm = 1800): {
  gearRatio: string;
  gearRatioDecimal: number;
  outputRpm: number;
  torqueMultiplier: number;
} {
  const ratio = teethDriven / (teethDriver || 1);
  const rpm = driverRpm / ratio;

  return {
    gearRatio: `1 : ${ratio.toFixed(2)}`,
    gearRatioDecimal: parseFloat(ratio.toFixed(2)),
    outputRpm: Math.round(rpm),
    torqueMultiplier: parseFloat(ratio.toFixed(2))
  };
}

export function calculateBeamBendingStress(bendingMomentNm = 1200, distanceToNeutralAxisMm = 25, momentOfInertiaMm4 = 150000): {
  bendingStressMpa: number;
  stressCategory: string;
} {
  // σ = M * y / I
  const m = bendingMomentNm * 1000; // N*mm
  const stress = (m * distanceToNeutralAxisMm) / momentOfInertiaMm4;

  return {
    bendingStressMpa: parseFloat(stress.toFixed(2)),
    stressCategory: stress > 250 ? 'High Bending Stress (Yield Limit Warning)' : 'Safe Normal Yield Margin'
  };
}

// ==========================================
// 2. DESIGN SYSTEM TOOLS ENGINES
// ==========================================

export function generate8PointGridScale(baseUnitPx = 8): {
  scaleTokensPx: Array<{ token: string; sizePx: number; sizeRem: number }>;
} {
  const multipliers = [0.5, 1, 1.5, 2, 3, 4, 6, 8, 12, 16];
  const tokens = multipliers.map((m, idx) => {
    const px = baseUnitPx * m;
    return {
      token: `space-${idx + 1}`,
      sizePx: px,
      sizeRem: px / 16
    };
  });

  return { scaleTokensPx: tokens };
}

// ==========================================
// 3. NUMBER THEORY & PUZZLE MATH ENGINES
// ==========================================

export function checkCollatzSequence(startNumber = 27): {
  startNumber: number;
  totalSteps: number;
  peakMaximumValue: number;
  first20SequenceValues: number[];
} {
  let n = startNumber;
  let steps = 0;
  let peak = n;
  const seq: number[] = [n];

  while (n > 1 && steps < 1000) {
    if (n % 2 === 0) n = n / 2;
    else n = 3 * n + 1;
    if (n > peak) peak = n;
    if (seq.length < 20) seq.push(n);
    steps++;
  }

  return {
    startNumber,
    totalSteps: steps,
    peakMaximumValue: peak,
    first20SequenceValues: seq
  };
}

export function checkNarcissisticNumber(num = 153): {
  number: number;
  digitCount: number;
  isNarcissisticArmstrong: boolean;
  digitPowersSum: number;
} {
  const digits = num.toString().split('').map(Number);
  const power = digits.length;
  const sum = digits.reduce((acc, d) => acc + Math.pow(d, power), 0);

  return {
    number: num,
    digitCount: power,
    isNarcissisticArmstrong: sum === num,
    digitPowersSum: sum
  };
}

// ==========================================
// 4. IT & SYSADMIN REFERENCE ENGINES
// ==========================================

export function calculateUptimeDowntime(uptimePercentage = 99.9): {
  uptimePercent: number;
  downtimePerYearMinutes: number;
  downtimePerMonthMinutes: number;
  downtimePerDaySeconds: number;
} {
  const outageFraction = (100 - uptimePercentage) / 100;
  const yearMin = outageFraction * 365.25 * 24 * 60;
  const monthMin = outageFraction * 30.4375 * 24 * 60;
  const daySec = outageFraction * 24 * 3600;

  return {
    uptimePercent: uptimePercentage,
    downtimePerYearMinutes: parseFloat(yearMin.toFixed(1)),
    downtimePerMonthMinutes: parseFloat(monthMin.toFixed(1)),
    downtimePerDaySeconds: parseFloat(daySec.toFixed(1))
  };
}

export function calculateRaidCapacity(driveCount = 4, driveSizeTb = 8, raidType: 'raid0' | 'raid1' | 'raid5' | 'raid6' | 'raid10' = 'raid5'): {
  raidType: string;
  usableCapacityTb: number;
  parityFaultTolerance: string;
} {
  let usable = 0;
  let fault = '0 Drive Failures';

  if (raidType === 'raid0') { usable = driveCount * driveSizeTb; fault = '0 Drives (Striping)'; }
  else if (raidType === 'raid1') { usable = driveSizeTb; fault = `${driveCount - 1} Drives (Mirroring)`; }
  else if (raidType === 'raid5') { usable = (driveCount - 1) * driveSizeTb; fault = '1 Drive Failure'; }
  else if (raidType === 'raid6') { usable = (driveCount - 2) * driveSizeTb; fault = '2 Dual Drive Failures'; }
  else { usable = (driveCount / 2) * driveSizeTb; fault = '1 Drive per Mirror Pair'; }

  return {
    raidType: raidType.toUpperCase(),
    usableCapacityTb: Math.max(0, usable),
    parityFaultTolerance: fault
  };
}

// ==========================================
// 5. CONTENT CREATOR REFERENCE ENGINES
// ==========================================

export function recommendVideoBitrate(resolution: '1080p' | '4k' = '1080p', fps = 60): {
  recommendedBitrateMbps: number;
  recommendedLivestreamBandwidthMbps: number;
  estimatedStorageGbPerHour: number;
} {
  let mbps = 8;
  if (resolution === '4k') mbps = fps >= 60 ? 45 : 35;
  else mbps = fps >= 60 ? 12 : 8;

  const livestreamBandwidth = mbps * 1.5; // 50% headroom
  const storageGbHour = (mbps * 3600) / 8000;

  return {
    recommendedBitrateMbps: mbps,
    recommendedLivestreamBandwidthMbps: parseFloat(livestreamBandwidth.toFixed(1)),
    estimatedStorageGbPerHour: parseFloat(storageGbHour.toFixed(1))
  };
}
