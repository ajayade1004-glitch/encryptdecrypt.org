import React, { useState, useEffect, useMemo } from 'react';
import {
  Calendar, Clock, Briefcase, Plus, Minus,
  Check, Copy, Download, Globe,
  Info, CalendarDays, Sun
} from 'lucide-react';
import {
  calculateBusinessDaysBetween,
  addWorkdays,
  formatDateYmd,
  getIsoWeekNumber,
  getDayOfYear,
  COUNTRY_STATE_OPTIONS,
  CountryCode,
  BusinessDaysResult
} from '../utils/businessDaysCalculatorEngine';

interface BusinessDaysStudioProps {
  toolSlug: string;
  toolName: string;
  onPayloadGenerated?: (output: string) => void;
}

export type StudioTab = 'count_days' | 'add_days' | 'workdays' | 'add_workdays' | 'weekday' | 'week_no';

export const BusinessDaysStudio: React.FC<BusinessDaysStudioProps> = ({
  toolSlug,
  onPayloadGenerated
}) => {
  // Determine initial active tab based on tool slug
  const initialTab: StudioTab = useMemo(() => {
    if (toolSlug.includes('add-workday') || toolSlug.includes('workday-date') || toolSlug.includes('due-date')) return 'add_workdays';
    if (toolSlug.includes('add-day') || toolSlug.includes('date-add')) return 'add_days';
    if (toolSlug.includes('week-number') || toolSlug.includes('week-no')) return 'week_no';
    if (toolSlug.includes('day-of-week') || toolSlug.includes('weekday')) return 'weekday';
    if (toolSlug === 'date-difference' || toolSlug.includes('count-day')) return 'count_days';
    return 'workdays';
  }, [toolSlug]);

  const [activeTab, setActiveTab] = useState<StudioTab>(initialTab);

  // Date States
  const todayYmd = useMemo(() => formatDateYmd(new Date()), []);
  const in30DaysYmd = useMemo(() => {
    const d = new Date();
    d.setDate(d.getDate() + 30);
    return formatDateYmd(d);
  }, []);

  const [startDateStr, setStartDateStr] = useState<string>(todayYmd);
  const [endDateStr, setEndDateStr] = useState<string>(in30DaysYmd);

  // Time Fields States ("Date to Date Calculator Add time fields")
  const [showTimeFields, setShowTimeFields] = useState<boolean>(false);
  const [startTime, setStartTime] = useState<string>('09:00:00');
  const [endTime, setEndTime] = useState<string>('18:00:00');

  // Options
  const [includeEndDate, setIncludeEndDate] = useState<boolean>(true);
  const [excludeMode, setExcludeMode] = useState<'weekends_holidays' | 'weekends_only' | 'sundays_only' | 'none'>('weekends_holidays');
  const [country, setCountry] = useState<CountryCode>('IN');
  const [showCountryPicker, setShowCountryPicker] = useState<boolean>(false);
  const [workHoursPerDay, setWorkHoursPerDay] = useState<number>(8);

  // Add/Subtract Days State
  const [daysCountToAdd, setDaysCountToAdd] = useState<number>(15);
  const [addOrSubtract, setAddOrSubtract] = useState<'add' | 'subtract'>('add');

  // Copy state
  const [copied, setCopied] = useState<boolean>(false);

  // Day / Month / Year decomposed helpers
  const parseDecomposed = (ymd: string) => {
    const parts = ymd.split('-');
    return {
      year: parseInt(parts[0], 10) || 2026,
      month: parseInt(parts[1], 10) || 1,
      day: parseInt(parts[2], 10) || 1
    };
  };

  const startDecomposed = useMemo(() => parseDecomposed(startDateStr), [startDateStr]);
  const endDecomposed = useMemo(() => parseDecomposed(endDateStr), [endDateStr]);

  const updateStartDatePart = (field: 'year' | 'month' | 'day', val: number) => {
    const cur = parseDecomposed(startDateStr);
    cur[field] = val;
    // Normalize valid day in month
    const maxDays = new Date(cur.year, cur.month, 0).getDate();
    cur.day = Math.min(Math.max(1, cur.day), maxDays);
    const d = new Date(cur.year, cur.month - 1, cur.day);
    setStartDateStr(formatDateYmd(d));
  };

  const updateEndDatePart = (field: 'year' | 'month' | 'day', val: number) => {
    const cur = parseDecomposed(endDateStr);
    cur[field] = val;
    const maxDays = new Date(cur.year, cur.month, 0).getDate();
    cur.day = Math.min(Math.max(1, cur.day), maxDays);
    const d = new Date(cur.year, cur.month - 1, cur.day);
    setEndDateStr(formatDateYmd(d));
  };

  // 1. Calculate Count Days / Workdays Result
  const countResult: BusinessDaysResult = useMemo(() => {
    return calculateBusinessDaysBetween(startDateStr, endDateStr, {
      includeEndDate,
      excludeMode: activeTab === 'count_days' ? (excludeMode === 'none' ? 'none' : excludeMode) : excludeMode,
      country,
      workHoursPerDay
    });
  }, [startDateStr, endDateStr, includeEndDate, excludeMode, activeTab, country, workHoursPerDay]);

  // 2. Calculate Add Workdays / Days Result
  const addResult = useMemo(() => {
    const amount = (addOrSubtract === 'subtract' ? -1 : 1) * Math.max(1, daysCountToAdd);
    if (activeTab === 'add_days') {
      const d = new Date(startDateStr);
      d.setDate(d.getDate() + amount);
      const resStr = formatDateYmd(d);
      const wk = getIsoWeekNumber(d);
      const dayName = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][d.getDay()];
      return {
        resultDateStr: resStr,
        resultWeekday: dayName,
        resultWeekNo: wk,
        totalCalendarDaysElapsed: Math.abs(daysCountToAdd),
        weekendDaysSkipped: 0,
        holidaysSkipped: [],
        summaryText: `=== ADD CALENDAR DAYS RESULT ===\nStart Date:     ${startDateStr}\nOperation:      ${addOrSubtract.toUpperCase()} ${daysCountToAdd} Calendar Days\nTarget Date:    ${resStr} (${dayName}, Week ${wk})\nCalendar Days:  ${Math.abs(daysCountToAdd)} days elapsed`
      };
    }

    return addWorkdays(startDateStr, amount, {
      excludeMode,
      country
    });
  }, [startDateStr, daysCountToAdd, addOrSubtract, activeTab, excludeMode, country]);

  // 3. Single Date & Week Number Info
  const singleDateInfo = useMemo(() => {
    const d = new Date(startDateStr);
    const dayIndex = d.getDay();
    const dayOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][dayIndex];
    const weekNo = getIsoWeekNumber(d);
    const dayOfYear = getDayOfYear(d);
    const isLeap = (d.getFullYear() % 4 === 0 && d.getFullYear() % 100 !== 0) || (d.getFullYear() % 400 === 0);
    const totalDaysInYear = isLeap ? 366 : 365;
    const remainingDays = totalDaysInYear - dayOfYear;
    const isWeekend = dayIndex === 0 || dayIndex === 6;
    const quarter = Math.floor(d.getMonth() / 3) + 1;

    return {
      dayOfWeek,
      weekNo,
      dayOfYear,
      totalDaysInYear,
      remainingDays,
      isLeap,
      isWeekend,
      quarter,
      percentElapsed: Math.round((dayOfYear / totalDaysInYear) * 1000) / 10
    };
  }, [startDateStr]);

  // 4. Date to Date with Time calculation
  const dateTimeDiff = useMemo(() => {
    const t1 = new Date(`${startDateStr}T${startTime}`);
    const t2 = new Date(`${endDateStr}T${endTime}`);
    const diffMs = Math.abs(t2.getTime() - t1.getTime());
    const totalSecs = Math.floor(diffMs / 1000);
    const totalMins = Math.floor(totalSecs / 60);
    const totalHours = Math.floor(totalMins / 60);
    const totalDays = Math.floor(totalHours / 24);

    const remHours = totalHours % 24;
    const remMins = totalMins % 60;
    const remSecs = totalSecs % 60;

    return {
      totalDays,
      remHours,
      remMins,
      remSecs,
      totalHours,
      totalMins,
      totalSecs,
      summaryText: `=== DATE & TIME DIFFERENCE ===\nStart:  ${startDateStr} ${startTime}\nEnd:    ${endDateStr} ${endTime}\nDiff:   ${totalDays} Days, ${remHours} Hours, ${remMins} Minutes, ${remSecs} Seconds\nTotal:  ${totalHours.toLocaleString()} Hours (${totalMins.toLocaleString()} Minutes)`
    };
  }, [startDateStr, startTime, endDateStr, endTime]);

  // Selected Country Label
  const currentCountryLabel = useMemo(() => {
    const match = COUNTRY_STATE_OPTIONS.find(o => o.code === country);
    return match ? match.label : 'Holidays for India – Nationwide';
  }, [country]);

  // Generate Current Summary for Text Output
  const currentSummary = useMemo(() => {
    if (activeTab === 'workdays' || activeTab === 'count_days') {
      let text = countResult.summaryText;
      if (showTimeFields) {
        text += `\n\n-------------------------------------------------------\nExact Time Interval (${startTime} to ${endTime}):\n• ${dateTimeDiff.totalDays} Days, ${dateTimeDiff.remHours} Hours, ${dateTimeDiff.remMins} Minutes, ${dateTimeDiff.remSecs} Seconds\n• Total Seconds: ${dateTimeDiff.totalSecs.toLocaleString()} s`;
      }
      return text;
    }
    if (activeTab === 'add_workdays' || activeTab === 'add_days') {
      return addResult.summaryText;
    }
    if (activeTab === 'weekday') {
      return [
        `=== WEEKDAY ANALYZER ===`,
        `Date:            ${startDateStr}`,
        `Day of Week:     ${singleDateInfo.dayOfWeek} (${singleDateInfo.isWeekend ? 'Weekend' : 'Business Weekday'})`,
        `Quarter:         Q${singleDateInfo.quarter} of ${parseDecomposed(startDateStr).year}`,
        `Day of the Year: Day ${singleDateInfo.dayOfYear} of ${singleDateInfo.totalDaysInYear} (${singleDateInfo.percentElapsed}% elapsed)`,
        `ISO-8601 Week:   Week ${singleDateInfo.weekNo}`,
        `Days Remaining:  ${singleDateInfo.remainingDays} days left in ${parseDecomposed(startDateStr).year}`,
        `Leap Year:       ${singleDateInfo.isLeap ? 'Yes (366 days)' : 'No (365 days)'}`
      ].join('\n');
    }
    if (activeTab === 'week_no') {
      return [
        `=== ISO-8601 WEEK NUMBER REPORT ===`,
        `Date:            ${startDateStr} (${singleDateInfo.dayOfWeek})`,
        `ISO Week Number: Week ${singleDateInfo.weekNo} of ${parseDecomposed(startDateStr).year}`,
        `Day of Year:     Day ${singleDateInfo.dayOfYear} of ${singleDateInfo.totalDaysInYear}`,
        `Year Progress:   ${singleDateInfo.percentElapsed}% of year completed`,
        `Remaining Days:  ${singleDateInfo.remainingDays} days left`
      ].join('\n');
    }
    return countResult.summaryText;
  }, [activeTab, countResult, addResult, singleDateInfo, dateTimeDiff, showTimeFields, startTime, endTime, startDateStr]);

  // Sync to parent workspace output
  useEffect(() => {
    if (onPayloadGenerated) {
      onPayloadGenerated(currentSummary);
    }
  }, [currentSummary, onPayloadGenerated]);

  const handleCopyCurrentSummary = () => {
    navigator.clipboard.writeText(currentSummary);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadCsv = () => {
    const csvContent = "data:text/csv;charset=utf-8," + encodeURIComponent(
      `Metric,Value\n` +
      `Start Date,${startDateStr}\n` +
      `End Date,${endDateStr}\n` +
      `Business Workdays,${countResult.businessDays}\n` +
      `Total Calendar Days,${countResult.totalCalendarDays}\n` +
      `Weekend Days,${countResult.weekendDays}\n` +
      `Public Holidays,${countResult.publicHolidaysCount}\n` +
      `Working Hours,${countResult.workHours}\n` +
      `Calendar Hours,${countResult.calendarHours}\n` +
      `Country/Jurisdiction,"${currentCountryLabel}"\n`
    );
    const link = document.createElement("a");
    link.setAttribute("href", csvContent);
    link.setAttribute("download", `working_days_${startDateStr}_to_${endDateStr}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Quick preset handlers
  const setQuickEndDate = (days: number) => {
    const d = new Date(startDateStr);
    d.setDate(d.getDate() + days);
    setEndDateStr(formatDateYmd(d));
  };

  const setEndOfYear = () => {
    const curYear = parseDecomposed(startDateStr).year;
    setEndDateStr(`${curYear}-12-31`);
  };

  return (
    <div className="card-glass p-4 sm:p-6 bg-[var(--bg-surface)] border border-blue-500/30 rounded-2xl shadow-2xl my-4 space-y-5">
      {/* Studio Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-[var(--border-subtle)]">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-xl bg-blue-500/15 border border-blue-500/30 flex items-center justify-center text-sky-400 shadow-xs">
            <Briefcase size={22} />
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-black text-[var(--text-primary)] flex items-center gap-2 m-0 tracking-tight">
              <span>Working Days Calculator: Business Days Between Two Dates</span>
            </h2>
            <p className="text-xs text-slate-300 m-0">
              How many business days or non-working days are there between two dates, including or excluding weekends or public holidays?
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleDownloadCsv}
            aria-label="Download CSV report"
            className="btn btn-secondary text-xs py-1.5 px-2.5 flex items-center gap-1.5 cursor-pointer"
          >
            <Download size={13} />
            <span className="hidden sm:inline">Export CSV</span>
          </button>
          <button
            onClick={handleCopyCurrentSummary}
            aria-label="Copy working days calculation summary"
            className="btn btn-primary text-xs py-1.5 px-3 flex items-center gap-1.5 shadow-sm cursor-pointer font-bold"
          >
            {copied ? <Check size={14} className="text-emerald-300" /> : <Copy size={14} />}
            <span>{copied ? 'Copied!' : 'Copy Summary'}</span>
          </button>
        </div>
      </div>

      {/* Tabs matching user prompt:
          Count Days | Add Days | Workdays | Add Workdays | Weekday | Week № */}
      <div className="grid grid-cols-3 sm:grid-cols-6 gap-1.5 p-1 rounded-xl bg-[var(--bg-input)] border border-[var(--border-subtle)] text-xs">
        <button
          onClick={() => setActiveTab('count_days')}
          aria-label="Count Days"
          className={`min-h-[42px] px-2 py-1.5 rounded-lg font-bold transition-all cursor-pointer flex flex-col sm:flex-row items-center justify-center gap-1.5 text-center ${
            activeTab === 'count_days'
              ? 'bg-[#1d4ed8] text-white shadow-sm ring-1 ring-blue-400'
              : 'text-slate-300 hover:text-white hover:bg-white/5'
          }`}
        >
          <CalendarDays size={14} />
          <span>Count Days</span>
        </button>

        <button
          onClick={() => setActiveTab('add_days')}
          aria-label="Add Days"
          className={`min-h-[42px] px-2 py-1.5 rounded-lg font-bold transition-all cursor-pointer flex flex-col sm:flex-row items-center justify-center gap-1.5 text-center ${
            activeTab === 'add_days'
              ? 'bg-[#1d4ed8] text-white shadow-sm ring-1 ring-blue-400'
              : 'text-slate-300 hover:text-white hover:bg-white/5'
          }`}
        >
          <Calendar size={14} />
          <span>Add Days</span>
        </button>

        <button
          onClick={() => setActiveTab('workdays')}
          aria-label="Workdays"
          className={`min-h-[42px] px-2 py-1.5 rounded-lg font-bold transition-all cursor-pointer flex flex-col sm:flex-row items-center justify-center gap-1.5 text-center ${
            activeTab === 'workdays'
              ? 'bg-[#1d4ed8] text-white shadow-sm ring-1 ring-blue-400'
              : 'text-slate-300 hover:text-white hover:bg-white/5'
          }`}
        >
          <Briefcase size={14} />
          <span>Workdays</span>
        </button>

        <button
          onClick={() => setActiveTab('add_workdays')}
          aria-label="Add Workdays"
          className={`min-h-[42px] px-2 py-1.5 rounded-lg font-bold transition-all cursor-pointer flex flex-col sm:flex-row items-center justify-center gap-1.5 text-center ${
            activeTab === 'add_workdays'
              ? 'bg-[#1d4ed8] text-white shadow-sm ring-1 ring-blue-400'
              : 'text-slate-300 hover:text-white hover:bg-white/5'
          }`}
        >
          <Plus size={14} />
          <span>Add Workdays</span>
        </button>

        <button
          onClick={() => setActiveTab('weekday')}
          aria-label="Weekday"
          className={`min-h-[42px] px-2 py-1.5 rounded-lg font-bold transition-all cursor-pointer flex flex-col sm:flex-row items-center justify-center gap-1.5 text-center ${
            activeTab === 'weekday'
              ? 'bg-[#1d4ed8] text-white shadow-sm ring-1 ring-blue-400'
              : 'text-slate-300 hover:text-white hover:bg-white/5'
          }`}
        >
          <Sun size={14} />
          <span>Weekday</span>
        </button>

        <button
          onClick={() => setActiveTab('week_no')}
          aria-label="Week Number"
          className={`min-h-[42px] px-2 py-1.5 rounded-lg font-bold transition-all cursor-pointer flex flex-col sm:flex-row items-center justify-center gap-1.5 text-center ${
            activeTab === 'week_no'
              ? 'bg-[#1d4ed8] text-white shadow-sm ring-1 ring-blue-400'
              : 'text-slate-300 hover:text-white hover:bg-white/5'
          }`}
        >
          <Clock size={14} />
          <span>Week №</span>
        </button>
      </div>

      {/* Main Calculation Inputs Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* START DATE CARD */}
        <div className="card-glass p-4 bg-[var(--bg-input)] border border-[var(--border-subtle)] rounded-xl space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-[var(--border-subtle)]">
            <span className="text-xs font-bold text-sky-400 flex items-center gap-1.5 uppercase tracking-wider">
              <Calendar size={14} /> Start Date
            </span>
            <button
              onClick={() => setStartDateStr(todayYmd)}
              aria-label="Set start date to today"
              className="text-xs font-bold text-sky-400 hover:underline px-2.5 py-1 rounded bg-blue-500/15 border border-blue-500/30 cursor-pointer shadow-xs"
            >
              Today
            </button>
          </div>

          {/* Decomposed Day / Month / Year fields as requested:
              Day: dd / Month: mm / Year: yyyy Date: Today */}
          <div className="grid grid-cols-3 gap-2">
            <div>
              <label htmlFor="start-day-input" className="block text-[11px] font-bold text-slate-300 mb-1">Day: dd</label>
              <input
                id="start-day-input"
                type="number"
                min={1}
                max={31}
                value={startDecomposed.day}
                onChange={e => updateStartDatePart('day', parseInt(e.target.value, 10) || 1)}
                className="w-full h-9 bg-[var(--bg-surface)] border border-[var(--border-subtle)] focus:border-[#2E9BFF] rounded-lg px-2.5 text-xs text-white font-mono"
              />
            </div>
            <div>
              <label htmlFor="start-month-input" className="block text-[11px] font-bold text-slate-300 mb-1">Month: mm</label>
              <input
                id="start-month-input"
                type="number"
                min={1}
                max={12}
                value={startDecomposed.month}
                onChange={e => updateStartDatePart('month', parseInt(e.target.value, 10) || 1)}
                className="w-full h-9 bg-[var(--bg-surface)] border border-[var(--border-subtle)] focus:border-[#2E9BFF] rounded-lg px-2.5 text-xs text-white font-mono"
              />
            </div>
            <div>
              <label htmlFor="start-year-input" className="block text-[11px] font-bold text-slate-300 mb-1">Year: yyyy</label>
              <input
                id="start-year-input"
                type="number"
                min={1970}
                max={2100}
                value={startDecomposed.year}
                onChange={e => updateStartDatePart('year', parseInt(e.target.value, 10) || 2026)}
                className="w-full h-9 bg-[var(--bg-surface)] border border-[var(--border-subtle)] focus:border-[#2E9BFF] rounded-lg px-2.5 text-xs text-white font-mono"
              />
            </div>
          </div>

          {/* Native picker + Time field if enabled */}
          <div className="flex flex-wrap items-center gap-2 pt-1">
            <div className="flex-1 min-w-[150px]">
              <label htmlFor="start-native-date" className="block text-[10px] text-slate-400 font-mono mb-0.5">Date Selector</label>
              <input
                id="start-native-date"
                type="date"
                aria-label="Select start date"
                value={startDateStr}
                onChange={e => e.target.value && setStartDateStr(e.target.value)}
                className="w-full h-9 bg-[var(--bg-surface)] border border-[var(--border-subtle)] focus:border-[#2E9BFF] rounded-lg px-2.5 text-xs text-white"
              />
            </div>

            {showTimeFields && (
              <div className="w-32">
                <label htmlFor="start-time-input" className="block text-[10px] text-slate-400 font-mono mb-0.5">Start Time (HH:MM:SS)</label>
                <input
                  id="start-time-input"
                  type="time"
                  step={1}
                  aria-label="Start time"
                  value={startTime}
                  onChange={e => setStartTime(e.target.value)}
                  className="w-full h-9 bg-[var(--bg-surface)] border border-[var(--border-subtle)] focus:border-[#2E9BFF] rounded-lg px-2 text-xs text-white font-mono"
                />
              </div>
            )}
          </div>
        </div>

        {/* END DATE / ADD DAYS / SINGLE DATE CARD */}
        {activeTab === 'add_workdays' || activeTab === 'add_days' ? (
          <div className="card-glass p-4 bg-[var(--bg-input)] border border-[var(--border-subtle)] rounded-xl space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-[var(--border-subtle)]">
              <span className="text-xs font-bold text-sky-400 flex items-center gap-1.5 uppercase tracking-wider">
                <Plus size={14} /> Days to {addOrSubtract === 'add' ? 'Add' : 'Subtract'}
              </span>
              <div className="flex items-center gap-1 bg-[var(--bg-surface)] p-0.5 rounded-lg border border-[var(--border-subtle)] text-[11px]">
                <button
                  onClick={() => setAddOrSubtract('add')}
                  aria-label="Add days"
                  className={`px-3 py-1 rounded font-bold cursor-pointer ${
                    addOrSubtract === 'add' ? 'bg-[#1d4ed8] text-white shadow-xs' : 'text-slate-300'
                  }`}
                >
                  + Add
                </button>
                <button
                  onClick={() => setAddOrSubtract('subtract')}
                  aria-label="Subtract days"
                  className={`px-3 py-1 rounded font-bold cursor-pointer ${
                    addOrSubtract === 'subtract' ? 'bg-[#1d4ed8] text-white shadow-xs' : 'text-slate-300'
                  }`}
                >
                  − Subtract
                </button>
              </div>
            </div>

            <div>
              <label htmlFor="days-amount-input" className="block text-[11px] font-bold text-slate-300 mb-1">
                Number of {activeTab === 'add_workdays' ? 'Business / Working Days' : 'Calendar Days'}
              </label>
              <input
                id="days-amount-input"
                type="number"
                min={1}
                max={1000}
                value={daysCountToAdd}
                onChange={e => setDaysCountToAdd(parseInt(e.target.value, 10) || 1)}
                className="w-full h-10 bg-[var(--bg-surface)] border border-[var(--border-subtle)] focus:border-[#2E9BFF] rounded-lg px-3 text-sm text-white font-mono font-bold"
              />
            </div>

            <div className="flex flex-wrap items-center gap-1.5 pt-1 text-xs">
              <span className="text-[10px] text-slate-400 font-mono">Quick:</span>
              {[5, 10, 15, 20, 30, 45, 60, 90].map(n => (
                <button
                  key={n}
                  onClick={() => setDaysCountToAdd(n)}
                  aria-label={`Set days to ${n}`}
                  className="px-2 py-1 rounded bg-[var(--bg-surface)] hover:bg-blue-500/10 border border-[var(--border-subtle)] text-slate-200 text-[11px] font-mono cursor-pointer"
                >
                  {n}d
                </button>
              ))}
            </div>
          </div>
        ) : activeTab === 'weekday' || activeTab === 'week_no' ? (
          <div className="card-glass p-4 bg-[var(--bg-input)] border border-[var(--border-subtle)] rounded-xl space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-[var(--border-subtle)]">
              <span className="text-xs font-bold text-sky-400 flex items-center gap-1.5 uppercase tracking-wider">
                <Sun size={14} /> {activeTab === 'weekday' ? 'Weekday Analysis' : 'Week № Analysis'}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2">
              <div className="p-3 rounded-lg bg-[var(--bg-surface)] border border-[var(--border-subtle)] text-center">
                <span className="text-[11px] text-slate-300 block font-medium">Day of the Week</span>
                <span className="text-base sm:text-lg font-extrabold text-sky-400">{singleDateInfo.dayOfWeek}</span>
              </div>

              <div className="p-3 rounded-lg bg-[var(--bg-surface)] border border-[var(--border-subtle)] text-center">
                <span className="text-[11px] text-slate-300 block font-medium">ISO-8601 Week №</span>
                <span className="text-base sm:text-lg font-extrabold text-emerald-400">Week {singleDateInfo.weekNo}</span>
              </div>

              <div className="p-3 rounded-lg bg-[var(--bg-surface)] border border-[var(--border-subtle)] text-center">
                <span className="text-[11px] text-slate-300 block font-medium">Day of Year</span>
                <span className="text-base sm:text-lg font-extrabold text-amber-300">{singleDateInfo.dayOfYear} / {singleDateInfo.totalDaysInYear}</span>
              </div>

              <div className="p-3 rounded-lg bg-[var(--bg-surface)] border border-[var(--border-subtle)] text-center">
                <span className="text-[11px] text-slate-300 block font-medium">Days Remaining</span>
                <span className="text-base sm:text-lg font-extrabold text-purple-400">{singleDateInfo.remainingDays} days</span>
              </div>
            </div>
          </div>
        ) : (
          /* STANDARD END DATE CARD */
          <div className="card-glass p-4 bg-[var(--bg-input)] border border-[var(--border-subtle)] rounded-xl space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-[var(--border-subtle)]">
              <span className="text-xs font-bold text-sky-400 flex items-center gap-1.5 uppercase tracking-wider">
                <Calendar size={14} /> End Date
              </span>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setEndDateStr(todayYmd)}
                  aria-label="Set end date to today"
                  className="text-xs font-bold text-sky-400 hover:underline px-2.5 py-1 rounded bg-blue-500/15 border border-blue-500/30 cursor-pointer shadow-xs"
                >
                  Today
                </button>
                <button
                  onClick={() => setQuickEndDate(30)}
                  aria-label="Set end date to plus 30 days"
                  className="text-[11px] font-semibold text-slate-300 hover:text-white px-2 py-0.5 rounded bg-[var(--bg-surface)] border border-[var(--border-subtle)] cursor-pointer"
                >
                  +30d
                </button>
                <button
                  onClick={() => setQuickEndDate(90)}
                  aria-label="Set end date to plus 90 days"
                  className="text-[11px] font-semibold text-slate-300 hover:text-white px-2 py-0.5 rounded bg-[var(--bg-surface)] border border-[var(--border-subtle)] cursor-pointer"
                >
                  +90d
                </button>
                <button
                  onClick={setEndOfYear}
                  aria-label="Set end date to end of year"
                  className="text-[11px] font-semibold text-slate-300 hover:text-white px-2 py-0.5 rounded bg-[var(--bg-surface)] border border-[var(--border-subtle)] cursor-pointer"
                >
                  End of Year
                </button>
              </div>
            </div>

            {/* Decomposed Day / Month / Year fields as requested:
                End Date: Day: dd / Month: mm / Year: yyyy Date: Today */}
            <div className="grid grid-cols-3 gap-2">
              <div>
                <label htmlFor="end-day-input" className="block text-[11px] font-bold text-slate-300 mb-1">Day: dd</label>
                <input
                  id="end-day-input"
                  type="number"
                  min={1}
                  max={31}
                  value={endDecomposed.day}
                  onChange={e => updateEndDatePart('day', parseInt(e.target.value, 10) || 1)}
                  className="w-full h-9 bg-[var(--bg-surface)] border border-[var(--border-subtle)] focus:border-[#2E9BFF] rounded-lg px-2.5 text-xs text-white font-mono"
                />
              </div>
              <div>
                <label htmlFor="end-month-input" className="block text-[11px] font-bold text-slate-300 mb-1">Month: mm</label>
                <input
                  id="end-month-input"
                  type="number"
                  min={1}
                  max={12}
                  value={endDecomposed.month}
                  onChange={e => updateEndDatePart('month', parseInt(e.target.value, 10) || 1)}
                  className="w-full h-9 bg-[var(--bg-surface)] border border-[var(--border-subtle)] focus:border-[#2E9BFF] rounded-lg px-2.5 text-xs text-white font-mono"
                />
              </div>
              <div>
                <label htmlFor="end-year-input" className="block text-[11px] font-bold text-slate-300 mb-1">Year: yyyy</label>
                <input
                  id="end-year-input"
                  type="number"
                  min={1970}
                  max={2100}
                  value={endDecomposed.year}
                  onChange={e => updateEndDatePart('year', parseInt(e.target.value, 10) || 2026)}
                  className="w-full h-9 bg-[var(--bg-surface)] border border-[var(--border-subtle)] focus:border-[#2E9BFF] rounded-lg px-2.5 text-xs text-white font-mono"
                />
              </div>
            </div>

            {/* Native picker + Time field if enabled */}
            <div className="flex flex-wrap items-center gap-2 pt-1">
              <div className="flex-1 min-w-[150px]">
                <label htmlFor="end-native-date" className="block text-[10px] text-slate-400 font-mono mb-0.5">Date Selector</label>
                <input
                  id="end-native-date"
                  type="date"
                  aria-label="Select end date"
                  value={endDateStr}
                  onChange={e => e.target.value && setEndDateStr(e.target.value)}
                  className="w-full h-9 bg-[var(--bg-surface)] border border-[var(--border-subtle)] focus:border-[#2E9BFF] rounded-lg px-2.5 text-xs text-white"
                />
              </div>

              {showTimeFields && (
                <div className="w-32">
                  <label htmlFor="end-time-input" className="block text-[10px] text-slate-400 font-mono mb-0.5">End Time (HH:MM:SS)</label>
                  <input
                    id="end-time-input"
                    type="time"
                    step={1}
                    aria-label="End time"
                    value={endTime}
                    onChange={e => setEndTime(e.target.value)}
                    className="w-full h-9 bg-[var(--bg-surface)] border border-[var(--border-subtle)] focus:border-[#2E9BFF] rounded-lg px-2 text-xs text-white font-mono"
                  />
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Date to Date Calculator: Add Time Fields Toggle */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-xl bg-blue-500/10 border border-blue-500/25 text-xs">
        <label className="flex items-center gap-2 cursor-pointer font-bold text-sky-300 select-none">
          <input
            type="checkbox"
            checked={showTimeFields}
            onChange={e => setShowTimeFields(e.target.checked)}
            className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 accent-blue-600 cursor-pointer"
          />
          <Clock size={15} />
          <span>Date to Date Calculator Add time fields (Hours:Minutes:Seconds)</span>
        </label>
        {showTimeFields && (
          <span className="text-[11px] text-slate-300 font-mono">
            Elapsed: {dateTimeDiff.totalDays}d {dateTimeDiff.remHours}h {dateTimeDiff.remMins}m {dateTimeDiff.remSecs}s
          </span>
        )}
      </div>

      {/* Configuration & Exclusion Options */}
      <div className="p-4 rounded-xl bg-[var(--bg-surface-hover)] border border-[var(--border-subtle)] text-xs space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          {/* Include End Date in Calculation checkbox */}
          {(activeTab === 'workdays' || activeTab === 'count_days') && (
            <label className="flex items-center gap-2 cursor-pointer select-none font-semibold text-slate-200">
              <input
                type="checkbox"
                checked={includeEndDate}
                onChange={e => setIncludeEndDate(e.target.checked)}
                className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 accent-blue-600 cursor-pointer"
              />
              <span>Include end date in calculation (1 day is added)</span>
            </label>
          )}

          {/* Days in Results: Exclude dropdown */}
          {activeTab !== 'weekday' && activeTab !== 'week_no' && (
            <div className="flex items-center gap-2">
              <span className="font-bold text-slate-300">Days in Results:</span>
              <select
                value={excludeMode}
                onChange={e => setExcludeMode(e.target.value as any)}
                aria-label="Exclude weekends or public holidays"
                className="h-8 bg-[var(--bg-surface)] border border-[var(--border-subtle)] focus:border-[#2E9BFF] rounded-lg px-2.5 text-xs text-white font-medium cursor-pointer"
              >
                <option value="weekends_holidays">Exclude Weekends and public holidays</option>
                <option value="weekends_only">Exclude Weekends only (Saturday &amp; Sunday)</option>
                <option value="sundays_only">Exclude Sundays only</option>
                <option value="none">None (Include all days)</option>
              </select>
            </div>
          )}
        </div>

        {/* Holidays for India – Nationwide. Change Country / Change State */}
        {excludeMode === 'weekends_holidays' && activeTab !== 'weekday' && activeTab !== 'week_no' && (
          <div className="pt-2 border-t border-[var(--border-subtle)] space-y-2">
            <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
              <div className="flex items-center gap-2">
                <Globe size={15} className="text-sky-400" />
                <span className="font-bold text-slate-100">{currentCountryLabel}.</span>
                <button
                  type="button"
                  onClick={() => setShowCountryPicker(!showCountryPicker)}
                  aria-label="Change country or state for public holidays"
                  className="text-xs font-bold text-sky-400 hover:text-sky-300 underline cursor-pointer"
                >
                  {showCountryPicker ? 'Close Selector' : 'Change Country / Change State'}
                </button>
              </div>

              <div className="flex items-center gap-2 text-slate-400 text-[11px]">
                <span>Work Hours:</span>
                <input
                  type="number"
                  min={1}
                  max={24}
                  value={workHoursPerDay}
                  onChange={e => setWorkHoursPerDay(parseInt(e.target.value, 10) || 8)}
                  className="w-12 h-7 bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded px-1.5 text-xs text-center text-white font-mono"
                />
                <span>hrs/day</span>
              </div>
            </div>

            {/* Change Country / Change State Selector Dropdown Panel */}
            {showCountryPicker && (
              <div className="p-3 rounded-xl bg-[var(--bg-surface)] border border-blue-500/30 space-y-2 animate-in fade-in duration-150">
                <span className="text-[11px] font-bold text-sky-400 uppercase tracking-wider block">
                  Select Regional Public Holiday Calendar:
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-1.5 max-h-56 overflow-y-auto pr-1">
                  {COUNTRY_STATE_OPTIONS.map(opt => (
                    <button
                      key={opt.code}
                      onClick={() => {
                        setCountry(opt.code);
                        setShowCountryPicker(false);
                      }}
                      className={`text-left p-2 rounded-lg text-xs font-medium transition-all flex items-center justify-between cursor-pointer ${
                        country === opt.code
                          ? 'bg-[#1d4ed8] text-white shadow-xs font-bold'
                          : 'bg-[var(--bg-input)] text-slate-300 hover:text-white hover:bg-white/5'
                      }`}
                    >
                      <span className="truncate pr-1">{opt.label}</span>
                      {country === opt.code && <Check size={13} className="text-white shrink-0" />}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* RICH RESULT DISPLAY AREA */}
      <div className="space-y-4">
        {/* If Active Tab is Workdays or Count Days */}
        {(activeTab === 'workdays' || activeTab === 'count_days') && (
          <>
            {/* Primary Stat Badges Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
              <div className="p-3.5 rounded-xl bg-blue-500/10 border border-blue-500/25 shadow-sm">
                <span className="text-[11px] font-bold text-sky-400 uppercase tracking-wider block mb-1">
                  Business / Workdays
                </span>
                <span className="text-2xl sm:text-3xl font-black text-white font-mono">
                  {countResult.businessDays}
                </span>
                <span className="text-[11px] text-slate-300 block mt-1">
                  {countResult.percentageBusinessDays}% of duration
                </span>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-800/60 border border-[var(--border-subtle)] shadow-sm">
                <span className="text-[11px] font-bold text-slate-300 uppercase tracking-wider block mb-1">
                  Total Calendar Days
                </span>
                <span className="text-2xl sm:text-3xl font-black text-slate-100 font-mono">
                  {countResult.totalCalendarDays}
                </span>
                <span className="text-[11px] text-slate-400 block mt-1">
                  {countResult.weeksAndDays.weeks}w {countResult.weeksAndDays.days}d
                </span>
              </div>

              <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/25 shadow-sm">
                <span className="text-[11px] font-bold text-amber-300 uppercase tracking-wider block mb-1">
                  Weekend Days
                </span>
                <span className="text-2xl sm:text-3xl font-black text-amber-300 font-mono">
                  {countResult.weekendDays}
                </span>
                <span className="text-[11px] text-slate-300 block mt-1">
                  {countResult.saturdaysCount} Sat, {countResult.sundaysCount} Sun
                </span>
              </div>

              <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/25 shadow-sm">
                <span className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider block mb-1">
                  Public Holidays
                </span>
                <span className="text-2xl sm:text-3xl font-black text-emerald-400 font-mono">
                  {countResult.publicHolidaysCount}
                </span>
                <span className="text-[11px] text-slate-300 block mt-1">
                  {countResult.publicHolidaysCount > 0 ? 'In date range' : '0 in range'}
                </span>
              </div>
            </div>

            {/* Additional Units Breakdown */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs p-3 rounded-xl bg-[var(--bg-input)] border border-[var(--border-subtle)] font-mono text-center">
              <div>
                <span className="text-[10px] text-slate-400 block font-sans">Working Hours:</span>
                <span className="text-sky-400 font-bold">{countResult.workHours} hrs</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block font-sans">Calendar Hours:</span>
                <span className="text-slate-200 font-bold">{countResult.calendarHours.toLocaleString()} hrs</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block font-sans">Start Weekday:</span>
                <span className="text-emerald-400 font-bold">{countResult.startWeekday}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block font-sans">End Weekday:</span>
                <span className="text-amber-300 font-bold">{countResult.endWeekday}</span>
              </div>
            </div>

            {/* List of Public Holidays falling in range */}
            {countResult.holidaysInRange.length > 0 && (
              <div className="p-3.5 rounded-xl bg-[var(--bg-input)] border border-blue-500/20 text-xs space-y-2">
                <div className="flex items-center gap-1.5 font-bold text-white text-xs">
                  <Info size={14} className="text-sky-400" />
                  <span>Public Holidays Falling Between These Dates ({countResult.holidaysInRange.length}):</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {countResult.holidaysInRange.map((h, i) => {
                    const hd = new Date(h.date);
                    const wkday = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][hd.getDay()];
                    return (
                      <div key={i} className="p-2 rounded-lg bg-[var(--bg-surface)] border border-[var(--border-subtle)] flex items-center justify-between">
                        <div>
                          <span className="font-bold text-slate-100 block">{h.name}</span>
                          <span className="text-[10px] text-slate-400 font-mono">{h.date} ({wkday})</span>
                        </div>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                          Holiday
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </>
        )}

        {/* If Active Tab is Add Workdays or Add Days */}
        {(activeTab === 'add_workdays' || activeTab === 'add_days') && (
          <div className="p-5 rounded-2xl bg-blue-500/10 border border-blue-500/30 text-center space-y-3 shadow-md">
            <span className="text-xs uppercase font-bold text-sky-400 tracking-wider block">
              Calculated Target Date ({addOrSubtract === 'add' ? `+${daysCountToAdd}` : `-${daysCountToAdd}`} {activeTab === 'add_workdays' ? 'Workdays' : 'Calendar Days'})
            </span>
            <div className="text-3xl sm:text-4xl font-black text-white font-mono">
              {addResult.resultDateStr}
            </div>
            <div className="inline-flex flex-wrap items-center justify-center gap-3 px-3.5 py-1.5 rounded-full bg-[var(--bg-surface)] border border-[var(--border-subtle)] text-xs text-slate-200 font-mono">
              <span className="font-bold text-sky-400">{addResult.resultWeekday}</span>
              <span>·</span>
              <span>ISO Week {addResult.resultWeekNo}</span>
              <span>·</span>
              <span>{addResult.totalCalendarDaysElapsed} Calendar Days Elapsed</span>
            </div>

            {addResult.holidaysSkipped.length > 0 && (
              <div className="pt-2 text-xs text-slate-300">
                <span className="font-semibold text-emerald-400">Bypassed {addResult.holidaysSkipped.length} Public Holidays: </span>
                {addResult.holidaysSkipped.map(h => h.name).join(', ')}
              </div>
            )}
          </div>
        )}

        {/* If Active Tab is Weekday */}
        {activeTab === 'weekday' && (
          <div className="p-5 rounded-2xl bg-blue-500/10 border border-blue-500/30 text-center space-y-3">
            <span className="text-xs uppercase font-bold text-sky-400 tracking-wider block">
              Day of the Week for {startDateStr}
            </span>
            <div className="text-3xl sm:text-4xl font-black text-white">
              {singleDateInfo.dayOfWeek}
            </div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--bg-surface)] border border-[var(--border-subtle)] text-xs text-slate-200 font-mono">
              <span className={singleDateInfo.isWeekend ? 'text-amber-300 font-bold' : 'text-emerald-400 font-bold'}>
                {singleDateInfo.isWeekend ? 'Weekend (Non-Working Day)' : 'Business Weekday'}
              </span>
              <span>·</span>
              <span>Quarter Q{singleDateInfo.quarter}</span>
              <span>·</span>
              <span>ISO Week {singleDateInfo.weekNo}</span>
            </div>
          </div>
        )}

        {/* If Active Tab is Week № */}
        {activeTab === 'week_no' && (
          <div className="p-5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-center space-y-3">
            <span className="text-xs uppercase font-bold text-emerald-400 tracking-wider block">
              ISO-8601 Week Number for {startDateStr}
            </span>
            <div className="text-3xl sm:text-4xl font-black text-white font-mono">
              Week {singleDateInfo.weekNo}
            </div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--bg-surface)] border border-[var(--border-subtle)] text-xs text-slate-200 font-mono">
              <span>Day {singleDateInfo.dayOfYear} of {singleDateInfo.totalDaysInYear} ({singleDateInfo.percentElapsed}% of year)</span>
              <span>·</span>
              <span>{singleDateInfo.remainingDays} days remaining</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
