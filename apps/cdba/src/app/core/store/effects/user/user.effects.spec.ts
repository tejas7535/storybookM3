import { Observable } from 'rxjs';

import { async, TestBed } from '@angular/core/testing';

import { EffectsMetadata, getEffectsMetadata } from '@ngrx/effects';
import { provideMockActions } from '@ngrx/effects/testing';
import { Action } from '@ngrx/store';
import { AuthService } from '@schaeffler/shared/auth';

import { hot } from 'jest-marbles';
import { configureTestSuite } from 'ng-bullet';

import { UserEffects } from './user.effects';

import { login } from '../../actions';

describe('User Effects', () => {
  let actions$: Observable<Action>;
  let effects: UserEffects;
  let metadata: EffectsMetadata<UserEffects>;
  let authService: AuthService;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      imports: [],
      providers: [
        UserEffects,
        {
          provide: AuthService,
          useValue: {
            initAuth: jest.fn(),
            hasValidAccessToken: jest.fn(),
            getUser: jest.fn(() => {}),
            configureImplicitFlow: jest.fn()
          }
        },
        provideMockActions(() => actions$)
      ]
    });
  });

  beforeEach(async(() => {
    effects = TestBed.inject(UserEffects);
    metadata = getEffectsMetadata(effects);
    authService = TestBed.inject(AuthService);
  }));

  describe('login$', () => {
    test('should not return an action', () => {
      expect(metadata.login$).toEqual({
        dispatch: false,
        useEffectsErrorHandler: true
      });
    });

    test('should call login with root url', () => {
      authService.login = jest.fn();
      actions$ = hot('a', {
        a: login()
      });

      effects.login$.subscribe(() => {
        expect(authService.login).toHaveBeenCalledTimes(1);
        expect(authService.login).toHaveBeenCalledWith('/');
      });
    });

    test('should call login with hash fragment', () => {
      const hash = '#/page1';
      Object.defineProperty(window, 'location', {
        value: {
          hash
        }
      });

      authService.login = jest.fn();
      actions$ = hot('a', {
        a: login()
      });

      effects.login$.subscribe(() => {
        expect(authService.login).toHaveBeenCalledTimes(1);
        expect(authService.login).toHaveBeenCalledWith(hash);
      });
    });
  });
});
