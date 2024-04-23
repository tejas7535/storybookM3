import { translate } from '@jsverse/transloco';
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
  FeatureImportanceDataPoint,
  FeatureImportanceGroup,
  FeatureImportanceType,
} from '../models';
import { calculateColor } from './feature-importance.utils';

export const createFeaturesImportanceConfig = (
  featuresImportanceGroups: FeatureImportanceGroup[]
): EChartsOption => {
  const series: ScatterSeriesOption[] = [];

  const translatedFeatureGroups = featuresImportanceGroups.map((group) => ({
    ...group,
    feature: translate(`attritionAnalytics.features.${group.feature}`),
  }));

  translatedFeatureGroups.forEach((feature, index) => {
    fillDataForFeature(feature, series, index);
  });

  const featuresNames = translatedFeatureGroups.map(
    (featureImportance: FeatureImportanceGroup) => featureImportance.feature
  );

  const xAxisname: string = translate(
    'attritionAnalytics.featureImportance.xAxisName'
  );
  const titleText: string = translate(
    'attritionAnalytics.featureImportance.title'
  );
  const xAxis: XAXisComponentOption[] = [createXAxisOption(xAxisname)];
  const yAxis: YAXisComponentOption[] = [createYAxisOption(featuresNames)];

  const grid: GridComponentOption[] = [gridOption];
  const title: TitleOption[] = [createTitleOption(titleText)];

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

/**
 * All following functions are only exported for testing.
 **/
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
): YAXisComponentOption & { data: string[] } => ({
  type: 'value',
  data: featuresNames,
  min: -1,
  max: featuresNames.length,
  interval: 1,
  axisLabel: {
    formatter: (value: any) => featuresNames[value],
  },
});

export const fillDataForFeature = (
  feature: FeatureImportanceGroup,
  series: ScatterSeriesOption[],
  index: number
): void => {
  const serie: ScatterSeriesOption = {
    coordinateSystem: 'cartesian2d',
    type: 'scatter',
    symbolSize: 4,
  };
  setData(feature, serie, index);

  series.push(serie);
};

export const setData = (
  feature: FeatureImportanceGroup,
  serie: ScatterSeriesOption,
  index: number
): void => {
  const avgYPosOfFeature = getAverageOfYAxisInDataPoints(feature.dataPoints);

  if (feature.type === FeatureImportanceType.NUMERIC) {
    setSeriesForNumericFeature(
      serie,
      feature.dataPoints,
      avgYPosOfFeature,
      index,
      feature.feature
    );
  } else {
    setSeriesForCategoricalFeature(
      serie,
      feature.dataPoints,
      avgYPosOfFeature,
      index,
      feature.feature
    );
  }
};

export const getAverageOfYAxisInDataPoints = (
  dataPoints: FeatureImportanceDataPoint[]
): number => {
  const sum: number = dataPoints
    .map((val) => val.yaxisPos)
    .reduce((a, b) => a + b, 0);

  return sum / dataPoints.length || 0;
};

export const setSeriesForNumericFeature = (
  serie: ScatterSeriesOption,
  dataPoints: FeatureImportanceDataPoint[],
  avgYPosOfFeature: number,
  index: number,
  feature: string
): void => {
  serie.data = dataPoints.map((dataPoint) =>
    mapToValueWithStyle(
      dataPoint,
      dataPoint.yaxisPos - avgYPosOfFeature + index // move value entries to correct y-position according own index
    )
  );
  serie.tooltip = {
    formatter: (params) =>
      seriesTooltipFormatter((params.data as any).value as number[], feature),
    position: 'right',
  };
};

export const setSeriesForCategoricalFeature = (
  serie: ScatterSeriesOption,
  dataPoints: FeatureImportanceDataPoint[],
  avgYPosOfFeature: number,
  index: number,
  feature: string
): void => {
  serie.data = dataPoints.map((dataPoint) =>
    mapDataPointToScatterData(
      dataPoint,
      dataPoint.yaxisPos - avgYPosOfFeature + index // move value entries to correct y-position according own index
    )
  );
  serie.color = Color.DARK_GREY;
  serie.large = true;
  serie.tooltip = {
    formatter: (params) =>
      seriesTooltipFormatter(params.data as number[], feature),
    position: 'right',
  };
};

export const mapToValueWithStyle = (
  dataPoint: FeatureImportanceDataPoint,
  normalizedYAxisValue: number
): { value: any; itemStyle: { color: string } } => ({
  value: mapDataPointToScatterData(dataPoint, normalizedYAxisValue),
  itemStyle: {
    color: calculateColor(+dataPoint.colorMap),
  },
});

export const mapDataPointToScatterData = (
  dataPoint: FeatureImportanceDataPoint,
  normalizedYAxisValue: number
): (number | string)[] => {
  const result = [
    dataPoint.shapValue,
    normalizedYAxisValue,
    dataPoint.yaxisPos,
    dataPoint.value,
  ];

  // colorMap may not be set
  if (dataPoint.colorMap !== null) {
    result.push(dataPoint.colorMap);
  }

  return result;
};

export const seriesTooltipFormatter = (
  dataPoint: (string | number)[],
  feature: string
) => {
  const tooltipText = `<table>
      <tr>
        <td class="pr-4">Feature:</td>
        <td><b>${feature}</b></td>
      </tr>
      <tr>
      <td class="pr-4">Value:</td>
      <td><b>${dataPoint[3]}</b></td>
      </tr>
      <tr>
        <td class="pr-4">Importance:</td>
        <td><b>${Number(dataPoint[0]).toPrecision(2)}</b></td>
      </tr>
      </table>`;

  return tooltipText;
};

const MARGIN_X = 12;

export const gridOption: GridComponentOption = {
  left: MARGIN_X,
  right: MARGIN_X,
  containLabel: true,
};

export const createTitleOption = (text: string): TitleOption =>
  ({
    text,
    padding: [20, 30, 40, 29],
  }) as TitleOption;
