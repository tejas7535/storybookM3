import { LoadAssessmentData } from '../../../http/rest.service';
import { LoadAssessmentState } from '../../reducers/load-assessment/load-assessment.reducer';
import {
  getAnalysisGraphData,
  getLoadAssessmentDisplay,
  getLoadAssessmentInterval,
} from './load-assessment.selector';

describe('Load Assessment Selector', () => {
  const fakeState = {
    loadAssessment: {
      result: [
        {
          timestamp: '2020-11-04T09:39:19.499Z',
          lsp01Strain: 1,
          fx: 1,
        } as LoadAssessmentData,
      ],
      display: {
        lsp01Strain: true,
        centerLoadFx: true,
      },
      interval: {
        startDate: 123_456_789,
        endDate: 987_654_321,
      },
    } as LoadAssessmentState,
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
