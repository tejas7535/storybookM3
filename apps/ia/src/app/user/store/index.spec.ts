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
  submitUserFeedback,
  submitUserFeedbackFailure,
  submitUserFeedbackSuccess,
  updateUserSettings,
  updateUserSettingsFailure,
  updateUserSettingsSuccess,
} from './actions/user.action';
import { initialState, userReducer } from './index';

describe('User Reducer', () => {
  test('loadUserSettings', () => {
    const action = loadUserSettings();
    const state = userReducer(initialState, action);

    expect(state.settings.loading).toBeTruthy();
    expect(state.settings.errorMessage).toBeUndefined();
  });

  test('loadUserSettingsSuccess', () => {
    const action = loadUserSettingsSuccess({
      data: {
        dimension: FilterDimension.BOARD,
        dimensionKey: '2',
        dimensionDisplayName: 'Two',
      },
    });
    const state = userReducer(initialState, action);

    expect(state.settings.loading).toBeFalsy();
    expect(state.settings.data.dimension).toEqual(FilterDimension.BOARD);
    expect(state.settings.data.dimensionKey).toEqual('2');
    expect(state.settings.data.dimensionDisplayName).toEqual('Two');
    expect(state.settings.errorMessage).toBeUndefined();
  });

  test('loadUserSettingsFailure', () => {
    const errorMessage = 'error';
    const action = loadUserSettingsFailure({ errorMessage });
    const state = userReducer(initialState, action);

    expect(state.settings.loading).toBeFalsy();
    expect(state.settings.errorMessage).toEqual(errorMessage);
  });

  test('updateUserSettings', () => {
    const dimension = FilterDimension.ORG_UNIT;
    const dimensionKey = '123';
    const dimensionDisplayName = 'SH/ZHZ-HR (Human resources reporting)';
    const action = updateUserSettings({
      data: { dimension, dimensionKey, dimensionDisplayName },
    });
    const state = userReducer(initialState, action);

    expect(state.settings.loading).toBeTruthy();
    expect(state.settings.errorMessage).toBeUndefined();
  });

  test('updateUserSettingsSuccess', () => {
    const dimension = FilterDimension.ORG_UNIT;
    const dimensionKey = '123';
    const dimensionDisplayName = 'SH/ZHZ-HR (Human resources reporting)';
    const action = updateUserSettingsSuccess({
      data: { dimension, dimensionKey, dimensionDisplayName },
    });
    const state = userReducer(initialState, action);

    expect(state.settings.loading).toBeFalsy();
    expect(state.settings.data.dimensionKey).toEqual(dimensionKey);
    expect(state.settings.data.dimensionDisplayName).toEqual(
      dimensionDisplayName
    );
    expect(state.settings.errorMessage).toBeUndefined();
  });

  test('updateUserSettingsFailure', () => {
    const errorMessage = 'error';
    const action = updateUserSettingsFailure({ errorMessage });
    const state = userReducer(initialState, action);

    expect(state.settings.loading).toBeFalsy();
    expect(state.settings.errorMessage).toEqual(errorMessage);
  });

  test('loadUserSettingsDimensionData', () => {
    const action = loadUserSettingsDimensionData({
      filterDimension: FilterDimension.COUNTRY,
      searchFor: 'co',
    });
    const state = userReducer(initialState, action);

    expect(state.settings.dialog.selectedDimensionDataLoading).toBeTruthy();
  });

  test('loadFilterDimensionDataSuccess', () => {
    const filterDimension = FilterDimension.ORG_UNIT;

    const action = loadFilterDimensionDataSuccess({
      filterDimension,
      items: [],
    });
    const state = userReducer(initialState, action);

    expect(state.settings.dialog.selectedDimensionDataLoading).toBeFalsy();
  });

  test('loadFilterDimensionDataFailure', () => {
    const filterDimension = FilterDimension.ORG_UNIT;
    const errorMessage = 'error';
    const action = loadFilterDimensionDataFailure({
      filterDimension,
      errorMessage,
    });
    const state = userReducer(initialState, action);

    expect(state.settings.dialog.selectedDimensionDataLoading).toBeFalsy();
  });

  test('loadFilterDimensionData', () => {
    const action = loadFilterDimensionData({
      filterDimension: FilterDimension.COUNTRY,
      searchFor: 'co',
    });
    const state = userReducer(initialState, action);

    expect(state.settings.dialog.selectedDimensionDataLoading).toBeTruthy();
  });

  test('submitUserFeedback', () => {
    const action = submitUserFeedback({
      feedback: { category: 'idea', message: 'new feature' },
    });

    const state = userReducer(initialState, action);

    expect(state.feedback.loading).toBeTruthy();
  });

  test('submitUserFeedbackSuccess', () => {
    const action = submitUserFeedbackSuccess();

    const state = userReducer(initialState, action);

    expect(state.feedback.loading).toBeFalsy();
  });

  test('submitUserFeedbackFailure', () => {
    const action = submitUserFeedbackFailure();

    const state = userReducer(initialState, action);

    expect(state.feedback.loading).toBeFalsy();
  });
});
