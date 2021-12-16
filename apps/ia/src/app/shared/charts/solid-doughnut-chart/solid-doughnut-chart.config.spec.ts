import { EChartsOption } from 'echarts';
import { TooltipOption } from 'echarts/types/src/component/tooltip/TooltipModel';

import { Color } from '../../models/color.enum';
import {
  createMediaQueries,
  createSolidDoughnutChartBaseOptions,
  createSolidDoughnutChartSeries,
  setTooltipFormatter,
} from './solid-doughnut-chart.config';

describe('solid-doughnut-chart config', () => {
  describe('createSolidDoughnutChartBaseOptions', () => {
    test('should create base options', () => {
      const config = {
        title: 'Top 5 reasons',
        subTitle: '2021',
        color: [Color.COLORFUL_CHART_0],
      };
      const expectedResult = {
        type: 'pie',
        backgroundColor: Color.WHITE,
        title: {
          text: config.title,
          textStyle: {
            color: Color.BLACK,
            fontSize: '1.5rem',
            fontWeight: 'normal',
          },
          subtext: config.subTitle,
          subtextStyle: {
            color: Color.LIGHT_GREY,
            fontSize: '1rem',
          },
        },
        color: [Color.COLORFUL_CHART_0],
        legend: {
          show: false,
        },
      };

      const result = createSolidDoughnutChartBaseOptions(config);

      expect(result).toEqual(expectedResult);
    });
  });

  describe('createSolidDoughnutChartSeries', () => {
    test('should create series', () => {
      const title = 'Demo';
      const expectedResult = [
        {
          name: title,
          height: '80%',
          type: 'pie',
          radius: ['65%', '95%'],
          label: {
            formatter: '{d}%',
            position: 'inside',
            color: Color.WHITE,
            fontSize: '0.6rem',
          },
          center: ['50%', '50%'],
          top: 'middle',
        },
      ];

      const result = createSolidDoughnutChartSeries(title);

      expect(result).toEqual(expectedResult);
    });
  });

  describe('setTooltipFormatter', () => {
    test('should set tooltip formatter', () => {
      const option: EChartsOption = {};
      const tooltipFormatter = 'a';

      setTooltipFormatter(option, tooltipFormatter);

      expect((option.tooltip as TooltipOption).formatter).toEqual(
        tooltipFormatter
      );
      expect((option.tooltip as TooltipOption).show).toBeTruthy();
    });

    test('should not set tooltip formatter if formatter undefined', () => {
      const option: EChartsOption = {};

      setTooltipFormatter(option, undefined as string);

      expect(option.tooltip).toBeUndefined();
    });
  });

  describe('createMediaQueries', () => {
    test('should return media queries', () => {
      const media = createMediaQueries();

      expect(media).toEqual([
        {
          query: {
            minWidth: 450,
            maxWidth: 750,
          },
          option: {
            height: '70%',
          },
        },
        {
          query: {
            maxWidth: 450,
          },
          option: {
            height: '80%',
          },
        },
        {
          query: {
            minWidth: 750,
          },
          option: {
            height: '80%',
          },
        },
      ]);
    });
  });
});
