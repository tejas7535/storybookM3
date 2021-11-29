import {
  GridComponentOption,
  ScatterSeriesOption,
  TitleComponentOption,
  TooltipComponentOption,
  XAXisComponentOption,
  YAXisComponentOption,
} from 'echarts';

import { Color } from '../../shared/models/color.enum';
import { FeatureImportance, FeatureImportanceType } from '../models';
import {
  createFeaturesImportanceConfig,
  createTitleOption,
  createXAxisOption,
  createYAxisOption,
  fillDataForFeature,
  mapToValueWithStyle,
  seriesTooltipFormatter,
  setData,
} from './feature-importance.config';

jest.mock('./feature-importance.utils', () => ({
  ...(jest.requireActual('./feature-importance.utils') as any),
  calculateColor: jest.fn().mockReturnValue('rgb(251, 36, 36)'),
}));

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
      expect(result.max).toBe(2);
    });

    test('should return formatted axis label', () => {
      const featuresNames = ['A', 'B'];
      const yAxisOption = createYAxisOption(featuresNames);

      const result = (yAxisOption.axisLabel as any).formatter(1);

      expect(result).toBe('B');
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
        data: [[0.6, 1.7, 'A', 0.2]],
        type: FeatureImportanceType.NUMERIC,
      };
      const series: ScatterSeriesOption[] = [];

      fillDataForFeature(featureImportance, series);

      expect(series[0]).toBeDefined();
      const featureImportanceData = featureImportance.data;

      expect((series[0].data[0] as any).value).toEqual(
        featureImportanceData[0]
      );
    });
  });

  describe('createFeaturesImportanceConfig', () => {
    test('should create Feature Importance Config', () => {
      const featuresImportance: FeatureImportance[] = [
        {
          feature: 'Age',
          data: [['18', 0.6, 0.7, 0.2]],
          type: FeatureImportanceType.NUMERIC,
        },
      ];
      const titleText = 'I am the title';
      const xAxisName = 'I am the X Axis Name';

      const result = createFeaturesImportanceConfig(
        featuresImportance,
        titleText,
        xAxisName
      );

      expect(result).toBeDefined();
      expect((result.xAxis as XAXisComponentOption[]).length).toBe(1);
      expect((result.yAxis as YAXisComponentOption[]).length).toBe(1);
      expect((result.series as ScatterSeriesOption[]).length).toBe(1);
      expect(result.tooltip as TooltipComponentOption).toEqual({
        trigger: 'item',
      });
      expect((result.grid as GridComponentOption[]).length).toBe(1);
      expect((result.title as TitleComponentOption[]).length).toBe(1);
    });
  });

  describe('setData', () => {
    test('should set data with colors to Numeric feature', () => {
      const featureImportance: FeatureImportance = {
        feature: 'Age',
        data: [['18', 0.6, 0.7, 1]],
        type: FeatureImportanceType.NUMERIC,
      };
      const serie: ScatterSeriesOption = {};

      setData(featureImportance, serie);

      expect((serie.data[0] as any).value).toEqual(featureImportance.data[0]);
      expect((serie.data[0] as any).itemStyle).toEqual({
        color: Color.RED_RGB,
      });
    });

    test('should set data with gray color to Categoric feature', () => {
      const featureImportance: FeatureImportance = {
        feature: 'Age',
        data: [['18', 0.6, 0.7, 1]],
        type: FeatureImportanceType.CATEGORIC,
      };
      const serie: ScatterSeriesOption = {};

      setData(featureImportance, serie);

      expect(serie.data[0]).toEqual(featureImportance.data[0]);
      expect(serie.color).toEqual(Color.DARK_GREY);
    });
  });

  describe('mapToValueWithStyle', () => {
    test('should map data to value with color', () => {
      const data = [1, 2, 'A', 0.5];

      const result = mapToValueWithStyle(data);

      expect(result.value).toEqual(data);
      expect(result.itemStyle.color).toBeDefined();
    });
  });

  describe('seriesTooltipFormatter', () => {
    test('should format text of tooltip', () => {
      const data = [1, 2, 'Hey', 0.5];

      const result = seriesTooltipFormatter(data);

      expect(result).toBe('Value: Hey<br/> Importance: 1.0');
    });
  });
});
