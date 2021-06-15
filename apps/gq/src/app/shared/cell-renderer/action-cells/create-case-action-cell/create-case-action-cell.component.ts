import { Component } from '@angular/core';

import { CellClassParams } from '@ag-grid-community/all-modules';
import { Store } from '@ngrx/store';

import { deleteRowDataItem } from '../../../../core/store/actions';
import { CaseState } from '../../../../core/store/reducers/create-case/create-case.reducer';

@Component({
  selector: 'gq-create-case-action-cell',
  templateUrl: './create-case-action-cell.component.html',
})
export class CreateCaseActionCellComponent {
  public params: CellClassParams;

  constructor(private readonly store: Store<CaseState>) {}

  agInit(params: CellClassParams): void {
    this.params = params;
  }

  deleteItem(): void {
    const { materialNumber, quantity } = this.params.data;

    this.store.dispatch(deleteRowDataItem({ materialNumber, quantity }));
  }
}
