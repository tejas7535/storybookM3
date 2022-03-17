import { UserSettingsState } from '..';
import { getUserOrgUnit, getUserSettings } from './user-settings.selector';

describe('User Settings Selector', () => {
  const orgUnit = 'Sales';
  const state = {
    data: { orgUnit },
  } as UserSettingsState;

  describe('getUserSettings', () => {
    test('should return user settings', () => {
      expect(getUserSettings.projector(state)).toEqual({
        orgUnit,
      });
    });
  });

  describe('getUserOrgUnit', () => {
    test('should return user org unit', () => {
      expect(getUserOrgUnit.projector(state)).toEqual(orgUnit);
    });
  });
});
