import { EChartsOption } from 'echarts';
import { LoadSense } from '../../reducers/load-sense/models';
import { LoadDistribution } from './load-distribution.interface';

export class PolarSeriesGenerator {
  /**
   * Basic styles of the Dashboard Polar
   */
  baseStyles: EChartsOption = {
    symbol: 'none',
    type: 'line',
    coordinateSystem: 'polar',
    smooth: true,
    areaStyle: {
      opacity: 0.5,
    },
  };
  /**
   * Mapping to table to map the position of a lsppin
   * to a certain counting index of an bearing
   * table provided by matthias kohlhepp
   */
  lspBearingMappingTable: any = {
    row1: {
      lsp09Strain: 1,
      lsp11Strain: 16,
      lsp13Strain: 31,
      lsp15Strain: 47,
      lsp01Strain: 62,
      lsp03Strain: 78,
      lsp04Strain: 93,
      lsp07Strain: 108,
    },
    row2: {
      lsp10Strain: 8,
      lsp12Strain: 24,
      lsp14Strain: 39,
      lsp16Strain: 54,
      lsp02Strain: 70,
      lsp04Strain: 85,
      lsp06Strain: 101,
      lsp08Strain: 117,
    },
  };
  /**
   * The color for the series / scat
   */
  color: string;
  /**
   * The name of the series
   */
  name: string;
  /**
   *
   * @param config containing color and name information
   */
  constructor(config: { color: string; name: string }) {
    this.color = config.color;
    this.name = config.name;
  }
  /**
   * Get line series for polar chart displaying 123 bearing loads
   */
  getSeries(response: LoadDistribution): EChartsOption {
    const data = Array.from({ length: 123 });
    const keyToFind = 'rollingElement';

    Object.keys(response)
      .filter((key) => key.includes(keyToFind))
      .forEach(
        (prop: any) =>
          (data[prop.replace(keyToFind, '') - 1] =
            response[prop as keyof LoadDistribution])
      );

    return {
      ...this.baseStyles,
      color: this.color,
      name: this.name,
      data,
    };
  }
  /**
   * takes data from loadsense call and map them to the lsp bearing position within the polar chart
   */
  getSeriesDots(response: LoadSense, isRotor: boolean): EChartsOption {
    const data = Array.from({ length: 123 });
    // eslint-disable-next-line unicorn/consistent-function-scoping
    Object.keys(response)
      .filter((key) => key.match(/^lsp\d\dStrain$/))
      .forEach((key: any) => {
        const row = !isRotor ? 'row1' : 'row2';
        const i: number = this.lspBearingMappingTable[row][key];
        if (i) {
          data[i] = { value: response[key as keyof LoadSense], key };
        }
      });

    return {
      color: this.color,
      coordinateSystem: 'polar',
      type: 'scatter',
      name: this.name,
      symbolSize: 6,
      symbol: 'circle',
      data,
    };
  }
}
