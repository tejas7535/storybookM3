import { Co2ApiSearchResult } from '../../models';
import {
  bearingSearchSuccess,
  resetBearing,
  searchBearing,
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

  describe('set bearing id', () => {
    it('setBearingId', () => {
      const action = setBearingId({ bearingId: '123' });

      expect(action).toEqual({
        bearingId: '123',
        type: '[Product Selection] Set Bearing Id',
      });
    });
  });

  describe('set fetch failure', () => {
    it('setProductFetchFailure', () => {
      const action = setProductFetchFailure({
        error: { moduleInfoApi: 'my-error' },
      });

      expect(action).toEqual({
        type: '[Product Selection] Set Product Fetch Failure',
        error: { moduleInfoApi: 'my-error' },
      });
    });
  });

  it('should create the Search Bearing action', () => {
    const query = '6226';
    const expectedAction = {
      type: '[Product Selection] Search Bearing',
      query,
    };
    expect(searchBearing({ query })).toEqual(expectedAction);
  });

  it('should create the Search Bearing Success action', () => {
    const resultList: Co2ApiSearchResult[] = [
      { bearinxId: 'abcd', epimId: '123123', designation: 'abcdef' },
      { bearinxId: 'xyz', epimId: '123123', designation: 'xyz' },
    ];
    const expectedAction = {
      type: '[Product Selection] Search Bearing Success',
      resultList,
    };
    expect(bearingSearchSuccess({ resultList })).toEqual(expectedAction);
  });

  it('should create the Reset Bearing action', () => {
    const expectedAction = {
      type: '[Product Selection] Reset Bearing',
    };
    expect(resetBearing()).toEqual(expectedAction);
  });
});
