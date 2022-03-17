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
    const orgUnit = 'IT';
    const action = loadUserSettingsSuccess({
      data: {
        orgUnit,
      },
    });
    const state = userSettingsReducer(initialState, action);

    expect(state.loading).toBeFalsy();
    expect(state.data.orgUnit).toEqual(orgUnit);
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
    const orgUnit = 'IT';
    const action = updateUserSettings({ data: { orgUnit } });
    const state = userSettingsReducer(initialState, action);

    expect(state.loading).toBeTruthy();
    expect(state.errorMessage).toBeUndefined();
  });

  test('updateUserSettingsSuccess', () => {
    const orgUnit = 'IT';
    const action = updateUserSettingsSuccess({ data: { orgUnit } });
    const state = userSettingsReducer(initialState, action);

    expect(state.loading).toBeFalsy();
    expect(state.data.orgUnit).toEqual(orgUnit);
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
