import { AccessToken } from '../../models';
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

  test('should return token', () => {
    // tslint:disable-next-line: no-object-literal-type-assertion
    const token = { iss: 'test' } as AccessToken;

    expect(fromAuthSelectors.getToken.projector({ token })).toEqual(token);
  });

  test('should return undefined on undefined token', () => {
    const token: AccessToken = undefined;

    expect(fromAuthSelectors.getToken.projector({ token })).toEqual(undefined);
  });

  test('should return given claim', () => {
    // tslint:disable-next-line: no-object-literal-type-assertion
    const token = { iss: 'test' } as AccessToken;

    expect(fromAuthSelectors.getClaim('iss').projector(token)).toEqual('test');
  });

  test('should return undefined if claim does not exist in token', () => {
    // tslint:disable-next-line: no-object-literal-type-assertion
    const token = { iss: 'test' } as AccessToken;

    expect(
      fromAuthSelectors.getClaim('notexistingclaim').projector(token)
    ).toEqual(undefined);
  });

  test('should return undefined if token is undefined', () => {
    const token: AccessToken = undefined;

    expect(fromAuthSelectors.getClaim('iss').projector(token)).toEqual(
      undefined
    );
  });

  test('should return roles', () => {
    const roles = ['rolling', 'haha'];

    expect(fromAuthSelectors.getRoles.projector(roles)).toEqual([
      'rolling',
      'haha',
    ]);
  });

  test('should return empty array if no roles are present', () => {
    const roles: string[] = [];

    expect(fromAuthSelectors.getRoles.projector(roles)).toEqual([]);
  });

  test('should return empty array if token does not contain roles at all', () => {
    const roles: string[] = undefined;

    expect(fromAuthSelectors.getRoles.projector(roles)).toEqual([]);
  });
});
