import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

import { updateQuotation } from '@gq/core/store/actions';
import {
  getCustomerLoading,
  getGqId,
  getQuotation,
  getQuotationLoading,
  getQuotationSapSyncStatus,
} from '@gq/core/store/selectors';
import { SharedPipesModule } from '@gq/shared/pipes/shared-pipes.module';
import { BreadcrumbsService } from '@gq/shared/services/breadcrumbs/breadcrumbs.service';
import { FeatureToggleConfigService } from '@gq/shared/services/feature-toggle/feature-toggle-config.service';
import { ShipToParty } from '@gq/shared/services/rest/quotation/models/ship-to-party';
import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { PushModule } from '@ngrx/component';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { MockProvider } from 'ng-mocks';
import { marbles } from 'rxjs-marbles';

import { Breadcrumb } from '@schaeffler/breadcrumbs';
import { provideTranslocoTestingModule } from '@schaeffler/transloco/testing';

import { PROCESS_CASE_STATE_MOCK, QUOTATION_MOCK } from '../../testing/mocks';
import { SAP_SYNC_STATUS } from '../shared/models/quotation-detail/sap-sync-status.enum';
import { UpdateQuotationRequest } from '../shared/services/rest/quotation/models/update-quotation-request.model';
import { ProcessCaseViewComponent } from './process-case-view.component';

describe('ProcessCaseViewComponent', () => {
  let component: ProcessCaseViewComponent;
  let spectator: Spectator<ProcessCaseViewComponent>;
  let store: MockStore;

  const createComponent = createComponentFactory({
    component: ProcessCaseViewComponent,
    imports: [
      provideTranslocoTestingModule({ en: {} }),
      PushModule,
      SharedPipesModule,
    ],

    providers: [
      MockProvider(FeatureToggleConfigService),
      MockProvider(BreadcrumbsService),
      provideMockStore({
        initialState: {
          processCase: PROCESS_CASE_STATE_MOCK,
          'azure-auth': {},
        },
      }),
    ],

    schemas: [CUSTOM_ELEMENTS_SCHEMA],
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
      'should set customerLoading$',
      marbles((m) => {
        store.overrideSelector(getCustomerLoading, true);

        component.ngOnInit();

        m.expect(component.customerLoading$).toBeObservable(
          m.cold('a', { a: true })
        );
      })
    );
    test(
      'should set quotation$',
      marbles((m) => {
        store.overrideSelector(getQuotation, QUOTATION_MOCK);

        component.ngOnInit();

        m.expect(component.quotation$).toBeObservable(
          m.cold('a', { a: QUOTATION_MOCK })
        );
      })
    );
    test(
      'should set quotationLoading$',
      marbles((m) => {
        store.overrideSelector(getQuotationLoading, true);

        component.ngOnInit();

        m.expect(component.quotationLoading$).toBeObservable(
          m.cold('a', { a: true })
        );
      })
    );

    test(
      'should set sapStatus$',
      marbles((m) => {
        store.overrideSelector(
          getQuotationSapSyncStatus,
          SAP_SYNC_STATUS.NOT_SYNCED
        );

        component.ngOnInit();

        m.expect(component.sapStatus$).toBeObservable(
          m.cold('a', { a: SAP_SYNC_STATUS.NOT_SYNCED })
        );
      })
    );

    test(
      'should set breadcrumbs$',
      marbles((m) => {
        const breadcrumbs: Breadcrumb[] = [
          {
            label: 'Test',
          },
        ];
        component[
          'breadCrumbsService'
        ].getQuotationBreadcrumbsForProcessCaseView = jest.fn(
          (): Breadcrumb[] => breadcrumbs
        );
        store.overrideSelector(getGqId, 1234);

        component.ngOnInit();

        m.expect(component.breadcrumbs$).toBeObservable(
          m.cold('a', { a: breadcrumbs })
        );
        component.breadcrumbs$.subscribe(() => {
          expect(
            component['breadCrumbsService']
              .getQuotationBreadcrumbsForProcessCaseView
          ).toHaveBeenCalledTimes(1);
          expect(
            component['breadCrumbsService']
              .getQuotationBreadcrumbsForProcessCaseView
          ).toHaveBeenCalledWith(1234);
        });
      })
    );
  });

  describe('updateQuotation', () => {
    test('should dispatch updateQuotation', () => {
      store.dispatch = jest.fn();
      const updateQuotationRequest: UpdateQuotationRequest = {
        caseName: 'caseName',
        currency: 'USD',
        quotationToDate: '',
        validTo: '',
        customerPurchaseOrderDate: '',
        requestedDelDate: '',
        shipToParty: {
          customerId: '12345',
          salesOrg: '67890',
        } as ShipToParty,
      };
      component.updateQuotation(updateQuotationRequest);

      expect(store.dispatch).toHaveBeenCalledTimes(1);
      expect(store.dispatch).toHaveBeenCalledWith(
        updateQuotation(updateQuotationRequest)
      );
    });
  });
});
