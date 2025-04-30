import { inject, Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

import { catchError, map, of, switchMap, tap } from 'rxjs';

import { Rfq4Status } from '@gq/shared/models/quotation-detail/cost';
import { Rfq4Service } from '@gq/shared/services/rest/rfq4/rfq-4.service';
import { translate } from '@jsverse/transloco';
import { Actions, createEffect, ofType } from '@ngrx/effects';

import { Rfq4ProcessActions } from './rfq-4-process.actions';

@Injectable()
export class Rfq4ProcessEffects {
  private readonly actions = inject(Actions);
  private readonly rfq4Service = inject(Rfq4Service);
  private readonly snackBar = inject(MatSnackBar);

  findCalculators$ = createEffect(() => {
    return this.actions.pipe(
      ofType(Rfq4ProcessActions.findCalculators),
      switchMap((action) => {
        return this.rfq4Service.findCalculators(action.gqPositionId).pipe(
          map((foundCalculators) =>
            Rfq4ProcessActions.findCalculatorsSuccess({ foundCalculators })
          ),
          catchError((error) =>
            of(
              Rfq4ProcessActions.findCalculatorsError({
                error,
                gqPositionId: action.gqPositionId,
              })
            )
          )
        );
      })
    );
  });

  sendRecalculateSqvRequest$ = createEffect(() => {
    return this.actions.pipe(
      ofType(Rfq4ProcessActions.sendRecalculateSqvRequest),
      switchMap((action) => {
        return this.rfq4Service
          .recalculateSqv(action.gqPositionId, action.message)
          .pipe(
            tap(() =>
              this.snackBar.open(
                translate('shared.snackBarMessages.sqvRecalculateRequestSend')
              )
            ),
            map((rfq4Status: Rfq4Status) =>
              Rfq4ProcessActions.sendRecalculateSqvRequestSuccess({
                gqPositionId: action.gqPositionId,
                rfq4Status,
              })
            ),
            catchError((error) =>
              of(Rfq4ProcessActions.sendRecalculateSqvRequestError({ error }))
            )
          );
      })
    );
  });
}
