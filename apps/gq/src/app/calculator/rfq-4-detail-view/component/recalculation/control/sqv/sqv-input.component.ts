import { CommonModule } from '@angular/common';
import { Component, forwardRef, inject, Signal } from '@angular/core';
import { NG_VALUE_ACCESSOR, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

import { CalculatorRfq4ProcessData } from '@gq/calculator/rfq-4-detail-view/models/rfq-4-detail-view-data.interface';
import { Rfq4DetailViewStore } from '@gq/calculator/rfq-4-detail-view/store/rfq-4-detail-view.store';
import { UndefinedToDashPipe } from '@gq/shared/pipes/undefined-to-dash/undefined-to-dash.pipe';
import { TranslocoDecimalPipe } from '@jsverse/transloco-locale';

import { SharedTranslocoModule } from '@schaeffler/transloco';

import { BaseInputComponent } from '../base-input.component';
@Component({
  selector: 'gq-sqv-input',
  imports: [
    CommonModule,
    MatInputModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    SharedTranslocoModule,
    UndefinedToDashPipe,
    TranslocoDecimalPipe,
  ],
  templateUrl: './sqv-input.component.html',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SqvInputComponent),
      multi: true,
    },
  ],
})
export class SqvInputComponent extends BaseInputComponent {
  private readonly store = inject(Rfq4DetailViewStore);

  rfqProcessData: Signal<CalculatorRfq4ProcessData> =
    this.store.getRfq4ProcessData;
}
