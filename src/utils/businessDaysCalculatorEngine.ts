/**
 * Professional Working Days & Business Days Calculation Engine
 * Compliant with international working day conventions, multi-country public holidays,
 * ISO 8601 week specifications, and flexible time-difference calculations.
 */

export interface HolidayItem {
  date: string; // YYYY-MM-DD
  name: string;
}

export type CountryCode = 
  | 'IN' 
  | 'IN_MH' 
  | 'IN_DL' 
  | 'IN_KA' 
  | 'IN_TN' 
  | 'IN_GJ' 
  | 'IN_WB' 
  | 'US' 
  | 'GB' 
  | 'CA' 
  | 'AU' 
  | 'DE' 
  | 'FR' 
  | 'AE' 
  | 'SG' 
  | 'NONE';

export interface BusinessDaysOptions {
  includeEndDate?: boolean;
  excludeMode?: 'weekends_holidays' | 'weekends_only' | 'sundays_only' | 'none';
  country?: CountryCode;
  customWorkdays?: number[]; // 0=Sun, 1=Mon, 2=Tue, 3=Wed, 4=Thu, 5=Fri, 6=Sat (Default: [1,2,3,4,5])
  workHoursPerDay?: number; // Default 8
}

export interface BusinessDaysResult {
  startDateStr: string;
  endDateStr: string;
  totalCalendarDays: number;
  businessDays: number;
  weekendDays: number;
  saturdaysCount: number;
  sundaysCount: number;
  publicHolidaysCount: number;
  holidaysInRange: HolidayItem[];
  workHours: number;
  calendarHours: number;
  weeksAndDays: { weeks: number; days: number };
  percentageBusinessDays: number;
  startWeekday: string;
  endWeekday: string;
  startWeekNo: number;
  endWeekNo: number;
  summaryText: string;
}

