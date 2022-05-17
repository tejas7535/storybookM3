/* eslint-disable ngrx/prefer-effect-callback-in-block-statement */
import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { of } from 'rxjs';
import { catchError, map, mergeMap } from 'rxjs/operators';

import { RoleFacade } from '@cdba/core/auth/role.facade';
import { DetailService } from '@cdba/detail/service/detail.service';
import { Actions, concatLatestFrom, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';

import {
  loadCalculationHistory,
  loadCalculationHistoryFailure,
  loadCalculationHistorySuccess,
  loadCalculations,
  selectCompareItems,
} from '../actions';
import { getSelectedReferenceTypeIdentifiers } from '../selectors';

@Injectable()
export class CalculationsEffects {
  public loadCalculations$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadCalculations),
      concatLatestFrom(() =>
        this.store.select(getSelectedReferenceTypeIdentifiers)
      ),
      map(([_action, identifiers]) => identifiers),
      mergeMap((identifiers) =>
        identifiers.map((identifier, index) =>
          loadCalculationHistory({
            index,
            materialNumber: identifier.materialNumber,
            plant: identifier.plant,
          })
        )
      )
    )
  );

  public loadCalculationHistory$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadCalculationHistory),
      concatLatestFrom(() => this.roleFacade.hasAnyPricingRole$),
      mergeMap(([action, hasPricingRole]) => {
        return hasPricingRole
          ? this.detailService
              .getCalculations(action.materialNumber, action.plant)
              .pipe(
                map((result) =>
                  loadCalculationHistorySuccess({
                    items: result.items,
                    excludedItems: result.excludedItems,
                    plant: action.plant,
                    index: action.index,
                  })
                ),
                catchError((error: HttpErrorResponse) =>
                  of(
                    loadCalculationHistoryFailure({
                      errorMessage: error.error.detail || error.message,
                      statusCode: error.status,
                      index: action.index,
                    })
                  )
                )
              )
          : of(
              loadCalculationHistoryFailure({
                errorMessage: 'User has no valid cost roles.',
                statusCode: undefined,
                index: action.index,
              })
            );
      })
    )
  );

  public triggerDataLoad$ = createEffect(() =>
    this.actions$.pipe(
      ofType(selectCompareItems),
      map(() => loadCalculations())
    )
  );

  public constructor(
    private readonly actions$: Actions,
    private readonly detailService: DetailService,
    private readonly store: Store,
    private readonly roleFacade: RoleFacade
  ) {}
}
