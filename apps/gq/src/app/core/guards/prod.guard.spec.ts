import { RouterModule } from '@angular/router';

import { EnvironmentEnum } from '@gq/shared/models';
import {
  createServiceFactory,
  SpectatorService,
  SpectatorServiceFactory,
} from '@ngneat/spectator/jest';

import { ENV, getEnv } from '../../../environments/environments.provider';
import { ProdGuard } from '.';

describe('ProdGuard', () => {
  let guard: ProdGuard;
  let spectator: SpectatorService<ProdGuard>;
  let createService: SpectatorServiceFactory<ProdGuard>;

  describe('Dev Environemnt', () => {
    createService = createServiceFactory({
      service: ProdGuard,
      imports: [RouterModule],
      providers: [
        { provide: ENV, useValue: { ...getEnv(), environment: 'dev' } },
      ],
    });

    beforeEach(() => {
      spectator = createService();
      guard = spectator.inject(ProdGuard);
    });

    test('should be created', () => {
      expect(guard).toBeTruthy();
    });

    test('should return true if on dev', () => {
      expect(guard.canActivate({} as any, {} as any).valueOf()).toBe(true);
    });
  });

  describe('Prod Env', () => {
    createService = createServiceFactory({
      service: ProdGuard,
      imports: [RouterModule],
      providers: [
        {
          provide: ENV,
          useValue: { ...getEnv(), environment: EnvironmentEnum.prod },
        },
      ],
    });

    beforeEach(() => {
      spectator = createService();
      guard = spectator.inject(ProdGuard);
    });

    test('navigate to forbidden', () => {
      guard['router'].navigate = jest.fn().mockImplementation();
      guard.canActivate({} as any, {} as any);
      expect(guard['router'].navigate).toHaveBeenCalledWith(['forbidden']);
    });
  });

  describe('Pre-Release Env', () => {
    createService = createServiceFactory({
      service: ProdGuard,
      imports: [RouterModule],
      providers: [
        {
          provide: ENV,
          useValue: {
            ...getEnv(),
            environment: EnvironmentEnum['pre-release'],
          },
        },
      ],
    });

    beforeEach(() => {
      spectator = createService();
      guard = spectator.inject(ProdGuard);
    });

    test('navigate to forbidden', () => {
      guard['router'].navigate = jest.fn().mockImplementation();
      guard.canActivate({} as any, {} as any);
      expect(guard['router'].navigate).toHaveBeenCalledWith(['forbidden']);
    });
  });
});
