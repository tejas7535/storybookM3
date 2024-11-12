import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';

import { SharedTranslocoModule } from '@schaeffler/transloco';

import { DatePickerComponent } from '../../../../shared/components/date-picker/date-picker.component';
import { SelectableValue } from '../../../../shared/components/inputs/autocomplete/selectable-values.utils';
import { displayFnText } from '../../../../shared/components/inputs/display-functions.utils';
import { FilterDropdownComponent } from '../../../../shared/components/inputs/filter-dropdown/filter-dropdown.component';

export interface DemandValidationDatePickerFormControls {
  formGroup: FormGroup;
  startDatePeriod1: FormControl;
  endDatePeriod1: FormControl;
  periodType1: FormControl;
  startDatePeriod2: FormControl;
  endDatePeriod2: FormControl;
  periodType2: FormControl;
}

@Component({
  selector: 'd360-demand-validation-date-picker',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    DatePickerComponent,
    FilterDropdownComponent,
    SharedTranslocoModule,
  ],
  templateUrl: './demand-validation-date-picker.component.html',
  styleUrl: './demand-validation-date-picker.component.scss',
})
export class DemandValidationDatePickerComponent {
  @Input({ required: true }) controls!: DemandValidationDatePickerFormControls;
  @Input() disableOptionalDate = false;
  @Input({ required: true }) periodTypes: SelectableValue[] = [];
  protected readonly displayFnText = displayFnText;
}
