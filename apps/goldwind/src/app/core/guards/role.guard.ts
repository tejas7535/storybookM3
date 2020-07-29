import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
} from '@angular/router';

import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { select, Store } from '@ngrx/store';

import { getRoles } from '@schaeffler/auth';

import { AppRoutePath } from '../../app-route-path.enum';

@Injectable({
  providedIn: 'root',
})
export class RoleGuard implements CanActivate {
  private readonly BASE_ROLE = 'User';

  constructor(private readonly store: Store, private readonly router: Router) {}

  canActivate(
    _childRoute: ActivatedRouteSnapshot,
    _state: RouterStateSnapshot
  ): Observable<boolean> {
    return this.store.pipe(
      select(getRoles),
      map((roles) => {
        if (!roles.includes(this.BASE_ROLE)) {
          this.router.navigate([AppRoutePath.ForbiddenPath]);

          return false;
        }

        return true;
      })
    );
  }
}
