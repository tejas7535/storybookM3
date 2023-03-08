import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

import {
  createComponentFactory,
  mockProvider,
  Spectator,
} from '@ngneat/spectator';
import { MockDirective } from 'ng-mocks';
import { NgxEchartsDirective } from 'ngx-echarts';

import { BarChartData } from '../quotation-by-product-line/models/bar-chart-data.model';
import { ChartConfigService } from '../quotation-by-product-line/services/chart.config.service';
import { QuotationByProductLineBarChartComponent } from './quotation-by-product-line-bar-chart.component';

describe('QuotationByProductLineBarChartComponent', () => {
  let component: QuotationByProductLineBarChartComponent;
  let spectator: Spectator<QuotationByProductLineBarChartComponent>;
  const inputData: BarChartData[] = [
    {
      gpm: '10',
      name: 'name1',
      share: '5%',
      value: 15,
    },
    {
      gpm: '10',
      name: 'name2',
      share: '5%',
      value: 20,
    },
  ];
  const createComponent = createComponentFactory({
    component: QuotationByProductLineBarChartComponent,

    schemas: [CUSTOM_ELEMENTS_SCHEMA],
    declarations: [MockDirective(NgxEchartsDirective)],
    providers: [
      mockProvider(ChartConfigService, {
        getSeriesConfig: jest.fn(),
        getXAxisConfig: jest.fn(),
        getLegend: jest.fn(),
        getTooltipConfig: jest.fn(),
      }),
    ],
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.debugElement.componentInstance;

    component.data = inputData;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    test('options shall be set', () => {
      component.ngOnInit();
      expect(component.options).toBeDefined();
    });
  });
});
