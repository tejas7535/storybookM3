import { CommonModule } from '@angular/common';
import { Component, DestroyRef, inject, output } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, FormGroup } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatIcon } from '@angular/material/icon';

import { tap } from 'rxjs';

import { SharedTranslocoModule } from '@schaeffler/transloco';

import { DemandValidationFilter } from '../../../../../feature/demand-validation/demand-validation-filters';
import {
  DemandValidationForm,
  FilterDemandValidationModalComponent,
} from './filter-demand-validation-modal/filter-demand-validation-modal.component';

@Component({
  selector: 'd360-filter-demand-validation',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatIcon, SharedTranslocoModule],
  templateUrl: './filter-demand-validation.component.html',
})
export class FilterDemandValidationComponent {
  private readonly dialog: MatDialog = inject(MatDialog);
  private readonly destroyRef: DestroyRef = inject(DestroyRef);

  public demandValidationFilterChange = output<DemandValidationFilter>();

  protected formGroup: FormGroup<DemandValidationForm> = new FormGroup({
    productionLine: new FormControl([]),
    productLine: new FormControl([]),
    productionPlant: new FormControl([]), // TODO: Check, why this is not available in React
    customerMaterialNumber: new FormControl([]),
    stochasticType: new FormControl([]),
  });

  protected openDemandValidationFilterModal() {
    this.dialog
      .open(FilterDemandValidationModalComponent, {
        data: {
          formGroup: this.formGroup,
          activeFilterFn: this.getCount.bind(this),
        },
        disableClose: true,
        width: '500px',
        autoFocus: false,
      })
      .afterClosed()
      .pipe(
        tap(
          (values: DemandValidationFilter) =>
            values && this.demandValidationFilterChange.emit(values)
        ),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe();
  }

  protected getCount(formGroup: FormGroup): number {
    // eslint-disable-next-line unicorn/no-array-reduce
    return Object.keys(this.formGroup['controls']).reduce(
      (previous, current) =>
        previous + (formGroup.get(current)?.getRawValue()?.length || 0),
      0
    );
  }
}
