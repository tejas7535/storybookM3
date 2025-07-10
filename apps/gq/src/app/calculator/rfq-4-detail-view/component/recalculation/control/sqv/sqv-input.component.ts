import { CommonModule } from '@angular/common';
import {
  Component,
  computed,
  forwardRef,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NG_VALUE_ACCESSOR, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

import { ShowErrorComponent } from '@gq/calculator/rfq-4-detail-view/component/recalculation/control/show-error/show-error.component';
import { Rfq4DetailViewStore } from '@gq/calculator/rfq-4-detail-view/store/rfq-4-detail-view.store';
import { UndefinedToDashPipe } from '@gq/shared/pipes/undefined-to-dash/undefined-to-dash.pipe';
import { parseLocalizedInputValue } from '@gq/shared/utils/misc.utils';
import {
  TranslocoDecimalPipe,
  TranslocoLocaleService,
} from '@jsverse/transloco-locale';
import Big from 'big.js';

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
    ShowErrorComponent,
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
export class SqvInputComponent extends BaseInputComponent implements OnInit {
  private readonly store = inject(Rfq4DetailViewStore);
  private readonly translocoLocaleService = inject(TranslocoLocaleService);
  private readonly exchangeRatio = this.store.exchangeRateForSelectedCurrency;
  private readonly sqvValue = signal<string>(null);

  calculatedSqv = computed(() => {
    const value = this.sqvValue();
    const exchangeRatio = this.exchangeRatio();

    if (!value || !exchangeRatio) {
      return null;
    }

    const convertedValue = parseLocalizedInputValue(
      value,
      this.translocoLocaleService.getLocale()
    );

    return Big(convertedValue).times(exchangeRatio).toNumber();
  });

  ngOnInit() {
    super.ngOnInit();

    this.formControl.valueChanges
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((value) => {
        if (!value || this.formControl.invalid) {
          this.sqvValue.set(null);

          return;
        }
        this.sqvValue.set(value);
      });
  }
}
