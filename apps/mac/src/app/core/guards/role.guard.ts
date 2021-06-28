import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivateChild,
  Router,
  RouterStateSnapshot,
} from '@angular/router';

import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { Store } from '@ngrx/store';

import { getRoles } from '@schaeffler/azure-auth';

import { RoutePath } from '../../app-routing.enum';

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
      map((roles) => {
        const requiredRoles: string[] = _childRoute?.data?.requiredRoles || [];
        if (!requiredRoles || requiredRoles.length === 0) {
          return true;
        }

        for (const role of requiredRoles) {
          if (!roles.includes(role)) {
            this.router.navigate([RoutePath.ForbiddenPath]);

            return false;
          }
        }

        return true;
      })
    );
  }
}
