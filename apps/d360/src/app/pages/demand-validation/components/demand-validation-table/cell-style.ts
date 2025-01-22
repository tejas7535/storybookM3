/*
 * used to indicate frozen zone and replenishment lead time (borders)
 * for material type SP we add 2 months, for AP&OP we add 3 months to the current date to indicate frozen zone.
 * replenishment lead time border gets calculated by adding currentRLTSchaeffler to the current date.
 * it might occur that both of the borders are at the same month, this edge case needs to be clarified.
 */
import { CellClassFunc } from 'ag-grid-enterprise';
import { isSameMonth, isSameWeek } from 'date-fns';
import { de } from 'date-fns/locale';

import { KpiBucketType } from '../../../../feature/demand-validation/model';

/**
 * Generates a cell class function based on the provided parameters to apply specific styles to cells in a data grid.
 *
 * @param {KpiBucketType} periodType - The type of time period to consider for styling (e.g., 'WEEK', 'MONTH').
 * @param {string} [rltDateString] - Optional. Current RLT Schaeffler value as a string.
 * @param {string} [frozenZoneDateString] - Optional. Current Frozen Zone Date as a string.
 * @param {string} [materialClassification] - Optional. Material classification type.
 * @returns {CellClassFunc} A cell class function to be used in a data grid for applying styles to cells based on the provided parameters.
 */
export function getCellClass(
  periodType: KpiBucketType,
  rltDateString?: string,
  frozenZoneDateString?: string
): CellClassFunc {
  return (params): string | string[] | null | undefined => {
    const classes: string[] = [];

    const { colId: isoDateFromHeader } = params.colDef;
    const startOfBucket = new Date(isoDateFromHeader as string);
    const today = new Date(Date.now());

    const frozenZoneDate = frozenZoneDateString
      ? new Date(frozenZoneDateString)
      : today;
    const rltDate = rltDateString ? new Date(rltDateString) : today;

    let dateIsInBucket;
    switch (periodType) {
      case 'WEEK': {
        dateIsInBucket = (date1: Date, date2: Date): boolean =>
          isSameWeek(date1, date2, { locale: de });
        break;
      }

      case 'MONTH': {
        dateIsInBucket = isSameMonth;
        break;
      }

      case 'PARTIAL_WEEK': {
        dateIsInBucket = (date1: Date, date2: Date): boolean =>
          isSameWeek(date1, date2, { locale: de }) && isSameMonth(date1, date2);
        break;
      }

      default: {
        // handle as month
        dateIsInBucket = isSameMonth;
      }
    }

    if (dateIsInBucket(startOfBucket, today)) {
      classes.push('schaeffler-border-left');
    }

    if (rltDate && dateIsInBucket(startOfBucket, rltDate)) {
      classes.push('warning-border-right');
    }

    if (dateIsInBucket(startOfBucket, frozenZoneDate)) {
      classes.push('error-border-right');
    }

    return classes;
  };
}
