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

import { ReferenceTypeIdentifier } from '@cdba/core/store/reducers/detail/models';
import { DetailService } from '@cdba/detail/service/detail.service';
import {
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
  selectReferenceTypes,
} from '../actions/compare.actions';
import { getSelectedReferenceTypeIdentifiers } from '../selectors/compare.selectors';
import { CompareEffects } from './compare.effects';

describe('CompareEffects', () => {
  let effects: CompareEffects;
  let spectator: SpectatorService<CompareEffects>;
  let store: MockStore;
  let detailService: DetailService;

  let actions$: any;
  let action: any;

  //  const _mockState = COMPARE_STATE_MOCK;

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
  });

  describe('selectReferenceTypes$', () => {
    test('should return selectReferenceTypes Action', () => {
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

      const referenceTypeIdentifiers = [
        new ReferenceTypeIdentifier('456789', '0060', 'identifier'),
        new ReferenceTypeIdentifier('4123789', '0076', 'identifier 2'),
      ];

      const result = selectReferenceTypes({ referenceTypeIdentifiers });
      const expected = cold('-b', { b: result });

      expect(effects.selectReferenceTypes$).toBeObservable(expected);
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
      });
      const expectedAction2 = loadCalculationHistory({
        index: 1,
        materialNumber: '4123789',
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
    const error = new Error('Bad stuff going on');

    beforeEach(() => {
      action = loadCalculationHistory({ index, materialNumber });
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

      const result = loadCalculationHistoryFailure({ index, error });

      const response = cold('-#|', undefined, error);
      const expected = cold('--b', { b: result });

      detailService.calculations = jest.fn(() => response);

      expect(effects.loadCalculationHistory$).toBeObservable(expected);
    });
  });

  describe('loadBillOfMaterial$', () => {
    const index = 0;
    const error = new Error('Bad stuff going on');

    beforeEach(() => {
      action = loadBom({ index });
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

      const result = loadBomFailure({ index, error });

      const response = cold('-#|', undefined, error);
      const expected = cold('--b', { b: result });

      detailService.getBom = jest.fn(() => response);

      expect(effects.loadBillOfMaterial$).toBeObservable(expected);
    });
  });

  describe('triggerBomLoad$', () => {
    const index = 1;
    const result = loadBom({ index });

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
      action = selectReferenceTypes({
        referenceTypeIdentifiers: [REFERENCE_TYPE_IDENTIFIER_MOCK],
      });

      actions$ = hot('-a', { a: action });

      const expected = cold('-(b)', {
        b: loadCalculations(),
      });

      expect(effects.triggerDataLoad$).toBeObservable(expected);
    });
  });
});
