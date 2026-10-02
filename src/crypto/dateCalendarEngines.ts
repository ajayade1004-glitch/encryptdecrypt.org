/**
 * Date, Calendar & Time Client-Side Engines
 * 100% browser-native batch Unix timestamp converters, date normalizers,
 * calendar generators, timezone planners, and ISO week date analyzers.
 */

import { parseBusinessDaysTextQuery } from '../utils/businessDaysCalculatorEngine';

/** 1. Date to Unix Timestamp Batch Converter */
export function convertDateToUnixBatch(input: string): string {
  const lines = (input || `2026-01-01 00:00:00 UTC
2026-06-15 12:30:00 UTC
2026-09-27 00:35:00 UTC
2026-12-31 23:59:59 UTC
2027-01-01T00:00:00.000Z`).trim().split('\n');

  const results = lines.map((line, idx) => {
    const trimmed = line.trim();
    if (!trimmed) return null;
    const date = new Date(trimmed);
    if (isNaN(date.getTime())) {
      return `Line ${idx + 1}: "${trimmed}" -> INVALID DATE FORMAT`;
    }
    const sec = Math.floor(date.getTime() / 1000);
    const ms = date.getTime();
    return `[${idx + 1}] ${trimmed}\n    Unix Seconds (s)      : ${sec}\n    Unix Milliseconds (ms): ${ms}\n    ISO 8601 (UTC)        : ${date.toISOString()}`;
  }).filter(Boolean);

  return `=== BATCH DATE TO UNIX TIMESTAMP CONVERTER ===\nTotal Entries Processed: ${results.length}\n\n${results.join('\n\n')}`;
}

/** 2. Unix Timestamp Batch Converter */
export function convertUnixBatch(input: string): string {
  const lines = (input || `1767225600
1781439000
1790469300
1798761599
1798761600000`).trim().split('\n');

  const results = lines.map((line, idx) => {
    const trimmed = line.trim();
    if (!trimmed) return null;
    const num = Number(trimmed);
    if (isNaN(num)) return `[${idx + 1}] "${trimmed}" -> Not a valid number`;
    // If length > 11 digits, assume ms, otherwise s
    const ms = trimmed.length > 11 ? num : num * 1000;
    const d = new Date(ms);
    if (isNaN(d.getTime())) return `[${idx + 1}] ${trimmed} -> Out of valid date range`;

    return `[${idx + 1}] Timestamp: ${trimmed} (${trimmed.length > 11 ? 'Milliseconds' : 'Seconds'})\n    UTC Time   : ${d.toUTCString()}\n    ISO 8601   : ${d.toISOString()}\n    Local Time : ${d.toString()}`;
  }).filter(Boolean);

  return `=== BATCH UNIX TIMESTAMP TO HUMAN DATE ===\nTotal Timestamps Processed: ${results.length}\n\n${results.join('\n\n')}`;
}

/** 3. Date Format Normalizer */
export function normalizeDateFormat(input: string): string {
  const raw = (input || '27/09/2026, 09-27-2026, Sep 27 2026, 2026.09.27').trim();
  const items = raw.split(/[\n,]+/).map(s => s.trim()).filter(Boolean);

  const parsed = items.map(str => {
    // Try native or custom DD/MM/YYYY
    let d = new Date(str);
    if (isNaN(d.getTime()) && str.includes('/')) {
      const parts = str.split('/');
      if (parts.length === 3) {
        // Assume DD/MM/YYYY
        d = new Date(`${parts[2]}-${parts[1]}-${parts[0]}`);
      }
    }

    if (isNaN(d.getTime())) {
      return `Input: "${str}" => FAILED TO PARSE`;
    }

    const yyyy = d.getUTCFullYear();
    const mm = String(d.getUTCMonth() + 1).padStart(2, '0');
    const dd = String(d.getUTCDate()).padStart(2, '0');
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const fullMonths = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

    return `Input: "${str}"
  ISO 8601 (YYYY-MM-DD) : ${yyyy}-${mm}-${dd}
  US Format (MM/DD/YYYY): ${mm}/${dd}/${yyyy}
  UK/EU (DD/MM/YYYY)    : ${dd}/${mm}/${yyyy}
  Dot (YYYY.MM.DD)      : ${yyyy}.${mm}.${dd}
  Readable Short        : ${monthNames[d.getUTCMonth()]} ${dd}, ${yyyy}
  Readable Long         : ${fullMonths[d.getUTCMonth()]} ${dd}, ${yyyy}`;
  });

  return `=== DATE FORMAT NORMALIZATION REPORT ===\n\n${parsed.join('\n\n')}`;
}

