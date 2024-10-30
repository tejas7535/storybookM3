import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatIcon } from '@angular/material/icon';

import { SharedTranslocoModule } from '@schaeffler/transloco';

import { MultiAutocompleteOnTypeComponent } from '../../../../../shared/components/inputs/autocomplete/multi-autocomplete-on-type/multi-autocomplete-on-type.component';
import { SelectableValue } from '../../../../../shared/components/inputs/autocomplete/selectable-values.utils';
import {
  FilterDemandValidationModalComponent,
  FilterDemandValidationModalInput,
} from './filter-demand-validation-modal/filter-demand-validation-modal.component';

@Component({
  selector: 'app-filter-demand-validation',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatIcon,
    SharedTranslocoModule,
    MultiAutocompleteOnTypeComponent,
  ],
  templateUrl: './filter-demand-validation.component.html',
  styleUrl: './filter-demand-validation.component.scss',
})
export class FilterDemandValidationComponent {
  protected activeFilterCount = 0;

  protected productionLineControl = new FormControl<SelectableValue[]>([]);
  protected productLineControl = new FormControl([]);
  protected customerMaterialControl = new FormControl([]);
  protected stochhasticTypecontrol = new FormControl([]);

  protected formGroup = new FormGroup({
    productionLineControl: this.productionLineControl,
    productLineControl: this.productLineControl,
    customerMaterialControl: this.customerMaterialControl,
    stochhasticTypecontrol: this.stochhasticTypecontrol,
  });

  constructor(private readonly dialog: MatDialog) {}

  openDemandValidationFilterModal() {
    const dialogRef = this.dialog.open(FilterDemandValidationModalComponent, {
      data: {
        formGroup: this.formGroup,
        productionLineControl: this.productionLineControl,
        productLineControl: this.productLineControl,
        customerMaterialControl: this.customerMaterialControl,
        stochhasticTypecontrol: this.stochhasticTypecontrol,
        activeFilterCount: this.activeFilterCount,
      } as FilterDemandValidationModalInput,
      disableClose: true,
    });
    dialogRef.afterOpened().subscribe(() => {});
  }
}
