import { registerLocaleData } from '@angular/common';
import de from '@angular/common/locales/de';

import {
  barchartTooltipFormatter,
  COLOR_PLATTE,
  getChartSeries,
  linechartTooltipFormatter,
} from './bom-chart.config';

registerLocaleData(de, 'de-DE');

describe('BOM Chart Config', () => {
  describe('getChartSeries', () => {
    it('should return correct chart series', () => {
      const barChartData = [
        {
          itemStyle: {
            color: COLOR_PLATTE[0],
          },
          name: 'FE-2313',
          value: 13,
        },
        {
          itemStyle: {
            color: COLOR_PLATTE[1],
          },
          name: 'FE-2315',
          value: 13,
        },
      ];

      const lineChartData = [50, 100];

      const result = getChartSeries(barChartData, lineChartData);

      expect(result.length).toEqual(2);
      expect(result[0].type).toEqual('bar');
      expect(result[0].data).toEqual(barChartData);
      expect(result[1].type).toEqual('line');
      expect(result[1].data).toEqual(lineChartData);
    });
  });

  describe('barchartTooltipFormatter', () => {
    it('should format the tooltip correctly', () => {
      const params = { name: 'F-1308', value: 0.349494323 };

      const result = barchartTooltipFormatter(params);

      expect(result).toEqual('F-1308: 0,34949€');
    });
  });

  describe('linechartTooltipFormatter', () => {
    it('should format the tooltip correctly', () => {
      const params = { value: 84.349494323 };

      const result = linechartTooltipFormatter(params);

      expect(result).toEqual('84,35%');
    });
  });
});
