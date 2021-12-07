import { GaugeSeriesOption, SeriesOption } from 'echarts';

import { DATE_FORMAT } from '../../../../../app/shared/constants';
import { initialState, ShaftState } from '../../reducers/shaft/shaft.reducer';
import {
  getShaftLatestGraphData,
  getShaftLatestLoading,
  getShaftLatestResult,
  getShaftLatestTimeStamp,
  getShaftLoading,
  getShaftResult,
} from './shaft.selector';

describe('Shaft Selector', () => {
  const fakeShaftState: ShaftState = {
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
  };

  const fakeState = {
    shaft: fakeShaftState,
  };

  describe('getShaftLatestResult', () => {
    it('should return the latest shaft result', () => {
      expect(getShaftLatestResult(fakeState)).toEqual(
        fakeState.shaft.status.result
      );
    });
  });

  describe('getShaftLatestLoading', () => {
    it('should return the shaft result', () => {
      expect(getShaftLatestLoading(fakeState)).toEqual(
        fakeState.shaft.status.loading
      );
    });
  });

  describe('getShaftLatestTimeStamp', () => {
    it('should return the latest shaft result time stamp', () => {
      expect(getShaftLatestTimeStamp(fakeState)).toEqual(
        new Date(fakeShaftState.status.result.timestamp).toLocaleTimeString(
          DATE_FORMAT.local,
          DATE_FORMAT.options
        )
      );
    });
  });

  describe('getShaftLatestGraphData', () => {
    it('should return the latest shaft latest graph data', () => {
      const state = getShaftLatestGraphData(fakeState) as any;
      expect(
        state.series
          .filter((s: GaugeSeriesOption) => s.data && s.data.length > 0)
          .map((d: GaugeSeriesOption) => d.data[0])
      ).toEqual(
        expect.arrayContaining([
          {
            name: 'conditionMonitoring.shaft.rotorRotationSpeed',
            value: fakeState.shaft.status.result.rsm01ShaftSpeed.toFixed(1),
          },
        ])
      );
    });
  });

  describe('getShaftResult', () => {
    it('should return the shaft result', () => {
      expect(getShaftResult(fakeState)).toEqual(fakeState.shaft.result);
    });
  });

  describe('getShaftLoading', () => {
    it('should return the shaft result', () => {
      expect(getShaftLoading(fakeState)).toEqual(fakeState.shaft.loading);
    });
  });
});
