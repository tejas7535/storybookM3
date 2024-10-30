import { CommonModule } from '@angular/common';
import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatButton } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';

import { addMonths, startOfDay } from 'date-fns';

import { SharedTranslocoModule } from '@schaeffler/transloco';

import { KpiDateRanges } from '../../../../feature/demand-validation/model';
import { PlanningView } from '../../../../feature/demand-validation/planning-view';
import {
  readLocalStorageTimeRange,
  saveLocalStorageTimeRange,
} from '../../../../feature/demand-validation/time-range';
import { CustomerEntry } from '../../../../feature/global-selection/model';
import { ActionButtonComponent } from '../../../../shared/components/action-button/action-button.component';
import { SingleAutocompleteSelectedEvent } from '../../../../shared/components/inputs/autocomplete/model';
import { SelectableValue } from '../../../../shared/components/inputs/autocomplete/selectable-values.utils';
import { SingleAutocompleteOnTypeComponent } from '../../../../shared/components/inputs/autocomplete/single-autocomplete-on-type/single-autocomplete-on-type.component';
import { SingleAutocompletePreLoadedComponent } from '../../../../shared/components/inputs/autocomplete/single-autocomplete-pre-loaded/single-autocomplete-pre-loaded.component';
import { OptionsLoadingResult } from '../../../../shared/services/selectable-options.service';
import { ActionButtonsDemandValidationComponent } from './action-buttons-demand-validation/action-buttons-demand-validation.component';
import { DatePickerSettingDemandValidationModalComponent } from './date-picker-setting-demand-validation-modal/date-picker-setting-demand-validation-modal.component';
import { DemandValidationSettingModalComponent } from './demand-validation-setting-modal/demand-validation-setting-modal.component';
import { FilterDemandValidationComponent } from './filter-demand-validation/filter-demand-validation.component';

@Component({
  selector: 'app-action-bar',
  standalone: true,
  imports: [
    CommonModule,
    SharedTranslocoModule,
    ActionButtonComponent,
    SingleAutocompletePreLoadedComponent,
    ActionButtonsDemandValidationComponent,
    SingleAutocompleteOnTypeComponent,
    FilterDemandValidationComponent,
    MatButton,
  ],
  templateUrl: './action-bar.component.html',
  styleUrl: './action-bar.component.scss',
})
export class ActionBarComponent implements OnInit, OnChanges {
  @Input({ required: true }) currentCustomer!: CustomerEntry;
  @Input({ required: true }) customerData!: CustomerEntry[];
  @Input({ required: true }) planningView!: PlanningView;
  @Input() isMaterialListVisible = true;

  @Output() toggleMaterialListVisible = new EventEmitter<{ open: boolean }>();
  @Output() dateRangeChanged = new EventEmitter<KpiDateRanges>();

  protected customerSelectableValues: OptionsLoadingResult;
  protected customerControl = new FormControl<SelectableValue | string>(
    this.currentCustomer
      ? {
          id: this.currentCustomer.customerNumber,
          text: this.currentCustomer.customerName,
        }
      : ''
  );

  protected formGroup = new FormGroup({
    customerControl: this.customerControl,
  });

  constructor(private readonly dialog: MatDialog) {}

  ngOnInit(): void {
    this.dateRangeChanged.emit(this.dateRange);

    this.customerSelectableValues = {
      options: this.customerData?.map((customer) => ({
        id: customer.customerNumber,
        text: customer.customerName,
      })),
    };
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.currentCustomer) {
      this.customerControl.setValue({
        id: this.currentCustomer.customerNumber,
        text: this.currentCustomer.customerName,
      });
    }
  }

  protected displayFn = (option?: SelectableValue) =>
    option ? `${option.id} - ${option.text}` : '';
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

  protected handleToggleMaterialListVisible() {
    this.toggleMaterialListVisible.emit({ open: !this.isMaterialListVisible });
  }

  handleDateRangeClick() {
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

  handleDemandValidationSettingsClick() {
    const dialogRef = this.dialog.open(DemandValidationSettingModalComponent, {
      data: this.planningView,
      disableClose: true,
    });
    dialogRef.afterClosed().subscribe((value) => {
      if (value) {
        // update planningView and propagate to parent
        this.planningView = value;
      }
    });
  }

  handleOnDeleteUnsavedForecast() {
    // TODO implement
  }

  handleOnSaveForecast(_dryRun: boolean) {
    // TODO implement
  }

  handleCustomerChange($event: SingleAutocompleteSelectedEvent) {
    this.currentCustomer = this.customerData.find(
      (customer) => customer.customerNumber === $event.option.id
    );
  }
}
