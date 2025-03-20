import { Component, DestroyRef, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
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
  selector: 'd360-alert-rule-table-row--menu-button',
  imports: [SharedTranslocoModule, RowMenuComponent, MatMenuItem],
  templateUrl: './alert-rule-table-row-menu-button.component.html',
})
export class AlertRuleTableRowMenuButtonComponent extends RowMenuComponent<AlertRule> {
  private readonly snackBarService: SnackbarService = inject(SnackbarService);
  private readonly alertRulesService: AlertRulesService =
    inject(AlertRulesService);
  private readonly dialog: MatDialog = inject(MatDialog);
  private readonly destroyRef: DestroyRef = inject(DestroyRef);

  protected edit(): void {
    this.dialog
      .open(AlertRuleEditSingleModalComponent, {
        data: {
          gridApi: this.params.api,
          alertRule: this.data,
          title: 'edit',
        } as AlertRuleModalProps,
        disableClose: true,
        autoFocus: false,
      })
      .afterClosed()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => this.handleClose());
  }

  protected activate(): void {
    if (!this.data) {
      return;
    }

    const workflow = [{ ...this.data, deactivated: false }];
    this.alertRulesService
      .saveMultiAlertRules(workflow)
      .pipe(takeUntilDestroyed(this.destroyRef))
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

  protected deactivate(): void {
    if (!this.data) {
      return;
    }

    const workflow = [{ ...this.data, deactivated: true }];
    this.alertRulesService
      .saveMultiAlertRules(workflow)
      .pipe(takeUntilDestroyed(this.destroyRef))
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

  protected delete(): void {
    this.dialog.open(AlertRuleDeleteSingleModalComponent, {
      data: { gridApi: this.params.api, alertRule: this.data },
      disableClose: true,
    });
  }
}
