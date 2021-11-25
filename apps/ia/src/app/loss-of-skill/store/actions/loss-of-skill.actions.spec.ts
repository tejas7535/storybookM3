import { EmployeesRequest } from '../../../shared/models';
import { JobProfile, OpenPosition } from '../../models';
import {
  loadJobProfiles,
  loadJobProfilesFailure,
  loadJobProfilesSuccess,
  loadOpenPositions,
  loadOpenPositionsFailure,
  loadOpenPositionsSuccess,
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
    const jobProfiles: JobProfile[] = [];

    const action = loadJobProfilesSuccess({ jobProfiles });

    expect(action).toEqual({
      jobProfiles,
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

  test('loadOpenPositions', () => {
    const request = {} as unknown as EmployeesRequest;
    const action = loadOpenPositions({ request });

    expect(action).toEqual({
      request,
      type: '[Loss of Skill] Load Open Positions',
    });
  });

  test('loadOpenPositionsSuccess', () => {
    const openPositions: OpenPosition[] = [];

    const action = loadOpenPositionsSuccess({ openPositions });

    expect(action).toEqual({
      openPositions,
      type: '[Loss of Skill] Load Open Positions Success',
    });
  });

  test('loadOpenPositionsFailure', () => {
    const action = loadOpenPositionsFailure({ errorMessage });

    expect(action).toEqual({
      errorMessage,
      type: '[Loss of Skill] Load Open Positions Failure',
    });
  });
});
