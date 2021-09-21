import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { ExportExcel } from './export-excel.enum';
import { combineLatest, Observable, Subscription } from 'rxjs';
import {
  getExtendedComparableLinkedTransactionsErrorMessage,
  getExtendedComparableLinkedTransactionsLoading,
} from '../../core/store/selectors/extended-comparable-linked-transactions/extended-comparable-linked-transactions.selector';
import { Store } from '@ngrx/store';
import { map, pairwise } from 'rxjs/operators';
import { loadExtendedComparableLinkedTransaction } from '../../core/store/actions/extended-comparable-linked-transactions/extended-comparable-linked-transactions.actions';
import { getGqId } from '../../core/store';

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
    public dialogRef: MatDialogRef<ExportExcelModalComponent>
  ) {}

  closeDialog() {
    this.dialogRef.close(this.exportExcelOption);
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
    } else if (this.exportExcelOption === ExportExcel.BASIC_DOWNLOAD) {
      this.closeDialog();
    }
  }
}
