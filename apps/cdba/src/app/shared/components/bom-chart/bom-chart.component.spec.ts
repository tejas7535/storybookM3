import { MatIconModule } from '@angular/material/icon';
import { BomChartConfigService } from '@cdba/shared/components/bom-chart/bom-chart-config.service';
import {
  createComponentFactory,
  mockProvider,
  Spectator,
} from '@ngneat/spectator/jest';
import { TranslocoLocaleService } from '@ngneat/transloco-locale';
import { NgxEchartsModule } from 'ngx-echarts';

import { provideTranslocoTestingModule } from '@schaeffler/transloco';

import { BOM_MOCK } from '@cdba/testing/mocks';
import { ENV, getEnv } from '@cdba/environments/environment.provider';

import { BomItem } from '../../models';
import { SharedModule } from '../../shared.module';
import { BomChartComponent } from './bom-chart.component';
import {
  COLOR_PLATTE,
  TOOLTIP_CONFIG,
  Y_AXIS_CONFIG,
} from './bom-chart.constants';

describe('BomChartComponent', () => {
  let specatator: Spectator<BomChartComponent>;
  let component: BomChartComponent;
  let configService: BomChartConfigService;

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
    providers: [
      { provide: ENV, useValue: { ...getEnv() } },
      mockProvider(BomChartConfigService, {
        getXAxisConfig: jest.fn(() => [{}]),
        getChartSeries: jest.fn(() => [{}]),
      }),
      mockProvider(TranslocoLocaleService),
    ],
    disableAnimations: true,
    detectChanges: false,
  });

  beforeEach(() => {
    specatator = createComponent();
    configService = specatator.inject(BomChartConfigService);
    component = specatator.component;
    component.data = data;

    specatator.detectChanges();
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
      component.ngOnChanges();

      expect(component.options.tooltip).toEqual(TOOLTIP_CONFIG);
      expect(component.options.yAxis).toEqual(Y_AXIS_CONFIG);
      expect(component.options.series[0].type).toEqual('bar');
      expect(component.options.series[1].type).toEqual('line');
    });
  });
});
