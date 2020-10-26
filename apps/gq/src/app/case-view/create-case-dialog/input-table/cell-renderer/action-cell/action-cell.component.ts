import { Component } from '@angular/core';

import { Store } from '@ngrx/store';

import { deleteRowDataItem } from '../../../../../core/store';
import { CaseState } from '../../../../../core/store/reducers/create-case/create-case.reducer';

@Component({
  selector: 'gq-action-cell',
  templateUrl: './action-cell.component.html',
  styleUrls: ['./action-cell.component.scss'],
})
export class ActionCellComponent {
  public params: any;

  constructor(private readonly store: Store<CaseState>) {}

  agInit(params: any): void {
    this.params = params;
  }

  deleteItem(): void {
    const { materialNumber } = this.params.data;
    this.store.dispatch(deleteRowDataItem({ materialNumber }));
  }
}
