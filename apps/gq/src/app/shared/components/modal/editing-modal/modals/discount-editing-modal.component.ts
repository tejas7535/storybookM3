import { Component } from '@angular/core';

import { UpdateQuotationDetail } from '@gq/core/store/active-case/models';
import { getPercentageRegex } from '@gq/shared/constants';
import { PriceSource } from '@gq/shared/models/quotation-detail';
import { getManualPriceByDiscount } from '@gq/shared/utils/pricing.utils';

import { EditingModalComponent } from '../editing-modal.component';

@Component({
  selector: 'gq-discount-editing-modal',
  templateUrl: '../editing-modal.component.html',
})
export class DiscountEditingModalComponent extends EditingModalComponent {
  handlePriceChangeTypeSwitch: undefined;
  handleInputFieldKeyDown: undefined;

  protected shouldDisableRelativePriceChange: undefined;

  protected validateInput(value: string): boolean {
    const locale = this.translocoLocaleService.getLocale();

    return getPercentageRegex(locale).test(value);
  }

  protected shouldIncrement(value: number): boolean {
    // discounts should not be higher than 99 %
    return value < 99;
  }

  protected shouldDecrement(value: number): boolean {
    // should not decrement to less than -99 %
    return (value ?? this.value) > -99;
  }

  protected buildUpdateQuotationDetail(value: number): UpdateQuotationDetail {
    const price = getManualPriceByDiscount(
      this.modalData.quotationDetail.sapGrossPrice,
      value
    );

    return {
      price,
      gqPositionId: this.modalData.quotationDetail.gqPositionId,
      priceSource: PriceSource.MANUAL,
    };
  }
}
