import { HttpErrorResponse, HttpStatusCode } from '@angular/common/http';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';

import { DetailService } from '@cdba/detail/service/detail.service';
import { ReferenceTypeIdentifier } from '@cdba/shared/models';
import {
  AUTH_STATE_MOCK,
  REFERENCE_TYPE_IDENTIFIER_MOCK,
  REFERENCE_TYPE_MOCK,
} from '@cdba/testing/mocks';
import {
  createServiceFactory,
  mockProvider,
  SpectatorService,
} from '@ngneat/spectator/jest';
import { Actions } from '@ngrx/effects';
import { provideMockActions } from '@ngrx/effects/testing';
import { ROUTER_NAVIGATED } from '@ngrx/router-store';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { marbles } from 'rxjs-marbles';

import {
  loadReferenceType,
  loadReferenceTypeFailure,
  loadReferenceTypeSuccess,
  selectReferenceType,
} from '../../actions';
import { getSelectedReferenceTypeIdentifier } from '../../selectors';
import { ProductDetailsEffects } from './product-details.effects';

describe('Product Details Effects', () => {
  let spectator: SpectatorService<ProductDetailsEffects>;
  let action: any;
  let actions$: any;
  let effects: ProductDetailsEffects;
  let detailService: DetailService;
  let store: MockStore;
  let router: Router;

  const error = new HttpErrorResponse({
    status: HttpStatusCode.BadRequest,
    error: { detail: 'Error Message' },
  });

  const createService = createServiceFactory({
    service: ProductDetailsEffects,
    imports: [RouterTestingModule],
    providers: [
      mockProvider(DetailService),
      provideMockActions(() => actions$),
      provideMockStore({
        initialState: {
          'azure-auth': AUTH_STATE_MOCK,
        },
      }),
    ],
  });

  beforeEach(() => {
    spectator = createService();
    actions$ = spectator.inject(Actions);
    effects = spectator.inject(ProductDetailsEffects);
    detailService = spectator.inject(DetailService);
    store = spectator.inject(MockStore);
    router = spectator.inject(Router);
  });

  describe('loadReferenceType$', () => {
    beforeEach(() => {
      action = loadReferenceType();

      store.overrideSelector(
        getSelectedReferenceTypeIdentifier,
        REFERENCE_TYPE_IDENTIFIER_MOCK
      );
    });

    test(
      'should return Success Action',
      marbles((m) => {
        actions$ = m.hot('-a', { a: action });

        const referenceType = REFERENCE_TYPE_MOCK;

        const response = m.cold('-a|', {
          a: referenceType,
        });
        detailService.getDetails = jest.fn(() => response);

        const result = loadReferenceTypeSuccess({ referenceType });
        const expected = m.cold('--b', { b: result });

        m.expect(effects.loadReferenceType$).toBeObservable(expected);
        m.flush();

        expect(detailService.getDetails).toHaveBeenCalled();
      })
    );

    test(
      'should return Failure Action',
      marbles((m) => {
        actions$ = m.hot('-a', { a: action });

        const result = loadReferenceTypeFailure({
          errorMessage: 'Error Message',
          statusCode: 400,
        });

        const response = m.cold('-#|', undefined, error);
        const expected = m.cold('--b', { b: result });

        detailService.getDetails = jest.fn(() => response);

        m.expect(effects.loadReferenceType$).toBeObservable(expected);
        m.flush();
        expect(detailService.getDetails).toHaveBeenCalled();
      })
    );
  });

  describe('triggerDataLoad$', () => {
    test(
      'should return loadRefType Action',
      marbles((m) => {
        action = selectReferenceType({
          referenceTypeIdentifier: REFERENCE_TYPE_IDENTIFIER_MOCK,
        });

        actions$ = m.hot('-a', { a: action });

        const expected = m.cold('-b', {
          b: loadReferenceType(),
        });

        m.expect(effects.triggerDataLoad$).toBeObservable(expected);
      })
    );
  });

  describe('selectReferenceType$', () => {
    beforeEach(() => {
      store.overrideSelector(
        getSelectedReferenceTypeIdentifier,
        REFERENCE_TYPE_IDENTIFIER_MOCK
      );
    });

    test(
      'should return select referenceTypeAction',
      marbles((m) => {
        action = {
          type: ROUTER_NAVIGATED,
          payload: {
            routerState: {
              url: '/detail/details',
              queryParams: {
                material_number: '456789',
                plant: '0060',
              },
            },
          },
        };

        actions$ = m.hot('-a', { a: action });

        const referenceTypeIdentifier = new ReferenceTypeIdentifier(
          '456789',
          '0060'
        );

        const result = selectReferenceType({ referenceTypeIdentifier });
        const expected = m.cold('-b', { b: result });

        m.expect(effects.selectReferenceType$).toBeObservable(expected);
      })
    );

    test(
      'should navigate to not-found if URL is not valid',
      marbles((m) => {
        router.navigate = jest.fn();
        action = {
          type: ROUTER_NAVIGATED,
          payload: {
            routerState: {
              url: '/detail/details',
              queryParams: {
                material_number: '456789',
              },
            },
          },
        };

        actions$ = m.hot('-a', { a: action });
        const expected = m.cold('---');

        m.expect(effects.selectReferenceType$).toBeObservable(expected);
        m.flush();
        expect(router.navigate).toHaveBeenCalledWith(['not-found']);
      })
    );
  });

  describe('ProductDetailsEffects.mapQueryParamsToIdentifier', () => {
    let queryParams;

    test('should return undefined, if mandatory params are missing', () => {
      queryParams = { material_number: '23', rfq: '2341' };

      expect(
        ProductDetailsEffects['mapQueryParamsToIdentifier'](queryParams)
      ).toBeUndefined();
    });

    test('should return RefTypeIdentifier', () => {
      queryParams = {
        material_number: '23',
        plant: '0060',
      };

      expect(
        ProductDetailsEffects['mapQueryParamsToIdentifier'](queryParams)
      ).toEqual({
        materialNumber: '23',
        plant: '0060',
      });
    });
  });

  describe('ProductDetailsEffects.checkEqualityOfIdentifier', () => {
    let fromRoute;
    let current;
    let result;

    beforeEach(() => {
      fromRoute = undefined;
      current = undefined;
      result = undefined;
    });

    test('should return false, if current value is undefined', () => {
      fromRoute = REFERENCE_TYPE_IDENTIFIER_MOCK;
      current = undefined;

      result = ProductDetailsEffects['checkEqualityOfIdentifier'](
        fromRoute,
        current
      );

      expect(result).toBeFalsy();
    });

    test('should return false, if one value differs', () => {
      fromRoute = REFERENCE_TYPE_IDENTIFIER_MOCK;
      current = {
        ...REFERENCE_TYPE_IDENTIFIER_MOCK,
        plant: 'other plant',
      };

      result = ProductDetailsEffects['checkEqualityOfIdentifier'](
        fromRoute,
        current
      );

      expect(result).toBeFalsy();
    });
  });
});
