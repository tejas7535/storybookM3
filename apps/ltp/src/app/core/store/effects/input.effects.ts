import { Injectable } from '@angular/core';

import { of } from 'rxjs';
import { catchError, mergeMap } from 'rxjs/operators';

import { Actions, createEffect, ofType } from '@ngrx/effects';

import { BURDING_TYPES } from '../../../shared/constants/burdening-types';
import { MATERIAL_TYPES } from '../../../shared/constants/material-types';
import { PREDICTION_TYPES } from '../../../shared/constants/prediction-types';
import * as InputActions from '../actions/input.actions';

@Injectable()
export class InputEffects {
  constructor(private readonly actions$: Actions) {}

  public getPredictions$ = createEffect(() =>
    this.actions$.pipe(
      ofType(InputActions.getFormOptions),
      mergeMap(async () =>
        InputActions.setPredictionOptions({ predictions: PREDICTION_TYPES })
      ),
      catchError(() => of(InputActions.getPredictionsFailure()))
    )
  );

  public getBurdeningTypes$ = createEffect(() =>
    this.actions$.pipe(
      ofType(InputActions.getFormOptions),
      mergeMap(async () =>
        InputActions.setBurdeningTypeOptions({ burdeningTypes: BURDING_TYPES })
      ),
      catchError(() => of(InputActions.getBurdeningTypesFailure()))
    )
  );

  public getMaterials$ = createEffect(() =>
    this.actions$.pipe(
      ofType(InputActions.getFormOptions),
      mergeMap(async () =>
        InputActions.setMaterialOptions({ materials: MATERIAL_TYPES })
      ),
      catchError(() => of(InputActions.getMaterialsFailure()))
    )
  );
}
