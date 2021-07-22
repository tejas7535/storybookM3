import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivateChild,
  Router,
} from '@angular/router';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Store } from '@ngrx/store';

import { hasAnyIdTokenRole } from '@schaeffler/azure-auth';
import { authConfig } from '@cdba/core/auth/auth.config';
import { AppRoutePath } from '../../app-route-path.enum';
import { AuthRoles } from './models/auth.models';

@Injectable({
  providedIn: 'root',
})
export class RoleGuard implements CanActivateChild {
  constructor(private readonly store: Store, private readonly router: Router) {}

  canActivateChild(route: ActivatedRouteSnapshot): Observable<boolean> {
    const rolesWithAccess: AuthRoles =
      route.data.rolesWithAccess || authConfig.basicRoles; // set basicRoles as minimum default

    return this.store.select(hasAnyIdTokenRole(rolesWithAccess)).pipe(
      tap(async (access) => {
        if (!access) {
          await this.router.navigate([AppRoutePath.ForbiddenPath]);
        }
      })
    );
  }
}