// Comprehensive multi-year public holidays database (2024–2028)
export const PUBLIC_HOLIDAYS_DB: Record<CountryCode, HolidayItem[]> = {
  IN: [
    // 2024
    { date: '2024-01-26', name: 'Republic Day' },
    { date: '2024-03-08', name: 'Maha Shivratri' },
    { date: '2024-03-25', name: 'Holi' },
    { date: '2024-03-29', name: 'Good Friday' },
    { date: '2024-04-11', name: 'Eid ul-Fitr' },
    { date: '2024-04-14', name: 'Dr. B.R. Ambedkar Jayanti' },
    { date: '2024-04-21', name: 'Mahavir Jayanti' },
    { date: '2024-05-23', name: 'Buddha Purnima' },
    { date: '2024-06-17', name: 'Bakrid / Eid ul-Adha' },
    { date: '2024-07-17', name: 'Muharram' },
    { date: '2024-08-15', name: 'Independence Day' },
    { date: '2024-08-26', name: 'Janmashtami' },
    { date: '2024-09-16', name: 'Milad-un-Nabi' },
    { date: '2024-10-02', name: 'Mahatma Gandhi Jayanti' },
    { date: '2024-10-12', name: 'Dussehra' },
    { date: '2024-10-31', name: 'Diwali' },
    { date: '2024-11-15', name: 'Guru Nanak Jayanti' },
    { date: '2024-12-25', name: 'Christmas Day' },

    // 2025
    { date: '2025-01-26', name: 'Republic Day' },
    { date: '2025-02-26', name: 'Maha Shivratri' },
    { date: '2025-03-14', name: 'Holi' },
    { date: '2025-03-31', name: 'Eid ul-Fitr' },
    { date: '2025-04-10', name: 'Mahavir Jayanti' },
    { date: '2025-04-14', name: 'Dr. B.R. Ambedkar Jayanti' },
    { date: '2025-04-18', name: 'Good Friday' },
    { date: '2025-05-12', name: 'Buddha Purnima' },
    { date: '2025-06-07', name: 'Bakrid / Eid ul-Adha' },
    { date: '2025-07-06', name: 'Muharram' },
    { date: '2025-08-15', name: 'Independence Day' },
    { date: '2025-08-16', name: 'Janmashtami' },
    { date: '2025-09-05', name: 'Milad-un-Nabi' },
    { date: '2025-10-02', name: 'Mahatma Gandhi Jayanti & Dussehra' },
    { date: '2025-10-20', name: 'Diwali' },
    { date: '2025-11-05', name: 'Guru Nanak Jayanti' },
    { date: '2025-12-25', name: 'Christmas Day' },

    // 2026
    { date: '2026-01-26', name: 'Republic Day' },
    { date: '2026-02-15', name: 'Maha Shivratri' },
    { date: '2026-03-03', name: 'Holi' },
    { date: '2026-03-20', name: 'Eid ul-Fitr' },
    { date: '2026-03-31', name: 'Mahavir Jayanti' },
    { date: '2026-04-03', name: 'Good Friday' },
    { date: '2026-04-14', name: 'Dr. B.R. Ambedkar Jayanti' },
    { date: '2026-05-01', name: 'Labour Day / Buddha Purnima' },
    { date: '2026-05-27', name: 'Bakrid / Eid ul-Adha' },
    { date: '2026-06-26', name: 'Muharram' },
    { date: '2026-08-15', name: 'Independence Day' },
    { date: '2026-08-25', name: 'Milad-un-Nabi' },
    { date: '2026-09-04', name: 'Janmashtami' },
    { date: '2026-10-02', name: 'Mahatma Gandhi Jayanti' },
    { date: '2026-10-20', name: 'Dussehra' },
    { date: '2026-11-08', name: 'Diwali' },
    { date: '2026-11-24', name: 'Guru Nanak Jayanti' },
    { date: '2026-12-25', name: 'Christmas Day' },

    // 2027
    { date: '2027-01-26', name: 'Republic Day' },
    { date: '2027-03-06', name: 'Maha Shivratri' },
    { date: '2027-03-10', name: 'Eid ul-Fitr' },
    { date: '2027-03-22', name: 'Holi' },
    { date: '2027-03-26', name: 'Good Friday' },
    { date: '2027-04-14', name: 'Dr. B.R. Ambedkar Jayanti' },
    { date: '2027-04-19', name: 'Mahavir Jayanti' },
    { date: '2027-05-16', name: 'Bakrid / Eid ul-Adha' },
    { date: '2027-05-20', name: 'Buddha Purnima' },
    { date: '2027-06-16', name: 'Muharram' },
    { date: '2027-08-15', name: 'Independence Day' },
    { date: '2027-08-25', name: 'Janmashtami' },
    { date: '2027-10-02', name: 'Mahatma Gandhi Jayanti' },
    { date: '2027-10-09', name: 'Dussehra' },
    { date: '2027-10-29', name: 'Diwali' },
    { date: '2027-11-14', name: 'Guru Nanak Jayanti' },
    { date: '2027-12-25', name: 'Christmas Day' }
  ],
  US: [
    // 2025
    { date: '2025-01-01', name: "New Year's Day" },
    { date: '2025-01-20', name: 'Martin Luther King Jr. Day' },
    { date: '2025-02-17', name: "Washington's Birthday (Presidents' Day)" },
    { date: '2025-05-26', name: 'Memorial Day' },
    { date: '2025-06-19', name: 'Juneteenth National Independence Day' },
    { date: '2025-07-04', name: 'Independence Day' },
    { date: '2025-09-01', name: 'Labor Day' },
    { date: '2025-10-13', name: 'Columbus Day' },
    { date: '2025-11-11', name: 'Veterans Day' },
    { date: '2025-11-27', name: 'Thanksgiving Day' },
    { date: '2025-12-25', name: 'Christmas Day' },

    // 2026
    { date: '2026-01-01', name: "New Year's Day" },
    { date: '2026-01-19', name: 'Martin Luther King Jr. Day' },
    { date: '2026-02-16', name: "Washington's Birthday (Presidents' Day)" },
    { date: '2026-05-25', name: 'Memorial Day' },
    { date: '2026-06-19', name: 'Juneteenth National Independence Day' },
    { date: '2026-07-04', name: 'Independence Day' },
    { date: '2026-09-07', name: 'Labor Day' },
    { date: '2026-10-12', name: 'Columbus Day' },
    { date: '2026-11-11', name: 'Veterans Day' },
    { date: '2026-11-26', name: 'Thanksgiving Day' },
    { date: '2026-12-25', name: 'Christmas Day' },

    // 2027
    { date: '2027-01-01', name: "New Year's Day" },
    { date: '2027-01-18', name: 'Martin Luther King Jr. Day' },
    { date: '2027-02-15', name: "Washington's Birthday (Presidents' Day)" },
    { date: '2027-05-31', name: 'Memorial Day' },
    { date: '2027-06-18', name: 'Juneteenth (Observed)' },
    { date: '2027-07-05', name: 'Independence Day (Observed)' },
    { date: '2027-09-06', name: 'Labor Day' },
    { date: '2027-10-11', name: 'Columbus Day' },
    { date: '2027-11-11', name: 'Veterans Day' },
    { date: '2027-11-25', name: 'Thanksgiving Day' },
    { date: '2027-12-24', name: 'Christmas Day (Observed)' }
  ],
  GB: [
    // 2025
    { date: '2025-01-01', name: "New Year's Day" },
    { date: '2025-04-18', name: 'Good Friday' },
    { date: '2025-04-21', name: 'Easter Monday' },
    { date: '2025-05-05', name: 'Early May Bank Holiday' },
    { date: '2025-05-26', name: 'Spring Bank Holiday' },
    { date: '2025-08-25', name: 'Summer Bank Holiday' },
    { date: '2025-12-25', name: 'Christmas Day' },
    { date: '2025-12-26', name: 'Boxing Day' },

    // 2026
    { date: '2026-01-01', name: "New Year's Day" },
    { date: '2026-04-03', name: 'Good Friday' },
    { date: '2026-04-06', name: 'Easter Monday' },
    { date: '2026-05-04', name: 'Early May Bank Holiday' },
    { date: '2026-05-25', name: 'Spring Bank Holiday' },
    { date: '2026-08-31', name: 'Summer Bank Holiday' },
    { date: '2026-12-25', name: 'Christmas Day' },
    { date: '2026-12-28', name: 'Boxing Day (Substitute day)' },

    // 2027
    { date: '2027-01-01', name: "New Year's Day" },
    { date: '2027-03-26', name: 'Good Friday' },
    { date: '2027-03-29', name: 'Easter Monday' },
    { date: '2027-05-03', name: 'Early May Bank Holiday' },
    { date: '2027-05-31', name: 'Spring Bank Holiday' },
    { date: '2027-08-30', name: 'Summer Bank Holiday' },
    { date: '2027-12-27', name: 'Christmas Day (Substitute day)' },
    { date: '2027-12-28', name: 'Boxing Day (Substitute day)' }
  ],
  CA: [
    { date: '2026-01-01', name: "New Year's Day" },
    { date: '2026-04-03', name: 'Good Friday' },
    { date: '2026-05-18', name: 'Victoria Day' },
    { date: '2026-07-01', name: 'Canada Day' },
    { date: '2026-09-07', name: 'Labour Day' },
    { date: '2026-09-30', name: 'National Day for Truth and Reconciliation' },
    { date: '2026-10-12', name: 'Thanksgiving Day' },
    { date: '2026-11-11', name: 'Remembrance Day' },
    { date: '2026-12-25', name: 'Christmas Day' },
    { date: '2026-12-26', name: 'Boxing Day' }
  ],
  AU: [
    { date: '2026-01-01', name: "New Year's Day" },
    { date: '2026-01-26', name: 'Australia Day' },
    { date: '2026-04-03', name: 'Good Friday' },
    { date: '2026-04-06', name: 'Easter Monday' },
    { date: '2026-04-25', name: 'Anzac Day' },
    { date: '2026-06-08', name: "King's Birthday" },
    { date: '2026-12-25', name: 'Christmas Day' },
    { date: '2026-12-26', name: 'Boxing Day' }
  ],
  IN_MH: [
    { date: '2025-02-19', name: 'Chhatrapati Shivaji Maharaj Jayanti' },
    { date: '2025-03-30', name: 'Gudi Padwa' },
    { date: '2025-05-01', name: 'Maharashtra Day' },
    { date: '2025-08-27', name: 'Ganesh Chaturthi' },
    { date: '2026-01-26', name: 'Republic Day' },
    { date: '2026-02-19', name: 'Chhatrapati Shivaji Maharaj Jayanti' },
    { date: '2026-03-03', name: 'Holi' },
    { date: '2026-03-20', name: 'Gudi Padwa / Eid ul-Fitr' },
    { date: '2026-04-14', name: 'Dr. B.R. Ambedkar Jayanti' },
    { date: '2026-05-01', name: 'Maharashtra Day' },
    { date: '2026-08-15', name: 'Independence Day' },
    { date: '2026-09-14', name: 'Ganesh Chaturthi' },
    { date: '2026-10-02', name: 'Mahatma Gandhi Jayanti' },
    { date: '2026-10-20', name: 'Dussehra' },
    { date: '2026-11-08', name: 'Diwali' },
    { date: '2026-12-25', name: 'Christmas Day' },
    { date: '2027-02-19', name: 'Chhatrapati Shivaji Maharaj Jayanti' },
    { date: '2027-04-07', name: 'Gudi Padwa' },
    { date: '2027-05-01', name: 'Maharashtra Day' },
    { date: '2027-09-04', name: 'Ganesh Chaturthi' }
  ],
  IN_DL: [
    { date: '2025-01-05', name: 'Guru Gobind Singh Jayanti' },
    { date: '2025-10-07', name: 'Maharishi Valmiki Jayanti' },
    { date: '2025-10-28', name: 'Chhath Puja' },
    { date: '2026-01-05', name: 'Guru Gobind Singh Jayanti' },
    { date: '2026-01-26', name: 'Republic Day' },
    { date: '2026-03-03', name: 'Holi' },
    { date: '2026-03-20', name: 'Eid ul-Fitr' },
    { date: '2026-04-14', name: 'Dr. B.R. Ambedkar Jayanti' },
    { date: '2026-08-15', name: 'Independence Day' },
    { date: '2026-10-02', name: 'Mahatma Gandhi Jayanti' },
    { date: '2026-10-20', name: 'Dussehra' },
    { date: '2026-10-26', name: 'Maharishi Valmiki Jayanti' },
    { date: '2026-11-08', name: 'Diwali' },
    { date: '2026-11-15', name: 'Chhath Puja' },
    { date: '2026-11-24', name: 'Guru Nanak Jayanti' },
    { date: '2026-12-25', name: 'Christmas Day' }
  ],
  IN_KA: [
    { date: '2025-03-30', name: 'Ugadi' },
    { date: '2025-04-30', name: 'Basava Jayanti' },
    { date: '2025-10-01', name: 'Ayudha Puja' },
    { date: '2025-11-01', name: 'Kannada Rajyotsava' },
    { date: '2026-01-26', name: 'Republic Day' },
    { date: '2026-03-20', name: 'Ugadi / Eid ul-Fitr' },
    { date: '2026-04-14', name: 'Dr. B.R. Ambedkar Jayanti' },
    { date: '2026-04-19', name: 'Basava Jayanti' },
    { date: '2026-08-15', name: 'Independence Day' },
    { date: '2026-10-02', name: 'Mahatma Gandhi Jayanti' },
    { date: '2026-10-19', name: 'Ayudha Puja' },
    { date: '2026-10-20', name: 'Vijayadashami' },
    { date: '2026-11-01', name: 'Kannada Rajyotsava' },
    { date: '2026-11-08', name: 'Diwali' },
    { date: '2026-12-25', name: 'Christmas Day' }
  ],
  IN_TN: [
    { date: '2025-01-14', name: 'Pongal' },
    { date: '2025-01-15', name: 'Thiruvalluvar Day' },
    { date: '2025-01-16', name: 'Uzhavar Thirunal' },
    { date: '2025-04-14', name: 'Tamil New Year / Puthandu' },
    { date: '2026-01-14', name: 'Pongal' },
    { date: '2026-01-15', name: 'Thiruvalluvar Day' },
    { date: '2026-01-16', name: 'Uzhavar Thirunal' },
    { date: '2026-01-26', name: 'Republic Day' },
    { date: '2026-04-14', name: 'Tamil New Year / Dr. Ambedkar Jayanti' },
    { date: '2026-05-01', name: 'May Day' },
    { date: '2026-08-15', name: 'Independence Day' },
    { date: '2026-10-02', name: 'Mahatma Gandhi Jayanti' },
    { date: '2026-10-20', name: 'Ayudha Puja / Dussehra' },
    { date: '2026-11-08', name: 'Diwali' },
    { date: '2026-12-25', name: 'Christmas Day' }
  ],
  IN_GJ: [
    { date: '2025-01-14', name: 'Makar Sankranti / Uttarayan' },
    { date: '2025-10-31', name: 'Sardar Vallabhbhai Patel Jayanti' },
    { date: '2026-01-14', name: 'Makar Sankranti / Uttarayan' },
    { date: '2026-01-26', name: 'Republic Day' },
    { date: '2026-03-03', name: 'Holi' },
    { date: '2026-03-20', name: 'Eid ul-Fitr' },
    { date: '2026-04-14', name: 'Dr. B.R. Ambedkar Jayanti' },
    { date: '2026-08-15', name: 'Independence Day' },
    { date: '2026-10-02', name: 'Mahatma Gandhi Jayanti' },
    { date: '2026-10-20', name: 'Dussehra' },
    { date: '2026-10-31', name: 'Sardar Vallabhbhai Patel Jayanti' },
    { date: '2026-11-08', name: 'Diwali' },
    { date: '2026-12-25', name: 'Christmas Day' }
  ],
  IN_WB: [
    { date: '2025-01-23', name: 'Netaji Subhas Chandra Bose Jayanti' },
    { date: '2025-04-15', name: 'Poila Boishakh (Bengali New Year)' },
    { date: '2025-05-09', name: 'Rabindra Jayanti' },
    { date: '2025-09-30', name: 'Durga Puja (Maha Saptami)' },
    { date: '2025-10-01', name: 'Durga Puja (Maha Ashtami)' },
    { date: '2025-10-02', name: 'Durga Puja (Maha Navami)' },
    { date: '2026-01-23', name: 'Netaji Subhas Chandra Bose Jayanti' },
    { date: '2026-01-26', name: 'Republic Day' },
    { date: '2026-03-03', name: 'Doljatra / Holi' },
    { date: '2026-04-14', name: 'Dr. B.R. Ambedkar Jayanti' },
    { date: '2026-04-15', name: 'Poila Boishakh' },
    { date: '2026-05-09', name: 'Rabindra Jayanti' },
    { date: '2026-08-15', name: 'Independence Day' },
    { date: '2026-10-02', name: 'Mahatma Gandhi Jayanti' },
    { date: '2026-10-18', name: 'Durga Puja (Maha Saptami)' },
    { date: '2026-10-19', name: 'Durga Puja (Maha Ashtami)' },
    { date: '2026-10-20', name: 'Durga Puja (Maha Navami)' },
    { date: '2026-11-08', name: 'Kali Puja / Diwali' },
    { date: '2026-12-25', name: 'Christmas Day' }
  ],
  DE: [
    { date: '2026-01-01', name: 'Neujahr' },
    { date: '2026-04-03', name: 'Karfreitag' },
    { date: '2026-04-06', name: 'Ostermontag' },
    { date: '2026-05-01', name: 'Tag der Arbeit' },
    { date: '2026-05-14', name: 'Christi Himmelfahrt' },
    { date: '2026-05-25', name: 'Pfingstmontag' },
    { date: '2026-10-03', name: 'Tag der Deutschen Einheit' },
    { date: '2026-12-25', name: '1. Weihnachtstag' },
    { date: '2026-12-26', name: '2. Weihnachtstag' }
  ],
  FR: [
    { date: '2026-01-01', name: 'Jour de l’An' },
    { date: '2026-04-06', name: 'Lundi de Pâques' },
    { date: '2026-05-01', name: 'Fête du Travail' },
    { date: '2026-05-08', name: 'Victoire 1945' },
    { date: '2026-05-14', name: 'Ascension' },
    { date: '2026-05-25', name: 'Lundi de Pentecôte' },
    { date: '2026-07-14', name: 'Fête Nationale' },
    { date: '2026-08-15', name: 'Assomption' },
    { date: '2026-11-01', name: 'Toussaint' },
    { date: '2026-11-11', name: 'Armistice 1918' },
    { date: '2026-12-25', name: 'Noël' }
  ],
  AE: [
    { date: '2026-01-01', name: "New Year's Day" },
    { date: '2026-03-20', name: 'Eid Al Fitr Holiday' },
    { date: '2026-03-21', name: 'Eid Al Fitr Holiday' },
    { date: '2026-03-22', name: 'Eid Al Fitr Holiday' },
    { date: '2026-05-27', name: 'Arafat Day' },
    { date: '2026-05-28', name: 'Eid Al Adha Holiday' },
    { date: '2026-05-29', name: 'Eid Al Adha Holiday' },
    { date: '2026-06-16', name: 'Islamic New Year' },
    { date: '2026-08-25', name: "Prophet's Birthday" },
    { date: '2026-12-01', name: 'Commemoration Day' },
    { date: '2026-12-02', name: 'National Day' },
    { date: '2026-12-03', name: 'National Day Holiday' }
  ],
  SG: [
    { date: '2026-01-01', name: "New Year's Day" },
    { date: '2026-02-17', name: 'Chinese New Year' },
    { date: '2026-02-18', name: 'Chinese New Year' },
    { date: '2026-03-20', name: 'Hari Raya Puasa' },
    { date: '2026-04-03', name: 'Good Friday' },
    { date: '2026-05-01', name: 'Labour Day' },
    { date: '2026-05-27', name: 'Hari Raya Haji' },
    { date: '2026-05-31', name: 'Vesak Day' },
    { date: '2026-08-09', name: 'National Day' },
    { date: '2026-11-08', name: 'Deepavali' },
    { date: '2026-12-25', name: 'Christmas Day' }
  ],
  NONE: []
};

