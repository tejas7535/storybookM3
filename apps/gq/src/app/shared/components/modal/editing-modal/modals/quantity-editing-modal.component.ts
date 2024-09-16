import { Component } from '@angular/core';

import { UpdateQuotationDetail } from '@gq/core/store/active-case/models';
import { QuotationDetailsTableValidationService } from '@gq/process-case-view/quotation-details-table/services/validation/quotation-details-table-validation.service';
import { getQuantityRegex } from '@gq/shared/constants';
import { validateQuantityInputKeyPress } from '@gq/shared/utils/misc.utils';
import { translate } from '@jsverse/transloco';

import { EditingModalComponent } from '../editing-modal.component';

@Component({
  selector: 'gq-quantity-editing-modal',
  templateUrl: '../editing-modal.component.html',
})
export class QuantityEditingModalComponent extends EditingModalComponent {
  handlePriceChangeTypeSwitch: undefined;
  protected shouldDisableRelativePriceChange: undefined;

  override getLocaleValue(value: number): string {
    return this.transformationService.transformNumber(value, false);
  }

  handleInputFieldKeyDown(event: KeyboardEvent): void {
    validateQuantityInputKeyPress(event);
  }

  protected validateInput(value: string): boolean {
    // order quantity needs to be a multiple of delivery unit, else warn
    const locale = this.translocoLocaleService.getLocale();
    const deliveryUnit = this.modalData.quotationDetail.deliveryUnit;
    const isOrderQuantityInvalid =
      QuotationDetailsTableValidationService.isOrderQuantityInvalid(
        +value,
        deliveryUnit
      );

    this.warningText = isOrderQuantityInvalid
      ? translate('shared.validation.orderQuantityMustBeMultipleOf', {
          deliveryUnit: this.modalData.quotationDetail.deliveryUnit,
        })
      : undefined;

    return getQuantityRegex(locale).test(value);
  }

  protected shouldIncrement(): boolean {
    return true;
  }

  protected shouldDecrement(value: number): boolean {
    // quantity should not be lower than 1
    return (value ?? this.value) > 1;
  }

  protected buildUpdateQuotationDetail(value: number): UpdateQuotationDetail {
    return {
      orderQuantity: value,
      gqPositionId: this.modalData.quotationDetail.gqPositionId,
    };
  }
}
