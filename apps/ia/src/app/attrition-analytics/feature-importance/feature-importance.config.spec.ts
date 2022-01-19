import {
  GridComponentOption,
  ScatterSeriesOption,
  TooltipComponentOption,
} from 'echarts';
import { Color } from '../../shared/models';

import {
  FeatureImportanceDataPoint,
  FeatureImportanceGroup,
  FeatureImportanceType,
} from '../models';

import * as config from './feature-importance.config';

jest.mock('./feature-importance.utils', () => ({
  ...(jest.requireActual('./feature-importance.utils') as any),
  calculateColor: jest.fn().mockReturnValue('rgb(251, 36, 36)'),
}));

describe('FeatureImoprtanceConfig', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('createXAxisOption', () => {
    test('should return xAxisOption with name', () => {
      const name = 'X Axis';

      const result = config.createXAxisOption(name);

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

      const result = config.createYAxisOption(featuresNames);

      expect(result).toBeDefined();
      expect(result.type).toEqual('value');
      expect((result as any).data).toEqual(featuresNames);
      expect((result as any).interval).toBe(1);
      expect(result.max).toBe(2);
    });

    test('should return formatted axis label', () => {
      const featuresNames = ['A', 'B'];
      const yAxisOption = config.createYAxisOption(featuresNames);

      const result = (yAxisOption.axisLabel as any).formatter(1);

      expect(result).toBe('B');
    });

    test('should return formatted axis label as undefined when negative value', () => {
      const featuresNames = ['A', 'B'];
      const yAxisOption = config.createYAxisOption(featuresNames);

      const result = (yAxisOption.axisLabel as any).formatter(-1);

      expect(result).toBeUndefined();
    });
  });

  describe('createTitleOption', () => {
    test('should return title with text', () => {
      const text = 'Feature Importance';

      const result = config.createTitleOption(text);

      expect(result).toBeDefined();
      expect(result.text).toBe(text);
      expect(result.padding).toEqual([20, 30, 40, 29]);
    });
  });

  describe('fillDataForFeature', () => {
    test('should fill serie with data', () => {
      const featureImportance: FeatureImportanceGroup = {
        feature: 'Age',
        dataPoints: [],
        type: FeatureImportanceType.NUMERIC,
      };
      const series: ScatterSeriesOption[] = [];
      const index = 0;
      const size = 0;
      const mockSetData = jest.spyOn(config, 'setData').mockReturnValue();

      config.fillDataForFeature(featureImportance, series, index, size);

      expect(series[0]).toBeDefined();
      expect(series[0].coordinateSystem).toEqual('cartesian2d');
      expect(series[0].type).toEqual('scatter');
      expect(series[0].symbolSize).toEqual(4);
      expect(mockSetData).toHaveBeenCalledWith(
        featureImportance,
        series[0],
        index,
        size
      );
    });
  });

  describe('createFeaturesImportanceConfig', () => {
    test('should create Feature Importance Config', () => {
      const featuresImportance: FeatureImportanceGroup[] = [
        {
          feature: 'Age',
          dataPoints: [],
          type: FeatureImportanceType.NUMERIC,
        },
      ];
      const titleText = 'I am the title';
      const xAxisName = 'I am the X Axis Name';
      const mockCreateXAxisOption = jest
        .spyOn(config, 'createXAxisOption')
        .mockReturnValue({});
      const mockCreateYAxisOption = jest
        .spyOn(config, 'createYAxisOption')
        .mockReturnValue({});
      const mockCreateTitleOption = jest
        .spyOn(config, 'createTitleOption')
        .mockReturnValue({});
      const mockFillDataForFeature = jest
        .spyOn(config, 'fillDataForFeature')
        .mockReturnValue();

      const result = config.createFeaturesImportanceConfig(
        featuresImportance,
        titleText,
        xAxisName
      );

      expect(result).toBeDefined();
      expect(mockCreateXAxisOption).toHaveBeenCalledWith(xAxisName);
      expect(mockCreateYAxisOption).toHaveBeenCalledWith(['Age']);
      expect(mockCreateTitleOption).toHaveBeenCalledWith(titleText);
      expect(mockFillDataForFeature).toHaveBeenCalledTimes(
        featuresImportance.length
      );
      expect(result.tooltip as TooltipComponentOption).toEqual({
        trigger: 'item',
      });
      expect((result.grid as GridComponentOption[]).length).toBe(1);
    });
  });

  describe('setData', () => {
    let mockGetAverageOfYAxisInDataPoints: any;
    let mockSetSeriesForNumericFeature: any;
    let mockSetSeriesForCategoricalFeature: any;
    let mockAvg: number;

    beforeEach(() => {
      mockAvg = 3;
      mockGetAverageOfYAxisInDataPoints = jest
        .spyOn(config, 'getAverageOfYAxisInDataPoints')
        .mockReturnValue(mockAvg);
      mockSetSeriesForNumericFeature = jest
        .spyOn(config, 'setSeriesForNumericFeature')
        .mockReturnValue();
      mockSetSeriesForCategoricalFeature = jest
        .spyOn(config, 'setSeriesForCategoricalFeature')
        .mockReturnValue();
    });

    test('should set data for numeric feature', () => {
      const featureImportance: FeatureImportanceGroup = {
        feature: 'Age',
        dataPoints: [],
        type: FeatureImportanceType.NUMERIC,
      };
      const serie: ScatterSeriesOption = {};
      const size = 10;
      const index = 0;

      config.setData(featureImportance, serie, index, size);

      expect(mockGetAverageOfYAxisInDataPoints).toHaveBeenCalledWith(
        featureImportance.dataPoints
      );
      expect(mockSetSeriesForNumericFeature).toHaveBeenCalledWith(
        serie,
        featureImportance.dataPoints,
        mockAvg,
        size - index - 1
      );
      expect(mockSetSeriesForCategoricalFeature).not.toHaveBeenCalled();
    });
    test('should set data for categorical feature', () => {
      const featureImportance: FeatureImportanceGroup = {
        feature: 'Age',
        dataPoints: [],
        type: FeatureImportanceType.CATEGORICAL,
      };
      const serie: ScatterSeriesOption = {};
      const size = 10;
      const index = 0;

      config.setData(featureImportance, serie, index, size);

      expect(mockGetAverageOfYAxisInDataPoints).toHaveBeenCalledWith(
        featureImportance.dataPoints
      );
      expect(mockSetSeriesForCategoricalFeature).toHaveBeenCalledWith(
        serie,
        featureImportance.dataPoints,
        mockAvg,
        size - index - 1
      );
      expect(mockSetSeriesForNumericFeature).not.toHaveBeenCalled();
    });
  });

  describe('getAverageOfYAxisInDataPoints', () => {
    test('should return average for valid input', () => {
      const dataPoints = [
        {
          yaxisPos: 10,
        } as unknown as FeatureImportanceDataPoint,
        {
          yaxisPos: 10,
        } as unknown as FeatureImportanceDataPoint,
        {
          yaxisPos: 10,
        } as unknown as FeatureImportanceDataPoint,
      ];

      const avg = config.getAverageOfYAxisInDataPoints(dataPoints);

      expect(avg).toEqual(10);
    });

    test('should return zero for invalid input', () => {
      const avg = config.getAverageOfYAxisInDataPoints([]);

      expect(avg).toEqual(0);
    });
  });

  describe('setSeriesForNumericFeature', () => {
    test('should set data and tooltip', () => {
      const mockVal = {
        value: 5,
        itemStyle: {
          color: 'blue',
        },
      };
      const mockStr = 'test';
      const mockMapToValueWithStyle = jest
        .spyOn(config, 'mapToValueWithStyle')
        .mockReturnValue(mockVal);
      const mockSeriesTooltipFormatter = jest
        .spyOn(config, 'seriesTooltipFormatter')
        .mockReturnValue(mockStr);

      const serie: any = {};
      const dataPoints = [
        {
          yaxisPos: 10,
        } as unknown as FeatureImportanceDataPoint,
      ];
      const avgYPosOfFeature = 10;
      const normalizedRank = 0;

      config.setSeriesForNumericFeature(
        serie,
        dataPoints,
        avgYPosOfFeature,
        normalizedRank
      );

      expect(serie.data).toEqual([mockVal]);
      expect(serie.tooltip.position).toEqual('right');
      serie.tooltip.formatter({ data: [] });
      expect(mockSeriesTooltipFormatter).toHaveBeenCalled();
      expect(mockMapToValueWithStyle).toHaveBeenCalledTimes(dataPoints.length);
    });
  });

  describe('setSeriesForCategoricalFeature', () => {
    test('should set data, tooltip, color, and large prop', () => {
      const mockVal = [5];
      const mockStr = 'test';
      const mockMapDataPointToScatterData = jest
        .spyOn(config, 'mapDataPointToScatterData')
        .mockReturnValue(mockVal);
      const mockSeriesTooltipFormatter = jest
        .spyOn(config, 'seriesTooltipFormatter')
        .mockReturnValue(mockStr);

      const serie: any = {};
      const dataPoints = [
        {
          yaxisPos: 10,
        } as unknown as FeatureImportanceDataPoint,
      ];
      const avgYPosOfFeature = 10;
      const normalizedRank = 0;

      config.setSeriesForCategoricalFeature(
        serie,
        dataPoints,
        avgYPosOfFeature,
        normalizedRank
      );

      expect(serie.data).toEqual([mockVal]);
      expect(serie.tooltip.position).toEqual('right');
      serie.tooltip.formatter({ data: [] });
      expect(mockSeriesTooltipFormatter).toHaveBeenCalled();
      expect(mockMapDataPointToScatterData).toHaveBeenCalledTimes(
        dataPoints.length
      );
      expect(serie.color).toEqual(Color.DARK_GREY);
      expect(serie.large).toBeTruthy();
    });
  });

  describe('mapToValueWithStyle', () => {
    test('should map data to value with color', () => {
      const dataPoint = {
        colorMaps: '0.5',
      } as unknown as FeatureImportanceDataPoint;
      const normalized = 10;
      const mockVal = ['test'];
      const mockMapDataPointToScatterData = jest
        .spyOn(config, 'mapDataPointToScatterData')
        .mockReturnValue(mockVal);

      const result = config.mapToValueWithStyle(dataPoint, normalized);

      expect(result.value).toEqual(mockVal);
      expect(mockMapDataPointToScatterData).toHaveBeenCalledWith(
        dataPoint,
        normalized
      );
      expect(result.itemStyle.color).toEqual('rgb(251, 36, 36)');
    });
  });

  describe('mapDataPointToScatterData', () => {
    test('should return scatter data without colorMap if not available', () => {
      const dataPoint = {
        shapValue: 10,
        value: 'test',
        yaxisPos: 13,
        colorMap: null as any,
      };

      const normalizedVal = 10;

      const result = config.mapDataPointToScatterData(dataPoint, normalizedVal);

      expect(result[0]).toEqual(dataPoint.shapValue);
      expect(result[1]).toEqual(normalizedVal);
      expect(result[2]).toEqual(dataPoint.yaxisPos);
      expect(result[3]).toEqual(dataPoint.value);
      expect(result.length).toEqual(4);
    });
    test('should return scatter data with colorMap if available', () => {
      const dataPoint = {
        shapValue: 10,
        value: 'test',
        yaxisPos: 13,
        colorMap: 11,
      };

      const normalizedVal = 10;

      const result = config.mapDataPointToScatterData(dataPoint, normalizedVal);

      expect(result[0]).toEqual(dataPoint.shapValue);
      expect(result[1]).toEqual(normalizedVal);
      expect(result[2]).toEqual(dataPoint.yaxisPos);
      expect(result[3]).toEqual(dataPoint.value);
      expect(result[4]).toEqual(dataPoint.colorMap);
      expect(result.length).toEqual(5);
    });
  });

  describe('seriesTooltipFormatter', () => {
    test('should format text of tooltip', () => {
      const data = [1, 3, 2, 'Hey', 0.5];

      const result = config.seriesTooltipFormatter(data);

      expect(result).toBe('Value: Hey<br/> Importance: 1.0');
    });
  });
});
