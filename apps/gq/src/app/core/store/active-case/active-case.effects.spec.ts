import { HttpClientTestingModule } from '@angular/common/http/testing';
import { MATERIAL_SANITY_CHECKS } from '@angular/material/core';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';

import { of, throwError } from 'rxjs';

import { AppRoutePath } from '@gq/app-route-path.enum';
import {
  Quotation,
  QuotationAttachment,
  SAP_SYNC_STATUS,
} from '@gq/shared/models';
import { SapCallInProgress } from '@gq/shared/models/quotation';
import { AttachmentsService } from '@gq/shared/services/rest/attachments/attachments.service';
import { CustomerService } from '@gq/shared/services/rest/customer/customer.service';
import { QuotationService } from '@gq/shared/services/rest/quotation/quotation.service';
import { QuotationDetailsService } from '@gq/shared/services/rest/quotation-details/quotation-details.service';
import { createServiceFactory, SpectatorService } from '@ngneat/spectator/jest';
import { translate } from '@ngneat/transloco';
import { Actions } from '@ngrx/effects';
import { provideMockActions } from '@ngrx/effects/testing';
import { ROUTER_NAVIGATED } from '@ngrx/router-store';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { marbles } from 'rxjs-marbles/jest';

import {
  CUSTOMER_MOCK,
  QUOTATION_DETAIL_MOCK,
  QUOTATION_IDENTIFIER_MOCK,
  QUOTATION_MOCK,
  SIMULATED_QUOTATION_MOCK,
} from '../../../../testing/mocks';
import { ApprovalActions } from '../approval/approval.actions';
import { getAddQuotationDetailsRequest } from '../process-case';
import { ActiveCaseActions } from './active-case.action';
import { ActiveCaseEffects } from './active-case.effects';
import { activeCaseFeature } from './active-case.reducer';
import { getGqId } from './active-case.selectors';
import { QuotationIdentifier, UpdateQuotationDetail } from './models';

