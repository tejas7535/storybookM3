import { Action, createReducer, on } from '@ngrx/store';

import * as SettingsAction from '../../actions/settings/settings.action';
import { GreaseCalculationPath } from './../../../../grease-calculation/grease-calculation-path.enum';
import { Step } from './../../../../shared/models';

export interface SettingsState {
  stepper: {
    steps: Step[];
    currentStep: number;
    previousStep: number;
    nextStep: number;
  };
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
    link: 'tbd',
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
    SettingsAction.setStepper,
    (state, newStepperState): SettingsState => ({
      ...state,
      stepper: {
        ...newStepperState,
      },
    })
  )
);

export function reducer(state: SettingsState, action: Action): SettingsState {
  return settingsReducer(state, action);
}
