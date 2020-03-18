import { User } from '@schaeffler/shared/auth';

import * as fromUserSelectors from './user.selectors';

describe('User selectors', () => {
  test('should return user', () => {
    const user = { username: 'Test' };
    expect(fromUserSelectors.getUser.projector({ user })).toEqual(user);
  });

  test('should return username', () => {
    const user = { username: 'Test' };
    expect(fromUserSelectors.getUsername.projector(user)).toEqual(
      user.username
    );
  });

  test('should return undefined on undefined user', () => {
    const user: User = undefined;
    expect(fromUserSelectors.getUsername.projector(user)).toBeUndefined();
  });
});
