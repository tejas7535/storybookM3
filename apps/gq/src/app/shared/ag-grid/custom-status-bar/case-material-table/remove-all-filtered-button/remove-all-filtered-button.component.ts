import { Component, inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

import { deleteRowDataItem } from '@gq/core/store/actions';
import { ProcessCaseActions } from '@gq/core/store/process-case';
import { ConfirmationModalComponent } from '@gq/shared/components/modal/confirmation-modal/confirmation-modal.component';
import { ConfirmationModalData } from '@gq/shared/components/modal/confirmation-modal/models/confirmation-modal-data.model';
import { translate } from '@jsverse/transloco';
import { Store } from '@ngrx/store';
import { GridApi } from 'ag-grid-enterprise';

import { isCaseViewParams } from '../../../models/is-case-view-params.model';

@Component({
  selector: 'gq-remove-all-filtered-button',
  templateUrl: './remove-all-filtered-button.component.html',
  standalone: false,
})
export class RemoveAllFilteredButtonComponent {
  filterSet = false;

  private isCaseView: boolean;
  private gridApi: GridApi;

  private readonly translationPath = `shared.customStatusBar.buttons.resetAllFiltered.`;
  private readonly store: Store = inject(Store);
  private readonly dialog: MatDialog = inject(MatDialog);

  agInit(params: isCaseViewParams): void {
    this.isCaseView = params.isCaseView;
    this.gridApi = params.api;
    this.gridApi.addEventListener(
      'filterChanged',
      this.onFilterChanged.bind(this)
    );
  }

  onFilterChanged(): void {
    this.filterSet = Object.values(this.gridApi.getFilterModel()).some(
      (val) => !!val
    );
  }

  openConfirmDialog(): void {
    const title = translate(`${this.translationPath}confirmationText`);
    const confirmButtonText = translate(`${this.translationPath}removeButton`);
    const cancelButtonText = translate(`${this.translationPath}cancelButton`);

    const data: ConfirmationModalData = {
      title,
      confirmButtonText,
      cancelButtonText,
      confirmButtonIcon: 'delete',
    };
    const dialogRef = this.dialog.open(ConfirmationModalComponent, {
      data,
    });
    dialogRef.afterClosed().subscribe((result: boolean) => {
      if (result) {
        this.removeAllFiltered();
      }
    });
  }

  removeAllFiltered(): void {
    this.gridApi.forEachNodeAfterFilterAndSort((rowNode) => {
      if (this.isCaseView) {
        this.store.dispatch(deleteRowDataItem({ id: rowNode.data.id }));
      } else {
        this.store.dispatch(
          ProcessCaseActions.deleteItemFromMaterialTable({
            id: rowNode.data.id,
          })
        );
      }
    });

    // eslint-disable-next-line unicorn/no-null
    this.gridApi.setFilterModel(null);
  }
}
