import {
  APP_STATE_MOCK,
  FRICTION_CALCULATION_RESULT_STATE_MOCK,
} from '@ea/testing/mocks';
import { createServiceFactory, SpectatorService } from '@ngneat/spectator';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { marbles } from 'rxjs-marbles';

import { FrictionCalculationResultFacade } from './friction-calculation-result.facade';

describe('FrictionCalculationResultFacade', () => {
  let spectator: SpectatorService<FrictionCalculationResultFacade>;
  let facade: FrictionCalculationResultFacade;
  let store: MockStore;

  const createService = createServiceFactory({
    service: FrictionCalculationResultFacade,
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

  describe('isCalculationImpossible', () => {
    it(
      'should provide if the calculation is impossible',
      marbles((m) => {
        const expected = m.cold('a', {
          a: FRICTION_CALCULATION_RESULT_STATE_MOCK.isCalculationImpossible,
        });

        m.expect(facade.isCalculationImpossible$).toBeObservable(expected);
      })
    );
  });

  describe('isLoading', () => {
    it(
      'should provide if the calculation result is loading',
      marbles((m) => {
        const expected = m.cold('a', {
          a: FRICTION_CALCULATION_RESULT_STATE_MOCK.isLoading,
        });

        m.expect(facade.isLoading$).toBeObservable(expected);
      })
    );
  });

  describe('modelId$', () => {
    it(
      'should provide the current modelId',
      marbles((m) => {
        const expected = m.cold('a', {
          a: FRICTION_CALCULATION_RESULT_STATE_MOCK.modelId,
        });

        m.expect(facade.modelId$).toBeObservable(expected);
      })
    );
  });

  describe('calculationId$', () => {
    it(
      'should provide the current calculationId',
      marbles((m) => {
        const expected = m.cold('a', {
          a: FRICTION_CALCULATION_RESULT_STATE_MOCK.calculationId,
        });

        m.expect(facade.calculationId$).toBeObservable(expected);
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
