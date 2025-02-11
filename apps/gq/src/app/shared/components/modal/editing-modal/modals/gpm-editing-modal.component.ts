import { Component } from '@angular/core';

import { UpdateQuotationDetail } from '@gq/core/store/active-case/models';
import { getPercentageRegex } from '@gq/shared/constants';
import { PriceSource } from '@gq/shared/models/quotation-detail';
import { getManualPriceByMarginAndCost } from '@gq/shared/utils/pricing.utils';
import Big from 'big.js';

import { EditingModalComponent } from '../editing-modal.component';

@Component({
  selector: 'gq-gpm-editing-modal',
  templateUrl: '../editing-modal.component.html',
})
export class GpmEditingModalComponent extends EditingModalComponent {
  handlePriceChangeTypeSwitch: undefined;
  priceChangeSwitched: undefined;
  handleInputFieldKeyDown: undefined;
  getInitialValue: undefined;

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
    // tranform to decimal value first
    const percentageValue = new Big(value).div(100);

    const price = getManualPriceByMarginAndCost(
      this.modalData.quotationDetail.sqv,
      percentageValue.toNumber()
    );

    return {
      price,
      gqPositionId: this.modalData.quotationDetail.gqPositionId,
      priceSource: PriceSource.MANUAL,
    };
  }
}
