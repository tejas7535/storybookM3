import { inject, Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

import {
  getMenuItem,
  MenuItem,
  MenuItemConfig,
} from '@gq/shared/ag-grid/cell-renderer/action-cells/menu-action-cell/model/menu-item.interface';
import { QuotationDetail } from '@gq/shared/models';
import { Rfq4Status } from '@gq/shared/models/quotation-detail/cost/rfq-4-status.enum';
import { SqvApprovalStatus } from '@gq/shared/models/quotation-detail/cost/sqv-approval-status.enum';
import { translate } from '@jsverse/transloco';

import { ApprovalProcessAction } from './models/approval-process-action.enum';
import { ProcessesModalDialogData } from './models/processes-modal-dialog-data.interface';
import { ProcessesModalWrapperComponent } from './processes-modal-wrapper/processes-modal-wrapper.component';

@Injectable({
  providedIn: 'root',
})
export class ModalConfigurationService {
  private readonly dialog: MatDialog = inject(MatDialog);

  // Constants for reusable menu item configurations
  private readonly SHOW_HISTORY: MenuItemConfig = {
    process: ApprovalProcessAction.SHOW_HISTORY,
    translationKey: 'showHistory',
  };

  private readonly CANCEL_PROCESS: MenuItemConfig = {
    process: ApprovalProcessAction.CANCEL,
    translationKey: 'cancelProcess',
    cssClass: '!text-error',
  };

  private readonly REOPEN_PROCESS: MenuItemConfig = {
    process: ApprovalProcessAction.REOPEN,
    translationKey: 'reopenProcess',
  };

  private readonly START_PROCESS: MenuItemConfig = {
    process: ApprovalProcessAction.START,
    translationKey: 'startProcess',
    disabled: this.isStartProcessDisabled.bind(this),
  };

  private readonly statusMenuConfig = new Map<Rfq4Status, MenuItemConfig[]>([
    [Rfq4Status.OPEN, [this.START_PROCESS, this.CANCEL_PROCESS]],
    [Rfq4Status.IN_PROGRESS, [this.SHOW_HISTORY, this.CANCEL_PROCESS]],
    [Rfq4Status.CONFIRMED, [this.SHOW_HISTORY, this.REOPEN_PROCESS]],
    [Rfq4Status.CANCELLED, [this.SHOW_HISTORY, this.REOPEN_PROCESS]],
  ]);

  getMenuItemsByStatus(
    status: Rfq4Status,
    quotationDetail: QuotationDetail
  ): MenuItem[] {
    const menuConfig = this.statusMenuConfig.get(status);

    // Dynamically generate menu items based on the configuration
    return menuConfig.map(({ process, translationKey, disabled, cssClass }) =>
      getMenuItem(
        () => this.openProcessDialog(process, quotationDetail),
        translate(`shared.openItemsTable.actionMenuItems.${translationKey}`),
        cssClass,
        disabled ? disabled(quotationDetail) : null
      )
    );
  }

  private openProcessDialog(
    process: ApprovalProcessAction,
    quotationDetail: QuotationDetail
  ): void {
    this.dialog.open(ProcessesModalWrapperComponent, {
      disableClose: true,
      width: process === ApprovalProcessAction.SHOW_HISTORY ? '784px' : '684px',
      data: {
        process,
        quotationDetail,
      } as ProcessesModalDialogData,
    });
  }

  private isStartProcessDisabled(quotationDetail: QuotationDetail): boolean {
    return (
      quotationDetail.detailCosts &&
      quotationDetail.detailCosts.sqvApprovalStatus ===
        SqvApprovalStatus.APPROVAL_NEEDED
    );
  }
}
