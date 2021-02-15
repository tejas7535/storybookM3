import { TestBed } from '@angular/core/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';

import { Actions } from '@ngrx/effects';
import { provideMockActions } from '@ngrx/effects/testing';
import { ROUTER_NAVIGATED } from '@ngrx/router-store';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { cold, hot } from 'jasmine-marbles';
import { configureTestSuite } from 'ng-bullet';

import { SnackBarModule, SnackBarService } from '@schaeffler/snackbar';

import {
  CUSTOMER_MOCK,
  QUOTATION_DETAIL_MOCK,
  QUOTATION_IDENTIFIER_MOCK,
  QUOTATION_MOCK,
} from '../../../../../testing/mocks';
import { AppRoutePath } from '../../../../app-route-path.enum';
import { CustomerDetailsService } from '../../../../process-case-view/service/customer-details.service';
import { QuotationDetailsService } from '../../../../process-case-view/service/quotation-details.service';
import { ValidationService } from '../../../../shared/services/validationService/validation.service';
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
} from '../../actions/process-case/process-case.action';
import {
  MaterialTableItem,
  MaterialValidation,
  QuotationIdentifier,
  UpdateQuotationDetail,
  ValidationDescription,
} from '../../models';
import {
  getAddMaterialRowData,
  getAddQuotationDetailsRequest,
  getRemoveQuotationDetailsRequest,
  getSelectedQuotationIdentifier,
} from '../../selectors';
import { ProcessCaseEffect } from './process-case.effect';

jest.mock('@ngneat/transloco', () => ({
  ...jest.requireActual('@ngneat/transloco'),
  translate: jest.fn(() => 'translate it'),
}));
describe('ProcessCaseEffect', () => {
  let action: any;
  let actions$: any;
  let effects: ProcessCaseEffect;
  let customerDetailsService: CustomerDetailsService;
  let quotationDetailsService: QuotationDetailsService;
  let validationService: ValidationService;
  let snackBarService: SnackBarService;

  let store: any;
  let router: Router;

  const errorMessage = 'An error occured';

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      imports: [BrowserAnimationsModule, SnackBarModule, RouterTestingModule],
      providers: [
        ProcessCaseEffect,
        provideMockActions(() => actions$),
        provideMockStore(),
        {
          provide: CustomerDetailsService,
          useValue: {
            getCustomer: jest.fn(),
          },
        },
        {
          provide: QuotationDetailsService,
          useValue: {
            getQuotation: jest.fn(),
            addMaterial: jest.fn(),
            removeMaterial: jest.fn(),
          },
        },
        {
          provide: ValidationService,
          useValue: {
            validate: jest.fn(),
          },
        },
      ],
    });
  });

  beforeEach(() => {
    actions$ = TestBed.inject(Actions);
    effects = TestBed.inject(ProcessCaseEffect);
    customerDetailsService = TestBed.inject(CustomerDetailsService);
    quotationDetailsService = TestBed.inject(QuotationDetailsService);
    validationService = TestBed.inject(ValidationService);
    store = TestBed.inject(MockStore);
    router = TestBed.inject(Router);
    snackBarService = TestBed.inject(SnackBarService);
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
      customerDetailsService.getCustomer = jest.fn(() => response);
      const item = CUSTOMER_MOCK;
      const result = loadCustomerSuccess({ item });

      actions$ = hot('-a', { a: action });

      const response = cold('-a|', {
        a: item,
      });
      const expected = cold('--b', { b: result });

      expect(effects.customerDetails$).toBeObservable(expected);
      expect(customerDetailsService.getCustomer).toHaveBeenCalledTimes(1);
      expect(customerDetailsService.getCustomer).toHaveBeenCalledWith(
        QUOTATION_IDENTIFIER_MOCK
      );
    });

    test('should return customerDetailsFailure on REST error', () => {
      actions$ = hot('-a', { a: action });

      const result = loadCustomerFailure({ errorMessage });

      const response = cold('-#|', undefined, errorMessage);
      const expected = cold('--b', { b: result });

      customerDetailsService.getCustomer = jest.fn(() => response);

      expect(effects.customerDetails$).toBeObservable(expected);
      expect(customerDetailsService.getCustomer).toHaveBeenCalledTimes(1);
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
      quotationDetailsService.getQuotation = jest.fn(() => response);
      const item = QUOTATION_MOCK;
      const result = loadQuotationSuccess({ item });

      actions$ = hot('-a', { a: action });

      const response = cold('-a|', {
        a: item,
      });
      const expected = cold('--b', { b: result });

      expect(effects.quotationDetails$).toBeObservable(expected);
      expect(quotationDetailsService.getQuotation).toHaveBeenCalledTimes(1);
      expect(quotationDetailsService.getQuotation).toHaveBeenCalledWith(gqId);
    });

    test('should return quotationDetailsFailure on REST error', () => {
      actions$ = hot('-a', { a: action });

      const result = loadQuotationFailure({ errorMessage });

      const response = cold('-#|', undefined, errorMessage);
      const expected = cold('--b', { b: result });

      quotationDetailsService.getQuotation = jest.fn(() => response);

      expect(effects.quotationDetails$).toBeObservable(expected);
      expect(quotationDetailsService.getQuotation).toHaveBeenCalledTimes(1);
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

      validationService.validate = jest.fn(() => response);
      const materialValidations: MaterialValidation[] = [];
      const result = validateAddMaterialsSuccess({ materialValidations });

      actions$ = hot('-a', { a: action });
      const response = cold('-a|', {
        a: materialValidations,
      });
      const expected = cold('--b', { b: result });
      expect(effects.validate$).toBeObservable(expected);
      expect(validationService.validate).toHaveBeenCalledTimes(1);
      expect(validationService.validate).toHaveBeenCalledWith(tableData);
    });
    test('should return validateFailure on REST error', () => {
      const result = validateAddMaterialsFailure({ errorMessage });

      actions$ = hot('-a', { a: action });
      const response = cold('-#|', undefined, errorMessage);
      const expected = cold('--b', { b: result });

      validationService.validate = jest.fn(() => response);

      expect(effects.validate$).toBeObservable(expected);
      expect(validationService.validate).toHaveBeenCalledTimes(1);
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
    test('should return removeMaterialsSuccess when REST call is successful', () => {
      snackBarService.showSuccessMessage = jest.fn();
      const quotationDetailIDs: UpdateQuotationDetail[] = [
        {
          gqPositionId: QUOTATION_DETAIL_MOCK.gqPositionId,
          addedToOffer: true,
        },
      ];
      action = updateQuotationDetails({ quotationDetailIDs });

      quotationDetailsService.updateMaterial = jest.fn(() => response);
      const result = updateQuotationDetailsSuccess({ quotationDetailIDs });

      actions$ = hot('-a', { a: action });
      const response = cold('-a|');
      const expected = cold('--b', { b: result });

      expect(effects.updateMaterials$).toBeObservable(expected);
      expect(quotationDetailsService.updateMaterial).toHaveBeenCalledTimes(1);
      expect(quotationDetailsService.updateMaterial).toHaveBeenCalledWith(
        quotationDetailIDs
      );
      expect(snackBarService.showSuccessMessage).toHaveBeenCalledTimes(1);
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
  });
  // tslint:disable-next-line: max-file-line-count
});
