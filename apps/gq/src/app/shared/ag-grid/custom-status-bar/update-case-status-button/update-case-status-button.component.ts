import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

import { translate } from '@ngneat/transloco';
import { Store } from '@ngrx/store';

import { updateCaseStatus } from '../../../../core/store';
import { ConfirmationModalComponent } from '../../../components/modal/confirmation-modal/confirmation-modal.component';
import { ConfirmationModalData } from '../../../components/modal/confirmation-modal/models/confirmation-modal-data.model';
import { IdValue } from '../../../components/modal/confirmation-modal/models/id-value.model';
import { ExtendedStatusPanelComponentParams } from '../../../models';
import { QuotationStatus, ViewQuotation } from '../../../models/quotation';

@Component({
  selector: 'gq-update-case-status-button',
  templateUrl: './update-case-status-button.component.html',
})
export class UpdateCaseStatusButtonComponent {
  public isOnlyVisibleOnSelection = false;
  public hasPanelCaption = true;
  public panelCaption = '';
  public panelIcon = '';
  public classes = '';
  public buttonColor = '';
  public buttonType = '';
  public showDialog = false;
  public selections: ViewQuotation[] = [];

  private params: ExtendedStatusPanelComponentParams;

  constructor(
    private readonly store: Store,
    private readonly dialog: MatDialog
  ) {}

  agInit(params: ExtendedStatusPanelComponentParams): void {
    this.params = params;
    this.isOnlyVisibleOnSelection =
      this.params.isOnlyVisibleOnSelection ?? false;
    this.hasPanelCaption = this.params.hasPanelCaption ?? true;
    this.panelCaption = translate(
      `shared.customStatusBar.buttons.panelButtons.${QuotationStatus[
        this.params.quotationStatus
      ].toLowerCase()}`
    );
    this.panelIcon = this.params.panelIcon ?? '';
    this.classes = this.params.classes ?? '';
    this.buttonColor = this.params.buttonColor ?? 'primary';
    this.buttonType = this.params.buttonType ?? 'mat-stroked-button';
    this.showDialog = this.params.showDialog ?? false;

    this.params.api.addEventListener(
      'selectionChanged',
      this.onSelectionChange.bind(this)
    );
  }
  onSelectionChange(): void {
    this.selections = this.params.api.getSelectedRows();
  }

  updateStatus(): void {
    const list: IdValue[] = this.selections.map((item: ViewQuotation) => ({
      id: item.customerName,
      value: item.gqId,
    }));

    if (this.showDialog) {
      this.updateAndShowConfirmDialog(list);
    } else {
      this.update(list.map((item) => item.value));
    }
  }

  /**
   * update the status of the case with confirmation dialog
   *
   * @param list list of gqIds
   */
  private updateAndShowConfirmDialog(list: IdValue[]) {
    const displayText = translate(
      `caseView.confirmDialog.displayText.${QuotationStatus[
        this.params.quotationStatus
      ].toLowerCase()}`,
      {
        variable: list.length,
      }
    );

    const confirmButton = translate(
      `caseView.confirmDialog.confirmButton.${QuotationStatus[
        this.params.quotationStatus
      ].toLowerCase()}`
    );
    const cancelButton = translate(
      `caseView.confirmDialog.cancelButton.${QuotationStatus[
        this.params.quotationStatus
      ].toLowerCase()}`
    );

    const data: ConfirmationModalData = {
      displayText,
      confirmButton,
      cancelButton,
      list,
      icon: this.params.confirmDialogIcon,
    };
    const dialogRef = this.dialog.open(ConfirmationModalComponent, {
      maxHeight: '80%',
      width: '40%',
      data,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        const gqIds = list.map((el) => el.value);
        this.update(gqIds);
      }
    });
  }

  /**
   * update the status of cases without confirmation dialog
   *
   * @param gqIds list of gqIds
   */
  private update(gqIds: number[]) {
    this.store.dispatch(
      updateCaseStatus({ gqIds, status: this.params.quotationStatus })
    );
  }
}
