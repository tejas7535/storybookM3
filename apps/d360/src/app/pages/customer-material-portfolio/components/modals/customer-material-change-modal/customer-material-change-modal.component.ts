import { CommonModule } from '@angular/common';
import { Component, Inject, signal } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
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

import { LoadingSpinnerModule } from '@schaeffler/loading-spinner';
import { SharedTranslocoModule } from '@schaeffler/transloco';

import { CMPData } from '../../../../../feature/customer-material-portfolio/cmp-modal-types';
import {
  DemandCharacteristic,
  demandCharacteristics,
} from '../../../../../feature/material-customer/model';
import {
  ErrorHandlingSelectComponent,
  Option,
} from '../../../../../shared/components/error-handling-select/error-handling-select.component';
import { CMPChangeModalFlavor, CMPModal } from '../../table/status-actions';
import {
  StatusSpecificContentComponent,
  StatusSpecificContentProps,
} from '../status-specific-content/status-specific-content.component';

export interface CustomerMaterialChangeModalData {
  modal: CMPModal;
  cmpData: CMPData;
}

@Component({
  selector: 'd360-customer-material-change-modal',
  standalone: true,
  imports: [
    CommonModule,
    SharedTranslocoModule,
    MatDialogTitle,
    MatDialogContent,
    MatDialogActions,
    MatButton,
    MatFormField,
    MatInput,
    MatLabel,
    ErrorHandlingSelectComponent,
    StatusSpecificContentComponent,
    LoadingSpinnerModule,
  ],
  templateUrl: './customer-material-change-modal.component.html',
  styleUrl: './customer-material-change-modal.component.scss',
})
export class CustomerMaterialChangeModalComponent {
  protected title: string;

  protected loading = signal(false);

  protected formGroup: FormGroup;
  protected demandCharacteristicControl = new FormControl<
    Option<DemandCharacteristic>
  >(
    {
      key: '',
      displayValue: '',
    },
    [Validators.required]
  );

  protected readonly demandCharacteristicsOptions = demandCharacteristics.map(
    (dc) => ({
      key: dc,
      displayValue: translate(`field.demandCharacteristic.value.${dc}`, {}),
    })
  );
  protected specifcContentProps: StatusSpecificContentProps;

  constructor(
    @Inject(MAT_DIALOG_DATA) protected data: CustomerMaterialChangeModalData,
    public dialogRef: MatDialogRef<CustomerMaterialChangeModalComponent>
  ) {
    this.demandCharacteristicControl.setValue(
      this.demandCharacteristicsOptions.find(
        (dc) => dc.key === this.data.cmpData.demandCharacteristic
      )
    );
    this.formGroup = new FormGroup<any>({
      demandCharacteristicControl: this.demandCharacteristicControl,
    });
    this.specifcContentProps = {
      data: this.data.cmpData,
      showValidation: false,
      formGroup: this.formGroup,
    };
    this.changedCMPData.set(this.data.cmpData);
    this.title = translate(
      `customer_material_portfolio.modal_headline.${this.data.modal as CMPChangeModalFlavor}`,
      {}
    );
  }

  handleSave() {
    this.dialogRef.close(this.changedCMPData());
  }

  handleOnClose() {
    // TODO implement
    this.dialogRef.close();
  }

  protected readonly demandCharacteristics = demandCharacteristics;
  // TODO implement errormessages
  protected errormessages: string[] = [
    translate('generic.validation.missing_fields', {}),
  ];
  protected changedCMPData = signal<CMPData>(null);

  confirmationMessage = signal<string>('');
}
