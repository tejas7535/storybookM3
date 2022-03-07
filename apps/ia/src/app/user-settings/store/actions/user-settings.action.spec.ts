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
      const action = loadUserSettingsSuccess({ data: { resort: 'IT' } });

      expect(action).toEqual({
        type: '[User Settings] Load User`s Settings Success',
        data: { resort: 'IT' },
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
      const action = updateUserSettings({ data: { resort: 'Sales' } });

      expect(action).toEqual({
        type: '[User Settings] Update User`s Settings',
        data: { resort: 'Sales' },
      });
    });

    test('updateUserSettingsSuccess', () => {
      const action = updateUserSettingsSuccess({ data: { resort: 'Sales' } });

      expect(action).toEqual({
        type: '[User Settings] Update User`s Settings Success',
        data: { resort: 'Sales' },
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
