import { Injectable } from '@angular/core';

import { Action, Store } from '@ngrx/store';

import {
  CalculationResultPreviewSelector,
  CalculationResultReportSelector,
} from '../../selectors/calculation-result';

@Injectable({
  providedIn: 'root',
})
export class CalculationResultFacade {
  public readonly getCalculationResultPreviewData$ = this.store.select(
    CalculationResultPreviewSelector.getCalculationResultPreviewData
  );

  public readonly isCalculationResultReportAvailable$ = this.store.select(
    CalculationResultPreviewSelector.isCalculationResultReportAvailable
  );

  public readonly calculationReportCO2Emission$ = this.store.select(
    CalculationResultReportSelector.getCO2EmissionReport
  );

  public readonly getSelectedCalculations$ = this.store.select(
    CalculationResultReportSelector.getSelectedCalculations
  );

  constructor(private readonly store: Store) {}

  dispatch(action: Action) {
    this.store.dispatch(action);
  }
}
