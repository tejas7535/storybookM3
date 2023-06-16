import { PlantMaterialDetail } from '@gq/shared/models/quotation-detail/plant-material-detail.model';
import { Action, createReducer, on } from '@ngrx/store';

import {
  loadPlantMaterialDetails,
  loadPlantMaterialDetailsFailure,
  loadPlantMaterialDetailsSuccess,
  resetPlantMaterialDetails,
} from '../../actions/plant-material-details/plant-material-details.actions';

export interface PlantMaterialDetailsState {
  plantMaterialDetails: PlantMaterialDetail[];
  plantMaterialDetailsLoading: boolean;
  errorMessage: string | undefined;
}

export const initialState: PlantMaterialDetailsState = {
  plantMaterialDetails: [],
  plantMaterialDetailsLoading: false,
  errorMessage: undefined,
};

export const plantMaterialDetailsReducer = createReducer(
  initialState,
  on(
    loadPlantMaterialDetails,
    (state: PlantMaterialDetailsState): PlantMaterialDetailsState => ({
      ...state,
      plantMaterialDetails: [],
      plantMaterialDetailsLoading: true,
      errorMessage: undefined,
    })
  ),
  on(
    loadPlantMaterialDetailsSuccess,
    (
      state: PlantMaterialDetailsState,
      { plantMaterialDetails }
    ): PlantMaterialDetailsState => ({
      ...state,
      plantMaterialDetails,
      plantMaterialDetailsLoading: false,
      errorMessage: undefined,
    })
  ),
  on(
    loadPlantMaterialDetailsFailure,
    (
      state: PlantMaterialDetailsState,
      { errorMessage }
    ): PlantMaterialDetailsState => ({
      ...state,
      plantMaterialDetailsLoading: false,
      errorMessage,
    })
  ),
  on(
    resetPlantMaterialDetails,
    (state: PlantMaterialDetailsState): PlantMaterialDetailsState => ({
      ...state,
      errorMessage: undefined,
      plantMaterialDetailsLoading: false,
      plantMaterialDetails: [],
    })
  )
);

export function reducer(
  state: PlantMaterialDetailsState,
  action: Action
): PlantMaterialDetailsState {
  return plantMaterialDetailsReducer(state, action);
}
