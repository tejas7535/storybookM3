/* eslint-disable ngrx/prefer-effect-callback-in-block-statement */
import { HttpStatusCode } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { EMPTY, from, of } from 'rxjs';
import { mergeMap, switchMap } from 'rxjs/operators';

import { Actions, createEffect, ofType } from '@ngrx/effects';

import { AppRoutePath } from '@cdba/app-route-path.enum';
import { EmptyStatesPath } from '@cdba/core/empty-states/empty-states-path.enum';
import { showSnackBar } from '@cdba/core/store/actions/user-interaction/user-interaction.actions';
import { InteractionType } from '@cdba/user-interaction/model/interaction-type.enum';

import {
  loadBomFailure,
  loadCalculationHistoryFailure,
  loadCostComponentSplitFailure,
  loadProductDetailsFailure,
} from '../actions';

@Injectable()
export class FailureEffects {
  loadFailure$ = createEffect(() =>
    this.actions$.pipe(
      ofType(
        loadBomFailure,
        loadCalculationHistoryFailure,
        loadProductDetailsFailure,
        loadCostComponentSplitFailure
      ),
      switchMap((action) => {
        return action.statusCode === HttpStatusCode.Forbidden
          ? from(
              this.router.navigate([
                AppRoutePath.EmptyStatesPath,
                EmptyStatesPath.ForbiddenPath,
              ])
            ).pipe(mergeMap(() => EMPTY))
          : of(
              showSnackBar({
                interactionType: InteractionType.HTTP_GENERAL_ERROR,
              })
            );
      })
    )
  );

  constructor(
    private readonly actions$: Actions,
    private readonly router: Router
  ) {}
}
