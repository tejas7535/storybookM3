/* eslint-disable ngrx/prefer-effect-callback-in-block-statement */
import { HttpStatusCode } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { tap } from 'rxjs/operators';

import { Actions, createEffect, ofType } from '@ngrx/effects';

import { AppRoutePath } from '@cdba/app-route-path.enum';
import { EmptyStatesPath } from '@cdba/core/empty-states/empty-states-path.enum';
import { HttpErrorService } from '@cdba/core/http/services/http-error.service';

import {
  loadBomFailure,
  loadCalculationsFailure,
  loadCostComponentSplitFailure,
  loadDrawingsFailure,
  loadReferenceTypeFailure,
} from '../../actions';

@Injectable()
export class FailureEffects {
  loadFailure$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(
          loadReferenceTypeFailure,
          loadBomFailure,
          loadCalculationsFailure,
          loadDrawingsFailure,
          loadCostComponentSplitFailure
        ),
        tap(async (action) => {
          if (action.statusCode === HttpStatusCode.Forbidden) {
            await this.router.navigate([
              AppRoutePath.EmptyStatesPath,
              EmptyStatesPath.ForbiddenPath,
            ]);
          } else {
            this.httpErrorService.handleHttpErrorDefault();
          }
        })
      ),
    { dispatch: false }
  );

  constructor(
    private readonly actions$: Actions,
    private readonly router: Router,
    private readonly httpErrorService: HttpErrorService
  ) {}
}
