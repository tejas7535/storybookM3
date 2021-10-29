import { MODEL_MOCK_ID } from '../../../../../testing/mocks/rest.service.mock';
import {
  BearingState,
  initialState,
} from '../../reducers/bearing/bearing.reducer';
import {
  getBearingLoading,
  getBearingResultList,
  getModelCreationSuccess,
  getModelId,
  getSelectedBearing,
} from './bearing.selector';

describe('Bearing Selector', () => {
  const mockState: { bearing: BearingState } = {
    bearing: {
      ...initialState,
      search: {
        ...initialState.search,
        resultList: ['greatBearing', 'evenGreaterBearing'],
      },
    },
  };

  describe('getBearingLoading', () => {
    it('should return loading latest status', () => {
      expect(getBearingLoading(mockState)).toBeFalsy();
    });
  });

  describe('getSelectedBearing', () => {
    it('should return the selected bearing', () => {
      expect(
        getSelectedBearing.projector({
          ...initialState,
          selectedBearing: 'a selected bearing',
        })
      ).toEqual('a selected bearing');
    });
  });

  describe('getModelId', () => {
    it('should return the the modelId', () => {
      expect(
        getModelId.projector({
          ...initialState,
          modelId: MODEL_MOCK_ID,
        })
      ).toEqual(MODEL_MOCK_ID);
    });
  });

  describe('getBearingResultList', () => {
    it('should return the result list', () => {
      expect(getBearingResultList(mockState)).toEqual([
        {
          id: 'greatBearing',
          title: 'greatBearing',
        },
        {
          id: 'evenGreaterBearing',
          title: 'evenGreaterBearing',
        },
      ]);
    });
  });

  describe('getModelCreationSuccess', () => {
    it('should return modelCreationSuccess', () => {
      expect(getModelCreationSuccess(mockState)).toEqual(undefined);
    });
  });
});
