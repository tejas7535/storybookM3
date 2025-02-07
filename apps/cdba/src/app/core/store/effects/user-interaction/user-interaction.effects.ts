import { HttpErrorResponse, HttpStatusCode } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { catchError, EMPTY, map, mergeMap, of, take, tap } from 'rxjs';

import { Actions, createEffect, ofType, OnInitEffects } from '@ngrx/effects';
import { Action, Store } from '@ngrx/store';

import { BomExportStatus } from '@cdba/user-interaction/model/feature/bom-export';
import { BOM_EXPORT_RUNNING } from '@cdba/user-interaction/model/feature/bom-export/bom-export-status-enum.model';
import { InteractionType } from '@cdba/user-interaction/model/interaction-type.enum';
import { UserInteractionService } from '@cdba/user-interaction/service/user-interaction.service';

import {
  loadInitialBomExportStatus,
  loadInitialBomExportStatusFailure,
  loadInitialBomExportStatusSuccess,
  requestBomExportFailure,
  requestBomExportSuccess,
  showSnackBar,
  trackBomExportStatus,
  trackBomExportStatusCompleted,
  trackBomExportStatusFailure,
} from '../../actions';
import { BomExportFeature } from '../../reducers/user-interaction/user-interaction.reducer';
import { getBomExportFeature } from '../../selectors';

/**
 * Effects class for all effects which trigger interaction with the user
 */
@Injectable()
export class UserInteractionEffects implements OnInitEffects {
  // Section: User interaction without SnackBar

  // Section: General user interaction by only showing a SnackBar
  showSnackBar$ = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(showSnackBar),
        tap((action) => {
          this.userInteractionService.interact(action.interactionType);
        })
      );
    },
    { dispatch: false }
  );

  requestBomExportFailure$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(requestBomExportFailure),
      map((action) => {
        return action.statusCode === HttpStatusCode.BadRequest
          ? showSnackBar({
              interactionType:
                InteractionType.REQUEST_BOM_EXPORT_VALIDATION_ERROR,
            })
          : showSnackBar({
              interactionType: InteractionType.REQUEST_BOM_EXPORT_FAILURE,
            });
      })
    );
  });

  trackBomExportStatusCompleted$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(trackBomExportStatusCompleted),
      map(() =>
        showSnackBar({
          interactionType: InteractionType.TRACK_BOM_EXPORT_PROGRESS_COMPLETED,
        })
      )
    );
  });

  trackBomExportStatusFailure$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(trackBomExportStatusFailure),
      map(() =>
        showSnackBar({
          interactionType: InteractionType.TRACK_BOM_EXPORT_PROGRESS_FAILURE,
        })
      )
    );
  });

  // Section: specific use cases where additional actions should be dispatched
  requestBomExportSuccess$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(requestBomExportSuccess),
      mergeMap(() => [
        showSnackBar({
          interactionType: InteractionType.REQUEST_BOM_EXPORT_SUCCESS,
        }),
        trackBomExportStatus(),
      ]),
      catchError((error: Error) =>
        of(trackBomExportStatusFailure({ errorMessage: error.message }))
      )
    );
  });

  loadInitialBomExportStatus$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(loadInitialBomExportStatus),
      mergeMap(() =>
        this.userInteractionService.loadInitialBomExportStatus().pipe(
          mergeMap((status: BomExportStatus) => {
            return BOM_EXPORT_RUNNING.includes(status.progress)
              ? [
                  loadInitialBomExportStatusSuccess({ status }),
                  trackBomExportStatus(),
                ]
              : [loadInitialBomExportStatusSuccess({ status })];
          }),
          catchError((error: HttpErrorResponse) => {
            // Ignore Http404 - it means that the user never requested bom export
            return error.status === HttpStatusCode.NotFound
              ? EMPTY
              : of(
                  showSnackBar({
                    interactionType:
                      InteractionType.GET_BOM_EXPORT_STATUS_FAILURE,
                  }),
                  loadInitialBomExportStatusFailure({
                    errorMessage: error.message,
                  })
                );
          })
        )
      )
    );
  });

  constructor(
    private readonly actions$: Actions,
    private readonly store: Store,
    private readonly userInteractionService: UserInteractionService
  ) {}

  ngrxOnInitEffects(): Action {
    this.store
      .select(getBomExportFeature)
      .pipe(
        take(1),
        tap((feature: BomExportFeature) => {
          if (!feature.status) {
            this.store.dispatch(loadInitialBomExportStatus());
          }
        })
      )
      .subscribe();

    return { type: 'NO_ACTION' } as Action;
  }
}
