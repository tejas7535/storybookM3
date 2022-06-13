import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivateChild,
  Router,
  RouterStateSnapshot,
} from '@angular/router';

import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

import { Store } from '@ngrx/store';

import { hasIdTokenRole } from '@schaeffler/azure-auth';

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
    return this.store.pipe(hasIdTokenRole(UserRoles.BASIC)).pipe(
      tap((granted) => {
        if (!granted) {
          this.router.navigate([AppRoutePath.ForbiddenPath]);
        }
      })
    );
  }
}
