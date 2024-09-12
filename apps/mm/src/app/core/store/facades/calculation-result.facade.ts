import { Injectable } from '@angular/core';

import { Store } from '@ngrx/store';

import { CalculationResultActions } from '../actions/calculation-result';
import { CalculationParameters } from '../models/calculation-parameters-state.model';
import { CalculationResultSelector } from '../selectors';

@Injectable({
  providedIn: 'root',
})
export class CalculationResultFacade {
  public readonly getCalculationInputs$ = this.store.select(
    CalculationResultSelector.getCalculationInputs
  );

  public readonly getCalulationMessages$ = this.store.select(
    CalculationResultSelector.getCalculationMessages
  );

  public readonly isResultAvailable$ = this.store.select(
    CalculationResultSelector.isResultAvailable
  );

  public readonly mountingRecommendations$ = this.store.select(
    CalculationResultSelector.getMountingRecommendations
  );

  public readonly mountingTools$ = this.store.select(
    CalculationResultSelector.getMountingTools
  );

  public readonly hasMountingTools$ = this.store.select(
    CalculationResultSelector.hasMountingTools
  );

  public readonly reportSelectionTypes$ = this.store.select(
    CalculationResultSelector.getReportSelectionTypes
  );

  constructor(private readonly store: Store) {}

  fetchCalculationResultResourcesLinks(
    formProperties: CalculationParameters
  ): void {
    this.store.dispatch(
      CalculationResultActions.fetchCalculationResultResourcesLinks({
        formProperties,
      })
    );
  }

  fetchCalculationResult(jsonReportUrl: string): void {
    this.store.dispatch(
      CalculationResultActions.fetchCalculationJsonResult({ jsonReportUrl })
    );
  }
}
