import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIcon } from '@angular/material/icon';

import { translate } from '@jsverse/transloco';
import { AgGridModule } from 'ag-grid-angular';

import { LoadingSpinnerModule } from '@schaeffler/loading-spinner';
import { SharedTranslocoModule } from '@schaeffler/transloco';

import { ActionButtonComponent } from '../../../../../../shared/components/action-button/action-button.component';
import { AbstractAlertRuleMultiModalComponent } from '../abstract-alert-rule-multi-modal.component';

@Component({
  selector: 'd360-alert-rule-delete-multi-modal',
  standalone: true,
  imports: [
    CommonModule,
    SharedTranslocoModule,
    AgGridModule,
    MatDialogModule,
    MatIcon,
    MatButtonModule,
    ActionButtonComponent,
    LoadingSpinnerModule,
  ],
  templateUrl:
    './../../../../../../shared/components/table-upload-modal/abstract-table-upload-modal.component.html',
  styleUrl:
    './../../../../../../shared/components/table-upload-modal/abstract-table-upload-modal.component.scss',
})
export class AlertRuleDeleteMultiModalComponent extends AbstractAlertRuleMultiModalComponent {
  /** @inheritdoc */
  protected title = translate('alert_rules.multi_modal.delete_rules');

  /** @inheritdoc */
  protected modalMode: 'save' | 'delete' = 'delete';

  /** @inheritdoc */
  protected apiCall = this.alertRuleService.deleteMultiAlterRules.bind(
    this.alertRuleService
  );
}
