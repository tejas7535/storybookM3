import { TestBed } from '@angular/core/testing';

import { Actions } from '@ngrx/effects';
import { provideMockActions } from '@ngrx/effects/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { cold, hot } from 'jasmine-marbles';
import { configureTestSuite } from 'ng-bullet';
import {
  CUSTOMER_DETAILS_MOCK,
  QUOTATION_DETAILS_MOCK,
} from '../../../../../testing/mocks';
import { CustomerDetailsService } from '../../../../process-quotation-case-view/service/customer-details.service';
import { QuotationDetailsService } from '../../../../process-quotation-case-view/service/quotation-details.service';
import {
  customerDetailsRequest,
  customerDetailsFailure,
  customerDetailsSuccess,
  quotationDetailsRequest,
  quotationDetailsFailure,
  quotationDetailsSuccess,
} from '../../actions';
import { initialState } from '../../reducers/search/search.reducer';
import { QuotationEffect } from './quotation.effect';

describe('Quotation Effects', () => {
  let action: any;
  let actions$: any;
  let effects: QuotationEffect;
  let customerDetailsService: CustomerDetailsService;
  let quotationDetailsService: QuotationDetailsService;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      providers: [
        QuotationEffect,
        provideMockActions(() => actions$),
        provideMockStore({ initialState: { search: initialState } }),
        {
          provide: CustomerDetailsService,
          useValue: {
            customerDetails: jest.fn(),
          },
        },
        {
          provide: QuotationDetailsService,
          useValue: {
            quotationDetails: jest.fn(),
          },
        },
      ],
    });
  });

  beforeEach(() => {
    actions$ = TestBed.inject(Actions);
    effects = TestBed.inject(QuotationEffect);
    customerDetailsService = TestBed.inject(CustomerDetailsService);
    quotationDetailsService = TestBed.inject(QuotationDetailsService);
  });

  describe(' customerDetails$', () => {
    let customerNumber: string;

    beforeEach(() => {
      customerNumber = '123456';
      action = customerDetailsRequest({ customerNumber });
    });
    test('should return customerDetailsSuccess action when REST call is successful', () => {
      customerDetailsService.customerDetails = jest.fn(() => response);
      const customerDetails = CUSTOMER_DETAILS_MOCK;
      const result = customerDetailsSuccess({ customerDetails });

      actions$ = hot('-a', { a: action });

      const response = cold('-a|', {
        a: customerDetails,
      });
      const expected = cold('--b', { b: result });

      expect(effects.customerDetails$).toBeObservable(expected);
      expect(customerDetailsService.customerDetails).toHaveBeenCalledTimes(1);
      expect(customerDetailsService.customerDetails).toHaveBeenCalledWith(
        customerNumber
      );
    });

    test('should return customerDetailsFailure on REST error', () => {
      const error = new Error('damn');
      const result = customerDetailsFailure();

      actions$ = hot('-a', { a: action });
      const response = cold('-#|', undefined, error);
      const expected = cold('--b', { b: result });

      customerDetailsService.customerDetails = jest.fn(() => response);

      expect(effects.customerDetails$).toBeObservable(expected);
      expect(customerDetailsService.customerDetails).toHaveBeenCalledTimes(1);
    });
  });

  describe(' quotationDetails$', () => {
    let quotationNumber: string;

    beforeEach(() => {
      quotationNumber = '123456';
      action = quotationDetailsRequest({ quotationNumber });
    });
    test('should return quotationDetailsSuccess action when REST call is successful', () => {
      quotationDetailsService.quotationDetails = jest.fn(() => response);
      const quotationDetails = [QUOTATION_DETAILS_MOCK];
      const result = quotationDetailsSuccess({ quotationDetails });

      actions$ = hot('-a', { a: action });

      const response = cold('-a|', {
        a: quotationDetails,
      });
      const expected = cold('--b', { b: result });

      expect(effects.quotationDetails$).toBeObservable(expected);
      expect(quotationDetailsService.quotationDetails).toHaveBeenCalledTimes(1);
      expect(quotationDetailsService.quotationDetails).toHaveBeenCalledWith(
        quotationNumber
      );
    });

    test('should return quotationDetailsFailure on REST error', () => {
      const error = new Error('damn');
      const result = quotationDetailsFailure();

      actions$ = hot('-a', { a: action });
      const response = cold('-#|', undefined, error);
      const expected = cold('--b', { b: result });

      quotationDetailsService.quotationDetails = jest.fn(() => response);

      expect(effects.quotationDetails$).toBeObservable(expected);
      expect(quotationDetailsService.quotationDetails).toHaveBeenCalledTimes(1);
    });
  });
});
