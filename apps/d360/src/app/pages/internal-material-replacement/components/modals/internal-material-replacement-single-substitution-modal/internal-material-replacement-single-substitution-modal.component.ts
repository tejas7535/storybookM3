import { CdkTextareaAutosize } from '@angular/cdk/text-field';
import { CommonModule } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { MatButton } from '@angular/material/button';
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle,
} from '@angular/material/dialog';
import {
  MatFormField,
  MatHint,
  MatInput,
  MatLabel,
} from '@angular/material/input';

import { translate } from '@jsverse/transloco';
import { GridApi } from 'ag-grid-community';

import { SharedTranslocoModule } from '@schaeffler/transloco';

import {
  IMRSubstitution,
  ReplacementType,
  replacementTypeValues,
} from '../../../../../feature/internal-material-replacement/model';
import { DatePickerComponent } from '../../../../../shared/components/date-picker/date-picker.component';
import {
  ErrorHandlingSelectComponent,
  Option,
} from '../../../../../shared/components/error-handling-select/error-handling-select.component';
import { SingleAutocompleteSelectedEvent } from '../../../../../shared/components/inputs/autocomplete/model';
import { SelectableValue } from '../../../../../shared/components/inputs/autocomplete/selectable-values.utils';
import { SingleAutocompleteOnTypeComponent } from '../../../../../shared/components/inputs/autocomplete/single-autocomplete-on-type/single-autocomplete-on-type.component';
import { SingleAutocompletePreLoadedComponent } from '../../../../../shared/components/inputs/autocomplete/single-autocomplete-pre-loaded/single-autocomplete-pre-loaded.component';
import { SelectableOptionsService } from '../../../../../shared/services/selectable-options.service';

export interface InternalMaterialReplacementModalProps {
  isNewSubstitution: boolean;
  substitution: IMRSubstitution;
  gridApi: GridApi;
}

