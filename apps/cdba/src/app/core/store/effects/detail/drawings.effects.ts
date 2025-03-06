/* eslint-disable ngrx/prefer-effect-callback-in-block-statement */
import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { of } from 'rxjs';
import { catchError, map, mergeMap } from 'rxjs/operators';

import { Actions, createEffect, ofType } from '@ngrx/effects';
import { concatLatestFrom } from '@ngrx/operators';
import { Store } from '@ngrx/store';

import { ProductDetailService } from '@cdba/detail/service/detail.service';
import { Drawing, ReferenceTypeIdentifier } from '@cdba/shared/models';

import {
  loadDrawings,
  loadDrawingsFailure,
  loadDrawingsSuccess,
  selectReferenceType,
} from '../../actions';
import { getSelectedReferenceTypeIdentifier } from '../../selectors';

@Injectable()
export class DrawingsEffects {
  triggerDataLoad$ = createEffect(() =>
    this.actions$.pipe(
      ofType(selectReferenceType),
      map(() => loadDrawings())
    )
  );

  loadDrawings$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadDrawings),
      concatLatestFrom(() =>
        this.store.select(getSelectedReferenceTypeIdentifier)
      ),
      map(([_action, refTypeIdentifier]) => refTypeIdentifier),
      mergeMap(({ materialNumber, plant }: ReferenceTypeIdentifier) =>
        this.productDetailService.getDrawings(materialNumber, plant).pipe(
          map((items: Drawing[]) => loadDrawingsSuccess({ items })),
          catchError((error: HttpErrorResponse) =>
            of(
              loadDrawingsFailure({
                errorMessage: error.error.detail || error.message,
                statusCode: error.status,
              })
            )
          )
        )
      )
    )
  );

  constructor(
    private readonly actions$: Actions,
    private readonly productDetailService: ProductDetailService,
    private readonly store: Store
  ) {}
}
