import {
  ComparisonSummaryActions,
  loadComparisonSummary,
  loadComparisonSummaryFailure,
  loadComparisonSummarySuccess,
} from './comparison-summary.actions';

describe('ComparisonSummaryActions', () => {
  let action: ComparisonSummaryActions;
  let expectedType: string;

  afterEach(() => {
    action = undefined;
    expectedType = undefined;
  });

  test('loadComparisonSummary', () => {
    action = loadComparisonSummary();
    expectedType = '[Compare] Load Comparison Summary';

    expect(action.type).toEqual(expectedType);
  });

  test('loadComparisonSummarySuccess', () => {
    action = loadComparisonSummarySuccess({ comparison: undefined });
    expectedType = '[Compare] Load Comparison Summary Success';

    expect(action.type).toEqual(expectedType);
    expect(action.comparison).toEqual(undefined);
  });

  test('loadComparisonSummaryFailure', () => {
    action = loadComparisonSummaryFailure({
      errorMessage: 'Error Message',
      statusCode: 400,
    });
    expectedType = '[Compare] Load Comparison Summary Failure';

    expect(action.type).toEqual(expectedType);
    expect(action.errorMessage).toEqual('Error Message');
    expect(action.statusCode).toEqual(400);
  });
});
