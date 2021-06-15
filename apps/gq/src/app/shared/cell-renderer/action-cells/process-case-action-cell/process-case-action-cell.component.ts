import { Component } from '@angular/core';

import { CellClassParams } from '@ag-grid-community/core';
import { Store } from '@ngrx/store';

import { deleteAddMaterialRowDataItem } from '../../../../core/store/actions';
import { CaseState } from '../../../../core/store/reducers/create-case/create-case.reducer';

@Component({
  selector: 'gq-prcoess-case-action-cell',
  templateUrl: './process-case-action-cell.component.html',
})
export class ProcessCaseActionCellComponent {
  public params: CellClassParams;

  constructor(private readonly store: Store<CaseState>) {}

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
