import { DETAIL_STATE_MOCK } from '@cdba/testing/mocks';

import {
  DetailState,
  initialState,
} from '../../reducers/detail/detail.reducer';
import {
  getDrawingsError,
  getNodeIdOfSelectedDrawing,
} from './drawings.selector';

const fakeState: { detail: DetailState } = { detail: DETAIL_STATE_MOCK };

const initialDetailState: { detail: DetailState } = {
  detail: initialState,
};

describe('Drawings Selectors', () => {
  describe('getDrawings', () => {});

  describe('getDrawingsLoading', () => {});

  describe('getDrawingsError', () => {
    it('should return errorMessage if present', () => {
      expect(getDrawingsError(fakeState)).toEqual('404');
    });

    it('should return noDrawingsText if loading false and drawing items empty', () => {
      const notFoundState: { detail: DetailState } = {
        ...initialDetailState,
        detail: {
          ...initialDetailState.detail,
          drawings: {
            ...initialDetailState.detail.drawings,
            loading: false,
            items: [],
          },
        },
      };

      expect(getDrawingsError(notFoundState)).toEqual(
        'detail.drawings.noDrawingsText'
      );
    });

    it('should return undefined as fallback', () => {
      expect(getDrawingsError(initialDetailState)).toBeUndefined();
    });
  });

  describe('getNodeIdOfSelectedDrawing', () => {
    test('should return undefined if selected is undefined', () => {
      expect(getNodeIdOfSelectedDrawing(initialDetailState)).toBeUndefined();
    });

    test('should return string of the node id', () => {
      expect(getNodeIdOfSelectedDrawing(fakeState)).toEqual('3');
    });
  });
});
