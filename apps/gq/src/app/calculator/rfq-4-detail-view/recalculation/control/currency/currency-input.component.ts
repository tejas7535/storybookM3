import { CommonModule } from '@angular/common';
import { Component, forwardRef, inject } from '@angular/core';
import { NG_VALUE_ACCESSOR, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';

import { Observable } from 'rxjs';

import { CurrencyFacade } from '@gq/core/store/currency/currency.facade';
import { PushPipe } from '@ngrx/component';

import { SharedTranslocoModule } from '@schaeffler/transloco';

import { BaseInputComponent } from '../base-input.component';

@Component({
  selector: 'gq-currency-input',
  imports: [
    CommonModule,
    MatInputModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    SharedTranslocoModule,
    MatSelectModule,
    PushPipe,
  ],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CurrencyInputComponent),
      multi: true,
    },
  ],
  templateUrl: './currency-input.component.html',
})
export class CurrencyInputComponent extends BaseInputComponent {
  private readonly currencyFacade: CurrencyFacade = inject(CurrencyFacade);

  availableCurrencies$: Observable<string[]> =
    this.currencyFacade.availableCurrencies$;
}
