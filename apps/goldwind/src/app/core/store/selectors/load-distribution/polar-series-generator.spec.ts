import { LoadSense } from '../../reducers/load-sense/models';
import { LoadDistribution } from './load-distribution.interface';
import { PolarSeriesGenerator } from './polar-series-generator.class';

describe('Polar Series Genrator', () => {
  describe('getSeries', () => {
    it('should return an Echart Option Object', () => {
      const lineseries = new PolarSeriesGenerator({
        color: 'green',
        name: 'hulk',
      });
      const series = lineseries.getSeries({
        deviceId: 'SeriesExampleDevice',
        rollingElement1: 1337,
      } as LoadDistribution);

      expect(series.color).toBe('green');
      expect(series.coordinateSystem).toBe('polar');
      expect(series.name).toBe('hulk');
      expect((series.data as any).shift()).toBe(1337);
    });
  });

  describe('getSeriesDots', () => {
    it('should return a scatter echarts object for the rotor side', () => {
      const lineseries = new PolarSeriesGenerator({
        color: 'red',
        name: 'son of krypton',
      });
      const series = lineseries.getSeriesDots(
        {
          deviceId: 'SeriesExampleDevice',
          lsp10Strain: 1337,
        } as LoadSense,
        true
      );
      expect(series.color).toBe('red');
      expect(series.coordinateSystem).toBe('polar');
      expect(series.type).toBe('scatter');
      expect(series.name).toBe('son of krypton');
      expect(
        (series.data as any)[lineseries.lspBearingMappingTable.row2.lsp10Strain]
      ).toStrictEqual({ value: 1337, key: 'lsp10Strain' });
    });
    it('should return a scatter echarts object for the generator side', () => {
      const lineseries = new PolarSeriesGenerator({
        color: 'red',
        name: 'son of krypton',
      });
      const series = lineseries.getSeriesDots(
        {
          deviceId: 'SeriesExampleDevice',
          lsp01Strain: 1337,
        } as LoadSense,
        false
      );
      expect(series.color).toBe('red');
      expect(series.name).toBe('son of krypton');
      expect(
        (series.data as any)[lineseries.lspBearingMappingTable.row1.lsp01Strain]
      ).toStrictEqual({ value: 1337, key: 'lsp01Strain' });
    });

    it('should return a data array entity when key known', () => {
      const lineseries = new PolarSeriesGenerator({
        color: 'red',
        name: 'son of krypton',
      });
      const series = lineseries.getSeriesDots(
        {
          deviceId: 'SeriesExampleDevice',
          lsp99Strain: 1337,
        } as any,
        false
      );
      expect(series.color).toBe('red');
      expect(series.name).toBe('son of krypton');
      expect((series.data as number[]).includes(1337)).toBe(false);
    });
  });
});
