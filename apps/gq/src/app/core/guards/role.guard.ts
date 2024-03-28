import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  Router,
  RouterStateSnapshot,
} from '@angular/router';

import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

import { UserRoles } from '@gq/shared/constants/user-roles.enum';
import { Store } from '@ngrx/store';

import { hasIdTokenRole } from '@schaeffler/azure-auth';

import { AppRoutePath } from '../../app-route-path.enum';

@Injectable({
  providedIn: 'root',
})
export class RoleGuard {
  constructor(
    private readonly store: Store,
    private readonly router: Router
  ) {}

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
