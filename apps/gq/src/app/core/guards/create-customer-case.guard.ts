import { inject, Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  Router,
  RouterStateSnapshot,
} from '@angular/router';

import { AppRoutePath } from '@gq/app-route-path.enum';
import { FeatureToggleConfigService } from '@gq/shared/services/feature-toggle/feature-toggle-config.service';

@Injectable({
  providedIn: 'root',
})
export class CreateCustomerCaseGuard {
  private readonly router: Router = inject(Router);
  private readonly featureToggleService: FeatureToggleConfigService = inject(
    FeatureToggleConfigService
  );

  canActivateChild(
    _childRoute: ActivatedRouteSnapshot,
    _state: RouterStateSnapshot
  ): boolean {
    const isEnabled = this.featureToggleService.isEnabled(
      'createCustomerCaseAsView'
    );
    if (!isEnabled) {
      this.router.navigate([AppRoutePath.ForbiddenPath]);
    }

    return isEnabled;
  }
}
