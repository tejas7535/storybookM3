import { Component } from '@angular/core';

import { Store } from '@ngrx/store';
import { CellClassParams } from 'ag-grid-community';

import { deleteAddMaterialRowDataItem } from '../../../../../core/store/actions';

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
    const { materialNumber, quantity } = this.params.data;
    this.store.dispatch(
      deleteAddMaterialRowDataItem({ materialNumber, quantity })
    );
  }
}
