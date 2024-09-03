import { EChartsOption } from 'echarts';

import { Color } from '../../models/color.enum';
import { SolidDoughnutChartConfig } from '../models';
import {
  createSolidDoughnutChartBaseOptions,
  createSolidDoughnutChartSeries,
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
        type: 'pie',
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
          type: 'pie',
          radius: ['40%', '65%'],
          center: ['70%', '50%'],
          top: 0,
          avoidLabelOverlap: true,
          label: {
            position: 'inside',
            formatter: expect.any(Function),
          },
          labelLine: {
            show: false,
          },
        },
        {
          type: 'pie',
          radius: ['0%', '0%'],
          center: ['70%', '50%'],
          top: 0,
          avoidLabelOverlap: true,
          label: {
            position: 'center',
            formatter: title,
          },
          labelLine: {
            show: false,
          },
          legendHoverLink: false,
          data: [
            {
              value: 0,
              name: '',
              itemStyle: { color: 'transparent' },
            },
          ],
        },
      ];

      const result = createSolidDoughnutChartSeries('left', title);

      expect(result).toEqual(expected);
    });
  });
});
