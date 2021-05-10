import { GREASE_STATUS_MOCK } from '../../../../../testing/mocks';
import { DATE_FORMAT } from '../../../../shared/constants';
import { initialState } from '../../reducers/bearing/bearing.reducer';
import { GreaseSensorName } from '../../reducers/grease-status/models';
import {
  getAnalysisGraphData,
  getGreaseDisplay,
  getGreaseInterval,
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
          gcm01TemperatureOptics: 99.991,
          gcm01Deterioration: 12.121,
          gcm01WaterContent: 69,
          gcm02TemperatureOptics: 33.333,
          gcm02Deterioration: 22,
          gcm02WaterContent: 11.111,
        },
      ],
      loading: false,
      status: {
        result: {
          timestamp: '2020-07-31T11:02:35',
          gcm01TemperatureOptics: 99.99,
          gcm01Deterioration: 55.55,
          gcm01WaterContent: 12.55,
          gcm02TemperatureOptics: 33.333,
          gcm02Deterioration: 22,
          gcm02WaterContent: 11.111,
        },
        loading: false,
      },
      display: {
        deterioration_1: true,
        waterContent_1: true,
        temperatureOptics_1: true,
        deterioration_2: true,
        waterContent_2: true,
        temperatureOptics_2: true,
        rsmShaftSpeed: true,
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
          data: [
            'deterioration_1',
            'waterContent_1',
            'temperatureOptics_1',
            'deterioration_2',
            'waterContent_2',
            'temperatureOptics_2',
            'rsmShaftSpeed',
          ],
        },
        series: [
          {
            name: 'deterioration_1',
            type: 'line',
            data: [
              {
                value: [new Date('2020-07-30T11:02:35'), '12.12'],
              },
            ],
          },
          {
            name: 'waterContent_1',
            type: 'line',
            data: [
              {
                value: [new Date('2020-07-30T11:02:35'), '69.00'],
              },
            ],
          },
          {
            name: 'temperatureOptics_1',
            type: 'line',
            data: [
              {
                value: [new Date('2020-07-30T11:02:35'), '99.99'],
              },
            ],
          },
          {
            name: 'deterioration_2',
            type: 'line',
            data: [
              {
                value: [new Date('2020-07-30T11:02:35'), '22.00'],
              },
            ],
          },
          {
            name: 'waterContent_2',
            type: 'line',
            data: [
              {
                value: [new Date('2020-07-30T11:02:35'), '11.11'],
              },
            ],
          },
          {
            name: 'temperatureOptics_2',
            type: 'line',
            data: [
              {
                value: [new Date('2020-07-30T11:02:35'), '33.33'],
              },
            ],
          },
          {
            name: 'rsmShaftSpeed',
            type: 'line',
            data: [], // TODO should countain data later
          },
        ],
      };

      expect(getAnalysisGraphData(fakeState)).toEqual(expectedResult);
    });
  });

  describe('getGreaseStatusLatestGraphData', () => {
    test('should return latest grease status series data', () => {
      const expectedResult = GREASE_STATUS_MOCK;
      const result = getGreaseStatusLatestGraphData(fakeState, {
        sensorName: GreaseSensorName.GCM01,
      });
      expect(result).toEqual(expectedResult);
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
