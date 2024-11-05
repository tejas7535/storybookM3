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
  selector: 'app-alert-rule-edit-multi-modal',
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
export class AlertRuleEditMultiModalComponent extends AbstractAlertRuleMultiModalComponent {
  /** @inheritdoc */
  protected title = translate('alert_rules.multi_modal.new_rules');

  /** @inheritdoc */
  protected modalMode: 'save' | 'delete' = 'save';

  /** @inheritdoc */
  protected apiCall = this.alertRuleService.saveMultiAlertRules.bind(
    this.alertRuleService
  );
}
