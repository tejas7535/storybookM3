import { MatButtonModule } from '@angular/material/button';
import { MATERIAL_SANITY_CHECKS } from '@angular/material/core';
import { MatSidenavModule } from '@angular/material/sidenav';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import {
  createComponentFactory,
  mockProvider,
  Spectator,
} from '@ngneat/spectator/jest';
import { TranslocoModule } from '@ngneat/transloco';
import { ReactiveComponentModule } from '@ngrx/component';
import { provideMockStore } from '@ngrx/store/testing';
import { marbles } from 'rxjs-marbles/jest';

import { ApplicationInsightsService } from '@schaeffler/application-insights';
import { BreadcrumbsModule } from '@schaeffler/breadcrumbs';
import { LoadingSpinnerModule } from '@schaeffler/loading-spinner';
import { ShareButtonModule } from '@schaeffler/share-button';
import { SubheaderModule } from '@schaeffler/subheader';

import {
  MATERIAL_STOCK_STATE_MOCK,
  PROCESS_CASE_STATE_MOCK,
  QUOTATION_MOCK,
} from '../../../testing/mocks';
import { MATERIAL_STOCK_MOCK } from '../../../testing/mocks/models/material-stock.mock';
import { CustomerHeaderModule } from '../../shared/header/customer-header/customer-header.module';
import { SharedPipesModule } from '../../shared/pipes/shared-pipes.module';
import { DetailViewComponent } from './detail-view.component';
import { FilterPricingModule } from './filter-pricing/filter-pricing.module';
import { PricingDetailsModule } from './pricing-details/pricing-details.module';

jest.mock('@ngneat/transloco', () => ({
  ...jest.requireActual<TranslocoModule>('@ngneat/transloco'),
  translate: jest.fn(() => 'translate it'),
}));

describe('DetailViewComponent', () => {
  let component: DetailViewComponent;
  let spectator: Spectator<DetailViewComponent>;

  const createComponent = createComponentFactory({
    component: DetailViewComponent,
    imports: [
      BrowserAnimationsModule,
      FilterPricingModule,
      MatButtonModule,
      MatSidenavModule,
      PricingDetailsModule,
      LoadingSpinnerModule,
      ReactiveComponentModule,
      SharedPipesModule,
      SubheaderModule,
      BreadcrumbsModule,
      CustomerHeaderModule,
      ShareButtonModule,
    ],
    providers: [
      { provide: MATERIAL_SANITY_CHECKS, useValue: false },
      mockProvider(ApplicationInsightsService),
      provideMockStore({
        initialState: {
          processCase: PROCESS_CASE_STATE_MOCK,
          materialStock: MATERIAL_STOCK_STATE_MOCK,
        },
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
    test(
      'should initialize observables',
      marbles((m) => {
        m.expect(component.quotation$).toBeObservable(
          m.cold('a', { a: QUOTATION_MOCK })
        );
        m.expect(component.quotationLoading$).toBeObservable(
          m.cold('a', { a: false })
        );
        m.expect(component.quotationDetail$).toBeObservable(
          m.cold('a', { a: undefined })
        );
        m.expect(component.materialStock$).toBeObservable(
          m.cold('a', { a: MATERIAL_STOCK_MOCK })
        );
        m.expect(component.materialStockLoading$).toBeObservable(
          m.cold('a', { a: false })
        );
      })
    );
    test('should add subscriptions', () => {
      component['subscription'].add = jest.fn();

      // tslint:disable-next-line: no-lifecycle-call
      component.ngOnInit();

      expect(component['subscription'].add).toHaveBeenCalledTimes(1);
    });
  });

  describe('ngOnDestroy', () => {
    test('should unsubscribe subscription', () => {
      component['subscription'].unsubscribe = jest.fn();

      // tslint:disable-next-line: no-lifecycle-call
      component.ngOnDestroy();

      expect(component['subscription'].unsubscribe).toHaveBeenCalledTimes(1);
    });
  });
});
