import { Component, OnDestroy } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

import { map, Observable, Subject, takeUntil } from 'rxjs';

import { ActiveCaseActions } from '@gq/core/store/active-case/active-case.action';
import {
  getIsQuotationStatusActive,
  getQuotationStatus,
  getSapId,
  getSimulationModeEnabled,
} from '@gq/core/store/active-case/active-case.selectors';
import { getTooltipTextKeyByQuotationStatus } from '@gq/shared/ag-grid/custom-status-bar/statusbar.utils';
import { ConfirmationModalComponent } from '@gq/shared/components/modal/confirmation-modal/confirmation-modal.component';
import { QuotationStatus } from '@gq/shared/models';
import { translate } from '@jsverse/transloco';
import { Store } from '@ngrx/store';
import { IStatusPanelParams } from 'ag-grid-community';

import { ConfirmationModalData } from '../../../components/modal/confirmation-modal/models/confirmation-modal-data.model';
import { QuotationDetail } from '../../../models/quotation-detail';

@Component({
  selector: 'gq-selection-to-sap',
  templateUrl: './upload-selection-to-sap-button.component.html',
})
export class UploadSelectionToSapButtonComponent implements OnDestroy {
  sapId$: Observable<string>;
  selections: any[] = [];
  uploadDisabled = true;

  icon = 'cloud_upload';
  simulationModeEnabled$: Observable<boolean>;
  quotationActive$: Observable<boolean>;
  tooltipText$: Observable<string>;

  private params: IStatusPanelParams;
  private readonly QUOTATION_POSITION_UPLOAD_LIMIT = 1000;
  private readonly shutdown$$: Subject<void> = new Subject<void>();

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

    this.quotationActive$ = this.store.select(getIsQuotationStatusActive);
    this.tooltipText$ = this.getTooltipTextKey();
  }

  ngOnDestroy(): void {
    this.shutdown$$.next();
    this.shutdown$$.unsubscribe();
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
      'processCaseView.confirmUpdatePositions.text',
      { variable: gqPositionIds.length }
    );
    const confirmButton = translate(
      'processCaseView.confirmUpdatePositions.updateButton'
    ).toUpperCase();

    const cancelButton = translate(
      'processCaseView.confirmUpdatePositions.cancelButton'
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

  private getTooltipTextKey(): Observable<string> {
    return this.store.select(getQuotationStatus).pipe(
      takeUntil(this.shutdown$$),
      map((quotationStatus: QuotationStatus) =>
        getTooltipTextKeyByQuotationStatus(
          quotationStatus,
          this.selections.length,
          this.QUOTATION_POSITION_UPLOAD_LIMIT
        )
      )
    );
  }
}
