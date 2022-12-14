import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';

import { catchError, filter, map, of, switchMap, tap } from 'rxjs';

import { translate } from '@ngneat/transloco';
import {
  Actions,
  concatLatestFrom,
  createEffect,
  ofType,
  OnInitEffects,
} from '@ngrx/effects';
import { Action, Store } from '@ngrx/store';

import { getIsLoggedIn, loginSuccess } from '@schaeffler/azure-auth';

import {
  filterDimensionSelected,
  loadFilterDimensionData,
} from '../../../core/store/actions';
import { SelectedFilter } from '../../../shared/models';
import { UserSettingsService } from '../../user-settings.service';
import { UserSettingsDialogComponent } from '../../user-settings-dialog/user-settings-dialog.component';
import {
  loadUserSettings,
  loadUserSettingsFailure,
  loadUserSettingsSuccess,
  showUserSettingsDialog,
  updateUserSettings,
  updateUserSettingsFailure,
  updateUserSettingsSuccess,
} from '../actions/user-settings.action';
import {
  getFavoriteDimension,
  getFavoriteDimensionIdValue,
} from '../selectors/user-settings.selector';

@Injectable()
export class UserSettingsEffects implements OnInitEffects {
  loadUserSettings$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(loadUserSettings, loginSuccess),
      concatLatestFrom(() => [this.store.select(getIsLoggedIn)]),
      map(([_action, isLoggedIn]) => isLoggedIn),
      filter((isLoggedIn) => isLoggedIn),
      switchMap(() =>
        this.userSettingsService.getUserSettings().pipe(
          switchMap((data) => {
            const result: Action[] = [loadUserSettingsSuccess({ data })];

            if (data?.dimensionKey === undefined) {
              result.push(showUserSettingsDialog());
            } else {
              // set global filter default value
              const filterObj: SelectedFilter = {
                name: data.dimension,
                idValue: {
                  id: data.dimensionKey,
                  value: data.dimensionDisplayName,
                },
              };

              result.push(
                // select favorite
                filterDimensionSelected({
                  filter: filterObj,
                  filterDimension: data.dimension,
                }),
                // preload data for favorite dimension to allow autocomplete
                loadFilterDimensionData({
                  filterDimension: data.dimension,
                })
              );
            }

            return result;
          }),
          catchError((error) =>
            of(loadUserSettingsFailure({ errorMessage: error.message }))
          )
        )
      )
    );
  });

  showUserSettingsDialog$ = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(showUserSettingsDialog, loadUserSettingsFailure),
        concatLatestFrom(() => [
          this.store.select(getFavoriteDimension),
          this.store.select(getFavoriteDimensionIdValue),
        ]),
        map(([_action, dimension, idValue]) => [dimension, idValue]),
        tap((params: any[]) => {
          this.dialog.open(UserSettingsDialogComponent, {
            disableClose: true,
            data: {
              dimension: params[0],
              selectedDimensionIdValue: params[1],
              initialLoad: !params[0] && !params[1],
            },
          });
        })
      );
    },
    { dispatch: false }
  );

  updateUserSettings$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(updateUserSettings),
      map((action) => action.data),
      switchMap((settings) =>
        this.userSettingsService.updateUserSettings(settings).pipe(
          map((data) => updateUserSettingsSuccess({ data })),
          catchError((error) =>
            of(updateUserSettingsFailure({ errorMessage: error.message }))
          )
        )
      )
    );
  });

  updateUserSettingsSuccess$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(updateUserSettingsSuccess),
      map((action) => action.data),
      tap(() => {
        if (this.dialog.openDialogs?.length > 0) {
          // close dialog if open
          this.dialog.closeAll();
        }

        this.snackbar.open(translate('userSettings.saveSuccessful'));
      }),
      map((data) => {
        // set global filter default value
        const filterObj = {
          name: data.dimension,
          idValue: {
            id: data.dimensionKey,
            value: data.dimensionDisplayName,
          },
        };

        return filterDimensionSelected({
          filter: filterObj,
          filterDimension: data.dimension,
        });
      })
    );
  });

  updateUserSettingsFailure$ = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(updateUserSettingsFailure),
        tap(() => this.snackbar.open(translate('userSettings.saveFailed')))
      );
    },
    { dispatch: false }
  );

  constructor(
    private readonly actions$: Actions,
    private readonly userSettingsService: UserSettingsService,
    private readonly dialog: MatDialog,
    private readonly snackbar: MatSnackBar,
    private readonly store: Store
  ) {}

  ngrxOnInitEffects(): Action {
    return loadUserSettings();
  }
}
