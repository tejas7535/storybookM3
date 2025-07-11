import { Component, computed, inject, input, InputSignal } from '@angular/core';

import { ColumnFields } from '@gq/shared/ag-grid/constants/column-fields.enum';
import { EditingModalService } from '@gq/shared/components/modal/editing-modal/editing-modal.service';
import { QuotationStatus } from '@gq/shared/models';
import { QuotationDetail } from '@gq/shared/models/quotation-detail';
import { isRfq4ProcessInProgressOrCompletedForQuotationDetail } from '@gq/shared/utils/rfq-4-utils';

@Component({
  selector: 'gq-quantity-display',
  templateUrl: './quantity-display.component.html',
  standalone: false,
})
export class QuantityDisplayComponent {
  private readonly editingModalService: EditingModalService =
    inject(EditingModalService);

  readonly quotationDetail: InputSignal<QuotationDetail> =
    input<QuotationDetail>();
  readonly quotationStatus = QuotationStatus;

  isRfq4ProcessOngoing = computed(() =>
    isRfq4ProcessInProgressOrCompletedForQuotationDetail(this.quotationDetail())
  );

  openEditing(): void {
    if (this.isRfq4ProcessOngoing()) {
      return;
    }
    this.editingModalService.openEditingModal({
      quotationDetail: this.quotationDetail(),
      field: ColumnFields.ORDER_QUANTITY,
    });
  }
}
