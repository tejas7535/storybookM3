import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { PushPipe } from '@ngrx/component';
import { provideMockStore } from '@ngrx/store/testing';
import { LineSeriesOption } from 'echarts';
import { NgxEchartsModule } from 'ngx-echarts';
import resize_observer_polyfill from 'resize-observer-polyfill';

import { LineChartComponent } from './line-chart.component';
import { LINE_CHART_BASE_OPTIONS } from './line-chart.config';
window.ResizeObserver = resize_observer_polyfill;

describe('LineChartComponent', () => {
  let component: LineChartComponent;
  let spectator: Spectator<LineChartComponent>;

  const createComponent = createComponentFactory({
    component: LineChartComponent,
    imports: [
      PushPipe,
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

  describe('set series', () => {
    test('should merge series contain benchmark and series when both defined', () => {
      const series = [{ id: 'A' }];
      const benchmarkSeries = [{ id: 'B' }];
      component['_banchmarkSeries'] = benchmarkSeries;

      component.series = series;

      expect(component.mergeOptions.series).toEqual([
        ...benchmarkSeries,
        ...series,
      ]);
    });

    test('should merge series contain series only when benchmark series undefined', () => {
      component['_banchmarkSeries'] = undefined;
      const series = [{ id: 'B' }];
      component.series = series;

      expect(component.mergeOptions.series).toEqual([...series]);
    });

    test('should merge series be empty when both undefined', () => {
      component.series = undefined;

      expect(component.mergeOptions.series).toEqual([]);
    });
  });

  describe('set benchmarkSeries', () => {
    test('should merge series contain benchmark and series when both defined', () => {
      const series = [{ id: 'A' }];
      const benchmarkSeries = [{ id: 'B' }];
      component['_series'] = series;

      component.benchmarkSeries = benchmarkSeries;

      expect(component.mergeOptions.series).toEqual([
        ...benchmarkSeries,
        ...series,
      ]);
    });

    test('should merge series contain benchmark only when series undefined', () => {
      const series = undefined as LineSeriesOption[];
      const benchmarkSeries = [{ id: 'B' }];
      component['_series'] = series;

      component.benchmarkSeries = benchmarkSeries;

      expect(component.mergeOptions.series).toEqual([...benchmarkSeries]);
    });

    test('should merge series contain benchmark series only when series undefined', () => {
      component['_series'] = undefined;
      const benchmarkSeries = [{ id: 'B' }];
      component.series = benchmarkSeries;

      expect(component.mergeOptions.series).toEqual([...benchmarkSeries]);
    });

    test('should merge series be empty when both undefined', () => {
      component.benchmarkSeries = undefined;

      expect(component.mergeOptions.series).toEqual([]);
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
        },
        series: component.config.series,
        grid: {
          top: 20,
          left: '15%',
          right: 0,
        },
      });
    });
  });
});
