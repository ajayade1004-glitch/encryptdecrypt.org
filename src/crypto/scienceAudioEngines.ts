/**
 * 100% Client-Side Science, Physics & Music Audio Theory Engines.
 * Pure in-memory computation, zero external network requests.
 */

// ==========================================
// 1. SCIENCE & PHYSICS ENGINES
// ==========================================

export function calculateProjectileMotion(v0: number, angleDeg: number, g = 9.80665): {
  initialVelocity: number;
  launchAngle: number;
  totalFlightTimeSec: number;
  maxHeightMeters: number;
  horizontalRangeMeters: number;
  vx: number;
  vy0: number;
  trajectoryPoints: Array<{ t: number; x: number; y: number }>;
} {
  if (v0 <= 0) throw new Error('Initial velocity must be greater than zero.');
  const theta = (angleDeg * Math.PI) / 180;
  const vx = v0 * Math.cos(theta);
  const vy0 = v0 * Math.sin(theta);

  const totalTime = (2 * vy0) / g;
  const maxHeight = (vy0 * vy0) / (2 * g);
  const range = vx * totalTime;

  // 10 trajectory steps for visualization
  const points: Array<{ t: number; x: number; y: number }> = [];
  const steps = 10;
  for (let i = 0; i <= steps; i++) {
    const t = (totalTime / steps) * i;
    const x = vx * t;
    const y = Math.max(0, vy0 * t - 0.5 * g * t * t);
    points.push({
      t: parseFloat(t.toFixed(2)),
      x: parseFloat(x.toFixed(2)),
      y: parseFloat(y.toFixed(2))
    });
  }

  return {
    initialVelocity: v0,
    launchAngle: angleDeg,
    totalFlightTimeSec: parseFloat(totalTime.toFixed(3)),
    maxHeightMeters: parseFloat(maxHeight.toFixed(3)),
    horizontalRangeMeters: parseFloat(range.toFixed(3)),
    vx: parseFloat(vx.toFixed(3)),
    vy0: parseFloat(vy0.toFixed(3)),
    trajectoryPoints: points
  };
}

export function calculateFreeFall(heightMeters: number, g = 9.80665): {
  heightMeters: number;
  fallTimeSec: number;
  impactVelocityMps: number;
  impactVelocityKmh: number;
  kineticEnergyPerKg: number;
} {
  if (heightMeters <= 0) throw new Error('Height must be greater than zero.');
  const time = Math.sqrt((2 * heightMeters) / g);
  const v = g * time;
  const vKmh = v * 3.6;
  const ke = 0.5 * v * v;

  return {
    heightMeters,
    fallTimeSec: parseFloat(time.toFixed(3)),
    impactVelocityMps: parseFloat(v.toFixed(3)),
    impactVelocityKmh: parseFloat(vKmh.toFixed(2)),
    kineticEnergyPerKg: parseFloat(ke.toFixed(2))
  };
}

export function calculateDensityMassVolume(params: { density?: number; mass?: number; volume?: number }): {
  densityGcm3: number;
  massGrams: number;
  volumeCm3: number;
  densityKgm3: number;
} {
  let { density, mass, volume } = params;
  if (density && mass) {
    volume = mass / density;
  } else if (density && volume) {
    mass = density * volume;
  } else if (mass && volume) {
    density = mass / volume;
  } else {
    throw new Error('Provide at least two values (density, mass, or volume).');
  }

  return {
    densityGcm3: parseFloat((density || 0).toFixed(4)),
    massGrams: parseFloat((mass || 0).toFixed(4)),
    volumeCm3: parseFloat((volume || 0).toFixed(4)),
    densityKgm3: parseFloat(((density || 0) * 1000).toFixed(2))
  };
}

