import { Injectable } from '@angular/core';

import { Action, Store } from '@ngrx/store';

import {
  CalculationResultPreviewSelector,
  CalculationResultReportSelector,
} from '../../selectors/calculation-result';
import {
  getSelectedCalculations,
  isOverrolingFrequenciesAvailable,
  pdfReportAvailable,
} from '../../selectors/calculation-result/calculation-result-report.selector';
import {
  getError as getCatalogCalculationError,
  isLoading,
} from '../../selectors/calculation-result/catalog-calculation-result.selector';

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

  public readonly isCalculationImpossible$ = this.store.select(
    CalculationResultPreviewSelector.isCalculationImpossible
  );

  public readonly isCalculationGeneralError$ = this.store.select(
    CalculationResultPreviewSelector.isCalculationGeneralError
  );

  public readonly calculationReportCO2Emission$ = this.store.select(
    CalculationResultReportSelector.getCO2EmissionReport
  );

  public readonly calculationReportInput$ = this.store.select(
    CalculationResultReportSelector.getResultInput
  );

  public readonly calculationReportErrors$ = this.store.select(
    CalculationResultReportSelector.getReportErrors
  );

  public readonly calculationReportDownstreamErrors$ = this.store.select(
    CalculationResultReportSelector.getReportDownstreamErrors
  );

  public readonly getAllErrors$ = this.store.select(
    CalculationResultReportSelector.getAllErrors
  );

  public readonly calculationReportWarnings$ = this.store.select(
    CalculationResultReportSelector.getReportWarnings
  );

  public readonly calculationReportNotes$ = this.store.select(
    CalculationResultReportSelector.getReportNotes
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

  public readonly getCalculationsWithResult$ = this.store.select(
    CalculationResultReportSelector.getCalculationsWithResult
  );

  public readonly isRatingLifeResultAvailable$ = this.store.select(
    CalculationResultReportSelector.isRatingLifeResultAvailable
  );

  public readonly isLubricationResultAvailable$ = this.store.select(
    CalculationResultReportSelector.isLubricationResultAvailable
  );

  public readonly calculationReportLubrication$ = this.store.select(
    CalculationResultReportSelector.getLubricationReport
  );

  public readonly calculationReportRatingLife$ = this.store.select(
    CalculationResultReportSelector.getRatingLifeResultReport
  );

  public readonly getOverrollingFrequencies$ = this.store.select(
    CalculationResultReportSelector.getOverrollingFrequencies
  );

  public readonly isOverrollingFrequenciesAvailable$ = this.store.select(
    isOverrolingFrequenciesAvailable
  );

  public readonly isOverrollingLoading$ = this.store.select(isLoading);

  public readonly getCatalogCalculationError$ = this.store.select(
    getCatalogCalculationError
  );

  public readonly isPDFReportAvailable$ = this.store.select(pdfReportAvailable);

  public readonly getSelectedCalculations$ = this.store.select(
    getSelectedCalculations
  );

  constructor(private readonly store: Store) {}

  dispatch(action: Action) {
    this.store.dispatch(action);
  }
}
