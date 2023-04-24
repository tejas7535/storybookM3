import { Injectable } from '@angular/core';

import { Action, Store } from '@ngrx/store';

import { isCalculationResultAvailable } from '../../selectors';
import { getCalculationResultPreviewData } from '../../selectors/calculation-result/calculation-result-preview.selector';

@Injectable({
  providedIn: 'root',
})
export class CalculationResultFacade {
  public readonly getCalculationResultPreviewData$ = this.store.select(
    getCalculationResultPreviewData
  );

  public readonly isCalculationResultAvailable$ = this.store.select(
    isCalculationResultAvailable
  );

  constructor(private readonly store: Store) {}

  dispatch(action: Action) {
    this.store.dispatch(action);
  }
}
