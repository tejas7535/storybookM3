import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';

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
  recalculationForm: FormGroup;
  formBuilder = inject(FormBuilder);

  ngOnInit(): void {
    this.recalculationForm = this.formBuilder.group({
      currency: [],
      sqv: ['', Validators.required],
      lotSize: ['', Validators.required],
      priceUnit: ['', Validators.required],
      toolCost: [],
      prodPlant: ['', Validators.required],
      comment: [],
      calculatorDetails: [],
      deliveryTime: [],
      deliveryTimeUnit: [DeliveryTimeUnit.MONTHS],
    });
  }

  submit(): void {
    const controls = this.recalculationForm.controls;
    for (const control in controls) {
      if (controls[control].value) {
        // console.log(`${control}: ${controls[control].value}`);
      }
    }
  }
}
