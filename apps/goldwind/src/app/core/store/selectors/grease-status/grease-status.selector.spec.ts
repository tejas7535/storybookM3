import { DATE_FORMAT } from '../../../../shared/constants';
import { initialState } from '../../reducers/bearing/bearing.reducer';
import { GreaseSensorName } from '../../reducers/grease-status/models';
import {
  getGreaseStatusLatestDeteriorationGraphData,
  getGreaseStatusLatestLoading,
  getGreaseStatusLatestResult,
  getGreaseStatusLatestTemperatureOpticsGraphData,
  getGreaseStatusLatestWaterContentGraphData,
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
  describe('getGreaseStatusLatestDeteriorationGraphData', () => {
    it('should return latest getGreaseStatusLatestDeteriorationGraphData', () => {
      expect(
        getGreaseStatusLatestDeteriorationGraphData(fakeState, {
          sensorName: GreaseSensorName.GCM01,
        })
      ).toHaveProperty('series');
    });
  });
  describe('getGreaseStatusLatestTemperatureOpticsGraphData', () => {
    it('should return latest getGreaseStatusLatestTemperatureOpticsGraphData', () => {
      expect(
        getGreaseStatusLatestTemperatureOpticsGraphData(fakeState, {
          sensorName: GreaseSensorName.GCM01,
        })
      ).toHaveProperty('series');
    });
  });
  describe('getGreaseStatusLatestWaterContentGraphData', () => {
    it('should return latestgetGreaseStatusLatestWaterContentGraphData', () => {
      expect(
        getGreaseStatusLatestWaterContentGraphData(fakeState, {
          sensorName: GreaseSensorName.GCM01,
        })
      ).toHaveProperty('series');
    });
  });
});
