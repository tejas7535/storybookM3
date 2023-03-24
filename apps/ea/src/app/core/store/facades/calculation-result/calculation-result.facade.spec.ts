import { CALCULATION_RESULT_STATE_MOCK } from '@ea/testing/mocks';
import { createServiceFactory, SpectatorService } from '@ngneat/spectator';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { marbles } from 'rxjs-marbles';

import { CalculationResultFacade } from './calculation-result.facade';

describe('CalculationResult', () => {
  let spectator: SpectatorService<CalculationResultFacade>;
  let facade: CalculationResultFacade;
  let store: MockStore;

  const createService = createServiceFactory({
    service: CalculationResultFacade,
    providers: [
      provideMockStore({
        initialState: {
          calculationResult: CALCULATION_RESULT_STATE_MOCK,
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

  describe('calculationResult$', () => {
    it(
      'should provide the calculation Result',
      marbles((m) => {
        const expected = m.cold('a', {
          a: CALCULATION_RESULT_STATE_MOCK,
        });

        m.expect(facade.calculationResult$).toBeObservable(expected);
      })
    );
  });

  describe('getCalculationResultPreviewData', () => {
    it(
      'should provide the calculation Result Overlay Data',
      marbles((m) => {
        const expected = m.cold('a', {
          a: [
            {
              title: 'totalValueCO2',
              icon: 'airwave',
              values: [
                {
                  title: 'production',
                  value: CALCULATION_RESULT_STATE_MOCK.co2.upstream,
                  unit: 'kg',
                },
                {
                  title: 'operation',
                  value: CALCULATION_RESULT_STATE_MOCK.co2.downstream,
                  unit: 'kg',
                },
              ],
            },
            {
              title: 'overrollingFrequency',
              icon: 'airwave',
              values: [
                {
                  title: 'overrollingFrequencySubtitle',
                  value: CALCULATION_RESULT_STATE_MOCK.ratingLife,
                  unit: 'mm²/s',
                },
              ],
            },
          ],
        });

        m.expect(facade.getCalculationResultPreviewData$).toBeObservable(
          expected
        );
      })
    );
  });

  describe('isCalculationResultAvailable', () => {
    it(
      'should provide if the calculation result is available',
      marbles((m) => {
        const expected = m.cold('a', {
          a: CALCULATION_RESULT_STATE_MOCK.isResultAvailable,
        });

        m.expect(facade.isCalculationResultAvailable$).toBeObservable(expected);
      })
    );
  });

  describe('isCalculationImpossible', () => {
    it(
      'should provide if the calculation is impossible',
      marbles((m) => {
        const expected = m.cold('a', {
          a: CALCULATION_RESULT_STATE_MOCK.isResultAvailable,
        });

        m.expect(facade.isCalculationImpossible$).toBeObservable(expected);
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
