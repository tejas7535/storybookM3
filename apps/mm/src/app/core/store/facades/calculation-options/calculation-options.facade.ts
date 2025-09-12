import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';

import { PreflightData } from '@mm/core/services/preflght-data-parser/preflight-data.interface';
import {
  CalculationOptionsFormData,
  ThermalCalculationOptionsFormData,
} from '@mm/steps/calculation-options-step/calculation-selection-step.interface';
import { Store } from '@ngrx/store';

import { CalculationOptionsActions } from '../../actions';
import { CalculationOptionsSelector } from '../../selectors';
import {
  getThermalOptions,
  getToleranceClasses,
} from '../../selectors/calculation-options/calculation-options.selector';

@Injectable({
  providedIn: 'root',
})
export class CalculationOptionsFacade {
  public readonly toleranceClasses =
    this.store.selectSignal(getToleranceClasses);
  public readonly thermalOptions = this.store.selectSignal(getThermalOptions);

  constructor(private readonly store: Store) {}

  public getOptions$(): Observable<PreflightData> {
    return this.store.select(CalculationOptionsSelector.getOptions);
  }

  public getCalculationPerformed$(): Observable<boolean> {
    return this.store.select(
      CalculationOptionsSelector.getCalculationPerformed
    );
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

  updateToleranceClasses(): void {
    this.store.dispatch(CalculationOptionsActions.fetchToleranceClasses());
  }

  updateThermalOptionsFromFormData(
    formData: ThermalCalculationOptionsFormData
  ): void {
    this.store.dispatch(
      CalculationOptionsActions.updateThermalOptionsFromFormData({ formData })
    );
  }
}
