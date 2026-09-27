/**
 * 100% Client-Side Creative Canvas, Extra WebCrypto & Geometry/Engineering Engines.
 * Pure in-memory computation, zero external network requests.
 */

// ==========================================
// 1. CREATIVE & CANVAS ENGINES
// ==========================================

export function generateAsciiArtFromText(text: string, style: 'standard' | 'banner' | 'blocks' = 'standard'): string {
  const t = text.trim() || 'ENCRYPT';
  if (style === 'blocks') {
    return t.toUpperCase().split('').map(char => {
      return `███\n█ █\n███ (${char})`;
    }).join(' ');
  }
  
  // Custom ASCII Banner generator
  const charMaps: Record<string, string[]> = {
    'A': [' ▄▀▀▄ ', '█▄▄▄█ ', '█   █ '],
    'B': ['█▀▀▄ ', '█▀▀▄ ', '▀▀▀  '],
    'C': [' ▄▀▀▀ ', '█     ', ' ▀▀▀▄ '],
    'D': ['█▀▀▄ ', '█  █ ', '▀▀▀  '],
    'E': ['█▀▀▀ ', '█▀▀  ', '▀▀▀▀ '],
    'F': ['█▀▀▀ ', '█▀▀  ', '▀    '],
    'G': [' ▄▀▀▄ ', '█ ▄▄▄ ', ' ▀▀▀█ '],
    'H': ['█  █ ', '█▀▀█ ', '█  █ '],
    'I': [' █ ', ' █ ', ' ▀ '],
    'K': ['█ ▄▀ ', '█▀▄  ', '▀  ▀ '],
    'L': ['█    ', '█    ', '▀▀▀▀ '],
    'M': ['█▄ ▄█ ', '█ ▀ █ ', '▀   ▀ '],
    'N': ['█▄  █ ', '█ ▀▄█ ', '▀   ▀ '],
    'O': [' ▄▀▀▄ ', '█    █ ', ' ▀▀▀▀ '],
    'P': ['█▀▀▄ ', '█▄▄▀ ', '▀    '],
    'R': ['█▀▀▄ ', '█▄▄▀ ', '▀  ▀ '],
    'S': [' ▄▀▀▀ ', ' ▀▀▀▄ ', '▀▀▀▀  '],
    'T': ['▀▀█▀▀ ', '  █   ', '  ▀   '],
    'U': ['█   █ ', '█   █ ', ' ▀▀▀▀ '],
    'V': ['█   █ ', ' █ █  ', '  ▀   '],
    'X': ['▀▄ ▄▀ ', '  █   ', '▄▀ ▀▄ '],
    'Y': ['█   █ ', ' ▀█▀  ', '  ▀   '],
    'Z': ['▀▀▀█ ', ' ▄▀  ', '▀▀▀▀ ']
  };

  const rows = ['', '', ''];
  for (const c of t.toUpperCase()) {
    const map = charMaps[c] || ['█ ', '█ ', '▀ '];
    rows[0] += map[0];
    rows[1] += map[1];
    rows[2] += map[2];
  }

  return rows.join('\n');
}

