import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivateChild,
  Router,
  RouterStateSnapshot,
} from '@angular/router';

import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { select, Store } from '@ngrx/store';

import { getRoles } from '@schaeffler/azure-auth';

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
    return this.store.pipe(
      select(getRoles),
      map((roles) => {
        if (!roles.includes(this.BASE_ROLE)) {
          this.router.navigate([AppRoutePath.Forbidden]);

          return false;
        }

        return true;
      })
    );
  }
}
