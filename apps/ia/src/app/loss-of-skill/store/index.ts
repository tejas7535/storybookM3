import { Action, createFeatureSelector, createReducer, on } from '@ngrx/store';

import { LostJobProfile } from '../models';
import {
  loadLostJobProfiles,
  loadLostJobProfilesFailure,
  loadLostJobProfilesSuccess,
} from './actions/loss-of-skill.actions';

export const lossOfSkillFeatureKey = 'lossOfSkill';

export interface LossOfSkillState {
  lostJobProfiles: {
    loading: boolean;
    data: LostJobProfile[];
    errorMessage: string;
  };
}

export const initialState: LossOfSkillState = {
  lostJobProfiles: {
    loading: false,
    data: undefined,
    errorMessage: undefined,
  },
};

export const lossOfSkillReducer = createReducer(
  initialState,
  on(
    loadLostJobProfiles,
    (state: LossOfSkillState): LossOfSkillState => ({
      ...state,
      lostJobProfiles: {
        ...state.lostJobProfiles,
        loading: true,
      },
    })
  ),
  on(
    loadLostJobProfilesSuccess,
    (state: LossOfSkillState, { lostJobProfiles }): LossOfSkillState => ({
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
    (state: LossOfSkillState, { errorMessage }): LossOfSkillState => ({
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
  state: LossOfSkillState,
  action: Action
): LossOfSkillState {
  return lossOfSkillReducer(state, action);
}

export const selectLossOfSkillState = createFeatureSelector<LossOfSkillState>(
  lossOfSkillFeatureKey
);
