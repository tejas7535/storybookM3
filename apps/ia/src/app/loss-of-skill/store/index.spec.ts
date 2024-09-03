import { Action } from '@ngrx/store';

import { ExitEntryEmployeesResponse } from '../../overview/models';
import { Employee, EmployeesRequest, LeavingType } from '../../shared/models';
import {
  LostJobProfilesResponse,
  PmgmArrow,
  PmgmAssessment,
  PmgmData,
  WorkforceResponse,
} from '../models';
import { initialState, lossOfSkillReducer, LossOfSkillState, reducer } from '.';
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
                jobKey: 'F1',
                positionDescription: 'Foo Bar',
                leaversCount: 2,
                employeesCount: 23,
                openPositionsCount: 4,
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

  describe('clearLossOfSkillDimensionData', () => {
    test('should clear loss of skill dimension data', () => {
      const fakeState: LossOfSkillState = {
        ...initialState,
        jobProfiles: {
          ...initialState.jobProfiles,
          data: {} as LostJobProfilesResponse,
        },
        workforce: {
          ...initialState.workforce,
          data: {} as WorkforceResponse,
        },
        leavers: {
          ...initialState.leavers,
          data: {} as ExitEntryEmployeesResponse,
        },
      };
      const action = clearLossOfSkillDimensionData();

      const state = lossOfSkillReducer(fakeState, action);

      expect(state.jobProfiles.data).toBeUndefined();
      expect(state.workforce.data).toBeUndefined();
      expect(state.leavers.data).toBeUndefined();
    });
  });

  describe('loadLossOfSkillWorkforce', () => {
    test('should set loading as true', () => {
      const action = loadLossOfSkillWorkforce({
        jobKey: 'Developer',
      });
      const fakeState: LossOfSkillState = {
        ...initialState,
        workforce: {
          data: {} as WorkforceResponse,
          errorMessage: undefined,
          loading: false,
        },
      };

      const state = lossOfSkillReducer(fakeState, action);

      expect(state.workforce.loading).toBeTruthy();
    });
  });

  describe('loadLossOfSkillWorkforceSuccess', () => {
    test('should set loading as false and set data', () => {
      const data: WorkforceResponse = {
        employees: [],
        responseModified: true,
      };
      const action = loadLossOfSkillWorkforceSuccess({
        data,
      });
      const fakeState: LossOfSkillState = {
        ...initialState,
        workforce: {
          data: {} as WorkforceResponse,
          errorMessage: undefined,
          loading: true,
        },
      };

      const state = lossOfSkillReducer(fakeState, action);

      expect(state.workforce.loading).toBeFalsy();
      expect(state.workforce.data).toBe(data);
    });
  });

  describe('loadLossOfSkillWorkforceFailure', () => {
    test('should set loading as false and set error message', () => {
      const action = loadLossOfSkillWorkforceFailure({
        errorMessage,
      });
      const fakeState: LossOfSkillState = {
        ...initialState,
        workforce: {
          data: {} as WorkforceResponse,
          errorMessage: undefined,
          loading: true,
        },
      };

      const state = lossOfSkillReducer(fakeState, action);

      expect(state.workforce.loading).toBeFalsy();
      expect(state.workforce.errorMessage).toBe(errorMessage);
    });
  });

  describe('loadLossOfSkillLeavers', () => {
    test('should set loading as true', () => {
      const action = loadLossOfSkillLeavers({
        jobKey: 'Developer',
      });
      const fakeState: LossOfSkillState = {
        ...initialState,
        leavers: {
          data: {} as ExitEntryEmployeesResponse,
          errorMessage: undefined,
          loading: false,
        },
      };

      const state = lossOfSkillReducer(fakeState, action);

      expect(state.leavers.loading).toBeTruthy();
    });
  });

  describe('loadLossOfSkillLeaversSuccess', () => {
    test('should set loading as false and set data', () => {
      const data: ExitEntryEmployeesResponse = {
        employees: [],
        responseModified: true,
      };
      const action = loadLossOfSkillLeaversSuccess({
        data,
      });
      const fakeState: LossOfSkillState = {
        ...initialState,
        leavers: {
          data: {} as ExitEntryEmployeesResponse,
          errorMessage: undefined,
          loading: true,
        },
      };

      const state = lossOfSkillReducer(fakeState, action);

      expect(state.leavers.loading).toBeFalsy();
      expect(state.leavers.data).toBe(data);
    });
  });

  describe('loadLossOfSkillLeaversFailure', () => {
    test('should set loading as false and set error message', () => {
      const action = loadLossOfSkillLeaversFailure({
        errorMessage,
      });
      const fakeState: LossOfSkillState = {
        ...initialState,
        workforce: {
          data: {} as WorkforceResponse,
          errorMessage: undefined,
          loading: true,
        },
      };

      const state = lossOfSkillReducer(fakeState, action);

      expect(state.leavers.loading).toBeFalsy();
      expect(state.leavers.errorMessage).toBe(errorMessage);
    });
  });

  describe('loadPmgmData', () => {
    test('should set loading as true', () => {
      const action = loadPmgmData({ request: {} as EmployeesRequest });
      const fakeState: LossOfSkillState = {
        ...initialState,
        pmgm: {
          data: {} as PmgmData[],
          errorMessage: undefined,
          loading: false,
        },
      };

      const state = lossOfSkillReducer(fakeState, action);

      expect(state.pmgm.loading).toBeTruthy();
      expect(state.pmgm.errorMessage).toBeUndefined();
      expect(state.pmgm.data).toBeUndefined();
    });
  });

  describe('loadPmgmDataSuccess', () => {
    test('should set loading as false and set data', () => {
      const data: PmgmData[] = [
        {
          employee: 'Hans',
          managerChange: PmgmArrow.RIGHT,
          fluctuationType: LeavingType.FORCED,
          isManager: true,
          assessment: PmgmAssessment.GREEN,
        } as unknown as PmgmData,
      ];
      const action = loadPmgmDataSuccess({ data });
      const fakeState: LossOfSkillState = {
        ...initialState,
        pmgm: {
          data: {} as PmgmData[],
          errorMessage: undefined,
          loading: true,
        },
      };

      const state = lossOfSkillReducer(fakeState, action);

      expect(state.pmgm.loading).toBeFalsy();
      expect(state.pmgm.data).toBe(data);
    });
  });

  describe('loadPmgmDataFailure', () => {
    test('should set loading as false and set error message', () => {
      const action = loadPmgmDataFailure({
        errorMessage,
      });
      const fakeState: LossOfSkillState = {
        ...initialState,
        pmgm: {
          data: {} as PmgmData[],
          errorMessage: undefined,
          loading: true,
        },
      };

      const state = lossOfSkillReducer(fakeState, action);

      expect(state.pmgm.loading).toBeFalsy();
      expect(state.pmgm.errorMessage).toBe(errorMessage);
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
