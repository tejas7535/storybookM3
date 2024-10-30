import { translate } from '@jsverse/transloco';
import { isMonday, previousMonday } from 'date-fns';

/**
 * Parses the date picker error reason to a localized text
 * @param reason The reason to parse
 */
export function datePickerErrorReasonToLocalizedText(
  reason: string | null
): string | null {
  switch (reason) {
    case 'invalidDate': {
      return translate('error.date.invalidFormat', {});
    }
    case 'minDate': {
      return translate('error.date.beforeMin', {});
    }
    case 'maxDate': {
      return translate('error.date.afterMax', {});
    }
    case 'emptyDate': {
      return translate('error.date.emptyDate', {});
    }
    default: {
      return reason;
    }
  }
}

/**
 * Returns the monday of the week for the given date
 * @param date The date to get the monday of the week from
 */
export function mondayOfTheWeek(date: Date | number): Date {
  const dateToUse = new Date(date);

  return isMonday(dateToUse) ? dateToUse : previousMonday(dateToUse);
}
