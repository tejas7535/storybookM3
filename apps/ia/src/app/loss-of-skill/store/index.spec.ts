import { Action } from '@ngrx/store';

import { Employee, EmployeesRequest } from '../../shared/models';
import { LostJobProfilesResponse, OpenPosition } from '../models';
import { initialState, lossOfSkillReducer, reducer } from '.';
import {
  loadJobProfiles,
  loadJobProfilesFailure,
  loadJobProfilesSuccess,
  loadOpenPositions,
  loadOpenPositionsFailure,
  loadOpenPositionsSuccess,
} from './actions/loss-of-skill.actions';

describe('LossOfSkill Reducer', () => {
  const errorMessage = 'An error occured';

  describe('loadJobProfiles', () => {
    test('should set loading', () => {
      const action = loadJobProfiles({
        request: {} as unknown as EmployeesRequest,
      });
      const state = lossOfSkillReducer(initialState, action);

      expect(state.jobProfiles.loading).toBeTruthy();
    });
  });

  describe('loadJobProfilesSuccess', () => {
    test('should unset loading and set lost job profiles', () => {
      const lostJobProfilesResponse = {
        lostJobProfiles: [
          {
            positionDescription: 'Foo Bar',
            employees: [],
            leavers: [],
            leaversCount: 0,
            employeesCount: 0,
          },
        ],
      } as LostJobProfilesResponse;

      const action = loadJobProfilesSuccess({ lostJobProfilesResponse });

      const state = lossOfSkillReducer(initialState, action);

      expect(state.jobProfiles.loading).toBeFalsy();
      expect(state.jobProfiles.data).toEqual(lostJobProfilesResponse);
    });
  });

  describe('loadJobProfilesFailure', () => {
    test('should unset loading / set error message', () => {
      const action = loadJobProfilesFailure({ errorMessage });
      const fakeState = {
        ...initialState,
        jobProfiles: {
          ...initialState.jobProfiles,
          loading: true,
          data: {
            lostJobProfiles: [
              {
                employees: [{ employeeName: 'Hans' } as Employee],
                leavers: [{ employeeName: 'Peter' } as Employee],
                positionDescription: 'Foo Bar',
                leaversCount: 2,
                employeesCount: 23,
              },
            ],
            responseModified: true,
          },
        },
      };

      const state = lossOfSkillReducer(fakeState, action);

      expect(state.jobProfiles.data).toBeUndefined();
      expect(state.jobProfiles.loading).toBeFalsy();
      expect(state.jobProfiles.errorMessage).toEqual(errorMessage);
    });
  });

  describe('loadOpenPositions', () => {
    test('should set loading', () => {
      const action = loadOpenPositions({
        request: {} as unknown as EmployeesRequest,
      });
      const state = lossOfSkillReducer(initialState, action);

      expect(state.openPositions.loading).toBeTruthy();
    });
  });

  describe('loadOpenPositionsSuccess', () => {
    test('should unset loading and set lost job profiles', () => {
      const openPositions: OpenPosition[] = [
        {
          positionDescription: 'Foo Bar',
        } as unknown as OpenPosition,
      ];

      const action = loadOpenPositionsSuccess({ openPositions });

      const state = lossOfSkillReducer(initialState, action);

      expect(state.openPositions.loading).toBeFalsy();
      expect(state.openPositions.data).toEqual(openPositions);
    });
  });

  describe('loadOpenPositionsFailure', () => {
    test('should unset loading / set error message', () => {
      const action = loadOpenPositionsFailure({ errorMessage });
      const fakeState = {
        ...initialState,
        openPositions: {
          ...initialState.openPositions,
          loading: true,
          data: [{ positionDescription: 'Foo Bar' } as unknown as OpenPosition],
        },
      };

      const state = lossOfSkillReducer(fakeState, action);

      expect(state.openPositions.data).toBeUndefined();
      expect(state.openPositions.loading).toBeFalsy();
      expect(state.openPositions.errorMessage).toEqual(errorMessage);
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
