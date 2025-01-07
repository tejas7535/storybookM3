import { Injectable } from '@angular/core';

import { debounceTime, of, switchMap } from 'rxjs';

import { Actions, concatLatestFrom, createEffect, ofType } from '@ngrx/effects';

import {
  CalculationParametersActions,
  CatalogCalculationResultActions,
  CO2DownstreamCalculationActions,
} from '../../actions';
import { ProductSelectionFacade } from '../../facades';

@Injectable()
export class CalculationParametersEffects {
  // trigger calculations once parameters are updated
  public operatingParameters$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(CalculationParametersActions.operatingParameters),
      debounceTime(250),
      concatLatestFrom(
        () => this.productSelectionFacade.isCo2DownstreamCalculationPossible$
      ),
      switchMap(([{ isValid }, downstreamCalculationPossible]) => {
        if (!isValid) {
          return [];
        }

        return downstreamCalculationPossible
          ? of(
              CatalogCalculationResultActions.fetchCalculationResult(),
              CO2DownstreamCalculationActions.fetchDownstreamCalculation()
            )
          : of(CatalogCalculationResultActions.fetchCalculationResult());
      })
    );
  });

  constructor(
    private readonly actions$: Actions,
    private readonly productSelectionFacade: ProductSelectionFacade
  ) {}
}
