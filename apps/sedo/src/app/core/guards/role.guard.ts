import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivateChild,
  Router,
  RouterStateSnapshot,
} from '@angular/router';

import { Observable, tap } from 'rxjs';

import { Store } from '@ngrx/store';

import { hasIdTokenRole } from '@schaeffler/azure-auth';

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
      tap((hasBaseRole) => {
        if (!hasBaseRole) {
          this.router.navigate([AppRoutePath.Forbidden]);
        }
      })
    );
  }
}
