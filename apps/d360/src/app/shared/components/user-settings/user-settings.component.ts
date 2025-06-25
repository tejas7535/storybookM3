import { CommonModule } from '@angular/common';
import {
  Component,
  computed,
  DestroyRef,
  effect,
  inject,
  input,
  InputSignal,
  OnInit,
  Signal,
  signal,
  WritableSignal,
} from '@angular/core';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButton, MatButtonModule } from '@angular/material/button';
import { MatFormField } from '@angular/material/form-field';
import { MatLabel } from '@angular/material/input';
import {
  MatOptgroup,
  MatOption,
  MatSelect,
  MatSelectChange,
} from '@angular/material/select';
import { RouterLink } from '@angular/router';

import { tap } from 'rxjs';

import { translate, TranslocoDirective } from '@jsverse/transloco';
import { TranslocoLocaleService } from '@jsverse/transloco-locale';
import { Store } from '@ngrx/store';

import { AppShellComponent } from '@schaeffler/app-shell';
import { getBackendRoles } from '@schaeffler/azure-auth';
import {
  LanguageSelectModule,
  Locale,
  LocaleSelectModule,
} from '@schaeffler/transloco/components';

import { appRoutes, CustomRoute } from '../../../app.routes';
import { AppRoutePath, AppRouteValue } from '../../../app.routes.enum';
import { CurrencyService } from '../../../feature/info/currency.service';
import {
  AVAILABLE_LOCALES,
  DEFAULT_LOCALE,
} from '../../constants/available-locales';
import { UserSettingsKey } from '../../models/user-settings.model';
import { UserService } from '../../services/user.service';
import { adminsOnly, checkRoles } from '../../utils/auth/roles';
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
    MatButton,
    RouterLink,
  ],
  templateUrl: './user-settings.component.html',
  styleUrl: './user-settings.component.scss',
})
export class UserSettingsComponent implements OnInit {
  public shell: InputSignal<AppShellComponent> =
    input.required<AppShellComponent>();

  protected availableLocales: Locale[] = AVAILABLE_LOCALES;
  protected defaultLocale: Locale = DEFAULT_LOCALE;
  protected availableCurrencies: SelectableValue[] = [];
  protected readonly appRoutes = appRoutes;
  protected readonly AppRoutePath = AppRoutePath;

  private readonly currencyService: CurrencyService = inject(CurrencyService);
  protected readonly userService: UserService = inject(UserService);
  private readonly translocoLocaleService: TranslocoLocaleService = inject(
    TranslocoLocaleService
  );
  private readonly store = inject(Store);

  protected localizationTooltip: WritableSignal<string> = signal(null);

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

  private readonly backendRoles = toSignal(this.store.select(getBackendRoles));
  private readonly destroyRef = inject(DestroyRef);

  protected isAdmin = computed(() =>
    this.backendRoles() ? checkRoles(this.backendRoles(), adminsOnly) : false
  );

  public constructor() {
    effect(() => {
      this.startPageControl.setValue(
        this.userService.userSettings()?.[UserSettingsKey.StartPage]
      );
    });
  }

  public ngOnInit(): void {
    this.currencyService
      .getCurrentCurrency()
      .pipe(
        tap((value) => {
          this.currencyControl.setValue({ id: value, text: value });
        }),
        takeUntilDestroyed(this.destroyRef)
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
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe();

    this.translocoLocaleService.localeChanges$
      .pipe(
        tap((locale: string) => {
          this.localizationTooltip.set(
            translate('drawer.localization-tooltip', {
              date: this.translocoLocaleService.localizeDate(
                new Date(),
                locale,
                {
                  day: '2-digit',
                  month: '2-digit',
                  year: 'numeric',
                }
              ),
              number: this.translocoLocaleService.localizeNumber(
                2893.32,
                'decimal',
                locale
              ),
            })
          );
        }),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe();
  }

  protected onCurrencySelectionChange(currency: SelectableValue) {
    if (currency) {
      this.currencyService.setCurrentCurrency(currency.id);
    }
  }

  protected onStartPageSelectionChange(event: MatSelectChange) {
    this.userService.updateUserSettings(
      UserSettingsKey.StartPage,
      event.value as AppRouteValue
    );
  }
}
