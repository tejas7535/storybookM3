import { Injectable } from '@angular/core';

import { Action, Store } from '@ngrx/store';

import {
  getCalculationResult,
  getCalculationResultPreviewData,
  isCalculationImpossible,
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

  constructor(private readonly store: Store) {}

  dispatch(action: Action) {
    this.store.dispatch(action);
  }
}
