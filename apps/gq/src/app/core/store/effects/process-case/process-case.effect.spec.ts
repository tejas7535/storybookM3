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
  QUOTATION_IDENTIFIER_MOCK,
  QUOTATION_MOCK,
} from '../../../../../testing/mocks';
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
  validateAddMaterialsFailure,
  validateAddMaterialsSuccess,
} from '../../actions';
import {
  MaterialTableItem,
  MaterialValidation,
  QuotationIdentifier,
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

  describe(' customerDetails$', () => {
    let customerNumber: string;

    beforeEach(() => {
      customerNumber = '123456';
      action = loadCustomer();

      const quotationIdentifier: QuotationIdentifier = {
        customerNumber,
        quotationNumber: '01147852',
      };
      store.overrideSelector(
        getSelectedQuotationIdentifier,
        quotationIdentifier
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
        customerNumber
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
    let quotationNumber: string;

    beforeEach(() => {
      quotationNumber = '123456';
      action = loadQuotation();

      const quotationIdentifier: QuotationIdentifier = {
        quotationNumber,
        customerNumber: '12425',
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
      expect(quotationDetailsService.getQuotation).toHaveBeenCalledWith(
        quotationNumber
      );
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

  describe('selectQuotation$', () => {
    test('should return select selectQuotation Action', () => {
      store.overrideSelector(
        getSelectedQuotationIdentifier,
        QUOTATION_IDENTIFIER_MOCK
      );

      action = {
        type: ROUTER_NAVIGATED,
        payload: {
          routerState: {
            url: '/process-case',
            queryParams: {
              quotation_number: '456789',
            },
          },
        },
      };

      actions$ = hot('-a', { a: action });

      const quotationIdentifier = new QuotationIdentifier('456789', undefined);

      const result = selectQuotation({ quotationIdentifier });
      const expected = cold('-b', { b: result });

      expect(effects.selectQuotation$).toBeObservable(expected);
    });

    test('should navigate to not-found if URL is not valid', () => {
      router.navigate = jest.fn();
      action = {
        type: ROUTER_NAVIGATED,
        payload: {
          routerState: {
            url: '/process-case',
            queryParams: {
              any_number: '456789',
            },
          },
        },
      };

      actions$ = hot('-a', { a: action });
      const expected = cold('---');

      expect(effects.selectQuotation$).toBeObservable(expected);
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
        quotation_number: '23',
        customer_number: '0060',
      };

      expect(
        ProcessCaseEffect['mapQueryParamsToIdentifier'](queryParams)
      ).toEqual({
        quotationNumber: '23',
        customerNumber: '0060',
      });
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
        quotationNumber: '62456',
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
