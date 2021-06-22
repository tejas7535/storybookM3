import { GREASE_STATUS_MOCK, LOAD_SENSE } from '../../../../../testing/mocks';
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
        centerLoad: false,
        lsp01Strain: true,
      },
      interval: {
        startDate: 123_456_789,
        endDate: 987_654_321,
      },
    },
    shaft: {
      ...initialState,
      result: [
        {
          deviceId: 'fakedeviceid',
          timestamp: '2020-11-12T18:31:56.954003Z',
          rsm01ShaftSpeed: 3,
          rsm01Shaftcountervalue: 666,
        },
      ],
      loading: false,
      status: {
        result: {
          deviceId: 'fakedeviceid',
          timestamp: '2020-11-12T18:31:56.954003Z',
          rsm01ShaftSpeed: 3,
          rsm01Shaftcountervalue: 666,
        },
        loading: false,
      },
    },
    loadSense: {
      loading: false,
      result: [LOAD_SENSE],
      status: {
        loading: false,
        result: LOAD_SENSE,
      },
      averageResult: {
        loading: false,
        result: LOAD_SENSE,
      },
    },
  };

  describe('getGreaseStatusLoading', () => {
    it('should return loading status', () => {
      expect(getGreaseStatusLoading(fakeState)).toBeFalsy();
    });
  });

  describe('getGreaseStatusLatestLoading', () => {
    it('should return latest loading status', () => {
      expect(getGreaseStatusLatestLoading(fakeState)).toBeFalsy();
    });
  });

  describe('getGreaseTimeStamp', () => {
    it('should return the formatted time stamp', () => {
      expect(getGreaseTimeStamp(fakeState)).toEqual(
        new Date(
          fakeState.greaseStatus.status.result.timestamp
        ).toLocaleTimeString(DATE_FORMAT.local, DATE_FORMAT.options)
      );
    });
  });

  describe('getGreaseStatusResult', () => {
    it('should return the grease status', () => {
      expect(getGreaseStatusResult(fakeState)).toEqual(
        fakeState.greaseStatus.result
      );
    });
  });

  describe('getGreaseStatusLatestResult', () => {
    it('should return latest grease status', () => {
      expect(getGreaseStatusLatestResult(fakeState)).toEqual(
        fakeState.greaseStatus.status.result
      );
    });
  });

  describe('getGreaseDisplay', () => {
    it('should return the grease display options', () => {
      expect(getGreaseDisplay(fakeState)).toEqual(
        fakeState.greaseStatus.display
      );
    });
  });

  describe('getAnalysisGraphData', () => {
    it('should return grease status series data value tupels', () => {
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
            'lsp01Strain',
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
            data: [
              {
                value: [new Date('2020-11-12T18:31:56.954Z'), '3.00'],
              },
            ],
          },
          {
            name: 'centerLoad',
            type: 'line',
            data: [],
          },
          {
            name: 'lsp01Strain',
            type: 'line',
            data: [
              {
                value: [new Date('2020-11-04T09:39:19.499Z'), '1.00'],
              },
            ],
          },
        ],
      };

      expect(getAnalysisGraphData(fakeState)).toEqual(expectedResult);
    });
  });

  describe('getGreaseStatusLatestGraphData', () => {
    it('should return latest grease status series data', () => {
      const expectedResult = GREASE_STATUS_MOCK;
      const result = getGreaseStatusLatestGraphData(fakeState, {
        sensorName: GreaseSensorName.GCM01,
      });
      expect(result).toEqual(expectedResult);
    });
  });

  describe('getGreaseInterval', () => {
    it('should return a time interval with two timestamps', () => {
      expect(getGreaseInterval(fakeState)).toEqual(
        fakeState.greaseStatus.interval
      );
    });
  });
});
