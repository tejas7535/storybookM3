import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';

import { of } from 'rxjs';

import { ActiveCaseFacade } from '@gq/core/store/active-case/active-case.facade';
import { activeCaseFeature } from '@gq/core/store/active-case/active-case.reducer';
import { ApprovalFacade } from '@gq/core/store/approval/approval.facade';
import { ApprovalWorkflowInformation, Quotation } from '@gq/shared/models';
import {
  QuotationDetail,
  SAP_SYNC_STATUS,
} from '@gq/shared/models/quotation-detail';
import { AgGridStateService } from '@gq/shared/services/ag-grid-state/ag-grid-state.service';
import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { LetDirective, PushPipe } from '@ngrx/component';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { MockDirective, MockPipe, MockProvider } from 'ng-mocks';
import { marbles } from 'rxjs-marbles/jest';

import {
  MATERIAL_STOCK_STATE_MOCK,
  PLANT_MATERIAL_DETAILS_STATE_MOCK,
  QUOTATION_DETAIL_MOCK,
  QUOTATION_MOCK,
} from '../../../testing/mocks';
import { MATERIAL_STOCK_MOCK } from '../../../testing/mocks/models/material-stock.mock';
import { ACTIVE_CASE_STATE_MOCK } from '../../../testing/mocks/state/active-case-state.mock';
import { DetailViewComponent } from './detail-view.component';

describe('DetailViewComponent', () => {
  let component: DetailViewComponent;
  let spectator: Spectator<DetailViewComponent>;
  let router: Router;
  let mockStore: MockStore;

  const createComponent = createComponentFactory({
    component: DetailViewComponent,
    imports: [
      MockDirective(LetDirective),
      MockPipe(PushPipe),
      RouterTestingModule,
    ],
    providers: [
      MockProvider(ActiveCaseFacade),
      provideMockStore({
        initialState: {
          activeCase: {
            ...ACTIVE_CASE_STATE_MOCK,
            selectedQuotationDetail: '5694232',
          },
          materialStock: MATERIAL_STOCK_STATE_MOCK,
          plantMaterialDetails: PLANT_MATERIAL_DETAILS_STATE_MOCK,
          materialCostDetails: {
            materialCostDetails: {
              gpcYear: 2023,
              sqvDate: '2024-01-01',
            },
            materialCostDetailsLoading: false,
            errorMessage: undefined,
          },
        },
      }),
      MockProvider(AgGridStateService),
      MockProvider(ApprovalFacade),
      { provide: MatDialog, useValue: {} },
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.debugElement.componentInstance;
    router = spectator.inject(Router);
    router.navigate = jest.fn();
    mockStore = spectator.inject(MockStore);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    test(
      'should initialize observables',
      marbles((m) => {
        component['breadCrumbsService'].getDetailViewBreadcrumbs = jest.fn(
          () => [{ label: 'test' }]
        );
        component['approvalFacade'].getApprovalCockpitData = jest.fn();

        m.expect(component.quotation$).toBeObservable(
          m.cold('a', { a: QUOTATION_MOCK })
        );
        m.expect(component.quotationDetail$).toBeObservable(
          m.cold('a', { a: QUOTATION_DETAIL_MOCK })
        );
        m.expect(component.materialCostUpdateAvl$).toBeObservable(
          m.cold('a', { a: true })
        );
        m.expect(component.materialStock$).toBeObservable(
          m.cold('a', { a: MATERIAL_STOCK_MOCK })
        );
        m.expect(component.materialStockLoading$).toBeObservable(
          m.cold('a', { a: false })
        );
        m.expect(component.breadcrumbs$).toBeObservable(
          m.cold('a', { a: [{ label: 'test' }] })
        );
        m.expect(component.plantMaterialDetails$).toBeObservable(
          m.cold('a', {
            a: PLANT_MATERIAL_DETAILS_STATE_MOCK.plantMaterialDetails,
          })
        );

        m.expect(component.sapStatusPosition$).toBeObservable(
          m.cold('a', {
            a: QUOTATION_DETAIL_MOCK.syncInSap
              ? SAP_SYNC_STATUS.SYNCED
              : SAP_SYNC_STATUS.NOT_SYNCED,
          })
        );
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

          mockStore.overrideSelector(
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
            error$: of(new Error('error')),
            stopApprovalCockpitDataPolling: jest.fn(),
          } as unknown as ApprovalFacade;

          Object.defineProperty(component, 'approvalFacade', {
            value: facadeMock,
          });

          mockStore.overrideSelector(
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

          mockStore.overrideSelector(
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

          mockStore.overrideSelector(
            activeCaseFeature.selectQuotationLoading,
            false
          );

          mockStore.overrideSelector(activeCaseFeature.selectQuotation, {
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

          mockStore.overrideSelector(
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

  describe('openPricingAssistant', () => {
    test('should open pricing assistant dialog', () => {
      const openMock = jest.fn();
      component['dialog'].open = openMock;
      const detail = { gqPositionId: '1245' } as QuotationDetail;

      component.openPricingAssistant(detail);

      expect(openMock).toHaveBeenCalled();
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

  describe('navigateToQuotationByIndex', () => {
    beforeEach(() => {
      component.quotations = [
        { ...QUOTATION_DETAIL_MOCK, gqPositionId: '123' },
        { ...QUOTATION_DETAIL_MOCK, gqPositionId: '456' },
        { ...QUOTATION_DETAIL_MOCK, gqPositionId: '789' },
      ];
    });

    it('should navigate if the quotation exists', () => {
      component.onNavigateToQuotationByIndex(1);

      expect(router.navigate).toHaveBeenCalledWith(['detail-view'], {
        queryParams: { gqPositionId: '456' },
        queryParamsHandling: 'merge',
      });
    });

    it('should NOT navigate if the quotation does not exist', () => {
      component.onNavigateToQuotationByIndex(4);

      expect(router.navigate).not.toHaveBeenCalled();
    });
  });

  describe('getSelectedQuotationIndex', () => {
    beforeEach(() => {
      component.quotations = [
        { ...QUOTATION_DETAIL_MOCK, gqPositionId: '123' },
        { ...QUOTATION_DETAIL_MOCK, gqPositionId: '456' },
        { ...QUOTATION_DETAIL_MOCK, gqPositionId: '789' },
      ];
    });

    it('should find the index of a quotation', () => {
      expect(component.getSelectedQuotationIndex('456')).toEqual(1);
    });

    it("should return -1 if quotation doesn't exist", () => {
      expect(component.getSelectedQuotationIndex('000')).toEqual(-1);
    });
  });
});
