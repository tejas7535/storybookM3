import { initialState } from '../../reducers/load-sense/load-sense.reducer';
import {
  getLiveStatus,
  getLoadGraphData,
  getLoadInterval,
  getLoadSenseLoading,
  getLoadSenseMeasturementTimes,
  getLoadSenseResult,
} from './load-sense.selector';

jest.mock('@ngneat/transloco', () => ({
  ...jest.requireActual('@ngneat/transloco'),
  translate: jest.fn(() => 'translate it'),
}));

describe('ConditionMonitoring Selector', () => {
  const fakeState = {
    loadSense: {
      ...initialState,
      loading: false,
      result: [
        {
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
        },
      ],
      interval: {
        startDate: 123456789,
        endDate: 987654321,
      },
    },
  };

  describe('getLiveStatus ', () => {
    test('should return numeric socket status', () => {
      expect(getLiveStatus(fakeState)).toEqual(false);
    });
  });

  describe('getLoadSenseLoading', () => {
    test('should return loading status', () => {
      expect(getLoadSenseLoading(fakeState)).toBeFalsy();
    });
  });

  describe('getLoadSenseResult', () => {
    test('should return the load sense result', () => {
      expect(getLoadSenseResult(fakeState)).toEqual(fakeState.loadSense.result);
    });
  });

  describe('getLoadInterval', () => {
    test('should return a time interval with two timestamps', () => {
      expect(getLoadInterval(fakeState)).toEqual(fakeState.loadSense.interval);
    });
  });

  describe('getLoadSenseMeasturementTimes', () => {
    const expectedResult = ['2020-11-04T09:39:19.499Z'];
    test('should return a array with all timestamps', () => {
      expect(getLoadSenseMeasturementTimes(fakeState)).toEqual(expectedResult);
    });
  });

  describe('getLoadGraphData', () => {
    test('should return the load sense polar according the timestamp', () => {
      const expectedResult = {
        series: [
          {
            name: 'TRANSLATE IT TRANSLATE IT',
            type: 'line',
            coordinateSystem: 'polar',
            data: [
              [1, 0],
              [2, 22.5],
              [3, 45],
              [4, 67.5],
              [5, 90],
              [6, 112.5],
              [7, 135],
              [8, 157.5],
              [9, 180],
              [10, 202.5],
              [11, 225],
              [12, 247.5],
              [13, 270],
              [14, 292.5],
              [15, 315],
              [16, 337.5],
              [1, 0],
            ],
            areaStyle: {},
            smooth: true,
          },
        ],
      };
      expect(
        getLoadGraphData(fakeState, {
          timestamp: '2020-11-04T09:39:19.499Z',
        })
      ).toEqual(expectedResult);
    });
  });
});
