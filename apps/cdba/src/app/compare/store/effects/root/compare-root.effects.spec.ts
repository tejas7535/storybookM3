import { Params, provideRouter, Router } from '@angular/router';

import { createServiceFactory, SpectatorService } from '@ngneat/spectator/jest';
import { Actions } from '@ngrx/effects';
import { provideMockActions } from '@ngrx/effects/testing';
import { ROUTER_NAVIGATED } from '@ngrx/router-store';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { marbles } from 'rxjs-marbles';

import { getCompareState } from '@cdba/core/store';
import { ReferenceTypeIdentifier } from '@cdba/shared/models';
import { ComparableItemIdentifier } from '@cdba/shared/models/comparison.model';
import { AUTH_STATE_MOCK, COMPARE_STATE_MOCK } from '@cdba/testing/mocks';
import {
  COMPARE_STATE_LOADED_BOMS_MOCK,
  COMPARE_STATE_LOADED_BOMS_NOT_COMPARISON_MOCK,
  COMPARE_STATE_LOADED_DETAILS_MOCK,
  COMPARE_STATE_SAME_MAT_DES_MOCK,
  COMPARE_STATE_UNDEFINED_BOMS_MOCK,
  COMPARE_STATE_UNDEFINED_DETAILS_MOCK,
  COMPARE_STATE_UNDEFINED_MOCK,
} from '@cdba/testing/mocks/state/compare-state.mock';

import { loadComparisonFeatureData } from '../../actions/root/compare-root.actions';
import { CompareRootEffects } from './compare-root.effects';

