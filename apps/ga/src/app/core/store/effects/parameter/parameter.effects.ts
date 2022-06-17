import { Injectable } from '@angular/core';

import { filter, map, mergeMap, of, switchMap } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { Actions, concatLatestFrom, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';

import { RestService } from '@ga/core/services';

import * as parametersActions from '../../actions/parameters/parameters.actions';
import { getModelId } from '../../selectors/bearing/bearing.selector';
import {
  getCalculationParameters,
  getPreferredGreaseOptions,
} from '../../selectors/parameter/parameter.selector';

@Injectable()
export class ParameterEffects {
  properties$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(parametersActions.getProperties),
      concatLatestFrom(() => this.store.select(getModelId)),
      map(([_action, modelId]) => modelId),
      mergeMap((modelId) =>
        this.restService.getProperties(modelId).pipe(
          map((properties) =>
            parametersActions.getPropertiesSuccess({ properties })
          )
          // catchError((_e) => of(propertyErrors()))
        )
      )
    );
  });

  updateModel$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(parametersActions.patchParameters),
      concatLatestFrom(() => this.store.select(getCalculationParameters)),
      map(([_action, options]) => options),
      filter(({ modelId }) => modelId !== undefined),
      mergeMap(({ modelId, options }) =>
        this.restService.putModelUpdate(modelId, options).pipe(
          map(() => parametersActions.modelUpdateSuccess())
          // catchError((_e) => of(calculationError()))
        )
      )
    );
  });

  getDialog$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(parametersActions.getDialog),
      concatLatestFrom(() => [
        this.store.select(getModelId),
        this.store.select(getPreferredGreaseOptions),
      ]),
      switchMap(([_action, modelId, options]) => {
        return options?.length > 0
          ? of(parametersActions.getDialogEnd())
          : this.restService.getDialog(modelId).pipe(
              map((dialogResponse) =>
                parametersActions.getDialogSuccess({
                  dialogResponse,
                })
              ),
              catchError(() => of(parametersActions.getDialogFailure()))
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
