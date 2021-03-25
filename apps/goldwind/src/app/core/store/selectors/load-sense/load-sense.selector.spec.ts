import { GaugeColors } from '../../../../shared/chart/chart';
import {
  initialState,
  LoadAverageState,
} from '../../reducers/load-sense/load-sense.reducer';
import { LoadSense, LoadSenseAvg } from '../../reducers/load-sense/models';
import { GraphData } from '../../reducers/shared/models';
import {
  getAverageLoadGraphData,
  getBearingLoadLatestResult,
  getLoadAverageLoading,
  getLoadAverageResult,
  getLoadGraphData,
  getLoadSenseLoading,
} from './load-sense.selector';

jest.mock('@ngneat/transloco', () => ({
  ...jest.requireActual('@ngneat/transloco'),
  translate: jest.fn(() => 'translate it'),
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

  const mockLoadAverage: LoadSenseAvg = {
    deviceId: 'string',
    id: 'string',
    lsp01StrainAvg: 1,
    lsp02StrainAvg: 2,
    lsp03StrainAvg: 3,
    lsp04StrainAvg: 4,
    lsp05StrainAvg: 5,
    lsp06StrainAvg: 6,
    lsp07StrainAvg: 7,
    lsp08StrainAvg: 8,
    lsp09StrainAvg: 9,
    lsp10StrainAvg: 10,
    lsp11StrainAvg: 11,
    lsp12StrainAvg: 12,
    lsp13StrainAvg: 13,
    lsp14StrainAvg: 14,
    lsp15StrainAvg: 15,
    lsp16StrainAvg: 16,
    timestamp: '2020-11-04T09:39:19.499Z',
  };

  const mockLoadAverageState: LoadAverageState = {
    loading: false,
    result: mockLoadAverage,
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
    test('should return loading status', () => {
      expect(getLoadSenseLoading(mockBearingLoadState)).toBeFalsy();
    });
  });

  describe('getLoadAverageLoading', () => {
    test('should return loading status', () => {
      expect(getLoadAverageLoading(mockBearingLoadState)).toBeFalsy();
    });
  });

  describe('getLoadSenseResult', () => {
    test('should return the load sense result', () => {
      expect(getBearingLoadLatestResult(mockBearingLoadState)).toEqual(
        mockLoadSense
      );
    });
  });

  describe('getLoadAverageResult', () => {
    test('should return the load average result', () => {
      expect(getLoadAverageResult(mockBearingLoadState)).toEqual(
        mockLoadAverageState.result
      );
    });
  });
  describe('getLoadGraphData', () => {
    const formattedMockLabel = 'translate it';
    test('should return graph data', () => {
      const expectedResult: GraphData = {
        series: [
          {
            name: formattedMockLabel,
            type: 'radar',
            symbol: 'none',
            data: [
              { name: 'translate it', value: [2, 4, 6, 8, 10, 12, 14, 16] },
            ],
            areaStyle: {
              opacity: 0.01,
            },
            itemStyle: {
              color: GaugeColors.GREEN,
            },
          },
          {
            name: formattedMockLabel,
            type: 'radar',
            symbol: 'none',
            data: [
              { name: 'translate it', value: [1, 3, 5, 7, 9, 11, 13, 15] },
            ],
            areaStyle: {
              opacity: 0.01,
            },
            itemStyle: {
              color: GaugeColors.YELLOW,
            },
          },
        ],
      };
      expect(getLoadGraphData(mockBearingLoadState)).toEqual(expectedResult);
    });
  });

  describe('getLoadAverageGraphData', () => {
    const formattedMockLabel = 'translate it';
    test('should return graph data', () => {
      const expectedResult: GraphData = {
        series: [
          {
            name: formattedMockLabel,
            type: 'radar',
            symbol: 'none',
            data: [
              { name: 'translate it', value: [2, 4, 6, 8, 10, 12, 14, 16] },
            ],
            areaStyle: {
              opacity: 0.1,
            },
            itemStyle: {
              color: GaugeColors.GREEN,
            },
          },
          {
            name: formattedMockLabel,
            type: 'radar',
            symbol: 'none',
            data: [
              { name: 'translate it', value: [1, 3, 5, 7, 9, 11, 13, 15] },
            ],
            areaStyle: {
              opacity: 0.1,
            },
            itemStyle: {
              color: GaugeColors.YELLOW,
            },
          },
        ],
      };
      expect(getAverageLoadGraphData(mockBearingLoadState)).toEqual(
        expectedResult
      );
    });
  });
});
