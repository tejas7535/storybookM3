import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { map, Observable, tap } from 'rxjs';

import { AppRoutePath } from '@gq/app-route-path.enum';
import { RolesFacade } from '@gq/core/store/facades';
import { FeatureToggleConfigService } from '@gq/shared/services/feature-toggle/feature-toggle-config.service';

@Injectable({
  providedIn: 'root',
})
export class Rfq4OverviewGuard {
  private readonly router: Router = inject(Router);
  private readonly featureToggleService: FeatureToggleConfigService = inject(
    FeatureToggleConfigService
  );

  private readonly rolesFacade: RolesFacade = inject(RolesFacade);

  canActivate(): Observable<boolean> {
    const isEnabled = this.featureToggleService.isEnabled('calculatorOverview');

    return this.rolesFacade.userIsCalculator$.pipe(
      map((isCalculator) => isCalculator && isEnabled),
      tap((isAllowed) => {
        if (!isAllowed) {
          this.router.navigate([AppRoutePath.ForbiddenPath]);
        }
      })
    );
  }

  canActivateChild(): Observable<boolean> {
    return this.canActivate();
  }
}
