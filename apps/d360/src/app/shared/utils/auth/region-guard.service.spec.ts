import { ActivatedRouteSnapshot, Router } from '@angular/router';

import { of } from 'rxjs';

import { MockProvider, MockService } from 'ng-mocks';

import { AppRoutePath } from '../../../app.routes.enum';
import { Region } from '../../../feature/global-selection/model';
import { UserService } from '../../services/user.service';
import { Stub } from '../../test/stub.class';
import { RegionGuard } from './region-guard.service';

describe('RegionGuardService', () => {
  let guard: RegionGuard;

  beforeEach(() => {
    guard = Stub.get<RegionGuard>({
      component: RegionGuard,
      providers: [
        MockProvider(Router),
        MockProvider(
          UserService,
          { loadRegion: jest.fn(() => of('')) },
          'useValue'
        ),
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
      .subscribe((value) => {
        expect(value).toBe(true);
        done();
      });
  });
});
