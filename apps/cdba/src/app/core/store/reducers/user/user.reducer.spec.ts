import { reducer, UserState } from './user.reducer';

import { login, loginSuccess } from '../../actions';

describe('User Reducer', () => {
  let state: UserState;

  beforeEach(() => {
    state = {
      user: {
        username: 'John'
      }
    };
  });

  test('should return old state on login', () => {
    const result = reducer(state, login());

    expect(result).toEqual(state);
  });

  test('should set user on loginSuccess', () => {
    const user = {
      username: 'Joe'
    };

    const result = reducer(state, loginSuccess({ user }));

    expect(result.user.username).toEqual(user.username);
  });
});
