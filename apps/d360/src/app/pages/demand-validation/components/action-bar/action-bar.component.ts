import { CommonModule } from '@angular/common';
import {
  Component,
  computed,
  DestroyRef,
  inject,
  input,
  OnInit,
  output,
  signal,
  WritableSignal,
} from '@angular/core';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatButton, MatIconButton } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatIcon } from '@angular/material/icon';

import { take, tap } from 'rxjs';

import { Store } from '@ngrx/store';
import { addMonths, startOfDay } from 'date-fns';

import { getBackendRoles } from '@schaeffler/azure-auth';
import { SharedTranslocoModule } from '@schaeffler/transloco';

import { DemandValidationFilter } from '../../../../feature/demand-validation/demand-validation-filters';
import { KpiDateRanges } from '../../../../feature/demand-validation/model';
import { PlanningView } from '../../../../feature/demand-validation/planning-view';
import {
  readLocalStorageTimeRange,
  saveLocalStorageTimeRange,
} from '../../../../feature/demand-validation/time-range';
import { CustomerEntry } from '../../../../feature/global-selection/model';
import { ActionButtonComponent } from '../../../../shared/components/action-button/action-button.component';
import { CustomerDropDownComponent } from '../../../../shared/components/customer-dropdown/customer-dropdown.component';
import {
  HeaderActionBarComponent,
  ProjectedContendDirective,
} from '../../../../shared/components/header-action-bar/header-action-bar.component';
import { SingleAutocompleteSelectedEvent } from '../../../../shared/components/inputs/autocomplete/model';
import { SelectableValue } from '../../../../shared/components/inputs/autocomplete/selectable-values.utils';
import { SingleAutocompleteOnTypeComponent } from '../../../../shared/components/inputs/autocomplete/single-autocomplete-on-type/single-autocomplete-on-type.component';
import { SingleAutocompletePreLoadedComponent } from '../../../../shared/components/inputs/autocomplete/single-autocomplete-pre-loaded/single-autocomplete-pre-loaded.component';
import { DisplayFunctions } from '../../../../shared/components/inputs/display-functions.utils';
import { OptionsLoadingResult } from '../../../../shared/services/selectable-options.service';
import {
  checkRoles,
  demandValidationChangeAllowedRoles,
} from '../../../../shared/utils/auth/roles';
import { DemandValidationExportModalComponent } from '../demand-validation-export-modal/demand-validation-export-modal.component';
import { DemandValidationMultiListConfigurationModalComponent } from '../demand-validation-multi-list-configuration-modal/demand-validation-multi-list-configuration-modal.component';
import { DatePickerSettingDemandValidationModalComponent } from './date-picker-setting-demand-validation-modal/date-picker-setting-demand-validation-modal.component';
import { DemandValidationSettingModalComponent } from './demand-validation-setting-modal/demand-validation-setting-modal.component';
import { FilterDemandValidationComponent } from './filter-demand-validation/filter-demand-validation.component';

@Component({
  selector: 'd360-action-bar',
  standalone: true,
  imports: [
    CommonModule,
    SharedTranslocoModule,
    ActionButtonComponent,
    SingleAutocompletePreLoadedComponent,
    SingleAutocompleteOnTypeComponent,
    FilterDemandValidationComponent,
    MatButton,
    MatIcon,
    MatIconButton,
    MatDividerModule,
    HeaderActionBarComponent,
    ProjectedContendDirective,
    CustomerDropDownComponent,
  ],
  templateUrl: './action-bar.component.html',
  styleUrl: './action-bar.component.scss',
})
export class ActionBarComponent implements OnInit {
  public currentCustomer = input.required<CustomerEntry>();
  public customerData = input.required<CustomerEntry[]>();
  public planningView = input.required<PlanningView>();
  public isMaterialListVisible = input<boolean>(true);

  public customerChange = output<CustomerEntry>();
  public toggleMaterialListVisible = output<{ open: boolean }>();
  public dateRangeChanged = output<KpiDateRanges>();

