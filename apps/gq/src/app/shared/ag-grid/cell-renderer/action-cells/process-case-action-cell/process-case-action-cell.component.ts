import { Component } from '@angular/core';

import {
  addMaterialRowDataItems,
  deleteMaterialRowDataItem,
} from '@gq/core/store/actions';
import { Store } from '@ngrx/store';
import { CellClassParams } from 'ag-grid-community';

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

    this.store.dispatch(deleteMaterialRowDataItem({ id }));
  }

  copyItem(): void {
    this.store.dispatch(addMaterialRowDataItems({ items: [this.params.data] }));
  }
}
