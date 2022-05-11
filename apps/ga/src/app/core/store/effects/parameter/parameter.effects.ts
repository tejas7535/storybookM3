import { Injectable } from '@angular/core';

import { filter, map, mergeMap } from 'rxjs';

import { Actions, concatLatestFrom, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';

import { Property } from '../../../../shared/models/parameters';
import { RestService } from '../../../services/rest/rest.service';
import {
  getProperties,
  getPropertiesSuccess,
  modelUpdateSuccess,
  patchParameters,
} from '../../actions/parameters/parameters.actions';
import { getModelId } from '../../selectors/bearing/bearing.selector';
import { getCalculationParameters } from '../../selectors/parameter/parameter.selector';

@Injectable()
export class ParameterEffects {
  properties$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(getProperties),
      concatLatestFrom(() => this.store.select(getModelId)),
      map(([_action, modelId]) => modelId),
      mergeMap((modelId) =>
        this.restService.getProperties(modelId).pipe(
          map((properties: Property[]) => getPropertiesSuccess({ properties }))
          // catchError((_e) => of(propertyErrors()))
        )
      )
    );
  });

  updateModel$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(patchParameters),
      concatLatestFrom(() => this.store.select(getCalculationParameters)),
      map(([_action, options]) => options),
      filter(({ modelId }) => modelId !== undefined),
      mergeMap(({ modelId, options }) =>
        this.restService.putModelUpdate(modelId, options).pipe(
          map(() => modelUpdateSuccess())
          // catchError((_e) => of(calculationError()))
        )
      )
    );
  });

  constructor(
    private readonly actions$: Actions,
    private readonly restService: RestService,
    private readonly store: Store
  ) {}
}
