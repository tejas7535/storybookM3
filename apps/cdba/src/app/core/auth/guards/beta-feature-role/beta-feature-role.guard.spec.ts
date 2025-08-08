import { ActivatedRouteSnapshot, provideRouter, Router } from '@angular/router';

import { Observable, of } from 'rxjs';

import { createServiceFactory, SpectatorService } from '@ngneat/spectator/jest';

import { AppRoutePath } from '@cdba/app-route-path.enum';
import { EmptyStatesPath } from '@cdba/core/empty-states/empty-states-path.enum';
import { BetaFeatureService } from '@cdba/shared/services/beta-feature/beta-feature.service';

import { BetaFeatureRoleGuard } from './beta-feature-role.guard';

describe('BetaFeatureRoleGuard', () => {
  let spectator: SpectatorService<BetaFeatureRoleGuard>;
  let guard: BetaFeatureRoleGuard;
  let betaFeatureServiceMock: jest.Mocked<BetaFeatureService>;

  const createService = createServiceFactory({
    service: BetaFeatureRoleGuard,
    providers: [
      provideRouter([]),
      {
        provide: BetaFeatureService,
        useValue: {
          canAccessBetaFeature$: jest.fn((_betaFeature) => {}),
        },
      },
      {
        provide: Router,
        useValue: {
          navigate: jest.fn(),
        },
      },
    ],
  });

  beforeEach(() => {
    spectator = createService();
    guard = spectator.inject(BetaFeatureRoleGuard);
    betaFeatureServiceMock = spectator.inject(
      BetaFeatureService
    ) as jest.Mocked<BetaFeatureService>;
  });

  it('should create', () => {
    expect(guard).toBeTruthy();
  });

  describe('canActivateChild', () => {
    it('should grant access when service allows it', () => {
      betaFeatureServiceMock.canAccessBetaFeature$.mockReturnValue(of(true));

      const result = guard.canActivateChild(
        {
          data: { betaFeature: 'canAccessBetaFeature_isMocked' },
        } as unknown as ActivatedRouteSnapshot,
        undefined
      ) as Observable<boolean>;

      result.subscribe((value: boolean) => expect(value).toEqual(true));
    });
    it('should redirect when service denies access', () => {
      betaFeatureServiceMock.canAccessBetaFeature$.mockReturnValue(of(false));
      const routerSpy = jest.spyOn(guard['router'], 'navigate');

      const result = guard.canActivateChild(
        {
          data: { betaFeature: 'canAccessBetaFeature_isMocked' },
        } as unknown as ActivatedRouteSnapshot,
        undefined
      ) as Observable<boolean>;

      result.subscribe((value: boolean) => expect(value).toEqual(false));
      expect(routerSpy).toHaveBeenCalledWith([
        AppRoutePath.EmptyStatesPath,
        EmptyStatesPath.ForbiddenPath,
      ]);
    });
  });
});
