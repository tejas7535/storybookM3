import { provideHttpClient } from '@angular/common/http';
import {
  ActivatedRouteSnapshot,
  Router,
  RouterStateSnapshot,
} from '@angular/router';

import { of } from 'rxjs';

// eslint-disable-next-line no-restricted-imports
import { createServiceFactory, SpectatorService } from '@ngneat/spectator';
import { mockProvider } from '@ngneat/spectator/jest';
import { MockService } from 'ng-mocks';

import { AppRoutePath } from '../../../app.routes.enum';
import { Region } from '../../../feature/global-selection/model';
import { UserService } from '../../services/user.service';
import { RegionGuard } from './region-guard.service';

describe('RegionGuardService', () => {
  let spectator: SpectatorService<RegionGuard>;
  const createService = createServiceFactory({
    service: RegionGuard,
    providers: [
      provideHttpClient(),
      mockProvider(UserService, {
        loadRegion: jest.fn(() => of('')),
      }),
    ],
  });
  let mockedRouterSnapshot: ActivatedRouteSnapshot;
  let mockedRouterStateSnapshot: RouterStateSnapshot;
  let router: Router;
  beforeEach(() => {
    mockedRouterSnapshot = MockService(ActivatedRouteSnapshot, {
      routeConfig: { data: { allowedRegions: [Region.Europe] } },
    });
    mockedRouterStateSnapshot = MockService(RouterStateSnapshot);
    spectator = createService();
    router = spectator.inject(Router);
  });

  it('should return the forbidden route, when user has no region', (done) => {
    spectator.service
      .canActivate(mockedRouterSnapshot, mockedRouterStateSnapshot)
      .subscribe((value) => {
        expect(value).toEqual(router.parseUrl(AppRoutePath.ForbiddenPage));
        done();
      });
  });

  it('should return true if user is located in an allowed region', (done) => {
    const userService = spectator.inject(UserService);
    jest.spyOn(userService, 'loadRegion').mockReturnValue(of(Region.Europe));

    spectator.service
      .canActivate(mockedRouterSnapshot, mockedRouterStateSnapshot)
      .subscribe((value) => {
        expect(value).toBe(true);
        done();
      });
  });

  it('should return the forbidden route if user is not located in an allowed region', (done) => {
    const userService = spectator.inject(UserService);
    jest
      .spyOn(userService, 'loadRegion')
      .mockReturnValue(of(Region.GreaterChina));

    spectator.service
      .canActivate(mockedRouterSnapshot, mockedRouterStateSnapshot)
      .subscribe((value) => {
        expect(value).toEqual(router.parseUrl(AppRoutePath.ForbiddenPage));
        done();
      });
  });

  it('should return true if no allowedRegions are set in the route', (done) => {
    mockedRouterSnapshot = MockService(ActivatedRouteSnapshot, {
      routeConfig: {},
    });

    spectator.service
      .canActivate(mockedRouterSnapshot, mockedRouterStateSnapshot)
      .subscribe((value) => {
        expect(value).toBe(true);
        done();
      });
  });
});
