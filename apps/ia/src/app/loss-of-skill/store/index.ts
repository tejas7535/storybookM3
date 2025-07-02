import { Action, createFeatureSelector, createReducer, on } from '@ngrx/store';

import { ExitEntryEmployeesResponse } from '../../overview/models';
import {
  LossOfSkillTab,
  LostJobProfilesResponse,
  PmgmDataResponse,
  WorkforceResponse,
} from '../models';
import {
  clearLossOfSkillDimensionData,
  loadJobProfiles,
  loadJobProfilesFailure,
  loadJobProfilesSuccess,
  loadLossOfSkillLeavers,
  loadLossOfSkillLeaversFailure,
  loadLossOfSkillLeaversSuccess,
  loadLossOfSkillWorkforce,
  loadLossOfSkillWorkforceFailure,
  loadLossOfSkillWorkforceSuccess,
  loadPmgmData,
  loadPmgmDataFailure,
  loadPmgmDataSuccess,
  setLossOfSkillSelectedTab,
} from './actions/loss-of-skill.actions';

export const lossOfSkillFeatureKey = 'lossOfSkill';

export interface LossOfSkillState {
  selectedTab: LossOfSkillTab;
  jobProfiles: {
    loading: boolean;
    data: LostJobProfilesResponse;
    errorMessage: string;
  };
  workforce: {
    loading: boolean;
    data: WorkforceResponse;
    errorMessage: string;
  };
  leavers: {
    loading: boolean;
    data: ExitEntryEmployeesResponse;
    errorMessage: string;
  };
  pmgm: {
    loading: boolean;
    data: PmgmDataResponse;
    errorMessage: string;
  };
}

export const initialState: LossOfSkillState = {
  selectedTab: LossOfSkillTab.PERFORMANCE,
  jobProfiles: {
    loading: false,
    data: undefined,
    errorMessage: undefined,
  },
  workforce: {
    loading: false,
    data: undefined,
    errorMessage: undefined,
  },
  leavers: {
    loading: false,
    data: undefined,
    errorMessage: undefined,
  },
  pmgm: {
    loading: false,
    data: undefined,
    errorMessage: undefined,
  },
};

export const lossOfSkillReducer = createReducer(
  initialState,
  on(
    setLossOfSkillSelectedTab,
    (state: LossOfSkillState, { selectedTab }): LossOfSkillState => ({
      ...state,
      selectedTab,
    })
  ),
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
    loadLossOfSkillWorkforce,
    (state: LossOfSkillState): LossOfSkillState => ({
      ...state,
      workforce: {
        ...state.workforce,
        data: undefined,
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
        errorMessage,
      },
    })
  ),
  on(
    clearLossOfSkillDimensionData,
    (state: LossOfSkillState): LossOfSkillState => ({
      ...state,
      jobProfiles: {
        ...state.jobProfiles,
        data: undefined,
      },
      workforce: {
        ...state.workforce,
        data: undefined,
      },
      leavers: {
        ...state.leavers,
        data: undefined,
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
        errorMessage,
      },
    })
  ),
  on(
    loadPmgmData,
    (state: LossOfSkillState): LossOfSkillState => ({
      ...state,
      pmgm: {
        ...state.pmgm,
        data: undefined,
        loading: true,
      },
    })
  ),
  on(
    loadPmgmDataSuccess,
    (state: LossOfSkillState, { data }): LossOfSkillState => ({
      ...state,
      pmgm: {
        ...state.pmgm,
        data,
        loading: false,
      },
    })
  ),
  on(
    loadPmgmDataFailure,
    (state: LossOfSkillState, { errorMessage }): LossOfSkillState => ({
      ...state,
      pmgm: {
        ...state.pmgm,
        loading: false,
        errorMessage,
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
