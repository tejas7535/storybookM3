import { isMoment } from 'moment';

/**
 * Generates a date format string for a given locale.
 *
 * Example:
 *  - For the locale 'de' (German), the resulting format string might be 'dd.MM.yyyy'.
 *  - For the locale 'en-US' (United States), the resulting format string might be 'MM/dd/yyyy'.
 *
 * The function preserves locale-specific separators (e.g., '.', '/', '-') and correctly orders
 * the date components (day, month, year) according to the locale's formatting conventions.
 *
 * @param {string} locale - The locale for which to generate the date format string (e.g., 'en-US', 'de').
 * @returns {string} The date format string in the format 'dd.MM.yyyy', 'MM/dd/yyyy', etc., based on the locale.
 */
export function getDateFormatString(locale: string): string {
  return buildFormatString(locale, {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
}

/**
 * Generates a month-year format string for a given locale.
 *
 * Example:
 *  - For the locale 'de' (German), the resulting format string might be 'MM.yyyy'.
 *  - For the locale 'en-US' (United States), the resulting format string might be 'MM/yyyy'.
 *
 * @param {string} locale - The locale for which to generate the month-year format string (e.g., 'en-US', 'de').
 * @returns {string} The month-year format string in the format 'MM.yyyy', 'MM/yyyy', etc., based on the locale.
 */
export function getMonthYearFormatString(locale: string): string {
  return buildFormatString(locale, { month: '2-digit', year: 'numeric' });
}

/**
 * Converts a given moment-base date to a native JavaScript Date object.
 *
 * @param date - potentially a moment object
 * @returns {date} - a native JavaScript Date object
 */
export function toNativeDate(date: any): Date {
  return isMoment(date) ? date.toDate() : date;
}

/**
 * Helper function to generate a format string based on the given options and locale.
 *
 * @param {string} locale - The locale for which to generate the format string.
 * @param {Intl.DateTimeFormatOptions} options - The formatting options specifying which date components to include.
 * @returns {string} The generated format string (e.g., 'dd.MM.yyyy', 'MM/yyyy', etc.).
 */
function buildFormatString(
  locale: string,
  options: Intl.DateTimeFormatOptions
): string {
  const parts = new Intl.DateTimeFormat(locale, options).formatToParts(
    new Date()
  );

  return parts
    .map((part) => {
      switch (part.type) {
        case 'day': {
          return 'dd';
        }
        case 'month': {
          return 'MM';
        }
        case 'year': {
          return 'yyyy';
        }
        default: {
          // Preserves separators like '.' or '/' or '-' if present
          return part.value;
        }
      }
    })
    .join('');
}
