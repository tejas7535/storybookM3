import { SimpleChange } from '@angular/core';

import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { NgxEchartsModule } from 'ngx-echarts';
import resize_observer_polyfill from 'resize-observer-polyfill';

// eslint-disable-next-line @nx/enforce-module-boundaries
import { UnderConstructionModule } from '@schaeffler/empty-states';
import { provideTranslocoTestingModule } from '@schaeffler/transloco/testing';

import { ChartConfigService } from './echarts/chart.config.service';
import { RegressionService } from './echarts/regression.service';
import { TransparencyGraphComponent } from './transparency-graph.component';

window.ResizeObserver = resize_observer_polyfill;

describe('TransparencyGraphComponent', () => {
  let spectator: Spectator<TransparencyGraphComponent>;
  let component: TransparencyGraphComponent;

  const createComponent = createComponentFactory({
    component: TransparencyGraphComponent,
    imports: [
      UnderConstructionModule,
      provideTranslocoTestingModule({ en: {} }),
      NgxEchartsModule.forRoot({
        echarts: jest.fn().mockResolvedValue({ init: jest.fn() }),
      }),
    ],
    providers: [
      {
        provide: ChartConfigService,
        useValue: {
          buildDataPoints: jest.fn(),
          getToolTipConfig: jest.fn(),
          getXAxisConfig: jest.fn(),
          getYAxisConfig: jest.fn(),
          getSeriesConfig: jest.fn(() => ({
            series: [] as any,
            options: [] as any,
          })),
          getLegend: jest.fn(),
        },
      },
      {
        provide: RegressionService,
        useValue: {
          buildRegressionPoints: jest.fn(),
        },
      },
    ],
    detectChanges: false,
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.component;

    component.currency = 'EUR';
    component.transactions = [];
    component.coefficients = { coefficient1: 0.5, coefficient2: 0.8 };
  });

  test('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('update options', () => {
    afterEach(() => {
      jest.clearAllMocks();
    });

    test('should set options correctly with base conditions', () => {
      component.currency = 'USD';
      component.currentEurExchangeRatio = 1.2;

      component.ngOnChanges({
        currency: new SimpleChange('EUR', 'USD', false),
        currentEurExchangeRatio: new SimpleChange(null, 1.2, true),
      });

      expect(
        component['chartConfigService'].buildDataPoints
      ).toHaveBeenCalledTimes(1);
      expect(
        component['regressionService'].buildRegressionPoints
      ).toHaveBeenCalledTimes(1);
      expect(component.options).toBeDefined();
    });

    test('should not update options if base conditions are incomplete', () => {
      component.coefficients = undefined;

      component.ngOnChanges({
        currentEurExchangeRatio: new SimpleChange(null, 1.2, true),
      });

      expect(
        component['chartConfigService'].buildDataPoints
      ).toHaveBeenCalledTimes(0);
      expect(
        component['regressionService'].buildRegressionPoints
      ).toHaveBeenCalledTimes(0);
    });

    test('should update options when currentEurExchangeRatio changes', () => {
      component.currentEurExchangeRatio = 1.2;
      component.ngOnChanges({
        currentEurExchangeRatio: new SimpleChange(1.2, 1.5, false),
      });

      expect(
        component['chartConfigService'].buildDataPoints
      ).toHaveBeenCalledTimes(1);
      expect(
        component['regressionService'].buildRegressionPoints
      ).toHaveBeenCalledTimes(1);
      expect(component.options).toBeDefined();
    });
  });
});
