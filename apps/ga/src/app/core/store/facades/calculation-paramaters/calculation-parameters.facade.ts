import { Injectable } from '@angular/core';

import { Action, Store } from '@ngrx/store';

import { setAutomaticLubrication } from '../../actions/calculation-parameters/calculation-parameters.actions';
import {
  getGreaseApplication,
  getMotionType,
  isVerticalAxisOrientation,
} from '../../selectors/calculation-parameters/calculation-parameters.selector';

@Injectable({
  providedIn: 'root',
})
export class CalculationParametersFacade {
  public readonly isVerticalAxisOrientation$ = this.store.select(
    isVerticalAxisOrientation
  );

  public readonly selectedGreaseApplication$ =
    this.store.select(getGreaseApplication);

  public readonly motionType$ = this.store.select(getMotionType);

  constructor(private readonly store: Store) {}

  public setAutomaticLubrication(automaticLubrication: boolean): void {
    this.dispatch(setAutomaticLubrication({ automaticLubrication }));
  }

  dispatch(action: Action) {
    this.store.dispatch(action);
  }
}
