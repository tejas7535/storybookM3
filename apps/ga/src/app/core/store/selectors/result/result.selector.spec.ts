import {
  initialState,
  ResultState,
} from '../../reducers/result/result.reducer';
import { getResultId } from './result.selector';

describe('Result Selector', () => {
  let mockState: { result: ResultState };

  beforeEach(() => {
    mockState = { result: { ...initialState } };
  });

  describe('getResultId', () => {
    it('should return result id', () => {
      expect(getResultId(mockState)).toEqual(undefined);
    });
  });
});
