/*
 * used to indicate frozen zone and replenishment lead time (borders)
 * for material type SP we add 2 months, for AP&OP we add 3 months to the current date to indicate frozen zone.
 * replenishment lead time border gets calculated by adding currentRLTSchaeffler to the current date.
 * it might occur that both of the borders are at the same month, this edge case needs to be clarified.
 */
import { CellStyle, CellStyleFunc } from 'ag-grid-community';
import { addDays, addMonths, isSameMonth, isSameWeek } from 'date-fns';
import { de } from 'date-fns/locale';

import {
  ForecastInfo,
  KpiBucketType,
} from '../../../../feature/demand-validation/model';
import {
  errorColor,
  schaefflerColor,
  warningColor,
} from '../../../../shared/styles/colors';

export const getCellStyleFunc =
  (
    periodType: KpiBucketType,
    currentRLTSchaeffler?: string,
    materialClassification?: string,
    forecastInfo?: ForecastInfo
  ): CellStyleFunc =>
  (params): CellStyle => {
    if (!materialClassification) {
      return {};
    }

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
      return {
        borderLeft: `1px dashed ${schaefflerColor}`,
      };
    }
    if (rltDate && dateIsInBucket(startOfBucket, rltDate)) {
      return {
        borderRight: `1px dashed ${warningColor}`,
      };
    }
    if (dateIsInBucket(startOfBucket, frozenZone)) {
      return {
        borderRight: `1px dashed ${errorColor}`,
      };
    }

    return {};
  };
