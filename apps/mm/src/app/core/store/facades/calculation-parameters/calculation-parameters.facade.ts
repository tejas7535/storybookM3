import { Injectable } from '@angular/core';

import { Store } from '@ngrx/store';

import { CalculationParametersActions } from '../../actions/calculation-parameters';
import { CalculationParameters } from '../../models/calculation-parameters-state.model';
import { CalculationParametersSelector } from '../../selectors';

@Injectable({
  providedIn: 'root',
})
export class CalculationParametersFacade {
  public readonly getCalculationParameters$ = this.store.select(
    CalculationParametersSelector.getCalculationParameters
  );

  constructor(private readonly store: Store) {}

  setCalculationParameters(formProperties: CalculationParameters): void {
    this.store.dispatch(
      CalculationParametersActions.setCalculationParameters({
        parameters: formProperties,
      })
    );
  }
}
