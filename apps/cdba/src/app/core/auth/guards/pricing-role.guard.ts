import { Injectable } from '@angular/core';
import { CanActivateChild, Router } from '@angular/router';

import { Observable } from 'rxjs';
import { filter, map, tap } from 'rxjs/operators';

import { concatLatestFrom } from '@ngrx/effects';

import { AppRoutePath } from '../../../app-route-path.enum';
import { EmptyStatesPath } from '../../empty-states/empty-states-path.enum';
import { RoleFacade } from '../role.facade';

@Injectable({
  providedIn: 'root',
})
export class PricingRoleGuard implements CanActivateChild {
  constructor(
    private readonly router: Router,
    private readonly roleFacade: RoleFacade
  ) {}

  canActivateChild(): Observable<boolean> {
    return this.roleFacade.hasAnyPricingRole$.pipe(
      concatLatestFrom(() => this.roleFacade.isLoggedIn$),
      filter(([_hasAnyPricingRole, isLoggedIn]) => isLoggedIn),
      map(([hasAnyPricingRole, _isLoggedIn]) => hasAnyPricingRole),
      tap(async (hasAnyPricingRole) => {
        if (!hasAnyPricingRole) {
          await this.router.navigate([
            AppRoutePath.EmptyStatesPath,
            EmptyStatesPath.ForbiddenPath,
          ]);
        }
      })
    );
  }
}
