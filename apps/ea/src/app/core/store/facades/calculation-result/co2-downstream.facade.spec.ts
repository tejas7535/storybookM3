import { APP_STATE_MOCK } from '@ea/testing/mocks';
import { createServiceFactory, SpectatorService } from '@ngneat/spectator/jest';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { marbles } from 'rxjs-marbles';

import { getDownstreamErrors } from '../../selectors/calculation-result/co2-downstream-calculation-result.selector';
import { Co2DownstreamFacade } from './co2-downstream.facade';

describe('Co2DownstreamFacade', () => {
  let spectator: SpectatorService<Co2DownstreamFacade>;
  let facade: Co2DownstreamFacade;
  let store: MockStore;

  const createService = createServiceFactory({
    service: Co2DownstreamFacade,
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

  describe('downstreamErrors', () => {
    it(
      'should provide downstream errors',
      marbles((m) => {
        store.overrideSelector(getDownstreamErrors, ['test error']);
        const expected = m.cold('a', {
          a: ['test error'],
        });

        m.expect(facade.downstreamErrors$).toBeObservable(expected);
      })
    );
  });
});
