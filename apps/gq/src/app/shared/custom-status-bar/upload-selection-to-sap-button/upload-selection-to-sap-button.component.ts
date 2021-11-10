import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

import { Observable } from 'rxjs';

import { IStatusPanelParams } from '@ag-grid-community/all-modules';
import { translate } from '@ngneat/transloco';
import { Store } from '@ngrx/store';

import { getSapId, uploadSelectionToSap } from '../../../core/store';
import { ConfirmationModalComponent } from '../../confirmation-modal/confirmation-modal.component';
import { QuotationDetail } from '../../models/quotation-detail';

@Component({
  selector: 'gq-selection-to-sap',
  templateUrl: './upload-selection-to-sap-button.component.html',
})
export class UploadSelectionToSapButtonComponent {
  public sapId$: Observable<string>;
  public selections: any[] = [];
  private params: IStatusPanelParams;

  agInit(params: IStatusPanelParams): void {
    this.params = params;

    this.params.api.addEventListener('gridReady', this.onGridReady.bind(this));
    this.params.api.addEventListener(
      'selectionChanged',
      this.onSelectionChange.bind(this)
    );
  }
  onGridReady(): void {
    this.selections = this.params.api.getSelectedRows();
  }

  onSelectionChange(): void {
    this.selections = this.params.api.getSelectedRows();
  }

  constructor(
    private readonly store: Store,
    private readonly dialog: MatDialog
  ) {
    this.sapId$ = this.store.select(getSapId);
  }

  uploadSelectionToSap(): void {
    const gqPositionIds = this.selections.map(
      (val: QuotationDetail) => val.gqPositionId
    );
    const displayText = translate(
      'processCaseView.confirmUploadPositions.text',
      { variable: gqPositionIds.length }
    );

    const confirmButton = (
      translate('processCaseView.confirmUploadPositions.uploadButton') as string
    ).toUpperCase();

    const cancelButton = (
      translate('processCaseView.confirmUploadPositions.cancelButton') as string
    ).toUpperCase();

    const dialogRef = this.dialog.open(ConfirmationModalComponent, {
      width: '80%',
      maxHeight: '80%',
      data: { displayText, confirmButton, cancelButton },
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.store.dispatch(uploadSelectionToSap({ gqPositionIds }));
        this.selections = [];
      }
    });
  }
}
