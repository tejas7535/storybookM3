import { createServiceFactory, SpectatorService } from '@ngneat/spectator/jest';

import { environment } from '@cdba/environments/environment';

import { DevGuard } from './dev.guard';

describe('DevGuard', () => {
  let spectator: SpectatorService<DevGuard>;
  let guard: DevGuard;

  const createService = createServiceFactory(DevGuard);

  beforeEach(() => {
    spectator = createService();
    guard = spectator.inject(DevGuard);
  });

  test('should create', () => {
    expect(guard).toBeTruthy();
  });

  describe('canActivateChild', () => {
    test('should grant access, if user is in a dev environment', () => {
      environment.production = false;

      guard
        .canActivateChild()
        .subscribe((granted) => expect(granted).toBeTruthy());
    });

    test('should not grant access, if user is in a dev environment', () => {
      environment.production = true;

      guard
        .canActivateChild()
        .subscribe((granted) => expect(granted).toBeTruthy());
    });
  });
});
