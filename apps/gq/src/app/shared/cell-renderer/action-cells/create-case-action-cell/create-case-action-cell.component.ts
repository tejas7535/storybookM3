import { Component } from '@angular/core';

import { CellClassParams } from '@ag-grid-community/all-modules';
import { Store } from '@ngrx/store';

import { deleteRowDataItem } from '../../../../core/store/actions';
import { isDummyData } from '../../../../core/store/reducers/create-case/config/dummy-row-data';
import { CaseState } from '../../../../core/store/reducers/create-case/create-case.reducer';

@Component({
  selector: 'gq-create-case-action-cell',
  templateUrl: './create-case-action-cell.component.html',
  styleUrls: ['./create-case-action-cell.component.scss'],
})
export class CreateCaseActionCellComponent {
  public params: CellClassParams;
  public isDummy: boolean;

  constructor(private readonly store: Store<CaseState>) {}

  agInit(params: CellClassParams): void {
    this.params = params;
    this.isDummy = isDummyData(params.data);
  }

  deleteItem(): void {
    const { materialNumber, quantity } = this.params.data;

    this.store.dispatch(deleteRowDataItem({ materialNumber, quantity }));
  }
}
