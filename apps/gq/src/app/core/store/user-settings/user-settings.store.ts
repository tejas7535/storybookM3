import { inject } from '@angular/core';

import { mergeMap, pipe, tap } from 'rxjs';

import { updateState, withDevtools } from '@angular-architects/ngrx-toolkit';
import { UserSettingsService } from '@gq/shared/services/rest/user-settings/user-settings.service';
import { tapResponse } from '@ngrx/operators';
import { signalStore, withHooks, withMethods, withState } from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';

import { ACTIONS } from './actions-const/actions.const';

interface UserSettingsState {
  userSettingsLoading: boolean;
  userSettingsLoaded: boolean;
}

const initialState: UserSettingsState = {
  userSettingsLoading: false,
  userSettingsLoaded: false,
};

// TODO: store userId, move update user settings methods to this store / work with user settings service only via the store (GQUOTE-6292)
export const UserSettingsStore = signalStore(
  { providedIn: 'root' },
  withDevtools('UserSettingsStore'),
  withState(initialState),
  withMethods((store, userSettingsService = inject(UserSettingsService)) => {
    const loadUserSettings = rxMethod<void>(
      pipe(
        tap(() =>
          updateState(store, ACTIONS.LOAD_USER_SETTINGS, {
            userSettingsLoading: true,
          })
        ),
        mergeMap(() =>
          userSettingsService.getUserSettings().pipe(
            tapResponse({
              next: (response) => {
                userSettingsService.initializeUserSettings(
                  response.result.userSettingsList
                );
                updateState(store, ACTIONS.LOAD_USER_SETTINGS_SUCCESS, {
                  userSettingsLoading: false,
                  userSettingsLoaded: true,
                });
              },
              error: () => {
                userSettingsService.initializeUserSettings([]);
                updateState(store, ACTIONS.LOAD_USER_SETTINGS_FAILURE, {
                  userSettingsLoading: false,
                  userSettingsLoaded: true,
                });
              },
            })
          )
        )
      )
    );

    return { loadUserSettings };
  }),
  withHooks(() => {
    const userSettingsService = inject(UserSettingsService);

    const handleBeforeUnload = async () => {
      await userSettingsService.updateUserSettingsAsPromise();
    };
    const setupWindowListeners = (): void => {
      window.addEventListener('blur', handleBeforeUnload);
      window.addEventListener('beforeunload', handleBeforeUnload);
    };

    return {
      onInit() {
        setupWindowListeners();
      },
    };
  })
);
