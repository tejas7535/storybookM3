import { Component } from '@angular/core';

import { ProcessCaseActions } from '@gq/core/store/process-case/process-case.action';
import { Store } from '@ngrx/store';
import { CellClassParams } from 'ag-grid-enterprise';

@Component({
  selector: 'gq-process-case-action-cell',
  templateUrl: './process-case-action-cell.component.html',
})
export class ProcessCaseActionCellComponent {
  public params: CellClassParams;

  constructor(private readonly store: Store) {}

  agInit(params: CellClassParams): void {
    this.params = params;
  }

  deleteItem(): void {
    const { id } = this.params.data;

    this.store.dispatch(ProcessCaseActions.deleteItemFromMaterialTable({ id }));
  }

  copyItem(): void {
    this.store.dispatch(
      ProcessCaseActions.duplicateItemFromMaterialTable({
        itemId: this.params.data.id,
      })
    );
  }
}
