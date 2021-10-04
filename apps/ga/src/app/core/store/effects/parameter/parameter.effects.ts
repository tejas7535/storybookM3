import { Injectable } from '@angular/core';

import { filter, map, mergeMap, withLatestFrom } from 'rxjs';

import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';

import { RestService } from '../../../services/rest/rest.service';
import {
  modelUpdateSuccess,
  patchParameters,
} from '../../actions/parameters/parameters.actions';
import { getCalculationParameters } from '../../selectors/parameter/parameter.selector';

@Injectable()
export class ParameterEffects {
  updateModel$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(patchParameters),
      withLatestFrom(this.store.select(getCalculationParameters)),
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
