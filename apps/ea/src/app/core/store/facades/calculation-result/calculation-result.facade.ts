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

  public readonly calculationReportInput$ = this.store.select(
    CalculationResultReportSelector.getResultInput
  );

  public readonly calculationReportMessages$ = this.store.select(
    CalculationResultReportSelector.getReportMessages
  );

  public readonly isEmissionResultAvailable$ = this.store.select(
    CalculationResultReportSelector.isEmissionResultAvailable
  );

  public readonly calculationReportFrictionalPowerloss$ = this.store.select(
    CalculationResultReportSelector.getFrictionalalPowerlossReport
  );

  public readonly isFrictionResultAvailable$ = this.store.select(
    CalculationResultReportSelector.isFrictionResultAvailable
  );

  public readonly getSelectedCalculations$ = this.store.select(
    CalculationResultReportSelector.getSelectedCalculations
  );

  constructor(private readonly store: Store) {}

  dispatch(action: Action) {
    this.store.dispatch(action);
  }
}