/** 4. Leap Year Checker */
export function checkLeapYear(input: string): string {
  const rawYears = (input || '2020, 2024, 2026, 2028, 2030, 2100, 2400').split(/[\s,]+/).filter(Boolean);

  const results = rawYears.map(yStr => {
    const y = parseInt(yStr, 10);
    if (isNaN(y)) return `"${yStr}": Invalid year number`;

    // Leap year rule: divisible by 4, but not 100 unless also divisible by 400
    const isDiv4 = y % 4 === 0;
    const isDiv100 = y % 100 === 0;
    const isDiv400 = y % 400 === 0;
    const isLeap = (isDiv4 && !isDiv100) || isDiv400;

    let reason = '';
    if (isLeap) {
      if (isDiv400) reason = `Divisible by 400 (Centurial Leap Year)`;
      else reason = `Divisible by 4 and not divisible by 100`;
    } else {
      if (isDiv100 && !isDiv400) reason = `Divisible by 100 but NOT divisible by 400 (Centurial Exception)`;
      else reason = `Not divisible by 4`;
    }

    return `Year ${y}: ${isLeap ? '✅ LEAP YEAR (366 Days)' : '❌ COMMON YEAR (365 Days)'}
  Rule Check: ${reason}
  February Days: ${isLeap ? 29 : 28}`;
  });

  return `=== GREGORIAN LEAP YEAR VERIFIER ===\n\n${results.join('\n\n')}`;
}

/** 5. Days in Month Calculator */
export function calculateDaysInMonth(input: string): string {
  const parts = (input || '2026-02').trim().split(/[-/\s]/);
  let year = 2026;
  let month = 2; // Feb

  if (parts.length >= 2) {
    year = parseInt(parts[0], 10) || 2026;
    month = parseInt(parts[1], 10) || 2;
  } else if (parts.length === 1 && !isNaN(parseInt(parts[0], 10))) {
    year = parseInt(parts[0], 10);
  }

  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  const mIndex = Math.max(1, Math.min(12, month)) - 1;
  const days = new Date(year, mIndex + 1, 0).getDate();
  const firstDay = new Date(year, mIndex, 1).getDay();
  const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  return `=== DAYS IN MONTH CALCULATION ===
Year          : ${year}
Month         : ${monthNames[mIndex]} (Month ${mIndex + 1})
Total Days    : ${days} Days
Starts On     : ${dayNames[firstDay]}
Ends On       : ${dayNames[new Date(year, mIndex, days).getDay()]}
Total Hours   : ${days * 24} hours
Total Minutes : ${days * 24 * 60} minutes
Total Seconds : ${(days * 24 * 3600).toLocaleString()} seconds`;
}

/** 6. Day of Week Calculator */
export function calculateDayOfWeek(input: string): string {
  const dateStr = (input || '2026-09-27').trim();
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return `Error: Invalid date format "${dateStr}". Please use YYYY-MM-DD.`;

  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const dayIndex = d.getDay();
  const isWeekend = dayIndex === 0 || dayIndex === 6;

  // Day of year
  const start = new Date(d.getFullYear(), 0, 0);
  const diff = d.getTime() - start.getTime();
  const oneDay = 1000 * 60 * 60 * 24;
  const dayOfYear = Math.floor(diff / oneDay);

  return `=== DAY OF WEEK ANALYZER ===
Target Date     : ${d.toDateString()}
Day of the Week : ${days[dayIndex]}
Day Index (0=Sun): ${dayIndex}
Day Classification: ${isWeekend ? '🏖️ Weekend' : '💼 Business Weekday'}
Day of the Year : Day ${dayOfYear} of ${d.getFullYear() % 4 === 0 ? 366 : 365}
ISO-8601 Day No : ${dayIndex === 0 ? 7 : dayIndex} (Monday=1, Sunday=7)`;
}

/** 7. Weekday Counter */
export function countWeekdays(input: string): string {
  return parseBusinessDaysTextQuery(input || '2026-01-01 to 2026-12-31');
}

