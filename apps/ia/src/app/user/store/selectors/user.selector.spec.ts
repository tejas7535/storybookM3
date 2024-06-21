import { EntityState } from '@ngrx/entity';

import { FilterDimension, IdValue } from '../../../shared/models';
import {
  SystemMessage,
  systemMessageAdapter,
} from '../../../shared/models/system-message';
import { UserState } from '../index';
import {
  getActiveSystemMessageId,
  getDialogSelectedDimensionDataLoading,
  getFavoriteDimension,
  getFavoriteDimensionDisplayName,
  getFavoriteDimensionIdValue,
  getSystemMessage,
  getSystemMessageCount,
  getSystemMessageData,
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

  describe('getSystemMessageData', () => {
    test('should return system message data', () => {
      const data = {
        ids: [1],
        entities: [{ id: 1, message: 'm', type: 'info' }],
      } as unknown as EntityState<SystemMessage>;
      const fakeState = {
        systemMessage: {
          data,
        },
      } as UserState;

      expect(getSystemMessageData.projector(fakeState)).toEqual(data);
    });
  });

  describe('getSystemMessage', () => {
    test('should return system message', () => {
      const data = systemMessageAdapter.getInitialState();
      systemMessageAdapter.getSelectors = jest.fn().mockReturnValue({
        selectAll: () => [{ id: 1, message: 'm', type: 'info' }],
      });

      const result = getSystemMessage.projector(data, 1);

      expect(result).toEqual({ id: 1, message: 'm', type: 'info' });
    });
  });

  describe('getActiveSystemMessageId', () => {
    test('should return active system message id', () => {
      const fakeState = {
        systemMessage: {
          active: 1001,
        },
      } as UserState;
      expect(getActiveSystemMessageId.projector(fakeState)).toBe(1001);
    });
  });

  describe('getSystemMessageCount', () => {
    test('should return system message count', () => {
      const data = systemMessageAdapter.getInitialState();
      systemMessageAdapter.getSelectors = jest.fn().mockReturnValue({
        selectTotal: () => 5,
      });

      const result = getSystemMessageCount.projector(data);

      expect(result).toEqual(5);
    });
  });
});
