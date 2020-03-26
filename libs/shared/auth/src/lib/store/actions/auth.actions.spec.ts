import { login, loginSuccess, logout } from './auth.actions';

describe('Auth Actions', () => {
  test('login should create action', () => {
    const action = login();

    expect(action).toEqual({
      type: '[Auth] Login'
    });
  });

  test('logout should create action', () => {
    const action = logout();

    expect(action).toEqual({
      type: '[Auth] Logout'
    });
  });

  test('loginSuccess should create action', () => {
    const user = {
      username: 'Gerd'
    };

    const action = loginSuccess({ user });

    expect(action).toEqual({
      user,
      type: '[Auth] Login successful'
    });
  });
});
