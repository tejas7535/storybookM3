import {
  EmployeesRequest,
  IdValue,
  SelectedFilter,
  TimePeriod,
} from '../../../shared/models';
import { ReasonForLeavingStats } from '../../models/reason-for-leaving-stats.model';
import {
  comparedFilterSelected,
  comparedTimePeriodSelected,
  loadComparedOrgUnits,
  loadComparedOrgUnitsFailure,
  loadComparedOrgUnitsSuccess,
  loadComparedReasonsWhyPeopleLeft,
  loadComparedReasonsWhyPeopleLeftFailure,
  loadComparedReasonsWhyPeopleLeftSuccess,
  loadReasonsWhyPeopleLeft,
  loadReasonsWhyPeopleLeftFailure,
  loadReasonsWhyPeopleLeftSuccess,
  resetCompareMode,
} from './reasons-and-counter-measures.actions';

describe('Reasons and Counter Measures Actions', () => {
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

  test('comparedFilterSelected', () => {
    const filter = new SelectedFilter('test', undefined);
    const action = comparedFilterSelected({ filter });

    expect(action).toEqual({
      filter,
      type: '[ReasonsAndCounterMeasures] Change ComparedFilter',
    });
  });

  test('comparedTimePeriodSelected', () => {
    const timePeriod = TimePeriod.MONTH;
    const action = comparedTimePeriodSelected({ timePeriod });

    expect(action).toEqual({
      timePeriod,
      type: '[ReasonsAndCounterMeasures] Change ComparedTimePeriod',
    });
  });

  test('resetCompareMode', () => {
    const action = resetCompareMode();

    expect(action).toEqual({
      type: '[ReasonsAndCounterMeasures] Reset Compare Mode',
    });
  });

  test('loadComparedOrgUnits', () => {
    const searchFor = 'search';
    const action = loadComparedOrgUnits({ searchFor });

    expect(action).toEqual({
      searchFor,
      type: '[ReasonsAndCounterMeasures] Load Compared Org Units',
    });
  });

  test('loadComparedOrgUnitsSuccess', () => {
    const items = [new IdValue('Department1', 'Department1')];
    const action = loadComparedOrgUnitsSuccess({ items });

    expect(action).toEqual({
      items,
      type: '[ReasonsAndCounterMeasures] Load Compared Org Units Success',
    });
  });

  test('loadComparedOrgUnitsFailure', () => {
    const action = loadComparedOrgUnitsFailure({ errorMessage });

    expect(action).toEqual({
      errorMessage,
      type: '[ReasonsAndCounterMeasures] Load Compared Org Units Failure',
    });
  });
});
