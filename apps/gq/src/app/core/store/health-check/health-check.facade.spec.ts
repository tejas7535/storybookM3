import { createServiceFactory, SpectatorService } from '@ngneat/spectator';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { marbles } from 'rxjs-marbles';

import { HealthCheckFacade } from './health-check.facade';
import { healthCheckFeature } from './health-check.reducer';

describe('HealthCheckFacade', () => {
  let service: HealthCheckFacade;
  let spectator: SpectatorService<HealthCheckFacade>;
  let mockStore: MockStore;

  const createService = createServiceFactory({
    service: HealthCheckFacade,
    providers: [provideMockStore({})],
  });

  beforeEach(() => {
    spectator = createService();
    service = spectator.service;
    mockStore = spectator.inject(MockStore);
  });

  test('should be created', () => {
    expect(service).toBeTruthy();
  });

  test(
    'should provide selectHealthCheckAvailable',
    marbles((m) => {
      mockStore.overrideSelector(
        healthCheckFeature.selectHealthCheckAvailable,
        true
      );
      m.expect(service.healthCheckAvailable$).toBeObservable(
        m.cold('a', { a: true })
      );
    })
  );

  test(
    'should provide healthCheckLoading',
    marbles((m) => {
      mockStore.overrideSelector(
        healthCheckFeature.selectHealthCheckLoading,
        true
      );
      m.expect(service.healthCheckLoading$).toBeObservable(
        m.cold('a', { a: true })
      );
    })
  );

  test(
    'should provide error',
    marbles((m) => {
      const error = new Error('my Error');
      mockStore.overrideSelector(healthCheckFeature.selectError, error);
      m.expect(service.error$).toBeObservable(m.cold('a', { a: error }));
    })
  );
});
