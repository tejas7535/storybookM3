import { CommonModule } from '@angular/common';
import { Component, input, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatIcon } from '@angular/material/icon';

import { SharedTranslocoModule } from '@schaeffler/transloco';

import { DatePickerComponent } from '../../../../../../shared/components/date-picker/date-picker.component';
import { StatusSpecificContentProps } from '../status-specific-content.component';

@Component({
  selector: 'd360-phase-out-status-specific-content',
  standalone: true,
  imports: [CommonModule, DatePickerComponent, MatIcon, SharedTranslocoModule],
  templateUrl: './phase-out-status-specific-content.component.html',
  styleUrl: './phase-out-status-specific-content.component.scss',
})
export class PhaseOutStatusSpecificContentComponent implements OnInit {
  phaseOutDateControl = new FormControl<Date>(null);

  props = input.required<StatusSpecificContentProps>();

  protected max_date = new Date(9999, 12, 31);

  ngOnInit(): void {
    // TODO set validator to phaseInDateControl
    // maxDate={max_date}
    // minDate={new Date(Date.now())}
    //   errorMessages={
    //   !isValid(data.autoSwitchDate) ? [t('generic.validation.missing_fields', {})] : []
    // }
    // this.phaseInDateControl.addValidators();

    this.phaseOutDateControl.setValue(this.props().data.autoSwitchDate);

    this.addFormControlToFormGroup();
    this.addValidatorsToFormGroup();

    this.phaseOutDateControl.valueChanges.subscribe((_date) => {
      // TODO validate date
    });
  }

  private addFormControlToFormGroup(): void {
    this.props().formGroup.addControl(
      'phaseOutDateControl',
      this.phaseOutDateControl
    );
  }

  private addValidatorsToFormGroup(): void {
    // TODO implement
  }
}
