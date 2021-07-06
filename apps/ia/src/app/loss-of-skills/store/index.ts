import { Action, createFeatureSelector, createReducer, on } from '@ngrx/store';

import { LostJobProfile } from '../models';
import {
  loadLostJobProfiles,
  loadLostJobProfilesFailure,
  loadLostJobProfilesSuccess,
} from './actions/loss-of-skills.actions';

export const lossOfSkillsFeatureKey = 'lossOfSkills';

export interface LossOfSkillsState {
  lostJobProfiles: {
    loading: boolean;
    data: LostJobProfile[];
    errorMessage: string;
  };
}

export const initialState: LossOfSkillsState = {
  lostJobProfiles: {
    loading: false,
    data: undefined,
    errorMessage: undefined,
  },
};

export const lossOfSkillsReducer = createReducer(
  initialState,
  on(
    loadLostJobProfiles,
    (state: LossOfSkillsState): LossOfSkillsState => ({
      ...state,
      lostJobProfiles: {
        ...state.lostJobProfiles,
        loading: true,
      },
    })
  ),
  on(
    loadLostJobProfilesSuccess,
    (state: LossOfSkillsState, { lostJobProfiles }): LossOfSkillsState => ({
      ...state,
      lostJobProfiles: {
        data: lostJobProfiles,
        loading: false,
        errorMessage: undefined,
      },
    })
  ),
  on(
    loadLostJobProfilesFailure,
    (state: LossOfSkillsState, { errorMessage }): LossOfSkillsState => ({
      ...state,
      lostJobProfiles: {
        errorMessage,
        data: undefined,
        loading: false,
      },
    })
  )
);

// eslint-disable-next-line prefer-arrow/prefer-arrow-functions
export function reducer(
  state: LossOfSkillsState,
  action: Action
): LossOfSkillsState {
  return lossOfSkillsReducer(state, action);
}

export const selectLossOfSkillsState = createFeatureSelector<LossOfSkillsState>(
  lossOfSkillsFeatureKey
);
