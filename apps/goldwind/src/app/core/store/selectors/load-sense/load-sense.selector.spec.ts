import { translate } from '@ngneat/transloco';

import { GaugeColors } from '../../../../shared/chart/chart';
import {
  initialState,
  LoadAverageState,
} from '../../reducers/load-sense/load-sense.reducer';
import { LoadSense } from '../../reducers/load-sense/models';
import { GraphData } from '../../reducers/shared/models';
import {
  getAverageLoadGraphData,
  getBearingLoadLatestResult,
  getLoadAverageLoading,
  getLoadAverageResult,
  getLoadGraphData,
  getLoadSenseLoading,
  tooltipFormatter,
} from './load-sense.selector';

jest.mock('@ngneat/transloco', () => ({
  ...jest.requireActual('@ngneat/transloco'),
  translate: jest.fn((key) => key),
}));

describe('Load Sense Selector', () => {
  const mockLoadSense: LoadSense = {
    deviceId: 'string',
    id: 'string',
    lsp01Strain: 1,
    lsp02Strain: 2,
    lsp03Strain: 3,
    lsp04Strain: 4,
    lsp05Strain: 5,
    lsp06Strain: 6,
    lsp07Strain: 7,
    lsp08Strain: 8,
    lsp09Strain: 9,
    lsp10Strain: 10,
    lsp11Strain: 11,
    lsp12Strain: 12,
    lsp13Strain: 13,
    lsp14Strain: 14,
    lsp15Strain: 15,
    lsp16Strain: 16,
    timestamp: '2020-11-04T09:39:19.499Z',
  };

  const mockLoadAverageState: LoadAverageState = {
    loading: false,
    result: mockLoadSense,
  };

  const mockBearingLoadState: any = {
    loadSense: {
      ...initialState,
      loading: false,
      result: mockLoadSense,
      averageResult: mockLoadAverageState,
    },
  };

  describe('getLoadSenseLoading', () => {
    it('should return loading status', () => {
      expect(getLoadSenseLoading(mockBearingLoadState)).toBeFalsy();
    });
  });

  describe('getLoadAverageLoading', () => {
    it('should return loading status', () => {
      expect(getLoadAverageLoading(mockBearingLoadState)).toBeFalsy();
    });
  });

  describe('getLoadSenseResult', () => {
    it('should return the load sense result', () => {
      expect(getBearingLoadLatestResult(mockBearingLoadState)).toEqual(
        mockLoadSense
      );
    });
  });

  describe('getLoadAverageResult', () => {
    it('should return the load average result', () => {
      expect(getLoadAverageResult(mockBearingLoadState)).toEqual(
        mockLoadAverageState.result
      );
    });
  });
  describe('getLoadGraphData', () => {
    it('should return graph data', () => {
      const mockTooltipFormatter = jest.fn((_a, _b) => 'formattedTooltip');
      const mockLoadSenseResult = {};

      const expectedResult: GraphData = {
        tooltip: {
          formatter: (params: any) =>
            mockTooltipFormatter(params, mockLoadSenseResult),
        },
        series: [
          {
            name: 'conditionMonitoring.centerLoad.generator',
            symbol: 'none',
            type: 'line',
            coordinateSystem: 'polar',
            smooth: false,
            areaStyle: {
              opacity: 0.5,
            },
            itemStyle: {
              color: GaugeColors.GREEN,
            },
            data: [
              [2, 22.5],
              [4, 67.5],
              [6, 112.5],
              [8, 157.5],
              [10, 202.5],
              [12, 247.5],
              [14, 292.5],
              [16, 337.5],
              [2, 22.5],
            ],
          },
          {
            name: 'conditionMonitoring.centerLoad.rotor',
            symbol: 'none',
            type: 'line',
            coordinateSystem: 'polar',
            smooth: false,
            areaStyle: {
              opacity: 0.5,
            },
            itemStyle: {
              color: GaugeColors.YELLOW,
            },
            data: [
              [1, 0],
              [3, 45],
              [5, 90],
              [7, 135],
              [9, 180],
              [11, 225],
              [13, 270],
              [15, 315],
              [1, 0],
            ],
          },
        ],
      };
      expect(JSON.stringify(getLoadGraphData(mockBearingLoadState))).toEqual(
        JSON.stringify(expectedResult)
      );
    });
  });

  describe('getLoadAverageGraphData', () => {
    it('should return graph data', () => {
      const mockTooltipFormatter = jest.fn((_a, _b) => 'formattedTooltip');
      const mockLoadSenseAvgResult = {};

      const expectedResult: GraphData = {
        tooltip: {
          formatter: (params: any) =>
            mockTooltipFormatter(params, mockLoadSenseAvgResult),
        },
        series: [
          {
            name: 'conditionMonitoring.centerLoad.generatorAverage',
            symbol: 'none',
            type: 'line',
            coordinateSystem: 'polar',
            smooth: false,

            areaStyle: {
              opacity: 0.5,
            },
            itemStyle: {
              color: GaugeColors.GREEN,
            },
            data: [
              [2, 22.5],
              [4, 67.5],
              [6, 112.5],
              [8, 157.5],
              [10, 202.5],
              [12, 247.5],
              [14, 292.5],
              [16, 337.5],
              [2, 22.5],
            ],
          },
          {
            name: 'conditionMonitoring.centerLoad.rotorAverage',
            symbol: 'none',
            type: 'line',
            coordinateSystem: 'polar',
            smooth: false,

            areaStyle: {
              opacity: 0.5,
            },
            itemStyle: {
              color: GaugeColors.YELLOW,
            },
            data: [
              [1, 0],
              [3, 45],
              [5, 90],
              [7, 135],
              [9, 180],
              [11, 225],
              [13, 270],
              [15, 315],
              [1, 0],
            ],
          },
        ],
      };
      expect(
        JSON.stringify(getAverageLoadGraphData(mockBearingLoadState))
      ).toEqual(JSON.stringify(expectedResult));
    });
  });

  describe('tooltipFormatter', () => {
    it('should return a correctly formatted tooltip for rotor', () => {
      const params = [
        {
          seriesName: `${translate(`conditionMonitoring.centerLoad.rotor`)}`,
        },
      ];

      const loadSense = {
        lsp01Strain: 1000,
        lsp03Strain: 3000,
        lsp05Strain: 5000,
        lsp07Strain: 7000,
        lsp09Strain: 9000,
        lsp11Strain: 11_000.11,
        lsp13Strain: 13_000.13,
        lsp15Strain: 15_000.15,
      } as unknown as LoadSense;

      const expectedTooltip = `${params[0].seriesName}<br />
      Lsp 1:&nbsp;&nbsp;&nbsp;&nbsp;1,000 N<br />
      Lsp 3:&nbsp;&nbsp;&nbsp;&nbsp;3,000 N<br />
      Lsp 5:&nbsp;&nbsp;&nbsp;&nbsp;5,000 N<br />
      Lsp 7:&nbsp;&nbsp;&nbsp;&nbsp;7,000 N<br />
      Lsp 9:&nbsp;&nbsp;&nbsp;&nbsp;9,000 N<br />
      Lsp 11:&nbsp;&nbsp;11,000 N<br />
      Lsp 13:&nbsp;&nbsp;13,000 N<br />
      Lsp 15:&nbsp;&nbsp;15,000 N<br />`;

      expect(tooltipFormatter(params, loadSense)).toBe(expectedTooltip);
    });

    it('should return a correctly formatted tooltip for average rotor', () => {
      const params = [
        {
          seriesName: `${translate(
            `conditionMonitoring.centerLoad.rotorAverage`
          )}`,
        },
      ];

      const loadSense = {
        lsp01Strain: 1000,
        lsp03Strain: 3000,
        lsp05Strain: 5000,
        lsp07Strain: 7000,
        lsp09Strain: 9000,
        lsp11Strain: 11_000.11,
        lsp13Strain: 13_000.13,
        lsp15Strain: 15_000.15,
      } as unknown as LoadSense;

      const expectedTooltip = `${params[0].seriesName}<br />
      Lsp 1:&nbsp;&nbsp;&nbsp;&nbsp;1,000 N<br />
      Lsp 3:&nbsp;&nbsp;&nbsp;&nbsp;3,000 N<br />
      Lsp 5:&nbsp;&nbsp;&nbsp;&nbsp;5,000 N<br />
      Lsp 7:&nbsp;&nbsp;&nbsp;&nbsp;7,000 N<br />
      Lsp 9:&nbsp;&nbsp;&nbsp;&nbsp;9,000 N<br />
      Lsp 11:&nbsp;&nbsp;11,000 N<br />
      Lsp 13:&nbsp;&nbsp;13,000 N<br />
      Lsp 15:&nbsp;&nbsp;15,000 N<br />`;

      expect(tooltipFormatter(params, loadSense)).toBe(expectedTooltip);
    });

    it('should return a correctly formatted tooltip for generator', () => {
      const params = [
        {
          seriesName: `${translate(
            `conditionMonitoring.centerLoad.generator`
          )}`,
        },
      ];

      const loadSense = {
        lsp02Strain: 2000,
        lsp04Strain: 4000,
        lsp06Strain: 6000,
        lsp08Strain: 8000,
        lsp10Strain: 10_000,
        lsp12Strain: 12_000.12,
        lsp14Strain: 14_000.14,
        lsp16Strain: 16_000.16,
      } as unknown as LoadSense;

      const expectedTooltip = `${params[0].seriesName}<br />
      Lsp 2:&nbsp;&nbsp;&nbsp;&nbsp;2,000 N<br />
      Lsp 4:&nbsp;&nbsp;&nbsp;&nbsp;4,000 N<br />
      Lsp 6:&nbsp;&nbsp;&nbsp;&nbsp;6,000 N<br />
      Lsp 8:&nbsp;&nbsp;&nbsp;&nbsp;8,000 N<br />
      Lsp 10:&nbsp;&nbsp;10,000 N<br />
      Lsp 12:&nbsp;&nbsp;12,000 N<br />
      Lsp 14:&nbsp;&nbsp;14,000 N<br />
      Lsp 16:&nbsp;&nbsp;16,000 N<br />`;

      expect(tooltipFormatter(params, loadSense)).toBe(expectedTooltip);
    });

    it('should return a correctly formatted tooltip for generator average', () => {
      const params = [
        {
          seriesName: `${translate(
            `conditionMonitoring.centerLoad.generatorAverage`
          )}`,
        },
      ];

      const loadSense = {
        lsp02Strain: 2000,
        lsp04Strain: 4000,
        lsp06Strain: 6000,
        lsp08Strain: 8000,
        lsp10Strain: 10_000,
        lsp12Strain: 12_000.12,
        lsp14Strain: 14_000.14,
        lsp16Strain: 16_000.16,
      } as unknown as LoadSense;

      const expectedTooltip = `${params[0].seriesName}<br />
      Lsp 2:&nbsp;&nbsp;&nbsp;&nbsp;2,000 N<br />
      Lsp 4:&nbsp;&nbsp;&nbsp;&nbsp;4,000 N<br />
      Lsp 6:&nbsp;&nbsp;&nbsp;&nbsp;6,000 N<br />
      Lsp 8:&nbsp;&nbsp;&nbsp;&nbsp;8,000 N<br />
      Lsp 10:&nbsp;&nbsp;10,000 N<br />
      Lsp 12:&nbsp;&nbsp;12,000 N<br />
      Lsp 14:&nbsp;&nbsp;14,000 N<br />
      Lsp 16:&nbsp;&nbsp;16,000 N<br />`;

      expect(tooltipFormatter(params, loadSense)).toBe(expectedTooltip);
    });
  });
});
