import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { MatButton } from '@angular/material/button';
import {
  MAT_DIALOG_DATA,
  MatDialogClose,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';

import { tap } from 'rxjs';

import { translate } from '@jsverse/transloco';
import { GridApi } from 'ag-grid-enterprise';

import { SharedTranslocoModule } from '@schaeffler/transloco';

import { AlertRulesService } from '../../../../../../feature/alert-rules/alert-rules.service';
import { AlertRule } from '../../../../../../feature/alert-rules/model';
import {
  errorsFromSAPtoMessage,
  singlePostResultToUserMessage,
} from '../../../../../../shared/utils/error-handling';
import { SnackbarService } from '../../../../../../shared/utils/service/snackbar.service';

@Component({
  selector: 'd360-alert-rule-delete-single-modal',
  imports: [
    CommonModule,
    SharedTranslocoModule,
    MatDialogModule,
    MatButton,
    MatDialogClose,
  ],
  templateUrl: './alert-rule-delete-single-modal.component.html',
})
export class AlertRuleDeleteSingleModalComponent {
  private readonly snackbarService: SnackbarService = inject(SnackbarService);
  private readonly alertRuleService: AlertRulesService =
    inject(AlertRulesService);
  public data: { gridApi: GridApi; alertRule: AlertRule } =
    inject(MAT_DIALOG_DATA);
  public dialogRef: MatDialogRef<AlertRuleDeleteSingleModalComponent> = inject(
    MatDialogRef<AlertRuleDeleteSingleModalComponent>
  );

  protected deleteEntry() {
    if (!this.data.alertRule) {
      return;
    }
    this.alertRuleService
      .deleteSingleAlterRule(this.data.alertRule)
      .pipe(
        tap((response) => {
          const userMessage = singlePostResultToUserMessage(
            response,
            errorsFromSAPtoMessage,
            translate('alert_rules.action_menu_deleted', {})
          );

          this.snackbarService.show(
            userMessage.message,
            undefined,
            undefined,
            userMessage.variant as any
          );

          if (userMessage.variant !== 'error') {
            this.data.gridApi.applyTransaction({
              remove: [this.data.alertRule],
            });
            this.dialogRef.close();
          }
        })
      )
      .subscribe();
  }
}
