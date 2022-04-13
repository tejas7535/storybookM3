import { createComponentFactory, Spectator } from '@ngneat/spectator';
import { NgxEchartsModule } from 'ngx-echarts';
import resize_observer_polyfill from 'resize-observer-polyfill';

import { UnderConstructionModule } from '@schaeffler/empty-states';
import { provideTranslocoTestingModule } from '@schaeffler/transloco/testing';

import { ChartConfigService } from './echarts/chart.config.service';
import { RegressionService } from './echarts/regression.service';
import { TransparencyGraphComponent } from './transparency-graph.component';
window.ResizeObserver = resize_observer_polyfill;

describe('TransparencyGraphComponent', () => {
  let component: TransparencyGraphComponent;
  let spectator: Spectator<TransparencyGraphComponent>;

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
          getSeriesConfig: jest.fn(() => ({
            series: [],
            options: [],
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
    component = spectator.debugElement.componentInstance;

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

    test('should set options', () => {
      spectator.detectChanges();

      expect(
        component['chartConfigService'].buildDataPoints
      ).toHaveBeenCalledTimes(1);
      expect(
        component['chartConfigService'].getToolTipConfig
      ).toHaveBeenCalledTimes(1);
      expect(
        component['chartConfigService'].getXAxisConfig
      ).toHaveBeenCalledTimes(1);
      expect(
        component['chartConfigService'].getSeriesConfig
      ).toHaveBeenCalledTimes(1);
      expect(component['chartConfigService'].getLegend).toHaveBeenCalledTimes(
        1
      );
      expect(
        component['regressionService'].buildRegressionPoints
      ).toHaveBeenCalledTimes(1);
      expect(component.options).toBeDefined();
    });

    test('should update options', () => {
      spectator.detectChanges();

      spectator.setInput('transactions', []);

      expect(
        component['chartConfigService'].buildDataPoints
      ).toHaveBeenCalledTimes(2);
      expect(
        component['chartConfigService'].getToolTipConfig
      ).toHaveBeenCalledTimes(2);
      expect(
        component['chartConfigService'].getXAxisConfig
      ).toHaveBeenCalledTimes(2);
      expect(
        component['chartConfigService'].getSeriesConfig
      ).toHaveBeenCalledTimes(2);
      expect(
        component['regressionService'].buildRegressionPoints
      ).toHaveBeenCalledTimes(2);
      expect(component.options).toBeDefined();
    });
  });
});
