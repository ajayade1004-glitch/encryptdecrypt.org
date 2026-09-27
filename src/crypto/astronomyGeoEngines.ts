/**
 * 100% Client-Side Astronomy, Space, Geography & Map Engines.
 * Pure mathematical formulas, astronomical mechanics, and spatial geodesy.
 */

// ==========================================
// 1. ASTRONOMY & SPACE ENGINES
// ==========================================

export function calculateMoonPhase(dateStr?: string): {
  date: string;
  phaseName: string;
  illuminationPercent: number;
  ageDays: number;
  emoji: string;
} {
  const date = dateStr ? new Date(dateStr) : new Date();
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();

  // Known new moon reference epoch (2000-01-06)
  const c = Math.floor(365.25 * year) + Math.floor(year / 400) - Math.floor(year / 100);
  const e = Math.floor(30.6 * month);
  const jd = c + e + day - 694039.09; // Julian days since epoch
  const synodic = 29.53058867; // Moon cycle length in days
  const age = (jd % synodic + synodic) % synodic;

  let phase = 'New Moon';
  let emoji = '🌑';

  if (age < 1.84566) { phase = 'New Moon'; emoji = '🌑'; }
  else if (age < 5.53699) { phase = 'Waxing Crescent'; emoji = '🌒'; }
  else if (age < 9.22831) { phase = 'First Quarter'; emoji = '🌓'; }
  else if (age < 12.91963) { phase = 'Waxing Gibbous'; emoji = '🌔'; }
  else if (age < 16.61096) { phase = 'Full Moon'; emoji = '🌕'; }
  else if (age < 20.30228) { phase = 'Waning Gibbous'; emoji = '🌖'; }
  else if (age < 23.99361) { phase = 'Third Quarter'; emoji = '🌗'; }
  else if (age < 27.68493) { phase = 'Waning Crescent'; emoji = '🌘'; }
  else { phase = 'New Moon'; emoji = '🌑'; }

  const illumination = (1 - Math.cos((age / synodic) * 2 * Math.PI)) / 2 * 100;

  return {
    date: date.toISOString().split('T')[0],
    phaseName: phase,
    illuminationPercent: parseFloat(illumination.toFixed(1)),
    ageDays: parseFloat(age.toFixed(1)),
    emoji
  };
}

export function calculateSunriseSunset(lat = 28.6139, lon = 77.2090, dateStr?: string): {
  sunriseUtc: string;
  sunsetSunsetUtc: string;
  daylightHours: number;
  solarNoonUtc: string;
} {
  const d = dateStr ? new Date(dateStr) : new Date();
  const dayOfYear = Math.floor((d.getTime() - new Date(d.getFullYear(), 0, 0).getTime()) / 86400000);
  
  // Solar declination approximation
  const declination = 23.45 * Math.sin(((284 + dayOfYear) / 365) * 2 * Math.PI) * (Math.PI / 180);
  const latRad = lat * (Math.PI / 180);

  // Hour angle
  const cosHourAngle = -Math.tan(latRad) * Math.tan(declination);
  const hourAngleDeg = Math.acos(Math.max(-1, Math.min(1, cosHourAngle))) * (180 / Math.PI);

  const solarNoonHours = 12 - (lon / 15);
  const sunriseHours = solarNoonHours - (hourAngleDeg / 15);
  const sunsetHours = solarNoonHours + (hourAngleDeg / 15);

  const formatHours = (h: number) => {
    const hours = Math.floor((h + 24) % 24);
    const mins = Math.floor(((h + 24) % 1 * 60));
    return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')} UTC`;
  };

  return {
    sunriseUtc: formatHours(sunriseHours),
    sunsetSunsetUtc: formatHours(sunsetHours),
    daylightHours: parseFloat(((hourAngleDeg * 2) / 15).toFixed(2)),
    solarNoonUtc: formatHours(solarNoonHours)
  };
}

export function calculateKeplerOrbitPeriod(semiMajorAxisAu: number): {
  semiMajorAxisAu: number;
  orbitalPeriodYears: number;
  orbitalPeriodDays: number;
  avgOrbitalSpeedKms: number;
} {
  // Kepler's Third Law: T^2 = a^3
  const periodYears = Math.sqrt(Math.pow(semiMajorAxisAu, 3));
  const periodDays = periodYears * 365.256;
  const speed = 29.78 / Math.sqrt(semiMajorAxisAu); // Earth average speed 29.78 km/s

  return {
    semiMajorAxisAu,
    orbitalPeriodYears: parseFloat(periodYears.toFixed(3)),
    orbitalPeriodDays: parseFloat(periodDays.toFixed(1)),
    avgOrbitalSpeedKms: parseFloat(speed.toFixed(2))
  };
}