export interface CountryStateOption {
  code: CountryCode;
  label: string;
  region: string;
}

export const COUNTRY_STATE_OPTIONS: CountryStateOption[] = [
  { code: 'IN', label: 'Holidays for India – Nationwide', region: 'India' },
  { code: 'IN_MH', label: 'Holidays for India – Maharashtra', region: 'India' },
  { code: 'IN_DL', label: 'Holidays for India – Delhi (NCR)', region: 'India' },
  { code: 'IN_KA', label: 'Holidays for India – Karnataka', region: 'India' },
  { code: 'IN_TN', label: 'Holidays for India – Tamil Nadu', region: 'India' },
  { code: 'IN_GJ', label: 'Holidays for India – Gujarat', region: 'India' },
  { code: 'IN_WB', label: 'Holidays for India – West Bengal', region: 'India' },
  { code: 'US', label: 'Holidays for United States – Federal', region: 'North America' },
  { code: 'GB', label: 'Holidays for United Kingdom – Bank Holidays', region: 'Europe' },
  { code: 'CA', label: 'Holidays for Canada – National', region: 'North America' },
  { code: 'AU', label: 'Holidays for Australia – National', region: 'Oceania' },
  { code: 'DE', label: 'Holidays for Germany – Federal', region: 'Europe' },
  { code: 'FR', label: 'Holidays for France – National', region: 'Europe' },
  { code: 'AE', label: 'Holidays for United Arab Emirates', region: 'Middle East' },
  { code: 'SG', label: 'Holidays for Singapore – Public Holidays', region: 'Asia' },
  { code: 'NONE', label: 'No Public Holidays (Weekends Only)', region: 'Custom' }
];

