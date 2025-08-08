import { HttpErrorResponse, HttpStatusCode } from '@angular/common/http';
import { provideRouter } from '@angular/router';

import {
  createServiceFactory,
  mockProvider,
  SpectatorService,
} from '@ngneat/spectator/jest';
import { Actions } from '@ngrx/effects';
import { provideMockActions } from '@ngrx/effects/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { marbles } from 'rxjs-marbles';

import { ProductDetailService } from '@cdba/detail/service/detail.service';
import {
  AUTH_STATE_MOCK,
  COMPARE_STATE_MOCK,
  REFERENCE_TYPE_IDENTIFIER_MOCK,
  REFERENCE_TYPE_MOCK,
} from '@cdba/testing/mocks';

import {
  loadAllProductDetails,
  loadProductDetails,
  loadProductDetailsFailure,
  loadProductDetailsSuccess,
} from '../../actions';
import { loadComparisonFeatureData } from '../../actions/root/compare-root.actions';
import { ProductDetailsEffects } from './product-details.effects';

describe('ProductDetailsEffects', () => {
  let spectator: SpectatorService<ProductDetailsEffects>;
  let action: any;
  let actions$: any;
  let effects: ProductDetailsEffects;
  let productDetailService: ProductDetailService;

  const error = new HttpErrorResponse({
    status: HttpStatusCode.BadRequest,
    error: { detail: 'Error Message' },
  });

  const createService = createServiceFactory({
    service: ProductDetailsEffects,
    providers: [
      mockProvider(ProductDetailService),
      provideMockActions(() => actions$),
      provideMockStore({
        initialState: {
          'azure-auth': AUTH_STATE_MOCK,
          compare: COMPARE_STATE_MOCK,
        },
      }),
      provideRouter([]),
    ],
  });

  beforeEach(() => {
    spectator = createService();
    actions$ = spectator.inject(Actions);
    effects = spectator.inject(ProductDetailsEffects);
    productDetailService = spectator.inject(ProductDetailService);
  });

  describe('loadAllProductDetails$', () => {
    it(
      'should load all product details',
      marbles((m) => {
        actions$ = m.hot('-a', { a: loadAllProductDetails() });

        const resultA = loadProductDetails({
          referenceTypeIdentifier: {
            materialNumber: '0943578620000',
            plant: '0074',
          },
          index: 0,
        });
        const resultB = loadProductDetails({
          referenceTypeIdentifier: {
            materialNumber: '0943572680000',
            plant: '0060',
          },
          index: 1,
        });
        const expected = m.cold('-(ab)', { a: resultA, b: resultB });

        m.expect(effects.loadAllProductDetails$).toBeObservable(expected);
      })
    );
  });

  describe('loadProductDetails$', () => {
    const index = 0;
    const referenceTypeIdentifier = REFERENCE_TYPE_IDENTIFIER_MOCK;

    beforeEach(() => {
      action = loadProductDetails({ index, referenceTypeIdentifier });
    });

    it(
      'should return Success Action',
      marbles((m) => {
        actions$ = m.hot('-a', { a: action });

        const response = m.cold('-a|', {
          a: REFERENCE_TYPE_MOCK,
        });
        productDetailService.getDetails = jest.fn(() => response);

        const result = loadProductDetailsSuccess({
          index,
          item: REFERENCE_TYPE_MOCK,
        });
        const expected = m.cold('--b', { b: result });

        m.expect(effects.loadProductDetails$).toBeObservable(expected);
      })
    );

    it(
      'should return Failure Action',
      marbles((m) => {
        actions$ = m.hot('-a', { a: action });

        const result = loadProductDetailsFailure({
          index,
          errorMessage: 'Error Message',
          statusCode: 400,
        });

        const response = m.cold('-#|', undefined, error);
        const expected = m.cold('--b', { b: result });

        productDetailService.getDetails = jest.fn(() => response);

        m.expect(effects.loadProductDetails$).toBeObservable(expected);
      })
    );
  });

  describe('triggerDataLoad$', () => {
    it(
      'should return loadCalculations and loadAllProductDetails action',
      marbles((m) => {
        action = loadComparisonFeatureData({
          items: [
            {
              referenceTypeIdentifier: REFERENCE_TYPE_IDENTIFIER_MOCK,
              selectedCalculationId: '1',
            },
          ],
        });

        actions$ = m.hot('-a', { a: action });

        const expected = m.cold('-b', {
          b: loadAllProductDetails(),
        });

        m.expect(effects.triggerDataLoad$).toBeObservable(expected);
      })
    );
  });
});
