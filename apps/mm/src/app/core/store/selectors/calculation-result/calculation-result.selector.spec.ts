import { APP_STATE_MOCK } from '../../../../../testing/mocks/store/app-state.mock';
import { CalculationResultState } from '../../models/calculation-result-state.model';
import {
  getCalculationInputs,
  getCalculationMessages,
  isResultAvailable,
} from './calculation-result.selector';

describe('CalculationResultSelector', () => {
  const state: CalculationResultState = {
    ...APP_STATE_MOCK.calculationResult,
  };

  beforeEach(() => {});

  describe('getCalculationInputs', () => {
    describe('when inputs are not defined', () => {
      it('should return undefined', () => {
        expect(getCalculationInputs(state)).toBeUndefined();
      });
    });

    describe('when inputs are defined', () => {
      it('should return inputs', () => {
        expect(
          getCalculationInputs({
            calculationResult: {
              result: {
                inputs: [
                  {
                    hasNestedStructure: true,
                    title: 'some title',
                  },
                ],
              },
            },
          })
        ).toMatchSnapshot();
      });
    });
  });

  describe('getCalculationMessages', () => {
    describe('when messages are not defined', () => {
      it('should return default messages', () => {
        expect(getCalculationMessages(state)).toEqual({
          errors: [],
          notes: [],
          warnings: [],
        });
      });
    });

    describe('when messages are defined', () => {
      it('should return messages', () => {
        expect(
          getCalculationMessages({
            calculationResult: {
              result: {
                reportMessages: {
                  notes: ['some note'],
                  warnings: [],
                  errors: [],
                },
              },
            },
          })
        ).toMatchSnapshot();
      });
    });
  });

  describe('isResultAvailable', () => {
    describe('when result is not available', () => {
      it('should return false', () => {
        expect(isResultAvailable(state)).toBe(false);
      });
    });

    describe('when result is available', () => {
      it('should return true', () => {
        expect(
          isResultAvailable({
            calculationResult: {
              result: {},
            },
          })
        ).toBe(true);
      });
    });

    describe('when old result is available but is loading a new result', () => {
      it('should return false', () => {
        expect(
          isResultAvailable({
            calculationResult: {
              result: {},
              isLoading: true,
            },
          })
        ).toBe(false);
      });
    });
  });
});
