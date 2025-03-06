import { Component, inject, OnDestroy } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';

import { AppRoutePath } from '@gq/app-route-path.enum';
import { CreateManualCaseComponent } from '@gq/case-view/case-creation/create-manual-case/create-manual-case.component';
import { FeatureToggleConfigService } from '@gq/shared/services/feature-toggle/feature-toggle-config.service';

@Component({
  selector: 'gq-create-manual-case',
  templateUrl: './create-manual-case-button.component.html',
  standalone: false,
})
export class CreateManualCaseButtonComponent implements OnDestroy {
  private readonly featureToggleConfigService: FeatureToggleConfigService =
    inject(FeatureToggleConfigService);
  private readonly dialog: MatDialog = inject(MatDialog);
  private readonly router: Router = inject(Router);

  agInit(): void {}

  createManualCase(): void {
    if (this.featureToggleConfigService.isEnabled('createManualCaseAsView')) {
      this.router.navigate([AppRoutePath.CreateManualCasePath]);
    } else {
      this.dialog.open(CreateManualCaseComponent, {
        width: '70%',
        height: '95%',
        panelClass: 'create-manual-case-modal',
      });
    }
  }
  ngOnDestroy(): void {
    this.dialog.closeAll();
  }
}
