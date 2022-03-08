import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivateChild,
  Router,
  RouterStateSnapshot,
} from '@angular/router';

import { filter, map, Observable, tap } from 'rxjs';

import { concatLatestFrom } from '@ngrx/effects';
import { Store } from '@ngrx/store';

import { getIsLoggedIn, hasIdTokenRole } from '@schaeffler/azure-auth';

import { AppRoutePath } from '../../app-route-path.enum';

@Injectable({
  providedIn: 'root',
})
export class RoleGuard implements CanActivateChild {
  private readonly BASE_ROLE = 'USER_READ';

  constructor(private readonly store: Store, private readonly router: Router) {}
  canActivateChild(
    _childRoute: ActivatedRouteSnapshot,
    _state: RouterStateSnapshot
  ): Observable<boolean> {
    return this.store.select(hasIdTokenRole(this.BASE_ROLE)).pipe(
      concatLatestFrom(() => this.store.select(getIsLoggedIn)),
      filter(([_hasBaseRole, isLoggedIn]) => isLoggedIn),
      // eslint-disable-next-line ngrx/avoid-mapping-selectors
      map(([hasBaseRole, _isLoggedIn]) => hasBaseRole),
      tap((hasBaseRole) => {
        if (!hasBaseRole) {
          this.router.navigate([AppRoutePath.Forbidden]);
        }
      })
    );
  }
}