@Component({
  selector: 'app-internal-material-replacement-single-substitution-modal',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogTitle,
    MatDialogContent,
    MatDialogActions,
    MatButton,
    MatDialogClose,
    ErrorHandlingSelectComponent,
    SingleAutocompletePreLoadedComponent,
    SingleAutocompleteOnTypeComponent,
    SharedTranslocoModule,
    MatInput,
    MatFormField,
    MatLabel,
    MatHint,
    CdkTextareaAutosize,
    FormsModule,
    ReactiveFormsModule,
    DatePickerComponent,
  ],
  templateUrl:
    './internal-material-replacement-single-substitution-modal.component.html',
  styleUrl:
    './internal-material-replacement-single-substitution-modal.component.scss',
})
export class InternalMaterialReplacementSingleSubstitutionModalComponent
  implements OnInit
{
  constructor(
    @Inject(MAT_DIALOG_DATA)
    protected data: InternalMaterialReplacementModalProps,
    public dialogRef: MatDialogRef<InternalMaterialReplacementSingleSubstitutionModalComponent>,
    protected selectableOptionsService: SelectableOptionsService
  ) {}

  protected replacementTypeOptions = replacementTypeValues.map((rt) => ({
    key: rt,
    displayValue: translate(`replacement_type.${rt}`, {}),
  }));

  protected showValidation = false;

  ngOnInit(): void {
    this.replacementTypeControl.valueChanges.subscribe((value) => {
      // TODO handle changes //check type ans casting for all controls
      if (value.key) {
        this.showValidation = false;
        this.resetModal();
      }
    });
    this.replacementDateControl.valueChanges.subscribe((value) => {
      // TODO handle changes
      this.data.substitution.replacementDate = value;
    });

    this.cutoverDateControl.valueChanges.subscribe((value) => {
      // TODO handle changes
      this.data.substitution.cutoverDate = value;
    });
    this.startOfProductionControl.valueChanges.subscribe((value) => {
      // TODO handle changes
      this.data.substitution.startOfProduction = value;
    });
    this.replacementNoteControl.valueChanges.subscribe((value) => {
      // TODO handle changes
      this.data.substitution.note = value;
    });
  }

  resetModal(newType?: ReplacementType) {
    this.data.substitution = {
      ...this.data.substitution,
      replacementType: newType || this.data.substitution.replacementType,
      salesArea: null,
      salesOrg: null,
      customerNumber: null,
      predecessorMaterial: null,
      successorMaterial: null,
      replacementDate: null,
      cutoverDate: null,
      startOfProduction: null,
      note: null,
    };
  }

  protected cutoverDateControl = new FormControl<Date>(
    this.data.substitution.cutoverDate
  );
  protected startOfProductionControl = new FormControl<Date>(
    this.data.substitution.startOfProduction
  );

  protected replacementDateControl = new FormControl<Date>(
    this.data.substitution.replacementDate
  );

  protected regionControl = new FormControl<SelectableValue | string>(
    this.data.substitution.region
  );
  protected salesAreaControl = new FormControl<SelectableValue | string>(
    this.data.substitution.salesArea
  );
  protected salesOrgControl = new FormControl<SelectableValue | string>(
    this.data.substitution.salesOrg
  );
  protected customerNumberControl = new FormControl<SelectableValue | string>(
    this.data.substitution.customerNumber
  );
  protected predecessorMaterialControl = new FormControl<
    SelectableValue | string
  >(this.data.substitution.predecessorMaterial);
  protected successorMaterialControl = new FormControl<
    SelectableValue | string
  >(this.data.substitution.successorMaterial);
  // TODO handle disabled in the formControl
  protected replacementTypeControl = new FormControl<Option<ReplacementType>>(
    this.replacementTypeOptions.find(
      (rt) => rt.key === this.data.substitution.replacementType
    )
  );

  protected replacementNoteControl = new FormControl<string>(
    this.data.substitution.note
  );

  protected formGroup = new FormGroup({
    regionControl: this.regionControl,
    salesAreaControl: this.salesAreaControl,
    salesOrgControl: this.salesOrgControl,
    customerNumberControl: this.customerNumberControl,
    predecessorMaterialControl: this.predecessorMaterialControl,
    successorMaterialControl: this.successorMaterialControl,
    replacementTypeControl: this.replacementTypeControl,
  });

  handleSave() {
    // TODO implement
    if (this.data.isNewSubstitution) {
      this.data.gridApi.applyServerSideTransaction({
        addIndex: 0,
        // TODO use response or data if possible else gridApi.refreshServerSide(); is necessary
        add: [this.data.substitution],
      });
    } else {
      // TODO use response or data if possible else gridApi.refreshServerSide(); is necessary
      this.data.gridApi.applyServerSideTransaction({
        update: [this.data.substitution],
      });
    }
    // this.data.gridApi.refreshServerSide();
    this.dialogRef.close();
  }

  handleOnClose() {
    this.resetModal();
    this.showValidation = false;
    this.dialogRef.close();
  }

  handleRegionChange($event: SingleAutocompleteSelectedEvent) {
    // TODO handle changes
    this.data.substitution.region = $event.option.id;
  }

  handleSalesAreaChange($event: SingleAutocompleteSelectedEvent) {
    // TODO handle changes
    this.data.substitution.salesArea = $event.option.id;
  }

  handleSalesOrgChange($event: SingleAutocompleteSelectedEvent) {
    // TODO handle changes
    this.data.substitution.salesOrg = $event.option.id;
  }

  handleCustomerChange($event: SingleAutocompleteSelectedEvent) {
    // TODO handle changes
    this.data.substitution.customerNumber = $event.option.id;
  }

  handlePredecessorChange($event: SingleAutocompleteSelectedEvent) {
    // TODO handle changes
    this.data.substitution.predecessorMaterial = $event.option.id;
  }

  handleSuccesorChange($event: SingleAutocompleteSelectedEvent) {
    // TODO handle changes
    this.data.substitution.successorMaterial = $event.option.id;
  }
}
