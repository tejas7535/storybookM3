import { Injectable } from '@angular/core';

import { Action, Store } from '@ngrx/store';

import { setAutomaticLubrication } from '../../actions/calculation-parameters/calculation-parameters.actions';
import { isVerticalAxisOrientation } from '../../selectors/calculation-parameters/calculation-parameters.selector';

@Injectable({
  providedIn: 'root',
})
export class CalculationParametersFacade {
  public readonly isVerticalAxisOrientation$ = this.store.select(
    isVerticalAxisOrientation
  );

  constructor(private readonly store: Store) {}

  public setAutomaticLubrication(automaticLubrication: boolean): void {
    this.dispatch(setAutomaticLubrication({ automaticLubrication }));
  }

  dispatch(action: Action) {
    this.store.dispatch(action);
  }
}
