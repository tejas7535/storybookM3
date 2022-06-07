import { UserSettingsState } from '..';
import { getUserOrgUnit, getUserSettings } from './user-settings.selector';

describe('User Settings Selector', () => {
  const orgUnitKey = '123';
  const orgUnitDisplayName = 'SH/ZHZ-HR (Human resources reporting)';
  const state = {
    data: { orgUnitKey, orgUnitDisplayName },
  } as UserSettingsState;

  describe('getUserSettings', () => {
    test('should return user settings', () => {
      expect(getUserSettings.projector(state)).toEqual({
        orgUnitKey,
        orgUnitDisplayName,
      });
    });
  });

  describe('getUserOrgUnit', () => {
    test('should return user org unit', () => {
      expect(getUserOrgUnit.projector(state)).toEqual(orgUnitDisplayName);
    });
  });
});
