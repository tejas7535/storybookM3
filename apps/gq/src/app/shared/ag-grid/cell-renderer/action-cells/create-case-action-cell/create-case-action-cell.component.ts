import { Component, inject } from '@angular/core';

import {
  deleteRowDataItem,
  duplicateRowDataItem,
} from '@gq/core/store/actions';
import { Store } from '@ngrx/store';
import { CellClassParams } from 'ag-grid-enterprise';

@Component({
  selector: 'gq-create-case-action-cell',
  templateUrl: './create-case-action-cell.component.html',
  standalone: false,
})
export class CreateCaseActionCellComponent {
  public params: CellClassParams;
  private readonly store: Store = inject(Store);

  agInit(params: CellClassParams): void {
    this.params = params;
  }

  deleteItem(): void {
    const { id } = this.params.data;

    this.store.dispatch(deleteRowDataItem({ id }));
  }
  copyItem(): void {
    this.store.dispatch(duplicateRowDataItem({ itemId: this.params.data.id }));
  }
}
