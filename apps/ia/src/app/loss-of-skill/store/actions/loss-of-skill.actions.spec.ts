import { ExitEntryEmployeesResponse } from '../../../overview/models';
import { EmployeesRequest } from '../../../shared/models';
import { LostJobProfilesResponse, WorkforceResponse } from '../../models';
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
    const positionDescription = 'Developer';
    const action = loadLossOfSkillWorkforce({ positionDescription });

    expect(action).toEqual({
      positionDescription,
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
    const positionDescription = 'Developer';
    const action = loadLossOfSkillLeavers({ positionDescription });

    expect(action).toEqual({
      positionDescription,
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
});
