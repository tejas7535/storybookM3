import { Injectable } from '@angular/core';

import { mergeMap } from 'rxjs/operators';

import { Actions, createEffect, ofType } from '@ngrx/effects';

import {
  BURDENING_TYPES,
  MATERIAL_TYPES,
  PREDICTION_TYPES,
} from '../../constants';
import * as InputActions from '../actions/input.actions';

@Injectable()
export class InputEffects {
  constructor(private readonly actions$: Actions) {}

  public getPredictions$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(InputActions.getFormOptions),
      mergeMap(async () =>
        InputActions.setPredictionOptions({ predictions: PREDICTION_TYPES })
      )
    );
  });

  public getBurdeningTypes$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(InputActions.getFormOptions),
      mergeMap(async () =>
        InputActions.setBurdeningTypeOptions({
          burdeningTypes: BURDENING_TYPES,
        })
      )
    );
  });

  public getMaterials$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(InputActions.getFormOptions),
      mergeMap(async () =>
        InputActions.setMaterialOptions({ materials: MATERIAL_TYPES })
      )
    );
  });
}
