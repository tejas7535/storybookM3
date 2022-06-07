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
      const orgUnitKey = '123';
      const orgUnitDisplayName = 'IT';
      const action = loadUserSettingsSuccess({
        data: { orgUnitKey, orgUnitDisplayName },
      });

      expect(action).toEqual({
        type: '[User Settings] Load User`s Settings Success',
        data: { orgUnitKey, orgUnitDisplayName },
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
    const orgUnitKey = '123';
    const orgUnitDisplayName = 'IT';

    test('updateUserSettings', () => {
      const action = updateUserSettings({
        data: { orgUnitKey, orgUnitDisplayName },
      });

      expect(action).toEqual({
        type: '[User Settings] Update User`s Settings',
        data: { orgUnitKey, orgUnitDisplayName },
      });
    });

    test('updateUserSettingsSuccess', () => {
      const action = updateUserSettingsSuccess({
        data: { orgUnitKey, orgUnitDisplayName },
      });

      expect(action).toEqual({
        type: '[User Settings] Update User`s Settings Success',
        data: { orgUnitKey, orgUnitDisplayName },
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
