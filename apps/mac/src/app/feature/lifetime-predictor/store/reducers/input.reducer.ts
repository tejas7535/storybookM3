import { Action, createReducer, on } from '@ngrx/store';

import { ChartType } from '../../enums';
import { BurdeningType, Display, Material, Prediction } from '../../models';
import * as InputActions from '../actions/input.actions';

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
    showStatistical: false,
    chartType: ChartType.Woehler,
    bannerOpen: false,
  },
};

export const inputReducer = createReducer(
  initialState,
  on(
    InputActions.setPredictionOptions,
    (state, { predictions }): InputState => ({
      ...state,
      predictions,
    })
  ),
  on(
    InputActions.setBurdeningTypeOptions,
    (state, { burdeningTypes }): InputState => ({
      ...state,
      burdeningTypes,
    })
  ),
  on(
    InputActions.setMaterialOptions,
    (state, { materials }): InputState => ({
      ...state,
      materials,
    })
  ),
  on(
    InputActions.setMaterial,
    (state, { selectedMaterial }): InputState => ({
      ...state,
      selectedMaterial,
    })
  ),
  on(
    InputActions.unsetMaterial,
    (state): InputState => ({
      ...state,
      selectedMaterial: undefined,
    })
  ),
  on(InputActions.setDisplay, (state, { display }): InputState => {
    const { showMurakami, showFKM, showStatistical } = display;

    return {
      ...state,
      display: {
        ...state.display,
        showMurakami,
        showFKM,
        showStatistical,
      },
    };
  }),
  on(
    InputActions.setChartType,
    (state, { chartType }): InputState => ({
      ...state,
      display: { ...state.display, chartType },
    })
  ),
  on(
    InputActions.unsetDisplay,
    (state): InputState => ({
      ...state,
      display: initialState.display,
    })
  ),
  on(
    InputActions.setBannerVisible,
    (state, { bannerOpen }): InputState => ({
      ...state,
      display: { ...state.display, bannerOpen },
    })
  )
);

// eslint-disable-next-line prefer-arrow/prefer-arrow-functions
export function reducer(state: InputState, action: Action): InputState {
  return inputReducer(state, action);
}
