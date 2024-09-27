import { createServiceFactory, SpectatorService } from '@ngneat/spectator/jest';
import { MockStore, provideMockStore } from '@ngrx/store/testing';

import { APP_STATE_MOCK } from '../../../../../testing/mocks/store/app-state.mock';
import { CalculationParameters } from '../../models/calculation-parameters-state.model';
import { CalculationParametersFacade } from './calculation-parameters.facade';

describe('CalculationParametersFacade', () => {
  let spectator: SpectatorService<CalculationParametersFacade>;
  let facade: CalculationParametersFacade;
  let store: MockStore;

  const createService = createServiceFactory({
    service: CalculationParametersFacade,
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

  describe('when setting calculation parameters', () => {
    it('should perform set calculation parameters action', () => {
      store.dispatch = jest.fn();
      const params: CalculationParameters =
        {} as Partial<CalculationParameters> as CalculationParameters;
      facade.setCalculationParameters(params);
      expect(store.dispatch).toHaveBeenCalledWith({
        type: '[Calculation Parameters] Set Calculation Parameters',
        parameters: params,
      });
    });
  });
});