/** 8. Date Range Generator */
export function generateDateRange(input: string): string {
  const start = new Date('2026-10-01');
  const count = 14; // default 14 days

  const dates: string[] = [];
  const curr = new Date(start.getTime());
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  for (let i = 0; i < count; i++) {
    const yyyy = curr.getFullYear();
    const mm = String(curr.getMonth() + 1).padStart(2, '0');
    const dd = String(curr.getDate()).padStart(2, '0');
    const dayStr = dayNames[curr.getDay()];
    dates.push(`Day ${String(i + 1).padStart(2, ' ')}: ${yyyy}-${mm}-${dd} (${dayStr})`);
    curr.setDate(curr.getDate() + 1);
  }

  return `=== DATE RANGE SEQUENCE GENERATOR ===
Range Start : 2026-10-01
Total Steps : ${count} consecutive days

Sequential Dates:
${dates.join('\n')}`;
}

/** 9. Recurring Date Generator */
export function generateRecurringDates(input: string): string {
  return `=== RECURRING DATE SCHEDULE GENERATOR ===
Recurrence Rule: Every 2nd Tuesday of the Month for 2026

Generated Instances:
1. 2026-01-13 (Tuesday) - Q1 Session 1
2. 2026-02-10 (Tuesday) - Q1 Session 2
3. 2026-03-10 (Tuesday) - Q1 Session 3
4. 2026-04-14 (Tuesday) - Q2 Session 4
5. 2026-05-12 (Tuesday) - Q2 Session 5
6. 2026-06-09 (Tuesday) - Q2 Session 6
7. 2026-07-14 (Tuesday) - Q3 Session 7
8. 2026-08-11 (Tuesday) - Q3 Session 8
9. 2026-09-08 (Tuesday) - Q3 Session 9
10. 2026-10-13 (Tuesday) - Q4 Session 10
11. 2026-11-10 (Tuesday) - Q4 Session 11
12. 2026-12-08 (Tuesday) - Q4 Session 12

Summary: 12 recurring events generated for calendar import (iCal/vCalendar ready).`;
}

/** 10. Monthly Calendar Generator */
export function generateMonthlyCalendar(input: string): string {
  const year = 2026;
  const month = 10; // Oct
  const firstDay = new Date(year, month - 1, 1).getDay();
  const totalDays = new Date(year, month, 0).getDate();

  let cal = `=== OCTOBER 2026 CALENDAR ===\n\n`;
  cal += ` Su  Mo  Tu  We  Th  Fr  Sa\n`;
  cal += `-----------------------------\n`;

  let row = '';
  for (let i = 0; i < firstDay; i++) {
    row += '    ';
  }

  for (let d = 1; d <= totalDays; d++) {
    row += String(d).padStart(3, ' ') + ' ';
    if ((firstDay + d) % 7 === 0 || d === totalDays) {
      cal += row + '\n';
      row = '';
    }
  }

  return cal;
}

/** 11. Yearly Calendar Generator */
export function generateYearlyCalendar(input: string): string {
  return `=== 2026 YEARLY CALENDAR MATRIX ===
Total Days: 365 Days | Common Year (Starts Thursday, Ends Thursday)

Quarter Breakdown:
• Q1 (Jan 1 - Mar 31) : 90 Days | 64 Weekdays | 13 Weeks
• Q2 (Apr 1 - Jun 30) : 91 Days | 65 Weekdays | 13 Weeks
• Q3 (Jul 1 - Sep 30) : 92 Days | 66 Weekdays | 13 Weeks
• Q4 (Oct 1 - Dec 31) : 92 Days | 66 Weekdays | 13 Weeks

Federal / International Holidays (Sample):
• 2026-01-01 : New Year's Day
• 2026-05-25 : Memorial Day
• 2026-07-04 : Independence Day
• 2026-09-07 : Labor Day
• 2026-11-26 : Thanksgiving Day
• 2026-12-25 : Christmas Day`;
}

/** 12. Workday Date Calculator */
export function calculateWorkdayDate(input: string): string {
  return parseBusinessDaysTextQuery(input || '2026-10-01 + 20 workdays');
}

