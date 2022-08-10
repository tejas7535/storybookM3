import { Component } from '@angular/core';

import { Store } from '@ngrx/store';
import { CellClassParams } from 'ag-grid-community';

import { deleteRowDataItem } from '../../../../../core/store/actions';

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
    const { materialNumber, quantity } = this.params.data;

    this.store.dispatch(deleteRowDataItem({ materialNumber, quantity }));
  }
}
