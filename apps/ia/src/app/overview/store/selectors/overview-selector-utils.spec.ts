import { SeriesOption } from 'echarts';

import { SMOOTH_LINE_SERIES_OPTIONS } from '../../../shared/configs/line-chart.config';
import {
  FluctuationKpi,
  FluctuationRatesChartData,
  LeavingType,
  PercentageFluctuationRate,
} from '../../../shared/models';
import { Employee } from '../../../shared/models/employee.model';
import { FluctuationRate } from '../../../shared/models/fluctuation-rate.model';
import { DoughnutConfig } from '../../entries-exits/doughnut-chart/models/doughnut-config.model';
import { DoughnutSeriesConfig } from '../../entries-exits/doughnut-chart/models/doughnut-series-config.model';
import * as utils from './overview-selector-utils';

describe('OverviewSelectorUtils', () => {
  const selectedOrgUnit = 'Schaeffler_IT';
  const employees = [
    {
      employeeId: '1',
      orgUnit: 'Schaeffler_IT',
      internalExitDate: new Date(2020, 5, 1),
    },
    { employeeId: '2', orgUnit: 'Schaeffler_HR' },
    {
      employeeId: '3',
      orgUnit: 'Schaeffler_IT_1',
      reasonForLeaving: LeavingType.REMAINING,
    },
    {
      employeeId: '4',
      orgUnit: 'Schaeffler_IT_1_1',
      reasonForLeaving: LeavingType.UNFORCED,
    },
  ] as Employee[];

  describe('getExternalLeaversByOrgUnit', () => {
    test('should get external leavers by org unit', () => {
      const result = utils.getExternalLeaversByOrgUnit(
        employees,
        selectedOrgUnit
      );

      expect(result).toEqual([employees[2], employees[3]]);
    });

    test('should return empty list when no match by org unit', () => {
      const result = utils.getExternalLeaversByOrgUnit(
        employees,
        'Schaeffler_Sales'
      );

      expect(result.length).toEqual(0);
    });
  });

  describe('getUnforcedLeaversByOrgUnit', () => {
    test('should get only unforced leavers by org unit', () => {
      const result = utils.getUnforcedLeaversByOrgUnit(
        employees,
        selectedOrgUnit
      );

      expect(result).toEqual([employees[3]]);
    });
  });

  test('should return empty list when no match by org unit', () => {
    const result = utils.getUnforcedLeaversByOrgUnit(
      employees,
      'Schaeffler_Sales'
    );

    expect(result.length).toEqual(0);
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
      const date = '2020-05-15';

      const result = utils.isDateInTimeRange(timeRange, date);

      expect(result).toBeTruthy();
    });

    test('should return false when data out of range', () => {
      const date = '2021-05-15';

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
      const internalValue = 130;
      const externalValue = 150;
      const name = selectedOrgUnit;

      const result = utils.createDoughnutConfig(
        internalValue,
        externalValue,
        name
      );

      const internalLabel = 'internal';
      const externalLabel = 'external';
      expect(result).toEqual(
        new DoughnutConfig(
          name,
          [
            new DoughnutSeriesConfig(internalValue, internalLabel),
            new DoughnutSeriesConfig(externalValue, externalLabel),
          ],
          [internalLabel, externalLabel]
        )
      );
    });
  });
});
