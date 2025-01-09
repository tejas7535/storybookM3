import { Injectable } from '@angular/core';

import { CalculationOptionsFormData } from '@mm/steps/calculation-options-step/calculation-selection-step.interface';
import { Store } from '@ngrx/store';

import { CalculationOptionsActions } from '../../actions';
import { CalculationOptionsSelector } from '../../selectors';

@Injectable({
  providedIn: 'root',
})
export class CalculationOptionsFacade {
  public readonly options$ = this.store.select(
    CalculationOptionsSelector.getOptions
  );

  constructor(private readonly store: Store) {}

  updateShaftMaterialInfomration(shaftMaterialId: string): void {
    this.store.dispatch(
      CalculationOptionsActions.updateShaftMaterialInformation({
        selectedOption: shaftMaterialId,
      })
    );
  }

  updateFormData(formData: CalculationOptionsFormData): void {
    this.store.dispatch(
      CalculationOptionsActions.updateOptionsFromFormData({ formData })
    );
  }
}
