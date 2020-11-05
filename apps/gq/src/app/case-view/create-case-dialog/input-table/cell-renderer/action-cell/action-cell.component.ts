import { Component } from '@angular/core';

import { Store } from '@ngrx/store';

import { deleteRowDataItem } from '../../../../../core/store';
import { isDummyData } from '../../../../../core/store/reducers/create-case/config/dummy-row-data';
import { CaseState } from '../../../../../core/store/reducers/create-case/create-case.reducer';

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
    const { materialNumber } = this.params.data;
    this.store.dispatch(deleteRowDataItem({ materialNumber }));
  }
}
