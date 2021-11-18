import { HttpClientTestingModule } from '@angular/common/http/testing';

import { marbles } from 'rxjs-marbles';

import { createServiceFactory, SpectatorService } from '@ngneat/spectator';
import { Actions } from '@ngrx/effects';
import { provideMockActions } from '@ngrx/effects/testing';

import { HealthCheckService } from '../../../../shared/services/rest-services/health-check-service/health-check.service';
import {
  pingHealthCheck,
  pingHealthCheckFailure,
  pingHealthCheckSuccess,
} from '../../actions/health-check/health-check.actions';
import { HealthCheckEffects } from './health-check.effects';

describe('Health Check Effects', () => {
  let action: any;
  let actions$: any;

  let effects: HealthCheckEffects;
  let spectator: SpectatorService<HealthCheckEffects>;
  let healthCheckService: HealthCheckService;

  const createService = createServiceFactory({
    service: HealthCheckEffects,
    imports: [HttpClientTestingModule],
    providers: [provideMockActions(() => actions$)],
  });

  beforeEach(() => {
    spectator = createService();
    actions$ = spectator.inject(Actions);
    effects = spectator.inject(HealthCheckEffects);
    healthCheckService = spectator.inject(HealthCheckService);
  });

  describe('healthCheck$', () => {
    test('should return pingHealthCheckSuccess', () => {
      marbles((m) => {
        action = pingHealthCheck();
        const result = pingHealthCheckSuccess();

        actions$ = m.hot('-a', { a: action });
        healthCheckService.pingHealthCheck = jest.fn();
        const expected$ = m.cold('--b', { b: result });

        m.expect(effects.healthCheck$).toBeObservable(expected$);
        m.flush();
        expect(healthCheckService.pingHealthCheck).toHaveBeenCalledTimes(1);
      });
    });
    test('should return pingHealthCheckFailure', () => {
      marbles((m) => {
        const errorMessage = 'errorMessage';
        const result = pingHealthCheckFailure({ errorMessage });

        actions$ = m.hot('-a', { a: action });

        action = pingHealthCheck();
        const response = m.cold('-#|', undefined, errorMessage);
        const expected = m.cold('--b', { b: result });
        healthCheckService.pingHealthCheck = jest.fn(() => response);

        m.expect(effects.healthCheck$).toBeObservable(expected);
        m.flush();
        expect(healthCheckService.pingHealthCheck).toHaveBeenCalledTimes(1);
      });
    });
  });
  describe('ngrxOnInitEffects', () => {
    test('should trigger onInit', () => {
      const result = effects.ngrxOnInitEffects();
      expect(result).toEqual(pingHealthCheck());
    });
  });
});
