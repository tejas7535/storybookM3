import { FilterDimension, IdValue } from '../../../shared/models';
import { UserState } from '../index';
import {
  getDialogSelectedDimensionDataLoading,
  getFavoriteDimension,
  getFavoriteDimensionDisplayName,
  getFavoriteDimensionIdValue,
  getUserSettings,
} from './user.selector';

describe('User Selector', () => {
  const state = {
    settings: {
      data: {
        dimension: FilterDimension.BOARD,
        dimensionKey: '2',
        dimensionDisplayName: 'Two',
      },
      loading: false,
      errorMessage: undefined,
      dialog: {
        selectedDimensionDataLoading: false,
      },
    },
  } as UserState;

  describe('getUserSettings', () => {
    test('should return user settings', () => {
      expect(getUserSettings.projector(state)).toEqual(state.settings.data);
    });
  });

  describe('getFavoriteDimensionDisplayName', () => {
    test('should return display name', () => {
      expect(getFavoriteDimensionDisplayName.projector(state)).toEqual(
        state.settings.data.dimensionDisplayName
      );
    });

    test('should return undefined if not set', () => {
      expect(
        getFavoriteDimensionDisplayName.projector({
          ...state,
          settings: { data: undefined },
        } as unknown as UserState)
      ).toBeUndefined();
    });
  });

  describe('getDialogSelectedDimensionDataLoading', () => {
    test('should return loading info', () => {
      expect(getDialogSelectedDimensionDataLoading.projector(state)).toEqual(
        state.settings.dialog.selectedDimensionDataLoading
      );
    });
  });

  describe('getFavoriteDimension', () => {
    test('should return favorite dimension if available', () => {
      expect(getFavoriteDimension.projector(state)).toEqual(
        state.settings.data.dimension
      );
    });

    test('should return default dimension if not set yet', () => {
      expect(
        getFavoriteDimension.projector({
          ...state,
          settings: {
            data: {
              ...state.settings.data,
              dimension: undefined,
            },
          },
        } as unknown as UserState)
      ).toEqual(FilterDimension.ORG_UNIT);
    });

    test('should return default dimension if data not set', () => {
      expect(
        getFavoriteDimension.projector({
          ...state,
          settings: {
            data: undefined,
          },
        } as unknown as UserState)
      ).toEqual(FilterDimension.ORG_UNIT);
    });
  });

  describe('getFavoriteDimensionIdValue', () => {
    test('should return id value', () => {
      expect(getFavoriteDimensionIdValue.projector(state)).toEqual(
        new IdValue(
          state.settings.data.dimensionKey,
          state.settings.data.dimensionDisplayName
        )
      );
    });

    test('should return undefined if data not set', () => {
      expect(
        getFavoriteDimensionIdValue.projector({
          ...state,
          settings: { data: undefined },
        } as unknown as UserState)
      ).toBeUndefined();
    });
  });
});
