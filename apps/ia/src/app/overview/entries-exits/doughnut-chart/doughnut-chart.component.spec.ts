import { createComponentFactory, Spectator } from '@ngneat/spectator';
import { NgxEchartsModule } from 'ngx-echarts';

import { provideTranslocoTestingModule } from '@schaeffler/transloco';

import { Color } from '../../../shared/models/color.enum';
import { SharedModule } from '../../../shared/shared.module';
import { DoughnutChartComponent } from './doughnut-chart.component';
import * as doughnutChartConfig from './doughnut-chart.config';
import { DoughnutConfig } from './models/doughnut-config.model';
import { DoughnutSeriesConfig } from './models/doughnut-series-config.model';

jest.mock('./doughnut-chart.config', () => ({
  ...(jest.requireActual('./doughnut-chart.config') as any),
  createPieChartBaseOptions: jest.fn(() => ({})),
  createPieChartSeries: jest.fn(() => ({})),
}));

describe('DoughnutChartComponent', () => {
  let component: DoughnutChartComponent;
  let spectator: Spectator<DoughnutChartComponent>;

  const createComponent = createComponentFactory({
    component: DoughnutChartComponent,
    detectChanges: false,
    imports: [
      SharedModule,
      NgxEchartsModule.forRoot({
        echarts: () => import('echarts'),
      }),
      provideTranslocoTestingModule({ en: {} }),
    ],
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.debugElement.componentInstance;
  });
  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('set initialConfig', () => {
    test('should set correct initial config', () => {
      const series = [
        new DoughnutSeriesConfig(99, 'demo data 1', Color.LIGHT_GREEN),
      ];

      component.createSeriesOptions = jest.fn(() => series);

      component.initialConfig = series;

      expect(component.options).toEqual({
        series,
      });
      expect(component.createSeriesOptions).toHaveBeenCalledWith(
        new DoughnutConfig('', series)
      );
      expect(doughnutChartConfig.createPieChartBaseOptions).toHaveBeenCalled();
    });
  });

  describe('createSeriesOptions', () => {
    test('should map correct series', () => {
      const color = Color.LIGHT_GREEN;
      const data = new DoughnutConfig('Demo', [
        new DoughnutSeriesConfig(99, 'demo data 1', color),
      ]);

      const result = component.createSeriesOptions(data);

      expect(doughnutChartConfig.createPieChartSeries).toHaveBeenCalledWith(
        ['60%', '70%'],
        data.series[0].value,
        data.series[0].value,
        color,
        data.name,
        data.series[0].name
      );
      expect(result).toEqual([{}]);
    });
  });
});
