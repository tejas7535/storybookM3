import { Action, createFeatureSelector, createReducer, on } from '@ngrx/store';

import { ExitEntryEmployeesResponse } from '../../overview/models';
import {
  LostJobProfilesResponse,
  OpenPosition,
  WorkforceResponse,
} from '../models';
import {
  loadJobProfiles,
  loadJobProfilesFailure,
  loadJobProfilesSuccess,
  loadLossOfSkillLeavers,
  loadLossOfSkillLeaversFailure,
  loadLossOfSkillLeaversSuccess,
  loadLossOfSkillWorkforce,
  loadLossOfSkillWorkforceFailure,
  loadLossOfSkillWorkforceSuccess,
  loadOpenPositions,
  loadOpenPositionsFailure,
  loadOpenPositionsSuccess,
} from './actions/loss-of-skill.actions';

export const lossOfSkillFeatureKey = 'lossOfSkill';

export interface LossOfSkillState {
  jobProfiles: {
    loading: boolean;
    data: LostJobProfilesResponse;
    errorMessage: string;
  };
  workforce: {
    loading: boolean;
    data: WorkforceResponse;
    errorMesssage: string;
  };
  leavers: {
    loading: boolean;
    data: ExitEntryEmployeesResponse;
    errorMesssage: string;
  };
  openPositions: {
    loading: boolean;
    data: OpenPosition[];
    errorMessage: string;
  };
}

export const initialState: LossOfSkillState = {
  jobProfiles: {
    loading: false,
    data: undefined,
    errorMessage: undefined,
  },
  workforce: {
    loading: false,
    data: undefined,
    errorMesssage: undefined,
  },
  leavers: {
    loading: false,
    data: undefined,
    errorMesssage: undefined,
  },
  openPositions: {
    loading: false,
    data: undefined,
    errorMessage: undefined,
  },
};

export const lossOfSkillReducer = createReducer(
  initialState,
  on(
    loadJobProfiles,
    (state: LossOfSkillState): LossOfSkillState => ({
      ...state,
      jobProfiles: {
        ...state.jobProfiles,
        loading: true,
      },
    })
  ),
  on(
    loadJobProfilesSuccess,
    (
      state: LossOfSkillState,
      { lostJobProfilesResponse }
    ): LossOfSkillState => ({
      ...state,
      jobProfiles: {
        data: lostJobProfilesResponse,
        loading: false,
        errorMessage: undefined,
      },
    })
  ),
  on(
    loadJobProfilesFailure,
    (state: LossOfSkillState, { errorMessage }): LossOfSkillState => ({
      ...state,
      jobProfiles: {
        errorMessage,
        data: undefined,
        loading: false,
      },
    })
  ),
  on(
    loadOpenPositions,
    (state: LossOfSkillState): LossOfSkillState => ({
      ...state,
      openPositions: {
        ...state.openPositions,
        loading: true,
      },
    })
  ),
  on(
    loadOpenPositionsSuccess,
    (state: LossOfSkillState, { openPositions }): LossOfSkillState => ({
      ...state,
      openPositions: {
        data: openPositions,
        loading: false,
        errorMessage: undefined,
      },
    })
  ),
  on(
    loadOpenPositionsFailure,
    (state: LossOfSkillState, { errorMessage }): LossOfSkillState => ({
      ...state,
      openPositions: {
        errorMessage,
        data: undefined,
        loading: false,
      },
    })
  ),
  on(
    loadLossOfSkillWorkforce,
    (state: LossOfSkillState): LossOfSkillState => ({
      ...state,
      workforce: {
        ...state.workforce,
        loading: true,
      },
    })
  ),
  on(
    loadLossOfSkillWorkforceSuccess,
    (state: LossOfSkillState, { data }): LossOfSkillState => ({
      ...state,
      workforce: {
        ...state.workforce,
        data,
        loading: false,
      },
    })
  ),
  on(
    loadLossOfSkillWorkforceFailure,
    (state: LossOfSkillState, { errorMessage }): LossOfSkillState => ({
      ...state,
      workforce: {
        ...state.workforce,
        loading: false,
        errorMesssage: errorMessage,
      },
    })
  ),
  on(
    loadLossOfSkillLeavers,
    (state: LossOfSkillState): LossOfSkillState => ({
      ...state,
      leavers: {
        ...state.leavers,
        loading: true,
      },
    })
  ),
  on(
    loadLossOfSkillLeaversSuccess,
    (state: LossOfSkillState, { data }): LossOfSkillState => ({
      ...state,
      leavers: {
        ...state.leavers,
        data,
        loading: false,
      },
    })
  ),
  on(
    loadLossOfSkillLeaversFailure,
    (state: LossOfSkillState, { errorMessage }): LossOfSkillState => ({
      ...state,
      leavers: {
        ...state.leavers,
        loading: false,
        errorMesssage: errorMessage,
      },
    })
  )
);

// eslint-disable-next-line prefer-arrow/prefer-arrow-functions
export function reducer(
  state: LossOfSkillState,
  action: Action
): LossOfSkillState {
  return lossOfSkillReducer(state, action);
}

export const selectLossOfSkillState = createFeatureSelector<LossOfSkillState>(
  lossOfSkillFeatureKey
);
