import {
  GridComponentOption,
  ScatterSeriesOption,
  TitleComponentOption,
  TooltipComponentOption,
  XAXisComponentOption,
  YAXisComponentOption,
} from 'echarts';
import { VisualMapOption } from 'echarts/types/src/component/visualMap/VisualMapModel';

import { Color } from '../../shared/models/color.enum';
import { FeatureImportance } from '../models';
import {
  createFeaturesImportanceConfig,
  createTitleOption,
  createXAxisOption,
  createYAxisOption,
  fillDataForFeature,
} from './feature-importance.config';

describe('FeatureImoprtanceConfig', () => {
  describe('createXAxisOption', () => {
    test('should return xAxisOption with name', () => {
      const name = 'X Axis';

      const result = createXAxisOption(name);

      expect(result).toBeDefined();
      expect(result.type).toBe('value');
      expect(result.splitArea.show).toBeTruthy();
      expect(result.splitArea.areaStyle.color).toEqual([Color.LIGHT_GREY_AREA]);
      expect(result.splitLine.show).toBeTruthy();
      expect(result.splitLine.lineStyle.color).toBe(Color.WHITE);
      expect(result.splitLine.lineStyle.width).toBe(2);
      expect(result.splitLine.interval).toBe(1);
      expect(result.axisLine.show).toBeFalsy();
      expect(result.axisLine.onZero).toBeFalsy();
      expect(result.name).toBe(name);
      expect(result.nameLocation).toBe('middle');
      expect(result.nameGap).toBe(25);
    });
  });

  describe('createYAxisOption', () => {
    test('should return yAxisOption with features names', () => {
      const featuresNames = ['A', 'B'];

      const result = createYAxisOption(featuresNames);

      expect(result).toBeDefined();
      expect(result.type).toEqual('value');
      expect((result as any).data).toEqual(featuresNames);
      expect(result.inverse).toBeTruthy();
      expect((result as any).interval).toBe(1);
      expect(result.max).toBe(3);
    });

    test('should return formatted axis label', () => {
      const featuresNames = ['A', 'B'];
      const yAxisOption = createYAxisOption(featuresNames);

      const result = (yAxisOption.axisLabel as any).formatter(2);

      expect(result).toBe(featuresNames[1]);
    });

    test('should return formatted axis label as undefined when zero value', () => {
      const featuresNames = ['A', 'B'];
      const yAxisOption = createYAxisOption(featuresNames);

      const result = (yAxisOption.axisLabel as any).formatter(0);

      expect(result).toBeUndefined();
    });

    test('should return formatted axis label as undefined when negative value', () => {
      const featuresNames = ['A', 'B'];
      const yAxisOption = createYAxisOption(featuresNames);

      const result = (yAxisOption.axisLabel as any).formatter(-1);

      expect(result).toBeUndefined();
    });
  });

  describe('createTitleOption', () => {
    test('should return title with text', () => {
      const text = 'Feature Importance';

      const result = createTitleOption(text);

      expect(result).toBeDefined();
      expect(result.text).toBe(text);
      expect(result.padding).toEqual([20, 30, 40, 29]);
    });
  });

  describe('fillDataForFeature', () => {
    test('should fill serie with data', () => {
      const featureImportance: FeatureImportance = {
        feature: 'Age',
        data: [['18', 0.6, 0.7, 0.2]],
      };
      const idx = 2;
      const series: ScatterSeriesOption[] = [{ data: [] }];
      const interval = 1;

      fillDataForFeature(featureImportance, idx, series, interval);

      expect(series[0]).toBeDefined();
      const featureImportanceData = featureImportance.data;

      expect(series[0].data[0]).toEqual([
        featureImportanceData[0][1],
        3.7,
        featureImportanceData[0][0],
        featureImportanceData[0][3],
      ]);
      expect(series[0].data[1]).toEqual([
        featureImportanceData[0][1],
        3.3,
        featureImportanceData[0][0],
        featureImportanceData[0][3],
      ]);
    });
  });

  describe('createFeaturesImportanceConfig', () => {
    test('should create Feature Importance Config', () => {
      const featuresImportance: FeatureImportance[] = [
        {
          feature: 'Age',
          data: [['18', 0.6, 0.7, 0.2]],
        },
      ];
      const interval = 1;
      const titleText = 'I am the title';
      const xAxisName = 'I am the X Axis Name';

      const result = createFeaturesImportanceConfig(
        featuresImportance,
        interval,
        titleText,
        xAxisName
      );

      expect(result).toBeDefined();
      expect((result.xAxis as XAXisComponentOption[]).length).toBe(1);
      expect((result.yAxis as YAXisComponentOption[]).length).toBe(1);
      expect((result.series as ScatterSeriesOption[]).length).toBe(1);
      expect((result.visualMap as VisualMapOption[]).length).toBe(1);
      expect((result.tooltip as TooltipComponentOption[]).length).toBe(1);
      expect((result.grid as GridComponentOption[]).length).toBe(1);
      expect((result.title as TitleComponentOption[]).length).toBe(1);
    });
  });
});
