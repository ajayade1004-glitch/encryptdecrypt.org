/**
 * 100% Client-Side Developer Utilities & Math/Number Extras Engines.
 * Pure TypeScript algorithms, matrix solvers, financial formulas, and header builders.
 */

// ==========================================
// 1. DEVELOPER UTILITY EXTRAS ENGINES
// ==========================================

export function testSemverRange(semverRange = '^1.2.3', targetVersion = '1.4.0'): {
  semverRange: string;
  targetVersion: string;
  isSatisfied: boolean;
  explanation: string;
} {
  const range = semverRange.trim();
  const ver = targetVersion.trim();
  const rangeParts = range.replace(/[\^~]/, '').split('.').map(n => parseInt(n, 10) || 0);
  const verParts = ver.split('.').map(n => parseInt(n, 10) || 0);

  let satisfied = false;
  if (range.startsWith('^')) {
    satisfied = verParts[0] === rangeParts[0] && (verParts[1] > rangeParts[1] || (verParts[1] === rangeParts[1] && verParts[2] >= rangeParts[2]));
  } else if (range.startsWith('~')) {
    satisfied = verParts[0] === rangeParts[0] && verParts[1] === rangeParts[1] && verParts[2] >= rangeParts[2];
  } else {
    satisfied = ver === range;
  }

  return {
    semverRange: range,
    targetVersion: ver,
    isSatisfied: satisfied,
    explanation: satisfied
      ? `Version ${ver} satisfies range ${range} (compatible backward-compatible update).`
      : `Version ${ver} does NOT satisfy range ${range}.`
  };
}

