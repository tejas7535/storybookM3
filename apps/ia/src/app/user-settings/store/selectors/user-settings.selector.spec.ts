import { UserSettingsState } from '..';
import { getUserResort, getUserSettings } from './user-settings.selector';

describe('User Settings Selector', () => {
  const resort = 'Sales';
  const state = {
    data: { resort },
  } as UserSettingsState;

  describe('getUserSettings', () => {
    test('should return user settings', () => {
      expect(getUserSettings.projector(state)).toEqual({
        resort,
      });
    });
  });

  describe('getUserResort', () => {
    test('should return user resort', () => {
      expect(getUserResort.projector(state)).toEqual(resort);
    });
  });
});
