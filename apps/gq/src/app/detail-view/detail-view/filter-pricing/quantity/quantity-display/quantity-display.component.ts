import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

import { Observable } from 'rxjs';

import { isManualCase } from '@gq/core/store/active-case/active-case.selectors';
import { Store } from '@ngrx/store';

import { ColumnFields } from '../../../../../shared/ag-grid/constants/column-fields.enum';
import { EditingModalComponent } from '../../../../../shared/components/modal/editing-modal/editing-modal.component';
import { QuotationStatus } from '../../../../../shared/models';
import { QuotationDetail } from '../../../../../shared/models/quotation-detail';

@Component({
  selector: 'gq-quantity-display',
  templateUrl: './quantity-display.component.html',
})
export class QuantityDisplayComponent implements OnInit {
  @Input()
  readonly quotationDetail: QuotationDetail;
  readonly quotationStatus = QuotationStatus;

  isManualCase$: Observable<boolean>;

  constructor(
    private readonly dialog: MatDialog,
    private readonly store: Store
  ) {}
  ngOnInit(): void {
    this.isManualCase$ = this.store.select(isManualCase);
  }
  openEditing(): void {
    this.dialog.open(EditingModalComponent, {
      width: '684px',
      data: {
        quotationDetail: this.quotationDetail,
        field: ColumnFields.ORDER_QUANTITY,
      },
    });
  }
}
