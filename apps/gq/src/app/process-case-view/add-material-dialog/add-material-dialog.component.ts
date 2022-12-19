import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';

import { combineLatest, Observable, Subscription } from 'rxjs';
import { map, pairwise } from 'rxjs/operators';

import { Store } from '@ngrx/store';

import {
  clearProcessCaseRowData,
  resetAllAutocompleteOptions,
  resetRequestingAutoCompleteDialog,
  setRequestingAutoCompleteDialog,
} from '../../core/store';
import {
  getAddMaterialRowData,
  getQuotationErrorMessage,
  getUpdateLoading,
} from '../../core/store/selectors';
import { MaterialColumnFields } from '../../shared/ag-grid/constants/column-fields.enum';
import { AutocompleteRequestDialog } from '../../shared/components/autocomplete-input/autocomplete-request-dialog.enum';
import { EditingMaterialModalComponent } from '../../shared/components/modal/editing-material-modal/editing-material-modal.component';
import { MaterialTableItem } from '../../shared/models/table';

@Component({
  selector: 'gq-add-material-dialog',
  templateUrl: './add-material-dialog.component.html',
})
export class AddMaterialDialogComponent implements OnInit, OnDestroy {
  private readonly subscription: Subscription = new Subscription();

  rowData$: Observable<MaterialTableItem[]>;
  updateLoading$: Observable<boolean>;

  constructor(
    private readonly store: Store,
    private readonly dialogRef: MatDialogRef<AddMaterialDialogComponent>,
    private readonly dialog: MatDialog
  ) {}

  public ngOnInit(): void {
    this.rowData$ = this.store.select(getAddMaterialRowData);
    this.updateLoading$ = this.store.select(getUpdateLoading);

    const isErrorMessage$ = this.store.select(getQuotationErrorMessage);

    const loadingStopped$ = this.store.select(getUpdateLoading).pipe(
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
  }

  public ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  closeDialog(): void {
    this.store.dispatch(clearProcessCaseRowData());
    this.store.dispatch(resetAllAutocompleteOptions());
    this.store.dispatch(resetRequestingAutoCompleteDialog());
    this.dialogRef.close();
  }

  onOpenMaterialEditDialog(): void {
    // will be moved to cell renderer component
    const materialToEdit: MaterialTableItem = {
      materialDescription: 'VSA200414-N-VSP-ZT#N',
      materialNumber: '000000167-0000-10',
      quantity: 500,
    };
    this.dialog
      .open(EditingMaterialModalComponent, {
        disableClose: true,
        width: '660px',
        data: {
          material: materialToEdit,
          field: MaterialColumnFields.MATERIAL,
        },
      })
      .afterClosed()
      .subscribe((result: MaterialTableItem) => {
        console.log(result);
        if (result) {
          // TODO: implement update the store
        }
        this.store.dispatch(resetAllAutocompleteOptions());
        this.store.dispatch(
          setRequestingAutoCompleteDialog({
            dialog: AutocompleteRequestDialog.ADD_ENTRY,
          })
        );
      });
  }
}
