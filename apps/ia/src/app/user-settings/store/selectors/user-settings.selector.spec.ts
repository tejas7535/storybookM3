import { FilterDimension, IdValue } from '../../../shared/models';
import { UserSettingsState } from '..';
import {
  getDialogBusinessAreaValuesLoading,
  getFavoriteDimension,
  getFavoriteDimensionDisplayName,
  getFavoriteDimensionIdValue,
  getUserSettings,
} from './user-settings.selector';

describe('User Settings Selector', () => {
  const state = {
    data: {
      dimension: FilterDimension.BOARD,
      dimensionKey: '2',
      dimensionDisplayName: 'Two',
    },
    loading: false,
    errorMessage: undefined,
    dialog: {
      businessAreaValuesLoading: false,
    },
  } as UserSettingsState;

  describe('getUserSettings', () => {
    test('should return user settings', () => {
      expect(getUserSettings.projector(state)).toEqual(state.data);
    });
  });

  describe('getFavoriteDimensionDisplayName', () => {
    test('should return display name', () => {
      expect(getFavoriteDimensionDisplayName.projector(state)).toEqual(
        state.data.dimensionDisplayName
      );
    });

    test('should return undefined if not set', () => {
      expect(
        getFavoriteDimensionDisplayName.projector({ ...state, data: undefined })
      ).toBeUndefined();
    });
  });

  describe('getDialogBusinessAreaValuesLoading', () => {
    test('should return loading info', () => {
      expect(getDialogBusinessAreaValuesLoading.projector(state)).toEqual(
        state.dialog.businessAreaValuesLoading
      );
    });
  });

  describe('getFavoriteDimension', () => {
    test('should return favorite dimension if available', () => {
      expect(getFavoriteDimension.projector(state)).toEqual(
        state.data.dimension
      );
    });

    test('should return default dimension if not set yet', () => {
      expect(
        getFavoriteDimension.projector({
          ...state,
          data: { ...state.data, dimension: undefined },
        })
      ).toEqual(FilterDimension.ORG_UNIT);
    });

    test('should return default dimension if data not set', () => {
      expect(
        getFavoriteDimension.projector({
          ...state,
          data: undefined,
        })
      ).toEqual(FilterDimension.ORG_UNIT);
    });
  });

  describe('getFavoriteDimensionIdValue', () => {
    test('should return id value', () => {
      expect(getFavoriteDimensionIdValue.projector(state)).toEqual(
        new IdValue(state.data.dimensionKey, state.data.dimensionDisplayName)
      );
    });

    test('should return undefined if data not set', () => {
      expect(
        getFavoriteDimensionIdValue.projector({ ...state, data: undefined })
      ).toBeUndefined();
    });
  });
});
