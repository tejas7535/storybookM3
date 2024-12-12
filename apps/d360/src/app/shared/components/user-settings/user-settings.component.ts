import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';

import { tap } from 'rxjs';

import { TranslocoDirective } from '@jsverse/transloco';

import {
  LanguageSelectModule,
  Locale,
  LocaleSelectModule,
} from '@schaeffler/transloco/components';

import { CurrencyService } from '../../../feature/info/currency.service';
import {
  AVAILABLE_LOCALES,
  DEFAULT_LOCALE,
} from '../../constants/available-locales';
import { SelectableValue } from '../inputs/autocomplete/selectable-values.utils';
import { FilterDropdownComponent } from '../inputs/filter-dropdown/filter-dropdown.component';

@Component({
  selector: 'd360-user-settings',
  standalone: true,
  imports: [
    CommonModule,
    LanguageSelectModule,
    LocaleSelectModule,
    TranslocoDirective,
    ReactiveFormsModule,
    FilterDropdownComponent,
    MatButtonModule,
  ],
  templateUrl: './user-settings.component.html',
  styleUrl: './user-settings.component.scss',
})
export class UserSettingsComponent {
  protected availableLocales: Locale[] = AVAILABLE_LOCALES;
  protected defaultLocale: Locale = DEFAULT_LOCALE;
  protected availableCurrencies: SelectableValue[] = [];
  private readonly currencyService: CurrencyService = inject(CurrencyService);

  protected currencyControl = new FormControl<SelectableValue>(
    null,
    Validators.required
  );
  protected currencyForm = new FormGroup({ currency: this.currencyControl });

  public constructor() {
    this.currencyService
      .getCurrentCurrency()
      .pipe(
        tap((value) => {
          this.currencyControl.setValue({ id: value, text: value });
        }),
        takeUntilDestroyed()
      )
      .subscribe();
    this.currencyService
      .getAvailableCurrencies()
      .pipe(
        tap((currencies) => {
          this.availableCurrencies = currencies.map((currency) => ({
            id: currency,
            text: currency,
          }));
        }),
        takeUntilDestroyed()
      )
      .subscribe();
  }

  protected onCurrencySelectionChange(currency: SelectableValue) {
    if (currency) {
      this.currencyService.setCurrentCurrency(currency.id);
    }
  }
}
