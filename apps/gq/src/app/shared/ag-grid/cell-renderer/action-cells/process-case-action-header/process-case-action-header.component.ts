import { Component } from '@angular/core';

import { combineLatest, map, Observable } from 'rxjs';

import { deleteAddMaterialRowDataItem } from '@gq/core/store/actions';
import {
  getAddMaterialRowData,
  getAddMaterialRowDataValid,
} from '@gq/core/store/selectors/process-case/process-case.selectors';
import { Store } from '@ngrx/store';
import { HeaderClassParams } from 'ag-grid-community';

import { MaterialTableItem } from '../../../../models/table';

@Component({
  selector: 'gq-process-case-action-header',
  templateUrl: './process-case-action-header.component.html',
})
export class ProcessCaseActionHeaderComponent {
  public params: HeaderClassParams;
  public showDeleteButton$: Observable<boolean>;

  constructor(private readonly store: Store) {}

  agInit(params: HeaderClassParams): void {
    this.params = params;
    this.showDeleteButton$ = combineLatest([
      this.store.select(getAddMaterialRowData),
      this.store.select(getAddMaterialRowDataValid),
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
          deleteAddMaterialRowDataItem({
            materialNumber: rowNode.data.materialNumber,
            quantity: rowNode.data.quantity,
          })
        );
      }
    });
  }
}
