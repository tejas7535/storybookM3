import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

import { IStatusPanelParams } from '@ag-grid-community/all-modules';
import { translate } from '@ngneat/transloco';
import { Store } from '@ngrx/store';

import { removePositions } from '../../../core/store/actions';
import { getSapId } from '../../../core/store/selectors';
import { ConfirmationModalComponent } from '../../../shared/components/modal/confirmation-modal/confirmation-modal.component';
import { ConfirmationModalData } from '../../components/modal/confirmation-modal/models/confirmation-modal-data.model';
import { QuotationDetail } from '../../models/quotation-detail';

@Component({
  selector: 'gq-delete-items-button',
  templateUrl: './delete-items-button.component.html',
})
export class DeleteItemsButtonComponent implements OnInit {
  selections: any[] = [];
  toolPanelOpened: boolean;
  icon = 'delete';
  private params: IStatusPanelParams;
  sap: boolean;

  public constructor(
    private readonly store: Store,
    private readonly dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.store.select(getSapId).subscribe((value) => {
      this.sap = !!value;
    });
  }

  agInit(params: IStatusPanelParams): void {
    this.params = params;

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
      'processCaseView.confirmDeletePositions.text',
      { variable: gqPositionIds.length }
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
      icon: this.icon,
    };
    const dialogRef = this.dialog.open(ConfirmationModalComponent, {
      data,
      maxHeight: '80%',
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.store.dispatch(removePositions({ gqPositionIds }));
        this.selections = [];
      }
    });
  }
}
