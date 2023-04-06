import { PRODUCT_SELECTION_STATE_MOCK } from '@ea/testing/mocks';
import { createServiceFactory, SpectatorService } from '@ngneat/spectator';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { marbles } from 'rxjs-marbles';

import { ProductSelectionFacade } from './product-selection.facade';

describe('CalculationResult', () => {
  let spectator: SpectatorService<ProductSelectionFacade>;
  let facade: ProductSelectionFacade;
  let store: MockStore;

  const createService = createServiceFactory({
    service: ProductSelectionFacade,
    providers: [
      provideMockStore({
        initialState: {
          productSelection: PRODUCT_SELECTION_STATE_MOCK,
        },
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

  describe('bearingDesignation$', () => {
    it(
      'should provide the current bearing designation',
      marbles((m) => {
        const expected = m.cold('a', {
          a: PRODUCT_SELECTION_STATE_MOCK.bearingDesignation,
        });

        m.expect(facade.bearingDesignation$).toBeObservable(expected);
      })
    );
  });

  describe('bearingId$', () => {
    it(
      'should provide the current bearing id',
      marbles((m) => {
        const expected = m.cold('a', {
          a: PRODUCT_SELECTION_STATE_MOCK.bearingId,
        });

        m.expect(facade.bearingId$).toBeObservable(expected);
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