export const PERIODIC_TABLE: Record<string, { name: string; weight: number; number: number }> = {
  H: { name: 'Hydrogen', weight: 1.008, number: 1 },
  He: { name: 'Helium', weight: 4.0026, number: 2 },
  Li: { name: 'Lithium', weight: 6.94, number: 3 },
  Be: { name: 'Beryllium', weight: 9.0122, number: 4 },
  B: { name: 'Boron', weight: 10.81, number: 5 },
  C: { name: 'Carbon', weight: 12.011, number: 6 },
  N: { name: 'Nitrogen', weight: 14.007, number: 7 },
  O: { name: 'Oxygen', weight: 15.999, number: 8 },
  F: { name: 'Fluorine', weight: 18.998, number: 9 },
  Ne: { name: 'Neon', weight: 20.18, number: 10 },
  Na: { name: 'Sodium', weight: 22.99, number: 11 },
  Mg: { name: 'Magnesium', weight: 24.305, number: 12 },
  Al: { name: 'Aluminum', weight: 26.982, number: 13 },
  Si: { name: 'Silicon', weight: 28.085, number: 14 },
  P: { name: 'Phosphorus', weight: 30.974, number: 15 },
  S: { name: 'Sulfur', weight: 32.06, number: 16 },
  Cl: { name: 'Chlorine', weight: 35.45, number: 17 },
  K: { name: 'Potassium', weight: 39.098, number: 19 },
  Ca: { name: 'Calcium', weight: 40.078, number: 20 },
  Fe: { name: 'Iron', weight: 55.845, number: 26 },
  Cu: { name: 'Copper', weight: 63.546, number: 29 },
  Zn: { name: 'Zinc', weight: 65.38, number: 30 },
  Ag: { name: 'Silver', weight: 107.87, number: 47 },
  Au: { name: 'Gold', weight: 196.97, number: 79 },
  Pb: { name: 'Lead', weight: 207.2, number: 82 }
};

export function calculateMolarMass(formula: string): {
  formula: string;
  totalMolarMass: number;
  elementBreakdown: Array<{ symbol: string; name: string; count: number; totalWeight: number; massPercent: number }>;
} {
  const clean = formula.trim();
  const regex = /([A-Z][a-z]*)(\d*)/g;
  let match;
  const counts: Record<string, number> = {};

  while ((match = regex.exec(clean)) !== null) {
    if (!match[1]) continue;
    const sym = match[1];
    const count = parseInt(match[2] || '1', 10);
    counts[sym] = (counts[sym] || 0) + count;
  }

  let totalMass = 0;
  const breakdown: any[] = [];

  for (const [sym, count] of Object.entries(counts)) {
    const el = PERIODIC_TABLE[sym] || { name: 'Unknown Element', weight: 1.0 };
    const mass = el.weight * count;
    totalMass += mass;
    breakdown.push({
      symbol: sym,
      name: el.name,
      count,
      totalWeight: mass
    });
  }

  const finalBreakdown = breakdown.map(item => ({
    ...item,
    totalWeight: parseFloat(item.totalWeight.toFixed(3)),
    massPercent: totalMass > 0 ? parseFloat(((item.totalWeight / totalMass) * 100).toFixed(2)) : 0
  }));

  return {
    formula: clean,
    totalMolarMass: parseFloat(totalMass.toFixed(3)),
    elementBreakdown: finalBreakdown
  };
}

export function calculatePH(params: { hPlus?: number; ohMinus?: number; pH?: number }): {
  pH: number;
  pOH: number;
  hPlusConcentration: string;
  ohMinusConcentration: string;
  solutionType: 'Acidic' | 'Neutral' | 'Basic';
} {
  let pH = params.pH;
  if (params.hPlus && params.hPlus > 0) {
    pH = -Math.log10(params.hPlus);
  } else if (params.ohMinus && params.ohMinus > 0) {
    const pOH = -Math.log10(params.ohMinus);
    pH = 14 - pOH;
  }

  if (pH === undefined) pH = 7.0;
  const pOH = 14 - pH;
  const hPlus = Math.pow(10, -pH);
  const ohMinus = Math.pow(10, -pOH);

  return {
    pH: parseFloat(pH.toFixed(3)),
    pOH: parseFloat(pOH.toFixed(3)),
    hPlusConcentration: hPlus.toExponential(3) + ' M',
    ohMinusConcentration: ohMinus.toExponential(3) + ' M',
    solutionType: pH < 6.95 ? 'Acidic' : pH > 7.05 ? 'Basic' : 'Neutral'
  };
}

