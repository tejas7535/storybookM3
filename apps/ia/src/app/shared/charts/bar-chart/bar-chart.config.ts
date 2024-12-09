import { EChartsOption } from 'echarts';
import { CallbackDataParams } from 'echarts/types/dist/shared';
import {
  OrdinalRawValue,
  TextCommonOption,
} from 'echarts/types/src/util/types';

import { Color } from '../../models';
import { BarChartSerie } from '../models';
import { BarChartConfig } from '../models/bar-chart-config.model';

export function createBarChartOption(config: BarChartConfig): EChartsOption {
  const option: EChartsOption = {
    title: {
      text: config.title,
      padding: 16,
      subtext: 'Sort by: Number of employees ⏷',
      textStyle: {
        fontWeight: 500,
        lineHeight: 24,
      },
      subtextStyle: {
        fontWeight: 400,
        color: Color.TEXT_LOW_EMPHASIS,
        lineHeight: 16,
      },
    },
    textStyle: {
      fontFamily: 'Noto Sans',
    },
    tooltip: {
      axisPointer: {
        type: 'none',
      },
    },
    grid: {
      top: 70,
      left: 170,
      borderWidth: 1,
      borderColor: 'red',
    },
    xAxis: {
      type: 'value',
      max: 20,
      boundaryGap: [0, 0.1],
      axisLabel: {
        formatter: '{value}%',
      },
    },
    yAxis: {
      type: 'category',
      axisLine: {
        show: false,
      },
      inverse: true,
      axisTick: { show: false },
      data: formatCategories(config),
      axisLabel: {
        show: true,
        overflow: 'truncate',
        width: 146,
        formatter: (value: any) => `{a|${value}}`,
        rich: {
          a: {
            align: 'left',
            fontWeight: 500,
            fontSize: 14,
            lineHeight: 20,
            letterSpacing: 0.1,
            color: Color.TEXT_HIGH_EMPHASIS,
          },
        },
      } as any,
    },
  };
  addSeries(config, option);
  addVisualMap(config, option);
  addSlider(config, option);

  return option;
}

export function addSeries(config: BarChartConfig, option: EChartsOption): void {
  const tooltipFontSize = 12;

  option.series = config.series.map((serie) => ({
    name: serie.names[0],
    color: serie.color,
    type: 'bar',
    barCategoryGap: '60%',
    label: {
      distance: 16,
    },
    barWidth: 14,
    data: serie.values.map((value) => value[0]),
    dimensions: serie.names,
    itemStyle: {
      borderRadius: [0, 100, 100, 0],
    },
    markLine: {
      symbol: 'none',
      label: {
        show: false,
      },
      data: [
        {
          xAxis: config.referenceValue,
          lineStyle: {
            color: serie.color,
          },
        },
      ],
      tooltip: {
        formatter: `<table>
            <tr>
              <td class="px-2 text-medium-emphasis">${config.referenceValueText}</td>
              <td class="px-2 text-high-emphasis">{c0}%</td>
            </tr
          </table>
          `,
        confine: true,
        textStyle: {
          fontSize: tooltipFontSize,
        },
      },
    },
    markPoint: {
      symbol: `image://data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' fill='white' viewBox='0 0 16 16'%3E%3Cpath d='M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z'/%3E%3Cpath d='M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z'/%3E%3Cstyle%3E svg %7B background-color:transparent; %7D
      %3C/style%3E%3C/svg%3E`,
      symbolSize: 16,
      symbolOffset: ['-50%', 0],
      data: createMaxDataPoints(serie, config.categories),
      tooltip: {
        show: false,
      },
    },
    tooltip: {
      formatter: (param: CallbackDataParams) => {
        const values = config.series[param.seriesIndex].values[param.dataIndex];

        return `
          <p class="text-caption text-high-emphasis pb-2">${param.name}</p>
          <table>
            <tr>
              <td class="text-medium-emphasis">${param.dimensionNames[0]}</td>
              <td class="pl-4 text-high-emphasis text-center">${values[0]}%</td>
            </tr>
            <tr>
              <td class="text-medium-emphasis">${param.dimensionNames[2]}</td>
              <td class="pl-4 text-high-emphasis text-center">${values[2]}</td>
            </tr>
            <tr>
              <td class="text-medium-emphasis">${param.dimensionNames[1]}</td>
              <td class="pl-4 text-high-emphasis text-center">${values[1]}</td>
            </tr>
          </table>
        `;
      },
      confine: true,
      textStyle: {
        fontSize: tooltipFontSize,
      },
      padding: 16,
      extraCssText: 'width:216px; white-space:wrap;',
    },
  }));
}

export function addVisualMap(
  config: BarChartConfig,
  option: EChartsOption
): void {
  option.visualMap = config.series.map((serie) => ({
    show: true,
    dimension: 0,
    showLabel: true,
    padding: 16,
    itemGap: 16,
    textStyle: {
      color: Color.TEXT_MEDIUM_EMPHASIS,
      fontWeight: 500,
      lineHeight: 16,
      fontSize: 12,
      letterSpacing: 0.5,
    },
    textGap: 8,
    pieces: [
      {
        label: config.belowReferenceValueText,
        colorAlpha: 0.3,
        color: serie.color,
        lte: config.referenceValue,
        symbol: 'circle',
      },
      {
        label: config.aboveReferenceValueText,
        colorAlpha: 1,
        color: serie.color,
        gt: config.referenceValue,
        symbol: 'circle',
      },
    ],
    orient: 'horizontal',
  }));
}

export function addSlider(config: BarChartConfig, option: EChartsOption): void {
  if (config.series[0].values.length > 10) {
    // add scrolling when more than 10 y-axis entries exist
    option.dataZoom = [
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
        moveHandleIcon: 'image://data:image/gif;base64',
        moveHandleStyle: {
          color: Color.TEXT_LOW_EMPHASIS,
          borderCap: 'round',
          opacity: 1,
        },
        moveHandleSize: 8,
        emphasis: {
          moveHandleStyle: {
            color: Color.TEXT_LOW_EMPHASIS,
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
    ];
  }
}

export function formatCategories(config: BarChartConfig): {
  value: OrdinalRawValue;
  textStyle?: TextCommonOption;
}[] {
  return config.categories.map((category) => ({
    value: category,
  }));
}

export function createMaxDataPoints(
  serie: BarChartSerie,
  _categories: string[]
): any[] {
  const dataPoints = [];
  for (let index = 0; index < serie.values.length; index += 1) {
    if (serie.values[index][0] > 20) {
      const point = {
        name: `point${index}`,
        xAxis: 20,
        yAxis: index,
      };
      dataPoints.push(point);
    }
  }

  return dataPoints;
}
