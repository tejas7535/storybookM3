import {
  EChartsOption,
  GridComponentOption,
  ScatterSeriesOption,
  XAXisComponentOption,
  YAXisComponentOption,
} from 'echarts';
import { TitleOption } from 'echarts/types/dist/shared';

import { Color } from '../../shared/models/color.enum';
import {
  FeatureImportance,
  FeatureImportanceDataPoint,
  FeatureImportanceType,
} from '../models';
import { calculateColor } from './feature-importance.utils';

export const createFeaturesImportanceConfig = (
  featuresImportance: FeatureImportance[],
  titleText: string,
  xAxisName: string
): EChartsOption => {
  const featuresNames = featuresImportance.map(
    (featureImportance: FeatureImportance) => featureImportance.feature
  );
  const xAxis: XAXisComponentOption[] = [createXAxisOption(xAxisName)];
  const yAxis: YAXisComponentOption[] = [createYAxisOption(featuresNames)];
  const series: ScatterSeriesOption[] = [];
  const grid: GridComponentOption[] = [gridOption];
  const title: TitleOption[] = [createTitleOption(titleText)];

  featuresImportance.forEach((feature) => {
    fillDataForFeature(feature, series);
  });

  return {
    xAxis,
    yAxis,
    series,
    tooltip: {
      trigger: 'item',
    },
    grid,
    title,
  };
};

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
  min: -1,
  max: featuresNames.length,
  interval: 1,
  axisLabel: {
    formatter: (value: any) => featuresNames[value],
  },
});

export const fillDataForFeature = (
  feature: FeatureImportance,
  series: ScatterSeriesOption[]
): void => {
  const serie: ScatterSeriesOption = {
    animation: false,
    coordinateSystem: 'cartesian2d',
    type: 'scatter',
    symbolSize: 4,
    progressive: 0,
  };
  setData(feature, serie);

  series.push(serie);
};

export const setData = (
  feature: FeatureImportance,
  serie: ScatterSeriesOption
): void => {
  if (feature.type === FeatureImportanceType.NUMERIC) {
    serie.data = feature.data.map((data) => mapToValueWithStyle(data));
    serie.tooltip = {
      formatter: (params) =>
        seriesTooltipFormatter((params.data as any).value as number[]),
      position: 'right',
    };
  } else {
    serie.data = feature.data;
    serie.color = Color.DARK_GREY;
    serie.large = true;
    serie.tooltip = {
      formatter: (params) => seriesTooltipFormatter(params.data as number[]),
      position: 'right',
    };
  }
};

export const mapToValueWithStyle = (
  dataPoint: FeatureImportanceDataPoint
): { value: any; itemStyle: { color: string } } => ({
  value: dataPoint,
  itemStyle: {
    color: calculateColor(+dataPoint[3]), // dataPoint[3] - percentage of gradient
  },
});

// dataPoint[2] - feature's value, dataPoint[0] - SHAP value
export const seriesTooltipFormatter = (dataPoint: FeatureImportanceDataPoint) =>
  `Value: ${dataPoint[2]}<br/> Importance: ${Number(dataPoint[0]).toPrecision(
    2
  )}`;

export const gridOption: GridComponentOption = {
  left: 100,
  right: 8,
};

export const createTitleOption = (text: string): TitleOption =>
  ({
    text,
    padding: [20, 30, 40, 29],
  } as TitleOption);
