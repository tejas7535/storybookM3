/*
 * used to indicate frozen zone and replenishment lead time (borders)
 * for material type SP we add 2 months, for AP&OP we add 3 months to the current date to indicate frozen zone.
 * replenishment lead time border gets calculated by adding currentRLTSchaeffler to the current date.
 * it might occur that both of the borders are at the same month, this edge case needs to be clarified.
 */
import { CellClassFunc } from 'ag-grid-enterprise';
import { addDays, addMonths, isSameMonth, isSameWeek } from 'date-fns';
import { de } from 'date-fns/locale';

import {
  ForecastInfo,
  KpiBucketType,
} from '../../../../feature/demand-validation/model';

/**
 * Generates a cell class function based on the provided parameters to apply specific styles to cells in a data grid.
 *
 * @param {KpiBucketType} periodType - The type of time period to consider for styling (e.g., 'WEEK', 'MONTH').
 * @param {string} [currentRLTSchaeffler] - Optional. Current RLT Schaeffler value as a string.
 * @param {string} [materialClassification] - Optional. Material classification type.
 * @param {ForecastInfo} [forecastInfo] - Optional. Forecast information containing transit times.
 * @returns {CellClassFunc} A cell class function to be used in a data grid for applying styles to cells based on the provided parameters.
 */
export function getCellClass(
  periodType: KpiBucketType,
  currentRLTSchaeffler?: string,
  materialClassification?: string,
  forecastInfo?: ForecastInfo
): CellClassFunc {
  return (params): string | string[] | null | undefined => {
    if (!materialClassification) {
      return null;
    }

    const classes: string[] = [];

    const monthsUntilFrozenZoneForMaterial: { [k: string]: number } = {
      SPc: 2,
      SPs: 2,
      AP: 2,
      OP: 2,
    };

    const { colId: isoDateFromHeader } = params.colDef;
    const startOfBucket = new Date(isoDateFromHeader as string);
    const today = new Date(Date.now());

    const totalTransitTime =
      (forecastInfo?.transitTimeDcRlp || 0) +
      (forecastInfo?.transitTimeSdcDc || 0);
    const frozenZone = addDays(
      addMonths(
        today,
        monthsUntilFrozenZoneForMaterial[materialClassification]
      ),
      totalTransitTime
    );
    const rltDate = Number(currentRLTSchaeffler)
      ? addDays(today, Number(currentRLTSchaeffler))
      : undefined;

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

    if (dateIsInBucket(startOfBucket, frozenZone)) {
      classes.push('error-border-right');
    }

    return classes;
  };
}
