import {
  BarSeriesOption,
  DataZoomComponentOption,
  EChartsOption,
  SeriesOption,
  VisualMapComponentOption,
} from 'echarts';
import {
  MarkLineOption,
  PiecewiseVisualMapOption,
  TitleOption,
  YAXisOption,
} from 'echarts/types/dist/shared';
import { CategoryAxisBaseOption } from 'echarts/types/src/coord/axisCommonTypes';
import {
  OrdinalRawValue,
  TextCommonOption,
} from 'echarts/types/src/util/types';

import { Color } from '../../models/color.enum';
import { BarChartConfig } from '../models/bar-chart-config.model';
import {
  addSeries,
  addSlider,
  addVisualMap,
  createBarChartOption,
} from './bar-chart.config';

describe('Bar Chart Config', () => {
  const config: BarChartConfig = {
    title: 'Age',
    average: 35,
    aboveAverageText: 'Above average',
    belowAverageText: 'Below average',
    categories: [
      '18',
      '19',
      '20',
      '21',
      '22',
      '23',
      '24',
      '25',
      '26',
      '27',
      '28',
    ],
    series: [
      {
        names: ['Attr. Rate', 'num. Employees'],
        color: Color.LIME,
        values: [
          [7, 230],
          [9, 40],
          [35, 400],
          [10, 100],
          [60, 600],
          [7, 230],
          [9, 40],
          [35, 400],
          [10, 100],
          [60, 600],
          [60, 600],
        ],
      },
    ],
  };

  describe('createBarChartConfig', () => {
    test('should create bar chart config', () => {
      const result = createBarChartOption(config);

      expect(result).toBeDefined();
      expect((result.title as TitleOption).text).toEqual(config.title);
      expect((result.series as SeriesOption[])[0].data).toEqual([
        7, 9, 35, 10, 60, 7, 9, 35, 10, 60, 60,
      ]);
      expect((result.yAxis as YAXisOption).type).toEqual('category');
      expect((result.yAxis as CategoryAxisBaseOption).data.length).toEqual(
        config.categories.length
      );
      expect(
        (
          (result.yAxis as CategoryAxisBaseOption).data as {
            value: OrdinalRawValue;
            textStyle?: TextCommonOption;
          }[]
        ).map((item) => item.value)
      ).toEqual(config.categories);
      expect((result.yAxis as YAXisOption).inverse).toBeTruthy();
      expect((result.visualMap as PiecewiseVisualMapOption[]).length).toEqual(
        1
      );
      expect(
        (result.visualMap as PiecewiseVisualMapOption[])[0].pieces.length
      ).toEqual(2);
      expect(
        (result.visualMap as PiecewiseVisualMapOption[])[0].pieces[0].label
      ).toEqual(config.belowAverageText);
      expect(
        (result.visualMap as PiecewiseVisualMapOption[])[0].pieces[1].label
      ).toEqual(config.aboveAverageText);
      expect(
        (result.visualMap as PiecewiseVisualMapOption[])[0].pieces[0].lte
      ).toEqual(config.average);
      expect(
        (result.visualMap as PiecewiseVisualMapOption[])[0].pieces[1].gt
      ).toEqual(config.average);
      expect((result.dataZoom as DataZoomComponentOption[]).length).toEqual(2);
      expect((result.dataZoom as DataZoomComponentOption[])[0].type).toEqual(
        'slider'
      );
      expect((result.dataZoom as DataZoomComponentOption[])[1].type).toEqual(
        'inside'
      );
    });
  });

  describe('addSeries', () => {
    test('should add series', () => {
      const option = {} as EChartsOption;

      addSeries(config, option);

      expect((option.series as SeriesOption[]).length).toEqual(1);
      expect((option.series as SeriesOption[])[0].data).toEqual([
        7, 9, 35, 10, 60, 7, 9, 35, 10, 60, 60,
      ]);
      expect((option.series as SeriesOption[])[0].color).toEqual(
        config.series[0].color
      );
      expect((option.series as SeriesOption[])[0].type).toEqual('bar');
      expect((option.series as BarSeriesOption[])[0].barCategoryGap).toEqual(
        '60%'
      );
      expect((option.series as BarSeriesOption[])[0].barWidth).toEqual(14);
      expect((option.series as BarSeriesOption[])[0].dimensions).toEqual(
        config.series[0].names
      );
      expect(
        (option.series as BarSeriesOption[])[0].itemStyle.borderRadius
      ).toEqual([0, 100, 100, 0]);
      expect(
        (
          ((option.series as BarSeriesOption[])[0].markLine as MarkLineOption)
            .data[0] as { xAxis: number }
        ).xAxis
      ).toEqual(config.average);
    });
  });

  describe('addVisualMap', () => {
    test('should add visual map', () => {
      const option = {} as EChartsOption;

      addVisualMap(config, option);

      expect((option.visualMap as VisualMapComponentOption[]).length).toEqual(
        1
      );
      expect((option.visualMap as VisualMapComponentOption[])[0]).toEqual({
        show: true,
        dimension: 0,
        itemSymbol: 'circle',
        showLabel: true,
        pieces: [
          {
            label: config.belowAverageText,
            colorAlpha: 0.3,
            color: config.series[0].color,
            lte: config.average,
          },
          {
            label: config.aboveAverageText,
            colorAlpha: 1,
            color: config.series[0].color,
            gt: config.average,
          },
        ],
        orient: 'horizontal',
      });
    });
  });

  describe('addSlider', () => {
    test('should add slider when more than 10 items', () => {
      const option = {} as EChartsOption;

      addSlider(config, option);

      expect(option.dataZoom).toEqual([
        {
          type: 'slider',
          show: true,
          yAxisIndex: 0,
          left: '97%',
          start: 0,
          end: 0,
          width: 0,
          handleSize: 0,
          fillerColor: 'transparent',
          borderColor: 'transparent',
          backgroundColor: 'white',
          showDataShadow: false,
          showDetail: false,
          minValueSpan: 9,
          filterMode: 'none',
        },
        {
          type: 'inside',
          yAxisIndex: 0,
          filterMode: 'weakFilter',
          zoomOnMouseWheel: false,
          moveOnMouseMove: true,
          moveOnMouseWheel: true,
        },
      ]);
    });

    test('should not add slider when less than 10 items', () => {
      const option = {} as EChartsOption;
      const configLessItems = {
        series: [
          {
            values: [
              [12, 10],
              [13, 11],
            ],
          },
        ],
      } as BarChartConfig;

      addSlider(configLessItems, option);

      expect(option.dataZoom).toBeUndefined();
    });
  });
});
