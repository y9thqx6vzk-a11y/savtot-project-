/**
 * Natural language duration parser for frictionless planning.
 * Supports both Hebrew and English inputs!
 * e.g., "שבועיים", "2 שבועות", "3 ימים", "2 weeks", "48h", "חודש"
 */

export interface ParsedDuration {
  days: number;
  formatted: string;
}

export function parseDuration(input: string | number): ParsedDuration | null {
  if (typeof input === 'number') {
    if (isNaN(input) || input < 0) return null;
    return { days: input, formatted: formatDaysHebrew(input) };
  }

  if (!input || !input.trim()) return null;

  const raw = input.trim().toLowerCase();

  // Plain number
  const numOnly = Number(raw);
  if (!isNaN(numOnly) && numOnly >= 0) {
    return { days: numOnly, formatted: formatDaysHebrew(numOnly) };
  }

  // Hebrew special keywords
  if (raw === 'יום' || raw === 'יום אחד') return { days: 1, formatted: 'יום אחד' };
  if (raw === 'יומיים') return { days: 2, formatted: 'יומיים' };
  if (raw === 'שבוע' || raw === 'שבוע אחד') return { days: 7, formatted: 'שבוע אחד (7 ימים)' };
  if (raw === 'שבועיים') return { days: 14, formatted: 'שבועיים (14 יום)' };
  if (raw === 'חודש' || raw === 'חודש אחד') return { days: 30, formatted: 'חודש (30 יום)' };
  if (raw === 'חודשיים') return { days: 60, formatted: 'חודשיים (60 יום)' };

  // Hebrew regex: X ימים / יום
  const hebDaysMatch = raw.match(/^([\d.]+)\s*(ימים|יום)$/);
  if (hebDaysMatch) {
    const val = parseFloat(hebDaysMatch[1]);
    if (!isNaN(val)) return { days: val, formatted: formatDaysHebrew(val) };
  }

  // Hebrew regex: X שבועות / שבוע
  const hebWeeksMatch = raw.match(/^([\d.]+)\s*(שבועות|שבוע)$/);
  if (hebWeeksMatch) {
    const val = parseFloat(hebWeeksMatch[1]);
    if (!isNaN(val)) {
      const days = Math.round(val * 7 * 10) / 10;
      return { days, formatted: formatDaysHebrew(days) };
    }
  }

  // Hebrew regex: X שעות / שעה
  const hebHoursMatch = raw.match(/^([\d.]+)\s*(שעות|שעה)$/);
  if (hebHoursMatch) {
    const val = parseFloat(hebHoursMatch[1]);
    if (!isNaN(val)) {
      const days = Math.round((val / 24) * 10) / 10;
      return { days, formatted: formatDaysHebrew(days) };
    }
  }

  // Hebrew regex: X חודשים / חודש
  const hebMonthsMatch = raw.match(/^([\d.]+)\s*(חודשים|חודש)$/);
  if (hebMonthsMatch) {
    const val = parseFloat(hebMonthsMatch[1]);
    if (!isNaN(val)) {
      const days = Math.round(val * 30 * 10) / 10;
      return { days, formatted: formatDaysHebrew(days) };
    }
  }

  // English regexes
  const weekMatch = raw.match(/^([\d.]+)\s*(w|wk|wks|week|weeks)$/);
  if (weekMatch) {
    const val = parseFloat(weekMatch[1]);
    if (!isNaN(val)) {
      const days = Math.round(val * 7 * 10) / 10;
      return { days, formatted: formatDaysHebrew(days) };
    }
  }

  const hourMatch = raw.match(/^([\d.]+)\s*(h|hr|hrs|hour|hours)$/);
  if (hourMatch) {
    const val = parseFloat(hourMatch[1]);
    if (!isNaN(val)) {
      const days = Math.round((val / 24) * 10) / 10;
      return { days, formatted: formatDaysHebrew(days) };
    }
  }

  const monthMatch = raw.match(/^([\d.]+)\s*(m|mo|mos|month|months)$/);
  if (monthMatch) {
    const val = parseFloat(monthMatch[1]);
    if (!isNaN(val)) {
      const days = Math.round(val * 30 * 10) / 10;
      return { days, formatted: formatDaysHebrew(days) };
    }
  }

  const dayMatch = raw.match(/^([\d.]+)\s*(d|day|days)$/);
  if (dayMatch) {
    const val = parseFloat(dayMatch[1]);
    if (!isNaN(val)) {
      return { days: val, formatted: formatDaysHebrew(val) };
    }
  }

  return null;
}

function formatDaysHebrew(days: number): string {
  if (days === 0) return '0 ימים';
  if (days === 1) return 'יום אחד';
  if (days === 2) return 'יומיים';
  if (days === 7) return 'שבוע (7 ימים)';
  if (days === 14) return 'שבועיים (14 יום)';
  if (days >= 7 && days % 7 === 0) {
    return `${days / 7} שבועות (${days} ימים)`;
  }
  return `${days} ימים`;
}
