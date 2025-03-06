import { Component, Input, OnInit } from '@angular/core';

import { Observable } from 'rxjs';

import { isManualCase } from '@gq/core/store/active-case/active-case.selectors';
import { ColumnFields } from '@gq/shared/ag-grid/constants/column-fields.enum';
import { EditingModalService } from '@gq/shared/components/modal/editing-modal/editing-modal.service';
import { QuotationStatus } from '@gq/shared/models';
import { QuotationDetail } from '@gq/shared/models/quotation-detail';
import { Store } from '@ngrx/store';

@Component({
  selector: 'gq-quantity-display',
  templateUrl: './quantity-display.component.html',
  standalone: false,
})
export class QuantityDisplayComponent implements OnInit {
  @Input()
  readonly quotationDetail: QuotationDetail;
  readonly quotationStatus = QuotationStatus;

  isManualCase$: Observable<boolean>;

  constructor(
    private readonly editingModalService: EditingModalService,
    private readonly store: Store
  ) {}

  ngOnInit(): void {
    this.isManualCase$ = this.store.select(isManualCase);
  }

  openEditing(): void {
    this.editingModalService.openEditingModal({
      quotationDetail: this.quotationDetail,
      field: ColumnFields.ORDER_QUANTITY,
    });
  }
}
