import { Component } from '@angular/core';

import { UpdateQuotationDetail } from '@gq/core/store/active-case/models';
import { getCurrencyRegex, getPercentageRegex } from '@gq/shared/constants';
import { multiplyAndRoundValues } from '@gq/shared/utils/pricing.utils';

import { EditingModalComponent } from '../editing-modal.component';

@Component({
  selector: 'gq-target-price-editing-modal',
  templateUrl: '../editing-modal.component.html',
})
export class TargetPriceEditingModalComponent extends EditingModalComponent {
  isPriceChangeTypeAvailable = true;
  handleInputFieldKeyDown: undefined;

  override getValue(): number {
    return 0;
  }

  handlePriceChangeTypeSwitch(isRelative: boolean): void {
    // Calculate proper KpiValue properties which are needed to display
    this.setAffectedKpis(
      isRelative ? this.modalData.quotationDetail.targetPrice : 0
    );
    // Reset values when switching between absolute and relative price (GQUOTE-4894)
    this.resetKpiValues();
    this.affectedKpiOutput.emit(this.affectedKpis);
  }

  protected validateInput(value: string): boolean {
    const locale = this.translocoLocaleService.getLocale();

    return this.editingFormGroup.get(this.IS_RELATIVE_PRICE_CONTROL_NAME).value
      ? getPercentageRegex(locale).test(value)
      : getCurrencyRegex(locale).test(value);
  }

  protected shouldIncrement(): boolean {
    return true;
  }

  protected shouldDecrement(value: number): boolean {
    // should not decrement to less than -99 % for percentage changes
    if (this.editingFormGroup.get(this.IS_RELATIVE_PRICE_CONTROL_NAME).value) {
      return (value ?? this.value) > -99;
    }

    // absolute price can not be lower than 1
    return (value ?? this.value) > 1;
  }

  protected shouldDisableRelativePriceChange(): boolean {
    return !this.modalData.quotationDetail.targetPrice;
  }

  protected buildUpdateQuotationDetail(value: number): UpdateQuotationDetail {
    const targetPrice = this.editingFormGroup.get(
      this.IS_RELATIVE_PRICE_CONTROL_NAME
    ).value
      ? multiplyAndRoundValues(
          this.modalData.quotationDetail.targetPrice,
          1 + value / 100
        )
      : value;

    return {
      targetPrice,
      gqPositionId: this.modalData.quotationDetail.gqPositionId,
    };
  }
}
