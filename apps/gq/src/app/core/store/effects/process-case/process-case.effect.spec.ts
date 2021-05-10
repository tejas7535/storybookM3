import { HttpClientTestingModule } from '@angular/common/http/testing';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';

import { createServiceFactory, SpectatorService } from '@ngneat/spectator';
import { Actions } from '@ngrx/effects';
import { provideMockActions } from '@ngrx/effects/testing';
import { ROUTER_NAVIGATED } from '@ngrx/router-store';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { cold, hot } from 'jasmine-marbles';

import { ENV_CONFIG } from '@schaeffler/http';
import { SnackBarModule, SnackBarService } from '@schaeffler/snackbar';

import {
  CUSTOMER_MOCK,
  QUOTATION_DETAIL_MOCK,
  QUOTATION_IDENTIFIER_MOCK,
  QUOTATION_MOCK,
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
  removeMaterials,
  removeMaterialsFailure,
  removeMaterialsSuccess,
  selectQuotation,
  updateQuotationDetailsSuccess,
  validateAddMaterialsFailure,
  validateAddMaterialsSuccess,
} from '../../actions';
import {
  loadQuotationFromUrl,
  loadSelectedQuotationDetailFromUrl,
  setSelectedQuotationDetail,
  updateQuotationDetails,
  updateQuotationDetailsFailure,
  uploadOfferToSap,
  uploadOfferToSapFailure,
  uploadOfferToSapSuccess,
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
import { ProcessCaseEffect } from './process-case.effect';

jest.mock('@ngneat/transloco', () => ({
  ...jest.requireActual('@ngneat/transloco'),
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
  let snackBarService: SnackBarService;

  let store: any;
  let router: Router;

  const errorMessage = 'An error occured';

  const createService = createServiceFactory({
    service: ProcessCaseEffect,
    imports: [SnackBarModule, RouterTestingModule, HttpClientTestingModule],
    providers: [
      provideMockActions(() => actions$),
      provideMockStore(),
      {
        provide: ENV_CONFIG,
        useValue: {
          environment: {
            baseUrl: '',
          },
        },
      },
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
    snackBarService = spectator.inject(SnackBarService);
  });

  describe('customerDetails$', () => {
    beforeEach(() => {
      action = loadCustomer();

      store.overrideSelector(
        getSelectedQuotationIdentifier,
        QUOTATION_IDENTIFIER_MOCK
      );
    });

    test('should return customerDetailsSuccess action when REST call is successful', () => {
      searchService.getCustomer = jest.fn(() => response);
      const item = CUSTOMER_MOCK;
      const result = loadCustomerSuccess({ item });

      actions$ = hot('-a', { a: action });

      const response = cold('-a|', {
        a: item,
      });
      const expected = cold('--b', { b: result });

      expect(effects.customerDetails$).toBeObservable(expected);
      expect(searchService.getCustomer).toHaveBeenCalledTimes(1);
      expect(searchService.getCustomer).toHaveBeenCalledWith(
        QUOTATION_IDENTIFIER_MOCK
      );
    });

    test('should return customerDetailsFailure on REST error', () => {
      actions$ = hot('-a', { a: action });

      const result = loadCustomerFailure({ errorMessage });

      const response = cold('-#|', undefined, errorMessage);
      const expected = cold('--b', { b: result });

      searchService.getCustomer = jest.fn(() => response);

      expect(effects.customerDetails$).toBeObservable(expected);
      expect(searchService.getCustomer).toHaveBeenCalledTimes(1);
    });
  });

  describe(' quotationDetails$', () => {
    let gqId: number;

    beforeEach(() => {
      gqId = 123456;
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

    test('should return quotationDetailsSuccess action when REST call is successful', () => {
      quotationService.getQuotation = jest.fn(() => response);
      const item = QUOTATION_MOCK;
      const result = loadQuotationSuccess({ item });

      actions$ = hot('-a', { a: action });

      const response = cold('-a|', {
        a: item,
      });
      const expected = cold('--b', { b: result });

      expect(effects.quotationDetails$).toBeObservable(expected);
      expect(quotationService.getQuotation).toHaveBeenCalledTimes(1);
      expect(quotationService.getQuotation).toHaveBeenCalledWith(gqId);
    });

    test('should return quotationDetailsFailure on REST error', () => {
      actions$ = hot('-a', { a: action });

      const result = loadQuotationFailure({ errorMessage });

      const response = cold('-#|', undefined, errorMessage);
      const expected = cold('--b', { b: result });

      quotationService.getQuotation = jest.fn(() => response);

      expect(effects.quotationDetails$).toBeObservable(expected);
      expect(quotationService.getQuotation).toHaveBeenCalledTimes(1);
    });
  });

  describe('triggerDataLoad$', () => {
    test('should return loadQuotation Action', () => {
      action = selectQuotation({
        quotationIdentifier: QUOTATION_IDENTIFIER_MOCK,
      });

      actions$ = hot('-a', { a: action });

      const expected = cold('-(bc)', {
        b: loadQuotation(),
        c: loadCustomer(),
      });

      expect(effects.triggerDataLoad$).toBeObservable(expected);
    });
  });

  describe('loadFromUrl$', () => {
    test('should return loadQuotationFromUrl', () => {
      const queryParams = {
        gqId: 12334,
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

      actions$ = hot('-a', { a: action });

      const result = loadQuotationFromUrl({
        queryParams,
      });
      const expected = cold('-b', { b: result });

      expect(effects.loadFromUrl$).toBeObservable(expected);
    });
    test('should return loadQuotationFromUrl', () => {
      const queryParams = {
        gqId: 12334,
        customerNumber: '3456',
        salesOrg: '0267',
        gqPositionId: '5678',
      };

      action = {
        type: ROUTER_NAVIGATED,
        payload: {
          routerState: {
            queryParams,
            url: `/${AppRoutePath.OfferViewPath}`,
          },
        },
      };

      actions$ = hot('-a', { a: action });

      const result = loadQuotationFromUrl({
        queryParams,
      });
      const expected = cold('-b', { b: result });

      expect(effects.loadFromUrl$).toBeObservable(expected);
    });
    test('should return loadQuotationFromUrl and loadSelectedQuotationDetailFromUrl', () => {
      const queryParams = {
        gqId: 12334,
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

      actions$ = hot('-a', { a: action });

      const resultB = loadQuotationFromUrl({
        queryParams,
      });

      const resultC = loadSelectedQuotationDetailFromUrl({
        gqPositionId: queryParams.gqPositionId,
      });
      const expected = cold('-(cb)', { b: resultB, c: resultC });

      expect(effects.loadFromUrl$).toBeObservable(expected);
    });
  });
  describe('loadSelectedQuotationDetailFromUrl$', () => {
    test('should return setSelectedQuotationDetail', () => {
      action = loadSelectedQuotationDetailFromUrl({ gqPositionId: '1234' });
      actions$ = hot('-a', { a: action });

      const result = setSelectedQuotationDetail({ gqPositionId: '1234' });
      const expected = cold('-b', { b: result });

      expect(effects.loadSelectedQuotationDetailFromUrl$).toBeObservable(
        expected
      );
    });

    test('should navigate to not-found if URL is not valid', () => {
      router.navigate = jest.fn();
      action = loadSelectedQuotationDetailFromUrl({ gqPositionId: undefined });

      actions$ = hot('-a', { a: action });
      const expected = cold('---');

      expect(effects.loadSelectedQuotationDetailFromUrl$).toBeObservable(
        expected
      );
      expect(router.navigate).toHaveBeenCalledWith(['not-found']);
    });
  });

  describe('loadQuotationFromUrl$', () => {
    test('should return selectQuotation', () => {
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
      actions$ = hot('-a', { a: action });

      const result = selectQuotation({
        quotationIdentifier: {
          gqId: 123,
          customerNumber: '124',
          salesOrg: '456',
        },
      });
      const expected = cold('-b', { b: result });

      expect(effects.loadQuotationFromUrl$).toBeObservable(expected);
    });

    test('should navigate to not-found if URL is not valid', () => {
      router.navigate = jest.fn();
      const identifier = {
        gqId: 123,
        customerNumber: '1246',
        salesOrg: '4567',
      };
      store.overrideSelector(getSelectedQuotationIdentifier, identifier);
      action = loadQuotationFromUrl({ queryParams: {} });

      actions$ = hot('-a', { a: action });
      const expected = cold('---');

      expect(effects.loadQuotationFromUrl$).toBeObservable(expected);
      expect(router.navigate).toHaveBeenCalledWith(['not-found']);
    });
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

    test('should return validateSuccess when REST call is successful', () => {
      action = pasteRowDataItemsToAddMaterial({
        items: [],
        pasteDestination: {},
      });

      materialService.validateMaterials = jest.fn(() => response);
      const materialValidations: MaterialValidation[] = [];
      const result = validateAddMaterialsSuccess({ materialValidations });

      actions$ = hot('-a', { a: action });
      const response = cold('-a|', {
        a: materialValidations,
      });
      const expected = cold('--b', { b: result });
      expect(effects.validate$).toBeObservable(expected);
      expect(materialService.validateMaterials).toHaveBeenCalledTimes(1);
      expect(materialService.validateMaterials).toHaveBeenCalledWith(tableData);
    });
    test('should return validateFailure on REST error', () => {
      const result = validateAddMaterialsFailure({ errorMessage });

      actions$ = hot('-a', { a: action });
      const response = cold('-#|', undefined, errorMessage);
      const expected = cold('--b', { b: result });

      materialService.validateMaterials = jest.fn(() => response);

      expect(effects.validate$).toBeObservable(expected);
      expect(materialService.validateMaterials).toHaveBeenCalledTimes(1);
    });
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

    test('should return addMaterialsSuccess when REST call is successful', () => {
      snackBarService.showSuccessMessage = jest.fn();
      action = addMaterials();

      quotationDetailsService.addMaterial = jest.fn(() => response);
      const item = QUOTATION_MOCK;
      const result = addMaterialsSuccess({ item });

      actions$ = hot('-a', { a: action });
      const response = cold('-a|', {
        a: item,
      });
      const expected = cold('--b', { b: result });

      expect(effects.addMaterials$).toBeObservable(expected);
      expect(quotationDetailsService.addMaterial).toHaveBeenCalledTimes(1);
      expect(quotationDetailsService.addMaterial).toHaveBeenCalledWith(
        addQuotationDetailsRequest
      );
      expect(snackBarService.showSuccessMessage).toHaveBeenCalledTimes(1);
    });

    test('should return addMaterialsFailure on REST error', () => {
      quotationDetailsService.addMaterial = jest.fn(() => response);
      const result = addMaterialsFailure({ errorMessage });

      actions$ = hot('-a', { a: action });
      const response = cold('-#|', undefined, errorMessage);
      const expected = cold('--b', { b: result });

      expect(effects.addMaterials$).toBeObservable(expected);
      expect(quotationDetailsService.addMaterial).toHaveBeenCalledTimes(1);
    });
  });

  describe('removeMaterials$', () => {
    const qgPositionIds = ['1234567'];

    beforeEach(() => {
      store.overrideSelector(getRemoveQuotationDetailsRequest, qgPositionIds);
    });

    test('should return removeMaterialsSuccess when REST call is successful', () => {
      snackBarService.showSuccessMessage = jest.fn();
      action = removeMaterials();

      quotationDetailsService.removeMaterial = jest.fn(() => response);
      const item = QUOTATION_MOCK;
      const result = removeMaterialsSuccess({ item });

      actions$ = hot('-a', { a: action });
      const response = cold('-a|', {
        a: item,
      });
      const expected = cold('--b', { b: result });

      expect(effects.removeMaterials$).toBeObservable(expected);
      expect(quotationDetailsService.removeMaterial).toHaveBeenCalledTimes(1);
      expect(quotationDetailsService.removeMaterial).toHaveBeenCalledWith(
        qgPositionIds
      );
      expect(snackBarService.showSuccessMessage).toHaveBeenCalledTimes(1);
    });

    test('should return removeMaterialsFailure on REST error', () => {
      quotationDetailsService.removeMaterial = jest.fn(() => response);
      const result = removeMaterialsFailure({ errorMessage });

      actions$ = hot('-a', { a: action });
      const response = cold('-#|', undefined, errorMessage);
      const expected = cold('--b', { b: result });

      expect(effects.removeMaterials$).toBeObservable(expected);
      expect(quotationDetailsService.removeMaterial).toHaveBeenCalledTimes(1);
    });
  });

  describe('updateMaterials$', () => {
    const updateQuotationDetailList: UpdateQuotationDetail[] = [
      {
        gqPositionId: QUOTATION_DETAIL_MOCK.gqPositionId,
        addedToOffer: true,
      },
    ];
    const quotationDetails = QUOTATION_MOCK.quotationDetails;

    test('should return removeMaterialsSuccess when REST call is successful', () => {
      action = updateQuotationDetails({ updateQuotationDetailList });
      snackBarService.showSuccessMessage = jest.fn();
      quotationDetailsService.updateMaterial = jest.fn(() => response);
      const result = updateQuotationDetailsSuccess({ quotationDetails });

      actions$ = hot('-a', { a: action });
      const response = cold('-a|', { a: quotationDetails });
      const expected = cold('--b', { b: result });

      expect(effects.updateMaterials$).toBeObservable(expected);
      expect(quotationDetailsService.updateMaterial).toHaveBeenCalledTimes(1);
      expect(quotationDetailsService.updateMaterial).toHaveBeenCalledWith(
        updateQuotationDetailList
      );
      expect(snackBarService.showSuccessMessage).toHaveBeenCalledTimes(1);
    });
    test('should return removeMaterialsSuccess when REST call is successful', () => {
      action = updateQuotationDetails({ updateQuotationDetailList });
      snackBarService.showSuccessMessage = jest.fn();

      quotationDetailsService.updateMaterial = jest.fn(() => response);
      updateQuotationDetailList[0].price = 10;
      const result = updateQuotationDetailsSuccess({ quotationDetails });

      actions$ = hot('-a', { a: action });
      const response = cold('-a|', { a: quotationDetails });
      const expected = cold('--b', { b: result });

      expect(effects.updateMaterials$).toBeObservable(expected);
      expect(quotationDetailsService.updateMaterial).toHaveBeenCalledTimes(1);
      expect(quotationDetailsService.updateMaterial).toHaveBeenCalledWith(
        updateQuotationDetailList
      );
      expect(snackBarService.showSuccessMessage).toHaveBeenCalledTimes(1);
    });

    test('should return updateQuotationDetailsFailure on REST error', () => {
      quotationDetailsService.updateMaterial = jest.fn(() => response);

      const result = updateQuotationDetailsFailure({ errorMessage });

      action = updateQuotationDetails({ updateQuotationDetailList });

      actions$ = hot('-a', { a: action });
      const response = cold('-#|', undefined, errorMessage);
      const expected = cold('--b', { b: result });

      expect(effects.updateMaterials$).toBeObservable(expected);
      expect(quotationDetailsService.updateMaterial).toHaveBeenCalledTimes(1);
      expect(quotationDetailsService.updateMaterial).toHaveBeenCalledWith(
        updateQuotationDetailList
      );
    });
  });

  describe('uploadToSap$', () => {
    const gqId = 123;
    beforeEach(() => {
      store.overrideSelector(getGqId, gqId);
    });

    test('should return uploadOfferToSapSuccess when REST call is successful', () => {
      snackBarService.showSuccessMessage = jest.fn();

      action = uploadOfferToSap();
      const result = uploadOfferToSapSuccess();
      quotationService.uploadOfferToSap = jest.fn(() => response);

      actions$ = hot('-a', { a: action });
      const response = cold('-a|');
      const expected = cold('--b', { b: result });

      expect(effects.uploadToSap$).toBeObservable(expected);
      expect(quotationService.uploadOfferToSap).toHaveBeenCalledTimes(1);
      expect(snackBarService.showSuccessMessage).toHaveBeenCalledTimes(1);
    });
    test('should return uploadOfferToSapSuccess on REST error', () => {
      quotationService.uploadOfferToSap = jest.fn(() => response);
      const result = uploadOfferToSapFailure({ errorMessage });

      actions$ = hot('-a', { a: action });
      const response = cold('-#|', undefined, errorMessage);
      const expected = cold('--b', { b: result });

      expect(effects.uploadToSap$).toBeObservable(expected);
      expect(quotationService.uploadOfferToSap).toHaveBeenCalledTimes(1);
    });
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
        gqId: 62456,
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
  // eslint-disable-next-line max-lines
});
