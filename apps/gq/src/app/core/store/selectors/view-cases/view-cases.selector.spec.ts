import { initialState } from '../../reducers/view-cases/view-cases.reducer';
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
