import {
  loadUserSettings,
  loadUserSettingsFailure,
  loadUserSettingsSuccess,
  updateUserSettings,
  updateUserSettingsFailure,
  updateUserSettingsSuccess,
} from './user-settings.action';

describe('User Settings Actions', () => {
  describe('Load User`s Resort', () => {
    test('loadUserSettings', () => {
      const action = loadUserSettings();

      expect(action).toEqual({
        type: '[User Settings] Load User`s Settings',
      });
    });

    test('loadUserSettingsSuccess', () => {
      const action = loadUserSettingsSuccess({ data: { orgUnit: 'IT' } });

      expect(action).toEqual({
        type: '[User Settings] Load User`s Settings Success',
        data: { orgUnit: 'IT' },
      });
    });

    test('loadUserSettingsFailure', () => {
      const action = loadUserSettingsFailure({ errorMessage: 'error' });

      expect(action).toEqual({
        type: '[User Settings] Load User`s Settings Failure',
        errorMessage: 'error',
      });
    });
  });

  describe('Update User Settings', () => {
    test('updateUserSettings', () => {
      const action = updateUserSettings({ data: { orgUnit: 'Sales' } });

      expect(action).toEqual({
        type: '[User Settings] Update User`s Settings',
        data: { orgUnit: 'Sales' },
      });
    });

    test('updateUserSettingsSuccess', () => {
      const action = updateUserSettingsSuccess({ data: { orgUnit: 'Sales' } });

      expect(action).toEqual({
        type: '[User Settings] Update User`s Settings Success',
        data: { orgUnit: 'Sales' },
      });
    });

    test('updateUserSettingsFailure', () => {
      const action = updateUserSettingsFailure({ errorMessage: 'error' });

      expect(action).toEqual({
        type: '[User Settings] Update User`s Settings Failure',
        errorMessage: 'error',
      });
    });
  });
});
