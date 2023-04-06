import { Injectable } from '@angular/core';

import { Action, Store } from '@ngrx/store';

import {
  getBasicFrequencies,
  getCalculationId,
  getCalculationResult,
  getCalculationResultPreviewData,
  getModelId,
  isCalculationImpossible,
  isCalculationLoading,
  isCalculationResultAvailable,
} from '../../selectors/calculation-result/calculation-result.selector';

@Injectable({
  providedIn: 'root',
})
export class CalculationResultFacade {
  public readonly calculationResult$ = this.store.select(getCalculationResult);
  public readonly getCalculationResultPreviewData$ = this.store.select(
    getCalculationResultPreviewData
  );
  public readonly isCalculationResultAvailable$ = this.store.select(
    isCalculationResultAvailable
  );
  public readonly isCalculationImpossible$ = this.store.select(
    isCalculationImpossible
  );
  public readonly isCalculationLoading$ =
    this.store.select(isCalculationLoading);

  public modelId$ = this.store.select(getModelId);
  public calculationId$ = this.store.select(getCalculationId);

  public readonly basicFrequencies$ = this.store.select(getBasicFrequencies);

  constructor(private readonly store: Store) {}

  dispatch(action: Action) {
    this.store.dispatch(action);
  }
}
