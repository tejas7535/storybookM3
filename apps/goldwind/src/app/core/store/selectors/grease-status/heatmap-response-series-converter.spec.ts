import {
  GCMHeatmapClassification,
  GCMHeatmapEntry,
} from '../../../../shared/models';
import { HeatmapResponseConvert } from './heatmap-response-series-converter';

describe('HeatmapDataConverter', () => {
  const data: GCMHeatmapEntry[] = [
    {
      timestamp: '2021-04-01T08:52:23.001Z',
      gcm01DeteriorationMaxClassification: GCMHeatmapClassification.ERROR,
      gcm01DeteriorationMax: 0,
      gcm01WaterContentMaxClassification: GCMHeatmapClassification.ERROR,
      gcm01WaterContentMax: 1,
      gcm01TemperatureOpticsMaxClassification: GCMHeatmapClassification.ERROR,
      gcm01TemperatureOpticsMax: 0,
      gcm02DeteriorationMaxClassification: GCMHeatmapClassification.ERROR,
      gcm02DeteriorationMax: 0,
      gcm02WaterContentMaxClassification: GCMHeatmapClassification.ERROR,
      gcm02WaterContentMax: 2,
      gcm02TemperatureOpticsMaxClassification: GCMHeatmapClassification.ERROR,
      gcm02TemperatureOpticsMax: 0,
    },
    {
      timestamp: '2021-01-09T08:52:23.001Z',
      gcm01DeteriorationMaxClassification: GCMHeatmapClassification.WARNING,
      gcm01DeteriorationMax: 0,
      gcm01WaterContentMaxClassification: GCMHeatmapClassification.WARNING,
      gcm01WaterContentMax: 1,
      gcm01TemperatureOpticsMaxClassification: GCMHeatmapClassification.WARNING,
      gcm01TemperatureOpticsMax: 0,
      gcm02DeteriorationMaxClassification: GCMHeatmapClassification.WARNING,
      gcm02DeteriorationMax: 0,
      gcm02WaterContentMaxClassification: GCMHeatmapClassification.WARNING,
      gcm02WaterContentMax: 2,
      gcm02TemperatureOpticsMaxClassification: GCMHeatmapClassification.WARNING,
      gcm02TemperatureOpticsMax: 0,
    },
    {
      timestamp: '2021-08-01T08:52:23.001Z',
      gcm01DeteriorationMaxClassification: GCMHeatmapClassification.OKAY,
      gcm01DeteriorationMax: 0,
      gcm01WaterContentMaxClassification: GCMHeatmapClassification.OKAY,
      gcm01WaterContentMax: 1,
      gcm01TemperatureOpticsMaxClassification: GCMHeatmapClassification.OKAY,
      gcm01TemperatureOpticsMax: 0,
      gcm02DeteriorationMaxClassification: GCMHeatmapClassification.OKAY,
      gcm02DeteriorationMax: 0,
      gcm02WaterContentMaxClassification: GCMHeatmapClassification.OKAY,
      gcm02WaterContentMax: 2,
      gcm02TemperatureOpticsMaxClassification: GCMHeatmapClassification.OKAY,
      gcm02TemperatureOpticsMax: 0,
    },
    {
      timestamp: 'mess-12-01T08:52:23.001Z',
    } as GCMHeatmapEntry,
    {
      timestamp: '2021-12-01T08:52:23.001Z',
      gcm01DeteriorationMaxClassification: GCMHeatmapClassification.OKAY,
      gcm01DeteriorationMax: 0,
      gcm01WaterContentMaxClassification: GCMHeatmapClassification.OKAY,
      gcm01WaterContentMax: 1,
      gcm01TemperatureOpticsMaxClassification: GCMHeatmapClassification.OKAY,
      gcm01TemperatureOpticsMax: 0,
      gcm02DeteriorationMaxClassification: GCMHeatmapClassification.OKAY,
      gcm02DeteriorationMax: 0,
      gcm02WaterContentMaxClassification: GCMHeatmapClassification.OKAY,
      gcm02WaterContentMax: 2,
      gcm02TemperatureOpticsMaxClassification: GCMHeatmapClassification.OKAY,
      gcm02TemperatureOpticsMax: 0,
    },
  ];

  let instance: HeatmapResponseConvert;

  it('should prepare things correctly', () => {
    instance = new HeatmapResponseConvert(data);
    expect(instance.series).toBeDefined();
  });
  // it('should have series with a single array and error', () => {
  //   instance = new HeatmapResponseConvert(data);
  //   expect(instance.series[0].data.length).toBe(2);
  //   expect(instance.series[1].data.length).toBe(1);
  //   expect(instance.series[2].data.length).toBe(1);
  //   expect(instance.series[3].data.length).toBe(1);
  //   expect(instance.series[0].data[0]).toEqual({
  //     value: [
  //       '2021-01-09T08:52:23.001Z',
  //       2,
  //       GCMHeatmapClassification.WARNING,
  //       JSON.stringify(data[1]),
  //     ],
  //   });
  //   expect(instance.series[1].data[0]).toEqual({
  //     value: [
  //       '2021-04-01T08:52:23.001Z',
  //       3,
  //       GCMHeatmapClassification.ERROR,
  //       JSON.stringify(data[0]),
  //     ],
  //   });
  //   expect(instance.series[2].data[0]).toEqual({
  //     value: [
  //       '2021-08-01T08:52:23.001Z',
  //       1,
  //       GCMHeatmapClassification.OKAY,
  //       JSON.stringify(data[2]),
  //     ],
  //   });
  //   expect(instance.series[3].data[0]).toEqual({
  //     value: [
  //       '2021-12-01T08:52:23.001Z',
  //       1,
  //       GCMHeatmapClassification.OKAY,
  //       JSON.stringify(data[4]),
  //     ],
  //   });
  // });

  describe('get year', () => {
    it('return a year from passed timestamp', () => {
      instance = new HeatmapResponseConvert(data);
      expect(instance.year).toBeGreaterThan(2000);
    });
  });

  describe('isBetween', () => {
    it('should be true if date is in range', () => {
      instance = new HeatmapResponseConvert(data);
      expect(
        instance.isBetween(new Date().toISOString(), '2022-01-01', '2022-12-31')
      ).toBeTruthy();
    });
    it('should be false if date is not in range', () => {
      instance = new HeatmapResponseConvert(data);
      expect(
        instance.isBetween(new Date().toISOString(), '2020-01-01', '2020-12-31')
      ).toBeFalsy();
    });
  });
});
