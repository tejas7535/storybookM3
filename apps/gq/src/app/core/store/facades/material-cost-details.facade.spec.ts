import { MaterialCostDetails } from '@gq/shared/models';
import { createServiceFactory, SpectatorService } from '@ngneat/spectator/jest';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { marbles } from 'rxjs-marbles';

import {
  getMaterialCostDetails,
  getMaterialCostDetailsLoading,
  getMaterialCostUpdateAvl,
} from '../selectors/material-cost-details/material-cost-details.selectors';
import { MaterialCostDetailsFacade } from './material-cost-details.facade';
describe('MaterialCostDetailsFacade', () => {
  let service: MaterialCostDetailsFacade;
  let spectator: SpectatorService<MaterialCostDetailsFacade>;
  let mockStore: MockStore;

  const createService = createServiceFactory({
    service: MaterialCostDetailsFacade,
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
      'should provide materialCostDetailsLoading$',
      marbles((m) => {
        mockStore.overrideSelector(getMaterialCostDetailsLoading, true);
        m.expect(service.materialCostDetailsLoading$).toBeObservable(
          m.cold('a', { a: true })
        );
      })
    );

    test(
      'should provide materialCostDetails$',
      marbles((m) => {
        mockStore.overrideSelector(
          getMaterialCostDetails,
          {} as MaterialCostDetails
        );
        m.expect(service.materialCostDetails$).toBeObservable(
          m.cold('a', { a: {} as MaterialCostDetails })
        );
      })
    );

    test(
      'should provide materialCostUpdateAvl$',
      marbles((m) => {
        mockStore.overrideSelector(getMaterialCostUpdateAvl, true);
        m.expect(service.materialCostUpdateAvl$).toBeObservable(
          m.cold('a', { a: true })
        );
      })
    );
  });
});
