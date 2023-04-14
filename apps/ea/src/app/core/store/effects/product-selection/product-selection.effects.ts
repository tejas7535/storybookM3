import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { catchError, mergeMap, of, switchMap } from 'rxjs';

import { CatalogService } from '@ea/core/services/catalog.service';
import { Actions, concatLatestFrom, createEffect, ofType } from '@ngrx/effects';

import {
  CalculationResultActions,
  ProductSelectionActions,
} from '../../actions';
import { ProductSelectionFacade } from '../../facades/product-selection/product-selection.facade';

@Injectable()
export class ProductSelectionEffects {
  constructor(
    private readonly actions$: Actions,
    private readonly catalogService: CatalogService,
    private readonly productSelectionFacade: ProductSelectionFacade
  ) {}

  public setBearingDesignation$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(ProductSelectionActions.setBearingDesignation),
      mergeMap(() => [
        ProductSelectionActions.fetchBearingId(),
        CalculationResultActions.createModel({ forceRecreate: true }),
      ])
    );
  });

  public fetchBearingId$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(ProductSelectionActions.fetchBearingId),
      concatLatestFrom(() => [
        this.productSelectionFacade.bearingDesignation$,
        this.productSelectionFacade.bearingId$,
      ]),
      switchMap(([_action, bearingDesignation, bearingId]) => {
        // don't fetch bearing id again if already existing
        const bearingId$ = bearingId
          ? of(bearingId)
          : this.catalogService.getBearingIdFromDesignation(bearingDesignation);

        return bearingId$.pipe(
          switchMap((result) => [
            ProductSelectionActions.setBearingId({ bearingId: result }),
          ]),
          catchError((error: HttpErrorResponse) =>
            of(
              ProductSelectionActions.setProductFetchFailure({
                error: error.toString(),
              })
            )
          )
        );
      })
    );
  });
}
