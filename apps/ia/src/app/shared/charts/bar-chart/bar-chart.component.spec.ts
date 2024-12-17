import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { ECharts, EChartsOption } from 'echarts';
import { MockComponent } from 'ng-mocks';
import { NgxEchartsModule } from 'ngx-echarts';
import resize_observer_polyfill from 'resize-observer-polyfill';

import { BarChartConfig } from '../models/bar-chart-config.model';
import { BarChartComponent } from './bar-chart.component';
window.ResizeObserver = resize_observer_polyfill;

jest.mock('./bar-chart.config', () => ({
  ...(jest.requireActual('./bar-chart.config') as any),
  createBarChartOption: jest.fn(
    () => ({ title: 'mock A' }) as unknown as EChartsOption
  ),
  addSeries: jest.fn(() => ({})),
  addVisualMap: jest.fn(() => ({})),
  addSlider: jest.fn(() => ({})),
  formatCategories: jest.fn(() => ({})),
}));

describe('BarChartComponent', () => {
  let component: BarChartComponent;
  let spectator: Spectator<BarChartComponent>;

  const createComponent = createComponentFactory({
    component: BarChartComponent,
    imports: [
      NgxEchartsModule.forRoot({
        echarts: async () => import('echarts'),
      }),
    ],
    declarations: [MockComponent(BarChartComponent)],
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.debugElement.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('set config', () => {
    test('should set options', () => {
      const config = {} as BarChartConfig;

      component.config = config;

      expect(component.options.title).toEqual('mock A');
    });

    test('should not set options', () => {
      component.config = undefined;

      expect(component.options).toBeUndefined();
    });
  });

  describe('onChartInit', () => {
    test('should show loading', () => {
      const chart = {
        showLoading: jest.fn(),
        hideLoading: jest.fn(),
      } as unknown as ECharts;
      component.loading = true;

      component.onChartInit(chart);

      expect(chart.showLoading).toHaveBeenCalled();
      expect(chart.hideLoading).not.toHaveBeenCalled();
    });

    test('should hide loading', () => {
      const chart = {
        showLoading: jest.fn(),
        hideLoading: jest.fn(),
      } as unknown as ECharts;
      component.loading = false;

      component.onChartInit(chart);

      expect(chart.showLoading).not.toHaveBeenCalled();
      expect(chart.hideLoading).toHaveBeenCalled();
    });
  });
});
