import { Component, OnDestroy } from '@angular/core';

import { map, Observable, Subject, takeUntil } from 'rxjs';

import { ActiveCaseActions } from '@gq/core/store/active-case/active-case.action';
import {
  getIsQuotationStatusActive,
  getQuotationStatus,
  getSapId,
  getSimulationModeEnabled,
} from '@gq/core/store/active-case/active-case.selectors';
import { getTooltipTextKeyByQuotationStatus } from '@gq/shared/ag-grid/custom-status-bar/statusbar.utils';
import { QuotationStatus } from '@gq/shared/models';
import { Store } from '@ngrx/store';
import { IStatusPanelParams } from 'ag-grid-community';

import { QuotationDetail } from '../../../models/quotation-detail';

@Component({
  selector: 'gq-upload-quote-to-sap-button',
  templateUrl: './upload-quote-to-sap-button.component.html',
})
export class UploadQuoteToSapButtonComponent implements OnDestroy {
  selections: QuotationDetail[] = [];
  uploadDisabled = true;
  sapId$: Observable<string>;
  simulationModeEnabled$: Observable<boolean>;
  quotationActive$: Observable<boolean>;
  tooltipText$: Observable<string>;

  private params: IStatusPanelParams;
  private readonly QUOTATION_POSITION_UPLOAD_LIMIT = 1000;
  private readonly shutdown$$: Subject<void> = new Subject<void>();

  constructor(private readonly store: Store) {}

  agInit(params: IStatusPanelParams): void {
    this.params = params;
    this.params.api.addEventListener(
      'selectionChanged',
      this.onSelectionChange.bind(this)
    );
    this.sapId$ = this.store.select(getSapId);
    this.simulationModeEnabled$ = this.store.select(getSimulationModeEnabled);
    this.quotationActive$ = this.store.select(getIsQuotationStatusActive);

    this.tooltipText$ = this.getTooltipTextKey();
  }

  ngOnDestroy(): void {
    this.shutdown$$.next();
    this.shutdown$$.unsubscribe();
  }

  onSelectionChange(): void {
    this.selections = this.params.api.getSelectedRows();
    this.uploadDisabled =
      this.selections.length === 0 ||
      this.selections.length > this.QUOTATION_POSITION_UPLOAD_LIMIT;
  }

  uploadCaseToSap(): void {
    const gqPositionIds = this.selections.map(
      (item: QuotationDetail) => item.gqPositionId
    );

    this.store.dispatch(ActiveCaseActions.createSapQuote({ gqPositionIds }));
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
