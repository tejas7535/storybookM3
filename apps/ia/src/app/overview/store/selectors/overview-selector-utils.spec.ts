import { SeriesOption } from 'echarts';

import { SMOOTH_LINE_SERIES_OPTIONS } from '../../../shared/charts/line-chart/line-chart.config';
import {
  DoughnutConfig,
  DoughnutSeriesConfig,
} from '../../../shared/charts/models';
import { ActionType, Color, Employee } from '../../../shared/models';
import {
  FluctuationKpi,
  FluctuationRate,
  FluctuationRatesChartData,
  LeavingType,
  PercentageFluctuationRate,
} from '../../models';
import * as utils from './overview-selector-utils';

describe('OverviewSelectorUtils', () => {
  const selectedOrgUnit = 'Schaeffler_IT';
  const employees = [
    {
      employeeId: '1',
      orgUnit: 'Schaeffler_IT',
      actions: [
        {
          exitDate: new Date(2020, 5, 1).valueOf().toString(),
          actionType: ActionType.INTERNAL,
        },
      ],
    },
    { employeeId: '2', orgUnit: 'Schaeffler_HR' },
    {
      employeeId: '3',
      orgUnit: 'Schaeffler_IT_1',
      reasonForLeaving: LeavingType.REMAINING,
      exitDate: '123',
    },
    {
      employeeId: '4',
      orgUnit: 'Schaeffler_IT_1_1',
      reasonForLeaving: LeavingType.UNFORCED,
      exitDate: '123',
    },
  ] as Employee[];

  describe('getExternalLeavers', () => {
    test('should get external leavers', () => {
      const result = utils.getExternalLeavers(employees);

      expect(result).toEqual([employees[2], employees[3]]);
    });
  });

  describe('getUnforcedLeavers', () => {
    test('should get only unforced leavers', () => {
      const result = utils.getUnforcedLeavers(employees);

      expect(result).toEqual([employees[3]]);
    });
  });

  describe('createFluctuationKpi', () => {
    const companyKpi = 0.045;
    const orgUnitKpi = 0.095;
    test('should create fluctuation kpi', () => {
      const fluctuationRates = new PercentageFluctuationRate('4.5%', '9.5%');
      const expectedResult = new FluctuationKpi(
        fluctuationRates,
        selectedOrgUnit,
        employees
      );

      const result = utils.createFluctuationKpi(
        companyKpi,
        orgUnitKpi,
        selectedOrgUnit,
        employees
      );

      expect(result).toEqual(expectedResult);
    });
  });

  describe('isDateInTimeRange', () => {
    const timeRange = '1577863715000|1609399715000'; // 01.01.2020 - 31.12.2020

    test('should return true when data in range', () => {
      const date = new Date(2020, 5, 5).valueOf().toString();

      const result = utils.isDateInTimeRange(timeRange, date);

      expect(result).toBeTruthy();
    });

    test('should return false when data out of range', () => {
      const date = new Date(2021, 5, 15).valueOf().toString();

      const result = utils.isDateInTimeRange(timeRange, date);

      expect(result).toBeFalsy();
    });
  });

  describe('getPercentageValue', () => {
    test('should return value multiplied by 100', () => {
      const value = 0.04;

      const result = utils.getPercentageValue(value);

      expect(result).toEqual(4);
    });

    test('should return value multiplied by 100 with 2 positions after comma', () => {
      const value = 0.041_818_156;

      const result = utils.getPercentageValue(value);

      expect(result).toEqual(4.18);
    });
  });

  describe('getPercentageValueSigned', () => {
    test('should return value multiplied by 100 with percentage sign', () => {
      const value = 0.043_21;

      const result = utils.getPercentageValueSigned(value);

      expect(result).toEqual('4.32%');
    });
  });

  describe('createFluctuationRateChartConfig', () => {
    test('should create chart config', () => {
      const data = [
        { company: 0.342, orgUnit: 0.012 },
        { company: 0.431, orgUnit: 0.001 },
      ] as FluctuationRate[];
      const rates = {
        companyName: 'Schaeffler',
        orgUnitName: selectedOrgUnit,
        fluctuationRates: data,
      } as FluctuationRatesChartData;

      const result = utils.createFluctuationRateChartConfig(rates);

      const series = result.series as SeriesOption[];
      expect(series.length).toEqual(2);
      expect(series).toEqual([
        {
          ...SMOOTH_LINE_SERIES_OPTIONS,
          name: rates.companyName,
          data: [
            rates.fluctuationRates[0].company * 100,
            rates.fluctuationRates[1].company * 100,
          ],
        },
        {
          ...SMOOTH_LINE_SERIES_OPTIONS,
          name: rates.orgUnitName,
          data: [
            rates.fluctuationRates[0].orgUnit * 100,
            rates.fluctuationRates[1].orgUnit * 100,
          ],
        },
      ]);
    });
  });

  describe('createDoughnutConfig', () => {
    test('should create doughnut config', () => {
      const internals = [{} as Employee];
      const externals = [{} as Employee, {} as Employee];
      const name = selectedOrgUnit;

      const result = utils.createDoughnutConfig(internals, externals, name);

      const internalLabel = 'internal';
      const externalLabel = 'external';
      expect(result).toEqual(
        new DoughnutConfig(name, [
          new DoughnutSeriesConfig(
            [{ value: internals.length }],
            internalLabel,
            Color.LIME
          ),
          new DoughnutSeriesConfig(
            [{ value: externals.length }],
            externalLabel,
            Color.LIGHT_BLUE
          ),
        ])
      );
    });
  });
});
