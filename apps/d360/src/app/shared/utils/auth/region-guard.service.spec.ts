import { ActivatedRouteSnapshot } from '@angular/router';

import { of, take } from 'rxjs';

import { MockProvider, MockService } from 'ng-mocks';

import { AppRoutePath } from '../../../app.routes.enum';
import { Region } from '../../../feature/global-selection/model';
import { Stub } from '../../test/stub.class';
import { RegionGuard } from './region-guard.service';

describe('RegionGuardService', () => {
  let guard: RegionGuard;

  beforeEach(() => {
    guard = Stub.get<RegionGuard>({
      component: RegionGuard,
      providers: [
        Stub.getRouterProvider(),
        Stub.getUserServiceProvider(),
        MockProvider(ActivatedRouteSnapshot),
      ],
    });
  });

  it('should return the forbidden route, when user has no region', (done) => {
    guard
      .canActivate(
        MockService(ActivatedRouteSnapshot, {
          routeConfig: { data: { allowedRegions: [Region.Europe] } },
        }),
        {} as any
      )
      .pipe(take(1))
      .subscribe((value) => {
        expect(value).toEqual(
          guard['router'].parseUrl(AppRoutePath.ForbiddenPage)
        );
        done();
      });
  });

  it('should return true if user is located in an allowed region', (done) => {
    jest
      .spyOn(guard['userService'], 'loadRegion')
      .mockReturnValue(of(Region.Europe));

    guard
      .canActivate(
        MockService(ActivatedRouteSnapshot, {
          routeConfig: { data: { allowedRegions: [Region.Europe] } },
        }),
        {} as any
      )
      .pipe(take(1))
      .subscribe((value) => {
        expect(value).toBe(true);
        done();
      });
  });

  it('should return the forbidden route if user is not located in an allowed region', (done) => {
    jest
      .spyOn(guard['userService'], 'loadRegion')
      .mockReturnValue(of(Region.GreaterChina));

    guard
      .canActivate(
        MockService(ActivatedRouteSnapshot, {
          routeConfig: { data: { allowedRegions: [Region.Europe] } },
        }),
        {} as any
      )
      .pipe(take(1))
      .subscribe((value) => {
        expect(value).toEqual(
          guard['router'].parseUrl(AppRoutePath.ForbiddenPage)
        );
        done();
      });
  });

  it('should return true if no allowedRegions are set in the route', (done) => {
    guard
      .canActivate(
        MockService(ActivatedRouteSnapshot, {
          routeConfig: {},
        }),
        {} as any
      )
      .pipe(take(1))
      .subscribe((value) => {
        expect(value).toBe(true);
        done();
      });
  });

  it('should return undefined if allowedRegions is defined but null', (done) => {
    jest
      .spyOn(guard['userService'], 'loadRegion')
      .mockReturnValue(of(Region.Europe));

    guard
      .canActivate(
        MockService(ActivatedRouteSnapshot, {
          routeConfig: { data: { allowedRegions: null } },
        }),
        {} as any
      )
      .pipe(take(1))
      .subscribe((value) => {
        expect(value).toBeUndefined();
        done();
      });
  });

  it('should return undefined if allowedRegions is an empty array', (done) => {
    jest
      .spyOn(guard['userService'], 'loadRegion')
      .mockReturnValue(of(Region.Europe));

    guard
      .canActivate(
        MockService(ActivatedRouteSnapshot, {
          routeConfig: { data: { allowedRegions: [] } },
        }),
        {} as any
      )
      .pipe(take(1))
      .subscribe((value) => {
        expect(value).toBeUndefined();
        done();
      });
  });

  it('should return true if user region is in multiple allowed regions', (done) => {
    jest
      .spyOn(guard['userService'], 'loadRegion')
      .mockReturnValue(of(Region.Americas));

    guard
      .canActivate(
        MockService(ActivatedRouteSnapshot, {
          routeConfig: {
            data: {
              allowedRegions: [
                Region.Europe,
                Region.Americas,
                Region.GreaterChina,
              ],
            },
          },
        }),
        {} as any
      )
      .pipe(take(1))
      .subscribe((value) => {
        expect(value).toBe(true);
        done();
      });
  });

  it('should handle error in loadRegion and return forbidden route', (done) => {
    jest.spyOn(guard['userService'], 'loadRegion').mockReturnValue(of(null));

    guard
      .canActivate(
        MockService(ActivatedRouteSnapshot, {
          routeConfig: { data: { allowedRegions: [Region.Europe] } },
        }),
        {} as any
      )
      .pipe(take(1))
      .subscribe((value) => {
        expect(value).toEqual(
          guard['router'].parseUrl(AppRoutePath.ForbiddenPage)
        );
        done();
      });
  });

  it('should handle undefined routeConfig gracefully', (done) => {
    jest
      .spyOn(guard['userService'], 'loadRegion')
      .mockReturnValue(of(Region.Europe));

    guard
      .canActivate(
        MockService(ActivatedRouteSnapshot, {
          routeConfig: undefined,
        }),
        {} as any
      )
      .pipe(take(1))
      .subscribe((value) => {
        expect(value).toBe(true);
        done();
      });
  });
});
