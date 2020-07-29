import { AccessToken } from '../../models';
import { login, loginSuccess, logout, setToken } from '../actions/auth.actions';
import { AuthState, reducer } from './auth.reducer';

describe('Auth Reducer', () => {
  let state: AuthState;

  beforeEach(() => {
    state = {
      user: undefined,
      loggedIn: false,
      token: undefined,
      accessToken: undefined,
    };
  });

  test('should return old state on login', () => {
    const result = reducer(state, login());

    expect(result).toEqual(state);
  });

  test('should set user on loginSuccess', () => {
    const user = {
      username: 'Joe',
    };

    const result = reducer(state, loginSuccess({ user }));

    expect(result.user.username).toEqual(user.username);
    expect(result.loggedIn).toBeTruthy();
  });

  test('should reset user on logout', () => {
    const user = {
      username: 'Joe',
    };
    const newState = reducer(state, loginSuccess({ user }));

    const result = reducer(newState, logout());

    expect(result.user).toBeUndefined();
    expect(result.loggedIn).toBeFalsy();
  });

  test('should set token on setToken', () => {
    // tslint:disable-next-line: no-object-literal-type-assertion
    const token = {
      iss: 'test',
    } as AccessToken;
    const accessToken = 'veryEncodedToken';

    const result = reducer(state, setToken({ token, accessToken }));

    expect(result.token).toEqual(token);
  });
});
