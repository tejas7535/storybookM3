import { MatIconModule } from '@angular/material/icon';

import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { NgxEchartsModule } from 'ngx-echarts';

import { provideTranslocoTestingModule } from '@schaeffler/transloco';

import { BOM_MOCK } from '@cdba/testing/mocks';

import { BomItem } from '../../models';
import { SharedModule } from '../../shared.module';
import { BomChartComponent } from './bom-chart.component';
import {
  COLOR_PLATTE,
  getXAxisConfig,
  TOOLTIP_CONFIG,
  Y_AXIS_CONFIG,
} from './bom-chart.config';

describe('BomChartComponent', () => {
  let specatator: Spectator<BomChartComponent>;
  let component: BomChartComponent;

  const data: BomItem[] = [BOM_MOCK[0], BOM_MOCK[1]];

  const createComponent = createComponentFactory({
    component: BomChartComponent,
    imports: [
      SharedModule,
      NgxEchartsModule.forRoot({
        echarts: async () => import('echarts'),
      }),
      provideTranslocoTestingModule({ en: {} }),
      MatIconModule,
    ],
    disableAnimations: true,
    detectChanges: false,
  });

  beforeEach(() => {
    specatator = createComponent();
    component = specatator.component;
    component.chartData = data;

    specatator.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('data input', () => {
    it('should set the chart data properly', () => {
      expect(component['lineChartData']).toEqual([50, 100]);
      expect(component['barChartData']).toEqual([
        {
          itemStyle: {
            color: COLOR_PLATTE[0],
          },
          name: 'FE-2313',
          value: 13,
        },
        {
          itemStyle: {
            color: COLOR_PLATTE[1],
          },
          name: 'FE-2315',
          value: 13,
        },
      ]);
    });
  });

  describe('ngOnChanges', () => {
    it('should set chart options properly', () => {
      const xAxisConfig = getXAxisConfig(false);

      component.ngOnChanges();

      expect(component.options.tooltip).toEqual(TOOLTIP_CONFIG);
      expect(component.options.yAxis).toEqual(Y_AXIS_CONFIG);
      expect(component.options.xAxis).toEqual(xAxisConfig);
      expect(component.options.series[0].type).toEqual('bar');
      expect(component.options.series[1].type).toEqual('line');
    });
  });
});
