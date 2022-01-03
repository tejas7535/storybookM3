import { EChartsOption } from 'echarts';
import { CallbackDataParams } from 'echarts/types/dist/shared';
import {
  OrdinalRawValue,
  TextCommonOption,
} from 'echarts/types/src/util/types';

import { Color } from '../../models';
import { BarChartConfig } from '../models/bar-chart-config.model';

export function createBarChartOption(config: BarChartConfig): EChartsOption {
  const option: EChartsOption = {
    title: {
      text: config.title,
      padding: [20, 30, 40, 29],
    },
    tooltip: {
      axisPointer: {
        type: 'none',
      },
    },
    grid: { left: '29%' },
    xAxis: {
      type: 'value',
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
        overflow: 'break',
        width: 90,
        formatter: (value: any) => `{a|${value}}`,
        rich: {
          a: { align: 'left', fontWeight: 'bold' },
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
            color: Color.DARK_GREY,
          },
        },
      ],
      tooltip: {
        formatter: `<b>{c0}%</b>&emsp;${config.referenceValueText}`,
        confine: true,
        textStyle: {
          fontSize: tooltipFontSize,
        },
      },
    },
    tooltip: {
      formatter: (param: CallbackDataParams) => {
        const values = config.series[param.seriesIndex].values[param.dataIndex];

        return `
          <b>${values[0]}%</b>&emsp;${param.dimensionNames[0]}<br>
          <b>${values[1]}</b>&emsp;${param.dimensionNames[1]}
        `;
      },
      confine: true,
      textStyle: {
        fontSize: tooltipFontSize,
      },
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
    pieces: [
      {
        label: config.belowReferenceValueText,
        colorAlpha: 0.3,
        color: serie.color,
        lte: config.referenceValue,
      },
      {
        label: config.aboveReferenceValueText,
        colorAlpha: 1,
        color: serie.color,
        gt: config.referenceValue,
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
          color: 'rgba(0, 0, 0, 0.38)',
          borderCap: 'round',
          opacity: 1,
        },
        moveHandleSize: 8,
        emphasis: {
          moveHandleStyle: {
            color: 'rgba(0, 0, 0, 0.38)',
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
    textStyle: { fontWeight: 'bold' },
  }));
}
