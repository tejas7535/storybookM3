import { Component, OnInit } from '@angular/core';

import { Observable } from 'rxjs';

import { CellClassParams } from '@ag-grid-community/all-modules';
import { Store } from '@ngrx/store';

import { isManualCase } from '../../../core/store';
import { ColumnFields } from '../../services/column-utility-service/column-fields.enum';

@Component({
  selector: 'gq-edit-quantity',
  templateUrl: './edit-quantity.component.html',
})
export class EditQuantityComponent implements OnInit {
  public params: CellClassParams;
  public value: string;
  public isManualCase$: Observable<boolean>;

  constructor(private readonly store: Store) {}

  agInit(params: any): void {
    this.params = params;
    this.value = params.valueFormatted;
  }
  ngOnInit(): void {
    this.isManualCase$ = this.store.select(isManualCase);
  }
  onIconClick(): void {
    this.params.api.startEditingCell({
      rowIndex: this.params.rowIndex,
      colKey: ColumnFields.ORDER_QUANTITY,
      rowPinned: undefined,
      charPress: undefined,
      keyPress: undefined,
    });
  }
}
