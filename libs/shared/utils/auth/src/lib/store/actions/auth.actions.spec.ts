import { AccessToken } from '../../models/access-token.model';
import {
  login,
  loginSuccess,
  logout,
  setToken,
  startLoginFlow,
} from './auth.actions';

describe('Auth Actions', () => {
  test('startLoginFlow should create action', () => {
    const action = startLoginFlow();

    expect(action).toEqual({
      type: '[Auth] Login with implicit / code flow',
    });
  });

  test('login should create action', () => {
    const action = login();

    expect(action).toEqual({
      type: '[Auth] Login',
    });
  });

  test('logout should create action', () => {
    const action = logout();

    expect(action).toEqual({
      type: '[Auth] Logout',
    });
  });

  test('loginSuccess should create action', () => {
    const user = {
      username: 'Gerd',
    };

    const action = loginSuccess({ user });

    expect(action).toEqual({
      user,
      type: '[Auth] Login successful',
    });
  });

  test('setToken should create action', () => {
    const token = {} as unknown as AccessToken;
    const accessToken = 'crypticTestToken';

    const action = setToken({ token, accessToken });

    expect(action).toEqual({
      token,
      accessToken,
      type: '[Auth] Set token',
    });
  });
});
