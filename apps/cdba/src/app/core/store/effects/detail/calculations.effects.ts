/* eslint-disable ngrx/prefer-effect-callback-in-block-statement */
import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { exhaustMap, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

import { Actions, concatLatestFrom, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';

import { RoleFacade } from '@cdba/core/auth/role.facade';
import { ProductDetailService } from '@cdba/detail/service/detail.service';

import {
  loadCalculations,
  loadCalculationsFailure,
  loadCalculationsSuccess,
  selectReferenceType,
} from '../../actions';
import { getSelectedReferenceTypeIdentifier } from '../../selectors';

@Injectable()
export class CalculationsEffects {
  loadCalculations$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(loadCalculations),
      concatLatestFrom(() => [
        this.store.select(getSelectedReferenceTypeIdentifier),
        this.roleFacade.hasAnyPricingRole$,
      ]),
      exhaustMap(([, referenceTypeIdentifier, hasPricingRole]) => {
        return referenceTypeIdentifier && hasPricingRole
          ? this.productDetailService
              .getCalculations(
                referenceTypeIdentifier.materialNumber,
                referenceTypeIdentifier.plant
              )
              .pipe(
                map((result) =>
                  loadCalculationsSuccess({
                    calculations: result.items,
                    excludedCalculations: result.excludedItems,
                    referenceTypeIdentifier,
                  })
                ),
                catchError((error: HttpErrorResponse) =>
                  of(
                    loadCalculationsFailure({
                      errorMessage: error.error.detail || error.message,
                      statusCode: error.status,
                    })
                  )
                )
              )
          : of(
              loadCalculationsFailure({
                errorMessage: 'User has no valid cost roles.',
                statusCode: undefined,
              })
            );
      })
    );
  });

  triggerDataLoad$ = createEffect(() =>
    this.actions$.pipe(
      ofType(selectReferenceType),
      map(() => loadCalculations())
    )
  );

  constructor(
    private readonly actions$: Actions,
    private readonly productDetailService: ProductDetailService,
    private readonly store: Store,
    private readonly roleFacade: RoleFacade
  ) {}
}