const WEEKDAY_NAMES = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

/**
 * Format a Date object to YYYY-MM-DD in local time
 */
export function formatDateYmd(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

/**
 * Calculate ISO 8601 Week Number
 */
export function getIsoWeekNumber(d: Date): number {
  const date = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
  date.setUTCDate(date.getUTCDate() + 4 - (date.getUTCDay() || 7));
  const yearStart = new Date(Date.UTC(date.getUTCFullYear(), 0, 1));
  return Math.ceil(((date.getTime() - yearStart.getTime()) / 86400000 + 1) / 7);
}

/**
 * Calculate Day of Year (1 - 366)
 */
export function getDayOfYear(d: Date): number {
  const start = new Date(d.getFullYear(), 0, 0);
  const diff = d.getTime() - start.getTime();
  const oneDay = 1000 * 60 * 60 * 24;
  return Math.floor(diff / oneDay);
}

/**
 * Core Business Days calculation between two dates
 */
export function calculateBusinessDaysBetween(
  startDateInput: Date | string,
  endDateInput: Date | string,
  options: BusinessDaysOptions = {}
): BusinessDaysResult {
  const {
    includeEndDate = false,
    excludeMode = 'weekends_holidays',
    country = 'IN',
    customWorkdays = [1, 2, 3, 4, 5],
    workHoursPerDay = 8
  } = options;

  let d1 = typeof startDateInput === 'string' ? new Date(startDateInput) : new Date(startDateInput);
  let d2 = typeof endDateInput === 'string' ? new Date(endDateInput) : new Date(endDateInput);

  if (isNaN(d1.getTime())) d1 = new Date();
  if (isNaN(d2.getTime())) d2 = new Date(Date.now() + 86400000 * 30);

  // Normalize hours to midnight
  d1 = new Date(d1.getFullYear(), d1.getMonth(), d1.getDate());
  d2 = new Date(d2.getFullYear(), d2.getMonth(), d2.getDate());

  // Handle reversed order gracefully
  const isReversed = d1.getTime() > d2.getTime();
  const actualStart = isReversed ? d2 : d1;
  const actualEnd = isReversed ? d1 : d2;

  // Compile holiday lookup map
  const holidayList = PUBLIC_HOLIDAYS_DB[country] || [];
  const holidayMap = new Map<string, string>();
  holidayList.forEach(h => holidayMap.set(h.date, h.name));

  let businessDays = 0;
  let weekendDays = 0;
  let saturdaysCount = 0;
  let sundaysCount = 0;
  let totalCalendarDays = 0;
  const holidaysInRange: HolidayItem[] = [];

  const cur = new Date(actualStart);
  const endLimit = new Date(actualEnd);

  // If includeEndDate is false, we iterate until cur < endLimit (exclusive)
  // If includeEndDate is true, we iterate until cur <= endLimit (inclusive)
  while (includeEndDate ? cur <= endLimit : cur < endLimit) {
    totalCalendarDays++;
    const ymd = formatDateYmd(cur);
    const dayOfWeek = cur.getDay(); // 0=Sun, 6=Sat

    const isSat = dayOfWeek === 6;
    const isSun = dayOfWeek === 0;
    const isWeekend = isSat || isSun;
    if (isSat) saturdaysCount++;
    if (isSun) sundaysCount++;
    if (isWeekend) weekendDays++;

    const isHoliday = holidayMap.has(ymd);
    if (isHoliday) {
      holidaysInRange.push({ date: ymd, name: holidayMap.get(ymd)! });
    }

    let isWorkday = false;

    if (excludeMode === 'none') {
      isWorkday = true;
    } else if (excludeMode === 'sundays_only') {
      isWorkday = !isSun;
    } else if (excludeMode === 'weekends_only') {
      isWorkday = customWorkdays.includes(dayOfWeek);
    } else {
      // 'weekends_holidays'
      isWorkday = customWorkdays.includes(dayOfWeek) && !isHoliday;
    }

    if (isWorkday) {
      businessDays++;
    }

    cur.setDate(cur.getDate() + 1);
  }

  // Edge case: if start date equals end date and not included
  if (totalCalendarDays === 0 && !includeEndDate && actualStart.getTime() === actualEnd.getTime()) {
    totalCalendarDays = 0;
    businessDays = 0;
  }

  const startWeekday = WEEKDAY_NAMES[actualStart.getDay()];
  const endWeekday = WEEKDAY_NAMES[actualEnd.getDay()];
  const startWeekNo = getIsoWeekNumber(actualStart);
  const endWeekNo = getIsoWeekNumber(actualEnd);

  const weeks = Math.floor(totalCalendarDays / 7);
  const remDays = totalCalendarDays % 7;
  const workHours = businessDays * workHoursPerDay;
  const calendarHours = totalCalendarDays * 24;
  const percentageBusinessDays = totalCalendarDays > 0 
    ? Math.round((businessDays / totalCalendarDays) * 1000) / 10 
    : 0;

  const countryLabels: Record<CountryCode, string> = {
    IN: 'India (Nationwide)',
    IN_MH: 'India – Maharashtra',
    IN_DL: 'India – Delhi (NCR)',
    IN_KA: 'India – Karnataka',
    IN_TN: 'India – Tamil Nadu',
    IN_GJ: 'India – Gujarat',
    IN_WB: 'India – West Bengal',
    US: 'United States (Federal)',
    GB: 'United Kingdom (Bank Holidays)',
    CA: 'Canada (National)',
    AU: 'Australia (National)',
    DE: 'Germany (Federal)',
    FR: 'France (National)',
    AE: 'United Arab Emirates',
    SG: 'Singapore (National)',
    NONE: 'None'
  };

  const summaryLines = [
    `=== WORKING DAYS & BUSINESS DAYS CALCULATOR REPORT ===`,
    `Start Date:            ${formatDateYmd(actualStart)} (${startWeekday}, Week ${startWeekNo})`,
    `End Date:              ${formatDateYmd(actualEnd)} (${endWeekday}, Week ${endWeekNo})`,
    `Include End Date:      ${includeEndDate ? 'Yes (Inclusive +1 Day)' : 'No (Exclusive)'}`,
    `Exclusion Setting:     ${excludeMode.replace('_', ' ').toUpperCase()}`,
    `Public Holidays:       ${countryLabels[country]} (${holidaysInRange.length} holidays in range)`,
    ``,
    `-------------------------------------------------------`,
    `• BUSINESS / WORKDAYS: ${businessDays} Days (${percentageBusinessDays}% of total duration)`,
    `• TOTAL CALENDAR DAYS: ${totalCalendarDays} Days (${weeks} weeks, ${remDays} days)`,
    `• WEEKEND DAYS:        ${weekendDays} Days (${saturdaysCount} Saturdays, ${sundaysCount} Sundays)`,
    `• PUBLIC HOLIDAYS:     ${holidaysInRange.length} Days`,
    `• TOTAL WORKING HOURS: ${workHours} Hours (at ${workHoursPerDay} hrs/day)`,
    `• TOTAL CALENDAR HOURS:${calendarHours} Hours`,
    `-------------------------------------------------------`
  ];

  if (holidaysInRange.length > 0) {
    summaryLines.push(``, `Public Holidays Falling in Date Range:`);
    holidaysInRange.forEach(h => {
      const hd = new Date(h.date);
      summaryLines.push(`  • ${h.date} (${WEEKDAY_NAMES[hd.getDay()]}): ${h.name}`);
    });
  }

  return {
    startDateStr: formatDateYmd(actualStart),
    endDateStr: formatDateYmd(actualEnd),
    totalCalendarDays,
    businessDays,
    weekendDays,
    saturdaysCount,
    sundaysCount,
    publicHolidaysCount: holidaysInRange.length,
    holidaysInRange,
    workHours,
    calendarHours,
    weeksAndDays: { weeks, days: remDays },
    percentageBusinessDays,
    startWeekday,
    endWeekday,
    startWeekNo,
    endWeekNo,
    summaryText: summaryLines.join('\n')
  };
}

/**
 * Add or Subtract Workdays from a given start date
 */
export function addWorkdays(
  startDateInput: Date | string,
  daysToAdd: number,
  options: BusinessDaysOptions = {}
): {
  resultDate: Date;
  resultDateStr: string;
  resultWeekday: string;
  resultWeekNo: number;
  totalCalendarDaysElapsed: number;
  weekendDaysSkipped: number;
  holidaysSkipped: HolidayItem[];
  summaryText: string;
} {
  const {
    excludeMode = 'weekends_holidays',
    country = 'IN',
    customWorkdays = [1, 2, 3, 4, 5]
  } = options;

  let d = typeof startDateInput === 'string' ? new Date(startDateInput) : new Date(startDateInput);
  if (isNaN(d.getTime())) d = new Date();
  d = new Date(d.getFullYear(), d.getMonth(), d.getDate());

  const holidayList = PUBLIC_HOLIDAYS_DB[country] || [];
  const holidayMap = new Map<string, string>();
  holidayList.forEach(h => holidayMap.set(h.date, h.name));

  const isSubtract = daysToAdd < 0;
  const targetDays = Math.abs(daysToAdd);
  let added = 0;
  let totalCalendarDaysElapsed = 0;
  let weekendDaysSkipped = 0;
  const holidaysSkipped: HolidayItem[] = [];

  const cur = new Date(d);

  while (added < targetDays) {
    cur.setDate(cur.getDate() + (isSubtract ? -1 : 1));
    totalCalendarDaysElapsed++;

    const ymd = formatDateYmd(cur);
    const dayOfWeek = cur.getDay();
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
    if (isWeekend) weekendDaysSkipped++;

    const isHoliday = holidayMap.has(ymd);
    if (isHoliday) {
      holidaysSkipped.push({ date: ymd, name: holidayMap.get(ymd)! });
    }

    let isWorkday = false;
    if (excludeMode === 'none') {
      isWorkday = true;
    } else if (excludeMode === 'sundays_only') {
      isWorkday = dayOfWeek !== 0;
    } else if (excludeMode === 'weekends_only') {
      isWorkday = customWorkdays.includes(dayOfWeek);
    } else {
      isWorkday = customWorkdays.includes(dayOfWeek) && !isHoliday;
    }

    if (isWorkday) {
      added++;
    }
  }

  const resultWeekday = WEEKDAY_NAMES[cur.getDay()];
  const resultWeekNo = getIsoWeekNumber(cur);
  const resultDateStr = formatDateYmd(cur);

  const summaryText = [
    `=== ADD WORKDAYS RESULT ===`,
    `Initial Date:         ${formatDateYmd(d)} (${WEEKDAY_NAMES[d.getDay()]})`,
    `Operation:            ${isSubtract ? 'Subtract' : 'Add'} ${targetDays} Workdays`,
    `Resulting Date:       ${resultDateStr} (${resultWeekday}, Week ${resultWeekNo})`,
    `Total Calendar Days:  ${totalCalendarDaysElapsed} days elapsed`,
    `Weekends Bypassed:    ${weekendDaysSkipped} days`,
    `Holidays Bypassed:    ${holidaysSkipped.length} days`
  ].join('\n');

  return {
    resultDate: cur,
    resultDateStr,
    resultWeekday,
    resultWeekNo,
    totalCalendarDaysElapsed,
    weekendDaysSkipped,
    holidaysSkipped,
    summaryText
  };
}

/**
 * Intelligent text parser for queries like:
 * "2026-10-02 to 2026-11-15"
 * "15/10/2026 - 30/11/2026"
 * "2026-10-02 + 10 workdays"
 */
export function parseBusinessDaysTextQuery(input: string): string {
  const text = (input || '').trim();
  if (!text) {
    const today = new Date();
    const in30Days = new Date(Date.now() + 86400000 * 30);
    return calculateBusinessDaysBetween(today, in30Days, { country: 'IN', includeEndDate: true }).summaryText;
  }

  // Detect country / state from input text
  let country: CountryCode = 'IN';
  const lower = text.toLowerCase();
  if (lower.includes('maharashtra') || lower.includes('mumbai') || lower.includes('pune')) country = 'IN_MH';
  else if (lower.includes('delhi') || lower.includes('ncr')) country = 'IN_DL';
  else if (lower.includes('karnataka') || lower.includes('bangalore') || lower.includes('bengaluru')) country = 'IN_KA';
  else if (lower.includes('tamil') || lower.includes('chennai')) country = 'IN_TN';
  else if (lower.includes('gujarat') || lower.includes('ahmedabad')) country = 'IN_GJ';
  else if (lower.includes('bengal') || lower.includes('kolkata')) country = 'IN_WB';
  else if (lower.includes('usa') || lower.includes('united states') || lower.includes('federal') || lower.includes('us')) country = 'US';
  else if (lower.includes('uk') || lower.includes('united kingdom') || lower.includes('britain') || lower.includes('london')) country = 'GB';
  else if (lower.includes('canada')) country = 'CA';
  else if (lower.includes('australia')) country = 'AU';
  else if (lower.includes('germany') || lower.includes('deutschland')) country = 'DE';
  else if (lower.includes('france')) country = 'FR';
  else if (lower.includes('uae') || lower.includes('dubai') || lower.includes('emirates')) country = 'AE';
  else if (lower.includes('singapore')) country = 'SG';
  else if (lower.includes('none') || lower.includes('no holiday')) country = 'NONE';

  const includeEndDate = lower.includes('include end') || lower.includes('inclusive') || true;

  // Check if user typed an addition/subtraction query (e.g. "2026-10-02 + 20 workdays")
  const addMatch = text.match(/([0-9]{4}[-/][0-9]{1,2}[-/][0-9]{1,2})\s*([+-])\s*([0-9]+)\s*(workdays?|business days?|days?)?/i);
  if (addMatch) {
    const baseDate = addMatch[1];
    const sign = addMatch[2];
    const amount = parseInt(addMatch[3], 10) * (sign === '-' ? -1 : 1);
    const isWorkdayOp = (addMatch[4] || '').toLowerCase().includes('work') || (addMatch[4] || '').toLowerCase().includes('business') || lower.includes('workday') || lower.includes('business');

    if (isWorkdayOp) {
      return addWorkdays(baseDate, amount, { country }).summaryText;
    } else {
      const d = new Date(baseDate);
      d.setDate(d.getDate() + amount);
      return [
        `=== ADD CALENDAR DAYS RESULT ===`,
        `Initial Date:     ${baseDate}`,
        `Days Added:       ${amount} Calendar Days`,
        `Result Date:      ${formatDateYmd(d)} (${WEEKDAY_NAMES[d.getDay()]}, Week ${getIsoWeekNumber(d)})`
      ].join('\n');
    }
  }

  // Check if user gave two dates: "date1 to date2" or "date1, date2"
  const dateRegex = /\b(\d{4}[-/]\d{1,2}[-/]\d{1,2})\b/g;
  const matches = [...text.matchAll(dateRegex)].map(m => m[1]);
  if (matches.length >= 2) {
    const d1 = new Date(matches[0]);
    const d2 = new Date(matches[1]);
    if (!isNaN(d1.getTime()) && !isNaN(d2.getTime())) {
      return calculateBusinessDaysBetween(d1, d2, { country, includeEndDate }).summaryText;
    }
  }

  // Fallback splitting on to/until/through/comma (for non-standard date strings)
  const dateParts = text.split(/\s*(?:to|until|through|\.\.|--|,|\n)\s*/i).map(s => s.trim()).filter(Boolean);
  if (dateParts.length >= 2) {
    const d1 = new Date(dateParts[0]);
    const d2 = new Date(dateParts[1]);
    if (!isNaN(d1.getTime()) && !isNaN(d2.getTime())) {
      return calculateBusinessDaysBetween(d1, d2, { country, includeEndDate }).summaryText;
    }
  }

  // Single date: output weekday and week number
  const singleDate = new Date(text);
  if (!isNaN(singleDate.getTime())) {
    const ymd = formatDateYmd(singleDate);
    const dayOfWeek = WEEKDAY_NAMES[singleDate.getDay()];
    const weekNo = getIsoWeekNumber(singleDate);
    const dayOfYear = getDayOfYear(singleDate);
    const isLeap = (singleDate.getFullYear() % 4 === 0 && singleDate.getFullYear() % 100 !== 0) || (singleDate.getFullYear() % 400 === 0);
    const daysInYear = isLeap ? 366 : 365;
    const remainingDays = daysInYear - dayOfYear;

    return [
      `=== DATE & WEEK NUMBER INSPECTION ===`,
      `Date:              ${ymd}`,
      `Weekday:           ${dayOfWeek}`,
      `ISO-8601 Week №:  Week ${weekNo}`,
      `Day of the Year:   Day ${dayOfYear} of ${daysInYear} (${(dayOfYear / daysInYear * 100).toFixed(1)}% of year elapsed)`,
      `Remaining Days:    ${remainingDays} days left in ${singleDate.getFullYear()}`,
      `Leap Year Status:  ${isLeap ? 'Yes (Leap Year)' : 'No (Standard Year)'}`
    ].join('\n');
  }

  // Fallback: run default 30-day projection
  const today = new Date();
  const nextMonth = new Date(Date.now() + 86400000 * 30);
  return calculateBusinessDaysBetween(today, nextMonth, { country: 'IN', includeEndDate: true }).summaryText;
}
