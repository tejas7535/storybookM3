import { CalculationResult } from '../../models/calculation-result-state.model';
import { CalculationResultActions } from '.';
import {
  fetchBearinxVersions,
  setBearinxVersions,
  unsetBearinxVersions,
} from './calculation-result.actions';

describe('calculationResultActions', () => {
  it('should create an action to set the calculation result', () => {
    const expectedAction = {
      type: '[CalculationResult] Set Calculation Result',
      result: {},
    };

    expect(
      CalculationResultActions.setCalculationResult({
        result: {} as Partial<CalculationResult> as CalculationResult,
      })
    ).toEqual(expectedAction);
  });

  it('should create an action to handle failure in fetching the calculation result', () => {
    const error = 'Failed to fetch calculation result';
    const expectedAction = {
      type: '[CalculationResult] Calculate Result Failure',
      error,
    };

    expect(CalculationResultActions.calculateResultFailure({ error })).toEqual(
      expectedAction
    );
  });

  describe('Fetch Bearinx Versions', () => {
    it('fetchBearinxVersions', () => {
      const action = fetchBearinxVersions();

      expect(action).toEqual({
        type: '[CalculationResult] Fetch Bearinx Versions',
      });
    });
  });

  describe('Set Bearinx Versions', () => {
    it('setBearinxVersions', () => {
      const action = setBearinxVersions({ versions: { abc: '123' } });

      expect(action).toEqual({
        type: '[CalculationResult] Set Bearinx Versions',
        versions: { abc: '123' },
      });
    });
  });

  describe('Unset Bearinx Versions', () => {
    it('unsetBearinxVersions', () => {
      const action = unsetBearinxVersions();

      expect(action).toEqual({
        type: '[CalculationResult] Unset Bearinx Versions',
      });
    });
  });
  describe('Reset Calculation Result', () => {
    it('resetCalculationResult', () => {
      const action = CalculationResultActions.resetCalculationResult();

      expect(action).toEqual({
        type: '[CalculationResult] Reset Calculation Result',
      });
    });
  });
});
