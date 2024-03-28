import { HttpErrorResponse, HttpStatusCode } from '@angular/common/http';
import { Params, Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';

import {
  createServiceFactory,
  mockProvider,
  SpectatorService,
} from '@ngneat/spectator/jest';
import { Actions } from '@ngrx/effects';
import { provideMockActions } from '@ngrx/effects/testing';
import { ROUTER_NAVIGATED } from '@ngrx/router-store';
import { provideMockStore } from '@ngrx/store/testing';
import { marbles } from 'rxjs-marbles';

import { ProductDetailService } from '@cdba/detail/service/detail.service';
import { ReferenceTypeIdentifier } from '@cdba/shared/models';
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
  selectCompareItems,
} from '../actions';
import { ProductDetailsEffects } from './product-details.effects';

describe('ProductDetailsEffects', () => {
  let spectator: SpectatorService<ProductDetailsEffects>;
  let action: any;
  let actions$: any;
  let effects: ProductDetailsEffects;
  let productDetailService: ProductDetailService;
  let router: Router;

  const error = new HttpErrorResponse({
    status: HttpStatusCode.BadRequest,
    error: { detail: 'Error Message' },
  });

  const createService = createServiceFactory({
    service: ProductDetailsEffects,
    imports: [RouterTestingModule],
    providers: [
      mockProvider(ProductDetailService),
      provideMockActions(() => actions$),
      provideMockStore({
        initialState: {
          'azure-auth': AUTH_STATE_MOCK,
          compare: COMPARE_STATE_MOCK,
        },
      }),
    ],
  });

  beforeEach(() => {
    spectator = createService();
    actions$ = spectator.inject(Actions);
    effects = spectator.inject(ProductDetailsEffects);
    productDetailService = spectator.inject(ProductDetailService);
    router = spectator.inject(Router);
  });

  describe('selectCompareItems$', () => {
    test(
      'should return selectCompareItems Action',
      marbles((m) => {
        action = {
          type: ROUTER_NAVIGATED,
          payload: {
            routerState: {
              url: '/compare/bom',
              queryParams: {
                material_number_item_1: '456789',
                plant_item_1: '0060',
                material_number_item_2: '4123789',
                plant_item_2: '0076',
              },
            },
            event: {
              id: 2,
              url: '/',
              urlAfterRedirects: '/search',
            },
          },
        };

        actions$ = m.hot('-a', { a: action });

        const items: [
          nodeId: string,
          referenceTypeIdentifier: ReferenceTypeIdentifier,
        ][] = [
          [undefined, new ReferenceTypeIdentifier('456789', '0060')],
          [undefined, new ReferenceTypeIdentifier('4123789', '0076')],
        ];

        const result = selectCompareItems({ items });
        const expected = m.cold('-b', { b: result });

        m.expect(effects.selectCompareItems$).toBeObservable(expected);
      })
    );

    test(
      'should abort effect',
      marbles((m) => {
        router.navigate = jest.fn();

        action = {
          type: ROUTER_NAVIGATED,
          payload: {
            routerState: {
              url: '/compare/bom',
              queryParams: {
                plant_item_1: '0060',
                material_number_item_2: '4123789',
                plant_item_2: '0076',
              },
            },
            event: {
              id: 2,
              url: '/',
              urlAfterRedirects: '/search',
            },
          },
        };

        actions$ = m.hot('-a', { a: action });

        const expected = m.cold('---');

        m.expect(effects.selectCompareItems$).toBeObservable(expected);
        m.flush();
        expect(router.navigate).toHaveBeenCalledWith(['not-found']);
      })
    );
  });

  describe('triggerDataLoad$', () => {
    test(
      'should return loadCalculations and loadAllProductDetails action',
      marbles((m) => {
        action = selectCompareItems({
          items: [['1', REFERENCE_TYPE_IDENTIFIER_MOCK]],
        });

        actions$ = m.hot('-a', { a: action });

        const expected = m.cold('-b', {
          b: loadAllProductDetails(),
        });

        m.expect(effects.triggerDataLoad$).toBeObservable(expected);
      })
    );
  });

  describe('loadProductDetails$', () => {
    const index = 0;
    const referenceTypeIdentifier = REFERENCE_TYPE_IDENTIFIER_MOCK;

    beforeEach(() => {
      action = loadProductDetails({ index, referenceTypeIdentifier });
    });

    test(
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

    test(
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

  describe('mapQueryParams', () => {
    const queryParams: Params = {
      material_number_item_1: '456789',
      plant_item_1: '0060',
      node_id_item_1: '1',
      material_number_item_2: '4123789',
      plant_item_2: '0076',
      node_id_item_2: '2',
    };
    test('should return undefined for incomplete query params', () => {
      const incompleteQueryParams = { ...queryParams };
      delete incompleteQueryParams.material_number_item_1;

      const result = ProductDetailsEffects['mapQueryParams'](
        incompleteQueryParams
      );

      expect(result).toBeUndefined();
    });

    test('should return undefined for invalid number of compare items', () => {
      const invalidQueryParams = {
        material_number_item_1: '456789',
        plant_item_1: '0060',
      };

      const result =
        ProductDetailsEffects['mapQueryParams'](invalidQueryParams);

      expect(result).toBeUndefined();
    });

    test('should return list of nodeIds and referencetypeidentifiers', () => {
      const expected = [
        ['1', new ReferenceTypeIdentifier('456789', '0060')],
        ['2', new ReferenceTypeIdentifier('4123789', '0076')],
      ];
      const result = ProductDetailsEffects['mapQueryParams'](queryParams);

      expect(result).toEqual(expected);
    });
  });
});
