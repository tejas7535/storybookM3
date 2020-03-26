import { User } from '../../models/user.model';
import * as fromAuthSelectors from './auth.selectors';

describe('Auth selectors', () => {
  test('should return user', () => {
    const user = { username: 'Test' };
    expect(fromAuthSelectors.getUser.projector({ user })).toEqual(user);
  });

  test('should return username', () => {
    const user = { username: 'Test' };
    expect(fromAuthSelectors.getUsername.projector(user)).toEqual(
      user.username
    );
  });

  test('should return undefined on undefined user', () => {
    const user: User = undefined;
    expect(fromAuthSelectors.getUsername.projector(user)).toBeUndefined();
  });

  test('should return login status', () => {
    const user = { username: 'Testuser' };
    expect(
      fromAuthSelectors.getIsLoggedIn.projector({ user, loggedIn: true })
    ).toBeTruthy();
  });
});
