import { createServiceFactory, SpectatorService } from '@ngneat/spectator/jest';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { marbles } from 'rxjs-marbles';

import {
  getMaterialComparableCosts,
  getMaterialComparableCostsLoading,
} from '../selectors/material-comparable-costs/material-comparable-costs.selector';
import { MaterialComparableCostsFacade } from './material-comparable-costs.facade';
describe('MaterialComparableCostsFacade', () => {
  let service: MaterialComparableCostsFacade;
  let spectator: SpectatorService<MaterialComparableCostsFacade>;
  let mockStore: MockStore;

  const createService = createServiceFactory({
    service: MaterialComparableCostsFacade,
    providers: [provideMockStore({})],
  });

  beforeEach(() => {
    spectator = createService();
    service = spectator.service;
    mockStore = spectator.inject(MockStore);

    jest.resetAllMocks();
  });

  describe('should provide Observables', () => {
    test(
      'should provide materialComparableCostsLoading$',
      marbles((m) => {
        mockStore.overrideSelector(getMaterialComparableCostsLoading, true);
        m.expect(service.materialComparableCostsLoading$).toBeObservable(
          m.cold('a', { a: true })
        );
      })
    );

    test(
      'should provide materialComparableCosts$',
      marbles((m) => {
        mockStore.overrideSelector(getMaterialComparableCosts, []);
        m.expect(service.materialComparableCosts$).toBeObservable(
          m.cold('a', { a: [] })
        );
      })
    );
  });
});
