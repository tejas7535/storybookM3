import { MATERIAL_SANITY_CHECKS } from '@angular/material/core';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';

import { BehaviorSubject } from 'rxjs';

import {
  createComponentFactory,
  mockProvider,
  Spectator,
} from '@ngneat/spectator/jest';
import { ReactiveComponentModule } from '@ngrx/component';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { marbles } from 'rxjs-marbles';

import { ApplicationInsightsService } from '@schaeffler/application-insights';
import { BreadcrumbsModule } from '@schaeffler/breadcrumbs';
import { LoadingSpinnerModule } from '@schaeffler/loading-spinner';
import { ShareButtonModule } from '@schaeffler/share-button';
import { SubheaderModule } from '@schaeffler/subheader';
import { provideTranslocoTestingModule } from '@schaeffler/transloco/testing';

import {
  CUSTOMER_MOCK,
  QUOTATION_DETAIL_MOCK,
  QUOTATION_MOCK,
} from '../../testing/mocks';
import { DetailViewQueryParams } from '../app-routing.module';
import {
  getCustomer,
  getCustomerLoading,
  getQuotationLoading,
  getSelectedQuotationDetailItemId,
} from '../core/store';
import { CustomerInformationModule } from './customer-information/customer-information.module';
import { CustomerViewComponent } from './customer-view.component';

describe('CustomerViewComponent', () => {
  let component: CustomerViewComponent;
  let spectator: Spectator<CustomerViewComponent>;
  let store: MockStore;

  const createComponent = createComponentFactory({
    component: CustomerViewComponent,
    detectChanges: false,
    imports: [
      BrowserAnimationsModule,
      CustomerInformationModule,
      MatSidenavModule,
      LoadingSpinnerModule,
      ReactiveComponentModule,
      RouterTestingModule,
      BreadcrumbsModule,
      SubheaderModule,
      ShareButtonModule,
      MatSnackBarModule,
      provideTranslocoTestingModule({ en: {} }),
    ],
    providers: [
      { provide: MATERIAL_SANITY_CHECKS, useValue: false },
      mockProvider(ApplicationInsightsService),
      provideMockStore({
        initialState: {
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
    declarations: [CustomerViewComponent],
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
      'should set selectedQuotationDetailItemId$',
      marbles((m) => {
        store.overrideSelector(getSelectedQuotationDetailItemId, 10);
        component.ngOnInit();

        m.expect(component.selectedQuotationDetailItemId$).toBeObservable('a', {
          a: 10,
        });
      })
    );
    test(
      'should set customer$',
      marbles((m) => {
        store.overrideSelector(getCustomer, CUSTOMER_MOCK);
        component.ngOnInit();

        m.expect(component.customer$).toBeObservable('a', {
          a: CUSTOMER_MOCK,
        });
      })
    );
    test(
      'should set quotationLoading$',
      marbles((m) => {
        store.overrideSelector(getQuotationLoading, true);
        component.ngOnInit();

        m.expect(component.quotationLoading$).toBeObservable('a', {
          a: true,
        });
      })
    );
    test(
      'should set customerLoading$',
      marbles((m) => {
        store.overrideSelector(getCustomerLoading, true);
        component.ngOnInit();

        m.expect(component.customerLoading$).toBeObservable('a', {
          a: true,
        });
      })
    );
    test(
      'should set params$',
      marbles((m) => {
        const detailViewQueryParams: DetailViewQueryParams = {
          gqPositionId: QUOTATION_DETAIL_MOCK.gqPositionId,
          customer_number: CUSTOMER_MOCK.identifier.customerId,
          quotation_number: QUOTATION_MOCK.gqId,
          sales_org: CUSTOMER_MOCK.identifier.salesOrg,
        };

        component['router'].queryParams = new BehaviorSubject(
          detailViewQueryParams
        );
        component.ngOnInit();

        m.expect(component.params$).toBeObservable('a', {
          a: detailViewQueryParams,
        });
      })
    );
    test(
      'should set breadcrumbs$',
      marbles((m) => {
        const breadcrumbs = [
          {
            label: 'Test',
          },
        ];

        component['breadCrumbsService'].getCustomerBreadCrumbs = jest.fn(
          () => breadcrumbs
        );

        component.ngOnInit();

        m.expect(component.breadcrumbs$).toBeObservable('a', {
          a: breadcrumbs,
        });
        component.breadcrumbs$.subscribe(() => {
          expect(
            component['breadCrumbsService'].getCustomerBreadCrumbs
          ).toHaveBeenCalledTimes(1);
        });
      })
    );
  });
});
