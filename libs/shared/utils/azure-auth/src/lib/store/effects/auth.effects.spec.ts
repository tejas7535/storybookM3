import { defer } from 'rxjs';

import { MsalBroadcastService } from '@azure/msal-angular';
import { AccountInfo, EventType, InteractionStatus } from '@azure/msal-browser';
import { createServiceFactory, SpectatorService } from '@ngneat/spectator/jest';
import { Actions, EffectsMetadata, getEffectsMetadata } from '@ngrx/effects';
import { provideMockActions } from '@ngrx/effects/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { cold, hot } from 'jasmine-marbles';

import { AzureAuthService } from '../../azure-auth.service';
import {
  loadProfileImage,
  loadProfileImageFailure,
  loadProfileImageSuccess,
  login,
  loginSuccess,
  logout,
} from '../actions/auth.actions';
import { AuthEffects } from './auth.effects';

describe('Azure Auth Effects', () => {
  let actions$: any;
  let effects: AuthEffects;
  let metadata: EffectsMetadata<AuthEffects>;
  let authService: AzureAuthService;
  let spectator: SpectatorService<AuthEffects>;
  let msalSubjectAction$: any;
  let inProgressAction$: any;

  const createService = createServiceFactory({
    service: AuthEffects,
    providers: [
      provideMockActions(() => actions$),
      provideMockStore({}),
      {
        provide: AzureAuthService,
        useValue: {
          logout: jest.fn(),
          login: jest.fn(),
          getProfileImage: jest.fn(),
          setActiveAccount: jest.fn(),
          handleAccount: jest.fn(),
        },
      },
      {
        provide: MsalBroadcastService,
        useValue: {
          msalSubject$: defer(() => msalSubjectAction$),
          inProgress$: defer(() => inProgressAction$),
        },
      },
    ],
  });

  beforeEach(() => {
    spectator = createService();
    actions$ = spectator.inject(Actions);
    effects = spectator.inject(AuthEffects);
    metadata = getEffectsMetadata(effects);
    authService = spectator.inject(AzureAuthService);
  });

  describe('login$', () => {
    test('should not return an action', () => {
      expect(metadata.login$).toEqual({
        dispatch: false,
        useEffectsErrorHandler: true,
      });
    });

    test('should call login', () => {
      authService.login = jest.fn();
      const action = login();
      actions$ = cold('-a', { a: action });

      expect(effects.login$).toBeObservable(actions$);
      expect(authService.login).toHaveBeenCalledTimes(1);
    });
  });

  describe('logout$', () => {
    test('should not return an action', () => {
      expect(metadata.logout$).toEqual({
        dispatch: false,
        useEffectsErrorHandler: true,
      });
    });

    test('should call logout', () => {
      actions$ = hot('-a', { a: logout() });

      const expected = cold('-b', { b: logout() });

      expect(effects.logout$).toBeObservable(expected);
      expect(authService.logout).toHaveBeenCalledTimes(1);
    });
  });

  describe('profileImage$', () => {
    test('should return loadProfileImageSuccess if REST call is successful', () => {
      const url = 'img/url';
      const result = loadProfileImageSuccess({ url });

      actions$ = hot('-a', { a: loadProfileImage() });

      const response = cold('-a|', { a: url });
      const expected = cold('--b', { b: result });

      authService.getProfileImage = jest.fn(() => response);

      expect(effects.profileImage$).toBeObservable(expected);
      expect(authService.getProfileImage).toHaveBeenCalledTimes(1);
    });

    test('should return loadProfileImageFailure if REST call fails', () => {
      const errorMessage = 'err';
      const result = loadProfileImageFailure({ errorMessage });

      actions$ = hot('-a', { a: loadProfileImage() });

      const response = cold('-#|', undefined, errorMessage);
      const expected = cold('--b', { b: result });

      authService.getProfileImage = jest.fn(() => response);

      expect(effects.profileImage$).toBeObservable(expected);
      expect(authService.getProfileImage).toHaveBeenCalledTimes(1);
    });
  });

  describe('eventLoginSuccess$', () => {
    test('should do nothing when payload is missing', () => {
      const action = hot('-a', {
        a: { eventType: EventType.LOGIN_SUCCESS },
      });
      msalSubjectAction$ = action;

      const expected = cold('--');
      expect(effects.eventLoginSuccess$).toBeObservable(expected);
    });

    test('should do nothing when payload account is missing', () => {
      const action = hot('-a', {
        a: { eventType: EventType.LOGIN_SUCCESS, payload: {} },
      });
      msalSubjectAction$ = action;

      const expected = cold('--');
      expect(effects.eventLoginSuccess$).toBeObservable(expected);
    });

    test('should do nothing when not LOGIN_SUCCESS event', () => {
      const action = hot('-a', {
        a: {
          eventType: EventType.ACQUIRE_TOKEN_FAILURE,
          payload: { account: {} },
        },
      });
      msalSubjectAction$ = action;

      const expected = cold('--');
      expect(effects.eventLoginSuccess$).toBeObservable(expected);
    });

    test('should set account if EventType LOGIN_SUCCESS and return loginSuccess/loadProfileImage actions', () => {
      authService.setActiveAccount = jest.fn();
      const accountInfo = ({
        name: 'test',
      } as unknown) as AccountInfo;
      const action = hot('-a', {
        a: {
          eventType: EventType.LOGIN_SUCCESS,
          payload: { account: accountInfo },
        },
      });

      msalSubjectAction$ = action;

      const expected = cold('-(bc)', {
        b: loginSuccess({ accountInfo }),
        c: loadProfileImage(),
      });
      expect(effects.eventLoginSuccess$).toBeObservable(expected);
      expect(authService.setActiveAccount).toHaveBeenCalledWith(accountInfo);
    });
  });

  describe('inProgress$', () => {
    let accountInfo: AccountInfo;

    beforeEach(() => {
      accountInfo = ({
        name: 'test',
        idTokenClaims: {
          nonce: '123',
        },
      } as unknown) as AccountInfo;
      authService.handleAccount = jest.fn(() => accountInfo);
    });
    test('should do nothing when event not NONE', () => {
      const action = hot('-a', {
        a: InteractionStatus.Login,
      });

      inProgressAction$ = action;
      const expected = cold('----');

      expect(effects.inProgress$).toBeObservable(expected);
      expect(authService.handleAccount).not.toHaveBeenCalled();
    });

    test('should do nothing when nonce did not change', () => {
      const action = hot('-aa', {
        a: InteractionStatus.None,
      });

      inProgressAction$ = action;
      const expected = cold('-(bc)-', {
        b: loginSuccess({ accountInfo }),
        c: loadProfileImage(),
      });

      expect(effects.inProgress$).toBeObservable(expected);
      expect(authService.handleAccount).toHaveBeenCalledTimes(2);
    });

    test('should return loginSuccess/loadProfileImage when InteractionStatus None and acc info changed', () => {
      const action = hot('-a', {
        a: InteractionStatus.None,
      });

      inProgressAction$ = action;

      const expected = cold('-(bc)', {
        b: loginSuccess({ accountInfo }),
        c: loadProfileImage(),
      });
      expect(effects.inProgress$).toBeObservable(expected);
      expect(authService.handleAccount).toHaveBeenCalledTimes(1);
    });
  });
});
