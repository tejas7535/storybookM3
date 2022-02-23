import { HttpClientTestingModule } from '@angular/common/http/testing';
import { MATERIAL_SANITY_CHECKS } from '@angular/material/core';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';

import { createServiceFactory, SpectatorService } from '@ngneat/spectator';
import { translate, TranslocoModule } from '@ngneat/transloco';
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
  VIEW_QUOTATION_MOCK,
} from '../../../../../testing/mocks';
import { AppRoutePath } from '../../../../app-route-path.enum';
import {
  MaterialTableItem,
  MaterialValidation,
  ValidationDescription,
} from '../../../../shared/models/table';
import { MaterialService } from '../../../../shared/services/rest-services/material-service/material.service';
import { QuotationDetailsService } from '../../../../shared/services/rest-services/quotation-details-service/quotation-details.service';
import { QuotationService } from '../../../../shared/services/rest-services/quotation-service/quotation.service';
import { SearchService } from '../../../../shared/services/rest-services/search-service/search.service';
import {
  addMaterials,
  addMaterialsFailure,
  addMaterialsSuccess,
  loadCustomer,
  loadCustomerFailure,
  loadCustomerSuccess,
  loadQuotation,
  loadQuotationFailure,
  loadQuotationSuccess,
  pasteRowDataItemsToAddMaterial,
  removePositions,
  removePositionsFailure,
  removePositionsSuccess,
  selectQuotation,
  updateQuotationDetailsSuccess,
  validateAddMaterialsFailure,
  validateAddMaterialsSuccess,
} from '../../actions';
import {
  loadQuotationFromUrl,
  loadQuotationInInterval,
  loadQuotationSuccessFullyCompleted,
  loadSelectedQuotationDetailFromUrl,
  refreshSapPricing,
  refreshSapPricingFailure,
  refreshSapPricingSuccess,
  setSelectedQuotationDetail,
  updateCaseName,
  updateCaseNameFailure,
  updateCaseNameSuccess,
  updateQuotationDetails,
  updateQuotationDetailsFailure,
  uploadSelectionToSap,
  uploadSelectionToSapFailure,
  uploadSelectionToSapSuccess,
} from '../../actions/process-case/process-case.action';
import {
  QuotationIdentifier,
  UpdateQuotationDetail,
} from '../../reducers/process-case/models';
import {
  getAddMaterialRowData,
  getAddQuotationDetailsRequest,
  getGqId,
  getRemoveQuotationDetailsRequest,
  getSelectedQuotationIdentifier,
} from '../../selectors';
import { ProcessCaseEffect } from './process-case.effects';

