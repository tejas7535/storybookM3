import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivateChild,
  GuardResult,
  MaybeAsync,
  Router,
  RouterStateSnapshot,
} from '@angular/router';

import { tap } from 'rxjs';

import { AppRoutePath } from '@cdba/app-route-path.enum';
import { EmptyStatesPath } from '@cdba/core/empty-states/empty-states-path.enum';
import { BetaFeatureService } from '@cdba/shared/services/beta-feature/beta-feature.service';

@Injectable({
  providedIn: 'root',
})
export class BetaFeatureRoleGuard implements CanActivateChild {
  constructor(
    private readonly router: Router,
    private readonly betaFeatureService: BetaFeatureService
  ) {}

  canActivateChild(
    childRoute: ActivatedRouteSnapshot,
    _state: RouterStateSnapshot
  ): MaybeAsync<GuardResult> {
    return this.betaFeatureService
      .canAccessBetaFeature$(childRoute.data['betaFeature'])
      .pipe(
        tap((canActivate: boolean) => {
          if (!canActivate) {
            this.router.navigate([
              AppRoutePath.EmptyStatesPath,
              EmptyStatesPath.ForbiddenPath,
            ]);
          }
        })
      );
  }
}
