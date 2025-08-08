/* eslint-disable ngrx/prefer-effect-callback-in-block-statement */
import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { of } from 'rxjs';
import { catchError, map, mergeMap } from 'rxjs/operators';

import { Actions, createEffect, ofType } from '@ngrx/effects';
import { concatLatestFrom } from '@ngrx/operators';
import { Store } from '@ngrx/store';

import { ProductDetailService } from '@cdba/detail/service/detail.service';

import {
  loadAllProductDetails,
  loadProductDetails,
  loadProductDetailsFailure,
  loadProductDetailsSuccess,
} from '../../actions';
import { loadComparisonFeatureData } from '../../actions/root/compare-root.actions';
import { getSelectedReferenceTypeIdentifiers } from '../../selectors';

@Injectable()
export class ProductDetailsEffects {
  loadAllProductDetails$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadAllProductDetails),
      concatLatestFrom((_action) =>
        this.store.select(getSelectedReferenceTypeIdentifiers)
      ),
      map(([_action, identifiers]) => identifiers),
      mergeMap((identifiers) =>
        identifiers.map((referenceTypeIdentifier, index) =>
          loadProductDetails({
            referenceTypeIdentifier,
            index,
          })
        )
      )
    )
  );

  loadProductDetails$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadProductDetails),
      mergeMap((action) =>
        this.productDetailService
          .getDetails(action.referenceTypeIdentifier)
          .pipe(
            map((item) =>
              loadProductDetailsSuccess({
                item,
                index: action.index,
              })
            ),
            catchError((error: HttpErrorResponse) =>
              of(
                loadProductDetailsFailure({
                  errorMessage: error.error.detail ?? error.message,
                  statusCode: error.status,
                  index: action.index,
                })
              )
            )
          )
      )
    )
  );

  triggerDataLoad$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadComparisonFeatureData),
      map(() => loadAllProductDetails())
    )
  );

  constructor(
    private readonly actions$: Actions,
    private readonly productDetailService: ProductDetailService,
    private readonly store: Store
  ) {}
}
