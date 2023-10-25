import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import {
  MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA,
  MatLegacyDialogRef as MatDialogRef,
} from '@angular/material/legacy-dialog';

import { combineLatest, Observable, Subscription } from 'rxjs';
import { map, pairwise } from 'rxjs/operators';

import {
  loadExtendedComparableLinkedTransaction,
  loadExtendedSapPriceConditionDetails,
} from '@gq/core/store/actions';
import {
  getExtendedComparableLinkedTransactionsErrorMessage,
  getExtendedComparableLinkedTransactionsLoading,
} from '@gq/core/store/selectors';
import { Store } from '@ngrx/store';

import { ApplicationInsightsService } from '@schaeffler/application-insights';

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
  extendedDownloadEnabled = true;

  private readonly subscription: Subscription = new Subscription();

  constructor(
    private readonly store: Store,
    private readonly insightsService: ApplicationInsightsService,
    @Inject(MAT_DIALOG_DATA)
    public dialogData: { extendedDownloadEnabled: boolean },
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
    this.extendedDownloadEnabled =
      this.dialogData?.extendedDownloadEnabled ?? true;
    this.exportExcelOption = this.extendedDownloadEnabled
      ? ExportExcel.DETAILED_DOWNLOAD
      : ExportExcel.BASIC_DOWNLOAD;

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
    if (this.exportExcelOption === ExportExcel.BASIC_DOWNLOAD) {
      this.closeDialog();

      return;
    }

    if (this.exportExcelOption === ExportExcel.DETAILED_DOWNLOAD) {
      this.store.dispatch(loadExtendedComparableLinkedTransaction());
      this.store.dispatch(loadExtendedSapPriceConditionDetails());
    }
  }
}
