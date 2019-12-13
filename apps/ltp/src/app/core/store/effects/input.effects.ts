import { EMPTY } from 'rxjs';
import { catchError, map, mergeMap } from 'rxjs/operators';

import { Injectable } from '@angular/core';

import { Actions, createEffect, ofType } from '@ngrx/effects';

import { RestService } from '../../services/rest.service';

import * as InputActions from '../actions/input.actions';

@Injectable()
export class InputEffects {
  constructor(
    private readonly actions$: Actions,
    private readonly restService: RestService
  ) {}

  public getPredictions$ = createEffect(() =>
    this.actions$.pipe(
      ofType(InputActions.getFormOptions),
      mergeMap(() =>
        this.restService.getPredictions().pipe(
          map(predictions =>
            InputActions.setPredictionOptions({ predictions })
          ),
          catchError(() => EMPTY)
        )
      )
    )
  );

  public getBurdeningTypes$ = createEffect(() =>
    this.actions$.pipe(
      ofType(InputActions.getFormOptions),
      mergeMap(() =>
        this.restService.getBurdeningTypes().pipe(
          map(burdeningTypes =>
            InputActions.setBurdeningTypeOptions({ burdeningTypes })
          ),
          catchError(() => EMPTY)
        )
      )
    )
  );

  public getMaterials$ = createEffect(() =>
    this.actions$.pipe(
      ofType(InputActions.getFormOptions),
      mergeMap(() =>
        this.restService.getMaterials().pipe(
          map(materials => InputActions.setMaterialOptions({ materials })),
          catchError(() => EMPTY)
        )
      )
    )
  );
}
