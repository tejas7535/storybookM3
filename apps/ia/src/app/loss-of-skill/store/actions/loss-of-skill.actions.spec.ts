import { EmployeesRequest } from '../../../shared/models';
import { LostJobProfile } from '../../models';
import {
  loadLostJobProfiles,
  loadLostJobProfilesFailure,
  loadLostJobProfilesSuccess,
} from './loss-of-skill.actions';

describe('LossOfSkill Actions', () => {
  const errorMessage = 'An error occured';

  test('loadLostJobProfiles', () => {
    const request = {} as unknown as EmployeesRequest;
    const action = loadLostJobProfiles({ request });

    expect(action).toEqual({
      request,
      type: '[Loss of Skill] Load Lost Job Profiles',
    });
  });

  test('loadLostJobProfilesSuccess', () => {
    const lostJobProfiles: LostJobProfile[] = [];

    const action = loadLostJobProfilesSuccess({ lostJobProfiles });

    expect(action).toEqual({
      lostJobProfiles,
      type: '[Loss of Skill] Load Lost Job Profiles Success',
    });
  });

  test('loadLostJobProfilesFailure', () => {
    const action = loadLostJobProfilesFailure({ errorMessage });

    expect(action).toEqual({
      errorMessage,
      type: '[Loss of Skill] Load Lost Job Profiles Failure',
    });
  });
});
