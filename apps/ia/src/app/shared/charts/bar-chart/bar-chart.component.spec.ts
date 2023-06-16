import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { MockComponent } from 'ng-mocks';
import { NgxEchartsModule } from 'ngx-echarts';
import resize_observer_polyfill from 'resize-observer-polyfill';

import { BarChartConfig } from '../models/bar-chart-config.model';
import { BarChartComponent } from './bar-chart.component';
window.ResizeObserver = resize_observer_polyfill;

jest.mock('./bar-chart.config', () => ({
  ...(jest.requireActual('./bar-chart.config') as any),
  createBarChartOption: jest.fn(() => ({})),
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

      expect(component.options).toBeDefined();
    });
  });
});
