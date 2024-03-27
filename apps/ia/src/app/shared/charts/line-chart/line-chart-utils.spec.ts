import { TooltipOption } from 'echarts/types/dist/shared';

import { createFluctuationRateChartConfig } from './line-chart-utils';

describe('createFluctuationRateChartConfig', () => {
  test('should create chart config', () => {
    const result = createFluctuationRateChartConfig(
      '%',
      0.1,
      '1625097600|1627776000'
    );

    expect(result.series).toEqual([]);
    expect(result.yAxis).toEqual({
      axisLabel: {
        formatter: '{value}%',
      },
      minInterval: 0.1,
    });
    expect((result.tooltip as TooltipOption).axisPointer).toEqual({
      type: 'cross',
    });
    expect(result.grid).toEqual({
      left: 50,
    });
    expect(result.displayMode).toEqual('multipleByCoordSys');
  });

  test('should create chart config with unit and min interval', () => {
    const result = createFluctuationRateChartConfig(
      '%',
      10,
      '1625097600|1627776000'
    );

    expect(result.yAxis).toEqual({
      axisLabel: {
        formatter: '{value}%',
      },
      minInterval: 10,
    });
  });
});
