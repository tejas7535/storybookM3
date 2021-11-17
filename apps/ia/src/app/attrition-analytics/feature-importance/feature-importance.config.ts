import {
  EChartsOption,
  GridComponentOption,
  ScatterSeriesOption,
  TooltipComponentOption,
  VisualMapComponentOption,
  XAXisComponentOption,
  YAXisComponentOption,
} from 'echarts';
import { TitleOption } from 'echarts/types/dist/shared';

import { Color } from '../../shared/models/color.enum';
import { FeatureImportance } from '../models';

export const createXAxisOption = (name: string): XAXisComponentOption => ({
  type: 'value',
  splitArea: {
    show: true,
    areaStyle: {
      color: [Color.LIGHT_GREY_AREA],
    },
  },
  splitLine: {
    show: true,
    lineStyle: {
      color: Color.WHITE,
      width: 2,
    },
    interval: 1,
  },
  axisLine: {
    show: false,
    onZero: false,
  },
  name,
  nameLocation: 'middle',
  nameGap: 25,
});

export const createYAxisOption = (
  featuresNames: string[]
): YAXisComponentOption => ({
  type: 'value',
  data: featuresNames,
  inverse: true,
  interval: 1,
  axisLabel: {
    formatter: (value: any) =>
      value > 0 ? featuresNames[value - 1] : undefined,
  },
  max: featuresNames.length + 1,
});

export const scatterSeriesOption: ScatterSeriesOption = {
  yAxisIndex: 0,
  coordinateSystem: 'cartesian2d',
  type: 'scatter',
  data: [],
  symbol: 'circle',
  symbolSize: 12,
};

export const visualMapOption: VisualMapComponentOption = {
  show: true,
  dimension: 3,
  min: -1,
  max: 1,
  range: [-0.9999, 1.0001],
  orient: 'vertical',
  left: 'right',
  top: 'middle',
  itemHeight: 460,
  inRange: {
    color: ['#0A7EE9', '#FD2153'],
  },
  outOfRange: {
    color: 'grey',
  },
  text: ['High', 'Low'],
  formatter: (value) => Number(value.toString()).toPrecision(2),
};

export const tooltipOption: TooltipComponentOption = {
  show: true,
  formatter: (params: any) =>
    `Value: ${params.data[2]}<br/> Importance: ${params.data[3]}`,
};

export const gridOption: GridComponentOption = {
  width: '65%',
  left: 100,
};

export const createTitleOption = (text: string): TitleOption =>
  ({
    text,
    padding: [20, 30, 40, 29],
  } as TitleOption);

export const fillDataForFeature = (
  feature: FeatureImportance,
  idx: number,
  series: ScatterSeriesOption[],
  interval: number
): void => {
  feature.data.forEach((dataItem) => {
    // shift value on y-axis to simulate multi series. Each next feature is shifted with index and a constant.
    const shifValue = idx + interval;
    const diff = 1 - Number(dataItem[2]);

    (series as any)[0].data.push([
      dataItem[1],
      +dataItem[2] + shifValue,
      dataItem[0],
      dataItem[3],
    ]);

    // generating mirror reflected point, probably not needed when dealing with real data
    (series as any)[0].data.push([
      dataItem[1],
      shifValue + diff,
      dataItem[0],
      dataItem[3],
    ]);
  });
};

export const createFeaturesImportanceConfig = (
  featuresImportance: FeatureImportance[],
  interval: number,
  titleText: string,
  xAxisName: string
): EChartsOption => {
  const featuresNames = featuresImportance.map(
    (featureImportance) => featureImportance.feature
  );
  const xAxis: XAXisComponentOption[] = [createXAxisOption(xAxisName)];
  const yAxis: YAXisComponentOption[] = [createYAxisOption(featuresNames)];
  const series: ScatterSeriesOption[] = [scatterSeriesOption];
  const visualMap: VisualMapComponentOption[] = [visualMapOption];
  const tooltip: TooltipComponentOption[] = [tooltipOption];
  const grid: GridComponentOption[] = [gridOption];
  const title: TitleOption[] = [createTitleOption(titleText)];

  featuresImportance.forEach((feature, idx) => {
    fillDataForFeature(feature, idx, series, interval);
  });

  return {
    xAxis,
    yAxis,
    series,
    visualMap,
    tooltip,
    grid,
    title,
  };
};
