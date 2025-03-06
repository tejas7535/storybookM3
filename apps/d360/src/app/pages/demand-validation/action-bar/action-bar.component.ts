/* eslint-disable max-lines */
import { CommonModule } from '@angular/common';
import {
  Component,
  computed,
  DestroyRef,
  inject,
  input,
  InputSignal,
  model,
  OnInit,
  output,
  Signal,
  signal,
  WritableSignal,
} from '@angular/core';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatButton, MatIconButton } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatIcon } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatTooltipModule } from '@angular/material/tooltip';

import { take, tap } from 'rxjs';

import { translate } from '@jsverse/transloco';
import { TranslocoLocaleService } from '@jsverse/transloco-locale';
import { Store } from '@ngrx/store';
import {
  addMonths,
  endOfMonth,
  format,
  startOfDay,
  startOfMonth,
} from 'date-fns';

import { getBackendRoles } from '@schaeffler/azure-auth';
import { SharedTranslocoModule } from '@schaeffler/transloco';

import { DemandValidationService } from '../../../feature/demand-validation/demand-validation.service';
import { DemandValidationFilter } from '../../../feature/demand-validation/demand-validation-filters';
import {
  KpiDateRanges,
  WriteKpiData,
} from '../../../feature/demand-validation/model';
import { PlanningView } from '../../../feature/demand-validation/planning-view';
import { readLocalStorageTimeRange } from '../../../feature/demand-validation/time-range';
import { CustomerEntry } from '../../../feature/global-selection/model';
import { CustomerDropDownComponent } from '../../../shared/components/customer-dropdown/customer-dropdown.component';
import { SingleAutocompleteSelectedEvent } from '../../../shared/components/inputs/autocomplete/model';
import { SelectableValue } from '../../../shared/components/inputs/autocomplete/selectable-values.utils';
import { DisplayFunctions } from '../../../shared/components/inputs/display-functions.utils';
import {
  getMonthYearDateFormatByCode,
  LocaleType,
} from '../../../shared/constants/available-locales';
import { OptionsLoadingResult } from '../../../shared/services/selectable-options.service';
import {
  checkRoles,
  demandValidationChangeAllowedRoles,
} from '../../../shared/utils/auth/roles';
import { strictlyParseLocalFloat } from '../../../shared/utils/number';
import { SnackbarService } from '../../../shared/utils/service/snackbar.service';
import { ValidationHelper } from '../../../shared/utils/validation/validation-helper';
import { DatePickerSettingDemandValidationModalComponent } from './date-picker-setting-demand-validation-modal/date-picker-setting-demand-validation-modal.component';
import { DemandValidationExportModalComponent } from './demand-validation-export-modal/demand-validation-export-modal.component';
import { DemandValidationMultiDeleteModalComponent } from './demand-validation-multi-delete-modal/demand-validation-multi-delete-modal.component';
import { DemandValidationMultiGridComponent } from './demand-validation-multi-grid/demand-validation-multi-grid.component';
import { DemandValidationMultiListConfigurationModalComponent } from './demand-validation-multi-list-configuration-modal/demand-validation-multi-list-configuration-modal.component';
import { DemandValidationSettingModalComponent } from './demand-validation-setting-modal/demand-validation-setting-modal.component';
import { FilterDemandValidationComponent } from './filter-demand-validation/filter-demand-validation.component';

interface Button {
  type:
    | 'icon-button'
    | 'flat-button'
    | 'divider'
    | 'customer'
    | 'filter'
    | 'date-filter'
    | 'settings';
  icon?: string;
  // eslint-disable-next-line @typescript-eslint/ban-types
  action?: Function;
  class?: string;
  tooltip?: string;
  text?: string;
  disabled?: boolean;
}

@Component({
  selector: 'd360-action-bar',
  imports: [
    CommonModule,
    SharedTranslocoModule,
    FilterDemandValidationComponent,
    MatButton,
    MatIcon,
    MatIconButton,
    MatDividerModule,
    MatTooltipModule,
    CustomerDropDownComponent,
    MatMenuModule,
    DatePickerSettingDemandValidationModalComponent,
    DemandValidationSettingModalComponent,
  ],
  templateUrl: './action-bar.component.html',
  styleUrl: './action-bar.component.scss',
})
export class ActionBarComponent implements OnInit {
  public selectedCustomer = input.required<CustomerEntry>();
  public customerData = input.required<CustomerEntry[]>();
  public planningView = model.required<PlanningView>();
  public demandValidationFilters = input.required<DemandValidationFilter>();
  public isMaterialListVisible = input<boolean>(true);
  public changedKPIs: InputSignal<WriteKpiData | null> = input.required();

