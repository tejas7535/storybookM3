import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { catchError, filter, mergeMap, of, switchMap } from 'rxjs';

import { CO2UpstreamService } from '@ea/core/services/co2-upstream.service';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { concatLatestFrom } from '@ngrx/operators';

import { CO2UpstreamCalculationResultActions } from '../../actions';
import { ProductSelectionFacade } from '../../facades/product-selection/product-selection.facade';

@Injectable()
export class CO2UpstreamCalculationResultEffects {
  public fetchResult$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(CO2UpstreamCalculationResultActions.fetchResult),
      concatLatestFrom(() => [
        this.productSelectionFacade.bearingDesignation$,
        this.productSelectionFacade.isBearingSupported$,
      ]),
      filter(([_action, _designation, _supported]) => _supported),
      switchMap(([_action, bearingDesignation, _supported]) =>
        this.co2UpstreamService
          .getCO2UpstreamForDesignation(bearingDesignation)
          .pipe(
            mergeMap((calculationResult) => [
              CO2UpstreamCalculationResultActions.setCalculationResult({
                calculationResult,
              }),
            ]),
            catchError((error: HttpErrorResponse) =>
              of(
                CO2UpstreamCalculationResultActions.setCalculationFailure({
                  error: error.message,
                })
              )
            )
          )
      )
    );
  });

  constructor(
    private readonly actions$: Actions,
    private readonly co2UpstreamService: CO2UpstreamService,
    private readonly productSelectionFacade: ProductSelectionFacade
  ) {}
}
