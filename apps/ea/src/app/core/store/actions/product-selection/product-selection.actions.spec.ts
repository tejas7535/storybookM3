import {
  fetchBearingId,
  setBearingDesignation,
  setBearingId,
  setProductFetchFailure,
} from './product-selection.actions';

describe('Product Selection Actions', () => {
  describe('set bearing designation', () => {
    it('setBearingDesignation', () => {
      const action = setBearingDesignation({ bearingDesignation: 'abc' });

      expect(action).toEqual({
        type: '[Product Selection] Set Bearing Designation',
        bearingDesignation: 'abc',
      });
    });
  });

  describe('fetch bearing id', () => {
    it('fetchBearingId', () => {
      const action = fetchBearingId();

      expect(action).toEqual({
        type: '[Product Selection] Fetch Bearing Id',
      });
    });
  });
  describe('set bearing id', () => {
    it('setBearingId', () => {
      const action = setBearingId({ bearingId: '123' });

      expect(action).toEqual({
        bearingId: '123',
        type: '[Product Selection] Set Bearing Id',
      });
    });
  });

  describe('set fecht failure', () => {
    it('setProductFetchFailure', () => {
      const action = setProductFetchFailure({ error: 'my-error' });

      expect(action).toEqual({
        type: '[Product Selection] Set Product Fetch Failure',
        error: 'my-error',
      });
    });
  });
});
