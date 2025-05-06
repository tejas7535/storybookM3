import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';

import { catchError, filter, map, mergeMap, of, switchMap, tap } from 'rxjs';

import { translate, TranslocoService } from '@jsverse/transloco';
import { Actions, createEffect, ofType, OnInitEffects } from '@ngrx/effects';
import { concatLatestFrom } from '@ngrx/operators';
import { Action, Store } from '@ngrx/store';

import { getIsLoggedIn, loginSuccess } from '@schaeffler/azure-auth';
import { closeBanner, openBanner } from '@schaeffler/banner';

import {
  filterDimensionSelected,
  filterSelected,
  loadFilterDimensionData,
} from '../../../core/store/actions';
import { SelectedFilter } from '../../../shared/models';
import { SystemMessageService } from '../../system-message/system-message.service';
import { UserSettingsService } from '../../user-settings/user-settings.service';
import { UserSettingsDialogComponent } from '../../user-settings/user-settings-dialog/user-settings-dialog.component';
import {
  dismissSystemMessage,
  dismissSystemMessageFailure,
  dismissSystemMessageSuccess,
  initUserEffects,
  loadSystemMessage,
  loadSystemMessageFailure,
  loadSystemMessageSuccess,
  loadUserSettings,
  loadUserSettingsFailure,
  loadUserSettingsSuccess,
  openIABanner,
  showUserSettingsDialog,
  updateUserSettings,
  updateUserSettingsFailure,
  updateUserSettingsSuccess,
} from '../actions/user.action';
import {
  getActiveSystemMessageId,
  getFavoriteDimension,
  getFavoriteDimensionIdValue,
  getSystemMessageCount,
} from '../selectors/user.selector';

@Injectable()
export class UserEffects implements OnInitEffects {
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
                filterSelected({
                  filter: filterObj,
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
              initialLoad: !params[1],
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

        this.snackbar.open(translate('user.userSettings.saveSuccessful'));
      }),
      mergeMap((data) => {
        // set global filter default value
        const filterObj = {
          name: data.dimension,
          idValue: {
            id: data.dimensionKey,
            value: data.dimensionDisplayName,
          },
        };

        return [
          loadSystemMessage(),
          filterDimensionSelected({
            filter: filterObj,
            filterDimension: data.dimension,
          }),
        ];
      })
    );
  });

  updateUserSettingsFailure$ = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(updateUserSettingsFailure),
        tap(() => this.snackbar.open(translate('user.userSettings.saveFailed')))
      );
    },
    { dispatch: false }
  );

  loadSystemMessage$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(loadSystemMessage),
      switchMap(() =>
        this.systemMessageService.getSystemMessage().pipe(
          map((data) => loadSystemMessageSuccess({ data })),
          catchError((error) =>
            of(loadSystemMessageFailure({ errorMessage: error.message }))
          )
        )
      )
    );
  });

  closeBanner$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(closeBanner),
      concatLatestFrom(() => this.store.select(getActiveSystemMessageId)),
      map(([_action, id]) => id),
      switchMap((id) => of(dismissSystemMessage({ id })))
    );
  });

  dismissSystemMessage$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(dismissSystemMessage),
      switchMap((action) =>
        this.systemMessageService.dismissSystemMessage(action.id).pipe(
          map(() => dismissSystemMessageSuccess({ id: action.id })),
          catchError((error) =>
            of(
              dismissSystemMessageFailure({
                errorMessage: error.message,
              })
            )
          )
        )
      )
    );
  });

  openIABanner$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(openIABanner),
      concatLatestFrom(() => [
        this.store.select(getSystemMessageCount),
        this.translocoService.selectTranslateObject('banner'),
      ]),
      filter(([action]) => !!action.systemMessage),
      map(([action, count, bannerBtnText]) => ({
        action,
        dismiss: count > 1 ? bannerBtnText.nextMessage : bannerBtnText.dismiss,
      })),
      switchMap((smInfo) =>
        of(
          openBanner({
            buttonText: smInfo.dismiss,
            icon: smInfo.action.systemMessage.type,
            text: smInfo.action.systemMessage.message,
            truncateSize: this.getTruncationSize(
              smInfo.action.systemMessage.message,
              200
            ),
          })
        )
      )
    );
  });

  initUserEffects$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(initUserEffects),
      mergeMap(() => [loadUserSettings(), loadSystemMessage()])
    );
  });

  getTruncationSize = (message: string, maxSize: number): number =>
    new DOMParser().parseFromString(message, 'text/html').body.textContent
      .length > maxSize
      ? maxSize
      : undefined;

  constructor(
    private readonly actions$: Actions,
    private readonly userSettingsService: UserSettingsService,
    private readonly systemMessageService: SystemMessageService,
    private readonly dialog: MatDialog,
    private readonly snackbar: MatSnackBar,
    private readonly store: Store,
    private readonly translocoService: TranslocoService
  ) {}

  ngrxOnInitEffects(): Action {
    return initUserEffects();
  }
}
