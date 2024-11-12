import { CommonModule } from '@angular/common';
import { Component, input, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatIcon } from '@angular/material/icon';

import { TranslocoDirective } from '@jsverse/transloco';

import { DatePickerComponent } from '../../../../../../shared/components/date-picker/date-picker.component';
import { SingleAutocompleteOnTypeComponent } from '../../../../../../shared/components/inputs/autocomplete/single-autocomplete-on-type/single-autocomplete-on-type.component';
import { StatusSpecificContentProps } from '../status-specific-content.component';

@Component({
  selector: 'd360-inactivate-status-specific-content',
  standalone: true,
  imports: [
    CommonModule,
    DatePickerComponent,
    SingleAutocompleteOnTypeComponent,
    TranslocoDirective,
    MatIcon,
  ],
  templateUrl: './inactivate-status-specific-content.component.html',
  styleUrl: './inactivate-status-specific-content.component.scss',
})
export class InactivateStatusSpecificContentComponent implements OnInit {
  props = input.required<StatusSpecificContentProps>();

  protected inactivateDateControl = new FormControl<Date>({
    value: new Date(Date.now()),
    disabled: true,
  });

  ngOnInit(): void {
    this.addFormControlToFormGroup();
    this.addValidatorsToFormGroup();
  }

  private addFormControlToFormGroup(): void {
    this.props().formGroup.addControl(
      'inactivateDateControl',
      this.inactivateDateControl
    );
  }

  private addValidatorsToFormGroup(): void {
    // TODO implement
  }
}
