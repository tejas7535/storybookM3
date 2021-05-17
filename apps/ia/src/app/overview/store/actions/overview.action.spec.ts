import { AttritionOverTime, EmployeesRequest } from '../../../shared/models';
import {
  loadAttritionOverTimeOverview,
  loadAttritionOverTimeOverviewFailure,
  loadAttritionOverTimeOverviewSuccess,
} from './overview.action';

describe('Overview Actions', () => {
  const errorMessage = 'An error occured';

  test('loadAttritionOverTimeOverview', () => {
    const request = {} as unknown as EmployeesRequest;
    const action = loadAttritionOverTimeOverview({ request });

    expect(action).toEqual({
      request,
      type: '[Overview] Load AttritionOverTime for last three years',
    });
  });

  test('loadAttritionOverTimeOverviewSuccess', () => {
    const data: AttritionOverTime = {} as unknown as AttritionOverTime;

    const action = loadAttritionOverTimeOverviewSuccess({
      data,
    });

    expect(action).toEqual({
      data,
      type: '[Overview] Load AttritionOverTime for last three years Success',
    });
  });

  test('loadAttritionOverTimeOverviewFailure', () => {
    const action = loadAttritionOverTimeOverviewFailure({ errorMessage });

    expect(action).toEqual({
      errorMessage,
      type: '[Overview] Load AttritionOverTime for last three years Failure',
    });
  });
});
