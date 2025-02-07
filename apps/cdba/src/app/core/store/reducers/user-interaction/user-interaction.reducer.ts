import { createReducer, on } from '@ngrx/store';

import {
  BomExportProgress,
  BomExportStatus,
} from '@cdba/user-interaction/model/feature/bom-export';

import {
  loadInitialBomExportStatus,
  loadInitialBomExportStatusFailure,
  loadInitialBomExportStatusSuccess,
  trackBomExportStatus,
  trackBomExportStatusCompleted,
  trackBomExportStatusFailure,
  updateBomExportStatus,
} from '../../actions';

export interface BomExportFeature {
  loading: boolean;
  errorMessage: string;
  status: BomExportStatus;
}

export interface UserInteractionState {
  feature: {
    bomExport: BomExportFeature;
  };
}

export const initialState: UserInteractionState = {
  feature: {
    bomExport: {
      loading: false,
      errorMessage: undefined,
      status: undefined,
    } as BomExportFeature,
  },
};

export const userInteractionReducer = createReducer(
  initialState,
  on(
    loadInitialBomExportStatus,
    (state: UserInteractionState): UserInteractionState => ({
      ...state,
      feature: {
        ...state.feature,
        bomExport: {
          ...state.feature.bomExport,
          loading: true,
        },
      },
    })
  ),
  on(
    loadInitialBomExportStatusSuccess,
    (state, { status }): UserInteractionState => ({
      ...state,
      feature: {
        ...state.feature,
        bomExport: {
          ...state.feature.bomExport,
          loading: false,
          status,
        },
      },
    })
  ),
  on(
    loadInitialBomExportStatusFailure,
    (state, { errorMessage }): UserInteractionState => ({
      ...state,
      feature: {
        ...state.feature,
        bomExport: {
          ...state.feature.bomExport,
          loading: false,
          errorMessage,
        },
      },
    })
  ),
  on(
    updateBomExportStatus,
    (state, { currentStatus }): UserInteractionState => ({
      ...state,
      feature: {
        ...state.feature,
        bomExport: {
          ...state.feature.bomExport,
          status: currentStatus,
        },
      },
    })
  ),
  on(
    trackBomExportStatus,
    (state: UserInteractionState): UserInteractionState => ({
      ...state,
      feature: {
        ...state.feature,
        bomExport: {
          ...state.feature.bomExport,
          loading: false,
          status: {
            ...state.feature.bomExport.status,
            progress: BomExportProgress.STARTED,
          },
        },
      },
    })
  ),
  on(
    trackBomExportStatusCompleted,
    (state: UserInteractionState): UserInteractionState => ({
      ...state,
      feature: {
        ...state.feature,
        bomExport: {
          ...state.feature.bomExport,
          loading: false,
        },
      },
    })
  ),
  on(
    trackBomExportStatusFailure,
    (state, { errorMessage }): UserInteractionState => ({
      ...state,
      feature: {
        ...state.feature,
        bomExport: {
          ...state.feature.bomExport,
          loading: false,
          errorMessage,
          status: {
            ...state.feature.bomExport.status,
            progress: BomExportProgress.FAILED,
          },
        },
      },
    })
  )
);
