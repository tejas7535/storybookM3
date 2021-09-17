import { Action, createReducer, on } from '@ngrx/store';

import { setStepper } from '../../actions/settings/settings.actions';
import { GreaseCalculationPath } from './../../../../grease-calculation/grease-calculation-path.enum';
import { Step, Stepper } from './../../../../shared/models';

export interface SettingsState {
  stepper: Stepper;
  language: string;
  units: string;
  decimalSeparator: string;
}

const initialSteps: Step[] = [
  {
    name: 'bearingSelection',
    index: 0,
    editable: true,
    completed: false,
    enabled: true,
    link: `${GreaseCalculationPath.BearingPath}`,
  },
  {
    name: 'parameters',
    index: 1,
    editable: false,
    completed: false,
    enabled: false,
    link: `${GreaseCalculationPath.ParametersPath}`,
  },
  {
    name: 'report',
    index: 2,
    editable: false,
    completed: false,
    enabled: false,
    link: `${GreaseCalculationPath.ResultPath}`,
  },
];

export const initialState: SettingsState = {
  stepper: {
    steps: initialSteps,
    currentStep: 0,
    previousStep: undefined,
    nextStep: 1,
  },
  language: undefined,
  units: undefined,
  decimalSeparator: undefined,
};

export const settingsReducer = createReducer(
  initialState,
  on(
    setStepper,
    (state, { stepper }): SettingsState => ({
      ...state,
      stepper,
    })
  )
);

export function reducer(state: SettingsState, action: Action): SettingsState {
  return settingsReducer(state, action);
}
