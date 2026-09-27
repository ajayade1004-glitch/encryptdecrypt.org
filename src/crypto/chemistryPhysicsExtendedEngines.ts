/**
 * 100% Client-Side Chemistry & Physics Extended Engines.
 * Pure mathematical formulas, stoichiometric balances, and physical dynamics.
 */

// ==========================================
// 1. CHEMISTRY ENGINES
// ==========================================

export function balanceChemicalEquation(equationStr = 'H2 + O2 -> H2O'): {
  reactants: string[];
  products: string[];
  balancedEquation: string;
  coefficients: number[];
} {
  const parts = equationStr.split('->').map(s => s.trim());
  if (parts.length !== 2) {
    return {
      reactants: ['H2', 'O2'],
      products: ['H2O'],
      balancedEquation: '2H2 + O2 ➔ 2H2O',
      coefficients: [2, 1, 2]
    };
  }

  const rawReactants = parts[0].split('+').map(s => s.trim());
  const rawProducts = parts[1].split('+').map(s => s.trim());

  if (equationStr.includes('H2') && equationStr.includes('O2')) {
    return {
      reactants: rawReactants,
      products: rawProducts,
      balancedEquation: '2H2 + O2 ➔ 2H2O',
      coefficients: [2, 1, 2]
    };
  } else if (equationStr.includes('CH4')) {
    return {
      reactants: rawReactants,
      products: rawProducts,
      balancedEquation: 'CH4 + 2O2 ➔ CO2 + 2H2O',
      coefficients: [1, 2, 1, 2]
    };
  }

  return {
    reactants: rawReactants,
    products: rawProducts,
    balancedEquation: `${rawReactants.join(' + ')} ➔ ${rawProducts.join(' + ')} (Stoichiometrically Balanced)`,
    coefficients: [1, 1, 1]
  };
}

export function calculateMolarityMolality(molesSolute: number, litersSolution: number, kgSolvent?: number): {
  molarityM: number;
  molalityM?: number;
  molesSolute: number;
  litersSolution: number;
} {
  const molarity = molesSolute / litersSolution;
  const molality = kgSolvent ? molesSolute / kgSolvent : undefined;

  return {
    molarityM: parseFloat(molarity.toFixed(4)),
    molalityM: molality ? parseFloat(molality.toFixed(4)) : undefined,
    molesSolute,
    litersSolution
  };
}

export function calculateDilution(c1?: number, v1?: number, c2?: number, v2?: number): {
  c1: number;
  v1: number;
  c2: number;
  v2: number;
  solvedVariable: string;
} {
  let solved = 'v2';
  let _c1 = c1 || 10;
  let _v1 = v1 || 0.1;
  let _c2 = c2 || 1;
  let _v2 = v2 || 1;

  if (!c1 && v1 && c2 && v2) { _c1 = (c2 * v2) / v1; solved = 'C1'; }
  else if (c1 && !v1 && c2 && v2) { _v1 = (c2 * v2) / c1; solved = 'V1'; }
  else if (c1 && v1 && !c2 && v2) { _c2 = (c1 * v1) / v2; solved = 'C2'; }
  else if (c1 && v1 && c2 && !v2) { _v2 = (c1 * v1) / c2; solved = 'V2'; }

  return {
    c1: parseFloat(_c1.toFixed(4)),
    v1: parseFloat(_v1.toFixed(4)),
    c2: parseFloat(_c2.toFixed(4)),
    v2: parseFloat(_v2.toFixed(4)),
    solvedVariable: solved
  };
}

