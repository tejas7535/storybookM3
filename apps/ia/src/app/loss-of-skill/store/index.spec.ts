import { Action } from '@ngrx/store';

import { initialState, lossOfSkillReducer, reducer } from '.';
import { EmployeesRequest } from '../../shared/models';
import { LostJobProfile } from '../models';
import {
  loadLostJobProfiles,
  loadLostJobProfilesFailure,
  loadLostJobProfilesSuccess,
} from './actions/loss-of-skill.actions';

describe('LossOfSkill Reducer', () => {
  const errorMessage = 'An error occured';

  describe('loadLostJobProfiles', () => {
    test('should set loading', () => {
      const action = loadLostJobProfiles({
        request: {} as unknown as EmployeesRequest,
      });
      const state = lossOfSkillReducer(initialState, action);

      expect(state.lostJobProfiles.loading).toBeTruthy();
    });
  });

  describe('loadLostJobProfilesSuccess', () => {
    test('should unset loading and set lost job profiles', () => {
      const lostJobProfiles: LostJobProfile[] = [
        {
          job: 'Foo Bar',
          employees: [],
          leavers: [],
          openPositions: 1,
        },
      ];

      const action = loadLostJobProfilesSuccess({ lostJobProfiles });

      const state = lossOfSkillReducer(initialState, action);

      expect(state.lostJobProfiles.loading).toBeFalsy();
      expect(state.lostJobProfiles.data).toEqual(lostJobProfiles);
    });
  });

  describe('loadLostJobProfilesFailure', () => {
    test('should unset loading / set error message', () => {
      const action = loadLostJobProfilesFailure({ errorMessage });
      const fakeState = {
        ...initialState,
        loading: true,
        data: [{ workforce: 10, leavers: 3, job: 'Foo Bar' }],
      };

      const state = lossOfSkillReducer(fakeState, action);

      expect(state.lostJobProfiles.data).toBeUndefined();
      expect(state.lostJobProfiles.loading).toBeFalsy();
      expect(state.lostJobProfiles.errorMessage).toEqual(errorMessage);
    });
  });

  describe('Reducer function', () => {
    test('should return lossOfSkillReducer', () => {
      // prepare any action
      const action: Action = { type: 'Test' };
      expect(reducer(initialState, action)).toEqual(
        lossOfSkillReducer(initialState, action)
      );
    });
  });
});
