import { HttpClientTestingModule } from '@angular/common/http/testing';

import { defer, of } from 'rxjs';

import { MsalBroadcastService } from '@azure/msal-angular';
import { InteractionStatus } from '@azure/msal-browser';
import { createServiceFactory, SpectatorService } from '@ngneat/spectator';
import { marbles } from 'rxjs-marbles';

import { HealthCheckService } from '../../../../shared/services/rest/health-check/health-check.service';
import {
  pingHealthCheck,
  pingHealthCheckFailure,
  pingHealthCheckSuccess,
} from '../../actions';
import { HealthCheckEffects } from './health-check.effects';

describe('Health Check Effects', () => {
  let effects: HealthCheckEffects;
  let spectator: SpectatorService<HealthCheckEffects>;
  let healthCheckService: HealthCheckService;
  let inProgressAction$: any;

  const createService = createServiceFactory({
    service: HealthCheckEffects,
    imports: [HttpClientTestingModule],
    providers: [
      {
        provide: MsalBroadcastService,
        useValue: {
          inProgress$: defer(() => inProgressAction$),
        },
      },
    ],
  });

  beforeEach(() => {
    spectator = createService();
    effects = spectator.inject(HealthCheckEffects);
    healthCheckService = spectator.inject(HealthCheckService);
  });

  describe('healthCheck$', () => {
    test(
      'should not ping health check when event is LOGIN',
      marbles((m) => {
        healthCheckService.pingHealthCheck = jest.fn();
        const action = m.hot('-a', {
          a: InteractionStatus.Login,
        });

        inProgressAction$ = action;
        const expected = m.cold('----');

        m.expect(effects.healthCheck$).toBeObservable(expected);
        m.flush();
        expect(healthCheckService.pingHealthCheck).not.toHaveBeenCalled();
      })
    );

    test(
      'should return pingHealthCheckSuccess',
      marbles((m) => {
        const result = pingHealthCheckSuccess();
        healthCheckService.pingHealthCheck = jest.fn().mockReturnValue(of([]));

        const action = m.hot('-a', {
          a: InteractionStatus.None,
        });

        inProgressAction$ = action;

        const expected$ = m.cold('-b', { b: result });

        m.expect(effects.healthCheck$).toBeObservable(expected$);
        m.flush();
        expect(healthCheckService.pingHealthCheck).toHaveBeenCalledTimes(1);
      })
    );

    test('should return pingHealthCheckFailure', () => {
      marbles((m) => {
        const errorMessage = 'errorMessage';
        const result = pingHealthCheckFailure({ errorMessage });

        const action = m.hot('-a', {
          a: InteractionStatus.None,
        });

        inProgressAction$ = action;

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
