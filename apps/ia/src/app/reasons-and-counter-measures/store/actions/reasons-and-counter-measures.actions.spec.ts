import { EmployeesRequest } from '../../../shared/models';
import { ReasonForLeavingStats } from '../../models/reason-for-leaving-stats.model';
import {
  loadReasonsWhyPeopleLeft,
  loadReasonsWhyPeopleLeftFailure,
  loadReasonsWhyPeopleLeftSuccess,
} from './reasons-and-counter-measures.actions';

describe('Overview Actions', () => {
  const errorMessage = 'An error occured';

  test('loadReasonsWhyPeopleLeft', () => {
    const request = {} as unknown as EmployeesRequest;
    const action = loadReasonsWhyPeopleLeft({ request });

    expect(action).toEqual({
      request,
      type: '[ReasonsAndCounterMeasures] Load ReasonsWhyPeopleLeft',
    });
  });

  test('loadReasonsWhyPeopleLeftSuccess', () => {
    const data: ReasonForLeavingStats[] =
      [] as unknown as ReasonForLeavingStats[];

    const action = loadReasonsWhyPeopleLeftSuccess({
      data,
    });

    expect(action).toEqual({
      data,
      type: '[ReasonsAndCounterMeasures] Load ReasonsWhyPeopleLeft Success',
    });
  });

  test('loadReasonsWhyPeopleLeftFailure', () => {
    const action = loadReasonsWhyPeopleLeftFailure({ errorMessage });

    expect(action).toEqual({
      errorMessage,
      type: '[ReasonsAndCounterMeasures] Load ReasonsWhyPeopleLeft Failure',
    });
  });
});