export function convertLightYearsToKm(ly: number): {
  lightYears: number;
  kilometers: string;
  astronomicalUnits: number;
  parsecs: number;
  lightTravelTimeInMinutes: number;
} {
  const km = ly * 9.4607e12;
  const au = ly * 63241.1;
  const pc = ly / 3.26156;

  return {
    lightYears: ly,
    kilometers: km.toExponential(4) + ' km',
    astronomicalUnits: parseFloat(au.toFixed(1)),
    parsecs: parseFloat(pc.toFixed(4)),
    lightTravelTimeInMinutes: parseFloat((ly * 525960).toFixed(1))
  };
}

export function calculateTelescopeMagnification(focalLengthTelescopeMm = 1000, focalLengthEyepieceMm = 25): {
  magnification: number;
  focalRatio: number;
  exitPupilMm: number;
} {
  const mag = focalLengthTelescopeMm / focalLengthEyepieceMm;
  return {
    magnification: parseFloat(mag.toFixed(1)),
    focalRatio: parseFloat((focalLengthTelescopeMm / 100).toFixed(1)), // Assuming 100mm aperture
    exitPupilMm: parseFloat((100 / mag).toFixed(2))
  };
}

export function calculateZodiacSign(dateStr?: string): {
  zodiacSign: string;
  element: string;
  symbol: string;
  dateRange: string;
} {
  const d = dateStr ? new Date(dateStr) : new Date();
  const m = d.getMonth() + 1;
  const day = d.getDate();

  if ((m === 3 && day >= 21) || (m === 4 && day <= 19)) return { zodiacSign: 'Aries', element: 'Fire', symbol: '♈', dateRange: 'Mar 21 - Apr 19' };
  if ((m === 4 && day >= 20) || (m === 5 && day <= 20)) return { zodiacSign: 'Taurus', element: 'Earth', symbol: '♉', dateRange: 'Apr 20 - May 20' };
  if ((m === 5 && day >= 21) || (m === 6 && day <= 20)) return { zodiacSign: 'Gemini', element: 'Air', symbol: '♊', dateRange: 'May 21 - Jun 20' };
  if ((m === 6 && day >= 21) || (m === 7 && day <= 22)) return { zodiacSign: 'Cancer', element: 'Water', symbol: '♋', dateRange: 'Jun 21 - Jul 22' };
  if ((m === 7 && day >= 23) || (m === 8 && day <= 22)) return { zodiacSign: 'Leo', element: 'Fire', symbol: '♌', dateRange: 'Jul 23 - Aug 22' };
  if ((m === 8 && day >= 23) || (m === 9 && day <= 22)) return { zodiacSign: 'Virgo', element: 'Earth', symbol: '♍', dateRange: 'Aug 23 - Sep 22' };
  if ((m === 9 && day >= 23) || (m === 10 && day <= 22)) return { zodiacSign: 'Libra', element: 'Air', symbol: '♎', dateRange: 'Sep 23 - Oct 22' };
  if ((m === 10 && day >= 23) || (m === 11 && day <= 21)) return { zodiacSign: 'Scorpio', element: 'Water', symbol: '♏', dateRange: 'Oct 23 - Nov 21' };
  if ((m === 11 && day >= 22) || (m === 12 && day <= 21)) return { zodiacSign: 'Sagittarius', element: 'Fire', symbol: '♐', dateRange: 'Nov 22 - Dec 21' };
  if ((m === 12 && day >= 22) || (m === 1 && day <= 19)) return { zodiacSign: 'Capricorn', element: 'Earth', symbol: '♑', dateRange: 'Dec 22 - Jan 19' };
  if ((m === 1 && day >= 20) || (m === 2 && day <= 18)) return { zodiacSign: 'Aquarius', element: 'Air', symbol: '♒', dateRange: 'Jan 20 - Feb 18' };
  return { zodiacSign: 'Pisces', element: 'Water', symbol: '♓', dateRange: 'Feb 19 - Mar 20' };
}

export function estimateSarosEclipseCycle(referenceYear = 2026): {
  sarosNumber: number;
  cyclePeriodYears: number;
  cyclePeriodDays: number;
  estimatedNextEclipseDate: string;
} {
  const sarosDays = 6585.3211; // 18 years 11 days 8 hours
  const nextDate = new Date(Date.now() + sarosDays * 86400000);

  return {
    sarosNumber: 139,
    cyclePeriodYears: 18.03,
    cyclePeriodDays: 6585.3,
    estimatedNextEclipseDate: nextDate.toISOString().split('T')[0]
  };
}

// ==========================================
// 2. GEOGRAPHY & MAP ENGINES
// ==========================================

