import { Component } from '@angular/core';

import { addRowDataItems, deleteRowDataItem } from '@gq/core/store/actions';
import { Store } from '@ngrx/store';
import { CellClassParams } from 'ag-grid-community';

@Component({
  selector: 'gq-create-case-action-cell',
  templateUrl: './create-case-action-cell.component.html',
})
export class CreateCaseActionCellComponent {
  public params: CellClassParams;

  constructor(private readonly store: Store) {}

  agInit(params: CellClassParams): void {
    this.params = params;
  }

  deleteItem(): void {
    const { id } = this.params.data;

    this.store.dispatch(deleteRowDataItem({ id }));
  }
  copyItem(): void {
    this.store.dispatch(addRowDataItems({ items: [this.params.data] }));
  }
}
