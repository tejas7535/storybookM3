/* eslint-disable max-lines */
import { HttpClient } from '@angular/common/http';
import { DestroyRef, inject, Injectable } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { combineLatest, Observable, of } from 'rxjs';
import {
  catchError,
  distinctUntilChanged,
  filter,
  skip,
  switchMap,
  take,
  tap,
} from 'rxjs/operators';

import { RolesFacade } from '@gq/core/store/facades/roles.facade';
import { AVAILABLE_LANGUAGE_EN, LOCALE_EN } from '@gq/shared/constants';
import { ApiVersion } from '@gq/shared/models';
import { TranslocoService } from '@jsverse/transloco';
import { TranslocoLocaleService } from '@jsverse/transloco-locale';
import { LOCAL_STORAGE } from '@ng-web-apis/common';

import { UserSetting } from './models/user-setting.interface';
import { UserSettingsResponse } from './models/user-settings.response.interface';
import { UserSettingsKeys } from './models/user-settings-keys.enum';

@Injectable({
  providedIn: 'root',
})
export class UserSettingsService {
  private readonly INIT_KEY = 'initAt';
  readonly #http = inject(HttpClient);
  readonly localStorage = inject(LOCAL_STORAGE);
  readonly rolesFacade = inject(RolesFacade);
  readonly transloco: TranslocoService = inject(TranslocoService);
  readonly localeService: TranslocoLocaleService = inject(
    TranslocoLocaleService
  );
  readonly destroyRef: DestroyRef = inject(DestroyRef);

  readonly PATH_USER_SETTINGS = 'user-settings';
  readonly PARAM_USER_ID = 'user-id';
  readonly PARAM_SETTINGS_KEY = 'settings-key';

  readonly DB_VALUE_LOCALE = 'dbLocale';
  readonly DB_VALUE_LANG = 'dbLang';

  readonly userId$ = this.rolesFacade.loggedInUserId$.pipe(
    takeUntilDestroyed(this.destroyRef),
    filter(Boolean),
    take(1)
  );

  private userId: string;

