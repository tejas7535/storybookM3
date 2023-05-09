import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

import { combineLatest, Observable, Subscription } from 'rxjs';
import { map, pairwise } from 'rxjs/operators';

import {
  clearProcessCaseRowData,
  resetAllAutocompleteOptions,
  resetRequestingAutoCompleteDialog,
} from '@gq/core/store/actions';
import { activeCaseFeature } from '@gq/core/store/active-case/active-case.reducer';
import { getAddMaterialRowData } from '@gq/core/store/selectors';
import { Customer } from '@gq/shared/models/customer';
import { Store } from '@ngrx/store';

import { MaterialTableItem } from '../../shared/models/table';

@Component({
  selector: 'gq-add-material-dialog',
  templateUrl: './add-material-dialog.component.html',
})
export class AddMaterialDialogComponent implements OnInit, OnDestroy {
  private readonly subscription: Subscription = new Subscription();

  rowData$: Observable<MaterialTableItem[]>;
  updateLoading$: Observable<boolean>;
  customer$: Observable<Customer>;

  constructor(
    private readonly store: Store,
    private readonly dialogRef: MatDialogRef<AddMaterialDialogComponent>
  ) {}

  public ngOnInit(): void {
    this.rowData$ = this.store.select(getAddMaterialRowData);
    this.updateLoading$ = this.store.select(
      activeCaseFeature.selectUpdateLoading
    );
    this.customer$ = this.store.select(activeCaseFeature.selectCustomer);

    const isErrorMessage$ = this.store.select(
      activeCaseFeature.selectQuotationLoadingErrorMessage
    );

    const loadingStopped$ = this.store
      .select(activeCaseFeature.selectUpdateLoading)
      .pipe(
        pairwise(),
        // eslint-disable-next-line ngrx/avoid-mapping-selectors
        map(([preVal, curVal]) => preVal && !curVal)
      );

    this.subscription.add(
      combineLatest([isErrorMessage$, loadingStopped$]).subscribe(
        ([isErrorMessage, loadingStopped]) => {
          if (!isErrorMessage && loadingStopped) {
            this.closeDialog();
          }
        }
      )
    );

    // when dialog is closed by other components the actions need to be dispatched
    this.subscription.add(
      this.dialogRef.beforeClosed().subscribe(() => {
        this.dispatchResetActions();
      })
    );
  }

  public ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  closeDialog(): void {
    this.dialogRef.close();
  }

  private dispatchResetActions(): void {
    this.store.dispatch(clearProcessCaseRowData());
    this.store.dispatch(resetAllAutocompleteOptions());
    this.store.dispatch(resetRequestingAutoCompleteDialog());
  }
}
