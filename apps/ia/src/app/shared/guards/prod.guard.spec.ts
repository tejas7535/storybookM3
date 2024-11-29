import { Router } from '@angular/router';

import { createServiceFactory, SpectatorService } from '@ngneat/spectator/jest';
import { marbles } from 'rxjs-marbles/marbles';

import { Environment } from '../../../environments/environment.model';
import { EnvironmentEnum } from '../models';
import { ProdGuard } from './prod.guard';

let environment: EnvironmentEnum;

jest.mock('./../../../environments/environments.provider', () => ({
  ...jest.requireActual('./../../../environments/environments.provider'),
  getEnv: jest.fn(() => ({ environment }) as Environment),
}));

describe('ProdGuard', () => {
  let spectator: SpectatorService<ProdGuard>;
  let guard: ProdGuard;

  const createGuardInstance = createServiceFactory({
    service: ProdGuard,
    providers: [
      {
        provide: Router,
        useValue: { navigate: jest.fn() },
      },
    ],
  });

  beforeEach(() => {
    spectator = createGuardInstance();
    guard = spectator.inject(ProdGuard);
  });

  test('should be created', () => {
    expect(guard).toBeTruthy();
  });

  test(
    'should navigate to empty-states if environment is production',
    marbles((m) => {
      environment = EnvironmentEnum.prod;

      const canActivate$ = guard.canActivate();

      m.expect(canActivate$).toBeObservable('(a|)', { a: false });
    })
  );

  test(
    'should allow activation if environment is not production',
    marbles((m) => {
      environment = EnvironmentEnum.prod;

      const canActivate$ = guard.canActivate();

      m.expect(canActivate$).toBeObservable('(a|)', { a: false });
    })
  );
});