  /**
   * get user settings for loggedIn userId, either all settings or for the requested key
   * @param key the key to get the settings for, if not provided all settings are returned
   * @returns all saved settings for the user
   */
  getUserSettings(key?: string): Observable<UserSettingsResponse> {
    const url = `${ApiVersion.V1}/${this.PATH_USER_SETTINGS}?${this.PARAM_USER_ID}=${this.userId}${
      key ? `&${this.PARAM_SETTINGS_KEY}=${key}` : ''
    }`;

    return this.#http.get<UserSettingsResponse>(url).pipe(
      tap((response: UserSettingsResponse) => {
        this.setSettingsToLocalStorage(response.result.userSettingsList);
      })
    );
  }

  /**
   * update settings of the loggedIn user, either all settings or the provided key settings
   * @param key key to update the settings for, if not provided all possible key where updated
   * * @param reloadAfterUpdate if true, the page will be reloaded after the settings are updated
   * @returns return the updated settings
   */
  updateUserSetting(key: string, reloadAfterUpdate: boolean = false): void {
    const storageSettings = this.getSettingsFromLocalStorage(key);
    const formData: FormData = new FormData();
    formData.append(
      'userSettings',
      this.createJsonFile(this.userId, storageSettings)
    );

    this.#http
      .post<UserSettingsResponse>(
        `${ApiVersion.V1}/${this.PATH_USER_SETTINGS}`,
        formData,
        {
          reportProgress: true,
          responseType: 'json',
        }
      )
      .pipe(
        take(1),
        catchError((_error) => {
          if (reloadAfterUpdate) {
            window.location.reload();
          }

          return of(null);
        })
      )
      .subscribe(() => {
        if (reloadAfterUpdate) {
          window.location.reload();
        }
      });
  }

  /**
   * update settings of the loggedIn user, either all settings or the provided key settings
   * @param reloadAfterUpdate if true, the page will be reloaded after the settings are updated
   * @param settings list of settings to update, if not provided all possible settings where updated
   * @returns return the updated settings
   */
  updateUserSettings(
    reloadAfterUpdate: boolean = false,
    settings?: UserSetting[]
  ): void {
    const storageSettings =
      settings?.length > 0 ? settings : this.getSettingsFromLocalStorage();
    const formData: FormData = new FormData();
    formData.append(
      'userSettings',
      this.createJsonFile(this.userId, storageSettings)
    );
    this.#http
      .post<UserSettingsResponse>(
        `${ApiVersion.V1}/${this.PATH_USER_SETTINGS}`,
        formData,
        {
          reportProgress: true,
          responseType: 'json',
        }
      )
      .pipe(
        take(1),
        catchError((_error) => {
          if (reloadAfterUpdate) {
            window.location.reload();
          }

          return of(null);
        })
      )

      .subscribe((response: UserSettingsResponse) => {
        this.holdDatabaseValuesForLangLocale(response.result.userSettingsList);
        if (reloadAfterUpdate) {
          window.location.reload();
        }
      });
  }

  /**
   * initialize user settings for the logged in user
   * if no settings are found in the DB, the default settings are set
   */
  initializeUserSettings(): void {
    this.setDefaultLangAndLocale();
    // check if user settings are already set and exist in DB
    this.userId$
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        switchMap((userId) => {
          this.userId = userId;
          const lastInit = this.localStorage.getItem(this.INIT_KEY);
          if (lastInit) {
            this.localStorage.removeItem(this.INIT_KEY);
            this.addSubscriptionForLanguageChange();

            return of(null);
          } else {
            return this.getUserSettings().pipe(
              // Tap operator can be used for side effects, such as logging
              tap((response) => {
                if (response.result.userSettingsList.length === 0) {
                  this.updateDatabaseValuesForLangLocale();
                  this.updateUserSettings();
                  this.addSubscriptionForLanguageChange();
                } else {
                  // settings from the DB are restored to the localStorage and DB Changes overwrite localSettings
                  this.holdDatabaseValuesForLangLocale(
                    response.result.userSettingsList
                  );
                  this.setSettingsToLocalStorage(
                    response.result.userSettingsList
                  );
                  this.localStorage.setItem(
                    this.INIT_KEY,
                    Date.now().toString()
                  );
                  // Instead of reloading, you could navigate or handle the UI state as needed
                  window.location.reload();
                }
              })
            );
          }
        })
      )
      .subscribe();
  }

  /**
   * Subscribes to language and locale changes.
   */
  private addSubscriptionForLanguageChange(): void {
    // transloco for language and locale is emitting multiple times during app initialization
    // It can not be guaranteed which emit will be the required one
    // subscribing to early would result in a reload of the page and in in worst case an infinite loop
    // so the latest language/locale settings are additionally hold in localStorage to avoid this

    const dbLang = this.localStorage.getItem(this.DB_VALUE_LANG);
    const dbLocale = this.localStorage.getItem(this.DB_VALUE_LOCALE);

    combineLatest([
      this.transloco.langChanges$,
      this.localeService.localeChanges$,
    ])
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        // during init of app a lot of component will trigger the observable to emit, so distinctUntilChanged is used
        distinctUntilChanged(
          ([prevLang, prevLocale], [currLang, currLocale]) =>
            prevLang === currLang && prevLocale === currLocale
        ),
        // the first emit can be ignored because it is the last initial value pair after the app is initialized
        skip(1),
        filter(([lang, locale]) => lang !== dbLang || locale !== dbLocale)
      )
      .subscribe(([lang, locale]) => {
        // a complete init process is not needed by this UseCase
        this.localStorage.setItem(this.INIT_KEY, Date.now().toString());

        // Language and Locale are updated as a pair and page is reloaded
        this.updateUserSettings(true, [
          {
            key: UserSettingsKeys.LANGUAGE,
            value: lang,
          } as UserSetting,
          { key: UserSettingsKeys.LOCALE, value: locale },
        ]);
      });
  }

  private setSettingsToLocalStorage(settings: UserSetting[]) {
    settings.forEach((setting) => {
      this.localStorage.setItem(setting.key, setting.value);
    });
  }

  private getSettingsFromLocalStorage(requestedKey?: string): UserSetting[] {
    // Extract keys and filter valid settings directly
    const result = Object.values(UserSettingsKeys)
      .map((key) => ({
        key,
        value: this.getObjectOrStringFromLocalStorage(key),
      }))
      // Filter out settings with null values and settings that do not match the Key when given
      .filter(
        (setting) =>
          this.getObjectOrStringFromLocalStorage(setting.key) !== null &&
          (!requestedKey || setting.key === requestedKey)
      );

    return result.map((setting) => ({
      key: setting.key,
      value:
        typeof setting.value === 'string'
          ? setting.value
          : JSON.stringify(setting.value),
    }));
  }

  private getObjectOrStringFromLocalStorage(key: string): any {
    try {
      return JSON.parse(this.localStorage.getItem(key));
    } catch {
      return this.localStorage.getItem(key);
    }
  }

  /**
   * hold language and locale settings  of DB in localStorage
   * @param settings database settings of user
   */
  private holdDatabaseValuesForLangLocale(settings: UserSetting[]) {
    if (settings.some((item) => item.key === UserSettingsKeys.LANGUAGE)) {
      this.localStorage.setItem(
        this.DB_VALUE_LANG,
        settings.find((item) => item.key === UserSettingsKeys.LANGUAGE).value
      );
    }
    if (settings.some((item) => item.key === UserSettingsKeys.LOCALE)) {
      this.localStorage.setItem(
        this.DB_VALUE_LOCALE,
        settings.find((item) => item.key === UserSettingsKeys.LOCALE).value
      );
    }
  }

  /**
   * update language and locale settings in DB
   */
  private updateDatabaseValuesForLangLocale() {
    // the component of language and locale selection will set the selected value to localstorage, so it can be taken
    this.localStorage.setItem(
      this.DB_VALUE_LANG,
      this.localStorage.getItem('language')
    );
    this.localStorage.setItem(
      this.DB_VALUE_LOCALE,
      this.localStorage.getItem('locale')
    );
  }

  /**
   * when no settings are found in DB or localStorage, the default language and locale are set
   * DEFAULT is EN
   */
  private setDefaultLangAndLocale(): void {
    const defaults = {
      locale: LOCALE_EN.id,
      language: AVAILABLE_LANGUAGE_EN.id,
    };

    let reloadRequired = false;

    for (const [key, value] of Object.entries(defaults)) {
      if (!this.localStorage.getItem(key)) {
        this.localStorage.setItem(key, value);
        reloadRequired = true;
      }
    }

    if (reloadRequired) {
      window.location.reload();
    }
  }

  private createJsonFile(userId: string, storageSettings: UserSetting[]): File {
    const jsonFile: File = new File(
      [
        JSON.stringify({
          userId,
          userSettingsList: storageSettings,
        }),
      ],
      `user-settings.json`,
      {
        type: 'application/json',
      }
    );

    return jsonFile;
  }
}
