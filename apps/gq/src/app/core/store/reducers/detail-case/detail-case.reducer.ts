import { createReducer, on } from '@ngrx/store';

import {
  loadMaterialInformation,
  loadMaterialInformationFailure,
  loadMaterialInformationSuccess,
} from '../../actions';
import { MaterialDetails } from '../../models';

export interface DetailState {
  detailCase: {
    materialLoading: boolean;
    materialNumber15: string;
    materialDetails: MaterialDetails;
    errorMessage: string;
  };
}

export const initialState: DetailState = {
  detailCase: {
    materialLoading: false,
    materialNumber15: undefined,
    materialDetails: undefined,
    errorMessage: undefined,
  },
};

export const detailCaseReducer = createReducer(
  initialState,
  on(loadMaterialInformation, (state: DetailState, { materialNumber15 }) => ({
    ...state,
    detailCase: {
      ...state.detailCase,
      materialNumber15,
      materialLoading: true,
    },
  })),
  on(
    loadMaterialInformationFailure,
    (state: DetailState, { errorMessage }) => ({
      ...state,
      detailCase: {
        ...state.detailCase,
        errorMessage,
        materialLoading: false,
        materialDetails: undefined,
      },
    })
  ),
  on(
    loadMaterialInformationSuccess,
    (state: DetailState, { materialDetails }) => ({
      ...state,
      detailCase: {
        ...state.detailCase,
        materialDetails,
        materialLoading: false,
      },
    })
  )
);
