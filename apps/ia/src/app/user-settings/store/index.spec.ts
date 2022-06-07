import {
  loadUserSettings,
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
    const orgUnitKey = '123';
    const orgUnitDisplayName = 'SH/ZHZ-HR (Human resources reporting)';
    const action = loadUserSettingsSuccess({
      data: {
        orgUnitKey,
        orgUnitDisplayName,
      },
    });
    const state = userSettingsReducer(initialState, action);

    expect(state.loading).toBeFalsy();
    expect(state.data.orgUnitKey).toEqual(orgUnitKey);
    expect(state.data.orgUnitDisplayName).toEqual(orgUnitDisplayName);
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
    const orgUnitKey = '123';
    const orgUnitDisplayName = 'SH/ZHZ-HR (Human resources reporting)';
    const action = updateUserSettings({
      data: { orgUnitKey, orgUnitDisplayName },
    });
    const state = userSettingsReducer(initialState, action);

    expect(state.loading).toBeTruthy();
    expect(state.errorMessage).toBeUndefined();
  });

  test('updateUserSettingsSuccess', () => {
    const orgUnitKey = '123';
    const orgUnitDisplayName = 'SH/ZHZ-HR (Human resources reporting)';
    const action = updateUserSettingsSuccess({
      data: { orgUnitKey, orgUnitDisplayName },
    });
    const state = userSettingsReducer(initialState, action);

    expect(state.loading).toBeFalsy();
    expect(state.data.orgUnitKey).toEqual(orgUnitKey);
    expect(state.data.orgUnitDisplayName).toEqual(orgUnitDisplayName);
    expect(state.errorMessage).toBeUndefined();
  });

  test('updateUserSettingsFailure', () => {
    const errorMessage = 'error';
    const action = updateUserSettingsFailure({ errorMessage });
    const state = userSettingsReducer(initialState, action);

    expect(state.loading).toBeFalsy();
    expect(state.errorMessage).toEqual(errorMessage);
  });
});