  private readonly dialog = inject(MatDialog);
  private readonly store = inject(Store);
  private readonly destroyRef = inject(DestroyRef);

  private readonly backendRoles = toSignal(this.store.select(getBackendRoles));

  protected authorizedToChange = computed(() =>
    this.backendRoles()
      ? checkRoles(this.backendRoles(), demandValidationChangeAllowedRoles)
      : false
  );

  // TODO: Properly handle initialization of this property, will it be passed from outside? Fetched from service?
  protected selectedCustomer = signal<CustomerEntry>(null);
  protected disableUpload = computed(
    () => this.planningView() === PlanningView.CONFIRMED
  );
  protected demandValidationFilters = signal<DemandValidationFilter[]>(null);

  protected customerSelectableValues: WritableSignal<OptionsLoadingResult> =
    signal({ options: [] });

  protected formGroup = new FormGroup({
    customerControl: new FormControl<SelectableValue | string>(
      this.selectedCustomer()
        ? {
            id: this.selectedCustomer().customerNumber,
            text: this.selectedCustomer().customerName,
          }
        : '',
      Validators.required
    ),
  });
  protected readonly DisplayFunctions = DisplayFunctions;

  // TODO handle and initialize this property
  protected isDisabledForecastEditing = true;

  private readonly localStorageTimeRange = readLocalStorageTimeRange();
  private readonly defaultDateRange: KpiDateRanges = {
    range1: {
      from: startOfDay(addMonths(new Date(), -3)),
      to: startOfDay(addMonths(new Date(), 12)),
      period: 'MONTHLY',
    },
    range2: undefined,
  };

  private readonly dateRange =
    this.localStorageTimeRange ?? this.defaultDateRange;

  ngOnInit(): void {
    this.dateRangeChanged.emit(this.dateRange);

    this.customerSelectableValues.set({
      options: this.customerData()?.map((customer) => ({
        id: customer.customerNumber,
        text: customer.customerName,
      })),
    });
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
    this.dialog.open(DemandValidationMultiListConfigurationModalComponent, {
      data: {
        customerName: this.currentCustomer().customerName,
        customerNumber: this.currentCustomer().customerNumber,
      },
      autoFocus: false,
    });
  }

  protected handleGridModalClicked() {
    // TODO implement
  }

  protected handleToggleMaterialListVisible() {
    this.toggleMaterialListVisible.emit({
      open: !this.isMaterialListVisible(),
    });
  }

  protected handleDateRangeClick() {
    const dialogRef = this.dialog.open(
      DatePickerSettingDemandValidationModalComponent,
      {
        data: this.dateRange,
        disableClose: true,
      }
    );
    dialogRef.afterClosed().subscribe((data) => {
      if (data) {
        saveLocalStorageTimeRange(data.range1, data.range2);
        this.dateRangeChanged.emit(data);
      }
    });
  }

  protected handleDemandValidationSettingsClick() {
    const dialogRef = this.dialog.open(DemandValidationSettingModalComponent, {
      data: this.planningView(),
      disableClose: true,
    });
    dialogRef
      .afterClosed()
      .pipe(
        take(1),
        tap((value) => {
          if (value) {
            // TODO: still to be implemented
            // update planningView and propagate to parent
            this.planningView = value;
          }
        }),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe();
  }

  protected handleOnDeleteUnsavedForecast() {
    // TODO implement
  }

  protected handleOnSaveForecast(_dryRun: boolean) {
    // TODO implement
  }

  protected handleCustomerChange($event: SingleAutocompleteSelectedEvent) {
    const newSelectedCustomer =
      this.customerData().find(
        (customer) => customer.customerNumber === $event.option.id
      ) ?? null;

    this.selectedCustomer.set(newSelectedCustomer);
    this.customerChange.emit(newSelectedCustomer);
  }

  protected handleDeleteModalClicked() {
    // TODO implement
  }
}
