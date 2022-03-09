import { Color } from '../../models/color.enum';
import {
  createPieChartBaseOptions,
  createPieChartSeries,
} from './loose-doughnut-chart.config';

describe('loose-doughnut-chart config', () => {
  describe('createPieChartBaseOptions', () => {
    let echartsOptions: any;

    beforeEach(() => {
      echartsOptions = {
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b}: {c}',
          extraCssText: 'opacity: 0',
        },
        legend: {
          data: undefined,
          show: false,
        },
        title: {
          text: '',
          left: 'center',
          top: 'center',
          textStyle: {
            color: Color.BLACK,
            fontSize: 20,
            lineHeight: 30,
          },
          subtext: '',
          subtextStyle: {
            color: Color.BLACK,
            fontSize: 12,
            lineHeight: 20,
          },
        },
      };
    });
    test('should return options with legend', () => {
      const legend = ['a', 'b'];
      const text = 'Hi';
      const subtext = 'there';

      const result = createPieChartBaseOptions(legend, text, subtext);

      expect(result).toEqual({
        ...echartsOptions,
        legend: {
          ...echartsOptions.legend,
          data: legend,
          show: false,
        },
        title: {
          ...echartsOptions.title,
          text,
          subtext,
        },
      });
    });

    test('should return options without legend', () => {
      const legend: string[] = undefined;
      const text = 'Hi';
      const subtext = 'there';

      const result = createPieChartBaseOptions(legend, text, subtext);

      expect(result).toEqual({
        ...echartsOptions,
        legend: {
          ...echartsOptions.legend,
          data: undefined,
          show: false,
        },
        title: {
          ...echartsOptions.title,
          text,
          subtext,
        },
      });
    });
  });

  describe('createPieChartSeries', () => {
    let seriesConfig: any;

    const formatter = `<table>
    <tr>
      <td class="pr-4"><b>{c}</b></td>
      <td>Employees</td>
    </tr>
  </table>`;

    beforeEach(() => {
      seriesConfig = {
        name: '',
        type: 'pie',
        radius: undefined,
        label: {
          show: false,
        },
        emphasis: {
          scale: false,
        },
        data: [
          {
            value: undefined,
            name: undefined,
            tooltip: {
              trigger: 'item',
              formatter,
              extraCssText: 'opacity: 1',
            },
            itemStyle: {
              color: '',
            },
          },
          {
            value: undefined,
            name: 'invis',
            itemStyle: {
              color: Color.GREY,
            },
            emphasis: {
              itemStyle: {
                color: Color.GREY,
              },
            },
          },
        ],
      };
    });

    test('should series config when providing totalValue', () => {
      const radius = ['20'];
      const value = 10;
      const totalValue = 90;
      const color = 'red';
      const seriesName = 'test';
      const dataName = 'testData';

      const result = createPieChartSeries(
        radius,
        value,
        totalValue,
        color,
        seriesName,
        dataName
      );

      expect(result).toEqual({
        ...seriesConfig,
        radius,
        name: seriesName,
        data: [
          {
            ...seriesConfig.data[0],
            value,
            name: dataName,
            itemStyle: {
              color,
              borderRadius: ['20%', '50%'],
            },
          },
          { ...seriesConfig.data[1], value: 80 },
        ],
      });
    });

    test('should series config when not providing totalValue', () => {
      const radius = ['20'];
      const value = 10;
      const totalValue: number = undefined;
      const color = 'red';
      const seriesName = 'test';
      const dataName = 'testData';

      const result = createPieChartSeries(
        radius,
        value,
        totalValue,
        color,
        seriesName,
        dataName
      );

      expect(result).toEqual({
        ...seriesConfig,
        name: seriesName,
        radius,
        data: [
          {
            ...seriesConfig.data[0],
            value,
            name: dataName,
            itemStyle: {
              color,
              borderRadius: ['20%', '50%'],
            },
          },
          { ...seriesConfig.data[1], value: 100 },
        ],
      });
    });
  });
});
