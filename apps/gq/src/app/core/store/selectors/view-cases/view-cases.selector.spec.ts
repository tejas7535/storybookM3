import { initialState } from '../../reducers/view-cases/view-cases.reducers';
import * as viewCasesSelectors from './view-cases.selector';

describe('View Cases Selector', () => {
  const fakeState = {
    viewCases: {
      ...initialState,
    },
  };

  describe('getQuotations', () => {
    test('should return quotations', () => {
      expect(
        viewCasesSelectors.getQuotations.projector(fakeState.viewCases)
      ).toEqual(fakeState.viewCases.quotations);
    });
  });
});
