import { translate, TranslocoModule } from '@ngneat/transloco';

import { DoughnutChartData } from '../../../shared/charts/models';
import { ChartLegendItem } from '../../../shared/charts/models/chart-legend-item.model';
import { TimePeriod } from '../../../shared/models';
import { ReasonsAndCounterMeasuresState } from '..';
import {
  getComparedBeautifiedSelectedTimeRange,
  getComparedReasonsChartConfig,
  getComparedReasonsData,
  getComparedReasonsLoading,
  getComparedReasonsTableData,
  getComparedSelectedOrgUnit,
  getComparedSelectedTimePeriod,
  getComparedSelectedTimeRange,
  getPercentageValue,
  getReasonsChartConfig,
  getReasonsChartData,
  getReasonsCombinedLegend,
  getReasonsData,
  getReasonsLoading,
  getReasonsTableData,
  getSelectedComparedFilters,
  getSelectedComparedTimeRange,
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
      comparedSelectedOrgUnit: 'Schaeffler1',
      comparedSelectedTimePeriod: TimePeriod.YEAR,
      comparedSelectedTimeRange: '0|1',
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

  describe('getComparedSelectedOrgUnit', () => {
    test('should return selected org unit', () => {
      expect(getComparedSelectedOrgUnit.projector(fakeState)).toEqual(
        fakeState.reasonsForLeaving.comparedSelectedOrgUnit
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
    beforeAll(() => {
      (utils.getTooltipFormatter as any) = jest.fn(() => tooltipFormatter);
      (utils.getColorsForChart as any) = jest.fn(() => []);
    });

    test('should return config for reasons chart', () => {
      const beutifiedTimeRange = '21.01.2020 - 21.01.2021';

      expect(
        getReasonsChartConfig.projector(
          fakeState.reasonsForLeaving.reasons.data,
          beutifiedTimeRange,
          TimePeriod.CUSTOM,
          []
        )
      ).toEqual({
        title: beutifiedTimeRange,
        subTitle: 'reasonsAndCounterMeasures.topFiveReasons.title',
        tooltipFormatter,
        color: [],
      });
    });

    test('should return config with last 12 months title when selected', () => {
      const beutifiedTimeRange = '21.01.2020 - 21.01.2021';

      expect(
        getReasonsChartConfig.projector(
          fakeState.reasonsForLeaving.reasons.data,
          beutifiedTimeRange,
          TimePeriod.LAST_12_MONTHS,
          []
        )
      ).toEqual({
        title: translate(`filters.periodOfTime.${TimePeriod.LAST_12_MONTHS}`),
        subTitle: 'reasonsAndCounterMeasures.topFiveReasons.title',
        tooltipFormatter,
        color: [],
      });
    });

    test('should return no data sub title when no data', () => {
      const beutifiedTimeRange = '21.01.2020 - 21.01.2021';

      expect(
        getReasonsChartConfig.projector(
          [],
          beutifiedTimeRange,
          TimePeriod.CUSTOM,
          []
        )
      ).toEqual({
        title: beutifiedTimeRange,
        subTitle: 'reasonsAndCounterMeasures.topFiveReasons.chart.noData',
        tooltipFormatter,
        color: [],
      });
    });
  });

  describe('getSelectedComparedTimeRange', () => {
    test('should return selected compared time range', () => {
      expect(getSelectedComparedTimeRange.projector(fakeState)).toEqual('0|1');
    });
  });

  describe('getSelectedComparedFilters', () => {
    test('should return selected compared org unit', () => {
      expect(getSelectedComparedFilters.projector(fakeState)).toEqual(
        'Schaeffler1'
      );
    });
  });

  describe('getCurrentComparedFiltersAndTime', () => {
    test('should return selected compared org unit and timem range', () => {
      expect(getSelectedComparedTimeRange.projector(fakeState)).toEqual('0|1');
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

  describe('getComparedBeautifiedSelectedTimeRange', () => {
    test('should return beautified time range', () => {
      expect(
        getComparedBeautifiedSelectedTimeRange.projector(
          '1577863715000|1609399715000'
        )
      ).toEqual('1/1/2020 - 12/31/2020');
    });
  });

  describe('getComparedReasonsChartConfig', () => {
    beforeAll(() => {
      (utils.getTooltipFormatter as any) = jest.fn(() => tooltipFormatter);
      (utils.getColorsForChart as any) = jest.fn(() => []);
    });

    test('should return config for reasons chart', () => {
      const beutifiedTimeRange = '21.01.2020 - 21.01.2021';

      expect(
        getComparedReasonsChartConfig.projector(
          fakeState.reasonsForLeaving.comparedReasons.data,
          beutifiedTimeRange,
          TimePeriod.MONTH,
          [],
          []
        )
      ).toEqual({
        title: beutifiedTimeRange,
        subTitle: 'reasonsAndCounterMeasures.topFiveReasons.title',
        tooltipFormatter,
        color: [],
      });
    });

    test('should return config with last 12 months title when selected', () => {
      const beutifiedTimeRange = '21.01.2020 - 21.01.2021';

      expect(
        getComparedReasonsChartConfig.projector(
          fakeState.reasonsForLeaving.comparedReasons.data,
          beutifiedTimeRange,
          TimePeriod.LAST_12_MONTHS,
          [],
          []
        )
      ).toEqual({
        title: translate(`filters.periodOfTime.${TimePeriod.LAST_12_MONTHS}`),
        subTitle: 'reasonsAndCounterMeasures.topFiveReasons.title',
        tooltipFormatter,
        color: [],
      });
    });

    test('should return no data sub title when no data', () => {
      const beutifiedTimeRange = '21.01.2020 - 21.01.2021';

      expect(
        getComparedReasonsChartConfig.projector(
          [],
          beutifiedTimeRange,
          TimePeriod.CUSTOM,
          [],
          []
        )
      ).toEqual({
        title: beutifiedTimeRange,
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
});
