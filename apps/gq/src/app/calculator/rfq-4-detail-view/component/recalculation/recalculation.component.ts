import { CommonModule } from '@angular/common';
import { Component, computed, inject, OnInit, Signal } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';

import { RfqDetailViewCalculationData } from '@gq/calculator/rfq-4-detail-view/models/rfq-4-detail-view-data.interface';
import { ValidationHelper } from '@gq/calculator/rfq-4-detail-view/service/validation-helper';
import { Rfq4DetailViewStore } from '@gq/calculator/rfq-4-detail-view/store/rfq-4-detail-view.store';
import { SelectableValue } from '@gq/shared/models/selectable-value.model';
import {
  parseLocalizedInputValue,
  parseNumberValueToLocalizedInputValue,
} from '@gq/shared/utils/misc.utils';
import { TranslocoLocaleService } from '@jsverse/transloco-locale';

import { SharedTranslocoModule } from '@schaeffler/transloco';

import { CalculatorDetailsInputComponent } from './control/calculator-details/calculator-details-input.component';
import { CommentInputComponent } from './control/comment/comment-input.component';
import { CurrencyInputComponent } from './control/currency/currency-input.component';
import {
  DeliveryTimeInputComponent,
  DeliveryTimeUnit,
} from './control/delivery-time/delivery-time-input.component';
import { LotSizeInputComponent } from './control/lot-size/lot-size-input.component';
import { PriceUnitInputComponent } from './control/price-unit/price-unit-input.component';
import { ProdPlantInputComponent } from './control/prod-plant/prod-plant-input.component';
import { SqvInputComponent } from './control/sqv/sqv-input.component';
import { ToolCostInputComponent } from './control/tool-cost/tool-cost-input.component';

@Component({
  selector: 'gq-rfq-4-detail-view-recalculation',
  imports: [
    CommonModule,
    SharedTranslocoModule,
    ReactiveFormsModule,
    MatButtonModule,
    SqvInputComponent,
    CurrencyInputComponent,
    LotSizeInputComponent,
    PriceUnitInputComponent,
    CommentInputComponent,
    CalculatorDetailsInputComponent,
    ToolCostInputComponent,
    ProdPlantInputComponent,
    DeliveryTimeInputComponent,
    MatCardModule,
  ],
  templateUrl: './recalculation.component.html',
  styles: [
    `
      ::ng-deep {
        .mat-mdc-card-header-text {
          @apply w-full;
        }
      }
    `,
  ],
})
export class RecalculationComponent implements OnInit {
  private readonly validationHelper = inject(ValidationHelper);
  private readonly store = inject(Rfq4DetailViewStore);
  private readonly formBuilder = inject(FormBuilder);
  private readonly translocoLocaleService = inject(TranslocoLocaleService);
  private readonly rfq4RecalculationData: Signal<RfqDetailViewCalculationData> =
    this.store.getRfq4DetailViewCalculationData;
  private readonly priceUnit: Signal<number> = computed(
    () => this.store.getQuotationDetailData()?.priceUnit
  );

  recalculationForm: FormGroup;

  ngOnInit(): void {
    this.recalculationForm = this.formBuilder.group({
      currency: [null, Validators.required],
      sqv: [
        null,
        [
          Validators.required,
          this.validationHelper.validateNumericInputWithDecimals(),
        ],
      ],
      lotSize: [
        null,
        [
          Validators.required,
          this.validationHelper.validateNumericInputWithoutDecimals(),
        ],
      ],
      priceUnit: [
        null,
        [
          Validators.required,
          this.validationHelper.validateNumericInputWithoutDecimals(4),
        ],
      ],
      toolCost: [
        null,
        [this.validationHelper.validateNumericInputWithDecimals()],
      ],
      prodPlant: [null, Validators.required],
      comment: [null, Validators.maxLength(1000)],
      calculatorDetails: [null, Validators.maxLength(1000)],
      deliveryTime: [
        null,
        [
          Validators.required,
          this.validationHelper.validateNumericInputWithoutDecimals(4),
        ],
      ],
      deliveryTimeUnit: [DeliveryTimeUnit.MONTHS],
    });

    // Prefill the price unit
    this.recalculationForm.get('priceUnit')?.setValue(this.priceUnit());

    // Set up previously saved recalculation data if available
    const rfqData = this.rfq4RecalculationData();
    if (rfqData) {
      // Production plant is skipped here because this value is set in production plant control component
      this.recalculationForm.patchValue({
        currency: rfqData.currency,
        sqv: this.parseToInputValue(rfqData.sqv),
        lotSize: this.parseToInputValue(rfqData.lotSize),
        priceUnit: this.parseToInputValue(rfqData.priceUnit),
        toolCost: this.parseToInputValue(rfqData.toolCosts),
        comment: rfqData.comment,
        calculatorDetails: rfqData.calculationDetails,
        deliveryTime: rfqData.deliveryTime,
        deliveryTimeUnit: rfqData.deliveryTimeUnit,
      });
    }
  }

  isFormInvalid(): boolean {
    // 1. If at least one field if filled - should be able to Submit
    // 2. Do not validate not touched fields!
    const controls = this.recalculationForm.controls;

    return Object.keys(controls).some(
      (controlName) =>
        controls[controlName].touched && controls[controlName].invalid
    );
  }

  submit(): void {
    const calculationData: RfqDetailViewCalculationData = {
      currency: this.recalculationForm.get('currency')?.value,
      sqv: this.parseInputValue(this.recalculationForm.get('sqv')?.value),
      lotSize: this.parseInputValue(
        this.recalculationForm.get('lotSize')?.value
      ),
      priceUnit: this.parseInputValue(
        this.recalculationForm.get('priceUnit')?.value
      ),
      toolCosts: this.parseInputValue(
        this.recalculationForm.get('toolCost')?.value
      ),
      productionPlantNumber: (
        this.recalculationForm.get('prodPlant')?.value as SelectableValue
      )?.id,
      comment: this.recalculationForm.get('comment')?.value,
      calculationDetails:
        this.recalculationForm.get('calculatorDetails')?.value,
      deliveryTime: this.recalculationForm.get('deliveryTime')?.value,
      deliveryTimeUnit: this.recalculationForm.get('deliveryTimeUnit')?.value,
    };

    this.store.saveRfq4DetailViewCalculationData(calculationData);
  }

  private parseInputValue(value: string): number {
    if (value) {
      return parseLocalizedInputValue(
        value,
        this.translocoLocaleService.getLocale()
      );
    }

    return null;
  }

  private parseToInputValue(value: number): string {
    if (value) {
      return parseNumberValueToLocalizedInputValue(
        value,
        this.translocoLocaleService.getLocale()
      );
    }

    return null;
  }
}
