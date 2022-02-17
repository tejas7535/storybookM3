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

import { ApplicationInsightsService } from '@schaeffler/application-insights';
import { BreadcrumbsModule } from '@schaeffler/breadcrumbs';
import { LoadingSpinnerModule } from '@schaeffler/loading-spinner';
import { ShareButtonModule } from '@schaeffler/share-button';
import { SubheaderModule } from '@schaeffler/subheader';

import { CUSTOMER_MOCK, QUOTATION_MOCK } from '../../../testing/mocks';
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
    detectChanges: false,
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
          detailCase: {
            detailCase: {},
          },
          processCase: {
            customer: {
              item: CUSTOMER_MOCK,
            },
            quotation: {
              item: QUOTATION_MOCK,
            },
          },
        },
      }),
    ],
    declarations: [DetailViewComponent],
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.debugElement.componentInstance;
  });

  test('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    test('should set observables', () => {
      component.ngOnInit();

      expect(component.quotation$).toBeDefined();
    });
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
