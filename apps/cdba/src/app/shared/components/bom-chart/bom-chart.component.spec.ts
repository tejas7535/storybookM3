import { MATERIAL_SANITY_CHECKS } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';

import { ENV, getEnv } from '@cdba/environments/environment.provider';
import { MaterialNumberModule } from '@cdba/shared/pipes';
import { BOM_MOCK } from '@cdba/testing/mocks';
import {
  createComponentFactory,
  mockProvider,
  Spectator,
} from '@ngneat/spectator/jest';
import { TranslocoLocaleService } from '@ngneat/transloco-locale';
import { NgxEchartsModule } from 'ngx-echarts';
import resize_observer_polyfill from 'resize-observer-polyfill';

import { provideTranslocoTestingModule } from '@schaeffler/transloco/testing';

import { BomChartComponent } from './bom-chart.component';
import { TOOLTIP_CONFIG, Y_AXIS_CONFIG } from './bom-chart.constants';
import { BomChartConfigService } from './bom-chart-config.service';
window.ResizeObserver = resize_observer_polyfill;

describe('BomChartComponent', () => {
  let spectator: Spectator<BomChartComponent>;
  let component: BomChartComponent;
  let configService: BomChartConfigService;

  const data = [BOM_MOCK[1], BOM_MOCK[2]];

  const createComponent = createComponentFactory({
    component: BomChartComponent,
    imports: [
      NgxEchartsModule.forRoot({
        echarts: async () => import('echarts'),
      }),
      provideTranslocoTestingModule({ en: {} }),
      MatIconModule,
      MaterialNumberModule,
    ],
    providers: [
      { provide: ENV, useValue: { ...getEnv() } },
      mockProvider(BomChartConfigService, {
        getXAxisConfig: jest.fn(() => [{}]),
        getChartSeries: jest.fn(() => [{}]),
      }),
      mockProvider(TranslocoLocaleService),
      {
        provide: MATERIAL_SANITY_CHECKS,
        useValue: false,
      },
    ],
    disableAnimations: true,
    detectChanges: false,
  });

  beforeEach(() => {
    spectator = createComponent();
    configService = spectator.inject(BomChartConfigService);
    component = spectator.component;
    component.data = data;

    spectator.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
    expect(configService).toBeTruthy();
  });

  describe('data input', () => {
    it('should set the chart data properly', () => {
      expect(component['lineChartData']).toEqual([50, 100]);
      expect(component['barChartData']).toEqual([
        {
          itemStyle: {
            color: '#007832',
          },
          name: 'FE-2315',
          value: 13,
        },
        {
          itemStyle: {
            color: undefined,
          },
          name: 'FE-2315',
          value: 13,
        },
      ]);
    });
  });

  describe('ngOnChanges', () => {
    it('should set chart options properly', () => {
      component.ngOnChanges();

      expect(component.options.tooltip).toEqual(TOOLTIP_CONFIG);
      expect(component.options.yAxis).toEqual(Y_AXIS_CONFIG);
      expect(component.options.series[0].type).toEqual('bar');
      expect(component.options.series[1].type).toEqual('line');
    });
  });
});