export function calculateIdealGas(params: { p?: number; v?: number; n?: number; t?: number }): {
  pressureAtm: number;
  volumeLiters: number;
  moles: number;
  tempKelvin: number;
  tempCelsius: number;
  gasConstantR: number;
} {
  const R = 0.082057; // L·atm / (mol·K)
  let { p, v, n, t } = params;

  if (p && v && n) {
    t = (p * v) / (n * R);
  } else if (p && v && t) {
    n = (p * v) / (R * t);
  } else if (p && n && t) {
    v = (n * R * t) / p;
  } else if (v && n && t) {
    p = (n * R * t) / v;
  } else {
    throw new Error('Provide at least 3 parameters to solve the Ideal Gas Law (PV = nRT).');
  }

  return {
    pressureAtm: parseFloat((p || 0).toFixed(4)),
    volumeLiters: parseFloat((v || 0).toFixed(4)),
    moles: parseFloat((n || 0).toFixed(4)),
    tempKelvin: parseFloat((t || 0).toFixed(2)),
    tempCelsius: parseFloat(((t || 0) - 273.15).toFixed(2)),
    gasConstantR: R
  };
}

export function calculateEnergyKineticPotential(massKg: number, velocityMps = 0, heightM = 0, g = 9.80665): {
  kineticEnergyJoules: number;
  potentialEnergyJoules: number;
  totalMechanicalEnergyJoules: number;
} {
  const ke = 0.5 * massKg * Math.pow(velocityMps, 2);
  const pe = massKg * g * heightM;
  return {
    kineticEnergyJoules: parseFloat(ke.toFixed(3)),
    potentialEnergyJoules: parseFloat(pe.toFixed(3)),
    totalMechanicalEnergyJoules: parseFloat((ke + pe).toFixed(3))
  };
}

export function calculateWaveProperties(params: { frequencyHz?: number; wavelengthMeters?: number; waveSpeedMps?: number }): {
  frequencyHz: number;
  wavelengthMeters: number;
  waveSpeedMps: number;
  periodSeconds: number;
} {
  const speedOfLight = 299792458; // m/s
  let speed = params.waveSpeedMps || speedOfLight;
  let f = params.frequencyHz;
  let lambda = params.wavelengthMeters;

  if (f && !lambda) {
    lambda = speed / f;
  } else if (lambda && !f) {
    f = speed / lambda;
  } else if (f && lambda) {
    speed = f * lambda;
  }

  return {
    frequencyHz: parseFloat((f || 0).toFixed(4)),
    wavelengthMeters: parseFloat((lambda || 0).toFixed(4)),
    waveSpeedMps: parseFloat(speed.toFixed(2)),
    periodSeconds: f ? parseFloat((1 / f).toExponential(4)) : 0
  };
}

// ==========================================
// 2. MUSIC & AUDIO THEORY ENGINES
// ==========================================