export function calculateHaversineDistance(lat1: number, lon1: number, lat2: number, lon2: number): {
  distanceKm: number;
  distanceMiles: number;
  distanceNauticalMiles: number;
} {
  const R = 6371; // Earth radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;

  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const dKm = R * c;

  return {
    distanceKm: parseFloat(dKm.toFixed(2)),
    distanceMiles: parseFloat((dKm * 0.621371).toFixed(2)),
    distanceNauticalMiles: parseFloat((dKm * 0.539957).toFixed(2))
  };
}

export function calculateInitialBearing(lat1: number, lon1: number, lat2: number, lon2: number): {
  bearingDegrees: number;
  compassDirection: string;
} {
  const φ1 = (lat1 * Math.PI) / 180;
  const φ2 = (lat2 * Math.PI) / 180;
  const Δλ = ((lon2 - lon1) * Math.PI) / 180;

  const y = Math.sin(Δλ) * Math.cos(φ2);
  const x = Math.cos(φ1) * Math.sin(φ2) - Math.sin(φ1) * Math.cos(φ2) * Math.cos(Δλ);
  const θ = Math.atan2(y, x);
  const brng = ((θ * 180) / Math.PI + 360) % 360;

  const directions = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
  const idx = Math.round(brng / 45) % 8;

  return {
    bearingDegrees: parseFloat(brng.toFixed(1)),
    compassDirection: directions[idx]
  };
}

export function convertLatLongDmsDecimal(val: number | string, isToDms = true): {
  decimal: number;
  dms: string;
} {
  if (isToDms) {
    const num = typeof val === 'number' ? val : parseFloat(val);
    const abs = Math.abs(num);
    const degrees = Math.floor(abs);
    const minsFloat = (abs - degrees) * 60;
    const minutes = Math.floor(minsFloat);
    const seconds = ((minsFloat - minutes) * 60).toFixed(1);
    return {
      decimal: num,
      dms: `${degrees}° ${minutes}' ${seconds}"`
    };
  } else {
    // Parse DMS to Decimal
    const str = val.toString();
    const parts = str.match(/\d+(\.\d+)?/g);
    if (!parts || parts.length < 3) return { decimal: 0, dms: '0° 0\' 0"' };
    const dec = parseFloat(parts[0]) + parseFloat(parts[1]) / 60 + parseFloat(parts[2]) / 3600;
    return {
      decimal: parseFloat(dec.toFixed(6)),
      dms: str
    };
  }
}

export function convertLatLongToUtm(lat: number, lon: number): {
  utmZone: string;
  eastingMeters: number;
  northingMeters: number;
} {
  const zoneNumber = Math.floor((lon + 180) / 6) + 1;
  const easting = 500000 + (lon - (zoneNumber * 6 - 183)) * 111000 * Math.cos((lat * Math.PI) / 180);
  const northing = lat >= 0 ? lat * 111000 : 10000000 + lat * 111000;

  return {
    utmZone: `${zoneNumber}${lat >= 0 ? 'N' : 'S'}`,
    eastingMeters: Math.round(easting),
    northingMeters: Math.round(northing)
  };
}

export function generateCustomGridWords(lat: number, lon: number): {
  threeWordsRef: string;
  gridCoordinates: string;
} {
  const wordList = ['apex', 'beacon', 'orbit', 'zenith', 'pulse', 'matrix', 'vector', 'signal', 'cipher', 'stream'];
  const w1 = wordList[Math.abs(Math.floor(lat * 10)) % wordList.length];
  const w2 = wordList[Math.abs(Math.floor(lon * 10)) % wordList.length];
  const w3 = wordList[Math.abs(Math.floor((lat + lon) * 10)) % wordList.length];

  return {
    threeWordsRef: `///${w1}.${w2}.${w3}`,
    gridCoordinates: `${lat.toFixed(4)}, ${lon.toFixed(4)}`
  };
}

export function calculateElevationGrade(verticalRiseM: number, horizontalRunM: number): {
  gradePercent: number;
  slopeAngleDegrees: number;
  steepnessRating: string;
} {
  const grade = (verticalRiseM / horizontalRunM) * 100;
  const angle = Math.atan(verticalRiseM / horizontalRunM) * (180 / Math.PI);

  let rating = 'Gentle Slope';
  if (grade > 15) rating = 'Very Steep Road / Severe Grade';
  else if (grade > 8) rating = 'Steep Grade (Highway Warning Level)';
  else if (grade > 4) rating = 'Moderate Incline';

  return {
    gradePercent: parseFloat(grade.toFixed(2)),
    slopeAngleDegrees: parseFloat(angle.toFixed(2)),
    steepnessRating: rating
  };
}
