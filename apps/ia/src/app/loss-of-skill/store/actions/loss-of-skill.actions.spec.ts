import { ExitEntryEmployeesResponse } from '../../../overview/models';
import { EmployeesRequest } from '../../../shared/models';
import {
  LostJobProfilesResponse,
  PmgmDataResponse,
  WorkforceResponse,
} from '../../models';
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
} from './loss-of-skill.actions';

describe('LossOfSkill Actions', () => {
  const errorMessage = 'An error occured';

  test('loadJobProfiles', () => {
    const request = {} as unknown as EmployeesRequest;
    const action = loadJobProfiles({ request });

    expect(action).toEqual({
      request,
      type: '[Loss of Skill] Load Job Profiles',
    });
  });

  test('loadLostJobProfilesSuccess', () => {
    const lostJobProfilesResponse = {} as LostJobProfilesResponse;

    const action = loadJobProfilesSuccess({ lostJobProfilesResponse });

    expect(action).toEqual({
      lostJobProfilesResponse,
      type: '[Loss of Skill] Load Job Profiles Success',
    });
  });

  test('loadJobProfilesFailure', () => {
    const action = loadJobProfilesFailure({ errorMessage });

    expect(action).toEqual({
      errorMessage,
      type: '[Loss of Skill] Load Job Profiles Failure',
    });
  });

  test('loadLossOfSkillWorkforce', () => {
    const jobKey = 'Developer';
    const action = loadLossOfSkillWorkforce({ jobKey });

    expect(action).toEqual({
      jobKey,
      type: '[Loss of Skill] Load Loss of Skill Workforce',
    });
  });

  test('loadLossOfSkillWorkforceSuccess', () => {
    const data = {} as WorkforceResponse;
    const action = loadLossOfSkillWorkforceSuccess({ data });

    expect(action).toEqual({
      data,
      type: '[Loss of Skill] Load Loss of Skill Workforce Success',
    });
  });

  test('loadLossOfSkillWorkforceFailure', () => {
    const action = loadLossOfSkillWorkforceFailure({ errorMessage });

    expect(action).toEqual({
      errorMessage,
      type: '[Loss of Skill] Load Loss of Skill Workforce Failure',
    });
  });

  test('clearLossOfSkillDimensionData', () => {
    const action = clearLossOfSkillDimensionData();

    expect(action).toEqual({
      type: '[Loss of Skill] Clear Loss Of Skill Dimension data',
    });
  });

  test('loadLossOfSkillLeavers', () => {
    const jobKey = 'Developer';
    const action = loadLossOfSkillLeavers({ jobKey });

    expect(action).toEqual({
      jobKey,
      type: '[Loss of Skill] Load Loss of Skill Leavers',
    });
  });

  test('loadLossOfSkillLeaversSuccess', () => {
    const data = {} as ExitEntryEmployeesResponse;
    const action = loadLossOfSkillLeaversSuccess({ data });

    expect(action).toEqual({
      data,
      type: '[Loss of Skill] Load Loss of Skill Leavers Success',
    });
  });

  test('loadLossOfSkillLeaversFailure', () => {
    const action = loadLossOfSkillLeaversFailure({ errorMessage });

    expect(action).toEqual({
      errorMessage,
      type: '[Loss of Skill] Load Loss of Skill Leavers Failure',
    });
  });

  describe('loadPmgmData', () => {
    test('should create an action', () => {
      const request = {} as EmployeesRequest;
      const action = loadPmgmData({ request });

      expect(action).toEqual({
        request,
        type: '[Loss of Skill] Load PMGM Data',
      });
    });
  });

  describe('loadPmgmDataSuccess', () => {
    test('should create an action', () => {
      const data = {} as PmgmDataResponse;
      const action = loadPmgmDataSuccess({ data });

      expect(action).toEqual({
        data,
        type: '[Loss of Skill] Load PMGM Data Success',
      });
    });
  });

  describe('loadPmgmDataFailure', () => {
    test('should create an action', () => {
      const action = loadPmgmDataFailure({ errorMessage });

      expect(action).toEqual({
        errorMessage,
        type: '[Loss of Skill] Load PMGM Data Failure',
      });
    });
  });
});