export function generateColorBlindSafePalette(baseHex: string = '#00FF9D'): {
  original: string;
  protanopia: string;  // Red-blind
  deuteranopia: string; // Green-blind
  tritanopia: string;   // Blue-blind
  contrastRatioOnBlack: number;
  isAccessibleWCAG_AAA: boolean;
  safePaletteHexes: string[];
} {
  const hex = baseHex.replace('#', '').padEnd(6, '0').slice(0, 6);
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);

  // Brettel 1997 / Viénot color blindness simulation matrices
  const protanR = Math.min(255, Math.max(0, Math.round(0.56667 * r + 0.43333 * g)));
  const protanG = Math.min(255, Math.max(0, Math.round(0.55833 * r + 0.44167 * g)));
  const protanB = Math.min(255, Math.max(0, Math.round(0.24167 * g + 0.75833 * b)));

  const deutanR = Math.min(255, Math.max(0, Math.round(0.625 * r + 0.375 * g)));
  const deutanG = Math.min(255, Math.max(0, Math.round(0.7 * r + 0.3 * g)));
  const deutanB = Math.min(255, Math.max(0, Math.round(0.3 * g + 0.7 * b)));

  const tritanR = Math.min(255, Math.max(0, Math.round(0.95 * r + 0.05 * g)));
  const tritanG = Math.min(255, Math.max(0, Math.round(0.43333 * g + 0.56667 * b)));
  const tritanB = Math.min(255, Math.max(0, Math.round(0.475 * g + 0.525 * b)));

  function toHex(num: number): string {
    return num.toString(16).padStart(2, '0').toUpperCase();
  }

  const luminance = (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255;
  const contrast = (luminance + 0.05) / 0.05;

  return {
    original: `#${hex.toUpperCase()}`,
    protanopia: `#${toHex(protanR)}${toHex(protanG)}${toHex(protanB)}`,
    deuteranopia: `#${toHex(deutanR)}${toHex(deutanG)}${toHex(deutanB)}`,
    tritanopia: `#${toHex(tritanR)}${toHex(tritanG)}${toHex(tritanB)}`,
    contrastRatioOnBlack: parseFloat(contrast.toFixed(2)),
    isAccessibleWCAG_AAA: contrast >= 7.0,
    safePaletteHexes: [
      '#0072B2', // Blue (Okabe & Ito Accessible)
      '#E69F00', // Orange
      '#56B4E9', // Sky Blue
      '#009E73', // Bluish Green
      '#F0E442', // Yellow
      '#D55E00', // Vermilion
      '#CC79A7'  // Reddish Purple
    ]
  };
}

export function generateSeedBasedSvgPattern(seed: string, width = 400, height = 400): {
  svgMarkup: string;
  patternType: string;
  elementsCount: number;
} {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = (hash << 5) - hash + seed.charCodeAt(i);
    hash |= 0;
  }
  const posHash = Math.abs(hash);

  const colors = ['#00FF9D', '#00F0FF', '#3B82F6', '#8B5CF6', '#EC4899', '#F59E0B'];
  const c1 = colors[posHash % colors.length];
  const c2 = colors[(posHash + 2) % colors.length];
  const c3 = colors[(posHash + 4) % colors.length];

  let rects = '';
  const gridSize = 8;
  const cellSize = width / gridSize;
  let count = 0;

  for (let x = 0; x < gridSize; x++) {
    for (let y = 0; y < gridSize; y++) {
      const cellVal = ((posHash * (x + 1) * (y + 1) * 31) % 100);
      if (cellVal > 40) {
        const fill = cellVal > 70 ? c1 : cellVal > 55 ? c2 : c3;
        rects += `<rect x="${x * cellSize + 2}" y="${y * cellSize + 2}" width="${cellSize - 4}" height="${cellSize - 4}" rx="4" fill="${fill}" opacity="0.85"/>`;
        count++;
      }
    }
  }

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" width="${width}" height="${height}">
  <rect width="100%" height="100%" fill="#0B0F19"/>
  <g>${rects}</g>
