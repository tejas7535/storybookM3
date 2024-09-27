import { createServiceFactory, SpectatorService } from '@ngneat/spectator/jest';
import { MockStore, provideMockStore } from '@ngrx/store/testing';

import { CalculationParameters } from '../models/calculation-parameters-state.model';
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

  describe('when fetching calculation result resource links', () => {
    it('should perform fetch calculation result resource links action', () => {
      store.dispatch = jest.fn();
      const formProperties: CalculationParameters = {
        RSY_BEARING_SERIES: 'some series',
      } as Partial<CalculationParameters> as CalculationParameters;
      facade.fetchCalculationResultResourcesLinks(formProperties);

      expect(store.dispatch).toHaveBeenCalledWith({
        type: '[CalculationResult] Fetch Calculation Result Resources Links',
        formProperties,
      });
    });
  });
});
