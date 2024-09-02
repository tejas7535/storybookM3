import { CalculationParameters } from '../../models/calculation-parameters-state.model';
import { CalculationResult } from '../../models/calculation-result-state.model';
import { CalculationResultActions } from '.';

describe('calculationResultActions', () => {
  it('should create an action to fetch the calculation result resources links', () => {
    const expectedAction = {
      type: '[CalculationResult] Fetch Calculation Result Resources Links',
      formProperties: {},
    };

    expect(
      CalculationResultActions.fetchCalculationResultResourcesLinks({
        formProperties:
          {} as Partial<CalculationParameters> as CalculationParameters,
      })
    ).toEqual(expectedAction);
  });

  it('should create an action to handle failure in fetching the calculation result resources links', () => {
    const error = 'Failed to fetch calculation result resources links';
    const expectedAction = {
      type: '[CalculationResult] Fetch Calculation Result Resources Links Failure',
      error,
    };

    expect(
      CalculationResultActions.fetchCalculationResultResourcesLinksFailure({
        error,
      })
    ).toEqual(expectedAction);
  });

  it('should create an action to fetch the calculation JSON result', () => {
    const jsonReportUrl = 'https://bearing-api/report.json';

    const expectedAction = {
      type: '[CalculationResult] Fetch Calculation JSON Result',
      jsonReportUrl,
    };

    expect(
      CalculationResultActions.fetchCalculationJsonResult({ jsonReportUrl })
    ).toEqual(expectedAction);
  });

  it('should create an action to set the calculation JSON result', () => {
    const expectedAction = {
      type: '[CalculationResult] Set Calculation JSON Result',
      result: {},
    };

    expect(
      CalculationResultActions.setCalculationJsonResult({
        result: {} as Partial<CalculationResult> as CalculationResult,
      })
    ).toEqual(expectedAction);
  });

  it('should create an action to handle failure in fetching the calculation JSON result', () => {
    const error = 'Failed to fetch calculation JSON result';
    const expectedAction = {
      type: '[CalculationResult] Fetch Calculation JSON Result Failure',
      error,
    };

    expect(
      CalculationResultActions.fetchCalculationJsonResultFailure({ error })
    ).toEqual(expectedAction);
  });
});
