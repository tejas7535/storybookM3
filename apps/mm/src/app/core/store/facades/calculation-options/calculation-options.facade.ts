import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';

import { PreflightData } from '@mm/core/services/preflght-data-parser/preflight-data.interface';
import { CalculationOptionsFormData } from '@mm/steps/calculation-options-step/calculation-selection-step.interface';
import { Store } from '@ngrx/store';

import { CalculationOptionsActions } from '../../actions';
import { CalculationOptionsSelector } from '../../selectors';

@Injectable({
  providedIn: 'root',
})
export class CalculationOptionsFacade {
  constructor(private readonly store: Store) {}

  public getOptions$(): Observable<PreflightData> {
    return this.store.select(CalculationOptionsSelector.getOptions);
  }

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
