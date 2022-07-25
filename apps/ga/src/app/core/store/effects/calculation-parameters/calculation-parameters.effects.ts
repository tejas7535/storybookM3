import { Injectable } from '@angular/core';

import { filter, map, mergeMap, of, switchMap } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { Actions, concatLatestFrom, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';

import { RestService } from '@ga/core/services';

import * as calculationParametersActions from '@ga/core/store/actions/calculation-parameters/calculation-parameters.actions';
import { getModelId } from '../../selectors/bearing-selection/bearing-selection.selector';
import {
  getCalculationParameters,
  getPreferredGreaseOptions,
} from '../../selectors/calculation-parameters/calculation-parameters.selector';

@Injectable()
export class CalculationParametersEffects {
  properties$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(calculationParametersActions.getProperties),
      concatLatestFrom(() => this.store.select(getModelId)),
      map(([_action, modelId]) => modelId),
      mergeMap((modelId) =>
        this.restService.getProperties(modelId).pipe(
          map((properties) =>
            calculationParametersActions.getPropertiesSuccess({ properties })
          )
          // catchError((_e) => of(propertyErrors()))
        )
      )
    );
  });

  updateModel$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(calculationParametersActions.patchParameters),
      concatLatestFrom(() => this.store.select(getCalculationParameters)),
      map(([_action, options]) => options),
      filter(({ modelId }) => modelId !== undefined),
      mergeMap(({ modelId, options }) =>
        this.restService.putModelUpdate(modelId, options).pipe(
          map(() => calculationParametersActions.modelUpdateSuccess())
          // catchError((_e) => of(calculationError()))
        )
      )
    );
  });

  getDialog$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(calculationParametersActions.getDialog),
      concatLatestFrom(() => [
        this.store.select(getModelId),
        this.store.select(getPreferredGreaseOptions),
      ]),
      switchMap(([_action, modelId, options]) => {
        return options?.length > 0
          ? of(calculationParametersActions.getDialogEnd())
          : this.restService.getDialog(modelId).pipe(
              map((dialogResponse) =>
                calculationParametersActions.getDialogSuccess({
                  dialogResponse,
                })
              ),
              catchError(() =>
                of(calculationParametersActions.getDialogFailure())
              )
            );
      })
    );
  });

  constructor(
    private readonly actions$: Actions,
    private readonly restService: RestService,
    private readonly store: Store
  ) {}
}
