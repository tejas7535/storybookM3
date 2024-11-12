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

import { SharedTranslocoModule } from '@schaeffler/transloco';

import { MultiAutocompleteOnTypeComponent } from '../../../../../../shared/components/inputs/autocomplete/multi-autocomplete-on-type/multi-autocomplete-on-type.component';
import { MultiAutocompletePreLoadedComponent } from '../../../../../../shared/components/inputs/autocomplete/multi-autocomplete-pre-loaded/multi-autocomplete-pre-loaded.component';
import { DisplayFunctions } from '../../../../../../shared/components/inputs/display-functions.utils';
import { SelectableOptionsService } from '../../../../../../shared/services/selectable-options.service';

export interface FilterDemandValidationModalInput {
  formGroup: FormGroup;
  productionLineControl: FormControl;
  productLineControl: FormControl;
  customerMaterialControl: FormControl;
  stochhasticTypecontrol: FormControl;
  activeFilterCount: number;
}

@Component({
  selector: 'd360-filter-demand-validation-modal',
  standalone: true,
  imports: [
    CommonModule,
    MultiAutocompleteOnTypeComponent,
    MultiAutocompletePreLoadedComponent,
    SharedTranslocoModule,
    MatDialogContent,
    MatDialogTitle,
    MatDialogActions,
    MatButton,
  ],
  templateUrl: './filter-demand-validation-modal.component.html',
  styleUrl: './filter-demand-validation-modal.component.scss',
})
export class FilterDemandValidationModalComponent {
  protected fvProductionLine = new FormControl();
  protected fvProductLine = new FormControl();
  protected fvCustomerMaterial = new FormControl();
  protected fvStochasticType = new FormControl();

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: FilterDemandValidationModalInput,
    public dialogRef: MatDialogRef<FilterDemandValidationModalComponent>,
    protected readonly selectableOptionService: SelectableOptionsService
  ) {}

  protected readonly displayFnUnited = DisplayFunctions.displayFnUnited;
  protected readonly displayFnId = DisplayFunctions.displayFnId;

  handleApplyFilter() {
    // TODO implement
  }

  handleOnClose() {
    // TODO implement
    this.dialogRef.close();
  }
}
