import moment from 'moment';

import {
  DoughnutConfig,
  DoughnutSeriesConfig,
} from '../../../shared/charts/models';
import { Color } from '../../../shared/models';

export function isDateInTimeRange(
  timeRange: string,
  dateToTest: string
): boolean {
  if (!dateToTest || !timeRange) {
    return false;
  }
  const dateToTestP = moment.utc(+dateToTest);
  const timeRangeArr = timeRange.split('|');
  const timeRangeStart = moment.unix(+timeRangeArr[0]).utc();
  const timeRangeEnd = moment.unix(+timeRangeArr[1]).utc();

  return (
    dateToTestP.isSameOrAfter(timeRangeStart) &&
    dateToTestP.isSameOrBefore(timeRangeEnd)
  );
}

export function createDoughnutConfig(
  internalCount: number,
  externalCount: number,
  name: string
) {
  const labelInternal = 'internal';
  const labelExternal = 'external';

  return internalCount !== undefined && externalCount !== undefined
    ? new DoughnutConfig(name, [
        new DoughnutSeriesConfig(
          [{ value: internalCount }],
          labelInternal,
          Color.LIME
        ),
        new DoughnutSeriesConfig(
          [{ value: externalCount }],
          labelExternal,
          Color.LIGHT_BLUE
        ),
      ])
    : undefined;
}