/* eslint-disable max-lines */
describe('ActiveCaseEffects', () => {
  let spectator: SpectatorService<ActiveCaseEffects>;
  let action: any;
  let actions$: any;
  let effects: ActiveCaseEffects;
  let customerService: CustomerService;
  let quotationDetailsService: QuotationDetailsService;
  let quotationService: QuotationService;
  let attachmentService: AttachmentsService;
  let snackBar: MatSnackBar;

  let store: any;
  let router: Router;

  const errorMessage = 'An error occured';

  const createService = createServiceFactory({
    service: ActiveCaseEffects,
    imports: [MatSnackBarModule, RouterTestingModule, HttpClientTestingModule],
    providers: [
      { provide: MATERIAL_SANITY_CHECKS, useValue: false },
      provideMockActions(() => actions$),
      provideMockStore(),
    ],
  });

  beforeEach(() => {
    spectator = createService();
    actions$ = spectator.inject(Actions);
    effects = spectator.inject(ActiveCaseEffects);
    customerService = spectator.inject(CustomerService);
    quotationDetailsService = spectator.inject(QuotationDetailsService);
    quotationService = spectator.inject(QuotationService);
    attachmentService = spectator.inject(AttachmentsService);
    store = spectator.inject(MockStore);
    router = spectator.inject(Router);
    snackBar = spectator.inject(MatSnackBar);
  });

  describe('customerDetails$', () => {
    beforeEach(() => {
      action = ActiveCaseActions.getCustomerDetails();

      store.overrideSelector(
        activeCaseFeature.selectQuotationIdentifier,
        QUOTATION_IDENTIFIER_MOCK
      );
    });

    test(
      'should return customerDetailsSuccess action when REST call is successful',
      marbles((m) => {
        const item = CUSTOMER_MOCK;
        const response = m.cold('-a|', {
          a: item,
        });

        actions$ = m.hot('-a', { a: action });

        customerService.getCustomer = jest.fn(() => response);
        const result = ActiveCaseActions.getCustomerDetailsSuccess({ item });

        const expected = m.cold('--b', { b: result });

        m.expect(effects.customerDetails$).toBeObservable(expected);
        m.flush();
        expect(customerService.getCustomer).toHaveBeenCalledTimes(1);
        expect(customerService.getCustomer).toHaveBeenCalledWith(
          QUOTATION_IDENTIFIER_MOCK
        );
      })
    );

    test(
      'should return customerDetailsFailure on REST error',
      marbles((m) => {
        actions$ = m.hot('-a', { a: action });

        const result = ActiveCaseActions.getCustomerDetailsFailure({
          errorMessage,
        });

        const response = m.cold('-#|', undefined, errorMessage);
        const expected = m.cold('--b', { b: result });

        customerService.getCustomer = jest.fn(() => response);

        m.expect(effects.customerDetails$).toBeObservable(expected);
        m.flush();
        expect(customerService.getCustomer).toHaveBeenCalledTimes(1);
      })
    );
  });

  describe('quotation$', () => {
    let gqId: number;

    beforeEach(() => {
      gqId = 123_456;
      action = ActiveCaseActions.getQuotation();

      const quotationIdentifier: QuotationIdentifier = {
        gqId,
        customerNumber: '12425',
        salesOrg: '0236',
      };

      store.overrideSelector(
        activeCaseFeature.selectQuotationIdentifier,
        quotationIdentifier
      );
    });

    test(
      'should return getQuotationSuccess action when REST call is successful and calculation completed',
      marbles((m) => {
        quotationService.getQuotation = jest.fn(() => response);
        const item = QUOTATION_MOCK;

        actions$ = m.hot('-a', { a: action });

        const response = m.cold('-a|', {
          a: item,
        });
        const expected = m.cold('--(bc)', {
          b: ActiveCaseActions.getQuotationSuccess({ item }),
          c: ActiveCaseActions.getQuotationSuccessFullyCompleted(),
        });

        m.expect(effects.quotation$).toBeObservable(expected);
        m.flush();
        expect(quotationService.getQuotation).toHaveBeenCalledTimes(1);
        expect(quotationService.getQuotation).toHaveBeenCalledWith(gqId);
      })
    );
    test(
      'should return getQuotationSuccess action when REST call is successful and calculation not completed',
      marbles((m) => {
        quotationService.getQuotation = jest.fn(() => response);
        const item = { ...QUOTATION_MOCK, calculationInProgress: true };

        actions$ = m.hot('-a', { a: action });

        const response = m.cold('-a|', {
          a: item,
        });
        const expected = m.cold('--b', {
          b: ActiveCaseActions.getQuotationSuccess({ item }),
        });

        m.expect(effects.quotation$).toBeObservable(expected);
        m.flush();
        expect(quotationService.getQuotation).toHaveBeenCalledTimes(1);
        expect(quotationService.getQuotation).toHaveBeenCalledWith(gqId);
      })
    );
    test(
      'should return getQuotationSuccess action with sorted quotation details when REST call is successful and refresh not completed',
      marbles((m) => {
        quotationService.getQuotation = jest.fn(() => response);

        const serviceResponse = {
          ...QUOTATION_MOCK,
          calculationInProgress: false,
          sapCallInProgress: SapCallInProgress.FETCH_DATA_IN_PROGRESS,
          quotationDetails: [
            { ...QUOTATION_DETAIL_MOCK, quotationItemId: 20 },
            { ...QUOTATION_DETAIL_MOCK, quotationItemId: 10 },
          ],
        } as Quotation;
        const expectedItem = {
          ...QUOTATION_MOCK,
          calculationInProgress: false,
          sapCallInProgress: SapCallInProgress.FETCH_DATA_IN_PROGRESS,
          quotationDetails: [
            { ...QUOTATION_DETAIL_MOCK, quotationItemId: 10 },
            { ...QUOTATION_DETAIL_MOCK, quotationItemId: 20 },
          ],
        } as Quotation;

        actions$ = m.hot('-a', { a: action });

        const response = m.cold('-a|', {
          a: serviceResponse,
        });
        const expected = m.cold('--b', {
          b: ActiveCaseActions.getQuotationSuccess({ item: expectedItem }),
        });

        m.expect(effects.quotation$).toBeObservable(expected);
        m.flush();
        expect(quotationService.getQuotation).toHaveBeenCalledTimes(1);
        expect(quotationService.getQuotation).toHaveBeenCalledWith(gqId);
      })
    );

    test(
      'should return getQuotationFailure on REST error',
      marbles((m) => {
        actions$ = m.hot('-a', { a: action });

        const result = ActiveCaseActions.getQuotationFailure({ errorMessage });

        const response = m.cold('-#|', undefined, errorMessage);
        const expected = m.cold('--b', { b: result });

        quotationService.getQuotation = jest.fn(() => response);

        m.expect(effects.quotation$).toBeObservable(expected);
        m.flush();
        expect(quotationService.getQuotation).toHaveBeenCalledTimes(1);
      })
    );
  });

  describe('triggerDataLoad$', () => {
    test(
      'should return getCustomerDetails Action',
      marbles((m) => {
        action = ActiveCaseActions.selectQuotation({
          quotationIdentifier: QUOTATION_IDENTIFIER_MOCK,
        });

        actions$ = m.hot('-a', { a: action });

        const expected = m.cold('-(bc)', {
          b: ActiveCaseActions.getQuotationInInterval(),
          c: ActiveCaseActions.getCustomerDetails(),
        });

        m.expect(effects.triggerDataLoad$).toBeObservable(expected);
        m.flush();
      })
    );
  });

  describe('loadFromUrl$', () => {
    test(
      'should return loadSelectedQuotationFromUrl',
      marbles((m) => {
        const queryParams = {
          gqId: 12_334,
          customerNumber: '3456',
          salesOrg: '0267',
          gqPositionId: '5678',
        };

        action = {
          type: ROUTER_NAVIGATED,
          payload: {
            routerState: {
              queryParams,
              url: `/${AppRoutePath.ProcessCaseViewPath}`,
            },
          },
        };

        actions$ = m.hot('-a', { a: action });

        const result = ActiveCaseActions.loadSelectedQuotationFromUrl({
          queryParams,
        });
        const expected = m.cold('-b', { b: result });

        m.expect(effects.loadFromUrl$).toBeObservable(expected);
        m.flush();
      })
    );

    test(
      'should return loadSelectedQuotationFromUrl and loadSelectedQuotationDetailFromUrl',
      marbles((m) => {
        const queryParams = {
          gqId: 12_334,
          customerNumber: '3456',
          salesOrg: '0267',
          gqPositionId: '5678',
        };

        action = {
          type: ROUTER_NAVIGATED,
          payload: {
            routerState: {
              queryParams,
              url: `/${AppRoutePath.DetailViewPath}`,
            },
          },
        };

        actions$ = m.hot('-a', { a: action });

        const resultB = ActiveCaseActions.loadSelectedQuotationFromUrl({
          queryParams,
        });

        const resultC = ActiveCaseActions.loadSelectedQuotationDetailFromUrl({
          gqPositionId: queryParams.gqPositionId,
        });
        const expected = m.cold('-(cb)', { b: resultB, c: resultC });

        m.expect(effects.loadFromUrl$).toBeObservable(expected);
        m.flush();
      })
    );
  });

  describe('loadSelectedQuotationDetailFromUrl$', () => {
    test(
      'should return setSelectedQuotationDetail',
      marbles((m) => {
        action = ActiveCaseActions.loadSelectedQuotationDetailFromUrl({
          gqPositionId: '1234',
        });
        actions$ = m.hot('-a', { a: action });

        const result = ActiveCaseActions.setSelectedQuotationDetail({
          gqPositionId: '1234',
        });
        const expected = m.cold('-b', { b: result });

        m.expect(effects.loadSelectedQuotationDetailFromUrl$).toBeObservable(
          expected
        );
        m.flush();
      })
    );

    test(
      'should navigate to not-found if URL is not valid',
      marbles((m) => {
        router.navigate = jest.fn();
        action = ActiveCaseActions.loadSelectedQuotationDetailFromUrl({
          gqPositionId: undefined,
        });

        actions$ = m.hot('-a', { a: action });
        const expected = m.cold('---');

        m.expect(effects.loadSelectedQuotationDetailFromUrl$).toBeObservable(
          expected
        );
        m.flush();
        expect(router.navigate).toHaveBeenCalledWith(['not-found']);
      })
    );
  });

  describe('loadQuotationFromUrl$', () => {
    test(
      'should return selectQuotation',
      marbles((m) => {
        const queryParams = {
          quotation_number: 123,
          customer_number: '124',
          sales_org: '456',
        };
        const identifier = {
          gqId: 123,
          customerNumber: '1246',
          salesOrg: '4567',
        };
        store.overrideSelector(
          activeCaseFeature.selectQuotationIdentifier,
          identifier
        );
        action = ActiveCaseActions.loadSelectedQuotationFromUrl({
          queryParams,
        });
        actions$ = m.hot('-a', { a: action });
        const result = ActiveCaseActions.selectQuotation({
          quotationIdentifier: {
            gqId: 123,
            customerNumber: '124',
            salesOrg: '456',
          },
        });
        const expected = m.cold('-b', { b: result });
        m.expect(effects.loadSelectedQuotationFromUrl$).toBeObservable(
          expected
        );
        m.flush();
      })
    );

    test(
      'should navigate to not-found if URL is not valid',
      marbles((m) => {
        router.navigate = jest.fn();
        const identifier = {
          gqId: 123,
          customerNumber: '1246',
          salesOrg: '4567',
        };
        store.overrideSelector(
          activeCaseFeature.selectQuotationIdentifier,
          identifier
        );
        action = ActiveCaseActions.loadSelectedQuotationFromUrl({
          queryParams: {},
        });

        actions$ = m.hot('-a', { a: action });
        const expected = m.cold('---');

        m.expect(effects.loadSelectedQuotationFromUrl$).toBeObservable(
          expected
        );
        m.flush();
        expect(router.navigate).toHaveBeenCalledWith(['not-found']);
      })
    );
  });

  describe('addMaterials$', () => {
    const addQuotationDetailsRequest = {
      gqId: '123',
      items: [
        {
          materialId: '333',
          quantity: 10,
        },
      ],
    };

    beforeEach(() => {
      store.overrideSelector(
        getAddQuotationDetailsRequest,
        addQuotationDetailsRequest
      );
    });

    test(
      'should return addMaterialsSuccess when REST call is successful',
      marbles((m) => {
        snackBar.open = jest.fn();
        action = ActiveCaseActions.addMaterialsToQuotation();

        quotationDetailsService.addQuotationDetails = jest.fn(() => response);
        const updatedQuotation = QUOTATION_MOCK;
        const result = ActiveCaseActions.addMaterialsToQuotationSuccess({
          updatedQuotation,
        });

        actions$ = m.hot('-a', { a: action });
        const response = m.cold('-a|', {
          a: updatedQuotation,
        });
        const expected = m.cold('--b', { b: result });

        m.expect(effects.addMaterials$).toBeObservable(expected);
        m.flush();
        expect(
          quotationDetailsService.addQuotationDetails
        ).toHaveBeenCalledTimes(1);
        expect(
          quotationDetailsService.addQuotationDetails
        ).toHaveBeenCalledWith(addQuotationDetailsRequest);
        expect(snackBar.open).toHaveBeenCalledTimes(1);
      })
    );

    test(
      'should return addMaterialsFailure on REST error',
      marbles((m) => {
        quotationDetailsService.addQuotationDetails = jest.fn(() => response);
        const result = ActiveCaseActions.addMaterialsToQuotationFailure({
          errorMessage,
        });

        actions$ = m.hot('-a', { a: action });
        const response = m.cold('-#|', undefined, errorMessage);
        const expected = m.cold('--b', { b: result });

        m.expect(effects.addMaterials$).toBeObservable(expected);
        m.flush();
        expect(
          quotationDetailsService.addQuotationDetails
        ).toHaveBeenCalledTimes(1);
      })
    );
  });

  describe('removePositionsFromQuotation$', () => {
    const gqPositionIds = ['1234567'];

    beforeEach(() => {
      store.overrideSelector(
        activeCaseFeature.selectRemoveQuotationDetailsIds,
        gqPositionIds
      );
    });

    test(
      'should return removePositionsSuccess when REST call is successful',
      marbles((m) => {
        snackBar.open = jest.fn();
        const singlePositionId = ['1'];
        action = ActiveCaseActions.removePositionsFromQuotation({
          gqPositionIds: singlePositionId,
        });

        quotationDetailsService.deleteQuotationDetail = jest.fn(() => response);
        const updatedQuotation = QUOTATION_MOCK;
        const result = ActiveCaseActions.removePositionsFromQuotationSuccess({
          updatedQuotation,
        });

        actions$ = m.hot('-a', { a: action });
        const response = m.cold('-a|', {
          a: updatedQuotation,
        });
        const expected = m.cold('--b', { b: result });

        m.expect(effects.removePositionsFromQuotation$).toBeObservable(
          expected
        );
        m.flush();
        expect(
          quotationDetailsService.deleteQuotationDetail
        ).toHaveBeenCalledTimes(1);
        expect(
          quotationDetailsService.deleteQuotationDetail
        ).toHaveBeenCalledWith(gqPositionIds);
        expect(snackBar.open).toHaveBeenCalledTimes(1);
      })
    );

    test(
      'should return removePositionsFailure on REST error',
      marbles((m) => {
        snackBar.open = jest
          .fn()
          .mockReturnValue({ onAction: jest.fn().mockReturnValue(of([])) });
        action = ActiveCaseActions.removePositionsFromQuotation({
          gqPositionIds,
        });
        window.open = jest.fn().mockReturnValue({ focus: jest.fn() });

        quotationDetailsService.deleteQuotationDetail = jest.fn(() => response);
        const updatedQuotation = QUOTATION_MOCK;
        const result = ActiveCaseActions.removePositionsFromQuotationFailure({
          errorMessage,
          updatedQuotation,
        });

        actions$ = m.hot('-a', { a: action });
        const response = m.cold('-#|', undefined, {
          message: errorMessage,
          error: updatedQuotation,
        });
        const expected = m.cold('--b', { b: result });

        m.expect(effects.removePositionsFromQuotation$).toBeObservable(
          expected
        );
        m.flush();
        expect(
          quotationDetailsService.deleteQuotationDetail
        ).toHaveBeenCalledTimes(1);
      })
    );
  });

  describe('updateMaterials$', () => {
    const updateQuotationDetailList: UpdateQuotationDetail[] = [
      {
        gqPositionId: QUOTATION_DETAIL_MOCK.gqPositionId,
        price: 20,
      },
    ];
    const updatedQuotation = QUOTATION_MOCK;

    test(
      'should return removePositionsSuccess when REST call is successful',
      marbles((m) => {
        action = ActiveCaseActions.updateQuotationDetails({
          updateQuotationDetailList,
        });
        effects['showUpdateQuotationDetailToast'] = jest.fn();
        quotationDetailsService.updateQuotationDetail = jest.fn(() => response);
        const result = ActiveCaseActions.updateQuotationDetailsSuccess({
          updatedQuotation,
        });

        actions$ = m.hot('-a', { a: action });
        const response = m.cold('-a|', { a: updatedQuotation });
        const expected = m.cold('--b', { b: result });

        m.expect(effects.updateMaterials$).toBeObservable(expected);
        m.flush();
        expect(
          quotationDetailsService.updateQuotationDetail
        ).toHaveBeenCalledTimes(1);
        expect(
          quotationDetailsService.updateQuotationDetail
        ).toHaveBeenCalledWith(updateQuotationDetailList);
        expect(effects['showUpdateQuotationDetailToast']).toHaveBeenCalledTimes(
          1
        );
      })
    );

    test(
      'should return updateQuotationDetailsFailure on REST error',
      marbles((m) => {
        quotationDetailsService.updateQuotationDetail = jest.fn(() => response);

        const result = ActiveCaseActions.updateQuotationDetailsFailure({
          errorMessage,
        });

        action = ActiveCaseActions.updateQuotationDetails({
          updateQuotationDetailList,
        });

        actions$ = m.hot('-a', { a: action });
        const response = m.cold('-#|', undefined, errorMessage);
        const expected = m.cold('--b', { b: result });

        m.expect(effects.updateMaterials$).toBeObservable(expected);
        m.flush();
        expect(
          quotationDetailsService.updateQuotationDetail
        ).toHaveBeenCalledTimes(1);
        expect(
          quotationDetailsService.updateQuotationDetail
        ).toHaveBeenCalledWith(updateQuotationDetailList);
      })
    );
  });

  describe('uploadSelectionToSap$', () => {
    const gqId = 123;
    beforeEach(() => {
      store.overrideSelector(getGqId, gqId);
    });

    test(
      'should return uploadSelectionToSapSuccess when REST call is successful',
      marbles((m) => {
        snackBar.open = jest.fn();

        action = ActiveCaseActions.uploadSelectionToSap({
          gqPositionIds: ['1'],
        });

        quotationService.uploadSelectionToSap = jest.fn(() => response);
        effects['showUploadSelectionToast'] = jest.fn();

        actions$ = m.hot('-a', { a: action });
        const response = m.cold('-a|', { a: QUOTATION_MOCK });

        const expected = m.cold('--(bc)', {
          b: ActiveCaseActions.uploadSelectionToSapSuccess({
            updatedQuotation: QUOTATION_MOCK,
          }),
          c: ApprovalActions.getApprovalCockpitData({
            sapId: QUOTATION_MOCK.sapId,
            forceLoad: true,
          }),
        });

        m.expect(effects.uploadSelectionToSap$).toBeObservable(expected);
        m.flush();
        expect(quotationService.uploadSelectionToSap).toHaveBeenCalledTimes(1);
        expect(quotationService.uploadSelectionToSap).toHaveBeenCalledWith([
          '1',
        ]);
        expect(effects['showUploadSelectionToast']).toHaveBeenCalledTimes(1);
        expect(effects['showUploadSelectionToast']).toHaveBeenCalledWith(
          QUOTATION_MOCK,
          ['1']
        );
      })
    );

    test(
      'should return uploadSelectionToSapSuccess on REST error',
      marbles((m) => {
        quotationService.uploadSelectionToSap = jest.fn(() => response);
        const result = ActiveCaseActions.uploadSelectionToSapFailure({
          errorMessage,
        });

        actions$ = m.hot('-a', { a: action });
        const response = m.cold('-#|', undefined, errorMessage);
        const expected = m.cold('--b', { b: result });

        m.expect(effects.uploadSelectionToSap$).toBeObservable(expected);
        m.flush();
        expect(quotationService.uploadSelectionToSap).toHaveBeenCalledTimes(1);
      })
    );
  });

  describe('refreshSapPricing$', () => {
    const gqId = 123;
    beforeEach(() => {
      store.overrideSelector(getGqId, gqId);
    });
    test(
      'should return refreshSapPricingSuccess when REST call is successful',
      marbles((m) => {
        const quotation = QUOTATION_MOCK;
        snackBar.open = jest.fn();

        action = ActiveCaseActions.refreshSapPricing();
        const result = ActiveCaseActions.refreshSapPricingSuccess({
          quotation,
        });
        quotationService.refreshSapPricing = jest.fn(() => response);

        actions$ = m.hot('-a', { a: action });
        const response = m.cold('-a|', {
          a: quotation,
        });
        const expected = m.cold('--b', { b: result });

        m.expect(effects.refreshSapPricing$).toBeObservable(expected);
        m.flush();
        expect(quotationService.refreshSapPricing).toHaveBeenCalledTimes(1);
        expect(quotationService.refreshSapPricing).toHaveBeenCalledWith(gqId);
        expect(snackBar.open).toHaveBeenCalledTimes(1);
      })
    );
    test(
      'should return refreshSapPricingSuccess and loadQuotationInInterval when REST call is successful and sap refresh in progress',
      marbles((m) => {
        const quotation: Quotation = {
          ...QUOTATION_MOCK,
          sapCallInProgress: SapCallInProgress.FETCH_DATA_IN_PROGRESS,
        };
        snackBar.open = jest.fn();

        action = ActiveCaseActions.refreshSapPricing();
        quotationService.refreshSapPricing = jest.fn(() => response);

        actions$ = m.hot('-a', { a: action });
        const response = m.cold('-a|', {
          a: quotation,
        });
        const expected = m.cold('--(bc)', {
          b: ActiveCaseActions.refreshSapPricingSuccess({ quotation }),
          c: ActiveCaseActions.getQuotationInInterval(),
        });

        m.expect(effects.refreshSapPricing$).toBeObservable(expected);
        m.flush();
        expect(quotationService.refreshSapPricing).toHaveBeenCalledTimes(1);
        expect(quotationService.refreshSapPricing).toHaveBeenCalledWith(gqId);
        expect(snackBar.open).toHaveBeenCalledTimes(1);
      })
    );
    test(
      'should return refreshSapPricingFailure on REST error',
      marbles((m) => {
        quotationService.refreshSapPricing = jest.fn(() => response);
        const result = ActiveCaseActions.refreshSapPricingFailure({
          errorMessage,
        });

        actions$ = m.hot('-a', { a: action });
        const response = m.cold('-#|', undefined, errorMessage);
        const expected = m.cold('--b', { b: result });

        m.expect(effects.refreshSapPricing$).toBeObservable(expected);
        m.flush();
        expect(quotationService.refreshSapPricing).toHaveBeenCalledTimes(1);
      })
    );
  });

  describe('showUpdateQuotationDetailToast', () => {
    test('should display updateSelectedPrice', () => {
      effects['snackBar'].open = jest.fn();

      effects['showUpdateQuotationDetailToast']({ price: 20 } as any);
      expect(effects['snackBar'].open).toHaveBeenCalledWith(
        translate(`shared.snackBarMessages.updateSelectedPrice`)
      );
    });
    test('should display updateQuantity', () => {
      effects['snackBar'].open = jest.fn();

      effects['showUpdateQuotationDetailToast']({ orderQuantity: 20 } as any);
      expect(effects['snackBar'].open).toHaveBeenCalledWith(
        translate(`shared.snackBarMessages.updateQuantity`)
      );
    });
    test('should display updateTargetPrice', () => {
      effects['snackBar'].open = jest.fn();

      effects['showUpdateQuotationDetailToast']({ targetPrice: 200 } as any);
      expect(effects['snackBar'].open).toHaveBeenCalledWith(
        translate(`shared.snackBarMessages.updateTargetPrice`)
      );
    });
  });

  describe('updateQuotation$', () => {
    beforeEach(() => {
      const caseName = 'caseName';
      const currency = 'EUR';
      action = ActiveCaseActions.updateQuotation({
        caseName,
        currency,
        customerPurchaseOrderDate: '',
        validTo: '',
        quotationToDate: '',
        requestedDelDate: '',
      });
    });
    test(
      'should return updateQuotationSuccess',
      marbles((m) => {
        quotationService.updateQuotation = jest.fn(() => response);
        const quotation = QUOTATION_MOCK;

        actions$ = m.hot('-a', { a: action });

        const response = m.cold('-a|', { a: quotation });
        const expected = m.cold('--b', {
          b: ActiveCaseActions.updateQuotationSuccess({ quotation }),
        });

        m.expect(effects.updateQuotation$).toBeObservable(expected);
        m.flush();
        expect(quotationService.updateQuotation).toHaveBeenCalledTimes(1);
      })
    );
    test(
      'should return updateQuotationFailure',
      marbles((m) => {
        actions$ = m.hot('-a', { a: action });

        const result = ActiveCaseActions.updateQuotationFailure({
          errorMessage,
        });

        const response = m.cold('-#|', undefined, errorMessage);
        const expected = m.cold('--b', { b: result });

        quotationService.updateQuotation = jest.fn(() => response);

        m.expect(effects.updateQuotation$).toBeObservable(expected);
        m.flush();
        expect(quotationService.updateQuotation).toHaveBeenCalledTimes(1);
      })
    );
  });

  describe('resetSimulatedQuotation', () => {
    test(
      'should reset simulatedQuotation on route change',
      marbles((m) => {
        const queryParams = {
          gqId: 12_334,
          customerNumber: '3456',
          salesOrg: '0267',
          gqPositionId: '5678',
        };

        action = {
          type: ROUTER_NAVIGATED,
          payload: {
            routerState: {
              queryParams,
              url: `/${AppRoutePath.ProcessCaseViewPath}`,
            },
          },
        };

        actions$ = m.hot('-a', { a: action });

        const result = ActiveCaseActions.resetSimulatedQuotation();
        const expected = m.cold('-b', { b: result });

        m.expect(effects.resetSimulatedQuotation$).toBeObservable(expected);
        m.flush();
      })
    );
  });

  describe('confirmSimulatedQuotation$', () => {
    beforeEach(() => {
      store.overrideSelector(
        activeCaseFeature.selectSimulatedItem,
        SIMULATED_QUOTATION_MOCK
      );
    });

    test(
      'should updateQuotationDetails and resetSimulatedQuotation',
      marbles((m) => {
        action = ActiveCaseActions.confirmSimulatedQuotation();
        actions$ = m.hot('-a', { a: action });

        const updateQuotationDetailList: UpdateQuotationDetail[] = [
          {
            gqPositionId: QUOTATION_DETAIL_MOCK.gqPositionId,
            price: QUOTATION_DETAIL_MOCK.price,
            priceSource: QUOTATION_DETAIL_MOCK.priceSource,
          },
        ];

        const resultB = ActiveCaseActions.updateQuotationDetails({
          updateQuotationDetailList,
        });
        const resultC = ActiveCaseActions.resetSimulatedQuotation();
        const expected = m.cold('-(bc)', { b: resultB, c: resultC });

        m.expect(effects.confirmSimulatedQuotation$).toBeObservable(expected);
      })
    );
  });

  describe('createSapQuote', () => {
    const gqId = 123;
    beforeEach(() => {
      store.overrideSelector(getGqId, gqId);
    });
    test(
      'shall call service, returns no sapCallInProgress',
      marbles((m) => {
        const item: Quotation = {
          ...QUOTATION_MOCK,
          sapCallInProgress: SapCallInProgress.NONE_IN_PROGRESS,
          sapId: '1',
        };
        snackBar.open = jest.fn();
        quotationService.createSapQuotation = jest.fn(() => response);
        effects['showCreateSapQuoteToast'] = jest.fn();
        actions$ = m.hot('-a', {
          a: ActiveCaseActions.createSapQuote({ gqPositionIds: ['12-12-12-'] }),
        });
        const response = m.cold('-a|', {
          a: item,
        });
        const expected = m.cold('--b', {
          b: ActiveCaseActions.createSapQuoteSuccess({ quotation: item }),
        });

        m.expect(effects.createSapQuote$).toBeObservable(expected);
        m.flush();
        expect(effects['showCreateSapQuoteToast']).toHaveBeenCalledTimes(1);
        expect(quotationService.createSapQuotation).toHaveBeenCalledTimes(1);
      })
    );
    test(
      'shall call service, should not display snackbar due to missing sapId (asynchronous procedure)',
      marbles((m) => {
        const item: Quotation = {
          ...QUOTATION_MOCK,
          sapCallInProgress: SapCallInProgress.NONE_IN_PROGRESS,
          sapId: undefined,
        };
        snackBar.open = jest.fn();
        quotationService.createSapQuotation = jest.fn(() => response);
        effects['showCreateSapQuoteToast'] = jest.fn();
        actions$ = m.hot('-a', {
          a: ActiveCaseActions.createSapQuote({ gqPositionIds: ['12-12-12-'] }),
        });
        const response = m.cold('-a|', {
          a: item,
        });
        const expected = m.cold('--b', {
          b: ActiveCaseActions.createSapQuoteSuccess({ quotation: item }),
        });

        m.expect(effects.createSapQuote$).toBeObservable(expected);
        m.flush();
        expect(effects['showCreateSapQuoteToast']).toHaveBeenCalledTimes(1);
        expect(quotationService.createSapQuotation).toHaveBeenCalledTimes(1);
      })
    );

    test(
      'shall call service, returns a sapCallInProgress',
      marbles((m) => {
        const item: Quotation = {
          ...QUOTATION_MOCK,
          sapCallInProgress: SapCallInProgress.FETCH_DATA_IN_PROGRESS,
          sapId: '1',
        };
        snackBar.open = jest.fn();
        quotationService.createSapQuotation = jest.fn(() => response);
        effects['showCreateSapQuoteToast'] = jest.fn();
        actions$ = m.hot('-a', {
          a: ActiveCaseActions.createSapQuote({ gqPositionIds: ['12-12-12-'] }),
        });
        const response = m.cold('-a|', {
          a: item,
        });
        const expected = m.cold('--(bc)', {
          b: ActiveCaseActions.createSapQuoteSuccess({ quotation: item }),
          c: ActiveCaseActions.getQuotationInInterval(),
        });

        m.expect(effects.createSapQuote$).toBeObservable(expected);
        m.flush();
        expect(effects['showCreateSapQuoteToast']).toHaveBeenCalledTimes(1);
        expect(quotationService.createSapQuotation).toHaveBeenCalledTimes(1);
      })
    );
    test(
      'shall call service, returns a calculationInProgress',
      marbles((m) => {
        const item: Quotation = {
          ...QUOTATION_MOCK,
          calculationInProgress: true,
          sapId: '1',
        };
        snackBar.open = jest.fn();
        quotationService.createSapQuotation = jest.fn(() => response);
        effects['showCreateSapQuoteToast'] = jest.fn();
        actions$ = m.hot('-a', {
          a: ActiveCaseActions.createSapQuote({ gqPositionIds: ['12-12-12-'] }),
        });
        const response = m.cold('-a|', {
          a: item,
        });
        quotationService.createSapQuotation = jest.fn(() => response);
        const expected = m.cold('--(bc)', {
          b: ActiveCaseActions.createSapQuoteSuccess({ quotation: item }),
          c: ActiveCaseActions.getQuotationInInterval(),
        });

        m.expect(effects.createSapQuote$).toBeObservable(expected);
        m.flush();
        expect(effects['showCreateSapQuoteToast']).toHaveBeenCalledTimes(1);
        expect(quotationService.createSapQuotation).toHaveBeenCalledTimes(1);
      })
    );
    test(
      'shall call service, returns error',
      marbles((m) => {
        snackBar.open = jest.fn();

        actions$ = m.hot('-a', {
          a: ActiveCaseActions.createSapQuote({ gqPositionIds: ['12-12-12-'] }),
        });
        const result = ActiveCaseActions.createSapQuoteFailure({
          errorMessage,
        });
        const response = m.cold('-#|', undefined, errorMessage);
        const expected = m.cold('--b', {
          b: result,
        });
        quotationService.createSapQuotation = jest.fn(() => response);
        effects['showCreateSapQuoteToast'] = jest.fn();

        m.expect(effects.createSapQuote$).toBeObservable(expected);
        m.flush();
        expect(effects['showCreateSapQuoteToast']).toHaveBeenCalledTimes(0);
        expect(quotationService.createSapQuotation).toHaveBeenCalledTimes(1);
      })
    );
  });

  describe('showCreateSapQuoteToast', () => {
    test('should show nothing in async mode', () => {
      effects['snackBar'].open = jest.fn();

      const quotation = {
        sapSyncStatus: SAP_SYNC_STATUS.SYNCED,
        sapCallInProgress: SapCallInProgress.FETCH_DATA_IN_PROGRESS,
      } as Quotation;
      effects['showCreateSapQuoteToast'](quotation);

      expect(effects['snackBar'].open).toHaveBeenCalledTimes(0);
    });
    test('should open snackbar with sync full', () => {
      effects['snackBar'].open = jest.fn();

      const quotation = {
        sapSyncStatus: SAP_SYNC_STATUS.SYNCED,
        sapCallInProgress: SapCallInProgress.NONE_IN_PROGRESS,
        sapId: '123',
      } as Quotation;
      effects['showCreateSapQuoteToast'](quotation);

      expect(effects['snackBar'].open).toHaveBeenCalledTimes(1);
      expect(translate).toHaveBeenCalledWith(
        'shared.snackBarMessages.createSapQuoteSync.full',
        { sapId: quotation.sapId }
      );
    });
    test('should open snackbar with sync partially', () => {
      effects['snackBar'].open = jest.fn();

      const quotation = {
        sapSyncStatus: SAP_SYNC_STATUS.PARTIALLY_SYNCED,
        sapCallInProgress: SapCallInProgress.NONE_IN_PROGRESS,
        sapId: '123',
      } as Quotation;
      effects['showCreateSapQuoteToast'](quotation);

      expect(effects['snackBar'].open).toHaveBeenCalledTimes(1);
      expect(translate).toHaveBeenCalledWith(
        'shared.snackBarMessages.createSapQuoteSync.partially',
        { sapId: quotation.sapId }
      );
    });

    test('should open snackbar with sync failed', () => {
      effects['snackBar'].open = jest.fn();

      const quotation = {
        sapSyncStatus: SAP_SYNC_STATUS.SYNC_FAILED,
        sapCallInProgress: SapCallInProgress.NONE_IN_PROGRESS,
        sapId: '123',
      } as Quotation;
      effects['showCreateSapQuoteToast'](quotation);

      expect(effects['snackBar'].open).toHaveBeenCalledTimes(1);
      expect(translate).toHaveBeenCalledWith(
        'shared.snackBarMessages.createSapQuoteSync.failed',
        { sapId: quotation.sapId }
      );
    });
  });

  describe('showUploadSelectionToast', () => {
    test('should show nothing in async mode', () => {
      effects['snackBar'].open = jest.fn();

      const syncedIds = ['1', '2'];
      const allDetails = [
        { gqPositionId: '1', syncInSap: true },
        { gqPositionId: '2', syncInSap: true },
        { gqPositionId: '3' },
      ];

      const quotation = {
        quotationDetails: allDetails,
        sapCallInProgress: SapCallInProgress.FETCH_DATA_IN_PROGRESS,
      } as Quotation;

      effects['showUploadSelectionToast'](quotation, syncedIds);

      expect(effects['snackBar'].open).toHaveBeenCalledTimes(0);
    });
    test('should open snackbar with sync full', () => {
      effects['snackBar'].open = jest.fn();

      const syncedIds = ['1', '2'];
      const allDetails = [
        { gqPositionId: '1', syncInSap: true },
        { gqPositionId: '2', syncInSap: true },
        { gqPositionId: '3' },
      ];

      const quotation = {
        quotationDetails: allDetails,
        sapCallInProgress: SapCallInProgress.NONE_IN_PROGRESS,
      } as Quotation;

      effects['showUploadSelectionToast'](quotation, syncedIds);

      expect(effects['snackBar'].open).toHaveBeenCalledTimes(1);
      expect(translate).toHaveBeenLastCalledWith(
        'shared.snackBarMessages.uploadToSapSync.full'
      );
    });
    test('should open snackbar with sync partially', () => {
      effects['snackBar'].open = jest.fn();

      const syncedIds = ['1', '2'];
      const allDetails = [
        { gqPositionId: '1', syncInSap: false },
        { gqPositionId: '2', syncInSap: true },
        { gqPositionId: '3' },
      ];

      const quotation = {
        quotationDetails: allDetails,
        sapCallInProgress: SapCallInProgress.NONE_IN_PROGRESS,
      } as Quotation;

      effects['showUploadSelectionToast'](quotation, syncedIds);

      expect(effects['snackBar'].open).toHaveBeenCalledTimes(1);
      expect(translate).toHaveBeenLastCalledWith(
        'shared.snackBarMessages.uploadToSapSync.partially'
      );
    });
    test('should open snackbar with sync failed', () => {
      effects['snackBar'].open = jest.fn();

      const syncedIds = ['1', '2'];
      const allDetails = [
        { gqPositionId: '1', syncInSap: false },
        { gqPositionId: '2', syncInSap: false },
        { gqPositionId: '3' },
      ];

      const quotation = {
        quotationDetails: allDetails,
        sapCallInProgress: SapCallInProgress.NONE_IN_PROGRESS,
      } as Quotation;

      effects['showUploadSelectionToast'](quotation, syncedIds);

      expect(effects['snackBar'].open).toHaveBeenCalledTimes(1);
      expect(translate).toHaveBeenLastCalledWith(
        'shared.snackBarMessages.uploadToSapSync.failed'
      );
    });
  });

  describe('updateCosts$', () => {
    test(
      'should return updateCostsSuccess when REST call is successful',
      marbles((m) => {
        action = ActiveCaseActions.updateCosts({ gqPosId: '123' });
        quotationDetailsService.updateCostData = jest.fn(() => response);
        snackBar.open = jest.fn();

        const quotation = QUOTATION_MOCK;
        const result = ActiveCaseActions.updateCostsSuccess({
          updatedQuotation: quotation,
        });

        actions$ = m.hot('-a', { a: action });
        const response = m.cold('-a|', { a: quotation });
        const expected = m.cold('--b', { b: result });

        m.expect(effects.updateCosts$).toBeObservable(expected);
        m.flush();
        expect(quotationDetailsService.updateCostData).toHaveBeenCalledTimes(1);
        expect(snackBar.open).toHaveBeenCalledTimes(1);
      })
    );

    test('should return updateCostsFailure on REST error', () => {
      action = ActiveCaseActions.updateCosts({ gqPosId: '123' });
      quotationDetailsService.updateCostData = jest.fn(() => response);
      const result = ActiveCaseActions.updateCostsFailure({
        errorMessage,
      });

      actions$ = of(action);
      const response = throwError(errorMessage);

      effects.updateCosts$.subscribe((res) => {
        expect(res).toEqual(result);
      });
      expect(quotationDetailsService.updateCostData).toHaveBeenCalledTimes(1);
    });
  });

  describe('uploadRfqInformation$', () => {
    test(
      'should return updateRfqInformationSuccess when REST call is successful',
      marbles((m) => {
        action = ActiveCaseActions.updateRFQInformation({ gqPosId: '123' });
        quotationDetailsService.updateRfqInformation = jest.fn(() => response);
        snackBar.open = jest.fn();

        const quotation = QUOTATION_MOCK;
        const result = ActiveCaseActions.updateRFQInformationSuccess({
          updatedQuotation: quotation,
        });

        actions$ = m.hot('-a', { a: action });
        const response = m.cold('-a|', { a: quotation });
        const expected = m.cold('--b', { b: result });

        m.expect(effects.updateRfqInformation$).toBeObservable(expected);
        m.flush();
        expect(
          quotationDetailsService.updateRfqInformation
        ).toHaveBeenCalledTimes(1);
        expect(snackBar.open).toHaveBeenCalledTimes(1);
      })
    );

    test('should return updateRfqInformationFailure on REST error', () => {
      action = ActiveCaseActions.updateRFQInformation({ gqPosId: '123' });
      quotationDetailsService.updateRfqInformation = jest.fn(() => response);
      const result = ActiveCaseActions.updateRFQInformationFailure({
        errorMessage,
      });

      actions$ = of(action);
      const response = throwError(() => new Error(errorMessage));

      effects.updateRfqInformation$.subscribe((res) => {
        expect(res).toEqual(result);
      });
      expect(
        quotationDetailsService.updateRfqInformation
      ).toHaveBeenCalledTimes(1);
    });
  });

  describe('uploadAttachments', () => {
    test(
      'should return uploadAttachmentsSuccess when REST call is successful',
      marbles((m) => {
        action = ActiveCaseActions.uploadAttachments({
          files: [new File([], 'test')],
        });
        const attachments: QuotationAttachment[] = [
          { fileName: '1' } as QuotationAttachment,
        ];
        attachmentService.uploadFiles = jest.fn(() => response);
        snackBar.open = jest.fn();
        store.overrideSelector(getGqId, 1245);

        const result = ActiveCaseActions.uploadAttachmentsSuccess({
          attachments,
        });

        actions$ = m.hot('-a', { a: action });
        const response = m.cold('-a|', { a: attachments });
        const expected = m.cold('--b', { b: result });

        m.expect(effects.uploadAttachments$).toBeObservable(expected);
        m.flush();
        expect(attachmentService.uploadFiles).toHaveBeenCalledTimes(1);
        expect(attachmentService.uploadFiles).toHaveBeenCalledWith(
          [new File([], 'test')],
          1245
        );
        expect(snackBar.open).toHaveBeenCalledTimes(1);
      })
    );
    test('should return uploadAttachmentsFailure on REST error', () => {
      action = ActiveCaseActions.uploadAttachments({
        files: [new File([], 'test')],
      });
      attachmentService.uploadFiles = jest.fn(() => response);
      const result = ActiveCaseActions.uploadAttachmentsFailure({
        errorMessage,
      });

      actions$ = of(action);
      const response = throwError(errorMessage);

      effects.uploadAttachments$.subscribe((res) => {
        expect(res).toEqual(result);
      });
      expect(attachmentService.uploadFiles).toHaveBeenCalledTimes(1);
    });
  });

  describe('getAllAttachments', () => {
    test(
      'should return getAllAttachmentsSuccess when REST call is successful',
      marbles((m) => {
        action = ActiveCaseActions.getAllAttachments();
        const attachments: QuotationAttachment[] = [
          { fileName: '1' } as QuotationAttachment,
        ];
        attachmentService.getAllAttachments = jest.fn(() => response);
        store.overrideSelector(getGqId, 1245);
        const result = ActiveCaseActions.getAllAttachmentsSuccess({
          attachments,
        });

        actions$ = m.hot('-a', { a: action });
        const response = m.cold('-a|', { a: attachments });
        const expected = m.cold('--b', { b: result });

        m.expect(effects.getAllAttachments$).toBeObservable(expected);
        m.flush();
        expect(attachmentService.getAllAttachments).toHaveBeenCalledTimes(1);
        expect(attachmentService.getAllAttachments).toHaveBeenCalledWith(1245);
      })
    );

    test('should return getAllAttachmentsFailure on REST error', () => {
      action = ActiveCaseActions.getAllAttachments();
      attachmentService.getAllAttachments = jest.fn(() => response);
      const result = ActiveCaseActions.getAllAttachmentsFailure({
        errorMessage,
      });

      actions$ = of(action);
      const response = throwError(errorMessage);

      effects.getAllAttachments$.subscribe((res) => {
        expect(res).toEqual(result);
      });
      expect(attachmentService.getAllAttachments).toHaveBeenCalledTimes(1);
    });
  });

  describe('downloadAttachment', () => {
    test(
      'should return downloadAttachmentSuccess when REST call is successful',
      marbles((m) => {
        const attachment: QuotationAttachment = {
          gqId: 123,
          sapId: '456',
          folderName: 'folder',
          uploadedAt: '2020-01-01',
          uploadedBy: 'user',
          fileName: 'test.jpg',
        };
        action = ActiveCaseActions.downloadAttachment({ attachment }); // Trigger the effect

        global.URL.createObjectURL = jest.fn();

        const expectedAction = ActiveCaseActions.downloadAttachmentSuccess({
          fileName: 'test.jpg',
        });

        const downloadAttachmentMock = jest.spyOn(
          attachmentService,
          'downloadAttachment'
        );
        downloadAttachmentMock.mockReturnValue(
          of(
            new Blob(['file content'], {
              type: 'application/octet-stream',
            })
          )
        );

        actions$ = m.hot('-a', { a: action });

        const result = effects.downloadAttachment$;

        m.expect(result).toBeObservable('-c', { c: expectedAction });
      })
    );

    test(
      'should dispatch downloadAttachmentFailure when REST call fails',
      marbles((m) => {
        const attachment: QuotationAttachment = {
          gqId: 123,
          sapId: '456',
          folderName: 'folder',
          uploadedAt: '2020-01-01',
          uploadedBy: 'user',
          fileName: 'test.jpg',
        };
        action = ActiveCaseActions.downloadAttachment({ attachment });

        global.URL.createObjectURL = jest.fn();

        const expectedAction = ActiveCaseActions.downloadAttachmentFailure({
          errorMessage,
        });

        const downloadAttachmentMock = jest.spyOn(
          attachmentService,
          'downloadAttachment'
        );
        downloadAttachmentMock.mockReturnValue(throwError(errorMessage));

        actions$ = m.hot('-a', { a: action });

        const result = effects.downloadAttachment$;

        m.expect(result).toBeObservable('-c', { c: expectedAction });
      })
    );
  });

  describe('delete attachment', () => {
    test(
      'should return delete AttachmentsSuccess when REST call is successful',
      marbles((m) => {
        const attachment: QuotationAttachment = {
          gqId: 123,
          sapId: '456',
          folderName: 'folder',
          uploadedAt: '2020-01-01',
          uploadedBy: 'user',
          fileName: 'test.jpg',
        };
        action = ActiveCaseActions.deleteAttachment({ attachment });
        const attachments: QuotationAttachment[] = [
          { fileName: '1' } as QuotationAttachment,
        ];
        attachmentService.deleteAttachment = jest.fn(() => response);
        snackBar.open = jest.fn();

        const result = ActiveCaseActions.deleteAttachmentSuccess({
          attachments,
        });

        actions$ = m.hot('-a', { a: action });
        const response = m.cold('-a|', { a: attachments });
        const expected = m.cold('--b', { b: result });

        m.expect(effects.deleteAttachment$).toBeObservable(expected);
        m.flush();
        expect(attachmentService.deleteAttachment).toHaveBeenCalledTimes(1);
        expect(attachmentService.deleteAttachment).toHaveBeenCalledWith(
          attachment
        );
        expect(snackBar.open).toHaveBeenCalledTimes(1);
      })
    );

    test('should return delete AttachmentsFailure on REST error', () => {
      const attachment: QuotationAttachment = {
        gqId: 123,
        sapId: '456',
        folderName: 'folder',
        uploadedAt: '2020-01-01',
        uploadedBy: 'user',
        fileName: 'test.jpg',
      };
      action = ActiveCaseActions.deleteAttachment({ attachment });
      attachmentService.deleteAttachment = jest.fn(() => response);
      const result = ActiveCaseActions.deleteAttachmentFailed({
        errorMessage,
      });

      actions$ = of(action);
      const response = throwError(errorMessage);

      effects.deleteAttachment$.subscribe((res) => {
        expect(res).toEqual(result);
      });
      expect(attachmentService.deleteAttachment).toHaveBeenCalledTimes(1);
    });
  });
  // eslint-disable-next-line max-lines
});
