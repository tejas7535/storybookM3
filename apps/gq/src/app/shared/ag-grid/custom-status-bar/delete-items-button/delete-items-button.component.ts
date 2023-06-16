import { Component } from '@angular/core';
import { MatLegacyDialog as MatDialog } from '@angular/material/legacy-dialog';

import { ActiveCaseActions } from '@gq/core/store/active-case/active-case.action';
import { ConfirmationModalComponent } from '@gq/shared/components/modal/confirmation-modal/confirmation-modal.component';
import { translate } from '@ngneat/transloco';
import { Store } from '@ngrx/store';
import { IStatusPanelParams } from 'ag-grid-community';

import { ConfirmationModalData } from '../../../components/modal/confirmation-modal/models/confirmation-modal-data.model';
import { Quotation, QuotationStatus } from '../../../models';
import { QuotationDetail } from '../../../models/quotation-detail';

@Component({
  selector: 'gq-delete-items-button',
  templateUrl: './delete-items-button.component.html',
})
export class DeleteItemsButtonComponent {
  selections: any[] = [];
  toolPanelOpened: boolean;
  icon = 'delete';
  private params: IStatusPanelParams;
  isSapQuotation: boolean;

  quotationStatus = QuotationStatus;

  public constructor(
    private readonly store: Store,
    private readonly dialog: MatDialog
  ) {}

  agInit(params: IStatusPanelParams): void {
    this.params = params;
    this.isSapQuotation =
      (params.context.quotation as Quotation).sapId !== undefined;
    this.params.api.addEventListener('gridReady', this.onGridReady.bind(this));
    this.params.api.addEventListener(
      'selectionChanged',
      this.onSelectionChange.bind(this)
    );
    this.params.api.addEventListener(
      'toolPanelVisibleChanged',
      this.onToolPanelVisibleChanged.bind(this)
    );
  }

  onGridReady(): void {
    this.selections = this.params.api.getSelectedRows();
  }

  onSelectionChange(): void {
    this.selections = this.params.api.getSelectedRows();
  }

  onToolPanelVisibleChanged(): void {
    this.toolPanelOpened = !!this.params.api.getOpenedToolPanel();
  }

  deletePositions(): void {
    const gqPositionIds: string[] = this.selections.map(
      (value: QuotationDetail) => value.gqPositionId
    );
    const displayText = translate(
      `processCaseView.confirmDeletePositions.${
        this.isSapQuotation ? `sapText` : `text`
      }`,
      { variable: gqPositionIds.length }
    );
    const infoText = translate(
      'processCaseView.confirmDeletePositions.infoText'
    );

    const confirmButton = translate(
      'processCaseView.confirmDeletePositions.deleteButton'
    );

    const cancelButton = translate(
      'processCaseView.confirmDeletePositions.cancelButton'
    );

    const data: ConfirmationModalData = {
      displayText,
      confirmButton,
      cancelButton,
      infoText,
      icon: this.icon,
    };
    const dialogRef = this.dialog.open(ConfirmationModalComponent, {
      data,
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.store.dispatch(
          ActiveCaseActions.removePositionsFromQuotation({ gqPositionIds })
        );
        this.selections = [];
      }
    });
  }
}
