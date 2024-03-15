import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

import { of } from 'rxjs';

import { ActiveCaseActions } from '@gq/core/store/active-case/active-case.action';
import { activeCaseFeature } from '@gq/core/store/active-case/active-case.reducer';
import {
  getGqId,
  getQuotationSapSyncStatus,
} from '@gq/core/store/active-case/active-case.selectors';
import { ApprovalFacade } from '@gq/core/store/approval/approval.facade';
import { ApprovalWorkflowInformation, Quotation } from '@gq/shared/models';
import { SAP_SYNC_STATUS } from '@gq/shared/models/quotation-detail/sap-sync-status.enum';
import { SharedPipesModule } from '@gq/shared/pipes/shared-pipes.module';
import { BreadcrumbsService } from '@gq/shared/services/breadcrumbs/breadcrumbs.service';
import { FeatureToggleConfigService } from '@gq/shared/services/feature-toggle/feature-toggle-config.service';
import { ShipToParty } from '@gq/shared/services/rest/quotation/models/ship-to-party';
import { UpdateQuotationRequest } from '@gq/shared/services/rest/quotation/models/update-quotation-request.model';
import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { PushPipe } from '@ngrx/component';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { MockPipe, MockProvider } from 'ng-mocks';
import { marbles } from 'rxjs-marbles';

import { Breadcrumb } from '@schaeffler/breadcrumbs';
import { provideTranslocoTestingModule } from '@schaeffler/transloco/testing';

import { PROCESS_CASE_STATE_MOCK, QUOTATION_MOCK } from '../../testing/mocks';
import { ACTIVE_CASE_STATE_MOCK } from '../../testing/mocks/state/active-case-state.mock';
import { ProcessCaseViewComponent } from './process-case-view.component';

