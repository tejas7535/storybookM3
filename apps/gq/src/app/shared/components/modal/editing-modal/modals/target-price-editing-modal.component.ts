import { Component } from '@angular/core';
import { AbstractControl } from '@angular/forms';

import { UpdateQuotationDetail } from '@gq/core/store/active-case/models';
import { getCurrencyRegex, getPercentageRegex } from '@gq/shared/constants';
import { TargetPriceSource } from '@gq/shared/models/quotation/target-price-source.enum';
import {
  getTargetPriceSourceValue,
  getTargetPriceValue,
  parseLocalizedInputValue,
} from '@gq/shared/utils/misc.utils';
import { multiplyAndRoundValues } from '@gq/shared/utils/pricing.utils';

import { EditingModalComponent } from '../editing-modal.component';

@Component({
  selector: 'gq-target-price-editing-modal',
  templateUrl: '../editing-modal.component.html',
})
export class TargetPriceEditingModalComponent extends EditingModalComponent {
  isPriceChangeTypeAvailable = true;
  handleInputFieldKeyDown: undefined;
  getInitialValue: undefined;

  override getValue(): number {
    return 0;
  }

  private radioButtonClicked = false;

  priceChangeSwitched(): void {
    this.radioButtonClicked = true;
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
    const targetPriceSource = this.editingFormGroup.get(
      this.ADDITIONAL_CONTENT_CONTROL_NAME
    ).value as TargetPriceSource;

    return {
      targetPrice: targetPrice || undefined,
      targetPriceSource:
        targetPriceSource === TargetPriceSource.NO_ENTRY ||
        targetPriceSource === this.modalData.quotationDetail?.targetPriceSource
          ? undefined
          : targetPriceSource,
      gqPositionId: this.modalData.quotationDetail.gqPositionId,
    };
  }

  handleAdditionalContent(): void {
    // handle input Changes and align targetPrice and targetPriceSource
    if (!this.isTargetPriceSourceEditable) {
      return;
    }
    const control = this.editingFormGroup.get(this.VALUE_FORM_CONTROL_NAME);

    const targetPriceSource = this.editingFormGroup.get(
      this.ADDITIONAL_CONTENT_CONTROL_NAME
    );
    // when quotationDetail has a targetPriceSource set this value will be initialized

    targetPriceSource.setValue(
      this.modalData.quotationDetail.targetPriceSource ??
        TargetPriceSource.NO_ENTRY
    );

    this.subscription.add(
      control.valueChanges.subscribe((targetPriceValue: string) => {
        if (this.radioButtonClicked) {
          targetPriceSource.setValue(targetPriceSource.value, {
            emitEvent: false,
          });
          this.radioButtonClicked = false;

          return;
        }
        targetPriceSource.setValue(
          getTargetPriceSourceValue(
            targetPriceValue,
            control.valid,
            targetPriceSource.value as TargetPriceSource
          ),
          { emitEvent: false }
        );
      })
    );

    this.subscription.add(
      targetPriceSource.valueChanges.subscribe((targetPriceSourceValue) => {
        if (Number.isNaN(control.value)) {
          return;
        }

        control.setValue(
          getTargetPriceValue(
            targetPriceSourceValue,
            control.value
          )?.toString(),
          { emitEvent: false }
        );

        const parsedValue = parseLocalizedInputValue(
          control.value,
          this.translocoLocaleService.getLocale()
        );
        // targetPriceSource cannot be saved, when targetPrice is not set
        // targetPrice must be set either in the input field or in the quotationDetail.targetPriceSource
        this.handleHasValueChanged(
          parsedValue,
          this.getValuesHaveChanged(targetPriceSourceValue, control)
        );
        this.setAffectedKpis(parsedValue);
      })
    );
  }

  private getValuesHaveChanged(
    targetPriceSourceValue: TargetPriceSource,
    control: AbstractControl
  ): boolean {
    return (
      targetPriceSourceValue !==
        this.modalData.quotationDetail?.targetPriceSource &&
      (!!control.value || !!this.modalData.quotationDetail?.targetPriceSource)
    );
  }
}
