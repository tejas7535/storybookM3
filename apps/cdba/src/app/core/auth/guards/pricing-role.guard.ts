import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

import { AppRoutePath } from '../../../app-route-path.enum';
import { EmptyStatesPath } from '../../empty-states/empty-states-path.enum';
import { RoleFacade } from '../role.facade';

@Injectable({
  providedIn: 'root',
})
export class PricingRoleGuard {
  constructor(
    private readonly router: Router,
    private readonly roleFacade: RoleFacade
  ) {}

  canActivateChild(): Observable<boolean> {
    return this.roleFacade.hasAnyPricingRole$.pipe(
      tap(async (hasAnyPricingRole) => {
        if (!hasAnyPricingRole) {
          await this.router.navigate([
            AppRoutePath.EmptyStatesPath,
            EmptyStatesPath.ForbiddenPath,
          ]);
        }
      })
    );
  }
}
