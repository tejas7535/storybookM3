import { AccountInfo } from '@azure/msal-browser';
import {
  loadProfileImage,
  loadProfileImageFailure,
  loadProfileImageSuccess,
  login,
  loginSuccess,
  logout,
} from '../actions/auth.actions';
import { AuthState, initialState, reducer } from './auth.reducer';

describe('Azure Auth Reducer', () => {
  let state: AuthState;

  beforeEach(() => {
    state = {
      accountInfo: undefined,
      profileImage: {
        url: undefined,
        loading: false,
        errorMessage: undefined,
      },
    };
  });

  test('should return old state state on login', () => {
    const result = reducer(state, login());

    expect(result).toEqual(state);
  });

  test('should return initialState state on logout', () => {
    const result = reducer(state, logout());

    expect(result).toEqual(initialState);
  });

  test('should set accountInfo on loginSuccess', () => {
    const accountInfo = ({
      username: 'Joe',
    } as unknown) as AccountInfo;

    const result = reducer(state, loginSuccess({ accountInfo }));

    expect(result.accountInfo.username).toEqual(accountInfo.username);
  });

  test('should reset user on logout', () => {
    const accountInfo = ({
      username: 'Joe',
    } as unknown) as AccountInfo;
    const newState = reducer(state, loginSuccess({ accountInfo }));

    const result = reducer(newState, logout());

    expect(result.accountInfo).toBeUndefined();
    expect(result.profileImage.url).toBeUndefined();
  });

  test('should set loading on loadProfileImage', () => {
    const result = reducer(state, loadProfileImage());

    expect(result.profileImage.loading).toBeTruthy();
  });

  test('should unset loading and save error on loadProfileImageFailure', () => {
    const errorMessage = 'error';
    const result = reducer(state, loadProfileImageFailure({ errorMessage }));

    expect(result.profileImage.loading).toBeFalsy();
    expect(result.profileImage.errorMessage).toEqual(errorMessage);
  });

  test('should unset loading and save img url on loadProfileImageSuccess', () => {
    const url = 'img/url';
    const result = reducer(state, loadProfileImageSuccess({ url }));

    expect(result.profileImage.loading).toBeFalsy();
    expect(result.profileImage.url).toEqual(url);
  });
});