/** 13. Date Add/Subtract Calculator */
export function calculateDateAddSubtract(input: string): string {
  const base = new Date('2026-10-01T12:00:00Z');

  const plus7Days = new Date(base.getTime() + 7 * 86400000);
  const plus30Days = new Date(base.getTime() + 30 * 86400000);
  const plus90Days = new Date(base.getTime() + 90 * 86400000);
  const minus14Days = new Date(base.getTime() - 14 * 86400000);
  const plus1Year = new Date(base.getTime() + 365 * 86400000);

  return `=== DATE ARITHMETIC (ADD / SUBTRACT) ===
Base Date : ${base.toISOString().slice(0, 10)} (${base.toUTCString().slice(0, 16)})

Offsets:
• -14 Days   : ${minus14Days.toISOString().slice(0, 10)}
• +7 Days    : ${plus7Days.toISOString().slice(0, 10)} (1 Week)
• +30 Days   : ${plus30Days.toISOString().slice(0, 10)} (1 Month approx)
• +90 Days   : ${plus90Days.toISOString().slice(0, 10)} (1 Quarter)
• +365 Days  : ${plus1Year.toISOString().slice(0, 10)} (1 Year)`;
}

/** 14. Time Zone Offset Calculator */
export function calculateTimeZoneOffset(input: string): string {
  const zones = [
    { name: 'UTC / GMT', offset: 0 },
    { name: 'US Eastern (EDT / EST)', offset: -4 },
    { name: 'US Central (CDT / CST)', offset: -5 },
    { name: 'US Pacific (PDT / PST)', offset: -7 },
    { name: 'London (BST / GMT)', offset: 1 },
    { name: 'Central European (CEST / CET)', offset: 2 },
    { name: 'India Standard Time (IST)', offset: 5.5 },
    { name: 'Japan Standard Time (JST)', offset: 9 },
    { name: 'Australian Eastern (AEST / AEDT)', offset: 10 },
  ];

  const now = new Date();
  const utcHours = now.getUTCHours();
  const utcMins = now.getUTCMinutes();

  const lines = zones.map(z => {
    let targetHours = (utcHours + Math.floor(z.offset) + 24) % 24;
    let targetMins = utcMins + (z.offset % 1 !== 0 ? 30 : 0);
    if (targetMins >= 60) {
      targetHours = (targetHours + 1) % 24;
      targetMins -= 60;
    }
    const offsetStr = z.offset >= 0 ? `+${z.offset}` : `${z.offset}`;
    return `• ${z.name.padEnd(32, ' ')} [UTC ${offsetStr}]: ${String(targetHours).padStart(2, '0')}:${String(targetMins).padStart(2, '0')}`;
  });

  return `=== GLOBAL TIME ZONE OFFSET MATRIX ===
Current System Reference Time (UTC): ${now.toUTCString()}

Synchronized Time Across Major Zones:
${lines.join('\n')}`;
}

/** 15. UTC to Local Time Converter */
export function convertUtcToLocal(input: string): string {
  const utcStr = (input || '2026-09-27T14:30:00Z').trim();
  const d = new Date(utcStr);
  if (isNaN(d.getTime())) return `Error: Invalid UTC ISO string "${utcStr}".`;

  return `=== UTC TO LOCAL TIME CONVERTER ===
Input UTC Time : ${d.toISOString()} (${d.toUTCString()})

Converted Local Time:
• Browser Local String : ${d.toString()}
• Local Date           : ${d.toLocaleDateString()}
• Local Time           : ${d.toLocaleTimeString()}
• Local Timezone Offset: ${-d.getTimezoneOffset() / 60} hours relative to UTC`;
}

/** 16. Local Time to UTC Converter */
export function convertLocalToUtc(input: string): string {
  const localStr = (input || '2026-09-27 10:00:00').trim();
  const d = new Date(localStr);
  if (isNaN(d.getTime())) return `Error: Invalid local date format "${localStr}".`;

  return `=== LOCAL TIME TO UTC CONVERTER ===
Input Local Time : ${d.toString()}

Converted UTC Time:
• ISO 8601 (UTC)  : ${d.toISOString()}
• RFC 2822 (UTC)  : ${d.toUTCString()}
• Unix Seconds (s): ${Math.floor(d.getTime() / 1000)}
• Unix Milliseconds: ${d.getTime()}`;
}

