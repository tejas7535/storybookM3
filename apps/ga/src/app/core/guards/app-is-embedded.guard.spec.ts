import { ActivatedRouteSnapshot } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';

import {
  createServiceFactory,
  mockProvider,
  SpectatorService,
} from '@ngneat/spectator/jest';
import { marbles } from 'rxjs-marbles/jest';

import { SettingsFacade } from '@ga/core/store';

import { AppIsEmbeddedGuard } from './app-is-embedded.guard';

describe('AppIsEmbeddedGuard', () => {
  let spectator: SpectatorService<AppIsEmbeddedGuard>;
  let guard: AppIsEmbeddedGuard;
  let settingsFacade: SettingsFacade;

  const bearing = 'mock-bearing';
  const mockRoute: ActivatedRouteSnapshot = {
    queryParams: {
      bearing,
    },
  } as unknown as ActivatedRouteSnapshot;

  const createService = createServiceFactory({
    service: AppIsEmbeddedGuard,
    imports: [RouterTestingModule],
    providers: [mockProvider(SettingsFacade)],
  });

  beforeEach(() => {
    spectator = createService();
    guard = spectator.inject(AppIsEmbeddedGuard);
    settingsFacade = spectator.inject(SettingsFacade);
  });

  it('should be create', () => {
    expect(guard).toBeTruthy();
  });

  describe('canActivateChild', () => {
    it(
      'should grant access, if app is not embedded',
      marbles((m) => {
        settingsFacade.appIsEmbedded$ = m.cold('a', { a: false });

        guard
          .canActivate(mockRoute)
          .subscribe((granted) => expect(granted).toBeTruthy());
      })
    );

    it(
      'should not grant access if app is embedded',
      marbles((m) => {
        settingsFacade.appIsEmbedded$ = m.cold('a', { a: true });
        guard['router'].navigate = jest
          .fn()
          .mockImplementation(() => Promise.resolve(true));

        guard
          .canActivate(mockRoute)
          .subscribe((granted) => expect(granted).toBeFalsy());
      })
    );

    it(
      'should redirect to grease-calculation page if app is embedded',
      marbles((m) => {
        settingsFacade.appIsEmbedded$ = m.cold('a', { a: true });
        guard['router'].navigate = jest
          .fn()
          .mockImplementation(() => Promise.resolve(true));

        guard.canActivate(mockRoute).subscribe((granted) => {
          expect(granted).toBeFalsy();
          expect(guard['router'].navigate).toHaveBeenCalledWith(
            ['grease-calculation', 'parameters'],
            {
              queryParams: { bearing },
            }
          );
        });
      })
    );
  });
});
