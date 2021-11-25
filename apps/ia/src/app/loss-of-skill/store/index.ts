import { Action, createFeatureSelector, createReducer, on } from '@ngrx/store';

import { JobProfile, OpenPosition } from '../models';
import {
  loadJobProfiles,
  loadJobProfilesFailure,
  loadJobProfilesSuccess,
  loadOpenPositions,
  loadOpenPositionsFailure,
  loadOpenPositionsSuccess,
} from './actions/loss-of-skill.actions';

export const lossOfSkillFeatureKey = 'lossOfSkill';

export interface LossOfSkillState {
  jobProfiles: {
    loading: boolean;
    data: JobProfile[];
    errorMessage: string;
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
    (state: LossOfSkillState, { jobProfiles }): LossOfSkillState => ({
      ...state,
      jobProfiles: {
        data: jobProfiles,
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
