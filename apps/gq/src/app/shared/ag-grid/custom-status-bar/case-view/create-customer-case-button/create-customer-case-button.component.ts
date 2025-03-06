import { Component, inject, OnDestroy } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';

import { AppRoutePath } from '@gq/app-route-path.enum';
import { CreateCustomerCaseComponent } from '@gq/case-view/case-creation/create-customer-case/create-customer-case.component';
import { FeatureToggleConfigService } from '@gq/shared/services/feature-toggle/feature-toggle-config.service';

@Component({
  selector: 'gq-create-customer-case-button',
  templateUrl: './create-customer-case-button.component.html',
  standalone: false,
})
export class CreateCustomerCaseButtonComponent implements OnDestroy {
  private readonly featureToggleConfigService: FeatureToggleConfigService =
    inject(FeatureToggleConfigService);
  private readonly dialog: MatDialog = inject(MatDialog);
  private readonly router: Router = inject(Router);

  agInit(): void {}
  createCustomerCase(): void {
    if (this.featureToggleConfigService.isEnabled('createCustomerCaseAsView')) {
      this.router.navigate([AppRoutePath.CreateCaseFromCustomerPath]);
    } else {
      this.dialog.open(CreateCustomerCaseComponent, {
        width: '70%',
        height: '95%',
      });
    }
  }
  ngOnDestroy(): void {
    this.dialog.closeAll();
  }
}
