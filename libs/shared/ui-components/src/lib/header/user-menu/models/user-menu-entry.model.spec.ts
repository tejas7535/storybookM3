import { UserMenuEntry } from './user-menu-entry.model';

describe('UserMenuEtry', () => {
  it('should set key and label', () => {
    const menuEntry: UserMenuEntry = new UserMenuEntry('key', 'label');

    expect(menuEntry.key).toEqual('key');
    expect(menuEntry.label).toEqual('label');
  });
});
