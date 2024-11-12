import { CommonModule } from '@angular/common';
import { Component, input, OnInit } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatRadioButton, MatRadioGroup } from '@angular/material/radio';

import { SharedTranslocoModule } from '@schaeffler/transloco';

import {
  DemandPlanAdoption,
  demandPlanAdoptionOptions,
} from '../../../../../../feature/customer-material-portfolio/cmp-modal-types';
import { DatePickerComponent } from '../../../../../../shared/components/date-picker/date-picker.component';
import { SingleAutocompleteSelectedEvent } from '../../../../../../shared/components/inputs/autocomplete/model';
import { SelectableValue } from '../../../../../../shared/components/inputs/autocomplete/selectable-values.utils';
import { SingleAutocompleteOnTypeComponent } from '../../../../../../shared/components/inputs/autocomplete/single-autocomplete-on-type/single-autocomplete-on-type.component';
import { DisplayFunctions } from '../../../../../../shared/components/inputs/display-functions.utils';
import { StatusSpecificContentProps } from '../status-specific-content.component';

@Component({
  selector: 'd360-substitution-status-specific-content',
  standalone: true,
  imports: [
    CommonModule,
    SingleAutocompleteOnTypeComponent,
    DatePickerComponent,
    SharedTranslocoModule,
    MatRadioGroup,
    MatRadioButton,
    ReactiveFormsModule,
  ],
  templateUrl: './substitution-status-specific-content.component.html',
  styleUrl: './substitution-status-specific-content.component.scss',
})
export class SubstitutionStatusSpecificContentComponent implements OnInit {
  props = input.required<StatusSpecificContentProps>();

  successorMaterialControl = new FormControl<SelectableValue | string>('');

  repDateControl = new FormControl<Date>(null);

  demandPlanAdoptionControl = new FormControl<DemandPlanAdoption>(null);

  ngOnInit(): void {
    this.addFormControlToFormGroup();
    this.addValidatorsToFormGroup();

    this.repDateControl.valueChanges.subscribe((_date) => {
      // TODO validate date
    });

    this.demandPlanAdoptionControl.valueChanges.subscribe(
      (_demandPlanAdoption) => {
        // TODO validate demandPlanAdoption
      }
    );
  }

  private addFormControlToFormGroup(): void {
    this.demandPlanAdoptionControl.setValue(
      this.props().data.demandPlanAdoption
    );
    this.props().formGroup.addControl(
      'demandPlanAdoptionControl',
      this.demandPlanAdoptionControl
    );

    this.props().formGroup.addControl(
      'successorMaterialControl',
      this.successorMaterialControl
    );
    this.props().formGroup.addControl('repDateControl', this.repDateControl);
  }

  private addValidatorsToFormGroup(): void {
    // TODO implement
  }

  protected readonly demandPlanAdoptionOptions = demandPlanAdoptionOptions;

  getTranslationKey(option: DemandPlanAdoption) {
    return `customer.material_portfolio.modal.substitution.transfere_forecast.${option.toLowerCase()}`.trim();
  }

  handleSuccessorChange(_$event: SingleAutocompleteSelectedEvent) {
    // TODO validate material
  }

  protected readonly DisplayFunctions = DisplayFunctions;
}
