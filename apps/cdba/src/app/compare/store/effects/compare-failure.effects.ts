/* eslint-disable ngrx/prefer-effect-callback-in-block-statement */
/* eslint-disable no-invalid-this */
import { HttpStatusCode } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { tap } from 'rxjs/operators';

import { Actions, createEffect, ofType } from '@ngrx/effects';

import { AppRoutePath } from '@cdba/app-route-path.enum';
import { EmptyStatesPath } from '@cdba/core/empty-states/empty-states-path.enum';
import { HttpErrorService } from '@cdba/core//http/services/http-error.service';

import {
  loadBomFailure,
  loadCalculationHistoryFailure,
  loadProductDetailsFailure,
} from '../actions/compare.actions';

@Injectable()
export class CompareFailureEffects {
  loadFailure$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(
          loadBomFailure,
          loadCalculationHistoryFailure,
          loadProductDetailsFailure
        ),
        tap(async (action) => {
          const error = JSON.parse(action.error);

          if (error && error.status === HttpStatusCode.Forbidden) {
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
