import { AttritionOverTime, EmployeesRequest } from '../../../shared/models';
import {
  loadAttritionOverTime,
  loadAttritionOverTimeFailure,
  loadAttritionOverTimeSuccess,
} from './overview.action';

describe('Overview Actions', () => {
  const errorMessage = 'An error occured';

  test('loadAttritionOverTime', () => {
    const request = {} as unknown as EmployeesRequest;
    const action = loadAttritionOverTime({ request });

    expect(action).toEqual({
      request,
      type: '[Overview] Load AttritionOverTime',
    });
  });

  test('loadAttritionOverTimeSuccess', () => {
    const data: AttritionOverTime = {} as unknown as AttritionOverTime;

    const action = loadAttritionOverTimeSuccess({
      data,
    });

    expect(action).toEqual({
      data,
      type: '[Overview] Load AttritionOverTime Success',
    });
  });

  test('loadAttritionOverTimeFailure', () => {
    const action = loadAttritionOverTimeFailure({ errorMessage });

    expect(action).toEqual({
      errorMessage,
      type: '[Overview] Load AttritionOverTime Failure',
    });
  });
});
