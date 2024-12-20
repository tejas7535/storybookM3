import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

import { combineLatest, map, Observable, of } from 'rxjs';

import { CreateCaseFacade } from '@gq/core/store/create-case/create-case.facade';
import { FeatureToggleConfigService } from '@gq/shared/services/feature-toggle/feature-toggle-config.service';
import { PushPipe } from '@ngrx/component';

import { SharedTranslocoModule } from '@schaeffler/transloco';

@Component({
  selector: 'gq-create-case-reset-all-button',
  standalone: true,
  imports: [MatButtonModule, SharedTranslocoModule, MatIconModule, PushPipe],
  templateUrl: './create-case-reset-all-button.component.html',
})
export class CreateCaseResetAllButtonComponent {
  private readonly createCaseFacade = inject(CreateCaseFacade);
  private readonly featureToggleConfig = inject(FeatureToggleConfigService);

  buttonDisabled$: Observable<boolean> = combineLatest([
    of(this.featureToggleConfig.isEnabled('createManualCaseAsView')),
    this.createCaseFacade.customerIdForCaseCreation$,
  ]).pipe(
    map(
      ([isCreateManualCaseAsView, customerId]) =>
        isCreateManualCaseAsView && !customerId
    )
  );

  agInit(): void {}
  resetAll(): void {
    this.createCaseFacade.clearCreateCaseRowData();
  }
}
