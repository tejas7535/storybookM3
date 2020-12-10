import { EChartOption } from 'echarts';

import { ChartSettings } from '../models';
import { lowPrecisionFormatter, scientificFormatter } from './chart-formatters';
import { GRAPH_DEFINITIONS_WOEHLER } from './graph-definitions-woehler';

export const CHART_SETTINGS_WOEHLER: ChartSettings = {
  sources: GRAPH_DEFINITIONS_WOEHLER,
  argumentAxis: {
    name: 'prediction.chart.woehlerXLabel',
    nameLocation: 'center',
    showLabel: true,
    format: 'exponential',
    showGrid: true,
    showMinorGrid: true,
    type: 'log',
  },
  valueAxis: {
    name: 'prediction.chart.woehlerYLabel',
    nameLocation: 'center',
    showLabel: false,
    format: '',
    showGrid: false,
    showMinorGrid: false,
    type: 'log',
  },
};

export const CHART_OPTIONS_WOEHLER: EChartOption = {
  xAxis: {
    type: CHART_SETTINGS_WOEHLER.argumentAxis.type,
    name: CHART_SETTINGS_WOEHLER.argumentAxis.name,
    nameTextStyle: {
      fontSize: 16,
      color: '#4c4c4c',
      fontWeight: 'normal',
      fontStyle: 'normal',
    },
    nameLocation: CHART_SETTINGS_WOEHLER.argumentAxis.nameLocation,
    nameGap: 40,
    min: 10000,
    max: 10000000,
    axisLabel: {
      fontSize: 16,
      formatter: scientificFormatter,
    },
  },
  yAxis: {
    type: CHART_SETTINGS_WOEHLER.valueAxis.type,
    name: CHART_SETTINGS_WOEHLER.valueAxis.name,
    nameTextStyle: {
      fontSize: 16,
      color: '#4c4c4c',
      fontWeight: 'normal',
      fontStyle: 'normal',
    },
    nameLocation: CHART_SETTINGS_WOEHLER.valueAxis.nameLocation,
    nameGap: 50,
    axisPointer: {
      show: true,
      type: 'line',
      label: {
        precision: 2,
      },
    },
    axisLabel: {
      fontSize: 16,
      formatter: lowPrecisionFormatter,
    },
  },
  series: [
    {
      type: 'line',
      name: 'loads',
      lineStyle: {
        color: '#e62c27',
      },
      encode: {
        x: 'x',
        y: 'y',
      },
      symbol: 'none',
    },
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
      symbol: 'none',
    },
    {
      type: 'line',
      name: 'ml-prediction',
      lineStyle: {
        color: '#00893D',
      },
      encode: {
        x: 'x',
        y: 'y2',
      },
      symbol: 'none',
    },
    {
      type: 'line',
      name: 'p1',
      lineStyle: {
        color: '#003A54',
        type: 'dashed',
      },
      encode: {
        x: 'x',
        y: 'y3',
      },
      symbol: 'none',
    },
    {
      type: 'line',
      name: 'p99',
      lineStyle: {
        color: '#003A54',
        type: 'dashed',
      },
      encode: {
        x: 'x',
        y: 'y4',
      },
      symbol: 'none',
    },
    {
      type: 'line',
      name: 'p10',
      lineStyle: {
        color: '#777D7F',
        type: 'dashed',
      },
      encode: {
        x: 'x',
        y: 'y5',
      },
      symbol: 'none',
    },
    {
      type: 'line',
      name: 'p90',
      lineStyle: {
        color: '#777D7F',
        type: 'dashed',
      },
      encode: {
        x: 'x',
        y: 'y6',
      },
      symbol: 'none',
    },
    {
      type: 'line',
      name: 'fkm',
      lineStyle: {
        color: '#fccf46',
      },
      encode: {
        x: 'x',
        y: 'y7',
      },
      symbol: 'none',
    },
    {
      type: 'line',
      name: 'murakami',
      lineStyle: {
        color: '#1d9bb2',
      },
      encode: {
        x: 'x',
        y: 'y8',
      },
      symbol: 'none',
    },
    {
      type: 'line',
      name: 'non-linear-regression',
      lineStyle: {
        color: '#9c27b0',
      },
      encode: {
        x: 'x',
        y: 'y9',
      },
      symbol: 'none',
    },
  ],
  dataset: {
    dimensions: [
      { name: 'x', type: 'int' }, // cycles
      { name: 'y', type: 'float' }, // loads
      { name: 'y1', type: 'float' }, // appliedStress
      { name: 'y2', type: 'float' }, // ml prediction
      { name: 'y3', type: 'float' }, // percentile 1
      { name: 'y4', type: 'float' }, // percentile 99
      { name: 'y5', type: 'float' }, // percentile 10
      { name: 'y6', type: 'float' }, // percentile 90
      { name: 'y7', type: 'float' }, // fkm
      { name: 'y8', type: 'float' }, // murakami
      { name: 'y9', type: 'float' }, // non-linear regression
    ],
    source: [],
  },
};
