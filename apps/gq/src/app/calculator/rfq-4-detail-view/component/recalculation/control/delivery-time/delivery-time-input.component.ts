import { CommonModule } from '@angular/common';
import { Component, forwardRef, input, OnInit } from '@angular/core';
import {
  FormControl,
  NG_VALUE_ACCESSOR,
  ReactiveFormsModule,
} from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';

import { ShowErrorComponent } from '@gq/calculator/rfq-4-detail-view/component/recalculation/control/show-error/show-error.component';

import { SharedTranslocoModule } from '@schaeffler/transloco';

import { BaseInputComponent } from '../base-input.component';

export enum DeliveryTimeUnit {
  YEARS = 'YEARS',
  MONTHS = 'MONTHS',
  DAYS = 'DAYS',
}
@Component({
  selector: 'gq-delivery-time-input',
  imports: [
    CommonModule,
    MatInputModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    SharedTranslocoModule,
    MatSelectModule,
    ShowErrorComponent,
  ],
  templateUrl: './delivery-time-input.component.html',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => DeliveryTimeInputComponent),
      multi: true,
    },
  ],
})
export class DeliveryTimeInputComponent
  extends BaseInputComponent
  implements OnInit
{
  deliveryTimeUnitFormControlName = input<string>();
  deliveryTimeUnitFormControl: FormControl;

  deliveryTimeUnitOptions = [
    { value: DeliveryTimeUnit.YEARS },
    { value: DeliveryTimeUnit.MONTHS },
    { value: DeliveryTimeUnit.DAYS },
  ];

  ngOnInit(): void {
    super.ngOnInit();
    this.deliveryTimeUnitFormControl = this.rootFormGroup.control.get(
      this.deliveryTimeUnitFormControlName()
    ) as FormControl;
  }
}
