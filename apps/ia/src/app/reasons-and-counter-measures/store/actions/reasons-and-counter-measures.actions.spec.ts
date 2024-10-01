import { ExitEntryEmployeesResponse } from '../../../overview/models';
import { ReasonForLeavingTab } from '../../models';
import { ReasonForLeavingStats } from '../../models/reason-for-leaving-stats.model';
import {
  loadComparedReasonsWhyPeopleLeft,
  loadComparedReasonsWhyPeopleLeftFailure,
  loadComparedReasonsWhyPeopleLeftSuccess,
  loadLeaversByReason,
  loadLeaversByReasonFailure,
  loadLeaversByReasonSuccess,
  loadReasonsWhyPeopleLeft,
  loadReasonsWhyPeopleLeftFailure,
  loadReasonsWhyPeopleLeftSuccess,
  selectReasonsForLeavingTab,
} from './reasons-and-counter-measures.actions';

describe('Reasons and Counter Measures Actions', () => {
  const errorMessage = 'An error occured';

  test('selectReasonsForLeavingTab', () => {
    const selectedTab = ReasonForLeavingTab.TOP_REASONS;

    const action = selectReasonsForLeavingTab({ selectedTab });

    expect(action).toEqual({
      selectedTab,
      type: '[ReasonsAndCounterMeasures] Select ReasonsForLeaving Tab',
    });
  });

  test('loadReasonsWhyPeopleLeft', () => {
    const action = loadReasonsWhyPeopleLeft();

    expect(action).toEqual({
      type: '[ReasonsAndCounterMeasures] Load ReasonsWhyPeopleLeft',
    });
  });

  test('loadReasonsWhyPeopleLeftSuccess', () => {
    const data: ReasonForLeavingStats = {} as unknown as ReasonForLeavingStats;

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
    const action = loadComparedReasonsWhyPeopleLeft();

    expect(action).toEqual({
      type: '[ReasonsAndCounterMeasures] Load ComparedReasonsWhyPeopleLeft',
    });
  });

  test('loadComparedReasonsWhyPeopleLeftSuccess', () => {
    const data: ReasonForLeavingStats = {} as unknown as ReasonForLeavingStats;

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

  test('loadLeaversByReason', () => {
    const reasonId = 1;

    const action = loadLeaversByReason({ reasonId });

    expect(action).toEqual({
      reasonId,
      type: '[ReasonsAndCounterMeasures] Load LeaversByReason',
    });
  });

  test('loadLeaversByReasonSuccess', () => {
    const data: ExitEntryEmployeesResponse =
      {} as unknown as ExitEntryEmployeesResponse;

    const action = loadLeaversByReasonSuccess({
      data,
    });

    expect(action).toEqual({
      data,
      type: '[ReasonsAndCounterMeasures] Load LeaversByReason Success',
    });
  });

  test('loadLeaversByReasonFailure', () => {
    const action = loadLeaversByReasonFailure({ errorMessage });

    expect(action).toEqual({
      errorMessage,
      type: '[ReasonsAndCounterMeasures] Load LeaversByReason Failure',
    });
  });
});
