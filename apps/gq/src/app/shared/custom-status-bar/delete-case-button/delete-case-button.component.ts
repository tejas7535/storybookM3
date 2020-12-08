import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

import { IStatusPanelParams } from '@ag-grid-community/all-modules';
import { Store } from '@ngrx/store';

import { DeleteAcceptComponent } from '../../../case-view/delete-accept/delete-accept.component';
import { deleteCase } from '../../../core/store';
import { ViewCasesState } from '../../../core/store/reducers/view-cases/view-cases.reducer';

@Component({
  selector: 'gq-delete-case-button',
  templateUrl: './delete-case-button.component.html',
  styleUrls: ['./delete-case-button.component.scss'],
})
export class DeleteCaseButtonComponent {
  selections: any[] = [];
  private params: IStatusPanelParams;
  constructor(
    private readonly store: Store<ViewCasesState>,
    public dialog: MatDialog
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
    const selectedInfo = this.selections.map((el) => ({
      customer: el.customer.name,
      gqId: el.gqId,
    }));
    const dialogRef = this.dialog.open(DeleteAcceptComponent, {
      width: '30%',
      height: '30%',
      data: { selectedInfo },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        const gqIds = selectedInfo.map((el) => el.gqId);
        this.store.dispatch(deleteCase({ gqIds }));
      }
    });
  }
}
