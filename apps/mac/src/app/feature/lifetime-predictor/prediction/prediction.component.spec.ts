import { DecimalPipe } from '@angular/common';
import { TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MATERIAL_SANITY_CHECKS } from '@angular/material/core';
import { MatDividerModule } from '@angular/material/divider';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatRadioModule } from '@angular/material/radio';
import { MatTabsModule } from '@angular/material/tabs';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { translate } from '@ngneat/transloco';
import { PushModule } from '@ngrx/component';
import { StoreModule } from '@ngrx/store';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import resize_observer_polyfill from 'resize-observer-polyfill';

import { BannerModule, BannerState } from '@schaeffler/banner';
import { provideTranslocoTestingModule } from '@schaeffler/transloco/testing';

import * as en from '../../../../assets/i18n/en.json';
import { initialState as initialInputState } from '../store/reducers/input.reducer';
import { initialState as initialPredictionState } from '../store/reducers/prediction.reducer';
import { TooltipModule } from './../../../shared/components/tooltip/tooltip.module';
import { BreadcrumbsService } from './../../../shared/services/breadcrumbs/breadcrumbs.service';
import { SharedModule } from './../../../shared/shared.module';
import { ChartType } from './../enums/chart-type.enum';
import { postPrediction, setChartType } from './../store';
import { ChartModule } from './chart/chart.module';
import { KpiComponent } from './kpi/kpi.component';
import { PredictionComponent } from './prediction.component';
window.ResizeObserver = resize_observer_polyfill;

jest.mock('../../../shared/change-favicon.ts', () => ({
  changeFavicon: jest.fn(() => {}),
}));
describe('PredictionComponent', () => {
  let component: PredictionComponent;
  let spectator: Spectator<PredictionComponent>;
  let store: MockStore;

  const initialBannerState: BannerState = {
    text: undefined,
    buttonText: undefined,
    icon: undefined,
    truncateSize: undefined,
    showFullText: false,
    open: false,
  };

  const createComponent = createComponentFactory({
    component: PredictionComponent,
    declarations: [PredictionComponent, KpiComponent],
    imports: [
      NoopAnimationsModule,
      MatButtonModule,
      MatMenuModule,
      MatTabsModule,
      MatCardModule,
      StoreModule.forRoot({}),
      provideTranslocoTestingModule({ en }),
      ChartModule,
      MatExpansionModule,
      MatDividerModule,
      TooltipModule,
      MatIconModule,
      ReactiveFormsModule,
      PushModule,
      MatFormFieldModule,
      MatInputModule,
      MatRadioModule,
      SharedModule,
      BannerModule,
    ],
    providers: [
      provideMockStore({
        initialState: {
          ltp: {
            prediction: initialPredictionState,
            input: initialInputState,
          },
          banner: initialBannerState,
        },
      }),
      {
        provide: BreadcrumbsService,
        useValue: {
          updateBreadcrumb: jest.fn(() => {}),
        },
      },
      DecimalPipe,
      {
        provide: MATERIAL_SANITY_CHECKS,
        useValue: false,
      },
    ],
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.debugElement.componentInstance;
    store = TestBed.inject(MockStore);

    store.dispatch = jest.fn();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('#ngOnInit', () => {
    it('should dispatch action postPrediction', () => {
      component.ngOnInit();

      expect(store.dispatch).toHaveBeenCalledWith(postPrediction());
    });
  });

  describe('openBanner', () => {
    it('should dispatch openBanner action', () => {
      const banner = {
        text: translate('ltp.disclaimer'),
        icon: 'info',
        buttonText: translate('ltp.disclaimerClose'),
        truncateSize: 0,
        type: '[Banner] Open Banner',
      };
      store.dispatch = jest.fn();

      component.openBanner();
      expect(store.dispatch).toHaveBeenCalledWith(banner);
    });
  });

  it('customize tooltip should add text if 10000 <= x <= 10000000', () => {
    const testObj: any = component.customizeTooltip({
      value: {
        x: 10_001,
        y2: 1,
      },
      axisValue: 5,
    });
    expect(testObj).toBeTruthy();
  });

  it('customize tooltip should not add text if 10000 > x | x > 10000000', () => {
    const testObj: any = component.customizeTooltip([
      {
        value: {
          x: 9999,
          y2: 1,
        },
        axisValue: 5,
      },
    ]);
    expect(testObj).not.toBeDefined();
  });

  it('filterLegendGraphs should return true if a given value name is inside a given data object, otherwise false', () => {
    let filterValue = component.filterLegendGraphs('y1', [{ y1: 123 }]);
    expect(filterValue).toEqual(true);

    filterValue = component.filterLegendGraphs('y1', [{ y: 123 }, { x: 123 }]);
    expect(filterValue).toEqual(false);
  });

  it('should set Haigh chart settings when chartType is changed', () => {
    component.selectChartType(1);
    const action = setChartType({ chartType: ChartType.Haigh });

    expect(store.dispatch).toHaveBeenCalledWith(action);
  });
});
