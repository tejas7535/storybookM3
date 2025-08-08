/* eslint-disable ngrx/prefer-effect-callback-in-block-statement */
import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { of } from 'rxjs';
import { catchError, filter, map, mergeMap } from 'rxjs/operators';

import { Actions, createEffect, ofType } from '@ngrx/effects';
import { concatLatestFrom } from '@ngrx/operators';
import { Store } from '@ngrx/store';

import { RoleFacade } from '@cdba/core/auth/role-facade/role.facade';
import { ProductDetailService } from '@cdba/detail/service/detail.service';
import { BomIdentifier } from '@cdba/shared/models';

import {
  loadBom,
  loadBomFailure,
  loadBomSuccess,
  loadCalculationHistorySuccess,
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
  loadBillOfMaterial$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadBom),
      concatLatestFrom(() => this.roleFacade.hasAnyPricingRole$),
      mergeMap(([action, hasPricingRole]) => {
        return hasPricingRole
          ? this.productDetailService.getBom(action.bomIdentifier).pipe(
              map((items) => loadBomSuccess({ items, index: action.index })),
              catchError((error: HttpErrorResponse) =>
                of(
                  loadBomFailure({
                    index: action.index,
                    statusCode: error.status,
                    errorMessage: error.error.detail ?? error.message,
                  })
                )
              )
            )
          : of(
              loadBomFailure({
                errorMessage: 'User has no valid cost roles.',
                statusCode: undefined,
                index: action.index,
              })
            );
      })
    )
  );

  loadCostComponentSplit$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(loadCostComponentSplit),
      mergeMap((action) => {
        return this.productDetailService
          .getCostComponentSplit(action.bomIdentifier)
          .pipe(
            map((items) =>
              loadCostComponentSplitSuccess({ items, index: action.index })
            ),
            catchError((error: HttpErrorResponse) =>
              of(
                loadCostComponentSplitFailure({
                  index: action.index,
                  statusCode: error.status,
                  errorMessage: error.error?.detail ?? error.message,
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
      map((action) => action.index),
      concatLatestFrom((index) =>
        this.store.select(getBomIdentifierForSelectedBomItem({ index }))
      ),
      filter(([_index, bomIdentifier]) => bomIdentifier !== undefined),
      mergeMap(([index, bomIdentifier]) => [
        loadCostComponentSplit({ index, bomIdentifier }),
      ])
    )
  );

  triggerBomLoad$ = createEffect(() =>
    this.actions$.pipe(
      ofType(selectCalculation, loadCalculationHistorySuccess),
      map((action) => action.index),
      concatLatestFrom((index) =>
        this.store.select(getBomIdentifierForSelectedCalculation({ index }))
      ),
      filter(
        ([_index, bomIdentifier]: [number, BomIdentifier]) =>
          bomIdentifier !== undefined
      ),
      map(([index, bomIdentifier]: [number, BomIdentifier]) =>
        loadBom({ index, bomIdentifier })
      )
    )
  );

  constructor(
    private readonly actions$: Actions,
    private readonly productDetailService: ProductDetailService,
    private readonly store: Store,
    private readonly roleFacade: RoleFacade
  ) {}
}
