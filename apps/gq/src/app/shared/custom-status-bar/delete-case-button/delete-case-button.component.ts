import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

import { IStatusPanelParams } from '@ag-grid-community/all-modules';
import { translate } from '@ngneat/transloco';
import { Store } from '@ngrx/store';

import { deleteCase } from '../../../core/store';
import { ConfirmationModalComponent } from '../../confirmation-modal/confirmation-modal.component';
import { ConfirmationModalData } from '../../confirmation-modal/models/confirmation-modal-data.model';
import { ViewQuotation } from '../../../case-view/models/view-quotation.model';

@Component({
  selector: 'gq-delete-case-button',
  templateUrl: './delete-case-button.component.html',
})
export class DeleteCaseButtonComponent {
  selections: any[] = [];
  icon = 'delete';
  private params: IStatusPanelParams;

  constructor(
    private readonly store: Store,
    private readonly dialog: MatDialog
  ) {}

  agInit(params: IStatusPanelParams): void {
    this.params = params;
    this.params.api.addEventListener(
      'selectionChanged',
      this.onSelectionChange.bind(this)
    );
  }
  onSelectionChange(): void {
    this.selections = this.params.api.getSelectedRows();
  }

  deleteCase(): void {
    const list = this.selections.map((item: ViewQuotation) => ({
      id: item.customerName,
      value: item.gqId,
    }));
    const displayText = translate<string>('caseView.confirmDeleteCases.text', {
      variable: list.length,
    });

    const confirmButton = translate<string>(
      'caseView.confirmDeleteCases.deleteButton'
    );

    const cancelButton = translate<string>(
      'caseView.confirmDeleteCases.cancelButton'
    );
    const data: ConfirmationModalData = {
      displayText,
      confirmButton,
      cancelButton,
      list,
      icon: this.icon,
    };
    const dialogRef = this.dialog.open(ConfirmationModalComponent, {
      maxHeight: '80%',
      data,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        const gqIds = list.map((el) => el.value);
        this.store.dispatch(deleteCase({ gqIds }));
      }
    });
  }
}
