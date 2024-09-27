import { Action, createReducer, on } from '@ngrx/store';

import { adaptPreferredGreaseOptionsFromDialogResponseListValues } from '@ga/core/helpers/grease-helpers';
import * as parametersActions from '@ga/core/store/actions/calculation-parameters/calculation-parameters.actions';
import { CalculationParametersState } from '@ga/core/store/models';
import { ApplicationScenario } from '@ga/features/grease-calculation/calculation-parameters/constants/application-scenarios.model';

export const initialState: CalculationParametersState = {
  loads: {
    radial: undefined,
    axial: undefined,
    exact: false,
    loadRatio: undefined,
  },
  movements: {
    type: undefined,
    rotationalSpeed: undefined,
    shiftFrequency: undefined,
    shiftAngle: undefined,
  },
  environment: {
    operatingTemperature: undefined,
    environmentTemperature: undefined,
    environmentImpact: undefined,
    applicationScenario: ApplicationScenario.All,
  },
  preferredGrease: {
    greaseOptions: [],
    selectedGrease: undefined,
    maxTemperature: undefined,
    viscosity: undefined,
    nlgiClass: undefined,
    loading: false,
  },
  automaticLubrication: false,
  valid: false,
  updating: false,
  properties: undefined,
};

export const calculationParametersReducer = createReducer(
  initialState,
  on(
    parametersActions.patchParameters,
    (state, { parameters }): CalculationParametersState => ({
      ...state,
      ...parameters,
      updating: true,
    })
  ),
  on(
    parametersActions.modelUpdateSuccess,
    (state): CalculationParametersState => ({
      ...state,
      updating: false,
    })
  ),
  on(
    parametersActions.getPropertiesSuccess,
    (state, { properties }): CalculationParametersState => ({
      ...state,
      properties,
    })
  ),
  on(
    parametersActions.getDialog,
    (state): CalculationParametersState => ({
      ...state,
      preferredGrease: {
        ...state.preferredGrease,
        loading: true,
      },
    })
  ),
  on(
    parametersActions.getDialogSuccess,
    (state, { dialogResponse }): CalculationParametersState => ({
      ...state,
      preferredGrease: {
        ...state.preferredGrease,
        greaseOptions: adaptPreferredGreaseOptionsFromDialogResponseListValues(
          dialogResponse?.pages[2]?.groups[0]?.members[1]?.listValues
        ),
        loading: false,
      },
    })
  ),
  on(
    parametersActions.getDialogFailure,
    parametersActions.getDialogEnd,
    (state): CalculationParametersState => ({
      ...state,
      preferredGrease: {
        ...state.preferredGrease,
        loading: false,
      },
    })
  ),
  on(
    parametersActions.setPreferredGreaseSelection,
    (state, { selectedGrease }): CalculationParametersState => ({
      ...state,
      preferredGrease: {
        ...state.preferredGrease,
        selectedGrease,
      },
    })
  ),
  on(
    parametersActions.resetPreferredGreaseSelection,
    (state): CalculationParametersState => ({
      ...state,
      preferredGrease: {
        ...state.preferredGrease,
        selectedGrease: undefined,
      },
    })
  ),
  on(
    parametersActions.setAutomaticLubrication,
    (state, { automaticLubrication }): CalculationParametersState => ({
      ...state,
      automaticLubrication,
    })
  )
);

export function reducer(
  state: CalculationParametersState,
  action: Action
): CalculationParametersState {
  return calculationParametersReducer(state, action);
}
