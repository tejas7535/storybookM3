import { Component } from '@angular/core';

import { combineLatest, map, Observable } from 'rxjs';

import { deleteRowDataItem } from '@gq/core/store/actions';
import {
  getCaseRowData,
  getCustomerConditionsValid,
} from '@gq/core/store/selectors/create-case/create-case.selector';
import { MaterialTableItem } from '@gq/shared/models/table';
import { Store } from '@ngrx/store';
import { HeaderClassParams } from 'ag-grid-community';

@Component({
  selector: 'gq-process-case-action-header',
  templateUrl: './create-case-action-header.component.html',
})
export class CreateCaseActionHeaderComponent {
  public params: HeaderClassParams;
  public showDeleteButton$: Observable<boolean>;

  constructor(private readonly store: Store) {}

  agInit(params: HeaderClassParams): void {
    this.params = params;
    this.showDeleteButton$ = combineLatest([
      this.store.select(getCaseRowData),
      this.store.select(getCustomerConditionsValid),
    ]).pipe(
      map(
        ([items, valid]: [MaterialTableItem[], boolean]) =>
          items.length > 0 && !valid
      )
    );
  }

  deleteItems(): void {
    this.params.api.forEachNode((rowNode) => {
      if (!rowNode.data.info.valid) {
        this.store.dispatch(
          deleteRowDataItem({
            materialNumber: rowNode.data.materialNumber,
            quantity: rowNode.data.quantity,
          })
        );
      }
    });
  }
}
