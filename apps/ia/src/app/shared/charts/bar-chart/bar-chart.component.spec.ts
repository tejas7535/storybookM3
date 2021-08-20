import { createComponentFactory, Spectator } from '@ngneat/spectator';
import { MockComponent } from 'ng-mocks';

import { BarChartConfig } from '../models/bar-chart-config.model';
import { BarChartComponent } from './bar-chart.component';

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
