import { EChartsOption, GaugeSeriesOption } from 'echarts';

import { GaugeColors } from './chart';
import { GaugeEchartConfig } from './gauge-chart';

describe('GaugeChart', () => {
  it('should be instancable', () => {
    const chart = new GaugeEchartConfig({
      value: 10,
      min: 0,
      max: 100,
      name: 'tst',
      thresholds: [
        {
          value: 0,
          color: GaugeColors.GREEN,
        },
      ],
    });
    expect(chart).toBeDefined();
  });
  describe('series generation', () => {
    let happyGauge: GaugeEchartConfig;
    let config: EChartsOption;
    const thresholds = [
      {
        value: 30,
        color: GaugeColors.GREEN,
      },
      {
        value: 25,
        color: GaugeColors.YELLOW,
      },
      {
        value: 0,
        color: GaugeColors.RED,
      },
    ];

    beforeEach(() => {
      happyGauge = new GaugeEchartConfig({
        value: 50,
        min: 0,
        max: 100,
        name: 'tst',
        thresholds,
      });
      config = happyGauge.extandedSeries();
    });
    it('should config a echart properly', () => {
      expect((config.series as GaugeSeriesOption[]).length).toBe(
        thresholds.length + 2
      );
    });
    test('should contain dynamic tick series', () => {
      (config.series as GaugeSeriesOption[])
        .filter((i) => i.axisLabel.color)
        .forEach((s) => expect(s.axisLabel.color).toBe('rgba(0,0,0,0.68)'));
    });
    test('should contain a outerbar series element', () => {
      const outer = (config.series as GaugeSeriesOption[]).find(
        (i) =>
          i.axisLine &&
          i.axisLine.lineStyle &&
          i.axisLine.lineStyle.color.length === thresholds.length
      );

      expect(outer.axisLine.lineStyle.color.length).toBe(thresholds.length);
    });
    test('should contain a innerbar', () => {
      const inner = (config.series as GaugeSeriesOption[]).find(
        (i) => i.progress && i.progress.itemStyle && i.progress.itemStyle.color
      );

      expect(inner.progress.itemStyle.color).toBeTruthy();
    });
    describe('Progressbar', () => {
      test('set the progress color according to the threshold - green', () => {
        const value = 80;
        happyGauge = new GaugeEchartConfig({
          value,
          min: 0,
          max: 100,
          name: 'tst',
          thresholds: [
            {
              value: 0,
              color: GaugeColors.GREEN,
            },
            {
              value: 80,
              color: GaugeColors.YELLOW,
            },
            {
              value: 100,
              color: GaugeColors.RED,
            },
          ],
        });

        const inner = (config.series as GaugeSeriesOption[]).find(
          (i) =>
            i.progress && i.progress.itemStyle && i.progress.itemStyle.color
        );

        expect(inner.progress.itemStyle.color.toString()).toBe(
          GaugeColors.GREEN
        );
      });

      it('set the progress color according to the threshold - red', () => {
        const value = 90;
        happyGauge = new GaugeEchartConfig({
          value,
          min: 0,
          max: 100,
          name: 'tst',
          thresholds: [
            {
              value: 0,
              color: GaugeColors.GREEN,
            },
            {
              value: 80,
              color: GaugeColors.YELLOW,
            },
            {
              value: 100,
              color: GaugeColors.RED,
            },
          ],
          reverse: false,
        });
        config = happyGauge.extandedSeries();
        const inner = (config.series as GaugeSeriesOption[]).find(
          ({ progress }) =>
            progress && progress.itemStyle && progress.itemStyle.color
        );

        expect(inner.progress.itemStyle.color.toString()).toBe(GaugeColors.RED);
      });
    });
  });
});
