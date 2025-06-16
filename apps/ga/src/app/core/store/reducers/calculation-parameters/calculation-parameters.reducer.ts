import { Action, createReducer, on } from '@ngrx/store';

import { adaptPreferredGreaseOptionsFromDialogResponseListValues } from '@ga/core/helpers/grease-helpers';
import { CalculationParametersActions } from '@ga/core/store/actions/calculation-parameters/calculation-parameters.actions';
import { CalculationParametersState } from '@ga/core/store/models';
import { ApplicationScenario } from '@ga/features/grease-calculation/calculation-parameters/constants/application-scenarios.model';
import { Movement } from '@ga/shared/models';

export const initialState: CalculationParametersState = {
  loads: {
    radial: undefined,
    axial: undefined,
    exact: false,
    loadRatio: undefined,
  },
  movements: {
    type: Movement.rotating,
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
  competitorsGreases: [],
  schaefflerGreases: [],
  automaticLubrication: false,
  valid: false,
  updating: false,
  properties: undefined,
};

export const calculationParametersReducer = createReducer(
  initialState,
  on(
    CalculationParametersActions.patchParameters,
    (state, { parameters }): CalculationParametersState => {
      const mergedEnvironment = parameters.environment
        ? {
            ...state.environment,
            ...parameters.environment,
          }
        : state.environment;

      const mergedMovements = parameters.movements
        ? {
            ...state.movements,
            ...parameters.movements,
          }
        : state.movements;

      return {
        ...state,
        ...parameters,
        environment: mergedEnvironment, // Ensure environment values are properly merged
        movements: mergedMovements, // Ensure movement values are properly merged
        updating: true,
      };
    }
  ),
  on(
    CalculationParametersActions.modelUpdateSuccess,
    (state): CalculationParametersState => ({
      ...state,
      updating: false,
    })
  ),
  on(
    CalculationParametersActions.getPropertiesSuccess,
    (state, { properties }): CalculationParametersState => ({
      ...state,
      properties,
    })
  ),
  on(
    CalculationParametersActions.getDialog,
    (state): CalculationParametersState => ({
      ...state,
      preferredGrease: {
        ...state.preferredGrease,
        loading: true,
      },
    })
  ),
  on(
    CalculationParametersActions.getDialogSuccess,
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
    CalculationParametersActions.getDialogFailure,
    CalculationParametersActions.getDialogEnd,
    (state): CalculationParametersState => ({
      ...state,
      preferredGrease: {
        ...state.preferredGrease,
        loading: false,
      },
    })
  ),
  on(
    CalculationParametersActions.setPreferredGreaseSelection,
    (state, { selectedGrease }): CalculationParametersState => ({
      ...state,
      preferredGrease: {
        ...state.preferredGrease,
        selectedGrease,
      },
    })
  ),
  on(
    CalculationParametersActions.resetPreferredGreaseSelection,
    (state): CalculationParametersState => ({
      ...state,
      preferredGrease: {
        ...state.preferredGrease,
        selectedGrease: undefined,
      },
    })
  ),
  on(
    CalculationParametersActions.setAutomaticLubrication,
    (state, { automaticLubrication }): CalculationParametersState => ({
      ...state,
      automaticLubrication,
    })
  ),
  on(
    CalculationParametersActions.loadCompetitorsGreasesSuccess,
    (state, { greases }): CalculationParametersState => ({
      ...state,
      competitorsGreases: greases,
    })
  ),
  on(
    CalculationParametersActions.loadSchaefflerGreasesSuccess,
    (state, { greases }): CalculationParametersState => ({
      ...state,
      schaefflerGreases: greases,
    })
  )
);

export function reducer(
  state: CalculationParametersState,
  action: Action
): CalculationParametersState {
  return calculationParametersReducer(state, action);
}
