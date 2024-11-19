import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

import { BehaviorSubject, of } from 'rxjs';

import { ActiveCaseFacade } from '@gq/core/store/active-case/active-case.facade';
import { QuotationIdentifier } from '@gq/core/store/active-case/models/quotation-identifier.model';
import { ApprovalFacade } from '@gq/core/store/approval/approval.facade';
import { RolesFacade } from '@gq/core/store/facades/roles.facade';
import { ApprovalWorkflowInformation } from '@gq/shared/models/approval/approval-cockpit-data.model';
import { Quotation } from '@gq/shared/models/quotation/quotation.model';
import { SAP_SYNC_STATUS } from '@gq/shared/models/quotation-detail/sap-sync-status.enum';
import { BreadcrumbsService } from '@gq/shared/services/breadcrumbs/breadcrumbs.service';
import { FeatureToggleConfigService } from '@gq/shared/services/feature-toggle/feature-toggle-config.service';
import { ShipToParty } from '@gq/shared/services/rest/quotation/models/ship-to-party';
import { UpdateQuotationRequest } from '@gq/shared/services/rest/quotation/models/update-quotation-request.model';
import { TagType } from '@gq/shared/utils/misc.utils';
import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { PushPipe } from '@ngrx/component';
import { MockProvider } from 'ng-mocks';
import { marbles } from 'rxjs-marbles';

import { Breadcrumb } from '@schaeffler/breadcrumbs';
import { provideTranslocoTestingModule } from '@schaeffler/transloco/testing';

import { QUOTATION_MOCK } from '../../testing/mocks';
import { ProcessCaseViewComponent } from './process-case-view.component';

describe('ProcessCaseViewComponent', () => {
  let component: ProcessCaseViewComponent;
  let spectator: Spectator<ProcessCaseViewComponent>;

  const quotationSubject: BehaviorSubject<Quotation> = new BehaviorSubject(
    QUOTATION_MOCK
  );
  const customerLoadingSubject: BehaviorSubject<boolean> =
    new BehaviorSubject<boolean>(false);
  const quotationLoadingSubject: BehaviorSubject<boolean> =
    new BehaviorSubject<boolean>(false);
  const approvalCockpitLoadingSubject: BehaviorSubject<boolean> =
    new BehaviorSubject<boolean>(false);
  const approvalCockpitInformationSubject: BehaviorSubject<ApprovalWorkflowInformation> =
    new BehaviorSubject<ApprovalWorkflowInformation>(
      {} as ApprovalWorkflowInformation
    );
  const approvalErrorSubject: BehaviorSubject<Error> =
    new BehaviorSubject<Error>(undefined as Error);

  const createComponent = createComponentFactory({
    component: ProcessCaseViewComponent,
    imports: [provideTranslocoTestingModule({ en: {} }), PushPipe],

    providers: [
      MockProvider(FeatureToggleConfigService),
      MockProvider(BreadcrumbsService),
      MockProvider(ApprovalFacade, {
        approvalCockpitInformation$:
          approvalCockpitInformationSubject.asObservable(),
        approvalCockpitLoading$: approvalCockpitLoadingSubject.asObservable(),
        error$: approvalErrorSubject.asObservable(),
        stopApprovalCockpitDataPolling: jest.fn(),
        getApprovalCockpitData: jest.fn(),
      }),
      MockProvider(ActiveCaseFacade, {
        quotation$: quotationSubject.asObservable(),
        quotationIdentifier$: of({ gqId: 1234 } as QuotationIdentifier),
        quotationSapSyncStatus$: of(SAP_SYNC_STATUS.NOT_SYNCED),
        tabsForProcessCaseView$: of([]),
        tagType$: of('info' as TagType),
        customerLoading$: customerLoadingSubject.asObservable(),
        quotationLoading$: quotationLoadingSubject.asObservable(),
        updateQuotation: jest.fn(),
      }),
      MockProvider(RolesFacade),
    ],

    schemas: [CUSTOM_ELEMENTS_SCHEMA],
    detectChanges: false,
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.debugElement.componentInstance;
  });

  test('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Observables', () => {
    test(
      'should set quotation$',
      marbles((m) => {
        m.expect(component.quotation$).toBeObservable(
          m.cold('a', { a: QUOTATION_MOCK })
        );
      })
    );

    test(
      'should set sapStatus$',
      marbles((m) => {
        m.expect(component.sapStatus$).toBeObservable(
          m.cold('(a|)', { a: SAP_SYNC_STATUS.NOT_SYNCED })
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

        m.expect(component.breadcrumbs$).toBeObservable(
          m.cold('(a|)', { a: breadcrumbs })
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

  describe('ngOnDestroy', () => {
    test('should emit shutDown and stop approval cockpit data polling', () => {
      const stopApprovalCockpitDataPolling = jest.fn();

      Object.defineProperty(component, 'approvalFacade', {
        value: { stopApprovalCockpitDataPolling },
      });

      component.ngOnDestroy();

      expect(stopApprovalCockpitDataPolling).toHaveBeenCalled();
    });
  });

  describe('updateQuotation', () => {
    test('should dispatch updateQuotation', () => {
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

      expect(
        component['activeCaseFacade'].updateQuotation
      ).toHaveBeenCalledWith(updateQuotationRequest);
    });
  });
});
