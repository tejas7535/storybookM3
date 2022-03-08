import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivateChild,
  Router,
  RouterStateSnapshot,
} from '@angular/router';

import { Observable, of } from 'rxjs';
import { filter, map, tap } from 'rxjs/operators';

import { concatLatestFrom } from '@ngrx/effects';
import { Store } from '@ngrx/store';

import { getIsLoggedIn, hasIdTokenRoles } from '@schaeffler/azure-auth';

import { RoutePath } from '../../app-routing.enum';

@Injectable({
  providedIn: 'root',
})
export class RoleGuard implements CanActivateChild {
  constructor(private readonly store: Store, private readonly router: Router) {}

  canActivateChild(
    _childRoute: ActivatedRouteSnapshot,
    _state?: RouterStateSnapshot
  ): Observable<boolean> {
    const requiredRoles: string[] = _childRoute?.data?.requiredRoles || [];
    if (!requiredRoles || requiredRoles.length === 0) {
      return of(true);
    }

    return this.store.select(hasIdTokenRoles(requiredRoles)).pipe(
      concatLatestFrom(() => this.store.select(getIsLoggedIn)),
      filter(([_granted, isLoggedIn]) => isLoggedIn),
      // eslint-disable-next-line ngrx/avoid-mapping-selectors
      map(([granted, _isLoggedIn]) => granted),
      tap((granted) => {
        if (!granted) {
          this.router.navigate([RoutePath.ForbiddenPath]);
        }
      })
    );
  }
}
