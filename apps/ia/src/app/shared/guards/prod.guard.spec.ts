import * as angularCore from '@angular/core';
import { RouterTestingModule } from '@angular/router/testing';

import {
  createServiceFactory,
  SpectatorService,
  SpectatorServiceFactory,
} from '@ngneat/spectator';

import { ProdGuard } from '.';

describe('ProdGuard', () => {
  let guard: ProdGuard;
  let spectator: SpectatorService<ProdGuard>;
  let createService: SpectatorServiceFactory<ProdGuard>;

  describe('Dev Environemnt', () => {
    createService = createServiceFactory({
      service: ProdGuard,
      imports: [RouterTestingModule],
    });

    beforeEach(() => {
      spectator = createService();
      guard = spectator.inject(ProdGuard);
    });

    test('should return true when dev mode', () => {
      jest.spyOn(angularCore, 'isDevMode').mockReturnValue(true);

      expect(guard.canLoad()).toBeTruthy();
    });

    test('should return false when not dev mode', () => {
      jest.spyOn(angularCore, 'isDevMode').mockReturnValue(false);

      expect(guard.canLoad()).toBeFalsy();
    });
  });
});
