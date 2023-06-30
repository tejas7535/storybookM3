import { Component } from '@angular/core';
import { MatLegacyDialog as MatDialog } from '@angular/material/legacy-dialog';

import { Observable } from 'rxjs';

import {
  ActiveCaseActions,
  getIsQuotationActive,
  getSapId,
  getSimulationModeEnabled,
} from '@gq/core/store/active-case';
import { ConfirmationModalComponent } from '@gq/shared/components/modal/confirmation-modal/confirmation-modal.component';
import { translate } from '@ngneat/transloco';
import { Store } from '@ngrx/store';
import { IStatusPanelParams } from 'ag-grid-community';

import { ConfirmationModalData } from '../../../components/modal/confirmation-modal/models/confirmation-modal-data.model';
import { QuotationDetail } from '../../../models/quotation-detail';

@Component({
  selector: 'gq-selection-to-sap',
  templateUrl: './upload-selection-to-sap-button.component.html',
})
export class UploadSelectionToSapButtonComponent {
  sapId$: Observable<string>;
  selections: any[] = [];
  uploadDisabled = true;

  icon = 'cloud_upload';
  simulationModeEnabled$: Observable<boolean>;
  quotationActive$: Observable<boolean>;

  private params: IStatusPanelParams;
  private readonly QUOTATION_POSITION_UPLOAD_LIMIT = 1000;

  constructor(
    private readonly store: Store,
    private readonly dialog: MatDialog
  ) {
    this.sapId$ = this.store.select(getSapId);
  }

  agInit(params: IStatusPanelParams): void {
    this.params = params;
    this.simulationModeEnabled$ = this.store.select(getSimulationModeEnabled);

    this.params.api.addEventListener('gridReady', this.onGridReady.bind(this));
    this.params.api.addEventListener(
      'selectionChanged',
      this.onSelectionChange.bind(this)
    );

    this.quotationActive$ = this.store.select(getIsQuotationActive);
  }
  onGridReady(): void {
    this.selections = this.params.api.getSelectedRows();
  }

  onSelectionChange(): void {
    this.selections = this.params.api.getSelectedRows();
    this.uploadDisabled =
      this.selections.length === 0 ||
      this.selections.length > this.QUOTATION_POSITION_UPLOAD_LIMIT;
  }

  uploadSelectionToSap(): void {
    const gqPositionIds = this.selections.map(
      (val: QuotationDetail) => val.gqPositionId
    );
    const displayText = translate(
      'processCaseView.confirmUploadPositions.text',
      { variable: gqPositionIds.length }
    );
    const confirmButton = translate(
      'processCaseView.confirmUploadPositions.uploadButton'
    ).toUpperCase();

    const cancelButton = translate(
      'processCaseView.confirmUploadPositions.cancelButton'
    ).toUpperCase();

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
        this.store.dispatch(
          ActiveCaseActions.uploadSelectionToSap({ gqPositionIds })
        );
        this.selections = [];
      }
    });
  }
}
