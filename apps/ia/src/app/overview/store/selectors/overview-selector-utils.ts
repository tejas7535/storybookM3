import { EChartsOption, SeriesOption } from 'echarts';
import moment from 'moment';

import { SMOOTH_LINE_SERIES_OPTIONS } from '../../../shared/charts/line-chart/line-chart.config';
import {
  DoughnutConfig,
  DoughnutSeriesConfig,
} from '../../../shared/charts/models';
import { COMPANY_NAME } from '../../../shared/constants';
import { Color } from '../../../shared/models';
import {
  FluctuationKpi,
  FluctuationRate,
  PercentageFluctuationRate,
} from '../../models';

export function createFluctuationKpi(
  company: number,
  orgUnit: number,
  orgUnitName: string,
  realEmployeesCount: number
) {
  const companyPercentageRate = getPercentageValueSigned(company);
  const orgUnitPercentageValue = getPercentageValueSigned(orgUnit);
  const fluctuationRates = new PercentageFluctuationRate(
    companyPercentageRate,
    orgUnitPercentageValue
  );

  return new FluctuationKpi(fluctuationRates, orgUnitName, realEmployeesCount);
}

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

export function getPercentageValue(rate: number): number {
  return Math.round(rate * 1000) / 10;
}

export function getPercentageValueSigned(value: number): string {
  return `${Number(getPercentageValue(value))}%`;
}

export function createFluctuationRateChartConfig(
  orgUnit: string,
  ratesChartData: FluctuationRate[]
): EChartsOption {
  const data1 = ratesChartData.map((rate: FluctuationRate) =>
    getPercentageValue(rate.global)
  );
  const data2 = ratesChartData.map((rate: FluctuationRate) =>
    getPercentageValue(rate.dimension)
  );

  return {
    series: [
      {
        ...SMOOTH_LINE_SERIES_OPTIONS,
        name: COMPANY_NAME,
        data: data1,
      } as SeriesOption,
      {
        ...SMOOTH_LINE_SERIES_OPTIONS,
        name: orgUnit,
        data: data2,
      } as SeriesOption,
    ],
    yAxis: {
      axisLabel: {
        formatter: '{value}%',
      },
    },
    tooltip: {
      trigger: 'item',
      axisPointer: {
        type: 'cross',
      },
      formatter: (param: any) => `${param.data}%`,
    },
    displayMode: 'multipleByCoordSys',
    grid: {
      left: 50,
    },
  };
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
