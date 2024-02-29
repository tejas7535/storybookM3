import { Component } from '@angular/core';

import { UpdateQuotationDetail } from '@gq/core/store/active-case/models';
import { getPercentageRegex } from '@gq/shared/constants';
import { PriceSource } from '@gq/shared/models/quotation-detail';
import {
  getManualPriceByMarginAndCost,
  getPriceUnit,
} from '@gq/shared/utils/pricing.utils';

import { EditingModalComponent } from '../editing-modal.component';

@Component({
  selector: 'gq-gpi-editing-modal',
  templateUrl: '../editing-modal.component.html',
})
export class GpiEditingModalComponent extends EditingModalComponent {
  handlePriceChangeTypeSwitch: undefined;
  handleInputFieldKeyDown: undefined;

  protected shouldDisableRelativePriceChange: undefined;

  protected validateInput(value: string): boolean {
    const locale = this.translocoLocaleService.getLocale();

    return getPercentageRegex(locale).test(value);
  }

  protected shouldIncrement(value: number): boolean {
    // margins should not be higher than 99 %
    return value < 99;
  }

  protected shouldDecrement(value: number): boolean {
    // should not decrement to less than -99 %
    return (value ?? this.value) > -99;
  }

  protected buildUpdateQuotationDetail(value: number): UpdateQuotationDetail {
    const newPrice = getManualPriceByMarginAndCost(
      this.modalData.quotationDetail.gpc,
      value
    );
    const priceUnit = getPriceUnit(this.modalData.quotationDetail);
    const price = newPrice / priceUnit;

    return {
      price,
      gqPositionId: this.modalData.quotationDetail.gqPositionId,
      priceSource: PriceSource.MANUAL,
    };
  }
}
