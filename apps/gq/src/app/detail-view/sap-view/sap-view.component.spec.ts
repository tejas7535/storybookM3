import { MatCardModule } from '@angular/material/card';
import { MATERIAL_SANITY_CHECKS } from '@angular/material/core';

import { BehaviorSubject } from 'rxjs';

import { activeCaseFeature } from '@gq/core/store/active-case/active-case.reducer';
import { MaterialPriceHeaderContentModule } from '@gq/shared/components/header/material-price-header-content/material-price-header-content.module';
import { StatusCustomerInfoHeaderModule } from '@gq/shared/components/header/status-customer-info-header/status-customer-info-header.module';
import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { PushPipe } from '@ngrx/component';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { marbles } from 'rxjs-marbles';

import { LoadingSpinnerModule } from '@schaeffler/loading-spinner';
import { ShareButtonModule } from '@schaeffler/share-button';
import { SubheaderModule } from '@schaeffler/subheader';
import { provideTranslocoTestingModule } from '@schaeffler/transloco/testing';

import {
  CUSTOMER_MOCK,
  QUOTATION_DETAIL_MOCK,
  QUOTATION_MOCK,
} from '../../../testing/mocks';
import {
  ACTIVE_CASE_STATE_MOCK,
  PROCESS_CASE_STATE_MOCK,
  SAP_PRICE_DETAILS_STATE_MOCK,
} from '../../../testing/mocks/state';
import { SapPriceDetailsTableModule } from './sap-price-details-table/sap-price-details-table.module';
import { SapViewComponent } from './sap-view.component';

describe('SapViewComponent', () => {
  let component: SapViewComponent;
  let spectator: Spectator<SapViewComponent>;
  let store: MockStore;

  const createComponent = createComponentFactory({
    component: SapViewComponent,
    imports: [
      provideTranslocoTestingModule({}),
      SubheaderModule,
      MatCardModule,
      PushPipe,
      ShareButtonModule,
      LoadingSpinnerModule,
      MaterialPriceHeaderContentModule,
      SapPriceDetailsTableModule,
      StatusCustomerInfoHeaderModule,
    ],
    providers: [
      provideMockStore({
        initialState: {
          processCase: PROCESS_CASE_STATE_MOCK,
          activeCase: ACTIVE_CASE_STATE_MOCK,
          sapPriceDetails: SAP_PRICE_DETAILS_STATE_MOCK,
        },
      }),
      { provide: MATERIAL_SANITY_CHECKS, useValue: false },
    ],
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.debugElement.componentInstance;
    store = spectator.inject(MockStore);
  });
  test('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    test(
      'should initialize observables',
      marbles((m) => {
        const breadcrumbs = [{ label: '' }];
        component['breadCrumbsService'].getPriceDetailBreadcrumbs = jest.fn(
          () => breadcrumbs
        );
        component['translocoService'].selectTranslateObject = jest.fn(
          () => new BehaviorSubject({ test: 'test' }) as any
        );
        store.overrideSelector(
          activeCaseFeature.getSelectedQuotationDetail,
          QUOTATION_DETAIL_MOCK
        );

        component.ngOnInit();

        m.expect(component.customer$).toBeObservable(
          m.cold('a', { a: CUSTOMER_MOCK })
        );
        m.expect(component.quotationDetail$).toBeObservable(
          m.cold('a', { a: QUOTATION_DETAIL_MOCK })
        );
        m.expect(component.quotationLoading$).toBeObservable(
          m.cold('a', { a: false })
        );
        m.expect(component.sapPriceDetailsLoading$).toBeObservable(
          m.cold('a', { a: false })
        );
        m.expect(component.rowData$).toBeObservable(m.cold('a', { a: [] }));
        m.expect(component.quotation$).toBeObservable(
          m.cold('a', {
            a: QUOTATION_MOCK,
          })
        );
        m.expect(component.breadcrumbs$).toBeObservable(
          m.cold('a', { a: breadcrumbs })
        );
        m.expect(component.translationsLoaded$).toBeObservable(
          m.hot('a', {
            a: true,
          })
        );
      })
    );
  });
});