  public customerChange = output<CustomerEntry>();
  public toggleMaterialListVisible = output<{ open: boolean }>();
  public dateRangeChanged = output<KpiDateRanges>();
  public reloadValidationTable = output<boolean | null>();
  public demandValidationFilterChange = output<DemandValidationFilter>();

  private readonly dialog = inject(MatDialog);
  private readonly store = inject(Store);
  private readonly destroyRef = inject(DestroyRef);
  private readonly demandValidationService = inject(DemandValidationService);
  private readonly snackbarService: SnackbarService = inject(SnackbarService);
  private readonly localeService: TranslocoLocaleService = inject(
    TranslocoLocaleService
  );
  // private readonly appInsights = inject(ApplicationInsights); // TODO: add ApplicationInsights

  private readonly backendRoles = toSignal(this.store.select(getBackendRoles));

  protected leftSide: Signal<Button[]> = computed(() => [
    {
      type: 'icon-button',
      icon: 'view_sidebar',
      action: this.handleToggleMaterialListVisible.bind(this),
      class: this.isMaterialListVisible() ? 'icon-button-primary' : '',
      tooltip: `validation_of_demand.actionBar.${this.isMaterialListVisible() ? 'hideResultTable' : 'showResultTable'}`,
    },
    { type: 'divider' },
    {
      type: 'icon-button',
      icon: 'download_2',
      action: this.handleDownloadButtonClicked.bind(this),
      tooltip: 'validation_of_demand.actionBar.export',
    },
    {
      type: 'icon-button',
      icon: 'menu',
      action: this.handleListModalClicked.bind(this),
      class: 'icon-button-primary',
      tooltip: 'validation_of_demand.actionBar.editAsList',
      disabled:
        this.cleanKPIs() || !this.authorizedToChange() || this.disableUpload(),
    },
    {
      type: 'icon-button',
      icon: 'grid_view',
      action: this.handleGridModalClicked.bind(this),
      class: 'icon-button-primary',
      tooltip: 'validation_of_demand.actionBar.editAsGrid',
      disabled:
        this.cleanKPIs() || !this.authorizedToChange() || this.disableUpload(),
    },
    {
      type: 'icon-button',
      icon: 'delete',
      action: this.handleDeleteModalClicked.bind(this),
      tooltip: 'validation_of_demand.actionBar.bashDelete',
      disabled:
        this.cleanKPIs() || !this.authorizedToChange() || this.disableUpload(),
    },
    { type: 'divider' },
    { type: 'customer', disabled: this.cleanKPIs() },
    { type: 'filter', disabled: this.cleanKPIs() },
  ]);

  protected rightSide: Signal<Button[]> = computed(() => [
    { type: 'date-filter', disabled: this.cleanKPIs() },
    { type: 'settings', disabled: this.cleanKPIs() },
    { type: 'divider' },
    {
      type: 'icon-button',
      icon: 'history',
      action: this.handleOnDeleteUnsavedForecast.bind(this),
      tooltip: 'validation_of_demand.actionBar.deleteInput',
      disabled: !this.cleanKPIs(),
    },
    {
      type: 'icon-button',
      icon: 'check',
      action: () => this.handleOnSaveForecast(true),
      tooltip: 'validation_of_demand.actionBar.checkInput',
      disabled: !this.cleanKPIs(),
    },
    {
      type: 'flat-button',
      icon: 'save',
      action: () => this.handleOnSaveForecast(false),
      text: 'button.save',
      disabled: !this.cleanKPIs(),
    },
  ]);

  protected authorizedToChange = computed(() =>
    this.backendRoles()
      ? checkRoles(this.backendRoles(), demandValidationChangeAllowedRoles)
      : false
  );

  protected disableUpload = computed(
    () => this.planningView() === PlanningView.CONFIRMED
  );

  protected customerSelectableValues: WritableSignal<OptionsLoadingResult> =
    signal({ options: [] });

  protected formGroup = new FormGroup({
    customerControl: new FormControl<SelectableValue>(
      null,
      Validators.required
    ),
  });
  protected readonly DisplayFunctions = DisplayFunctions;

  protected cleanKPIs: Signal<boolean> = computed(() => !!this.changedKPIs());

  private readonly localStorageTimeRange = readLocalStorageTimeRange();
  private readonly defaultDateRange: KpiDateRanges = {
    range1: {
      from: startOfMonth(startOfDay(addMonths(new Date(), -3))),
      to: endOfMonth(startOfDay(addMonths(new Date(), 12))),
      period: 'MONTHLY',
    },
    range2: undefined,
  };

  protected readonly dateRange =
    this.localStorageTimeRange ?? this.defaultDateRange;

