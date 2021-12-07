import { defer } from 'rxjs';

import { MsalBroadcastService } from '@azure/msal-angular';
import { InteractionStatus } from '@azure/msal-browser';
import { createServiceFactory, SpectatorService } from '@ngneat/spectator/jest';
import { Actions, EffectsMetadata, getEffectsMetadata } from '@ngrx/effects';
import { provideMockActions } from '@ngrx/effects/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { marbles } from 'rxjs-marbles';

import { AzureAuthService } from '../../azure-auth.service';
import { AccountInfo, LoadProfileImageError } from '../../models';
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

    test(
      'should call login',
      marbles((m) => {
        authService.login = jest.fn();
        const action = login();
        actions$ = m.cold('-a', { a: action });

        m.expect(effects.login$).toBeObservable(actions$);
        m.flush();
        expect(authService.login).toHaveBeenCalledTimes(1);
      })
    );
  });

  describe('logout$', () => {
    test('should not return an action', () => {
      expect(metadata.logout$).toEqual({
        dispatch: false,
        useEffectsErrorHandler: true,
      });
    });

    test(
      'should call logout',
      marbles((m) => {
        actions$ = m.hot('-a', { a: logout() });

        const expected = m.cold('-b', { b: logout() });

        m.expect(effects.logout$).toBeObservable(expected);
        m.flush();
        expect(authService.logout).toHaveBeenCalledTimes(1);
      })
    );
  });

  describe('profileImage$', () => {
    test(
      'should return loadProfileImageSuccess if REST call is successful',
      marbles((m) => {
        const url = 'img/url';
        const result = loadProfileImageSuccess({ url });

        actions$ = m.hot('-a', { a: loadProfileImage() });

        const response = m.cold('-a|', { a: url });
        const expected = m.cold('--b', { b: result });

        authService.getProfileImage = jest.fn(() => response);

        m.expect(effects.profileImage$).toBeObservable(expected);
        m.flush();
        expect(authService.getProfileImage).toHaveBeenCalledTimes(1);
      })
    );

    test(
      'should return loadProfileImageFailure if REST call fails',
      marbles((m) => {
        const errorMessage = {
          message: 'err',
        } as unknown as LoadProfileImageError;
        const result = loadProfileImageFailure({
          errorMessage: errorMessage.message,
        });

        actions$ = m.hot('-a', { a: loadProfileImage() });

        const response = m.cold('-#|', undefined, errorMessage);
        const expected = m.cold('--b', { b: result });

        authService.getProfileImage = jest.fn(() => response);

        m.expect(effects.profileImage$).toBeObservable(expected);
        m.flush();
        expect(authService.getProfileImage).toHaveBeenCalledTimes(1);
      })
    );
  });

  describe('inProgress$', () => {
    let accountInfo: AccountInfo;

    beforeEach(() => {
      accountInfo = {
        name: 'test',
        idTokenClaims: {
          nonce: '123',
        },
      } as unknown as AccountInfo;
      authService.handleAccount = jest.fn(() => accountInfo);
    });
    test(
      'should do nothing when event not NONE',
      marbles((m) => {
        const action = m.hot('-a', {
          a: InteractionStatus.Login,
        });

        inProgressAction$ = action;
        const expected = m.cold('----');

        m.expect(effects.inProgress$).toBeObservable(expected);
        m.flush();
        expect(authService.handleAccount).not.toHaveBeenCalled();
      })
    );

    test(
      'should do nothing when nonce did not change',
      marbles((m) => {
        const action = m.hot('-aa', {
          a: InteractionStatus.None,
        });

        inProgressAction$ = action;
        const expected = m.cold('-(bc)-', {
          b: loginSuccess({ accountInfo }),
          c: loadProfileImage(),
        });

        m.expect(effects.inProgress$).toBeObservable(expected);
        m.flush();
        expect(authService.handleAccount).toHaveBeenCalledTimes(2);
      })
    );

    test(
      'should return loginSuccess/loadProfileImage when InteractionStatus None and acc info changed',
      marbles((m) => {
        const action = m.hot('-a', {
          a: InteractionStatus.None,
        });

        inProgressAction$ = action;

        const expected = m.cold('-(bc)', {
          b: loginSuccess({ accountInfo }),
          c: loadProfileImage(),
        });
        m.expect(effects.inProgress$).toBeObservable(expected);
        m.flush();
        expect(authService.handleAccount).toHaveBeenCalledTimes(1);
      })
    );
  });
});