/* eslint-disable max-lines */
jest.mock('@ngneat/transloco', () => ({
  ...jest.requireActual<TranslocoModule>('@ngneat/transloco'),
  translate: jest.fn(() => 'translate it'),
}));
describe('ProcessCaseEffect', () => {
  let spectator: SpectatorService<ProcessCaseEffect>;
  let action: any;
  let actions$: any;
  let effects: ProcessCaseEffect;
  let searchService: SearchService;
  let quotationDetailsService: QuotationDetailsService;
  let quotationService: QuotationService;
  let materialService: MaterialService;
  let snackBar: MatSnackBar;

  let store: any;
  let router: Router;

  const errorMessage = 'An error occured';

  const createService = createServiceFactory({
    service: ProcessCaseEffect,
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
    effects = spectator.inject(ProcessCaseEffect);
    searchService = spectator.inject(SearchService);
    quotationDetailsService = spectator.inject(QuotationDetailsService);
    quotationService = spectator.inject(QuotationService);
    materialService = spectator.inject(MaterialService);
    store = spectator.inject(MockStore);
    router = spectator.inject(Router);
    snackBar = spectator.inject(MatSnackBar);
  });

  describe('customerDetails$', () => {
    beforeEach(() => {
      action = loadCustomer();

      store.overrideSelector(
        getSelectedQuotationIdentifier,
        QUOTATION_IDENTIFIER_MOCK
      );
    });

    test(
      'should return customerDetailsSuccess action when REST call is successful',
      marbles((m) => {
        searchService.getCustomer = jest.fn(() => response);
        const item = CUSTOMER_MOCK;
        const result = loadCustomerSuccess({ item });

        actions$ = m.hot('-a', { a: action });

        const response = m.cold('-a|', {
          a: item,
        });
        const expected = m.cold('--b', { b: result });

        m.expect(effects.customerDetails$).toBeObservable(expected);
        m.flush();
        expect(searchService.getCustomer).toHaveBeenCalledTimes(1);
        expect(searchService.getCustomer).toHaveBeenCalledWith(
          QUOTATION_IDENTIFIER_MOCK
        );
      })
    );

    test(
      'should return customerDetailsFailure on REST error',
      marbles((m) => {
        actions$ = m.hot('-a', { a: action });

        const result = loadCustomerFailure({ errorMessage });

        const response = m.cold('-#|', undefined, errorMessage);
        const expected = m.cold('--b', { b: result });

        searchService.getCustomer = jest.fn(() => response);

        m.expect(effects.customerDetails$).toBeObservable(expected);
        m.flush();
        expect(searchService.getCustomer).toHaveBeenCalledTimes(1);
      })
    );
  });

  describe('quotation$', () => {
    let gqId: number;

    beforeEach(() => {
      gqId = 123_456;
      action = loadQuotation();

      const quotationIdentifier: QuotationIdentifier = {
        gqId,
        customerNumber: '12425',
        salesOrg: '0236',
      };

      store.overrideSelector(
        getSelectedQuotationIdentifier,
        quotationIdentifier
      );
    });

    test(
      'should return loadQuotationSuccess action when REST call is successful and calculation completed',
      marbles((m) => {
        quotationService.getQuotation = jest.fn(() => response);
        const item = QUOTATION_MOCK;

        actions$ = m.hot('-a', { a: action });

        const response = m.cold('-a|', {
          a: item,
        });
        const expected = m.cold('--(bc)', {
          b: loadQuotationSuccess({ item }),
          c: loadQuotationSuccessFullyCompleted(),
        });

        m.expect(effects.quotation$).toBeObservable(expected);
        m.flush();
        expect(quotationService.getQuotation).toHaveBeenCalledTimes(1);
        expect(quotationService.getQuotation).toHaveBeenCalledWith(gqId);
      })
    );
    test(
      'should return loadQuotationSuccess action when REST call is successful and calculation not completed',
      marbles((m) => {
        quotationService.getQuotation = jest.fn(() => response);
        const item = { ...QUOTATION_MOCK, calculationInProgress: true };

        actions$ = m.hot('-a', { a: action });

        const response = m.cold('-a|', {
          a: item,
        });
        const expected = m.cold('--b', { b: loadQuotationSuccess({ item }) });

        m.expect(effects.quotation$).toBeObservable(expected);
        m.flush();
        expect(quotationService.getQuotation).toHaveBeenCalledTimes(1);
        expect(quotationService.getQuotation).toHaveBeenCalledWith(gqId);
      })
    );

    test(
      'should return loadQuotationFailure on REST error',
      marbles((m) => {
        actions$ = m.hot('-a', { a: action });

        const result = loadQuotationFailure({ errorMessage });

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
      'should return loadQuotation Action',
      marbles((m) => {
        action = selectQuotation({
          quotationIdentifier: QUOTATION_IDENTIFIER_MOCK,
        });

        actions$ = m.hot('-a', { a: action });

        const expected = m.cold('-(bc)', {
          b: loadQuotationInInterval(),
          c: loadCustomer(),
        });

        m.expect(effects.triggerDataLoad$).toBeObservable(expected);
        m.flush();
      })
    );
  });

  describe('loadFromUrl$', () => {
    test(
      'should return loadQuotationFromUrl',
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

        const result = loadQuotationFromUrl({
          queryParams,
        });
        const expected = m.cold('-b', { b: result });

        m.expect(effects.loadFromUrl$).toBeObservable(expected);
        m.flush();
      })
    );

    test(
      'should return loadQuotationFromUrl and loadSelectedQuotationDetailFromUrl',
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

        const resultB = loadQuotationFromUrl({
          queryParams,
        });

        const resultC = loadSelectedQuotationDetailFromUrl({
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
        action = loadSelectedQuotationDetailFromUrl({ gqPositionId: '1234' });
        actions$ = m.hot('-a', { a: action });

        const result = setSelectedQuotationDetail({ gqPositionId: '1234' });
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
        action = loadSelectedQuotationDetailFromUrl({
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
        store.overrideSelector(getSelectedQuotationIdentifier, identifier);
        action = loadQuotationFromUrl({ queryParams });
        actions$ = m.hot('-a', { a: action });
        const result = selectQuotation({
          quotationIdentifier: {
            gqId: 123,
            customerNumber: '124',
            salesOrg: '456',
          },
        });
        const expected = m.cold('-b', { b: result });
        m.expect(effects.loadQuotationFromUrl$).toBeObservable(expected);
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
        store.overrideSelector(getSelectedQuotationIdentifier, identifier);
        action = loadQuotationFromUrl({ queryParams: {} });

        actions$ = m.hot('-a', { a: action });
        const expected = m.cold('---');

        m.expect(effects.loadQuotationFromUrl$).toBeObservable(expected);
        m.flush();
        expect(router.navigate).toHaveBeenCalledWith(['not-found']);
      })
    );
  });

  describe('validate$', () => {
    const tableData: MaterialTableItem[] = [
      {
        materialNumber: '1234',
        quantity: 20,
        info: {
          valid: false,
          description: [ValidationDescription.Not_Validated],
        },
      },
    ];
    beforeEach(() => {
      store.overrideSelector(getAddMaterialRowData, tableData);
    });

    test(
      'should return validateSuccess when REST call is successful',
      marbles((m) => {
        action = pasteRowDataItemsToAddMaterial({
          items: [],
        });

        materialService.validateMaterials = jest.fn(() => response);
        const materialValidations: MaterialValidation[] = [];
        const result = validateAddMaterialsSuccess({ materialValidations });

        actions$ = m.hot('-a', { a: action });
        const response = m.cold('-a|', {
          a: materialValidations,
        });
        const expected = m.cold('--b', { b: result });
        m.expect(effects.validate$).toBeObservable(expected);
        m.flush();
        expect(materialService.validateMaterials).toHaveBeenCalledTimes(1);
        expect(materialService.validateMaterials).toHaveBeenCalledWith(
          tableData
        );
      })
    );

    test(
      'should return validateFailure on REST error',
      marbles((m) => {
        const result = validateAddMaterialsFailure({ errorMessage });

        actions$ = m.hot('-a', { a: action });
        const response = m.cold('-#|', undefined, errorMessage);
        const expected = m.cold('--b', { b: result });

        materialService.validateMaterials = jest.fn(() => response);

        m.expect(effects.validate$).toBeObservable(expected);
        m.flush();
        expect(materialService.validateMaterials).toHaveBeenCalledTimes(1);
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
        action = addMaterials();

        quotationDetailsService.addMaterial = jest.fn(() => response);
        const item = QUOTATION_MOCK;
        const result = addMaterialsSuccess({ item });

        actions$ = m.hot('-a', { a: action });
        const response = m.cold('-a|', {
          a: item,
        });
        const expected = m.cold('--b', { b: result });

        m.expect(effects.addMaterials$).toBeObservable(expected);
        m.flush();
        expect(quotationDetailsService.addMaterial).toHaveBeenCalledTimes(1);
        expect(quotationDetailsService.addMaterial).toHaveBeenCalledWith(
          addQuotationDetailsRequest
        );
        expect(snackBar.open).toHaveBeenCalledTimes(1);
      })
    );

    test(
      'should return addMaterialsFailure on REST error',
      marbles((m) => {
        quotationDetailsService.addMaterial = jest.fn(() => response);
        const result = addMaterialsFailure({ errorMessage });

        actions$ = m.hot('-a', { a: action });
        const response = m.cold('-#|', undefined, errorMessage);
        const expected = m.cold('--b', { b: result });

        m.expect(effects.addMaterials$).toBeObservable(expected);
        m.flush();
        expect(quotationDetailsService.addMaterial).toHaveBeenCalledTimes(1);
      })
    );
  });

  describe('removePositions$', () => {
    const qgPositionIds = ['1234567'];

    beforeEach(() => {
      store.overrideSelector(getRemoveQuotationDetailsRequest, qgPositionIds);
    });

    test(
      'should return removePositionsSuccess when REST call is successful',
      marbles((m) => {
        snackBar.open = jest.fn();
        const gqPositionIds = ['1'];
        action = removePositions({ gqPositionIds });

        quotationDetailsService.removeMaterial = jest.fn(() => response);
        const item = QUOTATION_MOCK;
        const result = removePositionsSuccess({ item });

        actions$ = m.hot('-a', { a: action });
        const response = m.cold('-a|', {
          a: item,
        });
        const expected = m.cold('--b', { b: result });

        m.expect(effects.removePositions$).toBeObservable(expected);
        m.flush();
        expect(quotationDetailsService.removeMaterial).toHaveBeenCalledTimes(1);
        expect(quotationDetailsService.removeMaterial).toHaveBeenCalledWith(
          qgPositionIds
        );
        expect(snackBar.open).toHaveBeenCalledTimes(1);
      })
    );

    test(
      'should return removePositionsFailure on REST error',
      marbles((m) => {
        quotationDetailsService.removeMaterial = jest.fn(() => response);
        const result = removePositionsFailure({ errorMessage });

        actions$ = m.hot('-a', { a: action });
        const response = m.cold('-#|', undefined, errorMessage);
        const expected = m.cold('--b', { b: result });

        m.expect(effects.removePositions$).toBeObservable(expected);
        m.flush();
        expect(quotationDetailsService.removeMaterial).toHaveBeenCalledTimes(1);
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
    const quotationDetails = QUOTATION_MOCK.quotationDetails;

    test(
      'should return removePositionsSuccess when REST call is successful',
      marbles((m) => {
        action = updateQuotationDetails({ updateQuotationDetailList });
        effects['showUpdateQuotationDetailToast'] = jest.fn();
        quotationDetailsService.updateMaterial = jest.fn(() => response);
        const result = updateQuotationDetailsSuccess({ quotationDetails });

        actions$ = m.hot('-a', { a: action });
        const response = m.cold('-a|', { a: quotationDetails });
        const expected = m.cold('--b', { b: result });

        m.expect(effects.updateMaterials$).toBeObservable(expected);
        m.flush();
        expect(quotationDetailsService.updateMaterial).toHaveBeenCalledTimes(1);
        expect(quotationDetailsService.updateMaterial).toHaveBeenCalledWith(
          updateQuotationDetailList
        );
        expect(effects['showUpdateQuotationDetailToast']).toHaveBeenCalledTimes(
          1
        );
      })
    );

    test(
      'should return updateQuotationDetailsFailure on REST error',
      marbles((m) => {
        quotationDetailsService.updateMaterial = jest.fn(() => response);

        const result = updateQuotationDetailsFailure({ errorMessage });

        action = updateQuotationDetails({ updateQuotationDetailList });

        actions$ = m.hot('-a', { a: action });
        const response = m.cold('-#|', undefined, errorMessage);
        const expected = m.cold('--b', { b: result });

        m.expect(effects.updateMaterials$).toBeObservable(expected);
        m.flush();
        expect(quotationDetailsService.updateMaterial).toHaveBeenCalledTimes(1);
        expect(quotationDetailsService.updateMaterial).toHaveBeenCalledWith(
          updateQuotationDetailList
        );
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

        action = uploadSelectionToSap({ gqPositionIds: ['1'] });
        const result = uploadSelectionToSapSuccess();
        quotationService.uploadSelectionToSap = jest.fn(() => response);

        actions$ = m.hot('-a', { a: action });
        const response = m.cold('-a|');
        const expected = m.cold('--b', { b: result });

        m.expect(effects.uploadSelectionToSap$).toBeObservable(expected);
        m.flush();
        expect(quotationService.uploadSelectionToSap).toHaveBeenCalledTimes(1);
        expect(quotationService.uploadSelectionToSap).toHaveBeenCalledWith([
          '1',
        ]);
        expect(snackBar.open).toHaveBeenCalledTimes(1);
      })
    );

    test(
      'should return uploadSelectionToSapSuccess on REST error',
      marbles((m) => {
        quotationService.uploadSelectionToSap = jest.fn(() => response);
        const result = uploadSelectionToSapFailure({ errorMessage });

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

        action = refreshSapPricing();
        const result = refreshSapPricingSuccess({ quotation });
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
      'should return refreshSapPricingFailure on REST error',
      marbles((m) => {
        quotationService.refreshSapPricing = jest.fn(() => response);
        const result = refreshSapPricingFailure({ errorMessage });

        actions$ = m.hot('-a', { a: action });
        const response = m.cold('-#|', undefined, errorMessage);
        const expected = m.cold('--b', { b: result });

        m.expect(effects.refreshSapPricing$).toBeObservable(expected);
        m.flush();
        expect(quotationService.refreshSapPricing).toHaveBeenCalledTimes(1);
      })
    );
  });

  describe('mapQueryParamsToIdentifier', () => {
    let queryParams;

    test('should return undefined, if mandatory params are missing', () => {
      queryParams = {};

      expect(
        ProcessCaseEffect['mapQueryParamsToIdentifier'](queryParams)
      ).toBeUndefined();
    });

    test('should return QuotationIdentifier', () => {
      queryParams = {
        quotation_number: QUOTATION_IDENTIFIER_MOCK.gqId,
        customer_number: QUOTATION_IDENTIFIER_MOCK.customerNumber,
        sales_org: QUOTATION_IDENTIFIER_MOCK.salesOrg,
      };

      expect(
        ProcessCaseEffect['mapQueryParamsToIdentifier'](queryParams)
      ).toEqual(QUOTATION_IDENTIFIER_MOCK);
    });
  });

  describe('checkEqualityOfIdentifier', () => {
    let fromRoute;
    let current;
    let result;

    beforeEach(() => {
      fromRoute = undefined;
      current = undefined;
      result = undefined;
    });

    test('should return false, if current value is undefined', () => {
      fromRoute = QUOTATION_IDENTIFIER_MOCK;
      current = undefined;

      result = ProcessCaseEffect['checkEqualityOfIdentifier'](
        fromRoute,
        current
      );

      expect(result).toBeFalsy();
    });

    test('should return false, if one value differs', () => {
      fromRoute = QUOTATION_IDENTIFIER_MOCK;
      current = {
        ...QUOTATION_IDENTIFIER_MOCK,
        gqId: 62_456,
      };

      result = ProcessCaseEffect['checkEqualityOfIdentifier'](
        fromRoute,
        current
      );

      expect(result).toBeFalsy();
    });
    test('should return true, if all values are the same', () => {
      fromRoute = QUOTATION_IDENTIFIER_MOCK;
      current = fromRoute;

      result = ProcessCaseEffect['checkEqualityOfIdentifier'](
        fromRoute,
        current
      );

      expect(result).toBeTruthy();
    });
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
  });

  describe('updateCaseName$', () => {
    beforeEach(() => {
      const caseName = 'caseName';
      action = updateCaseName({ caseName });
    });
    test(
      'should return updateCaseNameSuccess',
      marbles((m) => {
        quotationService.updateCaseName = jest.fn(() => response);
        const quotation = VIEW_QUOTATION_MOCK;

        actions$ = m.hot('-a', { a: action });

        const response = m.cold('-a|', { a: quotation });
        const expected = m.cold('--b', {
          b: updateCaseNameSuccess({ quotation }),
        });

        m.expect(effects.updateCaseName$).toBeObservable(expected);
        m.flush();
        expect(quotationService.updateCaseName).toHaveBeenCalledTimes(1);
      })
    );
    test(
      'should return updateCaseNameFailure',
      marbles((m) => {
        actions$ = m.hot('-a', { a: action });

        const result = updateCaseNameFailure({ errorMessage });

        const response = m.cold('-#|', undefined, errorMessage);
        const expected = m.cold('--b', { b: result });

        quotationService.updateCaseName = jest.fn(() => response);

        m.expect(effects.updateCaseName$).toBeObservable(expected);
        m.flush();
        expect(quotationService.updateCaseName).toHaveBeenCalledTimes(1);
      })
    );
  });

  // eslint-disable-next-line max-lines
});
