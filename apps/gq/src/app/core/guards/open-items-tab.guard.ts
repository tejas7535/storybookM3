import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { AppRoutePath } from '@gq/app-route-path.enum';
import { FeatureToggleConfigService } from '@gq/shared/services/feature-toggle/feature-toggle-config.service';

@Injectable({
  providedIn: 'root',
})
export class OpenItemsTabGuard {
  private readonly router: Router = inject(Router);
  private readonly featureToggleService: FeatureToggleConfigService = inject(
    FeatureToggleConfigService
  );

  canActivate(): boolean {
    const isEnabled = this.featureToggleService.isEnabled('openItemsTab');
    if (!isEnabled) {
      this.router.navigate([AppRoutePath.ForbiddenPath]);
    }

    return isEnabled;
  }
}
