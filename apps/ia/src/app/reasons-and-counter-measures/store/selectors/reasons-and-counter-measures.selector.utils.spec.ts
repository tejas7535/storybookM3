import { DoughnutChartData } from '../../../shared/charts/models';
import { ChartLegendItem } from '../../../shared/charts/models/chart-legend-item.model';
import { Color } from '../../../shared/models/color.enum';
import { ReasonForLeavingStats } from '../../models/reason-for-leaving-stats.model';
import * as utils from './reasons-and-counter-measures.selector.utils';

describe('mapReasonsToTableData', () => {
  test('should map reasons to data', () => {
    const data: ReasonForLeavingStats[] = [
      { detailedReason: 'Family', leavers: 23 },
      { detailedReason: 'Work Life Balance', leavers: 50 },
    ];

    const result = utils.mapReasonsToTableData(data);

    expect(result).toHaveLength(2);

    expect(result[0].detailedReason).toEqual(data[0].detailedReason);
    expect(result[0].leavers).toEqual(data[0].leavers);
    expect(result[0].percentage).toEqual(31.5);
    expect(result[0].position).toEqual(2);

    expect(result[1].detailedReason).toEqual(data[1].detailedReason);
    expect(result[1].leavers).toEqual(data[1].leavers);
    expect(result[1].percentage).toEqual(68.5);
    expect(result[1].position).toEqual(1);
  });

  test('should return undefined when data undefined', () => {
    const data: ReasonForLeavingStats[] = undefined;

    const result = utils.mapReasonsToTableData(data);

    expect(result).toBeUndefined();
  });
});

describe('getColorsForChart', () => {
  test('should return default colors when nothing to compare', () => {
    const colors = utils.getColorsForChart([]);

    expect(colors).toEqual([
      Color.COLORFUL_CHART_11,
      Color.COLORFUL_CHART_10,
      Color.COLORFUL_CHART_9,
      Color.COLORFUL_CHART_8,
      Color.COLORFUL_CHART_7,
      Color.COLORFUL_CHART_6,
      Color.COLORFUL_CHART_5,
      Color.COLORFUL_CHART_4,
      Color.COLORFUL_CHART_3,
      Color.COLORFUL_CHART_2,
      Color.COLORFUL_CHART_1,
      Color.COLORFUL_CHART_0,
    ]);
  });

  test('should sync colors when comparing two charts', () => {
    const defaultData = [
      {
        value: 9,
        name: 'Test 1',
      },
      {
        value: 7,
        name: 'Test 2',
      },
      {
        value: 3,
        name: 'Test 5',
      },
    ];

    const compareData = [
      {
        value: 3,
        name: 'Test 4',
      },
      {
        value: 2,
        name: 'Test 3',
      },
      {
        value: 1,
        name: 'Test 1',
      },
    ];

    const colors = utils.getColorsForChart(defaultData, compareData);

    expect(colors).toEqual([
      Color.COLORFUL_CHART_8,
      Color.COLORFUL_CHART_7,
      Color.COLORFUL_CHART_11,
      Color.COLORFUL_CHART_6,
      Color.COLORFUL_CHART_5,
      Color.COLORFUL_CHART_4,
      Color.COLORFUL_CHART_3,
      Color.COLORFUL_CHART_2,
      Color.COLORFUL_CHART_1,
      Color.COLORFUL_CHART_0,
    ]);
  });

  describe('mapDataToLegendItems', () => {
    test('should map array of DoughnutChartData to array of ChartLegendItem', () => {
      const dataToMap: DoughnutChartData[] = [
        new DoughnutChartData(0, 'Lewandowski'),
        new DoughnutChartData(0, 'Reus'),
      ];
      const colors = ['red', 'green', 'blue'];
      const expectedResult = [
        new ChartLegendItem(dataToMap[0].name, colors[0], undefined, true),
        new ChartLegendItem(dataToMap[1].name, colors[1], undefined, true),
      ];

      const result = utils.mapDataToLegendItems(dataToMap, colors);

      expect(result).toEqual(expectedResult);
    });
  });

  describe('getUniqueChartLegendItemsFromComparedLegend', () => {
    test('should get unique chart legend items', () => {
      const legend: ChartLegendItem[] = [
        new ChartLegendItem('Lewandowski', 'red', undefined, true),
        new ChartLegendItem('Reus', 'blue', undefined, true),
      ];
      const comparedLegend: ChartLegendItem[] = [
        new ChartLegendItem('Hummels', 'orange', undefined, true),
        new ChartLegendItem('Lewandowski', 'black', undefined, true),
        new ChartLegendItem('Kimmich', 'white', undefined, true),
      ];
      const expectedResult = [comparedLegend[0], comparedLegend[2]];

      const result = utils.getUniqueChartLegendItemsFromComparedLegend(
        legend,
        comparedLegend
      );

      expect(result).toEqual(expectedResult);
    });
  });

  describe('getPercentageValue', () => {
    test('should get percentage value', () => {
      const part = 2;
      const total = 11;

      const result = utils.getPercentageValue(part, total);

      expect(result).toEqual(18.2);
    });

    test('should not add decimal numbers for integer', () => {
      const part = 1;
      const total = 1;

      const result = utils.getPercentageValue(part, total);

      expect(result).toEqual(100);
    });

    test('should return 0 when total 0', () => {
      const part = 1;
      const total = 0;

      const result = utils.getPercentageValue(part, total);

      expect(result).toEqual(0);
    });

    test('should return 0 when part 0', () => {
      const part = 0;
      const total = 1;

      const result = utils.getPercentageValue(part, total);

      expect(result).toEqual(0);
    });
  });
});
