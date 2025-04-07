import { CalculationResultActions } from '../../actions/calculation-result';
import {
  setBearinxVersions,
  unsetBearinxVersions,
} from '../../actions/calculation-result/calculation-result.actions';
import {
  CalculationResult,
  CalculationResultState,
} from '../../models/calculation-result-state.model';
import { calculationResultReducer } from './calculation-result.reducer';

describe('CalculationParametersReducer', () => {
  describe('set calculation result', () => {
    it('should set isLoading to false and set result', () => {
      const initialState: CalculationResultState = {
        isLoading: true,
        result: undefined,
      };

      const newState = calculationResultReducer(
        initialState,
        CalculationResultActions.setCalculationResult({
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
        result: undefined,
      };

      const newState = calculationResultReducer(
        initialState,
        CalculationResultActions.calculateResultFailure({
          error: 'Failed to fetch calculation result',
        })
      );

      expect(newState).toEqual(
        expect.objectContaining({
          isLoading: false,
        })
      );
    });
  });

  describe('Bearinx Versions', () => {
    it('should set bearinx versions', () => {
      const newState = calculationResultReducer(
        { isLoading: false },
        setBearinxVersions({
          versions: { abc: '123' },
        })
      );

      expect(newState).toEqual({
        isLoading: false,
        versions: { abc: '123' },
      });
    });

    it('should unset bearinx versions', () => {
      const newState = calculationResultReducer(
        {
          isLoading: false,
          versions: { abc: '123' },
        },
        unsetBearinxVersions()
      );

      expect(newState).toEqual({
        isLoading: false,
        versions: undefined,
      });
    });
  });
});
