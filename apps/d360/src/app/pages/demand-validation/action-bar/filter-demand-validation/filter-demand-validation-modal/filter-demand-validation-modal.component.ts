import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatButton } from '@angular/material/button';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';

import { SharedTranslocoModule } from '@schaeffler/transloco';

import {
  DemandValidationFilter,
  DemandValidationFilterName,
} from '../../../../../feature/demand-validation/demand-validation-filters';
import { MultiAutocompleteOnTypeComponent } from '../../../../../shared/components/inputs/autocomplete/multi-autocomplete-on-type/multi-autocomplete-on-type.component';
import { MultiAutocompletePreLoadedComponent } from '../../../../../shared/components/inputs/autocomplete/multi-autocomplete-pre-loaded/multi-autocomplete-pre-loaded.component';
import { DisplayFunctions } from '../../../../../shared/components/inputs/display-functions.utils';
import { FilterDropdownComponent } from '../../../../../shared/components/inputs/filter-dropdown/filter-dropdown.component';
import { SelectableOptionsService } from '../../../../../shared/services/selectable-options.service';

export type DemandValidationForm = Record<
  DemandValidationFilterName,
  FormControl
>;

export interface FilterDemandValidationModalInput {
  formGroup: FormGroup<DemandValidationForm>;
  activeFilterFn: (formGroup: FormGroup) => number;
}

@Component({
  selector: 'd360-filter-demand-validation-modal',
  imports: [
    CommonModule,
    FilterDropdownComponent,
    MultiAutocompleteOnTypeComponent,
    MultiAutocompletePreLoadedComponent,
    SharedTranslocoModule,
    MatDialogModule,
    MatButton,
  ],
  templateUrl: './filter-demand-validation-modal.component.html',
})
export class FilterDemandValidationModalComponent {
  private readonly dialogRef = inject(
    MatDialogRef<FilterDemandValidationModalComponent>
  );
  protected readonly selectableOptionService = inject(SelectableOptionsService);
  protected readonly data: FilterDemandValidationModalInput =
    inject(MAT_DIALOG_DATA);

  /** Service for handling selectable options */
  protected readonly selectableOptionsService: SelectableOptionsService =
    inject(SelectableOptionsService);

  protected searchProductionLine = new FormControl();
  protected searchProductLine = new FormControl();
  protected searchCustomerMaterial = new FormControl();
  protected searchStochasticType = new FormControl();
  protected searchforecastMaintained = new FormControl();

  protected readonly displayFnUnited = DisplayFunctions.displayFnUnited;
  protected readonly displayFnId = DisplayFunctions.displayFnId;
  protected readonly displayFnText = DisplayFunctions.displayFnText;

  public handleApplyFilter() {
    this.dialogRef.close(this.data.formGroup.getRawValue());
    this.close(this.data.formGroup.getRawValue());
  }

  public handleReset(): void {
    this.data.formGroup.reset({
      productionLine: [],
      productLine: [],
      customerMaterialNumber: [],
      stochasticType: [],
      forecastMaintained: null,
    });
    this.close(this.data.formGroup.getRawValue());
  }

  protected close(data?: DemandValidationFilter): void {
    this.dialogRef.close(data);
  }
}
