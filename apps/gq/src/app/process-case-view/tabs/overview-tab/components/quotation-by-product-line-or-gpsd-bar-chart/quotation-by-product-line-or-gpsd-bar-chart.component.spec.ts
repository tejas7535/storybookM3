import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

import {
  createComponentFactory,
  mockProvider,
  Spectator,
} from '@ngneat/spectator/jest';
import { MockDirective } from 'ng-mocks';
import { NgxEchartsDirective } from 'ngx-echarts';

import { BarChartData } from '../../models';
import { ChartConfigService } from '../../services/chart.config.service';
import { QuotationByProductLineOrGpsdBarChartComponent } from './quotation-by-product-line-or-gpsd-bar-chart.component';

describe('QuotationByProductLineBarChartComponent', () => {
  let component: QuotationByProductLineOrGpsdBarChartComponent;
  let spectator: Spectator<QuotationByProductLineOrGpsdBarChartComponent>;
  const inputData: BarChartData[] = [
    {
      gpm: '10',
      name: 'name1',
      share: '5%',
      value: 15,
      numberOfItems: 1,
    },
    {
      gpm: '10',
      name: 'name2',
      share: '5%',
      value: 20,
      numberOfItems: 1,
    },
  ];
  const createComponent = createComponentFactory({
    component: QuotationByProductLineOrGpsdBarChartComponent,
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
    detectChanges: false,
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.debugElement.componentInstance;

    component.data = inputData;
    jest.resetAllMocks();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    test('options shall be set', () => {
      spectator.detectChanges();
      expect(component.options).toBeDefined();
    });
  });

  describe('ngOnChanges', () => {
    test('should recalculate the options', () => {
      component['getOptions'] = jest.fn();
      spectator.setInput('data', [
        {
          gpm: '1',
          name: '!',
          share: '12',
          value: 15,
          numberOfItems: 1,
        },
      ]);
      spectator.detectChanges();
      expect(component['getOptions']).toHaveBeenCalled();
    });

    test('should not recalculate the options when no changes', () => {
      component['getOptions'] = jest.fn();
      expect(component['getOptions']).not.toHaveBeenCalled();
    });
  });
});