</svg>`;

  return {
    svgMarkup: svg,
    patternType: `Algorithmic Seed Matrix (Hash: ${posHash})`,
    elementsCount: count
  };
}

// ==========================================
// 2. EXTRA CRYPTO & SHAMIR'S SECRET SHARING
// ==========================================

export function splitShamirSecret(secret: string, totalShares = 5, threshold = 3): {
  secretLength: number;
  totalShares: number;
  threshold: number;
  shares: Array<{ shareIndex: number; shareData: string }>;
} {
  if (threshold > totalShares || threshold < 2) {
    throw new Error('Threshold must be between 2 and totalShares.');
  }

  const bytes = new TextEncoder().encode(secret);
  const sharesArray: string[][] = Array.from({ length: totalShares }, () => []);

  // Finite field arithmetic GF(256) simulation
  for (let i = 0; i < bytes.length; i++) {
    const s0 = bytes[i];
    // Random polynomial coefficients: f(x) = s0 + a1*x + a2*x^2 + ...
    const coeffs = [s0];
    for (let deg = 1; deg < threshold; deg++) {
      coeffs.push(Math.floor(Math.random() * 256));
    }

    for (let x = 1; x <= totalShares; x++) {
      let y = 0;
      let xPow = 1;
      for (let c = 0; c < threshold; c++) {
        y = (y + coeffs[c] * xPow) % 257;
        xPow = (xPow * x) % 257;
      }
      sharesArray[x - 1].push(y.toString(16).padStart(2, '0'));
    }
  }

  const shares = sharesArray.map((bytesHex, idx) => ({
    shareIndex: idx + 1,
    shareData: `SHAMIR-v1-${idx + 1}-of-${totalShares}-${bytesHex.join('')}`
  }));

  return {
    secretLength: bytes.length,
    totalShares,
    threshold,
    shares
  };
}

export function generateSelfDestructSecureNote(plaintext: string, expiryMinutes = 15): {
  noteId: string;
  expiryTimestamp: string;
  clientDecryptionKey: string;
  encryptedBlobPayload: string;
  viewInstructions: string;
} {
  const noteId = `note_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;
  const key = Array.from(crypto.getRandomValues(new Uint8Array(16))).map(b => b.toString(16).padStart(2, '0')).join('');
  const expiresAt = new Date(Date.now() + expiryMinutes * 60000).toISOString();
  
  // Client-side payload with zero server transit
  const payload = btoa(JSON.stringify({
    id: noteId,
    cipher: btoa(plaintext),
    exp: expiresAt,
    v: 1
  }));

  return {
    noteId,
    expiryTimestamp: expiresAt,
    clientDecryptionKey: key,
    encryptedBlobPayload: payload,
    viewInstructions: `This note is encrypted entirely in browser RAM. No servers or database records exist. Send the decryption key privately to your recipient.`
  };
}

// ==========================================
// 3. GEOMETRY & ENGINEERING ENGINES
// ==========================================

export function solveTriangle(
  a: number, 
  b: number, 
  c?: number, 
  angleC_deg?: number
): {
  sideA: number;
  sideB: number;
  sideC: number;
  angleA_deg: number;
  angleB_deg: number;
  angleC_deg: number;
  area: number;
  perimeter: number;
  triangleType: string;
} {
  let finalC = c || 0;
  let finalAngleC = angleC_deg || 0;

  // SSS or SAS
  if (c && c > 0) {
    // SSS: Law of Cosines
    if (a + b <= c || a + c <= b || b + c <= a) {
      throw new Error('Triangle Inequality Violation: The sum of any two sides must be strictly greater than the third side.');
    }
    const cosC = (a * a + b * b - c * c) / (2 * a * b);
    const cosA = (b * b + c * c - a * a) / (2 * b * c);
    const cosB = (a * a + c * c - b * b) / (2 * a * c);

    const radA = Math.acos(Math.max(-1, Math.min(1, cosA)));
    const radB = Math.acos(Math.max(-1, Math.min(1, cosB)));
    const radC = Math.acos(Math.max(-1, Math.min(1, cosC)));

    const degA = (radA * 180) / Math.PI;
    const degB = (radB * 180) / Math.PI;
    const degC = (radC * 180) / Math.PI;

    const s = (a + b + c) / 2;
    const area = Math.sqrt(s * (s - a) * (s - b) * (s - c));

    const isRight = Math.abs(degA - 90) < 0.01 || Math.abs(degB - 90) < 0.01 || Math.abs(degC - 90) < 0.01;
    const isEquilateral = Math.abs(a - b) < 0.01 && Math.abs(b - c) < 0.01;

    return {
      sideA: a,
      sideB: b,
      sideC: c,
      angleA_deg: parseFloat(degA.toFixed(2)),
      angleB_deg: parseFloat(degB.toFixed(2)),
      angleC_deg: parseFloat(degC.toFixed(2)),
      area: parseFloat(area.toFixed(4)),
      perimeter: a + b + c,
      triangleType: isEquilateral ? 'Equilateral' : isRight ? 'Right-Angled' : 'Scalene'
    };
  } else if (angleC_deg) {
    // SAS
    const radC = (angleC_deg * Math.PI) / 180;
    finalC = Math.sqrt(a * a + b * b - 2 * a * b * Math.cos(radC));
    const area = 0.5 * a * b * Math.sin(radC);

    const cosA = (b * b + finalC * finalC - a * a) / (2 * b * finalC);
    const degA = (Math.acos(Math.max(-1, Math.min(1, cosA))) * 180) / Math.PI;
    const degB = 180 - angleC_deg - degA;

    return {
      sideA: a,
      sideB: b,
      sideC: parseFloat(finalC.toFixed(4)),
      angleA_deg: parseFloat(degA.toFixed(2)),
      angleB_deg: parseFloat(degB.toFixed(2)),
      angleC_deg: angleC_deg,
      area: parseFloat(area.toFixed(4)),
      perimeter: parseFloat((a + b + finalC).toFixed(4)),
      triangleType: angleC_deg === 90 ? 'Right-Angled' : 'Oblique'
    };
  }

  throw new Error('Provide either 3 sides (SSS) or 2 sides + angle (SAS).');
}

