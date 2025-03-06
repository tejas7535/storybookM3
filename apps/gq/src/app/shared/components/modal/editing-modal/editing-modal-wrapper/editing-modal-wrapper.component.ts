import { Component, inject } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

import { ColumnFields } from '@gq/shared/ag-grid/constants/column-fields.enum';
import { QuotationDetail } from '@gq/shared/models';
import { TargetPriceSourcePipe } from '@gq/shared/pipes/target-price-source/target-price-source.pipe';

import { EditingModal } from '../models/editing-modal.model';
import { KpiDisplayValue } from '../models/kpi-value.model';

@Component({
  selector: 'gq-editing-modal-wrapper',
  templateUrl: './editing-modal-wrapper.component.html',
  standalone: false,
})
export class EditingModalWrapperComponent {
  modalData: EditingModal = inject(MAT_DIALOG_DATA);
  readonly columnFields = ColumnFields;

  getKpiForTargetPrice(
    quotationDetail: QuotationDetail,
    formControl: FormControl
  ): KpiDisplayValue {
    const targetPricePipe = new TargetPriceSourcePipe();
    const currentValue = formControl?.value;
    const previousValue = quotationDetail?.targetPriceSource;

    const displayValue = targetPricePipe.transform(currentValue, true);
    const isDifferent =
      currentValue && displayValue !== targetPricePipe.transform(previousValue);

    return {
      displayValue,
      previousDisplayValue: targetPricePipe.transform(previousValue),
      key: this.columnFields.TARGET_PRICE_SOURCE,
      value: isDifferent ? 1 : 0,
    };
  }
}
