import { COMPARE_STATE_MOCK } from '@cdba/testing/mocks';

import { CompareState } from '../../reducers/compare.reducer';
import { getComparison, getComparisonError, isComparisonLoading } from '..';

describe('Comparison summary selectors', () => {
  let fakeState: { compare: CompareState } = { compare: COMPARE_STATE_MOCK };

  let expected: any;
  let result: any;

  afterEach(() => {
    expected = undefined;
    result = undefined;

    fakeState = { compare: COMPARE_STATE_MOCK };
  });

  describe('getComparison', () => {
    it('should get comparison state', () => {
      expected = COMPARE_STATE_MOCK.comparison;

      result = getComparison(fakeState);

      expect(result).toEqual(expected);
    });
  });
  describe('getComparisonError', () => {
    it('should get comparison error message', () => {
      expected = 'test error message';
      fakeState.compare.comparison.errorMessage = expected;

      result = getComparisonError(fakeState);

      expect(result).toEqual(expected);
    });
  });
  describe('isComparisonLoading', () => {
    it('should get loading boolean', () => {
      expected = COMPARE_STATE_MOCK.comparison.loading;

      result = isComparisonLoading(fakeState);

      expect(result).toEqual(expected);
    });
  });
});
