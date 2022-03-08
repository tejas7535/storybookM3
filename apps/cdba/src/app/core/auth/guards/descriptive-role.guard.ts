import { Injectable } from '@angular/core';
import { CanActivate, CanActivateChild, Router } from '@angular/router';

import { filter, map, tap } from 'rxjs/operators';

import { AppRoutePath } from '@cdba/app-route-path.enum';
import { EmptyStatesPath } from '@cdba/core/empty-states/empty-states-path.enum';
import { concatLatestFrom } from '@ngrx/effects';

import { RoleFacade } from '../role.facade';

@Injectable({
  providedIn: 'root',
})
export class DescriptiveRoleGuard implements CanActivate, CanActivateChild {
  constructor(
    private readonly router: Router,
    private readonly roleFacade: RoleFacade
  ) {}

  canActivate() {
    return this.hasDescriptiveRoles();
  }

  canActivateChild() {
    return this.hasDescriptiveRoles();
  }

  private hasDescriptiveRoles() {
    return this.roleFacade.hasDescriptiveRoles$.pipe(
      concatLatestFrom(() => this.roleFacade.isLoggedIn$),
      filter(([_hasDescriptiveRoles, isLoggedIn]) => isLoggedIn),
      map(([hasDescriptiveRoles, _isLoggedIn]) => hasDescriptiveRoles),
      tap(async (hasDescriptiveRoles) => {
        if (!hasDescriptiveRoles) {
          await this.router.navigate([
            AppRoutePath.EmptyStatesPath,
            EmptyStatesPath.MissingRolesPath,
          ]);
        }
      })
    );
  }
}
