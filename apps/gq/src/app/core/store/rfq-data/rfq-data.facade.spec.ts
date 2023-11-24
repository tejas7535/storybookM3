import { createServiceFactory, SpectatorService } from '@ngneat/spectator/jest';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { marbles } from 'rxjs-marbles';

import { RfqDataFacade } from './rfq-data.facade';
import { rfqDataFeature } from './rfq-data.reducer';

describe('RfqDataFacade', () => {
  let service: RfqDataFacade;
  let spectator: SpectatorService<RfqDataFacade>;
  let mockStore: MockStore;

  const createService = createServiceFactory({
    service: RfqDataFacade,
    providers: [provideMockStore({})],
  });

  beforeEach(() => {
    spectator = createService();
    service = spectator.service;
    mockStore = spectator.inject(MockStore);

    jest.resetAllMocks();
  });
  describe('Observables', () => {
    test(
      'should provide rfqDataUpdateAvl$',
      marbles((m) => {
        mockStore.overrideSelector(rfqDataFeature.getRfqDataUpdateAvl, true);
        m.expect(service.rfqDataUpdateAvl$).toBeObservable(
          m.cold('a', { a: true })
        );
      })
    );
  });
});
