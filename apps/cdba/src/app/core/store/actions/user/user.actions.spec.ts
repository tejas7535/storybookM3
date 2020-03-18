import { login, loginSuccess } from './user.actions';

describe('User Actions', () => {
  test('login should create action', () => {
    const action = login();

    expect(action).toEqual({
      type: '[User] Login'
    });
  });

  test('loginSuccess should create action', () => {
    const user = {
      username: 'Gerd'
    };

    const action = loginSuccess({ user });

    expect(action).toEqual({
      user,
      type: '[User] Login success'
    });
  });
});
