import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { catchError, of, switchMap, takeUntil } from 'rxjs';

import { CatalogService } from '@ea/core/services/catalog.service';
import { Actions, concatLatestFrom, createEffect, ofType } from '@ngrx/effects';

import { CatalogCalculationResultActions } from '../../actions';
import { ProductSelectionFacade } from '../../facades/product-selection/product-selection.facade';

@Injectable()
export class CatalogCalculationResultEffects {
  constructor(
    private readonly actions$: Actions,
    private readonly catalogService: CatalogService,
    private readonly productSelectionFacade: ProductSelectionFacade
  ) {}

  public fetchBasicFrequencies$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(CatalogCalculationResultActions.fetchBasicFrequencies),
      concatLatestFrom(() => [this.productSelectionFacade.bearingId$]),
      switchMap(([_action, bearingId]) =>
        this.catalogService.getBasicFrequencies(bearingId).pipe(
          takeUntil(
            // cancel request if action is called again
            this.actions$.pipe(
              ofType(CatalogCalculationResultActions.fetchBasicFrequencies)
            )
          ),
          switchMap((basicFrequenciesResult) => [
            CatalogCalculationResultActions.setBasicFrequenciesResult({
              basicFrequenciesResult,
            }),
          ]),
          catchError((error: HttpErrorResponse) =>
            of(
              CatalogCalculationResultActions.setCalculationFailure({
                error: error.message,
              })
            )
          )
        )
      )
    );
  });

  public downloadBasicFrequenciesPdf$ = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(CatalogCalculationResultActions.downloadBasicFrequencies),
        concatLatestFrom(() => [this.productSelectionFacade.bearingId$]),
        switchMap(([_action, bearingId]) =>
          this.catalogService.downloadBasicFrequenciesPdf(bearingId).pipe(
            catchError((error: HttpErrorResponse) =>
              of(
                CatalogCalculationResultActions.setCalculationFailure({
                  error: error.message,
                })
              )
            )
          )
        )
      );
    },
    { dispatch: false }
  );
}
