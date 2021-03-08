import { AccountInfo } from '@azure/msal-browser';
import {
  loadProfileImage,
  loadProfileImageFailure,
  loadProfileImageSuccess,
  login,
  loginSuccess,
  logout,
} from './auth.actions';

describe('Azure Auth Actions', () => {
  test('login should create action', () => {
    const action = login();

    expect(action).toEqual({
      type: '[Azure Auth] Login',
    });
  });

  test('logout should create action', () => {
    const action = logout();

    expect(action).toEqual({
      type: '[Azure Auth] Logout',
    });
  });

  test('loginSuccess should create action', () => {
    const accountInfo = ({
      username: 'Gerd',
    } as unknown) as AccountInfo;

    const action = loginSuccess({ accountInfo });

    expect(action).toEqual({
      accountInfo,
      type: '[Azure Auth] Login successful',
    });
  });

  test('loadProfileImage should create action', () => {
    const action = loadProfileImage();

    expect(action).toEqual({
      type: '[Azure Auth] Load Profile Image',
    });
  });

  test('loadProfileImageSuccess should create action', () => {
    const url = 'my nice profile image';
    const action = loadProfileImageSuccess({ url });

    expect(action).toEqual({
      url,
      type: '[Azure Auth] Load Profile Image Success',
    });
  });

  test('loadProfileImageFailure should create action', () => {
    const errorMessage = 'error';
    const action = loadProfileImageFailure({ errorMessage });

    expect(action).toEqual({
      errorMessage,
      type: '[Azure Auth] Load Profile Image Failure',
    });
  });
});
