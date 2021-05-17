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
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { cold, hot } from 'jest-marbles';

import { DetailService } from '@cdba/detail/service/detail.service';
import { ReferenceTypeIdentifier } from '@cdba/shared/models';
import {
  BOM_IDENTIFIER_MOCK,
  BOM_MOCK,
  CALCULATIONS_MOCK,
  COMPARE_STATE_MOCK,
  REFERENCE_TYPE_IDENTIFIER_MOCK,
} from '@cdba/testing/mocks';

import {
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
  let effects: CompareEffects;
  let spectator: SpectatorService<CompareEffects>;
  let store: MockStore;
  let detailService: DetailService;
  let router: Router;

  let actions$: any;
  let action: any;

  const bomIdentifier = BOM_IDENTIFIER_MOCK;

  const createService = createServiceFactory({
    service: CompareEffects,
    imports: [RouterTestingModule],
    providers: [
      mockProvider(DetailService),
      provideMockStore({ initialState: { compare: COMPARE_STATE_MOCK } }),
      provideMockActions(() => actions$),
    ],
  });

  beforeEach(() => {
    spectator = createService();
    effects = spectator.service;

    actions$ = spectator.inject(Actions);
    store = spectator.inject(MockStore);
    detailService = spectator.inject(DetailService);
    router = spectator.inject(Router);
  });

  describe('selectCompareItems$', () => {
    test('should return selectCompareItems Action', () => {
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

      actions$ = hot('-a', { a: action });

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
      const expected = cold('-b', { b: result });

      expect(effects.selectCompareItems$).toBeObservable(expected);
    });

    test('should abort effect', () => {
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

      actions$ = hot('-a', { a: action });

      const expected = cold('---');

      expect(effects.selectCompareItems$).toBeObservable(expected);
      expect(effects.selectCompareItems$).toSatisfyOnFlush(() => {
        expect(router.navigate).toHaveBeenCalledWith(['not-found']);
      });
    });
  });

  describe('loadCalculations', () => {
    test('should map to loadCalculationHistory Actions', () => {
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
      const expected = cold('-(bc)', {
        b: expectedAction1,
        c: expectedAction2,
      });

      actions$ = hot('-a', { a: action });
      expect(effects.loadCalculations$).toBeObservable(expected);
    });
  });

  describe('loadCalculationHistory$', () => {
    const index = 0;
    const materialNumber = '12434';
    const plant = '0061';
    const errorMessage = 'Bad stuff going on';

    beforeEach(() => {
      action = loadCalculationHistory({ index, materialNumber, plant });
    });

    test('should return Success Action', () => {
      actions$ = hot('-a', { a: action });

      const items = CALCULATIONS_MOCK;

      const response = cold('-a|', {
        a: items,
      });
      detailService.calculations = jest.fn(() => response);

      const result = loadCalculationHistorySuccess({ index, items });
      const expected = cold('--b', { b: result });

      expect(effects.loadCalculationHistory$).toBeObservable(expected);
    });

    test('should return Failure Action', () => {
      actions$ = hot('-a', { a: action });

      const result = loadCalculationHistoryFailure({ index, errorMessage });

      const response = cold('-#|', undefined, errorMessage);
      const expected = cold('--b', { b: result });

      detailService.calculations = jest.fn(() => response);

      expect(effects.loadCalculationHistory$).toBeObservable(expected);
    });
  });

  describe('loadBillOfMaterial$', () => {
    const index = 0;
    const errorMessage = 'Bad stuff going on';

    beforeEach(() => {
      action = loadBom({ index, bomIdentifier });
    });

    test('should return Success Action', () => {
      actions$ = hot('-a', { a: action });

      const items = BOM_MOCK;

      const response = cold('-a|', {
        a: items,
      });
      detailService.getBom = jest.fn(() => response);

      const result = loadBomSuccess({ index, items });
      const expected = cold('--b', { b: result });

      expect(effects.loadBillOfMaterial$).toBeObservable(expected);
    });

    test('should return Failure Action', () => {
      actions$ = hot('-a', { a: action });

      const result = loadBomFailure({ index, errorMessage });

      const response = cold('-#|', undefined, errorMessage);
      const expected = cold('--b', { b: result });

      detailService.getBom = jest.fn(() => response);

      expect(effects.loadBillOfMaterial$).toBeObservable(expected);
    });
  });

  describe('triggerBomLoad$', () => {
    const index = 1;
    const result = loadBom({ index, bomIdentifier });

    beforeEach(() =>
      store.overrideSelector(
        getBomIdentifierForSelectedCalculation,
        bomIdentifier
      )
    );

    test('should return loadBom Action when a new calculation was selected', () => {
      action = selectCalculation({
        index,
        nodeId: '5',
        calculation: CALCULATIONS_MOCK[0],
      });

      actions$ = hot('-a', { a: action });

      const expected = cold('-b', { b: result });

      expect(effects.triggerBomLoad$).toBeObservable(expected);
    });

    test('should return loadBom Action when calculation were loaded successfully', () => {
      action = loadCalculationHistorySuccess({
        index,
        items: CALCULATIONS_MOCK,
      });

      actions$ = hot('-a', { a: action });

      const expected = cold('-b', { b: result });

      expect(effects.triggerBomLoad$).toBeObservable(expected);
    });
  });

  describe('triggerDataLoad$', () => {
    test('should return loadCalculations action', () => {
      action = selectCompareItems({
        items: [['1', REFERENCE_TYPE_IDENTIFIER_MOCK]],
      });

      actions$ = hot('-a', { a: action });

      const expected = cold('-(b)', {
        b: loadCalculations(),
      });

      expect(effects.triggerDataLoad$).toBeObservable(expected);
    });
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
