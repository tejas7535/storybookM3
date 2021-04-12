import { Component } from '@angular/core';

import { CellClassParams } from '@ag-grid-community/core';
import { Store } from '@ngrx/store';

import { deleteAddMaterialRowDataItem } from '../../../../core/store/actions';
import { isDummyData } from '../../../../core/store/reducers/create-case/config/dummy-row-data';
import { CaseState } from '../../../../core/store/reducers/create-case/create-case.reducer';

@Component({
  selector: 'gq-prcoess-case-action-cell',
  templateUrl: './process-case-action-cell.component.html',
  styleUrls: ['./process-case-action-cell.component.scss'],
})
export class ProcessCaseActionCellComponent {
  public params: CellClassParams;
  public isDummy: boolean;

  constructor(private readonly store: Store<CaseState>) {}

  agInit(params: CellClassParams): void {
    this.params = params;
    this.isDummy = isDummyData(params.data);
  }

  deleteItem(): void {
    const { materialNumber, quantity } = this.params.data;
    this.store.dispatch(
      deleteAddMaterialRowDataItem({ materialNumber, quantity })
    );
  }
}