export function calculateNoteFrequency(noteName = 'A4', standardPitchA4 = 440): {
  note: string;
  frequencyHz: number;
  midiNumber: number;
  semitoneOffsetFromA4: number;
  wavelengthCmInAir: number;
} {
  const notes = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
  const regex = /^([A-G][#b]?)(-?\d+)$/i;
  const match = noteName.trim().match(regex);

  let pitch = 'A';
  let octave = 4;

  if (match) {
    pitch = match[1].toUpperCase();
    octave = parseInt(match[2], 10);
  }

  if (pitch === 'DB') pitch = 'C#';
  if (pitch === 'EB') pitch = 'D#';
  if (pitch === 'GB') pitch = 'F#';
  if (pitch === 'AB') pitch = 'G#';
  if (pitch === 'BB') pitch = 'A#';

  const noteIdx = notes.indexOf(pitch);
  const midi = 12 + octave * 12 + noteIdx;
  const semitonesFromA4 = midi - 69;
  const freq = standardPitchA4 * Math.pow(2, semitonesFromA4 / 12);
  const wavelengthCm = (34300 / freq);

  return {
    note: `${pitch}${octave}`,
    frequencyHz: parseFloat(freq.toFixed(2)),
    midiNumber: midi,
    semitoneOffsetFromA4: semitonesFromA4,
    wavelengthCmInAir: parseFloat(wavelengthCm.toFixed(2))
  };
}

export function calculateBpmDelayTimes(bpm: number): {
  bpm: number;
  quarterNoteMs: number;
  eighthNoteMs: number;
  sixteenthNoteMs: number;
  dottedEighthMs: number;
  tripletQuarterMs: number;
  frequencyHz: number;
} {
  if (bpm <= 0) throw new Error('BPM must be greater than zero.');
  const beatMs = 60000 / bpm; // Quarter note

  return {
    bpm,
    quarterNoteMs: parseFloat(beatMs.toFixed(2)),
    eighthNoteMs: parseFloat((beatMs / 2).toFixed(2)),
    sixteenthNoteMs: parseFloat((beatMs / 4).toFixed(2)),
    dottedEighthMs: parseFloat(((beatMs / 2) * 1.5).toFixed(2)),
    tripletQuarterMs: parseFloat(((beatMs * 2) / 3).toFixed(2)),
    frequencyHz: parseFloat((bpm / 60).toFixed(3))
  };
}

export function generateChordProgressions(key = 'C', mode = 'major'): Array<{
  progressionName: string;
  romanNumerals: string;
  chords: string[];
  genreFeel: string;
}> {
  const majorChords: Record<string, string[]> = {
    'C': ['C', 'Dm', 'Em', 'F', 'G', 'Am', 'Bdim'],
    'G': ['G', 'Am', 'Bm', 'C', 'D', 'Em', 'F#dim'],
    'D': ['D', 'Em', 'F#m', 'G', 'A', 'Bm', 'C#dim'],
    'A': ['A', 'Bm', 'C#m', 'D', 'E', 'F#m', 'G#dim'],
    'F': ['F', 'Gm', 'Am', 'Bb', 'C', 'Dm', 'Edim']
  };

  const map = majorChords[key.toUpperCase()] || majorChords['C'];

  return [
    {
      progressionName: 'Pop / Axis of Awesome',
      romanNumerals: 'I - V - vi - IV',
      chords: [map[0], map[4], map[5], map[3]],
      genreFeel: 'Uplifting Pop & Stadium Rock Anthem'
    },
    {
      progressionName: 'Jazz 2-5-1 Cadence',
      romanNumerals: 'ii - V - I',
      chords: [map[1], map[4], map[0]],
      genreFeel: 'Smooth Jazz & Bossa Nova Resolution'
    },
    {
      progressionName: '50s Doo-Wop Standard',
      romanNumerals: 'I - vi - IV - V',
      chords: [map[0], map[5], map[3], map[4]],
      genreFeel: 'Classic Ballad & Nostalgic RnB'
    },
    {
      progressionName: 'Emotional Cinematic Andalusian',
      romanNumerals: 'vi - IV - I - V',
      chords: [map[5], map[3], map[0], map[4]],
      genreFeel: 'Epic Film Score & Melancholy EDM'
    }
  ];
}

export function findScaleModes(root = 'C', scaleType = 'Major (Ionian)'): {
  rootNote: string;
  scaleType: string;
  notes: string[];
  formulaSteps: string;
} {
  const chromatic = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
  const startIdx = chromatic.indexOf(root.toUpperCase()) !== -1 ? chromatic.indexOf(root.toUpperCase()) : 0;

  const intervalsMajor = [0, 2, 4, 5, 7, 9, 11]; // W W H W W W H
  const scaleNotes = intervalsMajor.map(step => chromatic[(startIdx + step) % 12]);

  return {
    rootNote: chromatic[startIdx],
    scaleType,
    notes: scaleNotes,
    formulaSteps: 'W - W - H - W - W - W - H (Whole & Half steps)'
  };
}

export function getGuitarTunerReference(): Array<{
  stringNum: number;
  note: string;
  frequencyHz: number;
  tuningType: string;
}> {
  return [
    { stringNum: 1, note: 'E4', frequencyHz: 329.63, tuningType: 'Standard' },
    { stringNum: 2, note: 'B3', frequencyHz: 246.94, tuningType: 'Standard' },
    { stringNum: 3, note: 'G3', frequencyHz: 196.00, tuningType: 'Standard' },
    { stringNum: 4, note: 'D3', frequencyHz: 146.83, tuningType: 'Standard' },
    { stringNum: 5, note: 'A2', frequencyHz: 110.00, tuningType: 'Standard' },
    { stringNum: 6, note: 'E2', frequencyHz: 82.41, tuningType: 'Standard' }
  ];
}