  public ngOnInit(): void {
    this.dateRangeChanged.emit(this.dateRange);

    this.customerSelectableValues.set({
      options: this.customerData()?.map((customer) => ({
        id: customer.customerNumber,
        text: customer.customerName,
      })),
    });

    this.formGroup.controls.customerControl.setValue(
      this.selectedCustomer()
        ? {
            id: this.selectedCustomer().customerNumber,
            text: this.selectedCustomer().customerName,
          }
        : null
    );
  }

  protected handleDownloadButtonClicked() {
    this.dialog.open(DemandValidationExportModalComponent, {
      data: {
        customerData: this.customerData(),
        demandValidationFilters: this.demandValidationFilters(),
        dateRanges: this.defaultDateRange,
      },
      disableClose: true,
      autoFocus: false,
      panelClass: ['form-dialog', 'demand-validation-export'],
    });
  }

  protected handleListModalClicked() {
    this.dialog
      .open(DemandValidationMultiListConfigurationModalComponent, {
        data: {
          customerName: this.selectedCustomer().customerName,
          customerNumber: this.selectedCustomer().customerNumber,
        },
        width: '600px',
        maxWidth: '600px',
        autoFocus: false,
        disableClose: true,
      })
      .afterClosed()
      .pipe(
        tap(this.reloadTheValidationTable.bind(this)),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe();
  }

  protected handleGridModalClicked() {
    this.dialog
      .open(DemandValidationMultiGridComponent, {
        data: {
          customerName: this.selectedCustomer().customerName,
          customerNumber: this.selectedCustomer().customerNumber,
        },
        width: '900px',
        maxWidth: '900px',
        autoFocus: false,
        disableClose: true,
      })
      .afterClosed()
      .pipe(
        tap(this.reloadTheValidationTable.bind(this)),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe();
  }

  private reloadTheValidationTable(reload: boolean): void {
    if (reload) {
      this.reloadValidationTable.emit(null);
    }
  }

  protected handleToggleMaterialListVisible() {
    this.toggleMaterialListVisible.emit({
      open: !this.isMaterialListVisible(),
    });
  }

  protected handleDemandValidationSettingsChange(value: PlanningView) {
    this.planningView.set(value);
  }

  protected handleOnDeleteUnsavedForecast() {
    this.reloadValidationTable.emit(null);
  }

  protected handleOnSaveForecast(dryRun: boolean) {
    this.reloadValidationTable.emit(true);

    if (!dryRun) {
      // TODO: Add ApplicationInsights
      // this.appInsights.trackEvent({
      //   name: '[Validated Sales Planning] Upload Single Entries',
      // });
    }

    const errors = new Set<string>();

    this.changedKPIs().kpiEntries.forEach((entry) => {
      const parsed = strictlyParseLocalFloat(
        entry.validatedForecast,
        ValidationHelper.getDecimalSeparatorForActiveLocale()
      );

      if (
        entry.validatedForecast !== null &&
        (Number.isNaN(parsed) || parsed < 0)
      ) {
        errors.add(
          format(
            entry.fromDate,
            getMonthYearDateFormatByCode(
              this.localeService.getLocale() as LocaleType
            ).display.dateInput
          )
        );
      }
    });

    this.demandValidationService
      .saveValidatedDemandSingleMcc(this.changedKPIs(), errors, dryRun)
      .pipe(
        take(1),
        tap((result) => {
          // close loading spinner
          this.reloadValidationTable.emit(false);

          // send message: BE-/SAP-Error or Success
          this.snackbarService.openSnackBar(
            result ||
              translate(
                `validation_of_demand.${dryRun ? 'check' : 'save'}.success`
              )
          );

          if (
            // if we have FE errors, we do not reload the table...
            errors.size === 0 &&
            // ...same for having BE-/SAP-Errors...
            !result &&
            // ...same for dry-run
            !dryRun
          ) {
            this.reloadValidationTable.emit(null);
          }
        }),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe();
  }

  protected handleCustomerChange($event: SingleAutocompleteSelectedEvent) {
    const newSelectedCustomer =
      this.customerData().find(
        (customer) => customer.customerNumber === $event.option.id
      ) ?? null;

    this.customerChange.emit(newSelectedCustomer);
  }

  protected handleDeleteModalClicked() {
    this.dialog.open(DemandValidationMultiDeleteModalComponent, {
      data: {
        customerName: this.selectedCustomer().customerName,
        customerNumber: this.selectedCustomer().customerNumber,
        onSave: this.onSaveInModal('[Validated Sales Planning] Delete List'),
      },
      disableClose: true,
      autoFocus: false,
      panelClass: ['form-dialog', 'demand-validation-multi-delete'],
    });
  }

  private readonly onSaveInModal = (_eventName: string) => () => {
    this.reloadValidationTable.emit(null);

    // TODO: Implement once we have the AppInsights setup (SFT-1863)
    // this.appInsights.trackEvent({ name: _eventName, });
  };
}
