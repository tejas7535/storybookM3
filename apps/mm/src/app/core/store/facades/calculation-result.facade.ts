import { Injectable } from '@angular/core';

import { Store } from '@ngrx/store';

import { CalculationResultActions } from '../actions/calculation-result';

@Injectable({
  providedIn: 'root',
})
export class CalculationResultFacade {
  constructor(private readonly store: Store) {}

  fetchCalculationResult(jsonReportUrl: string): void {
    this.store.dispatch(
      CalculationResultActions.fetchCalculationJsonResult({ jsonReportUrl })
    );
  }
}
