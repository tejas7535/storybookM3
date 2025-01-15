import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { MatButton } from '@angular/material/button';
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle,
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
  standalone: true,
  imports: [
    CommonModule,
    SharedTranslocoModule,
    MatDialogTitle,
    MatDialogContent,
    MatDialogActions,
    MatButton,
    MatDialogClose,
  ],
  templateUrl: './alert-rule-delete-single-modal.component.html',
})
export class AlertRuleDeleteSingleModalComponent {
  constructor(
    private readonly snackBarService: SnackbarService,
    private readonly alertRuleService: AlertRulesService,
    @Inject(MAT_DIALOG_DATA)
    public data: { gridApi: GridApi; alertRule: AlertRule },
    public dialogRef: MatDialogRef<AlertRuleDeleteSingleModalComponent>
  ) {}

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

          this.snackBarService.openSnackBar(userMessage.message);
          // TODO implement with variant...
          // enqueueSnackbar(userMessage.message, { variant: userMessage.variant });

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
