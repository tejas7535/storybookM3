import { LOAD_SENSE } from '../../../../../testing/mocks';
import { CenterLoadStatus } from '../../../../shared/models';
import { initialState } from '../../reducers/bearing/bearing.reducer';
import {
  getAnalysisGraphData,
  getLoadAssessmentDisplay,
  getLoadAssessmentInterval,
} from './load-assessment.selector';
const MOCK = {
  deviceId: 'foo',
  timestamp: '2020-11-04T09:39:19.499Z',
  fx: 1,
  fy: 1,
  fz: 1,
  mz: 1,
  my: 1,
} as CenterLoadStatus;
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
    'center-load': {
      loading: false,
      result: [MOCK],
      status: {
        loading: false,
        result: MOCK,
      },
    },
    loadAssessment: {
      display: {
        lsp01Strain: true,
        centerLoadFx: true,
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
        xAxis: {
          max: new Date('2001-04-19T04:25:21.000Z'),
          min: new Date('1973-11-29T21:33:09.000Z'),
        },
        dataZoom: [
          {
            filterMode: 'none',
            type: 'inside',
          },
          {
            bottom: '10%',
            endValue: Number.NaN,
            startValue: Number.NaN,
          },
        ],
        legend: {
          data: ['lsp01Strain', 'centerLoadFx'],
        },
        series: [
          {
            name: 'lsp01Strain',
            type: 'line',
            symbol: 'none',
            lineStyle: {
              color: '#0e656d',
            },
            data: [
              {
                value: [new Date('2020-11-04T09:39:19.499Z'), '1.00'],
              },
            ],
          },
          {
            name: 'centerLoadFx',
            type: 'line',
            symbol: 'none',
            lineStyle: {
              color: '#FF5627',
            },
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
