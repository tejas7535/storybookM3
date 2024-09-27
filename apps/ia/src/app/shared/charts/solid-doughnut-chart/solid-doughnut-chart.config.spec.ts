import { EChartsOption } from 'echarts';
import { CallbackDataParams } from 'echarts/types/dist/shared';

import { Color } from '../../models/color.enum';
import { SolidDoughnutChartConfig } from '../models';
import {
  createSolidDoughnutChartBaseOptions,
  createSolidDoughnutChartSeries,
  tooltipFormatter,
} from './solid-doughnut-chart.config';

describe('solid-doughnut-chart config', () => {
  describe('createSolidDoughnutChartBaseOptions', () => {
    test('should create base options', () => {
      const config: SolidDoughnutChartConfig = {
        title: 'Top 5 reasons',
        subTitle: '2021',
        color: [Color.COLORFUL_CHART_1],
        side: 'left',
      };
      const expectedResult = {
        backgroundColor: Color.WHITE,
        color: [Color.COLORFUL_CHART_1],
        title: {
          text: config.title,
          textStyle: {
            fontFamily: 'Noto Sans',
            color: 'rgba(0, 0, 0, 0.60)',
            fontStyle: 'normal',
            fontWeight: 400,
            align: 'center',
          },
        },
        textStyle: {
          fontFamily: 'Noto Sans',
        },
        legend: {
          top: 'middle',
          left: '0',
          right: 'auto',
          orient: 'vertical',
          itemWidth: 8,
          itemHeight: 8,
          icon: 'circle',
          formatter: expect.any(Function),
        },
        tooltip: {
          show: true,
        },
      };

      const result = createSolidDoughnutChartBaseOptions(config);

      expect(result).toEqual(expectedResult);
    });
  });

  describe('createSolidDoughnutChartSeries', () => {
    test('should create chart series', () => {
      const title = 'Top 5 reasons';
      const expected: EChartsOption[] = [
        {
          id: 'reasons',
          type: 'pie',
          radius: ['38%', '56%'],
          center: ['70%', '50%'],
          top: 0,
          avoidLabelOverlap: true,
          selectedMode: 'single',
          label: {
            position: 'inside',
            formatter: expect.any(Function),
          },
          labelLine: {
            show: false,
          },
          tooltip: {
            show: true,
            formatter: expect.any(Function),
          },
        },
        {
          id: 'detailedReasons',
          type: 'pie',
          radius: ['60%', '80%'],
          center: ['70%', '50%'],
          top: 0,
          avoidLabelOverlap: true,
          labelLine: {
            show: false,
          },
          label: {
            position: 'inside',
            rotate: 0,
            precision: 1,
            formatter: expect.any(Function),
          },

          data: [{ value: 0, name: '', itemStyle: { color: 'transparent' } }],
          tooltip: {
            formatter: expect.any(Function),
          },
        },
        {
          id: 'title',
          type: 'pie',
          radius: ['0%', '0%'],
          center: ['70%', '50%'],
          top: 0,
          avoidLabelOverlap: true,
          label: {
            position: 'center',
            formatter: title,
          },
          emphasis: { disabled: true },
          labelLine: {
            show: false,
          },
          data: [
            {
              value: 0,
              name: '',
              itemStyle: { color: 'transparent' },
            },
          ],
          tooltip: {
            show: false,
          },
        },
      ];

      const result = createSolidDoughnutChartSeries('left', title);

      expect(result).toEqual(expected);
    });
  });

  describe('tooltipFormatter', () => {
    test('should format tooltip', () => {
      const params = {
        name: 'Reason A',
        value: 1,
        percent: 50,
      };
      const expected = 'Reason A: <b>50.0%</b>';

      const result = tooltipFormatter(params as CallbackDataParams);

      expect(result).toEqual(expected);
    });
  });
});
