/* eslint-disable ngrx/prefer-effect-callback-in-block-statement */
import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { of } from 'rxjs';
import { catchError, filter, map, mergeMap } from 'rxjs/operators';

import { RoleFacade } from '@cdba/core/auth/role.facade';
import { DetailService } from '@cdba/detail/service/detail.service';
import { BomIdentifier } from '@cdba/shared/models';
import { BetaFeatureService } from '@cdba/shared/services/beta-feature/beta-feature.service';
import { Actions, concatLatestFrom, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';

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
} from '../actions';
import {
  getBomIdentifierForSelectedBomItem,
  getBomIdentifierForSelectedCalculation,
} from '../selectors';

@Injectable()
export class BomEffects {
  public loadBillOfMaterial$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadBom),
      concatLatestFrom(() => this.roleFacade.hasAnyPricingRole$),
      mergeMap(([action, hasPricingRole]) => {
        return hasPricingRole
          ? this.detailService.getBom(action.bomIdentifier).pipe(
              map((items) => loadBomSuccess({ items, index: action.index })),
              catchError((error: HttpErrorResponse) =>
                of(
                  loadBomFailure({
                    errorMessage: error.error.detail || error.message,
                    statusCode: error.status,
                    index: action.index,
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
        return this.detailService
          .getCostComponentSplit(action.bomIdentifier)
          .pipe(
            map((items) =>
              loadCostComponentSplitSuccess({ items, index: action.index })
            ),
            catchError((error: HttpErrorResponse) =>
              of(
                loadCostComponentSplitFailure({
                  index: action.index,
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
      filter(() => this.betaFeatureService.getBetaFeature('oData')),
      map((action) => action.index),
      concatLatestFrom((index) =>
        this.store.select(getBomIdentifierForSelectedBomItem(index))
      ),
      filter(([_index, bomIdentifier]) => bomIdentifier !== undefined),
      mergeMap(([index, bomIdentifier]) => [
        loadCostComponentSplit({ index, bomIdentifier }),
      ])
    )
  );

  public triggerBomLoad$ = createEffect(() =>
    this.actions$.pipe(
      ofType(selectCalculation, loadCalculationHistorySuccess),
      map((action) => action.index),
      concatLatestFrom((index) =>
        this.store.select(getBomIdentifierForSelectedCalculation, index)
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

  public constructor(
    private readonly actions$: Actions,
    private readonly detailService: DetailService,
    private readonly store: Store,
    private readonly roleFacade: RoleFacade,
    private readonly betaFeatureService: BetaFeatureService
  ) {}
}
