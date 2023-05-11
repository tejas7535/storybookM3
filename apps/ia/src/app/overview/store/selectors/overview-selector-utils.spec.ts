import { SeriesOption } from 'echarts';
import moment from 'moment';

import { SMOOTH_LINE_SERIES_OPTIONS } from '../../../shared/charts/line-chart/line-chart.config';
import {
  DoughnutConfig,
  DoughnutSeriesConfig,
} from '../../../shared/charts/models';
import { Color } from '../../../shared/models';
import {
  FluctuationKpi,
  FluctuationRate,
  FluctuationRatesChartData,
  PercentageFluctuationRate,
} from '../../models';
import * as utils from './overview-selector-utils';

describe('OverviewSelectorUtils', () => {
  const selectedOrgUnit = 'Schaeffler_IT';

  describe('createFluctuationKpi', () => {
    const companyKpi = 0.045;
    const orgUnitKpi = 0.095;
    test('should create fluctuation kpi', () => {
      const fluctuationRates = new PercentageFluctuationRate('4.5%', '9.5%');
      const expectedResult = new FluctuationKpi(
        fluctuationRates,
        selectedOrgUnit,
        5
      );

      const result = utils.createFluctuationKpi(
        companyKpi,
        orgUnitKpi,
        selectedOrgUnit,
        5
      );

      expect(result).toEqual(expectedResult);
    });
  });

  describe('isDateInTimeRange', () => {
    const timeRange = '1577863715|1609399715'; // 01.01.2020 - 31.12.2020

    test('should return true when data in range', () => {
      const date = moment({ year: 2020, month: 5, date: 5 })
        .valueOf()
        .toString();

      const result = utils.isDateInTimeRange(timeRange, date);

      expect(result).toBeTruthy();
    });

    test('should return false when data out of range', () => {
      const date = moment({
        year: 2021,
        month: 5,
        date: 15,
      })
        .valueOf()
        .toString();

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

      expect(result).toEqual(4.2);
    });
  });

  describe('getPercentageValueSigned', () => {
    test('should return value multiplied by 100 with percentage sign', () => {
      const value = 0.043_21;

      const result = utils.getPercentageValueSigned(value);

      expect(result).toEqual('4.3%');
    });

    test('should return undefined when parameter undefined', () => {
      const result = utils.getPercentageValueSigned(undefined as number);

      expect(result).toBeUndefined();
    });
  });

  describe('createFluctuationRateChartConfig', () => {
    test('should create chart config', () => {
      const data = [
        { global: 0.342, dimension: 0.012 },
        { global: 0.431, dimension: 0.001 },
      ] as FluctuationRate[];
      const rates = {
        fluctuationRates: data,
      } as FluctuationRatesChartData;

      const result = utils.createFluctuationRateChartConfig(
        selectedOrgUnit,
        data
      );

      const series = result.series as SeriesOption[];
      expect(series.length).toEqual(2);
      expect(series).toEqual([
        {
          ...SMOOTH_LINE_SERIES_OPTIONS,
          name: 'Schaeffler',
          data: [
            rates.fluctuationRates[0].global * 100,
            rates.fluctuationRates[1].global * 100,
          ],
        },
        {
          ...SMOOTH_LINE_SERIES_OPTIONS,
          name: selectedOrgUnit,
          data: [
            rates.fluctuationRates[0].dimension * 100,
            rates.fluctuationRates[1].dimension * 100,
          ],
        },
      ]);
    });
  });

  describe('createDoughnutConfig', () => {
    test('should create doughnut config', () => {
      const name = selectedOrgUnit;

      const result = utils.createDoughnutConfig(1, 2, name);

      const internalLabel = 'internal';
      const externalLabel = 'external';
      expect(result).toEqual(
        new DoughnutConfig(name, [
          new DoughnutSeriesConfig([{ value: 1 }], internalLabel, Color.LIME),
          new DoughnutSeriesConfig(
            [{ value: 2 }],
            externalLabel,
            Color.LIGHT_BLUE
          ),
        ])
      );
    });
  });
});