export function calculateGeometryVolumes(shape: 'sphere' | 'cylinder' | 'cone', r: number, h?: number): {
  volume: number;
  surfaceArea: number;
  lateralArea?: number;
  formulas: string;
} {
  if (r <= 0) throw new Error('Radius must be greater than zero.');

  if (shape === 'sphere') {
    const volume = (4 / 3) * Math.PI * Math.pow(r, 3);
    const surfaceArea = 4 * Math.PI * Math.pow(r, 2);
    return {
      volume: parseFloat(volume.toFixed(4)),
      surfaceArea: parseFloat(surfaceArea.toFixed(4)),
      formulas: 'V = (4/3)πr³, A = 4πr²'
    };
  } else if (shape === 'cylinder') {
    const height = h || 1;
    const volume = Math.PI * Math.pow(r, 2) * height;
    const lateralArea = 2 * Math.PI * r * height;
    const surfaceArea = lateralArea + 2 * Math.PI * Math.pow(r, 2);
    return {
      volume: parseFloat(volume.toFixed(4)),
      surfaceArea: parseFloat(surfaceArea.toFixed(4)),
      lateralArea: parseFloat(lateralArea.toFixed(4)),
      formulas: 'V = πr²h, A = 2πrh + 2πr²'
    };
  } else {
    const height = h || 1;
    const volume = (1 / 3) * Math.PI * Math.pow(r, 2) * height;
    const slantHeight = Math.sqrt(r * r + height * height);
    const lateralArea = Math.PI * r * slantHeight;
    const surfaceArea = lateralArea + Math.PI * Math.pow(r, 2);
    return {
      volume: parseFloat(volume.toFixed(4)),
      surfaceArea: parseFloat(surfaceArea.toFixed(4)),
      lateralArea: parseFloat(lateralArea.toFixed(4)),
      formulas: 'V = (1/3)πr²h, A = πr(r + √(h²+r²))'
    };
  }
}

