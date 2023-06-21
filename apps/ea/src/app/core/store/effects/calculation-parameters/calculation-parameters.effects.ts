import { Injectable } from '@angular/core';

import { debounceTime, of, switchMap } from 'rxjs';

import { Actions, createEffect, ofType } from '@ngrx/effects';

import {
  CalculationParametersActions,
  CatalogCalculationResultActions,
  FrictionCalculationResultActions,
} from '../../actions';

@Injectable()
export class CalculationParametersEffects {
  // trigger calculations once parameters are updated
  public operatingParameters$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(CalculationParametersActions.operatingParameters),
      debounceTime(250),
      switchMap((_action) =>
        of(
          FrictionCalculationResultActions.createModel({}),
          CatalogCalculationResultActions.fetchCalculationResult()
        )
      )
    );
  });

  constructor(private readonly actions$: Actions) {}
}
