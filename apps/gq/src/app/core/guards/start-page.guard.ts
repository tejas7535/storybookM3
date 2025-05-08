import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { combineLatest, tap } from 'rxjs';

import { AppRoutePath } from '@gq/app-route-path.enum';
import { CalculatorPaths } from '@gq/calculator/routing/calculator-routes';

import { RolesFacade } from '../store/facades';

@Injectable({
  providedIn: 'root',
})
export class StartPageGuard {
  private readonly router: Router = inject(Router);
  private readonly rolesFacade: RolesFacade = inject(RolesFacade);
  canActivate() {
    combineLatest([
      this.rolesFacade.userIsCalculator$,
      this.rolesFacade.userIsSalesUser$,
    ])
      .pipe(
        tap(([isCalculator, isSalesUser]) => {
          if (!isCalculator && !isSalesUser) {
            this.router.navigate([AppRoutePath.ForbiddenPath]);
            // CaseOverview is the default page for all users that have salesRoles
          } else if (isSalesUser) {
            this.router.navigate([AppRoutePath.CaseViewPath]);
          } else if (isCalculator) {
            this.router.navigate([CalculatorPaths.CalculatorOverviewPath]);
          }
        })
      )
      .subscribe();
  }
}
