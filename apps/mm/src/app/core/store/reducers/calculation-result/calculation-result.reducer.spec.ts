import { CalculationResultActions } from '../../actions/calculation-result';
import {
  CalculationResult,
  CalculationResultState,
} from '../../models/calculation-result-state.model';
import { calculationResultReducer } from './calculation-result.reducer';

describe('CalculationParametersReducer', () => {
  describe('fetch calculation result', () => {
    it('should set isLoading to true', () => {
      const initialState: CalculationResultState = {
        isLoading: false,
      };

      const newState = calculationResultReducer(
        initialState,
        CalculationResultActions.fetchCalculationJsonResult({
          jsonReportUrl: 'https://bearing-api/report.json',
        })
      );

      expect(newState).toEqual(
        expect.objectContaining({
          isLoading: true,
        })
      );
    });
  });

  describe('set calculation result', () => {
    it('should set isLoading to false and set result', () => {
      const initialState: CalculationResultState = {
        isLoading: true,
      };

      const newState = calculationResultReducer(
        initialState,
        CalculationResultActions.setCalculationJsonResult({
          result: {
            mountingRecommendations: ['test'],
          } as Partial<CalculationResult> as CalculationResult,
        })
      );

      expect(newState).toEqual(
        expect.objectContaining({
          isLoading: false,
          result: { mountingRecommendations: ['test'] },
        })
      );
    });
  });

  describe('fetch calculation result failure', () => {
    it('should set isLoading to false', () => {
      const initialState: CalculationResultState = {
        isLoading: true,
      };

      const newState = calculationResultReducer(
        initialState,
        CalculationResultActions.fetchCalculationJsonResultFailure({
          error: 'Failed to fetch calculation JSON result',
        })
      );

      expect(newState).toEqual(
        expect.objectContaining({
          isLoading: false,
        })
      );
    });
  });
});
