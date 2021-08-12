import { TranslocoModule } from '@ngneat/transloco';

import { ReasonsAndCounterMeasuresState } from '..';
import { SelectedFilter, TimePeriod } from '../../../shared/models';
import {
  getComparedSelectedOrgUnit,
  getComparedSelectedTimePeriod,
  getComparedSelectedTimeRange,
  getPercentageValue,
  getReasonsChartConfig,
  getReasonsChartData,
  getReasonsData,
  getReasonsLoading,
  getReasonsTableData,
} from './reasons-and-counter-measures.selector';

jest.mock('@ngneat/transloco', () => ({
  ...jest.requireActual<TranslocoModule>('@ngneat/transloco'),
  translate: jest.fn((key) => key),
}));

describe('ReasonsAndCounterMeasures Selector', () => {
  const leaverStats = [
    {
      position: 1,
      detailedReason: 'Family',
      leavers: 10,
      percentage: 0.38,
    },
    {
      position: 2,
      detailedReason: 'Private',
      leavers: 5,
      percentage: 0.19,
    },
    {
      position: 3,
      detailedReason: 'Opportunity',
      leavers: 4,
      percentage: 0.15,
    },
    {
      position: 4,
      detailedReason: 'Leadership',
      leavers: 3,
      percentage: 0.12,
    },
    {
      position: 5,
      detailedReason: 'Team spirit',
      leavers: 2,
      percentage: 0.77,
    },
    {
      position: 6,
      detailedReason: 'Perspective',
      leavers: 1,
      percentage: 0.04,
    },
    {
      position: 7,
      detailedReason: 'Atmosphere',
      leavers: 1,
      percentage: 0.04,
    },
  ];
  const fakeState: ReasonsAndCounterMeasuresState = {
    reasonsForLeaving: {
      comparedSelectedOrgUnit: new SelectedFilter(
        'Schaeffler 1',
        'Schaeffler1'
      ),
      comparedSelectedTimePeriod: TimePeriod.YEAR,
      comparedSelectedTimeRange: '0|1',
      reasons: {
        data: leaverStats,
        loading: false,
        errorMessage: undefined,
      },
      comparedReasons: {
        data: undefined,
        loading: false,
        errorMessage: undefined,
      },
    },
  };

  describe('getComparedSelectedOrgUnit', () => {
    test('should return selected org unit', () => {
      expect(getComparedSelectedOrgUnit.projector(fakeState)).toEqual(
        fakeState.reasonsForLeaving.comparedSelectedOrgUnit.value
      );
    });
  });

  describe('getComparedSelectedTimePeriod', () => {
    test('should return selected time period', () => {
      expect(getComparedSelectedTimePeriod.projector(fakeState)).toEqual(
        fakeState.reasonsForLeaving.comparedSelectedTimePeriod
      );
    });
  });

  describe('getComparedSelectedTimeRange', () => {
    test('should return selected time range', () => {
      expect(getComparedSelectedTimeRange.projector(fakeState)).toEqual(
        fakeState.reasonsForLeaving.comparedSelectedTimeRange
      );
    });
  });

  describe('getReasonsData', () => {
    test('should return data for reasons', () => {
      expect(getReasonsData.projector(fakeState)).toEqual(
        fakeState.reasonsForLeaving.reasons.data
      );
    });
  });

  describe('getReasonsLoading', () => {
    test('should return loading status of reasons data', () => {
      expect(getReasonsLoading.projector(fakeState)).toEqual(
        fakeState.reasonsForLeaving.reasons.loading
      );
    });
  });

  describe('getReasonsTableData', () => {
    test('should return data for table', () => {
      const expectedResult = [
        {
          detailedReason: 'Family',
          leavers: 10,
          percentage: 38.5,
          position: 1,
        },
        {
          detailedReason: 'Private',
          leavers: 5,
          percentage: 19.2,
          position: 2,
        },
        {
          detailedReason: 'Opportunity',
          leavers: 4,
          percentage: 15.4,
          position: 3,
        },
        {
          detailedReason: 'Leadership',
          leavers: 3,
          percentage: 11.5,
          position: 4,
        },
        {
          detailedReason: 'Team spirit',
          leavers: 2,
          percentage: 7.7,
          position: 5,
        },
        {
          detailedReason: 'Perspective',
          leavers: 1,
          percentage: 3.8,
          position: 6,
        },
        {
          detailedReason: 'Atmosphere',
          leavers: 1,
          percentage: 3.8,
          position: 6,
        },
      ];

      expect(getReasonsTableData.projector(leaverStats)).toEqual(
        expectedResult
      );
    });
  });

  describe('getPercentageValue', () => {
    test('should get percentage value', () => {
      const part = 2;
      const total = 11;

      const result = getPercentageValue(part, total);

      expect(result).toEqual(18.2);
    });

    test('should not add decimal numbers for integer', () => {
      const part = 1;
      const total = 1;

      const result = getPercentageValue(part, total);

      expect(result).toEqual(100);
    });

    test('should return 0 when total 0', () => {
      const part = 1;
      const total = 0;

      const result = getPercentageValue(part, total);

      expect(result).toEqual(0);
    });

    test('should return 0 when part 0', () => {
      const part = 0;
      const total = 1;

      const result = getPercentageValue(part, total);

      expect(result).toEqual(0);
    });
  });

  describe('getReasonsChartData', () => {
    test('should get data for chart', () => {
      const expectedResult = [
        { name: 'Family', value: 10 },
        { name: 'Private', value: 5 },
        { name: 'Opportunity', value: 4 },
        { name: 'Leadership', value: 3 },
        { name: 'Team spirit', value: 2 },
        {
          name: 'reasonsAndCounterMeasures.topFiveReasons.chart.others',
          value: 2,
        },
      ];
      expect(getReasonsChartData.projector(leaverStats)).toEqual(
        expectedResult
      );
    });

    test('should get undefined as data for chart when data not ready', () => {
      expect(getReasonsChartData.projector(undefined as any)).toBeDefined();
    });

    test('should get empty array as data for chart when no data', () => {
      expect(getReasonsChartData.projector([])).toEqual([]);
    });
  });

  describe('getReasonsChartConfig', () => {
    test('should return config for reasons chart', () => {
      const beutifiedTimeRange = '21.01.2020 - 21.01.2021';

      expect(
        getReasonsChartConfig.projector(
          fakeState.reasonsForLeaving.reasons.data,
          beutifiedTimeRange
        )
      ).toEqual({
        title: beutifiedTimeRange,
        subTitle: 'reasonsAndCounterMeasures.topFiveReasons.title',
      });
    });

    test('should return no data sub title when no data', () => {
      const beutifiedTimeRange = '21.01.2020 - 21.01.2021';

      expect(getReasonsChartConfig.projector([], beutifiedTimeRange)).toEqual({
        title: beutifiedTimeRange,
        subTitle: 'reasonsAndCounterMeasures.topFiveReasons.chart.noData',
      });
    });
  });
});
