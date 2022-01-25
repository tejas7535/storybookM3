import { createComponentFactory, Spectator } from '@ngneat/spectator';
import { NgxEchartsModule } from 'ngx-echarts';
import resize_observer_polyfill from 'resize-observer-polyfill';

import { UnderConstructionModule } from '@schaeffler/empty-states';
import { provideTranslocoTestingModule } from '@schaeffler/transloco/testing';

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
        echarts: async () => import('echarts'),
      }),
    ],
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.debugElement.componentInstance;
  });

  test('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    test('should set options', () => {
      component.currency = 'EUR';
      component['chartConfigService'].buildDataPoints = jest.fn();
      component['chartConfigService'].getToolTipConfig = jest.fn();
      component['chartConfigService'].getXAxisConfig = jest.fn();
      component['chartConfigService'].getSeriesConfig = jest.fn();
      component['regressionService'].buildRegressionPoints = jest.fn();
      component.transactions = [];
      component.coefficients = { coefficient1: 0.5, coefficient2: 0.8 };

      // tslint:disable-next-line: no-lifecycle-call
      component.ngOnInit();

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
      expect(
        component['regressionService'].buildRegressionPoints
      ).toHaveBeenCalledTimes(1);
      expect(component.options).toBeDefined();
    });
  });
});
