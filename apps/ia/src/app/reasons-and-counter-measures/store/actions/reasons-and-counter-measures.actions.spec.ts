import { ExitEntryEmployeesResponse } from '../../../overview/models';
import { ReasonForLeavingTab, TextAnalysisResponse } from '../../models';
import { ReasonForLeavingStats } from '../../models/reason-for-leaving-stats.model';
import {
  loadComparedReasonAnalysis,
  loadComparedReasonAnalysisFailure,
  loadComparedReasonAnalysisSuccess,
  loadComparedReasonsWhyPeopleLeft,
  loadComparedReasonsWhyPeopleLeftFailure,
  loadComparedReasonsWhyPeopleLeftSuccess,
  loadLeaversByReason,
  loadLeaversByReasonFailure,
  loadLeaversByReasonSuccess,
  loadReasonAnalysis,
  loadReasonAnalysisFailure,
  loadReasonAnalysisSuccess,
  loadReasonsWhyPeopleLeft,
  loadReasonsWhyPeopleLeftFailure,
  loadReasonsWhyPeopleLeftSuccess,
  selectComparedReason,
  selectReason,
  selectReasonsForLeavingTab,
  toggleComparedReasonAnalysis,
  toggleReasonAnalysis,
} from './reasons-and-counter-measures.actions';

describe('Reasons and Counter Measures Actions', () => {
  const errorMessage = 'An error occured';
  const selectedReasonIds: number[] = [];

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

  test('selectReason', () => {
    const reason = 'reason';

    const action = selectReason({ reason });

    expect(action).toEqual({
      reason,
      type: '[ReasonsAndCounterMeasures] Select Reason',
    });
  });

  test('selectComparedReason', () => {
    const reason = 'reason';

    const action = selectComparedReason({ reason });

    expect(action).toEqual({
      reason,
      type: '[ReasonsAndCounterMeasures] Select Compared Reason',
    });
  });

  test('loadReasonAnalysis', () => {
    const reasonIds = [1];

    const action = loadReasonAnalysis({ reasonIds });

    expect(action).toEqual({
      reasonIds,
      type: '[ReasonsAndCounterMeasures] Load Reason Analysis',
    });
  });

  test('loadReasonAnalysisSuccess', () => {
    const data = {} as TextAnalysisResponse;

    const action = loadReasonAnalysisSuccess({ data, selectedReasonIds });

    expect(action).toEqual({
      data,
      selectedReasonIds,
      type: '[ReasonsAndCounterMeasures] Load Reason Analysis Success',
    });
  });

  test('loadReasonAnalysisFailure', () => {
    const action = loadReasonAnalysisFailure({ errorMessage });

    expect(action).toEqual({
      errorMessage,
      type: '[ReasonsAndCounterMeasures] Load Reason Analysis Failure',
    });
  });

  test('toggleReasonAnalysis', () => {
    const reasonId = 1;

    const action = toggleReasonAnalysis({ reasonId });

    expect(action).toEqual({
      reasonId,
      type: '[ReasonsAndCounterMeasures] Toggle Reason Analysis',
    });
  });

  test('loadComparedReasonAnalysis', () => {
    const reasonIds = [1];

    const action = loadComparedReasonAnalysis({ reasonIds });

    expect(action).toEqual({
      reasonIds,
      type: '[ReasonsAndCounterMeasures] Load Compared Reason Analysis',
    });
  });

  test('loadComparedReasonAnalysisSuccess', () => {
    const data = {} as TextAnalysisResponse;

    const action = loadComparedReasonAnalysisSuccess({
      data,
      selectedReasonIds,
    });

    expect(action).toEqual({
      data,
      selectedReasonIds,
      type: '[ReasonsAndCounterMeasures] Load Compared Reason Analysis Success',
    });
  });

  test('loadComparedReasonAnalysisFailure', () => {
    const action = loadComparedReasonAnalysisFailure({
      errorMessage,
    });

    expect(action).toEqual({
      errorMessage,
      type: '[ReasonsAndCounterMeasures] Load Compared Reason Analysis Failure',
    });
  });

  test('toggleComparedReasonAnalysis', () => {
    const reasonId = 1;

    const action = toggleComparedReasonAnalysis({ reasonId });

    expect(action).toEqual({
      reasonId,
      type: '[ReasonsAndCounterMeasures] Toggle Compared Reason Analysis',
    });
  });
});
