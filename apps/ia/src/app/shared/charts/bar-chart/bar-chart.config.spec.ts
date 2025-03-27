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
  TooltipFormatterCallback,
} from 'echarts/types/src/util/types';

import { Color } from '../../models/color';
import { BarChartSerie } from '../models';
import { BarChartConfig } from '../models/bar-chart-config.model';
import {
  addSeries,
  addSlider,
  addVisualMap,
  createBarChartOption,
  createMaxDataPoints,
} from './bar-chart.config';

describe('Bar Chart Config', () => {
  const config: BarChartConfig = {
    title: 'Age',
    subtitle: 'Headcount: 12 | Leavers: 2',
    referenceValue: {
      value: 35,
      aboveText: 'Above average',
      belowText: 'Below average',
    },
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
      '29',
      '30',
      '31',
      '32',
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
          [60, 600],
          [60, 600],
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
        7, 9, 35, 10, 60, 7, 9, 35, 10, 60, 60, 60, 60, 60, 60,
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
      ).toEqual(config.referenceValue.belowText);
      expect(
        (result.visualMap as PiecewiseVisualMapOption[])[0].pieces[1].label
      ).toEqual(config.referenceValue.aboveText);
      expect(
        (result.visualMap as PiecewiseVisualMapOption[])[0].pieces[0].lte
      ).toEqual(config.referenceValue.value);
      expect(
        (result.visualMap as PiecewiseVisualMapOption[])[0].pieces[1].gt
      ).toEqual(config.referenceValue.value);
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
    let option: EChartsOption;
    beforeEach(() => {
      option = {} as EChartsOption;

      addSeries(config, option);
    });

    test('should add series', () => {
      expect((option.series as SeriesOption[]).length).toEqual(1);
      expect((option.series as SeriesOption[])[0].data).toEqual([
        7, 9, 35, 10, 60, 7, 9, 35, 10, 60, 60, 60, 60, 60, 60,
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
      ).toEqual(config.referenceValue.value);
    });

    test('should tooltip formatter return data', () => {
      const tooltip = (
        (option.series as BarSeriesOption[])[0].tooltip
          .formatter as TooltipFormatterCallback<any>
      )(
        {
          seriesIndex: 0,
          dataIndex: 0,
          name: 'Some name',
          dimensionNames: ['Attr. Rate', 'num. Employees', 'Age'],
        },
        '',
        () => {}
      );

      expect(tooltip).toEqual(`
          <p class="text-body-small text-on-surface pb-2">Some name</p>
          <table>
            <tr>
              <td class="text-on-surface-variant">Attr. Rate</td>
              <td class="pl-4 text-on-surface text-center">7.0%</td>
            </tr>
            <tr>
              <td class="text-on-surface-variant">Age</td>
              <td class="pl-4 text-on-surface text-center">0</td>
            </tr>
            <tr>
              <td class="text-on-surface-variant">num. Employees</td>
              <td class="pl-4 text-on-surface text-center">230.0</td>
            </tr>
          </table>
        `);
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
        itemGap: 16,
        showLabel: true,
        padding: 16,
        pieces: [
          {
            label: config.referenceValue.belowText,
            colorAlpha: 0.3,
            color: config.series[0].color,
            lte: config.referenceValue.value,
            symbol: 'circle',
          },
          {
            label: config.referenceValue.aboveText,
            colorAlpha: 1,
            color: config.series[0].color,
            gt: config.referenceValue.value,
            symbol: 'circle',
          },
        ],
        orient: 'horizontal',
        textGap: 8,
        textStyle: {
          color: '#828282',
          fontWeight: 500,
          lineHeight: 16,
          fontSize: 12,
          letterSpacing: 0.5,
        },
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
          minValueSpan: 13,
          filterMode: 'none',
          moveHandleIcon: 'image://data:image/gif;base64',
          moveHandleStyle: {
            color: '#828282',
            borderCap: 'round',
            opacity: 1,
          },
          moveHandleSize: 8,
          emphasis: {
            moveHandleStyle: {
              color: '#828282',
              borderCap: 'round',
            },
          },
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

  describe('createMaxDataPoints', () => {
    test('should create max data points', () => {
      const values: number[][] = [
        [7, 230],
        [9, 40],
        [35, 400],
        [10, 100],
      ];

      const serie = new BarChartSerie(
        ['Attr. Rate', 'num. Employees'],
        values,
        Color.LIME
      );

      const result = createMaxDataPoints(serie, 10);

      expect(result).toEqual([{ name: 'point2', xAxis: 10, yAxis: 2 }]);
    });
  });
});
