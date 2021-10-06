import { Injectable } from '@angular/core';
import { CanActivateChild, Router } from '@angular/router';

import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

import { AppRoutePath } from '../../../app-route-path.enum';
import { RoleFacade } from '../role.facade';

@Injectable({
  providedIn: 'root',
})
export class PricingRoleGuard implements CanActivateChild {
  constructor(
    private readonly router: Router,
    private readonly roleFacade: RoleFacade
  ) {}

  canActivateChild(): Observable<boolean> {
    return this.roleFacade.hasAnyPricingRole$.pipe(
      tap(async (hasAnyPricingRole) => {
        if (!hasAnyPricingRole) {
          await this.router.navigate([AppRoutePath.NoAccessToFeaturePath]);
        }
      })
    );
  }
}
