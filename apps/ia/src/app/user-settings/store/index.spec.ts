import {
  loadFilterDimensionData,
  loadFilterDimensionDataFailure,
  loadFilterDimensionDataSuccess,
} from '../../core/store/actions';
import { FilterDimension } from '../../shared/models';
import {
  loadUserSettings,
  loadUserSettingsDimensionData,
  loadUserSettingsFailure,
  loadUserSettingsSuccess,
  updateUserSettings,
  updateUserSettingsFailure,
  updateUserSettingsSuccess,
} from './actions/user-settings.action';
import { initialState, userSettingsReducer } from './index';

describe('User Settings Reducer', () => {
  test('loadUserSettings', () => {
    const action = loadUserSettings();
    const state = userSettingsReducer(initialState, action);

    expect(state.loading).toBeTruthy();
    expect(state.errorMessage).toBeUndefined();
  });

  test('loadUserSettingsSuccess', () => {
    const action = loadUserSettingsSuccess({
      data: {
        dimension: FilterDimension.BOARD,
        dimensionKey: '2',
        dimensionDisplayName: 'Two',
      },
    });
    const state = userSettingsReducer(initialState, action);

    expect(state.loading).toBeFalsy();
    expect(state.data.dimension).toEqual(FilterDimension.BOARD);
    expect(state.data.dimensionKey).toEqual('2');
    expect(state.data.dimensionDisplayName).toEqual('Two');
    expect(state.errorMessage).toBeUndefined();
  });

  test('loadUserSettingsFailure', () => {
    const errorMessage = 'error';
    const action = loadUserSettingsFailure({ errorMessage });
    const state = userSettingsReducer(initialState, action);

    expect(state.loading).toBeFalsy();
    expect(state.errorMessage).toEqual(errorMessage);
  });

  test('updateUserSettings', () => {
    const dimension = FilterDimension.ORG_UNIT;
    const dimensionKey = '123';
    const dimensionDisplayName = 'SH/ZHZ-HR (Human resources reporting)';
    const action = updateUserSettings({
      data: { dimension, dimensionKey, dimensionDisplayName },
    });
    const state = userSettingsReducer(initialState, action);

    expect(state.loading).toBeTruthy();
    expect(state.errorMessage).toBeUndefined();
  });

  test('updateUserSettingsSuccess', () => {
    const dimension = FilterDimension.ORG_UNIT;
    const dimensionKey = '123';
    const dimensionDisplayName = 'SH/ZHZ-HR (Human resources reporting)';
    const action = updateUserSettingsSuccess({
      data: { dimension, dimensionKey, dimensionDisplayName },
    });
    const state = userSettingsReducer(initialState, action);

    expect(state.loading).toBeFalsy();
    expect(state.data.dimensionKey).toEqual(dimensionKey);
    expect(state.data.dimensionDisplayName).toEqual(dimensionDisplayName);
    expect(state.errorMessage).toBeUndefined();
  });

  test('updateUserSettingsFailure', () => {
    const errorMessage = 'error';
    const action = updateUserSettingsFailure({ errorMessage });
    const state = userSettingsReducer(initialState, action);

    expect(state.loading).toBeFalsy();
    expect(state.errorMessage).toEqual(errorMessage);
  });

  test('loadUserSettingsDimensionData', () => {
    const action = loadUserSettingsDimensionData({
      filterDimension: FilterDimension.COUNTRY,
      searchFor: 'co',
    });
    const state = userSettingsReducer(initialState, action);

    expect(state.dialog.selectedDimensionDataLoading).toBeTruthy();
  });

  test('loadFilterDimensionDataSuccess', () => {
    const filterDimension = FilterDimension.ORG_UNIT;

    const action = loadFilterDimensionDataSuccess({
      filterDimension,
      items: [],
    });
    const state = userSettingsReducer(initialState, action);

    expect(state.dialog.selectedDimensionDataLoading).toBeFalsy();
  });

  test('loadFilterDimensionDataFailure', () => {
    const filterDimension = FilterDimension.ORG_UNIT;
    const errorMessage = 'error';
    const action = loadFilterDimensionDataFailure({
      filterDimension,
      errorMessage,
    });
    const state = userSettingsReducer(initialState, action);

    expect(state.dialog.selectedDimensionDataLoading).toBeFalsy();
  });

  test('loadFilterDimensionData', () => {
    const action = loadFilterDimensionData({
      filterDimension: FilterDimension.COUNTRY,
      searchFor: 'co',
    });
    const state = userSettingsReducer(initialState, action);

    expect(state.dialog.selectedDimensionDataLoading).toBeTruthy();
  });
});
