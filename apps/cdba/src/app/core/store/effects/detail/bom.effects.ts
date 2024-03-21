/* eslint-disable ngrx/prefer-effect-callback-in-block-statement */
import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { exhaustMap, of } from 'rxjs';
import { catchError, filter, map, mergeMap } from 'rxjs/operators';

import { Actions, concatLatestFrom, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';

import { RoleFacade } from '@cdba/core/auth/role.facade';
import { ProductDetailService } from '@cdba/detail/service/detail.service';

import {
  loadBom,
  loadBomFailure,
  loadBomSuccess,
  loadCalculationsSuccess,
  loadCostComponentSplit,
  loadCostComponentSplitFailure,
  loadCostComponentSplitSuccess,
  selectBomItem,
  selectCalculation,
} from '../../actions';
import {
  getBomIdentifierForSelectedBomItem,
  getBomIdentifierForSelectedCalculation,
} from '../../selectors';

@Injectable()
export class BomEffects {
  triggerBomLoad$ = createEffect(() =>
    this.actions$.pipe(
      ofType(selectCalculation, loadCalculationsSuccess),
      concatLatestFrom(() =>
        this.store.select(getBomIdentifierForSelectedCalculation)
      ),
      map(([_action, bomIdentifier]) => bomIdentifier),
      filter((bomIdentifier) => bomIdentifier !== undefined),
      map((bomIdentifier) => loadBom({ bomIdentifier }))
    )
  );

  loadBom$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(loadBom),
      concatLatestFrom(() => this.roleFacade.hasAnyPricingRole$),
      exhaustMap(([action, hasPricingRole]) => {
        return hasPricingRole
          ? this.productDetailService.getBom(action.bomIdentifier).pipe(
              map((items) => loadBomSuccess({ items })),
              catchError((error: HttpErrorResponse) =>
                of(
                  loadBomFailure({
                    errorMessage: error.error?.detail || error.message,
                    statusCode: error.status,
                  })
                )
              )
            )
          : of(
              loadBomFailure({
                errorMessage: 'User has no valid cost roles.',
                statusCode: undefined,
              })
            );
      })
    );
  });

  loadCostComponentSplit$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(loadCostComponentSplit),
      exhaustMap((action) => {
        return this.productDetailService
          .getCostComponentSplit(action.bomIdentifier)
          .pipe(
            map((items) => loadCostComponentSplitSuccess({ items })),
            catchError((error: HttpErrorResponse) =>
              of(
                loadCostComponentSplitFailure({
                  errorMessage: error.error?.detail || error.message,
                  statusCode: error.status,
                })
              )
            )
          );
      })
    );
  });

  triggerLoadOfCostComponentSplit$ = createEffect(() =>
    this.actions$.pipe(
      ofType(selectBomItem, loadBomSuccess),
      concatLatestFrom(() =>
        this.store.select(getBomIdentifierForSelectedBomItem)
      ),
      filter(([_action, bomIdentifier]) => bomIdentifier !== undefined),
      mergeMap(([_action, bomIdentifier]) => [
        loadCostComponentSplit({ bomIdentifier }),
      ])
    )
  );

  constructor(
    private readonly actions$: Actions,
    private readonly productDetailService: ProductDetailService,
    private readonly store: Store,
    private readonly roleFacade: RoleFacade
  ) {}
}
