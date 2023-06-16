import { translate, TranslocoModule } from '@ngneat/transloco';

import { FilterData } from '../../../core/store/reducers/filter/filter.reducer';
import { DoughnutChartData } from '../../../shared/charts/models';
import { ChartLegendItem } from '../../../shared/charts/models/chart-legend-item.model';
import {
  Filter,
  FilterDimension,
  FilterKey,
  IdValue,
  SelectedFilter,
  TimePeriod,
} from '../../../shared/models';
import { ReasonsAndCounterMeasuresState } from '..';
import {
  getComparedOrgUnitsFilter,
  getComparedReasonsChartConfig,
  getComparedReasonsChartData,
  getComparedReasonsData,
  getComparedReasonsLoading,
  getComparedReasonsTableData,
  getComparedSelectedDimension,
  getComparedSelectedDimensionFilter,
  getComparedSelectedDimensionIdValue,
  getComparedSelectedOrgUnitLoading,
  getComparedSelectedTimePeriod,
  getComparedSelectedTimeRange,
  getCurrentComparedFilters,
  getPercentageValue,
  getReasonsChartConfig,
  getReasonsChartData,
  getReasonsCombinedLegend,
  getReasonsData,
  getReasonsLoading,
  getReasonsTableData,
} from './reasons-and-counter-measures.selector';
import * as utils from './reasons-and-counter-measures.selector.utils';

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
      comparedSelectedDimension: FilterDimension.ORG_UNIT,
      data: {
        [FilterDimension.ORG_UNIT]: {
          loading: true,
          items: [new IdValue('Schaeffler_IT_1', 'Schaeffler_IT_1')],
          errorMessage: '',
        },
      } as Record<FilterDimension, FilterData>,
      comparedSelectedFilters: {
        ids: [FilterDimension.ORG_UNIT, FilterKey.TIME_RANGE],
        entities: {
          [FilterDimension.ORG_UNIT]: {
            name: FilterDimension.ORG_UNIT,
            idValue: {
              id: 'Schaeffler_IT_1',
              value: 'Schaeffler_IT_1',
            },
          },
          [FilterKey.TIME_RANGE]: {
            name: FilterKey.TIME_RANGE,
            idValue: {
              id: '1577863715000|1609399715000',
              value: '1/1/2020 - 12/31/2020',
            },
          },
        },
      },
      comparedSelectedTimePeriod: TimePeriod.YEAR,
      reasons: {
        data: leaverStats,
        loading: false,
        errorMessage: undefined,
      },
      comparedReasons: {
        data: leaverStats,
        loading: false,
        errorMessage: undefined,
      },
    },
  };
  const tooltipFormatter = '{b}<br><b>{c}</b> employees - <b>{d}%</b>';

  describe('getComparedSelectedTimePeriod', () => {
    test('should return selected time period', () => {
      expect(getComparedSelectedTimePeriod.projector(fakeState)).toEqual(
        fakeState.reasonsForLeaving.comparedSelectedTimePeriod
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

  describe('getReasonsLoading', () => {
    test('should return loading status of reasons data', () => {
      expect(getReasonsLoading.projector(fakeState)).toEqual(
        fakeState.reasonsForLeaving.reasons.loading
      );
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
    beforeAll(() => {
      (utils.getTooltipFormatter as any) = jest.fn(() => tooltipFormatter);
      (utils.getColorsForChart as any) = jest.fn(() => []);
    });

    test('should return config for reasons chart', () => {
      const beautifiedTimeRange = {
        id: '123321',
        value: '21.01.2020 - 21.01.2021',
      };

      expect(
        getReasonsChartConfig.projector(
          fakeState.reasonsForLeaving.reasons.data,
          beautifiedTimeRange,
          TimePeriod.YEAR,
          []
        )
      ).toEqual({
        title: beautifiedTimeRange.value,
        subTitle: undefined,
        tooltipFormatter,
        color: [],
      });
    });

    test('should return config with last 12 months title when selected', () => {
      const beautifiedTimeRange = {
        id: '123321',
        value: '21.01.2020 - 21.01.2021',
      };

      expect(
        getReasonsChartConfig.projector(
          fakeState.reasonsForLeaving.reasons.data,
          beautifiedTimeRange,
          TimePeriod.LAST_12_MONTHS,
          []
        )
      ).toEqual({
        title: translate(`filters.periodOfTime.${TimePeriod.LAST_12_MONTHS}`),
        subTitle: undefined,
        tooltipFormatter,
        color: [],
      });
    });

    test('should return no data sub title when no data', () => {
      const beautifiedTimeRange = {
        id: '123321',
        value: '21.01.2020 - 21.01.2021',
      };

      expect(
        getReasonsChartConfig.projector(
          [],
          beautifiedTimeRange,
          TimePeriod.YEAR,
          []
        )
      ).toEqual({
        title: beautifiedTimeRange.value,
        subTitle: 'reasonsAndCounterMeasures.topFiveReasons.chart.noData',
        tooltipFormatter,
        color: [],
      });
    });
  });

  describe('getComparedOrgUnitsFilter', () => {
    test('should return compared organization units filter', () => {
      expect(
        getComparedOrgUnitsFilter.projector(fakeState).options.length
      ).toEqual(1);
    });
  });

  describe('getComparedSelectedTimeRange', () => {
    test('should return compared selected time range', () => {
      expect(
        getComparedSelectedTimeRange.projector(
          Object.values(
            fakeState.reasonsForLeaving.comparedSelectedFilters.entities
          )
        )
      ).toEqual({
        id: '1577863715000|1609399715000',
        value: '1/1/2020 - 12/31/2020',
      });
    });
  });

  describe('getComparedSelectedDimension', () => {
    test('should return compared selected dimension', () => {
      expect(getComparedSelectedDimension.projector(fakeState)).toEqual(
        FilterDimension.ORG_UNIT
      );
    });
  });

  describe('getComparedSelectedOrgUnitLoading', () => {
    test('should return compared org unit loading status', () => {
      expect(
        getComparedSelectedOrgUnitLoading.projector(
          fakeState,
          FilterDimension.ORG_UNIT
        )
      ).toBeTruthy();
    });
  });

  describe('getCurrentComparedFilters', () => {
    test('should return currently compared selected filters and time range', () => {
      expect(
        getCurrentComparedFilters.projector(
          Object.values(
            fakeState.reasonsForLeaving.comparedSelectedFilters.entities
          )
        )
      ).toEqual({
        ORG_UNIT: 'Schaeffler_IT_1',
        timeRange: '1577863715000|1609399715000',
      });
    });
  });

  describe('getComparedReasonsData', () => {
    test('should return compared reason data', () => {
      expect(getComparedReasonsData.projector(fakeState)).toEqual(
        fakeState.reasonsForLeaving.comparedReasons.data
      );
    });
  });

  describe('getComparedReasonsTableData', () => {
    test('should return compared reason data', () => {
      const expectedResult = utils.mapReasonsToTableData(
        fakeState.reasonsForLeaving.comparedReasons.data
      );
      expect(
        getComparedReasonsTableData.projector(
          fakeState.reasonsForLeaving.comparedReasons.data
        )
      ).toEqual(expectedResult);
    });
  });

  describe('getComparedReasonsLoading', () => {
    test('should return loading status of reasons data', () => {
      expect(getComparedReasonsLoading.projector(fakeState)).toEqual(
        fakeState.reasonsForLeaving.comparedReasons.loading
      );
    });
  });

  describe('getComparedReasonsChartData', () => {
    test('should return top 5 reasons if reasons set', () => {
      (utils.getTop5ReasonsForChart as any) = jest.fn(() => []);
      expect(
        getComparedReasonsChartData.projector(
          fakeState.reasonsForLeaving.comparedReasons.data
        )
      ).toEqual([]);
      expect(utils.getTop5ReasonsForChart).toHaveBeenCalledWith(leaverStats);
    });

    test('should return undefined if reasons not set', () => {
      (utils.getTop5ReasonsForChart as any) = jest.fn(() => []);
      expect(
        getComparedReasonsChartData.projector(undefined as any)
      ).toBeUndefined();
      expect(utils.getTop5ReasonsForChart).not.toHaveBeenCalled();
    });
  });

  describe('getComparedReasonsChartConfig', () => {
    beforeAll(() => {
      (utils.getTooltipFormatter as any) = jest.fn(() => tooltipFormatter);
      (utils.getColorsForChart as any) = jest.fn(() => []);
    });

    test('should return config for reasons chart', () => {
      const beautifiedTimeRange = {
        id: '21.01.2020 - 21.01.2021',
        value: '21.01.2020 - 21.01.2021',
      };

      expect(
        getComparedReasonsChartConfig.projector(
          fakeState.reasonsForLeaving.comparedReasons.data,
          beautifiedTimeRange,
          TimePeriod.YEAR,
          [],
          []
        )
      ).toEqual({
        title: beautifiedTimeRange.value,
        subTitle: undefined,
        tooltipFormatter,
        color: [],
      });
    });

    test('should return config with last 12 months title when selected', () => {
      const beautifiedTimeRange = {
        id: '21.01.2020 - 21.01.2021',
        value: '21.01.2020 - 21.01.2021',
      };

      expect(
        getComparedReasonsChartConfig.projector(
          fakeState.reasonsForLeaving.comparedReasons.data,
          beautifiedTimeRange,
          TimePeriod.LAST_12_MONTHS,
          [],
          []
        )
      ).toEqual({
        title: translate(`filters.periodOfTime.${TimePeriod.LAST_12_MONTHS}`),
        subTitle: undefined,
        tooltipFormatter,
        color: [],
      });
    });

    test('should return no data sub title when no data', () => {
      const beautifiedTimeRange = {
        id: '21.01.2020 - 21.01.2021',
        value: '21.01.2020 - 21.01.2021',
      };

      expect(
        getComparedReasonsChartConfig.projector(
          [],
          beautifiedTimeRange,
          TimePeriod.YEAR,
          [],
          []
        )
      ).toEqual({
        title: beautifiedTimeRange.value,
        subTitle: 'reasonsAndCounterMeasures.topFiveReasons.chart.noData',
        tooltipFormatter,
        color: [],
      });
    });
  });

  describe('getReasonsCombinedLegend', () => {
    beforeAll(() => {
      (utils.getTooltipFormatter as any) = jest.fn(() => tooltipFormatter);
      (utils.getColorsForChart as any) = jest.fn((data, comparedData) =>
        data && comparedData
          ? ['red', 'blue', 'green', 'yellow', 'orange']
          : ['yellow', 'orange']
      );
    });

    test('should return legend when compared data undefined', () => {
      const data: DoughnutChartData[] = [
        new DoughnutChartData(0, 'January'),
        new DoughnutChartData(1, 'February'),
      ];
      const expectedLegend = [
        new ChartLegendItem(data[0].name, 'yellow', undefined, true),
        new ChartLegendItem(data[1].name, 'orange', undefined, true),
      ];

      const result = getReasonsCombinedLegend.projector(
        data,
        undefined as DoughnutChartData[]
      );

      expect(result).toEqual(expectedLegend);
    });

    test('should return combined legend when compared data defined', () => {
      const data: DoughnutChartData[] = [
        new DoughnutChartData(0, 'January'),
        new DoughnutChartData(1, 'February'),
      ];
      const comparedData: DoughnutChartData[] = [
        new DoughnutChartData(0, 'January'),
        new DoughnutChartData(2, 'March'),
        new DoughnutChartData(1, 'February'),
      ];
      const expectedLegend = [
        new ChartLegendItem(data[0].name, 'yellow', undefined, true),
        new ChartLegendItem(data[1].name, 'orange', undefined, true),
        new ChartLegendItem(comparedData[1].name, 'blue', undefined, true),
      ];
      const result = getReasonsCombinedLegend.projector(data, comparedData);

      expect(result).toEqual(expectedLegend);
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

  describe('getComparedSelectedDimensionIdValue', () => {
    test('should return selected dimension id value', () => {
      const selectedDimension = FilterDimension.ORG_UNIT;
      const filter = new SelectedFilter(
        selectedDimension,
        new IdValue('1', 'abc')
      );
      const selectedFilters: SelectedFilter[] = [filter];
      const result = getComparedSelectedDimensionIdValue.projector(
        selectedFilters,
        selectedDimension
      );
      expect(result).toBe(filter.idValue);
    });
  });

  describe('getComparedSelectedDimensionFilter', () => {
    test('should return selected dimension filter', () => {
      const selectedDimension = FilterDimension.ORG_UNIT;
      const items = [new IdValue('Schaeffler_IT_1', 'Schaeffler_IT_1')];
      const expected = new Filter(selectedDimension, items);
      const result = getComparedSelectedDimensionFilter.projector(
        fakeState,
        selectedDimension
      );

      expect(result).toEqual(expected);
    });

    test('should return empty array when items undefined', () => {
      const selectedDimension = FilterDimension.SEGMENT;
      const result = getComparedSelectedDimensionFilter.projector(
        fakeState,
        selectedDimension
      );
      const expected = new Filter(selectedDimension, []);

      expect(result).toEqual(expected);
    });
  });
});
