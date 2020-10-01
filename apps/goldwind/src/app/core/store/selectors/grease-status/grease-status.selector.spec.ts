import { GREASE_STATUS_MOCK } from '../../../../../testing/mocks';
import { initialState } from '../../reducers/bearing/bearing.reducer';
import {
  getGreaseDisplay,
  getGreaseInterval,
  getGreaseSensorId,
  getGreaseStatusGraphData,
  getGreaseStatusLatestGraphData,
  getGreaseStatusLatestLoading,
  getGreaseStatusLatestResult,
  getGreaseStatusLoading,
  getGreaseStatusResult,
} from './grease-status.selector';

jest.mock('@ngneat/transloco', () => ({
  ...jest.requireActual('@ngneat/transloco'),
  translate: jest.fn(() => 'translate it'),
}));

describe('Grease Status Selector', () => {
  const fakeState = {
    greaseStatus: {
      ...initialState,
      result: [
        {
          startDate: '2020-07-30T11:02:35',
          deteriorationPercent: 12,
          waterContentPercent: 69,
        },
      ],
      loading: false,
      status: {
        result: {
          startDate: '2020-07-31T11:02:35',
          deteriorationPercent: 55,
          waterContentPercent: 12,
          temperatureCelsius: 99,
        },
        loading: false,
      },
      display: {
        deteriorationPercent: true,
        temperatureCelsius: false,
        waterContentPercent: true,
        rotationalSpeed: false,
      },
      interval: {
        startDate: 123456789,
        endDate: 987654321,
      },
    },
  };

  describe('getGreaseSensorId', () => {
    test('should return a static id, will change to actual one', () => {
      // adjust in future
      expect(getGreaseSensorId(fakeState)).toEqual(
        '887bffbe-2e87-49f0-b763-ba235dd7c876'
      );
    });
  });

  describe('getGreaseStatusLoading', () => {
    test('should return loading status', () => {
      expect(getGreaseStatusLoading(fakeState)).toBeFalsy();
    });
  });

  describe('getGreaseStatusLatestLoading', () => {
    test('should return latest loading status', () => {
      expect(getGreaseStatusLatestLoading(fakeState)).toBeFalsy();
    });
  });

  describe('getGreaseStatusResult', () => {
    test('should return the grease status', () => {
      expect(getGreaseStatusResult(fakeState)).toEqual(
        fakeState.greaseStatus.result
      );
    });
  });

  describe('getGreaseStatusLatestResult', () => {
    test('should return latest grease status', () => {
      expect(getGreaseStatusLatestResult(fakeState)).toEqual(
        fakeState.greaseStatus.status.result
      );
    });
  });

  describe('getGreaseDisplay', () => {
    test('should return the grease display options', () => {
      expect(getGreaseDisplay(fakeState)).toEqual(
        fakeState.greaseStatus.display
      );
    });
  });

  describe('getGreaseStatusGraphData', () => {
    test('should return grease status series data value tupels', () => {
      const expectedResult = {
        legend: {
          data: ['deteriorationPercent', 'waterContentPercent'],
        },
        series: [
          {
            name: 'deteriorationPercent',
            type: 'line',
            data: [
              {
                value: [new Date('2020-07-30T11:02:35'), 12],
              },
            ],
          },
          {
            name: 'temperatureCelsius',
            type: 'line',
            data: [],
          },
          {
            name: 'waterContentPercent',
            type: 'line',
            data: [
              {
                value: [new Date('2020-07-30T11:02:35'), 69],
              },
            ],
          },
          {
            name: 'rotationalSpeed',
            type: 'line',
            data: [],
          },
        ],
      };

      expect(getGreaseStatusGraphData(fakeState)).toEqual(expectedResult);
    });
  });

  describe('getGreaseStatusLatestGraphData', () => {
    test('should return latest grease status series data', () => {
      const expectedResult = GREASE_STATUS_MOCK;
      expect(getGreaseStatusLatestGraphData(fakeState)).toEqual(expectedResult);
    });
  });

  describe('getGreaseInterval', () => {
    test('should return a time interval with two timestamps', () => {
      expect(getGreaseInterval(fakeState)).toEqual(
        fakeState.greaseStatus.interval
      );
    });
  });
});
