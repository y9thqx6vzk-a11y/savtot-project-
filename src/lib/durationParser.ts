/**
 * Natural language duration parser for frictionless planning.
 * Converts human inputs like "2 weeks", "48h", "1.5 months", "10 days" to numerical days.
 */

export interface ParsedDuration {
  days: number;
  formatted: string;
}

export function parseDuration(input: string | number): ParsedDuration | null {
  if (typeof input === 'number') {
    if (isNaN(input) || input < 0) return null;
    return { days: input, formatted: formatDays(input) };
  }

  if (!input || !input.trim()) return null;

  const raw = input.trim().toLowerCase();

  // If plain number
  const numOnly = Number(raw);
  if (!isNaN(numOnly) && numOnly >= 0) {
    return { days: numOnly, formatted: formatDays(numOnly) };
  }

  // Regex patterns
  // e.g. "2.5 weeks", "2w", "3 weeks"
  const weekMatch = raw.match(/^([\d.]+)\s*(w|wk|wks|week|weeks)$/);
  if (weekMatch) {
    const val = parseFloat(weekMatch[1]);
    if (!isNaN(val)) {
      const days = Math.round(val * 7 * 10) / 10;
      return { days, formatted: formatDays(days) };
    }
  }

  // e.g. "48h", "36 hours", "12 hrs"
  const hourMatch = raw.match(/^([\d.]+)\s*(h|hr|hrs|hour|hours)$/);
  if (hourMatch) {
    const val = parseFloat(hourMatch[1]);
    if (!isNaN(val)) {
      const days = Math.round((val / 24) * 10) / 10;
      return { days, formatted: formatDays(days) };
    }
  }

  // e.g. "1 month", "1.5 months", "2mo"
  const monthMatch = raw.match(/^([\d.]+)\s*(m|mo|mos|month|months)$/);
  if (monthMatch) {
    const val = parseFloat(monthMatch[1]);
    if (!isNaN(val)) {
      const days = Math.round(val * 30 * 10) / 10;
      return { days, formatted: formatDays(days) };
    }
  }

  // e.g. "5 days", "5d"
  const dayMatch = raw.match(/^([\d.]+)\s*(d|day|days)$/);
  if (dayMatch) {
    const val = parseFloat(dayMatch[1]);
    if (!isNaN(val)) {
      return { days: val, formatted: formatDays(val) };
    }
  }

  return null;
}

function formatDays(days: number): string {
  if (days === 0) return '0 days';
  if (days === 1) return '1 day';
  if (days >= 7 && days % 7 === 0) {
    const weeks = days / 7;
    return `${weeks} ${weeks === 1 ? 'week' : 'weeks'} (${days}d)`;
  }
  return `${days} ${days === 1 ? 'day' : 'days'}`;
}
