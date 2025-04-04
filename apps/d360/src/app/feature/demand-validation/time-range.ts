import { translate } from '@jsverse/transloco';
import {
  addDays,
  addMonths,
  differenceInCalendarDays,
  differenceInCalendarMonths,
  endOfMonth,
  startOfMonth,
} from 'date-fns';

import { SelectableValue } from '../../shared/components/inputs/autocomplete/selectable-values.utils';
import {
  DemandValidationTimeRangeUserSettings,
  DemandValidationTimeRangeUserSettingsKey,
} from '../../shared/models/user-settings.model';
import { DateRange, DateRangePeriod } from '../../shared/utils/date-range';
import { KpiDateRanges } from './model';

/**
 * Converts user-defined demand validation time range settings into KPI date ranges.
 *
 * @export
 * @param {(DemandValidationTimeRangeUserSettings | null)} [data] - The user settings for demand validation time range, which may be null or undefined.
 *                                                                - If `data.type` is `DateRangePeriod.Monthly`, the function calculates a monthly range.
 *                                                                - If `data.type` is `DateRangePeriod.Weekly`, the function calculates a weekly range
 *                                                                  and optionally a secondary monthly range if `data.optionalEndDate` is provided.
 *
 * @returns {(KpiDateRanges | undefined)} A `KpiDateRanges` object containing the calculated date ranges, or `undefined` if the input is null,
 *                                        undefined, or does not match any supported `DateRangePeriod`.
 */
export function convertToKpiDateRanges(
  data?: DemandValidationTimeRangeUserSettings | null
): KpiDateRanges | undefined {
  if (data) {
    const now = new Date();

    switch (data[DemandValidationTimeRangeUserSettingsKey.Type]) {
      case DateRangePeriod.Monthly: {
        return {
          range1: {
            from: startOfMonth(
              addMonths(
                now,
                data[DemandValidationTimeRangeUserSettingsKey.StartDate]
              )
            ),
            to: endOfMonth(
              addMonths(
                now,
                data[DemandValidationTimeRangeUserSettingsKey.EndDate]
              )
            ),
            period: DateRangePeriod.Monthly,
          },
          range2: undefined,
        };
      }

      case DateRangePeriod.Weekly: {
        return {
          range1: {
            from: addDays(
              now,
              data[DemandValidationTimeRangeUserSettingsKey.StartDate]
            ),
            to: data[DemandValidationTimeRangeUserSettingsKey.OptionalEndDate]
              ? endOfMonth(
                  addDays(
                    now,
                    data[DemandValidationTimeRangeUserSettingsKey.EndDate]
                  )
                )
              : addDays(
                  now,
                  data[DemandValidationTimeRangeUserSettingsKey.EndDate]
                ),
            period: DateRangePeriod.Weekly,
          },
          range2: data[DemandValidationTimeRangeUserSettingsKey.OptionalEndDate]
            ? {
                from: addMonths(
                  addDays(
                    now,
                    data[DemandValidationTimeRangeUserSettingsKey.EndDate]
                  ),
                  1
                ),
                to: addMonths(
                  now,
                  data[DemandValidationTimeRangeUserSettingsKey.OptionalEndDate]
                ),
                period: DateRangePeriod.Monthly,
              }
            : undefined,
        };
      }

      default: {
        return undefined;
      }
    }
  }

  return undefined;
}

/**
 * Converts two partial date ranges into a `DemandValidationTimeRangeUserSettings` object
 * or returns `null` if the required fields are missing.
 *
 * @export
 * @param {Partial<DateRange>} dateRange1 - The primary date range containing `from`, `to`, and `period`.
 *                                          The `from` and `to` fields are required for the conversion.
 * @param {(Partial<DateRange> | undefined)} dateRange2 - An optional secondary date range that may provide an additional
 *                                                        `to` date for the `OptionalEndDate` field.
 * @return {(DemandValidationTimeRangeUserSettings | null)} A `DemandValidationTimeRangeUserSettings` object containing the converted
 *                                                          time range values based on the specified period (`Weekly` or `Monthly`),
 *                                                          or `null` if the required fields in `dateRange1` are missing or the period
 *                                                          is unsupported.
 */
export function convertToTimeRange(
  dateRange1: Partial<DateRange>,
  dateRange2?: Partial<DateRange> | undefined
): DemandValidationTimeRangeUserSettings | null {
  if (!dateRange1.from || !dateRange1.to) {
    return null;
  }

  const now = new Date(Date.now());

  switch (dateRange1.period) {
    case DateRangePeriod.Weekly: {
      return {
        [DemandValidationTimeRangeUserSettingsKey.Type]: DateRangePeriod.Weekly,
        [DemandValidationTimeRangeUserSettingsKey.StartDate]:
          differenceInCalendarDays(dateRange1.from, now),
        [DemandValidationTimeRangeUserSettingsKey.EndDate]:
          differenceInCalendarDays(dateRange1.to, now),
        [DemandValidationTimeRangeUserSettingsKey.OptionalEndDate]:
          dateRange2?.to
            ? differenceInCalendarMonths(dateRange2.to, now)
            : null,
      };
    }

    case DateRangePeriod.Monthly: {
      return {
        [DemandValidationTimeRangeUserSettingsKey.Type]:
          DateRangePeriod.Monthly,
        [DemandValidationTimeRangeUserSettingsKey.StartDate]:
          differenceInCalendarMonths(dateRange1.from, now),
        [DemandValidationTimeRangeUserSettingsKey.EndDate]:
          differenceInCalendarMonths(dateRange1.to, now),
        [DemandValidationTimeRangeUserSettingsKey.OptionalEndDate]: null,
      };
    }

    default: {
      return null;
    }
  }
}

/**
 * When date range 1 ends before the start of date range 2 the missing gap need to be filled.
 * E.g. dateRange1 ends at the 20.10.2020 then the monthly dateRange2 will start at the 1.11.2020
 * -> dateRange1 needs to be shifted to the 31.10.2020 in order to have a concise interval.
 *
 * @export
 * @param {Partial<DateRange>} dateRange1
 * @param {Partial<DateRange>} [dateRange2]
 * @return {({ range1: DateRange; range2?: DateRange } | undefined)}
 */
export function fillGapBetweenRanges(
  dateRange1: Partial<DateRange>,
  dateRange2?: Partial<DateRange>
): { range1: DateRange; range2?: DateRange } | undefined {
  const { from, to, period } = dateRange1;

  if (!from || !to || !period) {
    return undefined;
  }

  const range1: DateRange = {
    from,
    to:
      period === DateRangePeriod.Weekly && dateRange2?.to ? endOfMonth(to) : to,
    period,
  };

  const isDateRange2Valid =
    dateRange2?.from && dateRange2?.to && dateRange2?.period;

  const range2: DateRange | undefined = isDateRange2Valid
    ? {
        from: dateRange2.from,
        to: dateRange2.to,
        period: dateRange2.period,
      }
    : undefined;

  return { range1, range2 };
}

export const defaultMonthlyPeriodTypeOption = {
  id: DateRangePeriod.Monthly,
  text: translate('validation_of_demand.date_picker.menu_item_month'),
};

export const defaultPeriodTypes: SelectableValue[] = [
  {
    id: DateRangePeriod.Weekly,
    text: translate('validation_of_demand.date_picker.menu_item_week'),
  },
  { ...defaultMonthlyPeriodTypeOption },
];
