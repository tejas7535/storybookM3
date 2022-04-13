import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivateChild,
  Router,
  RouterStateSnapshot,
} from '@angular/router';

import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';

import { concatLatestFrom } from '@ngrx/effects';
import { Store } from '@ngrx/store';

import { getIsLoggedIn, getRoles } from '@schaeffler/azure-auth';

import { AppRoutePath } from '../../app-route-path.enum';
import { UserRoles } from '../../shared/constants/user-roles.enum';

@Injectable({
  providedIn: 'root',
})
export class RoleGuard implements CanActivateChild {
  constructor(private readonly store: Store, private readonly router: Router) {}

  canActivateChild(
    _childRoute: ActivatedRouteSnapshot,
    _state: RouterStateSnapshot
  ): Observable<boolean> {
    return this.store.select(getRoles).pipe(
      concatLatestFrom(() => this.store.select(getIsLoggedIn)),
      filter(([_roles, isLoggedIn]) => isLoggedIn),
      // eslint-disable-next-line ngrx/avoid-mapping-selectors
      map(([roles, _isLoggedIn]) => {
        if (!roles.includes(UserRoles.BASIC)) {
          this.router.navigate([AppRoutePath.ForbiddenPath]);

          return false;
        }

        return true;
      })
    );
  }
}
