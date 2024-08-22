import { createServiceFactory, SpectatorService } from '@ngneat/spectator/jest';
import { MockStore, provideMockStore } from '@ngrx/store/testing';

import { APP_STATE_MOCK } from './../../../../testing/mocks/store/app-state.mock';
import { CalculationResultFacade } from './calculation-result.facade';

describe('CalculationResultFacade', () => {
  let spectator: SpectatorService<CalculationResultFacade>;
  let facade: CalculationResultFacade;
  let store: MockStore;

  const createService = createServiceFactory({
    service: CalculationResultFacade,
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

  describe('when fetching calculation result', () => {
    it('should perform fetch calculation action', () => {
      store.dispatch = jest.fn();
      facade.fetchCalculationResult('https://bearing-api/report.json');
      expect(store.dispatch).toHaveBeenCalledWith({
        type: '[CalculationResult] Fetch Calculation JSON Result',
        jsonReportUrl: 'https://bearing-api/report.json',
      });
    });
  });
});