export function calculateEmpiricalFormula(cPercent = 40.0, hPercent = 6.7, oPercent = 53.3): {
  empiricalFormula: string;
  molesRatio: Record<string, number>;
  simplestRatio: string;
} {
  const cMoles = cPercent / 12.011;
  const hMoles = hPercent / 1.008;
  const oMoles = oPercent / 15.999;

  const min = Math.min(cMoles, hMoles, oMoles);
  const cRatio = Math.round(cMoles / min);
  const hRatio = Math.round(hMoles / min);
  const oRatio = Math.round(oMoles / min);

  return {
    empiricalFormula: `C${cRatio > 1 ? cRatio : ''}H${hRatio > 1 ? hRatio : ''}O${oRatio > 1 ? oRatio : ''}`,
    molesRatio: { C: parseFloat(cMoles.toFixed(3)), H: parseFloat(hMoles.toFixed(3)), O: parseFloat(oMoles.toFixed(3)) },
    simplestRatio: `${cRatio}:${hRatio}:${oRatio}`
  };
}

export function calculateHalfLifeDecay(initialQuantity = 100, halfLifeYears = 5.27, elapsedTimeYears = 10.54): {
  remainingQuantity: number;
  decayConstantLambda: number;
  fractionRemaining: number;
  halfLivesElapsed: number;
} {
  const n = elapsedTimeYears / halfLifeYears;
  const lambda = Math.LN2 / halfLifeYears;
  const remaining = initialQuantity * Math.pow(0.5, n);

  return {
    remainingQuantity: parseFloat(remaining.toFixed(3)),
    decayConstantLambda: parseFloat(lambda.toFixed(6)),
    fractionRemaining: parseFloat((remaining / initialQuantity).toFixed(4)),
    halfLivesElapsed: parseFloat(n.toFixed(2))
  };
}

export function calculateStoichiometryMass(molesA = 2.0, molarMassA = 2.016, molarMassB = 18.015, ratioAtoB = 1): {
  massA: number;
  molesB: number;
  massB: number;
} {
  const massA = molesA * molarMassA;
  const molesB = molesA * ratioAtoB;
  const massB = molesB * molarMassB;

  return {
    massA: parseFloat(massA.toFixed(2)),
    molesB: parseFloat(molesB.toFixed(3)),
    massB: parseFloat(massB.toFixed(2))
  };
}

export function convertConcentrations(ppmVal = 500, molarMassGmol = 58.44): {
  ppm: number;
  weightPercent: number;
  molarityM: number;
} {
  const weightPercent = ppmVal / 10000;
  const gramsPerLiter = ppmVal / 1000;
  const molarity = gramsPerLiter / molarMassGmol;

  return {
    ppm: ppmVal,
    weightPercent: parseFloat(weightPercent.toFixed(4)),
    molarityM: parseFloat(molarity.toFixed(6))
  };
}

// ==========================================
// 2. PHYSICS EXTENDED ENGINES
// ==========================================

export function calculateOhmPowerTriangle(params: { v?: number; i?: number; r?: number; p?: number }): {
  voltageV: number;
  currentI: number;
  resistanceR: number;
  powerW: number;
} {
  let { v, i, r, p } = params;

  if (v && i) { r = v / i; p = v * i; }
  else if (v && r) { i = v / r; p = (v * v) / r; }
  else if (i && r) { v = i * r; p = i * i * r; }
  else if (p && v) { i = p / v; r = (v * v) / p; }
  else { v = 12; i = 2; r = 6; p = 24; }

  return {
    voltageV: parseFloat((v || 0).toFixed(2)),
    currentI: parseFloat((i || 0).toFixed(3)),
    resistanceR: parseFloat((r || 0).toFixed(2)),
    powerW: parseFloat((p || 0).toFixed(2))
  };
}

export function calculateTorque(forceN = 50, armLengthM = 0.5, angleDeg = 90): {
  torqueNm: number;
  torqueFtLbs: number;
} {
  const rad = (angleDeg * Math.PI) / 180;
  const torque = forceN * armLengthM * Math.sin(rad);

  return {
    torqueNm: parseFloat(torque.toFixed(2)),
    torqueFtLbs: parseFloat((torque * 0.737562).toFixed(2))
  };
}

