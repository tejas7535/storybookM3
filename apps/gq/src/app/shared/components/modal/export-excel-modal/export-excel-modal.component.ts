import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

import { combineLatest, Observable, Subscription } from 'rxjs';
import { map, pairwise } from 'rxjs/operators';

import { Store } from '@ngrx/store';

import { ApplicationInsightsService } from '@schaeffler/application-insights';

import {
  getGqId,
  loadExtendedSapPriceConditionDetails,
} from '../../../../core/store';
import { loadExtendedComparableLinkedTransaction } from '../../../../core/store/actions/extended-comparable-linked-transactions/extended-comparable-linked-transactions.actions';
import {
  getExtendedComparableLinkedTransactionsErrorMessage,
  getExtendedComparableLinkedTransactionsLoading,
} from '../../../../core/store/selectors/extended-comparable-linked-transactions/extended-comparable-linked-transactions.selector';
import { EVENT_NAMES, ExcelDonwloadParams } from '../../../models';
import { ExportExcel } from './export-excel.enum';

@Component({
  templateUrl: './export-excel-modal.component.html',
  styleUrls: ['export-excel-modal.component.scss'],
})
export class ExportExcelModalComponent implements OnInit, OnDestroy {
  exportExcelOption = ExportExcel.DETAILED_DOWNLOAD;
  ExportExcel = ExportExcel;
  transactionsLoading$: Observable<boolean>;
  private readonly subscription: Subscription = new Subscription();
  gQId: number;

  constructor(
    private readonly store: Store,
    private readonly insightsService: ApplicationInsightsService,
    public dialogRef: MatDialogRef<ExportExcelModalComponent>
  ) {}

  cancelDownload() {
    this.dialogRef.close();
    this.insightsService.logEvent(EVENT_NAMES.EXCEL_DOWNLOAD_MODAL_CANCELLED);
  }

  closeDialog() {
    this.dialogRef.close(this.exportExcelOption);
    this.insightsService.logEvent(EVENT_NAMES.EXCEL_DOWNLOADED, {
      type: this.exportExcelOption,
    } as ExcelDonwloadParams);
  }

  ngOnInit(): void {
    this.store.select(getGqId).subscribe((gqId) => (this.gQId = gqId));
    this.transactionsLoading$ = this.store.select(
      getExtendedComparableLinkedTransactionsLoading
    );
    const loadingStopped$ = this.transactionsLoading$.pipe(
      pairwise(),
      map(([preVal, curVal]) => preVal && !curVal)
    );
    const isErrorMessage$ = this.store.select(
      getExtendedComparableLinkedTransactionsErrorMessage
    );
    this.addSubscription(isErrorMessage$, loadingStopped$);

    this.insightsService.logEvent(EVENT_NAMES.EXCEL_DOWNLOAD_MODAL_OPENED);
  }

  addSubscription(
    errorMessage$: Observable<string>,
    loadingStopped$: Observable<boolean>
  ) {
    this.subscription.add(
      combineLatest([errorMessage$, loadingStopped$]).subscribe(
        ([errorMessage, loadingStopped]) => {
          if (!errorMessage && loadingStopped) {
            this.closeDialog();
          }
        }
      )
    );
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  fetchTransactions(): void {
    if (this.exportExcelOption === ExportExcel.DETAILED_DOWNLOAD) {
      this.store.dispatch(
        loadExtendedComparableLinkedTransaction({
          quotationNumber: this.gQId,
        })
      );

      this.store.dispatch(
        loadExtendedSapPriceConditionDetails({
          quotationNumber: this.gQId,
        })
      );
    } else if (this.exportExcelOption === ExportExcel.BASIC_DOWNLOAD) {
      this.closeDialog();
    }
  }
}
