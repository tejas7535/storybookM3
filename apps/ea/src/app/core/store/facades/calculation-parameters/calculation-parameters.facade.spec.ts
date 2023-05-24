import { CALCULATION_PARAMETERS_STATE_MOCK } from '@ea/testing/mocks';
import { createServiceFactory, SpectatorService } from '@ngneat/spectator';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { marbles } from 'rxjs-marbles';

import { CalculationParametersFacade } from './calculation-parameters.facade';

describe('CalculationParametersFacade', () => {
  let spectator: SpectatorService<CalculationParametersFacade>;
  let facade: CalculationParametersFacade;
  let store: MockStore;

  const createService = createServiceFactory({
    service: CalculationParametersFacade,
    providers: [
      provideMockStore({
        initialState: {
          calculationParameters: CALCULATION_PARAMETERS_STATE_MOCK,
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

  describe('operationConditions$', () => {
    it(
      'should provide the operation conditions',
      marbles((m) => {
        const expected = m.cold('a', {
          a: CALCULATION_PARAMETERS_STATE_MOCK.operationConditions,
        });

        m.expect(facade.operationConditions$).toBeObservable(expected);
      })
    );
  });

  describe('isCalculationMissingInput$', () => {
    it(
      'should provide if calculation is missing input',
      marbles((m) => {
        const expected = m.cold('a', {
          a: CALCULATION_PARAMETERS_STATE_MOCK.isInputInvalid,
        });

        m.expect(facade.isCalculationMissingInput$).toBeObservable(expected);
      })
    );
  });

  describe('energySource$', () => {
    it(
      'should provide the energy source',
      marbles((m) => {
        const expected = m.cold('a', {
          a: CALCULATION_PARAMETERS_STATE_MOCK.energySource,
        });

        m.expect(facade.energySource$).toBeObservable(expected);
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
