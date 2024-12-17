import { EChartsOption } from 'echarts';
import { CallbackDataParams } from 'echarts/types/dist/shared';

import { Color } from '../../models/color';
import { SolidDoughnutChartConfig } from '../models';
import {
  createSolidDoughnutChartBaseOptions,
  createSolidDoughnutChartSeries,
  tooltipFormatter,
} from './solid-doughnut-chart.config';

describe('solid-doughnut-chart config', () => {
  describe('createSolidDoughnutChartBaseOptions', () => {
    let config: SolidDoughnutChartConfig;

    beforeEach(() => {
      config = {
        title: 'Top 5 reasons',
        subTitle: {},
        color: [Color.GREEN],
        side: 'left',
      };
    });

    test('should create base options', () => {
      const expectedResult = {
        backgroundColor: Color.WHITE,
        color: [Color.GREEN],
        title: {
          text: config.title,
          textStyle: {
            fontFamily: 'Noto Sans',
            color: Color.TEXT_MEDIUM_EMPHASIS,
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

    test('should cut labels in legend if it is too long', () => {
      const longMessage =
        'Some very long label that should be cut in the legend';
      const expected =
        'Some very long label that should \nbe cut in the legend';

      const baseOptions = createSolidDoughnutChartBaseOptions(config);

      expect((baseOptions.legend as any).formatter(longMessage)).toEqual(
        expected
      );
    });
  });

  describe('createSolidDoughnutChartSeries', () => {
    test('should create chart series', () => {
      const title = {};
      const subTitle = 'Some detailes';
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
            show: true,
            formatter: subTitle,
          },
        },
      ];

      const result = createSolidDoughnutChartSeries('left', title, subTitle);

      expect(result).toEqual(expected);
    });

    test('should reasons formatter return percentage', () => {
      const params = {
        data: { percent: 50 },
      };
      const expected = '50.0%';

      const result = (
        createSolidDoughnutChartSeries('left', {}, '')[0].label.formatter as any
      )(params as unknown as CallbackDataParams);

      expect(result).toEqual(expected);
    });

    test('should detailedReasons formatter return percentage', () => {
      const params = {
        data: { percent: 50 },
      };
      const expected = '50.0%';

      const result = (
        createSolidDoughnutChartSeries('left', {}, '')[1].label.formatter as any
      )(params as unknown as CallbackDataParams);

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
