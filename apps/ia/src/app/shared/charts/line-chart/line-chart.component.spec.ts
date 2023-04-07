import { createComponentFactory, Spectator } from '@ngneat/spectator';
import { PushModule } from '@ngrx/component';
import { provideMockStore } from '@ngrx/store/testing';
import { LineSeriesOption } from 'echarts';
import { NgxEchartsModule } from 'ngx-echarts';
import resize_observer_polyfill from 'resize-observer-polyfill';

import { Color } from '../../models';
import { LineChartComponent } from './line-chart.component';
import { LINE_CHART_BASE_OPTIONS } from './line-chart.config';
window.ResizeObserver = resize_observer_polyfill;

describe('LineChartComponent', () => {
  let component: LineChartComponent;
  let spectator: Spectator<LineChartComponent>;

  const createComponent = createComponentFactory({
    component: LineChartComponent,
    imports: [
      PushModule,
      NgxEchartsModule.forRoot({
        echarts: async () => import('echarts'),
      }),
    ],
    providers: [provideMockStore({})],
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.debugElement.componentInstance;
  });

  test('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('getXAxisData', () => {
    test('should return correct data', () => {
      // momentjs uses Date.now() under the hood for moment()
      const spyDate = jest
        .spyOn(Date, 'now')
        .mockImplementation(() => 1_630_014_361_000); // 26.8.2021
      const result = component.getXAxisData();

      expect(result).toEqual([`2/21`, `3/21`, `4/21`, `5/21`, `6/21`, `7/21`]);
      expect(spyDate).toHaveBeenCalled();
    });
  });

  describe('set series', () => {
    test('should do nothing when series undefined', () => {
      component.series = undefined;

      expect(component.mergeOptions).toBeUndefined();
    });

    test('should change colors and add new series', () => {
      const seriesA = { data: [2, 1] } as LineSeriesOption;
      component.options = {
        series: [seriesA],
        color: [Color.RED, Color.BLACK],
      };
      const seriesB = { data: [1, 2] } as LineSeriesOption;
      component.series = [seriesB];

      expect(component.mergeOptions.color).toEqual([
        Color.GREEN,
        Color.DARK_GREY,
      ]);
      expect((component.mergeOptions.series as any[])[0]).toEqual(seriesB);
      expect((component.mergeOptions.series as any[])[1]).toEqual(seriesA);
    });
  });

  describe('createEChartsOption', () => {
    test('should create e charts option', () => {
      component.config = {
        series: [],
      };

      const option = component.createEChartsOption();

      expect(option).toEqual({
        ...LINE_CHART_BASE_OPTIONS,
        xAxis: {
          ...LINE_CHART_BASE_OPTIONS.xAxis,
          type: 'category',
          data: component.getXAxisData(),
        },
        series: component.config.series,
        grid: {
          top: 20,
          left: '15%',
        },
      });
    });
  });
});
