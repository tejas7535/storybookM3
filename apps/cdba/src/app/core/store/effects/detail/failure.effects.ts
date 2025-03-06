/* eslint-disable ngrx/prefer-effect-callback-in-block-statement */
import { HttpStatusCode } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { EMPTY, from } from 'rxjs';
import { of } from 'rxjs/internal/observable/of';
import { mergeMap, switchMap } from 'rxjs/operators';

import { Actions, createEffect, ofType } from '@ngrx/effects';

import { AppRoutePath } from '@cdba/app-route-path.enum';
import { EmptyStatesPath } from '@cdba/core/empty-states/empty-states-path.enum';
import { InteractionType } from '@cdba/user-interaction/model/interaction-type.enum';

import {
  loadBomFailure,
  loadCalculationsFailure,
  loadCostComponentSplitFailure,
  loadDrawingsFailure,
  loadReferenceTypeFailure,
  showSnackBar,
} from '../../actions';

@Injectable()
export class FailureEffects {
  loadFailure$ = createEffect(() =>
    this.actions$.pipe(
      ofType(
        loadReferenceTypeFailure,
        loadBomFailure,
        loadCalculationsFailure,
        loadDrawingsFailure,
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
