import { CommonModule } from '@angular/common';
import {
  Component,
  computed,
  DestroyRef,
  effect,
  inject,
  Signal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormField } from '@angular/material/form-field';
import { MatLabel } from '@angular/material/input';
import {
  MatOptgroup,
  MatOption,
  MatSelect,
  MatSelectChange,
} from '@angular/material/select';

import { take, tap } from 'rxjs';

import { TranslocoDirective } from '@jsverse/transloco';

import {
  LanguageSelectModule,
  Locale,
  LocaleSelectModule,
} from '@schaeffler/transloco/components';

import { appRoutes, CustomRoute } from '../../../app.routes';
import { AppRouteValue } from '../../../app.routes.enum';
import { CurrencyService } from '../../../feature/info/currency.service';
import {
  AVAILABLE_LOCALES,
  DEFAULT_LOCALE,
} from '../../constants/available-locales';
import { UserService } from '../../services/user.service';
import { SelectableValue } from '../inputs/autocomplete/selectable-values.utils';
import { FilterDropdownComponent } from '../inputs/filter-dropdown/filter-dropdown.component';

@Component({
  selector: 'd360-user-settings',
  imports: [
    CommonModule,
    LanguageSelectModule,
    LocaleSelectModule,
    TranslocoDirective,
    ReactiveFormsModule,
    FilterDropdownComponent,
    MatButtonModule,
    MatFormField,
    MatLabel,
    MatSelect,
    MatOption,
    MatOptgroup,
  ],
  templateUrl: './user-settings.component.html',
  styleUrl: './user-settings.component.scss',
})
export class UserSettingsComponent {
  protected availableLocales: Locale[] = AVAILABLE_LOCALES;
  protected defaultLocale: Locale = DEFAULT_LOCALE;
  protected availableCurrencies: SelectableValue[] = [];
  protected readonly appRoutes = appRoutes;
  private readonly currencyService: CurrencyService = inject(CurrencyService);
  protected readonly userService: UserService = inject(UserService);
  private readonly destroyRef: DestroyRef = inject(DestroyRef);

  protected currencyControl = new FormControl<SelectableValue>(
    null,
    Validators.required
  );
  protected startPageControl = new FormControl<AppRouteValue>(
    null,
    Validators.required
  );
  protected userSettingsForm = new FormGroup({
    currency: this.currencyControl,
    startPage: this.startPageControl,
  });
  protected availableFunctions: Signal<Record<string, CustomRoute[]>> =
    computed(() => ({
      salesSuite: this.userService.filterVisibleRoutes(
        appRoutes.functions.salesSuite
      ),
      demandSuite: this.userService.filterVisibleRoutes(
        appRoutes.functions.demandSuite
      ),
      general: [
        ...this.userService.filterVisibleRoutes(appRoutes.functions.general),
        appRoutes.todos,
      ],
    }));
  protected startPageGroups = Object.keys(appRoutes.functions);

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

    effect(() => {
      this.startPageControl.setValue(this.userService.startPage());
    });
  }

  protected onCurrencySelectionChange(currency: SelectableValue) {
    if (currency) {
      this.currencyService.setCurrentCurrency(currency.id);
    }
  }

  protected onStartPageSelectionChange(event: MatSelectChange) {
    this.userService
      .saveStartPage(event.value as AppRouteValue)
      .pipe(take(1), takeUntilDestroyed(this.destroyRef))
      .subscribe();
  }
}
