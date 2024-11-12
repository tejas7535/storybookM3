import { CommonModule } from '@angular/common';
import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';

import { Store } from '@ngrx/store';

import { getBackendRoles } from '@schaeffler/azure-auth';

import { PlanningView } from '../../../../../feature/demand-validation/planning-view';
import { ActionButtonComponent } from '../../../../../shared/components/action-button/action-button.component';
import {
  checkRoles,
  demandValidationChangeAllowedRoles,
} from '../../../../../shared/utils/auth/roles';

@Component({
  selector: 'd360-action-buttons-demand-validation',
  standalone: true,
  imports: [CommonModule, ActionButtonComponent],
  templateUrl: './action-buttons-demand-validation.component.html',
  styleUrl: './action-buttons-demand-validation.component.scss',
})
export class ActionButtonsDemandValidationComponent implements OnChanges {
  @Input({ required: true }) planningView: PlanningView;

  protected authorizedToChange: boolean;
  protected disableUpload = true;

  constructor(private readonly store: Store) {
    // eslint-disable-next-line ngrx/no-store-subscription
    this.store.select(getBackendRoles).subscribe((roles) => {
      this.authorizedToChange = checkRoles(
        roles,
        demandValidationChangeAllowedRoles
      );
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.planningView) {
      this.disableUpload = this.planningView !== PlanningView.REQUESTED;
    }
  }

  handleDownloadButtonClicked() {
    // TODO implement
  }

  handleListModalClicked() {
    // TODO implement
  }

  handleGridModalClicked() {
    // TODO implement
  }

  handleDeleteModalClicked() {
    // TODO implement
  }
}
