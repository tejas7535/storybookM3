import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';

import { Actions } from '@ngrx/effects';
import { provideMockActions } from '@ngrx/effects/testing';
import { ROUTER_NAVIGATED } from '@ngrx/router-store';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { cold, hot } from 'jasmine-marbles';
import { configureTestSuite } from 'ng-bullet';

import {
  CUSTOMER_MOCK,
  QUOTATION_DETAIL_MOCK,
  QUOTATION_IDENTIFIER_MOCK,
  QUOTATION_MOCK,
} from '../../../../../testing/mocks';
import { CustomerDetailsService } from '../../../../process-case-view/service/customer-details.service';
import { QuotationDetailsService } from '../../../../process-case-view/service/quotation-details.service';
import {
  createQuotation,
  loadCustomer,
  loadCustomerFailure,
  loadCustomerSuccess,
  loadQuotation,
  loadQuotationFailure,
  loadQuotationSuccess,
  selectQuotation,
} from '../../actions';
import { Quotation, QuotationIdentifier } from '../../models';
import { getSelectedQuotationIdentifier } from '../../selectors';
import { ProcessCaseEffect } from './process-case.effect';

describe('Quotation Effects', () => {
  let action: any;
  let actions$: any;
  let effects: ProcessCaseEffect;
  let customerDetailsService: CustomerDetailsService;
  let quotationDetailsService: QuotationDetailsService;

  let store: any;
  let router: Router;

  const errorMessage = 'An error occured';

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule],
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
    store = TestBed.inject(MockStore);
    router = TestBed.inject(Router);
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
      const item = new Quotation('123456', CUSTOMER_MOCK, [
        QUOTATION_DETAIL_MOCK,
      ]);
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

      const expected = cold('-b', {
        b: loadQuotation(),
      });

      expect(effects.triggerDataLoad$).toBeObservable(expected);
    });
  });

  describe('triggerCreateQuotation$', () => {
    test('should return loadCustomer and createQuotation Action', () => {
      action = createQuotation({
        quotationIdentifier: QUOTATION_IDENTIFIER_MOCK,
      });

      actions$ = hot('-a', { a: action });

      const expected = cold('-(b)', {
        b: loadCustomer(),
      });

      expect(effects.triggerCreateQuotation$).toBeObservable(expected);
    });
  });

  describe('triggerCustomerLoad$', () => {
    test('should return loadCustomer Action', () => {
      action = loadQuotationSuccess({ item: QUOTATION_MOCK });

      actions$ = hot('-a', { a: action });

      const expected = cold('-b', {
        b: loadCustomer(),
      });

      expect(effects.triggerCustomerLoad$).toBeObservable(expected);
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
              customer_number: '0060',
            },
          },
        },
      };

      actions$ = hot('-a', { a: action });

      const quotationIdentifier = new QuotationIdentifier(undefined, '0060');

      const result = createQuotation({ quotationIdentifier });
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

  describe('DetailsEffects.mapQueryParamsToIdentifier', () => {
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

  describe('DetailsEffects.checkEqualityOfIdentifier', () => {
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
});
