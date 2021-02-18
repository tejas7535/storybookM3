import { DATE_FORMAT } from '../../../../../app/shared/constants';
import { GREASE_STATUS_MOCK } from '../../../../../testing/mocks';
import { initialState } from '../../reducers/bearing/bearing.reducer';
import { GreaseSensorName } from '../../reducers/grease-status/models';
import {
  getGreaseDisplay,
  getGreaseInterval,
  getGreaseStatusGraphData,
  getGreaseStatusLatestGraphData,
  getGreaseStatusLatestLoading,
  getGreaseStatusLatestResult,
  getGreaseStatusLoading,
  getGreaseStatusResult,
  getGreaseTimeStamp,
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
          timestamp: '2020-07-30T11:02:35',
          gcm01TemperatureOptics: 99,
          gcm01Deterioration: 12,
          gcm01WaterContent: 69,
        },
      ],
      loading: false,
      status: {
        result: {
          timestamp: '2020-07-31T11:02:35',
          gcm01TemperatureOptics: 99,
          gcm01Deterioration: 55,
          gcm01WaterContent: 12,
        },
        loading: false,
      },
      display: {
        deterioration: true,
        waterContent: true,
        temperatureOptics: true,
        // rotationalSpeed: false,
      },
      interval: {
        startDate: 123456789,
        endDate: 987654321,
      },
    },
  };

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

  describe('getGreaseTimeStamp', () => {
    test('should return the formatted time stamp', () => {
      expect(getGreaseTimeStamp(fakeState)).toEqual(
        new Date(
          fakeState.greaseStatus.status.result.timestamp
        ).toLocaleTimeString(DATE_FORMAT.local, DATE_FORMAT.options)
      );
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
          data: ['deterioration', 'waterContent', 'temperatureOptics'],
        },
        series: [
          {
            name: 'deterioration',
            type: 'line',
            data: [
              {
                value: [new Date('2020-07-30T11:02:35'), 12],
              },
            ],
          },
          {
            name: 'waterContent',
            type: 'line',
            data: [
              {
                value: [new Date('2020-07-30T11:02:35'), 69],
              },
            ],
          },
          {
            name: 'temperatureOptics',
            type: 'line',
            data: [
              {
                value: [new Date('2020-07-30T11:02:35'), 99],
              },
            ],
          },
          // {
          //   name: 'rotationalSpeed',
          //   type: 'line',
          //   data: [],
          // },
        ],
      };

      expect(getGreaseStatusGraphData(fakeState)).toEqual(expectedResult);
    });
  });

  describe('getGreaseStatusLatestGraphData', () => {
    test('should return latest grease status series data', () => {
      const expectedResult = GREASE_STATUS_MOCK;
      expect(
        getGreaseStatusLatestGraphData(fakeState, {
          sensorName: GreaseSensorName.GCM01,
        })
      ).toEqual(expectedResult);
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