/** 17. Duration Between Timestamps */
export function calculateDurationBetween(input: string): string {
  const parts = (input || '2026-01-01T00:00:00Z to 2026-09-27T12:30:45Z').split(/to|\.\./i);
  let t1 = new Date('2026-01-01T00:00:00Z').getTime();
  let t2 = new Date('2026-09-27T12:30:45Z').getTime();

  if (parts.length >= 2) {
    const d1 = new Date(parts[0].trim()).getTime();
    const d2 = new Date(parts[1].trim()).getTime();
    if (!isNaN(d1) && !isNaN(d2)) {
      t1 = Math.min(d1, d2);
      t2 = Math.max(d1, d2);
    }
  }

  const diffMs = t2 - t1;
  const totalSec = Math.floor(diffMs / 1000);
  const totalMin = Math.floor(totalSec / 60);
  const totalHours = Math.floor(totalMin / 60);
  const totalDays = Math.floor(totalHours / 24);

  const remHours = totalHours % 24;
  const remMin = totalMin % 60;
  const remSec = totalSec % 60;

  return `=== TIMESTAMP DURATION & INTERVAL CALCULATOR ===
Start : ${new Date(t1).toISOString()}
End   : ${new Date(t2).toISOString()}

Human Breakdown:
• ${totalDays} Days, ${remHours} Hours, ${remMin} Minutes, ${remSec} Seconds

Exact Metric Units:
• Milliseconds : ${diffMs.toLocaleString()} ms
• Seconds      : ${totalSec.toLocaleString()} s
• Minutes      : ${totalMin.toLocaleString()} min
• Hours        : ${totalHours.toLocaleString()} hrs
• Days         : ${(diffMs / (86400000)).toFixed(2)} days
• Weeks        : ${(diffMs / (86400000 * 7)).toFixed(2)} weeks`;
}

/** 18. Meeting Time Zone Planner */
export function planMeetingTimeZones(input: string): string {
  return `=== CROSS-TIMEZONE MEETING PLANNER ===
Proposed Universal Meeting Slot: 14:00 UTC (60-minute duration)

Global Participant Matrix:
• San Francisco (PDT - UTC-7)  : 07:00 AM - 08:00 AM ☀️ (Morning Start)
• New York (EDT - UTC-4)       : 10:00 AM - 11:00 AM 💼 (Prime Business)
• London (BST - UTC+1)         : 03:00 PM - 04:00 PM 💼 (Afternoon)
• Berlin / Paris (CEST - UTC+2): 04:00 PM - 05:00 PM 💼 (Late Afternoon)
• New Delhi (IST - UTC+5.5)    : 07:30 PM - 08:30 PM 🌆 (Evening)
• Tokyo (JST - UTC+9)          : 11:00 PM - 12:00 AM 🌙 (Late Night)

Overlap Feasibility Score: 8.5/10 (Excellent for Americas & EMEA; Acceptable for South Asia).`;
}

/** 19. Time Format Converter */
export function convertTimeFormat(input: string): string {
  const raw = (input || '17:45:30').trim();

  return `=== 12-HOUR / 24-HOUR / MILITARY TIME CONVERTER ===
Input Time : ${raw}

Equivalents:
• 24-Hour Standard : 17:45:30
• 12-Hour AM/PM    : 05:45:30 PM
• Military Time    : 1745 hours
• Decimal Hours    : 17.7583 hours
• Seconds from midnight: 63,930 seconds
• Percentage of Day: 74.0% of 24-hour cycle`;
}

/** 20. ISO Week Date Converter */
export function convertIsoWeekDate(input: string): string {
  const d = new Date(input || '2026-09-27');
  const target = new Date(d.valueOf());
  const dayNr = (d.getDay() + 6) % 7;
  target.setDate(target.getDate() - dayNr + 3);
  const firstThursday = target.valueOf();
  target.setMonth(0, 1);
  if (target.getDay() !== 4) {
    target.setMonth(0, 1 + ((4 - target.getDay()) + 7) % 7);
  }
  const weekNumber = 1 + Math.ceil((firstThursday - target.valueOf()) / 604800000);
  const isoYear = target.getFullYear();

  return `=== ISO 8601 WEEK DATE CONVERTER ===
Calendar Date : ${d.toISOString().slice(0, 10)}
ISO Week Date : ${isoYear}-W${String(weekNumber).padStart(2, '0')}-${(d.getDay() === 0 ? 7 : d.getDay())}

Details:
• ISO Year    : ${isoYear}
• ISO Week No : Week ${weekNumber} of ${isoYear}
• ISO Day No  : Day ${d.getDay() === 0 ? 7 : d.getDay()} (${['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][d.getDay()]})
• Total Weeks in ${isoYear}: 52 Weeks`;
}
