import { async, TestBed } from '@angular/core/testing';

import { Observable, of } from 'rxjs';

import { EffectsMetadata, getEffectsMetadata } from '@ngrx/effects';
import { provideMockActions } from '@ngrx/effects/testing';
import { Action } from '@ngrx/store';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { cold, hot } from 'jest-marbles';
import { configureTestSuite } from 'ng-bullet';

import { AuthService } from '../../auth.service';
import {
  login,
  loginImplicitFlow,
  loginSuccess,
  logout
} from '../actions/auth.actions';
import { getIsLoggedIn } from '../selectors/auth.selectors';
import { AuthEffects } from './auth.effects';

describe('Auth Effects', () => {
  let actions$: Observable<Action>;
  let effects: AuthEffects;
  let metadata: EffectsMetadata<AuthEffects>;
  let authService: AuthService;
  let store: MockStore;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      imports: [],
      providers: [
        AuthEffects,
        {
          provide: AuthService,
          useValue: {
            initAuth: jest.fn(),
            hasValidAccessToken: jest.fn(),
            getUser: jest.fn(() => {}),
            configureImplicitFlow: jest.fn(),
            navigateToState: jest.fn(),
            login: jest.fn(),
            logout: jest.fn()
          }
        },
        provideMockStore(),
        provideMockActions(() => actions$)
      ]
    });
  });

  beforeEach(async(() => {
    effects = TestBed.inject(AuthEffects);
    metadata = getEffectsMetadata(effects);
    authService = TestBed.inject(AuthService);
    store = TestBed.inject(MockStore);
    store.overrideSelector(getIsLoggedIn, false);
  }));

  describe('login$', () => {
    test('should not return an action', () => {
      expect(metadata.login$).toEqual({
        dispatch: false,
        useEffectsErrorHandler: true
      });
    });

    test('should call login with root url', () => {
      actions$ = of(login());

      effects.login$.subscribe();

      expect(authService.login).toHaveBeenCalledTimes(1);
      expect(authService.login).toHaveBeenCalledWith('/');
    });

    test('should call login with hash fragment', () => {
      const hash = '#/page1';
      Object.defineProperty(window, 'location', {
        value: {
          hash
        }
      });

      authService.login = jest.fn();
      actions$ = of(login());

      effects.login$.subscribe();
      expect(authService.login).toHaveBeenCalledTimes(1);
      expect(authService.login).toHaveBeenCalledWith('page1');
    });
  });

  describe('loginImplicitFlow$', () => {
    test('should return loginSuccess if try login succeeds', () => {
      const tryAutomaticResponse = cold('b', { b: true });
      authService.tryAutomaticLogin = jest.fn(() => tryAutomaticResponse);

      actions$ = hot('-a', {
        a: loginImplicitFlow()
      });

      const expected = cold('-b', { b: loginSuccess({ user: undefined }) });

      expect(effects.loginImplicitFlow$).toBeObservable(expected);
    });

    test('should return login if try login failed', () => {
      const tryAutomaticResponse = cold('b', { b: false });
      authService.tryAutomaticLogin = jest.fn(() => tryAutomaticResponse);

      actions$ = hot('a', {
        a: loginImplicitFlow()
      });

      const expected = cold('b', { b: login() });

      expect(effects.loginImplicitFlow$).toBeObservable(expected);
    });
  });

  describe('logout$', () => {
    test('should not return an action', () => {
      expect(metadata.logout$).toEqual({
        dispatch: false,
        useEffectsErrorHandler: true
      });
    });

    test('should call logout method', () => {
      actions$ = of(logout());

      effects.logout$.subscribe();

      expect(authService.logout).toHaveBeenCalledTimes(1);
    });
  });
});
