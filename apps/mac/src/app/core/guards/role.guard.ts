import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivateChild,
  Router,
  RouterStateSnapshot,
} from '@angular/router';

import { Observable, of } from 'rxjs';
import { tap } from 'rxjs/operators';

import { Store } from '@ngrx/store';

import { hasIdTokenRoles } from '@schaeffler/azure-auth';

import { RoutePath } from '@mac/app-routing.enum';

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

    return this.store.pipe(hasIdTokenRoles(requiredRoles)).pipe(
      tap((granted) => {
        if (!granted) {
          this.router.navigate([RoutePath.ForbiddenPath]);
        }
      })
    );
  }
}
