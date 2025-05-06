import { Component, OnInit } from '@angular/core';

import { UpdateQuotationDetail } from '@gq/core/store/active-case/models';
import { QuotationDetailsTableValidationService } from '@gq/process-case-view/quotation-details-table/services/validation/quotation-details-table-validation.service';
import { getQuantityRegex, LOCALE_DE } from '@gq/shared/constants';
import { UomPipe } from '@gq/shared/pipes/uom/uom.pipe';
import {
  getNextHigherPossibleMultiple,
  validateQuantityInputKeyPress,
} from '@gq/shared/utils/misc.utils';
import { translate } from '@jsverse/transloco';

import { EditingModalComponent } from '../../editing-modal.component';

@Component({
  selector: 'gq-quantity-editing-modal',
  templateUrl: '../../editing-modal.component.html',
  standalone: false,
})
export class QuantityEditingModalComponent
  extends EditingModalComponent
  implements OnInit
{
  private readonly uomPipe = new UomPipe();
  handlePriceChangeTypeSwitch: undefined;
  priceChangeSwitched: undefined;
  protected shouldDisableRelativePriceChange: undefined;

  override getLocaleValue(value: number): string {
    return this.transformationService.transformNumber(value, false);
  }

  ngOnInit(): void {
    super.ngOnInit();
    this.setHintTextParams();
    if (this.isNewCaseCreation) {
      this.setIncrementsAndDecrementSteps();
    }
  }

  handleInputFieldKeyDown(event: KeyboardEvent): void {
    validateQuantityInputKeyPress(event);
  }

  getInitialValue(value: number): number {
    if (value && this.modalData.quotationDetail.deliveryUnit) {
      return getNextHigherPossibleMultiple(
        value,
        this.modalData.quotationDetail.deliveryUnit
      );
    }

    return value;
  }
  protected validateInput(value: string): boolean {
    // order quantity needs to be a multiple of delivery unit, else set error
    const locale = this.translocoLocaleService.getLocale();
    this.editingFormGroup.get(this.VALUE_FORM_CONTROL_NAME).setErrors(null);
    const deliveryUnit = this.modalData.quotationDetail.deliveryUnit;

    const isOrderQuantityInvalid =
      QuotationDetailsTableValidationService.isOrderQuantityInvalid(
        +this.getNumberFromStringValue(value),
        deliveryUnit
      );

    if (this.isNewCaseCreation && isOrderQuantityInvalid) {
      this.editingFormGroup
        .get(this.VALUE_FORM_CONTROL_NAME)
        .setErrors({ invalidInput: true });

      this.errorMsgParams1 = deliveryUnit.toString();
      this.errorMsgParams2 = this.uomPipe.transform(
        this.modalData.quotationDetail.material.baseUoM
      );

      return !isOrderQuantityInvalid;
    }

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
    return (value ?? this.value) > (this.incrementStep ?? 1);
  }

  protected buildUpdateQuotationDetail(value: number): UpdateQuotationDetail {
    return {
      orderQuantity: value,
      gqPositionId: this.modalData.quotationDetail.gqPositionId,
    };
  }

  private setIncrementsAndDecrementSteps() {
    if (
      this.modalData.quotationDetail?.deliveryUnit &&
      this.modalData.quotationDetail.deliveryUnit !== 1
    ) {
      this.incrementStep = this.modalData.quotationDetail?.deliveryUnit;
      this.decrementStep = this.modalData.quotationDetail?.deliveryUnit * -1;
    }
  }

  private setHintTextParams() {
    if (this.modalData.quotationDetail.deliveryUnit) {
      this.showFieldHint = true;
      this.hintMsgParams1 =
        this.modalData.quotationDetail.deliveryUnit.toString();

      this.hintMsgParams2 = this.uomPipe.transform(
        this.modalData.quotationDetail.material.baseUoM
      );
    }
  }

  private getNumberFromStringValue(value: string): number {
    const locale = this.translocoLocaleService.getLocale();
    if (getQuantityRegex(locale).test(value)) {
      return locale === LOCALE_DE.id
        ? Number.parseInt(value.replace('.', ''), 10)
        : Number.parseInt(value.replace(',', ''), 10);
    }

    return null;
  }
}
