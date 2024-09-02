import { createReducer, on } from '@ngrx/store';

import { CalculationParametersActions } from '../../actions/calculation-parameters';
import { CalculationParametersState } from '../../models/calculation-parameters-state.model';

export const initialState: CalculationParametersState = {
  parameters: undefined,
};

export const calculationParametersReducer = createReducer(
  initialState,
  on(
    CalculationParametersActions.setCalculationParameters,
    (state, { parameters }): CalculationParametersState => ({
      ...state,
      parameters,
    })
  )
);
