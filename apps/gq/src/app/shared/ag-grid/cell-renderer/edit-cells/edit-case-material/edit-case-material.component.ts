import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';

import {
  resetAutocompleteMaterials,
  setRequestingAutoCompleteDialog,
  updateMaterialRowDataItem,
  updateRowDataItem,
  validateAddMaterialsOnCustomerAndSalesOrg,
  validateMaterialsOnCustomerAndSalesOrg,
} from '@gq/core/store/actions';
import { Store } from '@ngrx/store';
import { ICellRendererParams } from 'ag-grid-community';

import { AppRoutePath } from '../../../../../app-route-path.enum';
import { AutocompleteRequestDialog } from '../../../../components/autocomplete-input/autocomplete-request-dialog.enum';
import { EditingMaterialModalComponent } from '../../../../components/modal/editing-material-modal/editing-material-modal.component';
import { MaterialTableItem } from '../../../../models/table';

@Component({
  selector: 'gq-edit-case-material',
  standalone: true,
  imports: [MatIconModule, CommonModule],
  templateUrl: './edit-case-material.component.html',
})
export class EditCaseMaterialComponent {
  public params: ICellRendererParams;
  public cellValue: string;
  public isCaseView: boolean;

  constructor(
    private readonly dialog: MatDialog,
    private readonly store: Store,
    private readonly router: Router
  ) {
    this.isCaseView = this.router.url === `/${AppRoutePath.CaseViewPath}`;
  }

  agInit(params: ICellRendererParams): void {
    this.params = params;

    this.cellValue = this.getValueToDisplay(params);
  }

  refresh(params: ICellRendererParams): boolean {
    this.cellValue = this.getValueToDisplay(params);

    return true;
  }

  getValueToDisplay(params: ICellRendererParams) {
    return params.valueFormatted ?? params.value;
  }

  onIconClick(): void {
    const previousData = this.params.data;
    this.dialog
      .open(EditingMaterialModalComponent, {
        width: '660px',
        data: {
          material: this.params.data,
          field: this.params.colDef.field,
        },
        autoFocus: false,
      })
      .afterClosed()
      .subscribe((result: MaterialTableItem) => {
        if (result) {
          this.checkValidationNeeded(result, previousData);
        }

        this.store.dispatch(resetAutocompleteMaterials());

        this.store.dispatch(
          setRequestingAutoCompleteDialog({
            dialog: AutocompleteRequestDialog.ADD_ENTRY,
          })
        );
      });
  }

  checkValidationNeeded(
    recentData: MaterialTableItem,
    previousData: MaterialTableItem
  ): void {
    const validationNeeded =
      recentData.materialDescription !== previousData.materialDescription ||
      recentData.materialNumber !== previousData.materialNumber;

    return validationNeeded
      ? this.dispatchUpdateActionAndValidationAction(recentData)
      : this.dispatchUpdateAction(recentData);
  }

  dispatchUpdateAction(
    recentData: MaterialTableItem,
    revalidate: boolean = false
  ): void {
    return this.isCaseView
      ? this.store.dispatch(updateRowDataItem({ item: recentData, revalidate }))
      : this.store.dispatch(
          updateMaterialRowDataItem({
            item: recentData,
            revalidate,
          })
        );
  }

  dispatchUpdateActionAndValidationAction(recentData: MaterialTableItem): void {
    this.dispatchUpdateAction(recentData, true);

    return this.isCaseView
      ? this.store.dispatch(validateMaterialsOnCustomerAndSalesOrg())
      : this.store.dispatch(validateAddMaterialsOnCustomerAndSalesOrg());
  }
}
