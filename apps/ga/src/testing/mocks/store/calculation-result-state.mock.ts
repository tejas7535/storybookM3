import { CalculationResultState } from '@ga/core/store/models';
import { CALCULATION_RESULT_MOCK_ID } from '@ga/testing/mocks/models/calculation-result.mock';

export const CALCULATION_RESULT_STATE_MOCK: CalculationResultState = {
  resultId: CALCULATION_RESULT_MOCK_ID,
  loading: false,
  messages: [{ translationKey: 'test' }],
};
