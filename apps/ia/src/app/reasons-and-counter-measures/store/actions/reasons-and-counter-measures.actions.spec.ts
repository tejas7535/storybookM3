import { EmployeesRequest, TimePeriod } from '../../../shared/models';
import { ReasonForLeavingStats } from '../../models/reason-for-leaving-stats.model';
import {
  changeComparedFilter,
  changeComparedTimePeriod,
  changeComparedTimeRange,
  loadComparedReasonsWhyPeopleLeft,
  loadComparedReasonsWhyPeopleLeftFailure,
  loadComparedReasonsWhyPeopleLeftSuccess,
  loadReasonsWhyPeopleLeft,
  loadReasonsWhyPeopleLeftFailure,
  loadReasonsWhyPeopleLeftSuccess,
  resetCompareMode,
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

  test('loadComparedReasonsWhyPeopleLeft', () => {
    const request = {} as unknown as EmployeesRequest;
    const action = loadComparedReasonsWhyPeopleLeft({ request });

    expect(action).toEqual({
      request,
      type: '[ReasonsAndCounterMeasures] Load ComparedReasonsWhyPeopleLeft',
    });
  });

  test('loadComparedReasonsWhyPeopleLeftSuccess', () => {
    const data: ReasonForLeavingStats[] =
      [] as unknown as ReasonForLeavingStats[];

    const action = loadComparedReasonsWhyPeopleLeftSuccess({
      data,
    });

    expect(action).toEqual({
      data,
      type: '[ReasonsAndCounterMeasures] Load ComparedReasonsWhyPeopleLeft Success',
    });
  });

  test('loadComparedReasonsWhyPeopleLeftFailure', () => {
    const action = loadComparedReasonsWhyPeopleLeftFailure({ errorMessage });

    expect(action).toEqual({
      errorMessage,
      type: '[ReasonsAndCounterMeasures] Load ComparedReasonsWhyPeopleLeft Failure',
    });
  });

  test('changeComparedFilter', () => {
    const comparedSelectedOrgUnit = 'best';
    const action = changeComparedFilter({ comparedSelectedOrgUnit });

    expect(action).toEqual({
      comparedSelectedOrgUnit,
      type: '[ReasonsAndCounterMeasures] Change ComparedFilter',
    });
  });

  test('changeComparedTimePeriod', () => {
    const comparedSelectedTimePeriod = {} as unknown as TimePeriod;

    const action = changeComparedTimePeriod({
      comparedSelectedTimePeriod,
    });

    expect(action).toEqual({
      comparedSelectedTimePeriod,
      type: '[ReasonsAndCounterMeasures] Change ComparedTimePeriod',
    });
  });

  test('changeComparedTimeRange', () => {
    const comparedSelectedTimeRange = {} as string;
    const action = changeComparedTimeRange({ comparedSelectedTimeRange });

    expect(action).toEqual({
      comparedSelectedTimeRange,
      type: '[ReasonsAndCounterMeasures] Change ComparedTimeRange',
    });
  });

  test('resetCompareMode', () => {
    const action = resetCompareMode();

    expect(action).toEqual({
      type: '[ReasonsAndCounterMeasures] Reset Compare Mode',
    });
  });
});
