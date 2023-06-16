import {
  APP_STATE_MOCK,
  CATALOG_CALCULATION_RESULT_STATE_MOCK,
} from '@ea/testing/mocks';
import { createServiceFactory, SpectatorService } from '@ngneat/spectator/jest';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { marbles } from 'rxjs-marbles';

import { CatalogCalculationResultFacade } from './catalog-calculation-result.facade';

describe('CatalogCalculationResultFacade', () => {
  let spectator: SpectatorService<CatalogCalculationResultFacade>;
  let facade: CatalogCalculationResultFacade;
  let store: MockStore;

  const createService = createServiceFactory({
    service: CatalogCalculationResultFacade,
    providers: [
      provideMockStore({
        initialState: { ...APP_STATE_MOCK },
      }),
    ],
  });

  beforeEach(() => {
    spectator = createService();
    facade = spectator.service;

    store = spectator.inject(MockStore);
  });

  it('should be created', () => {
    expect(spectator.service).toBeDefined();
  });

  describe('basicFrequencies', () => {
    it(
      'should provide basic frequencies',
      marbles((m) => {
        const expected = m.cold('a', {
          a: CATALOG_CALCULATION_RESULT_STATE_MOCK.result,
        });

        m.expect(facade.basicFrequencies$).toBeObservable(expected);
      })
    );
  });

  describe('isLoading', () => {
    it(
      'should provide if the calculation result is loading',
      marbles((m) => {
        const expected = m.cold('a', {
          a: CATALOG_CALCULATION_RESULT_STATE_MOCK.isLoading,
        });

        m.expect(facade.isLoading$).toBeObservable(expected);
      })
    );
  });

  describe('dispatch', () => {
    it('should dispatch each action', () => {
      store.dispatch = jest.fn();
      facade.dispatch({ type: 'mock action' });

      expect(store.dispatch).toHaveBeenCalledWith({ type: 'mock action' });
    });
  });
});
