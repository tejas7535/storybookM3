import { Action, createReducer, on } from '@ngrx/store';

import * as InputActions from '../actions/input.actions';

import { ChartType } from '../../../shared/enums';
import {
  BurdeningType,
  Display,
  Material,
  Prediction
} from '../../../shared/models';

export interface InputState {
  predictions: Prediction[];
  burdeningTypes: BurdeningType[];
  materials: Material[];
  selectedMaterial: string;
  display: Display;
}

export const initialState: InputState = {
  predictions: [],
  burdeningTypes: [],
  materials: [],
  selectedMaterial: undefined,
  display: {
    showMurakami: false,
    showFKM: false,
    chartType: ChartType.Woehler,
    bannerOpen: false
  }
};

export const inputReducer = createReducer(
  initialState,
  on(InputActions.setPredictionOptions, (state, { predictions }) => ({
    ...state,
    predictions
  })),
  on(InputActions.setBurdeningTypeOptions, (state, { burdeningTypes }) => ({
    ...state,
    burdeningTypes
  })),
  on(InputActions.setMaterialOptions, (state, { materials }) => ({
    ...state,
    materials
  })),
  on(InputActions.setMaterial, (state, { selectedMaterial }) => ({
    ...state,
    selectedMaterial
  })),
  on(InputActions.unsetMaterial, state => ({
    ...state,
    selectedMaterial: undefined
  })),
  on(InputActions.setDisplay, (state, { display }) => {
    const { showMurakami, showFKM } = display;

    return {
      ...state,
      display: {
        ...state.display,
        showMurakami,
        showFKM
      }
    };
  }),
  on(InputActions.setChartType, (state, { chartType }) => ({
    ...state,
    display: { ...state.display, chartType }
  })),
  on(InputActions.unsetDisplay, state => ({
    ...state,
    display: initialState.display
  })),
  on(InputActions.setBannerVisible, (state, { bannerOpen }) => ({
    ...state,
    display: { ...state.display, bannerOpen }
  }))
);

// tslint:disable-next-line: only-arrow-functions
export function reducer(state: InputState, action: Action): InputState {
  return inputReducer(state, action);
}
