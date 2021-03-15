import { Component } from '@angular/core';

import { Store } from '@ngrx/store';

import {
  deleteAddMaterialRowDataItem,
  deleteRowDataItem,
} from '../../../core/store/actions';
import { isDummyData } from '../../../core/store/reducers/create-case/config/dummy-row-data';
import { CaseState } from '../../../core/store/reducers/create-case/create-case.reducer';

@Component({
  selector: 'gq-action-cell',
  templateUrl: './action-cell.component.html',
  styleUrls: ['./action-cell.component.scss'],
})
export class ActionCellComponent {
  public params: any;
  public isDummy: boolean;

  constructor(private readonly store: Store<CaseState>) {}

  agInit(params: any): void {
    this.params = params;
    this.isDummy = isDummyData(params.data);
  }

  deleteItem(): void {
    const { materialNumber, quantity } = this.params.data;

    this.params.colDef.cellRendererParams === 'createCase'
      ? this.store.dispatch(deleteRowDataItem({ materialNumber, quantity }))
      : this.store.dispatch(
          deleteAddMaterialRowDataItem({ materialNumber, quantity })
        );
  }
}