export function validateNpmPackageName(packageName = 'my-awesome-tool'): {
  packageName: string;
  isValidNpmName: boolean;
  warnings: string[];
} {
  const name = packageName.trim();
  const warnings: string[] = [];

  if (name.length === 0) warnings.push('Package name cannot be empty.');
  if (name.length > 214) warnings.push('Package name cannot exceed 214 characters.');
  if (/[A-Z]/.test(name)) warnings.push('Package name must be lowercase.');
  if (/[~'!()*]/.test(name)) warnings.push('Package name contains invalid special characters.');
  if (name.startsWith('.') || name.startsWith('_')) warnings.push('Package name cannot start with period or underscore.');

  return {
    packageName: name,
    isValidNpmName: warnings.length === 0,
    warnings
  };
}

export function buildCacheControlHeader(maxAgeSeconds = 3600, isPublic = true, mustRevalidate = false, noCache = false): {
  cacheControlHeader: string;
  recommendedUseCases: string;
} {
  if (noCache) {
    return {
      cacheControlHeader: 'Cache-Control: no-cache, no-store, must-revalidate',
      recommendedUseCases: 'Sensitive dynamic API responses and authentication endpoints.'
    };
  }

  const directives = [
    isPublic ? 'public' : 'private',
    `max-age=${maxAgeSeconds}`
  ];
  if (mustRevalidate) directives.push('must-revalidate');

  const header = `Cache-Control: ${directives.join(', ')}`;

  return {
    cacheControlHeader: header,
    recommendedUseCases: isPublic ? 'Static assets (CSS, JS, Images) served via CDN.' : 'Private authenticated user dashboard data.'
  };
}

export function calculateWebhookBackoff(attempts = 5, initialIntervalSec = 2, multiplier = 2): {
  attempts: number;
  retrySchedule: Array<{ attempt: number; delaySeconds: number; cumulativeWaitSeconds: number }>;
  totalWaitTimeMinutes: number;
} {
  const schedule: Array<{ attempt: number; delaySeconds: number; cumulativeWaitSeconds: number }> = [];
  let cumulative = 0;
  let currentDelay = initialIntervalSec;

  for (let i = 1; i <= attempts; i++) {
    cumulative += currentDelay;
    schedule.push({
      attempt: i,
      delaySeconds: currentDelay,
      cumulativeWaitSeconds: cumulative
    });
    currentDelay *= multiplier;
  }

  return {
    attempts,
    retrySchedule: schedule,
    totalWaitTimeMinutes: parseFloat((cumulative / 60).toFixed(1))
  };
}

export function generateEtag(contentString = 'Hello World', isWeak = true): {
  contentString: string;
  etagHeader: string;
  isWeakEtag: boolean;
} {
  let hash = 0;
  for (let i = 0; i < contentString.length; i++) {
    hash = ((hash << 5) - hash) + contentString.charCodeAt(i);
    hash |= 0;
  }
  const hex = Math.abs(hash).toString(16);
  const etag = isWeak ? `ETag: W/"${hex}-${contentString.length}"` : `ETag: "${hex}-${contentString.length}"`;

  return {
    contentString,
    etagHeader: etag,
    isWeakEtag: isWeak
  };
}

// ==========================================
// 2. MATH & NUMBER EXTRAS ENGINES
// ==========================================

export function calculateHarmonicMean(numbers: number[] = [2, 4, 8]): {
  numbers: number[];
  harmonicMean: number;
} {
  const valid = numbers.filter(n => n > 0);
  if (valid.length === 0) return { numbers, harmonicMean: 0 };

  const reciprocalsSum = valid.reduce((acc, n) => acc + (1 / n), 0);
  const hm = valid.length / reciprocalsSum;

  return {
    numbers: valid,
    harmonicMean: parseFloat(hm.toFixed(3))
  };
}

export function calculateGeometricMean(numbers: number[] = [2, 8, 32]): {
  numbers: number[];
  geometricMean: number;
} {
  const valid = numbers.filter(n => n > 0);
  if (valid.length === 0) return { numbers, geometricMean: 0 };

  const product = valid.reduce((acc, n) => acc * n, 1);
  const gm = Math.pow(product, 1 / valid.length);

  return {
    numbers: valid,
    geometricMean: parseFloat(gm.toFixed(3))
  };
}

export function calculateCagr(initialValue = 10000, finalValue = 25000, periodYears = 5): {
  initialValue: number;
  finalValue: number;
  periodYears: number;
  cagrPercent: number;
  totalGrowthPercent: number;
} {
  const cagr = (Math.pow(finalValue / initialValue, 1 / periodYears) - 1) * 100;
  const growth = ((finalValue - initialValue) / initialValue) * 100;

  return {
    initialValue,
    finalValue,
    periodYears,
    cagrPercent: parseFloat(cagr.toFixed(2)),
    totalGrowthPercent: parseFloat(growth.toFixed(1))
  };
}

export function calculateRuleOf72(interestRatePercent = 8): {
  interestRatePercent: number;
  doublingYearsRuleOf72: number;
  exactDoublingYearsLog: number;
} {
  const rule72 = 72 / interestRatePercent;
  const exact = Math.log(2) / Math.log(1 + interestRatePercent / 100);

  return {
    interestRatePercent,
    doublingYearsRuleOf72: parseFloat(rule72.toFixed(1)),
    exactDoublingYearsLog: parseFloat(exact.toFixed(2))
  };
}

export function solveQuadraticFormula(a = 1, b = -5, c = 6): {
  a: number; b: number; c: number;
  discriminant: number;
  root1: number | string;
  root2: number | string;
  rootType: string;
} {
  const disc = b * b - 4 * a * c;
  let r1: number | string = 0;
  let r2: number | string = 0;
  let type = 'Two Real Distinct Roots';

  if (disc > 0) {
    r1 = parseFloat(((-b + Math.sqrt(disc)) / (2 * a)).toFixed(2));
    r2 = parseFloat(((-b - Math.sqrt(disc)) / (2 * a)).toFixed(2));
  } else if (disc === 0) {
    r1 = parseFloat((-b / (2 * a)).toFixed(2));
    r2 = r1;
    type = 'One Single Real Repeated Root';
  } else {
    type = 'Complex Conjugate Roots';
    const real = (-b / (2 * a)).toFixed(2);
    const imag = (Math.sqrt(-disc) / (2 * a)).toFixed(2);
    r1 = `${real} + ${imag}i`;
    r2 = `${real} - ${imag}i`;
  }

  return { a, b, c, discriminant: disc, root1: r1, root2: r2, rootType: type };
}

export function calculate2x2MatrixInverse(a = 4, b = 7, c = 2, d = 6): {
  determinant: number;
  isInvertible: boolean;
  inverseMatrix: number[][] | null;
} {
  const det = a * d - b * c;
  if (det === 0) {
    return { determinant: 0, isInvertible: false, inverseMatrix: null };
  }

  const invA = d / det;
  const invB = -b / det;
  const invC = -c / det;
  const invD = a / det;

  return {
    determinant: parseFloat(det.toFixed(2)),
    isInvertible: true,
    inverseMatrix: [
      [parseFloat(invA.toFixed(3)), parseFloat(invB.toFixed(3))],
      [parseFloat(invC.toFixed(3)), parseFloat(invD.toFixed(3))]
    ]
  };
}
