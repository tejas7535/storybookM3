import { Component, DestroyRef, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatDialog } from '@angular/material/dialog';

import { combineLatest, map, Observable } from 'rxjs';

import { ActiveCaseFacade } from '@gq/core/store/active-case/active-case.facade';
import { getTooltipTextKeyByQuotationStatus } from '@gq/shared/ag-grid/custom-status-bar/statusbar.utils';
import { ConfirmationModalComponent } from '@gq/shared/components/modal/confirmation-modal/confirmation-modal.component';
import { QuotationStatus } from '@gq/shared/models';
import { translate } from '@jsverse/transloco';
import { IStatusPanelParams } from 'ag-grid-community';

import { ConfirmationModalData } from '../../../components/modal/confirmation-modal/models/confirmation-modal-data.model';
import {
  QuotationDetail,
  SAP_SYNC_STATUS,
} from '../../../models/quotation-detail';

@Component({
  selector: 'gq-selection-to-sap',
  templateUrl: './upload-selection-to-sap-button.component.html',
})
export class UploadSelectionToSapButtonComponent {
  private params: IStatusPanelParams;
  private readonly QUOTATION_POSITION_UPLOAD_LIMIT = 1000;
  private readonly activeCaseFacade = inject(ActiveCaseFacade);
  private readonly destroyRef = inject(DestroyRef);
  private readonly dialog: MatDialog = inject(MatDialog);

  selections: any[] = [];
  uploadDisabled = true;
  icon = 'cloud_upload';
  tooltipText$: Observable<string>;

  sapId$: Observable<string> = this.activeCaseFacade.quotationSapId$;
  simulationModeEnabled$: Observable<boolean> =
    this.activeCaseFacade.simulationModeEnabled$;
  quotationActive$: Observable<boolean> =
    this.activeCaseFacade.isQuotationStatusActive$;
  quotationEditable$: Observable<boolean> =
    this.activeCaseFacade.canEditQuotation$;

  agInit(params: IStatusPanelParams): void {
    this.params = params;
    this.params.api.addEventListener('gridReady', this.onGridReady.bind(this));
    this.params.api.addEventListener(
      'selectionChanged',
      this.onSelectionChange.bind(this)
    );

    this.tooltipText$ = this.getTooltipTextKey();
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
    const title = translate('processCaseView.confirmUpdatePositions.text', {
      variable: gqPositionIds.length,
    });
    const confirmButtonText = translate(
      'processCaseView.confirmUpdatePositions.updateButton'
    ).toUpperCase();

    const cancelButtonText = translate(
      'processCaseView.confirmUpdatePositions.cancelButton'
    ).toUpperCase();

    const data: ConfirmationModalData = {
      title,
      confirmButtonText,
      cancelButtonText,
      confirmButtonIcon: this.icon,
    };

    const dialogRef = this.dialog.open(ConfirmationModalComponent, {
      data,
      maxHeight: '80%',
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.activeCaseFacade.uploadSelectionToSap(gqPositionIds);
        this.selections = [];
      }
    });
  }

  private getTooltipTextKey(): Observable<string> {
    return combineLatest([
      this.activeCaseFacade.quotationStatus$,
      this.activeCaseFacade.quotationSapSyncStatus$,
    ]).pipe(
      takeUntilDestroyed(this.destroyRef),
      map(
        ([quotationStatus, sapSyncStatus]: [
          QuotationStatus,
          SAP_SYNC_STATUS,
        ]) =>
          getTooltipTextKeyByQuotationStatus(
            quotationStatus,
            this.selections.length,
            this.QUOTATION_POSITION_UPLOAD_LIMIT,
            sapSyncStatus
          )
      )
    );
  }
}
