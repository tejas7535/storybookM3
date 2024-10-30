import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatMenuItem } from '@angular/material/menu';

import { translate } from '@jsverse/transloco';

import { SharedTranslocoModule } from '@schaeffler/transloco';

import { AlertRulesService } from '../../../../../feature/alert-rules/alert-rules.service';
import { AlertRule } from '../../../../../feature/alert-rules/model';
import { RowMenuComponent } from '../../../../../shared/components/ag-grid/row-menu/row-menu.component';
import {
  errorsFromSAPtoMessage,
  singlePostResultToUserMessage,
} from '../../../../../shared/utils/error-handling';
import { SnackbarService } from '../../../../../shared/utils/service/snackbar.service';
import { AlertRuleDeleteSingleModalComponent } from '../modals/alert-rule-delete-single-modal/alert-rule-delete-single-modal.component';
import {
  AlertRuleEditSingleModalComponent,
  AlertRuleModalProps,
} from '../modals/alert-rule-edit-single-modal/alert-rule-edit-single-modal.component';

@Component({
  selector: 'app-alert-rule-table-row--menu-button',
  standalone: true,
  imports: [SharedTranslocoModule, RowMenuComponent, MatMenuItem],
  templateUrl: './alert-rule-table-row-menu-button.component.html',
  styleUrl: './alert-rule-table-row-menu-button.component.scss',
})
export class AlertRuleTableRowMenuButtonComponent extends RowMenuComponent<AlertRule> {
  constructor(
    private readonly snackBarService: SnackbarService,
    private readonly alertRulesService: AlertRulesService,
    private readonly dialog: MatDialog
  ) {
    super();
  }

  edit() {
    const dialogRef = this.dialog.open(AlertRuleEditSingleModalComponent, {
      data: {
        gridApi: this.params.api,
        alertRule: this.data,
        title: 'edit',
      } as AlertRuleModalProps,
      disableClose: true,
      autoFocus: false,
    });
    dialogRef.afterClosed().subscribe(() => {
      // TODO validate if anything changes through the modal --> if not return null and dont update the grid.
      this.handleClose();
    });
  }

  activate() {
    if (!this.data) {
      return;
    }

    const workflow = [{ ...this.data, deactivated: false }];
    this.alertRulesService
      .saveMultiAlertRules(workflow)
      .subscribe((postResult) => {
        const userMessage = singlePostResultToUserMessage(
          postResult,
          errorsFromSAPtoMessage,
          translate('alert_rules.action_menu_activated', {})
        );

        // TODO add variant like before... enqueueSnackbar(userMessage.message, { variant: userMessage.variant });
        this.snackBarService.openSnackBar(userMessage.message);

        if (userMessage.variant !== 'error') {
          this.updateData(workflow[0]);
          this.handleClose();
        }
      });
  }

  deactivate() {
    if (!this.data) {
      return;
    }
    // TODO check if this works... row data is not update and result is without deactivated true
    const workflow = [{ ...this.data, deactivated: true }];
    this.alertRulesService
      .saveMultiAlertRules(workflow)
      .subscribe((postResult) => {
        const userMessage = singlePostResultToUserMessage(
          postResult,
          errorsFromSAPtoMessage,
          translate('alert_rules.action_menu_deactivated', {})
        );

        // TODO add variant like before... enqueueSnackbar(userMessage.message, { variant: userMessage.variant });
        this.snackBarService.openSnackBar(userMessage.message);

        if (userMessage.variant !== 'error') {
          this.updateData(workflow[0]);
          this.handleClose();
        }
      });
  }

  delete() {
    this.dialog.open(AlertRuleDeleteSingleModalComponent, {
      data: { gridApi: this.params.api, alertRule: this.data },
      disableClose: true,
    });
  }
}
