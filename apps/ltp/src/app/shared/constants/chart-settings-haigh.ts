import { EChartOption } from 'echarts';

import { ChartSettings } from '../models';
import { lowPrecisionFormatter } from './chart-formatters';
import { GRAPH_DEFINITIONS_HAIGH } from './graph-definitions-haigh';

export const CHART_SETTINGS_HAIGH: ChartSettings = {
  sources: GRAPH_DEFINITIONS_HAIGH,
  argumentAxis: {
    name: 'prediction.chart.haighXLabel',
    nameLocation: 'center',
    showLabel: true,
    format: '',
    showGrid: true,
    showMinorGrid: true,
    type: 'value',
  },
  valueAxis: {
    name: 'prediction.chart.haighYLabel',
    nameLocation: 'center',
    showLabel: true,
    format: '',
    showGrid: true,
    showMinorGrid: true,
    type: 'value',
  },
};

export const CHART_OPTIONS_HAIGH: EChartOption = {
  xAxis: {
    type: CHART_SETTINGS_HAIGH.argumentAxis.type,
    name: CHART_SETTINGS_HAIGH.argumentAxis.name,
    nameTextStyle: {
      fontSize: 16,
    },
    nameLocation: CHART_SETTINGS_HAIGH.argumentAxis.nameLocation,
    nameGap: 40,
    axisLabel: {
      fontSize: 16,
      formatter: lowPrecisionFormatter,
    },
  },
  yAxis: {
    type: CHART_SETTINGS_HAIGH.valueAxis.type,
    name: CHART_SETTINGS_HAIGH.valueAxis.name,
    nameTextStyle: {
      fontSize: 16,
      color: '#4c4c4c',
    },
    nameLocation: CHART_SETTINGS_HAIGH.valueAxis.nameLocation,
    nameGap: 50,
    axisLabel: {
      fontSize: 16,
      formatter: lowPrecisionFormatter,
    },
  },
  series: [
    {
      type: 'line',
      name: 'appliedStress',
      lineStyle: {
        color: '#A1C861',
      },
      encode: {
        x: 'x',
        y: 'y1',
      },
    },
    {
      type: 'line',
      name: 'snCurve',
      lineStyle: {
        color: '#00893D',
      },
      encode: {
        x: 'x',
        y: 'y2',
      },
    },
    {
      type: 'line',
      name: 'fkm',
      lineStyle: {
        color: '#fccf46',
      },
      encode: {
        x: 'x',
        y: 'y3',
      },
    },
    {
      type: 'line',
      name: 'murakami',
      lineStyle: {
        color: '#1d9bb2',
      },
      encode: {
        x: 'x',
        y: 'y4',
      },
    },
    {
      type: 'line',
      name: 'statistical',
      lineStyle: {
        color: '#9c27b0',
      },
      encode: {
        x: 'x',
        y: 'y5',
      },
    },
  ],
  dataset: {
    dimensions: [
      { name: 'x', type: 'float' },
      { name: 'y1', type: 'float' },
      { name: 'y2', type: 'float' },
      { name: 'y3', type: 'float' },
      { name: 'y4', type: 'float' },
      { name: 'y5', type: 'float' },
    ],
    source: [],
  },
};
