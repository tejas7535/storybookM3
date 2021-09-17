import {
  initialState,
  ResultState,
} from '../../reducers/result/result.reducer';
import { getResult, getResultId } from './result.selector';

describe('Result Selector', () => {
  let mockState: { result: ResultState };

  beforeEach(() => {
    mockState = { result: { ...initialState } };
  });

  describe('getResult', () => {
    it('should return result', () => {
      expect(getResult(mockState)).toEqual(mockState.result);
    });
  });

  describe('getResultId', () => {
    it('should return result id', () => {
      expect(getResultId(mockState)).toEqual(undefined);
    });
  });
});