describe('ProcessCaseViewComponent', () => {
  let component: ProcessCaseViewComponent;
  let spectator: Spectator<ProcessCaseViewComponent>;
  let store: MockStore;

  const createComponent = createComponentFactory({
    component: ProcessCaseViewComponent,
    imports: [
      provideTranslocoTestingModule({ en: {} }),
      MockPipe(PushPipe),
      SharedPipesModule,
    ],

    providers: [
      MockProvider(FeatureToggleConfigService),
      MockProvider(BreadcrumbsService),
      MockProvider(ApprovalFacade),
      provideMockStore({
        initialState: {
          processCase: PROCESS_CASE_STATE_MOCK,
          activeCase: ACTIVE_CASE_STATE_MOCK,
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
      'should set quotation$',
      marbles((m) => {
        store.overrideSelector(
          activeCaseFeature.selectQuotation,
          QUOTATION_MOCK
        );

        component.ngOnInit();

        m.expect(component.quotation$).toBeObservable(
          m.cold('a', { a: QUOTATION_MOCK })
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

    describe('calculate loadingComplete', () => {
      test(
        'should return false when ApprovalCockpit is on loading',
        marbles((m) => {
          const facadeMock: ApprovalFacade = {
            approvalCockpitInformation$: of({
              sapId: undefined,
            } as ApprovalWorkflowInformation),
            approvalCockpitLoading$: of(true),
            getApprovalCockpitData: jest.fn(),
            error$: of(undefined as Error),
            stopApprovalCockpitDataPolling: jest.fn(),
          } as unknown as ApprovalFacade;

          Object.defineProperty(component, 'approvalFacade', {
            value: facadeMock,
          });

          store.overrideSelector(
            activeCaseFeature.selectCustomerLoading,
            false
          );
          store.overrideSelector(
            activeCaseFeature.selectQuotationLoading,
            false
          );

          component.ngOnInit();

          m.expect(component.dataLoadingComplete$).toBeObservable(
            m.cold('a', { a: false })
          );
        })
      );

      test(
        'should return true when ApprovalCockpit loading has finished with an error',
        marbles((m) => {
          const facadeMock: ApprovalFacade = {
            approvalCockpitInformation$: of({
              sapId: undefined,
            } as ApprovalWorkflowInformation),
            approvalCockpitLoading$: of(false),
            getApprovalCockpitData: jest.fn(),
            error$: of({ message: 'Error' }),
            stopApprovalCockpitDataPolling: jest.fn(),
          } as unknown as ApprovalFacade;

          Object.defineProperty(component, 'approvalFacade', {
            value: facadeMock,
          });

          store.overrideSelector(
            activeCaseFeature.selectCustomerLoading,
            false
          );
          store.overrideSelector(
            activeCaseFeature.selectQuotationLoading,
            false
          );

          component.ngOnInit();

          m.expect(component.dataLoadingComplete$).toBeObservable(
            m.cold('a', { a: true })
          );
        })
      );

      test(
        'should return false when customer is on loading',
        marbles((m) => {
          const facadeMock: ApprovalFacade = {
            approvalCockpitInformation$: of({
              sapId: '12',
            } as ApprovalWorkflowInformation),
            approvalCockpitLoading$: of(false),
            getApprovalCockpitData: jest.fn(),
            error$: of(undefined as Error),
            stopApprovalCockpitDataPolling: jest.fn(),
          } as unknown as ApprovalFacade;

          Object.defineProperty(component, 'approvalFacade', {
            value: facadeMock,
          });

          store.overrideSelector(activeCaseFeature.selectCustomerLoading, true);
          store.overrideSelector(
            activeCaseFeature.selectQuotationLoading,
            false
          );

          component.ngOnInit();

          m.expect(component.dataLoadingComplete$).toBeObservable(
            m.cold('a', { a: false })
          );
        })
      );

      test(
        'should return false when quotation is on loading',
        marbles((m) => {
          const facadeMock: ApprovalFacade = {
            approvalCockpitInformation$: of({
              sapId: '12',
            } as ApprovalWorkflowInformation),
            approvalCockpitLoading$: of(false),
            getApprovalCockpitData: jest.fn(),
            error$: of(undefined as Error),
            stopApprovalCockpitDataPolling: jest.fn(),
          } as unknown as ApprovalFacade;

          Object.defineProperty(component, 'approvalFacade', {
            value: facadeMock,
          });

          store.overrideSelector(
            activeCaseFeature.selectCustomerLoading,
            false
          );
          store.overrideSelector(
            activeCaseFeature.selectQuotationLoading,
            true
          );

          component.ngOnInit();

          m.expect(component.dataLoadingComplete$).toBeObservable(
            m.cold('a', { a: false })
          );
        })
      );

      test(
        'should not consider approval information loading status if quotation is not synced with SAP',
        marbles((m) => {
          const facadeMock: ApprovalFacade = {
            approvalCockpitInformation$: of({
              sapId: '12',
            } as ApprovalWorkflowInformation),
            approvalCockpitLoading$: of(true),
            getApprovalCockpitData: jest.fn(),
            error$: of(undefined as Error),
            stopApprovalCockpitDataPolling: jest.fn(),
          } as unknown as ApprovalFacade;

          Object.defineProperty(component, 'approvalFacade', {
            value: facadeMock,
          });

          store.overrideSelector(
            activeCaseFeature.selectCustomerLoading,
            false
          );
          store.overrideSelector(
            activeCaseFeature.selectQuotationLoading,
            false
          );
          store.overrideSelector(activeCaseFeature.selectQuotation, {
            ...ACTIVE_CASE_STATE_MOCK.quotation,
            sapId: undefined,
          });

          component.ngOnInit();

          m.expect(component.dataLoadingComplete$).toBeObservable(
            m.cold('a', { a: true })
          );
        })
      );

      test(
        'should return true when data received completely',
        marbles((m) => {
          const facadeMock: ApprovalFacade = {
            approvalCockpitInformation$: of({
              sapId: '12',
            } as ApprovalWorkflowInformation),
            approvalCockpitLoading$: of(false),
            getApprovalCockpitData: jest.fn(),
            error$: of(undefined as Error),
            stopApprovalCockpitDataPolling: jest.fn(),
          } as unknown as ApprovalFacade;

          Object.defineProperty(component, 'approvalFacade', {
            value: facadeMock,
          });

          store.overrideSelector(
            activeCaseFeature.selectCustomerLoading,
            false
          );
          store.overrideSelector(
            activeCaseFeature.selectQuotationLoading,
            false
          );

          component.ngOnInit();

          m.expect(component.dataLoadingComplete$).toBeObservable(
            m.cold('a', { a: true })
          );
        })
      );
    });
  });

  describe('requestApprovalData', () => {
    test('should call requestApprovalData', () => {
      const sapId = 'testSapId';
      component['initObservables'] = jest.fn();
      component.quotation$ = of({
        sapId,
        customer: { enabledForApprovalWorkflow: true },
      } as Quotation);

      const getApprovalCockpitDataSpy = jest.spyOn(
        component['approvalFacade'],
        'getApprovalCockpitData'
      );

      component.ngOnInit();

      expect(getApprovalCockpitDataSpy).toHaveBeenCalledWith(sapId, true);
    });

    test('should not call requestApprovalData', () => {
      component['initObservables'] = jest.fn();
      component.quotation$ = of(undefined as Quotation);

      const getApprovalCockpitDataSpy = jest.spyOn(
        component['approvalFacade'],
        'getApprovalCockpitData'
      );

      component.ngOnInit();

      expect(getApprovalCockpitDataSpy).not.toHaveBeenCalled();
    });
  });

  describe('ngOnDestroy', () => {
    test('should emit shutDown and stop approval cockpit data polling', () => {
      const stopApprovalCockpitDataPolling = jest.fn();

      Object.defineProperty(component, 'approvalFacade', {
        value: { stopApprovalCockpitDataPolling },
      });
      component['shutDown$$'].next = jest.fn();
      component['shutDown$$'].complete = jest.fn();

      component.ngOnDestroy();

      expect(component['shutDown$$'].next).toHaveBeenCalled();
      expect(component['shutDown$$'].complete).toHaveBeenCalled();
      expect(stopApprovalCockpitDataPolling).toHaveBeenCalled();
    });
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
        ActiveCaseActions.updateQuotation(updateQuotationRequest)
      );
    });
  });
});