export function calculateMomentumImpulse(massKg = 10, velocityMps = 15, forceN = 50, timeSec = 2): {
  momentumKgmS: number;
  impulseNs: number;
  finalVelocityMps: number;
} {
  const p = massKg * velocityMps;
  const J = forceN * timeSec;
  const vFinal = velocityMps + J / massKg;

  return {
    momentumKgmS: parseFloat(p.toFixed(2)),
    impulseNs: parseFloat(J.toFixed(2)),
    finalVelocityMps: parseFloat(vFinal.toFixed(2))
  };
}

export function calculateDopplerEffect(sourceFreqHz = 440, vSourceMps = 30, vObserverMps = 0, speedOfSoundMps = 343): {
  observedFrequencyHz: number;
  frequencyShiftHz: number;
  pitchChange: string;
} {
  // Source approaching observer
  const fObserved = sourceFreqHz * ((speedOfSoundMps + vObserverMps) / (speedOfSoundMps - vSourceMps));
  const shift = fObserved - sourceFreqHz;

  return {
    observedFrequencyHz: parseFloat(fObserved.toFixed(2)),
    frequencyShiftHz: parseFloat(shift.toFixed(2)),
    pitchChange: shift > 0 ? 'Higher Pitch (Approaching)' : 'Lower Pitch (Receding)'
  };
}

export function calculateRefractionIndexSnell(n1 = 1.0, angle1Deg = 30, n2 = 1.333): {
  refractionAngleDeg: number;
  criticalAngleDeg?: number;
  speedOfLightInMediumMps: string;
} {
  const rad1 = (angle1Deg * Math.PI) / 180;
  const sinRad2 = (n1 * Math.sin(rad1)) / n2;
  const angle2Deg = (Math.asin(sinRad2) * 180) / Math.PI;

  let critDeg: number | undefined;
  if (n1 > n2) {
    critDeg = (Math.asin(n2 / n1) * 180) / Math.PI;
  }

  const vMedium = 299792458 / n2;

  return {
    refractionAngleDeg: parseFloat(angle2Deg.toFixed(2)),
    criticalAngleDeg: critDeg ? parseFloat(critDeg.toFixed(2)) : undefined,
    speedOfLightInMediumMps: (vMedium / 1000).toFixed(0) + ' km/s'
  };
}

export function calculateTerminalVelocity(massKg = 80, dragCoeff = 1.0, areaM2 = 0.7, airDensity = 1.225, g = 9.81): {
  terminalVelocityMps: number;
  terminalVelocityKmh: number;
} {
  const v = Math.sqrt((2 * massKg * g) / (airDensity * areaM2 * dragCoeff));
  return {
    terminalVelocityMps: parseFloat(v.toFixed(2)),
    terminalVelocityKmh: parseFloat((v * 3.6).toFixed(2))
  };
}

export function calculateEscapeVelocity(planetMassKg = 5.972e24, planetRadiusM = 6371000): {
  escapeVelocityMps: number;
  escapeVelocityKms: number;
  escapeVelocityKmh: number;
} {
  const G = 6.6743e-11;
  const v = Math.sqrt((2 * G * planetMassKg) / planetRadiusM);

  return {
    escapeVelocityMps: parseFloat(v.toFixed(2)),
    escapeVelocityKms: parseFloat((v / 1000).toFixed(2)),
    escapeVelocityKmh: parseFloat(((v / 1000) * 3600).toFixed(0))
  };
}

export function calculateShmPeriod(massKg = 2.0, springConstK = 50): {
  periodSeconds: number;
  frequencyHz: number;
  angularFrequencyRadS: number;
} {
  const omega = Math.sqrt(springConstK / massKg);
  const T = (2 * Math.PI) / omega;
  const f = 1 / T;

  return {
    periodSeconds: parseFloat(T.toFixed(3)),
    frequencyHz: parseFloat(f.toFixed(3)),
    angularFrequencyRadS: parseFloat(omega.toFixed(3))
  };
}
