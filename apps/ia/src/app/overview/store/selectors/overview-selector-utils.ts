import { EChartsOption, SeriesOption } from 'echarts';
import moment from 'moment';

import { SMOOTH_LINE_SERIES_OPTIONS } from '../../../shared/charts/line-chart/line-chart.config';
import {
  DoughnutConfig,
  DoughnutSeriesConfig,
} from '../../../shared/charts/models';
import { Color, Employee } from '../../../shared/models';
import {
  FluctuationKpi,
  FluctuationRate,
  FluctuationRatesChartData,
  LeavingType,
  PercentageFluctuationRate,
} from '../../models';

export function getExternalLeavers(employees: Employee[]): Employee[] {
  return employees.filter((employee) => employee.exitDate);
}

export function getUnforcedLeavers(employees: Employee[]): Employee[] {
  return getExternalLeavers(employees).filter(
    (employee) => employee.reasonForLeaving === LeavingType.UNFORCED
  );
}

export function createFluctuationKpi(
  company: number,
  orgUnit: number,
  orgUnitName: string,
  employees: Employee[]
) {
  const companyPercentageRate = getPercentageValueSigned(company);
  const orgUnitPercentageValue = getPercentageValueSigned(orgUnit);
  const fluctuationRates = new PercentageFluctuationRate(
    companyPercentageRate,
    orgUnitPercentageValue
  );

  return new FluctuationKpi(fluctuationRates, orgUnitName, employees);
}

export function isDateInTimeRange(
  timeRange: string,
  dateToTest: string
): boolean {
  if (!dateToTest || !timeRange) {
    return false;
  }
  const dateToTestP = moment(+dateToTest);
  const timeRangeArr = timeRange.split('|');
  const timeRangeStart = moment.unix(+timeRangeArr[0]);
  const timeRangeEnd = moment.unix(+timeRangeArr[1]);

  return (
    dateToTestP.isSameOrAfter(timeRangeStart) &&
    dateToTestP.isSameOrBefore(timeRangeEnd)
  );
}

export function getPercentageValue(rate: number): number {
  return Number((rate * 100).toFixed(2));
}

export function getPercentageValueSigned(value: number): string {
  return `${Number(getPercentageValue(value))}%`;
}

export function createFluctuationRateChartConfig(
  ratesChartData: FluctuationRatesChartData
): EChartsOption {
  const name1 = ratesChartData.companyName;
  const name2 = ratesChartData.orgUnitName;
  const data1 = ratesChartData.fluctuationRates.map((rate: FluctuationRate) =>
    getPercentageValue(rate.company)
  );
  const data2 = ratesChartData.fluctuationRates.map((rate: FluctuationRate) =>
    getPercentageValue(rate.orgUnit)
  );

  return {
    series: [
      {
        ...SMOOTH_LINE_SERIES_OPTIONS,
        name: name1,
        data: data1,
      } as SeriesOption,
      {
        ...SMOOTH_LINE_SERIES_OPTIONS,
        name: name2,
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
  internal: Employee[],
  external: Employee[],
  name: string
) {
  const labelInternal = 'internal';
  const labelExternal = 'external';

  return internal && external
    ? new DoughnutConfig(name, [
        new DoughnutSeriesConfig(
          [{ value: internal.length }],
          labelInternal,
          Color.LIME
        ),
        new DoughnutSeriesConfig(
          [{ value: external.length }],
          labelExternal,
          Color.LIGHT_BLUE
        ),
      ])
    : undefined;
}
