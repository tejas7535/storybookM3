import { CommonModule } from '@angular/common';
import { Component, input, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';

import { isValid, startOfDay } from 'date-fns';

import { SharedTranslocoModule } from '@schaeffler/transloco';

import { DatePickerComponent } from '../../../../../../shared/components/date-picker/date-picker.component';
import { StatusSpecificContentProps } from '../status-specific-content.component';

@Component({
  selector: 'app-phase-in-status-specific-content',
  standalone: true,
  imports: [CommonModule, SharedTranslocoModule, DatePickerComponent],
  templateUrl: './phase-in-status-specific-content.component.html',
  styleUrl: './phase-in-status-specific-content.component.scss',
})
export class PhaseInStatusSpecificContentComponent implements OnInit {
  protected max_date = new Date(9999, 12, 31);

  props = input.required<StatusSpecificContentProps>();

  phaseInDateControl = new FormControl<Date>(null);

  protected isPhaseInDateSet = false;

  ngOnInit(): void {
    // TODO set validator to phaseInDateControl
    // maxDate={max_date}
    // minDate={new Date(Date.now())}
    //   errorMessages={
    //   !isValid(data.autoSwitchDate) ? [t('generic.validation.missing_fields', {})] : []
    // }
    // this.phaseInDateControl.addValidators();

    this.phaseInDateControl.setValue(this.props().data.autoSwitchDate);

    this.addFormControlToFormGroup();
    this.addValidatorsToFormGroup();

    this.phaseInDateControl.valueChanges.subscribe((date) => {
      if (!isValid(date) || !date) {
        this.isPhaseInDateSet = false;

        return;
      }

      if (date < startOfDay(Date.now())) {
        this.phaseInDateControl.setErrors({ invalidDate: true });
        this.isPhaseInDateSet = true;

        return;
      }

      this.isPhaseInDateSet = true;
    });
  }

  private addFormControlToFormGroup(): void {
    this.props().formGroup.addControl(
      'phaseInDateControl',
      this.phaseInDateControl
    );
  }

  private addValidatorsToFormGroup(): void {
    // TODO implement
  }
}
