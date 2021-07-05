import { LOAD_SENSE } from '../../../../../testing/mocks';
import { initialState } from '../../reducers/bearing/bearing.reducer';
import {
  getAnalysisGraphData,
  getLoadAssessmentDisplay,
  getLoadAssessmentInterval,
} from './load-assessment.selector';

describe('Load Assessment Selector', () => {
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
    loadAssessment: {
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
  };

  describe('getLoadAssessmentDisplay', () => {
    it('should return the grease display options', () => {
      expect(getLoadAssessmentDisplay(fakeState)).toEqual(
        fakeState.loadAssessment.display
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

  describe('getLoadAssessmentInterval', () => {
    it('should return a time interval with two timestamps', () => {
      expect(getLoadAssessmentInterval(fakeState)).toEqual(
        fakeState.loadAssessment.interval
      );
    });
  });
});
