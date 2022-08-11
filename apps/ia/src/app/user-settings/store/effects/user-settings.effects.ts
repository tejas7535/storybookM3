import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';

import { catchError, map, of, switchMap, tap } from 'rxjs';

import { translate } from '@ngneat/transloco';
import { Actions, createEffect, ofType, OnInitEffects } from '@ngrx/effects';
import { Action } from '@ngrx/store';

import { filterSelected } from '../../../core/store/actions';
import { FilterDimension, FilterKey } from '../../../shared/models';
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

@Injectable()
export class UserSettingsEffects implements OnInitEffects {
  loadUserSettings$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(loadUserSettings),
      switchMap(() =>
        this.userSettingsService.getUserSettings().pipe(
          switchMap((data) => {
            const result: Action[] = [loadUserSettingsSuccess({ data })];

            if (data?.orgUnitKey === undefined) {
              result.push(showUserSettingsDialog());
            } else {
              // set global filter default value
              const filter = {
                name: FilterKey.ORG_UNIT,
                idValue: {
                  id: data.orgUnitKey,
                  value: data.orgUnitDisplayName,
                },
              };

              result.push(filterSelected({ filter }));
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
        tap(() => {
          this.dialog.open(UserSettingsDialogComponent, {
            disableClose: true,
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
        const filter = {
          name: FilterDimension.ORG_UNIT,
          idValue: {
            id: data.orgUnitKey,
            value: data.orgUnitDisplayName,
          },
        };

        return filterSelected({ filter });
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
    private readonly snackbar: MatSnackBar
  ) {}

  ngrxOnInitEffects(): Action {
    return loadUserSettings();
  }
}
