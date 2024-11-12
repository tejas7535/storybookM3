import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatButton } from '@angular/material/button';
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle,
} from '@angular/material/dialog';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';

import { translate } from '@jsverse/transloco';

import { SharedTranslocoModule } from '@schaeffler/transloco';

import {
  DemandCharacteristic,
  demandCharacteristics,
} from '../../../../../feature/material-customer/model';
import {
  ErrorHandlingSelectComponent,
  Option,
} from '../../../../../shared/components/error-handling-select/error-handling-select.component';
import { SelectableValue } from '../../../../../shared/components/inputs/autocomplete/selectable-values.utils';
import { SingleAutocompleteOnTypeComponent } from '../../../../../shared/components/inputs/autocomplete/single-autocomplete-on-type/single-autocomplete-on-type.component';
import { displayFnText } from '../../../../../shared/components/inputs/display-functions.utils';
import { PhaseInStatusSpecificContentComponent } from '../status-specific-content/phase-in-status-specific-content/phase-in-status-specific-content.component';
import { StatusSpecificContentProps } from '../status-specific-content/status-specific-content.component';

@Component({
  selector: 'd360-customer-material-single-add-modal',
  standalone: true,
  imports: [
    CommonModule,
    SharedTranslocoModule,
    MatDialogTitle,
    MatDialogContent,
    MatDialogActions,
    MatButton,
    SingleAutocompleteOnTypeComponent,
    MatFormField,
    MatInput,
    MatLabel,
    ErrorHandlingSelectComponent,
    PhaseInStatusSpecificContentComponent,
  ],
  templateUrl: './customer-material-single-add-modal.component.html',
  styleUrl: './customer-material-single-add-modal.component.scss',
})
export class CustomerMaterialSingleAddModalComponent {
  protected statusSpecificContentProps: StatusSpecificContentProps;

  protected materialControl = new FormControl<SelectableValue | string>('');
  protected demandCharacteristicsControl = new FormControl<{
    key: string;
    displayValue: string;
  }>({
    key: '',
    displayValue: '',
  });

  protected phaseInDateControl = new FormControl<Date>(null);

  protected formGroup = new FormGroup({
    materialControl: this.materialControl,
    demandCharacteristicsControl: this.demandCharacteristicsControl,
    phaseInDateControl: this.phaseInDateControl,
  });

  constructor(
    @Inject(MAT_DIALOG_DATA) protected customerNumber: string,
    public dialogRef: MatDialogRef<CustomerMaterialSingleAddModalComponent>
  ) {
    this.statusSpecificContentProps = {
      data: {
        customerNumber: this.customerNumber,
        materialNumber: '',
        materialDescription: null,
        demandCharacteristic: null,
        portfolioStatus: null,
        autoSwitchDate: null,
        repDate: null,
        successorMaterial: null,
        demandPlanAdoption: null,
      },
      showValidation: true,
      formGroup: this.formGroup,
    };
  }

  handleSave() {
    // TODO implement
    this.dialogRef.close();
  }

  handleOnClose() {
    this.dialogRef.close();
  }

  protected readonly displayFnText = displayFnText;
  protected demandCharacteristicsOptions: Option<DemandCharacteristic>[] =
    demandCharacteristics.map((dc) => ({
      key: dc,
      displayValue: translate(`field.demandCharacteristic.value.${dc}`, {}),
    }));
}
