import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { fakeAsync, TestBed, tick } from '@angular/core/testing';

import { BehaviorSubject, delay, mergeMap, of, throwError } from 'rxjs';

import { UserSetting } from '@gq/shared/services/rest/user-settings/models/user-setting.interface';
import { UserSettingsResponse } from '@gq/shared/services/rest/user-settings/models/user-settings.response.interface';
import { UserSettingsService } from '@gq/shared/services/rest/user-settings/user-settings.service';
import { TranslocoService } from '@jsverse/transloco';
import { TranslocoLocaleService } from '@jsverse/transloco-locale';
import { HttpCacheManager } from '@ngneat/cashew';
import { mockProvider } from '@ngneat/spectator/jest';
import { provideMockStore } from '@ngrx/store/testing';

import { AUTH_STATE_MOCK } from '../../../../testing/mocks/state/azure-auth-state.mock';
import { RolesFacade } from '../facades';
import { UserSettingsStore } from './user-settings.store';

describe('UserSettingsStore', () => {
  let userSettingsService: UserSettingsService;

  const langChanges$ = new BehaviorSubject<string>('en');
  const localeChanges$ = new BehaviorSubject<string>('en-US');

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        UserSettingsStore,
        UserSettingsService,
        provideHttpClient(),
        provideHttpClientTesting(),
        mockProvider(RolesFacade, {
          loggedInUserId$: of(AUTH_STATE_MOCK.accountInfo.username),
        }),
        {
          provide: TranslocoService,
          useValue: {
            langChanges$: langChanges$.asObservable(),
          },
        },
        {
          provide: TranslocoLocaleService,
          useValue: {
            localeChanges$: localeChanges$.asObservable(),
          },
        },
        mockProvider(HttpCacheManager),
        provideMockStore({
          initialState: {
            'azure-auth': AUTH_STATE_MOCK,
          },
        }),
      ],
    });

    userSettingsService = TestBed.inject(UserSettingsService);
  });
  test('should be created', () => {
    const store = TestBed.inject(UserSettingsStore);
    expect(store).toBeTruthy();
  });

  describe('loadUserSettings', () => {
    test('should initialize user settings with loaded settings', fakeAsync(() => {
      const store = TestBed.inject(UserSettingsStore);
      const userSettings = [{} as UserSetting];
      userSettingsService.getUserSettings = jest.fn(() =>
        of({
          result: {
            userId: 'userId',
            userSettingsList: userSettings,
          },
        }).pipe(delay(100))
      );
      userSettingsService.initializeUserSettings = jest.fn();
      store.loadUserSettings();

      expect(store.userSettingsLoading()).toBeTruthy();
      expect(store.userSettingsLoaded()).toBeFalsy();

      tick(100);

      expect(store.userSettingsLoading()).toBeFalsy();
      expect(store.userSettingsLoaded()).toBeTruthy();
      expect(userSettingsService.getUserSettings).toHaveBeenCalled();
      expect(userSettingsService.initializeUserSettings).toHaveBeenCalledWith(
        userSettings
      );
    }));

    test('should initialize user settings with empty settings on Error', fakeAsync(() => {
      const store = TestBed.inject(UserSettingsStore);
      userSettingsService.getUserSettings = jest.fn(() =>
        of(null).pipe(
          delay(100),
          mergeMap(() => throwError(() => new Error('An error occurred')))
        )
      );
      userSettingsService.initializeUserSettings = jest.fn();
      store.loadUserSettings();

      expect(store.userSettingsLoading()).toBeTruthy();
      expect(store.userSettingsLoaded()).toBeFalsy();

      tick(100);

      expect(store.userSettingsLoading()).toBeFalsy();
      expect(store.userSettingsLoaded()).toBeTruthy();
      expect(userSettingsService.getUserSettings).toHaveBeenCalled();
      expect(userSettingsService.initializeUserSettings).toHaveBeenCalledWith(
        []
      );
    }));
  });

  describe('withHooks', () => {
    describe('onInit', () => {
      test('should add event listeners', () => {
        const addEventListenerSpy = jest.spyOn(window, 'addEventListener');

        TestBed.inject(UserSettingsStore);
        expect(addEventListenerSpy).toHaveBeenCalledWith(
          'blur',
          expect.any(Function)
        );
        expect(addEventListenerSpy).toHaveBeenCalledWith(
          'beforeunload',
          expect.any(Function)
        );
      });

      test('should call handleBeforeUnload on blur event', fakeAsync(() => {
        jest.spyOn(window, 'addEventListener');
        userSettingsService.updateUserSettingsAsPromise = jest.fn(() =>
          Promise.resolve(undefined as UserSettingsResponse)
        );

        TestBed.inject(UserSettingsStore);

        expect(
          userSettingsService.updateUserSettingsAsPromise
        ).not.toHaveBeenCalled();
        window.dispatchEvent(new Event('blur'));
        expect(
          userSettingsService.updateUserSettingsAsPromise
        ).toHaveBeenCalled();
      }));

      test('should call handleBeforeUnload on beforeunload event', fakeAsync(() => {
        jest.spyOn(window, 'addEventListener');
        userSettingsService.updateUserSettingsAsPromise = jest.fn(() =>
          Promise.resolve(undefined as UserSettingsResponse)
        );

        TestBed.inject(UserSettingsStore);

        expect(
          userSettingsService.updateUserSettingsAsPromise
        ).not.toHaveBeenCalled();
        window.dispatchEvent(new Event('beforeunload'));

        expect(
          userSettingsService.updateUserSettingsAsPromise
        ).toHaveBeenCalled();
      }));
    });
  });
});
