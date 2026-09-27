/**
 * 100% Client-Side Measurement/Conversion & Construction Extras Engines.
 * Pure mathematical formulas, optics/exposure solvers, and structural construction estimators.
 */

// ==========================================
// 1. MEASUREMENT / CONVERSION EXTRAS ENGINES
// ==========================================

export function convertNauticalMiles(val = 100, unit: 'nmi' | 'km' | 'mi' = 'nmi'): {
  nauticalMiles: number;
  kilometers: number;
  statuteMiles: number;
} {
  let nmi = val;
  if (unit === 'km') nmi = val / 1.852;
  else if (unit === 'mi') nmi = val / 1.15078;

  const km = nmi * 1.852;
  const mi = nmi * 1.15078;

  return {
    nauticalMiles: parseFloat(nmi.toFixed(2)),
    kilometers: parseFloat(km.toFixed(2)),
    statuteMiles: parseFloat(mi.toFixed(2))
  };
}

export function calculateTorqueToHorsepower(torqueFtLb = 300, rpm = 5252): {
  torqueFtLb: number;
  rpm: number;
  horsepowerHp: number;
  kilowattsKw: number;
} {
  // HP = (Torque * RPM) / 5252
  const hp = (torqueFtLb * rpm) / 5252;
  const kw = hp * 0.7457;

  return {
    torqueFtLb,
    rpm,
    horsepowerHp: parseFloat(hp.toFixed(1)),
    kilowattsKw: parseFloat(kw.toFixed(1))
  };
}

export function calculateScreenViewingDistance(screenDiagonalInches = 65, resolution: '1080p' | '4k' = '4k'): {
  screenDiagonalInches: number;
  recommendedViewingDistanceFeet: number;
  recommendedViewingDistanceMeters: number;
} {
  // THX / SMPTE guidelines
  const factor = resolution === '4k' ? 1.2 : 1.6;
  const distInches = screenDiagonalInches * factor;
  const distFeet = distInches / 12;
  const distMeters = distFeet * 0.3048;

  return {
    screenDiagonalInches,
    recommendedViewingDistanceFeet: parseFloat(distFeet.toFixed(1)),
    recommendedViewingDistanceMeters: parseFloat(distMeters.toFixed(2))
  };
}

export function convertPaperWeightGsmLb(val = 80, fromUnit: 'gsm' | 'lb_text' | 'lb_cover' = 'gsm'): {
  gsm: number;
  lbText: number;
  lbCover: number;
} {
  let gsm = val;
  if (fromUnit === 'lb_text') gsm = val * 1.48;
  else if (fromUnit === 'lb_cover') gsm = val * 2.708;

  const text = gsm / 1.48;
  const cover = gsm / 2.708;

  return {
    gsm: Math.round(gsm),
    lbText: Math.round(text),
    lbCover: Math.round(cover)
  };
}

// ==========================================
// 2. CONSTRUCTION / HOME EXTRAS ENGINES
// ==========================================

export function calculateConcreteMixVolume(lengthMeters = 5, widthMeters = 4, thicknessCm = 10, mixRatio: '1:2:4' | '1:1.5:3' = '1:2:4'): {
  volumeCubicMeters: number;
  cementBags50kg: number;
  sandCubicMeters: number;
  gravelCubicMeters: number;
} {
  const vol = lengthMeters * widthMeters * (thicknessCm / 100);
  const dryVol = vol * 1.54; // 54% volume shrinkage factor

  // 1:2:4 -> total 7 parts
  const cementVol = dryVol * (1 / 7);
  const sandVol = dryVol * (2 / 7);
  const gravelVol = dryVol * (4 / 7);

  const cementBags = (cementVol * 1440) / 50; // 1440 kg/m3 density

  return {
    volumeCubicMeters: parseFloat(vol.toFixed(2)),
    cementBags50kg: Math.ceil(cementBags),
    sandCubicMeters: parseFloat(sandVol.toFixed(2)),
    gravelCubicMeters: parseFloat(gravelVol.toFixed(2))
  };
}

export function calculateTileQuantityWastage(roomAreaSqMeters = 25, tileWidthCm = 30, tileLengthCm = 30, wastagePercent = 10): {
  roomAreaSqMeters: number;
  totalTilesRequired: number;
  tileBoxesNeeded: number;
  extraWastageTiles: number;
} {
  const tileAreaSqM = (tileWidthCm / 100) * (tileLengthCm / 100);
  const exactTiles = roomAreaSqMeters / tileAreaSqM;
  const withWastage = exactTiles * (1 + wastagePercent / 100);

  return {
    roomAreaSqMeters,
    totalTilesRequired: Math.ceil(withWastage),
    tileBoxesNeeded: Math.ceil(withWastage / 10), // 10 tiles per box
    extraWastageTiles: Math.ceil(withWastage - exactTiles)
  };
}

export function calculatePaintCoverage(wallAreaSqFt = 500, coatCount = 2, sqFtPerLiter = 100): {
  wallAreaSqFt: number;
  totalCoverageSqFt: number;
  requiredPaintLiters: number;
} {
  const totalArea = wallAreaSqFt * coatCount;
  const liters = totalArea / sqFtPerLiter;

  return {
    wallAreaSqFt,
    totalCoverageSqFt: totalArea,
    requiredPaintLiters: parseFloat(liters.toFixed(1))
  };
}

export function calculateRoofPitchAngle(riseInches = 6, runInches = 12): {
  pitchRatio: string;
  angleDegrees: number;
  roofSlopePercent: number;
} {
  const angleRad = Math.atan(riseInches / (runInches || 1));
  const angleDeg = angleRad * (180 / Math.PI);
  const percent = (riseInches / runInches) * 100;

  return {
    pitchRatio: `${riseInches} / 12`,
    angleDegrees: parseFloat(angleDeg.toFixed(1)),
    roofSlopePercent: parseFloat(percent.toFixed(1))
  };
}

export function calculateAwgWireLoad(awgGauge = 12, lengthFeet = 100, maxVoltage = 120): {
  awgGauge: number;
  maxAmpacityAmps: number;
  maxContinuousPowerWatts: number;
  voltageDropPercent10A: number;
} {
  // AWG 12 -> ~20A
  let amps = 20;
  let resistancePer1000Ft = 1.588;

  if (awgGauge === 14) { amps = 15; resistancePer1000Ft = 2.525; }
  else if (awgGauge === 10) { amps = 30; resistancePer1000Ft = 0.9989; }
  else if (awgGauge === 8) { amps = 40; resistancePer1000Ft = 0.6282; }

  const vDrop = (2 * lengthFeet * 10 * resistancePer1000Ft) / 1000;
  const vDropPercent = (vDrop / maxVoltage) * 100;

  return {
    awgGauge,
    maxAmpacityAmps: amps,
    maxContinuousPowerWatts: amps * maxVoltage * 0.8, // 80% continuous load safety
    voltageDropPercent10A: parseFloat(vDropPercent.toFixed(2))
  };
}
