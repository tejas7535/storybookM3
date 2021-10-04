import { MODEL_MOCK_ID } from '../../../../../testing/mocks/rest.service.mock';
import {
  bearingSearchSuccess,
  modelCreateFailure,
  modelCreateSuccess,
  searchBearing,
  selectBearing,
} from './bearing.actions';

describe('Bearing Actions', () => {
  describe('Search Bearing', () => {
    it('searchBearing', () => {
      const query = 'searchQuery';
      const action = searchBearing({ query });

      expect(action).toEqual({
        query,
        type: '[Bearing] Search Bearing',
      });
    });
  });

  describe('Search Bearing Success', () => {
    it('bearingSearchSuccess', () => {
      const resultList = ['bearing 1', 'bearing 2'];
      const action = bearingSearchSuccess({ resultList });

      expect(action).toEqual({
        resultList,
        type: '[Bearing] Search Bearing Success',
      });
    });
  });

  describe('Model Create Success', () => {
    it('modelCreateSuccess', () => {
      const action = modelCreateSuccess({ modelId: MODEL_MOCK_ID });

      expect(action).toEqual({
        modelId: MODEL_MOCK_ID,
        type: '[Bearing] Model Create Success',
      });
    });
  });

  describe('Model Create Failure', () => {
    it('modelCreateFailure', () => {
      const action = modelCreateFailure();

      expect(action).toEqual({
        type: '[Bearing] Model Create Failure',
      });
    });
  });

  describe('Select Bearing', () => {
    it('selectBearing', () => {
      const bearing = 'bearingName';
      const action = selectBearing({ bearing });

      expect(action).toEqual({
        bearing,
        type: '[Bearing] Select Bearing',
      });
    });
  });
});
