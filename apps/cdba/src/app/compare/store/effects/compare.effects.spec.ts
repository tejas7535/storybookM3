import { HttpErrorResponse, HttpStatusCode } from '@angular/common/http';
import { Params, Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';

import { CalculationsResponse } from '@cdba/core/store/reducers/detail/models/index';
import { DetailService } from '@cdba/detail/service/detail.service';
import { ReferenceTypeIdentifier } from '@cdba/shared/models';
import {
  AUTH_STATE_MOCK,
  BOM_IDENTIFIER_MOCK,
  BOM_MOCK,
  CALCULATIONS_MOCK,
  COMPARE_STATE_MOCK,
  EXCLUDED_CALCULATIONS_MOCK,
  REFERENCE_TYPE_IDENTIFIER_MOCK,
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
  loadAllProductDetails,
  loadBom,
  loadBomFailure,
  loadBomSuccess,
  loadCalculationHistory,
  loadCalculationHistoryFailure,
  loadCalculationHistorySuccess,
  loadCalculations,
  selectCalculation,
  selectCompareItems,
} from '../actions/compare.actions';
import {
  getBomIdentifierForSelectedCalculation,
  getSelectedReferenceTypeIdentifiers,
} from '../selectors/compare.selectors';
import { CompareEffects } from './compare.effects';

describe('CompareEffects', () => {
  let spectator: SpectatorService<CompareEffects>;
  let action: any;
  let actions$: any;
  let effects: CompareEffects;
  let detailService: DetailService;
  let store: any;
  let router: Router;

  const error = new HttpErrorResponse({
    status: HttpStatusCode.BadRequest,
    error: { detail: 'Error Message' },
  });
  const bomIdentifier = BOM_IDENTIFIER_MOCK;

  const createService = createServiceFactory({
    service: CompareEffects,
    imports: [RouterTestingModule],
    providers: [
      mockProvider(DetailService),
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
    effects = spectator.inject(CompareEffects);
    detailService = spectator.inject(DetailService);
    store = spectator.inject(MockStore);
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
                identification_hash_item_1: 'identifier',
                material_number_item_2: '4123789',
                plant_item_2: '0076',
                identification_hash_item_2: 'identifier 2',
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
          referenceTypeIdentifier: ReferenceTypeIdentifier
        ][] = [
          [
            undefined,
            new ReferenceTypeIdentifier('456789', '0060', 'identifier'),
          ],
          [
            undefined,
            new ReferenceTypeIdentifier('4123789', '0076', 'identifier 2'),
          ],
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

  describe('loadCalculations', () => {
    test(
      'should map to loadCalculationHistory Actions',
      marbles((m) => {
        action = loadCalculations();

        const referenceTypeIdentifiers = [
          new ReferenceTypeIdentifier('456789', '0060', 'identifier'),
          new ReferenceTypeIdentifier('4123789', '0076', 'identifier 2'),
        ];
        store.overrideSelector(
          getSelectedReferenceTypeIdentifiers,
          referenceTypeIdentifiers
        );

        const expectedAction1 = loadCalculationHistory({
          index: 0,
          materialNumber: '456789',
          plant: '0060',
        });
        const expectedAction2 = loadCalculationHistory({
          index: 1,
          materialNumber: '4123789',
          plant: '0076',
        });
        const expected = m.cold('-(bc)', {
          b: expectedAction1,
          c: expectedAction2,
        });

        actions$ = m.hot('-a', { a: action });
        m.expect(effects.loadCalculations$).toBeObservable(expected);
      })
    );
  });

  describe('loadCalculationHistory$', () => {
    const index = 0;
    const materialNumber = '12434';
    const plant = '0061';

    beforeEach(() => {
      action = loadCalculationHistory({ index, materialNumber, plant });
    });

    test(
      'should return Success Action',
      marbles((m) => {
        actions$ = m.hot('-a', { a: action });

        const items = CALCULATIONS_MOCK;
        const excludedItems = EXCLUDED_CALCULATIONS_MOCK;

        const response = m.cold('-a|', {
          a: new CalculationsResponse(items, excludedItems),
        });
        detailService.getCalculations = jest.fn(() => response);

        const result = loadCalculationHistorySuccess({
          index,
          plant,
          items,
          excludedItems,
        });
        const expected = m.cold('--b', { b: result });

        m.expect(effects.loadCalculationHistory$).toBeObservable(expected);
      })
    );

    test(
      'should return Failure Action',
      marbles((m) => {
        actions$ = m.hot('-a', { a: action });

        const result = loadCalculationHistoryFailure({
          index,
          errorMessage: 'Error Message',
          statusCode: 400,
        });

        const response = m.cold('-#|', undefined, error);
        const expected = m.cold('--b', { b: result });

        detailService.getCalculations = jest.fn(() => response);

        m.expect(effects.loadCalculationHistory$).toBeObservable(expected);
      })
    );
  });

  describe('loadBillOfMaterial$', () => {
    const index = 0;

    beforeEach(() => {
      action = loadBom({ index, bomIdentifier });
    });

    test(
      'should return Success Action',
      marbles((m) => {
        actions$ = m.hot('-a', { a: action });

        const items = BOM_MOCK;

        const response = m.cold('-a|', {
          a: items,
        });
        detailService.getBom = jest.fn(() => response);

        const result = loadBomSuccess({ index, items });
        const expected = m.cold('--b', { b: result });

        m.expect(effects.loadBillOfMaterial$).toBeObservable(expected);
      })
    );

    test(
      'should return Failure Action',
      marbles((m) => {
        actions$ = m.hot('-a', { a: action });

        const result = loadBomFailure({
          index,
          errorMessage: 'Error Message',
          statusCode: 400,
        });

        const response = m.cold('-#|', undefined, error);
        const expected = m.cold('--b', { b: result });

        detailService.getBom = jest.fn(() => response);

        m.expect(effects.loadBillOfMaterial$).toBeObservable(expected);
      })
    );
  });

  describe('triggerBomLoad$', () => {
    const index = 1;
    const plant = '0061';
    const result = loadBom({ index, bomIdentifier });

    beforeEach(() =>
      store.overrideSelector(
        getBomIdentifierForSelectedCalculation,
        bomIdentifier
      )
    );

    test(
      'should return loadBom Action when a new calculation was selected',
      marbles((m) => {
        action = selectCalculation({
          index,
          nodeId: '5',
          calculation: CALCULATIONS_MOCK[0],
        });

        actions$ = m.hot('-a', { a: action });

        const expected = m.cold('-b', { b: result });

        m.expect(effects.triggerBomLoad$).toBeObservable(expected);
      })
    );

    test(
      'should return loadBom Action when calculation were loaded successfully',
      marbles((m) => {
        action = loadCalculationHistorySuccess({
          index,
          plant,
          items: CALCULATIONS_MOCK,
          excludedItems: EXCLUDED_CALCULATIONS_MOCK,
        });

        actions$ = m.hot('-a', { a: action });

        const expected = m.cold('-b', { b: result });

        m.expect(effects.triggerBomLoad$).toBeObservable(expected);
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

        const expected = m.cold('-(bc)', {
          b: loadCalculations(),
          c: loadAllProductDetails(),
        });

        m.expect(effects.triggerDataLoad$).toBeObservable(expected);
      })
    );
  });

  describe('check roles and rights', () => {
    const stateWithoutRoles: any = {
      'azure-auth': {
        ...AUTH_STATE_MOCK,
        accountInfo: {
          ...AUTH_STATE_MOCK.accountInfo,
          idTokenClaims: {
            roles: [],
          },
        },
      },
    };

    beforeEach(() => {
      store.setState(stateWithoutRoles);
    });

    test(
      'before loading calculations',
      marbles((m) => {
        const actionPayloadMock = {
          index: 3,
          materialNumber: 'abc',
          plant: 'def',
        };
        action = loadCalculationHistory(actionPayloadMock);

        actions$ = m.hot('-a', { a: action });

        const result = loadCalculationHistoryFailure({
          statusCode: undefined,
          errorMessage: 'User has no valid cost roles.',
          index: actionPayloadMock.index,
        });
        const expected = m.cold('-b', { b: result });

        m.expect(effects.loadCalculationHistory$).toBeObservable(expected);
        m.flush();
      })
    );

    test(
      'before loading bom',
      marbles((m) => {
        const actionPayloadMock = {
          index: 3,
          bomIdentifier: BOM_IDENTIFIER_MOCK,
        };
        action = loadBom(actionPayloadMock);

        actions$ = m.hot('-a', { a: action });

        const result = loadBomFailure({
          statusCode: undefined,
          errorMessage: 'User has no valid cost roles.',
          index: actionPayloadMock.index,
        });
        const expected = m.cold('-b', { b: result });

        m.expect(effects.loadBillOfMaterial$).toBeObservable(expected);
        m.flush();
      })
    );
  });

  describe('mapQueryParams', () => {
    const queryParams: Params = {
      material_number_item_1: '456789',
      plant_item_1: '0060',
      identification_hash_item_1: 'identifier',
      node_id_item_1: '1',
      material_number_item_2: '4123789',
      plant_item_2: '0076',
      identification_hash_item_2: 'identifier 2',
      node_id_item_2: '2',
    };
    test('should return undefined for incomplete query params', () => {
      const incompleteQueryParams = { ...queryParams };
      delete incompleteQueryParams.material_number_item_1;

      const result = CompareEffects['mapQueryParams'](incompleteQueryParams);

      expect(result).toBeUndefined();
    });

    test('should return undefined for invalid number of compare items', () => {
      const invalidQueryParams = {
        material_number_item_1: '456789',
        plant_item_1: '0060',
        identification_hash_item_1: 'identifier',
      };

      const result = CompareEffects['mapQueryParams'](invalidQueryParams);

      expect(result).toBeUndefined();
    });

    test('should return list of nodeIds and referencetypeidentifiers', () => {
      const expected = [
        ['1', new ReferenceTypeIdentifier('456789', '0060', 'identifier')],
        ['2', new ReferenceTypeIdentifier('4123789', '0076', 'identifier 2')],
      ];
      const result = CompareEffects['mapQueryParams'](queryParams);

      expect(result).toEqual(expected);
    });
  });
});