describe('CompareRootEffects', () => {
  let router: Router;
  let spectator: SpectatorService<CompareRootEffects>;
  let action: any;
  let actions$: any;
  let effects: CompareRootEffects;
  let store: MockStore;

  const createService = createServiceFactory({
    service: CompareRootEffects,
    providers: [
      provideMockActions(() => actions$),
      provideMockStore({
        initialState: {
          'azure-auth': AUTH_STATE_MOCK,
        },
      }),
      provideRouter([]),
    ],
  });

  beforeEach(() => {
    spectator = createService();
    actions$ = spectator.inject(Actions);
    effects = spectator.inject(CompareRootEffects);
    router = spectator.inject(Router);
    store = spectator.inject(MockStore);
  });

  describe('handleRoute$', () => {
    beforeEach(() => {
      action = undefined;
    });

    describe('general cases', () => {
      it(
        'should navigate to not-found when no comparableItems were found',
        marbles((m) => {
          store.setState(COMPARE_STATE_MOCK);
          store.refreshState();
          router.navigate = jest.fn();
          action = {
            type: ROUTER_NAVIGATED,
            payload: {
              routerState: {
                url: '/compare/',
                queryParams: {},
              },
              event: {
                id: 2,
                url: '/',
                urlAfterRedirects: '/search',
              },
            },
          };

          actions$ = m.hot('-a', { a: action });

          const expected = m.cold('-');

          m.expect(effects.handleRoute$).toBeObservable(expected);
          m.flush();
          expect(router.navigate).toHaveBeenCalledWith(['not-found']);
        })
      );

      it(
        'should return loadComparisonFeatureData Action when user accessed feature via Share function',
        marbles((m) => {
          store.overrideSelector(getCompareState, COMPARE_STATE_UNDEFINED_MOCK);
          store.refreshState();

          action = {
            type: ROUTER_NAVIGATED,
            payload: {
              routerState: {
                url: '/compare/',
                queryParams: {
                  material_number_item_1: '456789',
                  plant_item_1: '0060',
                  selected_calculation_id_item_1: '0',
                  material_number_item_2: '4123789',
                  plant_item_2: '0076',
                  selected_calculation_id_item_2: '0',
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

          const items: ComparableItemIdentifier[] = [
            {
              referenceTypeIdentifier: new ReferenceTypeIdentifier(
                '456789',
                '0060'
              ),
              selectedCalculationId: '0',
            },
            {
              referenceTypeIdentifier: new ReferenceTypeIdentifier(
                '4123789',
                '0076'
              ),
              selectedCalculationId: '0',
            },
          ];

          const result = loadComparisonFeatureData({ items });
          const expected = m.cold('-b', { b: result });

          m.expect(effects.handleRoute$).toBeObservable(expected);
        })
      );

      it(
        'should return loadComparisonFeatureData Action when user reselected reference type',
        marbles((m) => {
          store.overrideSelector(
            getCompareState,
            COMPARE_STATE_SAME_MAT_DES_MOCK
          );
          store.refreshState();

          action = {
            type: ROUTER_NAVIGATED,
            payload: {
              routerState: {
                url: '/compare/',
                queryParams: {
                  material_number_item_1: '456789',
                  plant_item_1: '0060',
                  selected_calculation_id_item_1: '0',
                  material_number_item_2: '4123789',
                  plant_item_2: '0076',
                  selected_calculation_id_item_2: '0',
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

          const items: ComparableItemIdentifier[] = [
            {
              referenceTypeIdentifier: new ReferenceTypeIdentifier(
                '456789',
                '0060'
              ),
              selectedCalculationId: '0',
            },
            {
              referenceTypeIdentifier: new ReferenceTypeIdentifier(
                '4123789',
                '0076'
              ),
              selectedCalculationId: '0',
            },
          ];

          const result = loadComparisonFeatureData({ items });
          const expected = m.cold('-b', { b: result });

          m.expect(effects.handleRoute$).toBeObservable(expected);
        })
      );

      it(
        'should return loadComparisonFeatureData Action with correct items',
        marbles((m) => {
          store.setState(COMPARE_STATE_MOCK);
          store.refreshState();

          action = {
            type: ROUTER_NAVIGATED,
            payload: {
              routerState: {
                url: '/compare/',
                queryParams: {
                  material_number_item_1: '456789',
                  plant_item_1: '0060',
                  selected_calculation_id_item_1: '0',
                  material_number_item_2: '4123789',
                  plant_item_2: '0076',
                  selected_calculation_id_item_2: '0',
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

          const items: ComparableItemIdentifier[] = [
            {
              referenceTypeIdentifier: new ReferenceTypeIdentifier(
                '456789',
                '0060'
              ),
              selectedCalculationId: '0',
            },
            {
              referenceTypeIdentifier: new ReferenceTypeIdentifier(
                '4123789',
                '0076'
              ),
              selectedCalculationId: '0',
            },
          ];

          const result = loadComparisonFeatureData({ items });
          const expected = m.cold('-b', { b: result });

          m.expect(effects.handleRoute$).toBeObservable(expected);
        })
      );

      it(
        'should abort effect',
        marbles((m) => {
          router.navigate = jest.fn();
          store.setState(COMPARE_STATE_MOCK);
          store.refreshState();

          action = {
            type: ROUTER_NAVIGATED,
            payload: {
              routerState: {
                url: '/compare/',
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

          m.expect(effects.handleRoute$).toBeObservable(expected);
          m.flush();
          expect(router.navigate).toHaveBeenCalledWith(['not-found']);
        })
      );
    });

    describe('paths', () => {
      beforeEach(() => {
        action = {
          type: ROUTER_NAVIGATED,
          payload: {
            routerState: {
              queryParams: {
                material_number_item_1: '0943578620000',
                plant_item_1: '0074',
                selected_calculation_id_item_1: '3',
                material_number_item_2: '0943572680000',
                plant_item_2: '0060',
                selected_calculation_id_item_2: '3',
              },
            },
            event: {
              id: 2,
              url: '/',
              urlAfterRedirects: '/search',
            },
          },
        };
      });
      describe('bom path', () => {
        beforeEach(() => {
          action = {
            ...action,
            payload: {
              ...action.payload,
              routerState: {
                ...action.payload.routerState,
                url: '/compare/bom',
              },
            },
          };
        });

        it(
          'should return loadComparisonFeatureData Action when boms are not loaded',
          marbles((m) => {
            store.overrideSelector(
              getCompareState,
              COMPARE_STATE_UNDEFINED_BOMS_MOCK
            );
            store.refreshState();

            actions$ = m.hot('-a', { a: action });

            const items: ComparableItemIdentifier[] = [
              {
                referenceTypeIdentifier: new ReferenceTypeIdentifier(
                  '0943578620000',
                  '0074'
                ),
                selectedCalculationId: '3',
              },
              {
                referenceTypeIdentifier: new ReferenceTypeIdentifier(
                  '0943572680000',
                  '0060'
                ),
                selectedCalculationId: '3',
              },
            ];

            const result = loadComparisonFeatureData({ items });
            const expected = m.cold('-b', { b: result });

            m.expect(effects.handleRoute$).toBeObservable(expected);
          })
        );
        it(
          'should not return loadComparisonFeatureData Action when boms are loaded',
          marbles((m) => {
            store.overrideSelector(
              getCompareState,
              COMPARE_STATE_LOADED_BOMS_MOCK
            );
            store.refreshState();

            actions$ = m.hot('-');

            const expected = m.cold('-');

            m.expect(effects.handleRoute$).toBeObservable(expected);
          })
        );
      });
      describe('details path', () => {
        beforeEach(() => {
          action = {
            ...action,
            payload: {
              ...action.payload,
              routerState: {
                ...action.payload.routerState,
                url: '/compare/details',
              },
            },
          };
        });
        it(
          'should return loadComparisonFeatureData Action when details are not loaded',
          marbles((m) => {
            store.overrideSelector(
              getCompareState,
              COMPARE_STATE_UNDEFINED_DETAILS_MOCK
            );
            store.refreshState();

            actions$ = m.hot('-a', { a: action });

            const items: ComparableItemIdentifier[] = [
              {
                referenceTypeIdentifier: new ReferenceTypeIdentifier(
                  '0943578620000',
                  '0074'
                ),
                selectedCalculationId: '3',
              },
              {
                referenceTypeIdentifier: new ReferenceTypeIdentifier(
                  '0943572680000',
                  '0060'
                ),
                selectedCalculationId: '3',
              },
            ];

            const result = loadComparisonFeatureData({ items });
            const expected = m.cold('-b', { b: result });

            m.expect(effects.handleRoute$).toBeObservable(expected);
          })
        );
        it(
          'should not return loadComparisonFeatureData Action when detail are loaded',
          marbles((m) => {
            store.overrideSelector(
              getCompareState,
              COMPARE_STATE_LOADED_DETAILS_MOCK
            );
            store.refreshState();

            actions$ = m.hot('-');

            const expected = m.cold('-');

            m.expect(effects.handleRoute$).toBeObservable(expected);
          })
        );
      });

      describe('compare path', () => {
        beforeEach(() => {
          action = {
            ...action,
            payload: {
              ...action.payload,
              routerState: {
                ...action.payload.routerState,
                url: '/compare/comparison-summary',
              },
            },
          };
        });
        it(
          'should return loadComparisonFeatureData Action when boms are loaded but comparison is not',
          marbles((m) => {
            store.overrideSelector(
              getCompareState,
              COMPARE_STATE_LOADED_BOMS_NOT_COMPARISON_MOCK
            );
            store.refreshState();

            actions$ = m.hot('-a', { a: action });

            const items: ComparableItemIdentifier[] = [
              {
                referenceTypeIdentifier: new ReferenceTypeIdentifier(
                  '0943578620000',
                  '0074'
                ),
                selectedCalculationId: '3',
              },
              {
                referenceTypeIdentifier: new ReferenceTypeIdentifier(
                  '0943572680000',
                  '0060'
                ),
                selectedCalculationId: '3',
              },
            ];

            const result = loadComparisonFeatureData({ items });
            const expected = m.cold('-b', { b: result });

            m.expect(effects.handleRoute$).toBeObservable(expected);
          })
        );
        it(
          'should not return loadComparisonFeatureData Action when boms are not loaded and comparison is loaded',
          marbles((m) => {
            store.overrideSelector(
              getCompareState,
              COMPARE_STATE_UNDEFINED_BOMS_MOCK
            );
            store.refreshState();

            actions$ = m.hot('-');

            const expected = m.cold('-');

            m.expect(effects.handleRoute$).toBeObservable(expected);
          })
        );
      });
    });
  });

  describe('mapQueryParams', () => {
    const queryParams: Params = {
      material_number_item_1: '456789',
      plant_item_1: '0060',
      selected_calculation_id_item_1: '1',
      material_number_item_2: '4123789',
      plant_item_2: '0076',
      selected_calculation_id_item_2: '2',
    };
    it('should return undefined for incomplete query params', () => {
      const incompleteQueryParams = { ...queryParams };
      delete incompleteQueryParams.material_number_item_1;

      const result = CompareRootEffects['mapQueryParams'](
        incompleteQueryParams
      );

      expect(result).toBeUndefined();
    });

    it('should return undefined for invalid number of compare items', () => {
      const invalidQueryParams = {
        material_number_item_1: '456789',
        plant_item_1: '0060',
      };

      const result = CompareRootEffects['mapQueryParams'](invalidQueryParams);

      expect(result).toBeUndefined();
    });

    it('should return list of nodeIds and referencetypeidentifiers', () => {
      const expected: ComparableItemIdentifier[] = [
        {
          referenceTypeIdentifier: new ReferenceTypeIdentifier(
            '456789',
            '0060'
          ),
          selectedCalculationId: '1',
        },
        {
          referenceTypeIdentifier: new ReferenceTypeIdentifier(
            '4123789',
            '0076'
          ),
          selectedCalculationId: '2',
        },
      ];

      const result = CompareRootEffects['mapQueryParams'](queryParams);

      expect(result).toEqual(expected);
    });
  });
});
