import { provideHttpClient } from '@angular/common/http';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';

import { BehaviorSubject, combineLatest, of } from 'rxjs';

import { RolesFacade } from '@gq/core/store/facades/roles.facade';
import { ApiVersion } from '@gq/shared/models/api-version.enum';
import { TranslocoService } from '@jsverse/transloco';
import { TranslocoLocaleService } from '@jsverse/transloco-locale';
import { LOCAL_STORAGE } from '@ng-web-apis/common';
import {
  createServiceFactory,
  mockProvider,
  SpectatorService,
} from '@ngneat/spectator/jest';

import { USER_SETTINGS_LOCALSTORAGE_MOCK } from '../../../../../testing/mocks/models/user-settings-localstorage.mock';
import { LocalStorageMock } from '../../../../../testing/mocks/storage/local-storage.mock';
import { UserSetting } from './models/user-setting.interface';
import { UserSettingsResponse } from './models/user-settings.response.interface';
import { UserSettingsKeys } from './models/user-settings-keys.enum';
import { UserSettingsService } from './user-settings.service';

describe('Service: UserSettings', () => {
  let spectator: SpectatorService<UserSettingsService>;
  let service: UserSettingsService;
  let httpMock: HttpTestingController;
  let localStorage: LocalStorageMock;
  const userId = '1234';
  const langChanges$ = new BehaviorSubject<string>('en');
  const localeChanges$ = new BehaviorSubject<string>('en-US');

  const createService = createServiceFactory({
    service: UserSettingsService,
    providers: [
      provideHttpClient(),
      provideHttpClientTesting(),
      { provide: LOCAL_STORAGE, useClass: LocalStorageMock },
      mockProvider(RolesFacade, {
        loggedInUserId$: of(userId),
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
    ],
  });

  beforeEach(() => {
    spectator = createService();
    service = spectator.service;
    httpMock = spectator.inject(HttpTestingController);
    localStorage = spectator.inject(
      LOCAL_STORAGE
    ) as unknown as LocalStorageMock;
  });
  test('should be created', () => {
    expect(service).toBeTruthy();
    expect(httpMock).toBeTruthy();
    expect(localStorage).toBeTruthy();
  });

  describe('REST calls', () => {
    describe('getUserSettings', () => {
      beforeEach(() => {
        service['userId'] = userId;
      });
      test('should call GET and return user settings', () => {
        const mockResponse = {
          result: {
            userSettingsList: [
              { key: UserSettingsKeys.LANGUAGE, value: 'en' },
              { key: UserSettingsKeys.LOCALE, value: 'en-US' },
            ],
          },
        };

        service.getUserSettings().subscribe((res) => {
          expect(res).toEqual(mockResponse);
        });

        const req = httpMock.expectOne(
          `${ApiVersion.V1}/${service.PATH_USER_SETTINGS}?${service.PARAM_USER_ID}=${userId}`
        );

        expect(req.request.method).toBe('GET');
        req.flush(mockResponse);
      });

      test('should call GET with key and return specific user setting', () => {
        const mockResponse = {
          result: {
            userSettingsList: [{ key: UserSettingsKeys.LANGUAGE, value: 'en' }],
          },
        };

        service.getUserSettings(UserSettingsKeys.LANGUAGE).subscribe((res) => {
          expect(res).toEqual(mockResponse);
        });

        const req = httpMock.expectOne(
          `${ApiVersion.V1}/${service.PATH_USER_SETTINGS}?${service.PARAM_USER_ID}=${userId}&${service.PARAM_SETTINGS_KEY}=${UserSettingsKeys.LANGUAGE}`
        );

        expect(req.request.method).toBe('GET');
        req.flush(mockResponse);
      });

      test('should handle error and return empty array', () => {
        service.getUserSettings().subscribe((res) => {
          expect(res).toEqual({ result: { userSettingsList: [] } });
        });

        const req = httpMock.expectOne(
          `${ApiVersion.V1}/${service.PATH_USER_SETTINGS}?${service.PARAM_USER_ID}=${userId}`
        );

        expect(req.request.method).toBe('GET');
        req.flush(null, { status: 500, statusText: 'Server Error' });
      });
    });
    describe('updateUserSetting', () => {
      beforeEach(() => {
        delete window.location;
        window.location = { reload: jest.fn() } as any;
        service['getSettingsFromLocalStorage'] = jest
          .fn()
          .mockReturnValue([{} as UserSetting]);
      });

      test('should not call post when settingsList is empty', () => {
        service['getSettingsFromLocalStorage'] = jest.fn().mockReturnValue([]);
        service['createJsonFile'] = jest.fn();
        service.updateUserSetting(UserSettingsKeys.LANGUAGE, true);
        expect(service['createJsonFile']).not.toHaveBeenCalled();
      });
      test('should call POST and reload the page on success', () => {
        const key = UserSettingsKeys.LANGUAGE;
        const reloadAfterUpdate = true;
        const mockResponse = {
          result: {
            userSettingsList: [{ key: UserSettingsKeys.LANGUAGE, value: 'en' }],
          },
        };

        jest.spyOn(window.location, 'reload').mockImplementation(() => {});
        service.updateUserSetting(key, reloadAfterUpdate);

        const req = httpMock.expectOne(
          `${ApiVersion.V1}/${service.PATH_USER_SETTINGS}`
        );
        expect(req.request.method).toBe('POST');
        req.flush(mockResponse);

        expect(window.location.reload).toHaveBeenCalled();
      });

      test('should call POST and not reload the page on success if reloadAfterUpdate is false', () => {
        const key = UserSettingsKeys.LANGUAGE;
        const reloadAfterUpdate = false;
        const mockResponse = {
          result: {
            userSettingsList: [{ key: UserSettingsKeys.LANGUAGE, value: 'en' }],
          },
        };

        service.updateUserSetting(key, reloadAfterUpdate);

        const req = httpMock.expectOne(
          `${ApiVersion.V1}/${service.PATH_USER_SETTINGS}`
        );
        expect(req.request.method).toBe('POST');
        req.flush(mockResponse);

        expect(window.location.reload).not.toHaveBeenCalled();
      });

      test('should handle error and reload the page if reloadAfterUpdate is true', () => {
        const key = UserSettingsKeys.LANGUAGE;
        const reloadAfterUpdate = true;

        service.updateUserSetting(key, reloadAfterUpdate);

        const req = httpMock.expectOne(
          `${ApiVersion.V1}/${service.PATH_USER_SETTINGS}`
        );
        expect(req.request.method).toBe('POST');
        req.flush(null, { status: 500, statusText: 'Server Error' });

        expect(window.location.reload).toHaveBeenCalled();
      });

      test('should handle error and not reload the page if reloadAfterUpdate is false', () => {
        const key = UserSettingsKeys.LANGUAGE;
        const reloadAfterUpdate = false;

        service.updateUserSetting(key, reloadAfterUpdate);

        const req = httpMock.expectOne(
          `${ApiVersion.V1}/${service.PATH_USER_SETTINGS}`
        );
        expect(req.request.method).toBe('POST');
        req.flush(null, { status: 500, statusText: 'Server Error' });

        expect(window.location.reload).not.toHaveBeenCalled();
      });
    });
    describe('updateUserSettings', () => {
      beforeEach(() => {
        delete window.location;
        window.location = { reload: jest.fn() } as any;

        service['getSettingsFromLocalStorage'] = jest
          .fn()
          .mockReturnValue([{} as UserSetting]);
      });
      test('should not call post when settingsList is empty', () => {
        service['getSettingsFromLocalStorage'] = jest.fn().mockReturnValue([]);
        service['createJsonFile'] = jest.fn();
        service.updateUserSettings();
        expect(service['createJsonFile']).not.toHaveBeenCalled();
      });
      test('should call POST and reload the page on success when reloadAfterUpdate is true', () => {
        const reloadAfterUpdate = true;
        const mockResponse = {
          result: {
            userSettingsList: [{ key: UserSettingsKeys.LANGUAGE, value: 'en' }],
          },
        };

        service.updateUserSettings(reloadAfterUpdate);

        const req = httpMock.expectOne(
          `${ApiVersion.V1}/${service.PATH_USER_SETTINGS}`
        );
        expect(req.request.method).toBe('POST');
        req.flush(mockResponse);

        expect(window.location.reload).toHaveBeenCalled();
      });

      test('should call POST and not reload the page on success when reloadAfterUpdate is false', () => {
        const reloadAfterUpdate = false;
        const mockResponse = {
          result: {
            userSettingsList: [{ key: UserSettingsKeys.LANGUAGE, value: 'en' }],
          },
        };

        service.updateUserSettings(reloadAfterUpdate);

        const req = httpMock.expectOne(
          `${ApiVersion.V1}/${service.PATH_USER_SETTINGS}`
        );
        expect(req.request.method).toBe('POST');
        req.flush(mockResponse);

        expect(window.location.reload).not.toHaveBeenCalled();
      });

      test('should call POST with provided settings and reload the page on success when reloadAfterUpdate is true', () => {
        const reloadAfterUpdate = true;
        const settings = [
          { key: UserSettingsKeys.LANGUAGE, value: 'en' },
          { key: UserSettingsKeys.LOCALE, value: 'en-US' },
        ];
        const mockResponse = {
          result: {
            userSettingsList: settings,
          },
        };

        jest.spyOn(window.location, 'reload').mockImplementation(() => {});
        service.updateUserSettings(reloadAfterUpdate, settings);

        const req = httpMock.expectOne(
          `${ApiVersion.V1}/${service.PATH_USER_SETTINGS}`
        );
        expect(req.request.method).toBe('POST');
        req.flush(mockResponse);

        expect(window.location.reload).toHaveBeenCalled();
      });

      test('should handle error and reload the page if reloadAfterUpdate is true', () => {
        const reloadAfterUpdate = true;

        service.updateUserSettings(reloadAfterUpdate);

        const req = httpMock.expectOne(
          `${ApiVersion.V1}/${service.PATH_USER_SETTINGS}`
        );
        expect(req.request.method).toBe('POST');
        req.flush(null, { status: 500, statusText: 'Server Error' });

        expect(window.location.reload).toHaveBeenCalled();
      });

      test('should handle error and not reload the page if reloadAfterUpdate is false', () => {
        const reloadAfterUpdate = false;

        service.updateUserSettings(reloadAfterUpdate);

        const req = httpMock.expectOne(
          `${ApiVersion.V1}/${service.PATH_USER_SETTINGS}`
        );
        expect(req.request.method).toBe('POST');
        req.flush(null, { status: 500, statusText: 'Server Error' });

        expect(window.location.reload).not.toHaveBeenCalled();
      });
    });

    describe('updateUserSettingsAsPromise', () => {
      beforeEach(() => {
        delete window.location;
        window.location = { reload: jest.fn() } as any;

        service['getSettingsFromLocalStorage'] = jest
          .fn()
          .mockReturnValue([{} as UserSetting]);
      });
      test('should not call post when settingsList is empty', () => {
        service['getSettingsFromLocalStorage'] = jest.fn().mockReturnValue([]);
        service['createJsonFile'] = jest.fn();
        service.updateUserSettingsAsPromise();
        expect(service['createJsonFile']).not.toHaveBeenCalled();
      });

      test('should call POST', () => {
        const mockResponse = {
          result: {
            userSettingsList: [{ key: UserSettingsKeys.LANGUAGE, value: 'en' }],
          },
        };

        service.updateUserSettingsAsPromise();

        const req = httpMock.expectOne(
          `${ApiVersion.V1}/${service.PATH_USER_SETTINGS}`
        );
        expect(req.request.method).toBe('POST');
        req.flush(mockResponse);
      });
    });
  });
  describe('initializeUserSettings', () => {
    test('should initialize App, and update the userSettings', () => {
      localStorage.clear();
      const mockResponse: UserSettingsResponse = {
        result: {
          userId: 'userId',
          userSettingsList: [],
        },
      };

      service['getUserSettings'] = jest.fn().mockReturnValue(of(mockResponse));
      service['updateUserSettings'] = jest.fn().mockImplementation(() => {});
      service['addSubscriptionForLanguageChange'] = jest
        .fn()
        .mockImplementation(() => {});

      service.initializeUserSettings();

      expect(service.updateUserSettings).toHaveBeenCalled();
    });

    test('should initialize the and subscribe to languageChanges', () => {
      localStorage.setItem(service['INIT_KEY'], 'someValue');
      service['addSubscriptionForLanguageChange'] = jest.fn();

      service.initializeUserSettings();

      expect(service['addSubscriptionForLanguageChange']).toHaveBeenCalled();
    });

    test('should initialize the app and overwrite localSettings with response result and reload the page', () => {
      localStorage.clear();
      delete window.location;
      window.location = { reload: jest.fn() } as any;
      service['setSettingsToLocalStorage'] = jest.fn();
      service['holdDatabaseValuesForLangLocale'] = jest.fn();
      const mockResponse: UserSettingsResponse = {
        result: {
          userId: 'any',
          userSettingsList: [
            { key: UserSettingsKeys.LANGUAGE, value: 'en' },
            { key: UserSettingsKeys.LOCALE, value: 'en-US' },
          ],
        },
      };

      service['getUserSettings'] = jest.fn().mockReturnValue(of(mockResponse));

      service.initializeUserSettings();

      service.userId$.subscribe(() => {
        expect(service['holdDatabaseValuesForLangLocale']).toHaveBeenCalledWith(
          mockResponse.result.userSettingsList
        );
        expect(service['setSettingsToLocalStorage']).toHaveBeenCalledWith(
          mockResponse.result.userSettingsList
        );
        expect(localStorage.getItem(service['INIT_KEY'])).toBeTruthy();
        expect(window.location.reload).toHaveBeenCalled();
      });
    });
  });

  describe('processResponse', () => {
    test('should call holdDatabaseValuesForLangLocale and reload the window when reloadAfterUpdate is true', () => {
      delete window.location;
      window.location = { reload: jest.fn() } as any;
      service['holdDatabaseValuesForLangLocale'] = jest.fn();
      const mockResponse: UserSettingsResponse = {
        result: {
          userId: 'any',
          userSettingsList: [
            { key: UserSettingsKeys.LANGUAGE, value: 'en' },
            { key: UserSettingsKeys.LOCALE, value: 'en-US' },
          ],
        },
      };

      service['processResponse'](mockResponse, true);

      expect(service['holdDatabaseValuesForLangLocale']).toHaveBeenCalledWith(
        mockResponse.result.userSettingsList
      );
      expect(window.location.reload).toHaveBeenCalled();
    });

    test('should call holdDatabaseValuesForLangLocale and not reload the window when reloadAfterUpdate is false', () => {
      delete window.location;
      window.location = { reload: jest.fn() } as any;
      service['holdDatabaseValuesForLangLocale'] = jest.fn();
      const mockResponse: UserSettingsResponse = {
        result: {
          userId: 'any',
          userSettingsList: [
            { key: UserSettingsKeys.LANGUAGE, value: 'en' },
            { key: UserSettingsKeys.LOCALE, value: 'en-US' },
          ],
        },
      };

      service['processResponse'](mockResponse, false);

      expect(service['holdDatabaseValuesForLangLocale']).toHaveBeenCalledWith(
        mockResponse.result.userSettingsList
      );
      expect(window.location.reload).not.toHaveBeenCalled();
    });
  });

  describe('processError', () => {
    test('should reload the window', () => {
      delete window.location;
      window.location = { reload: jest.fn() } as any;

      service['processError'](true);

      expect(window.location.reload).toHaveBeenCalled();
    });
    test('should not reload the window', () => {
      jest.resetAllMocks();
      delete window.location;
      window.location = { reload: jest.fn() } as any;

      service['processError'](false);

      expect(window.location.reload).not.toHaveBeenCalled();
    });
  });

  describe('addSubscriptionForLanguageChange', () => {
    beforeEach(() => {
      langChanges$.next(null);
      langChanges$.next('en');
      langChanges$.next('en');
      localeChanges$.next('en-US');
    });
    test('should update the userSettings on language change', () => {
      localStorage.clear();
      localStorage.setItem(service['DB_VALUE_LANG'], 'en');
      localStorage.setItem(service['DB_VALUE_LOCALE'], 'en-US');
      const mockResponse: UserSettingsResponse = {
        result: {
          userId: 'userId',
          userSettingsList: [],
        },
      };

      service['getUserSettings'] = jest.fn().mockReturnValue(of(mockResponse));
      service['updateUserSettings'] = jest.fn().mockImplementation(() => {});

      service['addSubscriptionForLanguageChange']();

      langChanges$.next('de');
      combineLatest([
        langChanges$.asObservable(),
        localeChanges$.asObservable(),
      ]).subscribe(() => {
        expect(service['updateUserSettings']).toHaveBeenCalledWith(true);
        expect(service['updateUserSettings']).toHaveBeenCalledTimes(1);
      });
    });
  });
  describe('localStorage', () => {
    describe('setSettingsToLocalStorage', () => {
      test('should set the value to local storage', () => {
        localStorage.clear();
        const settings = [
          { key: UserSettingsKeys.LANGUAGE, value: 'anyValue' } as UserSetting,
          {
            key: UserSettingsKeys.GQ_CASE_OVERVIEW_STATE,
            value: 'anyValue',
          } as UserSetting,
        ];
        service['setSettingsToLocalStorage'](settings);
        const localStorageValue = localStorage.store;
        const expected = {
          [UserSettingsKeys.LANGUAGE]: 'anyValue',
          [UserSettingsKeys.GQ_CASE_OVERVIEW_STATE]: 'anyValue',
        };

        expect(localStorageValue).toEqual(expected);
      });
    });
    describe('getFromLocalStorage', () => {
      test('should read the value from local storage', () => {
        localStorage.clear();
        localStorage.setStore(USER_SETTINGS_LOCALSTORAGE_MOCK);

        const settings = service['getSettingsFromLocalStorage']();
        expect(settings).toEqual([
          {
            key: UserSettingsKeys.LOCALE,
            value: USER_SETTINGS_LOCALSTORAGE_MOCK.locale,
          },
          {
            key: UserSettingsKeys.LANGUAGE,
            value: USER_SETTINGS_LOCALSTORAGE_MOCK.language,
          },
          {
            key: UserSettingsKeys.GQ_CASE_OVERVIEW_STATE,
            value: USER_SETTINGS_LOCALSTORAGE_MOCK.GQ_CASE_OVERVIEW_STATE,
          },
          {
            key: UserSettingsKeys.GQ_PROCESS_CASE_STATE,
            value: USER_SETTINGS_LOCALSTORAGE_MOCK.GQ_PROCESS_CASE_STATE,
          },
          {
            key: UserSettingsKeys.GQ_REFERENCE_PRICING_TABLE_STATE,
            value:
              USER_SETTINGS_LOCALSTORAGE_MOCK[
                'GQ_REFERENCE-PRICING-TABLE_STATE'
              ],
          },
          {
            key: UserSettingsKeys.GQ_SAP_PRICE_DETAILS_STATE,
            value:
              USER_SETTINGS_LOCALSTORAGE_MOCK['GQ_SAP-PRICE-DETAILS_STATE'],
          },
          {
            key: UserSettingsKeys.GQ_TRANSACTIONS_STATE,
            value: USER_SETTINGS_LOCALSTORAGE_MOCK.GQ_TRANSACTIONS_STATE,
          },
          {
            key: UserSettingsKeys.GQ_SEARCH_MATERIAL_RESULTS_TABLE_STATE,
            value:
              USER_SETTINGS_LOCALSTORAGE_MOCK[
                'GQ_SEARCH-MATERIAL-RESULTS-TABLE_STATE'
              ],
          },
          {
            key: UserSettingsKeys.GQ_SEARCH_CASES_RESULTS_TABLE_STATE,
            value:
              USER_SETTINGS_LOCALSTORAGE_MOCK[
                'GQ_SEARCH-CASES-RESULTS-TABLE_STATE'
              ],
          },
        ]);
      });

      test('should read the key by given key from local storage', () => {
        localStorage.clear();
        localStorage.setStore(USER_SETTINGS_LOCALSTORAGE_MOCK);

        const settings = service['getSettingsFromLocalStorage'](
          UserSettingsKeys.LANGUAGE
        );
        expect(settings).toEqual([
          {
            key: UserSettingsKeys.LANGUAGE,
            value: USER_SETTINGS_LOCALSTORAGE_MOCK.language,
          },
        ]);
      });
    });
    describe('getObjectOrStringFromLocalStorage', () => {
      test('should return the parsed value from local storage if it is a valid JSON string', () => {
        const key = 'testKey';
        const value = { key: 'value' };
        localStorage.setItem(key, JSON.stringify(value));

        const result = service['getObjectOrStringFromLocalStorage'](key);
        expect(result).toEqual(value);
      });

      test('should return the string value from local storage if it is not a valid JSON string', () => {
        const key = 'testKey';
        const value = 'stringValue';
        localStorage.setItem(key, value);

        const result = service['getObjectOrStringFromLocalStorage'](key);
        expect(result).toEqual(value);
      });

      test('should return null if the key does not exist in local storage', () => {
        const key = 'nonExistentKey';

        const result = service['getObjectOrStringFromLocalStorage'](key);
        expect(result).toBeNull();
      });

      test('should return the string value from local storage if JSON parsing fails', () => {
        const key = 'testKey';
        const value = 'invalidJSON{';
        localStorage.setItem(key, value);

        const result = service['getObjectOrStringFromLocalStorage'](key);
        expect(result).toEqual(value);
      });
    });

    describe('holdDatabaseValuesForLangLocale', () => {
      test('should save values to localStorage', () => {
        localStorage.clear();
        const settings = [
          { key: UserSettingsKeys.LANGUAGE, value: 'en' } as UserSetting,
          { key: UserSettingsKeys.LOCALE, value: 'en-US' } as UserSetting,
        ];
        service['holdDatabaseValuesForLangLocale'](settings);
        const localStorageValue = localStorage.store;
        const expected = {
          [service.DB_VALUE_LANG]: 'en',
          [service.DB_VALUE_LOCALE]: 'en-US',
        };

        expect(localStorageValue).toEqual(expected);
      });
    });
    describe('updateDatabaseValuesForLangLocale', () => {
      test('should update the values in the localStorage', () => {
        localStorage.clear();
        localStorage.setItem('language', 'de');
        localStorage.setItem('locale', 'de-DE');
        service['updateDatabaseValuesForLangLocale']();
        const localStorageValue = localStorage.store;
        const expected = {
          ['language']: 'de',
          ['locale']: 'de-DE',
          [service.DB_VALUE_LANG]: 'de',
          [service.DB_VALUE_LOCALE]: 'de-DE',
        };

        expect(localStorageValue).toEqual(expected);
      });
    });

    describe('createFormData', () => {
      test('should return formData when storageSettings is not empty', () => {
        service['createJsonFile'] = jest
          .fn()
          .mockReturnValue('JsonFileMockReturnValue');
        const user = '123';
        service['userId'] = user;

        const settings = [
          { key: UserSettingsKeys.LANGUAGE, value: 'en' } as UserSetting,
          { key: UserSettingsKeys.LOCALE, value: 'en-US' } as UserSetting,
        ];
        const formData = service['createFormData'](settings);
        expect(formData.get('userSettings')).toEqual('JsonFileMockReturnValue');
        expect(service['createJsonFile']).toHaveBeenCalledWith(user, settings);
      });
    });
    describe('processUserSettings', () => {
      let formData: FormData;
      let handleResponse: jest.Mock;
      let handleError: jest.Mock;

      beforeEach(() => {
        formData = new FormData();
        handleResponse = jest.fn();
        handleError = jest.fn();
      });

      test('should call POST and handle response', () => {
        const mockResponse: UserSettingsResponse = {
          result: {
            userId: 'me',
            userSettingsList: [{ key: UserSettingsKeys.LANGUAGE, value: 'en' }],
          },
        };

        service['processUserSettings'](
          formData,
          handleResponse,
          handleError
        ).subscribe((response) => {
          expect(response).toEqual(mockResponse);
          expect(handleResponse).toHaveBeenCalledWith(mockResponse);
          expect(handleError).not.toHaveBeenCalled();
        });

        const req = httpMock.expectOne(
          `${ApiVersion.V1}/${service.PATH_USER_SETTINGS}`
        );
        expect(req.request.method).toBe('POST');
        req.flush(mockResponse);
      });

      test('should call POST and handle error', () => {
        service['processUserSettings'](
          formData,
          handleResponse,
          handleError
        ).subscribe((response) => {
          expect(response).toBeNull();
          expect(handleResponse).not.toHaveBeenCalled();
          expect(handleError).toHaveBeenCalled();
        });

        const req = httpMock.expectOne(
          `${ApiVersion.V1}/${service.PATH_USER_SETTINGS}`
        );
        expect(req.request.method).toBe('POST');
        req.flush(null, { status: 500, statusText: 'Server Error' });
      });
    });
  });
});