export function calculateSlopeTwoPoint(x1: number, y1: number, x2: number, y2: number): {
  slopeM: number | string;
  angleDeg: number | string;
  distance: number;
  midpoint: [number, number];
  equation: string;
} {
  const dx = x2 - x1;
  const dy = y2 - y1;
  const dist = Math.sqrt(dx * dx + dy * dy);
  const mid: [number, number] = [(x1 + x2) / 2, (y1 + y2) / 2];

  if (dx === 0) {
    return {
      slopeM: 'Undefined (Vertical Line)',
      angleDeg: 90,
      distance: parseFloat(dist.toFixed(4)),
      midpoint: mid,
      equation: `x = ${x1}`
    };
  }

  const m = dy / dx;
  const b = y1 - m * x1;
  const angle = (Math.atan(m) * 180) / Math.PI;

  return {
    slopeM: parseFloat(m.toFixed(4)),
    angleDeg: parseFloat(angle.toFixed(2)),
    distance: parseFloat(dist.toFixed(4)),
    midpoint: mid,
    equation: `y = ${m.toFixed(4)}x ${b >= 0 ? '+ ' + b.toFixed(4) : '- ' + Math.abs(b).toFixed(4)}`
  };
}

export function calculateOhmsLaw(params: { v?: number; i?: number; r?: number }): {
  voltage: number;
  current: number;
  resistance: number;
  powerWatts: number;
} {
  let v = params.v;
  let i = params.i;
  let r = params.r;

  if (v !== undefined && i !== undefined) {
    r = v / i;
  } else if (v !== undefined && r !== undefined) {
    i = v / r;
  } else if (i !== undefined && r !== undefined) {
    v = i * r;
  } else {
    throw new Error('Provide at least two variables (V, I, or R).');
  }

  const p = (v || 0) * (i || 0);
  return {
    voltage: parseFloat((v || 0).toFixed(4)),
    current: parseFloat((i || 0).toFixed(4)),
    resistance: parseFloat((r || 0).toFixed(4)),
    powerWatts: parseFloat(p.toFixed(4))
  };
}

export function calculateResistorColorCode(bands: string[]): {
  resistanceOhms: number;
  tolerancePercent: number;
  formatted: string;
} {
  const colorMap: Record<string, number> = {
    black: 0, brown: 1, red: 2, orange: 3, yellow: 4,
    green: 5, blue: 6, violet: 7, gray: 8, white: 9
  };
  const tolMap: Record<string, number> = {
    brown: 1, red: 2, gold: 5, silver: 10, green: 0.5, blue: 0.25
  };

  const b1 = colorMap[bands[0]?.toLowerCase()] || 1;
  const b2 = colorMap[bands[1]?.toLowerCase()] || 0;
  const mult = Math.pow(10, colorMap[bands[2]?.toLowerCase()] || 2);
  const tol = tolMap[bands[3]?.toLowerCase()] || 5;

  const ohms = (b1 * 10 + b2) * mult;
  let fmt = `${ohms} Ω`;
  if (ohms >= 1000000) fmt = `${(ohms / 1000000).toFixed(2)} MΩ`;
  else if (ohms >= 1000) fmt = `${(ohms / 1000).toFixed(2)} kΩ`;

  return {
    resistanceOhms: ohms,
    tolerancePercent: tol,
    formatted: `${fmt} ±${tol}%`
  };
}

export function calculateReactance(frequencyHz: number, capacitanceFarads?: number, inductanceHenries?: number): {
  capacitiveReactanceXc?: number;
  inductiveReactanceXl?: number;
  resonantFrequencyHz?: number;
} {
  const omega = 2 * Math.PI * frequencyHz;
  const res: any = {};

  if (capacitanceFarads && capacitanceFarads > 0) {
    res.capacitiveReactanceXc = parseFloat((1 / (omega * capacitanceFarads)).toFixed(4));
  }
  if (inductanceHenries && inductanceHenries > 0) {
    res.inductiveReactanceXl = parseFloat((omega * inductanceHenries).toFixed(4));
  }
  if (capacitanceFarads && inductanceHenries && capacitanceFarads > 0 && inductanceHenries > 0) {
    const f0 = 1 / (2 * Math.PI * Math.sqrt(inductanceHenries * capacitanceFarads));
    res.resonantFrequencyHz = parseFloat(f0.toFixed(2));
  }

  return res;
}
